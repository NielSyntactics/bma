var standards = function(){
	var baseurl;
	var standardRoute;
	
	/* Create text field component
		return : Component
		parameters[
			
			PROPERTIES __________________
			isNumber		: [bool] 
								IF TRUE 
									field behaves as numberfield.
									sets initial value either '0'(if isDecimal = true) or '0.00' (if isDecimal = false; default).
									sets text alignment to right.
									mask inputs for non-numeric characters.
								IF FALSE( default )
									the opposite on whats stated above :D
			isDecimal		: [bool] assigns value/input as either float or integer. applicable only if isNumber = true. Default = false
			withREQ			: [bool] concatenates required field's label with * if true. Default = true.
			noEnterListeners: [bool] enables custom keypress when hitting enter key (behaves like tab). Default = false
			
			see property details for other parameters @ ExtDocs
		]
	*/
	
	/**
	 * Developer: Roj Janubas
	 * Date: 05/16/2018
	 * Description: 
	 * 	Set Form Active through other button
	 */
	function gotoFormHidden( params ){

		_goToForm({
			scope			: params.scope
			,module			: params.module
			,otherFormID 	: params.otherFormID
			,hasFormPDF		: ( typeof params.hasFormPDF != 'undefined' )? params.hasFormPDF : false
			,hasFormExcel 	: ( typeof params.hasFormExcel != 'undefined' )? params.hasFormExcel : false
		})
	
	}
	
	function _createTextField( params ){
		var isNumber  		= ( typeof params.isNumber != 'undefined' )? params.isNumber : false;
		var isDecimal 		= ( typeof params.isDecimal != 'undefined' )? params.isDecimal : true;
		var allowBlank		= ( typeof params.allowBlank != 'undefined' )? params.allowBlank : true
		var withREQ    		= ( typeof params.withREQ != 'undefined' )? params.withREQ : true;
		var fieldLabel		= ( typeof params.fieldLabel != 'undefined' )? params.fieldLabel + ( !allowBlank? ( withREQ? Ext.getConstant( 'REQ' ) : '' ) : '' ) : '';
		return Ext.create( 'Ext.form.field.Text', {
			id					: params.id
			,name				: params.id
			,fieldLabel			: fieldLabel
			,width				: ( typeof params.width != 'undefined' )? params.width : Ext.getConstant( 'DEF_WIDTH' )
			,labelWidth			: ( typeof params.labelWidth != 'undefined' )? params.labelWidth : Ext.getConstant( 'DEF_LABEL_WIDTH' )
			,maxLength			: ( typeof params.maxLength != 'undefined' )? params.maxLength : ( isNumber? 15 : 'undefined' )
			,enforceMaxLength	: true
			,value				: ( isNumber ? ( ( typeof params.value != 'undefined' )? params.value : ( !isDecimal ? '0':'0.00' ) ) : params.value )
			,hidden				: params.hidden
			,style				: params.style
			,labelSeparator 	: ( typeof params.labelSeparator != 'undefined' )? params.labelSeparator : ':'
			,vtype				: params.vtype
			,fieldStyle			: ( typeof params.fieldStyle != 'undefined' )? params.fieldStyle : ( isNumber ? "text-align:right;":"text-align:left;" )
			,maskRe				: ( isNumber ?	/[0-9.]/ : /[^^]/ )
			,regex				: ( typeof params.regex != 'undefined'? params.regex :/\S/)
			,emptyText			: params.emptyText
			,beforeSubTpl		: params.beforeSubTpl
			,afterSubTpl		: params.afterSubTpl
			,hasfocus			: params.hasfocus
			,enforceMinLength	: params.enforceMinLength
			,minLength			: params.minLength
			,minLengthText		: params.minLengthText
			,msgTarget			: params.msgTarget
			,allowBlank			: ( typeof params.allowBlank != 'undefined' )? params.allowBlank : true
			,readOnly			: ( typeof params.readOnly != 'undefined' )? params.readOnly : false
			,submitValue		: ( typeof params.submitValue != 'undefined' )? params.submitValue : true
			,disabled			: ( typeof params.disabled != 'undefined' )? params.disabled : false
			,inputType			: ( typeof params.inputType != 'undefined' )? params.inputType : 'text'
			,validator			: ( typeof params.validator != 'undefined' )? params.validator : null
			,labelAlign			: ( typeof params.labelAlign != 'undefined' )? params.labelAlign : 'left'
			,enableKeyEvents	: ( typeof params.enableKeyEvents != 'undefined' )? params.enableKeyEvents : false
			,listeners			: ( typeof params.listeners != 'undefined' )? params.listeners : null
			,noEnterListeners 	: ( typeof params.noEnterListeners != 'undefined' )? params.noEnterListeners : false
			,hasCurrency		: ( typeof params.hasCurrency != 'undefined' )? params.hasCurrency : false
			,isNumber			: isNumber
			,isDecimal			: isDecimal
			,allowNegative		: ( typeof params.allowNegative != 'undefined' )? params.allowNegative : false
			,allowNull			: ( typeof params.allowNull != 'undefined' )? params.allowNull : false
			,regexText			: params.regexText
		});
	}
	
	// create NumbFields
	
	/* Create date field component
		return : Component
		parameters[
			
			PROPERTIES __________________
			value 			: [date] preset value. Default = just now.
			withREQ			: [bool] concatenates required field's label with * if true. Default = true.
			submitFormat 	: [string] value format passed upon form submission. Default = 'Y-m-d'.
			
			see property details for other parameters @ ExtDocs
		]
	*/
	
	// for BMA Payment standard only
	/**
	 * Developer: Roj Janubas
	 * Date: 05/16/2018
	 * Description: 
	 * 	Edit record through cellclick on name
	 */
	function _goToTrans( params ){
		_goToTransEdit({
			idmodule   : 2
			,mlink	   : "payment/Accountcard.js"
			,data : params
		});
	}
	
	function _goToTransEdit( params ){
		var mod = $( '#' + params.idmodule + '_mainView' );
		if( mod.get( 0 ) ){
			var str    = params.mlink;
			var slash  = str.indexOf( '/' );
			var period = str.indexOf( '.' );
			var module = '_' + str.substring( slash+1, period );
			currentModule = module;
			
			mod.trigger( 'click' );
			var mainPanel     = Ext.getCmp( 'mainPanel' + module );
			if( mainPanel ){
				// var requestNameID = Ext.getCmp( 'requestNameID' + module );
				mainPanel.editFunction( params.data );
			}
			else{
				setTimeout( function(){
					var mainPanel     = Ext.getCmp( 'mainPanel' + module );
					var requestNameID = Ext.getCmp( 'requestNameID' + module );
					mainPanel.editFunction( {
						requestID: params.requestID
					} );
				}, 2500 );
			}
		}
		else{
			_createMessageBox( {
				msg: 'You dont have access to this module. Please ask your system administrator.'
				,icon: 'error'
			} );
		}
	}
	// END
	
	
	function _createNumberField( params ){
		var allowBlank		= ( typeof params.allowBlank != 'undefined' )? params.allowBlank : true
		var withREQ    		= ( typeof params.withREQ != 'undefined' )? params.withREQ : true;
		var fieldLabel		= ( typeof params.fieldLabel != 'undefined' )? params.fieldLabel + ( !allowBlank? ( withREQ? Ext.getConstant( 'REQ' ) : '' ) : '' ) : '';
		var useThousandSeparator = ( typeof params.useThousandSeparator != 'undefined' )? params.useThousandSeparator : true;
		
		var field = Ext.create('widget.numericfield',{
						 id				: params.id
						,name			: params.id
						,fieldLabel		: fieldLabel
						,width			: ( typeof params.width != 'undefined' )? params.width : Ext.getConstant( 'DEF_WIDTH' )
						,labelWidth		: ( typeof params.labelWidth != 'undefined' )? params.labelWidth : Ext.getConstant( 'DEF_LABEL_WIDTH' )
						,maxLength		: ( typeof params.maxLength != 'undefined' )? params.maxLength : 24
						,value			: params.value || 0
						,hideTrigger	: (typeof params.hideTrigger != 'undefined' ? params.hideTrigger : true)
						,allowBlank		: allowBlank
						,style			: params.style
						,hidden			: params.hidden
						,readOnly		: params.readOnly
						,submitValue	: (typeof params.submitValue != 'undefined' ? params.submitValue:true)
						,decimalPrecision:(typeof params.decimalPrecision != 'undefined' ? params.decimalPrecision : 2)
						,minValue		: (params.minValue ? params.minValue : 0 )
						,maxValue		: (params.maxValue ? params.maxValue : Number.MAX_VALUE )
						,enforceMaxLength: true
						,allowDecimals	: (typeof params.allowDecimals != 'undefined' ? params.allowDecimals:true)
						,allowExponential: ((params.allowExponential)? params.allowExponential : true)
						,labelSeparator : (params.labelSeparator)? '':':'
						,labelAlign 	: ((params.labelAlign)? params.labelAlign : 'left')
						,cls			: params.cls
						,disabled		: ( typeof params.disabled != 'undefined' )? params.disabled : false
						,emptyText 		: params.emptyText
						,useThousandSeparator : useThousandSeparator
						,currencySymbol : params.currencySymbol
						,allowNull			: ( typeof params.allowNull != 'undefined' )? params.allowNull : false
					});
		
		field.addListener(params.listeners);
		return field;
	}
	
	
	
	function _createDateField( params ){
		var allowBlank = ( typeof params.allowBlank != 'undefined' )? params.allowBlank : true
		var withREQ    = ( typeof params.withREQ != 'undefined' )? params.withREQ : true;
		var fieldLabel = ( typeof params.fieldLabel != 'undefined' )? params.fieldLabel + ( !allowBlank? ( withREQ? Ext.getConstant( 'REQ' ) : '' ) : '' ) : '';
		
		return {
			xtype		: 'datefield'
			,id			: params.id
			,name		: params.id
			,value		: ( typeof params.value != 'undefined' )? params.value : Ext.Date.format(new Date(),'Y-m-d')
			,style		: params.style
			,fieldLabel	: fieldLabel
			,width		: ( typeof params.width != 'undefined' )? params.width : Ext.getConstant( 'DEF_WIDTH' )
			,labelWidth	: ( typeof params.labelWidth != 'undefined' )? params.labelWidth : Ext.getConstant( 'DEF_LABEL_WIDTH' )
			,hidden		: params.hidden
			,maxValue	: params.maxValue
			,minValue	: params.minValue
			,format		: params.format || Ext.getConstant( 'DATE_FORMAT' )
			,readOnly	: ( typeof params.readOnly != 'undefined' )? params.readOnly : false
			,submitValue: ( typeof params.submitValue != 'undefined' )? params.submitValue : true
			,submitFormat: ( typeof params.submitFormat != 'undefined' )? params.submitFormat : 'Y-m-d'
			,allowBlank : allowBlank
			,listeners	: params.listeners
			,fieldStyle : "text-align:right;"
		}
	}
	
	/* Create combo field component
		return : Component
		parameters[
			
			PROPERTIES __________________
			type 			: [string] Combobox type(supplier,customer,reference,items)
			withREQ			: [bool] concatenates required field's label with * if true. Default = true.
			reQuery			: [bool] deletes last query automatically if set to true. Default = false. 
			
			see property details for other parameters @ ExtDocs
		]
	*/
	
	function _createCombo( params ){
		var reQuery    = ( typeof params.reQuery != 'undefined' )? params.reQuery : true;
		var allowBlank = ( typeof params.allowBlank != 'undefined' )? params.allowBlank : true;
		var listeners  = ( typeof params.listeners != 'undefined' )? params.listeners : new Array();
		var indexID    = ( typeof params.indexID != 'undefined' )? params.indexID : false;
		var withREQ    = ( typeof params.withREQ != 'undefined' )? params.withREQ : true;
		
		// params['displayField'] 	= ( typeof params.displayField != 'undefined' )? params.displayField : 'name';
		// params['valueField']	= ( typeof params.valueField != 'undefined' )? params.valueField : ( typeof params.indexID != 'undefined'? params.displayField : 'id' );
		
		if( typeof params.type != 'undefined' ){
			var type      = params.type;
			var rank	  = 0;
			
			params['emptyText']		= ( typeof params.emptyText != 'undefined' )? params.emptyText : 'Select ' +( type.match( /^[a,e,i,o,u]/ ) == null ? 'a' : 'an' )+ ' ' +type+ '...';
			
			params['store'] = _createRemoteStore({
				fields:[
					'name'
					,{	name : 'id'
						,type:'number'
					}
					,"classificationID"
				]
				,url:standardRoute+'getStandardCombo'
			});
			
			
			/** reference combo requires idmodule **/
			if( type == 'user' ){
				
			}
			// else if( type == 'schoolyear' ){
			// 	params['id'] 		 = ( typeof params.id != 'undefined' )? params.id : 'schoolYearID' + params.module;
			// 	params['fieldLabel'] = ( typeof params.fieldLabel != 'undefined' )? params.fieldLabel : 'School Year';
			// 	params['hasQuick']	 = ( typeof params.hasQuick != 'undefined' )? params.hasQuick : true;
				
			// 	if( Ext.ifUndefined( params.hasQuick, false ) ){
			// 		params['store'].proxy.extraParams.hasQuick = true;
			// 	}
				
			// 	params['emptyText'] = 'Select a school year...';
			// 	if( !params.noSelect ){
			// 		console.log( "test true" );
			// 		listeners['select'] = function( me, result ){
					
			// 			if (result[0] === undefined || result[0] === null || typeof result[0] === 'undefined') {
			// 				console.log( "undefined variable" );
			// 					var grid	= this.up('grid');
			// 					var storage	= grid.store;
			// 					var gridSelectedIndex 	= grid.getSelectionModel().getSelection()[0];
			// 					var gridRowIndex 	= grid.store.indexOf(gridSelectedIndex);
			// 					// console.log( gridRowIndex );
			// 				if (storage.getAt( gridRowIndex ) === undefined || storage.getAt( gridRowIndex ) === null || typeof storage.getAt( gridRowIndex ) === 'undefined') {
								
			// 				}else{
			// 					storage.getAt( gridRowIndex ).set( 'schoolYearID', 0 );
			// 				}
			// 					me.reset();
			// 					return;
			// 			}
						
						
			// 			if( result[0].data.id == 0 ){
			// 				if( Ext.ifUndefined( params.hasQuick, false ) ){
			// 					me.reset();
			// 					_winSchoolYear( params );
			// 				}
			// 			}
			// 			else{
			// 				var grid	= me.up('grid');
			// 				var store	= grid.store;
			// 				var select 	= grid.getSelectionModel().getSelection()[0];
			// 					console.log( select );
			// 				var row 	= grid.store.indexOf(select);
			// 				if( me.noDuplicates ){
			// 					var dup =	store.findBy(
			// 									function( recordr, id ){
			// 										var index_data = grid.store.indexOf( recordr );
			// 										if( row != index_data ){
			// 											if( result[0].data.id == recordr.get( 'schoolYearID' ) ){
			// 												return true;
			// 											}
			// 										}
			// 										return false;
			// 									}
			// 								);
			// 					if( dup != -1 ){
			// 						me.reset();
			// 						store.getAt( row ).set( params.fieldToUpdate, 0 );
			// 					}
			// 					else{
			// 						store.getAt( row ).set( params.fieldToUpdate, result[0].data.id );
			// 					}
			// 				}
			// 				else{
			// 					store.getAt( row ).set( params.fieldToUpdate, result[0].data.id );
			// 				}
			// 			}
			// 		}
			// 	}
			// 	else{
			// 		console.log( "test error params" );
			// 	}
			// }
			// else if( type == 'gradelevel' ){
			// 	params['id']			= ( typeof params.id != 'undefined' )? params.id : 'gradeLevelID' + params.module;
			// 	params['fieldLabel']	= ( typeof params.fieldLabel != 'undefined' )? params.fieldLabel : 'Grade Level';
			// 	params['hasQuick']		= ( typeof params.hasQuick != 'undefined' )? params.hasQuick : true;
			// 	params['emptyText'] = 'Select a grade level...';
			// }
			// else if( type == 'students' ){
			// 	params['id']			= ( typeof params.id != 'undefined' )? params.id : 'studentID' + params.module;
			// 	params['fieldLabel']	= ( typeof params.fieldLabel != 'undefined' )? params.fieldLabel : 'Student Name';
			// 	params['hasQuick']		= ( typeof params.hasQuick != 'undefined' )? params.hasQuick : true;
			// }
			// else if( type == 'activity type' || type == 'subject' ){
			// 	params['id']			= ( ( typeof params.id != 'undefined' )? params.id : ( ( type == 'activity type' )? 'activityType' + params.module : 'subjectID' + params.module ) );
			// 	params['fieldLabel']			= ( ( typeof params.fieldLabel != 'undefined' )? params.fieldLabel : ( ( type == 'activity type' )? 'Activity Type' : 'Subject' ) );
			// 	params['hasQuick']		= ( typeof params.hasQuick != 'undefined' )? params.hasQuick : true;
				
			// 	if( Ext.ifUndefined( params.hasQuick, false ) ){
			// 		params['store'].proxy.extraParams.hasQuick = true;
			// 	}
				
			// 	listeners['select'] = function( me, result ){
			// 		if( result ){
			// 			if( result[0].data.id == 0 ){
			// 				if( Ext.ifUndefined( params.hasQuick, false ) ){
			// 					me.reset();
			// 					params['comboID'] = params.id;
			// 					_winActTypeSub( params );
			// 				}
			// 			}
			// 			else{
			// 				if( Ext.ifUndefined( listeners.extraSelect, false ) ){
			// 					listeners.extraSelect( me, result );
			// 				}
			// 				// console.log( me );
			// 				// if( typeof listeners.select != 'undefined' ){
			// 				// 	listeners.select();
			// 				// }
			// 			}
			// 		}
			// 	}
			// }
			
			params['fieldLabel']    = ( typeof params.fieldLabel != 'undefined' )? params.fieldLabel : type.substring(0,1).toUpperCase()+""+type.substring(1,type.length)+" Name";
			
			function __noDuplicate( _params ){
				var code   = parseInt( _params.result.id, 10 );
				var grid   = _params.me.up( 'grid' );
				var store  = grid.store;
				var select = grid.getSelectionModel().getSelection()[0];
				var row    = store.indexOf( select );
				var found  = store.findExact( _params.indexID, code );
				var record = store.getAt( row );
				
				if( parseInt( found, 10 ) == -1 ){
					record.set( _params.indexID, code );
					if( _params.select ){
						_params.select( record );	
					}
				}
				else{
					for( var key in record.data ) {
						if( key == _params.indexID ){
							record.set( key, 0 );
						}
						else{
							record.set( key, null );
						}
					}
					_params.me.reset();
				}
			}
			
			
			/** pass type value **/
			params['store'].proxy.extraParams.type = type;
			
			/** adds 'All' to option **/
			if( typeof params.hasAll != 'undefined' ){
				if( params.hasAll ){
					params['value'] = -1;
					params['store'].proxy.extraParams.hasAll = true;
					params['store'].load();
				}
			}
		}
		
		/** automatically adds beforequery listeners to all combo. beforequery allows recalling of query every action **/
		if( reQuery ){
			listeners['beforequery'] = function( me ){
				delete me.combo.lastQuery;
			}
		}
		
		if( typeof listeners.select == 'undefined' && indexID ){
			listeners['select'] = function( me, result ){
				__noDuplicate( {
					me		 : me
					,result	 : result[0].data
					,indexID : params.indexID
					,select  : ( typeof params.select != 'undefined' )? params.select : null
				} );
			}
		}
		
		/** automatically removes fieldLabel if indexID is defined. Which concludes that this combo is use as a grid editor **/
		if( typeof params.indexID != 'undefined' ){
			params.fieldLabel = '';
		}
		
		return Ext.create( 'Ext.form.ComboBox', {
			id				: params.id
			,name			: params.id
			,fieldLabel		: params.fieldLabel + ( !allowBlank? ( withREQ? Ext.getConstant( 'REQ' ) : '' ) : '' )
			,emptyText		: ( typeof params.emptyText != 'undefined' )? params.emptyText : 'Select '+params.fieldLabel.toLowerCase()
			,store			: params.store
			,valueField		: ( typeof params.valueField != 'undefined' )? params.valueField : 'id'
			,displayField	: ( typeof params.displayField != 'undefined' )? params.displayField : 'name'
			,style			: params.style
			,minChars		: 1
			,value			: params.value
			,hidden			: params.hidden
			,cls			: params.cls
			,allowBlank		: allowBlank
			,readOnly		: ( typeof params.readOnly != 'undefined' )? params.readOnly : false
			,width			: ( typeof params.width != 'undefined' )? params.width : Ext.getConstant( 'DEF_WIDTH' )
			,labelWidth		: ( typeof params.labelWidth != 'undefined' )? params.labelWidth : Ext.getConstant( 'DEF_LABEL_WIDTH' )
			,editable		: ( typeof params.editable != 'undefined' )? params.editable : true
			,typeAhead		: ( typeof params.typeAhead != 'undefined' )? params.typeAhead : true
			,submitValue	: ( typeof params.submitValue != 'undefined' )? params.submitValue : true
			,forceSelection : ( typeof params.forceSelection != 'undefined' )?params.forceSelection : true
			,disabled		: ( typeof params.disabled != 'undefined' )? true : false
			,hideTrigger	: ( typeof params.hideTrigger != 'undefined' )? params.hideTrigger : false
			,enableKeyEvents: ( typeof params.enableKeyEvents != 'undefined' )? params.enableKeyEvents : false
			,matchFieldWidth: ( typeof params.matchFieldWidth != 'undefined' )? params.matchFieldWidth : true
			,pageSize		: ( typeof params.pageSize != 'undefined' )? params.pageSize : 0
			,listeners		: listeners
			,fieldToUpdate	: params.fieldToUpdate
			,noDuplicates	: params.noDuplicates
		});
		
	}
	
	/* Create text area component
		return : Component
		parameters[
			
			PROPERTIES __________________
			withREQ			: [bool] concatenates required field's label with * if true. Default = true.
			
			see property details for other parameters @ ExtDocs
		]
	*/
	
	function _createTextArea( params ){
		var allowBlank = ( typeof params.allowBlank != 'undefined' )? params.allowBlank : true
		var withREQ    = ( typeof params.withREQ != 'undefined' )? params.withREQ : true;
		var fieldLabel = ( typeof params.fieldLabel != 'undefined' )? params.fieldLabel + ( !allowBlank? ( withREQ? Ext.getConstant( 'REQ' ) : '' ) : '' ) : '';
		
		return {
			xtype			: 'textarea'
			,id				: params.id
			,name			: params.id
			,fieldLabel		: fieldLabel
			,width			: ( typeof params.width != 'undefined' )? params.width : Ext.getConstant( 'DEF_WIDTH' )
			,labelWidth		: ( typeof params.labelWidth != 'undefined' )? params.labelWidth : Ext.getConstant( 'DEF_LABEL_WIDTH' )
			,height			: ( typeof params.height != 'undefined' )? params.height : 25
			,minWidth		: params.minWidth
			,maxWidth		: params.maxWidth
			,style			: params.style
			,minHeight		: params.minHeight
			,maxHeight		: params.maxHeight
			,hidden			: params.hidden
			,value			: params.value
			,allowBlank		: allowBlank
			,readOnly		: ( typeof params.readOnly != 'undefined' )? params.readOnly : false
			,submitValue	: ( typeof params.submitValue != 'undefined' )? params.submitValue : true
			,labelAlign		: ( typeof params.labelAlign != 'undefined' )? params.labelAlign: 'left'
		}
	}
	
	/* Create check box component
		return : Component
		parameters[
			
			PROPERTIES __________________
			
			see property details for other parameters @ ExtDocs
		]
	*/
	
	function _createCheckField( params ){
		return {
			xtype			: 'checkboxfield'
			,boxLabel		: params.boxLabel
			,fieldLabel		: params.fieldLabel
			,labelWidth		: Ext.getConstant( 'DEF_LABEL_WIDTH' )
			,value			: params.value
			,id				: params.id
			,name			: params.id
			,style			: params.style
			,width			: params.width
			,handler		: params.handler
			,inputValue		: '1'
			,hidden			: params.hidden
			,listeners		: params.listeners
			,checked		: params.checked
			,submitValue	: ( typeof params.submitValue != 'undefined' ? params.submitValue : true )
		}
	}
	
	/* Create time field component
		return : Component
		parameters[
			
			PROPERTIES __________________
			withREQ			: [bool] concatenates required field's label with * if true. Default = true.
			
			see property details for other parameters @ ExtDocs
		]
	*/
	
	function _createTimeField( params ){
		var allowBlank = ( typeof params.allowBlank != 'undefined' )? params.allowBlank : true
		var withREQ    = ( typeof params.withREQ != 'undefined' )? params.withREQ : true;
		var fieldLabel = ( typeof params.fieldLabel != 'undefined' )? params.fieldLabel + ( !allowBlank? ( withREQ? Ext.getConstant( 'REQ' ) : '' ) : '' ) : '';
		
		return {
			xtype							: 'timefield'
			,id								: params.id
			,name							: params.id
			,fieldLabel						: fieldLabel
			,width							: ( typeof params.width != 'undefined' )? params.width : Ext.getConstant( 'DEF_WIDTH' )
			,labelWidth						: ( typeof params.labelWidth != 'undefined' )? params.labelWidth : Ext.getConstant( 'DEF_LABEL_WIDTH' )
			,increment						: ( typeof params.increment != 'undefined' )? params.increment : 15
			,editable						: ( typeof params.editable != 'undefined' )? params.editable : true
			,submitValue					: ( typeof params.submitValue != 'undefined' )? params.submitValue : true
			,allowBlank						: allowBlank
			,maxLength						: params.maxLength
			,minValue						: params.minValue
			,enforceMaxLength				: true
			,readOnly						: params.readOnly
			,value							: params.value
			,hidden							: params.hidden
			,listeners						: params.listeners
			,fieldStyle						: 'text-align:right'
			,style							: params.style
			,value							: params.value
			,emptyText						: 'HH:MM PERIOD'
			,format							: 'h:i A'
			,altFormats 					: 'h:i A'
		}
	}
	
	/* Create date range
		return : container
		parameters[
			
			PROPERTIES __________________
			sdateID			: [string] id for start date field. Default = 'sdate'+module.
			edateID			: [string] id for end date field. Default = 'edate'+module.
			stimeID			: [string] id for start time field. Default = 'stime'+module.
			etimeID			: [string] id for end time field. Default = 'etime'+module.
			noTime			: [bool] inclusion of time range. Default = false.
			fromFieldLabel	: [string] field label for start date field.
			fromLabelWidth	: [int] label width for start date/time field.
			fromWidth		: [int] width for start date/time field.
			labelWidth		: [int] label width for end date/time field.
			
		]
		import functions[
			
			_createDatefield()
			_createTimefield()
		]
	*/
	
	function _createDateRange( params ){
		var date    = ( typeof params.date != 'undefined' )? params.date : new Date();
		var sdateID = ( typeof params.sdateID != 'undefined' )? params.sdateID : 'sdate'+params.module;
		var edateID = ( typeof params.edateID != 'undefined' )? params.edateID : 'edate'+params.module;
		var noTime  = ( typeof params.noTime != 'undefined' )? params.noTime   : true;
		var items   = new Array();
		
		/** sets a month behind from current date **/
		if( typeof params.date == 'undefined' ){
			date.setMonth( date.getMonth() - 1 );
			date = Ext.Date.format(date,'Y-m-d');
		}
		
		var dateItems = [
			/** date field (from) **/
			_createDateField( {
				id : 		sdateID
				,fieldLabel: ( typeof params.fromFieldLabel  !=  'undefined' ) ? params.fromFieldLabel : 'Date'
				,labelWidth: ( typeof params.fromLabelWidth  !=  'undefined' ) ? params.fromLabelWidth : Ext.getConstant( 'DEF_LABEL_WIDTH' )
				,width: 	 ( typeof params.fromWidth       !=  'undefined' ) ? params.fromWidth      : 240
				,value:		 date
				,style:		params.styleFrom
				,listeners: {
					change: function(){
						var edate = Ext.getCmp( edateID );
						edate.setMinValue( this.value );
						edate.validate();
						
						if( this.isValid() ){
							if( this.value > edate.value ){
								edate.setValue( this.value )
							}
						}
						
						if( typeof params.listeners != 'undefined' ){
							if( typeof params.listeners.afterChange1 != 'undefined' ){
								if( this.isValid() ){
									params.listeners.afterChange1( this.getValue() );
								}
							}
						}
					}
				}
			})
			
			/** date field (to) **/
			,_createDateField({
				id : 		edateID
				,style:'margin-left:5px'
				,fieldLabel: 'to'
				,labelWidth:( typeof params.labelWidth != 'undefined' )? params.labelWidth : 15
				,width:		( typeof params.width != 'undefined' )? params.width : 135
				,minValue:	date
				,listeners: {
					change: function(){
						var sdate = Ext.getCmp( sdateID );
						
						if( typeof params.listeners != 'undefined' ){
							if( typeof params.listeners.afterChange2 != 'undefined' ){
								if( this.isValid() ){
									params.listeners.afterChange2( this.getValue() );
								}
							}
						}
					}
				}
			})
		]
		
		if( typeof params.extraComponents != 'undefined' ){
			for( var x in extra = params.extraComponents ){
				dateItems.push( extra[x] );
			}
		}
		
		/** push date range to an array **/
		items.push(
			{	xtype	: 'container'
				,layout	: 'column'
				,style  : ( typeof params.style != 'undefined' )? params.style : 'margin-bottom:5px'
				,items  : dateItems
			}
		);
		
		/** push time range to array **/
		if( !noTime ){
			var stimeID = ( typeof params.stimeID != 'undefined' )? params.stimeID : 'stime'+params.module;
			var etimeID = ( typeof params.etimeID != 'undefined' )? params.etimeID : 'etime'+params.module;
			
			items.push(
				{
					xtype:'container'
					,layout:'column'
					,style:'margin-bottom:5px'
					,items:[
						/** time field (to) **/
						_createTimeField({
							id					: stimeID
							,fieldLabel			: 'Time'
							,labelWidth			: ( typeof params.fromLabelWidth  !=  'undefined' ) ? params.fromLabelWidth : Ext.getConstant( 'DEF_LABEL_WIDTH' )
							,width				: ( typeof params.fromWidth       !=  'undefined' ) ? params.fromWidth      : 240
							,value				: '12:00 AM'
						})
						
						/** time field (to) **/
						,_createTimeField({
							id					: etimeID
							,fieldLabel			: 'to'
							,style				: 'margin-left:5px'
							,labelWidth			: ( typeof params.labelWidth != 'undefined' )? params.labelWidth : 15
							,width				: ( typeof params.width != 'undefined' )? params.width : 135
							,value				: '11:59 PM'
						})
					]
				}
			);
		}
		
		return {
			xtype	: 'container'
			,id		: ( typeof params.id != 'undefined' )? params.id : 'dateRangeContainer' + params.module
			,hidden	: ( typeof params.hidden != 'undefined' )? params.hidden : false
			,style	: params.style
			,items	: items
		}
	}
	
	/* Create date and time fields
		return : container
		parameters[
			
			PROPERTIES __________________
			
			dId			: [string] id for date field. Default = 'tdate'+module.
			dFieldLabel	: [string] field label for date field. Default = 'As of'.
			dLabelWidth	: [int] width label for date field. Default = Ext.getConstant( 'DEF_LABEL_WIDTH' ).
			dWidth		: [int] width for date field. Default = 240.
			dAllowBlank	: [bool] specify if field is required upon submission. Default = false.
			
			tId			: [string] id for time field. Default = 'ttime'+module.
			tstyle		: [string] style applied to time field. Default = margin-left:25px.
			tLabelWidth	: [int] width label for time field. Default = 0.
			tWidth		: [int] width for time field. Default = 115.
			tValue		: [date] preset value for time field. Default = just now.
			
			see property details for other parameters @ ExtDocs
			
		]
		import functions[
			
			_createDatefield()
			_createTimefield()
		]
	*/
	
	function _createDateTime( params ){
		return {
			xtype:'container'
			,layout:'column'
			,style:	( typeof params.style != 'undefined' )? params.style : 'margin-bottom:5px'
			,items:[
				/** create date field **/
				_createDateField({
					id					: ( typeof params.dId != 'undefined' )? params.dId : 'tdate' + params.module
					,style				: params.dStyle
					,fieldLabel			: ( typeof params.dFieldLabel != 'undefined' )? params.dFieldLabel : 'As of'
					,labelWidth			: ( typeof params.dLabelWidth !=  'undefined' ) ? params.dLabelWidth : Ext.getConstant( 'DEF_LABEL_WIDTH' )
					,width				: ( typeof params.dWidth      !=  'undefined' ) ? params.dWidth      : 240
					,allowBlank			: params.dAllowBlank
				})
				/** create time field **/
				,_createTimeField({
					id					: ( typeof params.tId != 'undefined' )? params.tId : 'ttime' + params.module
					,style				: ( typeof params.tstyle != 'undefined' )? params.tstyle : 'margin-left:25px'
					,labelWidth			: ( typeof params.tLabelWidth != 'undefined' )? params.tLabelWidth : 0
					,width				: ( typeof params.tWidth != 'undefined' )? params.tWidth : 115
					,value				: ( typeof params.tValue != 'undefined' )? params.tValue : new Date()
				})
			]
		};
	}
	
	/* Create action column ( !params.module )
		return : component
		parameters[
			
			PROPERTIES __________________
			icon			: [string] icon displayed.
			icon2			: [string] alternative icon displayed whenever condition is defined and met.
			tooltip			: [string] tooltip displayed.
			tooltip2		: [string] alternative tooltip displayed whenever condition is defined and met.
			canDelete		: [bool] flag in which determines whether the action column is clickable or not. Default = true
			
		]
	*/
	
	function _createActionColumn( params ){
		var active = ( typeof params.canDelete != 'undefined' ? params.canDelete : true );
		
		return Ext.create('Ext.grid.column.Column',{
			width: params.width || 25
			,xtype:'actioncolumn'
			,menuDisabled:true
			,hidden: params.hidden
			,renderer: function( value, metaData, rec ){
				metaData.style = 'cursor: pointer';
				/** set color to blue if its selected and active, otherwise black **/
				var color = ( parseInt( rec.get( 'selected' ) ) == 1 )? ( active? '#a98778' : '#ecf0f1' ) : '#ecf0f1';
				var btnText = '';
				if( typeof params.button !== 'undefined' ){
					if( rec.get( 'status' ) == 'Active' && parseInt(rec.get( 'closeShow' )) == 1){
						btnText = 'Close'
					}
					else if( rec.get( 'status' ) == 'Closed' && parseInt(rec.get('btnShow')) == 1 ){
						btnText = 'Archive'	
					}
					else {
						return '';
					}
					
					return '<button style="background-color: #512A03;'
						    + 'border-radius: 5px;'
						    + 'color: white;'
						    + 'height: 25px;'
						    + 'text-align: center;'
						    + 'width: 100%;">' + btnText  + '</button>';
				}
				/** check if condition is defined **/
				if( typeof params.condition != 'undefined' ){
					/** change icon and tooltip if condition is met **/
					if( eval( params.condition ) ){
						return '<span class="glyphicon glyphicon-'+params.icon2+'" style="color:'+color+'" title="'+ ( ( typeof params.tooltip2 != 'undefined' )? params.tooltip2 : params.tooltip ) +'"></span>';
					}
				}
				
				return '<span class="glyphicon glyphicon-'+params.icon+'" style="color:'+color+'" title="'+params.tooltip+'"></span>';
				
			}
			,listeners: {
				click: function( grid, params1, row, params2, params3, rec ){
					/** only clickable when row is selected and active **/
					/* close button */
					if( typeof rec.get('btnShow') !== 'undefined' && parseInt(rec.get( 'closeShow' )) !== 1 ){
						return false
					}
					
					else if( ( typeof rec.get('btnShow') !== 'undefined' &&  parseInt(rec.get('btnShow')) == 0 ) && rec.get( 'status' ) == "Closed" ){// && parseInt(rec.get( 'closeShow' )) != 1){
						return false;
					}
					if( parseInt( rec.data.selected, 10 ) == 1 && active ){
						SELECTED = null;
						
						/** executes another function if condition is met **/
						/** otherwise, run custom function **/
						if( typeof params.condition != 'undefined' ){
							if( eval( params.condition ) ){
								params.Func2( rec.data, row );
							}
							else{
								params.Func( ( typeof params.canDelete != 'undefined'? new Ext.objectProtoType( rec.data ) : rec.data ), row );
							}
						}
						else{
							/** Ext.objectProtoType( object ) contains prototype function
								that prompts a confirmation message when deleting a record.
								Only works for delete action columns
							**/
							params.Func( ( typeof params.canDelete != 'undefined'? new Ext.objectProtoType( rec.data ) : rec.data ), row );
						}
					}
					else{
						if( typeof params.allowAccess != 'undefined' ){
							params.Func( new Ext.objectProtoType( rec.data ), row );
						}
					}
				}
			}
		});
	}
	
	/* Create masking component that would mask on-progress functions
		return : Component
		parameters[
			
			PROPERTIES __________________
			target	: [object] container to be masked. Default = Ext.getBody()
			msg   	: [string] message shown during masking. Default = Please wait... 
		]
	*/
	
	function _createMask( params ){
		return new Ext.LoadMask(
			( typeof params.target != 'undefined' )? params.target : Ext.getBody()
			,{ 
				msg: (typeof params.msg != 'undefined' )? params.msg : 'Please wait...'
			}
		);
	}
	
	/* Create message box or confirmation box
		return : Message Box
		parameters[
			
			PROPERTIES __________________
			action	: [string] appropriate description for the fixed message. no default value
			msg		: [string] custom message. only applicable if action = custom or confirm. Default = empty string
			icon	: [string] icon for message box. valid values [error, question]. Default = Ext.MessageBox.INFO
			buttons	: [string] buttons for message box. valid values [okcancel, yesno, yesnocancel]. Default = Ext.MessageBox.OK
			title 	: [string] title for message box. Default = SYSTEM MESSAGE
			
			see property details for other parameters @ ExtDocs
			
			FUNCTIONS __________________
			fn		: [func] function which executes after confirmation
		]
	*/
	
	function _createMessageBox( params ){
		var title	= ( typeof params.title != 'undefined' )? params.title : Ext.getConstant( 'MSGBOX_TITLE' );
		var action 	= ( typeof params.action != 'undefined' )? params.action.toLowerCase() : '';
		var msg     = Ext.ifUndefined( Ext.getConstant( params.msg ), params.msg );
		
		/** confirmation box **/
		if( action == 'confirm' ){
			Ext.MessageBox.confirm(
				title
				,msg
				,params.fn
			);
		}
		/** message box **/
		else{
			var icon 	= Ext.MessageBox.INFO;
			var buttons = Ext.MessageBox.OK;
			
			/** icon for message box **/
			if( typeof params.icon != 'undefined' ){
				if( params.icon == 'error' ){
					icon = Ext.MessageBox.ERROR;
				}
				else if( params.icon == 'question' ){
					icon = Ext.MessageBox.QUESTION;
				}
			}
			
			/** button(s) for message box **/
			if( typeof params.buttons != 'undefined' ){
				if( params.buttons == 'okcancel' ){
					buttons  = Ext.MessageBox.OKCANCEL;
				}
				else if( params.buttons == 'yesno' ){
					buttons  = Ext.MessageBox.YESNO;
				}
				else if( params.buttons == 'yesnocancel' ){
					buttons  = Ext.MessageBox.YESNOCANCEL;
				}
			}

			Ext.MessageBox.show({
				msg		: msg
				,icon	: icon
				,title	: title
				,buttons: buttons
				,closeAction:'destroy'
				,fn	: ( typeof params.fn != 'undefined' )? params.fn : function(){}
			});
		}
	}
	
	/* Create message box or confirmation box
		return : Message Box
		parameters[
			
			PROPERTIES __________________
			element	: [string] component's id on which prompt message will be applied.
			msg		: [string] custom message. Default = empty string
			duration: [int] desired duration (millisecond) for the message to be shown before fading away. Default = 200
			
			see property details for other parameters @ ExtDocs
		]
	*/
	
	function _promptMsg( params ){
		var element;
		var msg;
		var duration;
		element  = Ext.get( params.varId );
		msg      = ( typeof params.msg != 'undefined'? '<em style="color:red;">'+params.msg+'</em>' : '' );
		msg      = ( typeof params.success != 'undefined'? '<em style="color:#00a800;">'+params.msg+'</em>' : '' );
		duration = ( typeof params.duration != 'undefined'? params.duration : 200 );
		
		if( element ){
			element.update( msg );
			if( !element.isVisible() ){
				element.slideIn( 't', {
					duration: duration
					,easing: 'easeIn'
					,listeners: {
						afteranimate: function() {
							element.highlight();
							element.setWidth( null );
						}
					}
				});										
			}		
		}				
	}
	
	/* Create local store
		return : Store
		parameters[
			
			PROPERTIES __________________
			fields	: [Array of strings] store fields. If not defined, local store uses numreric values for valueField. Default = [name,id] - displayField and valueField respectively.
			data	: [JSON] custom json object which consist both values for displayFields and valueFields. only applicable if 'fields' parameter is defined.
			startAt : [int] desired starting point for numeric valueFields. Default = 1
			
		]
	*/
	
	function _createLocalStore( params ){
		var data;
		var fields;
		
		if( typeof params.fields != 'undefined' ){
			data   = params.data;
			fields = params.fields;
		}
		else{
			data   = [];
			fields = [
				'name'
				,'id'
			];
			
			var startAt = ( typeof params.startAt != 'undefined' )? params.startAt : 1;
			
			for( var x = startAt; x < params.data.length + startAt; x++ ){ 
				data.push({
					id: x
					,name: params.data[x-startAt]
				});
			}
		}
		
		return Ext.create( 'Ext.data.Store', {
			fields	: fields
			,data	: data
		});
	}
	
	/* Create remote store
		return : Store
		parameters[
			
			PROPERTIES __________________
			fields	: [Array of strings] store fields.
			url		: [string] controller path.
			pageSize: [int] row number per page. Default = 50
			
		]
	*/
	
	function _createRemoteStore( params ){
		
		for( var x in fields = params.fields ){
			if( typeof fields[x].type != 'undefined' ){
				if( fields[x].type == 'number' ){
					fields[x].sortType = 'asInt';
				}
				else if( fields[x].type == 'float' ){
					fields[x].sortType = 'asFloat';
				}
				else if( fields[x].type == 'date' ){
					fields[x].sortType = 'asDate';
				}
			}
			else{
				fields[x] = {
					name      : fields[x]
					,sortType : 'asUCText'
				};
			}
		}
		
		var modelId = ( typeof params.modelId != 'undefined' ? params.modelId : params.url );
		var model 	= Ext.define( modelId, {
						extend: 'Ext.data.Model'
						,fields:params.fields
					});
		
		return  Ext.create( 'Ext.data.Store', {
			model		: modelId
			,storeId	: modelId
			,autoLoad	: ( typeof params.autoLoad != 'undefined'? params.autoLoad : false )
			,pageSize	: ( typeof params.pageSize != 'undefined'? params.pageSize : Ext.getConstant( 'DEF_PAGE_SIZE' ) )
			,listeners	: params.listeners
			,proxy:{		
				type:			'ajax'
				,actionMethods:	'post'
				,url:			params.url
				,noCache:		false
				,reader:{		
					type:			'json'
					,root:			'view'
					,totalProperty:	'total'
				}
			}
		});
	}
	
	/* Create module's main panel
		return : Tab child
		parameters[
			
			PROPERTIES __________________
			moduleType		: [string] specify if module is form or report. Default = 'form'
			formItems		: [array of components] items for form or report
			moduleGrids		: [array of components || single grid] grid(s) for under report form
			tbar			: [object || string] header toolbar config. Set tbar as 'empty' for empty header toolbar
			noFormButton 	: [bool] (under tbar) specify availability for form button. Default = false
			noListButton 	: [bool] (under tbar) specify availability for list/history button. Default = false
			noExcelButton 	: [bool] (under tbar) specify availability for excel button. Default = false
			noPDFButton 	: [bool] (under tbar) specify availability for pdf button. Default = false
			noHelpButton 	: [bool] (under tbar) specify availability for help button. Default = false
			formLabel		: [string] (under tbar) form button label. Default = 'Form'
			listLabel		: [string] (under tbar) list/history button label. Default = 'History'
			saveLabel		: [string] (under tbar) save button label. Default = 'Save'
			resetLabel		: [string] (under tbar) reset button label. Default = 'Reset'
			PDFHidden 		: [bool] (under tbar) pfd button invisibility. Default = true
			extraTbar1		: [array of components] (under tbar) extra components rendered after save/reset button
			extraTbar2		: [array of components] (under tbar) extra components rendered before excel button
			extraTbar3		: [array of components] (under tbar) extra components rendered after help button
			filter			: [object] (under tbar) used as preference for standard tbar combo search
			displayField	: [string] (under filter) database column
			table			: [string] (under filter) database selected schema
			idmodule		: [int] (under filter) if specified, automatically adds additional combo filter (reference code) for searching.
			
			FUNCTIONS __________________
			customGoToFormHandler:  [func] (under tbar) custom function for switching tab from list/history to form. If not specified, standard goToForm() executes
			beforeGoToFormHandler:  [func] (under tbar) custom function that triggers before goToForm()
			afterGoToFormHandler:   [func] (under tbar) custom function that triggers after goToForm()
			customGoToListHandler:  [func] (under tbar) custom function for switching tab from form to list/history
			beforeGoToListHandler:  [func] (under tbar) custom function that triggers before go to list
			afterGoToListHandler:   [func] (under tbar) custom function that triggers after go to list
			customExcelHandler:   	[func] (under tbar) custom function for printing excel
			formPDFHandler:   		[func] (under tbar) custom function for printing pdf
			beforeHelpHandler:   	[func] (under tbar) custom function that triggers before viewing help window
			afterHelpHandler:   	[func] (under tbar) custom function that triggers after viewing help window
			
		]
		import functions[
			
			_changeCls()
			_createComboSearch()
			_formPanel()
		]
	*/
	
	function _mainPanel( params ){
		var mainTab 		= Ext.getCmp( 'mainTab_mainView' );
		var tbar 			= null;
		var tbarCardItems   = new Array();
		var mainPanelItems  = new Array();
		var moduleType 		= ( typeof params.moduleType != 'undefined' )? params.moduleType : 'form';
		var isTabChild		= ( typeof params.isTabChild != 'undefined' )? params.isTabChild : false;
		var hasComponentSeparator		= ( typeof params.hasComponentSeparator != 'undefined' )? params.hasComponentSeparator : true;
		var config			= params.config;
		
		/** TOP TOOLBAR **/
		if( typeof params.tbar != 'undefined' ){
			var tbarItems = new Array();
			var me = params.tbar;
			
			if( params.tbar instanceof Array ){
				tbarItems = params.tbar;
			}
			else{
				if( me.toString().toLowerCase() === 'empty' ){
					tbarItems = null;
				}
				else{
					var noFormButton  = ( typeof me.noFormButton != 'undefined' )? me.noFormButton : false;
					var noListButton  = ( typeof me.noListButton != 'undefined' )? me.noListButton : false;
					var noExcelButton = ( typeof me.noExcelButton != 'undefined' )? me.noExcelButton : false;
					var noPDFButton   = ( typeof me.noPDFButton != 'undefined' )? me.noPDFButton : false;
					var noHelpButton  = ( typeof me.noHelpButton != 'undefined' )? me.noHelpButton : false;
					
					/** FORM BUTTON **/
					if( moduleType == 'form' ){
						var tbarCardItems1 	= new Array();
						
						/** insert button for form **/
						if( !noFormButton ){
							tbarItems.push({
								xtype:'button'
								,cls:'menuActive'
								,text:( typeof me.formLabel != 'undefined' )? me.formLabel : 'Form'
								,id:'btnForm' + config.module
								,iconCls: 'glyphicon glyphicon-credit-card'
								,handler: function(){
									
									/** standard function upon clicking form button **/
									_goToForm({
										scope			: this
										,module			: config.module
										,otherFormID 	: params.otherFormID
										,hasFormPDF		: ( typeof me.hasFormPDF != 'undefined' )? me.hasFormPDF : false
										,hasFormExcel 	: ( typeof me.hasFormExcel != 'undefined' )? me.hasFormExcel : false
									});
									
									/** custom function after gotoForm function **/
									if( typeof me.afterGoToFormHandler != 'undefined' ){
										me.afterGoToFormHandler();
									}
								}
							});
						}
						
						/** LIST/HISTORY BUTTON **/
						/** insert button for list/history **/
						if( !noListButton ){
							tbarItems.push({
								xtype:'button'
								,cls:'menuInactive'
								,text: ( typeof me.listLabel != 'undefined' )? me.listLabel : 'History'
								,id:'btnList' + config.module
								,iconCls: 'glyphicon glyphicon-list-alt' 
								,noActionBtn: ( typeof me.noActionBtn != 'undefined' )? me.noActionBtn : false
								,handler: function(){
									/** check then change button's cls and main panel's active tab **/
									if( _changeCls({
											scope : this
											,module : config.module
										}) 
									){
										/** reset filters **/
										if( filterContainer = Ext.getCmp( 'searchFilterContainer' + config.module ) ){
											for( x in field = filterContainer.items.items ){
												if( field[x].isFormField ){
													field[x].reset();
												}
											}
										}
										
										/** sets store's page to 1 and load **/
										if(config.module != "_accountcard"){
											if( grid = Ext.getCmp( 'gridHistory'+config.module ) ){
												grid.store.sorters.clear();
												grid.store.currentPage = 1;
												grid.store.proxy.extraParams = {};
												grid.store.load();
											}
										}
										else{
											// if( grid = Ext.getCmp( 'gridHistory'+config.module ) ){
											// 	grid.store.sorters.clear();
											// 	grid.store.currentPage = 1;
											// 	// grid.store.proxy.extraParams = {};
											// 	grid.store.load();
											// }
										}
										
										/** hide both buttons if any **/
										if( btnExcel = params.module.getButton( 'excel' ) ){
											btnExcel.setVisible( config.canPrint );
										}
										if( btnPDF = params.module.getButton( 'pdf' ) ){
											btnPDF.setVisible( config.canPrint );
										}
										
										/** custom function after gotoList function **/
										if( typeof me.afterGoToListHandler != 'undefined' ){
											me.afterGoToListHandler();
										}
									}
								}
							});
						}
						
						/** SAVE BUTTON **/
						/** insert button for save button **/
						if( typeof me.saveFunc != 'undefined' ){
							tbarCardItems1.push({
								xtype:		'button'
								,id:		'saveButton'+config.module
								,iconCls:	'glyphicon glyphicon-floppy-disk'
								,text:		( typeof me.saveLabel != 'undefined' )? me.saveLabel : 'Save'
								,disabled:	true
								,cls:		'btnSaveReset'
								,hidden:	!config.canSave
								,handler:	function(){
									me.saveFunc( config.module.getForm() );
								}
							});
						}
						
						/** RESET BUTTON **/
						/** insert button for reset button **/
						if( typeof me.resetFunc != 'undefined' ){
							tbarCardItems1.push({
								xtype:		'button'
								,id:		'resetButton'+config.module
								,iconCls:	'glyphicon glyphicon-refresh'
								,text:		( typeof me.resetLabel != 'undefined' )? me.resetLabel : 'Reset'
								,style:		'margin-left:5px; margin-bottom:5px;'
								,cls:		'btnSaveReset'
								,handler:	function(){
									me.resetFunc( config.module.getForm() );
								}
							});
						}
						
						/** EXTRA BUTTONS **/
						/** insert extra action button **/
						if( typeof params.extraFormButton != 'undefined' ){
							var extraFormButton = params.extraFormButton;
							
							/** handler for extra button **/
							function extraButtonHandler( x ){
								return function(){
									if( typeof extraFormButton[x].handler != 'undefined' ){
										extraFormButton[x].handler();
									}
								}
							}
							
							for( var x in extraFormButton ){
								/** if index of button is not specified, default index would be equal to container's current number of items **/
								extraFormButton[x].index = ( typeof extraFormButton[x].index != 'undefined' )? extraFormButton[x].index : tbarCardItems1.length;
								extraFormButton[x].label = ( typeof extraFormButton[x].label != 'undefined' )? extraFormButton[x].label : 'new button'+extraFormButton[x].index;
								
								/** insert extra button to specified index **/
								tbarCardItems1.splice( extraFormButton[x].index, 0, {
									xtype		: 'button'
									,cls		: ( typeof extraFormButton[x].cls != 'undefined' )? extraFormButton[x].cls : 'menuInactive'
									,iconCls	: ( typeof extraFormButton[x].iconCls != 'undefined' )? extraFormButton[x].iconCls : 'glyphicon glyphicon-floppy-disk'
									,style		: ( typeof extraFormButton[x].style != 'undefined' )? extraFormButton[x].style : 'margin-left:5px'
									,hidden		: ( typeof extraFormButton[x].hidden != 'undefined' )? extraFormButton[x].hidden : false
									,id			: ( typeof extraFormButton[x].id != 'undefined' )? extraFormButton[x].id : 'extraFormButton'+extraFormButton[x].label.replace(/ /g,'_')+''+config.module
									,text		: extraFormButton[x].label
									,handler	: extraButtonHandler( x )
								})
							}
						}
						
						tbarCardItems.push({	
							xtype:	'container'
							,layout:'column'
							,style:	'margin-top:5px'
							,items: tbarCardItems1
						});
						
						/** FILTER  **/
						/** insert filter field for list/history **/
						if( typeof me.filter != 'undefined' ){
							me.filter.config = config;
							tbarCardItems.push( _createComboSearch( me.filter ) );
						}
						else{
							tbarCardItems.push( {xtype:'container'} );
						}
					}
					
					/** EXTRA FORM TAB BUTTON **/
					/** insert extra button for extra tab **/
					if( typeof params.extraFormTab != 'undefined' ){
						var extraFormTab = params.extraFormTab;
						
						/** handler for extra button **/
						function tabButtonHandler( x ){
							return function(){
								/** check then change button's cls and main panel's active tab **/
								if( _changeCls({
										scope : this
										,module : config.module
									}) 
								){
									if( typeof extraFormTab[x].buttonHandler != 'undefined' ){
										extraFormTab[x].buttonHandler();
									}
								}
							}
						}
						
						for( var x in extraFormTab ){
							/** if index of button is not specified, default index would be equal to tbar's current number of items **/
							extraFormTab[x].buttonIndex   = ( typeof extraFormTab[x].buttonIndex != 'undefined' )? extraFormTab[x].buttonIndex : tbarItems.length;
							extraFormTab[x].buttonLabel   = ( typeof extraFormTab[x].buttonLabel != 'undefined' )? extraFormTab[x].buttonLabel : 'new tab'+extraFormTab[x].buttonIndex;
							
							/** insert extra button to specified index **/
							tbarItems.splice( extraFormTab[x].buttonIndex, 0, {
								xtype		: 'button'
								,cls		: ( typeof extraFormTab[x].cls != 'undefined' )? extraFormTab[x].buttonCls : 'menuInactive'
								,id			: ( typeof extraFormTab[x].buttonId != 'undefined' )? extraFormTab[x].buttonId : 'btn'+extraFormTab[x].buttonLabel.replace(/ /g,'_')+''+config.module
								,iconCls	: ( typeof extraFormTab[x].buttonIconCls != 'undefined' )? extraFormTab[x].buttonIconCls : 'list'
								,noActionBtn: ( typeof extraFormTab[x].actionButtons != 'undefined' )? false : true
								,text		: extraFormTab[x].buttonLabel
								,handler	: tabButtonHandler( x )
							});
							
							/** EXTRA TBAR CARD **/
							/** insert extra card for tbar **/
							tbarCardItems.splice( extraFormTab[x].buttonIndex, 0, {
								xtype		: 'container'
								,layout		: 'column'
								,style		: 'margin-top:5px'
								,items		: ( typeof extraFormTab[x].actionButtons != 'undefined' )? ( extraFormTab[x].actionButtons == 'empty'? null : extraFormTab[x].actionButtons )  : null
							});
						}
					}
					
					/** lazy rendering container for save and filter containers **/
					if( tbarCardItems.length > 0 ){
						if( moduleType == 'form' ){
							if( hasComponentSeparator == true ){
								tbarItems.push( '-' );	
							}
						}
						tbarItems.push(
							{	xtype:	'container'
								,id:	'tbarCardPanel'+config.module
								,layout: {
									type: "card"
									,deferredRender: true
								}
								,items:tbarCardItems
							}
						);
					}
					
					/** add custom items **/
					if( typeof me.extraTbar1 != 'undefined' ){
						for( var x in me.extraTbar1 ){
							tbarItems.push( me.extraTbar1[x] );
						}
					}

					tbarItems.push('->');

					/** add custom items before excel button **/
					if( typeof me.extraTbar2 != 'undefined' ){
						for( var x in me.extraTbar1 ){
							tbarItems.push( me.extraTbar2[x] );
						}
					}

					/** EXCEL BUTTON **/
					/** insert excel button **/
					if( !noExcelButton && config.canPrint ){
						tbarItems.push({
							xtype:'button'
							,id:'btnExcel' + config.module
							,iconCls: 'excel'
							,hidden:  ( moduleType == 'form' )? true : false
							,tooltip: 'convert to Excel'
							,handler: function(){
								if( Ext.getCmp( 'mainPanel'+config.module ).getLayout().getActiveItem() == config.module.getForm( true ) ){
									me.formExcelHandler();
								}
								else{
									if( typeof params.customExcelHandler != 'undefined' ){
										params.customExcelHandler();
									}
									else{
										_listExcel({
											grid 		: Ext.getCmp( 'mainListPanel'+config.module ).down( 'grid' )
											,route 		: config.route
											,module 	: config.module
											,pageTitle 	: config.pageTitle
											,customListExcelHandler : ( typeof me.customListExcelHandler != 'undefined' )? me.customListExcelHandler : false
											,listExcelHandler : ( typeof me.listExcelHandler != 'undefined' )? me.listExcelHandler : false
											,hasCustomFilter: ( typeof me.hasCustomFilter != 'undefined' )? me.hasCustomFilter : false
										});

									}
								}
							}
						});
					}

					/** PDF BUTTON **/
					/** insert pdf button **/
					
					if( !noPDFButton && config.canPrint ){
						tbarItems.push({
							xtype:'button'
							,id:'btnPDF' + config.module
							,iconCls: 'pdf-icon'
							,hidden:  ( typeof me.PDFHidden != 'undefined' )? me.PDFHidden : true
							,tooltip: 'convert to PDF'
							,handler: function(){

								if( Ext.getCmp( 'mainPanel'+config.module ).getLayout().getActiveItem() == config.module.getForm( true ) ){
									me.formPDFHandler();
								}
								else{
									_listPDF({
										grid 		: Ext.getCmp( 'mainListPanel'+config.module ).down( 'grid' )
										,route 		: config.route
										,module 	: config.module
										,pageTitle 	: config.pageTitle
										,orientation:( typeof params.orientation != 'undefined' )? params.orientation : 'L'
										,customListPDFHandler : ( typeof me.customListPDFHandler != 'undefined' )? me.customListPDFHandler : false
										,listPDFHandler : ( typeof me.listPDFHandler != 'undefined' )? me.listPDFHandler : false
										,hasCustomFilter: ( typeof me.hasCustomFilter != 'undefined' )? me.hasCustomFilter : false
									});
								}
							}
						});
					}
					
					/** add custom items after help button **/
					if( typeof me.extraTbar3 != 'undefined' ){
						for( var x in me.extraTbar3 ){
							tbarItems.push( me.extraTbar3[x] );
						}
					}
				}
			}
			
			tbar = 	Ext.create('Ext.toolbar.Toolbar',{
				cls:'toolBButton'
				,height:40
				,id:'mainTbar'+config.module
				,items:tbarItems
			});
		
		}
		
		var listeners = ( typeof params.listeners != 'undefined' )? params.listeners : {};
		delete params.listeners;
		
		
		
		
		/** FORM **/
		/** form items **/
		if ( typeof params.formItems  !=  'undefined' ){
			/** normal form panel with fields centered **/
			if( !isTabChild ){
				var parameter = params;
				for( key in config ){
					parameter[key] = config[key];
				}
				mainPanelItems.push( _formPanel( parameter ) );
			}
			/** tab as child **/
			else{
				for( var x in params.formItems ){
					mainPanelItems.push( params.formItems[x] );
				}
			}
		}
		
		
		/** LIST|HISTORY **/
		/** form items **/
		if( typeof params.listItems != 'undefined' ){
			mainPanelItems.push( 
				{	xtype:	'container'
					,id:	'mainListPanel'+config.module
					,items:	params.listItems
					,layout:'fit'
				}
			);
		}
		
		
		if( typeof params.extraFormTab != 'undefined' ){
			for( var x in extraFormTab ){
				mainPanelItems.splice( extraFormTab[x].buttonIndex, 0, extraFormTab[x].items );
			}
		}
		
		
		
		// console.log(listeners);
		// console.log(params.listeners);
		
		// listeners['beforeclose'] = function(){
			// if( Ext.getCmp( 'mainFormPanel' + params.module ) && moduleType == 'form' ){
				// if( Ext.getCmp( 'mainFormPanel' + params.module ).getForm().isDirty() ){
					// alert('verify close');
					// return false;
				// }
			// }
		// }
		
		
		//==============================
		// var afterrender = ( typeof listeners.afterrender != 'undefined' )? listeners.afterrender : null;
		
		// listeners['beforerender'] = function(){
			// console.log('render sa main');
			// var requestNameID = Ext.getCmp('requestNameID'+params.module);
			// requestNameID.lis
			
			// if( afterrender ){
				// afterrender();
			// }
		// }
		//==============================
		
		
		// ,overFlowY:'scroll'
		// ,overFlowX:		'scroll'
		// ,overFlowY:		'scroll'
		// ,autoScroll:	true
		
		/** add module to main tab **/
		mainTab.add(
			{	title: config.pageTitle
				,border:false
				,closable:true
				,id: 'mainPanel'+config.module
				// ,overFlowY:'scroll'
				// ,overFlowX:'scroll'
				,autoScroll: ( typeof params.mainPanelScroll != 'undefined'? false : true )
				// ,autoScroll:	true
				// ,minWidth:500
				// ,minHeight:500
				,config:config
				,moduleType:moduleType
				,tbar: tbar
				,items: mainPanelItems
				,activeItem: 0
				,editFunction: params.editFunction
				,layout: {
					type: "card"
					,deferredRender: true
				}
				,listeners:listeners
			}
		);
		
		mainTab.setActiveTab( 'mainPanel'+config.module );
		Ext.resumeLayouts( true );
		
	}
	
	/* Create form or report panel
		return : Form panel
		parameters[
			
			PROPERTIES __________________
			moduleType		: [string] specify if module is form or report. Default = 'form'
			formItems		: [array of components] items for form or report
			moduleGrids		: [array of components || single grid] grid(s) for under report form
			
			panelID			: [strings] id for form panel. Default = 'mainFormPanel'+module
			statLabelID		: [strings] id for status label. Default = 'FormStatus'+module
			saveBtnID		: [strings] id for save|view button. Default = 'saveButton'+module
			filterID		: [strings] id for hidden field storage for filters. Default = 'reportFilter'+module
			
			FUNCTIONS __________________
			customViewHandler	:  [func] custom function for viewing report.
			beforeViewHandler	:  [func] custom function that triggers before hitting view button
			afterViewHandler	:  [func] custom function that triggers after hitting view button
			customResetHandler	:  [func] custom function for reseting report form.
			beforeResetHandler	:  [func] custom function that triggers before hitting reset button
			afterResetHandler	:  [func] custom function that triggers after hitting reset button
			
			
		]
	*/
	
	function _formPanel( params ){
		var moduleType   = ( typeof params.moduleType != 'undefined' )? params.moduleType : 'form';
		var panelID      = ( typeof params.id != 'undefined' )? params.id : 'mainFormPanel'+params.module;
		var noHeader     = ( typeof params.noHeader != 'undefined' )? params.noHeader : false;
		var statLabelID;
		var moduleItems = [];
		
		
		/** for form module type **/
		if( moduleType == 'form' ){
			var isCenter  = ( typeof params.isCenter != 'undefined' )? params.isCenter : Ext.getConstant( 'FORM_ISCENTER' );
			statLabelID   = ( typeof params.statLabelID != 'undefined' )? params.statLabelID : 'FormStatus'+params.module;
			
			/** add label for form validity **/
			if( !noHeader ){
				params.formItems.unshift(
					{	html : '<div id="'+statLabelID+'" style="color:red;">Fields with * are required. </div>'
						,border:false
						,style:'margin-top:3px; margin-bottom:20px;'
						,width:200
						,isFormStatusLabel:true
					}
				);
			}
			
			if( isCenter ){
				moduleItems = [
					{
						xtype : 'panel'
						,minWidth:100
						,border: ( typeof params.border != 'undefined' )? params.border : Ext.getConstant( 'FORM_HASBORDER' )
						,style:  ( typeof params.border != 'undefined' )? 'margin: 0 auto;' : 'margin-bottom:10px'
						,layout: {
							type: 'hbox'
							,align: 'center'
							,pack: 'center'
						}
						,items:[
							{
								xtype:	'container'
								,items:	params.formItems
							}
						]
					}
				];
			}
			else{
				moduleItems = params.formItems;
			}
		}
		/** for report module type **/
		else if( moduleType == 'report' ){
			/** change default value for vertical @ other projects **/
			var vertical      = ( typeof params.vertical != 'undefined' )? params.vertical : Ext.getConstant( 'REPORTBTN_ISVERTICAL' );
			var viewButtonID  = ( typeof params.viewButtonID != 'undefined' )? params.viewButtonID : 'viewButton' + params.module;
			
			var viewContainer = {	xtype:	'container'
									,layout:'column'
									,style: ( vertical? 'margin-left:5px' : null )
									,items:[
										/** view button for report modules **/
										{
											xtype:		'button'
											,text: 		'View'
											,id:		viewButtonID
											,iconCls:	'glyphicon glyphicon-search'
											,style: 	'margin-bottom:5px'
											,width:		75
											// ,disabled:	true
											,handler:	function(){
												/** custom view handler **/
												if( typeof params.customViewHandler != 'undefined' ){
													params.customViewHandler();
												}
												else{
													if( typeof params.beforeViewHandler != 'undefined' ){
														if( params.beforeViewHandler() ){
															return false;
														}
													}
													
													var form 		= Ext.getCmp( panelID ).getForm();
													var fields 		= form.getFields();
													var grids 		= Ext.ComponentQuery.query( '#'+panelID+' grid' );
													var extraparams = {};
													
													/** collect and contain fields' value to a single array  **/
													fields.each( function( field ) {
														if( field.getValue() != null && ( field.getValue().toString() != field.getRawValue().toString() ) ){
															extraparams['raw'+field.getName().toString().replace( params.module, '' )] = field.getRawValue();
														}
														extraparams[ field.getName().toString().replace( params.module, '' ) ] = field.getValue();
													});
													extraparams['module'] = params.module;
													
													/** store array to the form as property **/
													form.used = extraparams;
													
													for( var x=0; x<grids.length; x++ ){
														var store = grids[x].getStore();
														extraparams['grid']	= x+1;
														store.getProxy().extraParams = extraparams;
														store.currentPage = 1;
														
														if( x == grids.length - 1 ){
															store.load({
																callback: function( response, operation ){
																	if( typeof params.afterViewHandler != 'undefined' ){
																		params.afterViewHandler();
																	}
																}
															});
														}
														else{
															store.load();
														}
													}
												}
											}
										}
										/** reset button for report modules **/
										,{
											xtype:		'button'
											,text: 		'Reset'
											,iconCls:	'glyphicon glyphicon-refresh'
											,style:		'margin-left:5px; margin-bottom:5px'
											,width:		75
											,handler:	function(){
												/** custom view handler **/
												if( typeof params.customResetHandler != 'undefined' ){
													params.customResetHandler();
												}
												else{
													if( typeof params.beforeResetHandler != 'undefined' ){
														params.beforeResetHandler();
													}
													var form = Ext.getCmp( panelID ).getForm();
													
													form.reset();
													form.used = false;
													
													if( Ext.getCmp( 'barangayID' + params.module ) ) Ext.getCmp( 'barangayID' + params.module ).setReadOnly( true );
													
													var grids = Ext.ComponentQuery.query( '#'+panelID+' grid' );
													for( var x=0; x<grids.length; x++ ){
														grids[x].store.removeAll();
														grids[x].store.getProxy().extraParams = {};
														grids[x].store.currentPage = 1;
													}
													
													if( typeof params.afterResetHandler != 'undefined' ){
														params.afterResetHandler();
													}
												}
											}
										}
									]
								};
			
			if( vertical ){
				params.formItems = {	
					xtype:'container'
					,layout: {
						type: 'hbox',
						align: 'stretch'
					}
					,items:[
						{
							xtype:'container'
							,items:params.formItems
						}
						,{
							xtype:'container'
							,layout: 'vbox'
							,items: [
								{
									xtype: 'container'
									,flex:1
									,items:[
										{
											xtype:'label'
											,hidden:true
										}
									]
								}
								,viewContainer
							]
						}
					]
				};
				
				moduleItems = [params.formItems];
			}
			else{
				params.formItems.push( viewContainer );
				moduleItems = params.formItems;
			}
		}
		
		var gridChildren = new Array();
		if( typeof params.moduleGrids != 'undefined' ){
			var moduleGrids_allowNonGrids = ( typeof params.moduleGrids_allowNonGrids != 'undefined' )? params.moduleGrids_allowNonGrids : false;
			
			if( params.moduleGrids instanceof Array ){
				for( var x in params.moduleGrids ){
					moduleItems.push( params.moduleGrids[x] );
					if( !moduleGrids_allowNonGrids ){
						if( params.moduleGrids[x].requiredFields.length > 0 ){
							gridChildren.push( params.moduleGrids[x].id );
						}
					}
				}
			}
			else{
				moduleItems.push( params.moduleGrids );
				if( !moduleGrids_allowNonGrids ){
					if( params.moduleGrids.requiredFields.length > 0 ){
						gridChildren.push( params.moduleGrids.id );
					}
				}
			}
		}
		else if( typeof params.moduleResultDisplay != 'undefined' ){
			for( var x in params.moduleResultDisplay ){
				params.formItems.push( params.moduleResultDisplay[x] );
			}
		}
		
		return {
			xtype:			'form'
			,overFlowX:		'scroll'
			,overFlowY:		'scroll'
			,autoScroll:	( typeof params.mainPanelScroll != 'undefined'? true : false )
			,baseCls:		'x-plain'
			,id: 			panelID
			,items:			moduleItems
			,bodyPadding: 	'10px'
			,noHeader:		noHeader
			,statLabelID:	statLabelID
			,minWidth:		( typeof params.minWidth != 'undefined' )? params.minWidth : 800
			,minHeight:		( typeof params.minHeight != 'undefined' )? params.minHeight : ( ( typeof params.formWidthAuto != 'undefined' )? null : 500 )
			,route: 		params.route
			,gridChildren:	gridChildren
			,module:		params.module
			,autoGridPush:	params.autoGridPush
			,includedFormOnSubmit: params.includedFormOnSubmit
			,overrideParams : Ext.ifUndefined( params.overrideParams, true )
			,viewButtonID:	( moduleType == 'report' )? viewButtonID : 'undefined'
			,autoSetCombo: ( typeof params.autoSetCombo != 'undefined' )? params.autoSetCombo : true
			,showEditUsedMsg: ( typeof params.showEditUsedMsg != 'undefined' )? params.showEditUsedMsg : true
			,useStandardAttachmentSaving: ( typeof params.useStandardAttachmentSaving != 'undefined' )? params.useStandardAttachmentSaving : true
			,listeners:{
				fieldvaliditychange: function(){
					if( typeof params.listeners != 'undefined' && typeof params.listeners.fieldvaliditychange != 'undefined' ){
						params.listeners.fieldvaliditychange( this );
					}
					else{
						/** prevents showing global error when form first loads **/
						if ( this.hasBeenDirty || this.getForm().isDirty() ) {
							
							var btnID  = ( moduleType == 'form' )? 'saveButton'+params.module : '';//viewButtonID;
							var fields = this.getForm().getFields();
							var valid  = true;
							
							/** check invalid fields by looping **/
							fields.each( function( field ) {
								if( typeof field.unBoundFromForm == 'undefined' ){
									var errors = (field.xtype == 'numberfield' ? field.getErrors(field.getRawValue()) : field.getErrors());
									Ext.Array.forEach( errors, function( error ) {
										/** tag valid as false whenever error exists **/
										valid = false;
										/** break the loop. break cannot be applied for foreach, use return instead **/
										return false;
									} );
								}
							} );
							
							/** if fields are valid then check validity for grid's required fields otherwise proceed **/
							if( valid ){
								/** check for empty grid required fields **/
								grids : for( var x in id = this.gridChildren ){
									var grid  = Ext.getCmp( id[x] );
									var store = grid.getStore();
									/** loop each grid **/
									for( var y=0; y<store.getCount(); y++ ){
										for( var z in field = grid.requiredFields ){
											var data = store.getAt(y).get( field[z] );
											/** check each row if data is empty or null **/
											if(data == null || data.toString() == '' || parseFloat( data, 10) == 0){
												valid = false;
												break grids;
											}
										}
									}
								}
							}
							
							
							/** for form module type **/
							if( moduleType == 'form' && !this.noHeader ){
								/** show status label for valid forms otherwise, show invalid **/
								document.getElementById( statLabelID ).innerHTML = Ext.getConstant( !valid? 'FORM_INVALID' : 'FORM_VALID' );
							}
							
							
							/** disable button if form is not valid **/
							if( Ext.getCmp( btnID ) ){
								Ext.getCmp( btnID ).setDisabled( !valid );
							}
							
							this.hasBeenDirty = true;
							// Ext.resumeLayouts( true );
						}
					}
				}
				,afterrender: function(){
					if( typeof params.listeners != 'undefined' && typeof params.listeners.afterrender != 'undefined' ){
						params.listeners.afterrender( this );
					}
				}
			}
		};
	}
	
	/* Function for switching tab (form to list. vice versa)
		return : N/A
		parameters[
			
			PROPERTIES __________________
			mode	: [int] flag for form(0) and list/history(1). No defaults
			
		]
	*/
	
	function _changeCls( params ){
		if( params.scope.cls == 'menuActive' ){
			return false;
		}
		
		var main = Ext.getCmp( 'mainPanel' + params.module );
		var tbar = params.scope.up('toolbar').items.items;
		
		Ext.suspendLayouts();
		for( var x=0; x<main.items.items.length; x++ ){
			if( params.scope.id == tbar[x].id ){
				var noActionBtn = ( typeof params.scope.noActionBtn != 'undefined' )? params.scope.noActionBtn : false;
				
				tbar[x].removeCls( 'menuInactive' );
				tbar[x].addCls( 'menuActive' );
				tbar[x].cls = 'menuActive';
				
				main.getLayout().setActiveItem( x );
				if( params.module != "_accountcard" ){
					Ext.getCmp('tbarCardPanel'+params.module).getLayout().setActiveItem( ( noActionBtn ? 0 : x ) );
				}
				else{
					Ext.getCmp('saveButton'+params.module).setVisible(false)
					Ext.getCmp('resetButton'+params.module).setVisible(false)
				}
			}
			else{
				if( tbar[x].cls == 'menuActive' ){
					tbar[x].removeCls( 'menuActive' );
					tbar[x].addCls( 'menuInactive' );
					tbar[x].cls = 'menuInactive';
				}
			}
		}
		Ext.resumeLayouts( true );
		
		return true;
	}
	
	/* Function for switching from list/history to form
		return : N/A
		parameters[
			
			PROPERTIES __________________
			mode	: [int] flag for form(0) and list/history(1). No defaults
			
		]
		import functions[
			
			_changeCls()
		]
	*/
	
	function _goToForm( params ){
		/** check then change button's cls and main panel's active tab **/
		if( _changeCls({
				scope : ( typeof params.scope != 'undefined' )? params.scope : params.module.getButton( 'form' )
				,module : params.module
			}) 
		){
			var formID  = ( typeof params.otherFormID != 'undefined' )? params.otherFormID : 'mainFormPanel' + params.module;
			var form 	= Ext.getCmp( formID ).getForm();
			var main 	= Ext.getCmp( 'mainPanel' + params.module );
			var visible	= false;
			
			if( !form.used ){ 
				visible = ( form.onEdit )? main.config.canEdit : main.config.canSave;
			}
			
			if( saveButton = params.module.getButton( 'save' ) ){
				saveButton.setVisible( visible );
			}
			if( btnExcel = params.module.getButton( 'excel' ) ){
				btnExcel.setVisible( ( form.onEdit && main.config.canPrint && params.hasFormExcel ) );
			}
			if( btnPDF = params.module.getButton( 'pdf' ) ){
				btnPDF.setVisible( ( form.onEdit && main.config.canPrint && params.hasFormPDF ) );
			}
			
		}
	}
	
	/* Create search field
		return : container
		parameters[
			
			PROPERTIES __________________
			idmodule		: [int] if defined, creates a sub search filter that display options as for reference names.
			displayField	: [string] display field for search combo box. no defaults
			emptyText		: [string] empty text for search filter. Default = 'Search reference number...'
			refEmptyText	: [string] empty text for sub search filter. Default = ''
			cls				: [string] class for reset button. Default = 'refreshSearch'
			store			: [store] class for reset button. Default = module list/history grid's store
			
		]
	*/
	
	function _createComboSearch( params ){
		var items 		= new Array();
		var hasSubFilter= ( typeof params.subFilters != 'undefined' )? true : false;
		var customQuery = ( typeof params.customQuery != 'undefined' )? params.customQuery : false;
		var numberFilter= ( typeof params.numberFilter != 'undefined' )? params.numberFilter : 1;
		var module		= params.config.module;
		
		
		var storeArray = new Array( numberFilter );
		
		
		for( var x=0; x<numberFilter; x++ ){
			
			/** store for main filter field **/
			storeArray[x] = _createRemoteStore({
								fields:[ 
									params.displayField
								]
								,url:standardRoute+'searchCombo'
							});
			
			if( customQuery ){
				var route = params.config.route.replace( baseurl, '' );
				storeArray[x].proxy.extraParams.customQuery = route.substring( 0, route.length-1 );
			}
			
			// storeArray[x].proxy.extraParams.params = Ext.encode( params );
			if( hasSubFilter ){
				storeArray[x].proxy.extraParams.subFilter = x+1;
			
				var subStore = 	_createLocalStore( {data:params.subFilters} );
				items.push(
					_createCombo({
						fieldLabel:		( x == 0 )? 'Search by' : ''
						,id:			'filter_by'+x+''+module
						,value:			x + 1
						,width:			200
						,cls: 'historySearch'
						,labelWidth:	( x == 0 )? 70 : 0
						,style:			'margin-right:5px; '+( x == 0? '' : 'margin-left:5px;' )
						,store:			subStore
						,editable:		false
						,listeners:{
							change : function( me ){
								if( this.getValue() ){
									var X = me.id.replace( 'filter_by', '' );
									X = X.replace( module, '' );
									
									var field = Ext.getCmp( 'filter_refnum'+X+''+module );
									storeArray[X].proxy.extraParams.subFilter = this.getValue();
									field.reset();
									field.emptyText = 'Search '+this.getRawValue().toLowerCase()+'...';
									field.applyEmptyText();
								}
							}
							,beforeselect : function( me, meData, toBeSelected ){
								if( numberFilter > 1 ){
									var X = me.id.replace( 'filter_by', '' );
									X = X.replace( module, '' );
									var notX = ( X == 1 )? 0 : 1;
									
									if( Ext.getCmp( 'filter_by'+notX+''+module ).getValue() - 1 == toBeSelected  ){
										return false;
									}
								}
							}
						}
					})
				);
			}
			
			/** add filter field **/
			items.push(
				_createCombo({
					fieldLabel:		( hasSubFilter )? '' : 'Search'
					,store:			storeArray[x]
					,id:			'filter_refnum'+x+''+module
					,displayField: 	params.displayField
					,valueField:	params.displayField
					,value:			0
					,width:			250
					,labelWidth:	( hasSubFilter )? 0 : 40
					,emptyText:		( typeof params.emptyText != 'undefined' )? params.emptyText : 'Search '+( hasSubFilter ? params.subFilters[x].toLowerCase() : 'here' )+'...'
					,hideTrigger:	true
					,listeners:{
						select : function( me ){
							var store;
							var X = me.id.replace( 'filter_refnum', '' );
							X = X.replace( module, '' );
							
							if( typeof params.grid_id != 'undefined' ){
								store = Ext.getCmp( params.grid_id ).store;
							}
							else{
								store = Ext.getCmp( 'mainListPanel'+module ).down( 'grid' ).store;
							}
							
							for( var y=0; y<numberFilter; y++ ){
								if( val = Ext.getCmp( 'filter_refnum' + y + module ).getValue() ){
									store.proxy.extraParams['query'+y] = val;
									if( hasSubFilter ){
										store.proxy.extraParams['subFilter'+y] = Ext.getCmp( 'filter_by'+y+''+module ).getValue();
									}
								}
							}
							store.currentPage = 1;
							store.load();
						}
					}
				})
			);
		}
		
		/** add reset button for filter field**/
		items.push(
			{	xtype: 'button'
				,iconCls:'glyphicon glyphicon-refresh'
				,cls: ( typeof params.cls != 'undefined' )? params.cls : 'refreshSearch'
				,border: false
				,style:'margin-top:4px; margin-left:2px'
				,handler: function(){
					var store;
					if( typeof params.grid_id != 'undefined' ){
						store = Ext.getCmp( params.grid_id ).store;
					}
					else{
						store = Ext.getCmp( 'mainListPanel'+module ).down( 'grid' ).store;
					}
					
					/** sets store page to 1 **/
					store.proxy.extraParams = {};
					store.proxy.extraParams.subFilter = 1;
					store.currentPage = 1;
					store.load();
					
					for( var x=0; x<numberFilter; x++ ){
						var field = Ext.getCmp( 'filter_refnum'+x+''+module );
						field.reset();
						
						if( hasSubFilter ){
							var subfilter = Ext.getCmp( 'filter_by'+x+''+module );
							subfilter.reset();
							
							field.emptyText = 'Search '+subfilter.getRawValue().toLowerCase()+'...';
							field.applyEmptyText();
						}
					}
				}
			}
		);
		
		return {
			xtype	: 'container'
			,layout	: 'hbox'
			,style	: 'margin-left:5px'
			,id		: 'searchFilterContainer' + module
			,items	: items
		}
	}
	
	/* Create grid
		return : grid panel
		parameters[
			
			PROPERTIES __________________
			store			: [store] grid's store.
			grouping		: [object] group data by categories.
			features		: [object] usually used when grid requires total field as summary. Default = null
			tbar			: [object || string] grid toolbar config. Set tbar as 'empty' for empty toolbar
			content			: [object || string] (under tbar) if array, set of components for grid's toolbar items. simply set 'add' for setting-type-grid otherwise 'list' to list/history-type-grid
			label			: [string] (under tbar) string label before add button
			noDeleteColumn	: [bool] (under tbar) does not generate delete column for the grid if set true. only applicable for 'add'-type grid. Default = false
			noUndoButton	: [bool] (under tbar) does not generate undo button if set true. only applicable for 'add'-type grid. Default = false
			labelSeparator	: [bool] (under tbar) visibly displays a separator between label and add button. Default = true
			addLabel		: [string] (under tbar) label for add button
			extraTbar1		: [array of components] (under tbar) extra components rendered before add button
			extraTbar2		: [array of components] (under tbar) extra components rendered after add/reset button
			extraTbar3		: [array of components] (under tbar) extra components rendered before excel button
			extraTbar4		: [array of components] (under tbar) extra components rendered after pdf button
			canPrint		: [bool] (under tbar) determines access for printing
			noExcel			: [bool] (under tbar) determines visibility for the excel button
			noPDF			: [bool] (under tbar) determines visibility for the pdf button
			tbarHeight		: [int] (under tbar) top toolbar's height. Default = 33
			bbarHeight		: [int] bottom toolbar's height. Default = 33
			hasTotal		: [bool] (under grid column) automatically adds field for total. Default = false
			allowBlank		: [bool] (under grid column) needed for form validation. Default = true
			editor			: [object || string] (under grid column) column's editor. values for non-object : text, float, number
			bbarTotalLabel	: [string] bbar total label. Default = 'Total'
			
			FUNCTIONS __________________
			customAddHandler: [func] (under tbar) custom function for adding new record
			beforeAddHandler: [func] (under tbar) custom function that triggers before adding new record
			afterAddHandler : [func] (under tbar) custom function that triggers after adding new record
			deleteRowFunc   : [func] (under tbar) custom function for default delete column. only applicable for 'add'-type grid
			PDFHandler		: [func] (under tbar) custom function for printing pdf
			excelHandler	: [func] (under tbar) custom function for printing excel
			
		]
		import functions[
			
			_createComboSearch()
		]
	*/
	
	function _gridPanel( params ){
		function __gridAddItem( _params ){
			return {
				xtype	: 'button'
				,text	: _params.addLabel
				,id		: 'addButton_'+_params.id
				,iconCls: 'glyphicon glyphicon-plus'
				,cls	: 'toolBarItems'
				,border	: false
				,style	: 'margin-left:5px;'
				,handler: function(){
					/** executes custom handler function **/
					if( typeof _params.customAddHandler != 'undefined' ){
						_params.customAddHandler();
					}
					else{
						/** executes extra handler before inserting new row **/
						if( typeof _params.beforeAddHandler != 'undefined' ){
							_params.beforeAddHandler();
						}
						
						/** inserts new row **/
						var _grid = Ext.getCmp( _params.id );
						_grid.store.insert( _grid.store.getCount(), { selected : 0 } );
						_grid.getPlugin().startEdit( _grid.store.getCount(), ( _params.editColumn )? _params.editColumn : 0 );
						if( form = _grid.up( 'form' ) ){
							form.fireEvent( 'fieldvaliditychange' );
						}
						
						/** executes extra handler after inserting new row **/
						if( typeof _params.afterAddHandler != 'undefined' ){
							_params.afterAddHandler();
						}
					}
				}
			};
			
		}
		
		function _summaryRenderer( id ) {
			return function( value ){ 
				Ext.getCmp( id ).setValue( Ext.util.Format.number( value, '0,000.00' ) );
			};
		}
		
		function _currencyRenderer( isDecimal ){
			return function( value ){ 
				return currSym + ' ' + Ext.util.Format.number( parseFloat( value, 10 ) , ( isDecimal? '0,000.00' : '0,000' ) );
			}
		}
		
		function _timeRenderer(){
			return function( value ){ 
				if( value ){
					try{
						var hour24 = parseInt( value.getHours(), 10 );
						var hour12 = ( hour24 > 12 )? hour24 - 12 : hour24;
						var APM	   = ( hour24 >= 12 )? 'PM' : 'AM';
						var hour   = ( hour12 < 10 )? ( hour12 == 0? 12 : '0'+hour12 ) : hour12;
						var mins   = ( parseInt( value.getMinutes(), 10 ) < 10 )? '0'+value.getMinutes() : value.getMinutes();
						return hour + ':' + mins + ' ' + APM;
					}catch( err ){
						return value;
					}
				}
				else{
					return '';
				}
			}
		}
		
		var features 		= null;
		var dockedItems 	= null;
		var tbar 			= null;
		var bbar 			= null;
		var store 			= params.store;
		var toolbarHeight 	= 35;
		var noDefaultRow    = ( typeof params.noDefaultRow != 'undefined' )? params.noDefaultRow : false;
		
		/** grid features **/
		if( typeof params.grouping != 'undefined' ){
			features = params.grouping;
		}
		else if( typeof params.features != 'undefined' ){
			features = 	params.features;
		}
		
		/** provide top toolbar if tbar is defined **/
	
		if( typeof params.tbar != 'undefined' ){
			var me 			= params.tbar;
			var tbarItems 	= new Array();
			var canPrint 	= ( typeof me.canPrint != 'undefined' )? me.canPrint : false;
			var noPDF 		= ( typeof me.noPDF != 'undefined' )? me.noPDF : false;
			var noExcel 	= ( typeof me.noExcel != 'undefined' )? me.noExcel : false;
			
			if( typeof params.tbar == 'string' ){
				if( me.toString().toLowerCase() === 'empty' ){
					tbarItems = null;
				}
			}
			else{
				/** if params.tbar.content is an array **/
				if( me.content instanceof Array ){
					tbarItems = me.content;
				}
				else{
					/** add label to toolbar **/
					if( typeof me.label != 'undefined' ){
						var labelSeparator = ( typeof me.labelSeparator != 'undefined' )? me.labelSeparator : true;
						
						tbarItems.push({	
							xtype: 'label'
							,id: ( typeof me.labelID != 'undefined'? me.labelID : 'lblTBar' + params.module )
							,style:'margin-left:5px;margin-right:10px;'
							,text: me.label
						});
						
						/** add label separator after the label **/
						if( labelSeparator ){
							tbarItems.push( '-' );
						}
					}
					
					/** add custom items after tbar label **/
					if( typeof me.extraTbar1 != 'undefined' ){
						for( var x in me.extraTbar1 ){
							tbarItems.push( me.extraTbar1[x] );
						}
					}

					/** add add button **/
					if( typeof me.content != 'undefined' ){
						if( me.content.toString().toLowerCase() === 'add' ){
							var noDeleteColumn = ( typeof me.noDeleteColumn != 'undefined' )? me.noDeleteColumn : false;
							var noUndoButton   = ( typeof me.noUndoButton != 'undefined' )? me.noUndoButton : true;
							var undoStore;
							
							tbarItems.push(
								__gridAddItem({
									addLabel:( typeof me.addLabel != 'undefined' ? me.addLabel : 'Add' )
									,editColumn:me.editColumn
									,customAddHandler:me.customAddHandler
									,beforeAddHandler:me.beforeAddHandler
									,afterAddHandler:me.afterAddHandler
									,module: params.module
									,id : params.id
								})
							);
							
							/** automatically adds undo button **/
							if( !noUndoButton ){
								var model  		= store.getProxy().getModel().modelName;
								var fields 		= Ext.ModelMgr.types[model].prototype.fields;
								fields.add({	
									name	: 'numberRow'
									,type	: 'number'
								});
								
								/** temporary storage for deleted rows **/
								undoStore = _createRemoteStore({
									fields		: fields.items
									,url		: 'undoStore_'+params.id
								});
								
								tbarItems.push({
									xtype	: 'button'
									,text	: 'Restore Deleted Items'
									,style	: 'margin-left:5px;'
									,cls	: 'toolBarItems'
									,border	: false
									,id		: 'undoButton_'+params.id
									,disabled: true
									,handler: function(){
										if( undoStore.getCount() > 0 ){
											var index  = undoStore.getCount()-1;
											var latest = undoStore.getAt( index ).data;
											var data   = store.getAt( latest.numberRow );
											var valid  = false;
											
											if( data ){
												/** check if row contains valid data **/
												for( var key in data.data ){
													if(key != 'selected'){
														if( data.data[key] != null && data.data[key].toString() != '' && parseFloat( data.data[key], 10) != 0 ){
															valid = true;
															break;
														}
													}
												}
											}
											
											if( !valid ){
												store.removeAt( latest.numberRow );
											}
											
											store.insert( latest.numberRow, latest );
											undoStore.removeAt( index );
											
											this.setDisabled( ( undoStore.getCount() > 0? false : true ) );
										}
									}
								});
							}
							
							/** automatically adds delete column **/
							if( !noDeleteColumn ){
								
								params.columns.push(
									_createActionColumn({
										icon	: 'remove',
										tooltip	: 'Remove record',
										Func	: ( typeof me.deleteRowFunc != 'undefined' )?
											me.deleteRowFunc : 
											function( data, row ){
												
												var valid = false;
												
												/** check if row contains valid data **/
												for( var key in data){
													if(key != 'selected'){
														if( data[key] != null && data[key].toString() != '' && parseFloat( data[key], 10) != 0 ){
															valid = true;
															break;
														}
													}
												}
												
												/** store to temp storage if row contains valid data **/
												if( !noUndoButton && valid ){
													data['numberRow'] = row;
													undoStore.add( data );
													Ext.getCmp( 'undoButton_'+params.id ).setDisabled( undoStore.getCount() > 0? false : true );
												}
												
												/** remove row if and only if row contains valid data **/
												if( store.getCount() == 1 ){
													if( valid ){
														store.removeAt( row );
														
															
														if( store.getCount() == 0 ){
															store.add({});
														}
													}
													else{
														if( noDefaultRow ){
															store.removeAt( row );
														}
													}
												}
												else{
													store.removeAt( row );
												}
												
												if( typeof me.extraDeleteFunc != 'undefined' ){
													var extraDelFunc = eval( me.extraDeleteFunc );
													extraDelFunc();
												}
												
											}
									})
								);
							}
						}
						else if( me.content.toString().toLowerCase() === 'list' ){
							me.filter.grid_id = params.id;
							me.filter.module  = params.module;
							tbarItems.push( _createComboSearch( me.filter )	);
						}
					}
					
					/** add custom items after add button or combo field **/
					if( typeof me.extraTbar2 != 'undefined' ){
						for( var x in me.extraTbar2 ){
							tbarItems.push( me.extraTbar2[x] );
						}
					}
					
					tbarItems.push( '->' );
					
					/** add custom items before export buttons **/
					if( typeof me.extraTbar3 != 'undefined' ){
						for( var x in me.extraTbar3 ){
							tbarItems.push( me.extraTbar3[x] );
						}
					}
					
					/** add pdf and excel buttons **/
					
					if( canPrint ){
						if( !noExcel ){
							tbarItems.push( 
								{	xtype:		'button'
									,iconCls:	'excel'
									,handler:	function(){
										_listExcel({
											grid 		: Ext.getCmp( params.id )
											,module 	: params.module
											,route 		: me.route
											,pageTitle 	: me.pageTitle
											,customListExcelHandler : ( typeof me.customListExcelHandler != 'undefined' )? me.customListExcelHandler : false
											,listExcelHandler : ( typeof me.listExcelHandler != 'undefined' )? me.listExcelHandler : false
										});
									}
								}
							);
						}
						
						if( !noPDF ){
							tbarItems.push( 
								{	xtype:		'button'
									,iconCls:	'pdf-icon'
									,handler:	function(){
										_listPDF({
											grid 		: Ext.getCmp( params.id )
											,module 	: params.module
											,route 		: me.route
											,pageTitle 	: me.pageTitle
											,orientation:( typeof me.orientation != 'undefined' )? me.orientation : 'P'
											,customListPDFHandler : ( typeof me.customListPDFHandler != 'undefined' )? me.customListPDFHandler : false
											,listPDFHandler : ( typeof me.listPDFHandler != 'undefined' )? me.listPDFHandler : false
										});
									}
								}
							);
						}
					}
					
					/** add custom items after export buttons **/
					if( typeof me.extraTbar4 != 'undefined' ){
						for( var x in me.extraTbar4 ){
							tbarItems.push( me.extraTbar4[x] );
						}
					}
				}
			}
			
			/** create toolbar component **/
			tbar = 	Ext.create('Ext.toolbar.Toolbar',{
				height:( typeof me.tbarHeight != 'undefined'? me.tbarHeight : toolbarHeight )
				,items:tbarItems
			});
		}
		
		/** provide top toolbar if bbar is defined **/
		if( typeof params.bbar != 'undefined' ){
			bbar = Ext.create('Ext.toolbar.Toolbar',{
				height:( typeof params.bbarHeight != 'undefined'? params.bbarHeight : toolbarHeight )
				,items:( params.bbar.toString() === 'empty' )? null : params.bbar
			});
		}
		
		/** grid's plugin editor **/
		var plugins 		= null;
		var condition		= '';
		var conditionConnect= false;
		var requiredFields  = new Array();
		if( typeof params.plugins != 'undefined' ){
			var bbarItems	= new Array();
			
			if( typeof params.plugins == 'boolean'){
				if( params.plugins ){
					plugins = _cellEdit({});
				}
			}
			else{
				plugins = params.plugins;
			}
			
			for( var x in column = params.columns ){
				/** column editor and format **/
				if( typeof column[x].editor == 'string' ){
					var editor = column[x].editor;
					if( editor.toString() == 'float' || editor.toString() == 'number' || editor.toString() == 'text' ){
						
						if( editor.toString() != 'text' ){
							column[x].align = 'right';
							column[x].xtype = 'numbercolumn';
							column[x].format= ( editor.toString() == 'number' )? '0,000' : '0,000.00';
							
							/** for columns with currency  **/
							if( typeof column[x].hasCurrency != 'undefined' ){
								if( column[x].hasCurrency ){
									column[x].renderer = _currencyRenderer( editor == 'float' );
								}
							}
						}
						
						column[x].editor = _createTextField({
							isNumber		: ( editor.toString() == 'text' )? false : true
							,isDecimal		: ( editor.toString() == 'number' )? false : true
							,submitValue	: false
							,fieldLabel		: ''
						});
					}
					else if( editor.toString() == 'date' || editor.toString() == 'justNowAndForever' || editor.toString() == 'everSinceTheWorldBegun' ){
						column[x].editor = _createDateField({
							submitValue		: false
							,fieldLabel		: ''
							,minValue		: ( editor.toString() == 'justNowAndForever' )? new Date() : null
							,maxValue		: ( editor.toString() == 'everSinceTheWorldBegun' )? new Date() : null
						});
						
						column[x].xtype  	= 'datecolumn';
						column[x].format 	= Ext.getConstant( 'DATE_FORMAT' );
						column[x].align 	= 'right';
					}
					else if( editor.toString() == 'time' ){
						column[x].editor = _createTimeField({
							submitValue		: false
							,fieldLabel		: ''
						});
						
						column[x].renderer = _timeRenderer();
						// column[x].xtype  	= 'datecolumn';
						// column[x].format 	= 'h:i A';
					}
				}
				
				/** check has total columns **/
				if( !bbar ){
					if( typeof column[x].hasTotal != 'undefined' ){
						if( column[x].hasTotal ){
							
							var totalID = 'total_'+column[x].dataIndex+'_'+params.id;
							
							column[x].align = 'right';
							column[x].xtype = 'numbercolumn';
							column[x].format = '0,000.00';
							column[x].summaryType = 'sum';
							column[x].summaryRenderer = _summaryRenderer( totalID )
							
							bbarItems.push(
								_createTextField({
									width:column[x].width - 10
									,isNumber:true
									,readOnly:true
									,id:totalID
									,submitValue:false
								})
							);
						}
					}
				}
				
				/** set required fields. for non-list/history grids only **/
				if( typeof column[x].allowBlank != 'undefined' ){
					if( !column[x].allowBlank ){
						requiredFields.push( column[x].dataIndex );
						/** set condition as property **/
						if( column[x].xtype == 'numbercolumn' ){
							condition += ( conditionConnect? " && " : "" )+"parseFloat( dataStore['"+column[x].dataIndex+"'], 10 ) != 0 ";
						}
						else{
							condition += ( conditionConnect? " && " : "" )+"dataStore['"+column[x].dataIndex+"'].toString() != '' ";
						}
						if( !conditionConnect ){
							conditionConnect = true;
						}
					}
				}
			}
			
			/** insert has-total-fields to toolbar **/
			if( !bbar && bbarItems.length > 0 ){
				var marginRightBBar = 0;
				
				bbarItems.unshift('->',{
					xtype:	'label'
					,text:	( typeof params.bbarTotalLabel != 'undefined' )? params.bbarTotalLabel : 'Total : '
				});
				
				/** calculate with of all action column **/
				for( var x = params.columns.length-1; x>=0; x-- ){
					if( params.columns[x].xtype.toString() == 'gridcolumn' ){
						marginRightBBar += parseInt( params.columns[x].width, 10 );
					}
					else{
						break;
					}
				}
				
				/** push a component that serves as a margin to the right. width value depends on the above calculation **/
				bbarItems.push({
					xtype:	'box'
					,width: marginRightBBar
				});
				
				bbar = Ext.create('Ext.toolbar.Toolbar',{
					height:( typeof params.bbarHeight != 'undefined'? params.bbarHeight : toolbarHeight )
					,items:bbarItems
				});
			}
		}
		else{
			for( var x in column = params.columns ){
				if( typeof column[x].hasCurrency != 'undefined' ){
					if( column[x].hasCurrency ){
						column[x].align = 'right';
						column[x].xtype = 'numbercolumn';
						column[x].format = '0,000.00';
						column[x].renderer = _currencyRenderer( true );
					}
				}
			}
		}
		
		/** automatically insert paging toolbar if bbar is null **/
		if( !bbar ){
			var noPage = ( typeof params.noPage != 'undefined' )? params.noPage : false;
			if( !noPage ){
				dockedItems = Ext.create( 'define_pagingTbar', {
					store	: store
					,id		: 'pagingToolBar_'+params.id
					,hasNumRows : params.hasNumRows
				});
			}
			// else{
				
			// 	dockedItems = Ext.create( 'define_pagingTbar', {
			// 		store	: store
			// 		,id		: 'pagingToolBar_'+params.id
			// 		,hasNumRows : params.hasNumRows
			// 	});

			// }
		}
		
		var defaults = ( typeof params.defaults != 'undefined' )? params.defaults : {};
		defaults['menuDisabled'] = true;
		defaults['sortable']     = ( typeof params.sortable != 'undefined' )? params.sortable : true;
		
		/** store has default single row **/
		if( !noDefaultRow ){
			store.add({});
			store.commitChanges();
		}
		
		/** custom grid listeners **/
		var listeners = ( typeof params.listeners != 'undefined' )? params.listeners : {};
		var noDefaultListeners = ( typeof params.noDefaultListeners != 'undefined' )? params.noDefaultListeners : false;
		
		if( !noDefaultListeners ){
			listeners['select'] = function( grid, rec, row ){
				try{
					this.getStore().getAt( row ).set( 'selected', 1 );
					if( typeof params.customSelectListener != 'undefined' ){
						params.customSelectListener( rec.data );
					}
				}
				catch( err ){
					console.log( err );
				}
			};
			
			listeners['selectionchange'] = function(){
				try{
					if( typeof SELECTED != 'undefined' ){
						if( this.getStore().getCount() > 1 ){
							this.getStore().getAt( SELECTED ).set( 'selected', 0 );
						}
					}
				}
				catch( err ){
					console.log( err );
				}
			};
			
			listeners['beforedeselect'] = function( grid, record, index ){
				SELECTED = index;
			};
			
			listeners['sortchange'] = function(){
				var select 	= this.getSelectionModel().getSelection()[0];
				SELECTED	= this.store.indexOf( select );
			};
		}
		
		return Ext.create('Ext.grid.Panel', {
			id				: params.id
			,store			: store
			,hidden			: params.hidden
			,height			: ( typeof params.height != 'undefined' )? params.height : 401
			,width			: params.width
			,columnWidth	: params.columnWidth
			,style			: params.style
			,border			: ( typeof params.border != 'undefined' )? params.border : true
			,plugins		: plugins
			,selModel		: params.selModel
			,requiredFields : requiredFields
			,condition		: condition
			,columns		: {
				defaults:defaults
				,items:params.columns
			}
			,features		: features
			,dockedItems	: dockedItems
			,tbar			: tbar
			,bbar			: bbar
			,hideHeaders	: params.hideHeaders
			,viewConfig		: ( typeof params.viewConfig != 'undefined' )? params.viewConfig : { markDirty:false }
			,listeners		: listeners
		});
	}
	
	/* Create plugin editor for grid
		return : plugin
		parameters[
			
			PROPERTIES __________________
			sdateID			: [string] id for start date field.
			edateID			: [string] id for end date field.
			stimeID			: [string] id for start time field.
			etimeID			: [string] id for end time field.
			noTime			: [bool] id for end time field.
			fromFieldLabel	: [string] field label for start date field.
			fromLabelWidth	: [int] label width for start date/time field.
			fromWidth		: [int] width for start date/time field.
			labelWidth		: [int] label width for end date/time field.
			
		]
	*/
	
	function _cellEdit( params ){
		return Ext.create('Ext.grid.plugin.CellEditing',{
			clicksToEdit: 1
			,pluginId: params.pluginId
			,listeners:{
				afteredit: function( me, parent ){
					try{
						parent.grid.getView().refresh();
						parent.grid.up('form').fireEvent('fieldvaliditychange');
					}
					catch( err ){
						console.log( err );
					}
				}
			}
		});
	}
	
	/* Create file upload field
		return : container
		parameters[
			
			PROPERTIES __________________
			id				: [string] serves as an ID and name for the component.
			buttonOnly		: [bool] restrict button's view whether to display label or not. Default = false
			xCor			: [int] x-axis coordinate.
			yCor			: [int] y-axis coordinate.
			buttonText		: [string] label for upload button.
			iconCls			: [string] icon cls for upload button.
			format			: [expression] file format to be upload. Default = /^.*\.(jpg|JPG|png|PNG)$/
			
			see property details for other parameters @ ExtDocs
			
		]
	*/
	
	function _createFileUpload( params ){
		var allowBlank		= ( typeof params.allowBlank != 'undefined' )? params.allowBlank : true
		var withREQ    		= ( typeof params.withREQ != 'undefined' )? params.withREQ : true;
		var fieldLabel		= ( typeof params.fieldLabel != 'undefined' )? params.fieldLabel + ( !allowBlank? ( withREQ? Ext.getConstant( 'REQ' ) : '' ) : '' ) : '';
		return Ext.create('Ext.form.field.File',{
			name: 		params.id
			,id:		params.id
			,x:			params.xCor
			,y:			params.yCor
			,hidden:	params.hidden
			,style:		( typeof params.style != 'undefined' )? params.style : 'margin-top:3px'
			,msgTarget:	'under'
			,buttonConfig: {
				text: 		params.buttonText
				,iconCls: 	params.iconCls
			}
			,width:		( typeof params.width != 'undefined' )? params.width : Ext.getConstant( 'DEF_WIDTH' )
			,labelWidth	: ( typeof params.labelWidth != 'undefined' )? params.labelWidth : Ext.getConstant( 'DEF_LABEL_WIDTH' )
			,buttonOnly:( typeof params.buttonOnly != 'undefined' )? params.buttonOnly : false
			,allowBlank:( typeof params.allowBlank != 'undefined' )? params.allowBlank : true
			,disabled:	( typeof params.disabled != 'undefined' )? params.disabled : false
			,fieldLabel: fieldLabel
			,validator: function( value ){
				/** validations **/
				if( value ){
					var file    = this.getEl().down( 'input[type=file]' ).dom.files[0];
					var format  = (typeof params.format != 'undefined' )? params.format : /^.*\.(jpg|JPG|png|PNG|gif|GIF)$/;
					if( format.test( value ) ){
						/** if file size exceeds to limit **/
						if( parseInt( file.size ) > 5000000 ){
							_createMessageBox({
								msg : 'EXCEED5'
							});
							return false;
						}
						else{
							return true;
						}
					}
					else{
						/** for invalid file extentions **/
						return 'Invalid file format.';
					}
				}
				else{
					return true;
				}
			}
			,listeners:{
				change: function(){
					var file = this.getEl().down('input[type=file]').dom.files[0];
					/** checks validity of the format **/
					if( file && this.isValid() ){
						var reader = new FileReader();
						reader.onload = function( e ){
							if( typeof params.listChange != 'undefined' ){
								params.listChange();
							}
							if( Ext.getDom( params.imageBox ) ){
								Ext.getDom( params.imageBox ).src = e.target.result;
							}
						}
						reader.readAsDataURL( file );
					}
					else{
						var noReset = (typeof params.noReset != 'undefined')? params.noReset : false;
						if( !noReset ){
							this.reset();
						}
					}
				}
			}
		});
	}
	
	function _createImageUpload( params ){
		var uploadID = ( typeof params.uploadID != 'undefined' )? params.uploadID : 'fieldUpload' + params.module;
		var resetID  = ( typeof params.resetID != 'undefined' )? params.resetID : 'resetUpload' + params.module;
		var boxID 	 = ( typeof params.boxID != 'undefined' )? params.boxID : 'boxUpload'+params.module;
		var boxWidth = ( typeof params.boxWidth != 'undefined' )? params.boxWidth : 350;
		var boxHeight= ( typeof params.boxHeight != 'undefined' )? params.boxHeight : 180;
		var uploadX  = ( typeof params.uploadX != 'undefined' )? params.uploadX : 295;
		var uploadY  = ( typeof params.uploadY != 'undefined' )? params.uploadY : 147;
		var resetX   = ( typeof params.resetX != 'undefined' )? params.resetX : 320;
		var resetY   = ( typeof params.resetY != 'undefined' )? params.resetY : 150;
		var logoPath = ( typeof params.defImage != 'undefined' )? params.defImage : baseurl+'images/empty.jpg';
		
		return {
			xtype:	'container'
			,height:boxHeight + 10
			,width:boxWidth + 2
			,items:[
				{
					xtype:	'container'
					,layout: 'absolute'
					,style:	params.style
					,listeners: {
						afterrender: function( me ){
							me.el.on('mouseover', function() {
								Ext.getCmp( uploadID ).setVisible( true );
								Ext.getCmp( resetID ).setVisible( true );
							});
							me.el.on('mouseout', function() {
								Ext.getCmp( uploadID ).setVisible( false );
								Ext.getCmp( resetID ).setVisible( false );
							});
						}
					},
					items:[
						Ext.create('Ext.form.Label',{
							x: 0,
							y: 0,
							html:'<img id="'+boxID+'" width="'+boxWidth+'" height="'+boxHeight+'" src="'+logoPath+'" style="border:1px solid black;" /> '
						})
						,_createFileUpload({
							id : 		uploadID
							,imageBox:	boxID
							,text:		'Browse'
							,buttonOnly:true
							,hidden:	true
							,iconCls:	'glyphicon glyphicon-folder-open'
							,xCor:		uploadX
							,yCor:		uploadY
						})
						,{
							xtype:		'button'
							,iconCls:	'glyphicon glyphicon-remove-sign'
							,id:		resetID
							,x:			resetX
							,y:			resetY
							,hidden:	true
							,handler: function(){
								if( typeof params.customReset != 'undefined' ){
									params.customReset({
										uploadCmp : Ext.getCmp( uploadID )
										,boxCmp   : Ext.getDom( boxID )
									});
								}
								else{
									Ext.getCmp( uploadID ).reset();
									Ext.getDom( boxID ).src = logoPath;
								}
							}
						}
					]
				}
			]
		};
	}
	
	function _listExcel( params ){
		if( params.grid.store.getCount() == 0 ){
			_createMessageBox({
				msg : 'NOREC_PRINT'
			});
			return;
		}
		
		if( params.customListExcelHandler ){
			params.customListExcelHandler();
		}
		else if( params.listExcelHandler ){
			Ext.Ajax.request({
				url:	 params.route+'printEXCELList'
				,params:{
					title : params.pageTitle
				}
				,success: function(){
					window.open( params.route + "download/" + params.pageTitle+ ' List' );
				}
			});
		}
		else{
			var headerArray = {};
			var dIndexArray = {};
			var filters     = [];
			var form 		= params.module.getForm( true );
			var tempFilter = {};
			
			if( params.hasCustomFilter ) {
				$.each(params.hasCustomFilter, function(key, value) {
					tempFilter[''+value] = Ext.getCmp( '' + value + '' + params.module ).getValue()
					if(typeof Ext.getCmp( '' + value + '' + params.module ).getDisplayValue === "function" ){
						tempFilter['disp_'+value] = Ext.getCmp( '' + value + '' + params.module ).getDisplayValue()
					}
				});
				filters.push(tempFilter)
			}
			else if( filter = Ext.getCmp( 'searchFilterContainer' + params.module ) ){
				for( x in field = filter.items.items ){
					if( field[x].isFormField ){
						filters.push({ v1:field[x].getRawValue(), v2:field[x].getValue() });
					}
				}
			}
			
			for( var x in column = params.grid.columns ){
				if( column[x].dataIndex ){
					var col = parseInt( x, 10 )+1;
					headerArray['col'+col] = column[x].text;
					dIndexArray['col'+col] = column[x].dataIndex;
				}
			}
			
			var path  = params.route.replace( baseurl, '' );
			var index = path.indexOf('/');
			
			Ext.Ajax.request({
				url:	 standardRoute+'listExcel'
				,params:{
					title 		 : params.pageTitle
					,headerArray : Ext.encode( [headerArray] )
					,dIndexArray : Ext.encode( [dIndexArray] )
					,folder		 : path.substring( 0, index )
					,moduleName  : path.substring( index+1, index+2 ).toUpperCase() + "" + path.substring( index+2, path.length-1 )
					,filters     : Ext.encode( filters )
					,hasCustomFilter : (params.hasCustomFilter ? 1 : 0)
				}
				,success: function(){
					window.open( standardRoute + "download/" + params.pageTitle + '' + '/' + path.substring( 0, index ) );
				}
			});
		}
	}
	
	function _listPDF( params ){
		
		console.log('been here, promise.');
		
		if( params.grid.store.getCount() == 0 ){
			_createMessageBox({
				msg : 'NOREC_PRINT'
			});
			return;
		}
		
		var path1  = params.route.replace( baseurl, baseurl+'pdf/' );
		var module = params.module.toString().substring( 1, params.module.toString().length );
		var path2  = path1.substring( 0,( path1.length - ( module.length + 1 ) ) );
		var title  = path2+''+params.pageTitle+'.pdf';
		
		if( params.customListPDFHandler ){
			params.customListPDFHandler();
		}
		else if( params.listPDFHandler ){
			Ext.Ajax.request({
				url:	 params.route+'printPDFList'
				,params:{
					title : params.pageTitle
				}
				,success: function(){
					window.open( title+'?_dc='+( new Date() ).getTime() );
				}
			});
		}
		else{
			var columnArray = [];
			var filters     = [];
			var form 		= params.module.getForm( true );
			var tempFilter = {};
			
			if( params.hasCustomFilter ) {
				$.each(params.hasCustomFilter, function(key, value) {
					tempFilter[''+value] = Ext.getCmp( '' + value + '' + params.module ).getValue()
				});
				filters.push(tempFilter)
			}
			
			else if( filter = Ext.getCmp( 'searchFilterContainer' + params.module ) ){
				for( x in field = filter.items.items ){
					if( field[x].isFormField ){
						filters.push({ v1:field[x].getRawValue(), v2:field[x].getValue() });
					}
				}
			}
			
			for( var x in column = params.grid.columns ){
				
				if( column[x].dataIndex ){
					columnArray.push({
						header 		: column[x].text
						,dataIndex 	: column[x].dataIndex
						,type 		: column[x].xtype
						,hasTotal   : ( typeof column[x].summaryType != 'undefined' )
						,width		: ( typeof column[x].columnWidth != 'undefined' )? column[x].columnWidth : 15
					});
				}
			}
			
			var path  = params.route.replace( baseurl, '' );
			var index = path.indexOf('/');
			
			Ext.Ajax.request({
				url:	 standardRoute+'listPDF'
				,params:{
					title 		 : params.pageTitle
					,columnArray : Ext.encode( columnArray )
					,folder		 : path.substring( 0, index )
					,moduleName  : path.substring( index+1, index+2 ).toUpperCase() + "" + path.substring( index+2, path.length-1 )
					,filters     : Ext.encode( filters )
					,orientation : params.orientation
					,hasCustomFilter : (params.hasCustomFilter ? 1 : 0)
				}
				,success: function(){
					// if( filters ){
						// title = title.replace(' List','');
					// }
					window.open( title+'?_dc='+( new Date() ).getTime() );
				}
			});
		}
	}

	
	
	function __listPDF( params ){
		if( params.grid.store.getCount() == 0 ){
			_createMessageBox({
				msg : 'NOREC_PRINT'
			});
			return;
		}
		
		if(!params.customListPDFHandler){
			var path1  = params.route.replace( baseurl, baseurl+'pdf/' );
			var module = params.module.toString().substring( 1, params.module.toString().length );
			var path2  = path1.substring( 0,( path1.length - ( module.length + 1 ) ) );
			var title  = path2+''+params.pageTitle+' List.pdf';
		}
		
		if( params.customListPDFHandler ){
			params.customListPDFHandler();
		}
		else if( params.listPDFHandler ){
			Ext.Ajax.request({
				url:	 params.route+'printPDFList'
				,params:{
					title : params.pageTitle
				}
				,success: function(){
					if( Ext.getConstant('ISGAE') ){
						window.open( params.route + 'viewPDF/' + title, '_blank' );
					}
					else{
						window.open( title+'?_dc='+( new Date() ).getTime() );
					}
				}
			});
		}
		else{
			var columnArray = [];
			var filters     = [];
			var form 		= params.module.getForm( true );
			
			if( filter = Ext.getCmp( 'searchFilterContainer' + params.module ) ){
				for( x in field = filter.items.items ){
					if( field[x].isFormField ){
						filters.push({ v1:field[x].getRawValue(), v2:field[x].getValue() });
					}
				}
			}
			
			for( var x in column = params.grid.columns ){
				
				if( column[x].dataIndex ){
					columnArray.push({
						header 		: column[x].text
						,dataIndex 	: column[x].dataIndex
						,type 		: column[x].xtype
						,hasTotal   : ( typeof column[x].summaryType != 'undefined' )
						,width		: ( typeof column[x].columnWidth != 'undefined' )? column[x].columnWidth : 15
						,format 	: column[x].format
					});
				}
			}
			
			var path  = params.route.replace( baseurl, '' );
			var index = path.indexOf('/');
			
			var extraParams = params.extraParams || {};
			extraParams.isTransaction = typeof filter != 'undefined' && filter.isTransaction ? 1 : 0;
			var arrExtraParams = {};
			if(Ext.Object.getSize(extraParams) > 0){
				for (var key in extraParams) {
					if (extraParams.hasOwnProperty(key)) {
						if(typeof extraParams[key] == 'function'){
							arrExtraParams[key] = eval(extraParams[key]());
						}
						else{
							arrExtraParams[key] = extraParams[key];
						}
					}
				}
			}
			
			Ext.Ajax.request({
				url:	 standardRoute+'listPDF'
				,params:{
					title 		 : params.pageTitle
					,columnArray : Ext.encode( columnArray )
					,folder		 : path.substring( 0, index )
					,moduleName  : path.substring( index+1, index+2 ).toUpperCase() + "" + path.substring( index+2, path.length-1 )
					,filters     : Ext.encode( filters )
					,orientation : params.orientation
					,extraParams : Ext.encode(arrExtraParams)
				}
				,success: function(){
					// if( filters ){
						// title = title.replace(' List','');
					// }
					if( Ext.getConstant('ISGAE') ){
						window.open( params.route + 'viewPDF/' + params.pageTitle + ' List', '_blank' );
					}
					else{
						window.open( title+'?_dc='+( new Date() ).getTime() );
					}
				}
			});
		}
	}
	
	function _setBaseurl( params ){
		baseurl 	  = params.baseurl;
		standardRoute = baseurl+'standards/Standards/'
	}
	
	function _consoleDebuger_developmentOnly( functionName, params ){
		var wpar = ' : wrong parameter for';
		var xpar = ' : missing parameter for';
		
		if( functionName === '_mainPanel' ){
			if( typeof params.moduleType != 'undefined' ){
				if( params.moduleType != 'form' && params.moduleType != 'report' ){
					console.info( functionName + wpar + ' moduleType' );
				}
			}
			
			if( typeof params.tbar != 'object' ){
				if( params.tbar.toString() != 'empty'){
					console.info( functionName + wpar + ' tbar' );
				}
			}
			if( params.moduleType.toString() == 'report'){
				if( typeof params.moduleGrids == 'function' ){
					console.info( functionName + wpar + ' moduleGrids' );
				}
			}
			
			if( typeof params.formItems != 'undefined' ){
				for( var x in params.formItems ){
					if( typeof params.formItems[x] == 'function' ){
						console.info( functionName + wpar + ' formItems' );
					}
				}
			}
		}
		else if( functionName === '_gridPanel' ){
			if( typeof params.store == 'undefined' ){
				console.info( functionName + wpar + ' store' );
			}
			if( typeof params.tbar == 'string' ){
				if( params.tbar != 'empty' ){
					console.info( functionName + xpar + ' tbar' );
				}
			}
		}
		else if( functionName === '_createFileUpload' ){
			if( typeof params.id == 'undefined' ){
				console.info( functionName + xpar + 'id' );
			}
		}
		
		return false;
	}
	
	/* Custom standard function
	 * Additional standards functions to be recorded here.
	*/
	// function _winSchoolYear( params ){
	// 	var winModule = params.module + '_win'
	// 		,dateModified
	// 		,modify = 0;
	// 	var _store	=	_createRemoteStore({
	// 						fields : [
	// 							{	name : 'schoolYearID'
	// 								,type : 'number'
	// 							}
	// 							,'schoolYearDescription'
	// 						]
	// 						,url : standardRoute + 'getSchoolYearList'
	// 						,autoLoad : true
	// 					});
	// 	var winQuick = Ext.create( 'Ext.Window', {
	// 		id : 'schoolYear' + winModule
	// 		,title : '<span class = "glyphicon glyphicon-plus"></span> School Year'
	// 		,autoWidth : true
	// 		,autoHeight : true
	// 		,modal : true
	// 		,bodyPadding : '10px'
	// 		,resizable : false
	// 		,items : [
	// 			{	xtype : 'form'
	// 				,width : 600
	// 				,border : false
	// 				,id : 'mainFormPanel' + winModule
	// 				,overrideParams : false
	// 				,items: [
	// 					{	xtype : 'hiddenfield'
	// 						,id : 'schoolYearID' + winModule
	// 					}
	// 					,{	xtype : 'container'
	// 						,layout : 'column'
	// 						,style : 'margin-bottom : 10px;'
	// 						,items: [
	// 							_createTextField( {
	// 								id : 'schoolYearDescription' + winModule
	// 								,fieldLabel : 'School Year'
	// 								,allowBlank : false
	// 								,style : 'margin-right : 5px;'
	// 							} )
	// 							,{	xtype : 'button'
	// 								,iconCls : 'glyphicon glyphicon-floppy-disk'
	// 								,id : 'saveButton' + winModule
	// 								,formBind : true
	// 								,disabled : true
	// 								,style : 'margin-right : 5px;'
	// 								,handler : function(  ){
	// 									var form = Ext.getCmp( 'mainFormPanel' + winModule )
	// 										,name = Ext.getCmp( 'schoolYearDescription' + winModule );
	// 									form.getForm().submit( {
	// 										url : standardRoute + 'saveSchoolYear'
	// 										,params : {
	// 											module : winModule
	// 											,modify : modify
	// 											,dateModified : dateModified
	// 											,idmodule : params.idmodule
	// 										}
	// 										,success : function( action, response ){
	// 											var match = parseInt( response.result.match, 10 );
	// 											if( match == 1 ){
	// 												_createMessageBox( {
	// 													msg : 'School Year : ' + name.value + ' already exists.'
	// 													,fn : function(){
	// 														name.focus();
	// 													}
	// 												} )
	// 											}
	// 											else if( match == 2 ){
	// 												_createMessageBox( {
	// 													msg : 'EDIT_UNABLE'
	// 												} )
	// 											}
	// 											else if( match == 3 ){
	// 												_createMessageBox( {
	// 													msg		: 'SAVE_MODIFIED'
	// 													,action	: 'confirm'
	// 													,fn		: function( btn ){
	// 														if( btn == 'yes' ){
	// 															modify = 1;
	// 															Ext.getCmp( 'saveButton' + winModule ).handler.call();
	// 														}
	// 													}
	// 												} );
	// 											}
	// 											else{
	// 												_createMessageBox( {
	// 													msg : 'SAVE_SUCCESS'
	// 													,fn : function(){
	// 														form.getForm().reset();
	// 														modify = 0;
	// 														dateModified = null;
	// 														Ext.getCmp( 'gridHistory' + winModule ).store.load( {} );
	// 													}
	// 												} );
	// 											}
	// 										}
	// 									} )
	// 								}
	// 							}
	// 							,{	xtype : 'button'
	// 								,iconCls : 'glyphicon glyphicon-refresh'
	// 								,handler : function(){
	// 									Ext.getCmp( 'mainFormPanel' + winModule ).getForm().reset();
	// 									dateModified = null;
	// 									modify = 0;
	// 								}
	// 							}
	// 						]
	// 					}
	// 				]
	// 			}
	// 			,_gridPanel( {
	// 				id : 'gridHistory' + winModule
	// 				,module : winModule
	// 				,store : _store
	// 				,height : 250
	// 				,width : 600
	// 				,tbar : 'empty'
	// 				,columns : [
	// 					{	header : 'School Year'
	// 						,flex : 1
	// 						,dataIndex : 'schoolYearDescription'
	// 					}
	// 					,_createActionColumn( {
	// 						icon : 'pencil'
	// 						,tooltip : 'Edit record'
	// 						,Func : function( data ){
	// 							Ext.Ajax.request( {
	// 								url : standardRoute + 'retrieveSchoolYear'
	// 								,method : 'post'
	// 								,params : {
	// 									schoolYearID : data.schoolYearID
	// 								}
	// 								,success : function( response ){
	// 									var resp = Ext.decode( response.responseText )
	// 										,match = parseInt( resp.match, 10 );
	// 									if( match == 1 ){
	// 										_createMessageBox( {
	// 											msg : 'EDIT_UNABLE'
	// 										} );
	// 									}
	// 									else{
	// 										var data = resp.view;
	// 										Ext.getCmp( 'schoolYearID' + winModule ).setValue( data.schoolYearID );
	// 										Ext.getCmp( 'schoolYearDescription' + winModule ).setValue( data.schoolYearDescription );
	// 										dateModified = data.dateModified;
	// 										modify = 0;
	// 									}
										
	// 								}
	// 							} )
	// 						}
	// 					} )
	// 					,_createActionColumn( {
	// 						canDelete : true
	// 						,icon : 'remove'
	// 						,tooltip : 'Remove record'
	// 						,Func : function( data ){
	// 							_createMessageBox( {
	// 								msg : 'DELETE_CONFIRM'
	// 								,icon : 'question'
	// 								,buttons : 'yesno'
	// 								,fn : function( btn ){
	// 									if( btn == 'yes' ){
	// 										Ext.Ajax.request( {
	// 											url : standardRoute + 'deleteSchoolYear'
	// 											,method : 'post'
	// 											,params : {
	// 												schoolYearID : data.schoolYearID
	// 												,idmodule 	 : params.idmodule
	// 											}
	// 											,success : function( response ){
	// 												var resp = Ext.decode( response.responseText )
	// 													,match = parseInt( resp.match, 10 );
	// 												if( match == 1 ){
	// 													_createMessageBox( {
	// 														msg : 'EDIT_UNABLE'
	// 													} )
	// 												}
	// 												else if( match == 2 ){
	// 													_createMessageBox( {
	// 														msg : 'School year is currently being used and can not be deleted.'
	// 														,icon : 'error'
	// 													} )
	// 												}
	// 												else{
	// 													_createMessageBox( {
	// 														msg : 'DELETE_SUCCESS'
	// 														,fn : function(){
	// 															var store = Ext.getCmp( 'gridHistory' + winModule ).getStore();
	// 															if( store.getCount() == 1 && store.currentPage != 1 ){
	// 																store.currentPage--;
	// 															}
																
	// 															store.load();
																
	// 															if( Ext.getCmp( 'schoolYearID' + winModule ).value == data.schoolYearID ){
	// 																Ext.getCmp( 'mainFormPanel' + winModule ).getForm().reset();
	// 															}
	// 														}
	// 													} )
	// 												}
	// 											}
	// 										} )
	// 									}
	// 								}
	// 							} )
	// 						}
	// 					} )
	// 				]
	// 			} )
	// 		]
	// 	} );
	// 	winQuick.show();
	// }
	
	/* quicksetup for activity type and subjects */
	// function _winActTypeSub( params ){
	// 	var	classificatoinStore = _createLocalStore({
	// 						data:[
	// 							'Performance'
	// 							,'Written Works'
	// 							,'Quizzes'
								
	// 						]
	// 					});
	// 	var winTitle = '';
	// 	if( params.type == 'activity type' ){
	// 		winTitle = 'Activity Type'
	// 	}
	// 	else if( params.type == 'subject' ){
	// 		winTitle = 'Subject'
	// 	}
	// 	var winMod = '_quickWin' + params.module;
	// 	return Ext.create( 'Ext.Window', {
	// 		title : '<span class = "glyphicon glyphicon-plus"></span> ' + winTitle
	// 		,id : 'winQuickSetup' + winMod
	// 		,autoWidth : true
	// 		,autoHeight : true
	// 		,modal : true
	// 		,resizable : false
	// 		,items : [
	// 			{	xtype : 'form'
	// 				,width : 370
	// 				,border : false
	// 				,bodyPadding : '10px'
	// 				,id : 'mainFormPanelQuick' + winMod
	// 				,overrideParams : false
	// 				,items: [
	// 					_createTextField( {
	// 						id : 'txtQuickField' + winMod
	// 						,maxLength : 255
	// 						,fieldLabel : winTitle
	// 						,allowBlank : false
	// 					} )
	// 					,
 	// 					_createCombo( {
	// 						id : 'txtClassification' + winMod
	// 						,maxLength : 255
	// 						,fieldLabel : "Classification"
	// 						,allowBlank : (params.type == 'activity type') ? false : true 
	// 						,hidden : (params.type == 'activity type') ?  false : true
	// 						,store : 	classificatoinStore
	// 					} )

	// 				]
	// 				,buttonAlign : 'center'
	// 				,buttons : [
	// 					{	text : 'Save'
	// 						,iconCls : 'glyphicon glyphicon-floppy-disk'
	// 						,formBind : true
	// 						,disabled : true
	// 						,handler : function(){
	// 							var form = Ext.getCmp( 'mainFormPanelQuick' + winMod );
	// 							form.getForm().submit( {
	// 								url : standardRoute + 'saveQuickSetup'
	// 								,params : {
	// 									module : winMod
	// 									,idmodule : params.idmodule
	// 									,type : params.type
	// 								}
	// 								,success : function( action, response ){
	// 									var match = parseInt( response.result.match, 10 )
	// 										,msg = ''
	// 										,resultID = parseInt( response.result.resultID, 10 );
	// 									if( params.type == 'activity type' ){
	// 										msg = 'Activity type already exists.'
	// 									}
	// 									else if( params.type == 'subject' ){
	// 										msg = 'Subject already exists.'
	// 									}
	// 									if( match == 1 ){
	// 										_createMessageBox( {
	// 											msg : msg
	// 											,fn : function(){
	// 												Ext.getCmp( 'txtQuickField' + winMod ).focus();
	// 											}
	// 										} );
	// 									}
	// 									else{
	// 										_createMessageBox( {
	// 											msg : 'SAVE_SUCCESS'
	// 											,fn : function(){
	// 												Ext.getCmp( 'winQuickSetup' + winMod ).destroy();
	// 												Ext.getCmp( params.comboID ).store.load( {
	// 													callback : function(){
	// 														Ext.getCmp( params.comboID ).setValue( resultID );
	// 													}
	// 												} )
	// 											}
	// 										} );
	// 									}
	// 								}
	// 							} );
	// 						}
	// 					}
	// 					,{	text : 'Reset'
	// 						,iconCls : 'glyphicon glyphicon-refresh'
	// 						,handler : function(){
	// 							var form = Ext.getCmp( 'mainFormPanelQuick' + winMod );
	// 							form.getForm().reset();
	// 						}
	// 					}
	// 				]
	// 			}
	// 		] 
	// 	} ).show();
	// }
	
	function setAllowBlankComponent( params ){
	  var ccComp = params.component;
	  
	  ccComp.allowBlank = true;
	  ccComp.setFieldLabel(ccComp.getFieldLabel().replace(Ext.getConstant('REQ'),""));
		  
	  if(!params.allowBlank){
	   ccComp.allowBlank = false;
	   ccComp.setFieldLabel(ccComp.getFieldLabel() + Ext.getConstant('REQ'));
	  }
	}
	
	return {
		callFunction: function( functionName, parameters ){
			try{
				var func = eval( functionName );
				if( typeof parameters == 'undefined' ){
					parameters = {};
				}
				// _consoleDebuger_developmentOnly( functionName, parameters );
				return func( parameters );
			
			}catch( err ){
				console.info( err,functionName );
			}
		}
	}
}();