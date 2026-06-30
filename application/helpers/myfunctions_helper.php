<?php

function viewPDF($parameter){
	if(isset($_SERVER['SERVER_SOFTWARE']) && strpos($_SERVER['SERVER_SOFTWARE'],'Google App Engine') !== false){
		$directoryPath  = 'gs://bontilaoapp/';
		$parameter['file_name'] = str_replace("%20"," ",$parameter['file_name']);
		$filename = $parameter['file_name'].'.pdf';
		header('Content-type: application/pdf');
		header('Content-Disposition: inline; filename="' . $filename . '"');
		header('Content-Transfer-Encoding: binary');
		header('Accept-Ranges: bytes');
		@readfile($directoryPath.'pdf/'.$parameter['folder_name'].'/'.$parameter['file_name'].'.pdf');
	}
}

if(!function_exists('writeCsvFile')){
	function writeCsvFile($parameter){
		/* PARAMETER VALUE
			csvarray -  content sa csv
			directory -  folder name sa csv
			title -  file name sa csv
		*/
		$CIsess =& get_instance();
		$CIsess->load->helper('csv');
		$csvarray = array_to_csv($parameter['csvarray']);
		if(isset($_SERVER['SERVER_SOFTWARE']) && strpos($_SERVER['SERVER_SOFTWARE'],'Google App Engine') !== false){
			$path = 'gs://bontilaoapp/csv/'.$parameter['directory'].'/'.$parameter['title'].'.csv';
		}
		else{
			$path = './csv/'.$parameter['directory'].'/'.$parameter['title'].'.csv';
		}
		write_file($path,$csvarray);
	}
}

if(!function_exists('resize_image')){
	function resize_image($file, $size, $output = 'file', $width = 200, $height = 200, $proportional = false, $delete_original = true, $use_linux_commands = false ){
      
		if ( $height <= 0 && $width <= 0 ) return false;

		# Setting defaults and meta
		$info                         = getimagesize($file);
		$image                        = '';
		$final_width                  = 0;
		$final_height                 = 0;
		list($width_old, $height_old) = $info;

		# Calculating proportionality
		if ($proportional) {
			if      ($width  == 0)  $factor = $height/$height_old;
			elseif  ($height == 0)  $factor = $width/$width_old;
			else                    $factor = min( $width / $width_old, $height / $height_old );

			$final_width  = round( $width_old * $factor );
			$final_height = round( $height_old * $factor );
		}
		else {
			$final_width = ( $width <= 0 ) ? $width_old : $width;
			$final_height = ( $height <= 0 ) ? $height_old : $height;
		}

		# Loading image to memory according to type
		switch ( $info[2] ) {
			case IMAGETYPE_GIF:   $image = imagecreatefromgif($file);   break;
			case IMAGETYPE_JPEG:  $image = imagecreatefromjpeg($file);  break;
			case IMAGETYPE_PNG:   $image = imagecreatefrompng($file);   break;
			default: return false;
		}
    
    
		# This is the resizing/resampling/transparency-preserving magic
		$image_resized = imagecreatetruecolor( $final_width, $final_height );
		if ( ($info[2] == IMAGETYPE_GIF) || ($info[2] == IMAGETYPE_PNG) ){
			$transparency = imagecolortransparent($image);

			if ($transparency >= 0) {
				$transparent_color  = imagecolorsforindex($image, $trnprt_indx);
				$transparency       = imagecolorallocate($image_resized, $trnprt_color['red'], $trnprt_color['green'], $trnprt_color['blue']);
				imagefill($image_resized, 0, 0, $transparency);
				imagecolortransparent($image_resized, $transparency);
			}
			elseif ($info[2] == IMAGETYPE_PNG) {
				imagealphablending($image_resized, false);
				$color = imagecolorallocatealpha($image_resized, 0, 0, 0, 127);
				imagefill($image_resized, 0, 0, $color);
				imagesavealpha($image_resized, true);
			}
		}
		imagecopyresampled($image_resized, $image, 0, 0, 0, 0, $final_width, $final_height, $width_old, $height_old);
    
		# Taking care of original, if needed
		if ( $delete_original ) {
			if ( $use_linux_commands ) exec('rm '.$file);
			else @unlink($file);
		}

		# Preparing a method of providing result
		switch ( strtolower($output) ) {
			case 'browser':
				$mime = image_type_to_mime_type($info[2]);
				header("Content-type: $mime");
				$output = NULL;
				break;
			case 'file':
				$output = $file;
				break;
			case 'return':
				return $image_resized;
				break;
			default:
				break;
		}
    
		# Writing image according to type to the output destination
		switch ( $info[2] ) {
			case IMAGETYPE_GIF:   imagegif($image_resized, $output);    break;
			case IMAGETYPE_JPEG:  imagejpeg($image_resized, $output);   break;
			case IMAGETYPE_PNG:   imagepng($image_resized, $output);    break;
			default: return false;
		}
		
		return true;
	}
}

if(!function_exists('setsession')){
	function setsession($key=array(),$val=''){
		$CIsess =& get_instance();
		if(is_array($key) && count($key)>0){
			$CIsess->session->set_userdata($key);
		}
		if(is_string($key) && strlen($key)>0 && strlen($val)>0){
			$CIsess->session->set_userdata($key,$val);
		}
	}
}

if(!function_exists('getsession')){
	function getsession($str=''){
		$CIsess =& get_instance();
		if(strlen($str)==0)return;
		return $CIsess->session->userdata($str);
	}
}

if(!function_exists('unsetsession')){
	function unsetsession($key=array(),$val=''){
		$CIsess =& get_instance();
		if(is_array($key) && count($key)>0){
			$CIsess->session->unset_userdata($key);
		}
		if(is_string($key) && strlen($key)>0 && strlen($val)==0){
			$CIsess->session->unset_userdata($key,$val);
		}
	}
}

if(!function_exists('setflash')){
	function setflash($key=array(),$val=''){
		$CIsess =& get_instance();
		if(is_array($key) && count($key)>0){
			$CIsess->session->set_flashdata($key);
		}
		if(is_string($key) && strlen($key)>0 && strlen($val)>0){
			$CIsess->session->set_flashdata($key,$val);
		}
	}
}

if(!function_exists('getflash')){
	function getflash($str=''){
		$CIsess =& get_instance();
		if(strlen($str)==0)return;
		return $CIsess->session->flashdata($str);
	}
} 

if(!function_exists('getheader')){
	function getheader(){
		/*
			NOTE: this function is used only for portrait reports
		*/
		$pdfsess =& get_instance();
		$allHeaders = $pdfsess->home->getCompanyDetails( $pdfsess->session->userdata( 'DBNAME' ) );
		$company 	= $allHeaders->companyName;
		$location	= $allHeaders->companyLocation;
		$contact	= $allHeaders->companyContactNumber;
	
		$pdfsess->pdf->SetFont('helvetica', 'B', 8);
		$pdfsess->pdf->SetXY(30,7); $pdfsess->pdf->Cell(0, 0, $company, 0, $ln=1, 'R');
		$pdfsess->pdf->SetXY(30,11); $pdfsess->pdf->Cell(0, 0, $location, 0, $ln=1, 'R');
		$pdfsess->pdf->SetXY(30,15); $pdfsess->pdf->Cell(0, 0, $contact, 0, $ln=1, 'R');
		$pdfsess->pdf->Ln(5);
		
	}
}

if(!function_exists('getlogo')){
	function getlogo(){
		/*
			NOTE: com_logo column in tbl_customers must not be empty, 
			otherwise the 'LOGO NOT FOUND' image will appear on the report
		*/
		/*
			NOTE: this function is used only for portrait reports
		*/
		//assign CI instance to object variable
		$pdfsess =& get_instance();

		$imgurl  = $pdfsess->home->getCompanyDetails( $pdfsess->session->userdata( 'DBNAME' ) )->companyLogo;
		
		$imagefile = file_exists( domainFileFolder() .'/'. $imgurl )? domainFileFolder() .'/'. $imgurl : 'images/getitrightlogo.jpg'; 
		
		
		//break string to get the image extension and use as image type in tcpdf
		$ext   = explode('.',$imagefile); 
		
		// Image ($file, $x='', $y='', $w=0, $h=0, $type='', $link='', $align='', $resize=false, $dpi=300, $palign='', $ismask=false, $imgmask=false, $border=0, $fitbox=false, $hidden=false, $fitonpage=false, $alt=false, $altimgs=array())
		$pdfsess->pdf->SetFillColor(0, 0, 0);
        $pdfsess->pdf->Image($imagefile, 0, 5, 50, 27, $ext[count($ext)-1], false, 'T', false, 150, 'L', false, false, 0, false, false, false);
		// $pdfsess->pdf->Cell(10, 20, 'try', 1, $ln=0, 'L');
		$pdfsess->pdf->Ln(25);
	}
}

