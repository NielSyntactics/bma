var Companysettings = function(){
	var baseurl, route, module, canDelete;
	var compLogo;
	
	function _init(){
		module.getForm().retrieveData({
			url: route+'getCompanyDetails'
			,onEdit:false
			,goToForm:false
			,success:function( response ){
				compLogo = response.compLogo;
				Ext.getDom( 'boxUpload'+module ).src =   baseurl+ ( compLogo? 'images/'+compLogo : 'images/App Icon.png' );
				
			}
		});
	}
	
	function _mainPanel( config ){
		
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,moduleType	: 'form'
			,tbar:{
				saveFunc 	 : _saveForm
				,resetFunc	 : _init
				,noFormButton: true
				,noListButton: true
			}
			,formItems:[
				{	xtype:	'container'
					,layout:'column'
					,items:[
						{	xtype:	'container'
							,width:	400
							,style:	'margin-right:15px'
							,items:[
								standards.callFunction(	'_createTextField', {
									id:'companyName'+module
									,fieldLabel:'Company Name'
									,allowBlank:false
								})
								
								,standards.callFunction( '_createTextField', {
									id:'acronym'+module
									,fieldLabel:'Acronym'
									,maxLength:20
									,allowBlank:false
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
											,allowBlank: false
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
								standards.callFunction( '_createImageUpload', {
									module		: module
									,defImage	: baseurl + 'images/App Icon.png'
									,customReset: function( cmp ){
										cmp.uploadCmp.reset();
										cmp.boxCmp.src = baseurl+'images/'+compLogo;
									}
								})
								
								,standards.callFunction( '_createTextField', {
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
			,listeners: {
				afterrender : _init
			}
		});
	}
	
	function _saveForm( form ){
		var name = Ext.getCmp( 'companyName' + module ).getValue();
		var line = Ext.getCmp( 'tagLine' + module ).getValue();
	
		form.submit({
			url:	route+'saveForm'
			,params:{
				compLogo : compLogo
			}
			,success:function( action, response ){
				
				var photo = baseurl+response.result.photo;
				Ext.getDom( 'boxUpload'+module ).src = photo+'?_dc='+( new Date() ).getTime();
				Ext.getDom( 'logo' ).src = photo+'?_dc='+( new Date() ).getTime();
				
				document.getElementById( 'headerLabel_companyName' ).innerHTML = name;
				document.getElementById( 'headerLabel_tagLine' ).innerHTML = line;
				
				standards.callFunction( '_createMessageBox', {
					msg : 'SAVE_SUCCESS'
				});
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