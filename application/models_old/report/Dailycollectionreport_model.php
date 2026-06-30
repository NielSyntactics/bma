<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Dailycollectionreport_model extends CI_Model{
	
	public function getBalances( $params ){
		$this->db->select("
			c.studentName
			,(CASE
				WHEN a.ref = 0 THEN LPAD( refnum, 6, '0' )
				ELSE ''
			END) as orNum
			,a.remarks
			,(CASE
				WHEN a.ref = 1 THEN LPAD( refnum, 6, '0' )
				ELSE ''
			END) as trNum
			,IFNULL(a.annualRegistration, 0) as annualRegistration
			,IFNULL(a.tuition, 0) as tuition
			,IFNULL(a.books, 0) as books
			,IFNULL(a.uniform, 0) as uniform
			,IFNULL(a.catering, 0) as catering
			,IFNULL(a.extraCurricular, 0) as extraCurricular
			,IFNULL(a.christmas, 0) as christmas
			,IFNULL(a.familyDay, 0) as familyDay
			,IFNULL(a.picture, 0) as picture
			,IFNULL(a.gradFee, 0) as gradFee
			,IFNULL(a.scouting, 0) as scouting
			,IFNULL(a.charity, 0) as charity
			,IFNULL(a.nutrition, 0) as nutrition
			,IFNULL(a.movingUp, 0) as movingUp
			,IFNULL(a.others, 0) as others
		");
		$this->db->where( "( a.status = 0 OR a.status IS NULL )" );
		$this->db->where( "a.paymentDate", date( 'Y-m-d', strtotime( $params["asOfDate"] ) ) );
		$this->db->join( 'accountcard as b', 'b.accountCardID = a.accountCardID' );
		$this->db->join( 'student as c', 'c.studentID = a.studentID', 'left outer' );
		$this->db->order_by( 'a.ref ASC, a.refnum ASC' );
		$this->db->where( 'c.studentStatus', 0 );
		return $this->db->get( 'payments as a' )->result_array();
	}
	
}