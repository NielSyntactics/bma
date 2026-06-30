<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Viewgradingsheet extends CI_Controller {
	
	/* class constructor
	 * initialization of classes to be loaded are all here(libraries not included in the auto load config)
	*/
	public function __construct(){
		parent::__construct();
		setHeader( 'student/Viewgradingsheet_model' );
	}
	
	public function getSearchBy(){
		$params = getData();
		$view = array();
		if( $params['sBy'] == 1 ){ /* school year */
			$view = $this->model->getSchoolYear( $params );
		}
		elseif( $params['sBy'] == 2 ){ /* grade level */
			$view = $this->model->getGradeLevel( $params );
		}
		elseif( $params['sBy'] == 3 ){ /* Quarter */
			$view = array(
				0 => array(
					'id' => 1
					,'name' => 'First Quarter'
				)
				,1 => array(
					'id' => 2
					,'name' => 'Second Quarter'
				)
				,2 => array(
					'id' => 3
					,'name' => 'Third Quarter'
				)
				,3 => array(
					'id' => 4
					,'name' => 'Fourth Quarter'
				)
			);
		}
		elseif( $params['sBy'] == 4 ){ /* Subject */
			$view = $this->model->getSubjects( $params );
		}
		elseif( $params['sBy'] == 5 ){ /* Status */
			$view = array(
				0 => array(
					'id' => 1
					,'name' => 'Ongoing'
				)
				,1 => array(
					'id' => 2
					,'name' => 'Final'
				)
			);
		}
		
		array_unshift( $view, array(
			'id' => 0
			,'name' => 'All'
		) );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					,'total' => count( $view )
				)
			)
		);
	}
	
	public function retrieveGradeLevel(){
		$data = getData();
		$view = $this->model->retrieveGradeLevel( $data );
		if( $data[ "classID" ] == 0 )
		{
			array_unshift($view, array( 'code' => 0, 'gradeLevelDescription' => 'All') );
		}
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
				)
			)
		);
	}
	
	public function checkUserPayable(){
		$dataParams = getData();
		$params = array(
			'classID' => $dataParams[ 'classID' ]
			,'gradingSheetQuarter' => $dataParams[ 'gradingSheetQuarter' ]
			,'subjectID' => $dataParams[ 'subjectID' ]
		);
		$gradeSheetStatus = $this->model->checkGradingSheet( $params );
		if( $this->db->affected_rows() > 0 ){
			if( $gradeSheetStatus[ 0 ][ "gradingSheetStatus" ] == 1 ){
				die( 
					json_encode( 
						array( 
							'success' => true, 'match' => 2
						) 
					) 
				);
			}
		}else{
			die( 
				json_encode( 
					array( 
						'success' => true, 'match' => 2
					) 
				) 
			);
		}
		$data = $this->model->checkUserPayable();
		if( $data[0]["paymentStatus"] ){
			setLogs(
				array(
					'description' => 'Viewed grades for '. $dataParams[ 'subjectName' ] .', '. $dataParams[ 'classSchoolYear' ] .'.'
					,'idmodule' => $dataParams['idmodule']
				)
			);
			die( 
				json_encode( 
					array( 
						'success' => true, 'view', $gradeSheetStatus ,'match' => 0 
					) 
				) 
			);
		}
			die( 
				json_encode( 
					array( 
						'success' => true, 'match' => 1
					) 
				) 
			);
	}
	
	public function getHistory(){
		
		die(
			json_encode(
				array(
					'success' => true
				)
			)
		);
	}
	
	public function getPerLearnerDetails(){
		$params = getData();
		$all = $this->model->getPerLearnerDetails( $params );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $all
					,'total' => count( $all )
				)
			)
		);
	}
	
	public function getClassSchoolYear(){
		$params = getData();
		$view = $this->model->getClassSchoolYear( $params );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					,'total' => count( $view )
				)	
			)
		);
	}	
	
	public function getClassSchoolYearAll(){
		$params = getData();
		$view = $this->model->getClassSchoolYear( $params );
		array_unshift($view, array( 'code' => 0, 'name' => 'All' ) );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					,'total' => count( $view )
				)	
			)
		);
	}
	
	public function getSubjects(){
		$params = getData();
		$all = $this->model->getSubjectsList( $params );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $all
					,'total' => count( $all )
				)
			)
		);
	}
	
	public function checkInputValid(){
		$params = getData();
		$match = 0;
		if( $this->model->checkIfInputValid( $params ) > 0 ){
			$match = 1;
		}
		die(
			json_encode(
				array(
					'success' => true
					,'match' => $match
				)
			)
		);
	}
	
	public function getFinalGrade(){
		$dataParams = getData();
		
		// check Student Payables
		$data = $this->model->checkUserPayable();
		
		if( $data[0]["paymentStatus"] == 0 ){
			die( 
				json_encode( 
					array( 
						'success' => true, 'match' => 3
					) 
				) 
			);
		}
		
		// check if Grading Sheet is Complete
		if(
			_checkData(
				array
					(
					'table'		=> 'gradingsheet'
					,'field'   	=> 'classID'
					,'value'   	=> ( $dataParams[ 'classID' ] != 0 )  ? $dataParams[ 'classID' ] : $dataParams[ "gradeLevelDisplaySearch" ]
					,'exwhere'	=> "gradingSheetStatus LIKE '1'"
				)
			)
		){
			die( 
				json_encode(  
					array(
						'success' => true
						,'match' => 2
						
					)
				) 
			);
		}
		
		// if( 
			// $dataParams[ 'classID' ] == 0 
			// && $dataParams[ "gradeLevelDisplaySearch" ] == 0 
			// && $this->model->chckGrdngSheetsIfPending(
				// array(
					// "a.bgsUID" => (int)$this->bgsUID
				// )
			// ) 
		// )
		// {
			// die( 
				// json_encode(  
					// array(
						// 'success' => true
						// ,'match' => 2
						
					// )
				// ) 
			// );
		// }
		
		// if( 
			// $dataParams[ 'classID' ] == 0 
			// && $dataParams[ "gradeLevelDisplaySearch" ] == 0 
			// && $this->model->chckGrdngSheetsIfPending(
				// array(
					// "a.bgsUID" => (int)$this->bgsUID
					// ,"c.gradingSheetStatus" => 1
				// ) ,1
			// ) 
		// )
		// {
			// die( 
				// json_encode(  
					// array(
						// 'success' => true
						// ,'match' => 2
						
					// )
				// ) 
			// );
		// }
		
		
		
		
		$view = $this->model->getFinalGrade();
		// print_r( $view );
		// if( $this->db->affected_rows() > 0 && count( $view ) % 4 == 0){
		if( $this->db->affected_rows() > 0 ){
			$viewGrid = array();
			die( 
				json_encode(  
					array(
						'success' => true
						,'view' => $view
						,'match' => 1
						
					)
				) 
			);
		}else{
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 2
					)
				)
			);
		}
	}
	
	public function getQuarterGrade(){
		$params = getData();
		$view = $this->model->getQuarterGrade( $params );
		// print_r( $view );
		die(
			json_encode(
				array( 
					"success" => true
					,"view" => $view
				)
			)
		);
	}
	
	public function getActivity(){
		$params = getData();
		$all = array();
		$all = $this->model->getActivity( $params );
		// print_r( $params );
		// print_r( $all );
		// die();
		$EStotal = 0;
		$WStotal = 0;
		for( $i = 0; $i < count( $all ); $i++ ){
			// $EStotal = ( float )$all[ $i ][ 'quarterlyExamWS' ];
			// $WStotal = ( float )$all[ $i ][ 'quarterlyExamPS' ];
			switch( $params[ "activityClassification" ] ){
				case 1:
						$EStotal = ( float )$all[ $i ][ "performancePS" ];
						$WStotal = ( float )$all[ $i ][ "performanceWS" ];
					break;
				case 2:
						$EStotal = ( float )$all[ $i ][ "writtenWorksPS" ];
						$WStotal = ( float )$all[ $i ][ "writtenWorksWS" ];
					break;
				case 3:
						$EStotal = ( float )$all[ $i ][ "quizzesPS" ];
						$WStotal = ( float )$all[ $i ][ "quizzesWS" ];
					break;
			}
			$all[ $i ][ 'quarterlyExamWS' ] = null;
			$all[ $i ][ 'quarterlyExamPS' ] = null;
		}
		
		
		
		$all[] = array(
			'activityDate' => ''
			,'activityID' => ''
			,'activityTypeDescription' => ''
			,'activityType' => ''
			,'activityCode' => ''
			,'activityClassification' => ''
			,'activiyNumberOfItems' => ''
			,'score' => ''
			,'quarterlyExamPS' => $EStotal
			,'quarterlyExamWS' => $WStotal
		);
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $all
					,'total' => count( $all )
				)
			)
		);
	}
	
}
