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
var Gradelevelsetup = function () {
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


        return standards.callFunction('_mainPanel', {
            config: params
            , moduleType: 'form'
            , minWidth: 1020
            , minHeight: 530
            , isCenter: false
            , tbar: {
                saveFunc: _saveForm
                , resetFunc: _resetForm
                , noExcelButton: true
                , noPDFButton: true
                , PDFHidden: true
            }
            , formItems: [

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

                            var selectedRecord = record[0];
                            Ext.getCmp("dateOfBirth" + _module).setValue(selectedRecord.get('dateOfBirth'));
                        }

                    }
                }),

                // standards.callFunction('_createNumberField', {
                //     id: 'minimumAge' + _module
                //     , width: 420
                //     , labelWidth: 125
                //     , fieldLabel: 'Minimum Age'
                //     , valueField: 'minimumAge'
                //     , displayField: 'minimumAgeName'
                //     , emptyText: "Enter Minimum Age"
                //     , allowBlank: false
                //     , minValue: 1
                //     , allowDecimals: false
                // }),
                , standards.callFunction('_createDateField', {
                    id: 'dateOfBirth' + _module
                    , fieldLabel: 'Date of Birth'
                    , width: 420
                    , labelWidth: 125
                    , allowBlank: false
                })




            ]

        });
    }

    function _saveForm(form) {
        form.submit({
            url: _route + 'saveForm'
            , success: function (action, response) {
                var resp = response.result
                    , match = parseInt(resp.match, 10);
                switch (match) {
                    case 0:
                        standards.callFunction('_createMessageBox', {
                            msg: 'Successfully changed the grade level birthdate.'
                        });

                        form.reset()


                        break;
                    default:
                        standards.callFunction('_createMessageBox', {
                            msg: 'Please reload page, something happened on the server.'
                        });
                        break;
                }
            }
        })

    }


    function _resetForm(form) {
        form.reset()
    }

    function _editRecord(data) {

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