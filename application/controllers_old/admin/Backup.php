<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Backup extends CI_Controller {
	
	/* class constructor
	 * initialization of classes to be loaded are all here(libraries not included in the auto load config)
	*/
	
	public function __construct(){
		parent::__construct();
		if(isset($_SERVER['SERVER_SOFTWARE']) && strpos($_SERVER['SERVER_SOFTWARE'],'Google App Engine') !== false){
			$this->folder   = 'gs://bontilaoapp/backup/';
		}else{
			$this->folder   = './backup/';
		}
	}
	
	public function backup(){
		
		date_default_timezone_set('Asia/Manila');
		$folder = $this->folder;
		$host=":/cloudsql/bontilaoapp:bma1";
		$user="root";
		$pass="TZ8jlgA1a5ZSF7P";
		$name="bma_ogs";
		$tables = '*';
		$return = '';

		$link = mysql_connect(':/cloudsql/bontilaoapp:bma1', 'root', 'TZ8jlgA1a5ZSF7P');
		mysql_select_db($name,$link);
		if($tables == '*'){
			$tables = array();
			$result = mysql_query('SHOW TABLES');
			while($row = mysql_fetch_row($result)){
				$tables[] = $row[0];
			}
		}
		else{
			$tables = is_array($tables) ? $tables : explode(',',$tables);
		}
		  
		foreach($tables as $table){
			$result = mysql_query('SELECT * FROM '.$table);
			$num_fields = mysql_num_fields($result);
			
			$return.= 'DROP TABLE '.$table.';';
			$row2 = mysql_fetch_row(mysql_query('SHOW CREATE TABLE '.$table));
			$return.= "\n\n".$row2[1].";\n\n";
			
			for ($i = 0; $i < $num_fields; $i++){
				while($row = mysql_fetch_row($result)){
					$return.= 'INSERT INTO '.$table.' VALUES(';
					for($j=0; $j<$num_fields; $j++){
						$row[$j] = addslashes($row[$j]);
						$row[$j] = preg_replace("/\r\n/","\\r\\n",$row[$j]);
						if (isset($row[$j])) { $return.= '"'.$row[$j].'"' ; } else { $return.= '""'; }
						if ($j<($num_fields-1)) { $return.= ','; }
					}
					$return.= ");\n";
				}
			}
			$return.="\n\n\n";
		}
		$uname = $this->session->userdata('BGSUNAME');
		$file_  = $folder.''.$this->checkfilename('dbbackup_'.$uname.'_'.date('Ymd_Hi')).'.sql';
		$this->load->helper('file'); // Load the file helper and write the file to your server
		write_file($file_, $return);
	}
	
	function checkfilename($file){
		$cnt=0;
		while(file_exists($this->folder .''. $file.'.sql')){
			$cnt++;
			$file.='_'.$cnt;
		}
		return $file;
	}
}