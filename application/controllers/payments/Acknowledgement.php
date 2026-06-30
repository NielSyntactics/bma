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
class Acknowledgement extends CI_Controller {
    
    
    public function __construct(){
        parent::__construct();
        setHeader( 'payments/Acknowledgement_model' );
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

        $params = getData();
        

        // get students info
        $student = $this->model->getStudentPayments($params);
        $schoolyear = $this->model->getSchoolYearById( $params['schoolYear']);

        if(count($student) == 0 || ($student[0]['accountCardID'] == null)) {
            die(
                json_encode(
                    array(
                        'success' => false,
                        'message' => 'No payments found for the selected student.'
                    )
                )
            );
        }

        $accountcard = $this->model->getAccountCardById( $student[0]['accountCardID'], $params['schoolYear'] );
        $paymentList = $this->model->getStudentPaymentsInCertainSchoolYear($params, $student[0]['accountCardID']);
        $filename = $this->generateImage($student[0], $params, $accountcard, $schoolyear, $paymentList);
        die(
            json_encode(
                array(
                    'success' => true
                    ,'fileName' => $filename
                    , 'data' => $student[0]
                )
            )
        );
    }


    public function generateImage($data, $params, $accountCard, $schoolYear, $paymentList = [])
    {
        if (is_string($params['fees'])) {
            $params['fees'] = json_decode($params['fees'], true);
        }

        $feesMap = [
            'bookSelect' => ['Books', 'booksTotalReceivable', 'booksPaid'],
            'tuitionSelect' => ['Tuition', 'tuitionTotalReceivable', 'tuitionPaid'],
            'uniformSelect' => ['Uniform', 'uniformTotalReceivable', 'uniformPaid'],
            'cateringSelect' => ['Catering', 'cateringTotalReceivable', 'cateringPaid'],
            'extraCurricularSelect' => ['Skooltech', 'extracurricularTotalReceivable', 'extracurricularPaid'],
            'christmasSelect' => ['Christmas Party', 'christmasTotalReceivable', 'christmasPaid'],
            'familyDaySelect' => ['Family Day', 'familyDayTotalReceivable', 'familyDayPaid'],
            'pictureSelect' => ['Picture', 'pictureTotalReceivable', 'picturePaid'],
            'gradFeeSelect' => ['Graduation Fee', 'gradFeeTotalReceivable', 'gradFeePaid'],
            'scoutingCampingSelect' => ['GSP/BSP', 'scoutingTotalReceivable', 'scoutingPaid'],
            'charitySelect' => ['Robotics', 'charityTotalReceivable', 'charityPaid'],
            'nutritionDaySelect' => ['Nutrition Day', 'nutritionTotalReceivable', 'nutritionPaid'],
            'recognitionSelect' => ['Moving Up', 'movingUpTotalReceivable', 'movingUpPaid'],
            'othersSelect' => ['Others', 'othersTotalReceivable', 'othersPaid'],
            'annualRegSelect' => ['Annual Registration', 'annualRegistrationTotalReceivable', 'annualRegPaid']
        ];

        $paidMap = [
            'books' => ['Books'],
            'tuition' => ['Tuition'],
            'uniform' => ['Uniform'],
            'catering' => ['Catering'],
            'extraCurricular' => ['Skooltech'],
            'christmas' => ['Christmas Party'],
            'familyDay' => ['Family Day'],
            'picture' => ['Picture'],
            'gradFee' => ['Graduation Fee'],
            'scouting' => ['GSP/BSP'],
            'charity' => ['Robotics'],
            'nutrition' => ['Nutrition Day'],
            'movingUp' => ['Moving Up'],
            'others' => ['Others'],
            'annualRegistration' => ['Annual Registration']
        ];

        // === Create Image Canvas ===
        $width = 600;
        $height = (isset($params['with_date']) && $params['with_date'] == "true") ? 600 : 1000;
        $image = imagecreatetruecolor($width, $height);

        // === Define Colors ===
        $white = imagecolorallocate($image, 255, 255, 255);
        $black = imagecolorallocate($image, 0, 0, 0);
        $gray = imagecolorallocate($image, 230, 230, 230);
        $green = imagecolorallocate($image, 34, 139, 34);

        imagefilledrectangle($image, 0, 0, $width, $height, $white);

        $fontSize = 3;
        $x = 20;
        $y = 20;

        // === Logo ===
        $logoPath = FCPATH . 'images/logo/1.png';
        if (file_exists($logoPath)) {
            $logo = imagecreatefrompng($logoPath);
            $logoWidth = 150;
            $logoHeight = 120;
            $centerX = ($width - $logoWidth) / 2;
            imagecopyresized($image, $logo, $centerX, $y, 0, 0, $logoWidth, $logoHeight, imagesx($logo), imagesy($logo));
            imagedestroy($logo);
            $y += $logoHeight + 10;
        }

        // === Title ===
        $title = 'Payment Acknowledgement';
        $fontPath = FCPATH . 'resources/fonts/TimesNewRomanBold.ttf';
        $fontSizeTTF = 30;
        $titleBox = imagettfbbox($fontSizeTTF, 0, $fontPath, $title);
        $titleWidth = $titleBox[2] - $titleBox[0];
        $titleX = ($width - $titleWidth) / 2;
        imagettftext($image, $fontSizeTTF, 0, $titleX, $y + $fontSizeTTF, $black, $fontPath, $title);
        $y += 30;

        // === Student Info ===
        // === Student Info (Centered) ===
        $font = 3;
        $charWidth = imagefontwidth($font);

        // Helper function to center text
        function centerTextX($text, $imageWidth, $fontWidth) {
            return ($imageWidth - (strlen($text) * $fontWidth)) / 2;
        }

        $y += 20;

        $text = "Student Name: " . $data['name'];
        $xCentered = centerTextX($text, $width, $charWidth);
        imagestring($image, $font, $xCentered, $y, $text, $black);
        $y += 15;

        $text = "Grade Level: " . $data['gradeLevel'];
        $xCentered = centerTextX($text, $width, $charWidth);
        imagestring($image, $font, $xCentered, $y, $text, $black);
        $y += 20;

        $text = "School Year: " . $schoolYear->schoolYearStart;
        $xCentered = centerTextX($text, $width, $charWidth);
        imagestring($image, $font, $xCentered, $y, $text, $black);
        $y += 20;

        $y += 20; // extra spacing at the end


       // === Table Headers ===
        $font = 3;
        $rowHeight = 15;

        $dateLabel = "DATE";
        $orLabel = "REF #";
        $particularsLabel = "PARTICULARS";
        $amountLabel = "AMOUNT";

        $dateColWidth = 100;
        $orColWith = 70;
        $particularsColWidth = 230;
        $amountColWidth = 150;

        $tableWidth = $dateColWidth + $particularsColWidth + $amountColWidth;
        imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);
        imagestring($image, $font, $x + 5, $y + 2, $dateLabel, $black);
        imagestring($image, $font, $x + $dateColWidth +5, $y + 2, $orLabel, $black);
        imagestring($image, $font, $x + $dateColWidth + $orColWith + 5, $y + 2, $particularsLabel, $black);
        imagestring($image, $font, $x + $dateColWidth + $orColWith + $particularsColWidth + 5, $y + 2, $amountLabel, $black);
        // Vertical column lines in header
        imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
        imageline($image, $x + $dateColWidth + $orColWith, $y, $x + $dateColWidth + $orColWith, $y + $rowHeight, $black);
        imageline($image, $x + $dateColWidth + $orColWith + $particularsColWidth, $y, $x + $dateColWidth + $orColWith + $particularsColWidth, $y + $rowHeight, $black);

