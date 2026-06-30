<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Activityguide extends CI_Controller {
	/*
		developer: Roj Zim Jamil A. Janubas (Bogitics)
		date: Ferbruary 2016
		modified: May 26, 2017
	*/
	public function __construct(){
		parent::__construct();
		setHeader( 'teacher/Activityguide_model' );
	}
	
	public function wideUpdate(){
		$highestActivities = $this->model->getHighestActivities();
		/* return classsID */
		foreach ($highestActivities as $key ) {
			$allActivities = $this->model->allActivities( array( 'classID' => $key[ 'classID' ] ) );
			$classArr = $this->model->getAllSameClass( array( 'classID' => $key[ 'classID' ] ));
			foreach ($allActivities as $activityKey ) {
				// print_r( $allActivities );
				foreach ( $classArr as $key ) {
					/* check if activity code already not exist in the class */
						
					if( !_checkData( array(
							'table' => 'activity'
							,'field' => 'activityCode'
							,'value' => $activityKey[ 'activityCode' ]
							,'exwhere' => "teacherID = ".$key[ 'bgsUID' ].""
						) ) ){
						unset( $activityKey[ 'activityID' ] );
						$activityKey[ 'classID' ] = $key[ 'classID' ];
						$activityKey[ 'teacherID' ] = $key[ 'bgsUID' ];
						$activityKey[ 'onEdit' ] = 0;
							// print_r( $activityKey );
							// die();
						$this->model->saveForm( $activityKey );
					}
				}
			}
		}
	}

	public function saveForm(){
		// $this->wideUpdate();
		$data  	= getData();
		$success = true;
		$data['teacherID'] = $this->session->userdata('BGSUID');
		$onEdit = $data['onEdit'];

		/** Check if activity is closed or exist **/
		
		if(
			_checkData(
				array
					(
					'table'		=> 'schoolyear'
					,'field'   	=> 'schoolYearID'
					,'value'   	=> $data['schoolYear']
					,'exwhere'	=> 'closedBy > 0'
				)
			)
		)
		{
			die(
				json_encode(
					array(
							'success' => true 
							,'match' => 11
					)
				)
			);
		}

		if( $this->model->_checkIfActivityHasGrade( $data ) && $onEdit ){
			die(
				json_encode(
					array
						(
							'success' => true 
							,'match' => 1
					)
				)
			);
		}
		
		if( $this->model->checkInputIfValid( 
				array(  
					"classID" => $data[ 'classID' ]
					,"subjectID" => $data[ 'subjectID' ]
					,"gradingSheetQuarter" => $data[ 'activityQuarter' ]
					,"gradingSheetStatus" => 2
				) 
			) 
		)
		{
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
		// check activity code already exist in the school year
	 	if( $this->model->checkIfActivityForSchoolYear( $data ) && $onEdit == false ){
	 		die(
				json_encode(
					array(
						'success' => true
						,'match' => 5
						)
					)
				);	
	 	}
	 	
		$this->db->trans_begin();
	 	// check if subject activity has been transferred to another subject
	 	if( $onEdit && !$this->model->checkIfActTrans($data)){
	 		if( isset($data['modify']) && !$data['modify'] ){
	 			die(
		 			json_encode(
		 				array(
		 					'success' => true
		 					,'match' => 6
		 					)
		 				)
		 			);
	 		}
	 		$sheetDetails = $this->model->getGradingSheetDetails( $data );
	 		foreach ($sheetDetails as $key) {
	 			$this->model->deleteGradingSheetActivity($key);
	 			$this->model->deleteLearnerScore($key);
	 		}
	 	}
		
		$classArr = $this->model->getAllSameClass( array( 'classID' => $data[ 'classID' ] ));
		foreach ( $classArr as $key ) {
			$data[ 'classID' ] = $key[ 'classID' ];
			$data[ 'teacherID' ] = $key[ 'bgsUID' ];
			$this->model->saveForm( $data );
		}
		if( $this->db->trans_status() === FALSE ){
			$this->db->trans_rollback();
			$success = false;
		}
		else{
			$this->db->trans_commit();
		}
			die( json_encode( array( 'success' => $success ) ) );
			
	}
	
	public function deleteActivity(){
		$data	=	getData();
		$success = true;
		// $this->model->deleteActivity( $data );
		// if( $this->db->affected_rows() > 0 )
		// {
		// 	die( json_encode(
		// 		array( 
		// 			'success' => true
		// 			) 
		// 		) 
		// 	);	
		// }
		if( $this->model->checkIfActivityIsUsed( array( 'activityID' => $data[ 'activityID' ] ) ) ){
			die( json_encode(
				array( 
					'success' => true
					,'match'  => 1	
					) 
				) 
			);
		}
		else
		{
		$this->db->trans_begin();
			$this->model->deleteActivity( $data );
			if( $this->db->trans_status() === FALSE ){
				$this->db->trans_rollback();
				$success = false;
			}
			else{
				$this->db->trans_commit();
			}
				die( json_encode( array( 'success' => $success ) ) );
		}
	}
	
	public function getYearLevels(){
	
		$view = $this->model->getYearLevels();
		die( json_encode( array ( 'success' => true, 'view' => $view, 'trigger' => 0 ) ) );
	}
	
	public function retrieveDataSubjects(){
		$view = $this->model->retrieveDataSubjects();
		die( json_encode( array( 'success'	=>	true,	'view'	=>	$view, 'trigger' => 0 ) ) );
	}
	
	public function getSchoolYears(){
		$view = $this->model->getSchoolYears( getData() );
		die( json_encode( array( 'success'	=>	true,	'view'	=>	$view ) ) );
	}
	
	public function getActivityType(){
		$view = $this->model->getActivityType();
		die( json_encode( array( 'success'	=>	true,	'view'	=>	$view ) ) );
	}
	
	public function getHistory(){
		$data = getData();
			
			
		$data['pdf'] = false; $data['cnt'] = false;
		$view = $this->model->getHistory( $data );
		$data['pdf'] = true; $data['cnt'] = true;
		$countAll = $this->model->getHistory( $data );
		
			// $count = $this->model->countAll();
			die( json_encode( array( 'success' => true, 'total' => $countAll ,'view' => $view ) ) );
	}
	
	public function retrieveActivityData(){

		$data	=	getData();

		$view	=	$this->model->retrieveActivityData( $data );
		die( json_encode(
				array (
					'success' 			 => true
					,'view' 			 => $view
				)
			) 
		);
	}

	public function retrieveActivityDatas(){

		$data	=	getData();

		/** Check if activity is closed or exist **/
		// if( !$this->model->checkIfExist( $data ) ){
		// 	die(
		// 		json_encode(
		// 			array(
		// 				'success' => true
		// 				,'match' => 5
		// 				)
		// 			)
		// 		);
		// }

		if( $view = $this->model->checkIfClosed( $data ) ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 11
						,'view' => $view
						)
					)
				);
		}
	}
	
	public function getFilter(){
		$data =	getData();
		$view=null;
		// print_r( $data );
			switch( $data['filterBy'] ){
				case 1:
						$view = $this->model->filterSchoolYears();
					break;
				case 2:
						$view = $this->model->filterGradeLevel();
					break;
				case 3:
						$view = $this->model->filterSubjects();
					break;
				case 4:
						$view = $this->model->filterActivities();
					break;
				case 5:
						$view = $this->model->filterActivityType();
					break;
				case 6:
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
			}
			
			if( $this->db->affected_rows() > 0 || $data['filterBy'] == 6 )
			{
				array_unshift($view, array( 'id' => 0, 'name' => 'All') );
				die( json_encode( array( 'success' => true, 'view' => $view, 'match' => 0, 'trigger' => 0 ) ) );
			}
			
	}
	
	public function retrieveData(){
		$data 	= getData();
		$view = $this->model->retrieveData( $data );
		if( $this->db->affected_rows() > 0 )
			die( json_encode(
					array (
						'success' 			 => true
						,'view' 			 => $view
						,'match'			 => 0
					)
				) 
			);
		else
			die( json_encode(
					array (
						'success' 			 => true
						,'view' 			 => $view
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
	
}