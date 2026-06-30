<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Batchreceivables extends CI_Controller {
	
	public function __construct(){
		parent::__construct();
		setHeader( 'payment/Batchreceivables_model' );
	}
	
	public function getReferenceNo(){
		$batchReceivableNo = $this->model->getReferenceNo();
		die(
			json_encode(
				array(
					'success' => true
					,'batchReceivableNo' => $batchReceivableNo
				)
			)
		);
	}
	
	public function getSchoolYear(){
		$params = getData();
		
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $this->model->getSchoolYear( $params )
				)
			)
		);
	}
	
	public function getGradeLevel(){
		$data = $this->model->getGradeLevel( getData() );
		array_unshift( $data , array(
			'gradeLevelID' => 0
			,'gradeLevelName' => 'All'
		) );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $data
				)
			)
		);
	}
	
	public function getStudents(){
		$params = getData();
		$data = $this->model->getStudents( $params );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $data
					,'total' => count( $data )
				)
			)
		);
	}
	
	public function getBRSTudents(){
		$params = getData();
		$data = $this->model->getBRSTudents( $params );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $data
					,'total' => count( $data )
				)
			)
		);
	}
	
	public function getHistory(){
		$params = getData();
		$params['cnt'] = false;
		$view = $this->model->getHistory( $params );
		$params['cnt'] = true;
		$countAll = $this->model->getHistory( $params );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					,'total' => $countAll
				)
			)
		);
	}
	
	public function getSearchStore(){
		$params = getData();
		$view = [];
		if( (int)$params['sBy'] == 1 ){
			$view = array(
				0 => array(
					'id' => '1'
					,'name' => 'Catering'
				)
				,1 => array(
					'id' => '2'
					,'name' => 'Charity'
				)
				,2 => array(
					'id' => '3'
					,'name' => 'Extra-Curricular'
				)
				,3 => array(
					'id' => '4'
					,'name' => 'Christmas'
				)
				,4 => array(
					'id' => '5'
					,'name' => 'Family Day'
				)
				,5 => array(
					'id' => '6'
					,'name' => 'Picture'
				)
				,6 => array(
					'id' => '7'
					,'name' => 'Grad Fee'
				)
				,7 => array(
					'id' => '8'
					,'name' => 'Scouting/Camping'
				)
				,8 => array(
					'id' => '9'
					,'name' => 'Others'
				)
			);
		}
		elseif( (int)$params['sBy'] == 4 ){
			$view = $this->model->getStudentsFilter( $params );
		}
		else{
			$view = $this->model->getSchoolYear( $params, 2 );
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
				)
			)
		);
	}
	
	public function saveForm(){
		$params = getData();
		$receivables = json_decode( $params['receivables'], true );
		$onEdit = (int)$params['onEdit'];
		$errRecords = array();
		
		if( $onEdit ){
			if( $this->model->getModified( $params ) && !$params['modify'] ){ /* check if record is modified by other user */
				die(
					json_encode(
						array(
							'success' => true
							,'match' => 2
						)
					)
				);
			}
			
			/* retrieve records in the database for checking receivables and payments */
			$databaseRecords = $this->model->getBRSTudents( $params );
			// LQ();
			// var_dump( $databaseRecords );
			foreach( $databaseRecords as $rs ){
				if( array_search( $rs['studentID'], array_column( $receivables, 'studentID' ) ) === false ){
					if( $rs['totalPayment'] > $rs['totalReceivables'] ){
						$errRecords[] = $rs['studentName'];
					}
				}
				else{
					if( $rs['totalPayment'] > ( $rs['totalReceivables'] + $params['batchReceivableAmount'] ) ){
						$errRecords[] = $rs['studentName'];
					}
				}
			}
		}
		
		if( count( $errRecords ) > 0 ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 3
						,'studentName' => join(' and ', array_filter(array_merge(array(join(', ', array_slice($errRecords, 0, -1))), array_slice($errRecords, -1)), 'strlen'))
					)
				)
			);
		}
		
		$this->db->trans_begin();
		
		/* first save batch receivable header information */
		$batchReceivableID = $this->model->saveBatchReceivable( $params );
		
		/* first delete all receivable record of this header record */
		$this->model->deleteReceivable( $batchReceivableID );
		
		/* save to db the records from the latest  */
		for( $i = 0; $i < count( $receivables ); $i++ ){
			$receivables[$i]['batchReceivableID'] = $batchReceivableID;
		}
		$this->model->saveBatchReceivableDetails( $receivables );
		
		if( $this->db->trans_status() === FALSE ){
			$this->db->trans_rollback();
			die(
				json_encode(
					array(
						'success' => false
					)
				)
			);
		}
		else{
			_setLogs(
				array(
					'modeLevel' => 13
					,'modeLevel1' => ( $params[ 'onEdit' ]? 13.2 : 13.1 )
					,'idmodule' => 13
					,'bmapsUID' => $this->session->userdata('BMAPSUID')
					,'data' => $params
				)
			);
			
			$this->db->trans_commit();
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 0
					)
				)
			);
		}
	}
	
	public function retrieveData(){
		$params = getData();
		$data = $this->model->retrieveData( $params );
		if( !$data ){
			$match = 1;
		}
		else{
			$match = 0;
		}
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $data
					,'match' => $match
				)
			)
		);
	}
	
	public function deleteRecord(){
		$params = getData();
		$errRecords = [];
		
		/* first check record to delete */
		if( !$this->model->checkIfExists( $params ) ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 1
						,'studentName' => ''
					)
				)
			);
		}
	
		/* retrieve records in the database for checking receivables and payments */
		$databaseRecords = $this->model->getBRSTudents( $params );
		foreach( $databaseRecords as $rs ){			
			if( $rs['totalPayment'] > $rs['totalReceivables'] ){
				$errRecords[] = $rs['studentName'];
			}
		}
		
		if( count( $errRecords ) > 0 ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 2
						,'studentName' => join(' and ', array_filter(array_merge(array(join(', ', array_slice($errRecords, 0, -1))), array_slice($errRecords, -1)), 'strlen'))
					)
				)
			);
		}
		
		/* process deleting of records */
		$this->db->trans_begin();
		/* delete records in receivables table */
		$this->model->deleteReceivable( (int)$params['batchReceivableID'] );
		/* delete records in header(batchreceivables table) */
		$this->model->deleteRecord( $params );
		
		if( $this->db->trans_status() === FALSE ){
			$this->db->trans_rollback();
			die(
				json_encode(
					array(
						'success' => false
					)
				)
			);
		}
		else{
			_setLogs(
				array(
					'modeLevel' => 13
					,'modeLevel1' => 13.3
					,'idmodule' => 13
					,'bmapsUID' => $this->session->userdata('BMAPSUID')
					,'data' => $params
				)
			);
			
			$this->db->trans_commit();
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 0
					)
				)
			);
		}
	}

	public function fixBalances(){
		/* get Catering records */
		$cateringRecords = $this->model->getAccountCardRecords( 1 );
		$this->processRecords( $cateringRecords, 1 );
		/* end of catering records */
		/* get charity records */
		$charityRecords = $this->model->getAccountCardRecords( 2 );
		$this->processRecords( $charityRecords, 2 );
		/* end of charity records */
		/* get extra-curricular records */
		$extracurricularRecords = $this->model->getAccountCardRecords( 3 );
		$this->processRecords( $extracurricularRecords, 3 );
		/* end of extra-curricular records */
		/* get christmas records */
		$christmasRecords = $this->model->getAccountCardRecords( 4 );
		$this->processRecords( $christmasRecords, 4 );
		/* end of christmas records */
		/* get family day records */
		$familyDayRecords = $this->model->getAccountCardRecords( 5 );
		$this->processRecords( $familyDayRecords, 5 );
		/* end of family day records */
		/* get picture records */
		$pictureRecords = $this->model->getAccountCardRecords( 6 );
		$this->processRecords( $pictureRecords, 6 );
		/* end of pciture records */
		/* get grad fee records */
		$gradFeeRecords = $this->model->getAccountCardRecords( 7 );
		$this->processRecords( $gradFeeRecords, 7 );
		/* end of grad fee records */
		/* get scouting records */
		$scoutingRecords = $this->model->getAccountCardRecords( 8 );
		$this->processRecords( $scoutingRecords, 8 );
		/* end of scouting records */
		/* get others records */
		$otherRecords = $this->model->getAccountCardRecords( 9 );
		$this->processRecords( $otherRecords, 9 );
		/* end of other records */
		/* get nutrition records */
		$nutritionRecords = $this->model->getAccountCardRecords( 10 );
		$this->processRecords( $nutritionRecords, 10 );
		/* end of nutrition records */
		/* get movingUp Records */
		$movingUpRecords = $this->model->getAccountCardRecords( 11 );
		$this->processRecords( $movingUpRecords, 11 );
		/* end of movingUpRecords */
		die(
			json_encode(
				array(
					'success' => true
				)
			)
		);
	}

	private function processRecords( $records, $batchReceivableCategoryID ){
		foreach( $records as $rs ){
			$batchReceivableID = $this->model->addBatchReceivable( array(
				'batchReceivableCategoryID' => $batchReceivableCategoryID
				,'schoolYearID' => $rs['accountCardSchoolYear']
				,'batchReceivableAmount' => $rs['batchReceivableAmount']
				,'batchReceivableDate' => $rs['dateCreated']
				,'batchReceivableRemarks' => 'Record fixing(script)'
				,'batchReceivableAddedBy' => 1
				,'batchReceivableAddedOn' => date( 'Y-m-d' )
				,'batchReceivableModifiedBy' => 1
				,'batchReceivableModifiedOn' => date( 'Y-m-d' )
			) );
			$receivables = [];
			$studentIDs = explode( ',', $rs['studentID'] );
			foreach( $studentIDs as $key=>$value ){
				$receivables[] = array(
					'studentID' => $value
					,'receivableAmount' => $rs['batchReceivableAmount']
					,'batchReceivableID' => $batchReceivableID
				);
			}
			$this->model->saveReceivableStudentsList( $receivables );
		}
	}
}