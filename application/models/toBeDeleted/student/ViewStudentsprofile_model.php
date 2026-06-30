<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class ViewStudentsprofile_model extends CI_Model {
  
	public function __construct()
    {
        parent::__construct();
				$this->load->database(); 
    }
	
	
	public function retrieveData(){
		 return $this->db->query("
				SELECT z.* FROM (
					SELECT 
						`a`.*
						,concat(a.studentLastName, ', ', `a`.`studentFirstName`, ' ', a.studentMiddleName) as fullName
						, `c`.`gradeLevelDescription`
						, `b`.`gradeLevelHistoryID`
						, d.dateUpdated
						,`e`.`schoolYearDescription`
						,(CASE
							WHEN `a`.`studentInactiveTag` = 1 THEN 'Inactive'
							WHEN `a`.`studentInactiveTag` = 0 THEN 'Active'
						END) as `studentInactiveTagName`
						,(CASE
							WHEN 	`d`.`paymentStatus` = 0 THEN 	'Not Paid'
							WHEN 	`d`.`paymentStatus` = 1 THEN 	'Paid'	
						END) as `paymentStatusHistoryID`
					from student as a
					JOIN gradelevelhistory as b ON b.studentID = a.studentID
					JOIN gradelevel as c ON b.gradelevelID = c.gradelevelID
					JOIN schoolyear as e on e.schoolYearID = b.schoolYearID
					INNER JOIN bgsu as x on a.studentID = x.studentID
					
					inner join 
						(
							SELECT `paymentStatus`, `dateUpdated`, `studentID`, `paymentStatusHistoryID`
							FROM `paymentstatushistory`
							order by `paymentStatusHistoryID` DESC
						) AS `d` on `d`.`studentID` = `a`.`studentID`
					WHERE x.bgsUID LIKE '". $this->session->userdata( 'BGSUID' ) ."'
					order by gradeLevelHistoryID desc
				) as z
				group by studentNumber
				order by fullName desc
			")->result_array();
	}
	
}	