<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Standards_model extends CI_Model {

	public function getIDmodule( $data ){
		return $this->db->query("
			SELECT a.* from modules as a where module LIKE 'Activity Guide'
		")->row();
	}
	
	public function _checkData($array){
		$table = $array['table'];
		$field = $array['field'];
		$value = $array['value'];
		$where = '';
		if ($this->db->field_exists('archive', $table)){
			$wh[] =  "archive != 1";
		}
		if(isset($array['exwhere'])){
			if( $array['exwhere'] ){
				$wh[] = $array['exwhere'];
			}
		}
		if(isset($wh)) $where = count($wh) > 0 ? " AND ".implode(' AND ',$wh) : "";
		$q =  $this->db->query("SELECT $field FROM $table WHERE $field = '".$value."' $where")->num_rows();
		return ($q > 0 ? true:false); 
	}
	
	public function searchCombo( $data ){
		$JOIN  = "";
		$WHERE = "";
		$LIKE  = "";
		
		/** filter alike values **/
		if( $data['query'] ){
			$LIKE = " AND $data[displayField] LIKE '%$data[query]%'";
		}
		
		/** filter reference code if defined **/
		if( isset( $data['ref'] ) ){
			$WHERE .= " AND a.ref = '$data[ref]'";
		}
		
		/** check archive exists on selected table **/
		if( $this->db->field_exists( 'archive', $data['table'] ) ){
			$WHERE .= " AND archive NOT IN(1)";
		}
		
		/** check loc_code exists on selected table **/
		if( $this->db->field_exists( 'loc_code', $data['table'] ) ){
			$WHERE .= " AND loc_code = $this->loc_code";
		}
		
		return $this->db->query("
			SELECT
				a.$data[displayField]
			FROM $data[table] AS a
			$JOIN
			WHERE a.$data[displayField] IS NOT NULL
			$WHERE
			$LIKE
			GROUP BY a.$data[displayField]
			ORDER BY a.$data[displayField]
			
		")->result_array();
		
	}
	
	public function getDateModified( $id, $col, $table ){
		$this->db->select( 'dateModified' );
		$this->db->where( $col, $id );
		return $this->db->get( $table )->row();
	}
	
	public function setLogs( $data ){
		$dbName = ( ( isset( $data['dbName'] ) )? $data['dbName'] . '.' : '' );
		$this->db->insert( $dbName . 'logs', unsetParams( $data, $dbName . 'logs' ) );
	}
	
	public function getSchoolYear( $data ){
		$this->db->select( 'schoolYearID as id, schoolYearDescription as name' );
		$this->db->from( 'schoolyear' );
		$this->db->order_by( 'schoolYearDescription' );
		if( isset( $data['query'] ) ){
			$this->db->like( 'schoolYearDescription', $data['query'], 'both' );
		}
		return $this->db->get()->result_array();
	}
	
	public function getGradeLevel( $data ){
		$this->db->select( 'gradeLevelID as id, gradeLevelDescription as name' );
		$this->db->from( 'gradelevel' );
		$this->db->order_by( 'gradeLevelDescription' );
		if( isset( $data['query'] ) ){
			$this->db->like( 'gradeLevelDescription', $data['query'], 'both' );
		}
		return $this->db->get()->result_array();
	}
	
	public function getSchoolYearList( $data ){
		$this->db->select( 'schoolYearID, schoolYearDescription' );
		$this->db->from( 'schoolyear' );
		$this->db->order_by( 'schoolYearDescription' );
		if( isset( $data['cnt'] ) ){
			return $this->db->count_all_results();
		}
		else{
			$this->db->limit( $data['limit'], $data['start'] );
			return $this->db->get()->result_array();
		}
	}
	
	public function retSchoolYearRec( $data ){
		$this->db->select( '*' );
		$this->db->from( 'schoolyear' );
		$this->db->where( 'schoolYearID', (int)$data['schoolYearID'] );
		return $this->db->get()->row();
	}
	
	public function saveSchoolYear( $data ){
		if( isset( $data['module'] ) ) unset( $data['module'] );
		if( isset( $data['modify'] ) ) unset( $data['modify'] );
		if( (int)$data['schoolYearID'] > 0 ){
			$data['dateModified'] = date( 'Y-m-d H:i:s' );
			$this->db->where( 'schoolYearID', (int)$data['schoolYearID'] );
			$this->db->update( 'schoolyear', unsetParams( $data, 'schoolyear' ) );
		}
		else{
			$this->db->insert( 'schoolyear', unsetParams( $data, 'schoolyear' ) );
		}
	}
	
	public function checkSchoolYearExists( $data ){
		$this->db->where( 'schoolYearDescription', $data['schoolYearDescription'] );
		$this->db->where_not_in( 'schoolYearID', (int)$data['schoolYearID'] );
		$this->db->from( 'schoolyear' );
		return $this->db->count_all_results();
	}
	
	public function checkIFUsed( $data ){
		$cnt = 0;
		$this->db->select( '*' );
		$this->db->from( 'gradelevelhistory' );
		$this->db->where( 'schoolYearID', (int)$data['schoolYearID'] );
		$cnt += $this->db->count_all_results();
		$this->db->select( '*' );
		$this->db->from( 'class' );
		$this->db->where( 'classSchoolYearID', (int)$data['schoolYearID'] );
		$cnt += $this->db->count_all_results();
		return $cnt;
	}
	
	/* public function getStudentsRecord( $data ){
		$this->db->select( "CONCAT( a.studentFirstName, ' ', a.studentLastName ) as name, a.studentID as id", false );
		$this->db->from( 'student as a' );
		if( isset( $data['filterOnGLSY'] ) ){
			$this->db->join( "
				(SELECT a.gradeLevelID, a.schoolYearID, a.studentID
				FROM gradelevelhistory as a
				INNER JOIN	(
								SELECT gradeLevelID, schoolYearID, MAX( gradeLevelHistoryID ) as gradeLevelHistoryID, studentID
								FROM gradelevelhistory
								GROUP BY studentID 
							)as b
				ON b.gradeLevelHistoryID = a.gradeLevelHistoryID
				) as b
			", 'b.studentID = a.studentID' );
			$this->db->where( 'b.gradeLevelID', ( isset( $data['gradeLevelID'] )? (int)$data['gradeLevelID'] : 0 ) );
			$this->db->where( 'b.schoolYearID', ( isset( $data['schoolYearID'] )? (int)$data['schoolYearID'] : 0 ) );
			$this->db->where( "a.studentID NOT IN( SELECT a.studentID FROM enrolledstudents as a JOIN class as b ON( b.classID = a.classID ) WHERE a.teacherID NOT IN(" . ( isset( $data['bgsUID'] )? (int)$data['bgsUID'] : 0 ) . ") AND b.classSchoolYearID = b.schoolYearID )" );
		}
		if( isset( $data['query'] ) ){
			$this->db->like( "CONCAT( a.studentFirstName, ' ', a.studentLastName )", $data['query'], 'both' );
		}
		if( isset( $data['studentID'] ) ){
			$this->db->where( "( a.studentInactiveTag NOT IN(1) OR a.studentID = " . (int)$data['studentID'] . " )" );
		}
		else{
			$this->db->where_not_in( 'a.studentInactiveTag',1 );
		}
		
		$this->db->order_by( 'a.studentFirstName asc, a.studentLastName asc' );
		return $this->db->get()->result_array();
	}
	 */
	public function deleteSchoolYear( $data ){
		$this->db->delete( 'schoolyear', unsetParams( $data, 'schoolyear' ) );
	}
	
	public function saveQuickSetup( $params ){
		$this->db->insert( $params['table'], $params['data'] );
		return $this->db->insert_id();
	}
	
	public function getActivityType( $data ){
		$this->db->select( 'activityType as id, activityTypeDescription as name, classificationID' );
		$this->db->from( 'activitytype' );
		if( isset( $data['query'] ) ){
			$this->db->like( 'activityTypeDescription', $data['query'], 'both' );
		}
		$this->db->order_by( 'activityTypeDescription' );
		return $this->db->get()->result_array();
	}
	
	public function getSubjects( $data ){
		$this->db->select( 'subjectID as id, subjectDescription as name' );
		$this->db->from( 'subject' );
		if( isset( $data['query'] ) ){
			$this->db->like( 'subjectDescription', $data['query'], 'both' );
		}
		$this->db->order_by( 'subjectMenu' );
		return $this->db->get()->result_array();
	}
	
}	