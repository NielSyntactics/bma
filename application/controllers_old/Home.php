<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {
	public function __construct(){
		parent::__construct();
		setHeader('Home_model');
	}
	
	public function index(){
		header( "cache-Control: no-store, no-cache, must-revalidate" );
		header( "cache-Control: post-check=0, pre-check=0", false );
		header( "Pragma: no-cache" );
		header( "Expires: Sat, 26 Jul 1997 05:00:00 GMT" );		
		// $this->checklog();
		$dataCompany = $this->model->getCompanyDetails();
		$this->load->view('header_view');
		$this->load->view('login_view',$dataCompany);
		$this->load->view('footer_view');
	}
	
	public function loginUser(){
		
        $data      = getData( false );
		$loginUser = $this->model->loginUser( $data );
		$userUserName = $this->model->checkUser( $data );
		$dataCompany = $this->model->getCompanyDetails();
		
		// echo("<pre>");
		// print_r($dataCompany);
		// echo($dataCompany['companyLogo']);
		// echo("<pre>");
		
		if( $loginUser ){
				if( isset( $_SERVER['SERVER_SOFTWARE'] ) && strpos( $_SERVER['SERVER_SOFTWARE'], 'Google App Engine' ) !== false ){
					$printPath  = 'gs://bontilaoapp/';
					$logoPath 	= "/images/";
					$server 	= true;
				}
				else{
					$printPath  = site_url();
					$logoPath	= site_url()."images/logo/";
					// $logoPath	= APPPATH . '../images/logo/';
					$server 	= false;
				}
				
				/* Variable Holders Needs Update to Cater non-specific project base naming */
				$this->session->set_userdata(
					array(
						'logged_in'		=> true
						,'INITHEADER'	=> false
						,'BMAPSUID'		=> $loginUser->bmapsUID
						,'FIRSTNAME'	=> $loginUser->bmapsUfirstname
						,'LASTNAME'		=> $loginUser->bmapsUlastname
						,'USERFULLNAME'	=> $loginUser->fullname
						,'BMAPSUNAME'	=> $loginUser->bmapsUname
						,'USERTYPE'		=> $loginUser->bmapsUtype
						,'USERTYPENAME'	=> $loginUser->usertypename
						,'PRINTPATH'	=> $printPath
						,'LOGOPATH'		=> $logoPath 
						,'ISGAE'		=> $server
						,'LOGONAME'		=> $dataCompany['companyLogo']
						,'COMPANYNAME'	=> $dataCompany['companyName']
					)
				);
				setLogs(
					array(
						'description' => $loginUser->bmapsUname ." has logged in successfully."
						,'bmapsUID' => $loginUser->bmapsUID
						,'idmodule' => 10
					)
				);
				
				
				/** 
				 **	 Program part to check and update school year if not the same with current year.		
				 **/
				
				$currentYear = 0;				
				$dataCurrentYear = 0;
				$updateDatabaseYear = 0;
				$dateDifference = 0;
				$numberOfYear = '';
				
				$dataCurrentYear = 	$this->model->checkCurrentYear();
				$currentYear = date("Y");
				$currentMonth = date("m");
				
				if( $dataCurrentYear->schoolYearStart < $currentYear && $currentMonth >= 4 ){
					$dateDifference = $currentYear - $dataCurrentYear->schoolYearStart;
					$updateDatabaseYear = $dataCurrentYear->schoolYearStart + $dateDifference ;
					
					$data = array( 'schoolYearStart' => $updateDatabaseYear );
					$this->model->updateSchoolYear( $data );						
					
					if( $dateDifference == 1 ){ $numberOfYear = 'year'; }
					else{ $numberOfYear = 'years'; }
					setLogs(
						array(
							'description' => $userUserName->bmapsUname ." Successfully added " .$dateDifference. ' ' .$numberOfYear.' to School Year Record.'
							,'idmodule' => 10
							,'bmapsUID' => $userUserName->bmapsUID
						)
					);
				}
				/* End of School Year Checking */
				
				
				print_r( json_encode( array( 'match' => 0 ) ) );
		}
		else{
			// $userUserName = $this->model->checkUser( $data );
			if( $userUserName ){
					setLogs(
						array(
							'description' => $userUserName->bmapsUname ." failed to login."
							,'bmapsUID' => $userUserName->bmapsUID
							,'idmodule' => 10
						)
					);
					unset( $userUserName );
			}else{
					setLogs(
						array(
							'description' => 'Unknown user failed to login.'
							,'bmapsUID' => 19	//Select the Unknown user ID in the BMAPSU table
							,'idmodule' => 10
						)
					);
			}
			print_r( json_encode( array( 'match' => 1 ) ) );
		}
		
		if( $this->db->trans_status() === FALSE ){
			$this->db->trans_rollback();
			$success = false;
		}
		else{
			$this->db->trans_commit();
		}
    }
	
	public function redirurl(){
		$desturl = getsession('desturl');
		if (strlen($desturl)==0){
			unsetsession('desturl','');
			redirect('mainview');
			return;
		}
		redirect($desturl);
	}
	
	public function checklog(){
		$logged_in = getsession('logged_in');
		if(isset($logged_in) && $logged_in==true){
			redirect('mainview');
			return;
		}
	}
	
	public function logout( $proc = 0 ){
		if( ( int )$proc == 1 ){
			
			setLogs(
				array(
					'description' => $this->userName ." has logged out of the system."
					,'idmodule' => 11
					,'bmapsUID' => $this->userID
				)
			);
			$sess = array( 'logged_in', 'EUID' );
			unsetsession( $sess );
			redirect( '' );
		}
    }
	
	public function autoLogout(){
		$sess = array( 'logged_in', 'EUID' );
		unsetsession( $sess );
		print json_encode(array('success'=>true));
	}
	
	public function checkIfLogin(){
		if( $this->session->userdata( 'BMAPSUNAME' ) !='' ){
			print ( $this->session->userdata( 'logged_in' ) == 1 )? 1 : 0;
		}else{
			print 0;
		}
	}
	
	public function reorderMenu(){
		$params = getData();
		$listModules = array();
		$amodule = json_decode( $params['amoduleData'], true );
		foreach( $amodule as $rs ){
			// $rs['iduser'] = $this->bgsUID;
			$rs['iduser'] = $this->userID;
			$this->model->updateAmodules( $rs );
			$listModules[] = $rs['idmodule'];
		}
		$modulesNotIncluded = $this->model->getAllModulesNotIncluded( array(
			'mtype' => $params['mtype']
			// ,'iduser' => $this->bgsUID
			,'iduser' => $this->userID
			,'data' => $listModules
		) );
		$counter = count( $amodule ) + 1;
		foreach( $modulesNotIncluded as $rs ){
			$rs['sorter'] = $counter;
			$this->model->updateAmodules( $rs );
			$counter++;
		}
		
		die(
			json_encode(
				array(
					'success' => true
				)
			)
		);
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */