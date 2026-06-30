<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Archive extends CI_Controller {
	
	/* class constructor
	 * initialization of classes to be loaded are all here(libraries not included in the auto load config)
	*/
	
	public function __construct(){
		parent::__construct();
		setHeader( 'admin/Archive_model' );
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

	function getSchoolYears(  ){

		$view = $this->model->getSchoolYears( getData() );

		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					)
				)
			);
	}

	function getFilter( ){
		$params = getData();
		// $params[ 'cnt' ] = false;
		$view = $this->model->getFilter( $params );
		// $params[ 'cnt' ] = true;
		// $total = $this->model->getFilter( $params );
		array_unshift( $view , array( 'id' => 0, 'name' => 'All' ));
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					)
				)
			);
	}

	function updateSchoolYear( ){
		$params = getData();
		$success = true;
		$this->db->trans_begin();
		$fileName = '';
		/* check if done already */
		if($this->model->checkSchoolYear( getData() )){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 1
						)
					)
				);
		}

		$this->model->updateSchoolYear( $params );
		/* Archive if true */
		$num = 2;
		if(  $params[ 'closingType' ] == 2  ){
			$fileName = DBBackup(  );
			backupAndDelete( $params );
			$num = 3;
		}

		if( $this->db->trans_status() === FALSE ){
			$this->db->trans_rollback();
			$success = false;
		}
		else{
			$this->db->trans_commit();
		}

		die(
			json_encode(
				array(
					'success' => $success
					,'match' => $num
					,'file' => $fileName
					)
				)
			);

	}

	
	function download($filename){
		$folder = './backup';
		if(isset($_SERVER['SERVER_SOFTWARE']) && strpos($_SERVER['SERVER_SOFTWARE'],'Google App Engine') !== false){
			$folder   = 'gs://bontilaoapp/backup';
		}
		$data = file_get_contents($folder.'/'.$filename);
		$name = '\\'.$filename;
		force_download_backup($name, $data);
	}
}