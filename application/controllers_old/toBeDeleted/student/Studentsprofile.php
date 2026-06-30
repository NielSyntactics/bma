<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Studentsprofile extends CI_Controller {
	
	/* class constructor
	 * initialization of classes to be loaded are all here(libraries not included in the auto load config)
	*/
	
	public function __construct(){
		parent::__construct();
		setHeader( 'student/Studentsprofile_model' );
	}
		
	public function retrieveData(){
		$view = $this->model->retrieveData();
		die( json_encode( array( 'success' => true, 'view' => $view, 'match' => 0 ) ) );
	}
	
}