<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Standards extends CI_Controller {
	/* Class constructor */
	public function __construct(){
		parent::__construct();
		setHeader( 'standards/Standards_model' );
	}	
	
	public function getIDmodule(){
		$data = getData();
		$view = $this->model->getIDmodule( $data );
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
				)
			)
		);
	}
	
	public function getStandardCombo(){
		$data = getData();
		$view = array();
		
		if( $data['type'] == 'schoolyear' ){
			/* retrieve school years */
			$view = $this->model->getSchoolYear( $data );
			if( isset( $data['hasQuick'] ) ){
				array_unshift( $view, array(
					'id' => 0
					,'name' => '<font color=grey>Add a School Year...</font>'
				) );
			}
		}
		else if( $data['type'] == 'gradelevel' ){
			/* retrieve grade level */
			$view = $this->model->getGradeLevel( $data );
		}
		else if( $data['type'] == 'students' ){
			/* retrieve students record */
			$view = $this->model->getStudentsRecord( $data );
		}
		else if( $data['type'] == 'activity type' ){
			$view = $this->model->getActivityType( $data );
			if( isset( $data['hasQuick'] ) ){
				array_unshift( $view, array(
					'id' => 0
					,'name' => '<font color=grey>Add an Activity Type...</font>'
				) );
			}
		}
		else if( $data['type'] == 'subject' ){
			$view = $this->model->getSubjects( $data );
			if( isset( $data['hasQuick'] ) ){
				array_unshift( $view, array(
					'id' => 0
					,'name' => '<font color=grey>Add a Subject...</font>'
				) );
			}
		}
		if( isset( $data['hasAll'] ) ){
			array_unshift( $view, array(
				'id' => -1
				,'name' => 'All'
			) );
		}
		
		print json_encode(
			array ( 
				'success' 	=> true
				,'view' 	=> $view
				,'total' 	=> count( ( $data['type'] == 'item' )? $count : $view )
			)
		);  
	}
	
	public function saveDefaultType(){
		$data = getData();
		$id   = $this->model->saveDefaultType( unsetParams( $data, 'defaultinformation' ) );
		die( json_encode( array('success'=>true, 'id'=>$id ) ) );	
	}
	
	public function searchCombo(){
		$data    = getData();
		$params  = array();
		$params['query'] = $data['query'];
		
		if( isset( $data['customQuery'] ) && $data['customQuery'] ){
			$params['subFilter'] = $data['subFilter'];
			$this->load->model( $data['customQuery'].'_model', 'module' );  
			$view = $this->module->customizeSearchCombo( $params );
			// LQ();
		}
		else{
			$view = $this->model->searchCombo( $params );
		}
		
		print json_encode( array( 'success'=>true, 'view'=>$view ) );
	}
	
	public function listPDF(){
		$data 		    = getData();
		$columnArray    = json_decode( $data['columnArray'], true );
		$params			= array();
		
		if( ((int)$data['hasCustomFilter']) ){
			$filters        = json_decode( $data['filters'], true );
			foreach( $filters AS $key => $value ){
				$params[ $key ] = $value;
			}
		}
		else if( isset( $data['filters'] ) ){
			$filters        = json_decode( $data['filters'], true );
			$count 			= count( $filters ) / 2;
			
			for( $x=0; $x<$count; $x++ ){
				for( $y=0; $y<2; $y++ ){
					if( $y%2 == 0 ){
						$params['subFilter'.$x] = $filters[$y + ( 2 * $x )]['v2'];
					}
					else{
						$params['query'.$x]		= $filters[$y + ( 2 * $x )]['v2'];
					}
				}
			}
		}
		
		$params['pdf'] = true;
		$params['cnt'] = isset( $params['cnt'] ) ? ($params['cnt'] > 0 ? $params['cnt'] : count($params['cnt']) ) : false;
		
		$this->load->model( $data['folder'].'/'.$data['moduleName'].'_model', 'module' );  
		if( isset($params[0]) ){
			$params = $params[0];
		}
		$view = $this->module->viewAll( $params );
		
		
		$config = array(
					'file_name'		=> $data['title'].''
					,'folder_name' 	=> $data['folder']
					,'records' 		=> $view
					,'header' 		=> $columnArray
					,'orientation'  => $data['orientation']
				);
		
		generateTcpdf( $config );
	}
	
	public function listExcel(){
		$data 		    = getData();
		$headerArray    = json_decode( $data['headerArray'], true );
		$dIndexArray    = json_decode( $data['dIndexArray'], true );
		$params			= array();
		$filters = null;
		if( ((int)$data['hasCustomFilter']) ){
			$filters        = json_decode( $data['filters'], true );
			foreach( $filters AS $key => $value ){
				$params[ $key ] = $value;
			}
		}
		else if( isset( $data['filters'] ) ){
			$filters        = json_decode( $data['filters'], true );
			$count 			= count( $filters ) / 2;
			
			for( $x=0; $x<$count; $x++ ){
				for( $y=0; $y<2; $y++ ){
					if( $y%2 == 0 ){
						$params['subFilter'.$x] = $filters[$y + ( 2 * $x )]['v2'];
					}
					else{
						$params['query'.$x]		= $filters[$y + ( 2 * $x )]['v2'];
					}
				}
			}
		}
		
		$params['pdf'] = true;
		$this->load->model( $data['folder'].'/'.$data['moduleName'].'_model', 'module' ); 
		if( isset($params[0]) ){
			$params = $params[0];
			$params['pdf'] = true;
			$params['_excel'] = true;
		} 
		$view = $this->module->viewAll( $params );
		
		$csvarray[] = array( 'title' => $data['title'].'' );
		$csvarray[] = array( 'space' => '' );
		
		if( ((int)$data['hasCustomFilter']) ){
			$hasCustomFilter = null;
			// foreach( $filters[0] AS $key => $value ){
			// 	if( !is_numeric( $value )){
			// 		if(strtotime($value)){
			// 			$csvarray[] = array( ''.$key.'' => date('m/d/Y',strtotime($value)) );
			// 			// $hasCustomFilter[$key] = date('m/d/Y',strtotime($value));
			// 		}
			// 		else{
			// 			$csvarray[] = array( ''.$key.'' => $value );
			// 			// $csvarray[] = array( 'space' => '' );
			// 		}
			// 	}
			// }
			$filters = $filters[0];
			$csvarray[] = array(
				's' => $filters['disp_sBy'].' : '.$filters['disp_s']
			);

			$csvarray[] = array(
				's' => 'Date Range: '.date('m/d/Y',strtotime($filters['sdate'])).' - '.date('m/d/Y',strtotime($filters['edate']))
			);
			// $csvarray[] = $hasCustomFilter;
		}

		$csvarray[] = array( 'space' => '' );
		
		$csvarray[] = $headerArray[0];
		
		foreach( $view as $row ){
			$tempArray = array();
			foreach( $dIndexArray[0] as $key => $index ){
				$tempArray[$key] = $row[$index];
			}
			$csvarray[] = $tempArray;
		}
		
		writeCsvFile(
			array(
				'csvarray' 	 => $csvarray
				,'title' 	 => $data['title'].''
				,'directory' => $data['folder']
			)
		);
	}
	
	public function download( $title, $folder ){
		force_download(
			array(
				'title'      => $title
				,'directory' => $folder
			)
		);
	}
	
	public function printLogs(){
		$this->model->printLogs( getData() );
		echo json_encode( array( 'success'=>true ) );
	}
	
	public function getSchoolYearList(){
		$data = getData();
		$view = $this->model->getSchoolYearList( $data );
		$data['cnt'] = true;
		$countAll = $this->model->getSchoolYearList( $data );
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
	
	public function saveSchoolYear(){
		$data = getData();
		$desc = 'Added new school year, ' . $data['schoolYearDescription'];
		/* check if school year already exists */
		if( $this->model->checkSchoolYearExists( $data ) > 0 ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 1
					)
				)
			);
		}
		if( (int)$data['schoolYearID'] > 0 ){
			$retData = $this->model->retSchoolYearRec( $data );
			if( !isset( $retData->schoolYearID ) ){
				die(
					json_encode(
						array(
							'success' => true
							,'match' => 2
						)
					)
				);
			}
			else{
				if( $retData->dateModified != $data['dateModified'] ){
					die(
						json_encode(
							array(
								'success' => true
								,'match' => 3
							)
						)
					);
				}
			}
			$desc = 'Modified ' . $retData->schoolYearDescription . ' record.';
		}
		
		$this->model->saveSchoolYear( $data );
		setLogs( array( 'description' => $desc, 'idmodule' => $data['idmodule'] ) );
		die(
			json_encode(
				array(
					'success' => true
					,'match' => 0
				)
			)
		);
		
	}
	
	public function retrieveSchoolYear(){
		$data = getData();
		$view = $this->model->retSchoolYearRec( $data );
		if( !isset( $view->schoolYearID ) ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 1
					)
				)
			);
		}
		die(
			json_encode(
				array(
					'success' => true
					,'view' => $view
					,'match' => 0
				)
			)
		);
	}
	
	public function deleteSchoolYear(){
		$data = getData();
		$view = $this->model->retSchoolYearRec( $data );
		if( !isset( $view->schoolYearID ) ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 1
					)
				)
			);
		}
		if( $this->model->checkIFUsed( $data ) > 0 ){
			die(
				json_encode(
					array(
						'success' => true
						,'match' => 2
					)
				)
			);
		}
		$this->model->deleteSchoolYear( $data );
		setLogs( array( 'description' => 'Deleted ' . $view->schoolYearDescription , 'idmodule' => $data['idmodule'] ) );
		die(
			json_encode(
				array(
					'success' => true
					,'match' => 0
				)
			)
		);
	}
	
	public function saveQuickSetup(){
		$data = getData();
		$tbl = '';
		$field = '';
		$field1 = '';
		if( $data['type'] == 'activity type' ){
			$tbl = 'activitytype';
			$field = 'activityTypeDescription';
			$field1 = 'classificationID';
		}
		else if( $data['type'] == 'subject' ){
			$tbl = 'subject';
			$field = 'subjectDescription';
		}
		/* first check if reecord duplicate */
		if( _checkData(
			array(
				'table' => $tbl
				,'field' => $field
				,'value' => $data['txtQuickField']
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
		
		if( $field1 == '' ){
			$resultID = $this->model->saveQuickSetup(
				array(
					'table' => $tbl
					,'data' => array(
						$field => $data['txtQuickField']
					)
				)
			);
		}else{
			$resultID = $this->model->saveQuickSetup(
				array(
					'table' => $tbl
					,'data' => array(
						$field => $data['txtQuickField']
						,$field1 => $data['txtClassification']
					)
				)
			);
		}
		die(
			json_encode(
				array(
					'success' => true
					,'match' => 0
					,'resultID' => $resultID
				)
			)
		);
	}
	
}

