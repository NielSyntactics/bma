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
class Gradelevelsetup extends CI_Controller {
	
	
    public function __construct(){
		parent::__construct();
		setHeader( 'admin/Gradelevelsetup_model' );
	}

    public function getGradeLevels(){
		
		$params = getData();
		
		$view = $this->model->getGradeLevels( $params );
		
		die(
		
			json_encode(
			
				array(
				
					'success' => true
					
					,'view' => $view
					
				)
				
			)
			
		);
		
	}

    public function saveForm(){

		$data = getData(); 
        $this->model->editGradeLevelAge( $data );

        die(
			json_encode(
				array(
				
					'success' => true
					,'match' => 0
				)
			)
		);
    }
	

}