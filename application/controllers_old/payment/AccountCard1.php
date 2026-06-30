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
	
	public function __construct()
	{
		parent::__construct();
		setHeader( 'payment/Accountcard_model' );
	}

	public function saveForm()
	{

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
					
				)
				
			)
			
		);
		
	}
	
	public function getGradeLevels()
	{
		
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

	public function getTransactions()
	{

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

	public function saveRowTrans()
	{

		$data = getData();
		
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
		
		die(
		
			json_encode(
			
				array(
				
					'success' => $success
					
					,'match' => 0
					
					,'paymentID' => $paymentID
					
				)
				
			)
			
		);
		
	}

	public function getGridStudentTransactions()
	{
		
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
					
					,'exwhere' => ' accountCardSchoolYear = '. $data['schoolYearID'] .''
				)
			)
		)
		{
			
			$data[ 'onEdit' ] = 0;
			
			$accountCardID = $this->model->saveAccTrans( $data );
		
		}
		
		$view = $this->model->getAccStudentReceivables( $data );

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

	public function getSchoolYear()
	{		
	
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

	public function getStudentsList()
	{
		
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

	public function getHistory()
	{

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
	
	public function saveAccTrans()
	{
		
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

	public function retrieveData()
	{
		
		$params = getData();
	
		$success = true;
		
		$view = $this->model->retrieveData( $params );
		
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
	
	public function getLastReferenceNumber()
	{
	
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

	public function validateRefernceNumber()
	{
	
		$params = getData();
		
		$view = $this->model->validateRefernceNumber( $params );
		
		die(
		
			json_encode(
			
				array(
				
					'success' => true
					
					,'match' => count($view)

					,'refnum' => str_pad((int)$params['refnum'],4,"0",STR_PAD_LEFT)
				
				)
			
			)
		
		);
	
	}

	public function getReference()
	{

		$view = array(
	
			array(
			
				'refID' => 0
				
				,'refName' => 'OR'
			
			)
			,array(
			
				'refID' => 1
				
				,'refName' => 'TR'
			
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

	public function deleteRecord()
	{
		
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

	public function printPDF()
	{

		$params = getData();

		$modeLevel1 = 7.8;

		$logData = null;

		$html = '';

		if ( isset($params['printType']) )
		{

			$view = $this->model->getHistory( $params );

			$html = '<table width="100%" cellpadding="5" border="1">';

			$html .= '<tr>';
			$html .= '<td style="font-weight: bold"> Grade Level </td>';
			$html .= '<td style="font-weight: bold"> Student Name </td>';
			$html .= '<td style="font-weight: bold"> LRN# </td>';
			$html .= '<td style="font-weight: bold"> Sequence No. </td>';
			$html .= '<td style="font-weight: bold" > Birthday </td>';
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
				$html .= '<td style="text-align: right">'. date( 'm/d/Y', strtotime( $key[ 'studentBirthday' ] ) ) .'</td>';
				$html .= '<td>'. $key[ 'studentContactNumber' ] .'</td>';
				$html .= '<td>'. $key[ 'studentRemarks' ] .'</td>';
				$html .= '<td>'. $key[ 'totalBalance' ] .'</td>';
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
			$html .= 	'<th> Extra- Curricular </th>';
			$html .= 	'<th> Christmas </th>';
			$html .= 	'<th> Family Day </th>';
			$html .= 	'<th> Picture </th>';
			$html .= 	'<th> Grad Fee </th>';
			$html .= 	'<th> Scouting/ Camping </th>';
			$html .= 	'<th> Charity </th>';
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
	
	public function checkIfAllowEdit(  )
	{
		
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

}