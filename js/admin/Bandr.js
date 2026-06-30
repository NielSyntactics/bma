/** User settings module
  * [Developer]
  * Developer: Mark Reynor D. Magriña
  * Date Created: May. 17, 2018
  * Date Finished: May. 17, 2018
  
  * [Database]
	bgsu, modules, amodules, and class
	
  * [Description]
	This module allows the authorized administrators to set (add, edit or delete) users who will be allowed to access the system. 
	Most of the components created are based on standards file (js/standards/Standards.js, js/standards/Overrides.js, js/standards/Constants.js)
  
 * [Modification]
   
 **/
var Bandr = function(){
	/* variable declarations(Private) */
	var _baseurl, _canSave, _canEdit, _canDelete, _canPrint, _idmodule, _module, _route, _pageTitle;
	var _oldRowIndex = -1, comboGradeLevelID, _isGae;
	
	
	function _init(){
		Ext.apply(Ext.form.field.VTypes, {

			file : function(val, field) {
				var fileName = /^.*\.(sql)$/i;
				return fileName.test(val);
			},
			fileMask : /[a-z_\.]/i 
		 
		});
		Ext.getCmp( 'gridList' + _module).store.load();
		
		Ext.getCmp( "saveButton" + _module ).setVisible( false )
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
						xtype: 'container'
						,layout: 'column'
						,items: [							
								{
									xtype: 'fieldset'
									,title:	'Manual Back-up And Restore'
									,style: 'margin-left:5px'
									,autoHeight:true
									,items:[
										{
											xtype: 'container'
											,style:	'margin-top:5px; margin-bottom:5px'
											,layout:'column'
											,items:[
												{
													xtype: 'filefield'
													,id:	'extfilefield' + _module
													,name: 	'extfilefield'
													,vtype: 'file'
													,style: 'margin-right:5px'
													,buttonOnly:true
													,buttonConfig: {
														text: 	 'Restore'
														,iconCls: 'glyphicon glyphicon-import'
													}
													,listeners:{
														change: function(){
															var data =  {filename:Ext.getCmp('extfilefield' + _module).value}
															if(this.isValid()) _restore(data,'');
															else Ext.MessageBox.alert('Error', 'Invalid file format.');
														}
													}
												}
												,{
													xtype: 'button'
													,text:  'Backup'
													,width:	80
													,style: 'margin-right:5px'
													,iconCls:'glyphicon glyphicon-export'
													,handler: function(){
														_backup();
													}
												}
											]
										}
									]
								}
						]
					}
			
			]
			,moduleGrids : [
				_gridList()
			]
			,listeners: {
				afterrender : _init
			}
		} );
	}
	
	function _gridList( ){
		var store =  standards.callFunction(  '_createRemoteStore' ,{
						fields:[
							'ident'
							,'bdate'
							,'btime'
							,'filename'
							,'user'
							,'selected'
						], 
						url: _route + "Retrieve",
				});
		var sm = new Ext.selection.CheckboxModel({
			checkonly: true
			,listeners:{
				select: function(val,record,index){
					record.data.selected = 1;
					Ext.getCmp('gridList'+_module).getView().refresh();
					var cntsel = cntAllSelected();
					if(cntsel > 1) Ext.getCmp('downloadBtn'+_module).setDisabled(false);
					else Ext.getCmp('downloadBtn'+_module).setDisabled(true);
				}
				,deselect: function(val,record,index){
					record.data.selected = 0;
					Ext.getCmp('gridList'+_module).getView().refresh();
					var cntsel = cntAllSelected();
					if(cntsel > 1) Ext.getCmp('downloadBtn'+_module).setDisabled(false);
					else Ext.getCmp('downloadBtn'+_module).setDisabled(true);
				}
			}
		});
		return standards.callFunction( '_gridPanel',{
			id: 'gridList' + _module
			,module: _module
			,noDefaultRow: true
			,store: store
			,selModel: sm
			,mode:	'setting'
			,style: 'margin-top: 10px'
			,tbar:{
				content:[{xtype:'button',text:'Download Selected',id:'downloadBtn'+_module,disabled:true,iconCls:'glyphicon glyphicon-download-alt'
				,handler: function(){
					downloadMulti();
					}
				}]

			}
			,noPage: true
			,columns:[
				{header: 'Date',     width: 100, dataIndex: 'bdate', sortable: false},
				{header: 'Time',     width: 100, dataIndex: 'btime', sortable: false},
				{header: 'Filename', flex:  1  , dataIndex: 'filename', sortable: false},
				{header: 'Username', flex:  1  , width: 100, dataIndex: 'user', sortable: false}
				,standards.callFunction( '_createActionColumn' ,{
					icon:'import'
					,tooltip:'Restore backup'
					,Func: _restore
					,width: 34
					,align: 'center'
				})
				,standards.callFunction( '_createActionColumn' ,{
					icon:'download'
					,tooltip:'Download backup'
					,Func: _download
					,width: 34
					,align: 'center'
				})
				,standards.callFunction( '_createActionColumn' ,{
					canDelete: _canDelete
					,icon:'remove'
					,tooltip:'Remove backup'
					,Func: _delete
					,width: 34
					,align: 'center'
				})				
			]
		} );
	}
	
	function _delete( form ){
		var store = Ext.getCmp( 'gridList' + _module ).store;
		var storeCount = store.getCount();
		
		if( storeCount > 1 ){
			form.confirmDelete({
				url: _route + 'deleteRecord'
				,params:{
					file : form.filename
				}
				,success:function( action, response ){
					standards.callFunction( '_createMessageBox', {
						msg : 'Record has been successfully deleted.'
						,icon : ''
					});
					Ext.getCmp( 'gridList' + _module ).store.load();
				}
			});
		}
		else{
			standards.callFunction( '_createMessageBox', {
				msg : "Can't delete this backup file. At least one backup file should be kept."
				,icon : ''
			});
			Ext.getCmp( 'gridList' + _module ).store.load();
		}
	}
	
	// function _download( form ){
		// window.open( _route + '/backup/' + form.filename);	
		// window.open( './backup/' + form.filename);	
	// }
	
	function _download(data, row){
		var fileName = ''
			,fileExt = ''
			,spFN = data.filename.split('.');
		for( var i = 0; i < spFN.length - 1; i++ ){
			if( i != spFN.length - 2 ){
				fileName += spFN[i] + '.';
			}
			else{
				fileName += spFN[i];
			}
		}
		fileExt = spFN[spFN.length - 1];
		
		Ext.Ajax.request({
			url: _route + "setLog", 
			method:'post',
			params: {
				desc: "Downloaded the backup file, " + fileName + "."
			},
			success: function(res){
				window.open( _route + 'download/' + fileName + '/' + fileExt );
			}
		});

		// window.open( './backup/'+fileName+'.'+fileExt);
	}
	
	
	function _saveForm( form ){
		logoName = Ext.getCmp( 'companyLogo' + _module ).getValue();
		form.submit({
			url: _route + 'saveForm'
			,params:{
				companyLogo: logoName
			}
			,success:function( action, response ){
				var match = parseInt( response.result.match, 10 );
				var isLogin = response.result.view;
				var log = response.result.log;
				
				if( match == 0 ){
					standards.callFunction( '_createMessageBox', {
						msg: 'SAVE_SUCCESS'
					});
					
					if( log ){
						Ext.getCmp( 'imageBox' + _module ).setSrc( Ext.getConstant( 'LOGOPATH' ) + isLogin );
						Ext.get('logo').el.dom.src = Ext.getConstant( 'LOGOPATH' ) + isLogin;
						// Ext.get('affHeaderName').el.dom.textContent = Ext.getCmp( 'affiliateName' + _module ).getValue();
						// Ext.get('affHeaderTagLine').el.dom.textContent = Ext.getCmp( 'tagLine' + _module ).getValue();
					}
					_resetGetForm( form );
				}
			}
		});
	}		
	
	function _backup( ){
		Ext.Ajax.request({
			url: _route + "backupdb", 
			method:'post',
			success: function(res){
				var results = Ext.JSON.decode(res.responseText);
				Ext.getCmp( 'gridList' + _module ).getStore().load();
				// LOG('backup',results.filename);					
			}
		});
	}
	
	function _restore(Data, row){
		Ext.create('Ext.window.Window',{
			title: 'Confirm Password'
			,layout:'fit'
			,id: 'winPass' + _module
			,modal: true
			,items: [
				{
					xtype:'form'
					,bodyPadding:'3px'
					,items:[
						{
							xtype:'textfield'
							,fieldLabel: 'Password'
							,id: 'password' + _module
							,name:'password'
							,inputType: 'password' 
						}
					]
					,buttons:[
						{
							text:'Ok'
							,handler: function(){
								Ext.Ajax.request({
									url: _route + 'checkPassword'
									,params:{ 
										pass: Ext.getCmp('password' + _module).value
									}
									,method:	 'post'
									,success: function(res){
										var results = Ext.JSON.decode(res.responseText);
										var confrm 	= parseInt(results.confrm);
										
										if(confrm == 1){
											var filename;
											if(Data != null) filename = Data.filename;
											
											Ext.getCmp('winPass' + _module ).close();
											
											// var form = Ext.getCmp('mainFormPanel' + _module ).getForm();
											var form = Ext.getCmp('mainForm' + _module ).getForm();
											form.submit({
												waitTitle: "Please wait"
												,waitMsg: "Restoring backup..."
												,url: _route + "restoreFile"
												,params:{
													filenameHIST: filename
													,tag: Data.user != null ? 1 : 0
												}
												,success: function( response,action ){
													var resp =  action.result.trigger;
													
													if(parseInt(resp,10)==1){
														standards.callFunction( '_createMessageBox', {
															msg : 'Invalid Contents of file to restore.'
														});
													}
													else if(parseInt(resp,10)==2){
														standards.callFunction( '_createMessageBox', {
															msg : 'An error has occured while restoring database, please try again later.'
														});
													}
													else{
														standards.callFunction( '_createMessageBox', {
															msg : 'Database backup restoration has been successful.'
															,icon : ''
														});
													}
													
												},
												failure: function(){
													console.log('failed');
												}
											});
										}
										else{
											standards.callFunction( '_createMessageBox', {
												msg : 'Unable to restore database. Incorrect password. Please contact your system administrator to input the password.'
											});
										}
									}
									,failure:function(){
										standards.callFunction( '_createMessageBox', {
											msg : 'Database connectivity error: Failure during restoration of record.'
											,icon : 'Error'
										});
									}
								});
							}
						}
						,{
							text:'Cancel' 
							,handler: function(){
								this.up('window').close();
							}
						}
					 ]
				}
				
			]
		}).show();
	}
	
	/* Process Reset form
	 * clear form values, restoring form component values to its original state
	 * @private
	 * @return void
	*/
	function _resetForm( form ){
		
		form.reset();
		// _init();
		Ext.getCmp( 'gridList' + _module).store.load();
	}

	function downloadMulti(){
		var storegrd = Ext.getCmp('gridList'+_module).store
			,dat = storegrd.getRange()
			,filesDown = new Array();
		for(var i=0;i<storegrd.getTotalCount();i++){
			if(parseInt(dat[i].data.selected,10) == 1) filesDown.push({filename: dat[i].data.filename});
		}		
		var lMask = standards.callFunction('_createMask',{
			params:{
				msg_ :'Downloading backup files, Please wait...'
				,target_:'mainPanel'+_module
			}
		});
		
		lMask.show();
		Ext.Ajax.request({
			url:_route+'downloadMulti'
			,method:'post'
			,params:{ files: Ext.encode(filesDown) }
			,success: function(response, options){
				lMask.destroy(true);
				var resp = Ext.decode(response.responseText);
				var filenameSplit = resp.filename.split( '.' );
				
				Ext.Ajax.request({
					url: _route + "setLog", 
					method:'post',
					params: {
						desc: "Downloaded multiple backup files."
					},
					success: function(res){
						window.open(_route+'download/'+filenameSplit[0]+'/'+filenameSplit[1]);
					}
				});
			}
			,failure: function(){
				lMask.destroy(true);
				Ext.MessageBox.alert('Error', 'Database connectivity error: Failed to download selected files.');
			}
		})
	}
	
	function cntAllSelected(){
		var storegrd = Ext.getCmp('gridList'+_module).store
			,dat = storegrd.getRange()
			,cnt = 0;
		for(var i=0;i<storegrd.getTotalCount();i++){
			if(parseInt(dat[i].data.selected,10) == 1) cnt++;
		}
		return cnt;
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