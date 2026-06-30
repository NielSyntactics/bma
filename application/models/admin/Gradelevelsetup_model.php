<?php
/** Grade level age management module
  * [Developer]
  * Developer: Niño Niel B. Iroc
  * Date Created: Aug. 09, 2023
  * Date Finished: 
  
  * [Database]
    gradelevel
	
  * [Description]
    This module allows the authorized administrators to set grade level age
  
 * [Modification]
   
 **/
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Gradelevelsetup_model extends CI_Model {
	

    public function getGradeLevels ( $params = array() ){
		if ( isset($params['gradeLevelID']) )
		{
			$this->db->where( 'gradelevelID', $params['gradeLevelID'] );
		}

		$this->db->order_by('dateOfBirth', 'DESC');
		$result =  $this->db->get( 'gradelevel' )->result_array();
		return $result;
		
	}

    public function editGradeLevelAge( $data ){
    
		$this->db->where( 'gradeLevelID', $data['gradeLevelID'] );
		$this->db->update( 'gradelevel', ['dateOfBirth' => $data['dateOfBirth']]);

	}
	
}