<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Notificationlogs_model extends CI_Model {
  
	public function __construct()
    {
        parent::__construct();
				$this->load->database(); 
    }
	
	
	public function getFullName( $data ){
		$this->db->select( "a.bgsUID as id, 
				(CASE
					WHEN a.bgsUtype = 3 THEN
						concat( b.studentFirstName,  ' ', b.studentLastName )
					ELSE 
						concat( a.bgsUfirstname,  ' ', a.bgsUlastname )
				END) as name
			");
		$this->db->from( 'bgsu as a' );
		$this->db->join( "student as b", "b.studentID = a.studentID", "left outer" );
		if( isset( $data[ 'query' ] ) ){
			$this->db->like( "concat( b.studentFirstName,  ' ', b.studentLastName )", $data[ 'query' ] , 'both');
		}
		$this->db->order_by( "name" );
		return $this->db->get()->result_array();
	}
	
	public function getUserName( $data ){
		$this->db->select( "a.bgsUID as id, a.bgsUname as name" );
		$this->db->from( 'bgsu as a' );
		if( isset( $data[ 'query' ] ) ){
			$this->db->like( "a.bgsUname", $data[ 'query' ] , 'both');
		}
		$this->db->order_by( "name" );
		return $this->db->get()->result_array();
	}
	
	public function getUserType(){
		$this->db->select( "a.bgsUID as id, 
								(CASE 
									WHEN a.bgsUtype = 0 THEN 'Super Admin'
									WHEN a.bgsUtype = 1 THEN 'Administrator'
									WHEN a.bgsUtype = 2 THEN 'Teacher'
									WHEN a.bgsUtype = 3 THEN 'Student'
								END) as name" );
		$this->db->from( 'bgsu as a' );
		return $this->db->get()->result_array();
	}
	
	// public function getModule(){
		// $this->db->select( "a.idmodule as id,
								// (CASE 
									// WHEN c.iduser = 0 THEN a.module
									// WHEN c.iduser = 1 THEN a.module
									// WHEN c.iduser = 2 THEN a.module
									// WHEN c.iduser = 3 THEN a.module
								// END) as name" );
		// $this->db->from( 'modules as a' );
		// $this->db->join( 'amodules as c','c.mtype = a.mtype', 'inner' );
		// $this->db->where_not_in( "a.module", "Notification Logs" );
		// $this->db->order_by( "name" );
		// return $this->db->get()->result_array();
	// }
	
	public function getModule(){
		$this->db->select( "a.idmodule as id, a.module as name" );
		$this->db->from( 'modules as a' );
		$this->db->where_not_in( "a.module", "Notification Logs" );
		$this->db->order_by( "name" );
		return $this->db->get()->result_array();
	}
	
	function getHistory( $data = null, $where = null ){
			// print_r( $data[ 'filterType' ] );
			// die();
		if( isset( $data[ 'filterType' ] ) AND $data[ 'filterDispTypeList' ] != "All" ){
			switch( $data['filterType'] ){
				case 1:	
						$where	=	array( 'a.bgsUID' => $data[ 'filterTypeList' ] );
					break;
				case 2:
						$where	=	array( 'a.bgsUname' => $data[ 'filterDispTypeList' ] );
					break;
				case 3:
						$where	=	array( 'a.bgsUtype' => ( $data[ 'filterTypeList' ] - 1) );
					break;
				case 4:
						$where	=	array( 'c.idmodule' => $data[ 'filterTypeList' ] );
					break;
				
			}
		}
		// (CASE
						// WHEN a.bgsUtype = 3 THEN
							// concat( a.bgsUfirstname,  ' ', a.bgsUlastname )
						// ELSE 
							// concat( d.studentFirstName,  ' ', d.studentLastName )
					// END) a
	
		$this->db->select( "
				 DATE_FORMAT( b.logDateAndTime, '%m/%d/%Y  %h:%i:%s' ) as logDateAndTime,
					(CASE
						WHEN a.bgsUtype = 3 THEN
							concat( d.studentFirstName,  ' ', d.studentLastName )
						ELSE 
							concat( a.bgsUfirstname,  ' ', a.bgsUlastname )
					END) as fullName, a.bgsUname,
					(CASE 
						WHEN a.bgsUtype = 0 THEN 'Super Admin'
						WHEN a.bgsUtype = 1 THEN 'Administrator'
						WHEN a.bgsUtype = 2 THEN 'Teacher'
						WHEN a.bgsUtype = 3 THEN 'Student'
					END) as userType,
					c.module, b.description
		" );
		$this->db->from( "bgsu as a" );
		$this->db->join( "logs as b", "b.bgsUID = a.bgsUID", "right outer" );
		$this->db->join( "modules as c", "c.idmodule = b.idmodule", "left outer" );
		$this->db->join( "student as d", "d.studentID = a.studentID", "left outer" );
			if( !is_null( $where ) ){
				$this->db->where( $where );
			}
			if( isset( $data['sdate'] ) ){
				$this->db->where( "CAST( b.logDateAndTime as DATE ) BETWEEN '" . $data['sdate'] . "' AND '". $data['edate'] ."'" );
			}
		if( isset( $data['sort'] ) ){
			$sort = json_decode( $data['sort'], true )[0];
			$this->db->order_by( $sort['property'], $sort['direction'] );
		}
		else{
			$this->db->order_by( "b.logDateAndTime DESC" );
		}
		// $this->db->limit( $data[ "start" ], $data[ "limit" ] );
		
		
			if( !$data['pdf'] ){
			$this->db->limit( $data['limit'] ,$data['start'] );
			}
			if( $data['cnt'] ){
				return $this->db->count_all_results();
			}
			else{
				return $this->db->get()->result_array();
			}
		
		// return $this->db->get()->result_array();
	}
	
	public function countAll(){
		$this->db->select("*");
		return $this->db->count_all_results("logs");
	}
	
	public function retrieveData( $data )
	{
		
	}
	
}	