if( !function_exists( 'logoHeader' ) ){
	function logoHeader( $params ){
		$ci        =& get_instance();
		$addPage   = isset( $params['addPage'] )? $params['addPage'] : true;
		
		if( $addPage ){
			$ci->pdf->AddPage( $params['orientation'] );
		}
		
		$imagefile = file_exists( 'images/logo/'.$ci->session->userdata('LOGONAME') )? 'images/logo/'.$ci->session->userdata('LOGONAME') : 'images/empty.jpg'; 
		// $imagefile = 'images/empty.jpg'; 
		$ext       = explode( '.', $imagefile ); 
		// print_r( file_exists( 'images/logo/'.$ci->session->userdata('LOGONAME') ) );
		
		/* COMPANY LOGO */
		$ci->pdf->SetFillColor( 0, 0, 0 );
        $ci->pdf->Image( $imagefile, 0, 5, 50, 27, $ext[count($ext)-1], false, 'T', false, 150, 'L', false, false, 0, false, false, false );

		/* COMPANY HEADER */
		// print_r($ci->session->userdata); 
		$ci->pdf->SetFont( 'helvetica', 'B', 8 );
		$ci->pdf->SetXY( 57, 7 );  $ci->pdf->Cell( 0, 0, $ci->session->userdata('COMPANYNAME'), 0, $ln=1, 'L' );
		// $ci->pdf->SetXY( 57, 7 );  $ci->pdf->Cell( 0, 0, $ci->companyName, 0, $ln=1, 'L' );
		// $ci->pdf->SetXY( 57, 11 ); $ci->pdf->Cell( 0, 0, $ci->tagLine, 0, $ln=1, 'L' );
		$ci->pdf->Ln( 20 );
		
		/* PDF TITLE */
		if( $addPage ){
			$ci->pdf->SetFont( 'freesans', 'B', 8 );
			$ci->pdf->MultiCell( 0, 5, $params['title'], 0, 'C', false, 1, '', '', true, 0, '' );
			$ci->pdf->Ln( 5 );
		}
	}
}

if(!function_exists('getfooter')){
	function getfooter($index=0){
		$pdfsess =& get_instance();
		
		$pdfsess->pdf->Ln(10);
		$pdfsess->pdf->SetFont('helvetica', 'B', 10);
		$pdfsess->pdf->Cell(30, 5, 'PREPARED BY:', 0, 0, 'L');
		$pdfsess->pdf->Cell(50, 5, $pdfsess->userfullname, $border='B', 0, 'L');
	}
}

if(!function_exists('getData')){
	function getData( $secure = true ){
		$ci     =& get_instance();
		$headers = getallheaders();
		
		// if( $secure ){
			// if( !isset( $headers['initHeader'] ) ){
				// die();
			// }
			// elseif( $headers['initHeader'] != $ci->session->userdata( 'initHeader' ) ){
				// die();
			// }
		// }
		
		$data   = array();
		$module = $ci->input->post('module');
		if( isset( $_POST ) ){
			foreach($_POST as $key => $val){
				$value         = $ci->input->post($key);
				$without_comma = str_replace(",","",$value);
				$key_module    = str_replace($module,'',$key);
				$key_module    = str_replace("-inputEl",'',$key_module);
				
				if($key_module == 'reset'){
					die(json_encode(array('success'=>true, 'total'=>0, 'view'=>array())));
				}
				else if(is_numeric($without_comma))$value = $without_comma;
				else if($value == '') $value = null;
				
				$data[$key_module] = $value;
			}
			
		}
		else{
			die(json_encode( array('success'=>false) ));
		}
		
		return $data;
	}
}

if(!function_exists('resize_image')){
	function resize_image($file, $size, $output = 'file', $width = 200, $height = 200, $proportional = false, $delete_original = true, $use_linux_commands = false ){
      
		if ( $height <= 0 && $width <= 0 ) return false;

		# Setting defaults and meta
		$info                         = getimagesize($file);
		$image                        = '';
		$final_width                  = 0;
		$final_height                 = 0;
		list($width_old, $height_old) = $info;

		# Calculating proportionality
		if ($proportional) {
			if      ($width  == 0)  $factor = $height/$height_old;
			elseif  ($height == 0)  $factor = $width/$width_old;
			else                    $factor = min( $width / $width_old, $height / $height_old );

			$final_width  = round( $width_old * $factor );
			$final_height = round( $height_old * $factor );
		}
		else {
			$final_width = ( $width <= 0 ) ? $width_old : $width;
			$final_height = ( $height <= 0 ) ? $height_old : $height;
		}

		# Loading image to memory according to type
		switch ( $info[2] ) {
			case IMAGETYPE_GIF:   $image = imagecreatefromgif($file);   break;
			case IMAGETYPE_JPEG:  $image = imagecreatefromjpeg($file);  break;
			case IMAGETYPE_PNG:   $image = imagecreatefrompng($file);   break;
			default: return false;
		}
    
    
		# This is the resizing/resampling/transparency-preserving magic
		$image_resized = imagecreatetruecolor( $final_width, $final_height );
		if ( ($info[2] == IMAGETYPE_GIF) || ($info[2] == IMAGETYPE_PNG) ){
			$transparency = imagecolortransparent($image);

			if ($transparency >= 0) {
				$transparent_color  = imagecolorsforindex($image, $trnprt_indx);
				$transparency       = imagecolorallocate($image_resized, $trnprt_color['red'], $trnprt_color['green'], $trnprt_color['blue']);
				imagefill($image_resized, 0, 0, $transparency);
				imagecolortransparent($image_resized, $transparency);
			}
			elseif ($info[2] == IMAGETYPE_PNG) {
				imagealphablending($image_resized, false);
				$color = imagecolorallocatealpha($image_resized, 0, 0, 0, 127);
				imagefill($image_resized, 0, 0, $color);
				imagesavealpha($image_resized, true);
			}
		}
		imagecopyresampled($image_resized, $image, 0, 0, 0, 0, $final_width, $final_height, $width_old, $height_old);
    
		# Taking care of original, if needed
		if ( $delete_original ) {
			if ( $use_linux_commands ) exec('rm '.$file);
			else @unlink($file);
		}

		# Preparing a method of providing result
		switch ( strtolower($output) ) {
			case 'browser':
				$mime = image_type_to_mime_type($info[2]);
				header("Content-type: $mime");
				$output = NULL;
				break;
			case 'file':
				$output = $file;
				break;
			case 'return':
				return $image_resized;
				break;
			default:
				break;
		}
    
		# Writing image according to type to the output destination
		switch ( $info[2] ) {
			case IMAGETYPE_GIF:   imagegif($image_resized, $output);    break;
			case IMAGETYPE_JPEG:  imagejpeg($image_resized, $output);   break;
			case IMAGETYPE_PNG:   imagepng($image_resized, $output);    break;
			default: return false;
		}
		
		return true;
	}
}


