<?php
/** User settings module
  * [Developer]
  * Developer: Mark Reynor D. Magriña
  * Date Created: May. 17, 2018
  * Date Finished: May. 17, 2018
  
  * [Database]
	bgsu, modules, amodules, and class
	
  * [Description]
	This module allows the authorized administrators to set (add, edit or delete) users who will be allowed to access the system. 
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Bandr extends CI_Controller {
	
	/* class constructor
	 * initialization of classes to be loaded are all here(libraries not included in the auto load config)
	*/
	public function __construct(){
		parent::__construct();
		setHeader( 'admin/bandr_model' );
		$this->folder = './backup';
	}	

	function backupdb($autoBackup = 0){
		
		/**
			ongoing revised autobackup. making a functionality that will backup all the database
		**/
		// ini_set('memory_limit','32M');
		$folder  = './backup';
		if(! file_exists($folder)){
			$this->rmkdir($folder);
		}
		$return   = dbpasskey . "\n\n";
		
		if($autoBackup == 1){
			$data = $this->model->GetBackUp();			
			$day = date('w') + 1;
			$hour  = date('H:i');

			if($data[0]['day'] != $day || date('H:i',strtotime($data[0]['time'])) != $hour){
				die;
			}
		}
		
		$this->load->database('default',true);
		
		$this->load->dbutil(); // Load the DB utility class
		$prefs = array(
			'tables'      => array(),  					
			'ignore'      => array('backuphistory','autobackup'),          
			'format'      => 'txt',            
			'filename'    => 'mybackup.sql',  	
			'add_drop'    => TRUE,             
			'add_insert'  => TRUE,             
			'newline'     => "\n" 
		);
		
		$return .= $this->dbutil->backup($prefs);
		$this->db = $this->load->database('default',true);
		$return = $this->encrypt->encode($return);
		$fname  = $folder.'/dbbackup_'.$this->userName.'_'.date('Ymd_Hi');
		$fname = $this->checkfilename($fname);
		
		$file_  = $fname;
		$handle = fopen($file_,'w');
		fwrite($handle,$return);
		fclose($handle); 
		
		setLogs(
			array(
				// 'description' => $this->fullname . ' back-up the datebase: ' . $file_
				'description' => 'Backed-up the database.'
				,'bmapsUID' => $this->userID
				,'idmodule' => 6
			)
		);
		
		die(json_encode( array('success'=>true,'filename'=>$fname) ));
	}
	
	function checkfilename($file,$ext='sql'){
		$cnt=0;
		$fileFinal = $file;
		while(file_exists($file.'.'.$ext)){
			$cnt++;
			$file = $fileFinal.'_'.$cnt;
		}
		if($cnt != 0)
			$fileFinal = $fileFinal.'_'.$cnt;
		
		return $fileFinal.'.'.$ext;
	}
	
	function Retrieve(){
		array_multisort( array_map( 'filemtime', ( $arrFiles = glob( $this->folder.'/*.sql', GLOB_BRACE ) ) ), SORT_DESC, $arrFiles );
		$arrView = array();
		$ident = 0;
		
		foreach($arrFiles as $key=>$val){
			$ident = $ident + 1;
			$filename = explode("/", $val);
			
			if(pathinfo($val, PATHINFO_EXTENSION) == 'sql'){
				$valexp = explode('_',$val);
				$bdate = substr($valexp[2],0,4).'-'.substr($valexp[2],4,2).'-'.substr($valexp[2],6,2);
				$ttime = date('h:i A',strtotime($bdate.' '.(substr($valexp[3],0,2).':'.substr($valexp[3],2,2))));
				$arrView[] = array(
					'bdate'=>date('m/d/Y',strtotime($bdate))
					,'btime'=>$ttime
					,'filename'=>$filename[2]
					,'user'=>$valexp[1]
					,'ident'=> $ident
				);
			}
		}
		
		die(json_encode( array('total'=>count($arrView),'view'=>$arrView) ));
	}

	function checkPassword(){
		$res	 = 0;
		$confirm = $this->model->checkPassword();
		if($confirm)$res = 1;
		die(json_encode( array('confrm'=>$res) ));
	}

	function restoreFile(){
		$histFile = $this->input->post('filenameHIST');
		$filename = ($this->input->post('tag')) ? './backup/'.$histFile : $_FILES['extfilefield']['tmp_name'];
		
		$this->db->trans_begin();
		
		$histFile = $this->input->post('filenameHIST');
		$templine = '';
		
		$lines = file_get_contents($filename);
		
		try{
			$file = $this->encrypt->decode($lines);
			
			$file_  = './backup/tempfiledb'.time().'.sql';	
			$handle = fopen($file_,'w');
			fwrite($handle,$file);
			fclose($handle);
			
			$lines = file($file_);
			unlink($file_);
			if(count($lines) == 0){
				die(json_encode(array('success'=>true,'trigger'=>1)));
			}
			
			if(isset($lines[0]) && trim($lines[0]) != dbpasskey){
				die(json_encode( array('success'=>true,'trigger'=>1) ));
			}
			
			$this->db->db_debug = FALSE;
			foreach ($lines as $k => $line){
				if($k == 0 && trim($line) == dbpasskey) continue;
				if (substr($line, 0, 2) == '--' || $line == '') continue;
					
				$templine .= $line;
				if (substr(trim($line), -1, 1) == ';'){
					$this->db->query($templine);
					$templine = '';
				}
			}
			
			if($this->db->trans_status()){
				$this->db->trans_commit();
				setLogs(
					array(
						'description' => $this->fullname .' restored the backup file, '. $histFile
						,'bmapsUID' => $this->userID
						,'idmodule' => 6
					)
				);
				
				$this->db->db_debug = TRUE;
				die(json_encode(array('success'=>true,'trigger'=>0)));
			}else{
				$this->db->trans_rollback();
				$this->db->db_debug = TRUE;
				
				die(json_encode(array('success'=>true,'trigger'=>2)));
			}
		}
		catch(Exception $e){
			$this->db->trans_rollback();
			die(json_encode(array('success'=>true,'trigger'=>1)));
		}
	}
	
	function download($filename,$fileExt=''){
		$data = file_get_contents($this->folder.'/'.$filename.'.'.$fileExt);
		$name = '\\'.$filename.'.'.$fileExt;
		force_download2($name, $data);
	}
	
	function deleteRecord(){
		setLogs( array(
			'description' => $this->fullname .' deleted the backup file, '. $this->input->post('file')
			,'bmapsUID' => $this->userID
			,'idmodule' => 6
		));
		unlink("./backup/".$this->input->post('file'));
	}

	function downloadMulti(){
		$post = getData();
		$this->load->library('zip');
		$data = json_decode($post['files'],true);
		$unameget =$this->session->userdata('BMAPSUNAME');
		$uname = ((isset($unameget->username))? $unameget->username : 'undefined');
		$fname = "fullbackup_".$uname.".zip";
		$filename = $this->folder."/".$fname;
		if(file_exists($filename)) unlink($filename);
		foreach($data as $rs){
			$this->zip->read_file($this->folder."/".$rs['filename']);
		}
		$this->zip->archive($filename);
		die(json_encode(array('filename'=>$fname)));
	}

	

	function setLog(){
		$data = getData();
		
		setLogs(
			array(
				'description' => $data[ 'desc' ]
				,'bmapsUID' => $this->userID
				,'idmodule' => 6
			)
		);
	}
	
}