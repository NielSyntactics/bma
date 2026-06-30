var Usersettings = function(){
	var baseurl, route, module, canDelete;
	
	function _init(){
		
	}
	
	function _mainPanel( config ){
		var userStore = standards.callFunction( '_createLocalStore' ,{
							data:[
								'Administrator'
								,'Supervisor'
								,'Staff'
							]
						} );
						
		var statStore = standards.callFunction( '_createLocalStore' ,{
							data:[
								'Active'
								,'Inactive'
							]
						} );
		
		var coopStore = standards.callFunction( '_createRemoteStore' ,{
							fields:[
								{
									name : 'id'
									,type: 'number'
								}
								,'name'
							]
							,url: route+'getCoop'
						} );
		
		
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,moduleType	: 'form'
			,tbar:{
				saveFunc 	 : _saveForm
				,resetFunc	 : _resetForm
				,listLabel	 : 'List'
				,filter:{
					displayField: 'name'
					,table:	'eu'
					,customQuery:true
					,numberFilter:2
					,subFilters:[
						'Name'
						,'Coop Name'
						,'User Name'
						,'User Type'
						,'Email Address'
						,'Status'
					]
				}
			}
			,formItems:[
				{
					xtype	: 'hiddenfield'
					,id		: 'euID' + module
				}
				
				,{
					xtype	: 'container'
					,layout	: 'column'
					,items:[
						standards.callFunction( '_createImageUpload', {
							module		: module
							,boxWidth	: 250
							,boxHeight	: 150
							,uploadX	: 195
							,uploadY    : 117
							,resetX     : 220
							,resetY     : 120
						})
						
						,{	xtype:	'container'
							,width:	400
							,style:	'margin-left:15px'
							,items:[
								standards.callFunction(	'_createTextField', {
									id:'firstName'+module
									,fieldLabel:'First Name'
									,allowBlank:false
									,maxLength:50
								})
								
								,standards.callFunction( '_createTextField', {
									id:'middleName'+module
									,fieldLabel:'Middle Name'
									,maxLength:50
								})
								
								,standards.callFunction( '_createTextField', {
									id:'lastName'+module
									,fieldLabel:'Last Name'
									,allowBlank:false
									,maxLength:50
								})
							]
						}
					]
				}
				
				,{	xtype:	'fieldset'
					,defaults:{
						xtype : 'container'
						,layout:'column'
						,style:	'margin-top:5px'
					}
					,items:[
						{	items:[
								standards.callFunction( '_createTextField', {
									id:'emailAddress'+module
									,fieldLabel:'Email Address'
									,vtype:'email'
									,maxLength:50
								})
								
								,standards.callFunction(	'_createTextField', {
									id:'contactNumber'+module
									,fieldLabel:'Contact No.'
									,maxLength:50
									,style:	'margin-left:10px'
								})
								
								,standards.callFunction( '_createCombo', {
									id : 'coopID'+module
									,fieldLabel: 'Coop Name'
									,module	: module
									,store  : coopStore
									,allowBlank: false
									,style:	'margin-left:10px'
								})
							]
						}
						,{	items:[
								standards.callFunction( '_createTextField', {
									id:'euName'+module
									,fieldLabel:'User Name'
									,allowBlank:false
									,maxLength:50
								})
								
								,standards.callFunction( '_createCombo', {
									id		: 'usertype'+module
									,fieldLabel: 'User Type'
									,module	: module
									,store  : userStore
									,editable:false
									,allowBlank: false
									,style:	'margin-left:10px'
								})
								
								,standards.callFunction( '_createCombo', {
									id		: 'status'+module
									,fieldLabel: 'Status'
									,module	: module
									,store  : statStore
									,editable:false
									,allowBlank: false
									,value:1
									,style:	'margin-left:10px'
								})
							]
						}
						,{	style:	'margin-top:5px; margin-bottom:5px'
							,items:[
								standards.callFunction( '_createTextField', {
									id:'password'+module
									,fieldLabel:'Password'
									,allowBlank:false
									,inputType:'password'
									,maxLength:50
								})
								
								,standards.callFunction( '_createTextField', {
									id:'confirm'+module
									,fieldLabel:'Confirm Password'
									,allowBlank:false
									,inputType:'password'
									,submitValue:false
									,msgTarget:'under'
									,style:	'margin-left:10px'
									,validator: function( value ){
										if( Ext.getCmp( 'password'+module ).isVisible() ){
											return ( value === Ext.getCmp( 'password' + module ).value ) ? true : 'Passwords do not match.';
										}
										else{
											return true;
										}
									}
								})
							]
						}
					]
				}
			]
			,listItems : _getHistory()
			,listeners: {
				afterrender : _init
			}
		});
	}
	
	function _getHistory(){
		var store = standards.callFunction(  '_createRemoteStore' ,{
							fields:[
								{
									name	: 'euID'
									,type	: 'number'
								}
								,'name'
								,'coopName'
								,'euName'
								,'usertype'
								,'emailAddress'
								,'status'
							]
							,url: route + 'getHistory'
					});
		return standards.callFunction( '_gridPanel',{
			id		: 'gridHistory' + module
			,module	: module
			,store	: store
			,columns: [
				{
					header		: 'Name'
					,dataIndex	: 'name'
					,flex		: 1
					,minWidth	: 150
					,columnWidth: 25
				}
				,{
					header		: 'Coop Name'
					,dataIndex	: 'coopName'
					,minWidth	: 150
				}
				,{
					header		: 'Username'
					,dataIndex	: 'euName'
					,width		: 150
				}
				,{
					header		: 'UserType'
					,dataIndex	: 'usertype'
					,width		: 150
				}
				,{
					header		: 'Email Address'
					,dataIndex	: 'emailAddress'
					,width		: 150
				}
				,{
					header		: 'Status'
					,dataIndex	: 'status'
					,width		: 150
				}
				,standards.callFunction( '_createActionColumn', {
					icon		: 'pencil'
					,tooltip	: 'Edit record'
					,Func		: _editRecord
				})
				,standards.callFunction( '_createActionColumn', {
					icon:'lock'
					,tooltip:'Change password'
					,Func:_changePassword
				})
				,standards.callFunction( '_createActionColumn', {
					icon:'th-list'
					,tooltip:'Module access'
					,Func:_moduleAccess
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
				euID : data.euID
			}
			,success:function( response ){
				Ext.getDom( 'boxUpload'+module ).src = baseurl+response.pic+'?_dc='+( new Date() ).getTime();
				_onEditHidePassword( true );
			}
		});
	}
	
	function _changePassword( data ){
		Ext.create( 'Ext.Window', {
			id:'winPass'+module
			,title:'User Modules'
			,width:400
			,modal:true
			,closable:false
			,resizable:false
			,frame : true
			,defaults: {
				anchor: '100%'
			}
			,items: [
				{
					xtype:	'form'
					,id:'formPass'+module
					,module:module
					,border:false
					,buttonAlign:'right'
					,bodyPadding:5
					,items:[
						{
							xtype: 'displayfield'
							,fieldLabel: 'User Name'
							,labelWidth:135
							,value:	data.euName
						}
						,standards.callFunction( '_createTextField', {
							id:'password1'+module
							,fieldLabel:'Password'
							,allowBlank:false
							,inputType:'password'
							,enforceMaxLength:true
						})
						,standards.callFunction( '_createTextField', {
							id:'password2'+module
							,fieldLabel:'Confirm Password'
							,allowBlank:false
							,inputType:'password'
							,submitValue:false
							,msgTarget:'under'
							,validator: function( value ){
								if( Ext.getCmp( 'password1'+module ).isVisible() ){
									return ( value === Ext.getCmp( 'password1' + module ).value ) ? true : 'Passwords do not match.';
								}
								else{
									return true;
								}
							}
						})
					]
					,buttons:[
						{
							text:'Update'
							,formBind:true
							,handler:function(){
								Ext.getCmp( 'formPass'+module ).getForm().submit({
									url: route +'changPassword'
									,params: { 
										euID 	: data.euID
										,module : module
									}											
									,success: function() {
										standards.callFunction( '_createMessageBox', {
											msg : 'Password successfully changed.'
										});
										Ext.getCmp( 'winPass'+module ).close();
									}
								});
								
							}
						}
						,{
							text:'Close',
							handler:function(){ 
								Ext.getCmp( 'winPass'+module ).close(); 
							}
						}
					]
				}
				
			]
		}).show();
	}
	
	function _moduleAccess( data ){
		var userStore = standards.callFunction( '_createRemoteStore',{
								fields:[
									'name'
									,{	name : 'euID'
										,type: 'number'
									}
								]
								,url: route + "getUsers"
							});
		
		var sm = new Ext.selection.CheckboxModel({
			checkOnly:true
			,listeners: {
				select: function( val, rec ){
					var record = rec.data;
					record.chk = 1;
					
					if( !record.save && !record.edit && !record.del  && !record.print ){
						rec.set( 'save', record.cansave );
						rec.set( 'edit', record.canedit );
						rec.set( 'del', record.candel );
						rec.set( 'print', record.canprint );
					}
					
				}
				,deselect: function( val, record ){
					
					record.set( 'chk', 0 );
					record.set( 'save', false );
					record.set( 'edit', false );
					record.set( 'del', false );
					record.set( 'print', false );
				
				}
			}
		});  
	
	
		Ext.create( 'Ext.Window', {
			id:'winMod'+module
			,title:'User Modules'
			,width:515
			,height:450
			,modal:true
			,closable:false
			,resizable:false
			,items: [
				{
					xtype:'form'
					,width: 505
					,height:400
					,border:false
					,items:[
						standards.callFunction( '_createCombo', {
							id:'userName_winMod'+module
							,fieldLabel:'User Name'
							,store:userStore
							,displayField:'name'
							,valueField:'euID'
							,editable:false
							,style:'margin-top:3px; margin-left:10px'
							,listeners:{
								afterrender:function(){
									userStore.load({
										callback:function(){
											Ext.getCmp( 'userName_winMod'+module ).setValue( parseInt( data.euID, 10 ) );
										}
									});
								}
								,select:function(){
									loadGrid({
										mtype : Ext.getCmp( 'menu_winMod'+module ).getValue()
										,euID : this.getValue()
									});
								}
							}
						})
						,grid_winMod()
					]
					,dockedItems: [{
						xtype: 'container'
						,dock: 'bottom'
						,padding: '10 10 5'
						,layout: {
							type: 'hbox'
							,align: 'middle'
						}
						,items: [
							{ 	xtype: 'box'
								,autoEl: { cn: '<div id="errmsg2" style="display:none;margin-top:-5px;"></div>' }
							}
							,{
								xtype: 'component'
								,flex: 1
							}
							,{ 
								xtype: 'button'
								,text: 'Save'
								,id:'savemod'+module
								,width: 100
								,handler: function(){
									saveModules(); 
								}
							}
							,{ 
								xtype: 'button'
								,text: 'Close'
								,width: 100
								,handler: function(){
									Ext.getCmp( 'winMod'+module ).close(); 
								}
							}
						]
					}]
				}
			]		
		}).show();	
		
		function grid_winMod(){
			var moduleStore = standards.callFunction( '_createRemoteStore',{
								fields:[
									'module'
									,'mlink'
									,{	name : 'idmodule'
										,type: 'number'
									}
									,{	name: 'save'
										,type: 'bool'
									}
									,{	name: 'edit'
										,type: 'bool'
									}
									,{	name: 'del'
										,type: 'bool'
									}
									,{	name: 'print'
										,type: 'bool'
									}
									,{	name : 'mtype'
										,type: 'number'
									}
									,{	name: 'chk'
										,type: 'bool'
									}
								]
								,url: route + "getModules"
							});
			
			var menuStore = standards.callFunction( '_createLocalStore',{
								data:[
									'Home'
									,'Reports'
									,'Admin'
								]
							});
			
			var checkListeners = {
				checkchange: function( me, rowIndex, checked ){
					if( checked ){
						sm.select( rowIndex, true ); 
						Ext.getCmp( 'gridModules'+module ).getView().refresh();
					}
					else{
						var grd = moduleStore.getAt( rowIndex );
						if( !grd.data.save && !grd.data.edit && !grd.data.del && !grd.data.print ){
							sm.deselect( rowIndex );
						}
					}
				}
			};
			
			var columnRenderer = function( value, metaData, record, rowIndex, columnIndex ){
				return ( new Ext.ux.CheckColumn() ).renderer( value, metaData );
			};
			
			return Ext.create('Ext.grid.Panel', {
				store: moduleStore
				,id:'gridModules'+module
				,border:false
				,readOnly:true
				,height : 330
				,selModel: sm
				,plugins: standards.callFunction( '_cellEdit', {} )
				,tbar:[{xtype:'box',html:'&nbsp;'}]
				,viewConfig:{
					markDirty:false
				}
				,tbar:[
					standards.callFunction( '_createCombo', {
						id:'menu_winMod'+module
						,fieldLabel:'Menu Type'
						,store:menuStore
						,editable:false
						,value:1
						,style:'margin-left:3px'
						,listeners:{
							select:function(){
								loadGrid({
									mtype    : this.getValue()
									,euID : Ext.getCmp( 'userName_winMod'+module ).getValue()
								});
							}
						}
					})
				]
				,columns:[
					{	xtype: 'gridcolumn'
						,header: 'Modules'
						,dataIndex: 'module'
						,flex:1
						,renderer: function( val, params, record, row_index ){
							if( record.data.chk ){
								sm.select( row_index, true );
							}
							return val;
						}				
					}
					,{
						header: 'Save'
						,dataIndex: 'save'
						,xtype: 'checkcolumn'
						,width: 55
						,listeners:checkListeners
						,renderer: columnRenderer
					}
					,{
						header: 'Edit'
						,dataIndex: 'edit'
						,xtype: 'checkcolumn'
						,width: 55
						,listeners:checkListeners
						,renderer: columnRenderer
					}
					,{
						header: 'Delete'
						,dataIndex: 'del'
						,xtype: 'checkcolumn'
						,width: 55
						,listeners:checkListeners
						,renderer: columnRenderer
					}
					,{
						header: 'Print'
						,dataIndex: 'print'
						,xtype: 'checkcolumn'
						,width: 55
						,listeners:checkListeners
						,renderer: columnRenderer
					}
				]
				,listeners:{
					afterrender:function(){
						loadGrid({
							mtype : 1
							,euID : data.euID
						});
					}
				}
			});
		}
		
		function loadGrid( params){
			var grid = Ext.getCmp( 'gridModules'+module );
			
			grid.store.load({
				params:{
					mtype : params.mtype
					,euID : params.euID
				}
				,callback:function(){
					grid.getView().refresh();
				}
			});
		}
		
		function saveModules(){
			var dataInArray = new Array();	
			var selections = Ext.getCmp( 'gridModules'+module ).selModel.getSelection();
			for( i = 0; i< Ext.getCmp( 'gridModules'+module ).selModel.getCount(); i++ ){
				var dataNew = selections[i].data;
				dataInArray.push({
					idmodule 	: dataNew.idmodule
					,save 		: dataNew.save
					,edit 		: dataNew.edit
					,del 		: dataNew.del
					,print 		: dataNew.print
				});					
			}
			
			Ext.Ajax.request({  
				url: route+'savedModules'
				,params: { 
					items   : Ext.encode( dataInArray )
					,userid : Ext.getCmp( 'userName_winMod'+module ).getValue()
					,mtype 	: Ext.getCmp( 'menu_winMod'+module ).getValue()
				}
				,success: function(){
					var msg ='Record has been successfully saved.';
					standards.callFunction( '_promptMsg',{
						msg	   : msg
						,varId : 'errmsg2'
					});
				}
			});	
		}
	}
	
	function _deleteRecord( data ){
		data.confirmDelete({
			url: route + 'deleteData'
			,params:{
				euID   : data.euID
				,euName: data.euName
			}
			,success:function( response ){
				var ret = Ext.decode( response.responseText );
				if( ret.match == 1 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'EDIT_UNABLE'
					});
				}else if( ret.match == 2 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'DELETE_USED'
					});
				}else{
					standards.callFunction( '_createMessageBox', {
						msg : 'DELETE_SUCCESS'
					});
					
					var store = Ext.getCmp( 'gridHistory'+module ).getStore();
					if( store.getCount() == 1 && store.currentPage != 1 ){
						store.currentPage--;
					}
					
					store.load();
					
					if( Ext.getCmp( 'euID'+module ).getValue() == data.euID ){
						_resetForm( module.getForm() );
					}
				}
			}
		});
	}
	
	function _onEditHidePassword( allowBlank ){
		var password1 = Ext.getCmp( 'password'+module );
		var password2 = Ext.getCmp( 'confirm'+module );
		
		password1.allowBlank = allowBlank;
		password2.allowBlank = allowBlank;
		
		password1.setVisible( !allowBlank );
		password2.setVisible( !allowBlank );
		
		if( allowBlank ){
			password1.validate();
			password2.validate();
		}
	}
	
	function _resetForm( form ){
		form.reset();
		Ext.getDom( 'boxUpload' + module ).src = baseurl+'images/empty.jpg?_dc='+( new Date() ).getTime();
		_onEditHidePassword( false );
	}
	
	function _saveForm( form ){
		var username = Ext.getCmp( 'euName' + module ).getValue();
		var username = Ext.getCmp( 'usertype' + module ).getValue();
	
		form.submit({
			url:	route+'saveForm'
			,success:function( action, response ){
				var match = parseInt( response.result.match, 10 );
				
				if( match == 1 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'User Name : ' + username + ' already exists.'
					});
				}
				else if( match == 2 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'EDIT_UNABLE'
					});	
				}
				else if( match == 3 ){
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
			
			return _mainPanel( config );
		}
	}
}();