/** Overrides
  * [Developer]
  * In Memory: Salrio T. Salcedo
  * Date Created: September 2015
  
  * [Description]
	Overrides Ext native behavior
	Contains : Overrides, Defines, Applies and Prototypes
  
  * [Modification]
    Almost each and every single day :D
	Except when Im gone :(
 **/

var overrides = function(){
	var baseurl;
	
	function _override_formField(){
		
		/** Added customize property( origReadOnly ) to all ext fields.
			The property flags readOnly attribute after disabling all fields upon editing used records.
		**/
		Ext.override( Ext.form.field.Base, {
			origReadOnly : null
			,initComponent : function() {
				this.callParent( arguments );
				this.origReadOnly = this.readOnly;
			}
		});
	}
	
	function _override_textField(){
		Ext.override( Ext.form.field.Text, {
			
			/** Sets trimmed numeric values **/
			setValue : function( value ){
				if( this.isNumber ){
					var trim = ( Number( String( this.removeComma( value ) ) ) >= 0 )? this.removeComma( value ) : 0;
					value	 = this.getCurrency() + this.numberFormat( trim );
				}
				Ext.form.field.Text.superclass.setValue.call( this, value );
			}
			
			/** Removes all characters except numeric and period(.) **/
			,onFocus : function() {
				if( this.isNumber ){
					if( !this.readOnly ){
						var trim  = this.removeCurrency( this.removeComma( this.getValue() ) );
						var value = ( parseFloat( trim, 10 ) == 0 )? '' : trim;
						if( isNaN( value ) ){
							if( this.allowNull ) value = ''
							else value = 0;
						}
						Ext.form.field.Text.superclass.setValue.call( this, value );
					}
				}
			}
			
			/** Returns currency symbol( if any ) and commas **/
			,onBlur : function(){
				if( this.isNumber && !this.readOnly ){
					var value = this.removeComma( this.getValue() );
					if( !value && this.allowNull ){
						this.setValue( '' );
					}
					else{
						this.setValue( this.numberFormat( this.removeCurrency( value ) ) );
					}
				}
				this.callParent( arguments );
			}
			
			/** Returns 0 if value is undefined **/
			,getValue: function() {
				var value = this.callParent( arguments );
				if( this.isNumber ){
					if( value == '' ){
						value = 0;
					}
				}
				return value;
			}
			
			/** Trims currency symbol and comma before submitting **/
			,getSubmitValue: function(){
				var value;
				if( this.isNumber ){
					if( this.hasCurrency ){
						value = this.removeCurrency( this.removeComma( this.getValue() ) );
					}
					else{
						value = this.removeComma( this.getValue() );
					}
				}
				else{
					value = this.getValue();
				}
				return value;
			}
			
			/** Returns currency symbol( if any ) **/
			,getCurrency : function(){
				return ( this.hasCurrency )? Ext.getConstant( 'DEF_CURRENCY' )+' ' : '';
			}
			
			/** Removes currency symbol( if any ) **/
			,removeCurrency : function( value ){
				return value.toString().replace( this.getCurrency(), '' );
			}
			
			/** Removes comma **/
			,removeComma : function( value ){
				return ( value )? value.toString().replace( /,/g, '' ) : value;
			}
			
			/** Sets numeric format **/
			,numberFormat : function( value ){
				return Ext.util.Format.number( parseFloat( value, 10 ), ( this.isDecimal? '0,000.00' : '0,000' ) )
			}
			
			/** Marks invalid on required numeric fields with values equal to 0 **/
			,getErrors: function( value ) {
				if( !this.allowNegative ){
					if( this.isNumber ){
						if( !this.allowBlank ){
							if( parseFloat( this.getSubmitValue(), 10 ) == 0 ){
								return ['must be greater than 0'];
							}
						}
					}
				}
				return this.callParent( arguments );
			}
		});
	}
	
	function _override_checkBox(){
		
		/** Submits either 1 or 0( checked and unchecked respectively ).
			Original config does not submit anything for unchecked values.
		**/
		Ext.override( Ext.form.field.Checkbox, {
			getSubmitValue: function(){
				return +this.value;
			}
		});
	}
	
	function _override_gridColumn(){
	
		/** Sorts data in respect to the selected column **/
		Ext.override( Ext.grid.column.Column, {
			doSort:function( order ){
				var grid  		 = this.up( 'grid' );
				var store 		 = grid.store;
				var toolbarItems = grid.dockedItems.keys;
				var hasPaging    = false;
				
				/** Search for any paging toolbar on a grid **/
				for( var x in toolbarItems ){
					if( toolbarItems[x].indexOf( 'pagingToolBar_' ) != -1 ){
						var limit = Ext.getCmp( toolbarItems[x] ).items.items[0].getValue();
						if( limit < store.getTotalCount() ){
							hasPaging = true;
						}
					}
				}
				
				/** Requery if total number of pages exceeds 1 **/
				if( hasPaging && store.getCount() > 0 ){
					store.sort({
						property: this.dataIndex
						,direction: order
						,sorterFn: function( val ) {
							return val;
						}
					});
					
					store.load();
				}
				else{
					this.callParent( arguments );
				}
			}
		});
	}
	
	function _override_cellEdit(){
		
		/** Locks all grid editor if record is already used  **/
		Ext.override( Ext.grid.plugin.CellEditing, {
			beforeEdit : function() {
				return !this.grid.up( 'form' ).form.used;
			}
		});
	}
	
	function _override_formPanel(){
		Ext.override( Ext.form.Basic, {
			submitEmptyText	: false
			,modify			: false
			,onEdit			: false
			,used			: false	 /** also used as datafilter for report panels **/
			,wasUsed		: false
			,dirty			: false
			,dateModified	: null
			,reset			: function(){
				var module        = this.owner.module;
				this.modify 	  = false;
				this.onEdit 	  = false;
				this.used 	  	  = false;
				this.dirty 	  	  = false;
				this.dateModified = null;
				
				if( mainPanel = Ext.getCmp( 'mainPanel' + module ) ){
					if( saveButton = module.getButton( 'save' ) ){
						saveButton.setVisible( mainPanel.config.canSave );
					}
					if( btnExcel = module.getButton( 'excel' ) ){
						btnExcel.setVisible( false );
					}
					if( btnPDF = module.getButton( 'pdf' ) ){
						btnPDF.setVisible( false );
					}
				}
				
				this.setReadOnlyWhenUsed( module );
				this.callParent( arguments );
			}
			,retrieveData	: function( data ){
				var me		 	= this;
				var module   	= me.owner.module; 
				var formID   	= me.owner.id; 
				var onEdit   	= ( typeof data.onEdit   != 'undefined' )? data.onEdit   : true;
				var goToForm 	= ( typeof data.goToForm != 'undefined' )? data.goToForm : true;
				var excludes 	= ( typeof data.excludes != 'undefined' )? data.excludes : null;
				var match    	= 0;
				
				Ext.Ajax.request({
					url: data.url
					,params: data.params
					,method:'post'
					,success: function ( response ){
						var resp = Ext.decode( response.responseText );
						var view;
						if( typeof resp.view != 'undefined' ){
							view = ( typeof resp.view[0] != 'undefined' )? resp.view[0] : null;
						}
						else{
							view = null;
						}
						
						if( onEdit ){
							if( typeof resp.match != 'undefined' ){
								/** 
									0 = ok
									1 = record not found
									2 = record used
								**/
								match   = parseInt( resp.match, 10 );
								me.used = false;
								
								if( match == 1 ){
									standards.callFunction( '_createMessageBox', {
										msg : 'EDIT_UNABLE'
									});
									
									if( typeof data.successNotFound != 'undefined' ){
										data.successNotFound();
									}
									
									return;
								}
								else if( match == 2 ){
									if( me.showEditUsedMsg ){
											standards.callFunction( '_createMessageBox', {
											msg : 'EDIT_USED'
										});
									}
									
									me.used = me.wasUsed = true;
								}
								
								me.setReadOnlyWhenUsed( module );
							}
							me.onEdit       = true;
							me.dateModified = ( view )? view.dateModified : null;
						}
						
						if( view ){
							me.setData( view, excludes, me.owner, resp );
							
							if( goToForm ){
								standards.callFunction( '_goToForm', {
									module			: module
									,otherFormID	: formID
									,hasFormPDF 	: ( typeof data.hasFormPDF != 'undefined' )? data.hasFormPDF : false
									,hasFormExcel 	: ( typeof data.hasFormExcel != 'undefined' )? data.hasFormExcel : false
								});
							}
							else{
								if( saveButton    = module.getButton( 'save' ) ){
									var canEdit   = false;
									if( mainPanel = Ext.getCmp( 'mainPanel' + module ) ){
										canEdit   = mainPanel.config.canEdit;
									}
									saveButton.setVisible( ( me.used )? false : canEdit );
								}
							}
							
							if( typeof data.success != 'undefined' ){
								data.success( view, match, resp );
							}
						}
					}
				});
			}
			,setData : function( view, excludes, form, result ){
				var keys 		= Object.keys( view );
				var module  	= this.owner.module;
				
				for( var x in excludes ){
					keys.splice( keys.indexOf( excludes[x] ), 1 );
				}
				
				for( var x in keys ){
					if( Ext.getCmp( keys[x]+module ) ){
						var field = Ext.getCmp( keys[x]+module );
						
						if( field.isFormField ){
							if( field.xtype == 'combobox' ){
								if( form.autoSetCombo ){
									field.store.load({
										callback: this.setValueCombobox( field, view[keys[x]] )
									});
								}
							}
							else{
								field.setValue( view[keys[x]] );
							}
						}
					}
				}
			}
			,setValueCombobox : function( combo, value ){
				return function() { 
					combo.setValue( parseInt( value, 10 ) );
				};
			}
			,setReadOnlyWhenUsed : function( module ){
				if( this.wasUsed ){
					/** all fields **/
					for( x in field = module.getForm().getFields().items ){
						if( !field[x].origReadOnly ){
							field[x].setReadOnly( this.used );
						}
					}
					
					/** all action columns **/
					for( x in grid = Ext.ComponentQuery.query( '#'+module.getForm( true ).id+' grid') ){
						for( y in column = grid[x].columns ){
							if( column[y].xtype == 'actioncolumn' ){
								column[y].setVisible( !this.used );
							}
						}
					}
					
					/** all buttons **/
					for( x in button = Ext.ComponentQuery.query( '#'+module.getForm( true ).id+' button') ){
						if( button[x] != module.getButton( 'pdf' ) ){
							if( button[ x ].xtype == 'button' )
								button[x].setVisible( !this.used );
						}
					}
					
					if( !this.used ){
						this.wasUsed = this.used;
					}
				}
			}
		});
	}
	
	function _override_formSubmit(){
		Ext.override( Ext.form.action.Submit, {
			waitTitle:  "Please wait"
			,waitMsg:    "Saving data..."
			,submitEmptyText : false
			,doSubmit: function() {
				var ajaxOptions = 	Ext.apply( this.createCallback(), {
										url: this.getUrl()
										,method: this.getMethod()
										,headers: this.headers
									});
				
				var jsonSubmit = this.jsonSubmit || this.form.jsonSubmit;
				var paramsProp = jsonSubmit ? 'jsonData' : 'params';
				var formInfo;

				if( this.form.hasUpload() ){
					formInfo                = this.buildForm();
					ajaxOptions.form        = formInfo.formEl;
					ajaxOptions.isUpload    = true;
				} 
				else{
					ajaxOptions[paramsProp] = this.getParams( jsonSubmit );
				}

				Ext.Ajax.request( ajaxOptions );
				
				if( formInfo ){
					this.cleanup( formInfo );
				}
			}
			,getParams:function(){
				var overrideParams 		= Ext.ifUndefined( this.form.owner.overrideParams, true );
				
				if( overrideParams ){
					var params 				= this.getGridParams( this, this.callParent( arguments ) );
					var useStandard 		= this.form.owner.useStandardAttachmentSaving;
					params['modify'] 		= ( this.form.modify )? 1 : 0;
					params['onEdit'] 		= ( this.form.onEdit )? 1 : 0;
					params['dateModified'] 	= this.form.dateModified;
					params['module']		= this.form.owner.module;
					params['idmodule']		= ( ( Ext.getCmp( 'mainPanel'+params['module'] ) )? Ext.getCmp( 'mainPanel'+params['module'] ).config.idmodule : null );
					
					
					/** included forms **/
					for( var x in includedFormIDS = this.form.owner.includedFormOnSubmit ){
						var includedForm   = Ext.getCmp( includedFormIDS[x] );
						var fieldParams    = includedForm.form.getValues( false, false, includedForm.submitEmptyText !== false, includedForm.jsonSubmit, true );
						var includedFields = Ext.apply( {}, fieldParams, includedForm.callParent() );
						
						for( var y in includedFields ){
							params[y] = includedFields[y];
						}
						
						params = this.getGridParams( includedForm, params );
					}
					
					return params;
				}
				else{
					return this.callParent( arguments );
				}
			}
			,getGridParams:function( form, params ){
				var owner        = form.form.owner;
				var autoGridPush = ( typeof owner.autoGridPush != 'undefined' )? owner.autoGridPush : false;
				
				if( autoGridPush ){
					var grids = Ext.ComponentQuery.query( '#'+owner.id+' grid[condition!=""]' );
					for( var x in grids ){
						var store 		= grids[x].store;
						var container 	= new Array();
						
						for( var y=0; y<store.getCount(); y++ ){
							var dataStore = store.getAt(y).data;
							if( eval( grids[x].condition ) ){
								delete dataStore.selected;
								container.push( dataStore );
							}
						}
						params['container_'+owner.id+'_'+x] = Ext.encode( container );
					}
				}
				
				return params;
			}
			,failure:function(){
				standards.callFunction( '_createMessageBox' ,{
					msg: 'AJAX_FAILURE'
				});
			}
		});
	}
	
	function _override_AJAX( initHeader ){
		Ext.override( Ext.Ajax, {
			isSynchronous: false
			,request:function( config ){
				this.defaultHeaders = {'initHeader' : initHeader};
				
				if( typeof config.action == 'undefined' && typeof config.form == 'undefined' ){
					var noMask  = ( typeof config.noMask != 'undefined' )? config.noMask : false;
					if( !noMask ){
						var msg = ( typeof config.msg != 'undefined' )? config.msg : "Please wait";
						Ext.getBody().mask( msg );
					}
				}
				this.callParent( arguments );
			}
			,onComplete :function( request ){
				var result  = ( !request.timedout && request.xhr.status )? this.parseStatus( request.xhr.status ) : null;
				var success = ( !request.timedout ) ? result.success : null;
				
				if( !success ){
					if( typeof request.options != 'undefined' ){
						if( typeof request.options.failure == 'undefined' ){
							standards.callFunction( '_createMessageBox',{
								msg : 'AJAX_FAILURE'
							});
							
							if( typeof request.options.afterFailure != 'undefined' ){
								request.options.afterFailure();
							}
						}
					}
				}
				Ext.getBody().unmask();
				
				
				this.callParent( arguments );
			}
		});
	}
	
	function _override_ajaxTimeOut(){
		Ext.override( Ext.data.proxy.Ajax, {
			timeout: 100000
		});
		
		Ext.override( Ext.form.action.Action, {
			timeout: 100
		});
	}
	
	function _override_store(){
		Ext.override( Ext.data.Store, {
			retain1 : function(){
				this.removeAll();
				this.add({});
			}
		});
	}
	
	function _override_pagingTbar(){
		Ext.override( Ext.toolbar.Paging, {
			doRefresh : function(){
				var store    = this.store;
				var limit    = this.items.items[0];
				var pageSize = Ext.getConstant( 'DEF_PAGE_SIZE' );
				
				store.currentPage = 1;
				// store.proxy.extraParams.limit = pageSize;
				limit.setValue( pageSize );
				return true;
			}
		});
	}
	
	function _override_timeField(){
		Ext.override( Ext.form.field.Time, {
			getSubmitValue: function(){
				if( value = this.getValue() ){
					var hour  = value.getHours();
					var mins  = value.getMinutes();
					
					var zero1 = ( parseInt( hour, 10 ) < 10 )? '0' : '';
					var zero2 = ( parseInt( mins, 10 ) < 10 )? '0' : '';
					
					return zero1+parseInt( hour, 10 )+':'+zero2+parseInt( mins, 10 )+':00';
				}
			}
		});
	}
	
	function _define_pagingComboPicker(){
		Ext.define('define_pagingComboPicker', {
			extend: 'Ext.toolbar.Paging'
			,getPagingItems: function() {
				return [
					{	itemId		: 'first'
						,hidden		: true
					}
					,{  itemId		: 'prev'
						,hidden		: true
					}
					,{  xtype		: 'numberfield'
						,itemId		: 'inputItem'
						,hidden		: true             
					}
					,{  xtype		: 'label'
						,itemId		: 'afterTextItem'
						,hidden		: true
					}
					,{  itemId		: 'next'
						,disabled	: false
						,scope		: this
						,handler	: this.moveNext
						,text		: 'Load more'
						,width		: '100%'
					}
					,{  itemId  	: 'last'
						,hidden		: true
					}
					,{  itemId		: 'refresh'
						,hidden		: true
					}
				];
			}
		});
	}
	
	function _define_pagingTbar(){
		Ext.define('define_pagingTbar', {
			extend		: 'Ext.toolbar.Paging'
			,dock		: 'bottom'
			,displayInfo: true
			,getPagingItems: function(){
				var items = this.callParent( arguments );
				var store = this.store;
				/** change iconCls for buttons to bootstap **/
				items[0].iconCls = 'glyphicon glyphicon-step-backward';
				items[1].iconCls = 'glyphicon glyphicon-chevron-left';
				items[7].iconCls = 'glyphicon glyphicon-chevron-right';
				items[8].iconCls = 'glyphicon glyphicon-step-forward';
				items[10].iconCls= 'glyphicon glyphicon-refresh';
				
				items.unshift(
					standards.callFunction(	'_createNumberField',{
						fieldLabel		: 'Number of rows per page'
						,labelSeparator	: ''
						,number			: true
						// ,notDeci		: true
						,useThousandSeparator : false
						,currencySymbol : ""
						,allowDecimals : false
						,hidden			: !this.hasNumRows
						,submitValue	: false
						,value			: Ext.getConstant( 'DEF_PAGE_SIZE' )
						,labelWidth		: 180
						,width			: 225
						,style			: 'margin-left:5px'
						,noEnterListeners : true
						,listeners:{
							change: function(){
							if( !this.isValid() ) this.setValue( 1 );
								var size;
								/** get field value **/
								size = parseInt( this.value, 10 );
								/** sets store page to 1 **/
								if( size ){
									store.currentPage = 1;
									/** sets store size to field value **/
									store.pageSize = size;
									/** loads the store **/
									store.load({
										params : {
											limit : size
										}
									});
								}
							}
							,blur: function( me ){
								/** resets limit field **/
								if( me.value == '' || parseInt( me.value, 10 ) == 0 ){
									me.reset();
								}
								
								
							}
						}
					})
				);
				
				return items;
			}
		});
	}
	
	function _applies( params ){
		var constantVariables = constants.getConstants( params );
		standards.callFunction( '_setBaseurl', { baseurl: params.baseurl } );
		
		Ext.apply( Ext, {
			getCurrentRow : function( id ){
				if( grid = Ext.getCmp( id ) ){
					if( grid.xtype == 'grid' ){
						var store  = grid.store;
						var select = grid.getSelectionModel().getSelection()[0];
						var index  = store.indexOf( select );
						return {
							grid   : grid
							,store : store
							,index : index
							,data  : ( index != -1 )? store.getAt( index ).data : {}
						};
					}
				}
				
				return false;
			}
			,ifUndefined : function( option1, option2 ){
				return ( typeof option1 != 'undefined' )? option1 : option2;
			}
			,getConstant : function( index ){
				return constantVariables[index];
			}
			,objectProtoType : function( params ){
				for( x in params ){
					this[x] = params[x];
				}
				this.confirmDelete = function( ajaxParams ){
					standards.callFunction( '_createMessageBox', {
						msg 	: ( typeof ajaxParams.msg != 'undefined' )? ajaxParams.msg : 'DELETE_CONFIRM'
						,action	: 'confirm'
						,fn		: function( answer ){
							if( answer == 'yes' ){
								if( Ext.ifUndefined( ajaxParams.autoParams, false ) ){
									var parameters = params;
									for( x in ajaxParams.params ){
										parameters[x] = ajaxParams.params[x];
									}
									delete ajaxParams.params;
									ajaxParams['params'] = parameters;
								}
								
								Ext.Ajax.request( ajaxParams );
							}
						}
					});
				}
			}
		} );
	}
	
	function _prototypes(){
		String.prototype.getForm = function( getCmpOnly ){
			var myForm  = false;
			
			if( form   = Ext.getCmp( 'mainFormPanel' + this ) ){
				myForm = form;
			}
			else{
				myForm = Ext.getCmp( 'mainPanel' + this ).down( 'form' );
			}
			
			if( myForm ){
				return ( Ext.ifUndefined( getCmpOnly, false ) )? myForm : myForm.getForm();
			}
		};
		
		String.prototype.getButton = function( button ){
			var id = '';
			
			if( button == 'form' ){
				id = 'btnForm';
			}
			else if( button == 'list' ){
				id = 'btnList';
			}
			else if( button == 'save' ){
				id = 'saveButton';
			}
			else if( button == 'reset' ){
				id = 'resetButton';
			}
			else if( button == 'excel' ){
				id = 'btnExcel';
			}
			else if( button == 'pdf' ){
				id = 'btnPDF';
			}
			
			if( cmp = Ext.getCmp( id + '' + this ) ){
				return cmp;
			}
		};
	}
	
	function _define_numberField(){
		Ext.define('widget.numericfield', 
		{
			extend: 'Ext.form.field.Number'
			,currencySymbol: Ext.getConstant('DEF_CURRENCY')
			,thousandSeparator: ','
			,alwaysDisplayDecimals: true
			,fieldStyle: 'text-align: right;'
			,initComponent: function(){
				if (this.useThousandSeparator && this.decimalSeparator == ',' && this.thousandSeparator == ',') 
					this.thousandSeparator = '.';
				else 
					if (this.allowDecimals && this.thousandSeparator == '.' && this.decimalSeparator == '.') 
						this.decimalSeparator = ',';
				
				this.callParent(arguments);
			}
			,setValue: function(value){
				widget.numericfield.superclass.setValue.call(this, value != null ? value.toString().replace('.', this.decimalSeparator) : value);
				
				this.setRawValue(this.getFormattedValue(this.getValue()));
			}
			,getFormattedValue: function(value){
				if (Ext.isEmpty(value) || !this.hasFormat()) 
					return value;
				else 
				{
					var neg = null;
					
					value = (neg = value < 0) ? value * -1 : value;
					value = this.allowDecimals && this.alwaysDisplayDecimals ? value.toFixed(this.decimalPrecision) : value;
					
					if (this.useThousandSeparator) 
					{
						if (this.useThousandSeparator && Ext.isEmpty(this.thousandSeparator)) 
							throw ('NumberFormatException: invalid thousandSeparator, property must has a valid character.');
						
						if (this.thousandSeparator == this.decimalSeparator) 
							throw ('NumberFormatException: invalid thousandSeparator, thousand separator must be different from decimalSeparator.');
						
						value = value.toString();
						
						var ps = value.split('.');
						ps[1] = ps[1] ? ps[1] : null;
						
						var whole = ps[0];
						
						var r = /(\d+)(\d{3})/;
						
						var ts = this.thousandSeparator;
						
						while (r.test(whole)) 
							whole = whole.replace(r, '$1' + ts + '$2');
						
						value = whole + (ps[1] ? this.decimalSeparator + ps[1] : '');
					}
					
					return Ext.String.format('{0}{1}{2}', (neg ? '-' : ''), (Ext.isEmpty(this.currencySymbol) ? '' : this.currencySymbol + ' '), value);
				}
			}
			/**
			 * overrides parseValue to remove the format applied by this class
			 */
			,parseValue: function(value){
				//Replace the currency symbol and thousand separator
				return widget.numericfield.superclass.parseValue.call(this, this.removeFormat(value));
			}
			/**
			 * Remove only the format added by this class to let the superclass validate with it's rules.
			 * @param {Object} value
			 */
			,removeFormat: function(value){
				if (Ext.isEmpty(value) || !this.hasFormat()) 
					return value;
				else 
				{
					value = value.toString().replace(this.currencySymbol + ' ', '');
					
					value = this.useThousandSeparator ? value.replace(new RegExp('[' + this.thousandSeparator + ']', 'g'), '') : value;
					
					return value;
				}
			}
			/**
			 * Remove the format before validating the the value.
			 * @param {Number} value
			 */
			,getErrors: function(value){
				return widget.numericfield.superclass.getErrors.call(this, this.removeFormat(value));
			}
			,hasFormat: function(){
				return this.decimalSeparator != '.' || (this.useThousandSeparator == true && this.getRawValue() != null) || !Ext.isEmpty(this.currencySymbol) || this.alwaysDisplayDecimals;
			}
			/**
			 * Display the numeric value with the fixed decimal precision and without the format using the setRawValue, don't need to do a setValue because we don't want a double
			 * formatting and process of the value because beforeBlur perform a getRawValue and then a setValue.
			 */
			,onFocus: function(){
				if(!this.getValue() && !this.readOnly){
					// this.setRawValue('');
					if( this.allowNull ){
						if( this.getValue() == null ){
							console.log( "test True Focus" );
							this.setRawValue(null);
						}else{
							console.log( "test False Focus" );
							this.setRawValue( 0 );
						}
					}
					else{
						this.setRawValue(0);
					}
				}
				
				if(!this.readOnly){
					this.setRawValue(this.removeFormat(this.getRawValue()));
				}
				
				this.callParent(arguments);
			}
			,onBlur: function(){
				if(!this.getValue() && !this.readOnly){
					if( this.allowNull ){
						if( this.getValue() == null ){
							console.log( "test True" );
							this.setRawValue(null);
						}else{
							console.log( "test False" );
							this.setRawValue( 0 );
						}
					}
					else{
						this.setRawValue(0);
					}
				}
				
				if(!this.readOnly){
					this.setRawValue(this.removeFormat(this.getRawValue()));
				}
				
				this.callParent(arguments);
			}
		});
	}
	
	
	return {
		applied: function( params ){
			baseurl       	 = params.baseurl;
			Ext.Ajax.timeout = 180000000;
			delete Ext.tip.Tip.prototype.minWidth;
			
			/** APPLIES **/
			_applies( params );
			
			/** PROTOTYPES **/
			_prototypes();
			
			/** OVERRIDES **/
			_override_formField();
			_override_textField();
			_override_checkBox();
			_override_gridColumn();
			_override_cellEdit();
			_override_formPanel();
			_override_formSubmit();
			_override_AJAX( params.initHeader );
			_override_store();
			_override_timeField();
			_override_pagingTbar();
			_override_ajaxTimeOut();
			
			/** DEFINES **/
			_define_pagingComboPicker();
			_define_pagingTbar();
			_define_numberField();
			
		}
	}
}();