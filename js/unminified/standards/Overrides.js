/** Overrides
  * [Developer]
  * In Memory: Salrio T. Salcedo
  * Date Created: September 2015
  
  * [Description]
	Overrides Ext native behavior
	Contains : Overrides, Defines and Applies
  
  * [Modification]
    Almost each and every single day :D
	Except when Im gone :(
 **/

var overrides = function(){
	var baseurl;
	
	function _override_formField(){
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
			setValue : function( value ){
				if( this.isNumber ){
					var trim = ( Number( String( this.removeComma( value ) ) ) >= 0 )? this.removeComma( value ) : 0;
					value	 = this.getCurrency() + this.numberFormat( trim );
				}
				Ext.form.field.Text.superclass.setValue.call( this, value );
			}
			,setInitValue : function( value ){
				this.setValue( value );
				this.originalValue = value;
			}
			,onFocus : function() {
				if( this.isNumber ){
					if( !this.readOnly ){
						var trim  = this.removeCurrency( this.removeComma( this.getValue() ) );
						var value = ( parseFloat( trim, 10 ) == 0 )? '' : trim;
						Ext.form.field.Text.superclass.setValue.call( this, value );
					}
				}
			}
			,onBlur : function(){
				if( this.isNumber && !this.readOnly ){
					var value = this.removeComma( this.getValue() );
					this.setValue( this.numberFormat( this.removeCurrency( value ) ) );
				}
				this.callParent( arguments );
			}
			,getValue: function() {
				var value = this.callParent( arguments );
				if( this.isNumber ){
					if( value == '' ){
						value = 0;
					}
				}
				return value;
			}
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
			,getCurrency : function(){
				return ( this.hasCurrency )? Ext.getConstant( 'DEF_CURRENCY' )+' ' : '';
			}
			,removeCurrency : function( value ){
				return value.toString().replace( this.getCurrency(), '' );
			}
			,removeComma : function( value ){
				return value.toString().replace( /,/g, '' );
			}
			,numberFormat : function( value ){
				return Ext.util.Format.number( parseFloat( value, 10 ), ( this.isDecimal? '0,000.00' : '0,000' ) )
			}
			,getErrors: function( value ) {
				if( this.isNumber ){
					if( !this.allowBlank ){
						if( parseFloat( this.getSubmitValue(), 10 ) == 0 ){
							return ['must be greater than 0'];
						}
					}
				}
				return this.callParent( arguments );
			}
		});
	}
	
	function _override_comboBox(){
		Ext.override( Ext.form.field.ComboBox, {
			switchingToSibling: false
			,onKeyUp: function( e ){
				if( e.getKey()  == 13 ){
					if( this.getValue() ){
						if( !this.switchingToSibling ){
							this.switchingToSibling = true;
							this.callParent( arguments );
						}
						else{
							this.switchingToSibling = false;
							this.checkValidSibling( this );
						}
					}
					else{
						this.checkValidSibling( this );
					}
				}
				else{
					this.callParent( arguments );
				}
			}
			,checkValidSibling: function( field ){
				var sibling = field.nextSibling('field[readOnly=false]');
				
				if( sibling ){
					sibling.focus(false, 200);
				}
				else{
					
				}
			}
		});
	}
	
	function _override_checkBox(){
		Ext.override( Ext.form.field.Checkbox, {
			getSubmitValue: function(){
				return +this.value;
			}
		});
	}
	
	function _override_gridColumn(){
		Ext.override( Ext.grid.column.Column, {
			doSort:function( order ){
				var grid  		 = this.up( 'grid' );
				var store 		 = grid.store;
				var toolbarItems = grid.dockedItems.keys;
				var hasPaging    = false;
				
				for( var x in toolbarItems ){
					if( toolbarItems[x].indexOf( 'pagingToolBar_' ) != -1 ){
						var limit = Ext.getCmp( toolbarItems[x] ).items.items[0].getValue();
						if( limit < store.getTotalCount() ){
							hasPaging = true;
						}
					}
				}
				
				if( hasPaging && store.getCount() > 0){
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
		Ext.override( Ext.grid.plugin.CellEditing, {
			beforeEdit : function() {
				console.log(!this.grid.up( 'form' ).form.used);
				return !this.grid.up( 'form' ).form.used;
			}
		});
	}
	
	function _override_formPanel(){
		Ext.override( Ext.form.Basic, {
			submitEmptyText	: false
			,modify			: false
			,onEdit			: false
			,used			: false	//also used as datafilter for report panels
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
									standards.callFunction( '_createMessageBox', {
										msg : 'EDIT_USED'
									});
									
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
								field.store.load({
									callback: this.setValueCombobox( field, view[keys[x]] )
								});
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
				store.proxy.extraParams.limit = pageSize;
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
					standards.callFunction(	'_createTextField',{
						fieldLabel		: 'Number of rows per page'
						,labelSeparator	: ''
						,number			: true
						,notDeci		: true
						,submitValue	: false
						,value			: Ext.getConstant( 'DEF_PAGE_SIZE' )
						,labelWidth		: 180
						,width			: 225
						,style			: 'margin-left:5px'
						,noEnterListeners : true
						,listeners:{
							change: function(){
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
						msg 	: 'DELETE_CONFIRM'
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
			// _override_comboBox();
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
			
		}
	}
}();