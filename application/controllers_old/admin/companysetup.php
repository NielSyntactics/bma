<?php
/** User settings module
  * [Developer]
    * Developer: Mark Reynor D. Magriña
  * Date Created: May. 15, 2018
  * Date Finished: May. 15, 2018
  
  * [Database]
	bgsu, modules, amodules, and class
	
  * [Description]
	This module allows the authorized administrators to set (add, edit or delete) users who will be allowed to access the system. 
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Companysetup extends CI_Controller {
	
	/* class constructor
	 * initialization of classes to be loaded are all here(libraries not included in the auto load config)
	*/
	public function __construct(){
		parent::__construct();
		setHeader('Home_model','homeModel');
		setHeader( 'admin/companysetup_model','companyModel' );
		$this->IMAGEPATH = APPPATH . '../images/logo/';
	}
	
	function get_defsetForm(){
		/* $rawDetails = $this->companyModel->getdefsetForm(); */
		$details = $this->companyModel->getdefsetForm();
		if($details){
			$logoNameActual = ($details[0]['companyLogo']) ? $details[0]['companyLogo'] : DEFAULT_EMPTY_IMG;
			$logoPartActual = $this->session->userdata('LOGOPATH').$logoNameActual ;

			$details[0]['imageBox'] = file_get_contents( $logoPartActual )  ?  'data:image/png;base64,' . base64_encode( file_get_contents( $logoPartActual ) ) :  'data:image/png;base64,' . base64_encode( file_get_contents( $this->session->userdata('LOGOPATH').DEFAULT_EMPTY_IMG) )  ;
			$details[0]['companyLogo'] = (  file_get_contents( $logoPartActual ) ? $logoPartActual : $this->session->userdata('LOGOPATH').DEFAULT_EMPTY_IMG  );
			$response = array('success'=>true, 'total'=>count($details), 'data'=>$details);
		}else{
			$response = array('success'=>false, 'total'=>0, 'data'=>'');
		}
		
		// echo($details[0]['imageBox']);
		
		print json_encode($response);
	}
	
	public function saveForm(){
		$data  	= getData();
		$onEdit = ( int )$data['onEdit'];
		$photo = null;
		$photo  = $_FILES;
		$photo  = $photo['companyLogo_companysetup'];
		$loadType = 0;
		if( isset( $_SERVER['SERVER_SOFTWARE'] ) && strpos( $_SERVER['SERVER_SOFTWARE'], 'Google App Engine' ) !== false ){
			$logoPath 	= "/images/";
		}
		else{
			$logoPath	= site_url()."images/logo/";
		}
		
		$ext = explode( '.' , $photo['name'] );
		$ext = end($ext);
		// $data['companyLogo'] = $data['companyID'].'.'.$ext;
		// $compLogoView = $data['companyLogo'];
		$data['companyLogo'] = ($photo['size'])?$data['companyID'].'.'.$ext : '';
		if( $data['companyLogo'] == "" && $data['edit'] == 1 ){
			$data['companyLogo'] = "default-no-img.jpg";
		}
		else if( $data['companyLogo'] == "" ){
			unset( $data['companyLogo'] );
		}
		$id = $this->companyModel->saveForm( $data , $ext);
			
		if( $photo['size'] ){
			$image = $this->IMAGEPATH . $id . '.' . $ext;
			if( file_exists(  $image ) ){
				unlink(  $image );
			}
		   resize_image( $photo['tmp_name'], $photo['size'], $image);
		   
		   $dataCompany = $this->homeModel->getCompanyDetails();
		   $this->session->set_userdata(
				array(
					'LOGOPATH'		=> $logoPath
					,'LOGONAME'		=> $dataCompany['companyLogo']
				)
			);
			$loadType = 1;
		}
		
		setLogs(
			array(
				'description' => "Edited Company Information."
				,'idmodule' => 4
				,'bmapsUID' => $this->userID
			)
		);
		
		die( json_encode( array( 'success' => true ,'match' => 0, 'view' => (isset($data['companyLogo']) ? $data['companyLogo'] : ""), 'log' => 1 ,'loadType'=> $loadType ) ) );
	}	
}