        $y += $rowHeight; // move to next row

        $totalAmount = 0;
        foreach ($paidMap as $fieldKey => $labelArr) {
            $amount = isset($data[$fieldKey]) ? floatval($data[$fieldKey]) : 0;
            if ($amount > 0) {
                $totalAmount += $amount;
            }
        }

        foreach ($paymentList as $payment) {
            foreach ($paidMap as $fieldKey => $labelArr) {
                $amount = isset($payment[$fieldKey]) ? floatval($payment[$fieldKey]) : 0;
                if ($amount > 0) {
                    // Draw row box
                    imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);
                    
                    // Vertical column lines
                    imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
                    imageline($image, $x + $dateColWidth + $orColWith, $y, $x + $dateColWidth + $orColWith, $y + $rowHeight, $black);
                    imageline($image, $x + $dateColWidth + $orColWith + $particularsColWidth, $y, $x + $dateColWidth + $orColWith + $particularsColWidth, $y + $rowHeight, $black);

                    imagestring($image, $font, $x + 5, $y + 2, $payment['paymentDate'], $black);
                    imagestring($image, $font, $x + $dateColWidth + 5, $y + 2, str_pad($payment['refnum'], 6, '0', STR_PAD_LEFT), $black);
                    imagestring($image, $font, $x + $dateColWidth + $orColWith + 5, $y + 2, $labelArr[0], $black);
                    imagestring($image, $font, $x + $dateColWidth + $orColWith + $particularsColWidth + 5, $y + 2, number_format($amount, 2), $black);
                    $y += $rowHeight;

                }
            }
        }
        

        // === Total Row with Borders and Simulated Bold ===
        $font = 4;
        $rowHeight = 18; // slightly taller for bold
        imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);

        // Column lines
        imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
        imageline($image, $x + $dateColWidth + $orColWith+ + $particularsColWidth, $y, $x + $dateColWidth + $orColWith+ + $particularsColWidth, $y + $rowHeight, $black);

        // Simulated bold text
        $totalLabel = "TOTAL";
        $totalValue = number_format($totalAmount, 2);

        for ($i = 0; $i <= 1; $i++) {
            for ($j = 0; $j <= 1; $j++) {
                imagestring($image, $font, $x + $dateColWidth + 5 + $i, $y + 2 + $j, $totalLabel, $black);
                imagestring($image, $font, $x + $dateColWidth + $orColWith+ $particularsColWidth + 5 + $i, $y + 2 + $j, $totalValue, $black);
            }
        }

        $y += $rowHeight + 10; // move down after table

        // === Thank You ===
        $tyMessage = "Thank you for your payment!";
        $fontPath = FCPATH . 'resources/fonts/TimesNewRomanBold.ttf';
        $fontSize = 18;
        $tyBox = imagettfbbox($fontSize, 0, $fontPath, $tyMessage);
        $tyWidth = $tyBox[2] - $tyBox[0];
        $tyX = ($width - $tyWidth) / 2;
        imagettftext($image, $fontSize, 0, $tyX, $y + $fontSize, $black, $fontPath, $tyMessage);
        $y += 25;
        $y += 20;

        // === Balance Section ===
        // Check if there are any balances to show
        $hasBalance = false;
        foreach ($feesMap as $selectKey => $config) {
            list($label, $totalKey, $paidKey) = $config;
            $total = isset($accountCard[$totalKey]) ? floatval($accountCard[$totalKey]) : 0;
            $paid = isset($accountCard[$paidKey]) ? floatval($accountCard[$paidKey]) : 0;
            $balance = max(0, $total - $paid);
            $isSelected = isset($params['fees'][$selectKey]) && $params['fees'][$selectKey];
            if ($balance > 0 && $isSelected) {
                $hasBalance = true;
                break;
            }
        }

        if ($hasBalance) {
            imagestring($image, 4, $x, $y, "Balance:", $black);
            $y += 15;

            $col = 0;
            foreach ($feesMap as $selectKey => $config) {
                list($label, $totalKey, $paidKey) = $config;
                $total = isset($accountCard[$totalKey]) ? floatval($accountCard[$totalKey]) : 0;
                $paid = isset($accountCard[$paidKey]) ? floatval($accountCard[$paidKey]) : 0;
                $balance = max(0, $total - $paid);

                $isSelected = isset($params['fees'][$selectKey]) && $params['fees'][$selectKey];
                if ($balance > 0 && $isSelected) {
                    $text = "$label: " . number_format($balance, 2);
                    imagestring($image, 3, $x + ($col * 180), $y, $text, $black);
                    $col++;
                    if ($col === 3) {
                        $y += 15;
                        $col = 0;
                    }
                }
            }
        }

        // === Save to File ===
        $filename = FCPATH . 'images/acknowledgement/' . $data['name'] . '.png';
        imagepng($image, $filename);
        imagedestroy($image);

        return $data['name'] . '.png';
    }

    public function generateImageOld_08112025($data, $params, $accountCard, $schoolYear, $paymentList = [])
    {
        if (is_string($params['fees'])) {
            $params['fees'] = json_decode($params['fees'], true);
        }

        $feesMap = [
            'bookSelect' => ['Books', 'booksTotalReceivable', 'booksPaid'],
            'tuitionSelect' => ['Tuition', 'tuitionTotalReceivable', 'tuitionPaid'],
            'uniformSelect' => ['Uniform', 'uniformTotalReceivable', 'uniformPaid'],
            'cateringSelect' => ['Catering', 'cateringTotalReceivable', 'cateringPaid'],
            'extraCurricularSelect' => ['Extra Curricular', 'extracurricularTotalReceivable', 'extracurricularPaid'],
            'christmasSelect' => ['Christmas Party', 'christmasTotalReceivable', 'christmasPaid'],
            'familyDaySelect' => ['Family Day', 'familyDayTotalReceivable', 'familyDayPaid'],
            'pictureSelect' => ['Picture', 'pictureTotalReceivable', 'picturePaid'],
            'gradFeeSelect' => ['Graduation Fee', 'gradFeeTotalReceivable', 'gradFeePaid'],
            'scoutingCampingSelect' => ['GSP/BSP', 'scoutingTotalReceivable', 'scoutingPaid'],
            'charitySelect' => ['Robotics', 'charityTotalReceivable', 'charityPaid'],
            'nutritionDaySelect' => ['Nutrition Day', 'nutritionTotalReceivable', 'nutritionPaid'],
            'recognitionSelect' => ['Moving Up', 'movingUpTotalReceivable', 'movingUpPaid'],
            'othersSelect' => ['Others', 'othersTotalReceivable', 'othersPaid'],
            'annualRegSelect' => ['Annual Registration', 'annualRegistrationTotalReceivable', 'annualRegPaid']
        ];

        $paidMap = [
            'books' => ['Books'],
            'tuition' => ['Tuition'],
            'uniform' => ['Uniform'],
            'catering' => ['Catering'],
            'extraCurricular' => ['Extra Curricular'],
            'christmas' => ['Christmas Party'],
            'familyDay' => ['Family Day'],
            'picture' => ['Picture'],
            'gradFee' => ['Graduation Fee'],
            'scouting' => ['GSP/BSP'],
            'charity' => ['Robotics'],
            'nutrition' => ['Nutrition Day'],
            'movingUp' => ['Moving Up'],
            'others' => ['Others'],
            'annualRegistration' => ['Annual Registration']
        ];

        // === Create Image Canvas ===
        $width = 600;
        $height = (isset($params['with_date']) && $params['with_date'] == "true") ? 600 : 1000;
        $image = imagecreatetruecolor($width, $height);

        // === Define Colors ===
        $white = imagecolorallocate($image, 255, 255, 255);
        $black = imagecolorallocate($image, 0, 0, 0);
        $gray = imagecolorallocate($image, 230, 230, 230);
        $green = imagecolorallocate($image, 34, 139, 34);

        imagefilledrectangle($image, 0, 0, $width, $height, $white);

        $fontSize = 3;
        $x = 20;
        $y = 20;

        // === Logo ===
        $logoPath = FCPATH . 'images/logo/1.png';
        if (file_exists($logoPath)) {
            $logo = imagecreatefrompng($logoPath);
            $logoWidth = 150;
            $logoHeight = 120;
            $centerX = ($width - $logoWidth) / 2;
            imagecopyresized($image, $logo, $centerX, $y, 0, 0, $logoWidth, $logoHeight, imagesx($logo), imagesy($logo));
            imagedestroy($logo);
            $y += $logoHeight + 10;
        }

        // === Title ===
        $title = 'Payment Acknowledgement';
        $fontPath = FCPATH . 'resources/fonts/TimesNewRomanBold.ttf';
        $fontSizeTTF = 30;
        $titleBox = imagettfbbox($fontSizeTTF, 0, $fontPath, $title);
        $titleWidth = $titleBox[2] - $titleBox[0];
        $titleX = ($width - $titleWidth) / 2;
        imagettftext($image, $fontSizeTTF, 0, $titleX, $y + $fontSizeTTF, $black, $fontPath, $title);
        $y += 30;

        // === Student Info ===
        // === Student Info (Centered) ===
        $font = 3;
        $charWidth = imagefontwidth($font);

        // Helper function to center text
        function centerTextX($text, $imageWidth, $fontWidth) {
            return ($imageWidth - (strlen($text) * $fontWidth)) / 2;
        }

        $y += 20;

        $text = "Student Name: " . $data['name'];
        $xCentered = centerTextX($text, $width, $charWidth);
        imagestring($image, $font, $xCentered, $y, $text, $black);
        $y += 15;

        $text = "Grade Level: " . $data['gradeLevel'];
        $xCentered = centerTextX($text, $width, $charWidth);
        imagestring($image, $font, $xCentered, $y, $text, $black);
        $y += 20;

        $text = "School Year: " . $schoolYear->schoolYearStart;
        $xCentered = centerTextX($text, $width, $charWidth);
        imagestring($image, $font, $xCentered, $y, $text, $black);
        $y += 20;

        $y += 20; // extra spacing at the end


       // === Table Headers ===
        $font = 3;
        $rowHeight = 15;

        $dateLabel = "DATE";
        $orLabel = "REF #";
        $particularsLabel = "PARTICULARS";
        $amountLabel = "AMOUNT";

        $dateColWidth = 100;
        $orColWith = 70;
        $particularsColWidth = 230;
        $amountColWidth = 150;

        $tableWidth = $dateColWidth + $particularsColWidth + $amountColWidth;
        imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);
        imagestring($image, $font, $x + 5, $y + 2, $dateLabel, $black);
        imagestring($image, $font, $x + $dateColWidth +5, $y + 2, $orLabel, $black);
        imagestring($image, $font, $x + $dateColWidth + $orColWith + 5, $y + 2, $particularsLabel, $black);
        imagestring($image, $font, $x + $dateColWidth + $orColWith + $particularsColWidth + 5, $y + 2, $amountLabel, $black);
        // Vertical column lines in header
        imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
        imageline($image, $x + $dateColWidth + $orColWith, $y, $x + $dateColWidth + $orColWith, $y + $rowHeight, $black);
        imageline($image, $x + $dateColWidth + $orColWith + $particularsColWidth, $y, $x + $dateColWidth + $orColWith + $particularsColWidth, $y + $rowHeight, $black);

        $y += $rowHeight; // move to next row

        $totalAmount = 0;

        // === Paid Items Rows with Borders ===
        if(isset($params['with_date']) && $params['with_date'] == "true") {
            foreach ($paidMap as $fieldKey => $labelArr) {
                $amount = isset($data[$fieldKey]) ? floatval($data[$fieldKey]) : 0;
                if ($amount > 0) {
                    // Draw row box
                    imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);
                    
                    // Vertical column lines
                    imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
                    imageline($image, $x + $dateColWidth + $orColWith, $y, $x + $dateColWidth + $orColWith, $y + $rowHeight, $black);
                    imageline($image, $x + $dateColWidth + $orColWith + $particularsColWidth, $y, $x + $dateColWidth + $orColWith + $particularsColWidth, $y + $rowHeight, $black);

                    imagestring($image, $font, $x + 5, $y + 2, $data['paymentDate'], $black);
                    imagestring($image, $font, $x + $dateColWidth + 5, $y + 2, str_pad($data['refnum'], 6, '0', STR_PAD_LEFT), $black);
                    imagestring($image, $font, $x + $dateColWidth + $orColWith + 5, $y + 2, $labelArr[0], $black);
                    imagestring($image, $font, $x + $dateColWidth + $orColWith + $particularsColWidth + 5, $y + 2, number_format($amount, 2), $black);

                    $totalAmount += $amount;
                    $y += $rowHeight;

                }
            }
        } else {
            foreach ($paidMap as $fieldKey => $labelArr) {
                $amount = isset($data[$fieldKey]) ? floatval($data[$fieldKey]) : 0;
                if ($amount > 0) {
                    $totalAmount += $amount;
                }
            }

            foreach ($paymentList as $payment) {
                foreach ($paidMap as $fieldKey => $labelArr) {
                    $amount = isset($payment[$fieldKey]) ? floatval($payment[$fieldKey]) : 0;
                    if ($amount > 0) {
                        // Draw row box
                        imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);
                        
                        // Vertical column lines
                        imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
                        imageline($image, $x + $dateColWidth + $orColWith, $y, $x + $dateColWidth + $orColWith, $y + $rowHeight, $black);
                        imageline($image, $x + $dateColWidth + $orColWith + $particularsColWidth, $y, $x + $dateColWidth + $orColWith + $particularsColWidth, $y + $rowHeight, $black);

                        imagestring($image, $font, $x + 5, $y + 2, $payment['paymentDate'], $black);
                        imagestring($image, $font, $x + $dateColWidth + 5, $y + 2, str_pad($payment['refnum'], 6, '0', STR_PAD_LEFT), $black);
                        imagestring($image, $font, $x + $dateColWidth + $orColWith + 5, $y + 2, $labelArr[0], $black);
                        imagestring($image, $font, $x + $dateColWidth + $orColWith + $particularsColWidth + 5, $y + 2, number_format($amount, 2), $black);
                        $y += $rowHeight;

                    }
                }
            }
        }

        // === Total Row with Borders and Simulated Bold ===
        $font = 4;
        $rowHeight = 18; // slightly taller for bold
        imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);

        // Column lines
        imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
        imageline($image, $x + $dateColWidth + $orColWith+ + $particularsColWidth, $y, $x + $dateColWidth + $orColWith+ + $particularsColWidth, $y + $rowHeight, $black);

        // Simulated bold text
        $totalLabel = "TOTAL";
        $totalValue = number_format($totalAmount, 2);

        for ($i = 0; $i <= 1; $i++) {
            for ($j = 0; $j <= 1; $j++) {
                imagestring($image, $font, $x + $dateColWidth + 5 + $i, $y + 2 + $j, $totalLabel, $black);
                imagestring($image, $font, $x + $dateColWidth + $orColWith+ $particularsColWidth + 5 + $i, $y + 2 + $j, $totalValue, $black);
            }
        }

        $y += $rowHeight + 10; // move down after table

        // === Thank You ===
        $tyMessage = "Thank you for your payment!";
        $fontPath = FCPATH . 'resources/fonts/TimesNewRomanBold.ttf';
        $fontSize = 18;
        $tyBox = imagettfbbox($fontSize, 0, $fontPath, $tyMessage);
        $tyWidth = $tyBox[2] - $tyBox[0];
        $tyX = ($width - $tyWidth) / 2;
        imagettftext($image, $fontSize, 0, $tyX, $y + $fontSize, $black, $fontPath, $tyMessage);
        $y += 25;
        $y += 20;

        // === Balance Section ===
        // Check if there are any balances to show
        $hasBalance = false;
        foreach ($feesMap as $selectKey => $config) {
            list($label, $totalKey, $paidKey) = $config;
            $total = isset($accountCard[$totalKey]) ? floatval($accountCard[$totalKey]) : 0;
            $paid = isset($accountCard[$paidKey]) ? floatval($accountCard[$paidKey]) : 0;
            $balance = max(0, $total - $paid);
            $isSelected = isset($params['fees'][$selectKey]) && $params['fees'][$selectKey];
            if ($balance > 0 && $isSelected) {
                $hasBalance = true;
                break;
            }
        }

        if ($hasBalance) {
            imagestring($image, 4, $x, $y, "Balance:", $black);
            $y += 15;

            $col = 0;
            foreach ($feesMap as $selectKey => $config) {
                list($label, $totalKey, $paidKey) = $config;
                $total = isset($accountCard[$totalKey]) ? floatval($accountCard[$totalKey]) : 0;
                $paid = isset($accountCard[$paidKey]) ? floatval($accountCard[$paidKey]) : 0;
                $balance = max(0, $total - $paid);

                $isSelected = isset($params['fees'][$selectKey]) && $params['fees'][$selectKey];
                if ($balance > 0 && $isSelected) {
                    $text = "$label: " . number_format($balance, 2);
                    imagestring($image, 3, $x + ($col * 180), $y, $text, $black);
                    $col++;
                    if ($col === 3) {
                        $y += 15;
                        $col = 0;
                    }
                }
            }
        }

        // === Save to File ===
        $filename = FCPATH . 'images/acknowledgement/' . $data['name'] . '.png';
        imagepng($image, $filename);
        imagedestroy($image);

        return $data['name'] . '.png';
    }

    public function generateImageOld($data, $params, $accountCard, $schoolYear)
    {
        if (is_string($params['fees'])) {
            $params['fees'] = json_decode($params['fees'], true);
        }

        $feesMap = [
            'bookSelect' => ['Books', 'booksTotalReceivable', 'booksPaid'],
            'tuitionSelect' => ['Tuition', 'tuitionTotalReceivable', 'tuitionPaid'],
            'uniformSelect' => ['Uniform', 'uniformTotalReceivable', 'uniformPaid'],
            'cateringSelect' => ['Catering', 'cateringTotalReceivable', 'cateringPaid'],
            'extraCurricularSelect' => ['Extra Curricular', 'extracurricularTotalReceivable', 'extracurricularPaid'],
            'christmasSelect' => ['Christmas Party', 'christmasTotalReceivable', 'christmasPaid'],
            'familyDaySelect' => ['Family Day', 'familyDayTotalReceivable', 'familyDayPaid'],
            'pictureSelect' => ['Picture', 'pictureTotalReceivable', 'picturePaid'],
            'gradFeeSelect' => ['Graduation Fee', 'gradFeeTotalReceivable', 'gradFeePaid'],
            'scoutingCampingSelect' => ['GSP/BSP', 'scoutingTotalReceivable', 'scoutingPaid'],
            'charitySelect' => ['Robotics', 'charityTotalReceivable', 'charityPaid'],
            'nutritionDaySelect' => ['Nutrition Day', 'nutritionTotalReceivable', 'nutritionPaid'],
            'recognitionSelect' => ['Moving Up', 'movingUpTotalReceivable', 'movingUpPaid'],
            'othersSelect' => ['Others', 'othersTotalReceivable', 'othersPaid'],
            'annualRegSelect' => ['Annual Registration', 'annualRegistrationTotalReceivable', 'annualRegPaid']
        ];

        $paidMap = [
            'books' => ['Books'],
            'tuition' => ['Tuition'],
            'uniform' => ['Uniform'],
            'catering' => ['Catering'],
            'extraCurricular' => ['Extra Curricular'],
            'christmas' => ['Christmas Party'],
            'familyDay' => ['Family Day'],
            'picture' => ['Picture'],
            'gradFee' => ['Graduation Fee'],
            'scouting' => ['GSP/BSP'],
            'charity' => ['Robotics'],
            'nutrition' => ['Nutrition Day'],
            'movingUp' => ['Moving Up'],
            'others' => ['Others'],
            'annualRegistration' => ['Annual Registration']
        ];

        // === Create Image Canvas ===
        $width = 600;
        $height = 600;
        $image = imagecreatetruecolor($width, $height);

        // === Define Colors ===
        $white = imagecolorallocate($image, 255, 255, 255);
        $black = imagecolorallocate($image, 0, 0, 0);
        $gray = imagecolorallocate($image, 230, 230, 230);
        $green = imagecolorallocate($image, 34, 139, 34);

        imagefilledrectangle($image, 0, 0, $width, $height, $white);

        $fontSize = 3;
        $x = 20;
        $y = 20;

        // === Logo ===
        $logoPath = FCPATH . 'images/logo/1.png';
        if (file_exists($logoPath)) {
            $logo = imagecreatefrompng($logoPath);
            $logoWidth = 150;
            $logoHeight = 120;
            $centerX = ($width - $logoWidth) / 2;
            imagecopyresized($image, $logo, $centerX, $y, 0, 0, $logoWidth, $logoHeight, imagesx($logo), imagesy($logo));
            imagedestroy($logo);
            $y += $logoHeight + 10;
        }

        // === Title ===
        $title = 'Payment Acknowledgement';
        $fontPath = FCPATH . 'resources/fonts/TimesNewRomanBold.ttf';
        $fontSizeTTF = 30;
        $titleBox = imagettfbbox($fontSizeTTF, 0, $fontPath, $title);
        $titleWidth = $titleBox[2] - $titleBox[0];
        $titleX = ($width - $titleWidth) / 2;
        imagettftext($image, $fontSizeTTF, 0, $titleX, $y + $fontSizeTTF, $black, $fontPath, $title);
        $y += 30;

        // === Student Info ===
        // === Student Info (Centered) ===
        $font = 3;
        $charWidth = imagefontwidth($font);

        // Helper function to center text
        function centerTextX($text, $imageWidth, $fontWidth) {
            return ($imageWidth - (strlen($text) * $fontWidth)) / 2;
        }

        $y += 20;

        $text = "Student Name: " . $data['name'];
        $xCentered = centerTextX($text, $width, $charWidth);
        imagestring($image, $font, $xCentered, $y, $text, $black);
        $y += 15;

        $text = "Grade Level: " . $data['gradeLevel'];
        $xCentered = centerTextX($text, $width, $charWidth);
        imagestring($image, $font, $xCentered, $y, $text, $black);
        $y += 20;

        $text = "School Year: " . $schoolYear->schoolYearStart;
        $xCentered = centerTextX($text, $width, $charWidth);
        imagestring($image, $font, $xCentered, $y, $text, $black);
        $y += 20;

        $y += 20; // extra spacing at the end


       // === Table Headers ===
        $font = 3;
        $rowHeight = 15;

        $dateLabel = "DATE";
        $particularsLabel = "PARTICULARS";
        $amountLabel = "AMOUNT";

        $dateColWidth = 150;
        $particularsColWidth = 250;
        $amountColWidth = 150;

        if(isset($params['with_date']) && $params['with_date'] == "true") {
            $tableWidth = $dateColWidth + $particularsColWidth + $amountColWidth;
            imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);
            imagestring($image, $font, $x + 5, $y + 2, $dateLabel, $black);
            imagestring($image, $font, $x + $dateColWidth + 5, $y + 2, $particularsLabel, $black);
            imagestring($image, $font, $x + $dateColWidth + $particularsColWidth + 5, $y + 2, $amountLabel, $black);
            // Vertical column lines in header
            imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
            imageline($image, $x + $dateColWidth + $particularsColWidth, $y, $x + $dateColWidth + $particularsColWidth, $y + $rowHeight, $black);
        } else {
            $tableWidth = 270 + 270;
            // Draw header background box
            imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);
            imagestring($image, $font, $x + 5, $y + 2, $particularsLabel, $black);
            imagestring($image, $font, $x + $particularsColWidth + 5, $y + 2, $amountLabel, $black);
            // Vertical column lines in header
            imageline($image, $x, $y, $x, $y + $rowHeight, $black);
            imageline($image, $x + $particularsColWidth, $y, $x + $particularsColWidth, $y + $rowHeight, $black);
        }

        $y += $rowHeight; // move to next row

        $totalAmount = 0;

        // === Paid Items Rows with Borders ===
        foreach ($paidMap as $fieldKey => $labelArr) {
            $amount = isset($data[$fieldKey]) ? floatval($data[$fieldKey]) : 0;
            if ($amount > 0) {
                // Draw row box
                imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);
                
                if (isset($params['with_date']) && $params['with_date'] == "true") {
                    // Vertical column lines
                    imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
                    imageline($image, $x + $dateColWidth + $particularsColWidth, $y, $x + $dateColWidth + $particularsColWidth, $y + $rowHeight, $black);

                    imagestring($image, $font, $x + 5, $y + 2, $data['paymentDate'], $black);
                    imagestring($image, $font, $x + $dateColWidth + 5, $y + 2, $labelArr[0], $black);
                    imagestring($image, $font, $x + $dateColWidth + $particularsColWidth + 5, $y + 2, number_format($amount, 2), $black);

                    $totalAmount += $amount;
                    $y += $rowHeight;
                } else {
                    // Vertical column lines
                    imageline($image, $x , $y, $x, $y + $rowHeight, $black);
                    imageline($image, $x + $particularsColWidth, $y, $x + $particularsColWidth, $y + $rowHeight, $black);

                    imagestring($image, $font, $x + 5, $y + 2, $labelArr[0], $black);
                    imagestring($image, $font, $x + $particularsColWidth + 5, $y + 2, number_format($amount, 2), $black);

                    $totalAmount += $amount;
                    $y += $rowHeight;
                }

            }
        }

        // === Total Row with Borders and Simulated Bold ===
        $font = 4;
        $rowHeight = 18; // slightly taller for bold
        imagerectangle($image, $x, $y, $x + $tableWidth, $y + $rowHeight, $black);

        // Column lines
        if (isset($params['with_date']) && $params['with_date'] == "true") {
            imageline($image, $x + $dateColWidth, $y, $x + $dateColWidth, $y + $rowHeight, $black);
            imageline($image, $x + $dateColWidth + $particularsColWidth, $y, $x + $dateColWidth + $particularsColWidth, $y + $rowHeight, $black);

            // Simulated bold text
            $totalLabel = "TOTAL";
            $totalValue = number_format($totalAmount, 2);

            for ($i = 0; $i <= 1; $i++) {
                for ($j = 0; $j <= 1; $j++) {
                    imagestring($image, $font, $x + $dateColWidth + 5 + $i, $y + 2 + $j, $totalLabel, $black);
                    imagestring($image, $font, $x + $dateColWidth + $particularsColWidth + 5 + $i, $y + 2 + $j, $totalValue, $black);
                }
            }
        } else {
            imageline($image, $x, $y, $x , $y + $rowHeight, $black);
            imageline($image, $x + $particularsColWidth, $y, $x + $particularsColWidth, $y + $rowHeight, $black);

            // Simulated bold text
            $totalLabel = "TOTAL";
            $totalValue = number_format($totalAmount, 2);

            for ($i = 0; $i <= 1; $i++) {
                for ($j = 0; $j <= 1; $j++) {
                    imagestring($image, $font, $x + 5 + $i, $y + 2 + $j, $totalLabel, $black);
                    imagestring($image, $font, $x + $particularsColWidth + 5 + $i, $y + 2 + $j, $totalValue, $black);
                }
            }
        }

        $y += $rowHeight + 10; // move down after table

        // === Thank You ===
        $tyMessage = "Thank you for your payment!";
        $fontPath = FCPATH . 'resources/fonts/TimesNewRomanBold.ttf';
        $fontSize = 18;
        $tyBox = imagettfbbox($fontSize, 0, $fontPath, $tyMessage);
        $tyWidth = $tyBox[2] - $tyBox[0];
        $tyX = ($width - $tyWidth) / 2;
        imagettftext($image, $fontSize, 0, $tyX, $y + $fontSize, $black, $fontPath, $tyMessage);
        $y += 25;
        $y += 20;

        // === Balance Section ===
        // Check if there are any balances to show
        $hasBalance = false;
        foreach ($feesMap as $selectKey => $config) {
            list($label, $totalKey, $paidKey) = $config;
            $total = isset($accountCard[$totalKey]) ? floatval($accountCard[$totalKey]) : 0;
            $paid = isset($accountCard[$paidKey]) ? floatval($accountCard[$paidKey]) : 0;
            $balance = max(0, $total - $paid);
            $isSelected = isset($params['fees'][$selectKey]) && $params['fees'][$selectKey];
            if ($balance > 0 && $isSelected) {
                $hasBalance = true;
                break;
            }
        }

        if (true) {
            imagestring($image, 4, $x, $y, "Balance:", $black);
            $y += 15;

            $col = 0;
            foreach ($feesMap as $selectKey => $config) {
                list($label, $totalKey, $paidKey) = $config;
                $total = isset($accountCard[$totalKey]) ? floatval($accountCard[$totalKey]) : 0;
                $paid = isset($accountCard[$paidKey]) ? floatval($accountCard[$paidKey]) : 0;
                $balance = max(0, $total - $paid);

                $isSelected = isset($params['fees'][$selectKey]) && $params['fees'][$selectKey];
                if ($balance > 0 && $isSelected) {
                    $text = "$label: " . number_format($balance, 2);
                    imagestring($image, 3, $x + ($col * 180), $y, $text, $black);
                    $col++;
                    if ($col === 3) {
                        $y += 15;
                        $col = 0;
                    }
                }
            }
        }

        // === Save to File ===
        $filename = FCPATH . 'images/acknowledgement/' . $data['name'] . '.png';
        imagepng($image, $filename);
        imagedestroy($image);

        return $data['name'] . '.png';
    }
}