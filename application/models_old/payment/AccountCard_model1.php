<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Accountcard_model extends CI_Model {
  
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
	
	public function saveForm( $data )
	{
		
		$onEdit = ( int )$data['onEdit'];
		
		if ( !$onEdit )
		{
			
			$this->db->insert( 'student', unsetParams( $data, 'student' ) );
			
			return $this->db->insert_id();
		
		}

		$this->db->where( 'studentID', $data['studentID'] );
		
		$this->db->update( 'student', unsetParams( $data, 'student' ) );
		
		return $data['studentID'];

	}
	
	public function getGradeLevels ( $params = array() )
	{
		if ( isset($params['gradeLevelID']) )
		{
			$this->db->where( 'gradelevelID', $params['gradeLevelID'] );
		}

		return $this->db->get( 'gradelevel' )->result_array();
		
	}
	
	public function saveAccTrans( $data )
	{ 
		
		$accountCardID = $data['accountCardID'];
	
		$onEdit = (int)$data['onEdit'];
		
		if ( $onEdit )
		{
			
			$params['schoolYearID'] = ( isset( $data['accountCardSchoolYear'] ) ? $data['accountCardSchoolYear'] : $data['schoolYearID'] );
			
			$params['studentID'] = $data['studentID'];

			if( isset( $data['studentID'] ) ) unset( $data['studentID'] );
			
			if( isset( $data['accountCardID'] ) ) unset( $data['accountCardID'] );
			
			if( isset( $data['accountCardSchoolYear'] ) ) unset( $data['accountCardSchoolYear'] );
		
			$this->db->where( 'accountCardID', $accountCardID );
			
			$this->db->update( 'accountcard', unsetParams( $data, 'accountcard' ) );
			
			return $this->getAccStudentReceivables( $params );
			
		}
		else
		{
			$data['dateCreated'] = date('Y-m-d');
			
			if ( isset( $data['accountCardID'] ) ) unset( $data['accountCardID'] );
		
			if ( isset( $data['schoolYearID'] ) ) $data['accountCardSchoolYear'] = $data['schoolYearID'];
			
			$this->db->insert( 'accountcard', unsetParams( $data, 'accountcard' ) );
			
			return array( 'accountCardID' => $this->db->insert_id() );
			
		}		
	}
	
	public function getHistory( $params )
	{

		$strWhere = " WHERE _studentStatus = ". $params['studentStatus'] ." ";
	
		if ( isset( $params['studentID'] ) && $params['studentID'] > 0 )
		{
		
			if ( isset( $params['srchBy'] ) && $params['srchBy'] != 2 )
			{
				
				$strWhere .= " AND a.studentID = ". $params['studentID'] ."";
				
			}

		}
		
		/**
		 * Search for grade level only
		 * studentID as gradeLevelID
		 */
		if ( isset( $params['srchBy'] ) && $params['srchBy'] == 2 && $params['studentID'] > 0 )
		{
			
			$strWhere .= " AND a.gradeLevelID = ". $params['studentID'] ."";
			
		}
		
		return $this->db->query("
		SELECT 
			IF(@gradeNumber = a.gradeLevelID, (@seqNumber := @seqNumber + 1), @seqNumber := 1) AS seqNumber,
			IF(@gradeNumber = a.gradeLevelID, @gradeNumber, @gradeNumber := a.gradeLevelID) AS seqNumbers,
			a.* 
		FROM(
			SELECT 
				a.*,
				b.gradeLevelName
			FROM(
				SELECT 
					a.*
					,format((IFNULL(b.accTotalReceivable,0)
					-
						IFNULL(c.totalCollected,0)
						),2) AS totalBalance
					,b.accountCardSchoolYear
					,b.accountCardID
					-- c.* 
					FROM(SELECT 
						studentID,
						gradeLevelID,
						studentLRN,
						studentName,
						studentBirthday,
						studentContactNumber,
						studentStatus AS _studentStatus,
						(CASE 
							WHEN studentStatus = 0 THEN
								'Enrolled'
							WHEN studentStatus = 1 THEN
								'Not-Enrolled'
							WHEN studentStatus = 2 THEN
								'Drop-out'
						END) AS studentStatus,
						studentRemarks
					FROM bma_ps.student) AS a 
				LEFT OUTER JOIN(
					SELECT 
					accountCardID,
					studentID,
					accountCardSchoolYear,
					(
						SUM(IFNULL(annualRegistrationTotalReceivable, 0)  )
						+ 
						SUM(IFNULL(tuitionTotalReceivable, 0)  )
						+ 
						SUM(IFNULL(booksTotalReceivable, 0)  )
						+ 
						SUM(IFNULL(uniformTotalReceivable, 0)  )
						+ 
						SUM(IFNULL(cateringTotalReceivable, 0)  )
						+ 
						SUM(IFNULL(extracurricularTotalReceivable, 0)  )
						+ 
						SUM(IFNULL(christmasTotalReceivable, 0)  )
						+ 
						SUM(IFNULL(familyDayTotalReceivable, 0)  )
						+ 
						SUM(IFNULL(pictureTotalReceivable, 0)  )
						+ 
						SUM(IFNULL(gradFeeTotalReceivable, 0) ) 
						+ 
						SUM(IFNULL(scoutingTotalReceivable, 0) )
						+ 
						SUM(IFNULL(charityTotalReceivable, 0)  )
						+ 
						SUM(IFNULL(othersTotalReceivable, 0)  )
					) AS accTotalReceivable
					FROM accountcard
					GROUP BY studentID
				) AS b ON b.studentID = a.studentID
				
				LEFT OUTER JOIN(
					SELECT *,
						(
							SUM(IFNULL(annualRegistration, 0))
							+ 
							SUM(IFNULL(tuition, 0))
							+ 
							SUM(IFNULL(books, 0))
							+ 
							SUM(IFNULL(uniform, 0))
							+ 
							SUM(IFNULL(catering, 0)) 
							+ 
							SUM(IFNULL(extraCurricular, 0))
							+ 
							SUM(IFNULL(christmas, 0))
							+ 
							SUM(IFNULL(familyDay, 0))
							+ 
							SUM(IFNULL(picture, 0))
							+ 
							SUM(IFNULL(gradFee, 0))
							+ 
							SUM(IFNULL(scouting, 0))
							+ 
							SUM(IFNULL(charity, 0))
							+ 
							SUM(IFNULL(others, 0))
						) AS totalCollected
					FROM payments
					WHERE status = 0 OR status IS NULL
					GROUP BY studentID
				) AS c ON b.studentID = c.studentID
				". $strWhere ."
				GROUP BY a.studentID
				ORDER BY a.studentName
				". (isset($params['cnt']) ? "" : (!isset($params['printType']) ? "LIMIT ". $params['start'] .", ". $params['limit'] ."" : "") ) ."
			) AS a
			LEFT OUTER JOIN(
				SELECT * FROM gradelevel
			) AS b ON a.gradeLevelID = b.gradeLevelID
			ORDER BY a.gradeLevelID, a.studentName, a.studentLRN
		) AS a LEFT OUTER JOIN(
				SELECT @seqNumber := 0, @gradeNumber := 0
		) AS b ON 1 = 1
		")->result_array();
		
		return $this->db->query("
			SELECT 
				a.*
				,format((IFNULL(b.accTotalReceivable,0)
				-
					IFNULL(c.totalCollected,0)
					),2) AS totalBalance
				,b.accountCardSchoolYear
				,b.accountCardID
				-- c.* 
				FROM(SELECT 
					studentID,
					gradeLevelID,
					studentLRN,
					studentName,
					studentBirthday,
					studentContactNumber,
					studentStatus AS _studentStatus,
					(CASE 
						WHEN studentStatus = 0 THEN
							'Enrolled'
						WHEN studentStatus = 1 THEN
							'Not-Enrolled'
						WHEN studentStatus = 2 THEN
							'Drop-out'
					END) AS studentStatus,
					studentRemarks
				FROM bma_ps.student) AS a 
			LEFT OUTER JOIN(
				SELECT 
				accountCardID,
				studentID,
				accountCardSchoolYear,
				(
					SUM(IFNULL(annualRegistrationTotalReceivable, 0)  )
					+ 
					SUM(IFNULL(tuitionTotalReceivable, 0)  )
					+ 
					SUM(IFNULL(booksTotalReceivable, 0)  )
					+ 
					SUM(IFNULL(uniformTotalReceivable, 0)  )
					+ 
					SUM(IFNULL(cateringTotalReceivable, 0)  )
					+ 
					SUM(IFNULL(extracurricularTotalReceivable, 0)  )
					+ 
					SUM(IFNULL(christmasTotalReceivable, 0)  )
					+ 
					SUM(IFNULL(familyDayTotalReceivable, 0)  )
					+ 
					SUM(IFNULL(pictureTotalReceivable, 0)  )
					+ 
					SUM(IFNULL(gradFeeTotalReceivable, 0) ) 
					+ 
					SUM(IFNULL(scoutingTotalReceivable, 0) )
					+ 
					SUM(IFNULL(charityTotalReceivable, 0)  )
					+ 
					SUM(IFNULL(othersTotalReceivable, 0)  )
				) AS accTotalReceivable
				FROM accountcard
				GROUP BY studentID
			) AS b ON b.studentID = a.studentID
			
			LEFT OUTER JOIN(
				SELECT *,
					(
						SUM(IFNULL(annualRegistration, 0))
						+ 
						SUM(IFNULL(tuition, 0))
						+ 
						SUM(IFNULL(books, 0))
						+ 
						SUM(IFNULL(uniform, 0))
						+ 
						SUM(IFNULL(catering, 0)) 
						+ 
						SUM(IFNULL(extraCurricular, 0))
						+ 
						SUM(IFNULL(christmas, 0))
						+ 
						SUM(IFNULL(familyDay, 0))
						+ 
						SUM(IFNULL(picture, 0))
						+ 
						SUM(IFNULL(gradFee, 0))
						+ 
						SUM(IFNULL(scouting, 0))
						+ 
						SUM(IFNULL(charity, 0))
						+ 
						SUM(IFNULL(others, 0))
					) AS totalCollected
				FROM payments
				WHERE status = 0 OR status IS NULL
                GROUP BY studentID
			) AS c ON b.studentID = c.studentID
			". $strWhere ."
			GROUP BY a.studentID
			ORDER BY a.studentName
			". (isset($params['cnt']) ? "" : "LIMIT ". $params['start'] .", ". $params['limit'] ."") ."
		")->result_array();

	}

	public function getAccStudentReceivables( $params ) 
	{

		$this->db->select("
			*,
			(
				IFNULL(annualRegistrationTotalReceivable, 0) 
				+ 
				IFNULL(tuitionTotalReceivable, 0) 
				+ 
				IFNULL(booksTotalReceivable, 0) 
				+ 
				IFNULL(uniformTotalReceivable, 0) 
				+ 
				IFNULL(cateringTotalReceivable, 0) 
				+ 
				IFNULL(extracurricularTotalReceivable, 0) 
				+ 
				IFNULL(christmasTotalReceivable, 0) 
				+ 
				IFNULL(familyDayTotalReceivable, 0) 
				+ 
				IFNULL(pictureTotalReceivable, 0) 
				+ 
				IFNULL(gradFeeTotalReceivable, 0) 
				+ 
				IFNULL(scoutingTotalReceivable, 0) 
				+ 
				IFNULL(charityTotalReceivable, 0) 
				+ 
				IFNULL(othersTotalReceivable, 0) 
			) AS accTotalReceivable
		");
		
		$this->db->where( 'studentID', $params['studentID'] );
		
		$this->db->where( 'accountCardSchoolYear', $params['schoolYearID'] );
		
		return $this->db->get( 'accountcard' )->result_array();

	}

	public function getTransactions( $params )
	{

		$this->db->select("
			*,
			(CASE
				WHEN status = 1 THEN
					'Cancelled'
				ELSE
					'Valid'
			END) AS _status,
			LPAD(refnum,4,0) AS refnum,
			IF(ref = 0,'OR', 'TR') AS _ref,
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
			) AS totalReceivable
		");
		
		$this->db->where( 'studentID', $params['studentID'] );
		$this->db->where( 'schoolYearID', $params['schoolYearID'] );
		$this->db->where('(status = ', 0, FALSE);
		
		if ( isset( $params['showCancelledTrans'] ) && $params['showCancelledTrans'] == 1 )
		{
		
			$this->db->or_where( 'status = '.$params[ 'showCancelledTrans' ].'','', FALSE );
		
		}
		
		$this->db->or_where('status IS NULL)', NULL, FALSE);
		
		$this->db->order_by('paymentDate', 'ASC');

		return $this->db->get( 'payments' )->result_array();
		
	}

	public function saveRowTrans( $onEdit, $data )
	{

		if( !$onEdit )
		{
		
			$this->db->insert( 'payments', unsetParams( $data, 'payments' ));
			
			return $this->db->insert_id();
		
		}

		$this->db->where( 'paymentID', $data['paymentID'] );
		
		$this->db->update( 'payments', unsetParams( $data, 'payments' ) );
		
		return $data['paymentID'];
		
	}

	public function getStudentsList( $params )
	{
		
		if ( isset( $params['sBy'] ) && $params['sBy'] == 2 )
		{
				
			$this->db->select( "gradeLevelID AS id, gradeLevelName AS name" );
			
			$this->db->from( "gradelevel" );
			
			return $this->db->get()->result_array();
			
		}
		
		/**
		* Get From student table
		*/
		
		if ( isset( $params['sBy'] ) )
		{
				
			if( $params['sBy'] == 0 )
			{
				
				$this->db->select( "studentID AS id, studentName AS name" );
			
			}
			else
			{
				
				$this->db->select( "studentID AS id, studentLRN AS name" );
				
			}
			
		}
		
		$this->db->where( 'studentStatus', $params['studentStatus'] );
		
		return $this->db->get( 'student' )->result_array();

	}

	public function getSchoolYear( $params )
	{

		$where ="";
		
		if ( isset($params['studentID']) )
		{
			
			$ret = $this->db->query("
				SELECT MAX(accountCardSchoolYear) AS accountCardSchoolYear 
				FROM accountcard
				WHERE studentID = ". $params['studentID'] ."
			")->row();
			
			if ( count($ret) > 0 )
			{
				$params['accountCardSchoolYear'] = $ret->accountCardSchoolYear;
			}
			
		}

		if ( isset( $params['accountCardSchoolYear'] ) )
		{
			$where = " WHERE schoolYearID = ". $params['accountCardSchoolYear'] ."";
		}
	
		return $this->db->query("
			SELECT 
				schoolYearID,
				CONCAT(schoolYearStart,
						'-',
						(schoolYearStart + 1)) AS schoolYearStart
			FROM
				schoolyear
			$where
			ORDER BY schoolYearStart DESC
		")->result_array();
		
	}

	public function retrieveData( $params )
	{
		
		return $this->db->query("
			SELECT 
				a.*, 
				b.*,
				(CASE 
					WHEN a.studentStatus = 0 THEN
						'Enrolled'
					WHEN a.studentStatus = 1 THEN
						'Not-Enrolled'
					WHEN a.studentStatus = 2 THEN
						'Drop-Out'
				END) AS __status
			FROM(
				SELECT * FROM student WHERE studentID = ". $params['studentID'] ."
			) AS a 
			LEFT OUTER JOIN(
				SELECT
					accountCardID,
					accountCardSchoolYear,
					IFNULL(annualRegistrationTotalReceivable, 0) AS annualRegistrationTotalReceivable,
					IFNULL(tuitionTotalReceivable, 0) AS tuitionTotalReceivable,
					IFNULL(booksTotalReceivable, 0) AS booksTotalReceivable,
					IFNULL(uniformTotalReceivable, 0) AS uniformTotalReceivable,
					IFNULL(cateringTotalReceivable, 0) AS cateringTotalReceivable,
					IFNULL(extracurricularTotalReceivable, 0) AS extracurricularTotalReceivable,
					IFNULL(christmasTotalReceivable, 0) AS christmasTotalReceivable,
					IFNULL(familyDayTotalReceivable, 0) AS familyDayTotalReceivable,
					IFNULL(pictureTotalReceivable, 0) AS pictureTotalReceivable,
					IFNULL(gradFeeTotalReceivable, 0) AS gradFeeTotalReceivable,
					IFNULL(scoutingTotalReceivable, 0) AS scoutingTotalReceivable,
					IFNULL(charityTotalReceivable, 0) AS charityTotalReceivable,
					IFNULL(othersTotalReceivable, 0) AS othersTotalReceivable,
					(
						IFNULL(annualRegistrationTotalReceivable, 0) 
						+ 
						IFNULL(tuitionTotalReceivable, 0) 
						+ 
						IFNULL(booksTotalReceivable, 0) 
						+ 
						IFNULL(uniformTotalReceivable, 0) 
						+ 
						IFNULL(cateringTotalReceivable, 0) 
						+ 
						IFNULL(extracurricularTotalReceivable, 0) 
						+ 
						IFNULL(christmasTotalReceivable, 0) 
						+ 
						IFNULL(familyDayTotalReceivable, 0) 
						+ 
						IFNULL(pictureTotalReceivable, 0) 
						+ 
						IFNULL(gradFeeTotalReceivable, 0) 
						+ 
						IFNULL(scoutingTotalReceivable, 0) 
						+ 
						IFNULL(charityTotalReceivable, 0) 
						+ 
						IFNULL(othersTotalReceivable, 0) 
					) AS accTotalReceivable
				FROM accountcard 
				WHERE 
					accountCardSchoolYear = ". $params['accountCardSchoolYear'] ." 
					AND 
					studentID = ". $params['studentID'] ."
			) AS b ON 1 = 1
		")->result_array();
		
	}
	
	public function getLastReferenceNumber( $params )
	{
		
		return $this->db->query("
			SELECT LPAD((IFNULL(MAX(refnum),0) + 1),4,0) AS refnum
			FROM payments
			WHERE ref = {$params['ref']}
		")->row();
		
	}

	public function validateRefernceNumber( $params )
	{
		
		$this->db->where( "ref", $params['ref'] );
		
		$this->db->where( "refnum", (int)$params['refnum'] );

		$this->db->where( "refnum", (int)$params['refnum'] );

		if ( $params['paymentID'] > 0 ) {

			$this->db->where( "paymentID !=", (int)$params['paymentID'], FALSE );

		}
		
		return $this->db->get( "payments" )->result_array();
		
	}

	public function cancelTrans( $params )
	{

		$this->db->set( 'status', 1, FALSE );

		$this->db->where( 'paymentID', $params['paymentID'] );

		$this->db->update( 'payments' ); 

	}

	public function deleteReceipt( $params )
	{
	
		$this->db->where( 'paymentID', $params['paymentID'] );

		$this->db->delete( 'payments' ); 

	}

	public function deleteRecord( $params )
	{
	
		$this->db->where( 'accountCardID', $params['accountCardID'] );

		$this->db->delete( 'accountcard' ); 
		
		$this->db->where( 'studentID', $params['studentID'] );

		$this->db->delete( 'student' ); 
	
		$this->db->where( 'studentID', $params['studentID'] );

		$this->db->delete( 'payments' ); 

	}

	public function disallowEdit( $params )
	{

		$this->db->set( 'uneditable', 1 );

		$this->db->where( 'accountCardID', $params[ 'accountCardID' ] );

		$this->db->update( 'payments' );

	}

}	