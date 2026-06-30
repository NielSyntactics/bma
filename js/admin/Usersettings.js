/** User settings module
  * [Developer]
  * Developer: Jayson Dagulo
  * Date Created: Feb. 15, 2016
  * Date Finished: Feb. 23, 2016
  
  * [Database]
	bgsu, modules, amodules, and class
	
  * [Description]
	This module allows the authorized administrators to set (add, edit or delete) users who will be allowed to access the system. 
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
var Usersettings = function(){
	/* variable declarations(Private) */
	var _baseurl, _canSave, _canEdit, _canDelete, _canPrint, _idmodule, _module, _route, _pageTitle;
	var _oldRowIndex = -1, comboGradeLevelID, userIDSelected = 0, utype = 5;
	var CUT = 0;
	
	/* Module Main Container
	 * module components container, handles most of the control in the form( Standards )
	 * @parameter params - configuration variables
	 * @private
	 * @return Ext.tab.Tab
	*/
	function _mainPanel( params ){
		var uTypeStore =	standards.callFunction( '_createLocalStore', {
								data : [
									'Administrator'
									,'Secretary'
									,'User'
								]
							} );
		return standards.callFunction( '_mainPanel', {
			config : params
			,moduleType : 'form'
			,minWidth : 1020
			,minHeight : 530
			,isCenter : false
			,tbar : {
				saveFunc : _saveForm
				,resetFunc : _resetForm
				,listLabel : 'List'
				,noExcelButton: true
				,noPDFButton: true
				,PDFHidden: true
			}
			,formItems : [
				{	xtype : 'hiddenfield'
					,id : 'bmapsUID' + _module
					,value : 0
				}
				,standards.callFunction( '_createTextField', {
					id : 'bmapsUname' + _module
					,fieldLabel : 'User Name'
					,allowBlank : false
					,maxLength : 255
					,regex: /^[a-zA-Z_\-0-9@!#%&*().@$]+$/
					,msgTarget : 'under'
					,regexText:'Value must be in one word.'
				
				} )
				,standards.callFunction( '_createTextField', {
					id : 'bmapsUKey' + _module
					,fieldLabel : 'Password'
					,allowBlank : false
					,minLength : 5
					,maxLength : 255
					,minLengthText : 'Password must have more than 4 characters.'
					,inputType : 'password'
					,msgTarget : 'under'
					,listeners : {
						change : function(){
							var me = this;
							if( me.isVisible() ){
								Ext.getCmp( 'confirmPass' + _module ).validate();
							}
						}
					}
				} )
				,standards.callFunction( '_createTextField', {
					id : 'confirmPass' + _module
					,fieldLabel : 'Confirm Password'
					,allowBlank : false
					,maxLength : 255
					,inputType : 'password'
					,submitValue : false
					,msgTarget : 'under'
					,validator : function( value ){
						var passField = Ext.getCmp( 'bmapsUKey' + _module );
						if( passField.isVisible() ){
							return ( value === passField.value )? true : 'Password did not match.';
						}
						else{
							return true;
						}
					}
				} )
				,standards.callFunction( '_createCombo', {
					id : 'bmapsUtype' + _module
					,fieldLabel : 'User Type'
					,module : _module
					,idmodule : _idmodule
					,store : uTypeStore
					,editable : false
					,allowBlank : false
					,listeners : {
						select : function(){ }
					}
				} )
				,standards.callFunction( '_createTextField', {
					id : 'bmapsUfirstname' + _module
					,fieldLabel : 'First Name'
					,allowBlank : false
					,maxLength : 255
				} )
				,standards.callFunction( '_createTextField', {
					id : 'bmapsUlastname' + _module
					,fieldLabel : 'Last Name'
					,allowBlank : false
					,maxLength : 255
				} )
				,standards.callFunction( '_createCheckField', {
					id : 'bmapsUInactiveTag' + _module
					,fieldLabel : 'status'
					,boxLabel : 'Inactive'
					// ,hidden : true
					,hidden : false
				} )
			]
			,listItems : _gridHistory()
		} );
	}
	
	function _gridHistory(){
		var store =	standards.callFunction( '_createRemoteStore', {
						fields: [
							'bmapsUID'
							,'bmapsUname'
							,'bmapsUtype'
							,'utype'
							,'bmapsFullName'
							,'bmapsStatus'
						]
						,url : _route + 'getUserListing'
					} );
		var srchByStore =	standards.callFunction( '_createLocalStore', {
								data : [
									'User Name'
									,'User Type'
									,'Full Name'
									,'Status'
								]
							} );
		var srchStore =	standards.callFunction( '_createRemoteStore', {
							fields : [ 'name', 'id' ]
							,url : _route + 'retrieveSearch'
						} )
		return standards.callFunction( '_gridPanel', {
			id : 'gridHistory' + _module
			,module : _module
			,store : store
			,noDefaults : true
			,hasNumRows: true
			,tbar : {
				content: [
					standards.callFunction( '_createCombo', {
						store : srchByStore
						,idmodule : _idmodule
						,fieldLabel : 'Search by'
						,valueField : 'id'
						,displayField : 'name'
						,id : 'srchByCmb' + _module
						,style : 'margin-right : 5px;'
						,listeners : {
							select : function(){
								store.currentPage = 1;
								var me = this;
								srchStore.proxy.extraParams.by = me.value;
								Ext.getCmp( 'srchCmb' + _module ).store.load( {
									callback: function(){
										Ext.getCmp( 'srchCmb' + _module ).setValue( srchStore.getAt(0).get('id') );
										Ext.getCmp( 'srchCmb' + _module ).fireEvent( 'select' );
									}
								} )
							}
						}
					} )
					,standards.callFunction( '_createCombo', {
						store : srchStore
						,idmodule : _idmodule
						,fieldLabel : ''
						,valueField : 'id'
						,displayField : 'name'
						,id : 'srchCmb' + _module
						,style : 'margin-right : 5px'
						,listeners : {
							select : function(){
								store.currentPage = 1;
								var grd = Ext.getCmp( 'gridHistory' + _module )
									,srchBy = Ext.getCmp( 'srchByCmb' + _module )
									,srch = Ext.getCmp( 'srchCmb' + _module );
								grd.store.proxy.extraParams.srchBy = srchBy.value;
								grd.store.proxy.extraParams.srch = srch.value;
								grd.store.load( {
									callback: function(){
										if( grd.store.getCount() <= 0 ){
											standards.callFunction( '_createMessageBox', {
												msg : 'No records found.'
											});
										}
									}
								} );
							}
						}
					} )
					,{	xtype : 'button'
						,iconCls : 'glyphicon glyphicon-refresh'
						,handler : function(){
							var srchBy = Ext.getCmp( 'srchByCmb' + _module )
								,srch = Ext.getCmp( 'srchCmb' + _module )
								,srchBtn = Ext.getCmp( 'srchViewBtn' + _module )
								,grd = Ext.getCmp( 'gridHistory' + _module );
							srchBy.reset();
							srch.store.proxy.extraParams.by = srchBy.value;
							srch.reset();
							grd.store.proxy.extraParams.srchBy = srchBy.value
							grd.store.proxy.extraParams.srch = srch.value
							grd.store.load( {} );
						}
					}
				]
			}
			,columns : [
				{	header : 'User Name'
					,dataIndex : 'bmapsUname'
					,flex : 1
					,minWidth : 150
				}
				,{	header : 'User Type'
					,dataIndex : 'bmapsUtype'
					,width : 150
					,align: 'center'
				}
				,{	header : 'Full Name'
					,dataIndex : 'bmapsFullName'
					,flex : 1
					,width : 150
				}
				,{	header : 'Status'
					,dataIndex : 'bmapsStatus'
					,width : 100
					,align: 'center'
				}
				,standards.callFunction( '_createActionColumn', {
					icon : 'pencil'
					,tooltip : 'Edit record'
					,Func : _editRecord
					,width : 40
				} )
				,standards.callFunction( '_createActionColumn', {
					icon : 'lock'
					,tooltip : 'Change Password'
					,Func: _changePassword
					,width : 40
				} )
				,standards.callFunction( '_createActionColumn', {
					icon : 'th-list'
					,tooltip : 'Module Access'
					,Func : _moduleAccess
					,width : 40
				} )
				,standards.callFunction( '_createActionColumn', {
					icon : 'remove'
					,canDelete : _canDelete
					,tooltip : 'Remove record'
					,Func : _deleteRecord
					,width : 40
				} )
			]
		} )
	}
	
	/* Process Form Saving
	 * this includes record saving(new), update(edit) with validations for duplicates and etc..
	 * @private
	 * @return void
	*/
	function _saveForm( form ){
		var name = Ext.getCmp( 'bmapsUname' + _module )
			,addData = new Array();
			
			
		// for( var i = 0; i < grdCnt; i++ ){
			// var newData = grdData[i].data;
			// console.warn( newData );
			// if( parseInt( newData.gradeLevelID, 10 ) > 0 && parseInt( newData.schoolYearID, 10 ) > 0 ){
				// addData.push( {
					// dataRec : newData.dataRec
					// ,classID : newData.classID
					// ,gradeLevelID : newData.gradeLevelID
					// ,schoolYearID : newData.schoolYearID
				// } );
			// }
		// }
		if( form.isValid() ){
			form.submit( {
				url : _route + 'saveForm'
				,params : {
					addData: Ext.encode( addData )
				}
				,success : function( action, response ){
					var resp = response.result
						,match = parseInt( resp.match, 10 );
					
					if( match == 1 ){ /* username exists */
						standards.callFunction( '_createMessageBox', {
							msg : 'User Name: ' + name.value + ' already exists.'
							,fn : function(){
								name.focus();
							}
						} );
					}
					else if( match == 2 ){ /* record not found */
						standards.callFunction( '_createMessageBox', {
							msg : 'EDIT_UNABLE'
						} );
					}
					else if( match == 3 ){ /* modified by other users */
						standards.callFunction( '_createMessageBox', {
							msg : 'SAVE_MODIFIED'
							,action : 'confirm'
							,fn : function( btn ){
								if( btn == 'yes' ){
									form.modify = true;
									_saveForm( form );
								}
							}
						} )
					}
					else{
						standards.callFunction( '_createMessageBox', {
							msg : 'SAVE_SUCCESS'
						} );
						_resetForm( form );
					}
				}
			} );
		}
	}
	
	/* Process Reset form
	 * clear form values, restoring form component values to its original state
	 * @private
	 * @return void
	*/
	function _resetForm( form ){
		form.reset();
		_oldRowIndex = -1;
		
		Ext.getCmp( 'bmapsUKey' + _module ).allowBlank = false;
		Ext.getCmp( 'bmapsUKey' + _module ).submitValue = true;
		Ext.getCmp( 'bmapsUKey' + _module ).reset( true );
		Ext.getCmp( 'bmapsUKey' + _module ).show();		
		Ext.getCmp( 'confirmPass' + _module ).allowBlank = false;
		Ext.getCmp( 'confirmPass' + _module ).reset( true );
		Ext.getCmp( 'confirmPass' + _module ).show();
		
		Ext.getCmp( 'bmapsUfirstname' + _module ).setVisible( true );
		Ext.getCmp( 'bmapsUfirstname' + _module ).setValue( '' );
		Ext.getCmp( 'bmapsUfirstname' + _module ).allowBlank = false;
		Ext.getCmp( 'bmapsUlastname' + _module ).setVisible( true );
		Ext.getCmp( 'bmapsUlastname' + _module ).setValue( '' );
		Ext.getCmp( 'bmapsUlastname' + _module ).allowBlank = false;
	}
	
	function _editRecord( data ){
		_module.getForm().retrieveData( {
			url : _route + 'retrieveRecord'
			,params : { bmapsUID : data.bmapsUID }
			,success : function( response ){
				_oldRowIndex = -1;
				Ext.getCmp( 'bmapsUKey' + _module ).allowBlank = true;
				Ext.getCmp( 'bmapsUKey' + _module ).submitValue = false;
				Ext.getCmp( 'bmapsUKey' + _module ).setValue( '' );
				Ext.getCmp( 'bmapsUKey' + _module ).hide();
				Ext.getCmp( 'bmapsUKey' + _module ).validate();
				Ext.getCmp( 'confirmPass' + _module ).allowBlank = true;
				Ext.getCmp( 'confirmPass' + _module ).validate();
				Ext.getCmp( 'confirmPass' + _module ).hide();
				Ext.getCmp( 'bmapsUInactiveTag' + _module ).show();
				Ext.getCmp( 'bmapsUtype' + _module ).fireEvent( 'select' );
				Ext.getCmp( 'bmapsUfirstname' + _module ).setValue( response.bmapsUfirstname );
				Ext.getCmp( 'bmapsUlastname' + _module ).setValue( response.bmapsUlastname );
			}
		} );
	}
	
	function _changePassword( data ){
		if( !_canEdit ) return false
		Ext.create( 'Ext.Window', {
			id : 'chngPass' + _module
			,title : 'Change Password'
			,autoWidth : true
			,autoHeight : true
			,modal : true
			,resizable : false
			,items : [
				{	xtype : 'form'
					,width : 370
					,border : false
					,bodyPadding : '10px'
					,id : 'mainFormPanel_chngPass' + _module
					,overrideParams : false
					,items : [
						{	xtype : 'hiddenfield'
							,id : 'bmapsUIDchngPass' + _module
							,value : data.bmapsUID
						}
						,{	xtype : 'container'
							,layout : 'column'
							,items : [
								{	xtype : 'label'
									,text : 'User\'s Full Name:'
									,width : 140
								}
								,{	xtype : 'label'
									,text : data.bmapsFullName
								}
							]
						}
						,standards.callFunction( '_createTextField', {
							id : 'bmapsUKeychPass' + _module
							,fieldLabel : 'Password'
							,inputType : 'password'
							,minLength : 5
							,minLengthText : 'Password must have more than 4 characters.'
							,maxLength : 255
							,msgTarget : 'under'
							,allowBlank : false
							,listeners : {
								change : function(){
									Ext.getCmp( 'confirmPasssrch' + _module ).validate();
								}
							}
						} )
						,standards.callFunction( '_createTextField', {
							id : 'confirmPasssrch' + _module
							,fieldLabel : 'Confirm Password'
							,inputType : 'password'							
							,maxLength : 255
							,inputType : 'password'
							,submitValue : false
							,msgTarget : 'under'
							,allowBlank : false
							,validator : function( value ){
								var passField = Ext.getCmp( 'bmapsUKeychPass' + _module );
								if( passField.isVisible() ){
									return ( value === passField.value )? true : 'Password did not match.';
								}
								else{
									return true;
								}
							}
						} )
					]
					,buttonAlign : 'center'
					,buttons : [
						{	xtype : 'button'
							,disabled : true
							,formBind : true
							,text : 'Save'
							,iconCls : 'glyphicon glyphicon-floppy-disk'
							,handler : function(){
								Ext.Ajax.request( {
									url : _route + 'processChangePassword'
									,method : 'post'
									,params : {
										bmapsUID : Ext.getCmp( 'bmapsUIDchngPass' + _module ).value
										,bmapsUKey : Ext.getCmp( 'bmapsUKeychPass' + _module ).value
										,bmapsFullName: data.bmapsFullName
									}
									,success : function(){
										standards.callFunction( '_createMessageBox', {
											msg : 'Password has been successfully saved.'
											,fn : function(){
												Ext.getCmp( 'chngPass' + _module ).destroy();
											}
										} )
									}
								} )
							}
						}
						,{	xtype : 'button'
							,text : 'Reset'
							,iconCls : 'glyphicon glyphicon-refresh'
							,handler: function(){
								Ext.getCmp( 'mainFormPanel_chngPass' + _module ).getForm().reset();
							}
						}
					]
				}
			]
		} ).show();
	}
	
	function _moduleAccess( data ){
		if( !_canEdit ) return false
		var userStore =	standards.callFunction( '_createRemoteStore', {
							fields : [
								'bmapsUID'
								,'bmapsuFullName'
								,'uType'
							]
							,url : _route + 'getUserList'
						} );
		var utype = parseInt( data.utype, 10 );
				
		var mtype = 0;
		var menu_winMod_value = 0; //used to reset the menu selection
		if( utype == 1 ){
			var menuStore =	standards.callFunction( '_createLocalStore', {
							fields : [ 'id' ,'name' ]
							,data : [
								{ 'id' : 0,'name' : 'Account Card' }
								,{ 'id' : 1 ,'name' : 'Admin'}
								,{ 'id' : 2,'name' : 'Report'}
							]
							,reQuery: false
						} );
			// mtype = 0;
		}else if( utype == 2 || utype == 3 ){
			var menuStore =	standards.callFunction( '_createLocalStore', {
							fields : [ 'id' ,'name' ]
							,data : [
								{ 'id' : 0,'name' : 'Account Card' }
								,{	'id' : 2,'name' : 'Report'}
							]
							,reQuery: false
						} );
			// mtype = 0;
		}
		var sm =	new Ext.selection.CheckboxModel( {
						checkOnly : true
						,listeners : {
							select: function( val, rec ){
								var record = rec.data;
								record.chk = 1;
								
								if( !record.save && !record.edit && !record.del  /* && !record.print */ ){
									rec.set( 'save', record.cansave );
									rec.set( 'edit', record.canedit );
									rec.set( 'del', record.candel );
									rec.set( 'print', record.canprint );
								}
							}
							,deselect: function( val, record ){
								record.set( 'chk', 0 );
								record.set( 'save', false );
								record.set( 'edit', false );
								record.set( 'del', false );
								record.set( 'print', false );
							}
						}
					} );
		var win =	Ext.create( 'Ext.Window', {
						id : 'winMod' + _module
						,title : 'Module Access Setting'
						,width : 515
						,height : 450
						,modal : true
						,closable : false
						,resizable : false
						,items : [
							{	xtype:'form'
								,width: 505
								,height:400
								,border:false
								,items:[
									standards.callFunction( '_createCombo', {
										id:'userName_winMod' + _module
										,idmodule : _idmodule
										,fieldLabel:'Name'
										,store:userStore
										,displayField:'bmapsuFullName'
										,valueField:'bmapsUID'
										,style : 'margin: 5px;'
										,listeners:{
											afterrender:function(){
												userStore.load({
													callback:function(){
														Ext.getCmp( 'userName_winMod' + _module ).setValue( data.bmapsUID );
														var varUType = Ext.getCmp( 'userName_winMod' + _module ).store.findRecord('bmapsUID',data.bmapsUID ).data.uType;  
													}
												});
											}
											,select:function(a,b){
												var varUTypes = Ext.getCmp( 'userName_winMod' + _module ).store.findRecord('bmapsUID',this.value ).data.uType;  
												var adminType = [{ 'id' : 0,'name' : 'Account Card' },{ 'id' : 1 ,'name' : 'Admin'},{ 'id' : 2,'name' : 'Report'} ]
												var notAdminType = [ { 'id' : 0,'name' : 'Account Card' } ,{ 'id' : 2,'name' : 'Report'} ]
												userIDSelected = this.value;
												
												Ext.getCmp("menu_winMod" + _module).bindStore(
													parseInt( varUTypes , 10 ) == 1 ?
														standards.callFunction( '_createLocalStore', { fields : [ 'id' ,'name' ] ,data : adminType } ) 
													: 
														standards.callFunction( '_createLocalStore', { fields : [ 'id' ,'name' ] ,data : notAdminType } ) 
												)
												// if(parseInt(varUTypes) > 1){
													loadGrid({
														mtype : 0
														,bmapsUID : this.getValue()
													});
													Ext.getCmp( 'menu_winMod' + _module ).store.load()
												// }
												
											}
										}
									})
									,standards.callFunction( '_createCombo', {
										id : 'menu_winMod' + _module
										,idmodule : _idmodule
										,fieldLabel : 'Menu'
										,store : menuStore
										,valueField : 'id'
										,displayField : 'name'
										,value : mtype
										,editable : false
										,style : 'margin-left : 5px;'
										,listeners : {
											select:function(){
												loadGrid({
													mtype : this.value
													,bmapsUID : Ext.getCmp( 'userName_winMod' + _module ).getValue()
												});
											}
										}
									} )
									,grid_winMod()
								]
							}
						]
						,dockedItems: [ {
							xtype: 'container'
							,dock: 'bottom'
							,padding: '10 10 5'
							,layout: {
								type: 'hbox'
								,align: 'middle'
							}
							,items: [
								{ 	xtype : 'box'
									,autoEl : { cn: '<div id="errmsg2" style="margin-top:-5px;"></div>' }
								}
								,{
									xtype : 'component'
									,flex : 1
								}
								,{ 
									xtype : 'button'
									,text : 'Save'
									,iconCls : 'glyphicon glyphicon-floppy-disk'
									,id : 'savemod' + _module
									,style : 'margin-right : 5px;'
									,handler : function(){
										saveModules(); 
									}
								}
								,{ 
									xtype : 'button'
									,text : 'Close'
									,iconCls : 'glyphicon glyphicon-remove'
									,handler : function(){
										Ext.getCmp( 'winMod' + _module ).close(); 
									}
								}
							]
						} ]
					} );
		
		function grid_winMod(param){
			var moduleStore =	standards.callFunction( '_createRemoteStore', {
									fields:[
										'module'
										,'mlink'
										,{	name: 'idmodule',type: 'number' }
										,{	name: 'save' ,type: 'bool' }
										,{	name: 'edit' ,type: 'bool' }
										,{	name: 'del' ,type: 'bool' }
										,{	name: 'print' ,type: 'bool' }
										,{	name: 'mtype' ,type: 'number' }
										,{	name: 'chk' ,type: 'bool'}
									]
									,url: _route + "getModules"
								});
			var checkListeners =	{
										checkchange: function( me, rowIndex, checked ){
											var grd = moduleStore.getAt( rowIndex );
											if( checked ){
												sm.select( rowIndex, true ); 
												Ext.getCmp( 'gridModules' + _module ).getView().refresh();
											}
											else{
												var grd = moduleStore.getAt( rowIndex );
												if( !grd.data.save && !grd.data.edit && !grd.data.del && !grd.data.print ){
													sm.deselect( rowIndex );
												}
											}
										}
									};
									
			var columnRenderer =	function( value, metaData, record, rowIndex, columnIndex ){
									if( parseInt(userIDSelected) == 0 ){
										CUT = utype;
									}else{ 
										CUT = Ext.getCmp( 'userName_winMod' + _module ).store.findRecord('bmapsUID', userIDSelected ).data.uType;  ;
									}
									
									/* Settings for Modules */
									if( ( CUT > 1 && record.get( 'idmodule' ) == 2 && columnIndex == 4 ) ){ return null; } //Account Card Settings
									else if( record.get( 'idmodule' ) == 3 && columnIndex == 5  ){ return null; } //User Settings
									else if( ( record.get( 'idmodule' ) == 4 && columnIndex == 3 ) ||  ( record.get( 'idmodule' ) == 4 && columnIndex == 4 ) ||  ( record.get( 'idmodule' ) == 4 && columnIndex == 5 ) ){ return null; } //Company Settings
									else if( ( record.get( 'idmodule' ) == 5 && columnIndex == 2 ) ||  ( record.get( 'idmodule' ) == 5 && columnIndex == 3 ) ||  ( record.get( 'idmodule' ) == 5 && columnIndex == 4 ) ||  ( record.get( 'idmodule' ) == 5 && columnIndex == 5 ) ){ return null; } //User Action Logs
									else if( ( record.get( 'idmodule' ) == 6 && columnIndex == 2 ) || ( record.get( 'idmodule' ) == 6 && columnIndex == 3 ) || (record.get( 'idmodule' ) == 6 && columnIndex == 5) ){ return null; } //Backup and Restore
									else if( ( record.get( 'idmodule' ) == 7 && columnIndex == 2) ||  ( record.get( 'idmodule' ) == 7 && columnIndex == 3 ) ||  ( record.get( 'idmodule' ) == 7 && columnIndex == 4 ) ){ return null; } //Collection Report
									else if( ( record.get( 'idmodule' ) == 12 && columnIndex == 2) ||  ( record.get( 'idmodule' ) == 12 && columnIndex == 3 ) ||  ( record.get( 'idmodule' ) == 12 && columnIndex == 4 ) ){ return null; } //Balances Summary
									else{ return ( new Ext.ux.CheckColumn() ).renderer( value, metaData ); }
								};
			return Ext.create( 'Ext.grid.Panel', {
				store : moduleStore
				,id : 'gridModules' + _module
				,border : false
				,readOnly :true
				,height : 330
				,selModel : sm
				,plugins : standards.callFunction( '_cellEdit', {} )
				,viewConfig : {
					markDirty : false
				}
				,columns : [
					{	xtype : 'gridcolumn'
						,header : 'Modules'
						,dataIndex : 'module'
						,flex : 1						
						,sortable : false
						,menuDisabled : true
						,renderer : function( val, params, record, row_index ){
							if( record.data.chk ){
								sm.select( row_index, true );
							}
							return val;
						}				
					}
					,{
						header : 'Save'
						,dataIndex : 'save'
						,xtype : 'checkcolumn'
						,width : 80
						,sortable : false
						,menuDisabled : true
						,listeners : checkListeners
						,renderer : columnRenderer
					}
					,{
						header : 'Edit'
						,dataIndex : 'edit'
						,xtype : 'checkcolumn'
						,width : 80
						,sortable : false
						,menuDisabled : true
						,listeners : checkListeners
						,renderer : columnRenderer
					}
					,{
						header : 'Delete'
						,dataIndex : 'del'
						,xtype : 'checkcolumn'
						,width : 80
						,sortable : false
						,menuDisabled : true
						,listeners : checkListeners
						,renderer : columnRenderer
					}
					,{
						header: 'Print'
						,dataIndex: 'print'
						,xtype: 'checkcolumn'
						,width: 80
						,sortable : false
						,menuDisabled : true
						,listeners: checkListeners
						,renderer: columnRenderer
					}
				]
				,listeners : {
					afterrender : function(){
						loadGrid( {
							mtype : mtype
							,bmapsUID : data.bmapsUID
						} );
					}
				}
			} );
		}
		
		function loadGrid( params ){
			var grid = Ext.getCmp( 'gridModules' + _module );
			grid.store.load( {
				params : {
					mtype : params.mtype
					,bmapsUID : params.bmapsUID
				}
				,callback : function(){
					grid.getView().refresh();
				}
			} );
		}
		
		function saveModules(){
			var dataInArray = new Array();
			var selections = Ext.getCmp( 'gridModules' + _module ).selModel.getSelection();
			for( i = 0; i< Ext.getCmp( 'gridModules' + _module ).selModel.getCount(); i++ ){
				var dataNew = selections[i].data;
				console.warn( dataNew.edit )
				dataInArray.push({
					idmodule 	: dataNew.idmodule
					,mtype		: dataNew.mtype
					,save 		: dataNew.save
					,edit 		: dataNew.edit
					,del 		: dataNew.del
					,print 		: dataNew.print
				});					
			}
			
			// return false
			
			Ext.Ajax.request({  
				url: _route+'savedModules'
				,params: { 
					items   : Ext.encode( dataInArray )
					,bmapsUID : Ext.getCmp( 'userName_winMod' + _module ).getValue()
					,fullName : Ext.getCmp( 'userName_winMod' + _module ).getRawValue()
					,mtype 	: Ext.getCmp( 'menu_winMod' + _module ).getValue()
					,idmodule : _idmodule
				}
				,success: function(){
					standards.callFunction( '_promptMsg',{
						msg	   : 'Record has been successfully saved.'
						,varId : 'errmsg2'
						,success : true
					});
				}
			});	
		}
		win.show();
	}
	
	function _deleteRecord( data ){
		data.confirmDelete( {
			url : _route + 'deleteRecord'
			,params : {
				bmapsUID : data.bmapsUID
				,fullName : data.bmapsFullName
				,idmodule : _idmodule
			}
			,success : function( response ){
				var ret = Ext.decode( response.responseText )
					,match = parseInt( ret.match, 10 );
				if( match == 1 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'EDIT_UNABLE'
					} );
				}
				else if( match == 2 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'You are not allowed to delete your own account.'
					} );
				}
				else{
					standards.callFunction( '_createMessageBox', {
						msg : 'DELETE_SUCCESS'
						,fn : function(){
							var store = Ext.getCmp( 'gridHistory' + _module ).getStore();
							if( store.getCount() ==1 && store.currentPage != 1  ){
								store.currentPage--;
							}
							store.load( {} );
							if( Ext.getCmp( 'bmapsUID' + _module ).value == data.bmapsUID ){
								_resetForm( _module.getForm() );
							}
						}
					} )
				}
			}
		} );
	}
		
	return {
		initMethod : function( params ){
			_baseurl = params.baseurl;
			_canSave = params.canSave;
			_canEdit = params.canEdit;
			_canDelete = params.canDelete;
			_canPrint = params.canPrint;
			_idmodule = params.idmodule;
			_module = params.module;
			_route = params.route;
			_pageTitle = params.pageTitle;
			
			return _mainPanel( params );
		}
	}
}();