/** This function will check if image exits by URL **/
if( !function_exists( 'is_url_exist' ) ){
	function is_url_exist($url){
		if(isset($_SERVER['SERVER_SOFTWARE']) && strpos($_SERVER['SERVER_SOFTWARE'],'Google App Engine') !== false){
			if( !file_exists( $url ) ){
				return false;
			}
			else{
				return true;
			}
		}
		else{
			$ch = curl_init($url);    
			curl_setopt($ch, CURLOPT_NOBODY, true);
			curl_exec($ch);
			$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

			if($code == 200){
			   $status = true;
			}else{
			  $status = false;
			}
			curl_close($ch);
			
			return $status;
		}
	}
}

	
function generate_table($table_params=array(),$data=array(),$data1=array(),$extaTables='',$ExtableBottom=''){
	if(file_exists($table_params['folder_name'].$table_params['file_name'].'.pdf')){
		unlink($table_params['folder_name'].$table_params['file_name'].'.pdf');
	}
	
	ob_clean();
	$ci =& get_instance();
	if(!isset($table_params['table_hidden'])) $table_params['table_hidden'] = false;
		
	if((count($table_params) > 0 && count($data) > 0) || $table_params['table_hidden'] == true){
		if(!isset($table_params['title'])) die("title field is required");
		if(!isset($table_params['file_name'])) die("file_name field is required");
		if(!isset($table_params['folder_name'])) die("folder_name field is required");
		
		if(!isset($table_params['title_font_style'])) $table_params['title_font_style'] = 'B';
		if(!isset($table_params['title_font_size'])) $table_params['title_font_size'] = 8;
		if(!isset($table_params['grid_font_size'])) $table_params['grid_font_size'] = 10;
		if(isset($table_params['grid_font_style'])){
			if($table_params['grid_font_style'] == 'N') $table_params['grid_font_style'] = '';
		}else{
			$table_params['grid_font_style'] = '';
		}
		if(!isset($table_params['font_style'])) $table_params['font_style'] = 'helvetica';
		if(!isset($table_params['orientation'])) $table_params['orientation'] = 'P';
		if(!isset($table_params['date'])) $table_params['date'] = false;
		if(!isset($table_params['date_format'])) $table_params['date_format'] = 'm-d-Y';
		if(!isset($table_params['margin_bottom_after_title'])) $table_params['margin_bottom_after_title'] = 5;
		if(!isset($table_params['margin_bottom_after_date'])) $table_params['margin_bottom_after_date'] = 5;
		if(!isset($table_params['generate_total'])) $table_params['generate_total'] = false;
		if(!isset($table_params['table_width'])) $table_params['table_width'] = '100%';
		if($table_params['generate_total'] == true && !isset($table_params['total_fields'])) die("total_fields field is required");
		
		$noHeader = isset( $table_params['noHeader'] )? $table_params['noHeader'] : false;
		
		$marginFirst = isset( $table_params['marginFirst'] )? $table_params['marginFirst'] : 6;
		$marginSecond = isset( $table_params['marginSecond'] )? $table_params['marginSecond'] : 10;
		$printFooter = isset( $table_params['noFooter'] )? false : true;
		
		$ci->pdf->setPrintHeader(false);
		$ci->pdf->setPrintFooter($printFooter);
		$ci->pdf->SetMargins($marginFirst, $marginSecond); 
		
		$ci->pdf->AddPage($orientation=$table_params['orientation']);
		
		if( !$noHeader ){
			// if($table_params['orientation']=='P'){
				// getlogo();
				// getheader(); 
			// }else{
				// getlogo();
				// getheader(); 
			// }
			logoHeader( $table_params );
		}
		
		$ci->pdf->SetFont(trim($table_params['font_style']),trim($table_params['title_font_style']), $table_params['title_font_size']);
		$ci->pdf->Cell(0, 0,$table_params['title'], 0,true, 'C');
		$ci->pdf->Ln($table_params['margin_bottom_after_title']);
		
		$ci->pdf->SetFont(trim($table_params['font_style']),trim($table_params['grid_font_style']), $table_params['grid_font_size']);
		if($table_params['date'] == true){
			$ci->pdf->Cell(200, 5,'Date : '.Date($table_params['date_format']), 0,true, 'L');
			$ci->pdf->Ln($table_params['margin_bottom_after_date']);
		}
		$tbl  = $extaTables;
		if($table_params['table_hidden'] == false){
		$tbl .= '<br><table style="width:'.$table_params['table_width'].';border-collapse: collapse;" cellpadding="7" border = "1">';
			 $data_cnt = count($data);
			 $tbl .= '<tr style="background-color:#f1f1f1;">';
				 for($x=0;$x<$data_cnt;$x++){
					if(!isset($data[$x]['header'])) die('header title header is required.');
					if(!isset($data[$x]['data_index'])) die('data_index is required.');
					
					if(!isset($data[$x]['type']))  $data[$x]['type'] = 'text';
					
					if($data[$x]['type'] == 'numbercolumn'){
						if(!isset($data[$x]['decimalplaces'])) $data[$x]['decimalplaces'] = 2;
						 $data[$x]['data_align'] = 'right';
					}else if($data[$x]['type'] == 'datecolumn'){
						if(!isset($data[$x]['format'])) $data[$x]['format'] = 'm/d/Y';
						$data[$x]['data_align'] = 'left';
					}else{
						$data[$x]['data_align'] = 'left';
					}
					
					if(!isset($data[$x]['align'])) $data[$x]['align'] = 'C';
					
					if($data[$x]['align'] == 'L') $data[$x]['align'] = 'left';
					else if($data[$x]['align'] == 'R') $data[$x]['align'] = 'right';
					else if($data[$x]['align'] == 'C') $data[$x]['align'] = 'center';
					
					if(!isset($data[$x]['width'])) $data[$x]['width'] = number_format((100/$data_cnt),2)."%";
					
					$align = $data[$x]['align'];
					$width = $data[$x]['width'];
					$header = $data[$x]['header'];
					
					$tbl .= "<th style=\"width:$width;text-align:$align\"><strong>$header</strong></th>";
				 }
			 $tbl .= '</tr>';
			 $n = 0;
			 $v = 0;
			 $totalamount = array();
			 for($x=0;$x<count($data1);$x++){
				if($n % 2 == 0) $tbl .= '<tr>';
				else $tbl .= '<tr>';
				
				 for($y=0;$y<$data_cnt;$y++){
					foreach($data1[$x] as $key => $v1){
						if($data[$y]['data_index'] == $key){
							if($table_params['generate_total'] == true){
								foreach($table_params['total_fields'] as $val1 => $key1){
									if( is_array($key1) && $val1 == $key ){
										$totalamount[$y] = array($val1=>$v1); 
									}
									if($key1 == $key){
										if(isset($totalamount[$y][$val1])) $v = $totalamount[$y][$val1];
										else $v = 0;
										
										$v += $v1;
										$totalamount[$y] = array($val1=>$v); 
									}
								}
							}
							$align = $data[$y]['data_align'];
							if($data[$y]['type'] == 'numbercolumn'){ 	  
								$tbl .= "<td style=\"text-align:$align\">" .number_format($v1,$data[$y]['decimalplaces']). '</td>';
							}else if($data[$y]['type'] == 'datecolumn'){
								$v1 = str_replace('-', '/', $v1);
								$tbl .= "<td style=\"text-align:$align\">" .(!empty($v1) ? date($data[$y]['format'],strtotime($v1)):''). '</td>';
							}
							else if($data[$y]['type'] == 'autoInc'){
								$numberAuto = $x + 1;
								$tbl .= "<td style=\"text-align:$align\">" .$numberAuto. '</td>';
							}
							else{ 
								$tbl .= "<td style=\"text-align:$align\">" .$v1. '</td>';
							}
						} 
					}
				}
				$tbl .= '</tr>';
				$n++;
			}
		$b = 0;
		$trig = false;
		if(count($totalamount) > 0){	
			$tbl .= "<tr>";
			for($i=1;$i<$data_cnt;$i++){
				if(isset($totalamount[$i])){
					if($trig == false){ 
						$tbl .= "<td style=\"text-align:center;\"><strong>TOTAL :</strong></td>"; $trig = true;
					}
					foreach($totalamount[$i] as $v){
						$tbl .= '<td style="text-align:right;"><strong>'.number_format($v,$data[$i]['decimalplaces']).'</strong></td>';
					}
				}else{
					$tbl .= "<td></td>";
				}
			}
			$tbl .= "</tr>";
		}
		$tbl .= '</table><br>';
		}
		$tbl .= $ExtableBottom;
		$ci->pdf->writeHTML($tbl, true, false, false, false, '');
	  
	  // getfooter(1);
	  
		
	   if(isset($_SERVER['SERVER_SOFTWARE']) && strpos($_SERVER['SERVER_SOFTWARE'],'Google App Engine') !== false){
			$directoryPath  = 'gs://bontilaoapp/';
		}
		else{
			$directoryPath='./';
		}
		$ci->pdf->Output($directoryPath.$table_params['folder_name'].$table_params['file_name'].'.pdf', 'F');
	}
}

