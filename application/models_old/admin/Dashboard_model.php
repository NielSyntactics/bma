<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Dashboard_model extends CI_Model {
	
	public function loadModules(){
		return $this->db->query("
			SELECT 
				a.module
				,a.idmodule
				,a.mlink
				,a.mtype
				,b.save
				,b.edit
				,b.del
				,b.print
				,b.sorter
			FROM amodules AS b
			JOIN modules AS a ON b.idmodule = a.idmodule
			WHERE a.archive != 1 AND b.iduser = {$this->session->userdata( 'BMAPSUID' )}
			AND a.mlink IS NOT NULL
			GROUP BY a.idmodule
			ORDER BY a.mtype, b.sorter
		")->result_array();
	}
	
	public function updateAmodules( $data ){
		$this->db->where( 'iduser', $data['iduser'] );
		$this->db->where( 'idmodule', $data['idmodule'] );
		$this->db->where( 'mtype', $data['mtype'] );
		$this->db->set( 'sorter', $data['sorter'] );
		$this->db->update( 'amodules' );
	}
	
	public function getAllModulesNotIncluded( $params ){
		$this->db->select( '*' );
		$this->db->from( 'amodules' );
		$this->db->where( 'mtype', $params['mtype'] );
		$this->db->where( 'iduser', $params['iduser'] );
		$this->db->where_not_in( 'idmodule', $params['data'] );
		$this->db->order_by( 'sorter' );
		return $this->db->get()->result_array();
		
	}
		
}