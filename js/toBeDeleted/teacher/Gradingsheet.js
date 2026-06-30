/** Grading Sheet module
  * [Developer]
  * Developer: Jayson Dagulo
  * Date Created: Feb. 24, 2016
  * Date Finished: 
  
  * [Database]
	
	
  * [Description]
	This module is by the teachers to record student’s grades on written works, quizzes, exams or other activities, per subject within a school year.
	Each grading sheet is for one subject and one quarter only. This module will also show the Year End Final Grades per student per school year.
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
var Gradingsheet = function(){
	/* variable declarations(Private) */
	var _baseurl, _canSave, _canEdit, _canDelete, _canPrint, _idmodule, _module, _route, _pageTitle, onEdit = 0;
	var visibility = true;
	/* Module Main Container
	 * module components container, handles most of the control in the form( Standards )
	 * @parameter params - configuration variables
	 * @private
	 * @return Ext.tab.Tab
	*/
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
			,moduleType : 'form'
			,isCenter : false
			,minWidth : 1740
			,autoSetCombo : false
			,showEditUsedMsg : false
			,tbar : {
				saveFunc : _saveForm
				,resetFunc : _resetForm
				,listLabel : 'List'
			}
			,extraFormTab : [
				{	buttonLabel : 'Year End Final Grades'
					,buttonIconCls : 'glyphicon glyphicon-align-justify'
					,items :	{	xtype:	'container'
									,layout : 'fit'
									,items:	_grdFinalGrades()
								}
					,buttonHandler : function(){
						Ext.getCmp( 'tbarCardPanel' + _module ).getLayout().setActiveItem( 1 );
					}
				}
			]
			,extraFormButton : [
				{	label : 'Upload'
					,id : 'btnUploadGrade' + _module
					,hidden : true
					,iconCls : 'glyphicon glyphicon-upload'
					,handler : function(){
						console.log( "test Upload" );
						standards.callFunction( '_createMessageBox', {
						msg		: "Please click 'Yes' to upload"
						,action	: 'confirm'
						,fn		: function( btn ){
							if( btn == 'yes' ){
								_saveForm( Ext.getCmp( 'mainFormPanel' + _module ).getForm(), {
									gradingSheetStatus : 3
									,tagAsFinal : 2
								} );
							}
						}
						});
						
					}
				}
				,{	label : 'Tag as Final'
					,id : 'btnTagFinal' + _module
					,hidden : true
					,iconCls : 'glyphicon glyphicon-ok'
					,handler : function(){
						standards.callFunction( '_createMessageBox', {
						msg		: 'Make sure you have reviewed all the grades before tagging the grading sheet as final. This action is irreversible. Do you want to proceed? Yes/No'
						,action	: 'confirm'
						,fn		: function( btn ){
							if( btn == 'yes' ){
								_saveForm( Ext.getCmp( 'mainFormPanel' + _module ).getForm(), {
									gradingSheetStatus : 2
									,tagAsFinal : 2
								} );
							}
						}
						});
						
					}
				}
			]
			,formItems : [
				{	xtype : 'hiddenfield'
					,id : 'gradingSheetID' + _module
				}
				,{	xtype : 'container'
					,layout : 'column'
					,style : 'margin-bottom : 5px;'
					,items : [
						standards.callFunction( '_createCombo', {
							id : 'classID' + _module
							,fieldLabel : 'School Year'
							,allowBlank : false
							,store : schoolYRStore
							,valueField : 'code'
							,displayField : 'name'
							,style : 'margin-right : 10px;'
							,reQuery: false
							,listeners : {
								beforequery: function(){
									// Ext.getCmp( "classID" + _module ).store.params.extraParams.filterClosed = 1
									Ext.getCmp( "classID" + _module ).store.getProxy().extraParams.filterClosed = 1
								}
								,select : function(){
									var me = this
										,record = me.findRecord( me.valueField, me.getValue() )
										,index = me.store.indexOf( record )
										,varField = me.store.getAt( index )
										,gradeLevelDescription = Ext.getCmp( 'gradingLevelDescription' + _module );
									if( varField ){
										gradeLevelDescription.setValue( varField.data.gradeLevelDescription );
									}
									console.warn( onEdit );
									if( onEdit == 0 ){
										console.warn( 'process' );
										_checkSelection( {
											currentComponent : 'classID'
										} );
									}
								}
							}
						} )
						,standards.callFunction( '_createTextField', {
							id : 'gradingLevelDescription' + _module
							,fieldLabel : 'Grade Level'
							,allowBlank : true
							,readOnly : true
							,submitValue : false
							,style : 'margin-right : 10px;'
						} )
						,{	xtype : 'box'
							,html : 'Status: <span id = "statusDisplay' + _module + '"><span style="color : red;">Ongoing</span></span>'
						}
					]
				}
				,{	xtype : 'container'
					,layout : 'column'
					,style : 'margin-bottom : 5px'
					,items : [
						standards.callFunction( '_createCombo', {
							id : 'gradingSheetQuarter' + _module
							,fieldLabel : 'Quarter'
							,allowBlank : false
							,valueField : 'id'
							,displayField : 'name'
							,store : quarterStore
							,style : 'margin-right : 10px;'
							,listeners : {
								select : function(){
									
									if( onEdit == 0 ){
										_checkSelection( {
											currentComponent : 'quarter'
										} );
									}
								}
							}
						} )
						,standards.callFunction( '_createCombo', {
							id : 'subjectID' + _module
							,fieldLabel : 'Subject'
							,store : subjectStore
							,allowBlank : false
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
								
									
									if( onEdit == 0 ){
										_checkSelection( {
											currentComponent : 'subject'
										} );
									}
									
								}
							}
						} )
					]
				}
				,{	xtype : 'tabpanel'
					,items : [
						{	title : 'Quarterly Grades per Activity'
							,border : false
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
									]
								}
							]
						}
						,{	title : 'Quarterly Grades per Learner'
							,border : false
							,id : 'perLearner' + _module
							,layout : 'fit'
							,items : [
								_gridPerLearner()
							]
						}
					]
				}
			]
			,listItems : _gridHistory()
		} );
	}
	
	function _gridHistory(){
		var store = standards.callFunction( '_createRemoteStore', {
			fields : [
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
			fields : [ 'id', 'name' ]
			,url : _route + 'getSearchBy'
		} );
		return standards.callFunction( '_gridPanel', {
			id : 'gridHistory' + _module
			,module : _module
			,store : store
			,noDefaults : true
			,hasNumRows : true
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
								var me = this;
								sStore.proxy.extraParams.sBy = me.value
								Ext.getCmp( 's' + _module ).store.load( {
									callback: function(){
										Ext.getCmp( 's' + _module ).setValue( sStore.getAt(0).get('id') );
										Ext.getCmp( 's' + _module ).fireEvent( 'select' );
									}
								} )
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
								var grd = Ext.getCmp( 'gridHistory' + _module )
									,srchBy = Ext.getCmp( 'sBy' + _module )
									,srch = Ext.getCmp( 's' + _module );
								grd.store.proxy.extraParams.sBy = srchBy.value;
								grd.store.proxy.extraParams.s = srch.value;
								grd.store.load( {
									callback: function(){
										if( grd.store.getCount() <= 0 ){
											standards.callFunction( '_createMessageBox', {
												msg : 'No records found.'
											});
										}
									}
								} );
							}
						}
					} )
					,{	xtype : 'button'
						,iconCls : 'glyphicon glyphicon-refresh'
						,handler : function(){
							console.log( "test 2" );
							var srchBy = Ext.getCmp( 'sBy' + _module )
								,srch = Ext.getCmp( 's' + _module )
								,grd = Ext.getCmp( 'gridHistory' + _module );
							srchBy.reset();
							srch.store.proxy.extraParams.by = srchBy.value;
							srch.reset();
							grd.store.proxy.extraParams.sBy = srchBy.value
							grd.store.proxy.extraParams.s = srch.value
							grd.store.load( {} );
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
					,flex : 1
				}
				,{	header : 'Quarter'
					,dataIndex : 'quarterDisplay'
					,minWidth : 100
					,flex : 1
				}
				,{	header : 'Subject'
					,dataIndex : 'subjectDescription'
					,minWidth : 100
					,flex : 1
				}
				,{	header : 'Status'
					,dataIndex : 'gradingSheetStatusDisplay'
					,minWidth : 100
					,flex : 1
				}
				,standards.callFunction( '_createActionColumn', {
					icon : 'pencil'
					,tooltip : 'Edit record'
					,Func : _editRecord
				} )
				,standards.callFunction( '_createActionColumn', {
					icon : 'remove'
					,canDelete : _canDelete
					,tooltip : 'Remove record'
					,Func : _deleteRecord
				} )
			]
		} );
	}
	
	function _gridPerActivity( params ){
		var link = ''
			,mainHeaderText = ''
			,id = ''
			,actClas = 0;
		if( params.type == 'performance' ){
			mainHeaderText = 'Performance - 25%';
			id = 'grdPerformance';
			actClas = 1;
		}
		else if( params.type == 'writtenworks' ){
			mainHeaderText = 'Written Works - 40%';
			id = 'grdWrittenWorks';
			actClas = 2;
		}
		else if( params.type == 'quizzes' ){
			mainHeaderText = 'Quizzes - 15%';
			id = 'grdQuizzes';
			actClas = 3;
		}
		
		var store = standards.callFunction( '_createRemoteStore', {
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
				,{	name : 'statusID'
					,type : 'number'
				}
				,'learnerRec'
			]
			,url : _route + 'getActivity'
		} );
		store.proxy.extraParams.activityClassification = actClas;
		return standards.callFunction( '_gridPanel', {
			id : id + _module
			,module : _module
			,store : store
			,height : 380
			,width : 572
			,border : false
			,noPage : true
			,plugins : true
			,noDefaultRow : true
			,features : { ftype : 'summary' }
			,bbar : [
				'->'
				,{
					xtype: 'box'
					,html: 'Total'
				}
				,standards.callFunction( '_createTextField', {
					id : id + 'HPS' + _module
					,isNumber : true
					,readOnly : true
					,style : 'margin-right : 210px;'
					,width : 120
				} )
			]
			,columns : [
				{	text : mainHeaderText
					,columns : [
						{	header : 'Date'
							,dataIndex : 'activityDate'
							,width : 90
							,align : 'right'
							,menuDisabled : true
						}
						,{	header : 'Type'
							,dataIndex : 'activityTypeDescription'
							,minWidth : 80
							,flex : 1
							,menuDisabled : true
						}
						,{	header : 'Code'
							,dataIndex : 'activityCode'
							,width : 80
							,align : 'right'
							,menuDisabled : true
							,renderer	: function( val, params, record ){
								return '<font style="color: blue; text-decoration: underline; cursor: pointer;">' + val + '</font>';
							}
							,listeners: {
								click: function( me, td, row, columnIndex, e, rec ) {
									standards.callFunction( '_goToTrans', {
										activityID: rec.data.activityID
										,idmodule : _idmodule
									})
								}
							}
						}
						,{	header : 'Highest<br>Possible Score'
							,dataIndex : 'activiyNumberOfItems'
							,width : 120
							,menuDisabled : true
							,align : 'right'
							,summaryType : 'sum'
							,summaryRenderer : function( value, summaryData, dataIndex ){
								Ext.getCmp( id + 'HPS' + _module ).setValue( value );
							}
						}
						,{	header : 'Learners'
							,width : 100
							,menuDisabled : true
							,renderer : function( val, params, record ){
								return '<button style = "border: 0px none; background: transparent;">View <span class = "glyphicon glyphicon-align-justify"></span></button>';
							}
							,listeners : {
								click : function( me, td, row, columnIndex, e, rec ){
									if( e.target.localName == 'button' ){
										_learnersScoreSummary( rec, row );
									}
								}
							}
						}
						,{	header : 'Remarks'
							,dataIndex : 'statusID'
							,width : 100
							,menuDisabled : true
							,renderer : function( val, params, record ){
								if( val == 1 ){
									return '<span style="color: green">Complete</span>';
								}
								else{
									return '<span style="color: red">Incomplete</span>';
								}
							}
						}
					]
				}
				,{	header : ''
					,width : 1
				}
			]
		} );
	}
	
	function _gridPerLearner(){
		var store = standards.callFunction( '_createRemoteStore', {
			fields : [
				'studentFullName'
				,'studentID'
				,{	name : 'performanceHighestPossibleScore'
					,type : 'number'
				}
				,{	name : 'performanceTotalScore'
					,type : 'number'
				}
				,{	name : 'performancePS'
					,type : 'number'
				}
				,{	name : 'performanceWS'
					,type : 'number'
				}
				,{	name : 'WWHighestPossibleScore'
					,type : 'number'
				}
				,{	name : 'WWTotalScore'
					,type : 'number'
				}
				,{	name : 'writtenWorksPS'
					,type : 'number'
				}
				,{	name : 'writtenWorksWS'
					,type : 'number'
				}
				,{	name : 'QHighestPossibleScore'
					,type : 'number'
				}
				,{	name : 'QTotalScore'
					,type : 'number'
				}
				,{	name : 'quizzesPS'
					,type : 'number'
				}
				,{	name : 'quizzesWS'
					,type : 'number'
				}
				,{	name : 'quarterlyExamHighestPossibleScore'
					,type : 'number'
				}
				,{	name : 'quarterlyExamScore'
					,type : 'number'
				}
				,{	name : 'quarterlyExamPS'
					,type : 'number'
				}
				,{	name : 'quarterlyExamWS'
					,type : 'number'
				}
				,{	name : 'quarterlyGrade'
					,type : 'number'
				}
			]
			,url : _route + 'getPerLearnerDetails'
		} );
		return standards.callFunction( '_gridPanel', {
			id : 'gridPerLearner' + _module
			,module : _module
			,store : store
			,tbar : 'empty'
			,height : 380
			,noPage : true
			,plugins : true
			,noDefaultRow : true
			,columns : [
				{	header : 'Learner'
					,dataIndex : 'studentFullName'
					,minWidth : 120
					,flex : 1
				}
				,{	text : 'Written Works - 40%'
					,columns : [
						{	header : 'Highest<br>Possible Score'
							,dataIndex : 'WWHighestPossibleScore'
							,width : 120
							,align : 'right'
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
						,{	header : 'Total Score'
							,dataIndex : 'WWTotalScore'
							,width : 100
							,align : 'right'
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
						,{	header : 'PS'
							,dataIndex : 'writtenWorksPS'
							,width : 60
							,align : 'right'
							// ,editor :	standards.callFunction( '_createTextField', {
							// 				fieldLabel : ''
							// 				,isNumber : true
							// 				,isDecimal : true
							// 				,maxLength : 6
							// 			} )
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
						,{	header : 'WS'
							,dataIndex : 'writtenWorksWS'
							,width : 60
							,align : 'right'
							// ,editor :	standards.callFunction( '_createTextField', {
							// 				fieldLabel : ''
							// 				,isNumber : true
							// 				,isDecimal : true
							// 				,maxLength : 6
							// 			} )
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
					]
				}
				,{	text : 'Performance - 25%'
					,columns : [
						{	header : 'Highest<br>Possible Score'
							,dataIndex : 'performanceHighestPossibleScore'
							,width : 120
							,align : 'right'
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
						,{	header : 'Total Score'
							,dataIndex : 'performanceTotalScore'
							,width : 100
							,align : 'right'
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
						,{	header : 'PS'
							,dataIndex : 'performancePS'
							,width : 60
							,align : 'right'
							// ,editor :	standards.callFunction( '_createTextField', {
							// 				fieldLabel : ''
							// 				,isNumber : true
							// 				,isDecimal : true
							// 				,maxLength : 6
							// 			} )
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
						,{	header : 'WS'
							,dataIndex : 'performanceWS'
							,width : 60
							,align : 'right'
							// ,editor :	standards.callFunction( '_createTextField', {
							// 				fieldLabel : ''
							// 				,isNumber : true
							// 				,isDecimal : true
							// 				,maxLength : 6
							// 			} )
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
					]
				}
				,{	text : 'Quizzes - 15%'
					,columns : [
						{	header : 'Highest<br>Possible Score'
							,dataIndex : 'QHighestPossibleScore'
							,width : 120
							,align : 'right'
							// ,editor :	standards.callFunction( '_createTextField', {
											// fieldLabel : ''
											// ,isNumber : true
											// ,isDecimal : true
											// ,maxLength : 6
										// } )
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
						,{	header : 'Total Score'
							,dataIndex : 'QTotalScore'
							,width : 100
							,align : 'right'
							// ,editor :	standards.callFunction( '_createTextField', {
											// fieldLabel : ''
											// ,isNumber : true
											// ,isDecimal : true
											// ,maxLength : 6
										// } )
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
						,{	header : 'PS'
							,dataIndex : 'quizzesPS'
							,width : 60
							,align : 'right'
							// ,editor :	standards.callFunction( '_createTextField', {
							// 				fieldLabel : ''
							// 				,isNumber : true
							// 				,isDecimal : true
							// 				,maxLength : 6
							// 			} )
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
						,{	header : 'WS'
							,dataIndex : 'quizzesWS'
							,width : 60
							,align : 'right'
							// ,editor :	standards.callFunction( '_createTextField', {
							// 				fieldLabel : ''
							// 				,isNumber : true
							// 				,isDecimal : true
							// 				,maxLength : 6
							// 			} )
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
					]
				}
				,{	text : 'Quarterly Exam - 20%'
					,columns : [
						{	header : 'Highest<br>Possible Score'
							,dataIndex : 'quarterlyExamHighestPossibleScore'
							,width : 120
							,align : 'right'
							,editor :	standards.callFunction( '_createTextField', {
											fieldLabel : ''
											,isNumber : true
											,isDecimal : true
											,maxLength : 6
										} )
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
						,{	header : 'Total Score'
							,dataIndex : 'quarterlyExamScore'
							,width : 100
							,align : 'right'
							,editor :	standards.callFunction( '_createTextField', {
											fieldLabel : ''
											,isNumber : true
											,isDecimal : true
											,maxLength : 6
										} )
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
						,{	header : 'PS'
							,dataIndex : 'quarterlyExamPS'
							,width : 60
							,align : 'right'
							,editor :	standards.callFunction( '_createTextField', {
											fieldLabel : ''
											,isNumber : true
											,isDecimal : true
											,maxLength : 6
										} )
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
						,{	header : 'WS'
							,dataIndex : 'quarterlyExamWS'
							,width : 60
							,align : 'right'
							,editor :	standards.callFunction( '_createTextField', {
											fieldLabel : ''
											,isNumber : true
											,isDecimal : true
											,maxLength : 6
										} )
							,xtype : 'numbercolumn'
							,format : '0,000.00'
						}
					]
				}
				,{	header : 'Quarterly Grade'
					,dataIndex : 'quarterlyGrade'
					,width : 150
					,editor :	standards.callFunction( '_createTextField', {
									fieldLabel : ''
									,isNumber : true
									,isDecimal : true
									,maxLength: 6
									,align : 'center'
								} )
					,xtype : 'numbercolumn'
					,format : '0,000'
					,align : 'right'
				}
			]
		} );
	}
	
	function _learnersScoreSummary( record, row ){
	console.log( record );
	console.log( row );
		return Ext.create( 'Ext.window.Window', {
			title : 'View Learner\'s Score Summary'
			,id : 'learnerWindow' + _module
			,autoWidth : true
			,autoHeight : true
			,modal : true
			,resizable : false
			,items : [
				{	xtype : 'form'
					,width : 470
					,border : false
					,bodyPadding : '10px'
					,id : 'mainFormPanelLearner' + _module
					,overrideParams : false
					,items : [
						{	xtype : 'container'
							,layout : 'column'
							,style : 'margin-bottom : 5px;'
							,items : [
								{	xtype : 'container'
									,width : 320
									,items : [
										{	xtype : 'box'
											,html : ( (record.data.activityTypeDescription && record.data.activityCode)? record.data.activityTypeDescription + " " + record.data.activityCode : '&nbsp;' )
										}
									]
								}
								,{	xtype : 'container'
									,items : [
										{	xtype : 'label'
											,text : 'Date: ' + record.data.activityDate
										}
									]
								}
							]
						}
						,{	xtype : 'label'
							,text : 'Highest Possible Score: ' + Ext.util.Format.number( record.data.activiyNumberOfItems, '0,000' )
						}
						,_grdLearnersSummary( record.data )
					]
					,buttonAlign : 'center'
					,buttons : [
						{	text : 'Save'
							,id: 'modalSave' +  _module
							,iconCls : 'glyphicon glyphicon-floppy-disk'
							,handler : function(){
								if( !Ext.getCmp( "btnUploadGrade_Gradingsheet" ).isVisible() ){
									return false;
								}
								if( document.getElementById( 'statusDisplay' + _module ).getElementsByTagName("span")[0].textContent != "Final" )
								{
									var store = Ext.getCmp( 'gridLearnersSummary' + _module ).store
										,win = Ext.getCmp( 'learnerWindow' + _module )
										,data = store.getRange()
										,cnt = store.getCount()
										,container = new Array()
										,hasScore = 0;
									for( var i = 0; i < cnt; i++ ){
										var dataNew = data[i].data;
										container.push( {
											studentID : dataNew.studentID
											,studentFullName : dataNew.studentFullName
											,studentScore : dataNew.studentScore
										} );
										if( dataNew.studentScore ){
											hasScore++;
										}
									}
									if( hasScore == cnt ){
										record.set( 'statusID', 1 );
									}
									else{
										record.set( 'statusID', 0 );
									}
									record.set( 'learnerRec', Ext.encode( container ) );
									var form = Ext.getCmp( 'mainFormPanel' + _module ).getForm();
									_saveForm( form, {
										fromLearnerScoreSummary : true
									} );
									win.destroy();
								}else{
									standards.callFunction( '_createMessageBox', {
										msg : 'This activity has been finalized.'
									} )
								}
							}
						}
						,{	text : 'Close'
							,iconCls : 'glyphicon glyphicon-remove'
							,handler : function(){
								Ext.getCmp( 'learnerWindow' + _module ).destroy();
							}
						}
					]
				}
			]
		} ).show();
	}
	
	function _grdLearnersSummary( params ){
		// var dataMaxValue = Ext.decode( params );
			// console.log(params );
		var data = Ext.decode( params.learnerRec );
		// var paramsData = Ext.decode( params );
		if( !data ){
			data = [];
		}
		var store = standards.callFunction( '_createLocalStore', {
			fields : [
				'studentID'
				,'studentFullName'
				,'studentScore'
			]
			,data : data
		} );
		return standards.callFunction( '_gridPanel', {
			id : 'gridLearnersSummary' + _module
			,module : _module
			,store : store
			,height : 400
			,noPage : true
			,plugins : true
			,noDefaultRow : true
			,columns : [
				{	header : 'Learner\'s Name'
					,dataIndex : 'studentFullName'
					,flex : 1
					,minWidth : 100
				}
				,{	header : 'Score'
					,dataIndex : 'studentScore'
					,align : 'right'
					,xtype : 'numbercolumn'
					,allowNull : true
					,format : '0,000'
					,editor :	standards.callFunction( '_createNumberField', {
									fieldLabel : ''
									,isNumber : true
									,isDecimal : false
									,maxValue : Ext.util.Format.number( params.activiyNumberOfItems, '0,000' )
									,allowBlank : true
									,value : 1
									,allowNull : true
									,readOnly : ( document.getElementById( 'statusDisplay' + _module ).getElementsByTagName("span")[0].textContent != "Final" ) ? false : true
									// ,listeners : {
									// }
									
								} )
				}
			]
		} )
	}
	
	function _grdFinalGrades(){
		var syStore = standards.callFunction( '_createRemoteStore', {
			fields : [ 'code', 'name', 'gradeLevelDescription' ]
			,url : _route + 'getClassSchoolYear'
		} )
		var store = standards.callFunction( '_createRemoteStore', {
			fields : [
				'studentFullName'
				,'firstQuarter'
				,'secondQuarter'
				,'thirdQuarter'
				,'forthQuarter'
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
						,style : 'margin-right : 5px;'
						,listeners : {
							select : function(){
								var me = this
									,record = me.findRecord( me.valueField, me.getValue() )
									,index = me.store.indexOf( record )
									,varField = me.store.getAt( index );
								if( varField ){
									Ext.getCmp( 'gradeLevelDisplaySearch' + _module ).setValue( varField.data.gradeLevelDescription );
								}
							}
						}
					} )
					,standards.callFunction( '_createTextField', {
						id : 'gradeLevelDisplaySearch' + _module
						,style : 'margin-right : 5px;'
						,fieldLabel : 'Grade Level'
						,readOnly : true
					} )
					,{	xtype : 'button'
						,text : 'View'
						,iconCls : 'glyphicon glyphicon-search'
						,style : 'margin-right : 5px;'
						,handler : function(){
							console.log( Ext.getCmp( "schoolYearIDSearch" + _module ).getValue() );
							if( Ext.getCmp( "schoolYearIDSearch" + _module ).getValue() === null ){
								standards.callFunction( '_createMessageBox', {
									msg		: 'Please fill the fields'
								});
								return;
							}
								Ext.getCmp( 'gridFinalGrades' + _module ).store.load( {
									params : {
										classID : Ext.getCmp( 'schoolYearIDSearch' + _module ).value
									}
								} )
						}
					}
					,{	xtype : 'button'
						,text : 'Reset'
						,iconCls : 'glyphicon glyphicon-refresh'
						,handler : function(){
							Ext.getCmp( "schoolYearIDSearch" + _module ).reset();
							Ext.getCmp( "schoolYearIDSearch" + _module ).setValue("");
							Ext.getCmp( "gradeLevelDisplaySearch" + _module ).setValue("");
							Ext.getCmp( 'gridFinalGrades' + _module ).store.removeAll();
						}
					}
				]
			}
			,columns : [
				{	text : 'Learner\'s Name'
					,dataIndex : 'studentFullName'
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
					,dataIndex : 'forthQuarter'
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
	
	function _saveForm( form, params ){
		if( form.isValid() ){
			Ext.getCmp( "saveButton" + _module ).el.dom.style.visibility='hidden';
			Ext.getCmp( "btnUploadGrade" + _module ).el.dom.style.visibility='hidden';
			Ext.getCmp( "btnTagFinal" + _module ).el.dom.style.visibility='hidden';
			var container1 = new Array()
				,container2 = new Array()
				
				,grdPerformance = Ext.getCmp( 'grdPerformance' + _module ).getStore()
				,performanceData = grdPerformance.getRange()
				
				,grdWrittenWorks = Ext.getCmp( 'grdWrittenWorks' + _module ).getStore()
				,writtenWorksData = grdWrittenWorks.getRange()
				
				,grdQuizzes = Ext.getCmp( 'grdQuizzes' + _module ).getStore()
				,quizzesData = grdQuizzes.getRange()
				
				,gridPerLearner = Ext.getCmp( 'gridPerLearner' + _module ).getStore()
				,perLearnerData = gridPerLearner.getRange()
				
				,quarter = Ext.getCmp( 'gradingSheetQuarter' + _module ).getRawValue()
				,clasName = Ext.getCmp( 'classID' + _module ).getRawValue()
				,subject = Ext.getCmp( 'subjectID' + _module ).getRawValue()
				,gradingSheetStatus = 1;
			if( params ){
				if( params.gradingSheetStatus ){
					gradingSheetStatus = params.gradingSheetStatus;
				}
			}
			for( var i = 0; i < grdPerformance.getCount(); i++ ){
				var newData = performanceData[i].data;
					var num = Ext.decode( newData.learnerRec );
					if( params && params.gradingSheetStatus == 2  ){
						for( x = 0; x < num.length; x++ ){
								if( num[ x ].studentScore == null ){
									console.log( "test" );
									standards.callFunction( '_createMessageBox', {
										msg : 'An activity is Incomplete.'
									} );
									return;
								}
						}
					}
				container1.push( {
					activityID : newData.activityID
					,learnerRec : newData.learnerRec
				} );
			}
			for( var i = 0; i < grdWrittenWorks.getCount(); i++ )
			{
				var newData = writtenWorksData[i].data;
				var num = Ext.decode( newData.learnerRec );
				if( params && params.gradingSheetStatus == 2 ){
					for( x = 0; x < num.length; x++ ){
							if( num[ x ].studentScore == null ){
								console.log( "test" );
								standards.callFunction( '_createMessageBox', {
									msg : 'An activity is Incomplete.'
								} );
								return;
							}
					}
				}
				container1.push( {
					activityID : newData.activityID
					,learnerRec : newData.learnerRec
				} );
			}
			for( var i = 0; i < grdQuizzes.getCount(); i++ ){
				var newData = quizzesData[i].data;
				if( params && params.gradingSheetStatus == 2 ){
					var num = Ext.decode( newData.learnerRec );
					for( x = 0; x < num.length; x++ ){
							if( num[ x ].studentScore == null ){
								console.log( "test" );
								standards.callFunction( '_createMessageBox', {
									msg : 'An activity is Incomplete.'
								} );
								return;
							}
					}
				}
				container1.push( {
					activityID : newData.activityID
					,learnerRec : newData.learnerRec
				} );
			}
			for( var i = 0; i < gridPerLearner.getCount(); i++ ){
				var newData = perLearnerData[i].data;
				if( params && params.gradingSheetStatus == 2 ){
					if( newData.performancePS == 0 || newData.performanceWS == 0 || newData.writtenWorksPS == 0 || newData.writtenWorksWS == 0 || newData.quizzesPS == 0 || newData.quizzesWS == 0 || newData.quarterlyExamPS == 0 || newData.quarterlyExamWS == 0 || newData.quarterlyGrade == 0 ){
						standards.callFunction( '_createMessageBox', {
							msg : newData.studentFullName + '\'s grade is incomplete.'
						} );
						return;
					}
				}
				container2.push( {
					studentID : newData.studentID
					,performancePS : newData.performancePS
					,performanceWS : newData.performanceWS
					,writtenWorksPS : newData.writtenWorksPS
					,writtenWorksWS : newData.writtenWorksWS
					,quizzesPS : newData.quizzesPS
					,quizzesWS : newData.quizzesWS
					,quarterlyExamHighestPossibleScore : newData.quarterlyExamHighestPossibleScore
					,quarterlyExamScore : newData.quarterlyExamScore
					,quarterlyExamPS : newData.quarterlyExamPS
					,quarterlyExamWS : newData.quarterlyExamWS
					,quarterlyGrade : newData.quarterlyGrade
				} );
			}
			
			form.submit( {
				url : _route + 'saveGradingSheet'
				,params : {
					data1 : Ext.encode( container1 )
					,data2 : Ext.encode( container2 )
					,quarter : quarter
					,clasName : clasName
					,subject : subject
					,gradeLevel : Ext.getCmp( 'gradingLevelDescription' + _module ).value
					,gradingSheetStatus : gradingSheetStatus
				}
				,success : function( action, response ){
					var resp = response.result
						,match = parseInt( resp.match, 10 )
						,gradingSheetID = resp.gradingSheetID;
					if( match == 1 ){ /* grading record already exists */
						standards.callFunction( '_createMessageBox', {
							msg : 'Grading sheet for subject : ' + subject + ' for the school year ' + clasName + '(' + quarter + ') already exists.'
							,icon : 'error'
							,fn : function(){
								Ext.getCmp( 'subjectID' + _module ).focus();
							}
						} )
					}
					else if( match == 2 ){ /* record not found - edit */
						standards.callFunction( '_createMessageBox', {
							msg : 'EDIT_UNABLE'
						} )
					}
					else if( match == 3 ){ /* record modified by other users */
						standards.callFunction( '_createMessageBox', {
							msg : 'SAVE_MODIFIED'
							,action : 'confirm'
							,fn : function( btn ){
								if( btn == 'yes' ){
									form.modify = true;
									_saveForm( form )
								}
							}
						} )
					}
					else if( match == 4 ){ /* grading sheet already tagged as final  */
						standards.callFunction( '_createMessageBox', {
							msg : 'Grading sheet already tagged as Final and cannot be saved.'
							,icon : 'error'
							,fn : function( btn ){
								/* retrieve data */
							}
						} )
					}
					else if( match == 5 ){ /* grading sheet already tagged as final  */
						standards.callFunction( '_createMessageBox', {
							msg : 'Record has been successfully uploaded.'
							,icon : 'warning'
						} );
						if( params ){							
							if( !params.fromLearnerScoreSummary ){
								_resetForm( form );
							}
							else{
								_editRecord( {
									gradingSheetID : gradingSheetID
								} );
							}
						}
						else{
							_resetForm( form );
						}
					}
					else{
						standards.callFunction( '_createMessageBox', {
							msg : 'SAVE_SUCCESS'
						} );
						if( params ){							
							if( !params.fromLearnerScoreSummary ){
								_resetForm( form );
							}
							else{
								_editRecord( {
									gradingSheetID : gradingSheetID
								} );
							}
						}
						else{
							_resetForm( form );
						}
					}
				}
			} )
		}
	}
	
	function _resetForm( form ){
		// visibility = true;
		if( typeof Ext.getCmp( "classID" + _module ).store.getProxy().extraParams.filterClosed != 'undefined' ){
			delete Ext.getCmp( "classID" + _module ).store.getProxy().extraParams.filterClosed
		}
		onEdit = 0;
		form.reset();

				Ext.getCmp( "classID" + _module ).readOnly = false;
				Ext.getCmp( "gradingSheetQuarter" + _module ).readOnly = false;
				Ext.getCmp( "gradingLevelDescription" + _module ).readOnly = false;
				Ext.getCmp( "subjectID" + _module ).readOnly = false;

		Ext.getCmp( 'grdPerformance' + _module ).store.removeAll();
		Ext.getCmp( 'grdWrittenWorks' + _module ).store.removeAll();
		Ext.getCmp( 'grdQuizzes' + _module ).store.removeAll();
		Ext.getCmp( 'gridPerLearner' + _module ).store.removeAll();
		var statusDis = document.getElementById( 'statusDisplay' + _module );
		if( statusDis ){
			statusDis.innerHTML = '<span style = "color: red;">Ongoing</span>';
		}
		Ext.getCmp( 'btnTagFinal' + _module ).setVisible( false );
		Ext.getCmp( 'btnUploadGrade' + _module ).setVisible( false );
		// Ext.getCmp( "subjectID" + _module ).readOnly = false;
	}
	
	function _editRecord1( data ) {
		Ext.getCmp( "saveButton" + _module ).el.dom.style.visibility='hidden';
		Ext.getCmp( "btnUploadGrade" + _module ).el.dom.style.visibility='hidden';
		Ext.getCmp( "btnTagFinal" + _module ).el.dom.style.visibility='hidden';
		_resetForm( _module.getForm() );
		console.log( "edit Record" );
		_module.getForm().retrieveData( {
			url : _route + 'retrieveRecord'
			,params : {
				gradingSheetID : data.gradingSheetID
			}
			,success : function( response ){
				onEdit = 1
				Ext.getCmp( "classID" + _module ).readOnly = true;
				Ext.getCmp( "gradingSheetQuarter" + _module ).readOnly = true;
				Ext.getCmp( "gradingLevelDescription" + _module ).readOnly = true;
				Ext.getCmp( "subjectID" + _module ).readOnly = true;
				if( response.gradingSheetStatus === "2" ){
					standards.callFunction( '_createMessageBox', {
						msg : 'This grading sheet can no longer be modified.'
					} );
				}
				var classID = Ext.getCmp( 'classID' + _module )
					,subjectID = Ext.getCmp( 'subjectID' + _module );
				classID.store.load( {
					callback : function(){
						classID.setValue( response.classID );
						classID.fireEvent( 'select' );
						subjectID.store.proxy.extraParams.subjectID = response.subjectID;
						subjectID.store.proxy.extraParams.classID = response.classID;
						subjectID.store.proxy.extraParams.quarter = response.gradingSheetQuarter;
						subjectID.store.load( {
							callback : function(){
								subjectID.setValue( response.subjectID );
								_reloadModuleGrids();
							}
						} );
					}
				} );
				// Ext.getCmp( "subjectID" + _module ).readOnly = true;
				var statusDis = document.getElementById( 'statusDisplay' + _module )
					,recStatus = parseInt( response.gradingSheetStatus, 10 );
				Ext.getCmp( 'gradingSheetQuarter' + _module ).setValue( parseInt( response.gradingSheetQuarter, 10 ) );
				if( statusDis ){
					if( recStatus == 1 ){
						statusDis.innerHTML = '<span style="color:red;">Ongoing</span>';
					}
					else if( recStatus == 2 ){
						statusDis.innerHTML = '<span style="color:green;">Final</span>';
					}
					else{
						statusDis.innerHTML = '<span style="color:green;">Uploaded</span>';
					}
				}
				if( recStatus == 2 ){
					Ext.getCmp( 'btnTagFinal' + _module ).setVisible( false );
					Ext.getCmp( 'btnUploadGrade' + _module ).setVisible( false );
					// Ext.getCmp( 'modalSave' + _module ).setVisible( false );
					_module.getButton( 'save' ).setVisible( false );
				}
				else{
					Ext.getCmp( 'btnTagFinal' + _module ).setVisible( true );
					Ext.getCmp( 'btnUploadGrade' + _module ).setVisible( true );
					// Ext.getCmp( 'modalSave' + _module ).setVisible( true );
					_module.getButton( 'save' ).setVisible( true );
				}
				console.warn( visibility )
				Ext.getCmp( "saveButton" + _module ).setVisible( visibility )
				Ext.getCmp( "btnUploadGrade" + _module ).setVisible( visibility )
				Ext.getCmp( "btnTagFinal" + _module ).setVisible( visibility )
			}
		} );
	}

	function _editRecord( data, row ){
		Ext.Ajax.request({
		    url: _route + 'checkIfClosed',
		    params: {
				gradingSheetID : data.gradingSheetID
		    },
		    success: function(response){
		        var retP = Ext.decode( response.responseText );
		        console.warn( retP )
		        console.warn( retP.match )
		        if( parseInt( retP.match ) == 1 ){
		        	visibility = false;
		        	console.warn( "GG BOGITICS" )
		        }
		        _editRecord1( data )
		    }
		});
	}
	
	function _deleteRecord( data, row ){
		data.confirmDelete( {
			url : _route + 'deleteRecord'
			,msg : 'Are you sure you want to delete the grading sheet for ' + data.subjectDescription + ', ' + data.gradeLevelDescription + ', SY ' + data.schoolYearDescription
			,params : {
				gradingSheetID : data.gradingSheetID
				,subject : data.subjectDescription
				,gradeLevel : data.gradeLevelDescription
				,schoolYear : data.schoolYearDescription
				,idmodule : _idmodule
			}
			,success : function( response ){
				var ret = Ext.decode( response.responseText )
					,match = parseInt( ret.match, 10 );	
				if( match == 1 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'This grading sheet has already been tagged as final and can no longer be deleted.'
						,icon : 'error'
					} );
				}
				else if( match == 2 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'This grading sheet has already been finalized and can no longer be deleted.'
						,icon : 'error'
					} );
				}
				else{
					standards.callFunction( '_createMessageBox', {
						msg : 'DELETE_SUCCESS'
						,fn : function(){
							var store = Ext.getCmp( 'gridHistory' + _module ).getStore();
							if( store.getCount() ==1 && store.currentPage != 1  ){
								store.currentPage--;
							}
							store.load( {} );
							if( Ext.getCmp( 'gradingSheetID' + _module ).value == data.gradingSheetID ){
								_resetForm( _module.getForm() );
							}
						}
					} )
				}
			}
		} )
	}
	
	function _reloadModuleGrids(){
		var showButtons = 0;
		var classID = Ext.getCmp( 'classID' + _module ).value
			,subject = Ext.getCmp( 'subjectID' + _module ).value
			,grdPerformance = Ext.getCmp( 'grdPerformance' + _module )
			,grdWrittenWorks = Ext.getCmp( 'grdWrittenWorks' + _module )
			,grdQuizzes = Ext.getCmp( 'grdQuizzes' + _module )
			,gridLearnersSummary = Ext.getCmp( 'gridPerLearner' + _module )
			,gradingSheetID = Ext.getCmp( 'gradingSheetID' + _module ).value
			,gradingSheetQuarter = Ext.getCmp( 'gradingSheetQuarter' + _module ).value;
		grdPerformance.store.load( {
			params : {
				classID : classID
				,subjectID : subject
				,gradingSheetID : gradingSheetID
				,gradingSheetQuarter : gradingSheetQuarter
			}
			,callback: function(){
				showButtons = showButtons + 1;
				if( showButtons == 4 ){
					showHiddenButtons();
				}
			}
		} );
		grdWrittenWorks.store.load( {
			params : {
				classID : classID
				,subjectID : subject
				,gradingSheetID : gradingSheetID
				,gradingSheetQuarter : gradingSheetQuarter
			}
			,callback: function(){
				showButtons = showButtons + 1;
				if( showButtons == 4 ){
					showHiddenButtons();
				}
			}
		} );
		grdQuizzes.store.load( {
			params : {
				classID : classID
				,subjectID : subject
				,gradingSheetID : gradingSheetID
				,gradingSheetQuarter : gradingSheetQuarter
			}
			,callback: function(){
				showButtons = showButtons + 1;
				if( showButtons == 4 ){
					showHiddenButtons();
				}
			}
		} );
		gridLearnersSummary.store.load( {
			params : {
				classID : classID
				,subjectID : subject
				,gradingSheetID : gradingSheetID
				,gradingSheetQuarter : gradingSheetQuarter
			}
			,callback: function(){
				showButtons = showButtons + 1;
				if( showButtons == 4 ){
					showHiddenButtons();
				}
			}
		} );
		onEdit = 0;
	}
	
	function showHiddenButtons(){
		Ext.getCmp( "saveButton" + _module ).el.dom.style.visibility='visible';
		Ext.getCmp( "btnUploadGrade" + _module ).el.dom.style.visibility='visible';
		Ext.getCmp( "btnTagFinal" + _module ).el.dom.style.visibility='visible';
	}
	
	function _checkSelection( params ){
		var classID = Ext.getCmp( 'classID' + _module )
			,subject = Ext.getCmp( 'subjectID' + _module )
			,quarter = Ext.getCmp( 'gradingSheetQuarter' + _module )
			,gradingSheetID = Ext.getCmp( 'gradingSheetID' + _module );
		Ext.Ajax.request( {
			url : _route + 'checkInputValid'
			,params : {
				classID : classID.value
				,subject : subject.value
				,quarter : quarter.value
				,gradingSheetID : gradingSheetID.value
			}
			,success : function( response, option ){
				var resp = Ext.decode( response.responseText )
					,match = parseInt( resp.match, 10 );
				if( match == 1 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'A grading sheet for ' + subject.getRawValue() + ' on the ' + quarter.getRawValue() + ' of ' + classID.getRawValue() + ' already exists.'
						,icon : 'error'
						,fn : function( btn ){
							if( params.currentComponent == 'classID' ){
								quarter.reset();
								subject.reset();
							}
							else if( params.currentComponent == 'quarter' ){
								classID.reset();
								subject.reset();
								Ext.getCmp( 'gradingLevelDescription' + _module ).setValue( '' );
							}
							else if( params.currentComponent == 'subject' ){
								classID.reset();
								quarter.reset();
								Ext.getCmp( 'gradingLevelDescription' + _module ).setValue( '' );
							}
						}
					} );
					return;
				}
				_reloadModuleGrids();
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