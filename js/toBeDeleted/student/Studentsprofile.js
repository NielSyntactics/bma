var Studentsprofile = function(){
	var baseurl, route, module, canDelete;
	
	function _init(){
		// Ext.getCmp( "gridHistory" + module ).store.load();
		console.log( "ROUTE" + route );
		Ext.Ajax.request({
			url:	route+'retrieveData'
			,success: function( response ){
				var data = Ext.decode( response.responseText );
				var fieldData	=	data.view[0];
					Ext.getCmp( 'studentNumber' + module ).setValue( fieldData.studentNumber );
					Ext.getCmp( 'studentFirstName' + module ).setValue( fieldData.studentFirstName );
					Ext.getCmp( 'studentMiddleName' + module ).setValue( fieldData.studentMiddleName );
					Ext.getCmp( 'studentLastName' + module ).setValue( fieldData.studentLastName );
					Ext.getCmp( 'studentAddress' + module ).setValue( fieldData.studentAddress );
					Ext.getCmp( 'studentBirthdate' + module ).setValue( fieldData.studentBirthdate );
					Ext.getCmp( 'studentMothersName' + module ).setValue( fieldData.studentMothersName );
					Ext.getCmp( 'studentMothersEmail' + module ).setValue( fieldData.studentMothersEmail );
					Ext.getCmp( 'studentFathersName' + module ).setValue( fieldData.studentFathersName );
					Ext.getCmp( 'studentFathersEmail' + module ).setValue( fieldData.studentFathersEmail );
					Ext.getCmp( 'studentGradeLevelHistoryID' + module ).setValue( fieldData.gradeLevelDescription );
					Ext.getCmp( 'schoolYear' + module ).setValue( fieldData.schoolYearDescription );
					Ext.getCmp( 'paymentStatusHistoryID' + module ).setValue( fieldData.paymentStatusHistoryID );
					
					// Age Calculate
				var calcAge = Ext.getCmp( 'studentBirthdate' + module ).getValue().toLocaleDateString().split("/");
				// console.log( calcAge );
					var currentTime = new Date();
					var month = ( currentTime.getMonth() + 1 ) - parseInt( calcAge[0] );
					var day = currentTime.getDate() - parseInt( calcAge[1] );                                    
					var year = currentTime.getFullYear() - parseInt( calcAge[2] );
					var age = 0;
						if( year <= -1 ){
							standards.callFunction( '_createMessageBox', {
								msg : 'Birthdate not allowed.'
							});
						}
						
						if( month <= -1 && year <= 0 ){
							standards.callFunction( '_createMessageBox', {
								msg : 'Birthdate not allowed.'
							});
						}else if( month <= -1 && year >= 1 ){
								year = year - 1;
						}
						
						if( day <= -1 && year <= 0 && month >= 0 ){
							standards.callFunction( '_createMessageBox', {
								msg : 'Birthdate not allowed.'
							});
						}else if( day <= -1 && year >= 1 ){
								year = year - 1;
						}
						Ext.getCmp( 'age' + module ).setValue( year );
						
			}
		});
	}
	
	function _mainPanel( config ){
	
	
	var paymentStatusStore = standards.callFunction( '_createLocalStore' ,{
							data:[
								'Not Paid'
								,'Paid'
							]
							,startAt	:	0
						} );
						
	
	var gradeLevelStore = standards.callFunction( '_createRemoteStore' ,{
							fields:[
								{
									name	: 'gradeLevelID'
									,type	: 'number'
								}
								,'gradeLevelDescription'
							]
							// , url: 	route + 'getYearLevels'
						} );
						
	var schoolYearStore = standards.callFunction( '_createRemoteStore' ,{
							fields:[
								{
									name	: 'schoolYearID'
									,type	: 'number'
								}
								,'schoolYearDescription'
							]
						} );
						
						
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,moduleType	: 'form'
			,isCenter	: false
			,noHeader 	: true
			,formItems:[
				{	xtype:	'fieldset'
					,defaults 	:
					{
						xtype 	: 	'container'
						,style 	: 	'margin-top: 5px'
					}
					,items:[
						
					{
						xtype		: 	'container'
						,items: 	
						[
							
							{
								xtype 		: 	'container'
								,width 		:	450
								,style 		: 	"margin: 35px auto"
								,items:
								[
									,standards.callFunction( '_createTextField' ,{
			 								id 				: 	'studentNumber' + module
					 						,fieldLabel 	: 	'Student Number'
					 						// ,allowBlank		: 	false
					 						,maxLength 		: 	255
											,width			: 	430
											,readOnly		:	true
				 						} 
					 				)
									
									,standards.callFunction( '_createTextField' ,{
			 								id 				: 	'studentFirstName' + module
					 						,fieldLabel 	: 	'First Name'
					 						// ,allowBlank		: 	false
					 						,maxLength 		: 	255
											,width			: 	430
											,readOnly		:	true
				 						} 
					 				)

					 				,standards.callFunction(  '_createTextField' ,{
					 						id 				: 	'studentMiddleName' + module
					 						,fieldLabel 	: 	'Middle Name'
					 						// ,allowBlank 	: 	false
					 						,maxLength 		: 	50
											,width			: 	430
											,readOnly		:	true
					 					}
					 				)

					 				,standards.callFunction( '_createTextField' ,{
					 						id 				: 	'studentLastName' + module
					 						,fieldLabel 	: 	'Last Name'
					 						// ,allowBlank 	: 	false
					 						,maxLength 		: 	50
											,width			: 	430
											,readOnly		:	true
					 					} 
					 				)

					 				,standards.callFunction( '_createTextArea' ,{
					 						id 				: 	'studentAddress' + module
					 						,fieldLabel 	: 	'Address'
					 						// ,allowBlank 	: 	false
											,width			: 	430
											,readOnly		:	true
					 					}
					 				)
									
									
									,{
										xtype : 	'container'
										,layout 	: 	'column'
										,columnWidth	: 	0.50
										,style 		: 	'margin-bottom: 5px'
										,items:[
											,standards.callFunction( '_createDateField' ,{
													id 				: 	'studentBirthdate' + module
													,allowBlank 	: 	false
													,fieldLabel 	: 	'Birthdate'
													,width			: 	275
													,readOnly		:	true
													,listeners:{ select: function() 
														{
															var calcAge = Ext.getCmp( 'studentBirthdate' + module ).getValue().toLocaleDateString().split("/");
															// console.log( calcAge );
															var currentTime = new Date();
															var month = ( currentTime.getMonth() + 1 ) - parseInt( calcAge[0] );
															var day = currentTime.getDate() - parseInt( calcAge[1] );                                    
															var year = currentTime.getFullYear() - parseInt( calcAge[2] );
															var age = 0;
																console.log( day );
																console.log( calcAge[0] );
																if( year <= -1 ){
																	standards.callFunction( '_createMessageBox', {
																		msg : 'Birthdate not allowed.'
																	});
																}
																
																if( month <= -1 && year <= 0 ){
																	standards.callFunction( '_createMessageBox', {
																		msg : 'Birthdate not allowed.'
																	});
																}else if( month <= -1 && year >= 1 ){
																		year = year - 1;
																}
																
																if( day <= -1 && year <= 0 && month >= 0 ){
																	standards.callFunction( '_createMessageBox', {
																		msg : 'Birthdate not allowed.'
																	});
																}else if( day <= -1 && year >= 1 ){
																		year = year - 1;
																}
																Ext.getCmp( 'age' + module ).setValue( year );
														}
													}
												}
											)
											
											,standards.callFunction( '_createTextField' ,{
													id 				: 	'age' + module
													,fieldLabel 	: 	'Age'
													,width 			: 	140
													,labelWidth 	: 	40
													,style 			: 	'margin-left: 15px'
													,readOnly		:	true
												}
											)
										]
									}
									
									,standards.callFunction( '_createTextField' ,{
			 								id 				: 	'studentMothersName' + module
					 						,fieldLabel 	: 	'Mother\'s Name'
					 						// ,allowBlank		: 	false
					 						,maxLength 		: 	100
											,width			: 	430
											,readOnly		:	true
				 						} 
					 				)

					 				,standards.callFunction(  '_createTextField' ,{
					 						id 				: 	'studentMothersEmail' + module
					 						,fieldLabel 	: 	'Mothers\'s Email?'
					 						,maxLength 		: 	100
											,width			: 	430
											,inputType		:	'email'
											,readOnly		:	true
					 					}
					 				)

					 				,standards.callFunction( '_createTextField' ,{
					 						id 				: 	'studentFathersName' + module
					 						,fieldLabel 	: 	'Father\'s Name'
					 						// ,allowBlank 	: 	false
					 						,maxLength 		: 	100
											,width			: 	430
											,readOnly		:	true
					 					} 
					 				)

					 				,standards.callFunction( '_createTextField' ,{
					 						id 				: 	'studentFathersEmail' + module
					 						,fieldLabel 	: 	'Father\'s Email'
					 						,inputType 		: 	'email'
											,width			: 	430
											,readOnly		:	true
					 					}
					 				)
									
									,{
										xtype : 	'container'
										,layout 	: 	'column'
										,columnWidth	: 	0.50
										,style 		: 	'margin-bottom: 5px'
										,items:[
											,standards.callFunction( '_createTextField' ,{
													id 				: 	'studentGradeLevelHistoryID' + module
													// ,allowBlank 	: 	false
													,fieldLabel 	: 	'Grade Level'
													,width			: 	260
													,readOnly		:	true
												}
											)
											,standards.callFunction( '_createTextField' ,{
													id 				: 	'schoolYear' + module
													// ,allowBlank 	: 	false
													,fieldLabel 	: 	'S.Y'
													,width 			: 	155
													,labelWidth 	: 	40
													,style 			: 	'margin-left: 15px'
													,readOnly		:	true
												}
											)
										]
									}


									
					 				,standards.callFunction( '_createTextField' ,{
					 						id 				: 	'paymentStatusHistoryID' + module
					 						,fieldLabel 	: 	'Payment Status'
											,width			: 	430
											,readOnly		:	true
					 					}
					 				)
					 				
								]
							}	
								
						]
					}
								
							]
						}
					]
				,listeners	: 	{
					afterrender 	: 	_init 
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