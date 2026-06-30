<?php
/** Grade level age management module
  * [Developer]
  * Developer: Niño Niel B. Iroc
  * Date Created: Aug. 09, 2023
  * Date Finished: 

  * [Database]
    gradelevel
	
  * [Description]
    This module allows the authorized administrators to set grade level age

 * [Modification]

 **/
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class PaymentReminders_model extends CI_Model {
	
  public function getGradeLevels ( $params = array() ){
    if ( isset($params['gradeLevelID']) )
    {
      $this->db->where( 'gradelevelID', $params['gradeLevelID'] );
    }

    $this->db->order_by('dateOfBirth', 'DESC');
    $result =  $this->db->get( 'gradelevel' )->result_array();
    return $result;
    
  }

  public function getSchoolYear( $params ){

    $where ="";
    
    return $this->db->query("
      SELECT
        schoolYearID,
        CONCAT(schoolYearStart,
            '-',
            (schoolYearStart + 1)) AS schoolYearStart
      FROM
        schoolyear
      $where
      ORDER BY schoolYearStart DESC
    ")->result_array();
    
  }

  public function getStudentsList( $params ){
		
    $this->db->select( "studentID AS id, studentName AS name" );
    $this->db->where( 'studentStatus', 0 );
    $this->db->where( 'gradeLevelID', $params['gradeLevelID'] );
		return $this->db->get( 'student' )->result_array();
	}

  public function getAccountCard( $studentIds, $schoolYearId ){

    $this->db->select('*');
    $this->db->where( 'accountCardSchoolYear', $schoolYearId );
    $this->db->where_in('studentID', $studentIds);
    return $this->db->get('accountcard')->result_array();
  }

  public function getStudentsWithAccountCards($params)
  {
      $this->db->select("s.studentID AS id, s.studentName AS name, g.gradeLevelName as gradeLevel, a.*");
      $this->db->from('student s');
      $this->db->join('accountcard a', 'a.studentID = s.studentID AND a.accountCardSchoolYear = ' . $this->db->escape($params['schoolYear']), 'left');
      $this->db->join('gradelevel g', 'g.gradeLevelID = s.gradeLevelID', 'left');
      
      if($params['student'] != '0') {
        $this->db->where('s.studentID', $params['student']);
      }
      
      $this->db->where('s.studentStatus', 0);
      $this->db->where('s.gradeLevelID', $params['gradeLevelID']);

      return $this->db->get()->result_array();
  }

  public function getStudentsWithAccountCardsNew($params)
  {
      $this->db->select("
          s.studentID AS id,
          s.studentName AS name,
          g.gradeLevelName as gradeLevel,
          a.*,
          IFNULL(p.booksPayment, 0) AS booksPaid,
          IFNULL(p.tuitionPayment, 0) AS tuitionPaid,
          IFNULL(p.uniformPayment, 0) AS uniformPaid,
          IFNULL(p.cateringPayment, 0) AS cateringPaid,
          IFNULL(p.extracurricularPayment, 0) AS extracurricularPaid,
          IFNULL(p.christmasPayment, 0) AS christmasPaid,
          IFNULL(p.familyDayPayment, 0) AS familyDayPaid,
          IFNULL(p.picturePayment, 0) AS picturePaid,
          IFNULL(p.gradFeePayment, 0) AS gradFeePaid,
          IFNULL(p.scoutingPayment, 0) AS scoutingPaid,
          IFNULL(p.charityPayment, 0) AS charityPaid,
          IFNULL(p.nutritionPayment, 0) AS nutritionPaid,
          IFNULL(p.movingUpPayment, 0) AS movingUpPaid,
          IFNULL(p.othersPayment, 0) AS othersPaid,
          IFNULL(p.annualRegistration, 0) as annualRegPaid
      ");

      $this->db->from('student s');
      $this->db->join(
          'accountcard a',
          'a.studentID = s.studentID AND a.accountCardSchoolYear = ' . $this->db->escape($params['schoolYear']),
          'left'
      );
      $this->db->join('gradelevel g', 'g.gradeLevelID = s.gradeLevelID', 'left');

      // Join payments table as a subquery with totals per student
      $this->db->join("
          (SELECT
              studentID,
              SUM(booksPayment) AS booksPayment,
              SUM(tuitionPayment) AS tuitionPayment,
              SUM(uniformPayment) AS uniformPayment,
              SUM(cateringPayment) AS cateringPayment,
              SUM(extracurricularPayment) AS extracurricularPayment,
              SUM(christmasPayment) AS christmasPayment,
              SUM(familyDayPayment) AS familyDayPayment,
              SUM(picturePayment) AS picturePayment,
              SUM(gradFeePayment) AS gradFeePayment,
              SUM(scoutingPayment) AS scoutingPayment,
              SUM(charityPayment) AS charityPayment,
              SUM(nutritionPayment) AS nutritionPayment,
              SUM(movingUpPayment) AS movingUpPayment,
              SUM(othersPayment) AS othersPayment,
              SUM(annualRegistration) as annualRegistration
          FROM payments
          GROUP BY studentID
          ) p", 'p.studentID = s.studentID', 'left');

      if ($params['student'] != '0') {
          $this->db->where('s.studentID', $params['student']);
      }

      $this->db->where('s.studentStatus', 0);
      $this->db->where('s.gradeLevelID', $params['gradeLevelID']);

      return $this->db->get()->result_array();
  }


}