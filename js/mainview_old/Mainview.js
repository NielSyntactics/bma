var mainView = function(){
	var _baseurl, _euName, _logo, _companyName, _tagLine, _acronym, _sysTime, _logoPath, _euID, _lName, _fName;
	var loadModulesProgressBar;
	var loadModulesProgressWin;
	var loadModulesProgressCount = 0;
	var initTime;
	var checking;
	
	var exts 		  = '_mainView';
	var menuArray 	  = new Array(4);
	var alreadyClick  = false;
	var dragged 	  = 0;
	var clicked 	  = 0;
	
	
	
	function init( params ){
	window.location.hash="no-back-button";
	window.location.hash="Again-No-back-button";//again because google chrome don't insert first hash into history
	window.onhashchange=function(){window.location.hash="";}
		var date = new Date();
		var sec  = date.getUTCSeconds();
		var min  = date.getUTCMinutes();
		var hur  = date.getUTCHours();
		var day  = date.getUTCDay();
		var mon  = date.getUTCMonth();
		var yer  = date.getUTCFullYear().toString();
		var initHeader = sec+''+mon+''+hur+''+yer.substring( yer.length-1, yer.length )+''+min+''+day;
		
		Ext.Ajax.request({
			method:'post'
			,url: params.baseurl + 'mainview/initializeAndLoadModules'
			,headers:{
				initHeader : initHeader
			}
			,success:function( response ){
				var result      = Ext.decode( response.responseText );
				var initVar		= result.initVar;
				var modules		= result.modules;
				
				_baseurl 		= params.baseurl;
				_euName  		= initVar.bmapsUname;
				_lName			= initVar.lname;
				_fName			= initVar.fname;
				// _logo  			= initVar.logoPath+'bontilao.png';
				_logo  			= initVar.logoPath + initVar.logoName;
				_sysTime  		= initVar.sysTime;
				_euID  			= initVar.euID;
				_config			= initVar;
				
				_config['baseurl'] 		= _baseurl;
				_config['initHeader'] 	= initHeader;
				
				if( typeof initVar.initHeader != 'undefined' ){
					_config['initHeader'] = initVar.initHeader;
				}
				
				loadModulesProgressBar =Ext.create( 'Ext.ProgressBar',{
											text:'Loading...'
											,width:300
										});
				
				loadModulesProgressWin =Ext.create('Ext.window.Window',{
											title:'Loading Modules...'
											,closable:false
											,resizable:false
											,draggable:false
											,items:[
												loadModulesProgressBar
											]
										});
				
				
				loadModulesProgressWin.show();
				
				for(var x=0; x<menuArray.length; x++){
					menuArray[x] = new Array();
				}
				
				extLoaderCallBack({
					modules : modules
					,counter: 0
				});
			}
			,failure: function(){
				standards.callFunction( '_createMessageBox',{
					icon:	'error'
					,msg:	'Modules not loaded, Please make sure that you are connected with the network.'	
				});
			}
		});
	}
	
	function extLoaderCallBack( params ){
		extLoader( params.modules[params.counter], true, params.modules.length, function(){
			loadModulesProgressCount++;
			loadModulesProgressBar.updateProgress( loadModulesProgressCount / params.modules.length,'Loading '+loadModulesProgressCount+' of '+params.modules.length );
			
			if( loadModulesProgressCount > 2 ){
				for( var x = loadModulesProgressCount; x<params.modules.length; x++ ){
					extLoader( params.modules[x], false, params.modules.length );
				}
			}
			else{
				extLoaderCallBack({
					modules : params.modules
					,counter: loadModulesProgressCount
				});
			}
		});
	}
	
	function extLoader( module, async, length, callback ){
		var onLoad;
		
		if( async ){
			onLoad = callback;
		}
		else{
			onLoad = function(){
				if( loadModulesProgressCount == length-1 ){
					overrides.applied( _config );
					createViewport();
					loadModulesProgressWin.destroy( true );
					Ext.resumeLayouts( true );
				}
				
				loadModulesProgressCount++;
				loadModulesProgressBar.updateProgress( loadModulesProgressCount / length,'Loading '+loadModulesProgressCount+' of '+length );
			}
			
			/** stores loaded modules into array. **/
			if( typeof module.mtype != 'undefined' ){
				menuArray[ parseInt( module.mtype, 10 ) ].push( module );
			}
			
		}
		if( module ){
			Ext.Loader.loadScript({
				url : _baseurl+'js/'+module.mlink
				,scriptChainDelay:true
				,scope:this
				,onLoad: onLoad
				,onError: function(){
					loadModulesProgressWin.destroy( true );
					
					/** cannot call stanrdards yet. **/
					Ext.MessageBox.show({
						icon	: Ext.MessageBox.INFO
						,buttons: Ext.MessageBox.OK
						,title	: 'SYSTEM MESSAGE'
						,msg	: 'Some js files are not loaded correctly, system will logout, please try to login again.'	
						,closeAction:'destroy'
						,fn		: function( btn ){
							window.location.href = _baseurl+'home/logout/1'
						}
					});
				}
			});
		}
		else{
			createViewport();
			loadModulesProgressWin.destroy( true );
			Ext.resumeLayouts( true );
		}
	}
	
	function createViewport(){
		Ext.suspendLayouts();
		
		try{
			return Ext.create('Ext.container.Viewport',{
				layout:{
					type:'border'
				}
				,items:[
					{	region:'north'
						,style: "border-bottom: 5px solid #FDE6CE;"
						,items:[
							{	xtype: 'panel'
								,html: headerhtml()
							}
						]
					}
					,{
						region: 'center'
						,xtype: 'tabpanel'
						,id:'mainTab' + exts
						,layout:'fit'
						,tabBar: {
							listeners:{
								afterrender : function( me ){
									me.el.on('contextmenu', function( e,b ) {
										var tabIndex = null;
										
										if( e.target.getAttribute("class").toString().indexOf('x-tab') != -1 ){
											var id    = e.target.getAttribute("id").toString();
											var items = Ext.getCmp( 'mainTab_mainView' ).tabBar.items.items;
											
											for( var x in items ){
												if( id.match( items[x].id ) ){
													tabIndex = x;
													break;
												}
											}
										}
										
										rightClickMenu( me.items.items, tabIndex ).showAt( e.getXY() );
										e.stopEvent();
									});
								}
							}
						}
						,items: [
							{	title: 'Back To Menu'
								,border:false
								,id: 'menu' + exts
								,autoScroll:true
								,overFlowX:'scroll'
								,overFlowY:'scroll'
								,cls:'dashbordMenu'
								,tbar: Ext.create( 'Ext.toolbar.Toolbar', {
									cls: 'toolBButton'
									,height: 40
								} )
							}
						]
					}
					,{
						region: 'south'
						,xtype: 'panel'
						,layout: {
							type: 'hbox'
							,align: 'center'
							,pack: 'center'
						}
						,id: 'mainMenuBtn' + exts
						,style: 'margin: 0 auto;'
						,cls: 'btn-form-mainMenu'
					}
				],
				listeners:{
					afterrender: function(){
						
						fncRunTask();
						
						if( mainTab = Ext.getCmp( 'mainTab' + exts ) ){
							mainTab.tabBar.items.items[0].hide();
						}
						
						// Ext.suspendLayouts();
						initializeMenu();
						
						// addlocalStorageOpenedBrowser();
						
					}
				}
			});
		}catch( err ){
			Ext.Ajax.request({
				url: _baseurl + 'home/logout/1'
				,method:'post'
				,noMask:true
			});
		}
	}
	
	function headerhtml(){
		_acronym = _euID == 1 ? 'HOME' : _acronym;
		
		var initTime = new Date( _sysTime );
		var runners  = new Ext.util.TaskRunner();
		runners.start({	
			interval: 30000
			,run: function() {
				if(initTime){
					initTime = new Date( initTime.valueOf() + 30000 );
					if( document.getElementById( 'systemTime' ) ){
						document.getElementById( 'systemTime' ).innerHTML = Ext.Date.format( initTime,'F j, Y g:i A' );
						
					}
				}
			}
		});
		
		return '<table width="100%" height="70px" style="background-color:#FDE6CE; color: #512A03; ">' +
					'<tr>'+
						'<td style="width:50%">'+
							'<table>'+
								'<tr>'+
									'<td><img style="margin:5px; height: 60px; width: 130px;" id="logoId" class="clearfix" src="'+_logo+'" /></td>'+
								'</tr>'+
							'</table>'+
						'</td>'+
						'<td valign="bottom">'+
							'<div style="font-size: 17px; margin-right:5px; float: right; line-height:5px; "/>Welcome, ' + _fName + '</div><br>' +
							'<div style="font-size: 12px; margin-right:5px; float: right;" class="clearfix" /><em class="date-box" id="systemTime">'+Ext.Date.format( initTime, 'F j, Y g:i A' )+'</em></em> </div><br>'+
							'<a id="btnLogoutMainView" style="font-size: 17px; margin-right:5px; float: right;" href="'+_baseurl+'home/logout/1">Logout</a></p></div>'+
						'</td>'+
					'</tr>'+
			   '</table>';
	}

	var allowActiveTab = 1;

	function fncRunTask(){
		Ext.TaskManager.start( {
			run : function(){
				
				if ( allowActiveTab == 1 ) 
				{
					$( '#2_mainView' ).click()
					allowActiveTab = 0
				}
				
				Ext.Ajax.request( {
					url : _baseurl + 'home/checkIfLogin'
					,noMask : true
					,method : 'post'
					,success : function( response, options ){

						if( parseInt( response.responseText, 10 ) == 0 ){
							var mask = new Ext.LoadMask( Ext.getBody(), { msg : "Session has expired, system will now perform auto logout function..." } );
							mask.show();
							Ext.Ajax.request( {
								url : _baseurl + 'home/autoLogout'
								,noMask : true
								,success : function( response, options ){
									var resp = Ext.decode( response.responseText );
									if( resp ){
										mask.hide();
										window.location.href = _baseurl;
									}
								}
							} );
						}
					}
				} );
			}
			,interval:30000
		} );
	}
	
	
	
	function initializeMenu(){
		var hasShow 		= 0;
		var mainMenuButton 	= Ext.getCmp( 'mainMenuBtn' + exts );
		var moduleMenu 		= Ext.getCmp( 'menu' + exts );
		var mainTab 		= Ext.getCmp( 'mainTab' + exts );
		
		// var buttonLabel 	= ['Parents/Student\'s Portal','Teacher\'s Portal','Admin'];
		var buttonLabel 	= ['Account Card','Admin','Report'];
		var buttonID 		= ['btnHome','btnReports','btnAdmin'];
		var menuContainerID	= ['menuHome','menuReports','menuAdmin'];
		var menuDivID		= ['divHome','divReports','divAdmin'];
		
		for( var x=0; x<4; x++ ){
			/* check if there are module access for home menu */
			if( menuArray[x] ){
				if( menuArray[x].length > 0 ){
					/* added Home main menu */
					mainMenuButton.add({
						xtype	: 'button'
						,text	: buttonLabel[x]
						,id		: buttonID[x] + exts
						,cls	: ( hasShow > 0 ) ? 'btn-mainMenu' : 'btn-mainMenu-Active'
						,height	: 65
						,handler: menu(x)
					});
					
					/* added home module button container */
					// return false
					moduleMenu.add({
						xtype	: 'container'
						,style	: 'padding-top: 25px;'
						,style	: 'margin: 0 auto;'
						,width	: 550
						,id		: menuContainerID[x] + exts
						,hidden	: hasShow > 0
						,listeners: {
							afterrender : afterrender( x )
						}
					});
					hasShow++;
				}
			}
		}

		mainMenuButton.add({	
			xtype:'button'
			,text:'Help'
			,id:'btnHelp'+exts
			,cls:'btn-mainMenu'
			,height: 65
			,handler:function(){
				showMenu( 4 );
				
				if( mainTab.getComponent( 'mainPanel_Help' ) ){
					mainTab.setActiveTab( 'mainPanel_Help' );
					return;
				}
				
				Ext.suspendLayouts();
				Help.initMethod({
					baseurl: _baseurl
					,pageTitle: 'Help'
					,module: '_Help'
				});
				
			}
		});
		
		function afterrender( x ){
			return function(){
			
				/* append a div container for the menu */
				Ext.getCmp( menuContainerID[x] + exts ).el.setHTML( '<div id="'+menuDivID[x] + exts + '" class="menuContainer"></div>' );
				/* append module buttons */
				
				Ext.each( menuArray[x], function( data, index ){
					var idmodule = data.idmodule
					var title	 = data.module
					var str 	 = data.mlink
					var slash 	 = str.indexOf( '/' )
					var period 	 = str.indexOf( '.' )
					var mlink 	 = str.substring( slash+1, period )
					var tabID 	 = 'mainPanel_' + mlink;
					
					
					$( '#'+menuDivID[x] + exts ).append( '<div id="' + idmodule + exts + '"> <div><img src = "' + _baseurl + 'images/menu/' + idmodule + '.png' + '"/> <p><b>' + title + '</b></p> </div></div>' );
					$( '#'+menuDivID[x] + exts ).trigger( "ss-rearrange" );
					$( '#' + idmodule + exts ).on( 'click', function(){
						if( dragged == 1 ){
							return;
						}
						if( mainTab.getComponent( tabID ) ){
							mainTab.setActiveTab( tabID );
							return 0;
						}
						
						var clas = eval( mlink );
						
						Ext.suspendLayouts();
						
						clas.initMethod({
							canSave		: !!parseInt( data.save, 10 )
							,canEdit	: !!parseInt( data.edit, 10 )
							,canDelete	: !!parseInt( data.del, 10 )
							,canPrint	: !!parseInt( data.print, 10 )
							,baseurl	: _baseurl
							,idmodule	: idmodule
							,module		: '_' + mlink
							,route		: _baseurl + str.substring( 0, period ) +'/'
							,pageTitle	: title
						});
					});
					$( '#' + idmodule + exts ).hover( function(){
						clicked = 1;
					}, function(){
						clicked = 0;
					} )
				} );
				
				
				$( "#"+menuDivID[x] + exts ).shapeshift({
					columns: 5
				});
				/* this is trigged when the object is dragged, this is to prevent the on click of the container from triggering */
				$("#"+menuDivID[x] + exts).on('ss-arranged', function(){
					if( clicked == 1 ){
						dragged = 1;
					}
				});
				/* this is trigged when the object is already dropped, this is to put back the status to not dragged to enable container on click trigger */
				$("#"+menuDivID[x] + exts).on('ss-drop-complete', function(){
					dragged = 0;
					clicked = 0;
					var pData = $( '#'+menuDivID[x] + exts + ' > div' )
					var setOrder = new Array();
					for( var i = 0; i < pData.length; i++ ){
						var data = pData[i].id.split('_');
						setOrder.push({
							'mtype': x
							,'idmodule': data[0]
							,'sorter': i + 1
						});
					}
					
					Ext.Ajax.request({
						url: _baseurl + 'home/reorderMenu'
						,method: 'post'
						,noMask: true
						,params: {
							amoduleData: Ext.encode( setOrder )
							,mtype: x
						}
					})
				});

				// if( x == 0 ){
					
				// 	if( dragged == 1 ){
				// 		return;
				// 	}
				// 	if( mainTab.getComponent( "accountcard" ) ){
				// 		mainTab.setActiveTab( "accountcard" );
				// 		return 0;
				// 	}
					
				// 	var clas = eval( mlink );
					
				// 	Ext.suspendLayouts();
					
				// 	clas.initMethod({
				// 		canSave		: !!parseInt( data.save, 10 )
				// 		,canEdit	: !!parseInt( data.edit, 10 )
				// 		,canDelete	: !!parseInt( data.del, 10 )
				// 		,canPrint	: !!parseInt( data.print, 10 )
				// 		,baseurl	: _baseurl
				// 		,idmodule	: idmodule
				// 		,module		: '_' + mlink
				// 		,route		: _baseurl + str.substring( 0, period ) +'/'
				// 		,pageTitle	: title
				// 	});
				// }
			}
		}
		
		function menu( x ){
			return function(){
				showMenu( x );
			}
		}
		
	}
	
	function showMenu( mtype ){
		
		if( home = Ext.getCmp( 'menuHome' + exts ) ){
			home.setVisible( mtype == 0 );
		}
		if( reports = Ext.getCmp( 'menuReports' + exts ) ){
			reports.setVisible( mtype == 1 );
		}
		if( admin = Ext.getCmp( 'menuAdmin' + exts ) ){
			admin.setVisible( mtype == 2 );
		}
		if( admin = Ext.getCmp( '' + exts ) ){
			admin.setVisible( mtype == 3 );
		}
		
		if( btnHome = Ext.getCmp( 'btnHome' + exts ) ){
			btnHome.addCls( ( ( mtype == 0 )? 'btn-mainMenu-Active' : 'btn-mainMenu' ) );
			btnHome.removeCls( ( ( mtype != 0 )? 'btn-mainMenu-Active' : 'btn-mainMenu' ) );
		}
		
		if( btnReports = Ext.getCmp( 'btnReports' + exts ) ){
			btnReports.addCls( (( mtype == 1 )? 'btn-mainMenu-Active' : 'btn-mainMenu' ) );
			btnReports.removeCls( (( mtype != 1 )? 'btn-mainMenu-Active' : 'btn-mainMenu' ) );
		}
		
		if( btnAdmin = Ext.getCmp( 'btnAdmin' + exts ) ){
			btnAdmin.addCls( (( mtype == 2 )? 'btn-mainMenu-Active' : 'btn-mainMenu' ) );
			btnAdmin.removeCls( (( mtype != 2 )? 'btn-mainMenu-Active' : 'btn-mainMenu' ) );
		}
		
		if( helpBtn = Ext.getCmp( 'helpBtn' + exts ) ){
			helpBtn.addCls( (( mtype == 3 )? 'btn-mainMenu-Active' : 'btn-mainMenu' ) );
			helpBtn.removeCls( (( mtype != 3 )? 'btn-mainMenu-Active' : 'btn-mainMenu' ) );
		}
		
		Ext.getCmp( 'mainTab' + exts ).setActiveTab( 'menu' + exts );
	}
	
	function rightClickMenu( items, tabIndex ){
		function CALLBACK( x, callback ){
			callback( x );
		}
		
		var tabs    = new Array();	
		var maintab = Ext.getCmp( 'mainTab_mainView' );
		for( var x=0; x<items.length; x++ ){
			CALLBACK( x, function( X ){
				tabs.push({	plain	: true
							,text	: '<div style="height:15px">'
											+'<span style="display:block; float:left; margin-left:30px;">'
												+'<font class="x-menu-item-text">'+((items[X].active)? '<font color = #2980b9>'
													+'<b>'+items[X].text+'</b></font>' : items[X].text)
												+'</font>'
											+'</span>' +((X == 0)? '' : '<span style="display:block; float:right; color:#2980b9;"><button class="menuX glyphicon glyphicon-remove" style="padding: 0;border: none;background: none; visibility:hidden;" id="X_closeAll_'+X+'" onclick="mainView.ClOSE_TAB('+X+')"></button></span>')+'</div>'
							,handler: function(){
								if( !alreadyClick ){
									maintab.setActiveTab( X );
								}
							}
							,listeners:{
								afterrender: function( container ){
									container.el.on( 'mouseover', function() {
										if( X != 0 ){
											document.getElementById( 'X_closeAll_' + X ).style.visibility = "visible";
										}
									});
									container.el.on( 'mouseout', function() {
										if( X != 0 ){
											document.getElementById( 'X_closeAll_' + X ).style.visibility = "hidden";
										}
									});
								}
							}
				});
			});
		}
		
		tabs.push('-');
		
		if( tabIndex != null ){
			tabs.push({
				plain	: true
				,text	: '<div style="height:15px">'
									+'<span style="display:block; float:left; margin-left:30px">'
										+'<font class="x-menu-item-text">Close All But This</font>'
									+'</span>'
								+'</div>'
				,handler: function(){
					Ext.suspendLayouts();
					
					for( var x = items.length-1; x>0; x-- ){
						if( x == tabIndex ){
							continue;
						}
						else{
							maintab.remove( x );
						}
					}
					
					if( tabIndex == 0 ){
						Ext.getCmp( 'Accordion_mainView' ).collapse();
					}
					
					Ext.resumeLayouts(true);
				}
			});
		}
		
		
		tabs.push({
			plain	: true
			,text	: '<div style="height:15px">'
								+'<span style="display:block; float:left; margin-left:30px">'
									+'<font class="x-menu-item-text">Close All</font>'
								+'</span>'
							+'</div>'
			,handler: function(){
				Ext.suspendLayouts();
				
				for( var x = items.length-1; x>0; x-- ){
					maintab.remove( x );
				}
				
				Ext.resumeLayouts(true);
			}
		});
		
		return new Ext.menu.Menu({
			items : tabs
			,plain:false
			,listeners:{
				beforehide: function(){
					alreadyClick = false;
					this.destroy( true );
				}
			}
		});
	}
	
	/*	function para dili maka multiple login sa isa ka unit
		addlocalStorageOpenedBrowser,
		removeEmptyArray,
		checkIFwindowExists,
		findMaxIndex,
		removeLocalStorageOpenedBrowser
		
		note: naa pod ni sa login_view.php
	*/
	
	function addlocalStorageOpenedBrowser(){
		removeEmptyArray();
		var list = JSON.parse(localStorage.getItem('openedWindows_'+baseurl)) || [];
		var index = findMaxIndex();
		var added = false;
		
		if(!window.name){
			var windowName = baseurl+index;
			window.name = windowName;
			added = true;
		}
		var hasDup = false;
		list.forEach(function(data,x){
			if(data != null && data.window_name == window.name){
				hasDup = true;
			}
		});
		if(!hasDup && added){
			list.push({
				'window_name' : windowName,
				'index'		  : index
			});
			localStorage.setItem('openedWindows_'+baseurl,JSON.stringify(list));
		}else{
			if(!checkIFwindowExists()){
				var str = String(window.name).split('/');
				list.push({
					'window_name' : window.name,
					'index'		  : str[str.length-1]
				});
				localStorage.setItem('openedWindows_'+baseurl,JSON.stringify(list));
			}
		}
	}
	
	function removeEmptyArray(){
		var list = JSON.parse(localStorage.getItem('openedWindows_'+baseurl)) || [];
		var newList = new Array();
		list.forEach(function(data,x){
			if(data != null){
				newList.push(data);
			}
		});
		localStorage.setItem('openedWindows_'+baseurl,JSON.stringify(newList));
	}
	
	function checkIFwindowExists(){
		var list = JSON.parse(localStorage.getItem('openedWindows_'+baseurl)) || [];
		var exists = false;
		list.forEach(function(data,x){
			if(data != null && data.window_name == window.name){
				exists = true;
			}
		});
		return exists;
	}
	
	function findMaxIndex(){
		var list = JSON.parse(localStorage.getItem('openedWindows_'+baseurl)) || [];
		var max = 1;
		if(list.length == 0){
			return max;
		}else{
			list.forEach(function(data,x){
				if(data != null && data.window_name && data.index > 0){
					if(data.index > max){
						max = data.index;
					}
				}
			});
			return max+1;
		}
	}
	
	function removeLocalStorageOpenedBrowser(){
		var list = Ext.decode(localStorage.getItem('openedWindows_'+baseurl)) || [];
		list.forEach(function(data,x){
			if(data.window_name != window.name){
				var win = window.open('',data.window_name);
				console.log(win);
				if(win.location.host){
					window.open(baseurl,data.window_name,'',false);
				}else{
					win.close();
				}
			}	
		});
		delete localStorage['openedWindows_'+baseurl];
	}
	
	return{
		initMethod: init
		
		,ClOSE_TAB: function(index){
			Ext.suspendLayouts();
			
			Ext.getCmp( 'mainTab_mainView' ).remove( index );
			Ext.resumeLayouts(true);
			
			// console.log( Ext.getCmp( 'mainTab_mainView' ).items.items[index].down('form').dirty );
			
			alreadyClick = true;
		}
	}
}();
