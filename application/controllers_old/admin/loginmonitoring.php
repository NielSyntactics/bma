<?php
/** User settings module
  * [Developer]
  * Developer: Mark Reynor D. Magriña
  * Date Created: May. 12, 2018
  * Date Finished: May. 15, 2018
  
  * [Database]
	bgsu, modules, amodules, and class
	
  * [Description]
	This module allows the authorized administrators to set (add, edit or delete) users who will be allowed to access the system. 
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Loginmonitoring extends CI_Controller {
	
	/* class constructor
	 * initialization of classes to be loaded are all here(libraries not included in the auto load config)
	*/
	public function __construct(){
		parent::__construct();
		setHeader( 'admin/loginmonitoring_model' );
	}
	
	public function retrieveSearch(){
		$params = getData();
		$view = array();
		if( isset( $params['by'] ) ){			
			if( (int)$params['by'] == 1 ){
				$view = $this->model->getUserDetails( $params );
			}
			elseif( (int)$params['by'] == 2 ){
				$view = $this->model->getUserDetails( $params );
			}
			elseif( (int)$params['by'] == 3 ){
				$view = array(
					0 => array( 'id' => 1 ,'name' => 'Administrator' )
					,1 => array( 'id' => 2 ,'name' => 'Secretary' )
					,2 => array( 'id' => 3 ,'name' => 'User' )
				);
			}
			elseif( (int)$params['by'] == 4 ){
				$view = $this->model->getModuleIdAndName( $params );
			}
		}
		array_unshift( $view, array(
			'id' => -1
			,'name' => 'All'
		) );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					,'total' => count( $view )
				)
			)
		);
	}
	
	public function getLogs(){
		$params = getData();
		$params['cnt'] = 1;
		$view = $this->model->viewAllLogs( $params );
		// LQ();
		$params['pdf'] = true; $params['cnt'] = 0;
		$countAll = $this->model->viewAllLogs( $params );
		// LQ();
		if($view){
			setLogs(
				array(
					'description' => "Viewed the user action logs."
					,'idmodule' => 5
					,'bmapsUID' => $this->userID
				)
			);
		}
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					,'total' => count($countAll)
				)
			)
		);
	}
}