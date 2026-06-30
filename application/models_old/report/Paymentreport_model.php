<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Paymentreport_model extends CI_Model{
	
	public function getSchoolYear( $params ){
		$this->db->select( " CONCAT( schoolYearStart, ' - ', schoolYearStart + 1 ) as schoolYearDis, schoolYearStart, schoolYearID " );
		if( isset( $params['query'] ) ) $this->db->like( "CONCAT( schoolYearStart, ' - ', schoolYearStart + 1 )", $params['query'], 'both' );
		$this->db->order_by( 'schoolYearStart', 'DESC' );
		return $this->db->get('schoolyear')->result_array();
	}
	
	public function getGradeLevel( $params ){
		$this->db->select( 'gradeLevelID, gradeLevelName' );
		if( isset( $params['query'] ) ) $this->db->like( 'gradeLevelName', $params['query'], 'both' );
		$this->db->order_by( 'gradeLevelName', 'ASC' );
		return $this->db->get( 'gradelevel' )->result_array();
	}
	
	public function getReceivableFromBatchReceivable( $params ){
		$this->db->select( "
			a.studentName
			,a.studentID
			,SUM( IFNULL( b.receivableAmount, 0 ) ) as totalReceivable
			,d.*
			,(CASE
				WHEN $params[batchReceivableCategoryID] = 1 THEN IFNULL( d.catering, 0 )
				WHEN $params[batchReceivableCategoryID] = 2 THEN IFNULL( d.charity, 0 )
				WHEN $params[batchReceivableCategoryID] = 3 THEN IFNULL( d.extraCurricular, 0 )
				WHEN $params[batchReceivableCategoryID] = 4 THEN IFNULL( d.christmas, 0 )
				WHEN $params[batchReceivableCategoryID] = 5 THEN IFNULL( d.familyDay, 0 )
				WHEN $params[batchReceivableCategoryID] = 6 THEN IFNULL( d.picture, 0 )
				WHEN $params[batchReceivableCategoryID] = 7 THEN IFNULL( d.gradFee, 0 )
				WHEN $params[batchReceivableCategoryID] = 8 THEN IFNULL( d.scouting, 0 )
				WHEN $params[batchReceivableCategoryID] = 9 THEN IFNULL( d.others, 0 )
				WHEN $params[batchReceivableCategoryID] = 10 THEN IFNULL( d.nutrition, 0 )
				WHEN $params[batchReceivableCategoryID] = 11 THEN IFNULL( d.movingUp, 0 )
			END) as totalPayments
		" );
		$this->db->join( "( SELECT
								b.studentID
								,b.receivableAmount
							FROM batchreceivables as a
							JOIN receivables as b
								ON( b.batchReceivableID = a.batchReceivableID )
							WHERE a.batchReceivableCategoryID = $params[batchReceivableCategoryID] AND a.schoolYearID = $params[schoolYearID]
						) as b", 'b.studentID = a.studentID', 'left outer' );
		$this->db->join( "(
			SELECT
				studentID
				,SUM( IFNULL( catering, 0 ) )  as catering
				,SUM( IFNULL( charity, 0 ) )  as charity
				,SUM( IFNULL( extraCurricular, 0 ) )  as extraCurricular
				,SUM( IFNULL( christmas, 0 ) ) as christmas
				,SUM( IFNULL( familyDay, 0 ) ) as familyDay
				,SUM( IFNULL( picture, 0 ) ) as picture
				,SUM( IFNULL( gradFee, 0 ) )  as gradFee
				,SUM( IFNULL( scouting, 0 ) ) as scouting 
				,SUM( IFNULL( others, 0 ) ) as others 
				,SUM( IFNULL( nutrition, 0 ) ) as nutrition
				,SUM( IFNULL( movingUp, 0 ) ) as movingUp
			FROM payments
			WHERE schoolYearID = $params[schoolYearID] AND ( status = 0 OR status IS NULL )
			GROUP BY studentID
			) as d", 'd.studentID = a.studentID' , 'left outer' );
		$this->db->where( 'a.gradeLevelID', $params['gradeLevelID'] );
		$this->db->group_by( 'a.studentID' );
		$this->db->where( 'a.studentStatus', 0 );
		$this->db->order_by( 'a.studentName ASC' );
		return $this->db->get( 'student as a' )->result_array();
	}
	
	public function getReceivableFromAccountCard( $params ){
		$this->db->select( "
			a.studentName
			,a.studentID
			,(CASE
				WHEN $params[batchReceivableCategoryID] = 12 THEN IFNULL( b.annualRegistrationTotalReceivable, 0 )
				WHEN $params[batchReceivableCategoryID] = 13 THEN IFNULL( b.tuitionTotalReceivable, 0 )
				WHEN $params[batchReceivableCategoryID] = 14 THEN IFNULL( b.booksTotalReceivable, 0 )
				WHEN $params[batchReceivableCategoryID] = 15 THEN IFNULL( b.uniformTotalReceivable, 0 )
			END) as totalReceivable
			,(CASE
				WHEN $params[batchReceivableCategoryID] = 12 THEN SUM( IFNULL( c.annualRegistration, 0 ) )
				WHEN $params[batchReceivableCategoryID] = 13 THEN SUM( IFNULL( c.tuition, 0 ) )
				WHEN $params[batchReceivableCategoryID] = 14 THEN SUM( IFNULL( c.books, 0 ) )
				WHEN $params[batchReceivableCategoryID] = 15 THEN SUM( IFNULL( c.uniform, 0 ) )
			END) as totalPayments
		" );
		$this->db->join( 'accountcard as b', 'b.studentID = a.studentID', 'left outer' );
		$this->db->join( 'payments as c', 'c.accountCardID = b.accountCardID AND ( c.status = 0 OR c.status IS NULL )', 'left outer', false );
		$this->db->where( 'a.gradeLevelID', $params['gradeLevelID'] );
		$this->db->where( 'b.accountCardSchoolYear', (int)$params['schoolYearID'] );
		$this->db->group_by( 'a.studentID' );
		$this->db->where( 'a.studentStatus', 0 );
		$this->db->order_by( 'a.studentName ASC' );
		return $this->db->get( 'student as a' )->result_array();
	}
	
	public function getTotalDays( $params ){
		$this->db->select( 'a.*' );
		$this->db->where( 'b.studentID', $params['studentID'] );
		$this->db->where( 'a.batchReceivableCategoryID', $params['batchReceivableCategoryID'] );
		$this->db->from( 'batchreceivables as a' );
		$this->db->join( 'receivables as b', 'b.batchReceivableID = a.batchReceivableID', 'left outer' );
		$this->db->group_by( 'a.batchReceivableDate' );
		return $this->db->count_all_results();
		
	}
	
	public function getTotalToDays( $params ){
		$this->db->select( "SUM( IFNULL( a.daysPaid,0 ) ) as totalDays" );
		$this->db->from( 'payments as a' );
		$this->db->join( 'accountcard as b', 'b.accountCardID = a.accountCardID' );
		$this->db->where( 'a.studentID', $params['studentID'] );
		$this->db->where( "( a.status IS NULL OR a.status != 1 )" );
		$dat = $this->db->get()->result_array();
		if( count( $dat ) > 0 ) return $dat[0]['totalDays'];
		return 0;
	}
	
}