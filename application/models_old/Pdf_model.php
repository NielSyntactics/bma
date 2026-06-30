<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Pdf_model extends CI_Model {

    public function __construct()
    {
        parent::__construct();
		$this->load->database(); 
    }

	//function pdfexport($path,$path2,$arrayresult1,$arrayresult2,$arrayresult3=''){	
	function pdfexport($viewData,$report_name,$orientation=0){	
		$base_path = "/home/devt/public_html/sacpos/pdf/";
		$filename = $report_name;
		$html_handle = fopen($base_path . $filename, "w+");
		fwrite($html_handle, $viewData);
		fclose($html_handle);
		exec("chmod 777 " . $base_path . $filename);
		if($orientation == 0)
			exec("/usr/bin/php ".$base_path."dompdf/dompdf.php  -- " . $base_path . $filename);
		else
			exec("/usr/bin/php ".$base_path."dompdf/dompdf.php -o landscape -p letter -- " . $base_path . $filename);
			
		exec("chmod 777 " . $base_path . "a.pdf");		
	}		
}	
?>