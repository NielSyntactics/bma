/** Account Card _module
  * [Developer]
  * Developer: Roj Zim Jamil Actub Janubas
  * Date Created: May 14, 2018
  * Date Finished: 
  
  * [Database]
	
	
  * [Description]
  * 	This _module is created for students transsactions for payments and their current status per year.
  * [Modification]
	* -===========================================-
	* name: Jayson Montareal Dagulo
	* Date Start: April 4, 2019
	* Date End: 
	* Description:
		- modify module based on JO#2-Final Design 03-08-2019
		- this is with regards to additional module (Batch Receivable)
	* -===========================================-
   
 **/
var Accountcard = function(){
	/* variable declarations(Private) */
	var _baseurl, _canSave, _canEdit, _canDelete, _canPrint, _idmodule, _module, _route, _pageTitle, onEdit = 0;
	var visibility = true;
	var arrRowIndex = new Array()
	var _allowEdit = true
	var allowActive = 1;
	var isAdmin = 0;
	var  refnum_before_change_value = null ;

	/* _module Main Container
	 * _module components container, handles most of the control in the form( Standards )
	 * @parameter params - configuration variables
	 * @private
	 * @return Ext.tab.Tab
	*/

	function _init(){
		Ext.getCmp( "grdTransactions" + _module ).setVisible( false )
		Ext.getCmp( "btnForm" + _module ).setVisible( false )
		Ext.getCmp( "tbarCardPanel" + _module ).getLayout().setActiveItem( 0 );
		Ext.getCmp( "resetButton" + _module ).setVisible( false );
		/**
		 * Check if admin or superadmin
		*/
		Ext.Ajax.request( {
			url: _route + 'checkIfAdmin'
			,async: true
			,success: function( res ){
				var ret = Ext.decode( res.responseText )
				var	match = parseInt( ret.match, 10 )
				isAdmin = match;
			}
		} )
		
		Ext.TaskManager.start( {
			run : function(){
				if( allowActive == 1 ){
					allowActive = 0
					Ext.get( 'btnEnrolled_List' + _module ).dom.click();
				}
			}
			,interval:300000
		} );
		
	}

	function _mainPanel( params ){
		var	studentStatusStore = standards.callFunction( '_createLocalStore' ,{
			data:[
				'Enrolled'
				,'Not-Enrolled'
				,'Drop-Out'
			]
			,startAt: 0
		} );
		
		var	gradeLevelStore = standards.callFunction( '_createRemoteStore' ,{
			fields: [
				{
					name : 'gradeLevelID'
					,type : 'number'
				}
				,'gradeLevelName'
			]
			,url: _route + 'getGradeLevels'
			,autoLoad: true
		} );

		return standards.callFunction( '_mainPanel', {
			config : params
			,moduleType : 'form'
			,formLabel: "Add New Student"
			,isCenter : false
			,minWidth : 3250
			,minHeight	: 800
			,autoSetCombo : false
			,showEditUsedMsg : false
			,editFunction : _editRecord
			,tbar : 
			{	noPDFButton: true
				,noEXCELButton: true
				,saveFunc : _saveForm
				,resetFunc : _resetForm
				,noListButton : true
			},
			extraFormTab : [
				{	buttonLabel : 'Enrolled List'
					,buttonIconCls : 'glyphicon glyphicon-align-justify'
					,items :	
					{	xtype: 'container'
						,layout: 'fit'
						,items:	_gridHistory( 'gridHistory', 0 )
					}
					,buttonHandler : function( ){
						var searchBy = Ext.getCmp( 'gridHistorysBy' + _module)
						// searchBy.setValue(0)
						// searchBy.fireEvent( 'select' );
					}
				},
				{	buttonLabel : 'Not Enrolled Archive'
					,buttonIconCls : 'glyphicon glyphicon-align-justify'
					,items :	
					{	xtype:	'container'
						,layout : 'fit'
						,items:	_gridHistory( 'notEnrolledGridHistory', 1 )
					
					}
					,buttonHandler : function( ){
						var searchBy = Ext.getCmp( 'notEnrolledGridHistorysBy' + _module)
						// searchBy.setValue(0)
						// searchBy.fireEvent( 'select' );
					}
				},
				{	buttonLabel : 'Drop-out Archive'
					,buttonIconCls : 'glyphicon glyphicon-align-justify'
					,items :	
					{	xtype:	'container'
						,layout : 'fit'
						,items:	_gridHistory( 'dropOutGridHistory', 2 )
					}
					,buttonHandler : function( ){
						var searchBy = Ext.getCmp( 'dropOutGridHistorysBy' + _module)
						// searchBy.setValue(0)
						// searchBy.fireEvent( 'select' );
					}
				}
			]
			,extraFormButton : 
			[
				{	label : 'Add New Student'
					,id : 'newStudent' + _module
					,iconCls : 'glyphicon glyphicon-upload'
					,handler : function(){
						standards.callFunction( 'gotoFormHidden' ,{
							scope : Ext.getCmp( 'btnForm' + _module )
							,module : _module
							,otherFormID : null
							,hasFormPDF : false
							,hasFormExcel : false
						} )
						_resetForm( _module.getForm() )
					}
				}
			]
			,formItems : [
				/* Form Items */
				{	xtype : 'container'
					,layout : 'column'
					,items : 	
					[
						{	xtype : 'container'
							,items : [
								standards.callFunction( '_createTextField' ,{
									id : 'studentID' + _module
									,fieldLabel : 'Student ID'
									,width : 430
									,hidden : true
								} )
								,standards.callFunction( '_createTextField' ,{
									id : 'studentName' + _module
									,fieldLabel : 'Student Name'
									,allowBlank : false
									,width : 430
								} )

								,standards.callFunction( '_createTextField' ,{
									id : 'studentLRN' + _module
									,fieldLabel : 'LRN#'
									// ,allowBlank : false
									,width : 430
								} )
								
							]
						}
						
						,{	xtype : 'container'
							,style : 'margin-left: 10px'
							,items : [
								standards.callFunction( '_createDateField' ,{
									id : 'studentBirthday' + _module
									,allowBlank : false
									,fieldLabel : 'Birthday'
									,width : 430
									,maxValue : Ext.Date.format(new Date(),'Y-m-d')
								} )

								,standards.callFunction( '_createTextField' ,{
									id : 'studentContactNumber' + _module
									,fieldLabel : 'Contact Number'
									,allowBlank : false
									,width : 430
								} )
								
							]
						}
						
						,{	xtype : 'container'
							,style : 'margin-left: 10px'
							,items : [
								standards.callFunction(  '_createCombo' ,{
									id : 'studentStatus' + _module
									,fieldLabel : 'Status'
									,width : 430
									,store : studentStatusStore
									,allowBlank : false
									,forceSelection : true
									,value : 1
								} )

								,standards.callFunction( '_createTextField' ,{
									id : 'studentRemarks' + _module
									,fieldLabel : 'Remarks'
									,width : 430
								} )
								
							]
						}
					]
				}

				,{	xtype: 'fieldset'
					,layout:
					{
						type: 'column'
					}
					,collapsed: false
					,collapsible: true
					,width: 1330
					,title: 'Other Information'
					,items: 
					[
						{	xtype : 'container'
							,layout : 'column'
							,items : [
								{	xtype : 'container'
									,items : [
										standards.callFunction( '_createTextArea' ,{
											id : 'studentAddress' + _module
											,fieldLabel : 'Address'
											,width : 420
											,labelWidth : 125
											,allowBlank : false
										} )
										,standards.callFunction(  '_createCombo' ,{
											id : 'gradeLevelID' + _module
											,fieldLabel : 'Grade Level'
											,store : gradeLevelStore
											,width : 420
											,labelWidth : 125
											,valueField : 'gradeLevelID'
											,displayField : 'gradeLevelName'
											,forceSelection : true
											,emptyText : "Select Grade Level"
											,allowBlank : false
										} )	
									]
								}

								,{	xtype : 'container'
									,style : 'margin-left: 10px'
									,items : [
										standards.callFunction( '_createTextField' ,{
											id : 'studentMothersName' + _module
											,fieldLabel : 'Mother’s Name'
											,width : 430
											,labelWidth : 135
											,allowBlank : false
										} )
										,standards.callFunction( '_createTextField' ,{
											id : 'studentFathersName' + _module
											,fieldLabel : 'Father’s Name'
											,width : 430
											,labelWidth : 135
											,allowBlank : false
										} )
									]
								}

								,{	xtype : 'container'
									,style : 'margin-left: 10px'
									,items: [
										standards.callFunction( '_createTextField' ,{
											id : 'studentReligion' + _module
											,fieldLabel : 'Religion'
											,width : 430
											,labelWidth : 135
											,allowBlank : false
										} )
										,standards.callFunction( '_createTextField' ,{
											id : 'studentAllergies' + _module
											,fieldLabel : 'Allergies'
											,width : 430
											,labelWidth : 135
										} )
									]
								}

							]
						}
						
					]
				}
				,_grdStudents()
				/* End Form Items */
			]
			,listeners : {
				afterrender : _init 
			}
		} );
	}
	
	function checkIfAllowEdit ( ) {
		Ext.Ajax.request({
			url: _route + 'checkIfAllowEdit'
			,params: {}
			,async: false
			,success: function( res ){
				var ret = Ext.decode( res.responseText )
					,match = parseInt( ret.match, 10 );
				if( match == 1 ){
					_allowEdit = true;
				}
				else{
					_allowEdit = false;
				}
			}
		} );
	}

	function _grdStudents(){
		checkIfAllowEdit()
		var beforeEditVal = null
		var __refnum = null
		var __rowIdx = null
		var	orTrStore = standards.callFunction( '_createRemoteStore' ,{
			fields : [
				{	name : 'refID'
					,type : 'number'
				}
				,'refName'
			]
			,url: _route + 'getReference'
		} );

		var searchSYStore = standards.callFunction( '_createRemoteStore' ,{
			fields:[
				{	name : 'schoolYearID'
					,type : 'number'
				}
				,'schoolYearStart'
			]
			,url: _route + 'getSchoolYear'
			,autoLoad: true
		} );
		
		var store = standards.callFunction(  '_createRemoteStore' ,{
			fields: [
				'paymentID'
				,'studentID'
				,'accountCardID'
				,'paymentDate'
				,'_ref'
				,'ref'
				,'refnum'
				,'particulars'
				,'daysPaid'
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
				,{ name: 'others' ,type: 'float' }
				,{ name: 'nutrition' ,type: 'float' }
				,{ name: 'movingUp' ,type: 'float' }
				,{ name: 'totalReceivable' ,type: 'float' }
				,'remarks'
				,'status'
				,'_status'
				,'uneditable'
			]
			,url: _route + 'getTransactions'
		} );
					
		return standards.callFunction( '_gridPanel', {
			id : 'grdTransactions' + _module
			,module : _module
			,store : store
			,plugins : true
			,noPage : true
			,features : { ftype: 'summary' }
			,noDefaultListeners : true
			,bbar :
			[
				{
					html : "Legend:<span style='color: red' class='glyphicon glyphicon-stop'></span> <span style='color: red'>Unsaved record. A required data is empty.</span>",
					xtype : "panel"
				}
				,{
					xtype : 'label'
					,text : 'Balances:'
					,style : 'margin-left: 215px'
				}
				,{
					xtype: 'container'
					,layout: 'column'
					,style: 'margin-left:28px;'
					,items: 
					[
						standards.callFunction( '_createNumberField', {
								id : 'totalAnnualRegistrationTotalReceivable' + _module
								,width : 150
								,style : "margin-left: 8px !important"
								,readOnly : true
								,allowNegative : true
								,minValue	: -1000000
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalTuitionTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
								,minValue	: -1000000
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalBooksTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
								,minValue	: -1000000
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalUniformTotalReceivable' + _module
								,width : 145
								,readOnly : true
								,allowNegative : true
								,minValue	: -1000000
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalCateringTotalReceivable' + _module
								,width : 145
								,readOnly : true
								,allowNegative : true
								,minValue	: -1000000
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
								,width : 145
								,isNumber : true
								,allowNegative : true
								,minValue	: -1000000
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
								,width : 145
								,readOnly : true
								,allowNegative : true
								,minValue	: -1000000
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalGradFeeTotalReceivable' + _module
								,width : 145
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalScoutingTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
								,minValue	: -1000000
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalCharityTotalReceivable' + _module
								,width : 145
								,readOnly : true
								,allowNegative : true
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalNutritionTotalReceivable' + _module
								,width : 145
								,readOnly : true
								,allowNegative : true
								,minValue	: -1000000
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalMovingUpTotalReceivable' + _module
								,width : 160
								,readOnly : true
								,allowNegative : true
								,minValue	: -1000000
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'totalOthersTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
								,minValue	: -1000000
							}
						)
						,standards.callFunction( '_createNumberField', {
								id : 'sumTotalReceivable' + _module
								,width : 150
								,readOnly : true
								,allowNegative : true
								,minValue	: -1000000
							}
						)
					]
				}
				,'->'
			]
			,noDefaultRow : true
			,tbar :
			{
				noDeleteColumn : true
				,content : 'add'
				,labelSeparator : false
				,noExcel: true
				,noPDF : true
				,extraTbar2 : 
				[
					standards.callFunction( '_createCombo', {
							id : 'searchSYStore' + _module
							,fieldLabel : 'School Year'
							,store : searchSYStore
							,emptyText : ''
							,valueField : 'schoolYearID'
							,displayField : 'schoolYearStart'
							,labelWidth : 100
							,width : 210
							,forceSelection : true
							,listeners : 
							{
								select:function( combo, record, index )
								{
									Ext.getCmp( "addButton_grdTransactions" + _module ).setVisible( true )
									Ext.getCmp( "headerGrid" + _module ).setVisible( true )
									
									getGridStudentTransactions( 
										{
											schoolYearID: this.getValue()
											,accountCardSchoolYear: this.getValue()
											,studentID: parseInt( Ext.getCmp( "studentID" + _module ).getValue(), 10 )
											,accountCardID: parseInt( Ext.getCmp( "accountCardID" + _module ).getValue(), 10 )
										} 
									)
								}
								,beforequery: function()
								{
									delete this.lastQuery;
								}
							}
						}
					)
					
					,{
						xtype: 'label'
						,text: 'Total Receivable'
						,style : 'margin-left: 230px'
					}

					,{
						xtype : 'container'
						,layout : 'column'
						,id : 'headerGrid' + _module
						,style : 'margin-top: 0 !important'
						,items: 
						[
							standards.callFunction( '_createTextField' ,{
									id 			: 	'accountCardID' + _module
									,width		: 	150
									,labelWidth	:	0
									,hidden			:	true
								}
							)
							
							,standards.callFunction( '_createTextField' ,{
									id 			: 	'annualRegistrationTotalReceivable' + _module
									,width		: 	150
									,labelWidth	:	0
									,isNumber: true
									,readOnly : ( (_canEdit && _allowEdit) ? false : true )
									,listeners: 
									{
										blur: function ()
										{
											
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()

											saveForm( 
												{
													'field' : this.id.split("_")[0]
													,'fieldValue' : this.getValue()
												} 
											)
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id 			: 	'tuitionTotalReceivable' + _module
									,width		: 	150
									,labelWidth	:	0
									,isNumber: true
									,readOnly : ( (_canEdit && _allowEdit) ? false : true )
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}

											_calcBalance()

											saveForm( 
												{
													'field' : this.id.split("_")[0]
													,'fieldValue' : this.getValue()
												} 
											)
											
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id 			: 	'booksTotalReceivable' + _module
									,width		: 	150
									,labelWidth	:	0
									,isNumber: true
									,readOnly : ( (_canEdit && _allowEdit) ? false : true )
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()
											
											saveForm( 
												{
												'field' : this.id.split("_")[0]
												,'fieldValue' : this.getValue()
												} 
											)
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id 			: 	'uniformTotalReceivable' + _module
									,width		: 	145
									,labelWidth	:	0
									,isNumber: true
									,readOnly : ( (_canEdit && _allowEdit) ? false : true )
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()
											
											saveForm( {
												'field' : this.id.split("_")[0]
												,'fieldValue' : this.getValue()
											} )
											
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id 			: 	'cateringTotalReceivable' + _module
									,width		: 	145
									,labelWidth	:	0
									,isNumber: true
									,readOnly : true
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()
											
											saveForm( 
												{
													'field' : this.id.split("_")[0]
													,'fieldValue' : this.getValue()
												} 
											)
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id 			: 	'extracurricularTotalReceivable' + _module
									,width		: 	150
									,labelWidth	:	0
									,isNumber: true
									,readOnly : true
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()
											
											saveForm( 
												{
													'field' : this.id.split("_")[0]
													,'fieldValue' : this.getValue()
												} 
											)
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id 			: 	'christmasTotalReceivable' + _module
									,width		: 	145
									,labelWidth	:	0
									,isNumber: true
									,readOnly : true
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()
											
											saveForm( 
												{
												'field' : this.id.split("_")[0]
												,'fieldValue' : this.getValue()
												} 
											)
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id 			: 	'familyDayTotalReceivable' + _module
									,width		: 	150
									,labelWidth	:	0
									,isNumber: true
									,readOnly : true
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()
											
											saveForm( 
												{
													'field' : this.id.split("_")[0]
													,'fieldValue' : this.getValue()
												} 
											)
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id 			: 	'pictureTotalReceivable' + _module
									,width		: 	145
									,labelWidth	:	0
									,isNumber: true
									,readOnly : true
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()
											
											saveForm( 
												{
													'field' : this.id.split("_")[0]
													,'fieldValue' : this.getValue()
												} 
											)
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id 			: 	'gradFeeTotalReceivable' + _module
									,width		: 	145
									,labelWidth	:	0
									,isNumber: true
									,readOnly : true
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()
											
											saveForm( 
												{
													'field' : this.id.split("_")[0]
													,'fieldValue' : this.getValue()
												} 
											)
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id 			: 	'scoutingTotalReceivable' + _module
									,width		: 	150
									,labelWidth	:	0
									,isNumber: true
									,readOnly : true
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}

											saveForm( 
												{
													'field' : this.id.split("_")[0]
													,'fieldValue' : this.getValue()
												} 
											)
											
											_calcBalance()
											
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id : 'charityTotalReceivable' + _module
									,width : 145
									,labelWidth	: 0
									,isNumber : true
									,readOnly : true
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()
											
											saveForm( 
												{
													'field' : this.id.split("_")[0]
													,'fieldValue' : this.getValue()
												} 
											)
											
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id : 'nutritionTotalReceivable' + _module
									,width : 145
									,labelWidth	: 0
									,isNumber : true
									,readOnly : true
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()
											
											saveForm( 
												{
													'field' : this.id.split("_")[0]
													,'fieldValue' : this.getValue()
												} 
											)
											
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id : 'movingUpTotalReceivable' + _module
									,width : 160
									,labelWidth	: 0
									,isNumber : true
									,readOnly : true
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()
											
											saveForm( 
												{
													'field' : this.id.split("_")[0]
													,'fieldValue' : this.getValue()
												} 
											)
											
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id : 'othersTotalReceivable' + _module
									,width : 145
									,labelWidth	: 0
									,isNumber : true
									,readOnly : true
									,listeners: 
									{
										blur: function ()
										{
											if ( !_canEdit )
											{
												
												return false
												
											}
											
											if( !_allowEdit )
											{
											
												return false
												
											}
											
											_calcBalance()
											
											saveForm( 
												{
													'field' : this.id.split("_")[0]
													,'fieldValue' : this.getValue()
												} 
											)
											
										}
									}
								}
							)
		
							,standards.callFunction( '_createTextField' ,{
									id : 'accTotalReceivable' + _module
									,width : 145
									,labelWidth	: 0
									,readOnly : true
									,isNumber : true
								}
							)
		
							,standards.callFunction( '_createCheckField', {
									id:'showCancelled' + _module
									,labelWidth		: 	0
									,listeners: 
									{
										change: function() 
										{
										
											var showCancelledTrans = 0
										
											var grd = Ext.getCmp( 'grdTransactions' + _module )
										
											if ( this.value )
											{
												showCancelledTrans = 1
												grd.columns[ 19 ].setWidth( 100 )
											}
											else{
												grd.columns[ 19 ].setWidth( 0 )
											}
											
											grd.store.proxy.extraParams.showCancelledTrans = showCancelledTrans
											
											grd.store.load(
												{
													callback: function(){

														arrRowIndex = new Array();
														_calcBalance()

													}
												}
											)
											
										}
									} 
								}
							)
							,{
								xtype: 'label',
								style: 'margin-left: 10px',
								forId: 'showCancelled' + _module,
								text: 'Show Cancelled Receipts',
								margin: '3px 0px 0px 5px'
							}
						]
					}
				
					,{	
						xtype:		'button'
						,iconCls:	'pdf-icon'
						,handler:	function(){
							if( _canPrint )
							{
								var accountCardSchoolYear = Ext.getCmp( "searchSYStore" + _module ).getValue()
								var accountCardSchoolYearDisp = Ext.getCmp( "searchSYStore" + _module ).getDisplayValue()
								var accountCardID = Ext.getCmp( "accountCardID" + _module ).getValue()
								var studentID = Ext.getCmp( "studentID" + _module ).getValue()
								var studentName = Ext.getCmp( "studentName" + _module ).getValue()
								
								Ext.Ajax.request({
									url: _route + 'printPDF'
									,params: {
										title: _pageTitle
										,accountCardSchoolYear: accountCardSchoolYear
										,accountCardID: accountCardID
										,studentID: studentID
										,accountCardSchoolYearDisp: accountCardSchoolYearDisp
									}
									,success: function(res){
										window.open( _baseurl + 'pdf/accountcard/' + _pageTitle + '.pdf');
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

			,columns: [

				{
					header: 'Date'
					,dataIndex	: 'paymentDate'
					,minWidth	: 125
					,editor: standards.callFunction( '_createDateField',{} )
					,align : 'right'
					,xtype : 'datecolumn'
					
				}
				,{
					header: 'Reference'
					,dataIndex	: '_ref'
					,minWidth	: 125
					,editor 	: standards.callFunction(  '_createCombo' ,{
										id 				: 	'orTrStore' + _module
										,fieldLabel 	: 	''
										,labelWidth		:	0
										,width			: 	430
										,store 			: 	orTrStore
										,valueField 	: 'refName'
										,displayField 	: 'refName'
										,value			: 	1
										,forceSelection : true
									}
								)		
				}
				,{
					header		: 'OR/TR No.'
					,dataIndex	: 'refnum'
					,minWidth	: 120
					,columnWidth: 10
					,align		: 'right'
					,editor		: standards.callFunction( '_createTextField' )
				}
				,{
					header		: 'Particulars'
					,dataIndex	: 'particulars'
					,width		: 150
					,editor		: standards.callFunction( '_createTextField' )
				}
				,{	header: '# of days Paid'
					,dataIndex: 'daysPaid'
					,width: 120
					,align: 'right'
					,xtype: 'numbercolumn'
					,format: '0,000.0'
					,editor: standards.callFunction( '_createNumberField', { decimalPrecision: 1 } )
				}
				,{
					header		: 'Annual Registration'
					,dataIndex	: 'annualRegistration'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Tuition'
					,dataIndex	: 'tuition'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Books'
					,dataIndex	: 'books'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Uniform'
					,dataIndex	: 'uniform'
					,width		: 145
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Catering'
					,dataIndex	: 'catering'
					,width		: 145
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Extra-Curricular'
					,dataIndex	: 'extraCurricular'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Christmas'
					,dataIndex	: 'christmas'
					,width		: 145
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Family Day'
					,dataIndex	: 'familyDay'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Picture'
					,dataIndex	: 'picture'
					,width		: 145
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Grad Fee'
					,dataIndex	: 'gradFee'
					,width		: 145
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Scouting/Camping'
					,dataIndex	: 'scouting'
					,width		: 150
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Charity'
					,dataIndex	: 'charity'
					,width		: 145
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Nutrition Day'
					,dataIndex	: 'nutrition'
					,width		: 145
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Moving Up/Recognition'
					,dataIndex	: 'movingUp'
					,width		: 160
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Others'
					,dataIndex	: 'others'
					,width		: 145
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,editor		: standards.callFunction( '_createNumberField' )
					,summaryRenderer: function(value, summaryData, dataIndex) 
					{
						_calcBalance();
					}
				}
				,{
					header		: 'Total'
					,dataIndex	: 'totalReceivable'
					,width		: 145
					,align		: 'right'
					,xtype		: 'numbercolumn'
					,format		: '0,000.00'
					,summaryRenderer: function(value, summaryData, dataIndex) {
						_calcBalance();
					}
				}
				,{
					header		: 'Remarks'
					,dataIndex	: 'remarks'
					,width		: 150
					,flex		: 1
					,editor: standards.callFunction( '_createTextField')
				}
				,{
					header		: 'Status'
					,dataIndex	: '_status'
					,width		: 0
					,hidden		: false
				}
				,standards.callFunction( '_createActionColumn', {
					icon		: 'ban-circle'
					,tooltip	: 'Cancel Receipt'
					,allowAccess : true
					,Func		: _cancelTrans
				})
				,standards.callFunction( '_createActionColumn', {
					icon		: 'remove'
					,allowAccess : true
					,tooltip	: 'Delete Receipt'
					,Func		: _deleteRecord
				})
			]
			,listeners: {
				selectionchange: function(){
					grd = Ext.getCmp('grdTransactions' + _module).store
					record = null
					
					arrRowIndex.forEach(function(rowIdx) {
					
						record = grd.getAt(rowIdx)
						
						if( 
							record.get('paymentDate') == "" ||
							record.get('ref') == "" ||
							record.get('refnum') == "" /* ||
							(
								(record.get('tuition') == "" || record.get('tuition') <= 0)
								&&
								(record.get('annualRegistration') == "" || record.get('annualRegistration') <= 0)
								&&
								(record.get('books') == "" || record.get('books') <= 0)
								&&
								(record.get('uniform') == "" || record.get('uniform') <= 0)
								&&
								(record.get('catering') == "" || record.get('catering') <= 0)
								&&
								(record.get('extraCurricular') == "" || record.get('extraCurricular') <= 0)
								&&
								(record.get('christmas') == "" || record.get('christmas') <= 0)
								&&
								(record.get('familyDay') == "" || record.get('familyDay') <= 0)
								&&
								(record.get('picture') == "" || record.get('picture') <= 0)
								&&
								(record.get('gradFee') == "" || record.get('gradFee') <= 0)
								&&
								(record.get('scouting') == "" || record.get('scouting') <= 0)
								&&
								(record.get('charity') == "" || record.get('charity') <= 0)
								&&
								(record.get('others') == "" || record.get('others') <= 0)
							) */
							|| ( record.get( 'catering' ) > 0 && record.get('daysPaid') <= 0 )
						){
							Ext.getCmp("grdTransactions" + _module).getView().addRowCls(rowIdx,'insufficient'); 
						}
						else{
							Ext.getCmp("grdTransactions" + _module).getView().removeRowCls(rowIdx,'insufficient'); 
						}
					});
				}
				,beforeedit: function( me, grid ){

					if( !_canEdit ) return false

					var grd = Ext.getCmp('grdTransactions' + _module).store

					var record = null

					record = grd.getAt(me.context.rowIdx)
					
					if( !isAdmin )
					{
						if( parseInt( record.get( 'uneditable' ) ) == 1 && (me.context.colIdx != 3 && me.context.colIdx != 18))
							return false;

					}
					
					if ( parseInt(grid.store.getAt(me.context.rowIdx).get( 'status' ),10) == 1)
					{

						return false

					}

					beforeEditVal = grid.store.getAt(me.context.rowIdx).get( grid.field )

					if ( me.context.colIdx == 2 )
					{
						if ( record.get('_ref') != null )
						{
							
							__refnum = parseInt(record.get('refnum'),10)
						
							__rowIdx = me.context.rowIdx
							
						}
						
					}
					else if( me.context.colIdx == 1 ) {
						Ext.getCmp( "orTrStore" + _module ).store.load({
							callback: function(){
								record.set('_ref', record.get('_ref'))
							}
						})
					}
					
				}
				,edit: function( me, grid, a, b ){
				
					var grd = Ext.getCmp('grdTransactions' + _module).store
					var record = null
					record = grd.getAt(me.context.rowIdx)
					/**
					 * Prevent Saving if same value
					 */
					if( beforeEditVal == record.get( grid.field ) ){
						return false
					}
					/**
					 * For reference Number
					*/
					if( me.context.colIdx == 1 ){
						if( record.get('_ref') == 'OR' || record.get('_ref') == 'TR' ){
							
							if(record.get('_ref') == 'OR'){
								record.set('ref',0)
							}
							else if(record.get('_ref') == 'TR'){
								record.set('ref',1)
							}
							else{
								record.set('ref',null)
							}

							Ext.Ajax.request({
								url: _route + "getLastReferenceNumber",
								method : "POST",
								async: false,
								params: record.data,
								success: function( res ) {
									
									var ret = Ext.decode( res.responseText )
									
									var highestRefNum = grd.getAt(0).get('refnum');
									var hasMatch = 0;
									grd.each(function(dataRecord,id){

										if( dataRecord.get('_ref') == record.get('_ref') && parseInt(dataRecord.get('refnum'),10) == parseInt(ret.refnum,10) ){
											hasMatch = 1;
										}
										
									});
									if( hasMatch ){
										grd.each(function(rec) // go through all the records
										{
											if( rec.get('_ref') == record.get('_ref') ){
												highestRefNum = Math.max(highestRefNum, rec.get('refnum'));
											}
										});
										record.set( 'refnum', (highestRefNum+1) );
										refnum_before_change_value= (highestRefNum+1) ;
									}
									else{
										record.set( 'refnum', ret.refnum );
										refnum_before_change_value=  ret.refnum;
									}
								}
							})
						}

					}
					else if( me.context.colIdx == 2 ){
						console.warn( 'refnum_before_change_value' )
						console.warn( refnum_before_change_value )
						if( record.get('_ref') != null ){
							
							var hasMatch = 0;

							var highestRefNum = grd.getAt(0).get('refnum');
							
							grd.each(function(dataRecord,id){

								if( 
									dataRecord.get('_ref') == record.get('_ref') 
									&& 
									parseInt(dataRecord.get('refnum'),10) == parseInt(record.get('refnum'),10) 
								){
									if( __rowIdx == me.context.rowIdx )
									{
										hasMatch = 0;
									}
									else
									{
										hasMatch = 1;
									}
								}
								
							});
							
							/* if(hasMatch == 0 ){
								
								Ext.Ajax.request({
									url: _route + "validateRefernceNumber",
									method : "POST",
									async: false,
									params: record.data,
									success: function( res ) {
									
										var ret = Ext.decode( res.responseText )

										if(  parseInt(ret.match,10) == 1 ){
											
											standards.callFunction( '_createMessageBox', {
												msg: 'This receipt number already exists. Do you want to proceed?'
												,action:'confirm'
												,fn:function(btn){
													if( btn ==  'no' )record.set( 'refnum', refnum_before_change_value );
													else{
														var rowIdx = me.context.rowIdx;
														Ext.getCmp("grdTransactions" + _module).getView().removeRowCls(rowIdx,'insufficient'); 
										
														var index = arrRowIndex.indexOf(rowIdx);
														
														if (index !== -1) arrRowIndex.splice(index, 1);
														
														record.data.studentID = Ext.getCmp( "studentID" + _module ).getValue()
														record.data.accountCardID = Ext.getCmp( "accountCardID" + _module ).getValue()
														record.data.studentLRN = Ext.getCmp( "studentLRN" + _module ).getValue()
														record.data.schoolYearID = Ext.getCmp( "searchSYStore" + _module ).getValue()
														record.data.studentName = Ext.getCmp( "studentName" + _module ).getValue()
														if( record.data.catering > 0 && record.data.daysPaid <= 0 ){
															standards.callFunction( '_createMessageBox', {
																msg: '# of days Paid should have a value greater than zero if catering amount is provided.'
																,icon: 'error'
															} )
															return false;
														}
														Ext.Ajax.request({
															url: _route + "saveRowTrans",
															method : "POST",
															params: record.data,
															success: function( res ) {
																var ret = Ext.decode( res.responseText )
																record.set( 'paymentID', ret.paymentID )
																record.set( 'totalReceivable', getSum( record ) )
															}
														})
													}
													
													
												}
											} );	
										}else {
											var rowIdx = me.context.rowIdx;
											record.set( 'refnum', ret.refnum );
											Ext.getCmp("grdTransactions" + _module).getView().removeRowCls(rowIdx,'insufficient'); 
							
											var index = arrRowIndex.indexOf(rowIdx);
											
											if (index !== -1) arrRowIndex.splice(index, 1);
											
											record.data.studentID = Ext.getCmp( "studentID" + _module ).getValue()
											record.data.accountCardID = Ext.getCmp( "accountCardID" + _module ).getValue()
											record.data.studentLRN = Ext.getCmp( "studentLRN" + _module ).getValue()
											record.data.schoolYearID = Ext.getCmp( "searchSYStore" + _module ).getValue()
											record.data.studentName = Ext.getCmp( "studentName" + _module ).getValue()
											if( record.data.catering > 0 && record.data.daysPaid <= 0 ){
												standards.callFunction( '_createMessageBox', {
													msg: '# of days Paid should have a value greater than zero if catering amount is provided.'
													,icon: 'error'
												} )
												return false;
											}
											Ext.Ajax.request({
												url: _route + "saveRowTrans",
												method : "POST",
												params: record.data,
												success: function( res ) {
													var ret = Ext.decode( res.responseText )
													record.set( 'paymentID', ret.paymentID )
													record.set( 'totalReceivable', getSum( record ) )
												}
											})
										}

									}
								});
								
								return false;
							}
							else{
								record.set('refnum',null)
							} */
						}
						else{
							record.set('refnum',null)
						}

					}

					if(arrRowIndex.indexOf(me.context.rowIdx)==-1)
					{
						arrRowIndex.push(me.context.rowIdx);
					}
					
					grd = Ext.getCmp('grdTransactions' + _module).store
					record = null
					
					arrRowIndex.forEach(function(rowIdx) {
					
						record = grd.getAt(rowIdx)
						
						if( 
							record.get('paymentDate') == "" ||
							isNaN(parseInt(record.get('ref'),10)) ||
							record.get('refnum') == "" 
							/* Temporary, For review */
							/* ||
							(
								(record.get('tuition') == "" || record.get('tuition') <= 0)
								&&
								(record.get('annualRegistration') == "" || record.get('annualRegistration') <= 0)
								&&
								(record.get('books') == "" || record.get('books') <= 0)
								&&
								(record.get('uniform') == "" || record.get('uniform') <= 0)
								&&
								(record.get('catering') == "" || record.get('catering') <= 0)
								&&
								(record.get('extraCurricular') == "" || record.get('extraCurricular') <= 0)
								&&
								(record.get('christmas') == "" || record.get('christmas') <= 0)
								&&
								(record.get('familyDay') == "" || record.get('familyDay') <= 0)
								&&
								(record.get('picture') == "" || record.get('picture') <= 0)
								&&
								(record.get('gradFee') == "" || record.get('gradFee') <= 0)
								&&
								(record.get('scouting') == "" || record.get('scouting') <= 0)
								&&
								(record.get('charity') == "" || record.get('charity') <= 0)
								&&
								(record.get('others') == "" || record.get('others') <= 0)
							) */
							|| ( record.get( 'catering' ) > 0 && record.get('daysPaid') <= 0 )
						){
							console.warn( 'process' );
							Ext.getCmp("grdTransactions" + _module).getView().addRowCls(rowIdx,'insufficient'); 
						}
						else{
							
							Ext.getCmp("grdTransactions" + _module).getView().removeRowCls(rowIdx,'insufficient'); 
							
							var index = arrRowIndex.indexOf(rowIdx);
							
							if (index !== -1) arrRowIndex.splice(index, 1);
							
							record.data.studentID = Ext.getCmp( "studentID" + _module ).getValue()
							record.data.accountCardID = Ext.getCmp( "accountCardID" + _module ).getValue()
							record.data.studentLRN = Ext.getCmp( "studentLRN" + _module ).getValue()
							record.data.schoolYearID = Ext.getCmp( "searchSYStore" + _module ).getValue()
							record.data.studentName = Ext.getCmp( "studentName" + _module ).getValue()
							if( record.data.catering > 0 && record.data.daysPaid <= 0 ){
								standards.callFunction( '_createMessageBox', {
									msg: '# of days Paid should have a value greater than zero if catering amount is provided.'
									,icon: 'error'
								} )
								return false;
							}
							Ext.Ajax.request({
								url: _route + "saveRowTrans",
								method : "POST",
								params: record.data,
								success: function( res ) {
									var ret = Ext.decode( res.responseText )
									record.set( 'paymentID', ret.paymentID )
									record.set( 'totalReceivable', getSum( record ) )
								}
							})
							
						}
					})
				}
			}
		} );
	}
	
	function getSum( record ){
	
		return (
			parseFloat(( record.get('tuition') != null ? record.get('tuition') : 0 ))
			+
			parseFloat(( record.get('annualRegistration') != null ? record.get('annualRegistration') : 0 ))
			+
			parseFloat(( record.get('books') != null ? record.get('books') : 0 ))
			+
			parseFloat(( record.get('uniform') != null ? record.get('uniform') : 0 ))
			+
			parseFloat(( record.get('catering') != null ? record.get('catering') : 0 ))
			+
			parseFloat(( record.get('extraCurricular') != null ? record.get('extraCurricular') : 0 ))
			+
			parseFloat(( record.get('christmas') != null ? record.get('christmas') : 0 ))
			+
			parseFloat(( record.get('familyDay') != null ? record.get('familyDay') : 0 ))
			+
			parseFloat(( record.get('picture') != null ? record.get('picture') : 0 ))
			+
			parseFloat(( record.get('gradFee') != null ? record.get('gradFee') : 0 ))
			+
			parseFloat(( record.get('scouting') != null ? record.get('scouting') : 0 ))
			+
			parseFloat(( record.get('charity') != null ? record.get('charity') : 0 ))
			+
			parseFloat(( record.get('others') != null ? record.get('others') : 0 ))
		)
		
	}

	function getGridStudentTransactions( params ){

		var grd = Ext.getCmp( "grdTransactions" + _module )

		grd.store.getProxy().extraParams = {
			schoolYearID : params.schoolYearID,
			studentID : params.studentID,
			accountCardID : params.accountCardID
		}

		_module.getForm().retrieveData({
			url: _route + 'getGridStudentTransactions'
			,params: params
			,onEdit: false
			,goToForm: false
			,success:function( action, response ){
				grd.store.load({
					callback: function(){
						arrRowIndex = new Array()
						_calcBalance()
					}
				})
			}
		})
	}
	
	function _calcBalance(){
		/**
		 * Recalculate Balances on footer
		 */
		
		var newStoreObj = new Object;
		if( Ext.getCmp( "grdTransactions" + _module ).store.getCount() > 0 ){
			
			Ext.getCmp( "grdTransactions" + _module ).store.each(function(record){
				
				if( parseInt( record.get( 'status' ), 10 ) != 1 ) {
					newStoreObj = {
						'annualRegistration' : (typeof newStoreObj['annualRegistration'] == 'undefined' ? parseFloat( String( record.get("annualRegistration") ).split( "," ).join( "" ) ) : (  parseFloat(String( record.get("annualRegistration") ).split( "," ).join( "" ) ) + newStoreObj['annualRegistration'] )  ) 
						,'tuition' : (typeof newStoreObj['tuition'] == 'undefined' ? parseFloat( String( record.get("tuition") ).split( "," ).join( "" ) )  : (  parseFloat(String( record.get("tuition") ).split( "," ).join( "" ) ) + newStoreObj['tuition'] )  ) 
						,'books' : (typeof newStoreObj['books'] == 'undefined' ? parseFloat( String( record.get("books") ).split( "," ).join( "" ) )  : (  parseFloat(String( record.get("books") ).split( "," ).join( "" ) ) + newStoreObj['books'] )  ) 
						,'uniform' : (typeof newStoreObj['uniform'] == 'undefined' ? parseFloat( String( record.get("uniform") ).split( "," ).join( "" ) )  : (  parseFloat(String( record.get("uniform") ).split( "," ).join( "" ) ) + newStoreObj['uniform'] )  ) 
						,'catering' : (typeof newStoreObj['catering'] == 'undefined' ? parseFloat( String( record.get("catering") ).split( "," ).join( "" ) )  : (  parseFloat(String( record.get("catering") ).split( "," ).join( "" ) ) + newStoreObj['catering'] )  ) 
						,'extraCurricular' : (typeof newStoreObj['extraCurricular'] == 'undefined' ? parseFloat( String( record.get("extraCurricular") ).split( "," ).join( "" ) )  : (  parseFloat(String( record.get("extraCurricular") ).split( "," ).join( "" ) ) + newStoreObj['extraCurricular'] )  ) 
						,'christmas' : (typeof newStoreObj['christmas'] == 'undefined' ? parseFloat( String( record.get("christmas") ).split( "," ).join( "" ) )  : (  parseFloat(String( record.get("christmas") ).split( "," ).join( "" ) ) + newStoreObj['christmas'] )  ) 
						,'familyDay' : (typeof newStoreObj['familyDay'] == 'undefined' ? parseFloat( String( record.get("familyDay") ).split( "," ).join( "" ) )  : (  parseFloat(String( record.get("familyDay") ).split( "," ).join( "" ) ) + newStoreObj['familyDay'] )  ) 
						,'picture' : (typeof newStoreObj['picture'] == 'undefined' ? parseFloat( String( record.get("picture") ).split( "," ).join( "" ) )  : (  parseFloat(String( record.get("picture") ).split( "," ).join( "" ) ) + newStoreObj['picture'] )  ) 
						,'gradFee' : (typeof newStoreObj['gradFee'] == 'undefined' ? parseFloat( String( record.get("gradFee") ).split( "," ).join( "" ) )  : (  parseFloat(String( record.get("gradFee") ).split( "," ).join( "" ) ) + newStoreObj['gradFee'] )  ) 
						,'scouting' : (typeof newStoreObj['scouting'] == 'undefined' ? parseFloat( String( record.get("scouting") ).split( "," ).join( "" ) )  : (  parseFloat(String( record.get("scouting") ).split( "," ).join( "" ) ) + newStoreObj['scouting'] )  ) 
						,'charity' : (typeof newStoreObj['charity'] == 'undefined' ? parseFloat( String( record.get("charity") ).split( "," ).join( "" ) ) : (  parseFloat(String( record.get("charity") ).split( "," ).join( "" ) ) + newStoreObj['charity'] )  )
						,'nutrition' : (typeof newStoreObj['nutrition'] == 'undefined' ? parseFloat( String( record.get("nutrition") ).split( "," ).join( "" ) ) : (  parseFloat(String( record.get("nutrition") ).split( "," ).join( "" ) ) + newStoreObj['nutrition'] )  )
						,'movingUp' : (typeof newStoreObj['movingUp'] == 'undefined' ? parseFloat( String( record.get("movingUp") ).split( "," ).join( "" ) ) : (  parseFloat(String( record.get("movingUp") ).split( "," ).join( "" ) ) + newStoreObj['movingUp'] )  )
						,'others' : (typeof newStoreObj['others'] == 'undefined' ? parseFloat( String( record.get("others") ).split( "," ).join( "" ) ) : (  parseFloat(String( record.get("others") ).split( "," ).join( "" ) ) + newStoreObj['others'] )  ) 
						,'totalReceivable' : (typeof newStoreObj['totalReceivable'] == 'undefined' ? parseFloat( String( record.get("totalReceivable") ).split( "," ).join( "" ) ) : (  parseFloat(String( record.get("totalReceivable") ).split( "," ).join( "" ) ) + newStoreObj['totalReceivable'] )  ) 
			
					}
					
				}

			});
		}
		else{
			newStoreObj = {
	
				'annualRegistration' : 0
				,'tuition' : 0
				,'books' : 0
				,'uniform' : 0
				,'catering' : 0
				,'extraCurricular' : 0
				,'christmas' : 0
				,'familyDay' : 0
				,'picture' : 0
				,'gradFee' : 0
				,'scouting' : 0
				,'charity' : 0
				,'others' : 0
				,'nutrition' : 0
				,'movingUp' : 0
				,'totalReceivable' : 0
	
			}
		}

		/**
		 * Get Receivables
		 */
		 
		Ext.getCmp( 'totalAnnualRegistrationTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'annualRegistrationTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.annualRegistration
		)
		 
		Ext.getCmp( 'totalTuitionTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'tuitionTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.tuition
		)
		 
		Ext.getCmp( 'totalBooksTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'booksTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.books
		)
		 
		Ext.getCmp( 'totalUniformTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'uniformTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.uniform
		)
		
		Ext.getCmp( 'totalCateringTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'cateringTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.catering
		)
		
		Ext.getCmp( 'totalExtracurricularTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'extracurricularTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.extraCurricular
		)
		
		Ext.getCmp( 'totalChristmasTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'christmasTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.christmas
		)
		
		Ext.getCmp( 'totalFamilyDayTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'familyDayTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.familyDay
		)
		
		Ext.getCmp( 'totalPictureTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'pictureTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.picture
		)
		
		Ext.getCmp( 'totalGradFeeTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'gradFeeTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.gradFee
		)
		
		Ext.getCmp( 'totalScoutingTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'scoutingTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.scouting
		)
		
		Ext.getCmp( 'totalCharityTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'charityTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.charity
		)
		
		Ext.getCmp( 'totalNutritionTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'nutritionTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.charity
		)
		
		Ext.getCmp( 'totalMovingUpTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'movingUpTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.charity
		)
		
		Ext.getCmp( 'totalOthersTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'othersTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.others
		)
		
		Ext.getCmp( 'sumTotalReceivable' + _module ).setValue(
			parseFloat(
				String( Ext.getCmp( 'accTotalReceivable' + _module ).getValue() ).split(",").join("")
			)
			-
			newStoreObj.totalReceivable
		)

		/**
		 * Check if has negative balance
		*/
		// if(
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalAnnualRegistrationTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalTuitionTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalBooksTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalUniformTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalCateringTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalExtracurricularTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalChristmasTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalFamilyDayTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalPictureTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalGradFeeTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalScoutingTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalCharityTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalNutritionTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalMovingUpTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
			// ||
			// parseFloat(
				// String( 
					// Ext.getCmp( "totalOthersTotalReceivable" + _module ).getValue() 
				// ).split(",").join("")
			// ) < 0
		// ){
			// standards.callFunction( '_createMessageBox', {
				// msg : 'Payment(s) is greater than receivable.'
			// });
		// }
		
	}

	function checkIfValidRow(){
		
		var grd = Ext.getCmp('grdTransactions' + _module).store
		var record = null
		var state = 0;
		arrRowIndex.forEach(function(rowIdx) {
		
			record = grd.getAt(rowIdx)

			if( 
				record.get('paymentDate') == "" ||
				record.get('ref') == "" ||
				record.get('refnum') == "" /* ||
				(
					(record.get('tuition') == "" || record.get('tuition') <= 0)
					&&
					(record.get('annualRegistration') == "" || record.get('annualRegistration') <= 0)
					&&
					(record.get('books') == "" || record.get('books') <= 0)
					&&
					(record.get('uniform') == "" || record.get('uniform') <= 0)
					&&
					(record.get('catering') == "" || record.get('catering') <= 0)
					&&
					(record.get('extraCurricular') == "" || record.get('extraCurricular') <= 0)
					&&
					(record.get('christmas') == "" || record.get('christmas') <= 0)
					&&
					(record.get('familyDay') == "" || record.get('familyDay') <= 0)
					&&
					(record.get('picture') == "" || record.get('picture') <= 0)
					&&
					(record.get('gradFee') == "" || record.get('gradFee') <= 0)
					&&
					(record.get('scouting') == "" || record.get('scouting') <= 0)
					&&
					(record.get('charity') == "" || record.get('charity') <= 0)
					&&
					(record.get('others') == "" || record.get('others') <= 0)
					
				) */
				|| ( record.get( 'catering' ) > 0 && record.get('daysPaid') <= 0 )
			){
				Ext.getCmp("grdTransactions" + _module).getView().addRowCls(rowIdx,'insufficient'); 
			}
			else{
				
				Ext.getCmp("grdTransactions" + _module).getView().removeRowCls(rowIdx,'insufficient'); 
				var index = arrRowIndex.indexOf(rowIdx);
				if (index !== -1) arrRowIndex.splice(index, 1);

			}
		});
	}
	
	function _gridHistory( grdID, grdStatus ){
		
		function _historyReset(){
			
			var searchBy = Ext.getCmp(grdID + 'sBy' + _module)
		
			searchBy.setValue(0)
			
			searchBy.fireEvent( 'select' );
		
		}
		
		var store = standards.callFunction( '_createRemoteStore', {
			fields : [
				'accountCardID'
				,'studentID'
				,'studentLRN'
				,'studentName'
				,'studentBirthday'
				,'studentReligion'
				,'studentContactNumber'
				,'studentMothersName'
				,'studentFathersName'
				,'studentRemarks'
				,'totalBalance'
				,'accountCardSchoolYear'
				,'gradeLevelName'
				,'seqNumber'
			]
			,url : _route + 'getHistory'
		} );
		
		var sByStore = standards.callFunction( '_createLocalStore' ,{
					data:[
						'Student Name'
						,'LRN#'
						,'Grade Level'
						,'School Year'
					]
					,startAt: 0
				} );

		var sStore = standards.callFunction( '_createRemoteStore', {
			fields : [ 'id', 'name' ]
			,url : _route + 'getStudentsList'
		} );
		
		return standards.callFunction( '_gridPanel', {
			id : grdID + '' + _module
			,module : _module
			,store : store
			,noDefaults : true
			,hasNumRows : true
			,tbar : {
				noExcel: true
				,noPDF : true
				,content : [
					standards.callFunction( '_createCombo', {
						store : sByStore
						,idmodule : _idmodule
						,fieldLabel : 'Search by'
						,id : grdID + 'sBy' + _module
						,style : 'margin-right : 5px'
						,forceSelection : true
						,listeners : {
							select : function(){
								var me = this;
								var _sStore = Ext.getCmp( grdID + 's' + _module )

								_sStore.store.proxy.extraParams.sBy = me.value
								_sStore.store.proxy.extraParams.studentStatus = grdStatus
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
						,valueField : 'id'
						,displayField : 'name'
						,id : grdID + 's' + _module
						,style : 'margin-right : 5px'
						,listeners : {
							select : function(){
								
								var me = this
								var grd = Ext.getCmp( grdID + '' + _module )
									,srchBy = Ext.getCmp( grdID + 'sBy' + _module ).getValue()
								grd.store.currentPage = 1;
								grd.store.proxy.extraParams.studentStatus = grdStatus;
								grd.store.proxy.extraParams.studentID = me.value;
								grd.store.proxy.extraParams.srchBy = srchBy;
								
								grd.store.load( {
									params: {
										srchBy: srchBy
									}
									,callback: function(){
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
							_historyReset()
						}
					}
					
					,'->'
					
					,{	
						xtype:		'button'
						,iconCls:	'pdf-icon'
						,handler:	function(){
							if( _canPrint )
							{
								var accountCardSchoolYear = Ext.getCmp( "searchSYStore" + _module ).getValue()
								var accountCardSchoolYearDisp = Ext.getCmp( "searchSYStore" + _module ).getDisplayValue()
								var accountCardID = Ext.getCmp( "accountCardID" + _module ).getValue()
								var studentID = Ext.getCmp( "studentID" + _module ).getValue()
								var studentName = Ext.getCmp( "studentName" + _module ).getValue()
								var printType = 0;
								var studentStatus = 0;
								
								switch( grdID ){
									case "gridHistory":
											_pageTitle = "Enrolled List"
											printType = 0
											studentStatus = 0
										break;
									case "notEnrolledGridHistory":
											_pageTitle = "Not-Enrolled List"
											printType = 1
											studentStatus = 1
										break;
									case "dropOutGridHistory":
											_pageTitle = "Drop-Out List"
											printType = 2
											studentStatus = 2
										break;
								}

								var gridHistory       = new Array()
									,gridHistoryRec          = Ext.getCmp( grdID + '' + _module ).getStore().data.items;
								
								for( var i = 0; i < gridHistoryRec.length; i++ ){
									gridHistory.push( gridHistoryRec[i].data )
								}

								Ext.Ajax.request({
									url: _route + 'printPDF'
									,params: {
										title: _pageTitle
										,printType: printType
										,studentStatus: studentStatus
										,gridHistory: Ext.encode( gridHistory )
										,srchBy:  Ext.getCmp( grdID + 'sBy' + _module ).getValue()
										,srchBy:  Ext.getCmp( grdID + 'sBy' + _module ).getValue()
										,studentID:  Ext.getCmp( grdID + 's' + _module ).getValue()
										,studentName: Ext.getCmp( 'studentName' + _module ).getValue()
										,schoolYear:  Ext.getCmp( grdID + 's' + _module ).getDisplayValue()
									}
									,success: function(res){
										window.open( _baseurl + 'pdf/accountcard/' + _pageTitle + '.pdf');
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
			,columns : [
				{	header : 'Grade Level'
					,dataIndex : 'gradeLevelName'
					,minWidth : 120
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTrans', rec.data)
						}
					}
				}
				,{	header : 'Student Name'
					,dataIndex : 'studentName'
					,minWidth : 130
					,flex : 1
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTrans', rec.data)
						}
					}
				}
				,{	header : 'LRN#'
					,dataIndex : 'studentLRN'
					,minWidth : 120
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTrans', rec.data)
						}
					}
				}
				,{	header : 'Sequence No.'
					,dataIndex : 'seqNumber'
					,minWidth : 120
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTrans', rec.data)
						}
					}
				}
				,{	header: 'Father\'s Name'
					,dataIndex: 'studentFathersName'
					,minWidth: 120
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTrans', rec.data)
						}
					}
				}
				,{	header: 'Mother\'s Name'
					,dataIndex: 'studentMothersName'
					,minWidth: 120
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTrans', rec.data)
						}
					}
				}
				,{	header : 'Birthday'
					,dataIndex : 'studentBirthday'
					,minWidth : 140
					,align : 'right'
					,xtype : 'datecolumn'
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTrans', rec.data)
						}
					}
				}
				,{	header : 'Religion'
					,dataIndex : 'studentReligion'
					,minWidth : 120
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTrans', rec.data)
						}
					}
				}
				,{	header : 'Contact Number'
					,dataIndex : 'studentContactNumber'
					,minWidth : 130
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTrans', rec.data)
						}
					}
				}
				,{	header : 'Remarks'
					,dataIndex : 'studentRemarks'
					,minWidth : 150
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTrans', rec.data)
						}
					}
				}
				,{	header : 'Total Balance'
					,dataIndex : 'totalBalance'
					,align: 'right'
					,minWidth : 150
					,sortable : true
					,listeners: {
						dblclick: function( me, td, row, columnIndex, e, rec ) {
							standards.callFunction( '_goToTrans', rec.data)
						}
					}
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
					,Func : _deleteRecord1
				} )
			]
			
			,listeners	: 	{
				afterrender 	: function(){

					_historyReset()
					
				}
			}
		} );
	}
	
	
	function saveForm( data ){
		
		var objectData = new Object()
		var schoolYearID = parseInt(Ext.getCmp( "searchSYStore" + _module ).getValue() ,10)
		var accountCardID = parseInt(Ext.getCmp( "accountCardID" + _module ).getValue() ,10)
		var studentID = parseInt(Ext.getCmp( "studentID" + _module ).getValue() ,10)
		
		if( schoolYearID ) {
		
			objectData[data.field] = data.fieldValue
			objectData["accountCardSchoolYear"] = schoolYearID
			objectData["accountCardID"] = accountCardID
			objectData["studentID"] = studentID
		
			Ext.Ajax.request({
				url: _route + "saveAccTrans",
				method : "POST",
				params: objectData,
				success:function( response ){
					
					var resp = Ext.decode( response.responseText )
					var ret = resp.view[0]
					Ext.getCmp( "accTotalReceivable" + _module ).setValue( parseFloat( ret.accTotalReceivable ) )
					_calcBalance()
					
				}
			})
			
		}
		else{
			standards.callFunction( '_createMessageBox', {
				msg : 'Please select school year.'
			});
		}
	}
	
	function _saveForm( form, params ){

		form.submit({
			url:	_route + 'saveForm'
			,success:function( action, response ){
				var resp = response.result
					,match = parseInt( resp.match, 10 );
				switch( match ) {
					case 0:
						standards.callFunction( '_createMessageBox', {
							msg : 'SAVE_SUCCESS'
						});
						
						Ext.getCmp( "studentID" + _module ).setValue( resp.studentID );
						Ext.getCmp( "mainFormPanel" + _module ).getForm().onEdit = 1
						Ext.getCmp( "grdTransactions" + _module ).setVisible( true )
						Ext.getCmp( "addButton_grdTransactions" + _module ).setVisible( false )
						Ext.getCmp( "headerGrid" + _module ).setVisible( false )
						
						Ext.getCmp( "searchSYStore" + _module ).store.load({
							callback: function(){
								
								Ext.getCmp( "grdTransactions" + _module ).setVisible( true )
								Ext.getCmp( "searchSYStore" + _module ).setValue( parseInt(this.getAt(0).get('schoolYearID'),10) )
								Ext.getCmp( 'searchSYStore' + _module ).fireEvent( 'select' );
							}
						})

					break;
					case 1:
						standards.callFunction( '_createMessageBox', {
							msg : 'Student LRN Number already exist.'
						});	
					break;
					case 2:
						standards.callFunction( '_createMessageBox', {
							msg : 'Please reload page, something is wrong. Your data is unharmed.'
						});	
					break;
					case 3:
						standards.callFunction( '_createMessageBox', {
							msg : 'EDIT_UNABLE'
						});
					break;
					case 4:
						standards.callFunction( '_createMessageBox', {
							msg : 'Your trying to change the student\'s LRN but number already exist to another student.'
						});
					break;
					case 5:
						standards.callFunction( '_createMessageBox', {
							msg : 'Student name already exist.'
						});
					break;
					default:
						standards.callFunction( '_createMessageBox', {
							msg : 'Please reload page, something happened on the server.'
						});
					break;
				}
			}
		})

	}
	
	function _resetForm( form ){
		
		var grid = Ext.getCmp( "grdTransactions" + _module )
		form.reset()
		arrRowIndex = new Array()
		grid.store.clearData();
		grid.store.removeAll();
		Ext.getCmp("showCancelled" + _module).reset()
		
		delete grid.store.proxy.extraParams
		_init();
		
	}
	
	/**
	 * Retrieve details from history to form panel
	*/
	function _editRecord( record, row ){
		arrRowIndex = new Array();
		_module.getForm().retrieveData({
			url: _route + 'retrieveData'
			,params: record
			,success:function( response ){
				
				Ext.getCmp("showCancelled" + _module).reset()
				Ext.getCmp( "studentStatus" + _module ).setValue(parseInt(response.studentStatus,10))
				Ext.getCmp( 'studentStatus' + _module ).fireEvent( 'select' );
				
				
				Ext.getCmp( "gradeLevelID" + _module ).store.load({
					callback: function(){
						Ext.getCmp( "gradeLevelID" + _module ).setValue( parseInt(response.gradeLevelID,10) )
						Ext.getCmp( 'gradeLevelID' + _module ).fireEvent( 'select' );
					}
				})

				Ext.getCmp( "searchSYStore" + _module ).store.load(
					{
						params: {
							studentID: parseInt(response.studentID,10)
						}	
						,callback: function(){
							
							Ext.getCmp( "grdTransactions" + _module ).setVisible( true )
							Ext.getCmp( "searchSYStore" + _module ).setValue( parseInt(response.accountCardSchoolYear,10) )
							Ext.getCmp( 'searchSYStore' + _module ).fireEvent( 'select' );
							
						}
					}
				)

			}
		})

	}

	function _cancelTrans( record, row ){
		
		if( !_canEdit ) return false

		if( parseInt( record.paymentID,10) > 0 && parseInt(record.status,10) != 1){

			_saveCancelTrans( record )
			
		}
		else
		{
			if ( record._ref == "OR" || record._ref == "TR" )
			{
			
				record.studentName = Ext.getCmp( 'studentName' + _module ).getValue()
					
				standards.callFunction( '_createMessageBox', {
					msg 	: 'Are you sure you want to cancel this receipt?'
					,action	: 'confirm'
					,fn		: function( answer ){
						if( answer == 'yes' ){
							
							
							record.studentID = Ext.getCmp( "studentID" + _module ).getValue()
							record.accountCardID = Ext.getCmp( "accountCardID" + _module ).getValue()
							record.studentLRN = Ext.getCmp( "studentLRN" + _module ).getValue()
							record.schoolYearID = Ext.getCmp( "searchSYStore" + _module ).getValue()
							record.studentName = Ext.getCmp( "studentName" + _module ).getValue()
							record.status = 1
							
							Ext.suspendLayouts();
							Ext.Ajax.request({
								url: _route + "saveRowTrans",
								method : "POST",
								params: record,
								// {
								// 	_ref : record._ref
								// 	,_status : record._status
								// 	,accountCardID : record.accountCardID
								// 	,annualRegistration : record.annualRegistration
								// 	,books : record.books 	
								// 	,catering : record.catering
								// 	,charity : record.charity
								// 	,christmas : record.christmas
								// 	,extraCurricular : record.extraCurricular
								// 	,familyDay : record.familyDay
								// 	,gradFee : record.gradFee
								// 	,others : record.others
								// 	,particulars : record.particulars
								// 	,paymentDate : record.paymentDate
								// 	,paymentID : record.paymentID
								// 	,picture : record.picture
								// 	,ref : record.ref
								// 	,refnum : record.refnum
								// 	,remarks : record.remarks
								// 	,schoolYearID : record.schoolYearID	
								// 	,scouting : record.scouting
								// 	,status : record.status
								// 	,studentID : record.studentID
								// 	,studentLRN : record.studentLRN
								// 	,studentName : record.studentName
								// 	,totalReceivable : record.totalReceivable
								// 	,tuition : record.tuition
								// 	,uniform : record.uniform
								// },
								success: function( res ) {
									// var rowGrid = Ext.getCmp( "grdTransactions" + _module ).store.getAt( row )
									// console.warn( rowGrid )
									// var ret = Ext.decode( res.responseText )
									// rowGrid.set( 'paymentID', ret.paymentID )
									// rowGrid.set( 'totalReceivable', getSum( rowGrid ) )

									// Ext.getCmp( "grdTransactions" + _module ).store.loadData([],false);
									arrRowIndex = new Array()
									Ext.getCmp( "grdTransactions" + _module ).store.load({
										callback: function(){
											// Ext.resumeLayouts(true);
										}
									})
									
								}
							})

						}
					}
				});
			}
			else
			{
				standards.callFunction( '_createMessageBox', {
					msg : 'Please fill required fields first.'
				} );
			}
			
		}
	}
	
	function _saveCancelTrans( record ) {
	
		record.studentName = Ext.getCmp( 'studentName' + _module ).getValue()
			
		standards.callFunction( '_createMessageBox', {
			msg 	: 'Are you sure you want to cancel this receipt?'
			,action	: 'confirm'
			,fn		: function( answer ){
				if( answer == 'yes' ){
					
					Ext.Ajax.request({
						url: _route + "cancelTrans",
						method : "POST",
						params: record,
						success:function( response ){
							
							var resp = Ext.decode( response.responseText )
							arrRowIndex = new Array()
							Ext.getCmp( "grdTransactions" + _module ).store.load({
								callback: function(){
									
								}
							})
							
						}
					})

				}
			}
		});
	}
	
	function _deleteRecord( data ){
		
		if( !_canEdit ) return false
		
		if( parseInt( data.paymentID,10) > 0 ){
			
			data.studentName = Ext.getCmp( 'studentName' + _module ).getValue()

			data.confirmDelete( {
				url : _route + 'deleteReceipt'
				,msg: "Are you sure you want to delete this receipt?"
				,params : data
				,success : function( response ){
					var ret = Ext.decode( response.responseText )
						,match = parseInt( ret.match, 10 );
					if( match == 0 ){
						standards.callFunction( '_createMessageBox', {
							msg : 'DELETE_SUCCESS'
						} )

						arrRowIndex = new Array()
						
						Ext.getCmp( "grdTransactions" + _module ).store.load({
							callback: function(){
								arrRowIndex = new Array()
							}
						})
					}
				}
			} );
			
		}
		else
		{
			standards.callFunction( '_createMessageBox', {
				msg : 'Please fill required fields first.'
			} );
		}

	}
	
	function _deleteRecord1( data ){

		data.confirmDelete( {
			url : _route + 'deleteRecord'
			,msg: "Are you sure you want to delete this student?"
			,params : data
			,success : function( response ){

				var ret = Ext.decode( response.responseText )
					,match = parseInt( ret.match, 10 );
				
				if( match == 0 ){
					
					standards.callFunction( '_createMessageBox', {
							msg : 'DELETE_SUCCESS'
						} 
					)
					
					Ext.getCmp( "notEnrolledGridHistory" + _module ).store.proxy.extraParams.studentStatus = 1
					Ext.getCmp( "dropOutGridHistory" + _module ).store.proxy.extraParams.studentStatus = 2
					Ext.getCmp( "gridHistory" + _module ).store.proxy.extraParams.studentStatus = 0
					
					Ext.getCmp( "notEnrolledGridHistory" + _module ).store.load()
					Ext.getCmp( "dropOutGridHistory" + _module ).store.load()
					Ext.getCmp( "gridHistory" + _module ).store.load()
				
				}

			}
		} );
	
	}

	return {
		initMethod : function( params )
		{
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