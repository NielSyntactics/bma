<?php
/** Grading Sheet module
  * [Developer]
  * Developer: Roj Janubas
  * Date Created: Feb. 24, 2016
  * Date Finished: 
  
 * [Modification]
   
 **/
 if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Viewgradingsheet_model extends CI_Model {
	
	public function getSchoolYear( $params ){
		$this->db->select( 'schoolYearID as id, schoolYearDescription as name' );
		$this->db->from( 'schoolyear' );
		if( isset( $params['query'] ) ){
			$this->db->like( 'schoolYearDescription', $params['query'], 'both' );
		}
		$this->db->order_by( 'schoolYearDescription' );
		return $this->db->get()->result_array();
	}
	
	public function getGradeLevel( $params ){
		$this->db->select( 'gradeLevelID as id, gradeLevelDescription as name' );
		$this->db->from( 'gradelevel' );
		if( isset( $params['query'] ) ){
			$this->db->like( 'gradeLevelDescription', $params['query'], 'both' );
		}
		$this->db->order_by( 'gradeLevelDescription' );
		return $this->db->get()->result_array();
	}
	
	public function getSubjects( $params ){
		$this->db->select( 'subjectID as id, subjectDescription as name' );
		$this->db->from( 'subject' );
		if( isset( $params['query'] ) ){
			$this->db->like( 'subjectDescription', $params['query'], 'both' );
		}
		$this->db->order_by( 'subjectMenu' );
		return $this->db->get()->result_array();
	}
	
	public function getClassSchoolYear( $params ){
		$this->db->select( 'b.classID as code, a.schoolYearDescription as name, c.gradeLevelDescription, d.studentID' );
		$this->db->from( 'schoolyear as a' );
		$this->db->join( 'class as b', 'b.classSchoolYearID = a.schoolYearID', 'inner' );
		$this->db->join( 'gradelevel as c', 'c.gradeLevelID = b.classGradeLevel', 'inner' );
		$this->db->join( 'enrolledstudents as e', 'e.classID = b.classID', "inner" );
		$this->db->join( 'bgsu as d', 'd.studentID = e.studentID', "inner" );
		$this->db->where( 'd.bgsUID', (int)$this->bgsUID );
		$this->db->order_by( 'a.schoolYearDescription' );
		return $this->db->get()->result_array();
	}
	
	public function getSubjectsList( $params ){
		$this->db->select( 'subjectID, subjectDescription' );
		$this->db->from( 'subject' );
		$this->db->where_not_in( 'subjectID', "SELECT subjectID FROM gradesheet WHERE teacherID = " . (int)$this->bgsUID . " AND classID = " . (int)$params['classID'] . " AND gradingSheetQuarter = " . (int)$params['quarter'] );
		if( isset( $params['query'] ) ){
			$this->db->like( 'subjectDescription', $params['query'], 'both' );
		}
		$this->db->order_by( 'subjectMenu' );
		return $this->db->get()->result_array();
	}
	
	public function checkIfInputValid( $params ){
		$this->db->select( '*' );
		$this->db->where( 'classID', (int)$params['classID'] );
		$this->db->where( 'subjectID', (int)$params['subject'] );
		$this->db->where( 'gradingSheetQuarter', (int)$params['quarter'] );
		$this->db->where( 'teacherID', (int)$this->bgsUID );
		return $this->db->count_all_results( 'gradingsheet' );
	}
	
	public function getQuarterGrade( $params ){
		$this->db->select("
			a.quarterlyExamHighestPossibleScore as activiyNumberOfItems
			,a.quarterlyExamScore as score
			,a.quarterlyExamPS as quarterlyExamPS
			,a.quarterlyExamWS as quarterlyExamWS
			,ROUND( a.quarterlyGrade ,0 ) as quarterlyGrade
		");
		$this->db->from( "quarterlygradeperlearner as a" );
		$this->db->join( "gradingsheet AS b", "b.gradingSheetID = a.gradingSheetID", "inner" );
		$this->db->join( "class AS c", "c.classID = b.classID", "inner" );
		$this->db->join( "gradelevel AS d", "c.classGradeLevel = d.gradeLevelID", "inner" );
		$this->db->join( "schoolyear AS e", "e.schoolYearID = c.classschoolYearID", "inner" );
		$this->db->join( "bgsu as f", "f.studentID = a.studentID", "inner" );
		$this->db->where( "f.bgsUID", (int)$this->bgsUID );
		$this->db->where( "b.classID", $params[ "classID" ] );
		$this->db->where( "b.gradingSheetQuarter", $params[ "gradingSheetQuarter" ] );
		$this->db->where( "b.subjectID", $params[ "subjectID" ] );
		$this->db->where_in('b.gradingSheetStatus', array( 2 ,3 ));
		// $this->db->where( "b.gradingSheetID", $params[ "subjectID" ] );
		// $this->db->limit( 1 );
		return $this->db->get()->result_array();
	}
	
	public function chckGrdngSheetsIfPending( $data, $trig = 0 ){
		$this->db->from( "bgsu as a" );
		$this->db->join( "enrolledstudents as b", "b.studentID = a.studentID" ,"inner" );
		$this->db->join( "gradingsheet as c", "c.classID = b.classID" ,"inner" );
		$this->db->where( $data );
		
		$res = ( $trig == 0 ) ? $this->db->count_all_results() : $this->db->get();
		if( $trig == 1 ){
			return ( $this->db->affected_rows() > 0 ) ? true : false;
		}else{
			return ( $res % 4 ) ? true : false;
		}
	}
	
	public function getFinalGrade(){
		$params = getData();
		if( $params[ "classID" ] == 0 AND $params[ "gradeLevelDisplaySearch" ] != 0 )
		{
			$str =  "WHERE z.classID = '". $params[ "gradeLevelDisplaySearch" ] ."'";
		}else if($params[ "classID" ] == 0 AND $params[ "gradeLevelDisplaySearch" ] == 0)
		{
			$str = "WHERE z.schoolYearDescription != '' GROUP BY z.classID";
		}else if( $params[ "classID" ] != 0 )
		{
			$str =  "WHERE z.classID = '". $params[ "classID" ] ."'";
		}
		// $str = ( $params[ "classID" ] == 0 AND $params[ "gradeLevelDisplaySearch" ] == 0 ) ? "WHERE z.schoolYearDescription != '' GROUP BY z.classID" : "WHERE z.classID = '". $params[ "classID" ] ."'";

		return $this->db->query("
			SELECT 
				z.schoolYearDescription,
				z.gradeLevelDescription,
				IFNULL( z.fGradingGrade ,0 ) as firstQuarter,
				IFNULL( x.sGradingGrade ,0 ) as secondQuarter,
				IFNULL( q.tGradingGrade ,0 ) as thirdQuarter,
				IFNULL( w.lGradingGrade ,0 ) as fourthQuarter,
				ROUND( ( SUM( IFNULL( z.fGradingGrade ,0 ) + IFNULL( x.sGradingGrade ,0 ) + IFNULL( q.tGradingGrade ,0 ) + IFNULL( w.lGradingGrade ,0 ) ) / 4 ) ,0 ) as finalGrade
			FROM
				bgsu AS m
					LEFT OUTER JOIN
				(SELECT 
					ROUND((SUM(a.quarterlyGrade) / COUNT(a.quarterlyGrade)), 0) AS fGradingGrade,
						b.bgsUID, c.classID, e.schoolYearDescription, f.gradeLevelDescription
				FROM
					bgsu AS b 
				INNER JOIN quarterlygradeperlearner AS a ON b.studentID = a.studentID
				INNER JOIN gradingsheet AS c ON c.gradingSheetID = a.gradingSheetID
				INNER JOIN class as d on d.classID = c.classID
				INNER JOIN schoolyear as e on e.schoolYearID = d.classSchoolYearID
				INNER JOIN gradelevel as f on f.gradeLevelID = d.classGradeLevel
			   
				WHERE
					b.bgsUID = '". (int)$this->bgsUID ."'
						AND c.gradingSheetQuarter = 1 GROUP BY c.classID ) AS z ON z.bgsUID = m.bgsUID
						
						
					LEFT OUTER JOIN
				(SELECT 
					ROUND((SUM(a.quarterlyGrade) / COUNT(a.quarterlyGrade)), 0) AS sGradingGrade,
						b.bgsUID, c.classID
				FROM
					bgsu AS b
				INNER JOIN quarterlygradeperlearner AS a ON b.studentID = a.studentID
				INNER JOIN gradingsheet AS c ON c.gradingSheetID = a.gradingSheetID
				WHERE
					b.bgsUID = '". (int)$this->bgsUID ."'
						AND c.gradingSheetQuarter = 2 GROUP BY c.classID ) AS x ON x.bgsUID = m.bgsUID AND x.classID = z.classID
						
						
					LEFT OUTER JOIN
				(SELECT 
					ROUND((SUM(a.quarterlyGrade) / COUNT(a.quarterlyGrade)), 0) AS tGradingGrade,
						b.bgsUID, c.classID
				FROM
					bgsu AS b
				INNER JOIN quarterlygradeperlearner AS a ON b.studentID = a.studentID
				INNER JOIN gradingsheet AS c ON c.gradingSheetID = a.gradingSheetID
				WHERE
					b.bgsUID = '". (int)$this->bgsUID ."'
						AND c.gradingSheetQuarter = 3 GROUP BY c.classID ) AS q ON q.bgsUID = m.bgsUID AND q.classID = z.classID
						
						
					LEFT OUTER JOIN
				(SELECT 
					ROUND((SUM(a.quarterlyGrade) / COUNT(a.quarterlyGrade)), 0) AS lGradingGrade,
						b.bgsUID, c.classID
				FROM
					bgsu AS b
				INNER JOIN quarterlygradeperlearner AS a ON b.studentID = a.studentID
				INNER JOIN gradingsheet AS c ON c.gradingSheetID = a.gradingSheetID
				WHERE
					b.bgsUID = '". (int)$this->bgsUID ."'
						AND c.gradingSheetQuarter = 4 GROUP BY c.classID ) AS w ON w.bgsUID = m.bgsUID AND w.classID = z.classID
						
						
						$str
		")->result_array();
		// LQ();
	}
	
	
	public function checkGradingSheet( $params ){
		// $params = getData();
		$this->db->select( "a.gradingSheetStatus, DATE_FORMAT( a.dateModified, '%m/%d/%Y' ) as dateFinalized, concat( b.bgsUfirstname, ' ', b.bgsUlastname ) as fullName" );
		$this->db->from( "gradingsheet as a" );
		$this->db->join( "bgsu as b", "b.bgsUID = a.teacherID" );
		$this->db->where( $params );
		// $this->db->where( "classID" ,$params[ 'classID' ] );
		// $this->db->where( "gradingSheetQuarter" ,$params[ 'gradingSheetQuarter' ] );
		// $this->db->where( "subjectID" ,$params[ 'subjectID' ] );
		return $this->db->get()->result_array();
	}
	
	public function checkUserPayable(){
		$params = getData();
		$this->db->select( "*" );
		$this->db->from( "paymentstatushistory as a" );
		$this->db->join( "bgsu as b", "b.studentID = a.studentID", "inner" );
		$this->db->where( "b.bgsUID", (int)$this->bgsUID );
		$this->db->order_by( "a.paymentStatusHistoryID DESC" );
		$this->db->limit( 1 );
		return $this->db->get()->result_array();
		
	}
	
	public function getActivity( $params ){
	
		return $this->db->query("
			SELECT 
				p.*,
				d.activityID,
				l.activityTypeDescription,
				d.activityCode,
				d.activiyNumberOfItems,
				d.activityClassification,
				d.activityDescription,
				CONCAT(v.studentFirstName,
						' ',
						v.studentLastName) AS fullName,
				a.*,d.*,
				DATE_FORMAT( d.activityDate, '%m/%d/%Y' ) AS activityDate
			FROM
				bgsu AS x
					INNER JOIN
				student AS v ON v.studentID = x.studentID
					INNER JOIN
				learnerscore AS a ON a.studentID = x.studentID
					INNER JOIN
				gradingsheetactivity AS b ON b.gradingSheetActivityID = a.gradingSheetActivityID
					INNER JOIN
				gradingsheet AS c ON c.gradingSheetID = b.gradingSheetID
					INNER JOIN
				activity AS d ON d.activityID = b.activityID
					INNER JOIN 
				quarterlygradeperlearner as p on p.gradingSheetID = c.gradingSheetID AND p.studentID = x.studentID
					INNER JOIN 
				activitytype as l on l.activityType = d.activityType
			WHERE
				x.bgsUID = '". (int)$this->bgsUID ."' AND d.classID = '". $params[ "classID" ] ."'
					AND d.subjectID = '". $params[ "subjectID" ] ."'
					AND c.gradingSheetQuarter = '". $params[ "gradingSheetQuarter" ] ."'
					AND d.activityClassification = '". $params[ "activityClassification" ] . "'
		")->result_array();
		// LQ();
	
	
	}
	
	public function checkPaymentStatus(){
		$this->db->select( "*" );
		$this->db->from( "paymentstatushistory as a" );
		$this->db->join( "bgsu as b", "b.studentID = a.studentID", "inner" );
		$this->db->order_by( "a.paymentStatusHistoryID DESC" );
		$this->db->limit( 1 );
		$this->db->get()->result_array();
		// LQ();
	}
	
	public function getLearnersRec( $params ){
	}
	
	public function getPerLearnerDetails( $params ){
		$this->db->select( "
				a.studentID
				,CONCAT( a.studentFirstName, ' ', a.studentLastName ) as studentFullName
				,0 as performanceHighestPossibleScore
				,0 as performanceTotalScore
				,b.performancePS
				,b.performanceWS
				,0 as WWHighestPossibleScore
				,0 as WWTotalScore
				,b.writtenWorksPS
				,b.writtenWorksWS
				,0 as QHighestPossibleScore
				,0 as QTotalScore
				,b.quizzesPS
				,b.quizzesWS
				,b.quarterlyExamHighestPossibleScore
				,b.quarterlyExamScore
				,b.quarterlyExamPS
				,b.quarterlyExamWS
				,b.quarterlyGrade", false );
		$this->db->from( 'student as a' );
		$this->db->join( 'quarterlygradeperlearner as b', 'b.studentID = a.studentID AND b.gradingSheetID = ' . ( ( isset( $params['gradingSheetID'] )? (int)$params['gradingSheetID'] : 0 ) ), 'left outer' );
		$this->db->join( 'enrolledstudents as c', 'c.studentID = a.studentID' );
		$this->db->where( 'c.teacherID', (int)$this->bgsUID );
		$this->db->where( 'c.classID', (int)$params['classID'] );
		return $this->db->get()->result_array();
	}
	
	public function retrieveGradeLevel( $data ){
	
	
		$this->db->select( 'b.classID as code, a.schoolYearDescription as name, c.gradeLevelDescription, d.studentID' );
		$this->db->from( 'schoolyear as a' );
		$this->db->join( 'class as b', 'b.classSchoolYearID = a.schoolYearID', 'inner' );
		$this->db->join( 'gradelevel as c', 'c.gradeLevelID = b.classGradeLevel', 'inner' );
		$this->db->join( 'enrolledstudents as e', 'e.classID = b.classID', "inner" );
		$this->db->join( 'bgsu as d', 'd.studentID = e.studentID', "inner" );
		if( $data[ "classID" ] != 0 ){
			$this->db->where( "b.classID" ,$data[ "classID" ] );
		}
		$this->db->where( 'd.bgsUID', (int)$this->bgsUID );
		$this->db->order_by( 'a.schoolYearDescription' );
		return $this->db->get()->result_array();
		
		
		// $this->db->select( "b.*" );
		// $this->db->from( "class as a" );
		// $this->db->join( "gradelevel as b", "b.gradeLevelID = a.classGradeLevel", "inner" );
		// if( $data[ "classID" ] != 0 ){
			// $this->db->where( "a.classID" ,$data[ "classID" ] );
		// }else{
			// $this->db->join( "enrolledstudents as c" ,"c.classID = a.classID","inner");
			// $this->db->join( "bgsu as d" ,"d.studentID = c.studentID AND d.bgsUID = ".(int)$this->bgsUID,"inner");
		// }
		// return $this->db->get()->result_array();
	}
}