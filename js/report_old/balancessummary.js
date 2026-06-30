/** Balances Summary _module
  * [Developer]
  * Developer: Roj Zim Jamil Actub Janubas
  * Date Created: June 6, 2018
  * Date Finished: June 6, 2018
  
  * [Database]
	
	
  * [Description]
  * 	This _module is for transaction reports
  * 	Added hasCustomFilter fo standard to get custom validation for printing PDF and EXCEL for listPDF/listEXCEL route
 * [Modification]
   
 **/
var Balancessummary = function(){
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
		Ext.getCmp( 'btnForm' + _module ).setVisible( false )
		Ext.getCmp( 'btnEnrolled_List' + _module ).setVisible( false )
		Ext.getCmp( 'btnList' + _module ).setVisible( false )
		Ext.getCmp( 'btnExcel' + _module ).setVisible( false )
		Ext.getCmp( 'btnPDF' + _module ).setVisible( false )
	}

	function _mainPanel( params ){
			
		return standards.callFunction( '_mainPanel', {
			config : params
			,moduleType : 'form'
			,formLabel: "Add New Student"
			,isCenter : false
			,minWidth : 2000
			,minHeight	: 800
			,autoSetCombo : false
			,hasComponentSeparator: ''
			,noListButton : true
			,noExcelButton: true
			,noPDFButton: true
			,tbar : {
				// content: [
				// 	'->'
				// 	,{	
				// 		xtype:		'button'
				// 		,iconCls:	'excel'
				// 		,style: 'margin-left: 5px'
				// 		,handler:	function(){
				// 		}
				// 	}
				// ]
			}
			,extraFormTab : [
				{	
					buttonLabel : 'Enrolled List'
					// ,id: 
					,buttonIconCls : 'glyphicon glyphicon-align-justify'
					,items :	
					{	
						xtype:	'container'
						,layout : 'fit'
						,items:	[
									
							{	
								xtype:	'container'
								,items:	[
									_gridHistory()
								]
							}

						]
					}
					,buttonHandler : function( ){
						
					}
				}

				// ,{	
				// 	buttonLabel : ''
				// 	,buttonIconCls : 'pdf-icon'
				// 	,items :	
				// 	{	
				// 		xtype:	'container'
				// 		,layout : 'fit'
				// 		,items:	[]
				// 	}
				// 	,buttonHandler : function( ){
						
				// 	}
				// }

				// ,{	
				// 	buttonLabel : ''
				// 	,buttonIconCls : 'excel'
				// 	,items :	
				// 	{	
				// 		xtype:	'container'
				// 		,layout : 'fit'
				// 		,items:	[]
				// 	}
				// 	,buttonHandler : function( ){
						
				// 	}
				// }

			]
			,formItems : []
			// ,listItems : _gridHistory( )
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
				'accountCardID'
				,'studentID'
				,'studentName'
				,'gradeLevelName'
				,'accountCardSchoolYear'
				,{ name: 'annualRegistration' ,type: 'float' }
				,{ name: 'tuition' ,type: 'float' }
				,{ name: 'books' ,type: 'float' }
				,{ name: 'uniform' ,type: 'float' }
				,{ name: 'catering' ,type: 'float' }
				,{ name: 'extraCurricular' ,type: 'float' }
				,{ name: 'christmas' ,type: 'float' }
				,{ name: 'familyDay' ,type: 'float' }
				,{ name: 'picture' ,type: 'float' }
				,{ name: 'gradFee' ,type: 'float' }
				,{ name: 'scouting' ,type: 'float' }
				,{ name: 'charity' ,type: 'float' }
				,{ name: 'nutrition' ,type: 'float' }
				,{ name: 'movingUp' ,type: 'float' }
				,{ name: 'others' ,type: 'float' }
				,{ name: 'totalReceivables' ,type: 'float' }
				,{ name: 'totalPayments' ,type: 'float' }
				,{ name: 'totalBalance' ,type: 'float' }
			]

			,url : _route + 'getBalances'
			,autoLoad: false

		} );
				
		var sByStore = standards.callFunction( '_createLocalStore' ,{

			data:[
				'Grade Level'
				,'Student Name'
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
			,hasNumRows : false
			,noPage : true
			,noDefaultListeners : true
			,width: 3000
			,height: 500
			,features : { ftype: 'summary' }
			,tbar : {
				noExcel: true
				,noPDF : true
				,content : [
					{
						xtype: 'container'
						,layout: 'column'
						,id: 'grdSearchContainer' + _module
						,items: [
							standards.callFunction( '_createCombo', {
								store : sByStore
								,idmodule : _idmodule
								,fieldLabel : 'Search by'
								,style: 'margin-right: 5px'
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
								,width: 210
								,style: 'margin-right: 5px'
								,valueField : 'id'
								,displayField : 'name'
								,id :  's' + _module
								,listeners : {
									select : function(){
										
										var _store = Ext.getCmp(  'gridHistory' + _module )
										
										_store.store.proxy.extraParams.sBy = Ext.getCmp( 'sBy' + _module ).getValue()
										_store.store.proxy.extraParams.filterBy = this.value
										_store.store.proxy.extraParams.asOfDate = Ext.getCmp( 'asOfDate' + _module ).getValue()
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

							,standards.callFunction( '_createDateField' ,{
									id 				: 	'asOfDate' + _module
									,labelWidth: 0
									,width: 150
								}
							)
							
							,{	xtype : 'button'
								,text : 'View'
								,style: 'margin-left: 5px; margin-right: 5px'
								,iconCls : 'glyphicon glyphicon-search'
								,handler : function(){
									var _store = Ext.getCmp(  'gridHistory' + _module )
									_store.store.proxy.extraParams.asOfDate = Ext.getCmp( 'asOfDate' + _module ).getValue()
									// _store.store.proxy.extraParams.edate = Ext.getCmp( 'edate' + _module ).getValue()
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
								,style: 'margin-right: 5px'
								,iconCls : 'glyphicon glyphicon-refresh'
								,handler : function(){
									
									var searchBy = Ext.getCmp( 'sBy' + _module)

									searchBy.store.load({

										callback: function(){
											
											searchBy.setValue(0)
											
											searchBy.fireEvent( 'select' );

										}

									})
									
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
												,filterBy:  Ext.getCmp( 's' + _module ).getValue()
												,asOfDate:  Ext.getCmp( 'asOfDate' + _module ).getValue()
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
												,filterBy:  Ext.getCmp( 's' + _module ).getValue()
												,asOfDate:  Ext.getCmp( 'asOfDate' + _module ).getValue()
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
			
			,bbar :
			[
				,'->'
				,{
					xtype: 'container'
					,layout: 'column'
					,items: 
					[
						standards.callFunction( '_createNumberField', {
								id : 'totalAnnualRegistrationTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalTuitionTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalBooksTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalUniformTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalCateringTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalExtracurricularTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalChristmasTotalReceivable' + _module
								,width : 150
								,isNumber : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalFamilyDayTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalPictureTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalGradFeeTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalScoutingTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalCharityTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalNutritionTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalMovingUpTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalOthersTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalBeginningBalance' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalTotalPayments' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalTotalBalance' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
							}
						)
					]
				}
			]
			,columns : [
				{	header : 'Student Name'
					,dataIndex : 'studentName'
					,minWidth : 150
					,columnWidth : 20
				}
				,{	header : 'Grade Level'
					,dataIndex : 'gradeLevelName'
					,minWidth : 150
					,columnWidth : 20
				}
				,{
					header		: 'Annual Registration'
					,dataIndex	: 'annualRegistration'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalAnnualRegistrationTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Tuition'
					,dataIndex	: 'tuition'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalTuitionTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Books'
					,dataIndex	: 'books'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalBooksTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Uniform'
					,dataIndex	: 'uniform'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalUniformTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Catering'
					,dataIndex	: 'catering'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalCateringTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Extra-Curricular'
					,dataIndex	: 'extracurricular'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalExtracurricularTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Christmas'
					,dataIndex	: 'christmas'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalChristmasTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Family Day'
					,dataIndex	: 'familyDay'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalFamilyDayTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Picture'
					,dataIndex	: 'picture'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalPictureTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Grad Fee'
					,dataIndex	: 'gradFee'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalGradFeeTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Scouting/Camping'
					,dataIndex	: 'scouting'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalScoutingTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Charity'
					,dataIndex	: 'charity'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalCharityTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Nutrition Day'
					,dataIndex	: 'nutrition'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalNutritionTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Moving Up/Recognition'
					,dataIndex	: 'movingUp'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalMovingUpTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Others'
					,dataIndex	: 'others'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalOthersTotalReceivable' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Beginning Balance'
					,dataIndex	: 'totalReceivables'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalBeginningBalance' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Total Payments'
					,dataIndex	: 'totalPayments'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalTotalPayments' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Total Balance'
					,dataIndex	: 'totalBalance'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						Ext.getCmp( 'totalTotalBalance' + _module ).setValue( value )
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