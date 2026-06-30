var bandr = function(){
	var SELECTED;
	var baseurl, route, module, canDelete;
	
	
	function INIT(){
		Ext.apply(Ext.form.field.VTypes, {

			file : function(val, field) {
				var fileName = /^.*\.(sql)$/i;
				return fileName.test(val);
			},
			fileMask : /[a-z_\.]/i 
		 
		});
		
		Ext.Ajax.request({
			url:	 route+'GetSetting',
			method:	 'post',
			success: function(res){
				var results = Ext.JSON.decode(res.responseText);
				var view    = results.view;

				if(view.length > 0){
					var time = new Date (new Date().toDateString() + ' ' + view[0].abTime);
					var day  = view[0].abDay;
					
					// console.log( time )
					
					Ext.getCmp('abDay'+module).store.load({
						callback: function(){
							Ext.getCmp('abTime'+module).setValue(time);
							Ext.getCmp('abDay'+module).setValue(parseInt(day)+1);
						}
					});
				}
				// else resetForm();
				
				Ext.getCmp('grid'+module).store.load();
			}
		});
	}
	
	function mainPanel( config ){
		
		var dayStore = standards.callFunction( '_createLocalStore',{
									data:[
										'Sunday'
										,'Monday'
										,'Tuesday'
										,'Wednesday'
										,'Thursday'
										,'Friday'
										,'Saturday'
									]
								});
		
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,moduleType	: 'form'
			,border		: false
			,isCenter	: false
			,noHeader	: true
			,afterResetHandler : INIT
			,formItems:[
				{
					xtype: 'container',
					layout:'column',
					items:[				//********************* FORM *********************
						{
							xtype: 'fieldset',
							title:	'Weekly Auto-Back Up Schedule',
							// columnWidth: 0.7,
							autoHeight:true,
							items:[
								{
									xtype: 'container',
									baseCls:'xtype',
									layout: 'column',
									style:	  'margin-top:5px; margin-bottom:5px',
									items:[
										standards.callFunction( '_createCombo', {
											id:'abDay'+module
											,width: 150
											,store: dayStore
											,fieldLabel:''
											,style	: 'margin-right:5px'
											,editable	: false
										})
										,standards.callFunction( '_createTimeField', {
											id: 'abTime' + module
											,fieldLabel:''
											,width: 100
											,increment:60
											,editable	: false
										})
									]
								}
							]
						}
						,{
							xtype: 'fieldset',
							title:	'Manual Back-up And Restore',
							style: 'margin-left:5px',
							// columnWidth: 0.3,
							autoHeight:true,
							items:[
								{
									xtype: 'container',
									style:	'margin-top:5px; margin-bottom:5px',
									layout:'column',
									items:[
										{
											xtype: 'filefield',
											id:	'extfilefield'+module,
											name: 	'extfilefield',
											vtype: 'file',
											style: 'margin-right:5px',
											buttonOnly:true,
											buttonConfig: {
												text: 	 'Restore',
												iconCls: 'glyphicon glyphicon-import'
											},
											listeners:{
												change: function(){
													var data =  {filename:Ext.getCmp('extfilefield'+module).value}
													if(this.isValid()) RESTORE(data,'');
													else Ext.MessageBox.alert('Error', 'Invalid file format.');
												}
											}
										}
										,{
											xtype: 'button',
											text:  'Backup',
											width:	72,
											style: 'margin-right:5px',
											iconCls:'glyphicon glyphicon-export',
											handler: function(){fncBackup();}
										}
									]
								}
							]
						}
					]
				}
			]
			,moduleGrids : mainGrid()
			,listeners: {
				afterrender : INIT
			}
		});
	}
			
	function mainGrid(){
		var store =  standards.callFunction(  '_createRemoteStore' ,{
							fields:[
								'ident'
								,'bdate'
								,'btime'
								,'filename'
								,'user'
								,'selected'
							], 
							url: route + "Retrieve",
					});		
		
		
		// standards.IN({func:'_createRemoteStore', 
							// params:{fieldArray: new Array('ident','bdate','btime', 'filename', 'user','selected'),
									// url: route+'Retrieve',
									// pageSize:history_pageSize}});
									
		var sm = new Ext.selection.CheckboxModel({
			checkonly: true
			,listeners:{
				select: function(val,record,index){
					record.data.selected = 1;
					Ext.getCmp('grid'+module).getView().refresh();
					var cntsel = cntAllSelected();
					// if(cntsel > 1) Ext.getCmp('downloadBtn'+module).setDisabled(false);
					// else Ext.getCmp('downloadBtn'+module).setDisabled(true);
				}
				,deselect: function(val,record,index){
					record.data.selected = 0;
					Ext.getCmp('grid'+module).getView().refresh();
					var cntsel = cntAllSelected();
					// if(cntsel > 1) Ext.getCmp('downloadBtn'+module).setDisabled(false);
					// else Ext.getCmp('downloadBtn'+module).setDisabled(true);
				}
			}
		});
		
		return standards.callFunction( '_gridPanel',{
			module: module
			,store: store
			// dtrigLis: true,
			// mode:	'setting',
			,style:	'margin-top:5px',
			id:		'grid'+module,
			tbar:	new Array({xtype:'label', height: 20}),
			selModel: sm,
			tbar:[
				{
					xtype:'button',text:'Download Selected',id:'downloadBtn'+module,disabled:true,iconCls:'glyphicon glyphicon-download-alt'
					,handler: function(){
						downloadMulti();
					}
				}
			],
			columns:[
				{header: 'Date',     width: 100, dataIndex: 'bdate'},
				{header: 'Time',     width: 100, dataIndex: 'btime'},
				{header: 'Filename', flex:  1  , dataIndex: 'filename'},
				{header: 'Username', width: 100, dataIndex: 'user'},
				standards.callFunction( '_createActionColumn' ,{
					icon:'import'
					,tooltip:'Restore backup'
					,Func: RESTORE
				}),
				standards.callFunction( '_createActionColumn' ,{
					icon:'download'
					,tooltip:'Download backup'
					,Func: DOWNLOAD
				}),
				standards.callFunction( '_createActionColumn' ,{
					canDelete:canDelete
					,icon:'remove'
					,tooltip:'Remove backup'
					,Func: DELETE
				})
				
				
				// standards.IN({	func:'ActionColumn',params:{icon:'import',		tooltip:'Restore backup', 	Func: RESTORE}}),
				// standards.IN({	func:'ActionColumn',params:{icon:'download',	tooltip:'Download file', 	Func: DOWNLOAD}}),
				// standards.IN({	func:'ActionColumn',params:{icon:'remove-sign',	tooltip:'Delete file', 	 	Func: DELETE, del: true, canDelete: canDelete}})
			]
		});
	}
	
	function cntAllSelected(){
		var storegrd = Ext.getCmp('grid'+module).store
			,dat = storegrd.getRange()
			,cnt = 0;
		for(var i=0;i<storegrd.getTotalCount();i++){
			if(parseInt(dat[i].data.selected,10) == 1) cnt++;
		}
		return cnt;
	}
	
	function saveForm(){
		var form  = Ext.getCmp('mainForm'+module).getForm();
		form.submit({
			waitTitle: "Please wait",
			waitMsg:   "Saving data...",
			url:	route+'Save',
			params:{module:module},
			success:function(){LOG('edit');},
			failure:function(){Ext.MessageBox.alert('Error', 'Database connectivity error: Failure during submission of record.');}
		});
	}
	
	function fncBackup(){
		Ext.Ajax.request({
			url: route+"backup", 
			method:'post',
			success: function(res){
				var results = Ext.JSON.decode(res.responseText);
				Ext.getCmp('grid'+module).getStore().load();
				LOG('backup',results.filename);					
			}
		});
	}
	
	function RESTORE(Data, row){
		Ext.create('Ext.window.Window',{
			title: 'Confirm Password',
			layout:'fit',
			id:'winPass'+module,
			modal: true,
			items: [
				{xtype:'form',
				 bodyPadding:'3px',
				 items:[
					{xtype:'textfield', fieldLabel: 'Password', id:'password'+module, name:'password', inputType: 'password' }
				 ],
				 buttons:[
					{text:'Ok',
					 handler: function(){
						Ext.Ajax.request({
							url:	 route+'checkPassword',
							params:{ pass: Ext.getCmp('password'+module).value},
							method:	 'post',
							success: function(res){
								var results = Ext.JSON.decode(res.responseText);
								var confrm 	= parseInt(results.confrm);
								// confrm = 1;
								if(confrm == 1){
									var filename;
									if(Data != null) filename = Data.filename;
									// if(Data != null) filename = "E:\\xampp\\htdocs\\coop_natcco\\backup\\"+Data.filename;
									
									Ext.getCmp('winPass'+module).close();
									
									var form = Ext.getCmp('mainFormPanel'+module).getForm();
									form.submit({
										waitTitle: "Please wait",
										waitMsg: "Restoring backup...",  
										url: route + "restoreFile",
										params:{filenameHIST: filename},
										success: function( response,action ){
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
								else console.log(4);
							},
							failure:function(){
								Ext.MessageBox.alert('Error', 'Database connectivity error: Failure during submission of record.');
							}
						});
					 }},
					{text:'Cancel', 
					 handler: function(){this.up('window').close();}}
				 ]
				}
				
			]
		}).show();
	}
	
	function DOWNLOAD(data, row){
		Ext.Ajax.request({
			url:	 route+'test',
			method:	 'post',
			success: function(res){
			}
		});
		console.log(route+'download/'+data.filename);
		window.open(route+'download/'+data.filename);	
	}
	
	function downloadMulti(){
		var storegrd = Ext.getCmp('grid'+module).store
			,dat = storegrd.getRange()
			,filesDown = new Array();
		for(var i=0;i<storegrd.getTotalCount();i++){
			if(parseInt(dat[i].data.selected,10) == 1) filesDown.push({filename: dat[i].data.filename});
		}		
		var lMask = standards.IN({
			func:'strdLoadMask'
			,params:{
				msg_ :'Downloading backup files, Please wait...'
				,target_:'mainPanel'+module
			}
		});
		lMask.show();
		Ext.Ajax.request({
			url:route+'downloadMulti'
			,method:'post'
			,params:{ files: Ext.encode(filesDown) }
			,success: function(response, options){
				lMask.destroy(true);
				var resp = Ext.decode(response.responseText);
				window.open(route+'download/'+resp.filename);
			}
			,failure: function(){
				lMask.destroy(true);
				Ext.MessageBox.alert('Error', 'Database connectivity error: Failed to download selected files.');
			}
		})
	}
	
	function DELETE(data, row){
		var ident = parseInt(data.ident);
		
		var store = Ext.getCmp('grid'+module).store;
			
		if(store.getCount() > 5){

			standards.callFunction( '_createMessageBox', {
				action:'confirm'
				,msg:'DELETE_CONFIRM'
				,fn:function(btn){
					if(btn == 'yes'){
						var file  = data.filename;
						Ext.Ajax.request({
							url: route+"Delete",
							params:{file:file,
									id: ident},
							method:'post',
							success: function(res){
								standards.callFunction( '_createMessageBox', {
									msg : 'Record has been successfully deleted.'
									,icon : ''
								});
								Ext.getCmp('grid'+module).store.load();
								// LOG('delete',file);
							}
						});
					}
				}
			});
		}
		else{
			standards.callFunction( '_createMessageBox', {
				msg : 'Cannot delete this record.'
				,icon : ''
			});
			Ext.getCmp('grid'+module).store.load();
		}
	}
	
	function LOG(action, Data){
		var message='';
		if(action == 'edit'){
			message='edited backup setting: every' + Ext.getCmp('abDay'+module).getRawValue() + ' ' + Ext.getCmp('abTime'+module).getRawValue();
			Ext.MessageBox.alert('Success', 'Settings successfully saved.');
		}
		else if(action == 'delete'){ //on Delete
			message ='deleted file: '+Data.filename;
			Ext.getCmp('grid'+module).store.load();
		}
		else if(action == 'download'){
			message='downloaded: ' + Data.filename;
		}
		else if(action == 'restore'){
			message='restore file: ' + Data.filename;
		}
		else if(action == 'backup'){
			message='backup: ' + Data;
		}
		// var description ='Backup And Restore : ' + username + ' with ' +  usertype + ' rights ' + message;
		// savedLogs(description,null,null,33);
		
		// standards.IN({
			// func: 'setLogs',
			// params:{
				// logDescription : description,
				// idmodule: idmodule
			// }
		// });
	}
	
	return {
		initMethod:function( config ){
			route		= config.route;
			baseurl		= config.baseurl;
			module		= config.module;
			canDelete	= config.canDelete;
			
			return mainPanel( config );
		}
	}
}();