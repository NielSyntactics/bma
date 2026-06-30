<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
// class Dashboard extends CI_Controller { 

class Mainview extends CI_Controller { 
	public function __construct(){
		parent::__construct();
		setHeader( 'admin/Dashboard_model' );
	}

	function index(){
		if( $this->session->userdata( 'BMAPSUID' ) != '' && $this->session->userdata( 'logged_in' ) == 1 ){
			$this->load->view('main_view');
		}
		else{
			print "<script type=\"text/javascript\">";
			print "window.location.href = '".site_url()."'";
			print "</script>";
		}
	}

	function setSchoolYear( $id ) {
		die( json_encode( array( 'success' => $this->model->setSchoolYear( $id ) ) ) );
	}
	
	public function initializeAndLoadModules(){
		date_default_timezone_set('Asia/Manila');
		
		if( $this->session->userdata('USERTYPE') == 0 || $this->session->userdata('USERTYPE') == 1 ){
			
			/* For forced adding of modules */
			// $backupmodule = array(
				// array(
					// 'module' => 'Back Up'
					// ,'idmodule' => 13
					// ,'mlink' => 'admin/Backup.js'
					// ,'mtype' => 1
					// ,'save' => 1
					// ,'edit' => 1
					// ,'del' => 1
					// ,'sorter' => 3
				// )
			// );			
			
			
		}
		// else if( $this->session->userdata('USERTYPE') == 2 ){
			// $backupmodule = array(
				// array(
					// 'module' => 'Back Up'
					// ,'idmodule' => 13
					// ,'mlink' => 'teacher/Backup.js'
					// ,'mtype' => 1
					// ,'save' => 1
					// ,'edit' => 1
					// ,'del' => 1
					// ,'sorter' => 3
				// )
			// );
		// }
		else{
			$backupmodule = array();
		}

		$modules = array_merge(
			array(
				array(  'mlink' => 'standards/Constants.js' )
				,array( 'mlink' => 'standards/Standards.js' )
				,array( 'mlink' => 'standards/Overrides.js' )
				,array( 'mlink' => 'help/Help.js' )
			)
			,$this->model->loadModules()
			// ,$backupmodule
		);

		$schoolyears = $this->model->getAllSchoolYears();
		
		/* $this->session->set_userdata(
					array(
						'logged_in'		=> true
						,'INITHEADER'	=> false
						,'BMAPSUID'		=> $loginUser->bmapsUID
						,'FIRSTNAME'	=> $loginUser->bmapsUfirstname
						,'LASTNAME'		=> $loginUser->bmapsUlastname
						,'USERFULLNAME'	=> $loginUser->fullname
						,'BMAPSUNAME'		=> $loginUser->bmapsUname
						,'USERTYPE'		=> $loginUser->bmapsUtype
						,'USERTYPENAME'	=> $loginUser->usertypename
						,'PRINTPATH'	=> $printPath
						,'LOGOPATH'		=> $logoPath
						,'ISGAE'		=> $server
					)
				); */
		
		/* print_r('<prep>');
		print_r('this is the bgsUID');
		
		print_r($this->bgsUID);
		die(); */
		

		$initVar = array(
			'userID'		=> $this->userID
			,'fname'		=> $this->fname
			,'lname'		=> $this->lname
			,'fullname'		=> $this->fullname
			,'userName'		=> $this->userName
			,'usertype'		=> $this->usertype
			,'usertypename'	=> $this->usertypename
			,'sysTime'		=> date('F j, Y h:i A')
			,'printPath'	=> $this->session->userdata( 'PRINTPATH' )
			,'logoPath'		=> $this->session->userdata('LOGOPATH')
			,'logoName'		=> @file_get_contents(  $this->session->userdata('LOGOPATH').$this->session->userdata('LOGONAME') ) ? $this->session->userdata('LOGONAME') : 'default-no-img.jpg'
			,'server'		=> $this->session->userdata( 'ISGAE' ) ? 1 : 0
		);

		// echo "<pre>";
		// print_r($this->session->userdata()  );
		// die();
		
		/* $initVar = array(
			'bgsUID'		=> $this->bgsUID
			,'fname'		=> $this->fname
			,'lname'		=> $this->lname
			,'fullname'		=> $this->fullname
			,'bgsUname'		=> $this->bgsUname
			,'usertype'		=> $this->usertype
			,'usertypename'	=> $this->usertypename
			,'sysTime'		=> date('F j, Y h:i A')
			,'printPath'	=> $this->session->userdata( 'PRINTPATH' )
			,'logoPath'		=> $this->session->userdata( 'LOGOPATH' )
			,'server'		=> $this->session->userdata( 'ISGAE' ) ? 1 : 0
		); */

		$headers    = getallheaders();
		$initHeader = $this->session->userdata( 'initHeader' );

		if( $initHeader ){
			$initVar['initHeader'] = $initHeader;
		}
		else{
			$this->session->set_userdata( array( 
				'Initheader'=> isset($headers['initheader']) ? $headers['initheader'] : []
			) );
		}
		die( json_encode( array( 'success' => true ,'modules' => $modules, 'initVar' => $initVar, 'schoolyear' => $schoolyears ) ) );
	}

	function checkIfPChange(){
		$iduser = $this->session->userdata('IDUSER');
		$passchng = $this->session->userdata('PASSCHANGEDATE');
		$match = 0; $logouttime = 0;
		$checking = $this->Dashboard_model->checkIfPChange($iduser,$passchng);
		$getLogouttime = $this->Dashboard_model->getLogoutTime();
		if(isset($getLogouttime->logouttime)) $logouttime = $getLogouttime->logouttime;
		if(isset($checking->iduser)){
			if($checking->passChangeDate != $passchng){
				if(isset($checking->verCode)) $match = 1;
				else $match = 2;
			}
		}
		die(json_encode(array('success'=>true,'match'=>$match,'logouttime'=>$logouttime)));
	}

	function checkIfLogin(){
		if($this->session->userdata('BGSUNAME')!=''){
			if($this->session->userdata('logged_in') == 1){
				print 1;
			}else{
				print 0;
			}
		}
		else{
			print 0;
		}
	}
}

