var userlogs = function(){
	var baseurl, route, module, canDelete;
	var pageTitle = 'User Logs';
	
	function init(){
		Ext.getCmp('gridHistory'+module).store.load( );
		Ext.getCmp( 'searchBy' + module ).store.load({
			callback: function( me ){
				Ext.getCmp( 'searchBy' + module ).setValue( 0 );
			}
		});
	}
	
	/* Module GUI */
	
	/* Module main panel
	 * Create a form view to be added on the main tab
	 * @private
	 * @return form
	*/	
	
	function mainPanel( config ){
		
		var staff = standards.callFunction(  '_createRemoteStore' ,{
							fields:[
								'euID'
								,'staffname'
							], 
							url: route + "getStaff",
					});
		
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,moduleType	: 'report'
			,border		: false
			,afterResetHandler : init
			// ,tbar:'empty'
			// ,moduleType	: 'report'
			,formItems:[
				{
					xtype:'container'
					,layout:'column'
					,items:[
						standards.callFunction( '_createCombo', {
							id:'searchBy'+module
							,store: staff
							,fieldLabel:'Name'
							,valueField: 'euID'
							,displayField: 'staffname'
							,style: 'margin-right: 20px'
							
						})
						,standards.callFunction( '_createDateRange',{
							sdateID:'sdate' + module
							,edateID:'edate' + module
							,noTime:true
							,width:160
							,fromWidth:270
							,fromFieldLabel:'From'
						})
					]
				}
			]
			,moduleGrids : myGrid()
			,listeners: {
				afterrender : init
			}
		});
	}
	
	/* End of module GUI */
	
	/* Module  Data Table*/
	
	/* Module my grid
	 * Show list of Holiday events
	 * @private
	 * @return gridHistory
	*/
	
	function myGrid(){
		
		var store = standards.callFunction(  '_createRemoteStore' ,{
							fields:[
								'logid'
								,'dateTimeLog'
								,'fullname'
								,'username'
								,'userType'
								,'reference'
								,'description'
							], 
							url: route + "getList",
					});

			console.log(store);
		
		return standards.callFunction( '_gridPanel',{
			id: 'gridHistory' + module
			,module: module
			,store: store
			,tbar:{
				canPrint: 1
				,route: route
				,pageTitle: 'User action logs'
				// ,customListExcelHandler: _printExcel
				// ,customListPDFHandler: _printPDF
			}
			,columns:[
				{
					header:'Date and Time'
					,dataIndex:'dateTimeLog'
					,minWidth: 150
				}
				,{
					header:'Full Name'
					,dataIndex:'fullname'
					,flex: 1
					,minWidth: 100
				}
				,{
					header:'Username'
					,dataIndex:'username'
					,flex: 1
					,minWidth: 100
				}
				,{
					header:'User Type'
					,dataIndex:'userType'
					,flex: 1
					,minWidth: 100
				}
				,{
					header:'Reference'
					,dataIndex:'reference'
					,flex: 1
					,minWidth: 100
				}
				,{
					header:'Description'
					,dataIndex:'description'
					,minWidth: 400
					,columnWidth:25
				}
				
			]
			
		} );
	}	
	
	return{
		initMethod:function( config ){
			route		= config.route;
			baseurl		= config.baseurl;
			module		= config.module;
			canDelete	= config.canDelete;
			
			return mainPanel( config );
		}
		
		,test: function(){
			Ext.Ajax.request( {
				url : route + 'INSERT'
				,method : 'post'
				,success : function( response, options ){
				
				}
			} );
		}
	}
}();