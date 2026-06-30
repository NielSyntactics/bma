<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Archive_model extends CI_Model {
  
	public function __construct()
    {
        parent::__construct();
				$this->load->database(); 
    }
	
	public function getSchoolYears( $params ) {
		$date = date( 'Y' ) + 2;
		$where = "";
		if( isset( $params[ 'filterType' ] ) && $params[ 'filterType' ] > 0 ){
			$where = " WHERE a.schoolyearID = ". $params[ 'filterType' ] ."";
		}
		return $this->db->query("
				SELECT a.* FROM(
				SELECT 
					a.closingDetails
					,a.archiveDetails
					,a.status
					,a.schoolyearID
					,a.schoolYearDescription
					,a.trig
					,(CASE 
						WHEN a.closeShow = 1 AND a.trig = 1 THEN
							IF( @btn = 1, ((@btn := 0) + 1), 0 )
						ELSE
							a.closeShow 
					END) AS closeShow
					,(CASE 
						WHEN a.btnShow = 1 AND a.trig = 2 THEN
							IF( @btnArchive = 1, ((@btnArchive := 0) + 1), 0 )
						ELSE
							a.btnShow 
					END) AS btnShow
				FROM(
					SELECT 
						a.closingDetails
						,a.archiveDetails
						,a.status
						,a.schoolyearID
						,a.schoolYearDescription
						,a.trig
						,(CASE 
							WHEN a.endOfSchoolYear <= ". ($date + 2) ." THEN
								1
							ELSE
								0
						END) AS closeShow
						,(CASE 
							WHEN a.endOfSchoolYear <= ". $date ." THEN
								1
							ELSE
								0
						END) AS btnShow
						,a.endOfSchoolYear
					FROM(SELECT  
						(CASE
							WHEN
								IFNULL(closedBy, 0) != 0
							THEN
								CONCAT('Closed by ',
										b.name,
										' on ',
										a.closingTimestamp)
							ELSE ''
						END) AS closingDetails,
						(CASE
							WHEN
								IFNULL(archivedBy, 0) != 0
							THEN
								CONCAT('Archived by ',
										b.name,
										' on ',
										a.closingTimestamp)
							ELSE ''
						END) AS archiveDetails,
						a.status,
						a.schoolyearID,
						a.schoolYearDescription,
						a.trig,
						SUBSTRING(a.schoolYearDescription, 6) as endOfSchoolYear
					FROM
						(SELECT 
							a.schoolyearID,
								a.schoolYearDescription,
								a.closedBy,
								a.archivedBy,
								a.closingTimestamp,
								(CASE 
									WHEN IFNULL(archivedBy, 0) != 0 THEN 'Archived'
									WHEN IFNULL(closedBy, 0) != 0 THEN 'Closed'
									ELSE 'Active'
								END) AS status,
								(CASE
									WHEN IFNULL(archivedBy, 0) != 0 THEN 3
									WHEN IFNULL(closedBy, 0) != 0 THEN 2
									ELSE 1
								END) AS trig
						FROM
							schoolyear AS a) AS a
							LEFT OUTER JOIN
						(SELECT 
							CONCAT(bgsUfirstname, ' ', bgsUlastname) AS name, bgsUID
						FROM
							bgsu) AS b ON (b.bgsUID IN (a.closedBy , a.archivedBy))
						ORDER BY SUBSTRING(a.schoolYearDescription, 6) DESC) as a
						ORDER BY a.endOfSchoolYear ASC) as a
					
					LEFT OUTER JOIN( SELECT @btn := 1, @btnArchive := 1 ) as b on 1 = 1
					ORDER BY a.endOfSchoolYear DESC) as a
					$where"
			, false)->result_array();
LQ();
	}

	public function getFilter( $params ) {
		$this->db->select( "schoolYearID AS id, schoolYearDescription as name" );
		$this->db->order_by( "SUBSTRING(schoolYearDescription, 6) DESC" );
		return $this->db->get( "schoolyear" )->result_array();
	}

	public function checkSchoolYear( $params ){
		/* check if closed already */
		if( $params[ 'closingType' ] == 1 ){
			$this->db->where( 'closedBy > ', 0 );
		}
		else if(  $params[ 'closingType' ] == 2  ){
			$this->db->where( 'archivedBy > ', 0 );
		}
		$this->db->where( 'schoolyearID', $params[ 'schoolyearID' ] );
		$this->db->get( 'schoolyear' )->result_array();
		return ( $this->db->affected_rows() > 0 ? true : false );
	}

	public function updateSchoolYear( $params ){
		$arr = array();
		if( $params[ 'closingType' ] == 1 ){
			$arr = array(
				'closedBy' => $this->bgsUID
				,'closingTimestamp' => date("Y-m-d H:i:s")
				);
		}
		else if(  $params[ 'closingType' ] == 2  ){
			$arr = array(
				'archivedBy' => $this->bgsUID
				,'archivingTimestamp' => date("Y-m-d H:i:s")
				);
		}

		$this->db->where( 'schoolyearID', $params[ 'schoolyearID' ] );
		$this->db->update( 'schoolyear', $arr );

	}
	
}	