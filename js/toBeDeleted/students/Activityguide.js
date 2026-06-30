var Activityguide = function(){
	var baseurl, route, module, canDelete, _idmodule;
	

						
	function _init(){
		Ext.getCmp( "gridHistory" + module ).store.load();
		// Ext.getCmp( "gridHistory" + module ).store.load();
	}
	
						
	
	function _mainPanel( config ){
	
	var schoolYearStore = standards.callFunction( '_createRemoteStore' ,{
						fields:[
							{
								name	: 'schoolYearID'
								,type	: 'number'
							}
							,'schoolYearDescription'
						]
						, url: 	route + 'getSchoolYears'
					} );
						
	var activitytypeStore	=	standards.callFunction( '_createRemoteStore' ,{
							fields:[
								{
									name	: 'activityType'
									,type	: 'number'
								}
								,'activityTypeDescription'
							]
							, url: 	route + 'getActivityType'
						} );
	
	
	var paymentStatusStore = standards.callFunction( '_createLocalStore' ,{
							data:[
								'Paid'
								,'Not Paid'
							]
						} );
						
				
						
	var	classificatoinStore = standards.callFunction( '_createLocalStore' ,{
							data:[
								'Performance'
								,'Written Works'
								,'Quizzes'
								
							]
						} );
						
	var	wrrittenWorksStore = standards.callFunction( '_createLocalStore' ,{
							data:[
								'CHED'
								,'Montessori'
							]
						} );
	
	var DataSubjectsStore	=	standards.callFunction( '_createRemoteStore' ,{
							fields:[
								{
									name	: 'subjectID'
									,type	: 'number'
								}
								,'subjectDescription'
							]
							, url: 	route + 'retrieveDataSubjects'
						} );
						
	
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,moduleType	: 'form'
			,isCenter	: false
			,minHeight	: 700
			,tbar:{
				saveFunc 	 : _saveForm
				,resetFunc	 : _resetForm
				// ,listLabel	 : 'List'
				// ,filter:{
					// displayField: 'name'
					// ,table:	'coop'
					// ,customQuery:true
					// ,subFilters:[
						// 'Coop Name'
						// ,'Acronym'
						// ,'Street'
						// ,'Barangay'
						// ,'City/Municipality'
					// ]
				// }
			}
			
			,formItems:[
				{	xtype:	'fieldset'
					,defaults 	:
					{
						xtype 	: 	'container'
						,style 	: 	'margin-top: 5px'
					}
					,items:[
						
					{
						xtype		: 	'container'
						,layout 	: 	'column'
						,items: 	
						[
							{
								xtype 	: 	'container'
								,isCenter	: false
								,items:
								[
									standards.callFunction( '_createTextField' ,{
			 								id 				: 	'bgsUID' + module
					 						,maxLength 		: 	50
					 						,inputType 		: 	'hidden'
					 						,value 			: 	0
					 						,style 			: 	'display: none'
				 						} 
					 				)
									
									,standards.callFunction( '_createTextField' ,{
			 								id 				: 	'activityID' + module
					 						,maxLength 		: 	50
					 						,inputType 		: 	'hidden'
					 						,value 			: 	0
					 						,style 			: 	'display: none'
				 						} 
					 				)

								]
							}	
							
							,{
								xtype 		: 	'container'
								,isCenter	: 	false
								,width 		:	450
								,items:
								[
									,standards.callFunction( '_createCombo' ,{
											id 				: 	'schoolYear' + module
											,allowBlank 	: 	false
											,fieldLabel 	: 	'School Year'
											,width			: 	430
											,allowBlank		: 	false
											,store 			: 	schoolYearStore
											,valueField 	:   "schoolYearID"
											,displayField	: 	"schoolYearDescription"
											,listeners: {
												select: function(combo, record, index) {
													// alert();
													// _resetForm();
													var id = combo.getValue();
													module.getForm().retrieveData({
														url: route+'retrieveData'
														,onEdit: false
														,goToForm: false
														,params:{
															classSchoolYearID : id
														}
														,success: function( a,b,c ){
															console.log( c );
															Ext.getCmp('studentGradeLevelHistoryID' + module ).setValue("")
															Ext.getCmp( 'gradeLevelID' + module ).setValue( "" );
															console.log(a.activityCode);
															if( c.match == 0 )
															{
																var actCode = a.activityCode;
																	actCode = actCode.toString().split(".");
																	if(actCode[1] >= 0)
																		actCode[1]	=	parseInt(actCode[1]) + 1;
																	else
																		console.log( "DEFAULT" );
																var actNewNumber = parseInt(actCode[0]) + '.' + actCode[1];
																Ext.getCmp( 'studentGradeLevelHistoryID' + module ).setValue( a.gradeLevelDescription );
																Ext.getCmp( 'gradeLevelID' + module ).setValue( a.gradeLevelID );
																Ext.getCmp( 'activityCode' + module ).setValue( actNewNumber );
															}
														}
													});
													
			
			
												}
											}
										}
									)
									
									// hiddenField
									,standards.callFunction( '_createTextField' ,{
											id 				: 	'gradeLevelID' + module
											,inputType		: 	'hidden'
										}
									)
									
									,standards.callFunction( '_createTextField' ,{
											id 				: 	'classID' + module
											,inputType		: 	'hidden'
										}
									)

									// END
									
									,standards.callFunction( '_createTextField' ,{
											id 				: 	'studentGradeLevelHistoryID' + module
											,fieldLabel 	: 	'Grade Level'
											,width			: 	430
											// ,store 			:	gradeLevelStore
											,valueField 	:   "gradeLevelID"
											,displayField	: 	"gradeLevelDescription"
										}
									)

					 				// ,standards.callFunction(  '_createCombo' ,{
					 						// id 				: 	'subjectID' + module
					 						// ,fieldLabel 	: 	'Subject'
					 						// ,allowBlank 	: 	false
					 						// ,maxLength 		: 	50
											// ,width			: 	430
											// ,store 			:	DataSubjectsStore
											// ,valueField 	:   "subjectID"
											// ,displayField	: 	"subjectDescription"
					 					// }
					 				// )
									
									,standards.callFunction( '_createCombo', {
										id 				: 	'subjectID' + module
										,type 			: 	'subject'
										,allowBlank 	: 	false
										,maxLength 		: 	50
										,width			: 	430
										,idmodule 		: 	_idmodule
										,module 		: 	_module
									} )

					 				,standards.callFunction( '_createTextField' ,{
					 						id 				: 	'activityCode' + module
					 						,fieldLabel 	: 	'Activity Code'
					 						,allowBlank 	: 	false
					 						,maxLength 		: 	50
											,width			: 	430
					 					} 
					 				)

					 				// ,standards.callFunction( '_createCombo' ,{
					 						// id 				: 	'activityType' + module
					 						// ,fieldLabel 	: 	'Activity Type'
					 						// ,allowBlank 	: 	false
											// ,width			: 	430
											// ,store			: 	activitytypeStore
											// ,valueField 	:   "activityType"
											// ,displayField	: 	"activityTypeDescription"
					 					// }
					 				// )
									
									,standards.callFunction( '_createCombo', {
										id 				: 	'activityType' + module
										,type 			: 	'activity type'
										,fieldLabel 	: 	'Activity Type'
										,allowBlank 	: 	false
										,idmodule 		: 	_idmodule
										,module 		: 	_module
										,width			: 	430
										// ,store			: 	activitytypeStore
										// ,valueField 	:   "activityType"
										// ,displayField	: 	"activityTypeDescription"
									} )
									
									,standards.callFunction( '_createDateField' ,{
											id 				: 	'activityDate' + module
											,allowBlank 	: 	false
											,fieldLabel 	: 	'Date'
											,width			: 	430
										}
									)
											
					 				
								]
							}

							,{
								xtype 		: 	'container'
								,style 		: 	'margin-left: 10px'
								,width 		:	480
								,items:
								[
									standards.callFunction( '_createCombo' ,{
			 								id 				: 	'activityClassification' + module
					 						,fieldLabel 	: 	'Classification'
					 						,allowBlank		: 	false
					 						,maxLength 		: 	100
											,width			: 	430
											,store 			: 	classificatoinStore
											,allowBlank		: 	false
											,listeners: {
												select: function(combo, record, index) {
													Ext.getCmp( 'activityWrittenWorkType' + module ).allowBlank = ( combo.getValue() == 3 ) ? false : true;
													if( !Ext.getCmp( 'activityWrittenWorkType' + module ).allowBlank )
														Ext.getCmp('activityWrittenWorkType' + module).setFieldLabel(Ext.getCmp('activityWrittenWorkType' + module).getFieldLabel().replace("*",""))
												}
											}
				 						} 
					 				)

					 				,standards.callFunction(  '_createCombo' ,{
					 						id 				: 	'activityWrittenWorkType' + module
					 						,fieldLabel 	: 	'Written Works Type'
											,width			: 	430
											,store 			: 	wrrittenWorksStore
											,allowBlank		: 	false
											
					 					}
					 				)

					 				,standards.callFunction( '_createTextField' ,{
					 						id 				: 	'activiyNumberOfItems' + module
					 						,fieldLabel 	: 	'Number of Items'
					 						,allowBlank 	: 	false
					 						,maxLength 		: 	100
											,width			: 	430
					 					} 
					 				)
									
									,standards.callFunction( '_createTextArea' ,{
					 						id 				: 	'activityDescription' + module
					 						,fieldLabel 	: 	'Desctiption'
											,width			: 	430
					 					} 
					 				)

					 				,standards.callFunction( '_createCheckField' ,{
					 						id 				: 	'activityInactiveTag' + module
					 						,fieldLabel 	: 	'Status'
											,checked		: 	true
											,boxLabel 		: 	"<span>Inactive </span>"
					 					}
					 				)
								]
							}			
								
						]
					}
								
							]
						}
					]
				,moduleGrids : _getHistory( )
				,listeners	: 	{
					afterrender 	: 	_init 
				}
		});
	}
	
	
	// gridMod
	function grid_winMod( data ){
		var store = standards.callFunction(  '_createRemoteStore' ,{
							fields:[
								 'studentID'
								,'gradeLevelDescription'
								,'schoolYearDescription'
								,'dateUpdated'
							]
							,url: route + 'retrieveDataGradeLevel'
					});
					
		console.log( store );
					
		return standards.callFunction( '_gridPanel',{
			id				: 'modalGridHistory' + module
			,module			: module
			,store			: store
			,noDefaultRow 	: 	true
			
			,columns: [
				{
					header		: 'Grade Level'
					,dataIndex	: 'gradeLevelDescription'
					,flex		: 1 
					,minWidth	: 150
				}
				,{
					header		: 'School Year'
					,dataIndex	: 'schoolYearDescription'
					,minWidth	: 150
					,columnWidth: 10
				}
				,{
					header		: 'dateUpdated'
					,dataIndex	: 'dateUpdated'
					,width		: 150
				}
			]
		});
	}
	
	// GradeLevelHistoryModal
	function gradeLevelHistory( data ){
	
	console.log( "test2" );
		Ext.create( 'Ext.Window', {
			id:'studentLevelHistory'+module
			,title:'Grade Level History'
			,width: 600
			,modal:true
			,closable:false
			,resizable:false
			,frame : true
			,defaults: {
				anchor: '100%'
			}
			,listeners:{
				show: function(){
					Ext.getCmp('modalGridHistory' + module ).store.load({
						params 	: 	{
							studentID 	: 	Ext.getCmp( 'studentID' + module ).getValue()
						}
					});
				}
			}
			,bbar: [
				{
					text: 'Close',
					handler: function () { this.up('window').close(); }
				}
			]
			,items: [
				{
					xtype:	'form'
					,id:'formPass'+module
					,module:module
					,border:false
					,buttonAlign:'right'
					,bodyPadding:5
					,items:[
						grid_winMod()
					]
				}
				
			]
		}).show();
	}
	
	
	function _printExcel(){
		
	}
	
	function _printPDF(){
		
	}
	
	function _getHistory(){

		var store = standards.callFunction(  '_createRemoteStore' ,{
							fields:[
								// {
									// name	:	studentID
									// ,type	:	number
								// }
								 'schoolYearDescription'
								,'gradeLevelDescription'
								,'subjectDescription'
								,'activityCode'
								,'activityTypeDescription'
								,'activityDate'
								,'activityClassification'
								,'activiyNumberOfItems'
								,'activityInactiveTag'
								,'activityID'
							]
							,url: route + 'getHistory'
					});
		var searchTypeStore = standards.callFunction( '_createLocalStore' ,{
						data:[
							'School Year'
							,'Grade Level'
							,'Subject'
							,'Activity Code'
							,'Type'
							,'Status'
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
					
		return standards.callFunction( '_gridPanel',{
			id		: 'gridHistory' + module
			,module	: module
			,store	: store
			,noDefaultRow 	: 	true
								
			,tbar:{
				// route: route
				content: [
					standards.callFunction( '_createCombo', {
						id:'filterType' + module
						,fieldLabel:'Search By'
						,store:searchTypeStore
						,editable:false
						,labelWidth:75
						,width:250
						,style:'margin-left:5px'
					})
					
					,standards.callFunction( '_createCombo', {
						id:'filterTypeList' + module
						,fieldLabel:''
						,store:dataListStore
						,editable:false
						,labelWidth:75
						,width:250
						,style:'margin-left:5px'
						,reQuery 	:	false
						,listeners:{
							select:function( combo, record, index ){
							console.log( this.getValue() );
							console.log( record );
							console.log( index );
								store.load({
									params:{
										filter	:	this.getValue()
										,tableID:	Ext.getCmp( 'filterType' + module).getValue()
									}
								});
							}
							,beforequery: function(){
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
					
					,{
						xtype	: 	'button'
						,id 	: 	'refreshGrid' + module
						,iconCls:	'glyphicon glyphicon-refresh'
						// ,style 	: 	"background: transparent; border: transparent"
						,handler: function(){
												// gradeLevelHistory();
												Ext.getCmp( 'filterType' + module ).setValue("")
												Ext.getCmp( 'filterTypeList' + module).setValue("")
						}
					}
					
					
				]
			}
			,columns: [
				{
					header		: 'School Year'
					,dataIndex	: 'schoolYearDescription'
					,flex		: 1 
					,minWidth	: 150
				}
				,{
					header		: 'Grade Level'
					,dataIndex	: 'gradeLevelDescription'
					,minWidth	: 150
					,columnWidth: 10
				}
				,{
					header		: 'Subject'
					,dataIndex	: 'subjectDescription'
					,width		: 150
				}
				,{
					header		: 'Activity Code'
					,dataIndex	: 'activityCode'
					,minWidth	: 150
					,columnWidth: 10
				}
				,{
					header		: 'Type'
					,dataIndex	: 'activityTypeDescription'
					,width		: 150
				}
				,{
					header		: 'Date'
					,dataIndex	: 'activityDate'
					,minWidth	: 150
					,columnWidth: 10
				}
				,{
					header		: 'Classification'
					,dataIndex	: 'activityClassification'
					,width		: 150
				}
				,{
					header		: 'No. of Items'
					,dataIndex	: 'activiyNumberOfItems'
					,minWidth	: 150
					,columnWidth: 10
				}
				,{
					header		: 'Status'
					,dataIndex	: 'activityInactiveTag'
					,width		: 150
				}
				,standards.callFunction( '_createActionColumn', {
					icon		: 'pencil'
					,tooltip	: 'Edit record'
					,Func		: _editRecord
				})
				,standards.callFunction( '_createActionColumn' ,{
					canDelete: canDelete
					,icon	: 'remove'
					,tooltip: 'Remove record'
					,Func	: _deleteRecord
				})
			]
		});
	}
	
	function _editRecord( data ){
	console.log( data );
		module.getForm().retrieveData({
			url: route + 'retrieveActivityData'
			,params:{
				activityCode 	: 	data.activityCode
			}
			,success: function(result){
			console.log( "Result" );
			console.log( result.schoolYearID );
				Ext.getCmp( 'activityClassification' + module ).setValue( parseInt( result.activityClassification ) );
					Ext.getCmp( 'schoolYear' + module ).store.load({
						callback: function( a,b,c ){
							Ext.getCmp( 'schoolYear' + module ).setValue( parseInt( result.schoolYearID ) );
									var actCode = Ext.getCmp('activityCode' + module ).getValue();
							module.getForm().retrieveData({
									url: route+'retrieveData'
									,onEdit: false
									,goToForm: false
									,params:{
										classSchoolYearID : parseInt( result.schoolYearID )
									}
									,success: function( a,b,c ){
										console.log( a );
										Ext.getCmp('studentGradeLevelHistoryID' + module ).setValue("")
										Ext.getCmp( 'gradeLevelID' + module ).setValue( "" );
										console.log(a.activityCode);
											Ext.getCmp( 'studentGradeLevelHistoryID' + module ).setValue( a.gradeLevelDescription );
											Ext.getCmp( 'gradeLevelID' + module ).setValue( a.gradeLevelID );;
											Ext.getCmp( 'activityCode' + module ).setValue( actCode );
									}
								});
							
						}
					});
			}
		});
	}
	
	function _deleteRecord( data ){
	var id = parseInt(data.studentID);
	console.log( route + 'deleteActivity');
	console.log( data );
		data.confirmDelete({
			url: route + 'deleteActivity'
			,params:{
				activityID   : data.activityID
			}
			,success:function( response ){
				var ret = Ext.decode( response.responseText );
				if( ret.match == 1 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'Activity can no longer be deleted since it already has a grade on the grading sheet.'
					});
				}
				else{
					standards.callFunction( '_createMessageBox', {
						msg : 'DELETE_SUCCESS'
					});
						_init();
				}
			}
		});
	}
	

	
	
	function _resetForm( form ){
		form.reset();
	}
	
	function _saveForm( form ){
	console.log( route );
		form.submit({
			url:	route+'saveForm'
			,success:function( action, response ){
				var match = parseInt( response.result.match, 10 );
				
				if( match == 1 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'Activity can no longer be deleted since it already has a grade on the grading sheet.'
					});
				}
				else if( match == 2 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'Acronym : ' + acronym + ' already exists.'
					});
				}
				else if( match == 3 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'EDIT_UNABLE'
					});	
				}
				else if( match == 4 ){
					standards.callFunction( '_createMessageBox', {
						msg		: 'SAVE_MODIFIED'
						,action	: 'confirm'
						,fn		: function( btn ){
							if( btn == 'yes' ){
								form.modify = true;
								_saveForm( form );
							}
						}
					});
				}
				else{
					standards.callFunction( '_createMessageBox', {
						msg : 'SAVE_SUCCESS'
					});
						_init();
					_resetForm( form );
				}
			}
		});
	}


	
	return{
		initMethod:function( config ){
			route		= config.route;
			baseurl		= config.baseurl;
			_module		= config.module;
			_idmodule	= config.idmodule
			canDelete	= config.canDelete;
			module 		= config.module;
			
			
			return _mainPanel( config );
		}
	}
}();