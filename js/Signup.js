var Signup = function(){
	var needJS = new Array();
	var baseurl, iduser, username, usertype, usertypeName, route;
	var labelWidth = 170, width = 350;
	
	function createViewport(){
		overrides.applied({
			baseurl:baseurl
		});
		
		try{
			return Ext.create('Ext.container.Viewport',{
				layout:{
					type:'border'
					,padding:5
				}
				,shadow: false
				,items:[
					{	region:'north'
						,height: 105
					}
					,{
						region: 'center'
						,xtype: 'form'
						,id: 'mainPanel'
						,frame: false
						,border: false
						,layout: 'fit'
						,items: [
							{
								xtype:'panel'
								,hidden:true
								,id:'success_msg_container'
								,layout: {
									type: 'vbox'
									,align: 'center'
								}
								,items:[
									{
										xtype:'label'
										,text: 'Thank you for signing up to the Get it Right Human Resource Management System!'
										,style:'margin-top:150px'
									}
									,{
										xtype:'label'
										,text: 'Please give us time to setup your account. You will receive an email within  24 hours.'
										,style:'margin-top:8px'
									}
								]
							}
							,{	xtype: 'panel'
								,border: false
								,frame: false
								,id:'mainForm'
								,layout: {
									type: 'vbox'
									,align: 'center'
								}
								,bodyPadding: 20
								,items:[
									standards.callFunction( '_createTextField', {
										id: 'hrmsufirstName'
										,fieldLabel: 'First Name'
										,allowBlank: false
										,width: width
										,labelWidth: labelWidth
									} )
									,standards.callFunction( '_createTextField', {
										id: 'hrmsulastName'
										,fieldLabel: 'Last Name'
										,allowBlank: false
										,width: width
										,labelWidth: labelWidth
									} )
									,standards.callFunction( '_createTextField', {
										id: 'defaultInformationDescription'
										,fieldLabel: 'Job Title'
										,allowBlank: false
										,width: width
										,labelWidth: labelWidth
									} )
									,standards.callFunction( '_createTextField', {
										id: 'hrmsuun'
										,fieldLabel: 'Email(Username)'
										,allowBlank: false
										,width: width
										,labelWidth: labelWidth
										,vtype: 'email'
									} )
									,standards.callFunction( '_createTextField', {
										id: 'hrmsupw'
										,fieldLabel: 'Password'
										,inputType: 'password'
										,allowBlank: false
										,width: width
										,labelWidth: labelWidth
									} )
									,standards.callFunction( '_createTextField', {
										id: 'rephrmsupw'
										,fieldLabel: 'Confirm Password'
										,inputType: 'password'
										,allowBlank: false
										,width: width
										,labelWidth: labelWidth
										,validator: function( value ){
											return ( value === Ext.getCmp( 'hrmsupw' ).value )? true : 'Passwords do not match.'
										}
									} )
									,standards.callFunction( '_createTextField', {
										id: 'companyName'
										,fieldLabel: 'Company'
										,allowBlank: false
										,width: width
										,labelWidth: labelWidth
									} )
									,standards.callFunction( '_createTextField', {
										id: 'companyDescription'
										,fieldLabel: 'Company Description'
										,allowBlank: false
										,width: width
										,labelWidth: labelWidth
									} )
									,standards.callFunction( '_createTextField', {
										id: 'companyContactNumber'
										,fieldLabel: 'Contact Number'
										,allowBlank: false
										,width: width
										,labelWidth: labelWidth
									} )
									,standards.callFunction( '_createTextField', {
										id: 'companyLocation'
										,fieldLabel: 'Location(City, Country)'
										,allowBlank: false
										,width: width
										,labelWidth: labelWidth
									} )
									,standards.callFunction( '_createTextField', {
										id: 'captcha'
										,fieldLabel: 'Verification'
										,allowBlank: false
										,width: width
										,labelWidth: labelWidth
									} )
									,{	xtype: 'box'
										,html: '<img src = "' + baseurl + 'signup/recaptcha?rand=' + Math.random() + '" id="captchaImg" style="width: 180px; height: 60px; margin-top: -5px; margin-left: 180px;"/><div class="glyphicon glyphicon-refresh" style="cursor:pointer; margin-left: -16px; margin-top:37px; position: absolute;" id="resetCaptcha" title="Reset captcha image"></div>'
										,listeners: {
											afterrender: function(){
												document.getElementById( 'resetCaptcha' ).onclick = function(){
													Ext.getDom( 'captchaImg' ).src = baseurl + 'signup/recaptcha?rand=' + Math.random();
												}
											}
										}
									}
									,{	xtype: 'container'
										,items: [
											{	xtype:'button'
												,text:'Submit'
												,cls:'btn-mainMenu'
												,formBind: true
												,disabled: true
												,height: 30
												,width: 80
												,style: 'margin-left: 40px;'
												,handler:function(){
													var form = Ext.getCmp( 'mainPanel' );
													if( form.isValid() ){
														form.getForm().submit({
															waitTitle: 'Please wait'
															,waitMsg: 'Submitting data...'
															,url: route + 'processSignup'
															,method: 'post'
															,success: function( response, option ){
																var resp = option.result
																	,match = parseInt( resp.match, 10 );
																if( match == 1 ){ /* username/email already exists */
																	standards.callFunction( '_createMessageBox', {
																		msg: 'Username already exists, please input another one.'
																		,icon: 'error'
																		,fn: function(){
																			Ext.getCmp( 'hrmsuun' ).focus();
																		}
																	} );
																}
																else if( match == 2 ){ /* company name already exists */
																	standards.callFunction( '_createMessageBox', {
																		msg: 'Company name already exists, please input another one.'
																		,icon: 'error'
																		,fn: function(){
																			Ext.getCmp( 'companyName' ).focus();
																		}
																	} );
																}
																else if( match == 3 ){ /* Invalid verification code */
																	standards.callFunction( '_createMessageBox', {
																		msg: 'Verification code inputted is invalid.'
																		,icon: 'error'
																		,fn: function(){
																			Ext.getCmp( 'captcha' ).focus();
																		}
																	} );
																}
																else{
																	Ext.getCmp('mainForm').setVisible( false );
																	Ext.getCmp('success_msg_container').setVisible( true );
																}
															}
														})
													}
												}
											}
										]
									}
								]
							}
						]
					}
				]
			});
		}catch( err ){
			console.warn( err );
		}
	}
	
	function headerhtml(){
		
		return '<table width="100%" height="70px" style="min-width: 965px;">' +
					'<tr>'+
						'<td width="47%">'+
							'<table>'+
								'<tr>'+
									'<td><img style="margin-top:0px; height: 70px; width: 250px;" id="logo" class="clearfix" src="'+baseurl+'images/getitrightlogo.jpg" alt="Human Resource Management System" /></td>'+
									'<td><div class="system-name"><p id="titleName"></p></div></td>'+
								'</tr>'+
							'</table>'+
						'</td>'+
						'<td width="53%">'+
							'<div style="text-align:right;margin-right:15px;" id="clock"><p class="user" id="clockdate"><em style="font-size:20px"><b>Welcome, Full Name!</em></b> '+
							'<a id="btnLogoutMainView" style="font-size:20px" href="'+baseurl+'home/logout/1" style="text-decoration:none;">Logout</a></p></div>'+
						'</td>'+
					'</tr>'+
			   '</table>';
		
	}
	
	return{
		initModule: function(parameter){
			baseurl = parameter.baseurl;
			route = baseurl + 'signup/';
			createViewport();
		}
	}
}();