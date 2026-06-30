<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Balancessummary extends CI_Controller {
	
	/** Account Card _module
		* [Developer]
		* Developer: Roj Zim Jamil Actub Janubas
		* Date Created: May 14, 2018
		* Date Finished: 
		
		* [Database]
			
			
		* [Description]
		* 	This _module is created for students transsactions for payments and their current status per year.
		* [Modification]
		
		**/
	
	public function __construct()
	{
		parent::__construct();
		setHeader( 'report/Balancessummary_model' );
	}

	public function getFilter(){

		$params = getData();
		
		$view = null;

		$view = $this->model->getFilter( $params );

		array_unshift(

			$view,

			array(
				'id' => 0
				,'name' => 'All'
			)

		);

		die(

			json_encode(

				array(

					'success' => true
					,'view' => $view

				)

			)

		);

	}

	public function getBalances()
	{

		$params = getData();
		
		$view = $this->model->getBalances( $params );
		die(

			json_encode(

				array(

					'success' => true
					,'view' => $view
				)

			)

		);

	}

	public function printEXCEL ()
	{

		$params = getData();
		
		$view = $this->model->getBalances( $params );
		
		$csvarray[] = array( 'title' => $params['title'].'' );

		$csvarray[] = array( 'space' => '' );

		$csvarray[] = array( 'space' => '' );

		$csvarray[] = array(
			'col1' => 'Student Name',
			'col2' => 'Grade Level',
			'col3' => 'Annual Registration',
			'col4' => 'Tuition',
			'col5' => 'Books',
			'col6' => 'Uniform',
			'col7' => 'Catering',
			'col8' => 'Extra- Curricular',
			'col9' => 'Christmas',
			'col10' => 'Family Day',
			'col11' => 'Picture',
			'col12' => 'Grad Fee',
			'col13' => 'Scouting/ Camping',
			'col14' => 'Robotics',
			'col15' => 'Nutrition Day',
			'col16' => 'Moving Up/Recognition',
			'col17' => 'Others',
			'col18' => 'Beginning Balance',
			'col19' => 'Total Payments',
			'col20' => 'Total Balance'
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
			,'totRec' => 0
			,'totPay' => 0
			,'totBal' => 0
		);
		foreach( $view as $key ){
			$csvarray[] = array(
				$key[ 'studentName' ]
				,$key[ 'gradeLevelName' ]
				,$key[ 'annualRegistration' ]
				,$key[ 'tuition' ]
				,$key[ 'books' ]
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
				,$key[ 'totalReceivables' ] 
				,$key[ 'totalPayments' ]
				,$key[ 'totalBalance' ] 

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
			$arrTot['totRec'] += $key[ 'totalReceivables' ];
			$arrTot['totPay'] += $key[ 'totalPayments' ];
			$arrTot['totBal'] += $key[ 'totalBalance' ];
		}
		
		$rowIndex = count($view) - 1;

		$csvarray[] = array(

			 ''
			,'Total'
			,$arrTot['annual']
			,$arrTot['tuition']
			,$arrTot['books']
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
			,$arrTot['totRec']
			,$arrTot['totPay']
			,$arrTot['totBal']

		);
		
		writeCsvFile(
			array(
				'csvarray' 	 => $csvarray
				,'title' 	 => $params['title'].''
				,'directory' => 'report'
			)
		);

	}

	public function printPDF ()
	{

		$params = getData();

		$html = "";

		$view = $this->model->getBalances( $params );
		
		$html = '<table width="100%" cellpadding="5" border="1">';

		$html .= '<tr>';
		$html .= '<th style="font-weight: bold"> Student Name </th>';
		$html .= '<th style="font-weight: bold"> Grade Level </th>';
		$html .= '<th style="font-weight: bold"> Annual Registration </th>';
		$html .= '<th style="font-weight: bold"> Tuition </th>';
		$html .= '<th style="font-weight: bold"> Books </th>';
		$html .= '<th style="font-weight: bold"> Uniform </th>';
		$html .= '<th style="font-weight: bold"> Catering </th>';
		$html .= '<th style="font-weight: bold"> Extra- Curricular </th>';
		$html .= '<th style="font-weight: bold"> Christmas </th>';
		$html .= '<th style="font-weight: bold"> Family Day </th>';
		$html .= '<th style="font-weight: bold"> Picture </th>';
		$html .= '<th style="font-weight: bold"> Grad Fee </th>';
		$html .= '<th style="font-weight: bold"> Scouting/ Camping </th>';
		$html .= '<th style="font-weight: bold"> Robotics </th>';
		$html .= '<th style="font-weight: bold"> Nutrition Day </th>';
		$html .= '<th style="font-weight: bold"> Moving Up/Recognition </th>';
		$html .= '<th style="font-weight: bold"> Others </th>';
		$html .= '<th style="font-weight: bold"> Beginning Balance </th>';
		$html .= '<th style="font-weight: bold"> Total Payments </th>';
		$html .= '<th style="font-weight: bold"> Total Balance </th>';
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
			,'totRec' => 0
			,'totPay' => 0
			,'totBal' => 0
		);
		foreach ( $view AS $key )
		{

			$html .= '<tr>';
			$html .= '<td>'. $key[ 'studentName' ] .'</td>';
			$html .= '<td>'. $key[ 'gradeLevelName' ] .'</td>';
			$html .= '<td>'. number_format( $key[ 'annualRegistration' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'tuition' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'books' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'uniform' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'catering' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'extraCurricular' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'christmas' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'familyDay' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'picture' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'gradFee' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'scouting' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'charity' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'nutrition' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'movingUp' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'others' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'totalReceivables' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'totalPayments' ] ,2) .'</td>';
			$html .= '<td>'. number_format( $key[ 'totalBalance' ] ,2) .'</td>';
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
			$arrTot['totRec'] += $key[ 'totalReceivables' ];
			$arrTot['totPay'] += $key[ 'totalPayments' ];
			$arrTot['totBal'] += $key[ 'totalBalance' ];

		}
		
		$rowIndex = count($view) - 1;

		$html .= '<tr>';

		$html .= '<td></td>';
		$html .= '<td>Total </td>';
		$html .= '<td>'. number_format( $arrTot[ 'annual' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'tuition' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'books' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'uniform' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'catering' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'extraCurricular' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'christmas' ] ,2) .'</td>';
		$html .= '<td>'. number_format( $arrTot[ 'familyDay' ] ,2) .'</td>';
		$html .= '<td>'. number_format( $arrTot[ 'picture' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'gradFee' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'scouting' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'charity' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'nutrition' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'movingUp' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'others' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'totRec' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'totPay' ] ,2) . '</td>';
		$html .= '<td>'. number_format( $arrTot[ 'totBal' ] ,2) . '</td>';
		
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

}