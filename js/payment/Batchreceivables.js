/** Batch Receivable module
  * [Developer]
  * Developer: Jayson Montareal Dagulo
  * Date Created: April 3, 2019
  * Date Finished: April 4, 2019(needs re-checking for affected modules)
  
  * [Database]
	bma_ps.batchreceivables
	bma_ps.receivables
	
  * [Description]
  * 	This is a transaction module that will be used to record the receivables for each
		student in a particular payment category, for a specific date. The data recorded in
		this module will then be added to the Total Receivables per category and school year
		in the Account Card module.
 * [Modification]
   
 **/
 var Batchreceivables = function(){
	/* variable declarations(Private) */
	var _baseurl, _canSave, _canEdit, _canDelete, _canPrint, _idmodule, _module, _route, _pageTitle, onEdit = 0, batchReceivableID = null, batchReceivableModifiedOn = null, _mlink;
	var visibility = true;
	var arrRowIndex = new Array()
	var _allowEdit = true
	var allowActive = 1;
	var isAdmin = 0;
	var loadedStudentList = false;
	
	/* _module Main Container
	 * _module components container, handles most of the control in the form( Standards )
	 * @parameter params - configuration variables
	 * @private
	 * @return Ext.tab.Tab
	*/
	function _init( reload = true ){
		// Ext.Ajax.request( {
			// url: _route + 'getReferenceNo'
			// ,method: 'POST'
			// ,success: function( response ){
				// var resp = Ext.decode( response.responseText )
					// batchReceivableNo = resp.batchReceivableNo;
				// Ext.getCmp( 'batchReceivableNo' + _module ).setValue( batchReceivableNo );
				// Ext.getCmp( 'mainPanel' + _module ).doLayout();
				// if( reload ) Ext.getCmp( 'grdTransactions' + _module + '2' ).getStore().removeAll();
			// }
		// } )

		Ext.Ajax.request( {
			url: _route + 'getMainSchoolYear'
			,method: 'POST'
			,success: function( response ){
				var resp = Ext.decode( response.responseText )
				Ext.getCmp('schoolYearID' + _module).setValue( parseInt( resp.view, 10 ) );
			}
		} )

		setTimeout( function(){
			Ext.getCmp( 'mainPanel' + _module ).doLayout();
		}, 250 )
		if( reload ) Ext.getCmp( 'grdTransactions' + _module + '2' ).getStore().removeAll();
	}
	
	function _mainPanel( params ){
		var	payCategoryStore = standards.callFunction( '_createLocalStore' ,{
			data:[
				'Catering'
				,'Robotics'
				,'Skooltech'
				,'Christmas'
				,'Family Day'
				,'Picture'
				,'Grad Fee'
				,'Scouting/Camping'
				,'Others'
				,'Nutrition Day'
				,'Moving Up/Recognition'
			]
			,startAt: 1
		} );
		var	schoolYearStore = standards.callFunction( '_createRemoteStore' ,{
			fields: [
				{ name : 'isSet'
					,type : 'number'
				}
				,
				{ name : 'schoolYearID'
					,type : 'number'
				}
				,'schoolYearStart'
			]
			,url: _route + 'getSchoolYear'
		} );
		return standards.callFunction( '_mainPanel', {
			config : params
			,moduleType : 'form'
			,isCenter : false
			,autoSetCombo : false
			,showEditUsedMsg : false
			,minHeight: 550
			,minWidth: 1200
			,editFunction : _editRecord
			,tbar : 
			{
				noPDFButton: true
				,noExcelButton: true
				,saveFunc : _saveForm
				,resetFunc : _resetForm
			}
			,formItems : [
				{	xtype: 'container'
					,layout: 'column'
					,minWidth: 1159
					,items: [
						{	xtype: 'container'
							,columnWidth: .42
							,minWidth: 551
							,items: [
								standards.callFunction( '_createCombo', {
									id: 'batchReceivableCategoryID' + _module
									,fieldLabel: 'Payment Category'
									,store: payCategoryStore
									,width: 551
									,labelWidth: 135
									,forceSelection: true
									,emptyText: "Select payment category"
									,allowBlank: false
									,hasAll: false
									,value: 1
								} )
								,standards.callFunction(  '_createCombo' ,{
									id: 'schoolYearID' + _module
									,fieldLabel: 'School'
									,store: schoolYearStore
									,width: 551
									,labelWidth: 	135
									,valueField: 'schoolYearID'
									,displayField: 'schoolYearStart'
									,forceSelection: true
									,emptyText: "Select Grade Level"
									,allowBlank: false
									,hasAll: false
									,listeners: {
										afterrender: function(){
											var me = Ext.getCmp( 'schoolYearID' + _module )
											me.store.load( {
												callback: function(){
													me.setValue( mainSY );
												}
											} )
										}
									}
								} )
								,standards.callFunction( '_createDateField', {
									id: 'batchReceivableDate' + _module
									,fieldLabel: 'Date'
									,allowBlank: false
									,width: 551
									,labelWidth: 135
								} )
								,_grdStudents( 1 )
							]
						}
						,{	xtype: 'container'
							,width: 30
							,layout: 'vbox'
							,style: 'margin-left: 5px;'
							,items: [
								{	xtype: 'button'
									,iconCls: 'glyphicon glyphicon-chevron-right'
									,style: 'margin-top: 240px;'
									,iconAlign: 'right'
									,handler: function(){
										_transferRecords( 1 );
									}
								}
								,{	xtype: 'button'
									,iconCls: 'glyphicon glyphicon-forward'
									,style: 'margin-top: 5px;'
									,handler: function(){
										_transferRecords( 2 )
									}
								}
							]
						}
						,{	xtype: 'container'
							,columnWidth: .42
							,minWidth: 580
							,items: [
								standards.callFunction( '_createTextField', {
									id: 'batchReceivableAmount' + _module
									,fieldLabel: 'Receivable Amount'
									,allowBlank: false
									,width: 580
									,labelWidth: 140
									,isNumber: true
									,isDecimal: true
								} )
								,standards.callFunction( '_createTextField', {
									id: 'batchReceivableRemarks' + _module
									,fieldLabel: 'Remarks'
									,allowBlank: true
									,width: 580
									,labelWidth: 140
								} )
								,{	xtype: 'container'
									,style: 'margin-top: 36px;'
									,items: _grdStudents( 2 )
								}
							]
						}
					]
				}
			]
			,listItems : _grdHistory()
			,listeners: {
				afterrender: _init
			}
		} );
	}
	
	function _grdStudents( type ){
		var	store = standards.callFunction( '_createRemoteStore' ,{
			fields: [
				'studentID'
				,'studentName'
				,'gradeLevelName'
				,{ name: 'totalReceivables', type: 'float' }
				,{ name: 'totalPayment', type: 'float' }
			]
			,url: _route + ( type == 1? 'getStudents' : 'getBRSTudents' )
		} );

		store.on({
			load: function(s){
				loadedStudentList = true; // mark as real data loaded
				_updateStudentCount(s, type);

				console.log("Has Loaded", loadedStudentList);
			},
			add: function(s){
				if (loadedStudentList) _updateStudentCount(s, type);
				console.log("After Add", loadedStudentList);
			},
			remove: function(s){
				if (loadedStudentList) _updateStudentCount(s, type);
			}
		});


		var gradeLevelStore = standards.callFunction( '_createRemoteStore', {
			fields: [
				{ name: 'gradeLevelID', type: 'number' }
				,'gradeLevelName'
			]
			,url: _route + 'getGradeLevel'
		} )
		var sm = new Ext.selection.CheckboxModel( {
			checkOnly : true
		} );
		return standards.callFunction( '_gridPanel', {			
			id: 'grdTransactions' + _module + type
			,module: _module
			,store: store
			,selModel: sm
			,plugins: true
			,noPage: true
			,height: 400
			,noDefaultListeners: false
			,tbar: {
				content: [
					{	xtype: 'label'
						,text: ( type == 1? 'List of students:' : 'Receivable will be added to the following students\' account card: ' )
					}
					,{
						xtype: 'tbtext',
						id: 'lblStudentCount' + _module + type,
						text: ' (0)', // default count
						style: 'font-weight:bold; margin-left:5px;'
					},
					,'->'
					,{	xtype: 'button'
						,text: 'Run Script'
						,hidden: type != 1
						,handler: function(){
							Ext.Ajax.request( {
								url: _route + 'fixBalances'
								,success: function( res ){

								}
								,failure: function(){

								}
							} );
						}
					}
					,standards.callFunction( '_createCombo', {
						id: 'gradeLevelID' + _module + type
						,store: gradeLevelStore
						,fieldLabel: 'Grade Level'
						,displayField: 'gradeLevelName'
						,valueField: 'gradeLevelID'
						,allowBlank: true
						,labelWidth: 90
						,width: 240
						,hidden: type != 1
						,listeners: {
							afterrender: function(){
								var me = Ext.getCmp( 'gradeLevelID' + _module + type );
								me.store.load( {
									callback: function(){
										me.setValue( 0 );										
										if( type == 1 ){
											var grd = Ext.getCmp( 'grdTransactions' + _module + type )
											grd.store.load( {
												params: {
													gradeLevelID: me.value
												}
											} )
										}
									}
								} )
							}
							,select: function(){
								var grd = Ext.getCmp( 'grdTransactions' + _module + type );
								grd.store.proxy.extraParams.gradeLevelID = Ext.getCmp( 'gradeLevelID' + _module + type ).value
								grd.store.load( {} );
							}
						}
					} )
					,{	xtype: 'button'
						,text: 'Remove Students'
						,hidden: type == 1
						,handler: function(){
							var grd = Ext.getCmp( 'grdTransactions' + _module + '2' )
								,selRec = grd.selModel.getSelection();
							if( selRec.length > 0 ){
								_deleteStudRec( selRec, 0, 2 )
							}
							else{
								standards.callFunction( '_createMessageBox', {
									msg: 'Please select a record to delete.'
								} )
							}
						}
					}
				]
			}
			,columns: [
				{ header: 'Student Name', dataIndex: 'studentName', flex: 1 }
				,{ header: 'Grade Level', dataIndex: 'gradeLevelName', width: 150 }
				,standards.callFunction( '_createActionColumn', {
					icon : 'remove'
					,canDelete: true
					,tooltip : 'Remove record'
					,hidden: type == 1
					,Func : _deleteStudRec
				} )
			]
		} )
	}
	
	function _grdHistory( params ){
		var store = standards.callFunction( '_createRemoteStore', {
			fields : [
				'studentName'
				,'batchReceivableCategory'
				,'schoolYearStart'
				,'batchReceivableDate'
				,'batchReceivableAmount'
				,'batchReceivableRemarks'
				,'batchReceivableID'
				,'studentID'
			]
			,url : _route + 'getHistory'
		} );
		var sByStore = standards.callFunction( '_createLocalStore' ,{
					data:[
						'Payment Category'
						,'School Year'
						,'As of Date'
						,'Student Name'
					]
					,startAt: 1
				} );

		var sStore = standards.callFunction( '_createRemoteStore', {
			fields : [ 'id', 'name' ]
			,url : _route + 'getSearchStore'
		} );
		var grdID = 'gridHistory' + _module;
		return standards.callFunction( '_gridPanel', {
			id: grdID
			,module: _module
			,store: store
			,noDefaults: true
			,hasNumRows: true
			,tbar: {
				noExcel: true
				,noPDF: true
				,content: [
					{	xtype: 'container'
						,layout: 'column'
						,items: [
							standards.callFunction( '_createCombo', {
								store: sByStore
								,idmodule: _idmodule
								,fieldLabel: 'Search by'
								,id: grdID + 'sBy' + _module
								,style: 'margin-right: 5px;'
								,forceSelection: true
								,value: 1
								,listeners: {
									select: function(){
										var me = Ext.getCmp( grdID + 'sBy' + _module )
											,cmbSrch = Ext.getCmp( grdID + 's' + _module )
											,dRange = Ext.getCmp( 'dateRangeContainer' + _module );
										cmbSrch.setVisible( me.value != 3 );
										dRange.setVisible( me.value == 3 );
										if( me.value != 3 ){
											cmbSrch.store.proxy.extraParams.sBy = me.value;
											cmbSrch.reset();
											cmbSrch.store.load( {
												callback: function(){
													cmbSrch.setValue( 0 );
												} 
											} );
										}
										else{
											cmbSrch.reset();
										}
									}
								}
							} )
							,standards.callFunction( '_createCombo', {
								store: sStore
								,idmodule: _idmodule
								,fieldLabel: ''
								,valueField: 'id'
								,displayField: 'name'
								,id: grdID + 's' + _module
								,style: 'margin-right: 5px;'
								,listeners: {
									select: _refreshHistory
									,afterrender: function(){
										var me = Ext.getCmp( grdID + 's' + _module )
										me.store.proxy.extraParams.sBy = 1;
										me.store.load( {
											callback: function(){
												me.setValue( 0 );
											}
										} )
									}
								}
							} )
							,standards.callFunction( '_createDateRange', {
								hidden: true
								,fromFieldLabel: ''
								,fromWidth: 120
								,module: _module
								,extraComponents: [
									{	xtype: 'button'
										,iconCls: 'glyphicon glyphicon-search'
										,style: 'margin-left: 5px; margin-right: 5px;'
										,handler: function(){
											_refreshHistory();
										}
									}
								]
							} )
							,{	xtype : 'button'
								,iconCls : 'glyphicon glyphicon-refresh'
								,handler : function(){
									Ext.getCmp( grdID + 'sBy' + _module ).reset();
									Ext.getCmp( grdID + 'sBy' + _module ).fireEvent( 'select' );
									Ext.getCmp( grdID + 's' + _module ).reset();
									Ext.getCmp( grdID + 's' + _module ).setVisible( true );
									Ext.getCmp( 'dateRangeContainer' + _module ).setVisible( false );
									_refreshHistory();
								}
							}
						]
					}
				]
			}
			,columns : [
				{	header : 'Student Name'
					,dataIndex : 'studentName'
					,minWidth : 150
					,flex : 1
					,listeners : {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTransEdit', {
								idmodule: _idmodule
								,mlink: _mlink
								,data: rec.data
							} );
						}
					}
				}
				,{	header : 'Payment Category'
					,dataIndex : 'batchReceivableCategory'
					,minWidth : 150
					,flex : 1
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTransEdit', {
								idmodule: _idmodule
								,mlink: _mlink
								,data: rec.data
							} );
						}
					}
				}
				,{	header : 'School Year'
					,dataIndex : 'schoolYearStart'
					,minWidth : 200
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTransEdit', {
								idmodule: _idmodule
								,mlink: _mlink
								,data: rec.data
							} );
						}
					}
				}
				,{	header : 'As of Date'
					,dataIndex : 'batchReceivableDate'
					,minWidth : 200
					,align : 'right'
					,xtype : 'datecolumn'
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTransEdit', {
								idmodule: _idmodule
								,mlink: _mlink
								,data: rec.data
							} );
						}
					}
				}
				,{	header : 'Receivable Amount'
					,dataIndex : 'batchReceivableAmount'
					,minWidth : 200
					,align: 'right'
					,xtype: 'numbercolumn'
					,format: '0,000.00'
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTransEdit', {
								idmodule: _idmodule
								,mlink: _mlink
								,data: rec.data
							} );
						}
					}
				}
				,{	header : 'Remarks'
					,dataIndex : 'batchReceivableRemarks'
					,minWidth : 150
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTransEdit', {
								idmodule: _idmodule
								,mlink: _mlink
								,data: rec.data
							} );
						}
					}
				}
				,standards.callFunction( '_createActionColumn', {
					icon : 'pencil'
					,tooltip : 'Edit record'
					,Func : _editRecord
				} )
				,standards.callFunction( '_createActionColumn', {
					icon : 'remove'
					,canDelete : _canDelete
					,tooltip : 'Remove record'
					,Func : _deleteRecord
				} )
			]
		} );
	}
	
	function _transferRecords( type ){
		var grdFrom = Ext.getCmp( 'grdTransactions' + _module + '1' )
			,dataToTransfer = ( type == 1? grdFrom.selModel.getSelection() : grdFrom.getStore().getRange() )
			,grdTo = Ext.getCmp( 'grdTransactions' + _module + '2' );
		console.warn( 'process' );
		dataToTransfer.forEach( function( item, index ){
			if( !grdTo.store.findRecord( 'studentID', item.data.studentID, 0, false, false, true ) ){
				grdTo.store.add( item.data );
			} else {
				console.log("Student is already on the 2nd table", item.data);
				console.log("student details", item.data.studentID )
				console.log(grdTo.store.findRecord( 'studentID', item.data.studentID ));
			}
		} );
		grdTo.getStore().sort( [ { property: 'studentName', direction: 'ASC' } ] );
	}
	
	function _deleteStudRec( data, row = 1, type = 1 ){
		var grd = Ext.getCmp( 'grdTransactions' + _module + '2' );
		if( type == 1 ){
			if( data.totalReceivables < data.totalPayment ){
				standards.callFunction( '_createMessageBox', {
					msg: 'This student cannot be deleted because a payment has been paid for this receivable amount.'
					,icon: 'error'
				} )
			}
			else grd.store.removeAt( row );
		}
		else{
			var errRec = 0, name = null;
			data.forEach( function( item, index ){
				if( item.data.totalReceivables < item.data.totalPayment ){
					if( name == null ) name = item.data.studentName;
					errRec++;
				}
			} );
			if( errRec > 0 ){
				standards.callFunction( '_createMessageBox', {
					msg: 'This action cannot be performed. The receivable amount from ' + name + ' has already been paid.'
					,icon: 'error'
				} )
			}else grd.store.remove( data );
		}
	}
	
	function _saveForm( form ){
		var receivables = _getRecords();
		if( receivables.length > 0 ){
			form.submit( {
				url: _route + 'saveForm'
				,params: {
					receivables: Ext.encode( receivables )
					,batchReceivableID: batchReceivableID
					,batchReceivableModifiedOn: batchReceivableModifiedOn
					,batchReceivableCategoryName: Ext.getCmp( 'batchReceivableCategoryID' + _module ).getRawValue()
				}
				,success: function( action, response ){
					var resp = response.result
						,match = parseInt( resp.match, 10 )
						,studentName = resp.studentName;
					if( match == 1 ){
						standards.callFunction( '_createMessageBox', {
							msg: 'Reference No. already exists.'
							,fn: function(){
								_init( false );
							}
						} )
					}
					else if( match == 2 ){
						standards.callFunction( '_createMessageBox', {
							msg: 'SAVE_MODIFIED'
							,action: 'confirm'
							,fn: function( btn ){
								if( btn == 'yes' ){
									form.modify = true;
									_saveForm( form );
								}
							}
						} )
					}
					else if( match == 3 ){
						standards.callFunction( '_createMessageBox', {
							msg: 'This transaction cannot be saved. The receivable amount from ' + studentName + ' has already been paid.'
							,icon: 'error'
						} )
					}
					else{
						standards.callFunction( '_createMessageBox', {
							msg: 'SAVE_SUCCESS'
							,fn: function(){
								_resetForm( form );
							}
						} )
					}
				}
			} );
		}
		else{
			standards.callFunction( '_createMessageBox', {
				icon: 'error'
				,msg: 'Please select at least one student to whom the receivable amount will be added'
			} )
		}
	}
	
	function _getRecords(){
		var grd = Ext.getCmp( 'grdTransactions' + _module + '2' )
			,records = grd.getStore().getRange()
			,data = [];
		records.forEach( function( items, index ){
			data.push( {
				studentID: items.data.studentID
				,receivableAmount: Ext.getCmp( 'batchReceivableAmount' + _module ).getSubmitValue()
			} );
		} )
		return data;
	}
	
	function _resetForm( form ){
		form.reset();
		_init( true );
		Ext.getCmp( 'schoolYearID' + _module ).fireEvent( 'afterrender' );
		var gradeLevel = Ext.getCmp( 'gradeLevelID' + _module + '1' );
		gradeLevel.store.load( {
			callback: function(){
				if( gradeLevel.getStore().getRange().length > 0 ){
					gradeLevel.setValue( gradeLevel.getStore().getAt( 0 ).get( 'gradeLevelID' ) );
				}
				Ext.getCmp( 'grdTransactions' + _module + '1' ).store.load( {
					params: {
						gradeLevelID: gradeLevel.value
					}
				} )
			}
		} )
		batchReceivableID = 0;
	}
	
	function _editRecord( record, row ){
		_module.getForm().retrieveData( {
			url: _route + 'retrieveData'
			,params: record
			,success: function( response ){
				var gradeLevel = Ext.getCmp( 'gradeLevelID' + _module + '1' );
				batchReceivableID = response.batchReceivableID;
				batchReceivableModifiedOn = response.batchReceivableModifiedOn;
				Ext.getCmp( 'batchReceivableCategoryID' + _module ).setValue( parseInt( response.batchReceivableCategoryID, 10 ) );
				var schoolYearID = Ext.getCmp( 'schoolYearID' + _module );
				schoolYearID.store.load( {
					callback: function(){
						schoolYearID.setValue( parseInt( response.schoolYearID, 10 ) );
					}
				} );
				gradeLevel.store.load( {
					callback: function(){
						if( gradeLevel.getStore().getRange().length > 0 ) gradeLevel.setValue( gradeLevel.getStore().getAt(0).get( 'gradeLevelID' ) );
						Ext.getCmp( 'grdTransactions' + _module + '1' ).store.load( {
							params: {
								gradeLevelID: gradeLevel.getValue()
							}
						} )
					}
				} );
				Ext.getCmp( 'grdTransactions' + _module + '2' ).store.load( {
					params: {
						batchReceivableID: response.batchReceivableID
					}
				} )
				
			}
		} );
	}
	
	function _deleteRecord( data, row ){
		if( parseInt( data.batchReceivableID, 10 ) > 0 ){
			data.confirmDelete( {
				url : _route + 'deleteRecord'
				,msg: "Are you sure you want to delete this record?"
				,params : data
				,success : function( response ){
					var ret = Ext.decode( response.responseText )
						,match = parseInt( ret.match, 10 )
						,studentName = ret.studentName;
					if( match == 1 ){
						standards.callFunction( '_createMessageBox', {
							msg: 'EDIT_UNABLE'
							,fn: function(){
								var store = Ext.getCmp( 'gridHistory' + _module ).getStore();
								if(store.getCount() == 1 && store.currentPage != 1) store.currentPage = 1;
								store.load();
							}
						} );
					}
					else if( match == 2 ){
						standards.callFunction( '_createMessageBox', {
							msg: 'This transaction cannot be deleted. The receivable amount from ' + studentName + ' has already been paid.'
						} )
					}
					else{
						standards.callFunction( '_createMessageBox', {
							msg: 'DELETE_SUCCESS'
							,fn: function(){
								var store = Ext.getCmp( 'gridHistory' + _module ).getStore();
								if(store.getCount() == 1 && store.currentPage != 1) store.currentPage = 1;
								store.load();
							}
						} )
					}
				}
			} );
		}
	}
	
	function _refreshHistory(){
		var grd = Ext.getCmp( 'gridHistory' + _module );
		grd.store.proxy.extraParams = {
			sBy: Ext.getCmp( 'gridHistory' + _module + 'sBy' + _module ).value
			,search: Ext.getCmp( 'gridHistory' + _module + 's' + _module ).value
			,sdate: Ext.getCmp( 'sdate' + _module ).value
			,edate: Ext.getCmp( 'edate' + _module ).value
		};
		grd.getStore().currentPage = 1;
		grd.store.load( {} );
	}

	function _updateStudentCount(store, type) {
		var lbl = Ext.getCmp('lblStudentCount' + _module + type);

		if (lbl) {
			lbl.setText(' (' + store.getCount() + ')');
		}
	}
	
	return {
		initMethod : function( params ){
			_baseurl = params.baseurl;
			_canSave = params.canSave;
			_canEdit = params.canEdit;
			_canDelete = params.canDelete;
			_canPrint = false;
			_idmodule = params.idmodule;
			_module = params.module;
			_route = params.route;
			console.warn( params );
			_mlink = 'payment/batchreceivables.js';
			_pageTitle = params.pageTitle;
			return _mainPanel( params );
		}
	}
}();