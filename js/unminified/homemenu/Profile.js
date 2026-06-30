var Profile = function(){
	var baseurl, route, module, canDelete, pageTitle;
	
	function _init(){
		
	}
	
	function _mainPanel( config ){
		var genderStore = standards.callFunction( '_createLocalStore' ,{
							data:[
								'Male'
								,'Female'
							]
						} );
						
		var maritalStore = standards.callFunction( '_createLocalStore' ,{
							data:[
								'Single'
								,'Married'
								,'Separated'
								,'Divorced'
							]
						} );
		
		var voteStore = standards.callFunction( '_createLocalStore' ,{
							data:[
								'Vote and Campaign'
								,'Vote Only'
								,'Undecided'
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
				,hasFormPDF	 : true
				,hasFormExcel: true
				,formPDFHandler: _printFormPDF
				,formExcelHandler: _printFormExcel
				,filter:{
					displayField: 'name'
					,table:	'eu'
					,customQuery:true
					,numberFilter:2
					,subFilters:[
						'Name'
						,'Coop Name'
						,'Vote Classification'
						,'Precinct Number'
						,'Barangay'
						,'City/Municipality'
						,'Province'
						,'Region'
					]
				}
			}
			,formItems:[
				{
					xtype	: 'hiddenfield'
					,id		: 'profileID' + module
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
								standards.callFunction( '_createDateField', {
									id:'tdate'+module
									,fieldLabel:'Date'
								})
								
								,standards.callFunction( '_createTextField', {
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
								
								,standards.callFunction( '_createCheckField', {
									id:'member'+module
									,fieldLabel:'Not a member'
								})
							]
						}
					]
				}
				
				,{	xtype:	'fieldset'
					,defaults:{
						xtype : 'container'
						,style:	'margin-top:5px'
						,layout:'column'
					}
					,items:[
						{	items:[
								standards.callFunction( '_createCombo', {
									id		: 'gender'+module
									,fieldLabel: 'Gender'
									,module	: module
									,store  : genderStore
									,editable:false
									,allowBlank: false
								})
								
								,standards.callFunction( '_createDateField', {
									id:'birthdate'+module
									,fieldLabel:'Date of Birth'
									,allowBlank: false
									,style:	'margin-left:10px'
								})
								
								,standards.callFunction( '_createCombo', {
									id		: 'maritalStatus'+module
									,fieldLabel: 'Marital Status'
									,module	: module
									,store  : maritalStore
									,editable:false
									,style:	'margin-left:10px'
								})
							]
						}
						,{	items:[
								standards.callFunction(	'_createTextField', {
									id:'mobileNum'+module
									,fieldLabel:'Mobile #'
									,maxLength:50
									,allowBlank: false
								})
								
								,standards.callFunction( '_createTextField', {
									id:'emailAddress'+module
									,fieldLabel:'Email Address'
									,vtype:'email'
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
						,{	style:	'margin-top:5px; margin-bottom:5px'
							,items:[
								standards.callFunction( '_createCombo', {
									type:'precinct'
									,module	: module
								})
								
								,standards.callFunction( '_createCombo', {
									id : 'voteclassification'+module
									,fieldLabel: 'Vote Classification'
									,module	: module
									,store  : voteStore
									,allowBlank: false
									,editable:false
									,style:	'margin-left:10px'
								})
								
							]
						}
					]
				}
				
				,{	xtype:	'fieldset'
					,style:	'margin-top:10px'
					,title: 'Address'+Ext.getConstant( 'REQ' )
					,defaults:{
						xtype : 'container'
						,style:	'margin-top:5px'
						,layout:'column'
					}
					,items:[
						{	items:[
								standards.callFunction( '_createCombo', {
									type	: 'city'
									,module	: module
									,allowBlank: false
								})
								
								,standards.callFunction(	'_createTextField', {
									id:'houseNumber'+module
									,fieldLabel:'House #'
									,maxLength:50
									,style:	'margin-left:10px'
								})
								
								,standards.callFunction( '_createCombo', {
									type	: 'barangay'
									,module	: module
									,allowBlank: false
									,style:	'margin-left:10px'
								})
								
								
							]
						}
						,{	style:	'margin-top:5px; margin-bottom:5px'
							,items:[
								,standards.callFunction( '_createCombo', {
									type	: 'province'
									,module	: module
									,allowBlank: false
								})
								
								,standards.callFunction( '_createCombo', {
									type	: 'region'
									,module	: module
									,allowBlank: false
									,style:	'margin-left:10px'
								})
							]
						}
					]
				}
				
				,standards.callFunction(	'_createTextField', {
					id:'remarks'+module
					,fieldLabel:'Remarks'
					,style:	'margin-top:5px'
					,width:1100
				})
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
									name	: 'profileID'
									,type	: 'number'
								}
								,'name'
								,'coopName'
								,'vote'
								,'precinctName'
								,'barangayName'
								,'cityMunicipalityName'
								,'provinceName'
								,'regionName'
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
					,columnWidth: 14
				}
				,{
					header		: 'Coop Name'
					,dataIndex	: 'coopName'
					,minWidth	: 150
					,columnWidth: 10
				}
				,{
					header		: 'Vote Classification'
					,dataIndex	: 'vote'
					,width		: 150
					,columnWidth: 10
				}
				,{
					header		: 'Precinct Number'
					,dataIndex	: 'precinctName'
					,width		: 150
					,columnWidth: 10
				}
				,{
					header		: 'Barangay'
					,dataIndex	: 'barangayName'
					,width		: 150
					,columnWidth: 14
				}
				,{
					header		: 'City/Municipality'
					,dataIndex	: 'cityMunicipalityName'
					,width		: 150
					,columnWidth: 14
				}
				,{
					header		: 'Province'
					,dataIndex	: 'provinceName'
					,width		: 150
					,columnWidth: 14
				}
				,{
					header		: 'Region'
					,dataIndex	: 'regionName'
					,width		: 150
					,columnWidth: 14
				}
				,standards.callFunction( '_createActionColumn', {
					icon		: 'pencil'
					,tooltip	: 'Edit record'
					,Func		: _editRecord
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
			,hasFormPDF:true
			,hasFormExcel:true
			,params:{
				profileID : data.profileID
			}
			,success:function( response ){
				Ext.getDom( 'boxUpload'+module ).src = baseurl+response.pic+'?_dc='+( new Date() ).getTime();
				module.get
			}
		});
	}
	
	function _deleteRecord( data ){
		data.confirmDelete({
			url: route + 'deleteData'
			,params:{
				profileID   : data.profileID
				,name		: data.name
			}
			,success:function( response ){
				var ret = Ext.decode( response.responseText );
				if( ret.match == 1 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'EDIT_UNABLE'
					});
				}
				else{
					standards.callFunction( '_createMessageBox', {
						msg : 'DELETE_SUCCESS'
					});
					
					var store = Ext.getCmp( 'gridHistory'+module ).getStore();
					if( store.getCount() == 1 && store.currentPage != 1 ){
						store.currentPage--;
					}
					
					store.load();
					
					if( Ext.getCmp( 'profileID'+module ).getValue() == data.profileID ){
						_resetForm( module.getForm() );
					}
				}
			}
		});
	}
	
	function _printFormPDF(){
		Ext.Ajax.request({
			url:	 route+'printFormPDF'
			,params:{
				profileID : Ext.getCmp( 'profileID' + module ).getValue()
				,title    : pageTitle
			}
			,success: function(){
				window.open( baseurl+'pdf/homemenu/'+pageTitle+'.pdf?_dc'+( new Date() ).getTime() );
			}
		});
	}
	
	function _printFormExcel(){
		Ext.Ajax.request({
			url:	 route+'printFormExcel'
			,params:{
				profileID : Ext.getCmp( 'profileID' + module ).getValue()
				,title    : pageTitle
			}
			,success: function(){
				window.open( route + "download/" + pageTitle );
			}
		});
	}
	
	function _resetForm( form ){
		form.reset();
		Ext.getDom( 'boxUpload' + module ).src = baseurl+'images/empty.jpg?_dc='+( new Date() ).getTime();
	}
	
	function _saveForm( form ){
		var mobileNum = Ext.getCmp( 'mobileNum' +module ).getValue();
		
		if( mobileNum == '0' ){
			standards.callFunction( '_createMessageBox', {
				msg : 'Mobile number must not be equal to 0.'
			});
			return;
		}
		
		form.submit({
			url:	route+'saveForm'
			,success:function( action, response ){
				var match = parseInt( response.result.match, 10 );
				
				if( match == 1 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'EDIT_UNABLE'
					});	
				}
				else if( match == 2 ){
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
			pageTitle   = config.pageTitle;
			
			return _mainPanel( config );
		}
	}
}();