<?php
/** Grading Sheet module
  * [Developer]
  * Developer: Jayson Dagulo
  * Date Created: Feb. 24, 2016
  * Date Finished: 
  
  * [Database]
	
	
  * [Description]
	This module is by the teachers to record student’s grades on written works, quizzes, exams or other activities, per subject within a school year.
	Each grading sheet is for one subject and one quarter only. This module will also show the Year End Final Grades per student per school year.
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
 if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Gradingsheet_model extends CI_Model {
	
	public function viewall( $params ){
		$this->db->select( "
			a.gradingSheetID
			,(CASE
				WHEN a.gradingSheetQuarter = 1 THEN 'First'
				WHEN a.gradingSheetQuarter = 2 THEN 'Second'
				WHEN a.gradingSheetQuarter = 3 THEN 'Third'
				WHEN a.gradingSheetQuarter = 4 THEN 'Fourth'
			END) as quarterDisplay
			,(CASE
				WHEN a.gradingSheetStatus = 1 THEN 'Ongoing'
				WHEN a.gradingSheetStatus = 2 THEN 'Final'
				WHEN a.gradingSheetStatus = 3 THEN 'Uploaded'
			END) as gradingSheetStatusDisplay
			,e.subjectDescription
			,c.schoolYearDescription
			,d.gradeLevelDescription
		", false );
		$this->db->from( 'gradingsheet as a' );
		$this->db->join( 'class as b', 'b.classID = a.classID', 'left outer' );
		$this->db->join( 'schoolyear as c', 'c.schoolYearID = b.classSchoolYearID', 'left outer' );
		$this->db->join( 'gradelevel as d', 'd.gradeLevelID = b.classGradeLevel', 'left outer' );
		$this->db->join( 'subject as e', 'e.subjectID = a.subjectID', 'left outer' );
		$this->db->where( 'b.bgsUID', (int)$this->bgsUID );
		$this->db->order_by( 'a.gradingSheetID', 'desc' );
		if( isset( $params['sBy'] ) && isset( $params['s'] ) ){
			if( (int)$params['s'] > 0 ){
				$s = (int)$params['s'];
				if( $params['sBy'] == 1 ){
					$this->db->where( 'a.classID', $s );
				}
				elseif( $params['sBy'] == 2 ){
					$this->db->where( 'b.classGradeLevel', $s );
				}
				elseif( $params['sBy'] == 3 ){
					$this->db->where( 'a.gradingSheetQuarter', $s );
				}
				elseif( $params['sBy'] == 4 ){
					$this->db->where( 'a.subjectID', $s );
				}
				elseif( $params['sBy'] == 5 ){
					$this->db->where( 'gradingSheetStatus', $s );
				}
			}
		}
		if( !$params['pdf'] ){
			$this->db->limit( $params['limit'], $params['start'] );
		}
		if( !$params['cnt'] ){
			return $this->db->get()->result_array();
		}
		else{
			return $this->db->count_all_results();
		}
	}
	
	public function getSchoolYear( $params ){
		$this->db->select( 'b.classID as id, a.schoolYearDescription as name' );
		$this->db->from( 'schoolyear as a' );
		$this->db->join( 'class as b','b.classSchoolYearID = a.schoolYearID', 'left outer' );
		$this->db->where( 'b.bgsUID', $this->bgsUID );
		if( isset( $params['query'] ) ){
			$this->db->like( 'a.schoolYearDescription', $params['query'], 'both' );
		}
		$this->db->order_by( 'a.schoolYearDescription' );
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
		$this->db->order_by( 'subjectDescription' );
		return $this->db->get()->result_array();
	}
	
	public function getClassSchoolYear( $params ){
		$this->db->select( 'a.classID as code, b.schoolYearDescription as name, c.gradeLevelDescription' );
		$this->db->from( 'class as a' );
		$this->db->join( 'schoolyear as b', 'b.schoolYearID = a.classSchoolYearID', 'left outer' );
		$this->db->join( 'gradelevel as c', 'c.gradeLevelID = a.classGradeLevel', 'left outer' );
		$this->db->where( 'a.bgsUID', (int)$this->bgsUID );
		if( isset( $params['query'] ) ){
			$this->db->like( 'b.schoolYearDescription', $params['query'], 'both' );
		}
		if( isset( $params[ 'filterClosed' ] ) ) {
			// $this->db->where( 'b.closedBy >', 0 );
			$this->db->where('b.closedBy IS NULL', null, false);
		}
		$this->db->order_by( 'b.schoolYearDescription' );
		return $this->db->get()->result_array();
	}
	
	public function getSubjectsList( $params ){
		$this->db->select( 'subjectID, subjectDescription' );
		$this->db->from( 'subject' );
		if( isset( $params['subjectID'] ) ){
			$this->db->where( "( subjectID NOT IN( SELECT subjectID FROM gradingsheet WHERE teacherID = " . (int)$this->bgsUID . " AND classID = " . (int)$params['classID'] . " ) OR subjectID = " . (int)$params['subjectID'] . " )" );
		}
		else{
			$this->db->where_not_in( 'subjectID', "SELECT subjectID FROM gradingsheet WHERE teacherID = " . (int)$this->bgsUID . " AND classID = " . (int)$params['classID'] . " AND gradingSheetQuarter = " . (int)$params['quarter'] );
		}
		if( isset( $params['query'] ) ){
			$this->db->like( 'subjectDescription', $params['query'], 'both' );
		}
		$this->db->order_by( 'subjectDescription' );
		return $this->db->get()->result_array();
	}
	
	public function checkIfInputValid( $params ){
		$this->db->select( '*' );
		$this->db->where( 'classID', (int)$params['classID'] );
		$this->db->where( 'subjectID', (int)$params['subject'] );
		$this->db->where( 'gradingSheetQuarter', (int)$params['quarter'] );
		$this->db->where( 'teacherID', (int)$this->bgsUID );
		$this->db->where_not_in( 'gradingSheetID', (int)$params['gradingSheetID'] );
		return $this->db->count_all_results( 'gradingsheet' );
	}
	
	public function getActivity( $params ){
		$this->db->select( "DATE_FORMAT( a.activityDate, '%m/%d/%Y' ) as activityDate, a.activityID, a.activityType, a.activityCode, a.activiyNumberOfItems, a.activityClassification, 0 as statusID, b.activityTypeDescription, " . ( (isset( $params['gradingSheetID'])? (int)$params['gradingSheetID'] : 0 ) ) . " as gradingSheetID", false );
		$this->db->from( 'activity as a' );
		$this->db->join( 'activitytype as b', 'b.activityType = a.activityType', 'left outer' );
		$this->db->where( 'a.teacherID', (int)$this->bgsUID );
		$this->db->where( 'a.classID', (int)$params['classID'] );
		$this->db->where( 'a.subjectID', (int)$params['subjectID'] );
		$this->db->where( 'a.activityClassification', (int)$params['activityClassification'] );
		
		// modified area 
		$this->db->where( 'a.activityInactiveTag', 0 );
		$this->db->where( 'a.activityQuarter', $params[ 'gradingSheetQuarter' ] );
		$this->db->order_by( 'a.activityID' );
		return $this->db->get()->result_array();
	}
	
	public function getLearnersRec( $params ){
		// print_r( $params );
		$this->db->select( "a.studentID, CONCAT( IFNULL( a.studentFirstName, '' ), ' ', IFNULL( a.studentLastName, '' ) ) as studentFullName, c.score as studentScore", false );
		$this->db->from( 'student as a' );
		$this->db->join( 'enrolledstudents as b', 'b.studentID = a.studentID', 'inner' );
		$this->db->join( "(
			SELECT
				a.studentID
				,a.score
			FROM
				learnerscore as a
			LEFT OUTER JOIN
				gradingsheetactivity as b
					ON( b.gradingSheetActivityID = a.gradingSheetActivityID )
			LEFT OUTER JOIN
				gradingsheet as c
					ON( c.gradingSheetID = b.gradingSheetID )
			WHERE b.activityID = " . (int)$params['activityID'] . "
		) as c", 'c.studentID = a.studentID', 'left outer' );
		$this->db->where( 'b.teacherID', (int)$this->bgsUID );
		$this->db->where( 'b.classID', (int)$params['classID'] );
		$this->db->group_by('a.studentID'); 
		return $this->db->get()->result_array();
		
				// AND c.gradingSheetID = " . (int)$params['gradingSheetID'] . "
	}
	
	public function getPerLearnerDetails( $params ){

		return $this->db->query("
			SELECT 
		    a.studentID,
		    a.enrolledStudentID,
		    CONCAT(IFNULL(a.studentLastName, ''),
		            ', ',
		            IFNULL(a.studentFirstName, ''),
		            ' ',
		            IFNULL(a.studentMiddleName, '')) AS studentFullName,
		    IFNULL(classA.highestPossibleScore, 0) AS performanceHighestPossibleScore,
		    IFNULL(classA.totalScore, 0) AS performanceTotalScore,
		    ROUND(IFNULL(((IFNULL(classA.totalScore, 0) / IFNULL(classA.highestPossibleScore, 0)) * 100),
		                    0),
		            2) AS performancePS,
		    ROUND(@ps:= IFNULL((((IFNULL(classA.totalScore, 0) / IFNULL(classA.highestPossibleScore, 0)) * 100) * 0.25),
		                    0),
		            2) AS performanceWS,
		    IFNULL(classB.qhighestPossibleScore, 0) AS WWHighestPossibleScore,
		    IFNULL(classB.qtotalScore, 0) AS WWTotalScore,
		    ROUND(IFNULL(((IFNULL(classB.qtotalScore, 0) / IFNULL(classB.qhighestPossibleScore, 0)) * 100),
		                    0),
		            2) AS writtenWorksPS,
		    ROUND(@ws:= IFNULL((((IFNULL(classB.qtotalScore, 0) / IFNULL(classB.qhighestPossibleScore, 0)) * 100) * 0.40),
		                    0),
		            2) AS writtenWorksWS,
		    IFNULL(classC.whighestPossibleScore, 0) AS QHighestPossibleScore,
		    IFNULL(classC.wtotalScore, 0) AS QTotalScore,
		    ROUND(IFNULL(((IFNULL(classC.wtotalScore, 0) / IFNULL(classC.whighestPossibleScore, 0)) * 100),
		                    0),
		            2) AS quizzesPS,
		    ROUND(@qs:= IFNULL(((IFNULL(classC.wtotalScore, 0) / IFNULL(classC.whighestPossibleScore, 0)) * 100) * 0.15,
		                    0),
		            2) AS quizzesWS,
		    IFNULL(q.quarterlyExamHighestPossibleScore, 0) AS quarterlyExamHighestPossibleScore,
		    IFNULL(q.quarterlyExamScore, 0) AS quarterlyExamScore,
		    ROUND(IFNULL(((IFNULL(q.quarterlyExamScore, 0) / IFNULL(q.quarterlyExamHighestPossibleScore, 0)) * 100),
		                    0),
		            2) AS quarterlyExamPS,
		    ROUND(@qe:= IFNULL((((IFNULL(q.quarterlyExamScore, 0) / IFNULL(q.quarterlyExamHighestPossibleScore, 0)) * 100) * 0.20),
		                    0),
		            2) AS quarterlyExamWS,
		    ROUND(IFNULL(( @ws + @ps + @qs + @qe ), 0), 0) AS quarterlyGrade
		FROM
		    activity AS act
		        INNER JOIN
		    class AS v ON v.classID = act.classID
		        INNER JOIN
		    (SELECT 
		        m.enrolledStudentID, m.classID, h.*
		    FROM
		        enrolledstudents AS m
		    INNER JOIN student AS h ON m.studentID = h.studentID) AS a ON a.classID = act.classID
		        LEFT OUTER JOIN
		    (SELECT 
		        a.*,
		            SUM(IFNULL(a.activiyNumberOfItems, 0)) AS highestPossibleScore,
		            SUM(IFNULL(d.score, 0)) AS totalScore,
		            d.studentID,
		            d.score,
		            c.gradingSheetID
		    FROM
		        activity AS a
		    LEFT OUTER JOIN gradingsheetactivity AS b ON b.activityID = a.activityID
		    INNER JOIN gradingsheet AS c ON c.gradingSheetID = b.gradingSheetID
		    INNER JOIN learnerscore AS d ON d.gradingSheetActivityID = b.gradingSheetActivityID
		    WHERE
		        a.activityClassification = 1
						AND c.gradingSheetID = '". $params[ 'gradingSheetID' ] ."'
						AND a.activityQuarter = '". $params[ 'gradingSheetQuarter' ] ."'
						AND a.subjectID =  '". $params[ 'subjectID' ] ."'
		    GROUP BY d.studentID , a.classID) AS classA ON classA.studentID = a.studentID
		        LEFT OUTER JOIN
		    (SELECT 
		        a.*,
		            SUM(IFNULL(a.activiyNumberOfItems, 0)) AS qhighestPossibleScore,
		            SUM(IFNULL(d.score, 0)) AS qtotalScore,
		            d.studentID,
		            d.score
		    FROM
		        activity AS a
		    LEFT OUTER JOIN gradingsheetactivity AS b ON b.activityID = a.activityID
		    INNER JOIN gradingsheet AS c ON c.gradingSheetID = b.gradingSheetID
		    INNER JOIN learnerscore AS d ON d.gradingSheetActivityID = b.gradingSheetActivityID
		    WHERE
		        a.activityClassification = 2
					AND c.gradingSheetID = '". $params[ 'gradingSheetID' ] ."'
					AND a.activityQuarter = '". $params[ 'gradingSheetQuarter' ] ."'
					AND a.subjectID =  '". $params[ 'subjectID' ] ."'
		    GROUP BY d.studentID , a.classID) AS classB ON classB.studentID = a.studentID
		        LEFT OUTER JOIN
		    (SELECT 
		        a.*,
		            SUM(IFNULL(a.activiyNumberOfItems, 0)) AS whighestPossibleScore,
		            SUM(IFNULL(d.score, 0)) AS wtotalScore,
		            d.studentID,
		            d.score
		    FROM
		        activity AS a
		    LEFT OUTER JOIN gradingsheetactivity AS b ON b.activityID = a.activityID
		    INNER JOIN gradingsheet AS c ON c.gradingSheetID = b.gradingSheetID
		    INNER JOIN learnerscore AS d ON d.gradingSheetActivityID = b.gradingSheetActivityID
		    WHERE
		        a.activityClassification = 3
					AND c.gradingSheetID = '". $params[ 'gradingSheetID' ] ."'
					AND a.activityQuarter = '". $params[ 'gradingSheetQuarter' ] ."'
					AND a.subjectID =  '". $params[ 'subjectID' ] ."'
		    GROUP BY d.studentID , a.classID) AS classC ON classC.studentID = a.studentID
		        RIGHT OUTER JOIN
		    subject AS subj ON subj.subjectID = act.subjectID
		        LEFT OUTER JOIN
		    (SELECT 
		        i.*
		    FROM
		        quarterlygradeperlearner AS i
		    WHERE
				i.gradingSheetID = '". $params[ 'gradingSheetID' ] ."') AS q ON q.studentID = a.studentID
		WHERE
			v.classID = '". $params[ 'classID' ] ."' 
		GROUP BY a.studentID
		ORDER BY a.enrolledStudentID")->result_array();
		
		// return $this->db->query("
		// 	SELECT 
		// 		a.studentID,
		// 		a.enrolledStudentID,
		// 		CONCAT(IFNULL( a.studentLastName, '') ,
		// 				', '
		// 				,IFNULL( a.studentFirstName ,'') , ' ',IFNULL( a.studentMiddleName ,'') ) AS studentFullName,
		// 		IFNULL(classA.highestPossibleScore ,0) AS performanceHighestPossibleScore,
		// 		IFNULL(classA.totalScore ,0) AS performanceTotalScore,
		// 		IFNULL(q.performancePS, 0) AS performancePS,
		// 		IFNULL(q.performanceWS, 0) AS performanceWS,
		// 		IFNULL(classB.qhighestPossibleScore ,0) AS WWHighestPossibleScore,
		// 		IFNULL(classB.qtotalScore ,0) AS WWTotalScore,
		// 		IFNULL(q.writtenWorksPS, 0) AS writtenWorksPS,
		// 		IFNULL(q.writtenWorksWS, 0) AS writtenWorksWS,
		// 		IFNULL(classC.whighestPossibleScore ,0) AS QHighestPossibleScore,
		// 		IFNULL(classC.wtotalScore ,0) AS QTotalScore,
		// 		IFNULL(q.quizzesPS, 0) AS quizzesPS,
		// 		IFNULL(q.quizzesWS, 0) AS quizzesWS,
		// 		IFNULL(q.quarterlyExamHighestPossibleScore, 0) AS quarterlyExamHighestPossibleScore,
		// 		IFNULL(q.quarterlyExamScore, 0) AS quarterlyExamScore,
		// 		IFNULL(q.quarterlyExamPS, 0) AS quarterlyExamPS,
		// 		IFNULL(q.quarterlyExamWS, 0) AS quarterlyExamWS,
		// 		IFNULL(q.quarterlyGrade, 0) AS quarterlyGrade
		// 	FROM
		// 		activity AS act
		// 			INNER JOIN
		// 		class AS v ON v.classID = act.classID
				
				
		// 		INNER JOIN (SELECT 
		// 			m.enrolledStudentID,
		// 			m.classID, h.*
		// 		FROM
		// 			enrolledstudents AS m
		// 		INNER JOIN student AS h ON m.studentID = h.studentID) AS a ON a.classID = act.classID
				
				
		// 			LEFT OUTER JOIN
		// 		(SELECT 
		// 			a.*,
		// 				SUM(IFNULL(a.activiyNumberOfItems, 0)) AS highestPossibleScore,
		// 				SUM(IFNULL(d.score, 0)) AS totalScore,
		// 				d.studentID,
		// 				d.score,
		// 				c.gradingSheetID
		// 		FROM
		// 			activity AS a
		// 		LEFT OUTER JOIN gradingsheetactivity AS b ON b.activityID = a.activityID
		// 		INNER JOIN gradingsheet AS c ON c.gradingSheetID = b.gradingSheetID
		// 		INNER JOIN learnerscore AS d ON d.gradingSheetActivityID = b.gradingSheetActivityID
		// 		WHERE
		// 			a.activityClassification = 1
		// 				AND c.gradingSheetID = '". $params[ 'gradingSheetID' ] ."'
		// 				AND a.activityQuarter = '". $params[ 'gradingSheetQuarter' ] ."'
		// 				AND a.subjectID =  '". $params[ 'subjectID' ] ."'
		// 		GROUP BY d.studentID , a.classID) AS classA ON classA.studentID = a.studentID
		// 			LEFT OUTER JOIN
		// 		(SELECT 
		// 			a.*,
		// 				SUM(IFNULL(a.activiyNumberOfItems, 0)) AS qhighestPossibleScore,
		// 				SUM(IFNULL(d.score, 0)) AS qtotalScore,
		// 				d.studentID,
		// 				d.score
		// 		FROM
		// 			activity AS a
		// 		LEFT OUTER JOIN gradingsheetactivity AS b ON b.activityID = a.activityID
		// 		INNER JOIN gradingsheet AS c ON c.gradingSheetID = b.gradingSheetID
		// 		INNER JOIN learnerscore AS d ON d.gradingSheetActivityID = b.gradingSheetActivityID
		// 		WHERE
		// 			a.activityClassification = 2
		// 				AND c.gradingSheetID = '". $params[ 'gradingSheetID' ] ."'
		// 				AND a.activityQuarter = '". $params[ 'gradingSheetQuarter' ] ."'
		// 				AND a.subjectID =  '". $params[ 'subjectID' ] ."'
		// 		GROUP BY d.studentID , a.classID) AS classB ON classB.studentID = a.studentID
		// 			LEFT OUTER JOIN
		// 		(SELECT 
		// 			a.*,
		// 				SUM(IFNULL(a.activiyNumberOfItems, 0)) AS whighestPossibleScore,
		// 				SUM(IFNULL(d.score, 0)) AS wtotalScore,
		// 				d.studentID,
		// 				d.score
		// 		FROM
		// 			activity AS a
		// 		LEFT OUTER JOIN gradingsheetactivity AS b ON b.activityID = a.activityID
		// 		INNER JOIN gradingsheet AS c ON c.gradingSheetID = b.gradingSheetID
		// 		INNER JOIN learnerscore AS d ON d.gradingSheetActivityID = b.gradingSheetActivityID
		// 		WHERE
		// 			a.activityClassification = 3
		// 				AND c.gradingSheetID = '". $params[ 'gradingSheetID' ] ."'
		// 				AND a.activityQuarter = '". $params[ 'gradingSheetQuarter' ] ."'
		// 				AND a.subjectID =  '". $params[ 'subjectID' ] ."'
		// 		GROUP BY d.studentID , a.classID) AS classC ON classC.studentID = a.studentID
		// 			RIGHT OUTER JOIN
		// 		subject AS subj ON subj.subjectID = act.subjectID
		// 			LEFT OUTER JOIN
		// 		(SELECT 
		// 			i.*
		// 		FROM
		// 			quarterlygradeperlearner AS i
		// 		WHERE
		// 			i.gradingSheetID = '". $params[ 'gradingSheetID' ] ."') AS q ON q.studentID = a.studentID
		// 	WHERE
		// 		v.classID = '". $params[ 'classID' ] ."' 
		// 	GROUP BY a.studentID
		// 	ORDER BY a.enrolledStudentID
		// ")->result_array();
		// LQ();
		// ORDER BY studentFullName ASC
	}
	
	public function saveForm( $data ){
		$data['dateModified'] = date('Y-m-d H:i:s');
		if( (int)$data['onEdit'] ){
			$this->db->where( 'gradingSheetID', (int)$data['gradingSheetID'] );
			$this->db->update( 'gradingsheet', unsetParams( $data, 'gradingsheet' ) );
			return (int)$data['gradingSheetID'];
		}
		else{
			$this->db->insert( 'gradingsheet', unsetParams( $data, 'gradingsheet' ) );
			return $this->db->insert_id();
		}
	}
	
	public function deleteRecord( $data ){
		if( !isset( $data['excludeMainTable'] ) ){
			$this->db->where( 'gradingSheetID', (int)$data['gradingSheetID'] );
			$this->db->delete( 'gradingsheet' );
		}
		$this->db->where( "gradingSheetActivityID IN( SELECT gradingSheetActivityID FROM gradingsheetactivity WHERE gradingSheetID = " . (int)$data['gradingSheetID'] . " )" );
		$this->db->delete( 'learnerscore' );
		$this->db->where( 'gradingSheetID', (int)$data['gradingSheetID'] );
		$this->db->delete( 'gradingsheetactivity' );
		$this->db->where( 'gradingSheetID', (int)$data['gradingSheetID'] );
		$this->db->delete( 'quarterlygradeperlearner' );
	}
	
	public function insertGradeActivity( $data ){
		$this->db->insert( 'gradingsheetactivity', $data );
		return $this->db->insert_id();
	}
	
	public function insertLearnerScore( $data ){
		if( count( $data ) > 0 ){
			$this->db->insert_batch( 'learnerscore', $data );
		}
	}
	
	public function insertPerLearnerGrade( $data ){
		if( count( $data ) > 0 ){
			$this->db->insert_batch( 'quarterlygradeperlearner', $data );
		}
	}
	
	public function retrieveRecord( $params ){
		$this->db->select( '*' );
		$this->db->from( 'gradingsheet' );
		$this->db->where( 'gradingSheetID', (int)$params['gradingSheetID'] );
		return $this->db->get()->result_array();
	}
	
	public function getGradingSheetStatus( $params ){
		$this->db->select( 'gradingSheetStatus' );
		$this->db->from( 'gradingsheet' );
		$this->db->where( 'gradingSheetID', (int)$params['gradingSheetID'] );
		return $this->db->get()->row();
	}
	
	public function getFinalGrade( $params ){
		$classID = 0;
		if( isset( $params['classID'] ) ){
			$classID = (int)$params['classID'];
		}
		return $this->db->query("
			SELECT
				a.*
				,( ( firstQuarter + secondQuarter + thirdQuarter + forthQuarter ) / 4 ) as finalGrade
				FROM(
					SELECT 
						a.studentID
						,b.teacherID
						,b.classID
						,CONCAT( a.studentFirstName, ' ', a.studentLastName ) as studentFullName
						,(IFNULL( c.first, 0 )/IFNULL( d.cntSubjects, 1 )) as firstQuarter
						,(IFNULL( e.second, 0 )/IFNULL( f.cntSubjects, 1 )) as secondQuarter
						,(IFNULL( g.third, 0 )/IFNULL( h.cntSubjects, 1 )) as thirdQuarter
						,(IFNULL( i.forth, 0 )/IFNULL( j.cntSubjects, 1 )) as forthQuarter
					FROM student as a
					INNER JOIN enrolledstudents as b
						ON( b.studentID = a.studentID AND b.teacherID = " . (int)$this->bgsUID . " )
					LEFT OUTER JOIN(
						SELECT SUM( IFNULL( a.quarterlyGrade,0 ) ) as first
							,a.studentID
							,b.classID
						FROM quarterlygradeperlearner as a
						JOIN gradingsheet as b
							ON( b.gradingSheetID = a.gradingSheetID )
						WHERE b.gradingSheetQuarter = 1 AND b.teacherID = " . (int)$this->bgsUID . " AND b.classID = " . $classID . "
						GROUP BY a.studentID, b.classID
					) as c
						ON( c.studentID = a.studentID )
					LEFT OUTER JOIN(
						SELECT
							COUNT(*) as cntSubjects
						FROM gradingsheet
						WHERE gradingSheetQuarter = 1 AND teacherID = " . (int)$this->bgsUID . " AND classID = " . $classID . "
					) as d
						ON( 1 = 1 )
					LEFT OUTER JOIN(
						SELECT SUM( IFNULL( a.quarterlyGrade,0 ) ) as second
							,a.studentID
							,b.classID
						FROM quarterlygradeperlearner as a
						JOIN gradingsheet as b
							ON( b.gradingSheetID = a.gradingSheetID )
						WHERE b.gradingSheetQuarter = 2 AND b.teacherID = " . (int)$this->bgsUID . " AND b.classID = " . $classID . "
						GROUP BY a.studentID, b.classID
					) as e
						ON( e.studentID = a.studentID )
					LEFT OUTER JOIN(
						SELECT
							COUNT(*) as cntSubjects
						FROM gradingsheet
						WHERE gradingSheetQuarter = 2 AND teacherID = " . (int)$this->bgsUID . " AND classID = " . $classID . "
					) as f
						ON( 1 = 1 )
					LEFT OUTER JOIN(
						SELECT SUM( IFNULL( a.quarterlyGrade,0 ) ) as third
							,a.studentID
							,b.classID
						FROM quarterlygradeperlearner as a
						JOIN gradingsheet as b
							ON( b.gradingSheetID = a.gradingSheetID )
						WHERE b.gradingSheetQuarter = 3 AND b.teacherID = " . (int)$this->bgsUID . " AND b.classID = " . $classID . "
						GROUP BY a.studentID, b.classID
					) as g
						ON( g.studentID = a.studentID )
					LEFT OUTER JOIN(
						SELECT
							COUNT(*) as cntSubjects
						FROM gradingsheet
						WHERE gradingSheetQuarter = 3 AND teacherID = " . (int)$this->bgsUID . " AND classID = " . $classID . "
					) as h
						ON( 1 = 1 )
					LEFT OUTER JOIN(
						SELECT SUM( IFNULL( a.quarterlyGrade,0 ) ) as forth
							,a.studentID
							,b.classID
						FROM quarterlygradeperlearner as a
						JOIN gradingsheet as b
							ON( b.gradingSheetID = a.gradingSheetID )
						WHERE b.gradingSheetQuarter = 4 AND b.teacherID = " . (int)$this->bgsUID . " AND b.classID = " . $classID . "
						GROUP BY a.studentID, b.classID
					) as i
						ON( i.studentID = a.studentID )
					LEFT OUTER JOIN(
						SELECT
							COUNT(*) as cntSubjects
						FROM gradingsheet
						WHERE gradingSheetQuarter = 4 AND teacherID = " . (int)$this->bgsUID . " AND classID = " . $classID . "
					) as j
						ON( 1 = 1 )
				) as a
				WHERE a.teacherID =  " . (int)$this->bgsUID . " AND a.classID = " . $classID . "
				GROUP BY a.studentID
				ORDER BY a.studentFullName ASC
		")->result_array();
		// LQ();
	}

	public function checkIfClosed( $params ){

		$this->db->select( 'classID' );
		$this->db->from( 'gradingsheet' );
		$this->db->where( 'gradingSheetID', $params[ 'gradingSheetID' ] );
		$this->db->limit( 1 );
		$gID = $this->db->get()->result_array();

		$this->db->select( 'classSchoolYearID' );
		$this->db->from( 'class' );
		$this->db->where( 'classID', $gID[ 0 ][ 'classID' ] );
		$this->db->limit( 1 );
		$cID = $this->db->get()->result_array();

		$this->db->where( 'schoolYearID', $cID[ 0 ][ 'classSchoolYearID' ] );
		$this->db->where( 'closedBy > ', 0 );
		$this->db->from( 'schoolyear' );
		$this->db->get()->result_array();

		return ( $this->db->affected_rows() > 0 ? 1 : 0 );
	}
}