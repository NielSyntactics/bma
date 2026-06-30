<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Dailycollectionreport extends CI_Controller{
	
	public function __construct(){
		parent::__construct();
		setHeader( 'report/Dailycollectionreport_model' );
	}
	
	public function getBalances(){
		$params = getData();
		
		$view = $this->model->getBalances( $params );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					,'total' => count( $view )
				)
			)
		);
	}
	
	public function printPDF(){
		$params = getData();
		$data = $this->model->getBalances( $params );
		
		$html = '<table width="100%" cellpadding="5" border="1">';

		$html .= '<tr>';
		$html .= '<th style="font-weight: bold"> Student Name </th>';
		$html .= '<th style="font-weight: bold"> OR # </th>';
		$html .= '<th style="font-weight: bold"> Tuition </th>';
		$html .= '<th style="font-weight: bold"> Remarks </th>';
		$html .= '<th style="font-weight: bold"> TR # </th>';
		$html .= '<th style="font-weight: bold"> Books </th>';
		$html .= '<th style="font-weight: bold"> Annual Reg. </th>';
		$html .= '<th style="font-weight: bold"> Uniform </th>';
		$html .= '<th style="font-weight: bold"> Catering </th>';
		$html .= '<th style="font-weight: bold"> Extra-Curricular </th>';
		$html .= '<th style="font-weight: bold"> Christmas </th>';
		$html .= '<th style="font-weight: bold"> Family Day </th>';
		$html .= '<th style="font-weight: bold"> Picture </th>';
		$html .= '<th style="font-weight: bold"> Grad Fee </th>';
		$html .= '<th style="font-weight: bold"> Scouting/Camping </th>';
		$html .= '<th style="font-weight: bold"> Charity </th>';
		$html .= '<th style="font-weight: bold"> Nutrition Day </th>';
		$html .= '<th style="font-weight: bold"> Moving Up/Recognition </th>';
		$html .= '<th style="font-weight: bold"> Others </th>';
		$html .= '</tr>';
		$arrTot = array(
			'annual' => 0
			,'tuition' => 0
			,'books' => 0
			,'uniform' => 0
			,'catering' => 0
			,'extraCurricular' => 0
			,'christmas' => 0
			,'familyDay' => 0
			,'picture' => 0
			,'gradFee' => 0
			,'scouting' => 0
			,'charity' => 0
			,'nutrition' => 0
			,'movingUp' => 0
			,'others' => 0
		);
		
		foreach ( $data AS $key )
		{

			$html .= '<tr>';
			$html .= '<td>'. $key[ 'studentName' ] .'</td>';
			$html .= '<td>'. $key[ 'orNum' ] .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'tuition' ] ,2) .'</td>';
			$html .= '<td>'. $key[ 'remarks' ] .'</td>';
			$html .= '<td>'. $key[ 'trNum' ] .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'books' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'annualRegistration' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'uniform' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'catering' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'extraCurricular' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'christmas' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'familyDay' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'picture' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'gradFee' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'scouting' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'charity' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'nutrition' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'movingUp' ] ,2) .'</td>';
			$html .= '<td style="text-align: right;">'. number_format( $key[ 'others' ] ,2) .'</td>';
			$html .= '</tr>';
			$arrTot['annual'] += $key[ 'annualRegistration' ];
			$arrTot['tuition'] += $key[ 'tuition' ];
			$arrTot['books'] += $key[ 'books' ];
			$arrTot['uniform'] += $key[ 'uniform' ];
			$arrTot['catering'] += $key[ 'catering' ];
			$arrTot['extraCurricular'] += $key[ 'extraCurricular' ];
			$arrTot['christmas'] += $key[ 'christmas' ];
			$arrTot['familyDay'] += $key[ 'familyDay' ];
			$arrTot['picture'] += $key[ 'picture' ];
			$arrTot['gradFee'] += $key[ 'gradFee' ];
			$arrTot['scouting'] += $key[ 'scouting' ];
			$arrTot['charity'] += $key[ 'charity' ];
			$arrTot['others'] += $key[ 'others' ];
			$arrTot['nutrition'] += $key[ 'nutrition' ];
			$arrTot['movingUp'] += $key[ 'movingUp' ];

		}
		
		$rowIndex = count($view) - 1;

		$html .= '<tr>';

		$html .= '<td>Total:</td>';
		$html .= '<td></td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'tuition' ] ,2) . '</td>';
		$html .= '<td></td>';
		$html .= '<td></td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'books' ] ,2) . '</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'annual' ] ,2) . '</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'uniform' ] ,2) . '</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'catering' ] ,2) . '</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'extraCurricular' ] ,2) . '</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'christmas' ] ,2) .'</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'familyDay' ] ,2) .'</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'picture' ] ,2) . '</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'gradFee' ] ,2) . '</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'scouting' ] ,2) . '</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'charity' ] ,2) . '</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'nutrition' ] ,2) . '</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'movingUp' ] ,2) . '</td>';
		$html .= '<td style="text-align: right;">'. number_format( $arrTot[ 'others' ] ,2) . '</td>';
		
		$html .= '</tr>';

		$html .= '<tr>';

		$html .= '<td>Grand Total:</td>';
		$html .= '<td></td>';
		$html .= '<td>'. number_format( (
			$arrTot[ 'tuition' ] 
			+ $arrTot[ 'books' ] 
			+ $arrTot[ 'annual' ]
			+ $arrTot[ 'uniform' ] 
			+ $arrTot[ 'catering' ] 
			+ $arrTot[ 'extraCurricular' ] 
			+ $arrTot[ 'christmas' ] 
			+ $arrTot[ 'familyDay' ] 
			+ $arrTot[ 'picture' ] 
			+ $arrTot[ 'gradFee' ] 
			+ $arrTot[ 'scouting' ] 
			+ $arrTot[ 'charity' ] 
			+ $arrTot[ 'nutrition' ] 
			+ $arrTot[ 'movingUp' ]
			+ $arrTot[ 'others' ] 
		) ,2) . '</td>';
		$html .= '<td></td>';
		$html .= '<td></td>';
		$html .= '<td colspan="14"></td>';
		
		$html .= '</tr>';
		$html .= '</table>';
		
		$params1 = array(
			'title' => $params['title']
			,'file_name' => $params['title']
			,'folder_name' => 'pdf/report/'
			,'addPage' => false
			,'table_hidden' => true
			,'grid_font_size' => 7
			,'orientation' => 'L'
		);
		
		generate_table( $params1, array(), array(), $html );
	}
	
	public function printEXCEL(){
		$params = getData();
		$data = $this->model->getBalances( $params );
		
		$csvarray[] = array( 'title' => $params['title'].'' );

		$csvarray[] = array( 'space' => '' );

		$csvarray[] = array( 'space' => '' );

		$csvarray[] = array(
			'col1' => 'Student Name',
			'col2' => 'orNum',
			'col3' => 'Tuition',
			'col4' => 'Remarks',
			'col5' => 'trNum',
			'col6' => 'Books',
			'col7' => 'Annual Reg.',
			'col8' => 'Uniform',
			'col9' => 'Catering',
			'col10' => 'Extra-Curricular',
			'col11' => 'Christmas',
			'col12' => 'Family Day',
			'col13' => 'Picture',
			'col14' => 'Grad Fee',
			'col15' => 'Scouting/Camping',
			'col16' => 'Charity',
			'col17' => 'Nutrition Day',
			'col18' => 'Moving Up/Recognition',
			'col19' => 'Others'
		);
		
		$arrTot = array(
			'annual' => 0
			,'tuition' => 0
			,'books' => 0
			,'uniform' => 0
			,'catering' => 0
			,'extraCurricular' => 0
			,'christmas' => 0
			,'familyDay' => 0
			,'picture' => 0
			,'gradFee' => 0
			,'scouting' => 0
			,'charity' => 0
			,'nutrition' => 0
			,'movingUp' => 0
			,'others' => 0
		);
		foreach( $data as $key ){
			$csvarray[] = array(
				$key[ 'studentName' ]
				,$key[ 'orNum' ]
				,$key[ 'tuition' ]
				,$key[ 'remarks' ]
				,$key[ 'trNum' ]
				,$key[ 'books' ]
				,$key[ 'annualRegistration' ]
				,$key[ 'uniform' ] 
				,$key[ 'catering' ]
				,$key[ 'extraCurricular' ]
				,$key[ 'christmas' ]
				,$key[ 'familyDay' ] 
				,$key[ 'picture' ] 
				,$key[ 'gradFee' ] 
				,$key[ 'scouting' ] 
				,$key[ 'charity' ] 
				,$key[ 'nutrition' ] 
				,$key[ 'movingUp' ] 
				,$key[ 'others' ]

			);
			$arrTot['annual'] += $key[ 'annualRegistration' ];
			$arrTot['tuition'] += $key[ 'tuition' ];
			$arrTot['books'] += $key[ 'books' ];
			$arrTot['uniform'] += $key[ 'uniform' ];
			$arrTot['catering'] += $key[ 'catering' ];
			$arrTot['extraCurricular'] += $key[ 'extraCurricular' ];
			$arrTot['christmas'] += $key[ 'christmas' ];
			$arrTot['familyDay'] += $key[ 'familyDay' ];
			$arrTot['picture'] += $key[ 'picture' ];
			$arrTot['gradFee'] += $key[ 'gradFee' ];
			$arrTot['scouting'] += $key[ 'scouting' ];
			$arrTot['charity'] += $key[ 'charity' ];
			$arrTot['nutrition'] += $key[ 'nutrition' ];
			$arrTot['movingUp'] += $key[ 'movingUp' ];
			$arrTot['others'] += $key[ 'others' ];
		}
		
		$rowIndex = count($view) - 1;

		$csvarray[] = array(

			 'Total'
			,''
			,$arrTot['tuition']
			,''
			,''
			,$arrTot['books']
			,$arrTot['annual']
			,$arrTot['uniform']
			,$arrTot['catering']
			,$arrTot['extraCurricular']
			,$arrTot['christmas']
			,$arrTot['familyDay']
			,$arrTot['picture']
			,$arrTot['gradFee']
			,$arrTot['scouting']
			,$arrTot['charity']
			,$arrTot['nutrition']
			,$arrTot['movingUp']
			,$arrTot['others']

		);

		$csvarray[] = array(
			 'Grand Total'
			,''
			,(
				$arrTot[ 'tuition' ] 
				+ $arrTot[ 'books' ] 
				+ $arrTot[ 'annual' ]
				+ $arrTot[ 'uniform' ] 
				+ $arrTot[ 'catering' ] 
				+ $arrTot[ 'extraCurricular' ] 
				+ $arrTot[ 'christmas' ] 
				+ $arrTot[ 'familyDay' ] 
				+ $arrTot[ 'picture' ] 
				+ $arrTot[ 'gradFee' ] 
				+ $arrTot[ 'scouting' ] 
				+ $arrTot[ 'charity' ] 
				+ $arrTot[ 'nutrition' ] 
				+ $arrTot[ 'movingUp' ]
				+ $arrTot[ 'others' ] 
			)
		);
		
		writeCsvFile(
			array(
				'csvarray' 	 => $csvarray
				,'title' 	 => $params['title'].''
				,'directory' => 'report'
			)
		);
	}
	
}