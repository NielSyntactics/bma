/** Collection Report _module
  * [Developer]
  * Developer: Roj Zim Jamil Actub Janubas
  * Date Created: May 21, 2018
  * Date Finished: May 21, 2018
  
  * [Database]
	
	
  * [Description]
  * 	This _module is for transaction reports
  * 	Added hasCustomFilter fo standard to get custom validation for printing PDF and EXCEL for listPDF/listEXCEL route
 * [Modification]
   
 **/
var Collectionreport = function(){
	/* variable declarations(Private) */
	var _baseurl, _canSave, _canEdit, _canDelete, _canPrint, _idmodule, _module, _route, _pageTitle, onEdit = 0;
	var visibility = true;
	var arrRowIndex = new Array()
	/* _module Main Container
	 * _module components container, handles most of the control in the form( Standards )
	 * @parameter params - configuration variables
	 * @private
	 * @return Ext.tab.Tab
	*/

	function _init(){

		Ext.get( 'btnList' + _module ).dom.click();
		
		if( typeof Ext.getCmp( 'btnForm' + _module ) != 'undefined' )
			Ext.getCmp( 'btnForm' + _module ).setVisible( false )
		
		if( typeof Ext.getCmp( 'btnList' + _module ) != 'undefined' )
			Ext.getCmp( 'btnList' + _module ).setVisible( false )
		
		if( typeof Ext.getCmp( 'btnExcel' + _module ) != 'undefined' )
			Ext.getCmp( 'btnExcel' + _module ).setVisible( false )
		
		if( typeof Ext.getCmp( 'btnPDF' + _module ) != 'undefined' )
			Ext.getCmp( 'btnPDF' + _module ).setVisible( false )

	}

	function _mainPanel( params ){
			
		return standards.callFunction( '_mainPanel', {
			config : params
			,moduleType : 'form'
			,formLabel: "Add New Student"
			,isCenter : false
			,minWidth : 3100
			,minHeight	: 800
			,autoSetCombo : false
			,hasComponentSeparator: ''
			,tbar : {
				listLabel : 'Enrolled List'
				,hasCustomFilter: {
					0: 'sBy'
					,1: 's'
					,2: 'sdate'
					,3: 'edate'
				}
			}
			,formItems : []
			,listItems : _gridHistory( )
			,listeners	: 	{
				afterrender 	: 	_init 
			}
		} );
	}

	
	function _gridHistory( ){
		
		function _historyReset(){
			
			var searchBy = Ext.getCmp( 'sBy' + _module)

			searchBy.store.load({

				callback: function(){
					
					searchBy.setValue(0)
					
					searchBy.fireEvent( 'select' );

				}

			})
		
		}

		var store = standards.callFunction( '_createRemoteStore', {

			fields : [
				'studentID'
				,'accountCardSchoolYear'
				,'studentName'
				,'refNum'
				,'paymentDate'
				,'particulars'
				,{ name: 'amount' ,type: 'float' }
			]

			,url : _route + 'getHistory'

		} );
				
		var sByStore = standards.callFunction( '_createLocalStore' ,{

			data:[
				'Student Name'
				,'Type of Fee'
			]

			,startAt: 0

		} );

		var sStore = standards.callFunction( '_createRemoteStore', {

			fields : [ 'id', 'name' ]
			
			,url : _route + 'getFilter'

		} );
		
		return standards.callFunction( '_gridPanel', {
			id :  'gridHistory' + _module
			,module : _module
			,store : store
			,noDefaults : true
			,hasNumRows : true
			,noPage : true
			,features : {ftype: 'summary'}
			,noDefaultListeners : true
			,bbar: [
				'->'
				,standards.callFunction( '_createNumberField', {
					id:'total' + _module
					,width: 150
					,style: "margin-left: 8px !important"
					,readOnly: true
					,allowNegative: true
				})
			]
			,tbar : {
				content : [
					{
						xtype: 'container'
						,layout: 'column'
						,id: 'grdSearchContainer' + _module
						,items: [
							standards.callFunction( '_createCombo', {
								store : sByStore
								,idmodule : _idmodule
								,fieldLabel : 'Search by'
								,id :  'sBy' + _module
								,forceSelection : true
								,listeners : {
									select : function(){
										var me = this;
										var _sStore = Ext.getCmp(  's' + _module )

										_sStore.store.proxy.extraParams.sBy = me.value
										_sStore.store.load({
											callback: function(){
												_sStore.setValue( 0 )
												_sStore.fireEvent( 'select' )
											}
										})
									}
								}
							} )
							,standards.callFunction( '_createCombo', {
								store : sStore
								,idmodule : _idmodule
								,fieldLabel : ''
								,style: 'margin-right: 5px; margin-left: 5px'
								,valueField : 'id'
								,displayField : 'name'
								,id :  's' + _module
								,width: 210
								,listeners : {
									select : function(){
										
										var _store = Ext.getCmp(  'gridHistory' + _module )
										
										_store.store.proxy.extraParams.sBy = Ext.getCmp( 'sBy' + _module ).getValue()
										_store.store.proxy.extraParams.filterBy = this.value
										_store.store.proxy.extraParams.sdate = Ext.getCmp( 'sdate' + _module ).getValue()
										_store.store.proxy.extraParams.edate = Ext.getCmp( 'edate' + _module ).getValue()
										_store.store.load({
											callback: function(){
												if( _store.store.getCount() <= 0 ) {
													standards.callFunction( '_createMessageBox', {
														msg : 'No records found.'
													});
												}
											}
										})

									}
								}
							} )

							,standards.callFunction( '_createDateRange', {
								module : _module
								,fromLabelWidth: 30
								,fromWidth: 150
								,labelWidth: 15
								,width: 150
								,date: new Date()
							} )
							
							,{	xtype : 'button'
								,text : 'View'
								,style: 'margin-left: 5px'
								,iconCls : 'glyphicon glyphicon-search'
								,handler : function(){
									var _store = Ext.getCmp(  'gridHistory' + _module )
									_store.store.proxy.extraParams.sdate = Ext.getCmp( 'sdate' + _module ).getValue()
									_store.store.proxy.extraParams.edate = Ext.getCmp( 'edate' + _module ).getValue()
									_store.store.load({
										callback: function(){
											if( _store.store.getCount() <= 0 ) {
												standards.callFunction( '_createMessageBox', {
													msg : 'No records found.'
												});
											}
										}
									})
								}
							}
							,{	xtype : 'button'
								,text : 'Refresh'
								,style: 'margin-left: 5px; margin-right: 5px'
								,iconCls : 'glyphicon glyphicon-refresh'
								,handler : function(){
									_historyReset()
								}
							}
							,{	
								xtype:		'button'
								,iconCls:	'pdf-icon'
								,handler:	function(){
									if( _canPrint )
									{
										
										Ext.Ajax.request({
											url: _route + 'printPDF'
											,params: {
												title: _pageTitle
												,sBy:  Ext.getCmp( 'sBy' + _module ).getValue()
												,disp_sBy:  Ext.getCmp( 'sBy' + _module ).getDisplayValue()
												,filterBy:  Ext.getCmp( 's' + _module ).getValue()
												,disp_filterBy:  Ext.getCmp( 's' + _module ).getDisplayValue()
												,sdate:  Ext.getCmp( 'sdate' + _module ).getValue()
												,edate:  Ext.getCmp( 'edate' + _module ).getValue()
											}
											,success: function(res){
												window.open( _baseurl + 'pdf/report/' + _pageTitle + '.pdf');
											}
										});
										
									}
									else
									{
										standards.callFunction( '_createMessageBox', {
											msg : 'You are currently not authorized to print, please contact the administrator.'
										});
									}
		
								}
							}
							,{	
								xtype:		'button'
								,iconCls:	'excel'
								,style: 'margin-left: 5px'
								,handler:	function(){
									if( _canPrint )
									{
										
										Ext.Ajax.request({
											url: _route + 'printEXCEL'
											,params: {
												title: _pageTitle
												,sBy:  Ext.getCmp( 'sBy' + _module ).getValue()
												,disp_sBy:  Ext.getCmp( 'sBy' + _module ).getDisplayValue()
												,filterBy:  Ext.getCmp( 's' + _module ).getValue()
												,disp_filterBy:  Ext.getCmp( 's' + _module ).getDisplayValue()
												,sdate:  Ext.getCmp( 'sdate' + _module ).getValue()
												,edate:  Ext.getCmp( 'edate' + _module ).getValue()
											}
											,success: function(res){
												var path  = _route.replace( _baseurl, '' );
												var index = path.indexOf('/');
												window.open( _baseurl + "standards/Standards/download/" + _pageTitle + '' + '/' + path.substring( 0, index ) );
												// window.open( _baseurl + 'csv/report/' + _pageTitle + '');
											}
										});
										
									}
									else
									{
										standards.callFunction( '_createMessageBox', {
											msg : 'You are currently not authorized to print, please contact the administrator.'
										});
									}
		
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
					,columnWidth : 20
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTrans', rec.data)
						}
					}
				}
				,{	header : 'Date of Payment'
					,dataIndex : 'paymentDate'
					,minWidth : 200
					,align : 'right'
					,columnWidth : 20
					,xtype : 'datecolumn'
				}
				,{	header : 'OR/TR Number'
					,dataIndex : 'refNum'
					,minWidth : 150
					,columnWidth : 20
					,align : 'right'
				}
				,{	header : 'Particulars'
					,dataIndex : 'particulars'
					,columnWidth : 20
					,flex : 1
				}
				,{	header : 'Amount'
					,dataIndex : 'amount'
					,columnWidth : 20
					,minWidth : 200
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType:'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) {
						Ext.getCmp( 'total' + _module ).setValue( value );
					}
				}
			]
			
			,listeners	: 	{
				afterrender 	: function(){

					_historyReset()
					
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