function generate_table_as_string($table_params=array(),$data=array(),$data1=array(),$extaTables='',$ExtableBottom=''){
			
		// if(count($data)>0 && count($data1)>0){
		if(count($data)>0){
		
			if(!isset($table_params['table_width'])) $table_params['table_width'] = '100%';
			if(!isset($table_params['grid_font_size'])) $table_params['grid_font_size'] = 10;
			if(!isset($table_params['table_title'])) $table_params['table_title'] = '';
			if(!isset($table_params['generate_total'])) $table_params['generate_total'] = false;
			if($table_params['generate_total'] == true && !isset($table_params['total_fields'])) die("total_fields field is required");
			
			$tbl  = $extaTables;
			$tbl .= '<br>';
			if(!empty($table_params['table_title'])){
				$tbl .= '<table cellpadding = "7" style = "width:'.$table_params['table_width'].';font-size:'.$table_params['grid_font_size'].'"><tr><td><strong>
						 '.$table_params['table_title'].'
						 </strong></td></tr></table>';
			}
			$tbl .= '<table style="width:'.$table_params['table_width'].';border-collapse: collapse;" cellpadding="7" border = "1">';
				$data_cnt = count($data);
				 $tbl .= '<tr style="background-color:#f1f1f1;">';
					 for($x=0;$x<$data_cnt;$x++){
						if(!isset($data[$x]['header'])) die('header title header is required.');
						if(!isset($data[$x]['data_index'])) die('data_index is required.');
						
						if(!isset($data[$x]['type']))  $data[$x]['type'] = 'text';
						
						if($data[$x]['type'] == 'numbercolumn'){
							if(!isset($data[$x]['decimalplaces'])) $data[$x]['decimalplaces'] = 2;
							 $data[$x]['data_align'] = 'right';
						}else if($data[$x]['type'] == 'datecolumn'){
							if(!isset($data[$x]['format'])) $data[$x]['format'] = 'm/d/Y';
							$data[$x]['data_align'] = 'left';
						}else{
							$data[$x]['data_align'] = 'left';
						}
						
						if(!isset($data[$x]['align'])) $data[$x]['align'] = 'C';
						
						if($data[$x]['align'] == 'L') $data[$x]['align'] = 'left';
						else if($data[$x]['align'] == 'R') $data[$x]['align'] = 'right';
						else if($data[$x]['align'] == 'C') $data[$x]['align'] = 'center';
						
						if(!isset($data[$x]['width'])) $data[$x]['width'] = number_format((100/$data_cnt),2)."%";
						
						$align = $data[$x]['align'];
						$width = $data[$x]['width'];
						$header = $data[$x]['header'];
						
						$tbl .= "<th style=\"width:$width;text-align:$align\"><strong>$header</strong></th>";
					 }
				 $tbl .= '</tr>';
				 $n = 0;
				 $v = 0;
				 $totalamount = array();
				 for($x=0;$x<count($data1);$x++){
					if($n % 2 == 0) $tbl .= '<tr>';
					else $tbl .= '<tr>';
					
					 for($y=0;$y<$data_cnt;$y++){
						foreach($data1[$x] as $key => $v1){
							if($data[$y]['data_index'] == $key){
								if($table_params['generate_total'] == true){
									foreach($table_params['total_fields'] as $val1 => $key1){
										if($key1 == $key){
											if(isset($totalamount[$y][$val1])) $v = $totalamount[$y][$val1];
											else $v = 0;
											
											$v += $v1;
											$totalamount[$y] = array($val1=>$v); 
										}
									}
								}
								$align = $data[$y]['data_align'];
								if($data[$y]['type'] == 'numbercolumn'){ 	  
									$tbl .= "<td style=\"text-align:$align\">" .number_format($v1,$data[$y]['decimalplaces']). '</td>';
								}else if($data[$y]['type'] == 'datecolumn'){
									$v1 = str_replace('-', '/', $v1);
									$tbl .= "<td style=\"text-align:$align\">" .( !empty($v1) ? date($data[$y]['format'],strtotime($v1)) : ''). '</td>';
								}else{ 
									$tbl .= "<td style=\"text-align:$align\">" .$v1. '</td>';
								}
							} 
						}
					}
					$tbl .= '</tr>';
					$n++;
				}
			$b = 0;
			$trig = false;
			if(count($totalamount) > 0){	
				$tbl .= "<tr>";
				for($i=1;$i<$data_cnt;$i++){
					if(isset($totalamount[$i])){
						if($trig == false){ 
							$tbl .= "<td style=\"text-align:center;\"><strong>TOTAL :</strong></td>"; $trig = true;
						}
						foreach($totalamount[$i] as $v){
							$tbl .= '<td style="text-align:right;"><strong>'.number_format($v,$data[$i]['decimalplaces']).'</strong></td>';
						}
					}else{
						$tbl .= "<td></td>";
					}
				}
				$tbl .= "</tr>";
			}
			$tbl .= '</table><br>';
			$tbl .= $ExtableBottom;
			
			return $tbl;
		}
	}
	


