/** Coop Member Report Module
  * [Developer]
  * Developer: Renz Seger T. Bu-ong
  * Date Created: Jan. 18, 2016
  * Date Finished: Jan. 18, 2016
  
  * [Database]
	
	
  * [Description]
	This module allows the authorized users to generate coop member report of which it is based on the inputted data in the Individual Profile module.
  
 * [Modification]
   
 **/

var Coopmemberreport = function(){
	var baseurl, route, module, canDelete, pageTitle;
	
	function _init(){
		
	}
	
	function _mainPanel( config ){
	
		var typeStore = standards.callFunction( '_createLocalStore',{
								fields: [ 'name', 'id' ]
								,data:[
									{ name: 'All', id: 2 }
									,{ name: 'Member', id: 0 }
									,{ name: 'Not Member', id: 1 }
								]
							});
						
		var classStore = standards.callFunction( '_createLocalStore' ,{
							fields: [ 'name', 'id' ]
							,data:[
								{ name: 'All', id: 0 }
								,{ name: 'Vote and Campaign', id: 1 }
								,{ name: 'Vote Only', id: 2 }
								,{ name: 'undecided', id: 3 }
							]
						} );
	
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,module		: module
			,route		: route
			,moduleType	: 'report'
			,vertical: false
			,formItems:[
				{
					xtype:'container'
					,defaults:{
						xtype:	'container'
						,width: 400
					}
					,layout: 'column'
					,items:[
						{
							items: [
								standards.callFunction( '_createCombo', {
									id	: 'type' + module
									,store: typeStore
									,fieldLabel: 'Type'
									,module	: module
									,value: 2
									,displayField: 'name'
									,valueField: 'id'
								})
								,standards.callFunction( '_createCombo', {
									type	: 'city'
									,module	: module
									,allowBlank: false
									,hasAll: true
								})
								,standards.callFunction( '_createCombo', {
									type	: 'province'
									,module	: module
									,allowBlank: false
									,hasAll: true
								})
								,standards.callFunction( '_createCombo', {
									type	: 'region'
									,module	: module
									,allowBlank: false
									,hasAll: true
								})
							]
						}
						,{
							items: [
								standards.callFunction( '_createCombo', {
									type	: 'barangay'
									,module	: module
									,width	: 390
									,allowBlank: false
									,hasAll: true
								})
								,standards.callFunction( '_createCombo', {
									id	: 'classification' + module
									,store: classStore
									,fieldLabel: 'Vote Classification'
									,module	: module
									,value: 0
									,width	: 390
									,displayField: 'name'
									,valueField: 'id' 
								})
								,standards.callFunction( '_createDateRange', {
									id:'dateRange' + module
									,module: module
									,fromFieldLabel : 'From'
									,fieldLabel:'Submitted On'
									,noTime: true
									,fromWidth: 250
								})
							]
						}
					]
				}
			]
			,moduleGrids : _dailyReportGrid( )
			,listeners: {
				afterrender : _init
			}
		});
	}
	
	function _dailyReportGrid( ){
		var store = standards.callFunction(  '_createRemoteStore' ,{
							fields:[
								'profName'
								,'gender'
								,'bdate'
								,'precinctName'
								,'houseNumber'
								,'barangayName'
								,'cityMunicipalityName'
								,'provinceName'
								,'regionName'
								,'classification'
								,'coopName'
							]
							,url: route + "getProfiles"
					});
					
		return standards.callFunction( '_gridPanel',{
			id: 'gridList' + module
			,module: module
			,store: store
			,noDefaultRow: true
			,tbar:{
				route: route
				,canPrint: 1
				,pageTitle: pageTitle
				,customListExcelHandler: _printExcel
				,customListPDFHandler: _printPDF
			}
			,features:{ftype: 'summary'}
			,bbar:[
				'->'
				,standards.callFunction( '_createTextField', {
					id:'totalWorkHours' + module
					,fieldLabel:'Total No. of Members'
					,labelWidth: 150
					,width: 320
					,fieldStyle: 'text-align:right'
				})
			]
			,columns:[
				{
					header:'Name'
					,dataIndex:'defaultInformationDescription'
					,dataIndex: 'profName'
					,flex: 1
					,minWidth: 100
					,columnWidth:10
				}
				,{
					header: 'Gender'
					,dataIndex: 'gender'
					,columnWidth:6
				}
				,{
					header: 'Birthdate'
					,dataIndex: 'bdate'
					,columnWidth:6
				}
				,{
					header: 'Precint No.'
					,dataIndex: 'precinctName'
					,columnWidth:6
				}
				,{
					header: 'House No.'
					,dataIndex: 'houseNumber'
					,columnWidth:5
				}
				,{
					header: 'Barangay'
					,dataIndex: 'barangayName'
					,columnWidth:7
					,minWidth: 100
					,flex: 1
				}
				,{
					header: 'City/Municipality'
					,dataIndex: 'cityMunicipalityName'
					,columnWidth:9
					,minWidth: 150
				}
				,{
					header: 'Province'
					,dataIndex: 'provinceName'
					,flex: 1
					,minWidth: 100
					,columnWidth:10
				}
				,{
					header: 'Region'
					,dataIndex: 'regionName'
					,columnWidth:8
				}
				,{
					header: 'Vote Classification'
					,dataIndex: 'classification'
					,columnWidth:6
					,minWidth: 140
				}
				,{
					header: 'Coop Name'
					,dataIndex: 'coopName'
					,columnWidth:10
				}
				// ,{
					// header:'Total Hours'
					// ,dataIndex:'TotalWorkedHours'
					// ,columnWidth:7
					// ,summaryType: function( a, x ) {
						// var m = 0;
						// var h = 0;
						// var Hourmin = 0;
						// var hourHour = 0;
						// var min = 0;
						// var totalHour = 0;
						
						// for( x in a ){
							
							// record = a[x].data.TotalWorkedHours;
							// z = record.split(":");
							
							// for( y in z ){
								// if( y == 0 ){
									// h = h + parseInt( z[y], 10 );
								// }
								// else{
									// m = m + parseInt( z[y], 10 );
								// }
							// }
						// }
						
						// hourMin = m / 60;
						// hourHour = parseInt( hourMin, 10 ) + h;
						// min = m % 60;
						// totalHour = ( hourHour < 10 ? '0' : ''  ) + hourHour + " : " + ( min < 10 ? '0' : ''  ) + min;
						
						// return totalHour;
						
					// },
					// summaryRenderer: function(val, summaryData, dataIndex) {
						 // Ext.getCmp( 'totalWorkHours' + module ).setValue( val );
					// }
				// }
			]
			
		} );
	}	
	
	function _printExcel( ){
		
		var filter = Ext.getCmp( 'mainFormPanel' + module ).getForm().used;
		if( filter ){
			filter['title'] = pageTitle;
			filter['memberNum'] = Ext.getCmp( 'gridList' + module ).store.getCount();
		}
		
		Ext.Ajax.request({
			url:	 route + 'printEXCEL',
			params: filter,
			method:	 'post',
			success: function(res){
				window.open( route + "downloadExcel/" + pageTitle);
			}
		});
	}
	
	function _printPDF(){
		var filter = Ext.getCmp( 'mainFormPanel' + module ).getForm().used;
		if( filter ){
			filter['title'] = pageTitle;
			filter['memberNum'] = Ext.getCmp( 'gridList' + module ).store.getCount();
		}
		Ext.Ajax.request({
			url: route + 'printPDF'
			,params: filter
			,method:	 'post'
			,success: function(res){
				window.open( baseurl + 'pdf/reports/' + pageTitle + '.pdf');
			}
		});
	}
	
	return{
		initMethod:function( config ){
			route		= config.route;
			baseurl		= config.baseurl;
			module		= config.module;
			canDelete	= config.canDelete;
			pageTitle   = config.pageTitle;
			
			return _mainPanel( config );
		}
	}
}();