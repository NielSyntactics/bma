<?php

# override the default TCPDF config file
if(!defined('K_TCPDF_EXTERNAL_CONFIG')) {	
	define('K_TCPDF_EXTERNAL_CONFIG', TRUE);
}
	
# include TCPDF
require(APPPATH.'config/tcpdf.php');
require_once($tcpdf['base_directory'].'/tcpdf.php');
// require_once($tcpdf['base_directory'].'tcpdf.php');



/************************************************************
 * TCPDF - CodeIgniter Integration
 * Library file
 * ----------------------------------------------------------
 * @author Jonathon Hill http://jonathonhill.net
 * @version 1.0
 * @package tcpdf_ci
 ***********************************************************/
class pdf extends TCPDF {
	
	
	/**
	 * TCPDF system constants that map to settings in our config file
	 *
	 * @var array
	 * @access private
	 */
	private $cfg_constant_map = array(
		'K_PATH_MAIN'	=> 'base_directory',
		'K_PATH_URL'	=> 'base_url',
		'K_PATH_FONTS'	=> 'fonts_directory',
		'K_PATH_CACHE'	=> 'cache_directory',
		'K_PATH_IMAGES'	=> 'image_directory',
		'K_BLANK_IMAGE' => 'blank_image',
		'K_SMALL_RATIO'	=> 'small_font_ratio',
	);
	
	
	/**
	 * Settings from our APPPATH/config/tcpdf.php file
	 *
	 * @var array
	 * @access private
	 */
	private $_config = array();
	
	
	/**
	 * Initialize and configure TCPDF with the settings in our config file
	 *
	 */
	function __construct() {
		
		# load the config file
		require(APPPATH.'config/tcpdf.php');
		$this->_config = $tcpdf;
		unset($tcpdf);
		
		
		
		# set the TCPDF system constants
		foreach($this->cfg_constant_map as $const => $cfgkey) {
			if(!defined($const)) {
				define($const, $this->_config[$cfgkey]);
				#echo sprintf("Defining: %s = %s\n<br />", $const, $this->_config[$cfgkey]);
			}
		}
		
		# initialize TCPDF		
		parent::__construct(
			$this->_config['page_orientation'], 
			$this->_config['page_unit'], 
			$this->_config['page_format'], 
			$this->_config['unicode'], 
			$this->_config['encoding'], 
			$this->_config['enable_disk_cache']
		);
		
		
		# language settings
		if(is_file($this->_config['language_file'])) {
			include($this->_config['language_file']);
			$this->setLanguageArray($l);
			unset($l);
		}
		
		# margin settings
		$this->SetMargins($this->_config['margin_left'], $this->_config['margin_top'], $this->_config['margin_right']);
		
		# header settings
		$this->print_header = $this->_config['header_on'];
		#$this->print_header = FALSE; 
		$this->setHeaderFont(array($this->_config['header_font'], '', $this->_config['header_font_size']));
		$this->setHeaderMargin($this->_config['header_margin']);
		$this->SetHeaderData(
			$this->_config['header_logo'], 
			$this->_config['header_logo_width'], 
			$this->_config['header_title'], 
			$this->_config['header_string']
		);
		
		# footer settings
		$this->print_footer = $this->_config['footer_on'];
		$this->setFooterFont(array($this->_config['footer_font'], '', $this->_config['footer_font_size']));
		$this->setFooterMargin($this->_config['footer_margin']);
		
		# page break
		$this->SetAutoPageBreak($this->_config['page_break_auto'], $this->_config['footer_margin']);
		
		# cell settings
		$this->cMargin = $this->_config['cell_padding'];
		$this->setCellHeightRatio($this->_config['cell_height_ratio']);
		
		# document properties
		$this->author = $this->_config['author'];
		$this->creator = $this->_config['creator'];
		
		# font settings
		#$this->SetFont($this->_config['page_font'], '', $this->_config['page_font_size']);
		
		# image settings
		$this->imgscale = $this->_config['image_scale'];
		
	}		public function Footer() {		$this->SetFont('Helvetica', '', 7);				$cur_y = $this->y;		$this->SetTextColor(0, 0, 0);		//set style for cell border		$line_width = 0.85 / $this->k;		$this->SetLineStyle(array('width' => $line_width, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 0)));		//print document barcode		$barcode = $this->getBarcode();		if (!empty($barcode)) {			$this->Ln($line_width);			$barcode_width = round(($this->w - $this->original_lMargin - $this->original_rMargin) / 3);			$style = array(				'position' => $this->rtl?'R':'L',				'align' => $this->rtl?'R':'L',				'stretch' => false,				'fitwidth' => true,				'cellfitalign' => '',				'border' => false,				'padding' => 0,				'fgcolor' => array(0,0,0),				'bgcolor' => false,				'text' => false			);			$this->write1DBarcode($barcode, 'C128', '', $cur_y + $line_width, '', (($this->footer_margin / 3) - $line_width), 0.3, $style, '');		}				/*add Printed by with the index userfullname 5.18.2015 efren*/		if(isset($_SESSION['USERFULLNAME'])) $pagenumtxt = 'Printed by : '.$_SESSION['USERFULLNAME'];		else $pagenumtxt = '';				$timestamp = date('d/m/Y');		if (empty($this->pagegroups)) {			$pagenumtxt .= ' on '.$timestamp.'          '.$this->l['w_page'].' '.$this->getAliasNumPage().' / '.$this->getAliasNbPages();		} else {			$pagenumtxt .= ' on '.$timestamp.'          '.$this->l['w_page'].' '.$this->getPageNumGroupAlias().' / '.$this->getPageGroupAlias();		}						$this->SetY($cur_y);		//Print page number		if ($this->getRTL()) {			$this->SetX($this->original_rMargin);			$this->Cell(0, 0, $pagenumtxt, 'T', 0, 'L');		} else {			$this->SetX($this->original_lMargin);			$this->Cell(0, 0, $this->getAliasRightShift().$pagenumtxt, 'T', 0, 'R');		}	}
}