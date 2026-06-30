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
class Reminders_model extends CI_Model {
	
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
          a.*
      ");

      $this->db->from('student s');
      $this->db->join(
          'accountcard a',
          'a.studentID = s.studentID AND a.accountCardSchoolYear = ' . $this->db->escape($params['schoolYear']),
          'left'
      );
      $this->db->join('gradelevel g', 'g.gradeLevelID = s.gradeLevelID', 'left');

      if ($params['student'] != '0') {
          $this->db->where('s.studentID', $params['student']);
      }

      $this->db->where('s.studentStatus', 0);
      $this->db->where('s.gradeLevelID', $params['gradeLevelID']);

      return $this->db->get()->result_array();
  }

  public function getAccountCardById($accountCardId)
    {
        $this->db->select("
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

        $this->db->where('a.accountCardID', $accountCardId);

        return $this->db->get()->row_array();
    }

    public function retrieveData( $params ){ /* created by jays: April 05, 2019 - JO #2 Batch Receivable */
		$this->db->select("b.*, a.*
			,c.cateringTotalReceivable, d.charityTotalReceivable, e.extracurricularTotalReceivable, f.christmasTotalReceivable, g.familyDayTotalReceivable, h.pictureTotalReceivable, i.gradFeeTotalReceivable, j.scoutingTotalReceivable, k.othersTotalReceivable, l.nutritionTotalReceivable, m.movingUpTotalReceivable
			,(
				IFNULL(b.annualRegistrationTotalReceivable, 0)
				+
				IFNULL(b.tuitionTotalReceivable, 0) 
				+ 
				IFNULL(b.booksTotalReceivable, 0) 
				+ 
				IFNULL(b.uniformTotalReceivable, 0) 
				+ 
				IFNULL(c.cateringTotalReceivable, 0) 
				+ 
				IFNULL(d.charityTotalReceivable, 0) 
				+ 
				IFNULL(e.extracurricularTotalReceivable, 0) 
				+ 
				IFNULL(f.christmasTotalReceivable, 0)
				+ 
				IFNULL(g.familyDayTotalReceivable, 0) 
				+ 
				IFNULL(h.pictureTotalReceivable, 0) 
				+ 
				IFNULL(i.gradFeeTotalReceivable, 0) 
				+ 
				IFNULL(j.scoutingTotalReceivable, 0) 
				+ 
				IFNULL(k.othersTotalReceivable, 0) 
				+ 
				IFNULL(l.nutritionTotalReceivable, 0) 
				+ 
				IFNULL(m.movingUpTotalReceivable, 0) 
			) AS accTotalReceivable
			,(CASE 
				WHEN a.studentStatus = 0 THEN
					'Enrolled'
				WHEN a.studentStatus = 1 THEN
					'Not-Enrolled'
				WHEN a.studentStatus = 2 THEN
					'Drop-Out'
			END) AS __status
		");
		$this->db->where( 'a.studentID', (int)$params['studentID'] );
		$this->db->join( "(
			SELECT
				accountCardID
				,accountCardSchoolYear
				,studentID
				,IFNULL(annualRegistrationTotalReceivable, 0) AS annualRegistrationTotalReceivable
				,IFNULL(tuitionTotalReceivable, 0) AS tuitionTotalReceivable
				,IFNULL(booksTotalReceivable, 0) AS booksTotalReceivable
				,IFNULL(uniformTotalReceivable, 0) AS uniformTotalReceivable
			FROM accountcard
			WHERE accountCardSchoolYear = ". (int)$params['accountCardSchoolYear'] ."
		) as b", 'b.studentID = a.studentID', 'left outer' ); /* join to accountcard */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as cateringTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.schoolYearID = " . (int)$params['accountCardSchoolYear'] . "
				AND b.batchReceivableCategoryID = 1
			GROUP BY a.studentID
		) as c", 'c.studentID = a.studentID', 'left outer' ); /* catering */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as charityTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.schoolYearID = " . (int)$params['accountCardSchoolYear'] . "
				AND b.batchReceivableCategoryID = 2
			GROUP BY a.studentID
		) as d", 'd.studentID = a.studentID', 'left outer' ); /* charity */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as extracurricularTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.schoolYearID = " . (int)$params['accountCardSchoolYear'] . "
				AND b.batchReceivableCategoryID = 3
			GROUP BY a.studentID
		) as e", 'e.studentID = a.studentID', 'left outer' ); /* Extra-Curricular */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as christmasTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.schoolYearID = " . (int)$params['accountCardSchoolYear'] . "
				AND b.batchReceivableCategoryID = 4
			GROUP BY a.studentID
		) as f", 'f.studentID = a.studentID', 'left outer' ); /* Christmas */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as familyDayTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.schoolYearID = " . (int)$params['accountCardSchoolYear'] . "
				AND b.batchReceivableCategoryID = 5
			GROUP BY a.studentID
		) as g", 'g.studentID = a.studentID', 'left outer' ); /* Family Day */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as pictureTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.schoolYearID = " . (int)$params['accountCardSchoolYear'] . "
				AND b.batchReceivableCategoryID = 6
			GROUP BY a.studentID
		) as h", 'h.studentID = a.studentID', 'left outer' ); /* Picture */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as gradFeeTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.schoolYearID = " . (int)$params['accountCardSchoolYear'] . "
				AND b.batchReceivableCategoryID = 7
			GROUP BY a.studentID
		) as i", 'i.studentID = a.studentID', 'left outer' ); /* Grad Fee */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as scoutingTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.schoolYearID = " . (int)$params['accountCardSchoolYear'] . "
				AND b.batchReceivableCategoryID = 8
			GROUP BY a.studentID
		) as j", 'j.studentID = a.studentID', 'left outer' ); /* Scouting/Camping */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as othersTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.schoolYearID = " . (int)$params['accountCardSchoolYear'] . "
				AND b.batchReceivableCategoryID = 9
			GROUP BY a.studentID
		) as k", 'k.studentID = a.studentID', 'left outer' ); /* others */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as nutritionTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.schoolYearID = " . (int)$params['accountCardSchoolYear'] . "
				AND b.batchReceivableCategoryID = 10
			GROUP BY a.studentID
		) as l", 'l.studentID = a.studentID', 'left outer' ); /* Nutrition Day */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as movingUpTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.schoolYearID = " . (int)$params['accountCardSchoolYear'] . "
				AND b.batchReceivableCategoryID = 11
			GROUP BY a.studentID
		) as m", 'm.studentID = a.studentID', 'left outer' ); /* Moving Up/Recognition */
		$this->db->where( 'a.studentID', (int)$params['studentID'] );
		return $this->db->get( 'student as a' )->result_array();
	}
}
