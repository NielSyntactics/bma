<?php

/** Payment Reminders module
  * [Developer]
  * Developer: Niño Niel B. Iroc
  * Date Created: June 17, 2025
  * Date Finished:
  
  * [Database]
    
	
  * [Description]
    
 * [Modification]

 **/


if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Reminders extends CI_Controller {
	
	
    public function __construct(){
		parent::__construct();
		setHeader( 'payments/Reminders_model' );
	}

    public function getGradeLevels(){
		
		$params = getData();
		$view = $this->model->getGradeLevels( $params );
		
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
				)
			)
		);
	}

	public function getSchoolYear(){
	
		$params = getData();
		$view = $this->model->getSchoolYear( $params );

		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					,'total' => count($view)
				)
			)
		);
	}

	public function getStudentsList(){
		
		$params = getData();
		$view = $this->model->getStudentsList( $params );
		array_unshift( $view, array( 'id' => 0, 'name' => 'All' ) );
		
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
				)
			)
		);
	}

	public function generatePayment() {

		ob_clean(); // clear previous output buffers
		ob_start(); // start clean buffering
		$params = getData();

		// get students info
		$studentsWithAccounts = $this->model->getStudentsWithAccountCardsNew($params);
		$generatedFiles = [];

		// Generate PDF for each student
		$noDownloadable = true;
		foreach ($studentsWithAccounts as $student) {
			$accountCard = $this->model->getAccountCardById( $student['accountCardID']);
			$student['account_card'] = $accountCard;
			
			$anotherRecievable = $this->model->retrieveData(['accountCardSchoolYear' => $params['schoolYear'], 'studentID' => $student['id']]);

			$student['annualRegistrationTotalReceivable'] = $anotherRecievable[0]['annualRegistrationTotalReceivable'];
			$student['tuitionTotalReceivable'] = $anotherRecievable[0]['tuitionTotalReceivable'];
			$student['booksTotalReceivable'] = $anotherRecievable[0]['booksTotalReceivable'];
			$student['uniformTotalReceivable'] = $anotherRecievable[0]['uniformTotalReceivable'];
			$student['cateringTotalReceivable'] = $anotherRecievable[0]['cateringTotalReceivable'];
			$student['extracurricularTotalReceivable'] = $anotherRecievable[0]['extracurricularTotalReceivable'];
			$student['christmasTotalReceivable'] = $anotherRecievable[0]['christmasTotalReceivable'];
			$student['familyDayTotalReceivable'] = $anotherRecievable[0]['familyDayTotalReceivable'];
			$student['pictureTotalReceivable'] = $anotherRecievable[0]['pictureTotalReceivable'];
			$student['gradFeeTotalReceivable'] = $anotherRecievable[0]['gradFeeTotalReceivable'];
			$student['scoutingTotalReceivable'] = $anotherRecievable[0]['scoutingTotalReceivable'];
			$student['charityTotalReceivable'] = $anotherRecievable[0]['charityTotalReceivable'];
			$student['nutritionTotalReceivable'] = $anotherRecievable[0]['nutritionTotalReceivable'];
			$student['movingUpTotalReceivable'] = $anotherRecievable[0]['movingUpTotalReceivable'];
			$student['othersTotalReceivable'] = $anotherRecievable[0]['othersTotalReceivable'];

			$filename = $this->generateImage($student, $params);
			if ($filename) {
				$noDownloadable = false;
				$generatedFiles[] = FCPATH . 'images/reminders/' . $filename;
			}
		}

		if( $noDownloadable ) {
			die(
				json_encode(
					array(
						'success' => false,
						'message' => 'No students with outstanding balances found.'
					)
				)
			);
		}


		// Create ZIP
		$zipName = date('Ymd') . '.zip';
		$zipPath = FCPATH . 'images/reminders/' . $zipName;

		$this->load->library('zip');

		foreach ($generatedFiles as $file) {
			if (file_exists($file)) {
				$this->zip->read_file($file);
			}
		}

		// Write the zip file
		$this->zip->archive($zipPath);

		// foreach ($generatedFiles as $file) {
		// 	if (file_exists($file)) {
		// 		unlink($file); // delete individual PDF
		// 	}
		// }
		ob_end_clean();
		die(
			json_encode(
				array(
					'success' => true
					,'zipName' => $zipName
				)
			)
		);
	}

	public function generateImage($data, $params)
	{
		if (is_string($params['fees'])) {
			$params['fees'] = json_decode($params['fees'], true);
		}

		$monthMap = [
			1 => 'June', 2 => 'July', 3 => 'August', 4 => 'September', 5 => 'October',
			6 => 'November', 7 => 'December', 8 => 'January', 9 => 'February', 10 => 'March'
		];
		

		$feesMap = [
			'bookSelect' => ['Books', 'booksTotalReceivable', 'booksPaid'],
			'tuitionSelect' => ['November to April', 'tuitionTotalReceivable', 'tuitionPaid'],
			'uniformSelect' => ['Uniform', 'uniformTotalReceivable', 'uniformPaid'],
			'cateringSelect' => ['Catering', 'cateringTotalReceivable', 'cateringPaid'],
			'extraCurricularSelect' => ['Skooltech', 'extracurricularTotalReceivable', 'extracurricularPaid'],
			'christmasSelect' => ['Christmas Party', 'christmasTotalReceivable', 'christmasPaid'],
			'familyDaySelect' => ['Family Day', 'familyDayTotalReceivable', 'familyDayPaid'],
			'pictureSelect' => ['Picture', 'pictureTotalReceivable', 'picturePaid'],
			'gradFeeSelect' => ['Graduation Fee', 'gradFeeTotalReceivable', 'gradFeePaid'],
			'scoutingCampingSelect' => ['GSP/BSP', 'scoutingTotalReceivable', 'scoutingPaid'],
			'charitySelect' => ['Charity', 'charityTotalReceivable', 'charityPaid'],
			'nutritionDaySelect' => ['Nutrition Day', 'nutritionTotalReceivable', 'nutritionPaid'],
			'recognitionSelect' => ['Moving Up', 'movingUpTotalReceivable', 'movingUpPaid'],
			'othersSelect' => ['Others', 'othersTotalReceivable', 'othersPaid'],
			'annualRegSelect' => ['Annual Registration', 'annualRegistrationTotalReceivable', 'annualRegPaid']
		];

		$includeAll = isset($params['fees']['finalPaymentSelect']) && $params['fees']['finalPaymentSelect'];


		$skipStudentWithZeroBalance = true;
		foreach ($feesMap as $selectKey => $config) {
			list($label, $dataKey, $paidKey) = $config;
			$isSelected = $includeAll || (isset($params['fees'][$selectKey]) && $params['fees'][$selectKey]);

			if ($isSelected) { 
				$rawAmount = isset($data[$dataKey]) ? floatval($data[$dataKey]) : 0;
				$amountPaid = isset($data['account_card'][$paidKey]) ? floatval($data['account_card'][$paidKey]) : 0;

				if ($selectKey === 'tuitionSelect') {
					$fullAmount = $rawAmount;
					if (isset($params['tuitionStart'], $params['tuitionEnd'])) {
						$start = (int)$params['tuitionStart'];
						$end = (int)$params['tuitionEnd'];
						if (isset($monthMap[$start]) && isset($monthMap[$end]) && $start <= $end) {
							// $label = $monthMap[$start] . ' to ' . $monthMap[$end];
							$label = 'Tuition';
						}
						$monthsSelected = $end - $start + 1;
						$monthlyRate = $fullAmount / 10;
						$rawAmount = max(0, ($monthlyRate * $monthsSelected) - $amountPaid);

						if($rawAmount > 0) {
							$skipStudentWithZeroBalance = false;
							break;
						} 
						} else {
							$unpaidAmount = max(0, $rawAmount - $amountPaid);

							if($unpaidAmount > 0) {
								$skipStudentWithZeroBalance = false;
								break;
							} 
						}
				} else {
					$unpaidAmount = max(0, $rawAmount - $amountPaid);

					if($unpaidAmount > 0) {
						$skipStudentWithZeroBalance = false;
						break;
					} 
				}
			}
		}

		if($skipStudentWithZeroBalance) {
			return ;
		}
		// Estimate size
		$width = 480;
		$height = 600;
		$image = imagecreatetruecolor($width, $height);

		// Colors
		$white = imagecolorallocate($image, 255, 255, 255);
		$black = imagecolorallocate($image, 0, 0, 0);
		$green = imagecolorallocate($image, 144, 198, 149);

		$backgroundColor = $includeAll ? $green : $white;
		imagefilledrectangle($image, 0, 0, $width, $height, $backgroundColor);
		// Fonts
		$fontSize = 3;
		$x = 10;
		$y = 10;

		// Header: Name & Grade Level on same line
		$nameText = strtoupper($data['name']);
		$gradeText = $data['gradeLevel'];

		$font = $fontSize + 2;
		$charWidth = imagefontwidth($font);

		$nameWidth = strlen($nameText) * $charWidth;
		$gradeWidth = strlen($gradeText) * $charWidth;

		$nameX = $x;
		$gradeX = $width - $gradeWidth - 20; // 20px padding from right
		$minSpacing = 20;

		// Check for overlap
		if ($nameX + $nameWidth + $minSpacing > $gradeX) {
			// Not enough space: draw on separate lines
			imagestring($image, $font, $nameX, $y, $nameText, $black);
			$y += 25;
			imagestring($image, $font, $nameX, $y, $gradeText, $black);
		} else {
			// Enough space: draw on the same line
			imagestring($image, $font, $nameX, $y, $nameText, $black);
			imagestring($image, $font, $gradeX, $y, $gradeText, $black);
		}
		$y += 25;

		// Logo centered
		$logoPath = FCPATH . 'images/logo/1.png';
		if (file_exists($logoPath)) {
			$logo = imagecreatefrompng($logoPath);
			$logoWidth = 150;
			$logoHeight = 120;
			$logoX = ($width - $logoWidth) / 2;
			$logoY = $y;

			imagecopyresized($image, $logo, $logoX, $logoY, 0, 0, $logoWidth, $logoHeight, imagesx($logo), imagesy($logo));
			imagedestroy($logo);

			$y += $logoHeight + 10; // move below logo
		} else {
			$y += 110; // skip logo space if missing
		}

		// Title below logo
		$title = strtoupper($params['title']);
		$fontPath = FCPATH . 'resources/fonts/TimesNewRomanBold.ttf';
		$fontSize = 18;
		$titleBox = imagettfbbox($fontSize, 0, $fontPath, $title);
		$titleWidth = $titleBox[2] - $titleBox[0];
		$titleX = ($width - $titleWidth) / 2;
		imagettftext($image, $fontSize, 0, $titleX, $y + $fontSize, $black, $fontPath, $title);
		$y += 25;


		// Pay notice
		imagestring($image, $fontSize + 1, $x, $y, 'Please pay:', $black);
		$y += 20;

		// Table rows
		$items = [];
		$totalBalance = 0;

		foreach ($feesMap as $selectKey => $config) {
			list($label, $dataKey, $paidKey) = $config;

			$isSelected = $includeAll || (isset($params['fees'][$selectKey]) && $params['fees'][$selectKey]);

			if ($isSelected) {
				$rawAmount = isset($data[$dataKey]) ? floatval($data[$dataKey]) : 0;
				$amountPaid = isset($data['account_card'][$paidKey]) ? floatval($data['account_card'][$paidKey]) : 0;

				if (!$includeAll && $selectKey === 'bookSelect') {
					// $percentage = floatval($params['bookPercentage']) / 100;
					// $balance = max(0, $rawAmount - $amountPaid);

					// $rawAmount *= $percentage;
					// $rawAmount = ($rawAmount > $balance) ? $balance : $rawAmount;

					$percentage = floatval($params['bookPercentage']) / 100;
					$rawAmount = max(0, $rawAmount - $amountPaid);
					$rawAmount *= $percentage;
				} elseif ($selectKey === 'tuitionSelect') {
					$fullAmount = $rawAmount;
					if ($includeAll) {
						$rawAmount = max(0, $fullAmount - $amountPaid);
						$label = 'Tuition';
					} elseif (isset($params['tuitionStart'], $params['tuitionEnd'])) {
						$start = (int)$params['tuitionStart'];
						$end = (int)$params['tuitionEnd'];
						if (isset($monthMap[$start]) && isset($monthMap[$end]) && $start <= $end) {
							// $label = $monthMap[$start] . ' to ' . $monthMap[$end];
							$label = 'Tuition';
						}
						$monthsSelected = $end - $start + 1;
						$monthlyRate = $fullAmount / 10;
						$rawAmount = max(0, ($monthlyRate * $monthsSelected) - $amountPaid);
					}
				} else {
					$rawAmount = max(0, $rawAmount - $amountPaid);
				}

				if((int) $rawAmount > 0) {
					$amount = number_format($rawAmount, 2);
					$items[] = [$label, $amount];
					$totalBalance += floatval(str_replace(',', '', $amount));
				}
			}
		}


		// Draw table with row borders (stacked)
		$rowHeight = 20;
		$textHeight = imagefontheight($fontSize + 1);

		// Define left column width (adjust as needed)
		$leftColX = $x - 30; // left edge of the cell
		$leftColWidth = ($width - 30) - $leftColX - 130; // subtract right col & padding

		// Inside the loop
		foreach ($items as $item) {
			$top = $y;
			$bottom = $y + $rowHeight - 1;
			imagerectangle($image, $leftColX, $top, $width + 30, $bottom, $black);

			$textY = $y + (int)(($rowHeight - $textHeight) / 2);

			// Calculate width of the string
			$item0Width = strlen($item[0]) * imagefontwidth($fontSize + 1);

			// Center horizontally inside left column
			$item0X = $leftColX + (int)(($leftColWidth - $item0Width) / 2);

			imagestring($image, $fontSize + 1, $item0X, $textY, $item[0], $black);
			imagestring($image, $fontSize + 1, $width - 120, $textY, $item[1], $black);

			$y += $rowHeight;
		}

		// Total
		$y += 10;

		// Compute TOTAL text width and center in left column
		$totalLabel = 'TOTAL';
		$totalLabelWidth = strlen($totalLabel) * imagefontwidth($fontSize + 2);
		$totalLabelX = $leftColX + (int)(($leftColWidth - $totalLabelWidth) / 2);
		$textY = $y;

		// Draw TOTAL label
		imagestring($image, $fontSize + 2, $totalLabelX, $textY, $totalLabel, $black);
		imagestring($image, $fontSize + 2, $width - 120, $y, number_format($totalBalance, 2), $black);

		// Save as PNG
		$filename = FCPATH . 'images/reminders/' . $data['name'] . '.png';
		imagepng($image, $filename);
		imagedestroy($image);

		return $data['name'] . '.png';
	}




}