if(!function_exists('generateTcpdf')){
	function generateTcpdf( $params ){
		$ci =& get_instance();
		
		$ci->pdf->setPrintHeader( false );
		$ci->pdf->setPrintFooter( true );
		$ci->pdf->SetMargins( 6, 6 ); 
		
		if( empty( $params['file_name'] ) ){
			echo "file name is required";
		}
		if( empty( $params['folder_name'] ) ){
			echo "folder name is required";
		}
		if( empty( $params['records'] ) ){
			echo "records to be printed is required";
		}
		if( empty( $params['header'] ) ){
			echo "header to be printed is required";
		}
		
		$params['file_name']= str_replace( "%20", " ", $params['file_name'] );
		$orientation 		= isset( $params['orientation'] )? $params['orientation'] : 'P';
		$orientationWidth 	= ($orientation =='P')? 204 : 260;
		
		/* FOR GRID HEADER */
		$header_font_family = isset( $params['header_font_family'] )? trim($params['header_font_family']) : 'freesans';
		$header_font_style	= isset( $params['header_font_style'] )? trim($params['header_font_style']) : 'B';
		$header_font_size 	= isset( $params['header_font_size'] )? trim($params['header_font_size']) : '8';
		
		/* FOR GRID ROW */
		$row_font_family 	= isset( $params['row_font_family'] )? trim($params['row_font_family']) : 'freesans';
		$row_font_style 	= isset( $params['row_font_style'] )? trim($params['row_font_style']) : 'N';
		$row_font_size 		= isset( $params['row_font_size'] )? trim($params['row_font_size']) : '8';
		
		logoHeader( array( 'orientation'=>$orientation, 'title'=>$params['file_name'] ) );
		
		//HEADER FILTERS
		//Pls referer implementation on 'controller/po/invpurreport.php' function 'Monitoring_PDF'
		if(isset($params['header_fields'])){
			$ci->pdf->SetFont($row_font_family,'', 9);
			
			#GETTING THE MAX LENGTH FIELD AND VALUE PER COLUMN
			foreach($params['header_fields'] as $index => $container){
				$columnsWidth[] = array(
									'labelWidth' => isset($container['labelWidth']) ? $container['labelWidth'] : 30, 
									'valueWidth' => isset($container['valueWidth']) ? $container['valueWidth'] : 40
								);
				unset($params['header_fields'][$index]['labelWidth']);			
				unset($params['header_fields'][$index]['valueWidth']);			
			}
			
			$x = 5;	
			$y = $ci->pdf->GetY();	
			$oldY =  $y;
			$maxHeight = 0;
			foreach($params['header_fields'] as $index => $container){
				$stringHeightsValue = 0;
				$stringHeightsLabel = 0;
				$stringHeights = 0;
				$stringWidths = 0;
				
				foreach($container as  $data){
						$stringHeightsLabel = $ci->pdf->getStringHeight($columnsWidth[$index]['labelWidth'],$data['label']);
						$stringHeightsValue = $ci->pdf->getStringHeight($columnsWidth[$index]['valueWidth'],$data['value']);
						if($stringHeightsLabel > $stringHeightsValue){
							$stringHeights = $stringHeightsLabel;
						}else 
							$stringHeights = $stringHeightsValue;
						
						$ci->pdf->MultiCell(	
											$columnsWidth[$index]['labelWidth'],
											$stringHeights,
											$data['label'] . ' : ',
											$border = 0,
											$align = 'L',
											$fill = false,
											$ln = 0,
											$x,
											$y,
											$reseth = true,
											$stretch = 0,
											$ishtml = false,
											$autopadding = true,
											$maxh = 0,
											$valign = 'T',
											$fitcell = false 
										);	
						$ci->pdf->MultiCell(	
											$columnsWidth[$index]['valueWidth'],
											$stringHeights,
											$data['value'] ,
											$border = 0,
											$align = 'L',
											$fill = false,
											$ln = 1,
											'',
											'',
											$reseth = true,
											$stretch = 0,
											$ishtml = false,
											$autopadding = true,
											$maxh = 0,
											$valign = 'T',
											$fitcell = false 
										);	
										
						$y += $stringHeights;
						$stringWidths = $columnsWidth[$index]['labelWidth'] + $columnsWidth[$index]['valueWidth'];
				} 
				if($y > $maxHeight){
					$maxHeight = $y;
				}
				
				$y = $oldY; 
				$x += $stringWidths; 
			}
			
			$ci->pdf->setY($maxHeight);
			$ci->pdf->ln(5);
		}

		if(isset($params['header_fields1'])){
			$ci->pdf->SetFont($row_font_family,'', 9);
			
			#GETTING THE MAX LENGTH FIELD AND VALUE PER COLUMN
			foreach($params['header_fields1'] as $index => $container){
				$columnsWidth[] = array(
									'labelWidth' => isset($container['labelWidth']) ? $container['labelWidth'] : 30, 
									'valueWidth' => isset($container['valueWidth']) ? $container['valueWidth'] : 40
								);
				unset($params['header_fields1'][$index]['labelWidth']);			
				unset($params['header_fields1'][$index]['valueWidth']);			
			}
			
			$x = 5;	
			$y = $ci->pdf->GetY();	
			$oldY =  $y;
			$maxHeight = 0;
			foreach($params['header_fields1'] as $index => $container){
				$stringHeightsValue = 0;
				$stringHeightsLabel = 0;
				$stringHeights = 0;
				$stringWidths = 0;
				
				foreach($container as  $data){
						$stringHeightsLabel = $ci->pdf->getStringHeight($columnsWidth[$index]['labelWidth'],$data['label']);
						$stringHeightsValue = $ci->pdf->getStringHeight($columnsWidth[$index]['valueWidth'],$data['value']);
						if($stringHeightsLabel > $stringHeightsValue){
							$stringHeights = $stringHeightsLabel;
						}else 
							$stringHeights = $stringHeightsValue;
						
						$ci->pdf->MultiCell(	
											$columnsWidth[$index]['labelWidth'],
											$stringHeights,
											$data['label'] . ' : ',
											$border = 0,
											$align = 'L',
											$fill = false,
											$ln = 0,
											$x,
											$y,
											$reseth = true,
											$stretch = 0,
											$ishtml = false,
											$autopadding = true,
											$maxh = 0,
											$valign = 'T',
											$fitcell = false 
										);	
						$ci->pdf->MultiCell(	
											$columnsWidth[$index]['valueWidth'],
											$stringHeights,
											$data['value'] ,
											$border = 0,
											$align = 'L',
											$fill = false,
											$ln = 1,
											'',
											'',
											$reseth = true,
											$stretch = 0,
											$ishtml = false,
											$autopadding = true,
											$maxh = 0,
											$valign = 'T',
											$fitcell = false 
										);	
										
						$y += $stringHeights;
						$stringWidths = $columnsWidth[$index]['labelWidth'] + $columnsWidth[$index]['valueWidth'];
				} 
				if($y > $maxHeight){
					$maxHeight = $y;
				}
				
				$y = $oldY; 
				$x += $stringWidths; 
			}
			
			$ci->pdf->setY($maxHeight);
			$ci->pdf->ln(5);
		}
		
		
		
		$ci->pdf->SetFont($header_font_family,$header_font_style, $header_font_size);
		$headerCnt =  count($params['header']) -1 ;
		$headerInc=0;
		$border='';
		$ln=0;
		$headerHeight=0;
		$totalHeaderWithOutWidth=0;
		$remainingWidth=0;
		$decimalPlaces=0;
		
		$lastColumn = '';
		$ci->pdf->setCellHeightRatio(1.5);
		$ci->pdf->SetFillColor(240,240,240);
		
		
		
		/*calculate maximum header height*/
		foreach($params['header'] as $key=>$val){
			$cntHeaderHeight  =  $ci->pdf->getStringHeight($orientationWidth * ($val['width'] / 100),$val['header'],false,true,'',1);
			if($cntHeaderHeight > $headerHeight)	$headerHeight = $cntHeaderHeight;
			
		}
		
		//======================
		// $h1 = $params['header'];
		// print_r($h1);
		// echo '============ ';
		// array_splice($h1,8,1);
		// print_r($h1);
		//======================
		
		//======================
		$headers;
		$headerHeader_height =0;
		if(isset($params['sub_headers'])){
			
			$headers = $params['header'];
			
			foreach($params['sub_headers'] as $key){
				$FirstColumn = true;
				
				$headerHeaderWidth = 0;
				foreach($key['subheaders'] as $val){
					foreach($headers as $cols){
						if($cols['dataIndex'] == $val)	$headerHeaderWidth += floatval($cols['width']);
					}
				}
				
				foreach($key['subheaders'] as $val){
					for($x=0; $x<count($headers); $x++){
						if(isset($headers[$x])){
							
							if($headers[$x]['dataIndex'] == $val){
								if($FirstColumn){
									echo '============ X = '.$x;
									print_r($headers);
									echo ' ----------- output ';
									
									array_splice($headers,$x,1,array(array('Top'=>$key['header'],'dataIndex'=>'top_header','width'=>$headerHeaderWidth)));
									$FirstColumn = false;
									
									print_r($headers);
									echo '============';
								}
								else{
									echo '************* X = '.$x;
									
									array_splice($headers,$x,1);
									
									print_r($headers);
									echo '*************';
									}
								break;
							}
						}
					}
				}
			}
			
			foreach($headers as $key=>$val){
				$headerHeaderHeight  =  $ci->pdf->getStringHeight($orientationWidth * ($val['width'] / 100),isset($val['Top'])? $val['Top'] : '',false,true,'',1);
				if($headerHeaderHeight > $headerHeader_height)	$headerHeader_height = $headerHeaderHeight;
				
			}
			
			
			for($x=0; $x<count($headers); $x++){
				$width  = $orientationWidth * ($headers[$x]['width'] / 100);
				$text   = isset($headers[$x]['Top'])? $headers[$x]['Top'] : '';
				$border = isset($headers[$x]['Top'])? 'LTRB' : 'LTR';
				$nextln = $x==count($headers)-1? 1 : '';
				$ci->pdf->MultiCell($width,$headerHeaderHeight,$text,$border,'C',1, $nextln,'','', true,0,'');
			}
			
			
		}
		
		/* CHECK WHEATER ANY COLUMN HAS TOTAL OR HAS MAIN HEADER */
		$hasTotal = false;
		foreach($params['header'] as $key=>$val){
			
			if($headerInc==0) {
				$border = 'LRB';
			}
			else if($headerInc==$headerCnt){
				$ln=1;
				$border = 'LRB';
			}
			else{
				$border = 'LRB';
				$x='';$y='';
			}
			
			if(!isset($params['sub_headers']))$border .= 'T';
			
			
			if(isset($val['width'])) $width = $orientationWidth * ($val['width'] / 100);
			else{
				$width=$orientationWidth / count($params['header']);
			}
			
			
			if(isset($val['align'])) $align = $val['align'];
			else $align='C';
			
			
			$ci->pdf->MultiCell($width,$headerHeight,$text = $val['header'],$border,$align,1, $ln,'','', true,0,'');
			
			
			$headerInc++;
			$remainingWidth = $remainingWidth + (int)$width;  
			$lastColumn = $val['dataIndex'];
			
			if( isset( $val['hasTotal']) ){
				if( $val['hasTotal'] ){
					$hasTotal = true;
					$params['header'][$key]['total'] = 0;
				}
			}
		}
		

		/*
			paramsa sa pg kuha og records
		*/
		
		$recordCnt =  count($params['records']) -1;
		$recInc=0;
		$recLn=0;
		$headerInc=0;
		$rowHeight=0;
		
		
		
		
		
		
		
		
		
		$ci->pdf->SetFont($row_font_family,$row_font_style, $row_font_size);
		foreach($params['records'] as $key=>$val){
			$first_border_nextPage = false;
			
		
			/*calculate maximum record height per row*/
			foreach($params['header'] as $key=>$headerValRow){
				if(isset($headerValRow['width'])) 	$rowWidth = $orientationWidth * ($headerValRow['width'] / 100);
				else 								$rowWidth = $orientationWidth / count($params['header']);
				
				if(isset($val['height'])) $rowHeight = $val['height'];
				else{
					$recordVal = ($val[$headerValRow['dataIndex']])?$val[$headerValRow['dataIndex']]:'';
					$cntRecordHeight  =  $ci->pdf->getStringHeight($rowWidth,$rowTxt =$recordVal ,$reseth = false,$autopadding = true,$cellpadding = '',$border = 1);
					if(floatval($cntRecordHeight)	>= floatval($rowHeight)) $rowHeight = $cntRecordHeight;
				}
				
			}
			
			
			
			
			// echo $headerValRow['dataIndex'];
		
			foreach($params['header'] as $key=>$headerVal){
				if($headerInc==$headerCnt){
					$headerInc=0;
					$recLn=1;
					$recBorder  = 'LRB';
				}else{
					$recLn=0;
					$recBorder = 'LRB';
					$headerInc++;
				}
				
				if(isset($headerVal['width'])) $rowWidth = $orientationWidth * ($headerVal['width'] / 100);
				else $rowWidth=$orientationWidth / count($params['header']);
				
				$value = $val[$headerVal['dataIndex']];
				$align = 'L';
				
				
				if(isset($headerVal['type'])){
					if($headerVal['type'] == 'numbercolumn' || $headerVal['type'] == 'running'){
						$align   = 'R';
						$decimal = isset($headerVal['decimalplaces'])? intval($headerVal['decimalplaces']) : 2;
						$value   = (is_numeric($val[$headerVal['dataIndex']]))? number_format($val[$headerVal['dataIndex']],$decimal) : 0;
						
						// increment total per column
						if( isset( $headerVal['total'] ) ){
							$params['header'][$key]['total'] += ( float )$val[$headerVal['dataIndex']];
						}
					}
				}
				
				
				$currentHeight = $ci->pdf->getPageHeight()-10;
				$currentY = $ci->pdf->GetY();
	
				if($rowHeight > ($currentHeight - $currentY) ){ 
					$ci->pdf->AddPage(isset($params['orientation'])?$params['orientation']:'P');
					$first_border_nextPage = true;
				}
				
				if($first_border_nextPage){
					$recBorder = 'LTRB';
					if($lastColumn == $headerVal['dataIndex'])	$first_border_nextPage = false;
				}
				
			
				$ci->pdf->MultiCell($rowWidth,$rowHeight,$text = strip_tags($value) ,$recBorder,$align,false, $recLn,'','', true,0,'',$autopading=true,$maxh = 0,$valign = 'T',$fitcell = true );
				
				
			}
			
			
			$rowHeight=0;
			$recInc++;
			
			
		}
		
		
		
		
		/* SUMMATION */
		if( $hasTotal ){
			$ci->pdf->SetFont( $header_font_family, $header_font_style, $header_font_size );
			$sumHeight = 0;
			
			foreach( $params['header'] as $header ){
				if( isset( $header['total'] ) ){
					// print_r($header);
					$cntRecordHeight = $ci->pdf->getStringHeight( $orientationWidth * ($header['width'] / 100) , number_format( $header['total'], 2 ), false, true, '', 1 );
					if( $cntRecordHeight > $sumHeight ){
						$sumHeight = $cntRecordHeight;
					}
				}
			}
			
			foreach( $params['header'] as $header ){
				if(isset($header['width'])) $rowWidth = $orientationWidth * ($header['width'] / 100);
				else $rowWidth=$orientationWidth / count($params['header']);
				
				if( isset( $header['total'] ) ){
					$ci->pdf->SetFillColor( 240, 240, 240 );
					$total  = number_format( $header['total'], 2 );
					$border = 'LTRB';
				}
				else{
					$ci->pdf->SetFillColor(255,255,255);
					$total  = '';
					$border = 'T';
				}
				
				$ci->pdf->MultiCell( $rowWidth, $sumHeight, $total, $border, 'R', true, 0, '', '', true, 0, '', true, 0, 'T', true );
			}
		}
		
		
		if(isset($_SERVER['SERVER_SOFTWARE']) && strpos($_SERVER['SERVER_SOFTWARE'],'Google App Engine') !== false){
			$directoryPath  = 'gs://bontilaoapp/';
		}
		else{
			$directoryPath='./';
		}
		
		
		if(!is_dir($directoryPath.'pdf/')){
			rmkdir($directoryPath.'pdf/');
			if(!is_dir($directoryPath.$params['folder_name'])) rmkdir('./'.$params['folder_name']);
	  }
		
		 if(file_exists($directoryPath.'pdf/'.$params['folder_name'].$params['file_name'].'.pdf')){
			 @unlink($directoryPath.'pdf/'.$params['folder_name'].$params['file_name'].'.pdf');
		 }
		
		$ci->pdf->Output($directoryPath.'pdf/'.$params['folder_name'].'/'.$params['file_name'].'.pdf', 'F');
		
		if(file_exists($directoryPath.'pdf/'.$params['folder_name'].'/'.$params['file_name'].'.pdf')){
			die(json_encode(array('success'=>true,'match'=>0)));
		}
		else{
			die(json_encode(array('success'=>true,'match'=>1)));
		}
	}
}

