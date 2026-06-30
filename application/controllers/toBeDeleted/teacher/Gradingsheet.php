<?php
/** Grading Sheet module
  * [Developer]
  * Developer: Jayson Dagulo
  * Date Created: Feb. 24, 2016
  * Date Finished: 
  
  * [Database]
	
	
  * [Description]
	This module is by the teachers to record student’s grades on written works, quizzes, exams or other activities, per subject within a school year.
	Each grading sheet is for one subject and one quarter only. This module will also show the Year End Final Grades per student per school year.
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Gradingsheet extends CI_Controller {
	
	/* class constructor
	 * initialization of classes to be loaded are all here(libraries not included in the auto load config)
	*/
	public function __construct(){
		parent::__construct();
		setHeader( 'teacher/Gradingsheet_model' );
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
	
	public function getHistory(){
		$params = getData();
		$params['pdf'] = false; $params['cnt'] = false;
		$all = $this->model->viewall( $params );
		$params['pdf'] = true; $params['cnt'] = true;
		$countAll = $this->model->viewAll( $params );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $all
					,'total' => $countAll
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
	
	public function getActivity(){
		$params = getData();
		$all = array();
		$all = $this->model->getActivity( $params );
		// print_r( $all );
		for( $i = 0; $i < count( $all ); $i++ ){
			$all[$i]['classID'] = $params['classID'];
			$learnerRec = $this->model->getLearnersRec( $all[$i] );
			$cntHasScore = 0;
			foreach( $learnerRec as $rs ){
				if( isset( $rs['studentScore'] ) ){
					$cntHasScore++;
				}
			}
			// print_r( $learnerRec );
			// print_r( count( $learnerRec ) );
			// print_r( $cntHasScore );
			if( $cntHasScore == count( $learnerRec ) ){
				$all[$i]['statusID'] = 1;
			}
			else{
				$all[$i]['statusID'] = 0;
			}
			$all[$i]['learnerRec'] = json_encode( $learnerRec );
		}
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
	
	public function saveGradingSheet(){
		$params = getData();
		$logGradingSheetID = null;
		$onEdit = (int)$params['onEdit'];
		$desc = 'Added new ' . $params['subject'] . ' grading sheet for ' . $params['gradeLevel'] . ', SY ' .$params['clasName'] . '.';
		$success = true;
		$gradingSheetID = 0;
		$params['teacherID'] = $this->bgsUID;
		if( _checkData(
			array(
				'table' => 'gradingsheet'
				,'field' => 'subjectID'
				,'value' => $params['subjectID']
				,'exwhere' => 'gradingSheetQuarter = ' . (int)$params['gradingSheetQuarter'] . ' AND classID = ' . (int)$params['classID'] . ' AND gradingSheetID NOT IN(' . (int)$params['gradingSheetID'] . ') AND teacherID = ' . (int)$params['teacherID']
			)
		) ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 1
					)
				)
			);
		}
		if( $onEdit ){
			/* check if grading sheet still exists */
			$logGradingSheetID = $params[ 'gradingSheetID' ];
			if( !_checkData(
				array(
					'table' => 'gradingsheet'
					,'field' => 'gradingSheetID'
					,'value' => (int)$params['gradingSheetID']
				)
			) ){
				die(
					json_encode(
						array(
							'success' => true
							,'match' => 2
						)
					)
				);
			}
			
			if( $params['modify'] == '0' ){
				$dateModified = $this->standards->getDateModified( $params['gradingSheetID'], 'gradingSheetID', 'gradingsheet' );
				if( isset( $dateModified->dateModified ) ){
					if( $params['dateModified'] != $dateModified->dateModified ){
						die(
							json_encode(
								array(
									'success' => true
									,'match' => 3
								)
							)
						);
					}
				}
			}
			
			switch( $params[ 'gradingSheetStatus' ] ){
				case 1:
					$desc = 'Ongoing ' . $params['subject'] . ' grading sheet for ' . $params['gradeLevel'] . ', SY ' . $params['clasName'] . '.';
					break;
				case 2: 
					$desc = 'Final ' . $params['subject'] . ' grading sheet for ' . $params['gradeLevel'] . ', SY ' . $params['clasName'] . '.';
					break;
				case 3:
					$desc = 'Uploaded ' . $params['subject'] . ' grading sheet for ' . $params['gradeLevel'] . ', SY ' . $params['clasName'] . '.';
					break;
				default:
					$desc = 'Modified ' . $params['subject'] . ' grading sheet for ' . $params['gradeLevel'] . ', SY ' . $params['clasName'] . '.';
					break;
			}
		}
			
		$this->db->trans_begin();
		$gradingSheetID = $this->model->saveForm( $params );
		/* clear first all existing details before we insert the new records */
		$params['excludeMainTable'] = true;
		$this->model->deleteRecord( $params );
		$data1 = json_decode( $params['data1'], true );
		$data2 = json_decode( $params['data2'], true );
		/* process saving for quarterly grades per activity */
		foreach( $data1 as $rs ){
			$learnerRec = json_decode( $rs['learnerRec'], true );
			$gradingSheetActivityID = $this->model->insertGradeActivity(
				array(
					'gradingSheetID' => $gradingSheetID
					,'activityID' => $rs['activityID']
				)
			);
			$learnerScore = array();
			foreach( $learnerRec as $rs1 ){
				/*setLogs(
					array(
						'description' => "Inserted Grading Sheet Activity Name: "
										. $rs1[ 'studentFullName' ] ." Score: "
										. $rs1[ 'studentScore' ] ." Activity ID " . $rs['activityID'] . " "
										. $params['subject'] . ' grading sheet for ' . $params['gradeLevel'] . ', SY ' .$params['clasName'] . '.'
						,'idmodule' => $params['idmodule']
						,'gradingSheetID' => $logGradingSheetID
					)
				); temporarliy added for testing purposes */
				$learnerScore[] = array(
					'studentID' => $rs1['studentID']
					,'score' => $rs1['studentScore']
					,'gradingSheetActivityID' => $gradingSheetActivityID
				);
			}
			$this->model->insertLearnerScore( $learnerScore );
		}
		
		for( $i = 0; $i < count( $data2 ); $i++ ){
			$data2[$i]['gradingSheetID'] = $gradingSheetID;
			/* setLogs(
				array(
					'description' => "Grades Per Learner Stud ID" . $data2[$i]['studentID']
										." Performance ". $data2[$i][ 'performancePS' ] ." ". $data2[$i][ 'performanceWS' ]
										." Written Works ". $data2[$i][ 'writtenWorksPS' ] ." ". $data2[$i][ 'writtenWorksWS' ]
										." Written ". $data2[$i][ 'quizzesPS' ] ." ". $data2[$i][ 'performanceWS' ]
										." Quizzes ". $data2[$i][ 'performancePS' ] ." ". $data2[$i][ 'quizzesWS' ]
										." Quarterly Grade ". $data2[$i][ 'quarterlyGrade' ]
										." ".$params['subject'] . ' grading sheet for ' . $params['gradeLevel'] . ', SY ' .$params['clasName'] . '.'
					,'idmodule' => $params['idmodule']
					,'gradingSheetID' => $logGradingSheetID
				)
			); */
		}
		$this->model->insertPerLearnerGrade( $data2 );
		
		setLogs(
			array(
				'description' => $desc
				,'idmodule' => $params['idmodule']
				,'gradingSheetID' => $logGradingSheetID
			)
		);
		
		if( $this->db->trans_status() === FALSE ){
			$this->db->trans_rollback();
			$success = false;
		}
		else{
			$this->db->trans_commit();
		}
		
		die(
			json_encode(
				array(
					'success' => $success
					,'match' => 0
					,'gradingSheetID' => $gradingSheetID
				)
			)
		);
	}
	
	public function retrieveRecord(){
		$params = getData();
		if( !_checkData(
			array(
				'table' => 'gradingsheet'
				,'field' => 'gradingSheetID'
				,'value' => (int)$params['gradingSheetID']
			)
		) ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 1
					)
				)
			);
		}
		$view = $this->model->retrieveRecord( $params );
		$match = 0;
		if( $view[0]['gradingSheetStatus'] == 2 ){
			$match = 2;
		}
		die(
			json_encode(
				array(
					'success' => true
					,'match' => $match
					,'view' => $view
				)
			)
		);
	}
	
	public function deleteRecord(){
		$params = getData();
		$logGradingSheetID = $params[ 'gradingSheetID' ];
		/* check if record still exists */
		if( !_checkData(
			array(
				'table' => 'gradingsheet'
				,'field' => 'gradingSheetID'
				,'value' => (int)$params['gradingSheetID']
			)
		) ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 1
					)
				)
			);
		}
		
		$getStatus = $this->model->getGradingSheetStatus( $params );
		if( isset( $getStatus->gradingSheetStatus ) ){
			if( $getStatus->gradingSheetStatus == 2 ){
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
		$this->db->trans_begin();
		$this->model->deleteRecord( $params );
		setLogs(
			array(
				'description' => 'Deleted ' . $params['subject'] . ' grading sheet for ' . $params['gradeLevel'] . ', SY ' . $params['schoolYear'] . '.'
				,'idmodule' => $params['idmodule']
				,'gradingSheetID' => $logGradingSheetID
			)
		);
		$success = true;
		if( $this->db->trans_status() === FALSE ){
			$this->db->trans_rollback();
			$success = false;
		}
		else{
			$this->db->trans_commit();
		}
		die(
			json_encode(
				array(
					'success' => $success
					,'match' => 0
				)
			)
		);
	}
	
	public function getFinalGrade(){
		$params = getData();
		
		$all = $this->model->getFinalGrade( $params );
		// LQ();
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

	public function checkIfClosed(  ){
		$data = getData();
		$match = $this->model->checkIfClosed( $data );
		die(
			json_encode(
				array(
					'success' => true
					,'match' => $match
					)
				)
			);
	}
	
}