/** Grade level age management module
  * [Developer]
  * Developer: Niño Niel B. Iroc
  * Date Created: Aug. 09, 2023
  * Date Finished: 
  
  * [Database]
    gradelevel
	
  * [Description]
    This module allows the authorized administrators to set grade level age
  
 * [Modification]
   
 **/
var Acknowledgement = function () {
    /* variable declarations(Private) */
    var _baseurl, _canSave, _canEdit, _canDelete, _canPrint, _idmodule, _module, _route, _pageTitle;
    var _oldRowIndex = -1, comboGradeLevelID, userIDSelected = 0, utype = 5;
    var CUT = 0;

    /* Module Main Container
     * module components container, handles most of the control in the form( Standards )
     * @parameter params - configuration variables
     * @private
     * @return Ext.tab.Tab
    */
    function _mainPanel(params) {

        var gradeLevelStore = standards.callFunction('_createRemoteStore', {
            fields: [
                {
                    name: 'gradeLevelID'
                    , type: 'number'
                }
                , 'gradeLevelName'
                , 'dateOfBirth'
            ]
            , url: _route + 'getGradeLevels'
            , autoLoad: true
        });

		var schoolYearStore = standards.callFunction('_createRemoteStore', {
            fields: [
                {
                    name: 'schoolYearID'
                    , type: 'number'
                }
                , 'schoolYearStart'
            ]
            , url: _route + 'getSchoolYear'
            , autoLoad: true
        });

		var studentStore = standards.callFunction('_createRemoteStore', {
			fields: ['id', 'name']
			, url: _route + 'getStudentsList'
		});


        return standards.callFunction('_mainPanel', {
            config : params
			,moduleType : 'form'
			,formLabel: "Add New Student"
			,isCenter : false
			,minWidth : 800
			,minHeight	: 800
			,autoSetCombo : false
			,hasComponentSeparator: ''
			,noListButton : true
			,noExcelButton: true
			,noPDFButton: true
			,tbar : { 
				noListButton : true
				,noFormButton : true
			}
            ,formItems: [
				{
					items: {
						xtype:'container'
						,items:[
							{
								xtype: 'container'
								,id: 'id-container-ack-1'
								,layout: 'column'
								,width: '100%'
								,items:[ 
									{
										xtype: 'container'
										,id: 'id-container-ack-1-2'
										,width: '40%'
										,items: [
											{
												xtype: 'fieldset',
												title:	'General Filter',
												style: 'margin-left:5px',
												autoHeight:true, 
												items: [
													standards.callFunction('_createCombo', {
														id: 'schooYear' + _module
														, fieldLabel: 'School Year'
														, store: schoolYearStore
														, width: 420
														, labelWidth: 125
														, valueField: 'schoolYearID'
														, displayField: 'schoolYearStart'
														, forceSelection: true
														, emptyText: "Select School year"
														, allowBlank: false
														, listeners:
														{
															select: function (combo, record, index) {
																var selectedRecord = record[0];
															}

														}
													}),

													standards.callFunction('_createCombo', {
														id: 'gradeLevelID' + _module
														, fieldLabel: 'Grade Level'
														, store: gradeLevelStore
														, width: 420
														, labelWidth: 125
														, valueField: 'gradeLevelID'
														, displayField: 'gradeLevelName'
														, forceSelection: true
														, emptyText: "Select Grade Level"
														, allowBlank: false
														, listeners:
														{
															select: function (combo, record, index) {
																const studentSelect = Ext.getCmp('students' + _module);
																if (studentSelect) {
																	studentSelect.setDisabled(false);
																	var me = this;
																	studentSelect.store.proxy.extraParams.gradeLevelID = me.value;

																	studentSelect.store.load({
																		callback: function () {
																			studentSelect.setValue(0)
																			studentSelect.fireEvent('select')
																		}
																	})
																}
															}

														}
													}),

													standards.callFunction('_createCombo', {
														id: 'students' + _module
														, fieldLabel: 'Students'
														, store: studentStore
														, width: 420
														, labelWidth: 125
														, valueField: 'id'
														, displayField: 'name'
														, forceSelection: true
														, emptyText: "Select Student"
														, allowBlank: false
														, disabled: false
														, listeners:
														{
															select: function (combo, record, index) {
															}
														}
													}),
													standards.callFunction( '_createCheckField', {
														id : 'dateSelect' + _module
														,fieldLabel : ''
														,boxLabel : 'With Date'
														,hidden : false
														,listeners: {
															change: function (checkbox, newValue) {
																const dateField = Ext.getCmp('dateField' + _module);
																
																if(newValue) {
																	dateField.show();
																} else {
																	dateField.hide();
																}
															}
														}
													} ),
													standards.callFunction( '_createDateField', {
														id : 'dateField' + _module
														,fieldLabel : 'Date'
														,readOnly	: false
														,hidden : true
														,labelWidth: 125
														,width: 420
														,allowBlank: false
													} )
												]
											}
										]
									},
									{
										xtype: 'container'
										,id: 'id-container-ack-1-3'
										,width: '60%'
										,items: [
											{
												xtype: 'fieldset',
												title:	'Balance Included',
												style: 'margin-left:5px',
												autoHeight:true, 
												items: [ 
													{
														xtype: 'container',
														layout: 'hbox',
														items: [
															{
																xtype: 'container',
																flex: 1,
																layout: 'anchor',
																defaults: {
																	anchor: '100%',
																	style: 'padding-bottom: 5px'
																},
																items: [
                                                                    standards.callFunction( '_createCheckField', {
                                                                    id : 'tuitionSelect' + _module
                                                                    ,fieldLabel : ''
                                                                    ,boxLabel : 'Tuition'
                                                                    ,hidden : false
                                                                    ,listeners: {
                                                                        change: function (checkbox, newValue) {
                                                                            const tuitionStartField = Ext.getCmp('tuitionStart' + _module);
                                                                            const tuitionEndField = Ext.getCmp('tuitionEnd' + _module);
                                                                            if (tuitionStartField && tuitionEndField) {
                                                                                tuitionStartField.setDisabled(!newValue);
                                                                                tuitionEndField.setDisabled(!newValue);
                                                                            }
                                                                        }
                                                                    }
                                                                } ),
													
																	standards.callFunction('_createCheckField', {
																		id: 'uniformSelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Uniform',
																		hidden: false
																		,width: '150px'
																	}),
																	standards.callFunction('_createCheckField', {
																		id: 'cateringSelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Catering',
																		hidden: false
																		,width: '150px'
																	}),
																	standards.callFunction('_createCheckField', {
																		id: 'extraCurricularSelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Skooltech',
																		hidden: false
																		,width: '150px'
																	}),
																	standards.callFunction('_createCheckField', {
																		id: 'christmasSelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Christmas',
																		hidden: false
																		,width: '150px'
																	}),
																	standards.callFunction('_createCheckField', {
																		id: 'familyDaySelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Family Day',
																		hidden: false
																		,width: '150px'
																	}),
																	standards.callFunction('_createCheckField', {
																		id: 'pictureSelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Picture',
																		hidden: false
																		,width: '150px'
																	}),
																	standards.callFunction('_createButton', {
																		id: 'buttonGen' + _module,
																		text: 'Generate',
																		style: 'margin-bottom: 5px',
																		listeners: {	
																			click: onGenerateButtonClick
																		}
																	})
																]
															},
															{
																xtype: 'container',
																flex: 1,
																layout: 'anchor',
																defaults: {
																	anchor: '100%',
																	style: 'padding-bottom: 5px'
																},
																items: [
                                                                    standards.callFunction( '_createCheckField', {
                                                                        id : 'bookSelect' + _module
                                                                        ,fieldLabel : ''
                                                                        ,boxLabel : 'Books'
                                                                        ,hidden : false
                                                                        ,listeners: {
                                                                            change: function (checkbox, newValue) {
                                                                                const bookPercentageField = Ext.getCmp('bookPercentage' + _module);
                                                                                if (bookPercentageField) {
                                                                                    bookPercentageField.setDisabled(!newValue);
                                                                                }
                                                                            }
                                                                        }
                                                                    } ),
																	,standards.callFunction('_createCheckField', {
																		id: 'annualRegSelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Annual Registration',
																		hidden: false
																		,width: '150px'
																	}),
																	standards.callFunction('_createCheckField', {
																		id: 'gradFeeSelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Grad Fee',
																		hidden: false
																		,width: '150px'
																	}),
																	standards.callFunction('_createCheckField', {
																		id: 'scoutingCampingSelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Scouting/Camping',
																		hidden: false
																		,width: '150px'
																	}),
																	standards.callFunction('_createCheckField', {
																		id: 'charitySelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Robotics',
																		hidden: false
																		,width: '150px'
																	}),
																	standards.callFunction('_createCheckField', {
																		id: 'nutritionDaySelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Nutrition Day',
																		hidden: false
																		,width: '150px'
																	}),
																	standards.callFunction('_createCheckField', {
																		id: 'recognitionSelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Recognition',
																		hidden: false
																		,width: '150px'
																	}),
																	standards.callFunction('_createCheckField', {
																		id: 'othersSelect' + _module,
																		fieldLabel: '',
																		boxLabel: 'Others',
																		hidden: false
																		,width: '150px'
																	}),
																]
															}
														]
													}
												]
											}
										]
									}
								] 
							}
						]
					}
				}
				
            ]

        });
    }

	function onGenerateButtonClick(button, e) {
		const schoolYear = Ext.getCmp('schooYear' + _module).getValue();
		const gradeLevel = Ext.getCmp('gradeLevelID' + _module).getValue();
		const student = Ext.getCmp('students' + _module).getValue();
		const date = Ext.getCmp('dateField' + _module).getValue();
		const withDate = Ext.getCmp('dateSelect' + _module).getValue();

		const selected = getSelectedFees(_module);

		if(schoolYear === null) {
			standards.callFunction( '_createMessageBox', {
				msg: 'Please select school year.'
				,icon: 'error'
			} );
			return false;
		}

		if(gradeLevel === null) {
			standards.callFunction( '_createMessageBox', {
				msg: 'Please select grade level.'
				,icon: 'error'
			} );
			return false;
		}

		if(student === null) {
			standards.callFunction( '_createMessageBox', {
				msg: "Please select at least one student."
				,icon: 'error'
			} );
			return false;
		}

		if(date === null || date === '') {
			standards.callFunction( '_createMessageBox', {
				msg: "Please choose date."
				,icon: 'error'
			} );
			return false;
		}

		// All validations passed
		Ext.Ajax.request({
			url: _route + 'generatePayment',
			method: 'POST',
			params: {
				schoolYear: schoolYear,
				gradeLevelID: gradeLevel,
				student: student,
				date: date,
				fees: Ext.encode(selected),
				with_date: withDate
			},
			success: function(response) {
				const result = Ext.decode(response.responseText);

				console.log("result " + result.fileName);
				if (result.success) {
					standards.callFunction('_createMessageBox', {
						msg: 'Generation successful!',
						icon: 'info'
					});
					const downloadUrl = _baseurl + 'images/acknowledgement/' + result.fileName;
					console.log('Download URL:', downloadUrl);
					const link = document.createElement('a');
					link.href = downloadUrl;
					link.download = result.fileName; // Optional: set a specific file name
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					

				} else {
					standards.callFunction('_createMessageBox', {
						msg: result.message || 'Something went wrong.',
						icon: 'error'
					});
				}
			},
			failure: function(response) {
				standards.callFunction('_createMessageBox', {
					msg: 'Server error occurred. Please try again.',
					icon: 'error'
				});
			}
		});

	}

	function getSelectedFees(module) {
		const checkIds = [
			'annualRegSelect',
			'bookSelect',
			'tuitionSelect',
			'uniformSelect',
			'cateringSelect',
			'extraCurricularSelect',
			'christmasSelect',
			'familyDaySelect',
			'pictureSelect',
			'gradFeeSelect',
			'scoutingCampingSelect',
			'charitySelect',
			'nutritionDaySelect',
			'recognitionSelect',
			'othersSelect'
		];

		const result = {};

		checkIds.forEach(function(id) {
			const cmp = Ext.getCmp(id + module);
			result[id] = cmp ? cmp.getValue() : null;
		});

		return result;
	}

    return {
        initMethod: function (params) {
            _baseurl = params.baseurl;
            _canSave = params.canSave;
            _canEdit = params.canEdit;
            _canDelete = params.canDelete;
            _canPrint = params.canPrint;
            _idmodule = params.idmodule;
            _module = params.module;
            _route = params.route;
            _pageTitle = params.pageTitle;

            return _mainPanel(params);
        }
    }
}();