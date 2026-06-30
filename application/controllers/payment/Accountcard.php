<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Accountcard extends CI_Controller {
	
	/** Account Card _module
		* [Developer]
		* Developer: Roj Zim Jamil Actub Janubas
		* Date Created: May 14, 2018
		* Date Finished: 
		
		* [Database]
			
			
		* [Description]
		* 	This _module is created for students transsactions for payments and their current status per year.
		* [Modification]
		
		**/
	
	public function __construct(){
		parent::__construct();
		setHeader( 'payment/Accountcard_model' );
	}

	public function saveForm(){

		$data = getData();
		
		$success = true;
		
		$onEdit = (int)$data[ 'onEdit' ];

		$modeLevel1 = null;

		$logData = array(
			'studentName' => $data['studentName']
		);

		/**
		 * Check if has do duplicate if not edit
		*/
		if( !$onEdit ){

			if(
				
				_checkData(
				
					array(
						'table' => 'student'
						,'field' => 'studentLRN'
						,'value' => $data['studentLRN']
					)
				
				)
			
			)
			{
				
				die(
				
					json_encode(
					
						array(
						
							'success' => 1
							
							,'match' => 1
							
						)
						
					)
					
				);

			}

			if(
				
				_checkData(
				
					array(

						'table' => 'student'
						
						,'field' => 'studentName'
						
						,'value' => $data['studentName']
			
					)
				
				)
			
			)
			{
				
				die(
				
					json_encode(
					
						array(
						
							'success' => 1
							
							,'match' => 5
							
						)
						
					)
					
				);

			}

			
			if ( !empty($data[ 'studentID' ]) && $data[ 'studentID' ] > 0 )
			{
				
				die( 
				
					json_encode(
					
						array(
						
							'success' => 1
							
							,'match' => 2
							
						)
						
					)
					
				);

			}

			$modeLevel1 = 7.1;

		}
		else
		{
			
			/**
			 * Check if Data valid for edit
			*/

			if ( empty( $data[ 'studentID' ] ) || is_null( $data[ 'studentID' ] ) )
			{
				
				die(
				
					json_encode(
					
						array(
						
							'success' => 1
							
							,'match' => 3
							
						)
						
					)
					
				);

			}

			if(
			
				_checkData(
			
					array(
						
						'table' => 'student'
				
						,'field' => 'studentLRN'
				
						,'value' => $data[ 'studentLRN' ]
				
						,'exwhere' => ' studentID != '. $data[ 'studentID' ] .''
			
					)
					
				)
				
			)
			{
				
				die(
				
					json_encode(
					
						array(
						
							'success' => 1
							
							,'match' => 4
							
						)
						
					)
					
				);

			}

			$modeLevel1 = 7.4;

		}


		// $checkAge = $this->checkStudentAge($data['studentBirthday'], $data['gradeLevelID']);

		// if($checkAge != 4) {

		// 	$msg = '';

		// 	if($checkAge == 1) {
		// 		$msg = "Empty Grade Level Array";
		// 	}

		// 	if($checkAge == 2) {
		// 		$msg = "Student Age is below the minimum Requirement";
		// 	}

		// 	if($checkAge == 3) {
		// 		$msg = "Student Age is below the minimum Requirement";
		// 	}

		// }


		$this->db->trans_begin();

		$studentID = $this->model->saveForm( $data );

		if ( $this->db->trans_status() === FALSE )
		{

			$this->db->trans_rollback();
			
			$success = false;
			
		}
		else
		{

			$this->db->trans_commit();

		}

		_setLogs(

			array(
				'modeLevel' => 7
				,'modeLevel1' => $modeLevel1
				,'idmodule' => 2
				,'bmapsUID' => $this->session->userdata('BMAPSUID')
				,'data' => $logData
			)

		);
		
		die(
		
			json_encode(
			
				array(
					'success' => $success
					,'match' => 0
					,'studentID' => $studentID
					,'yearLevel' => $data['searchSYStore']
				)
				
			)
			
		);
		
	}
	
	public function getGradeLevels(){
		
		$params = getData();
		$view = $this->model->getGradeLevels( $params );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
				)
			)
		);
		
	}

	public function getTransactions(){

		$params = getData();
		
		$view = $this->model->getTransactions( $params );
		
		die(
		
			json_encode(
			
				array(
				
					'success' => true
					
					,'view' => $view
					
				)
				
			)
			
		);

	}

	public function saveRowTrans(){

		$data = getData();
		$fieldsToCheck = [
			'annualRegistration',
			'tuition',
			'books',
			'uniform',
			'catering',
			'extraCurricular',
			'christmas',
			'familyDay',
			'picture',
			'gradFee',
			'scouting',
			'charity',
			'others',
			'nutrition',
			'movingUp',
			'totalReceivable',
		];

		$itsNotZero = false;

		foreach ($fieldsToCheck as $field) {
			if (!empty($data[$field]) && floatval($data[$field]) != 0) {
				$itsNotZero = true;
				break;
			}
		}
		
		$success = true;
		
		$onEdit = 0;

		$modeLevel1 = 7.2;

		
		$logData = array(
			'ORTR' => $data['_ref']
			,'ORTRNumber' => $data['refnum']
			,'studentName' => $data['studentName']
		);

		/**
		 * Check data if for saving or update
		*/
		
		if(
		
			_checkData(
			
				array(
				
					'table' => 'payments'
					
					,'field' => 'paymentID'
					
					,'value' => $data['paymentID']
			
				)
			)
		)
		{
			
			$onEdit = 1;
			
			$modeLevel1 = 7.3;
			
		}

		$this->db->trans_begin();

		$paymentID = $this->model->saveRowTrans( $onEdit, $data );

		if ( $this->db->trans_status() === FALSE )
		{

			$this->db->trans_rollback();
			
			$success = false;
			
		}
		else
		{

			$this->db->trans_commit();

		}

		_setLogs(

			array(
				'modeLevel' => 7
				,'modeLevel1' => $modeLevel1
				,'idmodule' => 2
				,'bmapsUID' => $this->session->userdata('BMAPSUID')
				,'data' => $logData
			)

		);

		$filename = "";


		// if($itsNotZero){
		// 	$student = $this->model->getStudentPayments($data);
		// 	$accountcard = $this->model->getAccountCardById( $student[0]['accountCardID'] );
		// 	$schoolyear = $this->model->getSchoolYearById( $data['schoolYearID']);
		// 	$filename = $this->generateImage($student[0], $data, $accountcard, $schoolyear);
		// }
		
		die(
			json_encode(
				array(
					'success' => $success
					,'match' => 0
					,'paymentID' => $paymentID
					,'fileName' => $filename
				)
				
			)
			
		);
		
	}

	public function getGridStudentTransactions(){
		
		$data = getData();
		
		$success = true;
		
		$accountCardID = null;
		
		/**
		 * Check if student has account card
		 */
		 
		$this->db->trans_begin();
		
		if(
			
			!_checkData(
			
				array(
			
					'table' => 'accountcard'
					
					,'field' => 'studentID'
					
					,'value' => $data[ 'studentID' ]
					
					,'exwhere' => ' accountCardSchoolYear = '. (int)$data['schoolYearID'] .''
				)
			)
		)
		{
			
			$data[ 'onEdit' ] = 0;
			
			$accountCardID = $this->model->saveAccTrans( $data );
		
		}
		
		/* edited by jays April 05, 2019 */
		/* $view = $this->model->getAccStudentReceivables( $data ); */
		$view = $this->model->retrieveData( $data ); /* make use of this function since they both return the same values */
		/* end edit */

		if ( $this->db->trans_status() === FALSE )
		{

			$this->db->trans_rollback();
		
			$success = false;
			
		}
		else
		{

			$this->db->trans_commit();

		}
		
		die(
		
			json_encode(
			
				array(
				
					'success' => $success
					
					,'match' => 0
					
					,'view' => $view
				
				)
			
			)
		
		);

	}

	public function getSchoolYear(){
	
		$params = getData();
		
		$view = $this->model->getSchoolYear( $params );

		die(
		
			json_encode(
			
				array(
				
					'success' => true
					
					,'view' => $view
					
					,'total' => count($view)
				
				)
			
			)
		
		);
	}

	public function getStudentsList(){
		
		$params = getData();
	
		$view = $this->model->getStudentsList( $params );
		
		array_unshift( $view, array( 'id' => 0, 'name' => 'All' ) );
		
		die(
		
			json_encode(
			
				array(
				
					'success' => true
					
					,'view' => $view
				
				)
			
			)
		
		);

	}

	public function getHistory(){

		$params = getData();
	
		$view = $this->model->getHistory( $params );
		
		$params['cnt'] = 0;

		$viewAll = $this->model->getHistory( $params );
		
		die(
		
			json_encode(
			
				array(
				
					'success' => true
					
					,'view' => $view
					
					,'total' => count($viewAll)
				
				)
			
			)
		
		);
	
	}
	
	public function saveAccTrans(){
		
		$data = getData();
	
		$success = true;
		
		$data['onEdit'] = 0;
		
		/**
		 * Check if student transactions exist in the year
		 */

		if (
			
			_checkData(
				
				array(
					
					'table' => 'accountcard'

					,'field' => 'accountCardID'

					,'value' => $data[ 'accountCardID' ]

					,'exwhere' => ' studentID = '. $data[ 'studentID' ] .' AND accountCardSchoolYear = '. $data['accountCardSchoolYear'] .''
				)
			)
		)
		{
			
			$data['onEdit'] = 1;
			
		}
		
		$this->db->trans_begin();
			
		$view = $this->model->saveAccTrans( $data );
		
		if ( $this->db->trans_status() === FALSE )
		{

			$this->db->trans_rollback();
		
			$success = false;
			
		}
		else
		{

			$this->db->trans_commit();

		}
		
		die(
		
			json_encode(
			
				array(
				
					'success' => $success
					
					,'match' => 0
					
					,'view' => $view
				
				)
			
			)
		
		);
	
	}

	public function retrieveData(){
		
		$params = getData();
	
		$success = true;
		
		$this->db->trans_begin();

		$view = $this->model->retrieveData( $params );
		// if( count( $view ) > 0 ){
		// 	$view[0]['accountCardSchoolYear'] = $this->model->getLatestSchoolYear();
		// }

		/** 
		 * Disallow Transactions to be edited by non-admin users
		 *  */

		$this->model->disallowEdit( $params );

		if ( $this->db->trans_status() === FALSE )
		{

			$this->db->trans_rollback();
			
			$success = false;
			
		}
		else
		{

			$this->db->trans_commit();

		}
		
		die(
		
			json_encode(
			
				array(
				
					'success' => $success
					
					,'match' => 0
					
					,'view' => $view
				
				)
			
			)
		
		);

	}
	
	public function getLastReferenceNumber(){
	
		$params = getData();
		
		$view = $this->model->getLastReferenceNumber( $params );
		
		die(
		
			json_encode(
			
				array(
				
					'success' => true
					
					,'refnum' => $view->refnum
				
				)
			
			)
		
		);
	
	}

	public function validateRefernceNumber(){
	
		$params = getData();
		
		$view = $this->model->validateRefernceNumber( $params );
		
		die(
		
			json_encode(
			
				array(
				
					'success' => true
					
					,'match' => count($view)

					,'refnum' => str_pad((int)$params['refnum'],6,"0",STR_PAD_LEFT)
					
					,'oldrefnum' => $this->model->getOldRefNum( $params )
				
				)
			
			)
		
		);
	
	}

	public function getReference(){

		$view = array(
	
			array(
				'refID' => 0
				,'refName' => 'OR'
			)
			,array(
				'refID' => 1
				,'refName' => 'TR'
			)
			,array(
				'refID' => 2
				,'refName' => 'SI'
			)
		
		);

		die(
			
			json_encode(
			
				array(
				
					'success' => true
					
					,'view' => $view
				
				)
			
			)
		
		);

	}

	public function deleteRecord(){
		
		$params = getData();
		
		$success = true;
		
		$logData = array(
			'studentName' => $params['studentName']
		);

		$modeLevel1 = 7.7;
		
		$this->db->trans_begin();

		$this->model->deleteRecord( $params );

		if ( $this->db->trans_status() === FALSE )
		{

			$this->db->trans_rollback();
			
			$success = false;
			
		}
		else
		{

			$this->db->trans_commit();

		}
		
		_setLogs(

			array(
				'modeLevel' => 7
				,'modeLevel1' => $modeLevel1
				,'idmodule' => 2
				,'bmapsUID' => $this->session->userdata('BMAPSUID')
				,'data' => $logData
			)

		);

		die(
		
			json_encode(
			
				array(
				
					'success' => $success
					
					,'match' => 0
					
				)
				
			)
			
		);
		
	}

	public function cancelTrans(){

		$data = getData();

		$success = true;

		$this->db->trans_begin();
		
		$logData = array(

			'studentName' => $data['studentName']

			,'ORTR' => $data['_ref']

			,'ORTRNumber' => $data['refnum']

		);

		$modeLevel1 = 7.5;

		$this->model->cancelTrans( $data );

		if ( $this->db->trans_status() === FALSE )
		{

			$this->db->trans_rollback();
			
			$success = false;
			
		}
		else
		{

			$this->db->trans_commit();

		}
		
		_setLogs(

			array(

				'modeLevel' => 7

				,'modeLevel1' => $modeLevel1

				,'idmodule' => 2

				,'bmapsUID' => $this->session->userdata('BMAPSUID')

				,'data' => $logData

			)

		);

		die(
		
			json_encode(
			
				array(
				
					'success' => $success
					
					,'match' => 0
					
				)
				
			)
			
		);

	}

	public function deleteReceipt(){

		$data = getData();

		$success = true;

		$this->db->trans_begin();

		$this->model->deleteReceipt( $data );

		$modeLevel1 = 7.6;

		$logData = array(

			'ORTR' => $data['_ref']

			,'ORTRNumber' => $data['refnum']

			,'studentName' => $data['studentName']

		);

		if ( $this->db->trans_status() === FALSE )
		{

			$this->db->trans_rollback();
			
			$success = false;
			
		}
		else
		{

			$this->db->trans_commit();

		}

		_setLogs(

			array(

				'modeLevel' => 7

				,'modeLevel1' => $modeLevel1

				,'idmodule' => 2

				,'bmapsUID' => $this->session->userdata('BMAPSUID')

				,'data' => $logData

			)

		);
		
		die(
		
			json_encode(
			
				array(
				
					'success' => $success
					
					,'match' => 0
					
				)
				
			)
			
		);

	}

	public function printPDF(){

		$params = getData();

		$modeLevel1 = 7.8;

		$logData = null;

		$html = '';

		if ( isset($params['printType']) )
		{

			// $view = $this->model->getHistory( $params );
			$view = json_decode( $params['gridHistory'], true );

			$html = '';
			if ( isset( $params['srchBy'] ) && $params['srchBy'] == 3 && $params['studentID'] > 0 ) {
				$html = '<div width="100%" style="text-align:center"><h3>School Year: ' . $params['schoolYear'] . '</h3></div>';
			}


			$html .= '<table width="100%" cellpadding="5" border="1">';

			$html .= '<tr>';
			$html .= '<td style="font-weight: bold"> Grade Level </td>';
			$html .= '<td style="font-weight: bold"> Student Name </td>';
			$html .= '<td style="font-weight: bold"> LRN# </td>';
			$html .= '<td style="font-weight: bold"> Sequence No. </td>';
			$html .= '<td style="font-weight: bold"> Father\'s Name </td>';
			$html .= '<td style="font-weight: bold"> Mother\'s Name </td>';
			$html .= '<td style="font-weight: bold"> Birthday </td>';
			$html .= '<td style="font-weight: bold"> Religion </td>';
			$html .= '<td style="font-weight: bold"> Contact Number </td>';
			$html .= '<td style="font-weight: bold"> Remarks </td>';
			$html .= '<td style="font-weight: bold"> Total Balance </td>';
			$html .= '</tr>';

			foreach( $view AS $key ) {

				$html .= '<tr>';
				$html .= '<td>'. $key[ 'gradeLevelName' ] .'</td>';
				$html .= '<td>'. $key[ 'studentName' ] .'</td>';
				$html .= '<td>'. $key[ 'studentLRN' ] .'</td>';
				$html .= '<td>'. $key[ 'seqNumber' ] .'</td>';
				$html .= '<td>'. $key[ 'studentFathersName' ] .'</td>';
				$html .= '<td>'. $key[ 'studentMothersName' ] .'</td>';
				$html .= '<td style="text-align: right">'. date( 'm/d/Y', strtotime( $key[ 'studentBirthday' ] ) ) .'</td>';
				$html .= '<td>'. $key[ 'studentReligion' ] .'</td>';
				$html .= '<td>'. $key[ 'studentContactNumber' ] .'</td>';
				$html .= '<td>'. $key[ 'studentRemarks' ] .'</td>';
				$html .= '<td style="text-align: right">'. $key[ 'totalBalance' ] .'</td>';
				$html .= '</tr>';

			}

			$html .= '</table>';

		}
		else
		{
			
			$logData = array(

				'studentName' => $params['studentName']

				,'schoolYear' => $params['accountCardSchoolYearDisp']

			);

			$studDetails = $this->model->retrieveData( $params );

			$schoolYearDetails = $this->model->getSchoolYear( $params );

			$studentTransactions = $this->model->getAccStudentReceivables( 
				array(

				'schoolYearID' => $params['accountCardSchoolYear'],

				'studentID' => $params['studentID']

				) 
			);

			$gradeLevel = $this->model->getGradeLevels( $studDetails[0] );

			$recTransactions = $this->model->getTransactions(  
				array(
				
					'schoolYearID' => $params['accountCardSchoolYear'],
				
					'studentID' => $params['studentID']

				) 
			);
		
			$html = '<table width="100%" cellpadding="5">';

			$html .= '<tr>';
			$html .= '<td>Student Name: '. $studDetails[0][ 'studentName' ] .'</td>';
			$html .= '<td>Birhtday: '. date('m/d/Y',strtotime($studDetails[0][ 'studentBirthday' ])) .'</td>';
			$html .= '<td>Status: '. $studDetails[0][ '__status' ] .'</td>';
			$html .= '</tr>';

			$html .= '<tr>';
			$html .= '<td>LRN#: '. $studDetails[0][ 'studentLRN' ] .'</td>';
			$html .= '<td>Contact Number: '. $studDetails[0][ 'studentContactNumber' ] .'</td>';
			$html .= '<td>Remarks: '. $studDetails[0][ 'studentRemarks' ] .'</td>';
			$html .= '</tr>';

			$html .= '<tr>';
			$html .= '<td>Address: '.$studDetails[0][ 'studentAddress' ] .'</td>';
			$html .= '<td>Mother\'s Name: '. $studDetails[0][ 'studentMothersName' ] .'</td>';
			$html .= '<td>Religion: '.$studDetails[0][ 'studentReligion' ] .'</td>';
			$html .= '</tr>';

			$html .= '<tr>';
			$html .= '<td>Grade Level: '. $gradeLevel[0][ 'gradeLevelName' ] .'</td>';
			$html .= '<td>Father\'s Name: '. $studDetails[0][ 'studentFathersName' ] .'</td>';
			$html .= '<td>Allergies: '. $studDetails[0][ 'studentAllergies' ] .'</td>';
			$html .= '</tr>';

			$html .= '</table>';

			$html .= '<table width="100%">';
			$html .= '<tr>';
			$html .= '<td></td>';
			$html .= '</tr>';
			$html .= '</table>';

			$html .= '<table width="100%" cellpadding="5">';
			$html .= '<tr>';
			$html .= 	'<th>School Year: </th>';
			$html .= 	'<th>'. $schoolYearDetails[0][ 'schoolYearStart' ].'</th>';
			$html .= 	'<th>Total Receivables</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'annualRegistrationTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'tuitionTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'booksTotalReceivable' ] ,2).'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'uniformTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'cateringTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'extracurricularTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'christmasTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'familyDayTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'pictureTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'gradFeeTotalReceivable' ] ,2).'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'scoutingTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'charityTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'nutritionTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'movingUpTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'othersTotalReceivable' ],2) .'</th>';
			$html .= 	'<th style="text-align: right; padding: 2px">'. number_format($studentTransactions[0][ 'accTotalReceivable' ],2) .'</th>';
			$html .= 	'<th></th>';
			$html .= '</tr>';
			$html .= '</table>';

			$html .= '<table width="100%" border="1" cellpadding="5">';
			
			$html .= '<tr>';
			$html .= 	'<th> Payment Date </th>';
			$html .= 	'<th> Reference </th>';
			$html .= 	'<th> Particulars </th>';
			$html .= 	'<th> Annual Registration </th>';
			$html .= 	'<th> Tuition </th>';
			$html .= 	'<th> Books </th>';
			$html .= 	'<th> Uniform</th>';
			$html .= 	'<th> Catering </th>';
			$html .= 	'<th> Skooltech </th>';
			$html .= 	'<th> Christmas </th>';
			$html .= 	'<th> Family Day </th>';
			$html .= 	'<th> Picture </th>';
			$html .= 	'<th> Grad Fee </th>';
			$html .= 	'<th> Scouting/ Camping </th>';
			$html .= 	'<th> Charity </th>';
			$html .= 	'<th> Nutrition Day </th>';
			$html .= 	'<th> Moving Up/Recognition </th>';
			$html .= 	'<th> Others </th>';
			$html .= 	'<th> Total </th>';
			$html .= 	'<th> Remarks </th>';
			$html .= '</tr>';

			foreach( $recTransactions AS $dataKeys )
			{
				$html .= '<tr>';
				$html .= 	'<td>'. date('m/d/Y',strtotime($dataKeys['paymentDate'])) .'</td>';
				$html .= 	'<td>'. $dataKeys['_ref'].'-'. $dataKeys['refnum'] .'</td>';
				$html .= 	'<td>'. $dataKeys['particulars'] .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['annualRegistration'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['tuition'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['books'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['uniform'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['catering'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['extraCurricular'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['christmas'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['familyDay'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['picture'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['gradFee'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['scouting'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['charity'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['nutrition'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['movingUp'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['others'],2) .'</td>';
				$html .= 	'<td style="text-align: right; padding: 2px">'. number_format($dataKeys['totalReceivable'],2) .'</td>';
				$html .= 	'<td>'. $dataKeys['remarks'] .'</td>';
				$html .= '</tr>';
			}

			$html .= '</table>';

			$html .= '<table width="100%" cellpadding="5">';
			
			$html .= '<tr>';
			$html .= 	'<td></td>';
			$html .= 	'<td></td>';
			$html .= 	'<td style="font-weight: bold">Balances</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'annualRegistrationTotalReceivable' ] - array_sum(array_column($recTransactions, 'annualRegistration')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'tuitionTotalReceivable' ] - array_sum(array_column($recTransactions, 'tuition')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'booksTotalReceivable' ] - array_sum(array_column($recTransactions, 'books')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'uniformTotalReceivable' ] - array_sum(array_column($recTransactions, 'uniform')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'cateringTotalReceivable' ] - array_sum(array_column($recTransactions, 'catering')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'extracurricularTotalReceivable' ] - array_sum(array_column($recTransactions, 'extraCurricular')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'christmasTotalReceivable' ] - array_sum(array_column($recTransactions, 'christmas')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'familyDayTotalReceivable' ] - array_sum(array_column($recTransactions, 'familyDay')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'pictureTotalReceivable' ] - array_sum(array_column($recTransactions, 'picture')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'gradFeeTotalReceivable' ] - array_sum(array_column($recTransactions, 'gradFee')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'scoutingTotalReceivable' ] - array_sum(array_column($recTransactions, 'scouting')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'charityTotalReceivable' ] - array_sum(array_column($recTransactions, 'charity')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'nutritionTotalReceivable' ] - array_sum(array_column($recTransactions, 'nutrition')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'movingUpTotalReceivable' ] - array_sum(array_column($recTransactions, 'movingUp')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'othersTotalReceivable' ] - array_sum(array_column($recTransactions, 'others')) ),2) .'</td>';
			$html .= 	'<td style="text-align: right; padding: 2px; font-weight: bold">'. number_format(( $studentTransactions[0][ 'accTotalReceivable' ] - array_sum(array_column($recTransactions, 'totalReceivable')) ),2) .'</td>';
			$html .= 	'<td></td>';
			$html .= '</tr>';

			$html .= '</table>';

		}

		_setLogs(

			array(

				'modeLevel' => 7

				,'modeLevel1' => $modeLevel1

				,'idmodule' => 2

				,'bmapsUID' => $this->session->userdata('BMAPSUID')

				,'data' => $logData
				
			)

		);

		$params1 = array(
			'title' => $params['title']
			,'file_name' => $params['title']
			,'folder_name' => 'pdf/accountcard/'
			,'addPage' => false
			,'table_hidden' => true
			,'grid_font_size' => 6
			,'orientation' => 'L'
		);
		
		generate_table( $params1, array(), array(), $html );

	}
	
	public function checkIfAllowEdit(  ){
		
		$params = getData();
		
		if( _checkData(
			array(
				'table' => 'bmapsu'
				,'field' => 'bmapsUID'
				,'value' => $this->session->userdata( 'BMAPSUID' )
				,'exwhere' => ' bmapsUtype NOT IN(2,3)'
			)
		) )
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
			
		die(
			json_encode(
				array(
					'success' => true
					,'match' => 0
				)
			)
		);
			
		
	}

	public function checkIfAdmin(){

		$user_type = (int)$this->session->userdata( 'USERTYPE' );
		$match = 0;

		if( $user_type == 1 || $user_type == 0 )
		{
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

	public function checkStudentAge(  ) {

		$data = getData();

		$currentDate = date("Y-m-d");
		$diff = date_diff(date_create($data['birthDate']), date_create($currentDate));
		$getAgeGroup = $this->model->getAgeGroup( $data['gradeID'] );

		$msg = '';
		$match = 0;

		if (empty($getAgeGroup)) {
			$msg = 'Empty Grade level Array';
		}


		else if($getAgeGroup[0]['dateOfBirth'] < $data['birthDate']) {
			$msg = 'Student Age is Above the recommended age. Are you sure you want to Continue?';
		} else {
			$match  = 1;
		}
		
		die(
			json_encode(
				array(
					'success' => true
					,'match' => $match
					, 'message' => $msg
					, 'bool' => $getAgeGroup[0]['dateOfBirth'] > $data['birthDate']
				)
			)
		);	
	}


	public function generateReceipt($data, $params, $accountCard)
    {
       

        $feesMap = [
			'booksTotalReceivable' => ['Books', 'booksPaid'],
			'tuitionTotalReceivable' => ['Tuition', 'tuitionPaid'],
			'uniformTotalReceivable' => ['Uniform', 'uniformPaid'],
			'cateringTotalReceivable' => ['Catering', 'cateringPaid'],
			'extracurricularTotalReceivable' => ['Extra Curricular', 'extracurricularPaid'],
			'christmasTotalReceivable' => ['Christmas Party', 'christmasPaid'],
			'familyDayTotalReceivable' => ['Family Day', 'familyDayPaid'],
			'pictureTotalReceivable' => ['Picture', 'picturePaid'],
			'gradFeeTotalReceivable' => ['Graduation Fee', 'gradFeePaid'],
			'scoutingTotalReceivable' => ['GSP/BSP', 'scoutingPaid'],
			'charityTotalReceivable' => ['Charity', 'charityPaid'],
			'nutritionTotalReceivable' => ['Nutrition Day', 'nutritionPaid'],
			'movingUpTotalReceivable' => ['Moving Up', 'movingUpPaid'],
			'othersTotalReceivable' => ['Others', 'othersPaid'],
			'annualRegistrationTotalReceivable' => ['Annual Registration', 'annualRegPaid']
		];



        $paidMap = [
            'books' => ['Books'],
            'tuition' => ['Tuition'],
            'uniform' => ['Uniform'],
            'catering' => ['Catering'],
            'extraCurricular' => ['Extra Curricular'],
            'christmas' => ['Christmas Party'],
            'familyDay' => ['Family Day'],
            'picture' => ['Picture'],
            'gradFee' => ['Graduation Fee'],
            'scouting' => ['GSP/BSP'],
            'charity' => ['Charity'],
            'nutrition' => ['Nutrition Day'],
            'movingUp' => ['Moving Up'],
            'others' => ['Others'],
            'annualRegistration' => ['Annual Registration']
        ];

        $this->load->library('pdf');
        $pdf = new TCPDF();

        $pdf->SetCreator("Admin");
        $pdf->SetAuthor('Montessori Academy');
        $pdf->SetTitle('Payment Acknowledgement');

        $pdf->SetMargins(5, 5, 5);
        $pdf->SetAutoPageBreak(TRUE, 5);
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);

        // 1/4 A4 page
        $pdf->AddPage('P', array(105, 148));

        // =========================
        // Draw the logo at the top
        // =========================
        $imageWidth = 20;
        $imageHeight = 20;
        $topMargin = 5;
        $centerX = ($pdf->getPageWidth() - $imageWidth) / 2;
        $pdf->Image(
            FCPATH . 'images/logo/1.png',
            $centerX,
            $topMargin,
            $imageWidth,
            0
        );

        // Move Y below the image
        $pdf->SetY($topMargin + $imageHeight + 2);

        // =========================
        // Final Clearance Title
        // =========================
        $pdf->SetFont('helvetica', 'B', 20);
        $pdf->SetFillColor(255, 255, 255);
        $pdf->Cell(0, 8, 'Payment Acknowledgement', 0, 1, 'C', true);


        // =========================
        // Student Name (centered mixed style)
        // =========================
         $pageWidth = $pdf->getPageWidth() - $pdf->getMargins()['left'] - $pdf->getMargins()['right'];
         
        $label = 'Student Name: ';
        $value = $data['name'];
        // $labelWidth = $pdf->GetStringWidth($label);
        // $valueWidth = $pdf->GetStringWidth($value);
        $totalWidth = $pdf->GetStringWidth($label . $value);

        $startX = ($pageWidth - $totalWidth) / 2 + $pdf->getMargins()['left'];

        $pdf->SetY($pdf->GetY());
        $pdf->SetX(20);
        $pdf->SetFont('helvetica', '', 9);
        $pdf->Cell($pdf->GetStringWidth($label), 5, $label, 0, 0, 'L', true);

        $pdf->SetFont('helvetica', 'B', 9);
         $pdf->Cell($pdf->GetStringWidth($value), 5, $value, 0, 1, 'L', true);

        // =========================
        // Grade Level (centered mixed style)
        // =========================
        $label = 'Grade Level: ';
        $value = $data['gradeLevel'];

        $totalWidth = $pdf->GetStringWidth($label . $value);
        $startX = ($pageWidth - $totalWidth) / 2 + $pdf->getMargins()['left'];

		
        $pdf->SetX($startX);
        $pdf->SetFont('helvetica', '', 9);
        $pdf->Cell($pdf->GetStringWidth($label), 5, $label, 0, 0, 'L', true);

        $pdf->SetFont('helvetica', 'B', 9);
        $pdf->Cell($pdf->GetStringWidth($value), 5, $value, 0, 1, 'L', true);

        // $pdf->Ln(10);
    
       // === Setup Table Dimensions ===
        $pageWidth = $pdf->getPageWidth();
        $margins = $pdf->getMargins();
        $usableWidth = $pageWidth - $margins['left'] - $margins['right'];
        $tableWidth = $usableWidth * 0.9;

        $colDate = $tableWidth * 0.25;        // 25%
        $colParticulars = $tableWidth * 0.45; // 45%
        $colAmount = $tableWidth * 0.30;      // 30%

        // Center table horizontally
        $startX = ($usableWidth - $tableWidth) / 2 + $margins['left'];
		$pdf->SetY($pdf->GetY() + 10);
        $pdf->SetX($startX);
		

        // === Table Header ===
        $pdf->SetFont('helvetica', 'B', 8);
        $pdf->SetFillColor(230, 230, 230);

        $pdf->Cell($colDate, 6, 'DATE', 1, 0, 'C', true);
        $pdf->Cell($colParticulars, 6, 'PARTICULARS', 1, 0, 'C', true);
        $pdf->Cell($colAmount, 6, 'AMOUNT', 1, 1, 'C', true);

        // === Example Data Row ===
        $pdf->SetFont('helvetica', '', 8);
        $pdf->SetFillColor(255, 255, 255);

        $totalAmount = 0;

        foreach ($paidMap as $fieldKey => $labelArr) {

            $amount = number_format($data[$fieldKey], 2);
            $label = $labelArr[0]; // e.g., 'Tuition'

            if($amount > 0) {
                $pdf->SetX($startX);
                $pdf->Cell($colDate, 6, date('Y-m-d'), 1, 0, 'C', true);
                $pdf->Cell($colParticulars, 6, $label, 1, 0, 'L', true);
                $pdf->Cell($colAmount, 6, $amount, 1, 1, 'R', true);

                $totalAmount += floatval($data[$fieldKey]);
            }
        }

        // === Total Row ===
        $pdf->SetFont('helvetica', 'B', 8);
        $pdf->SetX($startX);
        $pdf->Cell($colDate + $colParticulars, 6, 'TOTAL', 1, 0, 'R', true);
        $pdf->Cell($colAmount, 6, number_format($totalAmount, 2), 1, 1, 'R', true);


        // =========================
        // Thank You Message
        // =========================
		$currentY = $pdf->GetY();
		$pdf->SetY($currentY + 8); // Add 8 units of vertical space
        $pdf->SetFont('helvetica', 'B', 10);
        $pdf->SetFillColor(255, 255, 255);
        $pdf->Cell(0, 8, 'Thank you for your payment', 0, 1, 'C', true);

        $items = [];
        foreach ($feesMap as $selectKey => $config) {
			$label = $config[0];
			$paidKey = $config[1];

			$rawAmount = isset($accountCard[$selectKey]) ? floatval($accountCard[$selectKey]) : 0;
			$rawAmount -= isset($accountCard[$paidKey]) ? floatval($accountCard[$paidKey]) : 0;
			$items[] = [$label, number_format($rawAmount, 2)];
		}


        $cellHeight = 5;
        $pageWidth = $pdf->getPageWidth();
        $margins = $pdf->getMargins();
        $usableWidth = $pageWidth - $margins['left'] - $margins['right'];

        // Layout: 1 title + 3 items per row
        $titleWidth = $usableWidth * 0.2;      // 20% for title
        $itemWidth  = ($usableWidth * 0.8) / 3; // 80% split into 3

        $pdf->SetFont('helvetica', '', 6);
        $pdf->SetFillColor(255, 255, 255);

        $sectionTitle = 'Balance'; // 🔁 You can dynamically change this
        $pdf->SetFont('helvetica', 'B', 6);
        $pdf->Cell($titleWidth, $cellHeight, $sectionTitle, 0, 0, 'L', false);

        $pdf->SetFont('helvetica', '', 6);

        $count = 0;
        foreach ($items as $index) {
            $label = $index[0];
            $amount = floatval(str_replace(',', '', $index[1]));
            $text = "{$label}: " . number_format($amount, 2);

            if($amount > 0) {
                $pdf->Cell($itemWidth, $cellHeight, $text, 0, 0, 'L', false);
                $count++;

                if ($count % 3 == 0 && $index !== count($items) - 1) {
                    $pdf->Ln();
                    $pdf->Cell($titleWidth, $cellHeight, '', 0, 0, 'L', false); // indent after first line
                }
            }
        }





        // =========================
        // Save PDF to file
        // =========================
        $filename = $data['name'] . '.pdf';
        $pdf->Output(FCPATH . 'pdf/acknowledgement/' . $filename, 'F');

        return $filename;
    }

    public function generateImage($data, $params, $accountCard, $schoolYear)
    {

        $feesMap = [
            'bookSelect' => ['Books', 'booksTotalReceivable', 'booksPaid'],
            'tuitionSelect' => ['Tuition', 'tuitionTotalReceivable', 'tuitionPaid'],
            'uniformSelect' => ['Uniform', 'uniformTotalReceivable', 'uniformPaid'],
            'cateringSelect' => ['Catering', 'cateringTotalReceivable', 'cateringPaid'],
            'extraCurricularSelect' => ['Extra Curricular', 'extracurricularTotalReceivable', 'extracurricularPaid'],
            'christmasSelect' => ['Christmas Party', 'christmasTotalReceivable', 'christmasPaid'],
            'familyDaySelect' => ['Family Day', 'familyDayTotalReceivable', 'familyDayPaid'],
            'pictureSelect' => ['Picture', 'pictureTotalReceivable', 'picturePaid'],
            'gradFeeSelect' => ['Graduation Fee', 'gradFeeTotalReceivable', 'gradFeePaid'],
            'scoutingCampingSelect' => ['GSP/BSP', 'scoutingTotalReceivable', 'scoutingPaid'],
            'charitySelect' => ['Charity', 'charityTotalReceivable', 'charityPaid'],
            'nutritionDaySelect' => ['Nutrition Day', 'nutritionTotalReceivable', 'nutritionPaid'],
            'recognitionSelect' => ['Moving Up', 'movingUpTotalReceivable', 'movingUpPaid'],
            'othersSelect' => ['Others', 'othersTotalReceivable', 'othersPaid'],
            'annualRegSelect' => ['Annual Registration', 'annualRegistrationTotalReceivable', 'annualRegPaid']
        ];

        $paidMap = [
            'books' => ['Books'],
            'tuition' => ['Tuition'],
            'uniform' => ['Uniform'],
            'catering' => ['Catering'],
            'extraCurricular' => ['Extra Curricular'],
            'christmas' => ['Christmas Party'],
            'familyDay' => ['Family Day'],
            'picture' => ['Picture'],
            'gradFee' => ['Graduation Fee'],
            'scouting' => ['GSP/BSP'],
            'charity' => ['Charity'],
            'nutrition' => ['Nutrition Day'],
            'movingUp' => ['Moving Up'],
            'others' => ['Others'],
            'annualRegistration' => ['Annual Registration']
        ];

        // === Create Image Canvas ===
        $width = 600;
        $height = 600;
        $image = imagecreatetruecolor($width, $height);

        // === Define Colors ===
        $white = imagecolorallocate($image, 255, 255, 255);
        $black = imagecolorallocate($image, 0, 0, 0);
        $gray = imagecolorallocate($image, 230, 230, 230);
        $green = imagecolorallocate($image, 34, 139, 34);

        imagefilledrectangle($image, 0, 0, $width, $height, $white);

        $fontSize = 3;
        $x = 20;
        $y = 20;

        // === Logo ===
        $logoPath = FCPATH . 'images/logo/1.png';
        if (file_exists($logoPath)) {
            $logo = imagecreatefrompng($logoPath);
            $logoWidth = 150;
			$logoHeight = 120;
            $centerX = ($width - $logoWidth) / 2;
            imagecopyresized($image, $logo, $centerX, $y, 0, 0, $logoWidth, $logoHeight, imagesx($logo), imagesy($logo));
			imagedestroy($logo);
            $y += $logoHeight + 10;
        }

        // === Title ===
        $title = 'Payment Acknowledgement';
        $fontPath = FCPATH . 'resources/fonts/TimesNewRomanBold.ttf';
        $fontSizeTTF = 30;
        $titleBox = imagettfbbox($fontSizeTTF, 0, $fontPath, $title);
        $titleWidth = $titleBox[2] - $titleBox[0];
        $titleX = ($width - $titleWidth) / 2;
        imagettftext($image, $fontSizeTTF, 0, $titleX, $y + $fontSizeTTF, $black, $fontPath, $title);
        $y += 30;

        // === Student Info ===
        // === Student Info (Centered) ===
        $font = 3;
        $charWidth = imagefontwidth($font);

        // Helper function to center text
        function centerTextX($text, $imageWidth, $fontWidth) {
            return ($imageWidth - (strlen($text) * $fontWidth)) / 2;
        }

        $y += 20;

        $text = "Student Name: " . $data['name'];
        $xCentered = centerTextX($text, $width, $charWidth);
        imagestring($image, $font, $xCentered, $y, $text, $black);
        $y += 15;

        $text = "Grade Level: " . $data['gradeLevel'];
        $xCentered = centerTextX($text, $width, $charWidth);
        imagestring($image, $font, $xCentered, $y, $text, $black);
        $y += 20;

        $text = "School Year: " . $schoolYear->schoolYearStart;
        $xCentered = centerTextX($text, $width, $charWidth);
        imagestring($image, $font, $xCentered, $y, $text, $black);
        $y += 20;

        $y += 20; // extra spacing at the end


       // === Table Headers ===
        $font = 3;
        $rowHeight = 15;

        $dateLabel = "DATE";
        $particularsLabel = "PARTICULARS";
        $amountLabel = "AMOUNT";

        $dateColWidth = 150;
        $particularsColWidth = 250;
        $amountColWidth = 150;

        $tableWidth = $dateColWidth + $particularsColWidth + $amountColWidth;

        // Draw header background box
        imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);

        // Draw header text
        imagestring($image, $font, $x + 5, $y + 2, $dateLabel, $black);
        imagestring($image, $font, $x + $dateColWidth + 5, $y + 2, $particularsLabel, $black);
        imagestring($image, $font, $x + $dateColWidth + $particularsColWidth + 5, $y + 2, $amountLabel, $black);

        // Vertical column lines in header
        imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
        imageline($image, $x + $dateColWidth + $particularsColWidth, $y, $x + $dateColWidth + $particularsColWidth, $y + $rowHeight, $black);

        $y += $rowHeight; // move to next row

        $totalAmount = 0;

        // === Paid Items Rows with Borders ===
        foreach ($paidMap as $fieldKey => $labelArr) {
            $amount = isset($data[$fieldKey]) ? floatval($data[$fieldKey]) : 0;
            if ($amount > 0) {
                // Draw row box
                imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);

                // Vertical column lines
                imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
                imageline($image, $x + $dateColWidth + $particularsColWidth, $y, $x + $dateColWidth + $particularsColWidth, $y + $rowHeight, $black);

                // Draw text
                imagestring($image, $font, $x + 5, $y + 2, $accountCard['paymentDate'], $black);
                imagestring($image, $font, $x + $dateColWidth + 5, $y + 2, $labelArr[0], $black);
                imagestring($image, $font, $x + $dateColWidth + $particularsColWidth + 5, $y + 2, number_format($amount, 2), $black);

                $totalAmount += $amount;
                $y += $rowHeight;
            }
        }

        // === Total Row with Borders and Simulated Bold ===
        $font = 4;
        $rowHeight = 18; // slightly taller for bold
        imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);

        // Column lines
        imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
        imageline($image, $x + $dateColWidth + $particularsColWidth, $y, $x + $dateColWidth + $particularsColWidth, $y + $rowHeight, $black);

        // Simulated bold text
        $totalLabel = "TOTAL";
        $totalValue = number_format($totalAmount, 2);

        for ($i = 0; $i <= 1; $i++) {
            for ($j = 0; $j <= 1; $j++) {
                imagestring($image, $font, $x + $dateColWidth + 5 + $i, $y + 2 + $j, $totalLabel, $black);
                imagestring($image, $font, $x + $dateColWidth + $particularsColWidth + 5 + $i, $y + 2 + $j, $totalValue, $black);
            }
        }

        $y += $rowHeight + 10; // move down after table


        // === Thank You ===
        $tyMessage = "Thank you for your payment!";
        $fontPath = FCPATH . 'resources/fonts/TimesNewRomanBold.ttf';
		$fontSize = 18;
		$tyBox = imagettfbbox($fontSize, 0, $fontPath, $tyMessage);
		$tyWidth = $tyBox[2] - $tyBox[0];
		$tyX = ($width - $tyWidth) / 2;
        imagettftext($image, $fontSize, 0, $tyX, $y + $fontSize, $black, $fontPath, $tyMessage);
		$y += 25;
        $y += 20;

        // === Balance Section ===
        imagestring($image, 4, $x, $y, "Balance:", $black);
        $y += 15;

        $col = 0;
        foreach ($feesMap as $selectKey => $config) {
            list($label, $totalKey, $paidKey) = $config;
            $total = isset($accountCard[$totalKey]) ? floatval($accountCard[$totalKey]) : 0;
            $paid = isset($accountCard[$paidKey]) ? floatval($accountCard[$paidKey]) : 0;
            $balance = max(0, $total - $paid);

            $isSelected = isset($params['fees'][$selectKey]) && $params['fees'][$selectKey];
            if ($balance > 0 && $isSelected) {
                $text = "$label: " . number_format($balance, 2);
                imagestring($image, 3, $x + ($col * 180), $y, $text, $black);
                $col++;
                if ($col === 3) {
                    $y += 15;
                    $col = 0;
                }
            }
        }

        // === Save to File ===
        $filename = FCPATH . 'images/acknowledgement/' . $data['name'] . '.png';
        imagepng($image, $filename);
        imagedestroy($image);

        return $data['name'] . '.png';
    }

}