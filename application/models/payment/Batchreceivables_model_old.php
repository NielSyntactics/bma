<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Batchreceivables_model extends CI_Model {
	
	public function __construct(){
		parent::__construct();
		$this->paymentCategory = array(
			'cateringTotalReceivable'
			,'charityTotalReceivable'
			,'extracurricularTotalReceivable'
			,'christmasTotalReceivable'
			,'familyDayTotalReceivable'
			,'pictureTotalReceivable'
			,'gradFeeTotalReceivable'
			,'scoutingTotalReceivable'
			,'othersTotalReceivable'
			,'nutritionTotalReceivable'
			,'movingUpTotalReceivable'
		);
	}

	public function getReferenceNo(){
		$this->db->select( "LPAD( IFNULL( MAX( batchReceivableNo ), 0 ) + 1 , 5, '0' ) as batchReceivableNo" );
		$data = $this->db->get('batchreceivables')->result_array();
		if( count( $data ) > 0 ) return $data[0]['batchReceivableNo'];
		else return '00001';
	}
	
	public function getSchoolYear( $params, $type = 1 ){
		if( $type == 1 ) $this->db->select( " CONCAT( schoolYearStart, ' - ', schoolYearStart + 1 ) as schoolYearStart, schoolYearID " );
		else $this->db->select( " CONCAT( schoolYearStart, ' - ', schoolYearStart + 1 ) as name, schoolYearID as id " );
		if( isset( $params['query'] ) ) $this->db->like( "CONCAT( schoolYearStart, ' - ', schoolYearStart + 1 )", $params['query'], 'both' );
		$this->db->order_by( 'schoolYearStart', 'DESC' );
		return $this->db->get('schoolyear')->result_array();
	}
	
	public function getGradeLevel( $params ){
		$this->db->select( 'gradeLevelID, gradeLevelName' );
		if( isset( $params['query'] ) ) $this->db->like( 'gradeLevelName', $params['query'], 'both' );
		$this->db->order_by( 'gradeLevelName', 'ASC' );
		return $this->db->get( 'gradelevel' )->result_array();
	}
	
	public function getStudents( $params ){
		$this->db->select( 'a.studentID, a.studentName, b.gradeLevelName' );
		$this->db->order_by( 'a.studentName', 'asc' );
		if( (int)$params['gradeLevelID'] > 0 ) $this->db->where( 'b.gradeLevelID', (int)$params['gradeLevelID'] );
		$this->db->join( 'gradelevel as b', 'b.gradeLevelID = a.gradeLevelID', 'left outer' );
		$this->db->where( 'studentStatus', 0 );
		return $this->db->get( 'student as a' )->result_array();
	}
	
	public function getBRSTudents( $params ){
		$this->db->select( "
			a.studentID
			,a.studentName
			,b.gradeLevelName
			,SUM( IFNULL( f.batchReceivableAmount, 0 ) ) as totalReceivables
			,(CASE
				WHEN d.batchReceivableCategoryID = 1 THEN SUM( IFNULL( e.catering, 0 ) ) /* Catering */
				WHEN d.batchReceivableCategoryID = 2 THEN SUM( IFNULL( e.charity, 0 ) ) /* Charity */
				WHEN d.batchReceivableCategoryID = 3 THEN SUM( IFNULL( e.extraCurricular, 0 ) ) /* Extra-Curricular */
				WHEN d.batchReceivableCategoryID = 4 THEN SUM( IFNULL( e.christmas, 0 ) ) /* Christmas */
				WHEN d.batchReceivableCategoryID = 5 THEN SUM( IFNULL( e.familyDay, 0 ) ) /* Family Day */
				WHEN d.batchReceivableCategoryID = 6 THEN SUM( IFNULL( e.picture, 0 ) ) /* Picture */
				WHEN d.batchReceivableCategoryID = 7 THEN SUM( IFNULL( e.gradFee, 0 ) ) /* Grad Fee */
				WHEN d.batchReceivableCategoryID = 8 THEN SUM( IFNULL( e.scouting, 0 ) ) /* Scouting/Camping */
				WHEN d.batchReceivableCategoryID = 9 THEN SUM( IFNULL( e.others, 0 ) ) /* Scouting/Camping */
			END) as totalPayment
		" );
		$this->db->order_by( 'a.studentName', 'asc' );
		$this->db->where( 'c.batchReceivableID', (int)$params['batchReceivableID'] );
		$this->db->join( 'student as a', 'a.studentID = c.studentID', 'left outer' );
		$this->db->join( 'gradelevel as b', 'b.gradeLevelID = a.gradeLevelID', 'left outer' );
		$this->db->join( 'batchreceivables as d', 'd.batchReceivableID = c.batchReceivableID', 'left outer' );
		$this->db->join( 'payments as e', 'e.studentID = c.studentID AND e.schoolYearID = d.schoolYearID', 'left outer' );
		$this->db->join( "(
			SELECT 
				b.studentID
				,a.schoolYearID
				,a.batchReceivableCategoryID
				,a.batchReceivableAmount
				,a.batchReceivableID
			FROM
				batchreceivables as a
			LEFT OUTER JOIN receivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
		) as f", 'f.studentID = c.studentID AND f.schoolYearID = d.schoolYearID AND f.batchReceivableCategoryID = d.batchReceivableCategoryID AND f.batchReceivableID != d.batchReceivableID', 'left outer' );
		$this->db->group_by( 'c.studentID' );
		$this->db->order_by( 'a.studentName', 'asc' );
		return $this->db->get( 'receivables as c' )->result_array();
	}
	
	public function getHistory( $params ){
		$this->db->select( "
			(CASE
				WHEN a.batchReceivableCategoryID = 1 THEN 'Catering'
				WHEN a.batchReceivableCategoryID = 2 THEN 'Charity'
				WHEN a.batchReceivableCategoryID = 3 THEN 'Extra-Curricular'
				WHEN a.batchReceivableCategoryID = 4 THEN 'Christmas'
				WHEN a.batchReceivableCategoryID = 5 THEN 'Family Day'
				WHEN a.batchReceivableCategoryID = 6 THEN 'Picture'
				WHEN a.batchReceivableCategoryID = 7 THEN 'Grad Fee'
				WHEN a.batchReceivableCategoryID = 8 THEN 'Scouting/Camping'
				WHEN a.batchReceivableCategoryID = 9 THEN 'Others'
				WHEN a.batchReceivableCategoryID = 10 THEN 'Nutrition Day'
				WHEN a.batchReceivableCategoryID = 11 THEN 'Moving Up/Recognition'
			END) as batchReceivableCategory
			,CONCAT( b.schoolYearStart, ' - ', b.schoolYearStart + 1 ) as schoolYearStart
			,a.batchReceivableDate
			,a.batchReceivableAmount
			,a.batchReceivableRemarks
			,a.batchReceivableID
			,d.studentName
		" );
		$this->db->join( 'receivables as c', 'c.batchReceivableID = a.batchReceivableID', 'left outer' );
		$this->db->join( 'student as d', 'd.studentID = c.studentID', 'left outer' );
		$this->db->join( 'schoolyear as b', 'b.schoolYearID = a.schoolYearID', 'left outer' );
		$this->db->order_by( 'd.studentName asc' );
		if( isset( $params['sBy'] ) && ( isset( $params['search'] ) || ( isset( $params['sdate'] ) && isset( $params['edate'] ) ) ) ){
			$sBy = (int)$params['sBy'];
			$search = (int)$params['search'];
			if( $sBy == 1 ){ /* batchReceivableCategoryID */
				if( $search > 0 ) $this->db->where( 'a.batchReceivableCategoryID', $search );
			}
			else if( $sBy == 2 ){ /* school year */
				if( $search > 0 ) $this->db->where( 'a.schoolYearID', $search );
			}
			else if( $sBy == 3 ){
				if( $params['sdate'] && $params['edate'] ) $this->db->where( "( a.batchReceivableDate BETWEEN '$params[sdate]' AND '$params[edate]' )" );
			}
			else if( $sBy == 4 ){
				if( $search > 0 ) $this->db->where( 'c.studentID', $search );
			}
		}
		if( !$params['cnt'] ) return $this->db->get( 'batchreceivables as a' )->result_array();
		else{
			$this->db->from( 'batchreceivables as a' );
			return $this->db->count_all_results();
		}
	}
	
	public function getModified( $params ){
		$this->db->select( 'batchReceivableModifiedOn' );
		$this->db->where( 'batchReceivableID', (int)$params['batchReceivableID'] );
		$data = $this->db->get( 'batchreceivables' )->result_array();
		if( count( $data ) > 0 ){
			if( $data[0]['batchReceivableModifiedOn'] != $params['batchReceivableModifiedOn'] ) return true;
			else return false;
		}
		else return false;
	}
	
	public function saveBatchReceivable( $params ){
		$params['batchReceivableModifiedBy'] = $this->session->userdata('BMAPSUID');
		$params['batchReceivableModifiedOn'] = date('Y-m-d H:i:s');
		if( (int)$params['onEdit'] ){
			$this->db->where( 'batchReceivableID', (int)$params['batchReceivableID'] );
			$this->db->update( 'batchreceivables', unsetParams( $params, 'batchreceivables' ) );
			return $params['batchReceivableID'];
		}
		else{
			$params['batchReceivableAddedBy'] = $this->session->userdata('BMAPSUID');
			$params['batchReceivableAddedOn'] = date('Y-m-d H:i:s');
			$this->db->insert( 'batchreceivables', unsetParams( $params, 'batchreceivables' ) );
			return $this->db->insert_id();
		}
	}
	
	public function deleteReceivable( $batchReceivableID ){
		$this->db->where( 'batchReceivableID', $batchReceivableID );
		$this->db->delete( 'receivables' );
	}
	
	public function saveBatchReceivableDetails( $receivables ){
		$this->db->insert_batch( 'receivables', $receivables );
	}
	
	public function retrieveData( $params ){
		$this->db->select( "*, LPAD( batchReceivableNo , 5, '0' ) as batchReceivableNo" );
		$this->db->where( 'batchReceivableID', (int)$params['batchReceivableID'] );
		$data = $this->db->get( 'batchreceivables' )->result_array();
		if( count( $data ) > 0 ) return $data;
		else return false;
	}
	
	public function checkIfExists( $params ){
		$this->db->where( 'batchReceivableID', (int)$params['batchReceivableID'] );
		$data = $this->db->get( 'batchreceivables' )->result_array();
		if( count( $data ) > 0 ) return true;
		else return false;
	}
	
	public function deleteRecord( $params ){
		$this->db->where( 'batchReceivableID', (int)$params['batchReceivableID'] );
		$this->db->delete( 'batchreceivables' );
	}

	public function getAccountCardRecords( $categoryID ){
		$field = $this->paymentCategory[ $categoryID-1 ];
		$this->db->select( 'GROUP_CONCAT( studentID ) as studentID, ' . $field . ' as batchReceivableAmount, dateCreated, accountCardSchoolYear' );
		$this->db->where( "$field > 0" );
		$this->db->group_by( $field . ', accountCardSchoolYear' );
		$this->db->order_by( 'dateCreated', 'desc' );
		return $this->db->get( 'accountcard' )->result_array();
	}

	public function addBatchReceivable( $data ){
		$this->db->insert( 'batchreceivables', $data );
		return $this->db->insert_id();
	}

	public function saveReceivableStudentsList( $data ){
		$this->db->insert_batch( 'receivables', $data );
	}

	public function getStudentsFilter( $params ){
		$this->db->select( 'c.studentID as id, c.studentName as name' );
		$this->db->join( 'batchreceivables as b', 'b.batchReceivableID = a.batchReceivableID' );
		$this->db->join( 'student as c', 'c.studentID = a.studentID', 'left outer' );
		$this->db->group_by( 'a.studentID' );
		$this->db->order_by( 'c.studentName', 'ASC' );
		if( isset( $params['query'] ) ) $this->db->like( 'c.studentName', $params['query'], 'both' );
		return $this->db->get( 'receivables as a' )->result_array();
	}
	
}