<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Studentsprofile_model extends CI_Model {
  
	public function __construct()
    {
        parent::__construct();
				$this->load->database(); 
    }
	
	public function retrieveData(){
		return $this->db->query("
			SELECT `a`.*
				,`b`.`gradeLevelDescription`
				,`b`.`gradeLevelID`
				,`c`.`schoolYearDescription`
				,(
					CASE
						WHEN 	`d`.`paymentStatus` = 0 THEN 	'Not Paid'
						WHEN 	`d`.`paymentStatus` = 1 THEN 	'Paid'	
					END
				) as `paymentStatusHistoryID`
				,`c`.`schoolYearID`
				,`a`.`studentInactiveTag`
				FROM `student` as `a` 
					inner join `gradelevelhistory` as `g` on `g`.`studentID` = `a`.`studentID`
					inner join `gradelevel` as `b` on `b`.`gradeLevelID` = `g`.`gradeLevelID`
					inner join `schoolyear` as `c` on `c`.`schoolYearID` = `g`.`schoolYearID`
					inner join 
						(
							SELECT `paymentStatus`, `dateUpdated`, `studentID`, `paymentStatusHistoryID`
							FROM `paymentstatushistory` as `d`
							order by `dateUpdated` desc, `paymentStatusHistoryID` DESC
						) AS `d` on `d`.`studentID` = `a`.`studentID`
				WHERE `a`.`studentID` LIKE '". $this->session->userdata( 'BGSUID' ) ."'
			group by `a`.`studentID`
			limit 1
		")->result_array();

	}
	
}	