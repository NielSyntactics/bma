<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Home_model extends CI_Model {
	
	public function getCompanyDetails(){
		return $this->db->query("
			SELECT
				*
			FROM company
			WHERE companyID = 1
		")->row_array();
	}
	
	public function loginUser( $data ){
		$user = $this->db->query("
			SELECT
				a.bmapsUID,a.bmapsUfirstname,a.bmapsUlastname
				,a.bmapsUname
				,a.bmapsUtype
				,CONCAT( a.bmapsUlastname, ', ', a.bmapsUfirstname ) as fullname				
				,( CASE WHEN a.bmapsUtype = 0 THEN 'Super Admin'
						WHEN a.bmapsUtype = 1 THEN 'Administrator'
						WHEN a.bmapsUtype = 2 THEN 'Secretary'
						WHEN a.bmapsUtype = 3 THEN 'User'
				END ) AS usertypename
			FROM bmapsu as a
			WHERE a.bmapsUname = '$data[username]'
			AND a.bmapsUKey = '" . md5( $data['password'] ) . "'
			AND a.bmapsUInactiveTag NOT IN(1)
			GROUP BY a.bmapsUID
		")->row();
		return isset( $user->bmapsUID )? $user : false;
	}
	
	// check if username is valid
	
	public function checkUser( $data ){
		$user = $this->db->query("
			SELECT
				a.bmapsUID,a.bmapsUfirstname,a.bmapsUlastname
				,a.bmapsUname
				,a.bmapsUtype
				,CONCAT( a.bmapsUlastname, ', ', a.bmapsUfirstname ) as fullname
				,( CASE WHEN a.bmapsUtype = 0 THEN 'Super Admin'
						WHEN a.bmapsUtype = 1 THEN 'Administrator'
						WHEN a.bmapsUtype = 2 THEN 'Teacher'
						WHEN a.bmapsUtype = 3 THEN 'Student'
				END ) AS usertypename
			FROM bmapsu as a
			WHERE a.bmapsUname = '$data[username]'
			AND a.bmapsUInactiveTag NOT IN(1)
			GROUP BY a.bmapsUID
		")->row();
		return isset( $user->bmapsUID )? $user : false;
	}
	
	public function getUserAccessModule( $data ){
		
		$this->db->select('*');
		$this->db->from( $data['dbName'] . '.amodules' );
		$this->db->where( 'iduser', $data['hrmsuid'] );
		return $this->db->count_all_results();
		
	}
	
	public function getUserType( $data ){
		
		$this->db->select( 'hrmsUserType' );
		$this->db->from( $data['dbName'] . '.hrmsu' );
		$this->db->where( 'hrmsuid', $data['hrmsuid'] );
		return $this->db->get()->row();
		
	}
	
	public function getCentralDatabaseComp(){
		$this->db->select( 'companyName as dis,hrmsaccid as val' );
		$this->db->from( centralDB . '.hrmsacc' );
		$this->db->order_by( 'companyName' );
		$this->db->where( 'clientDBName != ""' );
		return $this->db->get()->result_array();
	}
	
	public function getCentralDatabaseNames(){
		$this->db->select( 'clientDBName' );
		$this->db->from( centralDB . '.hrmsacc' );
		$this->db->where( 'clientDBName != ""' );
		return $this->db->get()->result_array();
	}
	
	public function getAccount( $hrmsaccid ){
		$this->db->select( 'clientDBName' );
		$this->db->from( centralDB . '.hrmsacc' );
		$this->db->order_by( 'companyName' );
		$this->db->where( 'hrmsaccid', $hrmsaccid );
		return $this->db->get()->row();
	}
	
	public function checkUserName( $params ){
		$this->db->select( 'a.hrmsuid,b.clientDBName' );
		$this->db->from( centralDB .  '.hrmsucentral as a' );
		$this->db->join( centralDB . '.hrmsacc as b', 'b.hrmsaccid = a.hrmsaccid' );
		$this->db->where( 'a.hrmsuun', $params['username'] );
		return $this->db->get()->row();
	}
	
	public function getUserName( $hrmsuid ){
		$this->db->select( 'hrmsuun' );
		$this->db->from( centralDB . '.hrmsucentral' );
		$this->db->where( 'hrmsuid', $hrmsuid );
		return $this->db->get()->row();
	}
	
	public function updateAmodules( $data ){
		$this->db->set( 'sorter', $data['sorter'] );
		$this->db->where( 'idmodule', (int)$data['idmodule'] );
		$this->db->where( 'iduser', (int)$data['iduser'] );
		$this->db->update( 'amodules' );
	}
	
	public function getAllModulesNotIncluded( $data ){
		$this->db->select( '*' );
		$this->db->from( 'amodules' );
		$this->db->where( 'mtype', (int)$data['mtype'] );
		$this->db->where( 'iduser', (int)$data['iduser'] );
		if( count( $data['data'] ) > 0 ) $this->db->where_not_in( 'idmodule', $data['data'] );
		$this->db->order_by( 'sorter' );
		return $this->db->get()->result_array();
	}
	
	public function checkCurrentYear (){
		$this->db->select('schoolYearStart');
		$this->db->order_by('schoolYearID','DESC');
		$this->db->from('schoolyear');
		return $this->db->get()->row();
	}
	
	public function updateSchoolYear( $data ){
		// $this->db->set( 'schoolYearStart', $updateDatabaseYear );
		// $this->db->where( 'schoolYearID', 1 );
		// $this->db->update( 'schoolyear' );		
		$this->db->insert( 'schoolyear', $data );
	}

	public function getLogo(){
		$this->db->select('companyLogo');
		return $this->db->get('company')->row();
	}
	
	
}