if( !function_exists( 'is_date_check' ) ){
	function is_date_check( $str ){
		$stamp = strtotime( $str );
		if ( !is_numeric($stamp) || !preg_match("^\d{1,2}[.-/]\d{2}[.-/]\d{4}^", $str) ){
			return FALSE;
		}
		$month = date( 'm', $stamp );
		$day   = date( 'd', $stamp );
		$year  = date( 'Y', $stamp );
		if (checkdate( $month, $day, $year )){
			return TRUE;
		}
		return FALSE;
	}
}
	
if( !function_exists( 'sortQuery' ) ){
	function sortQuery( $sortData ){
		$ci   =& get_instance();
		$sort = json_decode( $sortData, true);
		$sort = $sort[0];
		
		if( $ci->db->using_select ){
			$ci->db->order_by( $sort['property'], $sort['direction'] );
		}
		else{
			return "ORDER BY " .$sort['property']. ' ' . $sort['direction'];
		}
		
		
	}
}
	
if( !function_exists( 'LQ' ) ){
	function LQ(){
		$ci  =& get_instance();
		print_r( $ci->db->last_query() );
	}
}

if(! function_exists( 'setHeader' )){
	function setHeader( $modelPath = "", $modelName = 'model' ){
		header("X-Frame-Options: SAMEORIGIN");
		header("X-Content-Security-Policy: default-src 'self'; script-src 'self';");
		header("X-Content-Type-Options: nosniff");
		header("X-XSS-Protection: 1; mode=block");
		
		date_default_timezone_set('Asia/Manila');
		
		$ci  =& get_instance();
		
		if( !empty( $modelPath ) ){
			$ci->load->model( $modelPath, $modelName );
		}
		$ci->load->model( 'standards/Standards_model', 'standards' );
		$ci->load->model( 'Home_model', $modelName );
		$ci->load->model( 'pdf' );
		$ci->load->helper( 'url' );
		$ci->load->helper( 'download' );
		$ci->load->helper( 'csv' );
		$ci->load->helper( 'file' );
		
		// $ci->bgsUID 		= $ci->session->userdata( 'BGSUID' );
		$ci->userID 		= $ci->session->userdata( 'BMAPSUID' );
		$ci->fname	 		= $ci->session->userdata( 'FIRSTNAME' );
		$ci->lname	 		= $ci->session->userdata( 'LASTNAME' );
		$ci->fullname		= $ci->session->userdata( 'USERFULLNAME' );
		// $ci->bgsUname 		= $ci->session->userdata( 'BGSUNAME' );
		$ci->userName 		= $ci->session->userdata( 'BMAPSUNAME' );
		$ci->usertype 		= $ci->session->userdata( 'USERTYPE' );
		$ci->usertypename 	= $ci->session->userdata( 'USERTYPENAME' );		
		$ci->logoName		= $ci->session->userdata( 'LOGONAME' );
		$ci->logoPathAndName = $ci->session->userdata( 'LOGOPATH' ).$ci->session->userdata( 'LOGONAME' );;		
	}
}

if( !function_exists( 'unsetParams' ) ){
	function unsetParams( $data, $table ){
		$ci =& get_instance();
		foreach( $data AS $key => $val ){
			if( !$ci->db->field_exists( $key, $table ) ){
				unset( $data[$key] );
			}
		}
		return $data;
	}
}

if( !function_exists( '_checkData' ) ){
	function _checkData( $params ){
		$ci =& get_instance();
		return $ci->standards->_checkData( $params );
	}
}

if( !function_exists( 'setLogs' ) ){
	function setLogs( $data ){
		$ci =& get_instance();
		$userID = ( isset( $data['userID'] ) ) ? $data['userID'] : $ci->userID;
		$data['logDateAndTime'] = date('Y-m-d H:i:s');
		$data['userID'] = $userID;
		$ci->standards->setLogs( $data );
	}
}	

if( !function_exists( 'resetSessionExpiry' ) ){
	function resetSessionExpiry( $data ){
		$ci =& get_instance();
		
		$time = $data['companySessionHours'] * 60 * 60;
		$time += $data['companySessionMins'] * 60;
		if( $time <= 0 ){
			$time = DEFAULT_SESSION_TIMEOUT;
		}
		$ci->session->mark_as_temp(array( 'logged_in', 'IDUSER' ), $time);
	}
}

if( !function_exists( 'getList' ) ){
	function getList( $data ){
		if( isset( $data['sqlQuery'] ) ){
			$query 		 = $data['sqlQuery'];
			$result		 = array();
			$pdf 		 = isset( $data['pdf'] )? $data['pdf'] : false;
			$ci 		 =& get_instance();
			
			
			/** ===== WHERE CLAUSE ===== **/
			$where_clause= "";
			$where_field = "";
			$where_tag   = "<-where:";
			$where_syntax= "WHERE";
			$pos   		 = strpos( $query, $where_tag );
			
			if( empty( $pos ) ){
				$where_tag   = "<-and_where:";
				$where_syntax= "AND";
				$pos   		 = strpos( $query, $where_tag );
			}
			
			if( !empty( $pos ) ){
				$start = $pos + strlen( $where_tag );
				while( substr( $query, $start, 2 ) != "->" ){
					$where_field .= substr( $query, $start, 1 );
					$start++;
				}
				
				$query_fields = explode( "&&", $where_field );
				$x = 0;
				foreach( $query_fields as $field ){
					if( isset( $data['query'.$x] ) && $data['query'.$x] ){
						$where_clause .= ( $x == 0? $where_syntax : "AND" )." ".$field." LIKE '%".$data['query'.$x]."%' ";
					}
					$x++;
				}
				
				$query = str_replace( $where_tag ."". $where_field ."->", $where_clause, $query );
			}
			
			
			/** ===== SORT CLAUSE ===== **/
			$sort_clause= "";
			$sort_field = "";
			$sort_tag   = "<-sort:";
			$pos   		 = strpos( $query, $sort_tag );
			
			if( !empty( $pos ) ){
				$start = $pos + strlen( $sort_tag );
				while( substr( $query, $start, 2 ) != "->" ){
					$sort_field .= substr( $query, $start, 1 );
					$start++;
				}
				
				if( isset( $data['sort'] ) ){
					$sort 		 = json_decode( $data['sort'], true);
					$sort_clause = "ORDER BY ".$sort[0]['property']. ' ' . $sort[0]['direction'];
				}
				else{
					$sort_clause = "ORDER BY ".$sort_field;
				}
				
				$query = str_replace( $sort_tag ."". $sort_field ."->", $sort_clause, $query );
			}
			
			
			/** ===== LIMIT CLAUSE ===== **/
			$limit_clause= "";
			$limit_tag   = "<-limit->";
			$pos   		 = strpos( $query, $limit_tag );
			$sqlQuery	 = array();
			
			if( !empty( $pos ) ){
				if( $pdf ){
					$sqlQuery[] = str_replace( $limit_tag, "", $query );
				}
				else{
					$limit_clause = "LIMIT $data[start], $data[limit]";
					$sqlQuery[] = str_replace( $limit_tag, $limit_clause, $query );
					$sqlQuery[] = str_replace( $limit_tag, "", $query );
				}
			}
			
			
			/** ===== EXECUTING QUERY ===== **/
			for( $x=0; $x<count( $sqlQuery ); $x++ ){
				$getQuery = $ci->db->query( $sqlQuery[$x] );
				$result[] = ( $x == 0 )? $getQuery->result_array() : $getQuery->num_rows();
			}
			
			return $pdf? $result[0] : $result;
		}
	}
}

