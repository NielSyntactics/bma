var Studentsprofile = function(){
	var baseurl, route, module, canDelete, idmodule;
	
	function _init(){
	
		Ext.getCmp( "gridHistory" + module ).store.load();
	}
	
	function _mainPanel( config ){
	
	
	var paymentStatusStore = standards.callFunction( '_createLocalStore' ,{
							data:[
								'Not Paid'
								,'Paid'
							]
							,startAt: 0
						} );
						
	
	var gradeLevelStore = standards.callFunction( '_createRemoteStore' ,{
							fields:[
								{
									name	: 'gradeLevelID'
									,type	: 'number'
								}
								,'gradeLevelDescription'
							]
							, url: 	route + 'getYearLevels'
						} );
						
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
						
						
		var d = new Date();
		d.setFullYear( d.getFullYear() - 2 );
						
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,moduleType	: 'form'
			,isCenter	: false
			,minHeight	: 800
			,minWidth : 1600
			,tbar:{
				saveFunc 	 : _saveForm
				,resetFunc	 : _resetForm
				,listLabel	 : 'List'
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
				,noFormButton: true
				,noListButton: true
			}
			
			,formItems:[
				{	xtype:	'fieldset'
					,defaults 	:
					{
						style 	: 	'margin-top: 5px'
					}
					,items:[
						
					{
						xtype		: 	'container'
						,layout 	: 	'column'
						,items: 	
						[
							{
								xtype 	: 	'container'
								// ,isCenter	: false
								,items:
								[
									standards.callFunction( '_createTextField' ,{
			 								id 				: 	'studentID' + module
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
								,width 		:	480
								,items:
								[
									,standards.callFunction( '_createTextField' ,{
			 								id 				: 	'studentNumber' + module
					 						,fieldLabel 	: 	'Student Number'
					 						,allowBlank		: 	false
					 						,maxLength 		: 	255
											,width			: 	430
				 						} 
					 				)
									
									,standards.callFunction( '_createTextField' ,{
			 								id 				: 	'studentFirstName' + module
					 						,fieldLabel 	: 	'First Name'
					 						,allowBlank		: 	false
					 						,maxLength 		: 	255
											,width			: 	430
				 						} 
					 				)

					 				,standards.callFunction(  '_createTextField' ,{
					 						id 				: 	'studentMiddleName' + module
					 						,fieldLabel 	: 	'Middle Name'
					 						,maxLength 		: 	50
											,width			: 	430
					 					}
					 				)

					 				,standards.callFunction( '_createTextField' ,{
					 						id 				: 	'studentLastName' + module
					 						,fieldLabel 	: 	'Last Name'
					 						,allowBlank 	: 	false
					 						,maxLength 		: 	50
											,width			: 	430
					 					} 
					 				)

					 				,standards.callFunction( '_createTextArea' ,{
					 						id 				: 	'studentAddress' + module
					 						,fieldLabel 	: 	'Address'
					 						// ,allowBlank 	: 	false
											,width			: 	430
					 					}
					 				)
									
									
									,{
										xtype : 	'container'
										,layout 	: 	'column'
										// ,columnWidth	: 	0.50
										,style 		:	'margin-bottom: 5px'
										,items:[
											standards.callFunction( '_createDateField' ,{
													id 				: 	'studentBirthdate' + module
													,allowBlank 	: 	false
													,fieldLabel 	: 	'Birthdate'
													,width			: 	275
													,value			: 	""
													,maxValue: d
													// ,maxValue: ( ( d.getFullYear() - 2 ) + '-' + d.getMonth() + '-' + d.getDay() )
													,listeners:{ 
														change: 
														function() 
														{
															if( Ext.getCmp( 'studentBirthdate' + module ).isValid() === false ) return;
															var today= new Date();
															var birthday= Ext.getCmp( 'studentBirthdate' + module ).getValue();
															var secold =(today.getYear()-birthday.getYear())*31557600+(today.getMonth()-birthday.getMonth())*2629800+(today.getDay()-birthday.getDay())*86400+today.getHours()*3600+today.getMinutes()*60+today.getSeconds()	
															
															Ext.getCmp( 'age' + module ).setValue( Math.floor(((secold/3600)/24)/365.25) );
															// var calcAge = Ext.getCmp( 'studentBirthdate' + module ).getValue().toLocaleDateString().split("/");
															// var currentTime = new Date();
															// var month = ( currentTime.getMonth() + 1 ) - parseInt( calcAge[0], 10 );
															// var day = currentTime.getDate() - parseInt( calcAge[1], 10 );                                    
															// var year = currentTime.getFullYear() - parseInt( calcAge[2], 10 );
															// console.warn( currentTime.getFullYear() );
															// console.warn( calcAge );
															// var age = 0;
																// console.log( "day " + day );
																// console.log( "month " + month );
																// console.log( "year " + year );
																// if( day <= -1 && year >= 2 && month <= -1){
																		// year = year - 1;
																// }
																// else if( day <= -1 && year >= 2 && month == 0 ){
																		// year = year - 1;
																// }
																// else if( month <= -1 && year <= 2 ){
																	// standards.callFunction( '_createMessageBox', {
																		// msg : 'Birthdate not allowed.'
																	// });
																// }else if( month <= -1 && year >= 2 ){
																		// year = year - 1;
																// }
																// Ext.getCmp( 'age' + module ).setValue( year );
														}
													}
												}
											)
											
											,standards.callFunction( '_createTextField' ,{
													id 				: 	'age' + module
													,fieldLabel 	: 	'Age'
													,width 			: 	140
													,labelWidth 	: 	40
													,style 			: 	'margin-left: 15px'
													,readOnly 		:	true
												}
											)
											
										]
									}
									
									,standards.callFunction( '_createTextField' ,{
													id 				: 	'studentMothersName' + module
													,fieldLabel 	: 	'Mother\'s Name'
													,allowBlank		: 	false
													,maxLength 		: 	100
													,width			: 	430
												} 
											)

									,standards.callFunction(  '_createTextField' ,{
											id 				: 	'studentMothersEmail' + module
											,fieldLabel 	: 	'Mother\'s Email'
											,maxLength 		: 	100
											,width			: 	430
											,vtype			:	'email'
										}
									)
					 				
								]
							}

							,{
								xtype 		: 	'container'
								,style 		: 	'margin-left: 10px'
								// ,width 		:	480
								,items:
								[

					 				standards.callFunction( '_createTextField' ,{
					 						id 				: 	'studentFathersName' + module
					 						,fieldLabel 	: 	'Father\'s Name'
					 						,allowBlank 	: 	false
					 						,maxLength 		: 	100
											,width			: 	430
					 					} 
					 				)

					 				,standards.callFunction( '_createTextField' ,{
					 						id 				: 	'studentFathersEmail' + module
					 						,fieldLabel 	: 	'Father\'s Email'
											,vtype			:	'email'
											,width			: 	430
					 					}
					 				)
									
									,{
										xtype : 	'container'
										,layout 	: 	'column'
										// ,columnWidth	: 	0.50
										,style 		: 	'margin-bottom: 5px'
										,items:[
											,standards.callFunction( '_createCombo' ,{
													id 				: 	'studentGradeLevelHistoryID' + module
													,allowBlank 	: 	false
													,fieldLabel 	: 	'Grade Level'
													,width			: 	260
													,store 			:	gradeLevelStore
													,valueField 	:   "gradeLevelID"
													,displayField	: 	"gradeLevelDescription"
												}
											)
											,standards.callFunction( '_createCombo' ,{
													id 				: 	'schoolYear' + module
													,allowBlank 	: 	false
													,fieldLabel 	: 	'S.Y'
													,width 			: 	155
													,labelWidth 	: 	40
													,style 			: 	'margin-left: 15px'
													,allowBlank		: 	false
													,store 			: 	schoolYearStore
													,valueField 	:   "schoolYearID"
													,displayField	: 	"schoolYearDescription"
												}
											)
											,{
												xtype	: 	'button'
												,id 	: 	'btnShowHistory' + module
												,iconCls:	'glyphicon glyphicon-align-justify'
												,style 	: 	"background: transparent; border: transparent"
												,hidden : 	true
												,handler: function(){
																		gradeLevelHistory();
												}
											}
										]
									}


									
					 				,standards.callFunction( '_createCombo' ,{
					 						id 				: 	'paymentStatusHistoryID' + module
					 						,fieldLabel 	: 	'Payment Status'
											,width			: 	430
											,store 			: 	paymentStatusStore
											,allowBlank		:	false
					 					}
					 				)
									
									,standards.callFunction( '_createCheckField' ,{
					 						id 				: 	'studentInactiveTag' + module
					 						,fieldLabel 	: 	'Status'
											,checked		: 	false
											,boxLabel 		: 	"<span>Inactive </span>"
											,hidden 		: 	true
					 					}
					 				)
									
									,{
										xtype : 	'fieldset'
										,title : 'Balance:'
										,width : 430
										,style 		: 	'margin-bottom: 5px; margin-top: 5px'
										,items:[
											{
												xtype : 'container'
												,layout : 'column'
												,style : 'margin: 10px'
												,items : [
													standards.callFunction( '_createTextField' ,{
															id 				: 	'studentTuition' + module
															,fieldLabel 	: 	'Tuition'
															,width			: 	150
															,labelWidth 	: 	60
															,isNumber 		: 	true
														}
													)
													,standards.callFunction( '_createTextField' ,{
															id 				: 	'studentCatering' + module
															,fieldLabel 	: 	'Catering'
															,width			: 	220
															,labelWidth 	: 	90
															,style 			: 	'margin-left: 15px'
															,isNumber 		: 	true
														}
													)
												]
											}	
											
											,{
												xtype : 'container'
												,layout : 'column'
												,style : 'margin: 10px'
												,items : [
													standards.callFunction( '_createTextField' ,{
															id 				: 	'studentBooks' + module
															,fieldLabel 	: 	'Books'
															,width			: 	150
															,labelWidth 	: 	60
															,isNumber 		: 	true
														}
													)
													,standards.callFunction( '_createTextField' ,{
															id 				: 	'studentMiscellaneous' + module
															,fieldLabel 	: 	'Miscellaneous'
															,width			: 	220
															,labelWidth 	: 	90
															,style 			: 	'margin-left: 15px'
															,isNumber 		: 	true
														}
													)
												]
											}

											,standards.callFunction( '_createTextField' ,{
													id 				: 	'studentUniform' + module
													,fieldLabel 	: 	'Uniform'
													,width			: 	150
													,labelWidth 	: 	60
													,style 			: 	'margin-left: 10px'
													,isNumber 		: 	true
												}
											)											
										]
									}
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
								// {
									// name	:	studentID
									// ,type	:	number
								// }
								 'studentID'
								,'gradeLevelDescription'
								,'schoolYearDescription'
								,'dateUpdated'
							]
							,url: route + 'retrieveDataGradeLevel'
							// ,autoLoad : true
					});
					
		// console.log( store );
					
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
					header		: 'Date Updated'
					,dataIndex	: 'dateUpdated'
					,width		: 150
				}
			]
		});
	}
	
	// GradeLevelHistoryModal
	function gradeLevelHistory( data ){
	
	// console.log( "test2" );
		Ext.create( 'Ext.Window', {
			id:'studentLevelHistory'+module
			,title:'Grade Level History'
			,width: 600
			,modal:true
			,closable:true
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
			// ,bbar: [
				// {
					// text: 'Close',
					// handler: function () { this.up('window').close(); }
				// }
			// ]
			,items: [
				{
					xtype:	'form'
					,id: 'formPass' + module
					,module: module
					,border: false
					,buttonAlign: 'right'
					,bodyPadding: 0
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
	// console.log( "History " + route );
			var searchTypeStore = standards.callFunction( '_createLocalStore' ,{
						data:[
							'Last Name'
							,'First Name'
							,'Middle Name'
							,'Grade Level'
							,'School Year'
							,'Payment Status'
							,'Status'
							,'Student Number'
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
								// {
									// name	:	studentID
									// ,type	:	number
								// }
								 'studentID'
								,'studentNumber'
								,'fullName'
								,'gradeLevelDescription'
								,'schoolYearDescription'
								,'barangayName'
								,'paymentStatusName'
								,'studentInactiveTagName'
							]
							,url: route + 'getHistory'
					});
					
		return standards.callFunction( '_gridPanel',{
			id		: 'gridHistory' + module
			,module	: module
			,store	: store
			,noDefaultRow 	: 	true
			,hasNumRows: true
			,tbar:{
					// route: route
					// ,canPrint: 1
					// ,pageTitle: pageTitle
					// ,customListExcelHandler: _printExcel
					// ,customListPDFHandler: _printPDF
					content: [
					standards.callFunction( '_createCombo', {
						id:'filterType' + module
						,fieldLabel:'Search By'
						,store:searchTypeStore
						// ,editable:false
						,labelWidth:75
						,width:250
						,style:'margin-left:5px'
					})
					
					,standards.callFunction( '_createCombo', {
						id:'filterTypeList' + module
						,fieldLabel:''
						,store:dataListStore
						// ,editable:false
						,labelWidth:75
						,width:250
						,style:'margin-left:5px'
						,reQuery 	:	false
						,valueField 	:   'id'
						,displayField	: 	'name'
						,listeners:{
							select:function( combo, record, index ){
								store.currentPage = 1;
								store.proxy.extraParams.filter = this.getValue()
								store.proxy.extraParams.tableID = Ext.getCmp( 'filterType' + module).getValue()
								store.proxy.extraParams.dispValue = Ext.getCmp( 'filterTypeList' + module ).getDisplayValue()
								store.load({
									// params:{
										// filter		:	this.getValue()
										// ,tableID	:	Ext.getCmp( 'filterType' + module).getValue()
										// ,dispValue	:	Ext.getCmp( 'filterTypeList' + module ).getDisplayValue()
									// }
									callback: function(){
										if( store.getCount() == 0 ){
											standards.callFunction( '_createMessageBox', {
												msg : 'No records found.'
											});
										}
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
									// Ext.getCmp( 'filterTypeList' + module ).reset()
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
												Ext.getCmp( 'filterType' + module ).setValue("");
												Ext.getCmp( 'filterTypeList' + module).setValue("");
												Ext.getCmp( 'filterTypeList' + module).store.removeAll();
												store.proxy.extraParams.filter = ""
												store.proxy.extraParams.tableID = ""
												store.proxy.extraParams.dispValue = ""
								
												_init();
						}
					}
					
					
				]
				}
			
			,columns: [

				{
					header: 'Student Number'
					,dataIndex	: 'studentNumber'
					,minWidth	: 150
				}
				,{
					header: 'Full Name'
					,dataIndex	: 'fullName'
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
					header		: 'School Year'
					,dataIndex	: 'schoolYearDescription'
					,width		: 150
				}
				,{
					header		: 'Payment Status'
					,dataIndex	: 'paymentStatusName'
					,width		: 150
				}
				,{
					header		: 'Status'
					,dataIndex	: 'studentInactiveTagName'
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
		module.getForm().retrieveData({
			url: route+'retrieveData'
			,params:{
				studentID : data.studentID
			}
			,success: function(result){
			// console.log( result );
				Ext.getCmp( 'btnShowHistory' + module ).show();
				Ext.getCmp( 'schoolYear' + module ).store.load({
					callback: function(){
						Ext.getCmp( 'schoolYear' + module ).setValue( parseInt( result.schoolYearID ) );
					}
				});
				
				Ext.getCmp( 'paymentStatusHistoryID' + module ).setValue( parseInt( result.paymentStatusHistoryID ) );
				
				Ext.getCmp( 'studentGradeLevelHistoryID' + module ).store.load({
					callback: function(){
						Ext.getCmp( 'studentGradeLevelHistoryID' + module ).setValue( parseInt( result.gradeLevelID ) );
					}
				});
				
				Ext.getCmp( 'studentInactiveTag' + module ).show();
				// Ext.getCmp( 'studentInactiveTag_Studentsprofile' )
				
				// Age Calculate
			
						
							var today= new Date();
							var birthday= Ext.getCmp( 'studentBirthdate' + module ).getValue();
							var secold =(today.getYear()-birthday.getYear())*31557600+(today.getMonth()-birthday.getMonth())*2629800+(today.getDay()-birthday.getDay())*86400+today.getHours()*3600+today.getMinutes()*60+today.getSeconds()	
							
							Ext.getCmp( 'age' + module ).setValue( Math.floor(((secold/3600)/24)/365.25) );
			}
		});
	}
	
	function _deleteRecord( data ){
	var id = parseInt(data.studentID);
		data.confirmDelete({
			url: route + 'deleteData'
			,params:{
				studentID   : id
				,idmodule 	: idmodule
			}
			,success:function( response ){
					// console
				var ret = Ext.decode( response.responseText );
				if( ret.match == 1 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'Cannot delete Entry'
					});
				}
				// else if( ret.match == 2 ){
					// standards.callFunction( '_createMessageBox', {
						// msg : 'DELETE_USED'
					// });
				// }
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
	
	
	
				var limit = Ext.getCmp( 'pagingToolBar_gridHistory' + module ).down().value;
				Ext.getCmp( 'pagingToolBar_gridHistory' + module ).down().suspendEvents();
				
				Ext.getCmp( 'btnShowHistory' + module ).hide();
				var filterType = Ext.getCmp( 'filterType' + module ).getValue();
				var filterTypeList = Ext.getCmp( 'filterTypeList' + module ).getValue();
				
				form.reset();
				Ext.getCmp( 'pagingToolBar_gridHistory' + module ).down().setValue( limit );
				Ext.getCmp( 'pagingToolBar_gridHistory' + module ).down().resumeEvents( false );
				
				_init();
				Ext.getCmp( 'filterType' + module ).setValue( filterType );
				Ext.getCmp( 'filterTypeList' + module ).setValue( filterTypeList );
	}
	
	function _saveForm( form ){
	// console.log( route );
		// var name    = Ext.getCmp( 'coopName' + module ).getValue();
		// var acronym = Ext.getCmp( 'acronym' + module ).getValue();
	
		form.submit({
			url:	route+'saveForm'
			,success:function( action, response ){
				var match = parseInt( response.result.match, 10 );
				if( match == 1 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'Student ID already exist.'
					});
				}
				else if( match == 2 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'Student name already exists.'
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
						// _init();
						console.log( form );
					_resetForm( form );
					
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
			idmodule 	= config.idmodule
			
			return _mainPanel( config );
		}
	}
}();