var Notificationlogs = function(){
	var baseurl, route, module, canDelete;
	
	function _init(){
		Ext.getCmp( "gridHistory" + module ).store.load();
	}
	
	function _mainPanel( config ){
	
		var searchTypeStore = standards.callFunction( '_createLocalStore' ,{
						data:[
							'Full Name'
							,'Username'
							,'User Type'
							,'Module'
						]
					} );
					
		var dataListStore = standards.callFunction( '_createRemoteStore' ,{
						fields:[
							{
								name	: 'id'
								,type	: 'number'
							}
							,'name'
						]
						, url: 	route + 'getFilter'
					} );
		
		var store = standards.callFunction(  '_createRemoteStore' ,{
				fields:[
					 'logDateAndTime'
					,'fullName'
					,'bgsUname'
					,'userType'
					,'module'
					,'description'
				]
				,url: route + 'getHistory'
		});
		
		
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,moduleType	: 'form'
			,isCenter 	: false
			,noHeader 	: true
			,minHeight	: 700
			,minWidth 	: 1600
			,tbar:{
				noFormButton: true
				,noListButton: true
			}
			,formItems:[
				standards.callFunction( '_gridPanel',{
						id		: 'gridHistory' + module
						,module	: module
						,hasNumRows: true
						,store	: store
							,tbar:{
								// route: route
								content: [
								{
									xtype : 'container'
									,layout : 'column'
									,items: [
										standards.callFunction( '_createCombo', {
											id:'filterType' + module
											,fieldLabel:'Filter By'
											,store:searchTypeStore
											,valueField : 'id'
											,displayField : 'name'
											,editable:false
											,labelWidth:75
											,width:250
											,style:'margin-left:5px'
											,listeners:{
												select:function( combo, record, index ){
													Ext.getCmp( 'filterTypeList' + module).store.removeAll();
													Ext.getCmp( 'filterTypeList' + module).setValue("");
												}
											}
										})
									
										,standards.callFunction( '_createCombo', {
											id:'filterTypeList' + module
											,fieldLabel:''
											,store:dataListStore
											// ,editable:false
											,labelWidth:75
											,width:250
											,style:'margin-left:5px'
											,valueField : 'id'
											,displayField : 'name'
											,reQuery 	:	false
											,listeners:{
												beforequery: function(){
													
												
													if( Ext.getCmp( 'filterType' + module ).getValue() === null )
													{
														standards.callFunction( '_createMessageBox', {
															msg : 'Please select type'
														});
														return;
													}
														this.store.proxy.extraParams.filterBy = Ext.getCmp('filterType' + module).getValue();
														delete this.lastQuery;
												}
											}
										})
									
										,standards.callFunction( '_createDateRange', {
											id:'dateRange' + module
											,module: module
											,fromFieldLabel : 'From'
											,fromLabelWidth : 35
											,style 	: 	"margin-left: 5px"
											,fieldLabel:'Submitted On'
											,noTime: true
											,fromWidth: 250
										})
										
									
										,{
											xtype	: 	'button'
											,id 	: 	'viewGrid' + module
											,text	:	'View'
											,iconCls:	'glyphicon glyphicon-search'
											,style 	: 	"margin-left: 5px"
											,listeners: {
												click: function() {
													if( Ext.getCmp( 'filterType' + module ).getValue() === null || Ext.getCmp( 'filterTypeList' + module ).getValue() === null )
													{
														standards.callFunction( '_createMessageBox', {
															msg : 'Please fill the fields'
														});
														return;
													}else{
													store.currentPage = 1;
														var grd = Ext.getCmp( "gridHistory" + module );
														grd.store.proxy.extraParams.sdate = Ext.getCmp('sdate'+module).getValue();
														grd.store.proxy.extraParams.edate = Ext.getCmp('edate'+module).getValue();
														grd.store.proxy.extraParams.filterType = Ext.getCmp( 'filterType' + module ).getValue();
														grd.store.proxy.extraParams.filterTypeList = Ext.getCmp( 'filterTypeList' + module ).getValue();
														grd.store.proxy.extraParams.filterDispTypeList = Ext.getCmp( 'filterTypeList' + module ).getDisplayValue();
														store.load({
															callback: function(){
																if( store.getCount() == 0 ){
																	standards.callFunction( '_createMessageBox', {
																		msg : 'no records found.'
																	});
																}
															}
														});
													}
												}
											}
										}
									
										,{
											xtype	: 	'button'
											,id 	: 	'refreshGrid' + module
											,text	:	'Refresh'
											,iconCls:	'glyphicon glyphicon-refresh'
											,style 	: 	"margin-left: 3px"
											,listeners: {
												click: function() {

													Ext.getCmp( 'edate' + module ).setValue( new Date() );
													Ext.getCmp( 'sdate_Notificationlogs' ).reset()
													Ext.getCmp( "gridHistory" + module ).store.load();
													Ext.getCmp( 'filterType' + module ).reset("");
													Ext.getCmp( 'filterTypeList' + module ).setValue("");
													Ext.getCmp( 'filterTypeList' + module ).store.removeAll();
												}
											}
										}

										,{
											xtype	: 	'button'
											,id 	: 	'backUp' + module
											,text	:	'Close'
											,iconCls:	'glyphicon glyphicon-refresh'
											,style 	: 	"margin-left: 3px"
											,listeners: {
												click: function() {
													Ext.Ajax.request({
													     url: route + 'closeYear'
													     ,data: {
													     	schoolYear: 4
													     }
													     ,success: function(response, opts) {
													         var obj = Ext.decode(response.responseText);
													         console.dir(obj);
													     },

													     failure: function(response, opts) {
													         console.log('server-side failure with status code ' + response.status);
													     }
													 });
												}
											}
										}
									]
								}
									
									
								]
							}
			
					
					,columns: [
						{
							header		: 'Date and Time'
							,dataIndex	: 'logDateAndTime'
							,minWidth	: 150
						}
						,{
							header		: 'Full Name'
							,dataIndex	: 'fullName'
							,minWidth	: 150
							,columnWidth: 10
						}
						,{
							header		: 'User Name'
							,dataIndex	: 'bgsUname'
							,width		: 150
						}
						,{
							header		: 'User Type'
							,dataIndex	: 'userType'
							,minWidth	: 150
							,columnWidth: 10
						}
						,{
							header		: 'Module'
							,dataIndex	: 'module'
							,width		: 150
						}
						,{
							header		: 'Description'
							,dataIndex	: 'description'
							,flex		: 1 
							,minWidth	: 150
							,columnWidth: 10
						}
					]
				})
		
				,standards.callFunction( '_createTextField', {
					id : 'bgsUname' + module
					,allowBlank : true
					,style : "display : none"
					,vtype : 'email'
				} )
				
				,standards.callFunction( '_createTextField', {
					id : 'bgsUKey' + module
					,allowBlank : true
					,minLength : 5
					,maxLength : 255
					,style : "display : none"
					,minLengthText : 'Password must have more than 4 characters.'
					,inputType : 'password'
					,msgTarget : 'under'
				} )
		
			]
			,listeners: {
				afterrender : _init
			}
		});
	
	}
	
	
	function _getHistory(){
	}

	
	return{
		initMethod:function( config ){
			route		= config.route;
			baseurl		= config.baseurl;
			module		= config.module;
			canDelete	= config.canDelete;
			
			return _mainPanel( config );
		}
	}
}();