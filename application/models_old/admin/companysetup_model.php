<?php
/** User settings module
  * [Developer]
   * Developer: Mark Reynor D. Magriña
  * Date Created: May. 15, 2018
  * Date Finished: May. 15, 2018
  
  * [Database]
	bmapsu, modules, amodules, and class
	
  * [Description]
	This module allows the authorized administrators to set (add, edit or delete) users who will be allowed to access the system. 
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Companysetup_model extends CI_Model {
	
	function getdefsetForm(){
		return $this->db->get('company')->result_array();
	}
	
	function save_defsetForm($data){
		$this->db->empty_table('company');
		$this->db->insert('company',$data);
	}
	
	// function saveForm_2($data){
		// unset($data['module']);
		// unset($data['modify']);
		// unset($data['onEdit']);
		// unset($data['idmodule']);
		// $this->db->update('company',$data);
	// }	
	
	public function saveForm( $data, $ext = 'jpg' ){
		$onEdited = ( int )$data['editedRec'];
		$compID = $data['companyID'];
		$data['dateModified'] = date( "Y-m-d H:i:s" );
		
		// unset($data['companyID']);
		// unset($data['editedRec']);
		// unset($data['modify']);
		// unset($data['onEdit']);
		// unset($data['module']);
		// unset($data['idmodule']);
		
		// echo $onEdited." mao no edited'<br>'"; default-no-img
		
		// echo "<pre>";
		// print_r( $data );
		// die();
		if( $onEdited ){
			
			// die('edited ni');
			
			$this->db->where('companyID', $compID);
			$this->db->update( 'company' , unsetParams($data,'company') );
			// LQ();
			// return $compID;
		}
		else{
			
			// die('went here');
			
			$this->db->update( 'company' , unsetParams($data,'company') );
			$compID = $this->db->insert_id();
			
			// $this->db->update( 'company' , $data );
			// $this->db->where('companID', $compID);
			// $this->db->update( 'company' ,  array('companyLogo' => $data['companyLogo'] ), array( 'companyID' => $id ) );
			// return $id;
		}
			// print_r( $data );
		if( isset($data['companyLogo']) && $data['companyLogo'] != "" ){
			$this->session->set_userdata('LOGONAME', $data['companyLogo']);
		}
		return $compID;
	}
	
}