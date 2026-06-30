/** Daily Collection Report module
  * [Developer]
  * Developer: Jayson Montareal Dagulo
  * Date Created: April 25, 2019
  * Date Finished: 
  
  * [Database]
	bma_ps.accountcard
	bma_ps.payment
	
  * [Description]
  * 	Display collections from account card per day
 * [Modification]
   
 **/
 var Dailycollectionreport = function(){
	/* variable declarations(Private) */
	var _baseurl, _canSave, _canEdit, _canDelete, _canPrint, _idmodule, _module, _route, _pageTitle, onEdit = 0;
	var visibility = true;
	var arrRowIndex = new Array();
	/* _module Main Container
	 * _module components container, handles most of the control in the form( Standards )
	 * @parameter params - configuration variables
	 * @private
	 * @return Ext.tab.Tab
	*/

	function _init(){
		
		Ext.get( 'btnList' + _module ).dom.click();
		Ext.getCmp( 'btnEnrolled_List' + _module ).setVisible( false );
		
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
			,minWidth : 2000
			,minHeight	: 800
			,autoSetCombo : false
			,hasComponentSeparator: ''
			,noListButton : true
			,noExcelButton: true
			,noPDFButton: true
			,tbar : { }
			,extraFormTab : [
				{	
					buttonLabel : 'Enrolled List'
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
									,{	xtype: 'container'
										,padding: '2 0 0 5'
										,layout: 'vbox'
										,style: 'background-color: #fde6ce !important; width: 2868px;'
										,items: [
											{	xtype: 'container'
												,columnWidth: 1
												,layout: 'column'
												,items: [
													standards.callFunction( '_createNumberField', {
														id : 'totalTuitionCollection' + _module
														,fieldLabel: 'Total'
														,width : 447
														,labelWidth: 292
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalBooksCollection' + _module
														,width : 150
														,style: 'margin-left: 300px;'
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalAnnualRegistrationCollection' + _module
														,width : 150
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalUniformCollection' + _module
														,width : 150
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalCateringCollection' + _module
														,width : 150
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalExtraCurricularCollection' + _module
														,width : 150
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalChristmasCollection' + _module
														,width : 150
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalFamilyDayCollection' + _module
														,width : 150
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalPictureCollection' + _module
														,width : 150
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalGradFeeCollection' + _module
														,width : 150
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalScoutingCollection' + _module
														,width : 150
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalCharityCollection' + _module
														,width : 150
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalNutritionCollection' + _module
														,width : 150
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalMovingUpCollection' + _module
														,width : 165
														,readOnly : true
														,allowNegative : true
													} )
													,standards.callFunction( '_createNumberField', {
														id : 'totalOthersCollection' + _module
														,width : 150
														,readOnly : true
														,allowNegative : true
													} )
												]
											}
											,standards.callFunction( '_createNumberField', {
												id : 'gradTotal' + _module
												,fieldLabel: 'Grand Total'
												,style: 'margin-top: 5px;'
												,width : 447
												,labelWidth: 292
												,readOnly : true
												,allowNegative : true
											} )
										]
									}
								]
							}
						]
					}
					,buttonHandler : function( ){
						
					}
				}
			]
			,formItems : []
			,listeners : {
				afterrender : _init 
			}
		} );
	}
	
	function _gridHistory(){
		var store = standards.callFunction( '_createRemoteStore', {
			fields : [
				'studentName'
				,'orNum'
				,'remarks'
				,'trNum'
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
			]
			,url : _route + 'getBalances'
		} );
		return standards.callFunction( '_gridPanel', {
			id :  'gridHistoryList' + _module
			,module : _module
			,store : store
			,noDefaults : true
			,hasNumRows : false
			,noPage : true
			,noDefaultListeners : true
			,width: 2868
			,height: 350
			,features : { ftype: 'summary' }
			,tbar : {
				noExcel: true
				,noPDF : true
				,content : [
					{	xtype: 'container'
						,layout: 'column'
						,id: 'grdSearchContainer' + _module
						,items: [
							standards.callFunction( '_createDateField' ,{
									id : 'asOfDate' + _module
									,labelWidth: 0
									,width: 150
									,listeners: {
										afterrender: function(){
											var me = Ext.getCmp( 'asOfDate' + _module )
												,store = Ext.getCmp( 'gridHistoryList' + _module ).store;
											store.proxy.extraParams.asOfDate = me.getValue();
											store.load( {
												callback: function(){
													_computeTotal();
												}
											} );
										}
									}
								}
							)
							,{	xtype : 'button'
								,text : 'View'
								,style: 'margin-left: 5px; margin-right: 5px'
								,iconCls : 'glyphicon glyphicon-search'
								,handler : function(){
									var _store = Ext.getCmp(  'gridHistoryList' + _module )
									_store.store.proxy.extraParams.asOfDate = Ext.getCmp( 'asOfDate' + _module ).getValue()
									_store.store.load( {
										callback: function(){
											_computeTotal();
											if( _store.store.getCount() <= 0 ) {
												standards.callFunction( '_createMessageBox', {
													msg : 'No records found.'
												} );
											}
										}
									} )
								}
							}
							,{	xtype : 'button'
								,text : 'Refresh'
								,style: 'margin-right: 5px'
								,iconCls : 'glyphicon glyphicon-refresh'
								,handler : function(){
									Ext.getCmp( 'asOfDate' + _module ).reset();
									var _store = Ext.getCmp(  'gridHistoryList' + _module )
									_store.store.proxy.extraParams.asOfDate = Ext.getCmp( 'asOfDate' + _module ).getValue()
									_store.store.load( {
										callback: function(){
											_computeTotal();
											if( _store.store.getCount() <= 0 ) {
												standards.callFunction( '_createMessageBox', {
													msg : 'No records found.'
												} );
											}
										}
									} )
									
								}
							}
							,{	
								xtype:		'button'
								,iconCls:	'pdf-icon'
								,handler:	function(){
									if( _canPrint ){
										Ext.Ajax.request( {
											url: _route + 'printPDF'
											,params: {
												title: _pageTitle
												,asOfDate:  Ext.getCmp( 'asOfDate' + _module ).getValue()
											}
											,success: function(res){
												window.open( _baseurl + 'pdf/report/' + _pageTitle + '.pdf');
											}
										} );
										
									}
									else{
										standards.callFunction( '_createMessageBox', {
											msg : 'You are currently not authorized to print, please contact the administrator.'
										} );
									}
		
								}
							}
							,{	
								xtype:		'button'
								,iconCls:	'excel'
								,style: 'margin-left: 5px'
								,handler:	function(){
									if( _canPrint ){
										
										Ext.Ajax.request({
											url: _route + 'printEXCEL'
											,params: {
												title: _pageTitle
												,asOfDate:  Ext.getCmp( 'asOfDate' + _module ).getValue()
											}
											,success: function(res){
												var path  = _route.replace( _baseurl, '' );
												var index = path.indexOf('/');
												window.open( _baseurl + "standards/Standards/download/" + _pageTitle + '' + '/' + path.substring( 0, index ) );
											}
										});
										
									}
									else{
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
					,sortable: false
					,draggable: false
				}
				,{	header : 'OR #'
					,dataIndex : 'orNum'
					,minWidth : 150
					,columnWidth : 20
					,sortable: false
				}
				,{
					header		: 'Tuition'
					,dataIndex	: 'tuition'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,sortable: false
					,draggable: false
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalTuitionCollection' + _module ).setValue( value )
					}
				}
				,{	header : 'Remarks'
					,dataIndex : 'remarks'
					,sortable: false
					,draggable: false
					,minWidth : 150
				}
				,{	header : 'TR #'
					,dataIndex : 'trNum'
					,sortable: false
					,draggable: false
					,minWidth : 150
				}
				,{
					header		: 'Books'
					,dataIndex	: 'books'
					,width		: 150
					,sortable: false
					,draggable: false
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalBooksCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Annual Reg.'
					,dataIndex	: 'annualRegistration'
					,sortable: false
					,draggable: false
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalAnnualRegistrationCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Uniform'
					,dataIndex	: 'uniform'
					,sortable: false
					,draggable: false
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalUniformCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Catering'
					,dataIndex	: 'catering'
					,sortable: false
					,draggable: false
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalCateringCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Extra-Curricular'
					,dataIndex	: 'extraCurricular'
					,width		: 150
					,sortable: false
					,draggable: false
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalExtraCurricularCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Christmas'
					,dataIndex	: 'christmas'
					,width		: 150
					,sortable: false
					,draggable: false
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalChristmasCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Family Day'
					,dataIndex	: 'familyDay'
					,width		: 150
					,align		: 'right'
					,sortable: false
					,draggable: false
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalFamilyDayCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Picture'
					,dataIndex	: 'picture'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,sortable: false
					,draggable: false
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalPictureCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Grad Fee'
					,dataIndex	: 'gradFee'
					,width		: 150
					,sortable: false
					,draggable: false
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalGradFeeCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Scouting/Camping'
					,dataIndex	: 'scouting'
					,sortable: false
					,draggable: false
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalScoutingCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Charity'
					,dataIndex	: 'charity'
					,sortable: false
					,draggable: false
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalCharityCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Nutrition Day'
					,dataIndex	: 'nutrition'
					,width		: 150
					,sortable: false
					,draggable: false
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalNutritionCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Moving Up/Recognition'
					,dataIndex	: 'movingUp'
					,width		: 165
					,align		: 'right'
					,sortable: false
					,draggable: false
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalMovingUpCollection' + _module ).setValue( value )
					}
				}
				,{
					header		: 'Others'
					,dataIndex	: 'others'
					,width		: 150
					,align		: 'right'
					,sortable: false
					,draggable: false
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex){
						Ext.getCmp( 'totalOthersCollection' + _module ).setValue( value )
					}
				}
			]
		} );
	}
	
	function _computeTotal(){
		Ext.getCmp( 'gradTotal' + _module ).setValue(
			Ext.getCmp( 'totalTuitionCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalBooksCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalAnnualRegistrationCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalUniformCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalCateringCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalExtraCurricularCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalChristmasCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalFamilyDayCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalPictureCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalGradFeeCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalScoutingCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalCharityCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalNutritionCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalMovingUpCollection' + _module ).getValue()
			+ Ext.getCmp( 'totalOthersCollection' + _module ).getValue()
		);
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