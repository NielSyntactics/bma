<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Admin_controller extends CI_Controller {
	public function __construct()
	{
		parent::__construct();
		$this->checklog();
	} 
	function checklog(){
		$logged_in = $this->session->userdata('logged_in');
		$uri = uri_string();
		if(!isset($logged_in) || $logged_in!=true){
			setflash('errlog','<b>Your session has expired!</b><br />You must login to view this page!');
			setsession('desturl',$uri);
			redirect('home/index');
			return;
		}
		unsetsession('desturl','');
	}	
}