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
}