if(!function_exists('getallheaders')){
	function getallheaders(){
		foreach($_SERVER as $name => $value){
			if(substr($name, 0, 5) == 'HTTP_'){
				$headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
			}
		}
		return $headers;
	}
}


if(!function_exists('checkfilename')){
	function checkfilename( $file, $folder ){
		$ci =& get_instance();
		$cnt=0;
		while(file_exists($folder.'/'.$file.'.sql')){
			$cnt++;
			$file.='_'.$cnt;
		}
		return $file;
	}
}

/* Backup School year and delete */
if(!function_exists('backupAndDelete')){
	function backupAndDelete( $params ){
		$ci =& get_instance();

		$folder   = './backup/';

		if(isset($_SERVER['SERVER_SOFTWARE']) && strpos($_SERVER['SERVER_SOFTWARE'],'Google App Engine') !== false){
			$folder = 'gs://bontilaoapp/backup/';
		}


		date_default_timezone_set('Asia/Manila');

		$host = ":/cloudsql/bontilaoapp:bma1";
		
		$user = "root";
		
		$pass = "TZ8jlgA1a5ZSF7P";
		
		$name = "bma_ogs";
		
		$tables = array();
		
		$return = '';
		
		$link = mysqli_connect( 'Dataserver', 'appsDevs', 'TZ8jlgA1a5ZSF7P' );

		mysqli_select_db( $link, $name );

		$ci->db->select( 'classID' );
		$ci->db->from( 'class' );
		$ci->db->where( 'classSchoolYearID', $params[ 'schoolyearID' ] );
		$classID = $ci->db->get()->result_array();
	 	$classIDs = array();
	 	array_walk_recursive($classID, function($a) use (&$classIDs) { $classIDs[] = $a; } );
		$classIDs = implode(',', $classIDs );


		$ci->db->select( 'gradingSheetID' );
		$ci->db->from( 'gradingsheet' );
		$ci->db->where_in( 'classID', $classIDs );
		$gradeSheetID = $ci->db->get()->result_array();
	 	$gradeSheetIDs = array();
	 	array_walk_recursive($gradeSheetID, function($a) use (&$gradeSheetIDs) { $gradeSheetIDs[] = $a; } );
		$gradeSheetIDs = implode(',', $gradeSheetIDs );
		// echo $ci->db->last_query();

		$ci->db->select( 'gradingSheetActivityID' );
		$ci->db->from( 'gradingsheetactivity' );
		$ci->db->where_in( 'gradingSheetID', $gradeSheetIDs );
		$gradeSheetActivityID = $ci->db->get()->result_array();
	 	$gradeSheetActivityIDs = array();
	 	array_walk_recursive($gradeSheetActivityID, function($a) use (&$gradeSheetActivityIDs) { $gradeSheetActivityIDs[] = $a; } );
		$gradeSheetActivityIDs = implode(',', $gradeSheetActivityIDs );

	/* GET ALL STUDENTS FOR THE YEAR */
		$tables = array(
			'class' => array(
					'field' => 'classSchoolYearID'
					,'value' => $params[ 'schoolyearID' ]
				)
			,'activity' => array(
					'field' => 'classID'
					,'value' => $classIDs
				)
			,'enrolledstudents' => array(
					'field' => 'classID'
					,'value' => $classIDs
				)
			,'gradingsheet' => array(
					'field' => 'classID'
					,'value' => $classIDs
				)
			,'gradingsheetactivity' => array(
					'field' => 'gradingSheetID'
					,'value' => $gradeSheetIDs
				)
			,'learnerscore' => array(
					'field' => 'gradingSheetActivityID'
					,'value' => $gradeSheetActivityIDs
				)
			,'quarterlygradeperlearner' => array(
					'field' => 'gradingSheetID'
					,'value' => $gradeSheetIDs
				)
		);

		foreach($tables as $keyTable => $valueArr){
			$where ='';
			if( $keyTable == 'enrolledstudents' || $keyTable == 'gradingsheet' || $keyTable == 'gradingsheetactivity' || $keyTable == 'quarterlygradeperlearner' || $keyTable == 'learnerscore' || $keyTable == 'activity' ){
				$arr = explode(',', stripslashes(str_ireplace("'","','",$valueArr[ 'value' ])));
				$ci->db->where_in( $valueArr[ 'field' ], $arr);
			}
			else if( $valueArr[ 'field' ] == '' || empty($valueArr[ 'field' ]) || $valueArr[ 'field' ] != '*' ){
				$ci->db->where( $valueArr[ 'field' ],$valueArr[ 'value' ] );
			}
			$ci->db->delete( $keyTable );
		}
	}
}


