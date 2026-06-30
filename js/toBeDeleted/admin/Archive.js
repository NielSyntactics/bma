/*
	Developer: Roj Zim Jamil A. Janubas (Bogitics)
	
	date: May 25, 2017
	
	description: 
		The function for this module is to close previous school years not less than 2 years ago.
		Admin can archive the school year, what this function does is it creates a backup of the 
		whole database and deletes the current school year that is archived.

*/
var Archive = function(){
	var baseurl, route, module, canDelete;
	
	function _init(){
		Ext.getCmp( "gridHistory" + module ).store.load();
	}
	
	function _mainPanel( config ){
	
		var searchTypeStore = standards.callFunction( '_createRemoteStore' ,{
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
					 'schoolyearID'
					,'schoolYearDescription'
					,'status'
					,'closingDetails'
					,'archiveDetails'
					,'closeShow'
					,'btnShow'
				]
				,url: route + 'getSchoolYears'
		});
		
		
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,moduleType	: 'form'
			,isCenter 	: false
			,noHeader 	: true
			,minHeight	: 700
			,minWidth 	: 1500
			// ,sortable 	: false
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
						,sortable: false
							,tbar:{
								// route: route
								content: [
								{
									xtype : 'container'
									,layout : 'column'
									,items: [
										standards.callFunction( '_createCombo', {
											id:'filterType' + module
											,fieldLabel:'Select a school year'
											,store:searchTypeStore
											,valueField : 'id'
											,displayField : 'name'
											,editable:false
											,labelWidth:140
											,width: 360
											,style:'margin-left:5px'
										})
									
										,{
											xtype	: 	'button'
											,id 	: 	'viewGrid' + module
											,text	:	'View'
											,iconCls:	'glyphicon glyphicon-search'
											,style 	: 	"margin-left: 5px"
											,listeners: {
												click: function() {
													var filterStore = Ext.getCmp( "filterType" + module )
													Ext.getCmp( "gridHistory" + module ).store.load({
														params: {
															filterType: filterStore.getValue()
														}
													})
												// 	if( Ext.getCmp( 'filterType' + module ).getValue() === null || Ext.getCmp( 'filterTypeList' + module ).getValue() === null )
												// 	{
												// 		standards.callFunction( '_createMessageBox', {
												// 			msg : 'Please fill the fields'
												// 		});
												// 		return;
												// 	}else{
												// 	store.currentPage = 1;
												// 		var grd = Ext.getCmp( "gridHistory" + module );
												// 		grd.store.proxy.extraParams.sdate = Ext.getCmp('sdate'+module).getValue();
												// 		grd.store.proxy.extraParams.edate = Ext.getCmp('edate'+module).getValue();
												// 		grd.store.proxy.extraParams.filterType = Ext.getCmp( 'filterType' + module ).getValue();
												// 		grd.store.proxy.extraParams.filterTypeList = Ext.getCmp( 'filterTypeList' + module ).getValue();
												// 		grd.store.proxy.extraParams.filterDispTypeList = Ext.getCmp( 'filterTypeList' + module ).getDisplayValue();
												// 		store.load({
												// 			callback: function(){
												// 				if( store.getCount() == 0 ){
												// 					standards.callFunction( '_createMessageBox', {
												// 						msg : 'no records found.'
												// 					});
												// 				}
												// 			}
												// 		});
												// 	}
												// }
											}
										}
									}
									]
								}
									
									
								]
							}
			
					
					,columns: [
						{
							header		: 'School Year'
							,dataIndex	: 'schoolYearDescription'
							,minWidth	: 150
						}
						,{
							header		: 'Status'
							,dataIndex	: 'status'
							,minWidth	: 100
							,columnWidth: 10
						}
						,{
							header		: 'Closing Details'
							,dataIndex	: 'closingDetails'
							,width		: 150
							,flex		: 1
						}
						,{
							header		: 'Archiving Details'
							,dataIndex	: 'archiveDetails'
							,minWidth	: 450
							,columnWidth: 10
						}

						,standards.callFunction( '_createActionColumn', {
							icon		: 'pencil'
							,tooltip	: 'Edit record'
							,Func		: _closeArchiveYear
							,button 	: true
							,text 		: 'Active'
							,width 		: 100
						})
						// ,{
						// 	header		: ''
						// 	,dataIndex	: 'module'
						// 	,width		: 150
						// }
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
	
	
	function _promtMessageBox( txt ){
	}

	function _closeArchiveYear( data ){
		var closingType = 0;
		var txt = '';
		switch( data.status ){
			case 'Active':
				txt = 'Closing a school year will lock all its activities and grading sheets. Teachers will no longer be able to edit those records. Please note that this action is not reversible. Are you sure you want to close this school year?';
				closingType = 1;

				standards.callFunction( '_createMessageBox', {
					msg		: 	txt
					,action	: 'confirm'
					,fn		: function( btn ){
						if( btn != 'yes' ){
							return false;
						}
					submitArchiveYear( data, closingType );
					}
				});
				break;

			case 'Closed':
				txt = 'Archiving a school year will permanently delete the activities, grading sheets and classes from the database. These data could not be viewed anymore in the system after archiving. Please note that this action is not reversible. Are you sure you want to archive this school year?'
				closingType = 2;

				standards.callFunction( '_createMessageBox', {
					msg		: 	txt
					,action	: 'confirm'
					,fn		: function( btn ){
						if( btn != 'yes' ){
							return false;
						}
					submitArchiveYear( data, closingType );
					}
				});
				break;

			default: 
				return 0; 
		}
	}

	function submitArchiveYear( data, closingType  ) {

		Ext.Ajax.request({
		    url: route + 'updateSchoolYear',
		    params: {
		        schoolyearID : data.schoolyearID
		        ,closingType : closingType
		    },
		    success: function(response){
		        var ret = Ext.decode( response.responseText );
		        var fileName = '';
		        if( ret.match == 2 ) {
		        	Ext.getCmp( "gridHistory" + module ).store.load();
					standards.callFunction( '_createMessageBox', {
						msg : 'School year has been successfully closed'
					});
		        }
		        else if( ret.match == 3 ){
		        	Ext.getCmp( "gridHistory" + module ).store.load();
					standards.callFunction( '_createMessageBox', {
						msg : 'School year has been successfully archived.'
					});
					fileName = ret.file
					window.open(route+'download/'+fileName);
		        }
		        else {
					standards.callFunction( '_createMessageBox', {
						msg : 'Something went wrong.'
					});
		        }
		    }
		});
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