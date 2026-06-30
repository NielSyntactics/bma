/** Batch Receivable module
  * [Developer]
  * Developer: Jayson Montareal Dagulo
  * Date Created: April 3, 2019
  * Date Finished: April 16, 2019
  
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
 var Paymentreport = function(){
	/* variable declarations(Private) */
	var _baseurl, _canSave, _canEdit, _canDelete, _canPrint, _idmodule, _module, _route, _pageTitle, onEdit = 0, mainSY = 0;
	var visibility = true;
	var arrRowIndex = new Array();
	/* _module Main Container
	 * _module components container, handles most of the control in the form( Standards )
	 * @parameter params - configuration variables
	 * @private
	 * @return Ext.tab.Tab
	*/

	function _init(){
		Ext.Ajax.request( {
			url: _route + 'getMainSchoolYear'
			,method: 'POST'
			,success: function( response ){
				var resp = Ext.decode( response.responseText )
				mainSY = parseInt( resp.view, 10 );
				Ext.getCmp('schoolYearID' + _module).setValue( mainSY );
			}
		} )

		setTimeout( function(){
			Ext.getCmp( 'mainPanel' + _module ).doLayout();
		}, 500 );
	}

	function _mainPanel( params ){
		var	categoryStore = standards.callFunction( '_createLocalStore' ,{
			data:[
				'Catering'  //1
				,'Robotics'  //2
				,'Extra-Curricular'  //3
				,'Christmas'  //4
				,'Family Day'  //5
				,'Picture'  //6
				,'Grad Fee'  //7
				,'Scouting/Camping'  //8
				,'Others'  //9
				,'Nutrition Day'  //10
				,'Moving Up/Recognition'  //11
				,'Annual Registration'  //12
				,'Tuition'  //13
				,'Books'  //14
				,'Uniform'  //15
			]
			,startAt: 1
		} );
		var monthStore = standards.callFunction( '_createLocalStore', {
			data:[
				'January'
				,'February'
				,'March'
				,'April'
				,'May'
				,'June'
				,'July'
				,'August'
				,'September'
				,'October'
				,'November'
				,'December'
			]
			,startAt: 1
		} );
		var	schoolYearStore = standards.callFunction( '_createRemoteStore' ,{
			fields: [
				{ name : 'schoolYearID'
					,type : 'number'
				}
				,{ name : 'schoolYearStart'
					,type : 'number'
				}
				,'schoolYearDis'
			]
			,url: _route + 'getSchoolYear'
		} );
		var	gradeLevelStore = standards.callFunction( '_createRemoteStore' ,{
			fields: [
				{ name : 'gradeLevelID'
					,type : 'number'
				}
				,'gradeLevelName'
			]
			,url: _route + 'getGradeLevel'
		} );
		return standards.callFunction( '_mainPanel', {
			config : params
			,moduleType : 'form'
			,isCenter : false
			,noExcelButton: true
			,noPDFButton: true
			,formWidthAuto: true
			,noHeader: true
			,mainPanelScroll : true
			,hasComponentSeparator: ''
			,tbar : {
				noListButton : true
				,noFormButton : true
			}
			,formItems : [
				{	xtype: 'container'
					,layout: 'column'
					,items: [
						{	xtype: 'container'
							,style: 'margin-right: 5px;'
							,items: [
								standards.callFunction( '_createCombo', {
									id: 'batchReceivableCategoryID' + _module
									,fieldLabel: 'Payment Category'
									,store: categoryStore
									,width: 300
									,labelWidth: 125
									,forceSelection: true
									,value: 13
								} )
								,standards.callFunction( '_createCombo', {
									id: 'gradeLevelID' + _module
									,fieldLabel: 'Grade Level'
									,store: gradeLevelStore
									,width: 300
									,labelWidth: 125
									,displayField: 'gradeLevelName'
									,valueField: 'gradeLevelID'
									,forceSelection: true
									,listeners: {
										afterrender: function(){
											var me = Ext.getCmp( 'gradeLevelID' + _module );
											me.store.load( {
												callback: function(){
													me.setValue( 1 )
												}
											} )
										}
									}
								} )
							]
						}
						,{	xtype: 'container'
							,items: [
								/* standards.callFunction( '_createCombo', {
									id: 'month' + _module
									,fieldLabel: 'Month'
									,store: monthStore
									,width: 300
									,labelWidth: 95
									,forceSelection: true
									,hidden: true
									,value: 1
								} )
								, */standards.callFunction( '_createCombo', {
									id: 'schoolYearID' + _module
									,fieldLabel: 'School Year'
									,store: schoolYearStore
									,valueField: 'schoolYearID'
									,displayField: 'schoolYearDis'
									,width: 300
									,labelWidth: 95
									,forceSelection: true
									,listeners: {
										afterrender: function(){
											var me = Ext.getCmp( 'schoolYearID' + _module );
											me.store.load( {
												callback: function(){
													me.setValue( mainSY )
												}
											} )
										}
									}
								} )
							]
						}
					]
				}
				,{	xtype : 'button'
					,iconCls : 'glyphicon glyphicon-search'
					,text : 'View'
					,style : 'margin-right : 5px;'
					,handler : function(){
						_viewResult();
					}
				}
				,{	xtype : 'button'
					,iconCls : 'glyphicon glyphicon-refresh'
					,text : 'Reset'
					,style : 'margin-right : 5px;'
					,handler : function(){
						_resetHandler();
					}
				}
				,{	xtype : 'panel'
					,style: 'margin-top: 10px;margin-right: 5px;'
					,minWidth: 1200
					,maxWidth: 1300
					,border: false
					,tbar: [
						'->'
						,{	xtype: 'button'
							,iconCls: 'pdf-icon'
							,handler: function(){
								var doc = document.getElementById( 'displayReport' + _module )
								if( !doc.innerHTML ){
									standards.callFunction( '_createMessageBox', {
										msg: 'No record to print.'
										,icon: 'error'
									} );
								}
								else{
									var batchReceivableCategoryID = Ext.getCmp( 'batchReceivableCategoryID' + _module )
										,gradeLevelID = Ext.getCmp( 'gradeLevelID' + _module )
										// ,month = Ext.getCmp( 'month' + _module )
										,schoolYear = Ext.getCmp( 'schoolYearID' + _module )
										,schoolYearID = schoolYear.value
										,schoolYearIndex = schoolYear.getStore().findExact( 'schoolYearID', schoolYearID )
										,schoolYearStart = ( schoolYearIndex > 0? schoolYear.getStore().getAt( schoolYearIndex ).get( 'schoolYearStart' ) : 0 )
									Ext.Ajax.request( {
										url: _route + 'printPDF'
										,params: {
											title: _pageTitle
											,batchReceivableCategoryID: batchReceivableCategoryID.value
											,paymentCategory: batchReceivableCategoryID.getRawValue()
											,gradeLevelID: gradeLevelID.value
											,gradeLevel: gradeLevelID.getRawValue()
											,schoolYearID: schoolYearID
											,schoolYearStart: schoolYearStart
											,schoolYearDis: schoolYear.getRawValue()
										}
										,success: function(res){
											window.open( _baseurl + 'pdf/report/' + _pageTitle + '.pdf');
										}
									} );
								}
							}
						}
					]
				}
				,{	xtype: 'container'
					,style: 'margin-right: 5px;'
					,minWidth: 1200
					,maxWidth: 1300
					,html : '<div id = "displayReport' + _module + '" style="width: 100%"> </div>'
				}
			]
			,listeners: {
				afterrender: _init
			}
		} )
	}
	
	function _resetHandler(){
		_module.getForm().reset();
		// Ext.getCmp( 'month' + _module ).setVisible( false );
		var schoolYear = Ext.getCmp( 'schoolYearID' + _module );
		schoolYear.store.load( {
			callback: function(){
				if( schoolYear.getStore().getRange().length > 0 ){
					schoolYear.setValue( schoolYear.store.getAt( 0 ).get( 'schoolYearID' ) );
				}
			}
		} );
		var gradeLevel = Ext.getCmp( 'gradeLevelID' + _module );
		gradeLevel.store.load( {
			callback: function(){
				gradeLevel.setValue( 1 );
			}
		} );
		var displayReport = document.getElementById( 'displayReport' + _module ).innerHTML = '';
	}
	
	function _printFormResult(){
		
	}
	
	function _viewResult(){
		var batchReceivableCategoryID = Ext.getCmp( 'batchReceivableCategoryID' + _module ).value
			,gradeLevelID = Ext.getCmp( 'gradeLevelID' + _module ).value
			// ,month = Ext.getCmp( 'month' + _module ).value
			,schoolYear = Ext.getCmp( 'schoolYearID' + _module )
			,schoolYearID = schoolYear.value
			,schoolYearIndex = schoolYear.getStore().findExact( 'schoolYearID', schoolYearID )
			,schoolYearStart = ( schoolYearIndex > 0? schoolYear.getStore().getAt( schoolYearIndex ).get( 'schoolYearStart' ) : 0 );
		Ext.Ajax.request( {
			url: _route + 'viewReport'
			,method: 'post'
			,msg: 'Generating report, please wait...'
			,params: {
				batchReceivableCategoryID: batchReceivableCategoryID
				,gradeLevelID: gradeLevelID
				// ,month: month
				,schoolYearID: schoolYearID
				,schoolYearStart: schoolYearStart
			}
			,success : function( response, option ){
				var resp = Ext.decode( response.responseText )
					,viewHTML = resp.view;
				document.getElementById( 'displayReport' + _module ).innerHTML = viewHTML;
			}
		} )
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