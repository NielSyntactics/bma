<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Activityguide_model extends CI_Model {
  
	public function __construct()
    {
        parent::__construct();
		$this->load->database(); 
    }

    function getHighestActivities(){
    	return $this->db->query("
    		SELECT d.classID FROM(select * from(select *,count(activityID) as numAct from activity group by teacherID) as a
			left outer join(select classSchoolYearID, classGradeLevel, bgsUID from class) as b on b.bgsUID = a.teacherID
			group by b.bgsUID order by numAct DESC) as d group by d.classGradeLevel
    		")->result_array();
    }

    function allActivities( $params ){
    	$this->db->select( "*" );
    	$this->db->from( "activity" );
    	$this->db->where( "classID", $params[ "classID" ] );
    	return $this->db->get()->result_array();
    }
	
	function saveForm( $data ){
		$data['schoolYearID'] = $data['schoolYear'];
		if( $data['onEdit'] ){
			unset( $data['activityID'] );
			$this->db->update('activity', unsetParams( $data, 'activity' ), array( 'classID' => $data[ 'classID' ], 'teacherID' => $data[ 'teacherID' ], 'activityCode' => $data[ 'activityCode' ] ) );
		}else{
			$this->db->insert( 'activity', unsetParams( $data, 'activity' ) );
		}	
		$this->_logEntry();
	}

	function getAllSameClass( $params ){
		$this->db->select( "a.classID ,a.bgsUID" );
		$this->db->from( "class as a" );
		$this->db->join( "( SELECT * FROM class where classID = ". $params[ 'classID' ] ." ) as b"
			," a.classSchoolYearID = b.classSchoolYearID AND a.classGradeLevel = b.classGradeLevel ", "inner" );
		// $this->db->where( "a.classID <>", $params[ 'classID' ] );
		return $this->db->get()->result_array();
	}

	function checkIfActivityForSchoolYear( $params ){
		$this->db->select( "d.*" );
		$this->db->from( "class" );
		$this->db->join( "(SELECT 
		        a.*,c.classSchoolYearID
		    FROM
		        bma_ogs.activity AS a
		    INNER JOIN (SELECT 
		        *
		    FROM
		        class AS b) AS c ON c.classID = a.classID
		    WHERE
		        a.activityCode LIKE ". $params[ 'activityCode' ] .") AS d","1 = 1", "inner" );
		$this->db->join( "( SELECT * FROM class where classID LIKE ". $params[ 'classID' ] ." ) as e", "e.classSchoolYearID = d.classSchoolYearID", "inner" );
		$this->db->get()->result_array();
		return $this->db->affected_rows() > 0 ? true : false;
	}
	
	public function checkInputIfValid( $params ){
		$this->db->where( $params );
		$this->db->get( "gradingsheet" );
		return ( $this->db->affected_rows() > 0 ? true : false );
	}
	
	function getYearLevels(){
		return $this->db->get( 'gradelevel' )->result_array();
		
	}
	
	function getSchoolYears( $params ){
		// return $this->db->get( 'schoolyear' )->result_array();
		$this->db->select( 'a.*' );
		$this->db->from( 'schoolyear a' );
		$this->db->join( 'class as b', 'b.classSchoolYearID = a.schoolYearID', 'inner' );
		$this->db->where( 'b.bgsUID', $this->session->userdata( 'BGSUID' ) );
		if( isset( $params[ 'filterClosed' ] ) ){
			// $this->db->where( 'a.closedBy', 0 );
			$this->db->where('a.closedBy IS NULL', null, false);
		}
		return $this->db->get()->result_array();
	}
	
	function _logEntry( $delete = null ){
		$data = getData();
		if( isset( $data[ 'onEdit' ] ) && $data[ 'onEdit' ] ){
		}
		else if( $delete == "delete" ){
		}
		else{
			$data['description'] = "Added new Activity, $data[activityCode] $data[activityDescription].";
		}
		$date =  new DateTime();
		$data[ 'logDateAndTime' ] = date_format($date, 'Y-m-d H:i:s');
		$data[ 'bgsUID' ] = $this->session->userdata( 'BGSUID' );
		$this->db->insert( "logs", unsetParams( $data, 'logs' ) );
	}
	
	function _checkIfActivityHasGrade( $params ){
		// print_r( $params );
		// die();
		$this->db->from( "gradingsheetactivity as a" );
		$this->db->join( "gradingsheet as b" ,"b.gradingSheetID = a.gradingSheetID" ,"inner" );
		$this->db->where( "a.activityID" , $params['activityID'] );
		$this->db->where( "b.gradingSheetStatus" ,2 );
		$this->db->where( "b.subjectID" ,$params[ 'subjectID' ] );
		$this->db->where( "b.gradingSheetQuarter" ,$params[ 'activityQuarter' ] );
		$this->db->where( "b.classID" ,$params[ 'classID' ] );
		$this->db->get()->result_array();
		return ( $this->db->affected_rows() > 0 ) ? true : false;
	}
	
	function getHistory( $data, $where	=	null ){
		// print_r( $data );
		// die();
		if( isset( $data['tableID'] ) AND isset( $data['filter'] ) AND isset( $data[ 'dispValue' ] ) AND $data[ 'dispValue' ] != "All" ){
			switch( $data['tableID'] ){
				case 1:
						$where	=	array(
							"e.schoolYearID"	=>	$data['filter']
						);
					break;
				case 2:
						$where	=	array(
							"b.classGradeLevel"	=>	$data['filter']
						);
					break;
				case 3:
						$where	=	array(
							"c.subjectID"	=>	$data['filter']
						);
					break;
				case 4:
						$where	=	array(
							"c.activityID"	=>	$data['filter']
						);
					break;
				case 5:
						$where	=	array(
							"f.activityType"	=>	$data['filter']
						);
					break;
				case 6:
						$where	=	array(
							"c.activityInactiveTag"	=>	( $data['filter'] -1 )
						);
					break;
			}
		}
		
		$this->db->select( "a.*,b.*,c.*, d.*,e.*,f.*, DATE_FORMAT( c.activityDate, '%m/%d/%Y' ) as activityDate
							,(
								CASE 
									WHEN c.activityInactiveTag = 1 THEN 'Inactive' 
									WHEN c.activityInactiveTag = 0 THEN 'Active' 
								END
							) as activityInactiveTag
							,(
								CASE
									WHEN c.activityClassification = 1 THEN 'Performance'
									WHEN c.activityClassification = 2 THEN 'Written Works'
									WHEN c.activityClassification = 3 THEN 'Quizzes'
								END
							) as activityClassification
							,(
								CASE
									WHEN c.activityWrittenWorkType = 1 THEN 'CHED'
									WHEN c.activityWrittenWorkType = 2 THEN 'Montessori'
								END
							) as activityWrittenWorkType
							", false );
		$this->db->from( 'gradelevel as a' );
		$this->db->join( 'class as b', 'b.classGradeLevel = a.gradeLevelID');
		$this->db->join( 'activity as c', "c.classID = b.classID" );
		
		$this->db->join( 'subject as d', 'c.subjectID = d.subjectID' );
		$this->db->join( 'schoolyear as e', 'e.schoolYearID = b.classSchoolYearID' );
		$this->db->join( 'activitytype as f', 'c.activityType = f.activityType' );
		
		$this->db->order_by( 'c.activityID DESC' );
		$this->db->where( 'b.bgsUID', $this->session->userdata( 'BGSUID' ) );
		$this->db->where( 'c.teacherID', $this->session->userdata('BGSUID') );
		if( !is_null( $where ) )
			$this->db->where( $where );
		// $this->db->where( 'b.classSchoolYearID', $data['classSchoolYearID'] );
		// $this->db->limit( $data[ 'limit' ] , $data[ 'start' ]);
		
		if( !$data['pdf'] ){
			$this->db->limit( $data['limit'] ,$data['start'] );
			}
			if( $data['cnt'] ){
				return $this->db->count_all_results();
			}
			else{
				return $this->db->get()->result_array();
			}
			
			
		// return $this->db->get()->result_array();
		// LQ();
		// return();
	}
	
	public function retrieveActivityData( $data ){
		// print_r( $data );
		// die();
		$this->db->select( "a.*,b.*,c.*, d.*,e.*", false );
		$this->db->from( 'gradelevel as a' );
		$this->db->join( 'class as b', 'b.classGradeLevel = a.gradeLevelID');
		$this->db->join( 'activity as c', "c.classID = b.classID" );
		
		// $this->db->join( 'gradingsheet as f', "f.teacherID = '".$this->session->userdata('BGSUID')."'", 'left outer' );
		
		$this->db->join( 'subject as d', 'c.subjectID = d.subjectID' );
		$this->db->join( 'schoolyear as e', 'e.schoolYearID = b.classSchoolYearID' );
		
		$this->db->order_by( 'c.activityID DESC' );
		$this->db->where( 'b.bgsUID', $this->session->userdata( 'BGSUID' ) );
		$this->db->where( 'c.teacherID', $this->session->userdata('BGSUID') );
		$this->db->where( 'c.activityID', $data['activityID'] );
		$this->db->limit(1);
		return $this->db->get()->result_array();
	}
	// retrieve data for payment history
	public function retrieveData( $data )
	{
		$this->db->select( "IFNULL( c.activityCode, CONCAT( a.gradeLevelID, '.0' ) ) as activityCode,a.*,b.classID", false );
		$this->db->from( 'gradelevel as a' );
		$this->db->join( 'class as b', 'b.classGradeLevel = a.gradeLevelID', 'left outer' );
		$this->db->join( 'activity as c', 'c.classID = b.classID', 'left outer' );
		$this->db->order_by( 'c.activityID DESC' );
		$this->db->limit(1);
		$this->db->where( 'b.bgsUID', $this->session->userdata( 'BGSUID' ) );
		// $this->db->where( 'c.teacherID', $this->session->userdata('BGSUID') );
		$this->db->where( 'b.classSchoolYearID', $data['classSchoolYearID'] );
		return $this->db->get()->result_array();
		// LQ();
	}
	
	public function retrieveDataGradeLevel(){
		return	$this->db->query("
			SELECT a.* FROM gradelevel as a 
				WHERE a.gradeLevelID 
			IN ( 
				SELECT classGradeLevel 
					FROM class WHERE classGradeLevel LIKE $data[gradeLevelID]
						AND bgsUID LIKE $this->session->userdata(BGSUID) 
				)
		")->result_array();
	}
	
	public function retrieveDataSubjects(){
		return	$this->db->get('subject')->result_array();
	}
	
	public function getActivityType(){
		return	$this->db->get('activitytype')->result_array();
	}
	
	public function checkIfActivityIsUsed( $params ){
		return $this->db->query("
				SELECT * FROM gradingsheetactivity as z inner join(SELECT 
			e.*,f.activityID
		FROM
			activity AS f
				INNER JOIN
			(SELECT 
				d.classID,
					d.classSchoolYearID,
					d.classGradeLevel,
					c.activityCode
			FROM
				class AS d
			INNER JOIN (SELECT 
				a.classID,
					a.classSchoolYearID,
					a.classGradeLevel,
					b.activityCode
			FROM
				class AS a
			INNER JOIN (SELECT 
				*
			FROM
				bma_ogs.activity
			WHERE
				activityID LIKE ". $params[ 'activityID' ] .") AS b ON b.classID = a.classID) AS c
			WHERE
				d.classSchoolYearID = c.classSchoolYearID
					AND d.classGradeLevel = c.classGradeLevel) AS e ON e.classID = f.classID
				AND e.activityCode = f.activityCode
		WHERE
			e.classID != ''
		GROUP BY e.classID) as x on x.activityID = z.activityID
		")->result_array();
	}

	public function deleteActivity( $data ){
	
	$this->_logEntry( "delete" );
	$this->db->query("
		DELETE y . * FROM activity AS y
        INNER JOIN
		    (SELECT 
		        d.*, e.activityCode
		    FROM
		        class AS d
		    INNER JOIN (SELECT 
		        b.*, c.activityCode
		    FROM
		        class AS b
		    INNER JOIN (SELECT 
		        *
		    FROM
		        bma_ogs.activity AS a
		    
		    WHERE
		        a.activityID LIKE ". $data[ 'activityID' ] .") AS c ON c.classID = b.classID) AS e ON e.classGradeLevel = d.classGradeLevel
		        AND e.classSchoolYearID = d.classSchoolYearID) AS x 
		WHERE
		    x.bgsUID = y.teacherID
		    AND y.classID = x.classID
		    AND x.activityCode = y.activityCode");
    }
	
	
	
	public function filterGradeLevel(){
		$data = getData();
		$this->db->select( 'a.gradeLevelID as id, a.gradeLevelDescription as name' );
		$this->db->from( 'gradelevel as a' );
		$this->db->join( 'class as b', 'b.classGradeLevel = a.gradeLevelID' );
		$this->db->where( 'b.bgsUID', $this->session->userdata('BGSUID') );
		if( isset( $data[ 'query' ] ) )
		$this->db->like( "a.gradeLevelDescription" ,$data[ 'query' ] , 'both');
		return $this->db->get()->result_array();
	}
	
	public function filterSchoolYears(){
		$data = getData();
		$this->db->select( 'a.schoolYearID as id, a.schoolYearDescription as name' );
		$this->db->from( 'schoolyear as a' );
		$this->db->join( 'class as b', 'b.classSchoolYearID = a.schoolYearID' );
		$this->db->where( 'b.bgsUID', $this->session->userdata('BGSUID') );
		if( isset( $data[ 'query' ] ) )
		$this->db->like( "a.schoolYearDescription" ,$data[ 'query' ] , 'both');
		return $this->db->get()->result_array();
	}
	
	public function filterSubjects(){
		$data = getData();
		$this->db->select( 'a.subjectID as id, a.subjectDescription as name' );
		if( isset( $data[ 'query' ] ) )
		$this->db->like( "a.subjectDescription" ,$data[ 'query' ] , 'both');
		return $this->db->get('subject as a')->result_array();
	}
	
	public function filterActivities(){
		$data = getData();
		$this->db->select( 'a.activityID as id, a.activityCode as name' );
		$this->db->where( 'a.teacherID', $this->session->userdata('BGSUID') );
		if( isset( $data[ 'query' ] ) )
		$this->db->like( "a.activityCode" ,$data[ 'query' ] , 'both');
		return $this->db->get('activity as a')->result_array();
	}
	
	public function filterActivityType(){
		$data = getData();
		$this->db->select( 'a.activityType as id, a.activityTypeDescription as name' );
		if( isset( $data[ 'query' ] ) )
		$this->db->like( "a.activityTypeDescription" ,$data[ 'query' ] , 'both');
		return $this->db->get('activitytype as a')->result_array();
	}
	
	public function checkIfActTrans( $params ){
		$this->db->where("activityID", $params['activityID']);
		$this->db->where("subjectID", $params['subjectID']);
		$this->db->get('activity')->result_array();
		return ( $this->db->affected_rows() > 0 ? true : false );
	}

	public function getGradingSheetDetails( $params ){
		$this->db->where( 'activityID', $params['activityID'] );
		return $this->db->get( 'gradingsheetactivity' )->result_array();
	}

	public function deleteGradingSheetActivity( $params ){
		$this->db->where('gradingSheetActivityID', $params['gradingSheetActivityID']);
		$this->db->delete('gradingsheetactivity');
	}	
	
	public function deleteLearnerScore( $params ){
		$this->db->where('gradingSheetActivityID', $params['gradingSheetActivityID']);
		$this->db->delete('learnerscore');
	}

	public function checkIfExist( $params ){
		$this->db->where( 'activityID', $params[ 'activityID' ] );
		$this->db->limit( 1 );
		$this->db->get( 'activity' )->row();
		return ( $this->db->affected_rows() > 0 ? true : false );
	}

	public function checkIfClosed( $params ){
		$this->db->select( 'classID' );
		$this->db->from( 'activity' );
		$this->db->where( 'activityID', $params[ 'activityID' ] );
		$this->db->limit( 1 );
		$data0 = $this->db->get()->result_array();

		$this->db->select( 'classSchoolYearID' );
		$this->db->from( 'class' );
		$this->db->where( 'classID', $data0[ 0 ][ 'classID' ] );
		$this->db->limit( 1 );
		$data = $this->db->get()->result_array();

		$this->db->select( 'schoolYearDescription' );
		$this->db->where( 'schoolYearID', $data[ 0 ][ 'classSchoolYearID' ] );
		$this->db->where( 'closedBy >', 0 );
		$ret = $this->db->get( 'schoolyear' )->result_array();
		return ( $this->db->affected_rows() > 0 ? $ret[ 0 ][ 'schoolYearDescription' ] : false );

	}
	
}	