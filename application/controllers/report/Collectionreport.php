<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Collectionreport extends CI_Controller {
	
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
		setHeader( 'report/Collectionreport_model' );
	}

	public function getFilter(){

		$params = getData();
		
		$view = null;

		/** Student **/
		
		if ( $params['sBy'] == 0 )
		{

			$view =	$this->model->getFilter( $params );

		}
		else
		{
			
			$view =	array(
				array(
					'id' => 'annualRegistration'
					,'name' => 'Annual Registration'
				),
				array(
					'id' => 'tuition'
					,'name' => 'Tuition'
				),
				array(
					'id' => 'books'
					,'name' => 'Books'
				),
				array(
					'id' => 'uniform'
					,'name' => 'Uniform'
				),
				array(
					'id' => 'catering'
					,'name' => 'Catering'
				),
				array(
					'id' => 'extraCurricular'
					,'name' => 'Extra Curricular'
				),
				array(
					'id' => 'christmas'
					,'name' => 'Christmas'
				),
				array(
					'id' => 'familyDay'
					,'name' => 'Family Day'
				),
				array(
					'id' => 'picture'
					,'name' => 'Picture'
				),
				array(
					'id' => 'gradFee'
					,'name' => 'Graduation Fee'
				),
				array(
					'id' => 'scouting'
					,'name' => 'Scouting'
				),
				array(
					'id' => 'charity'
					,'name' => 'Robotics'
				),
				array(
					'id' => 'others'
					,'name' => 'Others'
				),
				array(
					'id' => 'nutrition'
					,'name' => 'Nutrition Day'
				),
				array(
					'id' => 'movingUp'
					,'name' => 'Moving Up/Recognition'
				)
			);

		}

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

	public function getHistory(){

		$params = getData();

		$view = $this->model->viewAll( $params );
		
		_setLogs(

			array(
				'modeLevel' => 8
				,'modeLevel1' => 8.1
				,'idmodule' => 7
				,'bmapsUID' => $this->session->userdata('BMAPSUID')
			)

		);
		
		die(

			json_encode(

				array(

					'success' => true

					,'view' => $view
					
					,'count' => count($view)

				)

			)

		);

	}
	
	public function printPDF ( )
	{
	
		$params = getData();
		$html = '';
		$sum = 0;
		
		$view = $this->model->viewAll( $params );
		
		$html = '<table width="100%" cellpadding="5" border="1">';
		
		$html .= '<tr>';
		$html .= '<th style="text-align: center; font-weight: bold; background-color: #D3D3D3"> Student Name </th>';
		$html .= '<th style="text-align: center; font-weight: bold; background-color: #D3D3D3"> Date of Payment </th>';
		$html .= '<th style="text-align: center; font-weight: bold; background-color: #D3D3D3"> OR/TR Number </th>';
		$html .= '<th style="text-align: center; font-weight: bold; background-color: #D3D3D3"> Particulars </th>';
		$html .= '<th style="text-align: center; font-weight: bold; background-color: #D3D3D3"> Amount </th>';
		$html .= '</tr>';
		
		foreach( $view AS $key => $value )
		{
			
			$html .= '<tr>';
			
			$html .= '<td>' . $value[ 'studentName' ] . '</td>';
			$html .= '<td>' . date('m/d/Y', strtotime($value[ 'paymentDate' ])) . '</td>';
			$html .= '<td>' . $value[ 'refNum' ] . '</td>';
			$html .= '<td>' . $value[ 'particulars' ] . '</td>';
			$html .= '<td style="text-align: right">' . number_format($value[ 'amount' ],2) . '</td>';
			
			$html .= '</tr>';
			
			$sum = $sum + $value[ 'amount' ];
			
		}
		
		$html .= '<tr>';
		$html .= '<td></td>';
		$html .= '<td></td>';
		$html .= '<td></td>';
		$html .= '<td style="text-align: right"> Total </td>';
		$html .= '<td style="text-align: right; background-color: #D3D3D3">'. number_format($sum,2) .'</td>';
		$html .= '</tr>';
		
		$html .= '</table>';
		

		$params1 = array(
			'title' => $params['title']
			,'file_name' => $params['title']
			,'folder_name' => 'pdf/report/'
			,'addPage' => false
			,'table_hidden' => true
			,'grid_font_size' => 6
			,'orientation' => 'L'
		);
		
		generate_table( $params1, array(), array(), $html );
	
	}
	
	public function printEXCEL ()
	{
		
		$params = getData();
		
		$sum = 0;
		
		$view = $this->model->viewAll( $params );
		
		$csvarray[] = array( 'title' => $params['title'].'' );

		$csvarray[] = array( 'space' => '' );
		
		$csvarray[] = array(
			'col1' => $params['disp_sBy'],
			'col2' => $params['disp_filterBy']
		);
		
		$csvarray[] = array(
			'col1' => 'Date Range: ',
			'col2' => date('m/d/Y', strtotime( $params['sdate'] ) ) . ' - ' . date('m/d/Y', strtotime( $params['edate'] ) )
		);
		

		$csvarray[] = array( 'space' => '' );

		$csvarray[] = array(
			'col1' => 'Student Name',
			'col2' => 'Date of Payment',
			'col3' => 'OR/TR Number',
			'col4' => 'Particulars',
			'col5' => 'Amount'
		);
		
		foreach( $view as $key => $value ){
			$csvarray[] = array(

				$value[ 'studentName' ]
				,date('m/d/Y', strtotime($value[ 'paymentDate' ]))
				,$value[ 'refNum' ]
				,$value[ 'particulars' ]
				,number_format($value[ 'amount' ],2)
				
			);
			
			$sum = $sum + $value[ 'amount' ];
		}
		
		$csvarray[] = array(
			'',
			'',
			'',
			'Total',
			number_format($sum,2)
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