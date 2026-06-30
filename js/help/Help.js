var Help = function(){
	var module = '_Help';
	var baseurl;
	
	function mainPanel( config ){
		return standards.callFunction(	'_mainPanel' ,{
			config		: config
			,moduleType	: 'form'
			,isTabChild : true
			,pageTitle	: 'Help'
			,formItems:[
				{	xtype : 'panel',
					html  :  "<iframe src='"+baseurl+"css/manual/BMA Payments System.html' frameborder='0' width='100%' height='100%'></iframe>"
				}
			]
		});
	}
	
	return{
		initMethod:function( config ){
			
			route		= config.route;
			baseurl		= config.baseurl;
			module		= config.module;
			
			return mainPanel( config );
		}
	}
}();