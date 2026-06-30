/** User settings module
  * [Developer]
   * Developer: Mark Reynor D. Magriña
  * Date Created: May. 15, 2018
  * Date Finished: May. 15, 2018
  
  * [Database]
	bgsu, modules, amodules, and class
	
  * [Description]
	This module allows the authorized administrators to set (add, edit or delete) users who will be allowed to access the system. 
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
var Companysetup = function(){
	/* variable declarations(Private) */
	var _baseurl, _canSave, _canEdit, _canDelete, _canPrint, _idmodule, _module, _route, _pageTitle, _companyID = 0, editedData = 0;
	var _oldRowIndex = -1, comboGradeLevelID, _isGae;
	var edit = 0;
	
	function _init(){
		
		Ext.getCmp('mainForm' + _module).getForm().load({
			url: _route + 'get_defsetForm',				
			success: function(response, action){
				details = Ext.JSON.decode(action.response.responseText);   
				Ext.getCmp('companyName' + _module).setValue(details.data[0].companyName); 
				Ext.getCmp('companyOfficeAddress'+ _module).setValue(details.data[0].companyOfficeAddress); 
				Ext.getCmp('contactNumber'+ _module).setValue(details.data[0].contactNumber); 
				_companyID = details.data[0].companyID;
				/*set image*/
				// Ext.getDom('imageBox' + _module).src = details.data[0].companyLogo;
				Ext.getDom('imageBox' + _module).src = details.data[0].imageBox;
				
				
				// Ext.getDom('companyLogo' + _module).src = details.data[0].companyLogo;
				// Ext.getCmp('companyLogo' + _module).setRawValue("C:\\fakepath\\" + details.data[0].logoName); 

				
				if( parseInt(_companyID) > 0 ){ editedData = 1; }
					
				com_logo = details.data[0].companyLogo;
			}
			// ,failure:function(){
				// Ext.MessageBox.alert('SYSTEM MESSAGE', 'No company details found or Database connectivity error: Please Try Again.');
				// lMask.destroy();
			// }
		});
	}
	
	
	
	/* Module Main Container
	 * module components container, handles most of the control in the form( Standards )
	 * @parameter params - configuration variables
	 * @private
	 * @return Ext.tab.Tab
	*/
	function _mainPanel( params ){		
		return standards.callFunction( '_mainPanel', {
			config : params
			,id: 'mainForm' + _module
			,moduleType : 'form'
			// ,moduleType : 'report'
			,minWidth : 1020
			,minHeight : 530
			,isCenter : false
			
			,tbar : {
				saveFunc : _saveForm
				,resetFunc : _resetForm
				,noFormButton: true
				,noListButton: true
			}
			,formItems : [
				{
					xtype:'container'
					,items:[
						{
							xtype: 'container'
							,id: 'id-container-1'
							,layout: 'column'
							,width: '100%'
							,items:[
								{
									xtype: 'container'
									,id: 'id-container-1-2'
									,width: '50%'
									,items:[
												standards.callFunction( '_createTextField' ,{
																			id: 'companyName' + _module
																			,fieldLabel: 'Company Name'
																			,allowBlank: false
																			,width: 440
																			,style: 'margin-bottom: 5px;'
																		})
												,standards.callFunction( '_createTextArea' ,{
																			id: 'companyOfficeAddress' + _module
																			,fieldLabel: 'Office Address'
																			,allowBlank: false
																			,width: 440
																			,height: 100
																			,style: 'margin-bottom: 5px;'
																		})
												,standards.callFunction( '_createTextField' ,{
																			id: 'contactNumber' + _module
																			,fieldLabel: 'Contact Number'
																			,allowBlank: false
																			,width: 440
																			,style: 'margin-bottom: 5px;'	
																		})
									
									]
								}
								,{
									xtype: 'container'
									,id: 'id-container-1-3'
									,width: '50%'
									,items:[
										{
											xtype: 'image'
											,style: 'border: .5px solid black; marginBottom: 10px'
											,src: ( _isGae? Ext.getConstant( 'DEFAULT_IMAGE_BIN' ) : Ext.getConstant( 'LOGOPATH' ) + Ext.getConstant( 'DEFAULT_EMPTY_IMG' ) )
											,width: 300
											,height: 200
											,id: 'imageBox' + _module 
										}
										,{
											xtype: 'container'
											,items:[
												{
													xtype: 'label'
													,forId: 'myLabelId'
													,text: 'Best image dimension for the header is 300 x 145px.'
												}
												,{	
													xtype: 'container'
													,layout: 'column'
													,items:[
														standards.callFunction( '_createFileUpload', {
															id: 'companyLogo' + _module
															,buttonOnly: false
															,width: 280
															,iconCls: 'glyphicon glyphicon-folder-open'
															,style: 'background: gradient(to right, #007fe5, #007fe5); margin-left:5px;'
															,imageBox: 'imageBox' + _module
														})
														,{
															xtype: 'button'
															,iconCls: 'glyphicon glyphicon-refresh'
															,style: 'background:gradient(to right, #007fe5, #007fe5); margin-left:3px;'
															,handler: function(){
																edit = 1
																Ext.getCmp( 'imageBox' + _module ).setSrc( Ext.getConstant( 'LOGOPATH' ) + Ext.getConstant( 'DEF_IMG' ) );
															}
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
			]
			,listeners: {
					afterrender : _init
			}
		} );
	}
	
	function _saveForm( form ){
		logoName = Ext.getCmp( 'companyLogo' + _module ).getValue();
		
		// console.log(Ext.getConstant('LOGOPATH'));
		
		// return false;
		
		form.submit({
			url: _route + 'saveForm'
			,params:{
				companyLogo: logoName
				,companyID: _companyID
				,editedRec: editedData
				,edit     : edit
			}
			,success:function( action, response ){
				var match = parseInt( response.result.match, 10 );
				var logoNameFromController = response.result.view;
				var log = response.result.log;
				var loadType =  parseInt( response.result.loadType );
				edit = 0
				if( match == 0 ){
					standards.callFunction( '_createMessageBox', {
						msg: 'SAVE_SUCCESS'
					});
					
				if( logoNameFromController != '' ){
					Ext.getCmp( 'imageBox' + _module ).setSrc( Ext.getConstant( 'LOGOPATH' ) + logoNameFromController );
					Ext.get('logoId').el.dom.src = Ext.getConstant( 'LOGOPATH' ) + logoNameFromController;
				}
				// _resetForm( form );
				}			
			}
		});
	}		
	
	/* Process Reset form
	 * clear form values, restoring form component values to its original state
	 * @private
	 * @return void
	*/
	function _resetForm( form ){
		edit = 1;
		form.reset();
		// _init();
		
	}
	
	return {
		initMethod : function( params ){
			_baseurl 	= params.baseurl;
			_canSave 	= params.canSave;
			_canEdit 	= params.canEdit;
			_canDelete 	= params.canDelete;
			_canPrint 	= params.canPrint;
			_idmodule 	= params.idmodule;
			_module 	= params.module;
			_route 		= params.route;
			_pageTitle 	= params.pageTitle;
			
			_isGae		= params.isGae;			
			
			return _mainPanel( params );
		}
	}
}();