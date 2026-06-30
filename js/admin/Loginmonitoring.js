/** User settings module
  * [Developer]
 * Developer: Mark Reynor D. Magriña
  * Date Created: May. 12, 2018
  * Date Finished: May. 15, 2018
  
  * [Database]
	 modules, amodules, and class
	
  * [Description]
	This module allows the authorized administrators to set (add, edit or delete) users who will be allowed to access the system. 
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
var Loginmonitoring = function(){
	/* variable declarations(Private) */
	var _baseurl, _canSave, _canEdit, _canDelete, _canPrint, _idmodule, _module, _route, _pageTitle;
	var _oldRowIndex = -1, comboGradeLevelID;
	
	/* Module Main Container
	 * module components container, handles most of the control in the form( Standards )
	 * @parameter params - configuration variables
	 * @private
	 * @return Ext.tab.Tab
	*/
	function _mainPanel( params ){
		var filterStore =	standards.callFunction( '_createLocalStore', {
								fields : [ 'id' ,'name' ]
								,data : [
									{ 'id' : 1 ,'name' : 'Full Name'}
									,{ 'id' : 2 ,'name' : 'Username'}
									,{ 'id' : 3 ,'name' : 'User Type'}
									,{ 'id' : 4 ,'name' : 'Module'}
									// ,{ 'id' : 5 ,'name' : 'Module2'}
								]
							} );

		var searchStore =	standards.callFunction( '_createRemoteStore', {
							fields : [ 'name', 'id' ]
							,url : _route + 'retrieveSearch'
						} )
					
		
		
		return standards.callFunction( '_mainPanel', {
			config : params
			// ,moduleType : 'form'
			,moduleType : 'report'
			,minWidth : 1020
			,minHeight : 530
			,isCenter : false
			,tbar : {
				// saveFunc : _saveForm
				// ,resetFunc : _resetForm
				// ,listLabel : 'List'
				// noPDFButton: false
				PDFHidden: true
				,noExcelButton: true
			}
			,formItems : [
				{
					xtype: 'container'
					,id: 'id-container'
					,layout: 'column'
					,width: '100%'
					,height: 25
					,items:[
							standards.callFunction( '_createCombo', {
							id : 'filterBy' + _module
							,fieldLabel : 'Filter By'
							,labelWidth: 80
							,width: 225
							,module : _module
							,idmodule : _idmodule
							,store : filterStore
							,editable : false
							,allowBlank : true
							,style: 'margin-right: 10px;'
							,listeners : {
								select : function(){
									filterStore.currentPage = 1;
									var me = this;
									searchStore.proxy.extraParams.by = me.value;
									Ext.getCmp( 'userRetrieve' + _module ).store.load();
								}
							}
						} )
						,standards.callFunction( '_createCombo', {
							id : 'userRetrieve' + _module
							,fieldLabel : ''
							,emptyText: 'Select'
							,labelWidth: 80
							,width: 225
							,module : _module
							,idmodule : _idmodule
							,store : searchStore
							,editable : true
							,allowBlank : true
							,style: 'margin-right: 10px;'
							,displayField : 'name'
							,valueField: 'id'
							,listeners : {
									select : function(){
									}
							}
						} )
						,standards.callFunction( '_createDateRange', {
							module: 'dateRange' + _module
							,fromFieldLabel: 'Date Start'
							,fromLabelWidth: 70
							,fromWidth: 180
							// ,noTime: true
							,style: 'margin-right: 10px;'
						} )
						
					]
				}
			]
			,moduleGrids : [
				_gridReport()
			]
		} );
	}
		
	function _gridReport(){
		var store =	standards.callFunction( '_createRemoteStore', {
						fields: [ 'logid' , 'fullName' ,'userName' ,'userType' ,'logDateAndTime' ,'bmapsUID' ,'idmodule' ,'module' ,'description' ]
						,url : _route + 'getLogs'
					} );
					
		return standards.callFunction( '_gridPanel', {
			id : 'gridReport' + _module
			,module : _module
			,store : store
			,layout: 'fit'
			,noDefaults : true
			,hasNumRows: true
			,minHeight : 600
			,style: 'height:600px;'
			// ,heigth: auto
			,tbar : {}
			,columns : [
				// {	header : 'Log ID'
				// 	,dataIndex : 'logid'
				// 	,minWidth : 200
				// }
				// ,
				{	header : 'Date and Time'
					,dataIndex : 'logDateAndTime'
					,minWidth : 200
				}
				,{	header : 'Full Name'
					,dataIndex : 'fullName'
					// ,flex : 1
					,minWidth : 350
				}
				,{	header : 'User Name'
					,dataIndex : 'userName'
					,width : 200
				}
				,{	header : 'User Type'
					,dataIndex : 'userType'
					,align: 'center'
				}
				,{	header : 'Module'
					,dataIndex : 'module'
					,width : 200
				}
				,{	header : 'Description'
					,dataIndex : 'description'
					,width : 400
					,flex : 1
				}
			]
		} )
	}
		
	
	/* Process Reset form
	 * clear form values, restoring form component values to its original state
	 * @private
	 * @return void
	*/
	// function _resetForm( form ){
		
		// form.reset();
		// _oldRowIndex = -1;
		
		// Ext.getCmp( 'bmapsUKey' + _module ).allowBlank = false;
		// Ext.getCmp( 'bmapsUKey' + _module ).submitValue = true;
		// Ext.getCmp( 'bmapsUKey' + _module ).reset( true );
		// Ext.getCmp( 'bmapsUKey' + _module ).show();		
		// Ext.getCmp( 'confirmPass' + _module ).allowBlank = false;
		// Ext.getCmp( 'confirmPass' + _module ).reset( true );
		// Ext.getCmp( 'confirmPass' + _module ).show();
		
		// Ext.getCmp( 'bmapsUfirstname' + _module ).setVisible( true );
		// Ext.getCmp( 'bmapsUfirstname' + _module ).setValue( '' );
		// Ext.getCmp( 'bmapsUfirstname' + _module ).allowBlank = false;
		// Ext.getCmp( 'bmapsUlastname' + _module ).setVisible( true );
		// Ext.getCmp( 'bmapsUlastname' + _module ).setValue( '' );
		// Ext.getCmp( 'bmapsUlastname' + _module ).allowBlank = false;		
		
	// }
		
	
	
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