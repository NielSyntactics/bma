<?php

class Autoe extends CI_Controller { 
	public function __construct(){
		parent::__construct();
		if(isset($_SERVER['SERVER_SOFTWARE']) && strpos($_SERVER['SERVER_SOFTWARE'],'Google App Engine') !== false){
			$this->folder   = 'gs://bontilaoapp/backup/';
		}else{
			$this->folder   = './backup/';
		}
	}
	
	public function index(){    
	        $this->backup( );
	}
	
	function backup(){
		date_default_timezone_set('Asia/Manila');
		$folder = $this->folder;
		$host=":/cloudsql/bontilaoapp:bma1";
		$user="root";
		$pass="TZ8jlgA1a5ZSF7P";
		$name="bma_ogs";
		$tables = '*';
		$return = '';

		$link = mysql_connect(':/cloudsql/bontilaoapp:bma1', 'root', 'TZ8jlgA1a5ZSF7P');

		// $link = mysql_connect($host,$user,$pass);
		mysql_select_db($name,$link);
		  
		  // get all of the tables
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
	
	function rmdir($dirname) {
		$dir_handle = null;
	   if (is_dir($dirname))
		  $dir_handle = opendir($dirname);
	   if (!$dir_handle)
		  return false;
	   while($file = readdir($dir_handle)) {
		  if ($file != "." && $file != "..") {
			 if (!is_dir($dirname."/".$file))
				unlink($dirname."/".$file);
			 else
				rmdir($dirname.'/'.$file);    
		  }
	   }
	   closedir($dir_handle);
	   rmdir($dirname);
	   return true;
	}
	
	function rmkdir($path, $mode = 0755) {
		$path = rtrim(preg_replace(array("/\\\\/", "/\/{2,}/"), "/", $path), "/");
		$e = explode("/", ltrim($path, "/"));
		if(substr($path, 0, 1) == "/") {
			$e[0] = "/".$e[0];
		}
		$c = count($e);
		$cp = $e[0];
		for($i = 1; $i < $c; $i++) {
			if(!is_dir($cp) && !@mkdir($cp, $mode)) {
				return false;
			}
			$cp .= "/".$e[$i];
		}
		return @mkdir($path, $mode);
	}
	
	function checkfilename($file){
		$cnt=0;
		while(file_exists($this->folder.'/'.$file.'.sql')){
			$cnt++;
			$file.='_'.$cnt;
		}
		return $file;
	}
	
}
?>
