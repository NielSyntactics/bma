<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Notificationlogs extends CI_Controller {
	
	/* class constructor
	 * initialization of classes to be loaded are all here(libraries not included in the auto load config)
	*/
	
	public function __construct(){
		parent::__construct();
		setHeader( 'admin/Notificationlogs_model' );
	}
	
	public function getFilter(){
		$data =	getData();
		// print_r( $data );
		$views = null;
		if( isset( $data[ 'filterBy' ] ) ){
			switch( $data['filterBy'] ){
				case 1:
						$views = $this->model->getFullName( $data );
					break;
				case 2:
						$views = $this->model->getUserName( $data );
					break;
				case 3:
						// $views = $this->model->getUserType();
						$views = array(
									array(
										'id'	=>	0
										,'name'	=>	'All'
									)
									,array(
										'id'	=>	1
										,'name'	=>	'Super Admin'
									)
									,array(
										'id'	=>	2
										,'name'	=>	'Administrator'
									)
									,array(
										'id'	=>	3
										,'name'	=>	'Teacher'
									)
									,array(
										'id'	=>	4
										,'name'	=>	'Student'
									)
								);
					break;
				case 4:
						$views = $this->model->getModule();
					break;
				
			}
			
				array_unshift($views, array( 'id' => 0, 'name' => 'All') );
			die( json_encode( array( 'sucess' => true, 'view' => $views ) ) );
		}else{
			die( json_encode( array( 'success' => true, 'match' => '0' ) ) );
		}
			
	}
	
	public function retrieveData(){
		$data	=	getData();
		
		
		$data['pdf'] = false; $data['cnt'] = false;
		$view = $this->model->getHistory( $data );
		$data['pdf'] = true; $data['cnt'] = true;
		$count = $this->model->getHistory( $data );
		die( json_encode( array( 'success' => true, 'view' => $view, 'total' => $count ) ) );
	}
	
	public function getHistory(){
	$params = getData();
	
	
		$params['pdf'] = false; $params['cnt'] = false;
		$view = $this->model->getHistory( $params );
		$params['pdf'] = true; $params['cnt'] = true;
		$count = $this->model->getHistory( $params );
		die( json_encode( array( 'success' => true, 'total' => $count, 'view' => $view ) ) );
	}

	public function closeYear(){
		// $data = getData();
		if(backupAndDelete( getData() )){
			die(
				array(
					'success' => true
					,'match' => 1
					)
				);
		}
			die(
				array(
					'success' => true
					,'match' => 0
					)
				);
	}
}