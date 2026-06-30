<?php
/** User settings module
  * [Developer]
  * Developer: Jayson Dagulo
  * Date Created: Feb. 15, 2016
  * Date Finished: Feb. 23, 2016
  
  * [Database]
	bmapsu, modules, amodules, and class
	
  * [Description]
	This module allows the authorized administrators to set (add, edit or delete) users who will be allowed to access the system. 
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Loginmonitoring_model extends CI_Model {
	
	public function getUserDetails( $params ){
		if( (int)$params['by'] == 1 ){ $this->db->select( "a.bmapsUID as id, CONCAT(a.bmapsUfirstname,' ', a.bmapsUlastname) as name" ); }
		else if( (int)$params['by'] == 2  ){ $this->db->select( "a.bmapsUID as id, a.bmapsUname as name", false ); }
		else{ $this->db->select( "a.bmapsUID as id, CONCAT( a.bmapsUfirstname, ' ', a.bmapsUlastname ) as name", false ); }
		$this->db->from( 'bmapsu as a' );
		if( isset( $params['query'] ) && isset( $params['by'] ) ){
			$this->db->like( ( (int)$params['by'] == 1 )? 'a.bmapsUname' : ((int)$params['by'] == 2 )? 'a.bmapsUname':"CONCAT( a.bmapsUfirstname, ' ', a.bmapsUlastname )" ,$params['query'], 'both' );
		}
		$this->db->order_by( ( ( (int)$params['by'] == 1 )? 'a.bmapsUname' : ' a.bmapsUfirstname asc, a.bmapsUlastname asc' ) );
		$this->db->where_not_in( 'a.bmapsUtype', 0 );
		return $this->db->get()->result_array();
	}
	
	public function getModuleIdAndName( $params ){
		$this->db->select( "a.idmodule as id, CONCAT( a.idmodule, '-', b.module ) as name ", false);
		$this->db->from( 'logs as a' );
		$this->db->join( 'modules as b', 'a.idmodule = b.idmodule' );
		$this->db->order_by('a.idmodule ASC');
		$this->db->group_by('a.idmodule');
		$this->db->where_not_in( 'a.idmodule', NULL );
		return $this->db->get()->result_array();
	}
	
	/**
	 ** Log Viewer
	 **/
	public function viewAllLogs( $params ){
		$startDateTime = date('Y-m-d H:i:s' ,strtotime("+1 minute",strtotime($params['sdatedateRange'])));
		$endDateTime = date('Y-m-d H:i:s' ,strtotime("+23 hours +59 minutes",strtotime($params['edatedateRange'])));
		$sdate= $startDateTime;
		$edate= $endDateTime;
		
		$this->db->select( "a.logid, DATE_FORMAT(a.logDateAndTime,'%m/%d/%Y %h:%i:%s') as logDateAndTime, a.bmapsUID, a.idmodule, a.description
							,CONCAT(b.bmapsUfirstname,' ',b.bmapsUlastname) as fullName, b.bmapsUname as userName
							,c.module
							,(CASE
								WHEN b.bmapsUtype = 0 THEN 'Super Admin'
								WHEN b.bmapsUtype = 1 THEN 'Administrator'
								WHEN b.bmapsUtype = 2 THEN 'Secretary'
								WHEN b.bmapsUtype = 3 THEN 'User'
								END) as userType", false );
		
		
		
		if( ((int)$params['filterBy'] == 1 || (int)$params['filterBy'] == 2) && (int)$params['userRetrieve'] != -1 ){
			$this->db->where( 'a.bmapsUID', (int)$params['userRetrieve'] );
		}
		if( (int)$params['filterBy'] == 3 && (int)$params['userRetrieve'] != -1 ){
			$this->db->where( 'b.bmapsUtype', (int)$params['userRetrieve'] );
		}
		if( (int)$params['filterBy'] == 4  && (int)$params['userRetrieve'] != -1 ){
			$this->db->where( 'a.idmodule', (int)$params['userRetrieve'] );
		}
		
		$this->db->where("a.logDateAndTime  between '".$sdate."' and '".$edate."' " );
		if( !$params['cnt'] == 0 ){
			$this->db->limit( (int)$params['limit'], (int)$params['start'] );
		}
		// $this->db->where('a.logDateAndTime >', $sdate );
		// $this->db->where('a.logDateAndTime <', $edate );
		$this->db->from( 'logs as a' );
		$this->db->order_by( 'a.logid desc' );
		$this->db->join( 'bmapsu as b', 'a.bmapsUID = b.bmapsUID' );
		$this->db->join( 'modules as c', 'a.idmodule = c.idmodule' );
		
		// $this->db->where('mtype',0);
		
		return $this->db->get()->result_array();
		/* $this->db->get()->result_array();
		LQ() */;
	}
	
	// public function saveForm( $data ){
		// $onEdit = (int)$data['onEdit'];
		// $data['dateModified'] = date('Y-m-d H:i:s');
		// if( $onEdit ){
			// $this->db->where( 'bmapsUID', (int)$data['bmapsUID'] );
			// $this->db->update( 'bmapsu', unsetParams( $data, 'bmapsu' ) );
			// return (int)$data['bmapsUID'];
		// }
		// else{
			// unset( $data['bmapsUID'] );
			// $data['bmapsUKey'] = md5( $data['bmapsUKey'] );
			// $this->db->insert( 'bmapsu', unsetParams( $data, 'bmapsu' ) );
			// return $this->db->insert_id();
		// }
	// }
		
	// public function retrieveRecords( $data ){
		
		// $this->db->select( '*' );
		// $this->db->from( 'bmapsu' );
		// $this->db->where( 'bmapsUID', (int)$data['bmapsUID'] );
		// return $this->db->get()->result_array();
	// }
	
	// public function getGradeSchoolYear( $params ){
		// $this->db->select('a.classGradeLevel as gradeLevelID, a.classSchoolYearID as schoolYearID, b.gradeLevelDescription, c.schoolYearDescription, a.classID');
		// $this->db->from( 'class as a' );
		// $this->db->join( 'gradelevel as b','b.gradeLevelID = a.classGradeLevel', 'left outer' );
		// $this->db->join( 'schoolyear as c','c.schoolYearID = a.classSchoolYearID', 'left outer' );
		// $this->db->where( 'a.bmapsUID', (int)$params['bmapsUID'] );
		// return $this->db->get()->result_array();
	// }
	
	// public function getStudentEnrolled( $data ){
		// $this->db->select( "a.studentID as bmapsUID, CONCAT( b.studentFirstName, ' ', b.studentLastName ) as sFullName, a.classID, 1 as fromEdit", false );
		// $this->db->from( 'enrolledstudents as a' );
		// $this->db->join( 'student as b', 'b.studentID = a.studentID' );
		// $this->db->where( 'a.classID', (int)$data['classID'] );
		// return $this->db->get()->result_array();
	// }

	
	// public function cntTaggedActivity( $data ){
		// $this->db->select( '*' );
		// $this->db->where( 'classID', (int)$data['classID'] );
		// return $this->db->count_all_results( 'activity' );
	// }
	
	// public function cntTaggedGS( $data ){
		// $this->db->select( '*' );
		// $this->db->where( 'classID', (int)$data['classID'] );
		// $this->db->where( 'gradingSheetStatus', 2 );
		// return $this->db->count_all_results( 'gradingsheet' );
	// }
	
	// public function getModuleList( $mtype ){
		// $this->db->select( 'idmodule, mtype' );
		// $this->db->from( 'modules' );
		// if( $mtype != -1 ){
			// $this->db->where( 'mtype', $mtype );
		// }
		// $this->db->where_not_in( 'archive', 1 );
		// return $this->db->get()->result_array();
	// }
	
	// public function deleteModuleAccess( $params ){
		// $this->db->where( 'iduser', (int)$params['bmapsUID'] );
		// $this->db->delete( 'amodules' );
	// }
	
	// public function deleteRecord( $params ){
		// $this->db->where( 'bmapsUID', (int)$params['bmapsUID'] );
		// $this->db->delete( 'bmapsu' );
	// }
	
	// public function cntTaggedRecords( $params ){
		// $cnt = 0;
		// $this->db->select( '*' );
		// $this->db->from( 'logs' );
		// $this->db->where( 'bmapsUID', (int)$params['bmapsUID'] );
		// $cnt += $this->db->count_all_results();
		// $this->db->select( '*' );
		// $this->db->from( 'activity' );
		// $this->db->where( 'teacherID', (int)$params['bmapsUID'] );
		// $cnt += $this->db->count_all_results();
		// $this->db->select( '*' );
		// $this->db->from( 'gradingsheet' );
		// $this->db->where( 'teacherID', (int)$params['bmapsUID'] );
		// $cnt += $this->db->count_all_results();
		// return $cnt;
	// }
	
	// public function saveAModules( $data ){
		// $this->db->insert( 'amodules', $data );
	// }
	
	// public function changePassword( $params ){
		// $this->db->set( 'bmapsUKey', md5( $params['bmapsUKey'] ) );
		// $this->db->where( 'bmapsUID', (int)$params['bmapsUID'] );
		// $this->db->update( 'bmapsu' );
	// }
	
	// public function getModules( $params ){
		// $this->db->select( 'a.module,a.mlink,a.mtype,a.idmodule,IFNULL( b.save, 0 ) as save, IFNULL( b.edit, 0 ) as edit, IFNULL( b.del, 0 ) as del, IFNULL( b.print, 0 ) as print, (CASE
			// WHEN b.amodulesID IS NOT NULL THEN 1
			// ELSE 0
		// END) as chk' );
		// $this->db->from( 'modules as a' );
		// $this->db->join( 'amodules as b', 'b.idmodule = a.idmodule AND b.iduser = ' . (int)$params['bmapsUID'], 'left outer' );
		// $this->db->where( 'a.mtype', $params['mtype'] );
		// $this->db->where( 'a.mtype', 0 );
		// $this->db->where_not_in( 'a.idmodule', 0 );
		// $this->db->order_by( 'a.module' );
		// $this->db->group_by( 'a.idmodule' );
		// return $this->db->get()->result_array();
	// }
	
	// public function getUserList( $params ){
		// $this->db->select( "a.bmapsUID, CONCAT( a.bmapsUfirstname, ' ', a.bmapsUlastname ) as bmapsuFullName,a.bmapsUtype as uType", false );
		// $this->db->from( 'bmapsu as a' );
		// $this->db->where_not_in( 'a.bmapsUtype', 0 );
		// if( isset( $params['query'] ) ){
			// $this->db->like( "(CASE
									// WHEN a.bmapsUtype = 3 THEN CONCAT( b.studentFirstName, ' ', b.studentLastName )
									// ELSE CONCAT( a.bmapsUfirstname, ' ', a.bmapsUlastname )
								// END)", $params['query'], 'both' );
		// }
		// $this->db->order_by( 'a.bmapsUfirstname asc, a.bmapsUlastname asc' );
		// return $this->db->get()->result_array();
	// }
	
	// public function deleteClassesNotInList( $data, $id ){
		// $this->db->where_not_in( 'classID', $data );
		// $this->db->where( 'bmapsUID', $id );
		// $this->db->delete( 'class' );
	// }
	
	// public function deleteAmodulesRec( $params ){
		// $this->db->where( 'mtype', (int)$params['mtype'] );
		// $this->db->where( 'iduser', (int)$params['bmapsUID'] );
		// $this->db->delete( 'amodules' );
	// }
	
	// public function saveAmodulesRec( $data ){
		// $this->db->insert_batch( 'amodules', $data );
	// }
	
}