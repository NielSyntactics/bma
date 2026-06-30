<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Collectionreport_model extends CI_Model {
  
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
		$this->load->database(); 
	}
	
	public function getFilter( $params )
	{

		$this->db->select( "studentID AS id, studentName AS name" );

		return $this->db->get( 'student' )->result_array();

	}

	public function viewAll( $params )
	{
		
		if( isset( $params['sBy'] ) && !isset($params['filterBy']) )
		{

			$params['filterBy'] = $params['s'];

		}

		$params['sdate'] = date( 'Y-m-d', strtotime($params['sdate']) );

		$params['edate'] = date( 'Y-m-d', strtotime($params['edate']) );

		$where = " WHERE b.paymentDate BETWEEN '".$params['sdate']."' AND '".$params['edate']."' ";

		$where2 = " AND b.amount > 0 OR amount > 0";

		$overrideField = "";
		
		if( $params['sBy'] == 0 && $params['filterBy'] != 0 )
		{

			$where .= " AND a.studentID = ". $params[ 'filterBy' ] ." ";

		}

		$length = strlen($params['filterBy']);

		if( $params['sBy'] == 1 && $length != 1 )
		{

			$overrideField = " ,".$params['filterBy']." AS amount ";

		}

		$view = $this->db->query("
			SELECT a.* FROM(
				SELECT 
					a.*,
					b.studID ,
					b.paymentID ,
					b.particulars ,
					b.accountCardID ,
					b.paymentDate ,
					b.refNum,
					IF(b._refnum > 0 OR _refnum = '' , 0, 1) AS sorter
					".($overrideField  == "" ? " ,b.amount " : $overrideField )."
				FROM(
					SELECT a.*, b.accountCardSchoolYear  FROM student AS a
					LEFT OUTER JOIN(
						SELECT * FROM accountcard
					) AS b ON b.studentID = a.studentID
					GROUP BY a.studentID
				) AS a
				LEFT OUTER JOIN(
					SELECT 
						studentID AS studID,
						paymentID,
						particulars,
						accountCardID,
						paymentDate,
						CONCAT((CASE 
							WHEN ref = 0 THEN 
								'OR'
							ELSE
								'TR'
						END),'-',LPAD(refnum,4,0)) AS refNum,
						refNum AS _refnum,
						IFNULL(annualRegistration, 0) AS annualRegistration,
						IFNULL(tuition, 0) AS tuition,
						IFNULL(books, 0) AS books,
						IFNULL(uniform, 0) AS uniform,
						IFNULL(catering, 0) AS catering,
						IFNULL(extraCurricular, 0) AS extraCurricular,
						IFNULL(christmas, 0) AS christmas,
						IFNULL(familyDay, 0) AS familyDay,
						IFNULL(picture, 0) AS picture,
						IFNULL(gradFee, 0) AS gradFee,
						IFNULL(scouting, 0) AS scouting,
						IFNULL(charity, 0) AS charity,
						IFNULL(others, 0) AS others,
						(
							IFNULL(annualRegistration, 0)
							+ 
							IFNULL(tuition, 0)
							+ 
							IFNULL(books, 0)
							+ 
							IFNULL(uniform, 0)
							+ 
							IFNULL(catering, 0)
							+ 
							IFNULL(extraCurricular, 0)
							+ 
							IFNULL(christmas, 0)
							+ 
							IFNULL(familyDay, 0)
							+ 
							IFNULL(picture, 0)
							+ 
							IFNULL(gradFee, 0)
							+ 
							IFNULL(scouting, 0)
							+ 
							IFNULL(charity, 0)
							+ 
							IFNULL(others, 0)
						) AS amount
					FROM payments
					WHERE status = 0 OR status IS NULL
				) AS b ON b.studID = a.studentID".
				$where." ". ($overrideField == "" ? " AND b.amount > 0 " : " AND ".$params['filterBy'] ." > 0 " )
		."  ) AS a ORDER BY sorter, refNum, a.studentName")->result_array();

		if( isset( $params['_excel'] ) ){
			array_push(
				$view
				,array(
					'studentID' => ""
					,'studentLRN' => ""
					,'studentName' => ""
					,'studentBirthday' => ""
					,'studentContactNumber' => ""
					,'studentStatus' => ""
					,'studentRemarks' => ""
					,'studentAddress' => ""
					,'studentMothersName' => ""
					,'studentFathersName' => ""
					,'studentReligion' => ""
					,'studentAllergies' => ""
					,'accountCardSchoolYear' => ""
					,'studID' => ""
					,'paymentID' => ""
					,'particulars' => "Total"
					,'accountCardID' => ""
					,'paymentDate' => ""
					,'refNum' => ""
					,'amount' => array_sum(array_column($view,'amount'))
				)
			);
		}

		if( isset( $params['_excel'] ) && isset( $params['pdf'] ) ){
			
			_setLogs(

				array(
					'modeLevel' => 8
					,'modeLevel1' => 8.2
					,'idmodule' => 7
					,'bmapsUID' => $this->session->userdata('BMAPSUID')
				)

			);

		}
		return $view;
		
	}

}	