<?php
/** User settings module
  * [Developer]
  * Developer: Mark Reynor D. Magriña
  * Date Created: May. 17, 2018
  * Date Finished: May. 17, 2018
  
  * [Database]
	bmapsu, modules, amodules, and class
	
  * [Description]
	This module allows the authorized administrators to set (add, edit or delete) users who will be allowed to access the system. 
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Bandr_model extends CI_Model {
	
	function GetBackUp(){
		$this->db->select('*');
		return $this->db->get('aback')->result_array();
	}
	
	function checkPassword(){
		$this->db->select('bmapsUID');
		$this->db->where('bmapsUKey',md5($this->input->post('pass')));
		$this->db->where('bmapsUID',(int)$this->session->userdata('BMAPSUID'));
		return $this->db->get('bmapsu')->result_array();
	}
	
}