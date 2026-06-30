var Coopsettings = function(){
	var baseurl, route, module, canDelete;
	
	function _init(){
		
	}
	
	function _mainPanel( config ){
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,moduleType	: 'form'
			,tbar:{
				saveFunc 	 : _saveForm
				,resetFunc	 : _resetForm
				,listLabel	 : 'List'
				,filter:{
					displayField: 'name'
					,table:	'coop'
					,customQuery:true
					,subFilters:[
						'Coop Name'
						,'Acronym'
						,'Street'
						,'Barangay'
						,'City/Municipality'
						,'Province'
						,'Region'
					]
				}
			}
			,formItems:[
				{	xtype:	'container'
					,layout:'column'
					,items:[
						{	xtype:	'container'
							,width:	400
							,style:	'margin-right:15px'
							,items:[
								{
									xtype	: 'hiddenfield'
									,id		: 'coopID' + module
								}
								
								,standards.callFunction(	'_createTextField', {
									id:'coopName'+module
									,fieldLabel:'Coop Name'
									,allowBlank:false
								})
								
								,standards.callFunction( '_createTextField', {
									id:'acronym'+module
									,fieldLabel:'Acronym'
									,allowBlank:false
									,maxLength:20
								})
								
								,standards.callFunction( '_createTextField', {
									id:'tagLine'+module
									,fieldLabel:'Tag Line'
								})
								
								,standards.callFunction( '_createTextField', {
									id:'contactNumber'+module
									,fieldLabel:'Contact Number'
									,maxLength:50
								})
								
								,standards.callFunction( '_createTextField', {
									id:'emailAddress'+module
									,fieldLabel:'Email Address'
									,vtype:'email'
									,maxLength:50
								})
								
								,{
									xtype:'fieldset'
									,title:'Address'+Ext.getConstant( 'REQ' )
									,items:[
										,standards.callFunction( '_createTextField', {
											id:'street'+module
											,fieldLabel:'Street'
										})
										
										,standards.callFunction( '_createCombo', {
											type	: 'city'
											,module	: module
											,allowBlank: false
										})
										
										,standards.callFunction( '_createCombo', {
											type	: 'barangay'
											,module	: module
										})
										
										,standards.callFunction( '_createCombo', {
											type	: 'province'
											,module	: module
											,allowBlank: false
										})
										
										,standards.callFunction( '_createCombo', {
											type	: 'region'
											,module	: module
											,allowBlank: false
										})
									]
								}
								
								
							]
						}
						,{	xtype:	'container'
							,width:	400
							,style:	'margin-left:15px'
							,items:[
								standards.callFunction( '_createTextField', {
									id:'contactPerson'+module
									,fieldLabel:'Contact Person'
									,maxLength:50
									,allowBlank:false
								})
								
								,standards.callFunction( '_createTextArea', {
									id:'remarks'+module
									,fieldLabel:'Remarks'
									,height:95
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
									name	: 'coopID'
									,type	: 'number'
								}
								,'coopName'
								,'acronym'
								,'street'
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
					header		: 'Coop Name'
					,dataIndex	: 'coopName'
					,flex		: 1
					,minWidth	: 150
				}
				,{
					header		: 'Acronym'
					,dataIndex	: 'acronym'
					,minWidth	: 150
					,columnWidth: 10
				}
				,{
					header		: 'Street'
					,dataIndex	: 'street'
					,width		: 150
				}
				,{
					header		: 'Barangay'
					,dataIndex	: 'barangayName'
					,width		: 150
				}
				,{
					header		: 'City/Municipality'
					,dataIndex	: 'cityMunicipalityName'
					,width		: 150
				}
				,{
					header		: 'Province'
					,dataIndex	: 'provinceName'
					,width		: 150
				}
				,{
					header		: 'Region'
					,dataIndex	: 'regionName'
					,width		: 150
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
			,params:{
				coopID : data.coopID
			}
		});
	}
	
	function _deleteRecord( data ){
		data.confirmDelete({
			url: route + 'deleteData'
			,params:{
				coopID   : data.coopID
				,coopName: data.coopName
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
					
					if( Ext.getCmp( 'coopID'+module ).getValue() == data.coopID ){
						_resetForm( module.getForm() );
					}
				}
			}
		});
	}
	
	function _resetForm( form ){
		form.reset();
	}
	
	function _saveForm( form ){
		var name    = Ext.getCmp( 'coopName' + module ).getValue();
		var acronym = Ext.getCmp( 'acronym' + module ).getValue();
	
		form.submit({
			url:	route+'saveForm'
			,success:function( action, response ){
				var match = parseInt( response.result.match, 10 );
				
				if( match == 1 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'Coop Name : ' + name + ' already exists.'
					});
				}
				else if( match == 2 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'Acronym : ' + acronym + ' already exists.'
					});
				}
				else if( match == 3 ){
					standards.callFunction( '_createMessageBox', {
						msg : 'EDIT_UNABLE'
					});	
				}
				else if( match == 4 ){
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