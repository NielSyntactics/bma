<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Studentsprofile_model extends CI_Model {
  
	public function __construct()
    {
        parent::__construct();
				$this->load->database(); 
    }
	
	function saveForm( $data ){
	
		$onEdit = $data['onEdit'];
		if( $onEdit ){
			$this->_logEntry();
			$this->db->update('student', unsetParams( $data, 'student' ), array( 'studentID' => $data['studentID'] ));
			$arr	=	array(
							'gradeLevelID'	=> 	$data['studentGradeLevelHistoryID']
							,'schoolYearID'	=> 	$data[ 'schoolYear' ]
							,'dateUpdated'	=> 	date( 'Y-m-d' )
							,'updatedByID'	=> 	$this->session->userdata( 'BGSUID' )
							,'studentID'	=>	$data['studentID']
						);
			$paymentHistory 	=	array(
								'dateUpdated'		=> 	date( 'Y-m-d' )
								,'updatedByID'		=>	$this->session->userdata( 'BGSUID' )
								,'studentID'		=>	$data['studentID']
								,'paymentStatus'	=>	$data[ 'paymentStatusHistoryID' ]
						);
		}else{
			$this->db->insert( 'student', unsetParams( $data, 'student' ) );
			$arr	=	array(
							'gradeLevelID'	=> 	$data['studentGradeLevelHistoryID']
							,'schoolYearID'	=> 	$data[ 'schoolYear' ]
							,'dateUpdated'	=> 	date( 'Y-m-d' )
							,'updatedByID'	=> 	$this->session->userdata( 'BGSUID' )
							,'studentID'	=>	$this->db->insert_id()
						);
			$paymentHistory 	=	array(
								'dateUpdated'		=> 	date( 'Y-m-d' )
								,'updatedByID'		=>	$this->session->userdata( 'BGSUID' )
								,'studentID'		=>	$this->db->insert_id()
								,'paymentStatus'	=>	$data[ 'paymentStatusHistoryID' ]
						);
			$this->_logEntry();
		}
			if( !$data[ 'grdLevel' ] ) $this->db->insert( 'gradelevelhistory', $arr );
				$this->db->insert( 'paymentstatushistory', $paymentHistory );
			
	}
	
	function _logEntry( $delete = null ){
		$data = getData();
		if( isset( $data[ 'onEdit' ] ) && $data[ 'onEdit' ] ){
						$this->db->select( "concat( studentFirstName, ' ' ,studentLastName ) as name" );
						$this->db->from( "student" );
						$this->db->where( "studentID", $data[ 'studentID' ] );
			$studName =	$this->db->get()->result_array();
			$data['description'] = "Modified ".$studName[0]['name']."  record.";
		}else if( $delete == "delete" ){
						$this->db->select( "concat( studentFirstName, ' ' ,studentLastName ) as name" );
						$this->db->from( "student" );
						$this->db->where( "studentID", $data[ 'studentID' ] );
			$studName =	$this->db->get()->result_array();
			$data['description'] = "Deleted ".$studName[0]['name'];
		}
		else{
			$data['description'] = "Added new student, $data[studentFirstName] $data[studentLastName].";
		}
		$date =  new DateTime();
		$data[ 'logDateAndTime' ] = date_format($date, 'Y-m-d H:i:s');
		$data[ 'bgsUID' ] = $this->session->userdata( 'BGSUID' );
		$this->db->insert( "logs", unsetParams( $data, 'logs' ) );
	}
	
	function getYearLevels(){
		return $this->db->get( 'gradelevel' )->result_array();
	}
	
	function getSchoolYears(){
		return $this->db->get( 'schoolyear' )->result_array();
	}
	
	function getHistory( $data ,$where = null, $innerWHERE = null, $order = "" ){
		if( isset( $data['tableID'] ) AND isset( $data['filter'] ) AND isset( $data[ 'dispValue' ] ) AND $data[ 'dispValue' ] != "All" ){
			// if( $data[ 'filter' ] != 0 || ( $data[ 'tableID' ] >= 6 && $data[ 'dispValue' ] != "All" ) )
			switch( $data['tableID'] ){
				case 1:
						$where	=	"WHERE a.studentLastName LIKE '".$data[ 'dispValue' ]."'";
					break;
				case 2:
						$where	=	"WHERE a.studentFirstName LIKE '".$data[ 'dispValue' ]."'";
					break;
				case 3:
						$where	=	"WHERE a.studentMiddleName LIKE '".$data[ 'dispValue' ]."'";
					break;
				case 4:
						$where	= " WHERE b.gradeLevelID LIKE ".$data['filter'];
					break;
				case 5:
						$where	= " WHERE e.schoolYearID LIKE ".$data['filter'];
					break;
				case 6:
						$where	=	"WHERE d.paymentStatus LIKE ".( $data['filter'] - 1);
						$innerWHERE	=	"WHERE paymentStatus LIKE ".( $data['filter'] - 1);
					break;
				case 7:
						$where	=	"WHERE a.studentInactiveTag LIKE ".( $data['filter'] - 1);
					break;
				case 8:
						$where	=	"WHERE a.studentID LIKE ". $data['filter'];
					break;
			}
		}
		if( isset( $data['sort'] ) ){
				$sort = json_decode( $data['sort'], true )[0];
				$order = $sort[ 'property' ]." ". $sort['direction'];
			}
			else{
				$order = "studentNumber desc";
			}
		
			// $this->db->select("
				// SELECT z.* FROM (
							// SELECT 
								// a.*
								// ,concat(a.studentLastName, ', ', a.studentFirstName, ' ', if(a.studentMiddleName is not null, concat('', a.studentMiddleName, ''), '')  ) as fullName
								// , c.gradeLevelDescription
								// , b.gradeLevelHistoryID
								// , d.dateUpdated
								// ,e.schoolYearDescription
								// ,(CASE
									// WHEN a.studentInactiveTag = 1 THEN 'Inactive'
									// WHEN a.studentInactiveTag = 0 THEN 'Active'
								// END) as studentInactiveTagName
								// ,(CASE
									// WHEN d.paymentStatus = 0 THEN 	'Not Paid'
									// WHEN d.paymentStatus = 1 THEN 	'Paid'	
								// END) as paymentStatusName
							// from student as a
							// JOIN gradelevelhistory as b ON b.studentID = a.studentID
							// JOIN gradelevel as c ON b.gradelevelID = c.gradelevelID
							// JOIN schoolyear as e on e.schoolYearID = b.schoolYearID
							
							
							// inner join(
								// SELECT studentID, dateUpdated, paymentStatusHistoryID, paymentStatus
									// FROM 
										// ( SELECT studentID, dateUpdated, paymentStatusHistoryID, paymentStatus
											// FROM ( SELECT *
												// FROM
													// paymentstatushistory
												// ORDER BY paymentStatusHistoryID DESC
										// ) as statusHistory
									// GROUP BY studentID ) as statHistory
								// $innerWHERE
							// ) AS d on d.studentID = a.studentID
							
							// $where
							// order by gradeLevelHistoryID desc
					// ) as z
				// group by studentNumber
				// order by fullName desc
			// ");
			// $this->db->from( "student as x " );
			// $this->db->limit( $data['start'], $data['limit'] );
			// return $this->db->get()->result_array();
			return $this->db->query("
				SELECT x.* FROM ( 
					SELECT z.* FROM (
							SELECT 
								`a`.*
								,concat(a.studentLastName, ', ', `a`.`studentFirstName`, ' ', if(a.studentMiddleName is not null, concat('', a.studentMiddleName, ''), '')  ) as fullName
								, `c`.`gradeLevelDescription`
								, `b`.`gradeLevelHistoryID`
								, d.dateUpdated
								,`e`.`schoolYearDescription`
								,(CASE
									WHEN `a`.`studentInactiveTag` = 1 THEN 'Inactive'
									WHEN `a`.`studentInactiveTag` = 0 THEN 'Active'
								END) as `studentInactiveTagName`
								,(CASE
									WHEN d.paymentStatus = 0 THEN 	'Not Paid'
									WHEN d.paymentStatus = 1 THEN 	'Paid'	
								END) as `paymentStatusName`
							from student as a
							JOIN gradelevelhistory as b ON b.studentID = a.studentID
							JOIN gradelevel as c ON b.gradelevelID = c.gradelevelID
							JOIN schoolyear as e on e.schoolYearID = b.schoolYearID
							
							
							inner join(
								SELECT studentID, dateUpdated, paymentStatusHistoryID, paymentStatus
									FROM 
										( SELECT studentID, dateUpdated, paymentStatusHistoryID, paymentStatus
											FROM ( SELECT *
												FROM
													paymentstatushistory
												ORDER BY paymentStatusHistoryID DESC
										) as statusHistory
									GROUP BY studentID ) as statHistory
								$innerWHERE
							) AS `d` on `d`.`studentID` = `a`.`studentID`
							
							$where
							order by gradeLevelHistoryID desc
					) as z
				group by studentNumber
				order by $order
				) as x
				limit $data[start], $data[limit]
			")->result_array();
			// $this->db->limit( $data['limit'] ,$data['start'] );
			// $this->db->get()-result_array();
			// LQ();
			
	
	}
	
	public function countAll( $data ,$where = null, $innerWHERE = null, $order = "" ){
	
	if( isset( $data['tableID'] ) AND isset( $data['filter'] ) AND isset( $data[ 'dispValue' ] ) AND $data[ 'dispValue' ] != "All" ){
			// if( $data[ 'filter' ] != 0 || ( $data[ 'tableID' ] >= 6 && $data[ 'dispValue' ] != "All" ) )
			switch( $data['tableID'] ){
				case 1:
						$where	=	"WHERE a.studentLastName LIKE '".$data[ 'dispValue' ]."'";
					break;
				case 2:
						$where	=	"WHERE a.studentFirstName LIKE '".$data[ 'dispValue' ]."'";
					break;
				case 3:
						$where	=	"WHERE a.studentMiddleName LIKE '".$data[ 'dispValue' ]."'";
					break;
				case 4:
						$where	= " WHERE b.gradeLevelID LIKE ".$data['filter'];
					break;
				case 5:
						$where	= " WHERE e.schoolYearID LIKE ".$data['filter'];
					break;
				case 6:
						$where	=	"WHERE d.paymentStatus LIKE ".( $data['filter'] - 1);
						$innerWHERE	=	"WHERE paymentStatus LIKE ".( $data['filter'] - 1);
					break;
				case 7:
						$where	=	"WHERE a.studentInactiveTag LIKE ".( $data['filter'] - 1);
					break;
				case 8:
						$where	=	"WHERE a.studentID LIKE ". $data['filter'];
					break;
			}
		}
		if( isset( $data['sort'] ) ){
				$sort = json_decode( $data['sort'], true )[0];
				$order = $sort[ 'property' ]." ". $sort['direction'];
			}
			else{
				$order = "studentNumber desc";
			}
			return $this->db->query("
				SELECT x.* FROM ( 
					SELECT z.* FROM (
							SELECT 
								`a`.*
								,concat(a.studentLastName, ', ', `a`.`studentFirstName`, ' ', if(a.studentMiddleName is not null, concat('', a.studentMiddleName, ''), '')  ) as fullName
								, `c`.`gradeLevelDescription`
								, `b`.`gradeLevelHistoryID`
								, d.dateUpdated
								,`e`.`schoolYearDescription`
								,(CASE
									WHEN `a`.`studentInactiveTag` = 1 THEN 'Inactive'
									WHEN `a`.`studentInactiveTag` = 0 THEN 'Active'
								END) as `studentInactiveTagName`
								,(CASE
									WHEN d.paymentStatus = 0 THEN 	'Not Paid'
									WHEN d.paymentStatus = 1 THEN 	'Paid'	
								END) as `paymentStatusName`
							from student as a
							JOIN gradelevelhistory as b ON b.studentID = a.studentID
							JOIN gradelevel as c ON b.gradelevelID = c.gradelevelID
							JOIN schoolyear as e on e.schoolYearID = b.schoolYearID
							
							
							inner join(
								SELECT studentID, dateUpdated, paymentStatusHistoryID, paymentStatus
									FROM 
										( SELECT studentID, dateUpdated, paymentStatusHistoryID, paymentStatus
											FROM ( SELECT *
												FROM
													paymentstatushistory
												ORDER BY paymentStatusHistoryID DESC
										) as statusHistory
									GROUP BY studentID ) as statHistory
								$innerWHERE
							) AS `d` on `d`.`studentID` = `a`.`studentID`
							
							$where
							order by gradeLevelHistoryID desc
					) as z
				group by studentNumber
				order by $order
				) as x
			")->result_array();
		// $this->db->select("*");
		// return $this->db->count_all_results("student");
	}
	
	// retrieve data for payment history
	public function retrieveData( $data )
	{
				return	$this->db->query("
				SELECT z.* FROM (
					SELECT 
						`a`.*
						, `c`.`gradeLevelID`
						, `b`.`gradeLevelHistoryID`
						,`d`.`paymentStatus` as  `paymentStatusHistoryID`
						, d.dateUpdated
						,`e`.`schoolYearID`
					from student as a
					JOIN gradelevelhistory as b ON b.studentID = a.studentID
					JOIN gradelevel as c ON b.gradelevelID = c.gradelevelID
					JOIN schoolyear as e on e.schoolYearID = b.schoolYearID
					inner join 
						(
							SELECT `paymentStatus`, `dateUpdated`, `studentID`, `paymentStatusHistoryID`
							FROM `paymentstatushistory`
							order by `paymentStatusHistoryID` DESC
						) AS `d` on `d`.`studentID` = `a`.`studentID`
					
				WHERE `a`.`studentID` LIKE $data[studentID]
					order by gradeLevelHistoryID desc
				) as z
				group by studentNumber
			")->result_array();
	}
	
	public function retrieveDataGradeLevel( $data ){
	// print_r( $data );
		// $id = $data['studentID'];DATE_FORMAT( c.activityDate, '%m/%d/%Y' )
		return	$this->db->query("
			SELECT `b`.`gradeLevelDescription`, `d`.`schoolYearDescription`, DATE_FORMAT( `c`.`dateUpdated`, '%m/%d/%Y') as dateUpdated
				FROM `gradelevel` as `b`
			INNER JOIN `gradelevelhistory` as `c` on `c`.`gradeLevelID` = `b`.`gradeLevelID`
			INNER JOIN `schoolyear` as `d`	on	`d`.`schoolYearID`	=	`c`.`schoolYearID`
				WHERE `c`.`studentID` = $data[studentID] ORDER BY `c`.`gradeLevelHistoryID` DESC
		")->result_array();
	}
	
	public function delete( $data ){
		// $num = $this->db->select( 'enrolledstudents', array('studentID' => $data['studentID']) );
		$this->db->where( 'studentID', $data['studentID'] );
		$this->db->get('enrolledstudents');
		if( $this->db->affected_rows() <= 0 ){
			$this->_logEntry( "delete" );
			$this->db->delete( 'student', array( 'studentID' => $data['studentID'] ) );
			$this->db->delete( 'gradelevelhistory', array( 'studentID' => $data['studentID'] ) );
			$this->db->delete( 'paymentstatushistory', array( 'studentID' => $data['studentID'] ) );
			return true;
			
			
		}else{
			return false;
		}	
    }
	
	// Filters for comboBox
	public function filterFullName( $str ){
		$data = getData();
		$this->db->select("a.studentID as id, $str as name");
		$this->db->from( "student as a" );
		
		if( isset( $data[ 'query' ] ) )
		$this->db->like( $str ,$data[ 'query' ] , 'both');
		// print_r( $str );
		
		// if( $str['filterBy'] == 1 ){
			// if( isset( $str['query'] ) ) $this->db->like( 'studentLastName', $str['query'], 'both' );
		// }
	
		$this->db->group_by( $str );
		return $this->db->get()->result_array();
	}
	
	// Filters for comboBox
	public function getStudentNumber(){
		$data = getData();
		$this->db->select("a.studentID as id, a.studentNumber as name");
		$this->db->from( "student as a" );
		if( isset( $data[ 'query' ] ) )
		$this->db->like( "a.studentNumber" ,$data[ 'query' ] ,'both' );
		return $this->db->get()->result_array();
	}
	
	public function filterGradeLevel(){
		$data = getData();
		$this->db->select( "a.gradeLevelID as id, a.gradeLevelDescription as name" );
		$this->db->from( "gradelevel as a" );
		if( isset( $data[ 'query' ] ) )
		$this->db->like( "a.gradeLevelDescription" ,$data[ 'query' ] , 'both');
		return $this->db->get()->result_array();
	}
	public function filterSchoolYears(){
		$data = getData();
		$this->db->select( "a.schoolYearID as id, a.schoolYearDescription as name" );
		$this->db->from( "schoolyear as a" );
		if( isset( $data[ 'query' ] ) )
		$this->db->like( "a.schoolYearDescription" ,$data[ 'query' ] , 'both');
		return $this->db->get()->result_array();
	}
	
	// Validations
	
	public function checkIfNameExist( $data = null ){
		$this->db->where('studentFirstName',$data[ 'studentFirstName' ]);
		$this->db->where('studentMiddleName',$data[ 'studentMiddleName' ]);
		$this->db->where('studentLastName',$data[ 'studentLastName' ]);
		$this->db->limit(1);
		$this->db->get( 'student' )->result_array();
		return ( $this->db->affected_rows() > 0) ? true : false;
		
	}
	
	public function checkGradeLevelUpdate( $data ){
	
		$this->db->where(
			array(
				'gradeLevelID'	=> 	$data['studentGradeLevelHistoryID']
				,'schoolYearID'	=> 	$data[ 'schoolYear' ]
				,'updatedByID'	=> 	$this->session->userdata( 'BGSUID' )
				,'studentID'	=>	$data['studentID']
			)
		);
		$this->db->get( "gradelevelhistory" );
		return ( $this->db->affected_rows() > 0 ) ? true : false;
	}
	
	public function checkPaymentHistoryUpdate( $data ){
		
		$this->db->where(
			array(
					'updatedByID'		=>	$this->session->userdata( 'BGSUID' )
					,'studentID'		=>	$data['studentID']
					,'paymentStatus'	=>	$data[ 'paymentStatusHistoryID' ]
			)
		);
		$this->db->get( "paymentstatushistory" );
		return ( $this->db->affected_rows() > 0 ) ? true : false;
	}
	
}	