if(!function_exists('DBBackup')){
	function DBBackup( ){

		$ci =& get_instance();
		
		$folder = './backup/';
		$link = '';		
		if(isset($_SERVER['SERVER_SOFTWARE']) && strpos($_SERVER['SERVER_SOFTWARE'],'Google App Engine') !== false){
			$folder   = 'gs://bontilaoapp/backup/';
		}

		date_default_timezone_set('Asia/Manila');
		$host=":/cloudsql/bontilaoapp:bma1";
		$user="root";
		$pass="TZ8jlgA1a5ZSF7P";
		$name="bma_ogs";
		$tables = '*';
		$return = '';


		if(isset($_SERVER['SERVER_SOFTWARE']) && strpos($_SERVER['SERVER_SOFTWARE'],'Google App Engine') !== false){
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
		}else{
			$link = mysqli_connect( 'Dataserver', 'appsDevs', 'TZ8jlgA1a5ZSF7P' );

			mysqli_select_db($link,$name);
			  
			if($tables == '*'){
				$tables = array();
				$result = mysqli_query($link,'SHOW TABLES');
				while($row = mysqli_fetch_row($result)){
					$tables[] = $row[0];
				}
			}
			else{
				$tables = is_array($tables) ? $tables : explode(',',$tables);
			}
			  
			foreach($tables as $table){
				$result = mysqli_query($link,'SELECT * FROM '.$table);
				$num_fields = mysqli_num_fields($result);
				
				$return.= 'DROP TABLE '.$table.';';
				$row2 = mysqli_fetch_row(mysqli_query($link,'SHOW CREATE TABLE '.$table));
				$return.= "\n\n".$row2[1].";\n\n";
				
				for ($i = 0; $i < $num_fields; $i++){
					while($row = mysqli_fetch_row($result)){
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
		}



		$uname = $ci->session->userdata('FIRSTNAME').'_'.$ci->session->userdata('LASTNAME');
		$tt = checkfilename('dbbackup_'.$uname.'_'.date('Ymd_Hi'), $folder);
		$file_  = $folder.''.$tt.'.sql';
		
		$ci->load->helper('file'); // Load the file helper and write the file to your server
		write_file($file_, $return);
		return $tt.'.sql';

		// $uname = $ci->session->userdata('BGSUNAME');
		// $file_  = $folder.''.checkfilename('dbbackup_'.$uname.'_'.date('Ymd_Hi'), $folder).'.sql';
		
		// $ci->load->helper('file'); // Load the file helper and write the file to your server
		// write_file($file_, $return);
	}
}

/* Check if Class if Close */
if(!function_exists('checkIfClose')){
	function checkIfClose( $params ){
		$ci =& get_instance();
		$ci->where( $params[ 'fieldName' ], $params[ 'fieldValue' ]);
		$ci->where( $params[ 'fieldToCheck' ], 1 );
		$ci->from( $params[ 'table' ] );
		$ci->limit( 1 );
		$ci->get()->row();
		return $ci->db->affected_rows();
	}
}



if ( ! function_exists('force_download_backup'))
{
	function force_download_backup($filename = '', $data = '')
	{
		if (ob_get_contents()) ob_clean();
		if ($filename == '' OR $data == '')
		{
			return FALSE;
		}

		// Try to determine if the filename includes a file extension.
		// We need it in order to set the MIME type
		if (FALSE === strpos($filename, '.'))
		{
			return FALSE;
		}
	
		// Grab the file extension
		$x = explode('.', $filename);
		$extension = end($x);

		// Load the mime types
		@include(APPPATH.'config/mimes'.EXT);
	
		// Set a default mime if we can't find it
		if ( ! isset($mimes[$extension]))
		{
			$mime = 'application/octet-stream';
		}
		else
		{
			$mime = (is_array($mimes[$extension])) ? $mimes[$extension][0] : $mimes[$extension];
		}
	
		// Generate the server headers
		if (strstr($_SERVER['HTTP_USER_AGENT'], "MSIE"))
		{
			header('Content-Type: "'.$mime.'"');
			header('Content-Disposition: attachment; filename="'.$filename.'"');
			header('Expires: 0');
			header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
			header("Content-Transfer-Encoding: binary");
			header('Pragma: public');
			header("Content-Length: ".strlen($data));
		}
		else
		{
			header('Content-Type: "'.$mime.'"');
			header('Content-Disposition: attachment; filename="'.$filename.'"');
			header("Content-Transfer-Encoding: binary");
			header('Expires: 0');
			header('Pragma: no-cache');
			header("Content-Length: ".strlen($data));
		}
	
		exit($data);
	}
}


if( !function_exists( '_setLogs' ) ){
	function _setLogs( $params ){
		$ci =& get_instance();
		
		/*
			1 - Login
				1.1	Success
						Username
				1.2	Failure
						Username
				1.3	Failure (Unknown)
				
			2 - Logout
					username
				
			3 - Usersettings
				3.1	Save
						fullname
						usertype
				3.2	Edit Information
						fullname
				3.3	Edit Module Access
						fullname
				3.4 Delete
						fullname
			4 - Company Setting
				4.1	Save
			5 - User Activity Logs
				5.1 View
		*/
		
		/**
		 * Create global description
		 */

		$desc = "";
		
		if ( (int)$params[ 'modeLevel' ] == 1 )
		{
			 
			if ( $params[ 'modeLevel1' ] == 1.1 )
			{
				
				$desc = "". $params['data'][ 'userName' ] ." has logged in successfully.";
				
			}
			else if ( $params[ 'modeLevel1' ] == 1.2 )
			{
				
				$desc = "". $params['data'][ 'username' ] ." failed to login.";
				
			}
			else if ( $params[ 'modeLevel1' ] == 1.3 )
			{
				
				$desc = "Unknown user failed to login.";
				
			}
			
		}
		else if ( $params[ 'modeLevel' ] == 2 )
		{
			 
			$desc = "". $params['data'][ 'username' ] ." has logged out of the system.";
			 
		}
		else if ( $params[ 'modeLevel' ] == 3 )
		{
			 
			if ( $parameter[ 'modeLevel1' ] == 3.1 )
			{
				
				$desc = "Added new user, ". $params['data'][ 'fullName' ] .", with usertype ". $params['data'][ 'userType' ] .".";
			
			}
			else if ( $parameter[ 'modeLevel1' ] == 3.2 )
			{
				
				$desc = "Modified ". $params['data'][ 'fullName' ] .".";
			
			}
			else if ( $parameter[ 'modeLevel1' ] == 3.3 )
			{
				
				$desc = "Modified ". $params['data'][ 'fullName' ] ."’s module access.";
			
			}
			else if ( $parameter[ 'modeLevel1' ] == 3.4 )
			{
				
				$desc = "Deleted ". $params['data'][ 'fullName' ] .".";
			
			}
			 
		}
		else if ( $params[ 'modeLevel' ] == 4 )
		{
			
			$desc = "Edited the company information.";
			
		}
		else if ( $params[ 'modeLevel' ] == 5 )
		{
			 
			$desc = "Viewed the user action logs.";
			 
		}
		else if ( $params[ 'modeLevel' ] == 6 )
		{
			
			if ( $params[ 'modeLevel1' ] == 6.1 )
			{
	
				$desc = "Backed-up the database.";
			
			}
			else if ( $params[ 'modeLevel1' ] == 6.2 )
			{
	
				$desc = "Downloaded the backup file, ". $params['data'][ 'fileName' ] .".";
			
			}
			else if ( $params[ 'modeLevel1' ] == 6.3 )
			{
	
				$desc = "Downloaded multiple backup files.";
			
			}
			else if ( $params[ 'modeLevel1' ] == 6.4 )
			{
	
				$desc = "Restored the backup file, ". $params['data'][ 'fileName' ] .".";
			
			}
			else if ( $params[ 'modeLevel1' ] == 6.5 )
			{
	
				$desc = "Deleted the backup file, ". $params['data'][ 'fileName' ] .".";
			
			}
			 
		}
		else if ( $params[ 'modeLevel' ] == 7 )
		{
			
			if ( $params[ 'modeLevel1' ] == 7.1 )
			{
	
				$desc = "Added a new account card of ". $params['data'][ 'studentName' ] .".";
			
			}
			else if ( $params[ 'modeLevel1' ] == 7.2 )
			{
	
				$desc = "Added a new payment record for ". $params['data'][ 'studentName' ] ." with ". $params['data'][ 'ORTR' ] ." No. ". $params['data'][ 'ORTRNumber' ] .".";
			
			}
			else if ( $params[ 'modeLevel1' ] == 7.3 )
			{
	
				$desc = "Modified the ". $params['data'][ 'ORTR' ] ." No. ". $params['data'][ 'ORTRNumber' ] ." payment record of ". $params['data'][ 'studentName' ] .".";
			
			}
			else if ( $params[ 'modeLevel1' ] == 7.4 )
			{
	
				$desc = "Modified the account card of ". $params['data'][ 'studentName' ] .".";
			
			}
			else if ( $params[ 'modeLevel1' ] == 7.5 )
			{
	
				$desc = "Cancelled the ". $params['data'][ 'ORTR' ] ." No. ". $params['data'][ 'ORTRNumber' ] ." payment record of ". $params['data'][ 'studentName' ] .".";
			
			}
			else if ( $params[ 'modeLevel1' ] == 7.6 )
			{
	
				$desc = "Deleted the ". $params['data'][ 'ORTR' ] ." No. ". $params['data'][ 'ORTRNumber' ] ." payment record of ". $params['data'][ 'studentName' ] .".";
			
			}
			else if ( $params[ 'modeLevel1' ] == 7.7 )
			{
	
				$desc = "Deleted the account card for ". $params['data'][ 'studentName' ] .".";
			
			}
			else if ( $params[ 'modeLevel1' ] == 7.8 )
			{
	
				$desc = "Exported the account card of ". $params['data'][ 'studentName' ] ." for SY ". $params['data'][ 'schoolYear' ] .".";
			
			}
			
		}
		else if ( $params[ 'modeLevel' ] == 8 )
		{
			
			if ( $params[ 'modeLevel1' ] == 8.1 )
			{
	
				$desc = "Viewed collection report.";
			
			}
			else if ( $params[ 'modeLevel1' ] == 8.2 )
			{
	
				$desc = "Exported the collection report.";
			
			}
			
		}
		else if( $params['modeLevel'] == 13 ){
			if( $params['modeLevel1'] == 13.1 ){
				$desc = "Added a new batch receivables record for payment category: " . $params['data']['batchReceivableCategoryName']  . " as of " . date( 'm/d/Y', strtotime( $params['data']['batchReceivableDate'] ) ) . ".";
			}
			elseif( $params['modeLevel1'] == 13.2 ){
				$desc = "Modified the batch receivables record for payment category: " . $params['data']['batchReceivableCategoryName']  . " as of " . date( 'm/d/Y', strtotime( $params['data']['batchReceivableDate'] ) ) . ".";
			}
			elseif( $params['modeLevel1'] == 13.3 ){
				$desc = "Deleted the batch receivables record for payment category: " . $params['data']['batchReceivableCategoryName']  . " as of " . date( 'm/d/Y', strtotime( $params['data']['batchReceivableDate'] ) ) . ".";
			}
		}
		
		$data[ 'description' ] = $desc;
		$data[ 'idmodule' ] = $params[ 'idmodule' ];
		$data[ 'bmapsUID' ] = $params[ 'bmapsUID' ];
		$data['logDateAndTime'] = date('Y-m-d H:i:s');

		$ci->standards->setLogs( $data );

	}
}	


?>