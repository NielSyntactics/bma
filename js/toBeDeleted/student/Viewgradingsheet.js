/** Grading Sheet module
  * [Developer]
  * Developer: Roj Janubas
  * Date Created: Feb. 24, 2016
  * Date Finished: 
  
  * [Database]
	
 * [Modification]
   
 **/
var Viewgradingsheet = function(){
	/* variable declarations(Private) */
	var _baseurl, _canSave, _canEdit, _canDelete, _canPrint, _idmodule, _module, _route, _pageTitle;
	var _studID;
	
	/* Module Main Container
	 * module components container, handles most of the control in the form( Standards )
	 * @parameter params - configuration variables
	 * @private
	 * @return Ext.tab.Tab
	*/
	
	function _init(){
		
	}
	
	function _mainPanel( params ){
		var schoolYRStore = standards.callFunction( '_createRemoteStore', {
			fields : [ 'code', 'name', 'gradeLevelDescription' ]
			,url : _route + 'getClassSchoolYear'
		} );  
		var subjectStore = standards.callFunction( '_createRemoteStore', {
			fields : [ 'subjectID', 'subjectDescription' ]
			,url : _route + 'getSubjects'
		} );  
		var quarterStore = standards.callFunction( '_createLocalStore', {
			data : [
				'First Quarter'
				,'Second Quarter'
				,'Third Quarter'
				,'Fourth Quarter'
			]
		} );
		return standards.callFunction( '_mainPanel', {
			config : params
			,id : 'mainViewContainer' + _module
			,moduleType : 'form'
			,isCenter : false
			// ,minWidth : 1740
			,minWidth : 2062
			,minHeight : 768
			,noHeader : true
			// ,noListButton : true
			,hasComponentSeparator : false
			,tbar : {
				formLabel : "Quarterly"
				// saveFunc : _saveForm
				// ,resetFunc : _resetForm
				// ,noFormButton: true
				,noListButton: true
				// ,listLabel : 'List'
			}
			,extraFormTab : [
				{	buttonLabel : 'Year End Final Grades'
					,buttonIconCls : 'glyphicon glyphicon-file'
					,items :	{	xtype:	'container'
									,layout : 'fit'
									,items:	_grdFinalGrades()
								}
					// ,buttonHandler : function(){
						// Ext.getCmp( 'saveButton' + _module ).setVisible( false );
						// Ext.getCmp( 'resetButton' + _module ).setVisible( false );
					// }
				}
			]
			,formItems : [
				{
					xtype: 'container'
					,layout: 'column'
					,items:[
							{
								xtype : 'hiddenfield'
								,id : 'gradingSheetID' + _module
							}
							,{
								xtype : 'fieldset'
								,width 	: 875
								,defaults 	:
								{
									xtype 	: 	'container'
									,style 	: 	'margin-top: 5px'
								}
								,items : [
									{	xtype : 'container'
										,layout : 'column'
										,style : 'margin-bottom : 5px; margin-top: 5px'
										,items : [
											standards.callFunction( '_createCombo', {
												id : 'classID' + _module
												,fieldLabel : 'School Year'
												// ,allowBlank : false
												,store : schoolYRStore
												,valueField : 'code'
												,displayField : 'name'
												,style : 'margin-right : 5px;'
												,listeners : {
													select : function(){
														var me = this
															,record = me.findRecord( me.valueField, me.getValue() )
															,index = me.store.indexOf( record )
															,varField = me.store.getAt( index )
															,gradeLevelDescription = Ext.getCmp( 'gradingLevelDescription' + _module );
														if( varField ){
															gradeLevelDescription.setValue( varField.data.gradeLevelDescription );
														}
														// _checkSelection( {
															// currentComponent : 'classID'
														// } );
													}
												}
											} )
											,standards.callFunction( '_createTextField', {
												id : 'gradingLevelDescription' + _module
												,fieldLabel : 'Grade Level'
												// ,allowBlank : true
												,readOnly : true
												,submitValue : false
												,style : 'margin-right : 5px;'
											} )
											// ,{	xtype : 'box'
												// ,html : 'Status: <span id = "statusDisplay' + _module + '"><span style="color : red;">Ongoing</span></span>'
											// }
										]
									}
									,{	xtype : 'container'
										,layout : 'column'
										,style : 'margin-bottom : 5px'
										,items : [
											standards.callFunction( '_createCombo', {
												id : 'gradingSheetQuarter' + _module
												,fieldLabel : 'Quarter'
												// ,allowBlank : false
												// ,valueField : 'code'
												// ,displayField : 'name'
												,store : quarterStore
												,style : 'margin-right : 5px;'
												,listeners : {
													select : function(){
														// _checkSelection( {
															// currentComponent : 'quarter'
														// } );
													}
												}
											} )
											,standards.callFunction( '_createCombo', {
												id : 'subjectID' + _module
												,fieldLabel : 'Subject'
												,store : subjectStore
												// ,allowBlank : false
												,reQuery : false
												,valueField : 'subjectID'
												,displayField : 'subjectDescription'
												,listeners : {
													beforequery : function(){
														var me = this;
														subjectStore.proxy.extraParams.classID = Ext.getCmp( 'classID' + _module ).value;
														subjectStore.proxy.extraParams.quarter = Ext.getCmp( 'gradingSheetQuarter' + _module ).value;
														delete me.lastQuery;
													}
													,select : function(){
														// _checkSelection( {
															// currentComponent : 'subject'
														// } );
													}
												}
											} )
											
											,{
												xtype	: 	'button'
												,id 	: 	'viewGrid' + _module
												,text	:	'View'
												,iconCls:	'glyphicon glyphicon-search'
												,style 	: 	"margin-left: 3px"
												,listeners: {
													click: function() {
														if( Ext.getCmp( 'classID' + _module ).getValue() === null || Ext.getCmp( 'gradingSheetQuarter' + _module ).getValue() === null || Ext.getCmp( 'gradingLevelDescription' + _module ).getValue() === null || Ext.getCmp( 'subjectID' + _module ).getValue() === null)
														{
																		standards.callFunction( '_createMessageBox', {
																			msg : 'Please fill the fields.'
																		});
																		return;
														}else{
															Ext.Ajax.request({
																url: _route + 'checkUserPayable'
																,params : {
																	classID : Ext.getCmp( 'classID' + _module ).getValue()
																	,gradingSheetQuarter : Ext.getCmp( 'gradingSheetQuarter' + _module ).getValue()
																	,subjectID : Ext.getCmp( 'subjectID' + _module ).getValue()
																	,idmodule : _idmodule
																	,classSchoolYear : Ext.getCmp( 'classID' + _module ).getDisplayValue()
																	,subjectName : Ext.getCmp( 'subjectID' + _module ).getDisplayValue()
																	
																}
																,success: function( response ){
																	// console.log( response );
																	var ret = Ext.decode( response.responseText );
																	console.log( ret );
																	if( ret.match == 1 ){
																		standards.callFunction( '_createMessageBox', {
																			msg : 'You are not allowed to view your grades. Please settle all your payments first.'
																		});
																		return;
																	}else if( ret.match == 2 ){
																		standards.callFunction( '_createMessageBox', {
																			msg : 'The ' + Ext.getCmp( 'gradingSheetQuarter' + _module ).getDisplayValue() + ' grading sheet for this subject has not been uploaded yet.'
																		});
																		return;
																	}else{
																	// _studID
																	var tName = document.getElementById( 'teacherName' + _module );
																	var dateFinalized = document.getElementById( 'dateFinalized' + _module );
																				tName.innerHTML = "<span style='float: right'>"+ ret[1][0].fullName +'</span>';
																				if( ret[1][0].gradingSheetStatus == 2 ){
																					dateFinalized.innerHTML = "Date Finalized: <span style='float: right'>"+ ret[1][0].dateFinalized +'</span>';
																				}else if( ret[1][0].gradingSheetStatus == 3 ){
																					dateFinalized.innerHTML = "Last Upload Date: <span style='float: right'>"+ ret[1][0].dateFinalized +'</span>';
																				}else{
																					dateFinalized.innerHTML = "";
																				}
																		_reloadModuleGrids()
																	}
																
																}
															});
														}
													}
												}
											}
											
											,{
												xtype	: 	'button'
												,id 	: 	'refreshGrid' + _module
												,text	:	'Refresh'
												,iconCls:	'glyphicon glyphicon-refresh'
												,style 	: 	"margin-left: 3px"
												,listeners: {
													click: function() {
														_resetForm();
													}
												}
											}
										]
									}
								]
							}
							,{
								xtype : 'fieldset'
								,width : 350
								,style : 'margin-left: 5px;'
								,defaults : {
									xtype : 'container'
								}
								,items : [
										,{
											xtype : 'box'
											,html : 'Teacher: <span id = "teacherName' + _module + '"></span>'
											,style : "margin: 9px 20px"
										}
										
										,{	
											xtype : 'box'
											,html : '<span id = "dateFinalized' + _module + '"> </span>&nbsp;'
											,style : "margin: 9px 20px"
										}
								]
							}
					]
					
				}
				,{	xtype : 'tabpanel'
					,items : [
						{	title : 'Quarterly Grades per Activity'
							,border : false
							,plain : true
							,defaults: {
								flex: 1 //set the width of each item to be equal, in this case => 100%/numberOfItems = 100%/3 = 33.33333%
							}
							,id : 'perActivity' + _module
							,items : [
								{	xtype : 'container'
									,layout : 'column'
									,items : [
										_gridPerActivity( {
											type : 'writtenworks'
										} )
										,_gridPerActivity( {
											type : 'performance'
										} )
										,_gridPerActivity( {
											type : 'quizzes'
										} )
										,_gridPerActivity( {
											type : 'quarterlyexams'
										} )
									]
								}
							]
						}
						// ,{	title : 'Quarterly Grades per Learner'
							// ,border : false
							// ,id : 'perLearner' + _module
							// ,layout : 'fit'
							// ,items : [
								// _gridPerLearner()
							// ]
						// }
					]
				}
			]
			,listItems : _gridHistory()
		} );
	}
	
	function _gridHistory(){
		var store = standards.callFunction( '_createRemoteStore', {
			field : [
				'schoolYearDescription'
				,'gradeLevelDescription'
				,'quarterDisplay'
				,'subjectDescription'
				,'gradingSheetStatusDisplay'
				,'gradingSheetID'
			]
			,url : _route + 'getHistory'
		} );
		var sByStore = standards.callFunction( '_createLocalStore', {
			data : [
				'School Year'
				,'Grade Level'
				,'Quarter'
				,'Subject'
				,'Status'
			]
		} );
		var sStore = standards.callFunction( '_createRemoteStore', {
			field : [ 'id', 'name' ]
			,url : _route + 'getSearchBy'
		} );
		return standards.callFunction( '_gridPanel', {
			id : 'gridHistory' + _module
			,module : _module
			,store : store
			,noDefaults : true
			,tbar : {
				content : [
					standards.callFunction( '_createCombo', {
						store : sByStore
						,idmodule : _idmodule
						,fieldLabel : 'Search by'
						,valueField : 'id'
						,displayField : 'name'
						,id : 'sBy' + _module
						,style : 'margin-right : 5px'
						,listeners : {
							select : function(){
								
							}
						}
					} )
					,standards.callFunction( '_createCombo', {
						store : sStore
						,idmodule : _idmodule
						,fieldLabel : ''
						,valueField : 'id'
						,displayField : 'name'
						,id : 's' + _module
						,style : 'margin-right : 5px'
						,listeners : {
							select : function(){
								
							}
						}
					} )
					,{	xtype : 'button'
						,iconCls : 'glyphicon glyphicon-refresh'
						,handler : function(){
							
						}
					}
				]
			}
			,columns : [
				{	header : 'School Year'
					,dataIndex : 'schoolYearDescription'
					,minWidth : 100
					,flex : 1
				}
				,{	header : 'Grade Level'
					,dataIndex : 'gradeLevelDescription'
					,minWidth : 100
					,flex : 2
				}
				,{	header : 'Quarter'
					,dataIndex : 'quarterDisplay'
					,minWidth : 100
					,flex : 2
				}
				,{	header : 'Subject'
					,dataIndex : 'subjectDescription'
					,minWidth : 100
					,flex : 2
				}
				,{	header : 'Status'
					,dataIndex : 'statusDisplay'
					,minWidth : 100
					,flex : 2
				}
			]
		} );
	}
	
	function _gridPerActivity( params ){
		var link = ''
			,mainHeaderText = ''
			,id = ''
			,actClas = 0;
		var store;
		switch( params.type ){
			case "performance":
					mainHeaderText = 'Performance - 25%';
					id = 'grdPerformance';
					actClas = 1;
				break;
			case "writtenworks":
					mainHeaderText = 'Written Works - 40%';
					id = 'grdWrittenWorks';
					actClas = 2;
				break;
			case "quizzes":
					mainHeaderText = 'Quizzes - 15%';
					id = 'grdQuizzes';
					actClas = 3;
				break;
			case "quarterlyexams":
					mainHeaderText = 'Quarterly Exam - 20%';
					id = 'grdQuarterExams';
					actClas = 4;
				break;
		}
		
		if( actClas == 4 ){
			store = standards.callFunction( '_createRemoteStore', {
				fields : [
					{	name : 'quarterlyGrade'
						,type : 'decimal'
					}
					,{	name : 'activiyNumberOfItems'
						,type : 'number'
					}
					,{
						name : 'score'
						,type : 'number'
					}
					,{
						name : 'quarterlyExamPS'
						,type : 'decimal'
					}
					,{
						name : 'quarterlyExamWS'
						,type : 'decimal'
					}
				]
				,url : _route + 'getQuarterGrade'
			} );
		
		}else{
			store = standards.callFunction( '_createRemoteStore', {
				fields : [
					'activityDate'
					,'activityID'
					,'activityTypeDescription'
					,'activityType'
					,'activityCode'
					,'activityClassification'
					,{	name : 'activiyNumberOfItems'
						,type : 'number'
					}
					,{
						name : 'score'
						,type : 'number'
					}
					,{
						name : 'quarterlyExamPS'
						,type : 'decimal'
					}
					,{
						name : 'quarterlyExamWS'
						,type : 'decimal'
					}
					// ,{	name : 'statusID'
						// ,type : 'number'
					// }
					// ,'learnerRec'
				]
				,url : _route + 'getActivity'
			} );
		}
		store.proxy.extraParams.activityClassification = actClas;
		return standards.callFunction( '_gridPanel', {
			id : id + _module
			,module : _module
			,store : store
			// ,height : 300
			,width : ( params.type == 'quarterlyexams'? 323 : 572 )
			// 572
			// ,border : false
			,noPage : true
			,plugins : true
			,noDefaultRow : true
			,features : {ftype:'summary'}
			,bbar: [
				'->'
				,'->'
				,( actClas == 4 ) ? "->" : {
					xtype: 'tbtext',
					text: 'Total: '
                }
				,( actClas == 4 ) ? "->" : standards.callFunction( '_createTextField', {
					id : id+'PS' +  _module
					,width: 60
					,style: 'margin-right: 10px'
					,isDecimal: false
					,isNumber: true
				} )
				,( actClas == 4 ) ? "->" : standards.callFunction( '_createTextField', {
					id : id+'WS' +  _module
					,width: 60
					,isDecimal: false
					,isNumber: true
				} )
				 ,( actClas == 4 ) ? {
					xtype : 'box'
					,html : 'Quarterly Grade: <strong><span id="totalQuarter' + _module + '">0.00</span>%</strong>'
				 } : '->'
				
			]
			,columns : [
				{	text : mainHeaderText
					,columns : [
						{	header : 'Date'
							,dataIndex : 'activityDate'
							,width : 90
							,align : 'right'
							,menuDisabled : true
							,hidden : params.type == 'quarterlyexams'
						}
						,{	header : 'Type'
							,dataIndex : 'activityTypeDescription'
							,minWidth : 80
							,flex : 1
							,menuDisabled : true
							,hidden : params.type == 'quarterlyexams'
						}
						,{	header : 'Code'
							,dataIndex : 'activityCode'
							,width : 80
							,align : 'right'
							,menuDisabled : true
							,hidden : params.type == 'quarterlyexams'
						}
						,{	header : 'Highest<br>Possible Score'
							,dataIndex : 'activiyNumberOfItems'
							,width : 120
							,menuDisabled : true
							,summaryType : 'sum'
							,summaryRenderer : function( value, summaryData, dataIndex ){
								// console.log( value );
								// console.log( summaryData );
								// console.log( dataIndex );
								Ext.getCmp( id+'PS' +  _module ).setValue( value );
							}
							,renderer : function( value, summaryData, dataIndex ,rowIndex ){
								if( rowIndex == ( store.getCount() - 1 ) ){
									if( value == 0 ){
										return '';
									}
								}
								return value;
							}
						}
						,{	header : 'Score'
							,width : 80
							,dataIndex : 'score'
							,summaryType : 'sum'
							,summaryRenderer : function( value, summaryData, dataIndex ){
								Ext.getCmp( id+'WS' +  _module ).setValue( value );
							}
							,renderer : function( value, summaryData, dataIndex ,rowIndex ){
								if( rowIndex == ( store.getCount() - 1 ) ){
									if( value == 0 ){
										return '';
									}
								}
								return value;
							}
						}
						
						,{	header : 'PS'
							,dataIndex : 'quarterlyExamPS'
							,width : 60
							,colspan: 2
						}
						
						,{	header : 'WS'
							,dataIndex : 'quarterlyExamWS'
							,width : 60
							,rowspan: 2
						}
					]
				}
				// ,{	header : ''
					// ,width : 1
				// }
			]
		} );
	}
	
	function _grdFinalGrades(){
		var syStore = standards.callFunction( '_createRemoteStore', {
			fields : [ 'code', 'name', 'gradeLevelDescription', 'studentID' ]
			,url : _route + 'getClassSchoolYearAll'
		} )
		
		var grdStore = standards.callFunction( '_createRemoteStore', {
			fields : [ 'code', 'gradeLevelDescription' ]
			,url : _route + 'retrieveGradeLevel'
		} )
		
		var store = standards.callFunction( '_createRemoteStore', {
			fields : [
				'schoolYearDescription'
				,'gradeLevelDescription'
				,'firstQuarter'
				,'secondQuarter'
				,'thirdQuarter'
				,'fourthQuarter'
				,'finalGrade'
			]
			,url : _route + 'getFinalGrade'
		} );
		return standards.callFunction( '_gridPanel', {
			id : 'gridFinalGrades' + _module
			,module : _module
			,store : store
			,noPage : true
			,noDefaultRow : true
			,tbar : {
				content : [
					standards.callFunction( '_createCombo', {
						id : 'schoolYearIDSearch' + _module
						,fieldLabel : 'School Year'
						,store : syStore
						,valueField : 'code'
						,displayField : 'name'
						,style : 'margin-right : 5px;'
						,listeners : {
							select : function(){
								var me = this
									,record = me.findRecord( me.valueField, me.getValue() )
									,index = me.store.indexOf( record )
									,varField = me.store.getAt( index );
									// console.log( varField );
									// console
								if( varField ){
									grdStore.proxy.extraParams.classID = Ext.getCmp( 'schoolYearIDSearch' + _module ).getValue();
									grdStore.load({
										
										callback: function(){
											Ext.getCmp( 'gradeLevelDisplaySearch' + _module ).setValue( grdStore.getAt( 0 ).get( "code" ) );
											// if( store.getCount() > 0 ){
												// standards.callFunction( '_createMessageBox', {
													// msg : 'No records found.'
												// });
											// }
										}
									});
									// Ext.getCmp( 'gradeLevelDisplaySearch' + _module ).setValue( varField.data.gradeLevelDescription );
									// _studID = varField.data.studentID;
								}
							}
						}
					} )
					
					,standards.callFunction( '_createCombo', {
						id : 'gradeLevelDisplaySearch' + _module
						,fieldLabel : 'Grade Level'
						,store : grdStore
						,valueField : 'code'
						,displayField : 'gradeLevelDescription'
						,style : 'margin-right : 5px;'
						,reQuery : false
						,listeners : {
							beforequery: function( combo ) {
								this.store.proxy.extraParams.classID = Ext.getCmp( 'schoolYearIDSearch' + _module ).getValue();
								delete this.lastQuery;
							}
						}
					} )
					
					// ,standards.callFunction( '_createTextField', {
						// id : 'gradeLevelDisplaySearch' + _module
						// ,style : 'margin-right : 5px;'
						// ,fieldLabel : 'Grade Level'
						// ,readOnly : true
					// } )
					,{	xtype : 'button'
						,text : 'View'
						,iconCls : 'glyphicon glyphicon-search'
						,style : 'margin-right : 5px;'
						,listeners : {
							click : function(){
								if( Ext.getCmp( 'schoolYearIDSearch' + _module ).getValue() === null || Ext.getCmp( 'gradeLevelDisplaySearch' + _module ).getValue() === null ){
									standards.callFunction( '_createMessageBox', {
										msg : 'Please fill the fields.'
									});
									return;
								}
								var classID = Ext.getCmp( 'schoolYearIDSearch' + _module ).getValue();
								var gradeLevelDisplaySearch = Ext.getCmp( 'gradeLevelDisplaySearch' + _module ).getValue();
								
								Ext.getCmp( 'gridFinalGrades' + _module ).store.load( {
									params : {
										classID : classID
										,gradeLevelDisplaySearch : gradeLevelDisplaySearch
										,studentID : _studID
									}
									,callback: function( a ,b ,c ){
										// console.log( b );
										var ret = Ext.decode( b.response.responseText );
										// console.log( ret );
										if( ret.match == 2 ){
											standards.callFunction( '_createMessageBox', {
												msg : 'The Final grade for this year has not been finalized.'
											});
											return;
										}
										else if( ret.match == 3 ){
											standards.callFunction( '_createMessageBox', {
												msg : 'You are not allowed to view your grades. Please settle all your payments first.'
											});
											return;
										}
									}
								} );
							}
						}
					}
					,{	xtype : 'button'
						,text : 'Reset'
						,iconCls : 'glyphicon glyphicon-refresh'
						,listeners : {
							click : function(){
								Ext.getCmp( 'gradeLevelDisplaySearch' + _module ).reset();
								Ext.getCmp( 'schoolYearIDSearch' + _module ).reset();
								Ext.getCmp( 'gridFinalGrades' + _module ).store.removeAll();
							}
						}
					}
				]
			}
			,columns : [
				{	text : 'School Year'
					,dataIndex : 'schoolYearDescription'
					,flex : 1
					,minWidth : 150
				}
				,{	text : 'Grade Level'
					,dataIndex : 'gradeLevelDescription'
					,flex : 1
					,minWidth : 150
				}
				,{	text : '1st Quarter'
					,dataIndex : 'firstQuarter'
					,width : 120
					,xtype : 'numbercolumn'
					,format : '0,000.00%'
				}
				,{	text : '2nd Quarter'
					,dataIndex : 'secondQuarter'
					,width : 120
					,xtype : 'numbercolumn'
					,format : '0,000.00%'
				}
				,{	text : '3rd Quarter'
					,dataIndex : 'thirdQuarter'
					,width : 120
					,xtype : 'numbercolumn'
					,format : '0,000.00%'
				}
				,{	text : '4th Quarter'
					,dataIndex : 'fourthQuarter'
					,width : 120
					,xtype : 'numbercolumn'
					,format : '0,000.00%'
				}
				,{	text : 'Final Grade'
					,dataIndex : 'finalGrade'
					,width : 120
					,xtype : 'numbercolumn'
					,format : '0,000.00%'
				}
			]
		} );
	}
	
	function _saveForm( form ){
		
	}
	
	function _resetForm( form ){
	
		Ext.getCmp( 'grdPerformance' + _module ).store.removeAll();
		Ext.getCmp( 'grdWrittenWorks' + _module ).store.removeAll();
		Ext.getCmp( 'grdQuizzes' + _module ).store.removeAll();
		Ext.getCmp( 'classID' + _module ).reset();
		Ext.getCmp( 'gradingSheetQuarter' + _module ).reset();
		Ext.getCmp( 'gradingLevelDescription' + _module ).reset();
		Ext.getCmp( 'subjectID' + _module ).reset();
		Ext.getCmp( 'grdQuarterExams' + _module ).store.removeAll();
		document.getElementById( 'teacherName' + _module ).innerHTML = "";
		document.getElementById( 'dateFinalized' + _module ).innerHTML = "";
	}
	
	function _reloadModuleGrids(){
		var classID = Ext.getCmp( 'classID' + _module ).value
			,subject = Ext.getCmp( 'subjectID' + _module ).value
			,grdPerformance = Ext.getCmp( 'grdPerformance' + _module )
			,grdWrittenWorks = Ext.getCmp( 'grdWrittenWorks' + _module )
			,grdQuizzes = Ext.getCmp( 'grdQuizzes' + _module )
			,grdQuarterExams = Ext.getCmp( 'grdQuarterExams' + _module );
			
			// ,gridLearnersSummary = Ext.getCmp( 'gridPerLearner' + _module );
			
		grdPerformance.store.load( {
			params : {
				classID : classID
				,gradingSheetQuarter : Ext.getCmp('gradingSheetQuarter' + _module).getValue()
				,gradingLevelDescription : Ext.getCmp( 'gradingLevelDescription' + _module ).getValue()
				,subjectID : subject
			}
			,callback: function(){
				if( grdPerformance.store.getCount() == 1 ){
					grdPerformance.store.removeAll()
				}
			}
		} );
		
		grdWrittenWorks.store.load( {
			params : {
				classID : classID
				,gradingSheetQuarter : Ext.getCmp('gradingSheetQuarter' + _module).getValue()
				,gradingLevelDescription : Ext.getCmp( 'gradingLevelDescription' + _module ).getValue()
				,subjectID : subject
			}
			,callback: function(){
				if( grdWrittenWorks.store.getCount() == 1 ){
					grdWrittenWorks.store.removeAll()
				}
			}
		} );
		
		grdQuizzes.store.load( {
			params : {
				classID : classID
				,gradingSheetQuarter : Ext.getCmp('gradingSheetQuarter' + _module).getValue()
				,gradingLevelDescription : Ext.getCmp( 'gradingLevelDescription' + _module ).getValue()
				,subjectID : subject
			}
			,callback: function(){
				if( grdQuizzes.store.getCount() == 1 ){
					grdQuizzes.store.removeAll()
				}
			}
		} );
		
		grdQuarterExams.store.load( {
			params : {
				classID : classID
				,gradingSheetQuarter : Ext.getCmp('gradingSheetQuarter' + _module).getValue()
				,gradingLevelDescription : Ext.getCmp( 'gradingLevelDescription' + _module ).getValue()
				,subjectID : subject
			}
			,callback: function(){
				var rec = grdQuarterExams.store.getAt( grdQuarterExams.store.getCount() - 1 );				// console.log( grdQuarterExams.store.getRange() );
				if( rec ){
					document.getElementById( 'totalQuarter' + _module ).innerHTML = "<span>"+ rec.data.quarterlyGrade +'</span>';
					// console.log( rec );
					// quarterlyGrade
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