<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Studentsprofile extends CI_Controller {
	
	/* class constructor
	 * initialization of classes to be loaded are all here(libraries not included in the auto load config)
	*/
	
	public function __construct(){
		parent::__construct();
		setHeader( 'admin/Studentsprofile_model' );
	}
	
	public function saveForm(){
		$data  	= getData( false );
		$onEdit = $data['onEdit'];
		$success = true;
		
		if(
			_checkData(
				array
					(
					'table'		=> 'student'
					,'field'   	=> 'studentNumber'
					,'value'   	=> $data['studentNumber']
					,'exwhere'	=> ( $onEdit ) ? 'studentID !=' . $data['studentID'] : null
				)
			)
		)
		{
			die(
				json_encode(
					array(
							'success' => true 
							,'match' => 1 
					)
				)
			);
		}
		
		if( !$onEdit && $this->model->checkIfNameExist( $data ) === true ){
			die(
				json_encode(
					array
						(
							'success' => true 
							,'match' => 2
					)
				)
			);
		}
		
		// check Grade Level History
		$data[ 'grdLevel' ] = ( $onEdit && $this->model->checkGradeLevelUpdate( $data ) ) ? true : false;
		
		// check Payment History
		// $data[ 'pymntHistory' ] = ( $onEdit && $this->model->checkPaymentHistoryUpdate( $data ) ) ? true : false;
		
		
		$this->db->trans_begin();
		$this->model->saveForm( $data );
			
		
		if( $this->db->trans_status() === FALSE ){
			$this->db->trans_rollback();
			$success = false;
		}
		else{
			$this->db->trans_commit();
		}
			die( json_encode( array( 'success' => $success ) ) );
			
	}
	
	public function deleteData(){
		$data	=	getData();
		$success = true;
		// $this->model->delete( $data );
		if(
			_checkData(
				array
					(
					'table'		=> 'student'
					,'field'   	=> 'studentID'
					,'value'   	=> $data['studentID']
				)
			)
		)
		{
			$this->db->trans_begin();
			if( $this->model->delete( $data ) ){
			
				
				if( $this->db->trans_status() === FALSE ){
					$this->db->trans_rollback();
					$success = false;
				}
				else{
					$this->db->trans_commit();
					die( json_encode( array( 'success' => $success ) ) );
				}
				
					die( json_encode( array( 'success' => $success ) ) );
			}
			else{
				die( json_encode( array( 'success' => $success ,'match' => 1 ) ) );
			}
		
		}else{
			die( json_encode( array( 'success' => $success ,'match' => 1 ) ) );
		}
	}
	
	public function getYearLevels(){
	
		$view = $this->model->getYearLevels();
		die( json_encode( array ( 'success' => true, 'view' => $view, 'trigger' => 0 ) ) );
	}
	
	public function getSchoolYears(){
		$view = $this->model->getSchoolYears();
		die( json_encode( array( 'success'	=>	true,	'view'	=>	$view ) ) );
	}
	
	public function getHistory(){
		$data = getData();
		$view = $this->model->getHistory( $data );
		$count = $this->model->countAll( $data ); 
		$countAll = count( $count ); 
		die( json_encode( array( 'success' => true, 'total' => $countAll, 'view' => $view ) ) );
	}
	
	public function retrieveData(){
		$data 	= getData();
		$view = $this->model->retrieveData( $data );
		
		die( json_encode(
				array (
					'success' 			 => true
					,'view' 			 => $view
					,'match'			 => 0
				)
			) 
		);
	}
	
	public function retrieveDataGradeLevel(){
		$data 	= getData();
		// print_r( $data['studentID'] );
		$view = $this->model->retrieveDataGradeLevel( $data );
		
		die( json_encode(
				array (
					'success' 			 => true
					,'view' 			 => $view
					,'match'			 => 0
				)
			) 
		);
	}
	
	public function getFilter(){
		$data =	getData();
		$view=null;
		// print_r( $data );
			switch( $data['filterBy'] ){
				case 1:
						$view = $this->model->filterFullName("a.studentLastName");
					break;
				case 2:
						$view = $this->model->filterFullName("a.studentFirstName");
					break;
				case 3:
						$view = $this->model->filterFullName("a.studentMiddleName");
					break;
				case 4:
						$view = $this->model->filterGradeLevel();
					break;
				case 5:
						$view = $this->model->filterSchoolYears();
					break;
				case 6:
						// $view = $this->model->filterPaymentStatus();
						$view = array(
									array(
										'id'	=>	0
										,'name'	=>	'All'
									)
									,array(
										'id'	=>	1
										,'name'	=>	'Not Paid'
									)
									,array(
										'id'	=>	2
										,'name'	=>	'Paid'
									)
								);
					break;
				case 7:
						$view = array(
									array(
										'id'	=>	0
										,'name'	=>	'All'
									)
									,array(
										'id'	=>	2
										,'name'	=>	'Inactive'
									)
									,array(
										'id'	=>	1
										,'name'	=>	'Active'
									)
								);
					break;
				case 8:
						$view = $this->model->getStudentNumber();
					break;
			}
			
			if( $this->db->affected_rows() > 0 || $data['filterBy'] == 6  || $data['filterBy'] == 7 )
			{
				array_unshift($view, array( 'id' => 0, 'name' => 'All') );
				die( json_encode( array( 'success' => true, 'view' => $view , 'match' => 0, 'trigger' => 0 ) ) );
			}
			else{
				die( json_encode( array( 'success' => true, 'match' => 1 ) ) );
			}
			
	}
	
}