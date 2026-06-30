<?php
/** School year settings module
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
class Schoolyear extends CI_Controller {
	
	/* class constructor
	 * initialization of classes to be loaded are all here(libraries not included in the auto load config)
	*/
	public function __construct(){
		parent::__construct();
		setHeader( 'admin/Schoolyear_model' );
	}
	
	public function retrieveSearch(){
		$params = getData();
		$view = array();
		if( isset( $params['by'] ) ){			
			if( (int)$params['by'] == 1 ){
				$view = $this->model->getUserDetails( $params );
			}
			elseif( (int)$params['by'] == 2 ){
				$view = array(
					0 => array(
						'id' => 1
						,'name' => 'Administrator'
					)
					,1 => array(
						'id' => 2
						,'name' => 'Secretary'
					)
					,2 => array(
						'id' => 3
						,'name' => 'User'
					)
				);
			}
			elseif( (int)$params['by'] == 3 ){
				$view = $this->model->getUserDetails( $params );
			}
			elseif( (int)$params['by'] == 4 ){
				$view = array(
					0 => array(
						'id' => 0
						,'name' => 'Active'
					)
					,1 => array(
						'id' => 2
						,'name' => 'Inactive'
					)
				);
			}
		}
		array_unshift( $view, array(
			'id' => -1
			,'name' => 'All'
		) );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					,'total' => count( $view )
				)
			)
		);
	}
	
	public function getSYListing(){
		$params = getData();
		$params['pdf'] = false; $params['cnt'] = false;
		$view = $this->model->viewAll( $params );
		$params['pdf'] = true; $params['cnt'] = true;
		$countAll = $this->model->viewAll( $params );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					,'total' => $countAll
				)
			)
		);
	}
	
	public function saveForm(){
		$data = getData();
		$onEdit = ( int )$data['onEdit'];
		$success = true;

		/* Check if username already exists */
		if( _checkData(
			array(
				'table' => 'schoolyear'
				,'field' => 'schoolYearStart'
				,'value' => $data['schoolYearStart']
				,'exwhere' => 'schoolYearID NOT IN(' . (int)$data['schoolYearID'] . ')'
			)
		) ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 1
					)
				)
			);
		}
		
		if( $onEdit ){
			/* check if user still exists */
			if( !_checkData(
				array(
					'table' => 'schoolyear'
					,'field' => 'schoolYearID'
					,'value' => (int)$data['schoolYearID']
				)
			) ){
				die(
					json_encode(
						array(
							'success' => true
							,'match' => 2
						)
					)
				);
			}
			
			$desc = 'Modified ' . $data['schoolYearStart'] . '.';
		} else { $desc = 'Added new school year, ' . $data['schoolYearStart']; }
		
		$this->db->trans_begin();
	 	$id = $this->model->saveForm( $data );
		
		setLogs(
			array(
				'description' => $desc
				,'idmodule' => $data['idmodule']
				,'schoolYearID' => $this->userID 
			)
		);
		
		if( $this->db->trans_status() === FALSE ){
			$this->db->trans_rollback();
			$success = false;
		}
		else{
			$this->db->trans_commit();
		}
		
		die(
			json_encode(
				array(
					'success' => $success
					,'match' => 0
				)
			)
		);
	}
	
	public function retrieveRecord(){
		$params = getData();
		$ret = $this->model->retrieveRecords( $params );
		if( count( $ret ) == 0 ){
			die(
				json_encode(
					array(
						'success' => true
						,'view' => array()
						,'match' => 1
					)
				)
			);
		}
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $ret
					,'match' => 0
				)
			)
		);
	}	
	
	public function deleteRecord(){
		$params = getData();
		$success = true;

		if( !_checkData(
			array(
				'table' => 'schoolyear'
				,'field' => 'schoolYearID'
				,'value' => (int)$params['schoolYearID']
			)
		) ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 1
					)
				)
			);
		}
		
		$this->db->trans_begin();
		
		/* delete user record */
		$isDeleted = $this->model->deleteRecord( $params );
		
		if ( !$isDeleted ) {
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 2
					)
				)
			);
		}
		
		setLogs(
			array(
				'description' => 'Deleted ' . $params['schoolYearStart']
				,'idmodule' => $params['idmodule']
				,'bmapsUID' => $this->userID
			)
		);
		if( $this->db->trans_status() === FALSE ){
			$this->db->trans_rollback();
			$success = false;
		}
		else{
			$this->db->trans_commit();
		}		
		
		die(
			json_encode(
				array(
					'success' => $success
					,'match' => 0
				)
			)
		);
	}
}