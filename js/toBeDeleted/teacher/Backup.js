var Backup = function(){
	var baseurl, route, module, canDelete;
	
	function _init(){
		
		Ext.Ajax.request({
			url: route + 'backup'
			,success: function(response){
				standards.callFunction( '_createMessageBox', {
					msg : 'Backup database has been successfully created. To download a copy, please contact your system administrator.'
					,fn: function(){
						Ext.getCmp('mainPanel' + module).destroy();
					}
				});
			}
		});
		
		
	}
	
	function _mainPanel( config ){
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,moduleType	: 'form'
			,isCenter 	: false
			,noHeader 	: true
			,minHeight	: 700
			,minWidth 	: 1600
			,tbar:{
				noFormButton: true
				,noListButton: true
			}
			,formItems:[
				
			]
			,listeners: {
				afterrender : _init
			}
		});
	
	}
	
	
	function _getHistory(){
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