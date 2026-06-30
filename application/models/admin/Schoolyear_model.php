<?php
/** User settings module
  * [Developer]
  * Developer: Mark Christian Lambino
  * Date Created: Sep. 29, 2021
  * Date Finished: Sep. 29, 2021
  
  * [Database]
	schoolyear
	
  * [Description]
	This module allows the authorized administrators to set (add, edit or delete) school years that will be used in displaying and printing the list of every module..
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Schoolyear_model extends CI_Model {
	
	public function viewAll( $params ){
		$this->db->get( 'schoolyear' )->result_array();
		return $params['cnt'] ? $this->db->count_all_results() : $this->db->get('schoolyear')->result_array();
	}
	
	public function saveForm( $data ){
		$onEdit = (int)$data['onEdit'];
		if( $onEdit ){
			$this->db->where( 'schoolYearID', (int)$data['schoolYearID'] );
			$this->db->update( 'schoolyear', unsetParams( $data, 'schoolyear' ) );
			return (int)$data['schoolYearID'];
		}
		else{
			unset( $data['schoolYearID'] );
			$this->db->insert( 'schoolyear', unsetParams( $data, 'schoolyear' ) );
			return $this->db->insert_id();
		}
	}
	
	public function retrieveRecords( $data ){
		$idSY = (int)$data['schoolYearID'];
		$this->db->select( 'schoolyear.*, (IFNULL(brSY, 0) + IFNULL(paymentSY, 0)) AS usedCount' );
		$this->db->join( '(SELECT COUNT(*) AS brSY, batchreceivables.schoolYearID FROM batchreceivables WHERE batchreceivables.schoolYearID = ' . $idSY . ' ) as batchreceivables', 'batchreceivables.schoolYearID = schoolyear.schoolYearID', 'left' );
		$this->db->join( '(SELECT COUNT(*) AS paymentSY, payments.schoolYearID FROM payments WHERE schoolYearID = ' . $idSY . ' ) as payments', 'payments.schoolYearID = schoolyear.schoolYearID', 'left' );
		$this->db->where( 'schoolyear.schoolYearID', (int)$data['schoolYearID'] );
		return $this->db->get( 'schoolyear' )->result_array();
	}
	
	public function deleteRecord( $params ){
        $first = $this->isUsed('schoolYearID', (int)$params['schoolYearID'], 'batchreceivables');
        $second = $this->isUsed('schoolYearID', (int)$params['schoolYearID'], 'payments');
        $total = $first+$second;
        if ($total > 0) return false;

		$this->db->where( 'schoolYearID', (int)$params['schoolYearID'] );
		return $this->db->delete( 'schoolyear' );
	}

	function disableEdit( $params )
	{
		$one = $this->isUsed('schoolYearID', (int)$params['schoolYearID'], 'batchreceivables');
        $two = $this->isUsed('schoolYearID', (int)$params['schoolYearID'], 'payments');
        return $one + $two;
	}
    
    function isUsed($field, $data, $table)
    {
        $this->db->select('count(*) as count')->where($field, $data);
        return $this->db->get($table)->row()->count;
    }
}