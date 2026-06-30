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
class Acknowledgement_model extends CI_Model {
	
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

    public function getSchoolYearById($id)
    {
        $where = "WHERE schoolYearID = " . (int) $id;

        return $this->db->query("
            SELECT
                schoolYearID,
                CONCAT(schoolYearStart, '-', (schoolYearStart + 1)) AS schoolYearStart
            FROM
                schoolyear
            $where
        ")->row();
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

  public function getStudentPaymentsOld($params)
  {
        $this->db->select("s.studentID AS id, s.studentName AS name, g.gradeLevelName as gradeLevel, p.*");
        $this->db->from('student s');
        $this->db->join('payments p', 'p.studentID = s.studentID', 'left');
        $this->db->join('gradelevel g', 'g.gradeLevelID = s.gradeLevelID', 'left');
        $this->db->where('s.studentStatus', 0);
        $this->db->where('s.gradeLevelID', $params['gradeLevelID']);
        $this->db->where('s.studentID', $params['student']);
        $this->db->where('p.paymentDate', $params['date']);
        $this->db->where('p.schoolYearID', $params['schoolYear']);

      return $this->db->get()->result_array();
  }

  public function getStudentPaymentsInCertainSchoolYear($params, $accountCardId)
  {
      $this->db->select("p.*");
      $this->db->from('payments p');
      $this->db->where('p.schoolYearID', $params['schoolYear']);
      $this->db->where('p.accountCardID', $accountCardId);

      if(isset($params['with_date']) && $params['with_date'] == "true") {
          $this->db->where('p.paymentDate', $params['date']);
      }

      $this->db->order_by('p.paymentDate', 'ASC');
      
      return $this->db->get()->result_array();
  }

  public function getStudentPayments($params)
  {
      $joinPayments = "
        LEFT JOIN payments p
            ON p.studentID = s.studentID AND p.schoolYearID = " . $this->db->escape($params['schoolYear']);

      if (isset($params['with_date']) && $params['with_date'] == "true") {
        $joinPayments .= "
            AND p.paymentDate = " . $this->db->escape($params['date']);
      }
      $joinPayments .= "\n";

      $sql = "
          SELECT
              s.studentID AS id,
              s.studentName AS name,
              g.gradeLevelName AS gradeLevel,

              SUM(p.paymentID) AS paymentID,
              MAX(p.accountCardID) AS accountCardID,
              MAX(p.paymentDate) AS paymentDate,
              SUM(p.ref) AS ref,
              SUM(p.refnum) AS refnum,
              SUM(p.particulars) AS particulars,
              SUM(p.annualRegistration) AS annualRegistration,
              SUM(p.tuition) AS tuition,
              SUM(p.books) AS books,
              SUM(p.uniform) AS uniform,
              SUM(p.catering) AS catering,
              SUM(p.extraCurricular) AS extraCurricular,
              SUM(p.christmas) AS christmas,
              SUM(p.familyDay) AS familyDay,
              SUM(p.picture) AS picture,
              SUM(p.gradFee) AS gradFee,
              SUM(p.scouting) AS scouting,
              SUM(p.charity) AS charity,
              SUM(p.others) AS others,
              GROUP_CONCAT(p.remarks SEPARATOR ' ||| ') AS remarks,
              SUM(p.status) AS status,
              SUM(p.uneditable) AS uneditable,
              SUM(p.daysPaid) AS daysPaid,
              SUM(p.nutrition) AS nutrition,
              SUM(p.movingUp) AS movingUp

          FROM student s
          ". $joinPayments ."
          LEFT JOIN gradelevel g
              ON g.gradeLevelID = s.gradeLevelID
          WHERE s.studentStatus = 0
              AND s.gradeLevelID = " . $this->db->escape($params['gradeLevelID']) . "
              AND s.studentID = " . $this->db->escape($params['student']) . "
          GROUP BY s.studentID, s.studentName, g.gradeLevelName
      ";

      return $this->db->query($sql)->result_array(); // or result_array() for multiple students
  }



    public function getAccountCardById($accountCardId, $schoolyear)
    {
        $this->db->select("
            a.*,
            l.nutritionTotalReceivable,
            e.extracurricularTotalReceivable,
            paymentDate,
            IFNULL(p.books, 0) AS booksPaid,
            IFNULL(p.tuition, 0) AS tuitionPaid,
            IFNULL(p.uniform, 0) AS uniformPaid,
            IFNULL(p.catering, 0) AS cateringPaid,
            IFNULL(p.extraCurricular, 0) AS extracurricularPaid,
            IFNULL(p.christmas, 0) AS christmasPaid,
            IFNULL(p.familyDay, 0) AS familyDayPaid,
            IFNULL(p.picture, 0) AS picturePaid,
            IFNULL(p.gradFee, 0) AS gradFeePaid,
            IFNULL(p.scouting, 0) AS scoutingPaid,
            IFNULL(p.charity, 0) AS charityPaid,
            IFNULL(p.nutrition, 0) AS nutritionPaid,
            IFNULL(p.movingUp, 0) AS movingUpPaid,
            IFNULL(p.others, 0) AS othersPaid,
            IFNULL(p.annualRegistration, 0) as annualRegPaid
        ");

        $this->db->from('accountcard a');

        $this->db->join("
            (SELECT
                accountCardID,
                MAX(paymentDate) as paymentDate,
                SUM(books) AS books,
                SUM(tuition) AS tuition,
                SUM(uniform) AS uniform,
                SUM(catering) AS catering,
                SUM(extraCurricular) AS extraCurricular,
                SUM(christmas) AS christmas,
                SUM(familyDay) AS familyDay,
                SUM(picture) AS picture,
                SUM(gradFee) AS gradFee,
                SUM(scouting) AS scouting,
                SUM(charity) AS charity,
                SUM(nutrition) AS nutrition,
                SUM(movingUp) AS movingUp,
                SUM(others) AS others,
                SUM(annualRegistration) AS annualRegistration
            FROM payments
            GROUP BY accountCardID
            ) p", 'p.accountCardID = a.accountCardID', 'left');

        $this->db->join( "(
          SELECT
            a.studentID
            ,SUM( IFNULL( a.receivableAmount, 0 ) ) as nutritionTotalReceivable
          FROM
            receivables as a
          LEFT OUTER JOIN batchreceivables as b
            ON( b.batchReceivableID = a.batchReceivableID )
          WHERE b.schoolYearID = " . (int)$schoolyear . "
            AND b.batchReceivableCategoryID = 10
          GROUP BY a.studentID
        ) as l", 'l.studentID = a.studentID', 'left outer' );

        $this->db->join( "(
          SELECT
            a.studentID
            ,SUM( IFNULL( a.receivableAmount, 0 ) ) as extracurricularTotalReceivable
          FROM
            receivables as a
          LEFT OUTER JOIN batchreceivables as b
            ON( b.batchReceivableID = a.batchReceivableID )
          WHERE b.schoolYearID = " . (int)$schoolyear . "
            AND b.batchReceivableCategoryID = 3
          GROUP BY a.studentID
        ) as e", 'e.studentID = a.studentID', 'left outer' );

        $this->db->where('a.accountCardID', $accountCardId);

        return $this->db->get()->row_array();
    }
}
