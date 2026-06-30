<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Paymentreport extends CI_Controller{
	
	public function __construct(){
		parent::__construct();
		setHeader( 'report/Paymentreport_model' );
	}
	
	public function getSchoolYear(){
		$params = getData();
		
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $this->model->getSchoolYear( $params )
				)
			)
		);
	}
	
	public function getGradeLevel(){
		$data = $this->model->getGradeLevel( getData() );
		
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $data
				)
			)
		);
	}
	
	public function viewReport( $print = false ){
		$params = getData();
		$batchReceivableCategoryID = (int)$params['batchReceivableCategoryID'];
		$view = ''; 
		
		/* retrieve records based on the payment category */
		if( $batchReceivableCategoryID < 12 ) $data = $this->model->getReceivableFromBatchReceivable( $params );
		else $data = $this->model->getReceivableFromAccountCard( $params );
		
		$header = '';
		$body = '';
		$footer = '';
		$hasExcess = false;
		
		/* plot view in the table */
		foreach( $data as $rs ){
			if( $rs['totalReceivable'] < $rs['totalPayments'] ){
				if( !$hasExcess ) $hasExcess = true;
			}
		}
		
		if( $batchReceivableCategoryID != 13 ){
			if( $batchReceivableCategoryID == 1 ){
				if( $hasExcess ) $view = '<table width="101%;" height="100%;" border="none">
							<tr style="text-align: right;">
									<th style="width:15%;"></th>
									<th style="width:8%;"></th>
									<th style="width:8%;"></th>
									<th style="width:8%;"></th>
									<th style="width:8%;"></th>
									<th style="width:8.7%;">0%</th>
									<th style="width:3.65%;">10%</th>
									<th style="width:3.65%;">20%</th>
									<th style="width:3.65%;">30%</th>
									<th style="width:3.65%;">40%</th>
									<th style="width:3.65%;">50%</th>
									<th style="width:3.65%;">60%</th>
									<th style="width:3.65%;">70%</th>
									<th style="width:3.65%;">80%</th>
									<th style="width:3.65%;">90%</th>
									<th style="width:3.65%;">100%</th>
									<th style="width:8%;"></th>
								</tr>
							</table>';
				else $view = '<table width="101%;" height="100%;" border="none">
							<tr style="text-align: right;">
									<th style="width:15%;"></th>
									<th style="width:8%;"></th>
									<th style="width:8%;"></th>
									<th style="width:8%;"></th>
									<th style="width:8%;"></th>
									<th style="width:8.5%;">0%</th>
									<th style="width:4.5%;">10%</th>
									<th style="width:4.5%;">20%</th>
									<th style="width:4.5%;">30%</th>
									<th style="width:4.5%;">40%</th>
									<th style="width:4.5%;">50%</th>
									<th style="width:4.5%;">60%</th>
									<th style="width:4.5%;">70%</th>
									<th style="width:4.5%;">80%</th>
									<th style="width:4.5%;">90%</th>
									<th style="width:4.5%;">100%</th>
								</tr>
							</table>';
			}
			else{
				if( $hasExcess ) $view = '<table width="101%;" height="100%;" border="none">
						<tr style="text-align: right;">
								<th style="width:15%;"></th>
								<th style="width:10%;"></th>
								<th style="width:10%;"></th>
								<th style="width:10.5%;">0%</th>
								<th style="width:4.45%;">10%</th>
								<th style="width:4.45%;">20%</th>
								<th style="width:4.45%;">30%</th>
								<th style="width:4.45%;">40%</th>
								<th style="width:4.45%;">50%</th>
								<th style="width:4.45%;">60%</th>
								<th style="width:4.45%;">70%</th>
								<th style="width:4.45%;">80%</th>
								<th style="width:4.45%;">90%</th>
								<th style="width:4.45%;">100%</th>
								<th style="width:10%;"></th>
							</tr>
						</table>';
				else $view = '<table width="101%;" height="100%;" border="none">
						<tr style="text-align: right;">
								<th style="width:15%;"></th>
								<th style="width:10%;"></th>
								<th style="width:10%;"></th>
								<th style="width:10.5%;">0%</th>
								<th style="width:5.5%;">10%</th>
								<th style="width:5.5%;">20%</th>
								<th style="width:5.5%;">30%</th>
								<th style="width:5.5%;">40%</th>
								<th style="width:5.5%;">50%</th>
								<th style="width:5.5%;">60%</th>
								<th style="width:5.5%;">70%</th>
								<th style="width:5.5%;">80%</th>
								<th style="width:5.5%;">90%</th>
								<th style="width:5.5%;">100%</th>
							</tr>
						</table>';
			}
		}
		$view .= '<table width="100%" height="100%;">';
		
		switch( $batchReceivableCategoryID ):
			case 1:
				if( $hasExcess ) $view .= '
						<tr style="text-align: center;">
							<th style="width:15%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Name</th>
							<th style="width:8%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Rec.</th>
							<th style="width:8%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Paid</th>
							<th style="width:8%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Bal.</th>
							<th style="width:8%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Days to pay</th>
							<th style="width:8.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Days paid</th>
							<th style="width:3.65%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:3.65%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:3.65%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:3.65%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:3.65%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:3.65%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:3.65%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:3.65%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:3.65%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:3.65%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:8%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Excess Pay.</th>
						</tr>
						';
				else $view .= '
						<tr style="text-align: center;">
							<th style="width:15%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Name</th>
							<th style="width:8%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Rec.</th>
							<th style="width:8%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Paid</th>
							<th style="width:8%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Bal.</th>
							<th style="width:8%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Days to pay</th>
							<th style="width:8.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Days paid</th>
							<th style="width:4.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
						</tr>
						';
				break;
			case 13: // Tuition
				if( $hasExcess ) $view .= '<tr style="text-align: center;">
							<th style="width:15%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Name</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Rec.</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Paid</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Bal.</th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Jun</th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Jul</th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Aug</th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Sep</th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Oct</th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Nov</th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Dec</th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Jan</th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Feb</th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Mar</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Excess Pay.</th>
						</tr>';
				else $view .= '<tr style="text-align: center;">
							<th style="width:15%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Name</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Rec.</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Paid</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Bal.</th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Jun</th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Jul</th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Aug</th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Sep</th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Oct</th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Nov</th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Dec</th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Jan</th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Feb</th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Mar</th>
						</tr>';
				break;
			default:
				if( $hasExcess ) $view .= '
						<tr style="text-align: center;">
							<th style="width:15%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Name</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Rec.</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Paid</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Bal.</th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:4.45%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Excess Pay.</th>
						</tr>
						';
				else $view .= '
						<tr style="text-align: center;">
							<th style="width:15%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Name</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Rec.</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Paid</th>
							<th style="width:10%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;">Bal.</th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
							<th style="width:5.5%;border: #000 1px solid;padding-top:5px;padding-bottom: 5px;"></th>
						</tr>
						';
				break;
		endswitch;
		
		$totRec = 0;
		$totPaid = 0;
		$totBal = 0;
		$excess = 0;
		foreach( $data as $rs ){
			$totRec += $rs['totalReceivable'];
			$totPaid += $rs['totalPayments'];
			$bal = ( $rs['totalReceivable'] - $rs['totalPayments'] );
			if( $bal < 0 ){
				$excess = $bal * -1;
				$bal = 0;
			}else $excess = 0;
			$totBal += $bal;
			if( $batchReceivableCategoryID == 1 ){
				$params['studentID'] = $rs['studentID'];
				$view .= '<tr>
							<td style="border: #000 1px solid;padding: 2px;">&nbsp;' . $rs['studentName'] . '</td>
							<td style="border: #000 1px solid;text-align: right;padding: 2px;">' . number_format( $rs['totalReceivable'], 2 ) . ' &nbsp;</td>
							<td style="border: #000 1px solid;text-align: right;padding: 2px;">' . number_format( $rs['totalPayments'], 2 ) . ' &nbsp;</td>
							<td style="border: #000 1px solid;text-align: right;padding: 2px;">' . number_format( $bal, 2, '.', ',' ) . ' &nbsp;</td>
							<td style="border: #000 1px solid;text-align: right;padding: 2px;">' . number_format( ( $this->model->getTotalDays( $params ) - $this->model->getTotalToDays( $params ) ), 1 ) . ' &nbsp;</td>
							<td style="border: #000 1px solid;text-align: right;padding: 2px;">' . number_format( $this->model->getTotalToDays( $params ), 1 ) . ' &nbsp;</td>
						';
			}
			else{
				$view .= '<tr>
							<td style="border: #000 1px solid;padding: 2px;">&nbsp;' . $rs['studentName'] . '</td>
							<td style="border: #000 1px solid;text-align: right;padding: 2px;">' . number_format( $rs['totalReceivable'], 2 ) . ' &nbsp;</td>
							<td style="border: #000 1px solid;text-align: right;padding: 2px;">' . number_format( $rs['totalPayments'], 2 ) . ' &nbsp;</td>
							<td style="border: #000 1px solid;text-align: right;padding: 2px;">' . number_format( $bal, 2, '.', ',' ) . ' &nbsp;</td>
						';
			}
			$perColumn = $rs['totalReceivable'] / 10;
			$totPay = $rs['totalPayments'];
			for( $i = 0; $i < 10; $i++ ){
				if( $totPay < $perColumn && $totPay > 0 ){
					$width = number_format( ( ( $totPay / $perColumn ) * 100 ), 2 );
					$view .= '<td style="border: #000 1px solid;"><table style="width: 100%;" border="0">
						<tr>
							<td style="width:' . $width . '%;" bgcolor="green"> ' . ( $print? '' : '&nbsp;' ) . ' </td>
							<td style="width:' . ( (100 - $width) - 2 ) . '%;" > ' . ( $print? '' : '&nbsp;' ) . ' </td>
						</tr>
					</table></td>';
					$totPay = 0;
				}
				else if( $totPay == 0 ){
					$view .= '<td style="border: #000 1px solid;"></td>';
				}
				else{
					$view .= '<td style="border: #000 1px solid;"><table style="width:100%;background-color: green;"> <tr><td bgcolor="green" > &nbsp; </td></tr> </table></td>';
					$totPay = $totPay - $perColumn;
				}
			}
			if( $hasExcess ) $view .= '<td style="border: #000 1px solid; text-align: right;">' . number_format( $excess, 2 ) . ' &nbsp;</td>';
			$view .= '</tr>';
		}
		if( $batchReceivableCategoryID == 1 ){
			$view .= '<tr>
						<td style="border: #000 1px solid;">&nbsp;<strong>Total</strong></td>
						<td style="border: #000 1px solid;text-align:right;">' . number_format( $totRec, 2 ) . ' &nbsp;</td>
						<td style="border: #000 1px solid;text-align:right;">' . number_format( $totPaid, 2 ) . ' &nbsp;</td>
						<td style="border: #000 1px solid;text-align:right;">' . number_format( $totBal, 2 ) . ' &nbsp;</td>
						<td style="border: #000 1px solid;"></td>
						<td style="border: #000 1px solid;"></td>
						<td style="border: #000 1px solid;" colspan="' . ( $hasExcess? '11' : '10' ) . '"></td>
					</tr>';
		}
		else{
			$view .= '<tr>
						<td style="border: #000 1px solid;">&nbsp;<strong>Total</strong></td>
						<td style="border: #000 1px solid;text-align:right;">' . number_format( $totRec, 2 ) . ' &nbsp;</td>
						<td style="border: #000 1px solid;text-align:right;">' . number_format( $totPaid, 2 ) . ' &nbsp;</td>
						<td style="border: #000 1px solid;text-align:right;">' . number_format( $totBal, 2 ) . ' &nbsp;</td>
						<td style="border: #000 1px solid;" colspan="' . ( $hasExcess? '11' : '10' ) . '"></td>
					</tr>';
		}
		/* end of the process */
		
		$view .= '</table>';
		if( $print ){
			return $view;
		}
		else{
			die(
				json_encode(
					array(
						'success' => true
						,'view' => $view
					)
				)
			);
		}
	}
	
	public function printPDF(){
		$view = $this->viewReport( true );
		$dat = getData();
		
		$html = '<table width="100%">';

		$html .= '<tr>';
		$html .= '<td>Payment Category: '. $dat[ 'paymentCategory' ] .'</td>';
		$html .= '<td>School Year: '. $dat[ 'schoolYearDis' ] .'</td>';
		$html .= '</tr>';

		$html .= '<tr>';
		$html .= '<td>Grade Level: '. $dat['gradeLevel'] .'</td>';
		$html .= '<td></td>';
		$html .= '</tr>';
		$html .= '</table>';
		
		$html .= $view;
		
		
		$params1 = array(
			'title' => $dat['title']
			,'file_name' => $dat['title']
			,'folder_name' => 'pdf/report/'
			,'addPage' => false
			,'table_hidden' => true
			,'grid_font_size' => 6
			,'orientation' => 'P'
		);
		
		generate_table( $params1, array(), array(), $html );
	}
	
}