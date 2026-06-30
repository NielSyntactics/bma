/** School year settings module
  * [Developer]
  * Developer: Mark Christian Lambino
  * Date Created: Sep. 29, 2021
  * Date Finished: Sep. 29, 2021
  
  * [Database]
	schoolyear
	
  * [Description]
	This module allows the authorized administrators to set (add, edit or delete) school years that will be used in displaying and printing the list of every module.. 
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
    var Schoolyear = function(){
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
        function _mainPanel( params ){
            return standards.callFunction( '_mainPanel', {
                config : params
                ,moduleType : 'form'
                ,minWidth : 1020
                ,minHeight : 530
                ,isCenter : false
                ,tbar : {
                    saveFunc : _saveForm
                    ,resetFunc : _resetForm
                    ,listLabel : 'List'
                    ,noExcelButton: true
                    ,noPDFButton: true
                    ,PDFHidden: true
                }
                ,formItems : [
                    {	xtype : 'hiddenfield'
                        ,id : 'schoolYearID' + _module
                        ,value : 0
                    }
                    ,standards.callFunction( '_createNumberField', {
                        id : 'schoolYearStart' + _module
                        ,fieldLabel : 'Start of School Year'
                        ,useThousandSeparator: false
                        ,allowDecimals : false
                        ,allowNegative : false
                        ,allowBlank : false
                        ,minValue	: 1950
                        ,maxValue	: 9999
                    } )
                ]
                ,listItems : _gridHistory()
            } );
        }
        
        function _gridHistory(){
            var store =	standards.callFunction( '_createRemoteStore', {
                            fields: [
                                'schoolYearID'
                                ,'schoolYearStart'
                             ]
                            ,url : _route + 'getSYListing'
                        } );
            return standards.callFunction( '_gridPanel', {
                id : 'gridHistory' + _module
                ,module : _module
                ,store : store
                ,noDefaults : true
                ,hasNumRows: true
                ,columns : [
                    {	header : 'Start of School Year'
                        ,dataIndex : 'schoolYearStart'
                        ,flex : 1
                        ,minWidth : 150
                    }
                    ,standards.callFunction( '_createActionColumn', {
                        icon : 'pencil'
                        ,tooltip : 'Edit record'
                        ,Func : _editRecord
                        ,width : 40
                    } )
                    ,standards.callFunction( '_createActionColumn', {
                        icon : 'remove'
                        ,canDelete : _canDelete
                        ,tooltip : 'Remove record'
                        ,Func : _deleteRecord
                        ,width : 40
                    } )
                ]
            } )
        }
        
        /* Process Form Saving
         * this includes record saving(new), update(edit) with validations for duplicates and etc..
         * @private
         * @return void
        */
        function _saveForm( form ){
            var name = Ext.getCmp( 'schoolYearStart' + _module );
                
            if( form.isValid() ){
                form.submit( {
                    url : _route + 'saveForm'
                    ,params : {}
                    ,success : function( action, response ){
                        var resp = response.result
                            ,match = parseInt( resp.match, 10 );
                        
                        if( match == 1 ){ /* username exists */
                            standards.callFunction( '_createMessageBox', {
                                msg : 'School Year: ' + name.value + ' already exists.'
                                ,fn : function(){
                                    name.focus();
                                }
                            } );
                        }
                        else if( match == 2 ){ /* record not found */
                            standards.callFunction( '_createMessageBox', {
                                msg : 'EDIT_UNABLE'
                            } );
                        }
                        else if( match == 3 ){ /* modified by other users */
                            standards.callFunction( '_createMessageBox', {
                                msg : 'SAVE_MODIFIED'
                                ,action : 'confirm'
                                ,fn : function( btn ){
                                    if( btn == 'yes' ){
                                        form.modify = true;
                                        _saveForm( form );
                                    }
                                }
                            } )
                        }
                        else{
                            standards.callFunction( '_createMessageBox', {
                                msg : 'SAVE_SUCCESS'
                            } );
                            _resetForm( form );
                        }
                    }
                } );
            }
        }
        
        /* Process Reset form
         * clear form values, restoring form component values to its original state
         * @private
         * @return void
        */
        function _resetForm( form ){
            form.reset();
            _oldRowIndex = -1;
        }
        
        function _editRecord( data ){
            _module.getForm().retrieveData( {
                url : _route + 'retrieveRecord'
                ,params : { schoolYearID : data.schoolYearID }
                ,success : function( response ){
                    _oldRowIndex = -1;
                    Ext.getCmp( 'schoolYearStart' + _module ).setValue( response.schoolYearStart );

                    if ( parseInt( response.usedCount ) > 0 ) {
                        standards.callFunction( '_createMessageBox', {
                            msg : 'School Year: ' + response.schoolYearStart + ' is already used and cannot be edited.'
                            ,fn : function(){
                                Ext.getCmp( 'saveButton' + _module ).hide();
                                Ext.getCmp( 'schoolYearStart' + _module ).readOnly = true;
                            }
                        } );
                    }
                }
            } );
        }
                                        
        //         var columnRenderer =	function( value, metaData, record, rowIndex, columnIndex ){
        //                                 if( parseInt(userIDSelected) == 0 ){
        //                                     CUT = utype;
        //                                 }else{ 
        //                                     CUT = Ext.getCmp( 'userName_winMod' + _module ).store.findRecord('bmapsUID', userIDSelected ).data.uType;  ;
        //                                 }
                                        
        //                                 /* Settings for Modules */
        //                                 if( ( CUT > 1 && record.get( 'idmodule' ) == 2 && columnIndex == 4 ) ){ return null; } //Account Card Settings
        //                                 else if( record.get( 'idmodule' ) == 3 && columnIndex == 5  ){ return null; } //User Settings
        //                                 else if( ( record.get( 'idmodule' ) == 4 && columnIndex == 3 ) ||  ( record.get( 'idmodule' ) == 4 && columnIndex == 4 ) ||  ( record.get( 'idmodule' ) == 4 && columnIndex == 5 ) ){ return null; } //Company Settings
        //                                 else if( ( record.get( 'idmodule' ) == 5 && columnIndex == 2 ) ||  ( record.get( 'idmodule' ) == 5 && columnIndex == 3 ) ||  ( record.get( 'idmodule' ) == 5 && columnIndex == 4 ) ||  ( record.get( 'idmodule' ) == 5 && columnIndex == 5 ) ){ return null; } //User Action Logs
        //                                 else if( ( record.get( 'idmodule' ) == 6 && columnIndex == 2 ) || ( record.get( 'idmodule' ) == 6 && columnIndex == 3 ) || (record.get( 'idmodule' ) == 6 && columnIndex == 5) ){ return null; } //Backup and Restore
        //                                 else if( ( record.get( 'idmodule' ) == 7 && columnIndex == 2) ||  ( record.get( 'idmodule' ) == 7 && columnIndex == 3 ) ||  ( record.get( 'idmodule' ) == 7 && columnIndex == 4 ) ){ return null; } //Collection Report
        //                                 else if( ( record.get( 'idmodule' ) == 12 && columnIndex == 2) ||  ( record.get( 'idmodule' ) == 12 && columnIndex == 3 ) ||  ( record.get( 'idmodule' ) == 12 && columnIndex == 4 ) ){ return null; } //Balances Summary
        //                                 else{ return ( new Ext.ux.CheckColumn() ).renderer( value, metaData ); }
        //                             };
        //         return Ext.create( 'Ext.grid.Panel', {
        //             store : moduleStore
        //             ,id : 'gridModules' + _module
        //             ,border : false
        //             ,readOnly :true
        //             ,height : 330
        //             ,selModel : sm
        //             ,plugins : standards.callFunction( '_cellEdit', {} )
        //             ,viewConfig : {
        //                 markDirty : false
        //             }
        //             ,columns : [
        //                 {	xtype : 'gridcolumn'
        //                     ,header : 'Modules'
        //                     ,dataIndex : 'module'
        //                     ,flex : 1						
        //                     ,sortable : false
        //                     ,menuDisabled : true
        //                     ,renderer : function( val, params, record, row_index ){
        //                         if( record.data.chk ){
        //                             sm.select( row_index, true );
        //                         }
        //                         return val;
        //                     }				
        //                 }
        //                 ,{
        //                     header : 'Save'
        //                     ,dataIndex : 'save'
        //                     ,xtype : 'checkcolumn'
        //                     ,width : 80
        //                     ,sortable : false
        //                     ,menuDisabled : true
        //                     ,listeners : checkListeners
        //                     ,renderer : columnRenderer
        //                 }
        //                 ,{
        //                     header : 'Edit'
        //                     ,dataIndex : 'edit'
        //                     ,xtype : 'checkcolumn'
        //                     ,width : 80
        //                     ,sortable : false
        //                     ,menuDisabled : true
        //                     ,listeners : checkListeners
        //                     ,renderer : columnRenderer
        //                 }
        //                 ,{
        //                     header : 'Delete'
        //                     ,dataIndex : 'del'
        //                     ,xtype : 'checkcolumn'
        //                     ,width : 80
        //                     ,sortable : false
        //                     ,menuDisabled : true
        //                     ,listeners : checkListeners
        //                     ,renderer : columnRenderer
        //                 }
        //                 ,{
        //                     header: 'Print'
        //                     ,dataIndex: 'print'
        //                     ,xtype: 'checkcolumn'
        //                     ,width: 80
        //                     ,sortable : false
        //                     ,menuDisabled : true
        //                     ,listeners: checkListeners
        //                     ,renderer: columnRenderer
        //                 }
        //             ]
        //             ,listeners : {
        //                 afterrender : function(){
        //                     loadGrid( {
        //                         mtype : mtype
        //                         ,bmapsUID : data.bmapsUID
        //                     } );
        //                 }
        //             }
        //         } );
        //     }
            
            function loadGrid( params ){
                var grid = Ext.getCmp( 'gridModules' + _module );
                grid.store.load( {
                    params : {
                        mtype : params.mtype
                        ,bmapsUID : params.bmapsUID
                    }
                    ,callback : function(){
                        grid.getView().refresh();
                    }
                } );
            }
        // }
        
        function _deleteRecord( data ){
            data.confirmDelete( {
                url : _route + 'deleteRecord'
                ,params : {
                    schoolYearID : data.schoolYearID
                    ,schoolYearStart : data.schoolYearStart
                    ,idmodule : _idmodule
                }
                ,success : function( response ){
                    var ret = Ext.decode( response.responseText )
                        ,match = parseInt( ret.match, 10 );
                    if( match == 1 ){
                        standards.callFunction( '_createMessageBox', {
                            msg : 'EDIT_UNABLE'
                        } );
                    }
                    else if( match == 2 ){
                        standards.callFunction( '_createMessageBox', {
                            msg : 'School Year already used.'
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
                                if( Ext.getCmp( 'schoolYearID' + _module ).value == data.schoolYearID ){
                                    _resetForm( _module.getForm() );
                                }
                            }
                        } )
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