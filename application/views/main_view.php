<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

   

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF8" />

<title id="browser_tab_title">Bontilao Montessori Academy Payments System</title>

<link rel="shortcut icon" type="image/x-icon" href="<?php echo base_url() ?>images/BMAlogoico.png"/>
<!--<link rel="stylesheet" href="<?php echo base_url() ?>css/fonts/myriadpro.css" type="text/css" media="screen" />
<link rel="stylesheet" href="<?php echo base_url() ?>css/fonts/segoeui.css" type="text/css" media="screen" /> -->
<link rel="stylesheet" type="text/css" href="<?php echo base_url() ?>css/style.css" />
<link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>js/ext/theme/build/KitchenSink/my-custom-theme/resources/KitchenSink-all.css">
<script type="text/javascript" src="<?php echo base_url(); ?>js/jquery.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>js/jquery-ui.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>js/jquery.touch.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>js/plugins/dragdrop/jquery.shapeshift.js"></script> 
<script type="text/javascript" src="<?php echo base_url() ?>js/ext/theme/ext/ext-all.js"></script>
<script type="text/javascript" src="<?php echo base_url() ?>js/sjcl.js"></script>
<script type="text/javascript" src="<?php echo base_url() ?>js/mainview/Mainview.js"></script>
<link rel="stylesheet" type="text/css" href="<?php echo base_url() ?>css/bootstrap/css/bootstrap.css" />

<?php
	$u_agent = $_SERVER['HTTP_USER_AGENT']; 
    $bname = 'Unknown';
    $platform = 'Unknown';
    $version= "";
	$ub = "";
	
    if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent)) 
    { 
        $ub = "msie"; 
    } 
    elseif(preg_match('/Firefox/i',$u_agent)) 
    { 
        $ub = "gecko"; 
    } 
    elseif(preg_match('/Chrome/i',$u_agent)) 
    { 
        $ub = "chrome"; 
    } 
    elseif(preg_match('/Safari/i',$u_agent)) 
    { 
        $ub = "safari"; 
    } 
    elseif(preg_match('/Opera/i',$u_agent)) 
    { 
        $ub = "opera"; 
    } 
    elseif(preg_match('/Netscape/i',$u_agent)) 
    { 
        $ub = "netscape"; 
    } 
?>

<style>
	.printer-icon{
		background-image: url(<?=base_url();?>images/icons/png/printer_icon.png) !important; 
	}
	.add {
		background-image: url(<?=base_url();?>images/icons/png/drop-add.gif) !important;
	}
	.refresh {
		background-image: url(<?=base_url();?>images/icons/png/refresh.gif) !important;
	}
	.delete {
		background-image: url(<?=base_url();?>images/icons/png/delete.png) !important;
	}		
	.delete2 {
		background-image: url(<?=base_url();?>images/icons/png/delete2.png) !important;
	}	
	.excel {
		background-image: url(<?=base_url();?>images/icons/png/icon_excel.png) !important;
	}		
	.pdf-icon{
		background-image: url(<?=base_url();?>images/icons/png/pdf.png) !important; 
	}
    .view {
        background-image: url(<?=base_url();?>images/icons/png/view_details.png) !important;
    }
	.search1 {
		background-image: url(<?=base_url();?>images/icons/png/search.png) !important;
	}
	.close1 {
		background-image: url(<?=base_url();?>images/icons/png/tab-close.gif) !important;
	}	
	.person {
		background-image: url(<?=base_url();?>images/icons/png/add16.gif) !important;
	}	
	.save {
		background-image: url(<?=base_url();?>images/icons/png/save.png) !important;
	}
	.email {
		background-image: url(<?=base_url();?>images/icons/png/email.png) !important;
	}
	.edit {
		background-image: url(<?=base_url();?>images/icons/png/edit_invoice.png) !important;
	}
	.edit2 {
		background-image: url(<?=base_url();?>images/icons/png/edit_invoice2.png) !important;
	}
	.pass {
		background-image: url(<?=base_url();?>images/icons/png/hmenu-lock.png) !important;
	}
	.pass2 {
		background-image: url(<?=base_url();?>images/icons/png/hmenu-lock2.png) !important;
	}
	.modu {
		background-image: url(<?=base_url();?>images/icons/png/form.png) !important;
	}
	.modu2 {
		background-image: url(<?=base_url();?>images/icons/png/form2.png) !important;
	}
	.loca {
		background-image: url(<?=base_url();?>images/icons/png/locationH.png) !important;
	}
	.loca2 {
		background-image: url(<?=base_url();?>images/icons/png/locationH2.png) !important;
	}
	.menu_home {
		background-image: url(<?=base_url();?>images/home2.png) !important;
	}
	.menu_po {
		background-image: url(<?=base_url();?>images/po32.png) !important;
	}
	.menu_receiving {
		background-image: url(<?=base_url();?>images/receive2.png) !important;
	}
	.menu_releasing {
		background-image: url(<?=base_url();?>images/releasing2.png) !important;
	}
	.menu_admin {
		background-image: url(<?=base_url();?>images/admin22.png) !important;
	}
	.menu_inventory {
		background-image: url(<?=base_url();?>images/inventory2.png) !important;
	}
	.node {
		background-image: url(<?=base_url();?>images/icons/png/sched_check.png) !important;
	}
	.list {
		background-image: url(<?=base_url();?>images/icons/png/payment-sum.png) !important;
	}
	.receipt {
		background-image: url(<?=base_url();?>images/icons/png/receipt.png) !important;
	}
	.menu {
		border: 1px solid #81A4D0; 
	}
	
	.historySearch .x-form-item-label {
		color: #c59d86;
	}
	
	.ToolBarItems{ 
		background-color: #D3E1F1;
		background-image: -moz-linear-gradient(center top , #DFE9F5, #D3E1F1);
		border-color: #99BCE8;
		border-width: 1px; !important;
	}
	
	.refreshSearch{ 
		background-color: transparent !important;
		background-image: none !important;
		border-color: #AAECFF;
		font-color: red;
		border-width: 1px; !important;
		padding: 0px;
	}
	
	.low .x-change-cell {
		color: red;
	}
	
	.toolBButton {
		/* background: -moz-linear-gradient(center top , #512A03, #512A03 48%, #512A03 52%, #512A03); */
		background: #512A03;
		border-top: 5px solid #e74962 !important;
		padding: 0;
	}
	
	.nobg .x-change-cell {
		background-color: #DFE9F6; border-right-style:  none; border-style:  none !important
	}
	
	
	.btns .x-btn-inner {
		color : #2980B9;
	} 
	
	.toolBPanel {
		background: -moz-linear-gradient(center top , #FFFFFF, #FFFFFF 48%, #FFFFFF 52%, #FFFFFF);
		background: #FFFFFF;
	}
	
	.menuActive  {
		color : #e7485d !important;
		font-weight: bold !important;
		background: -moz-linear-gradient(center top , #512a03, #512a03 48%, #512a03 52%, #512a03);
		background: #512a03;
		border: none !important;
	} 
	
	.menuInactive{
		color : #a98778 !important;
		font-weight: bold !important;
		background: -moz-linear-gradient(center top , #512a03, #512a03 48%, #512a03 52%, #512a03);
		background: #512a03;
		border: none !important;
	}
	
	.btnSaveReset {
		font-weight: bold !important;
		background: -moz-linear-gradient(center top , #512a03, #512a03 48%, #512a03 52%, #512a03);
		background: #512a03;
		border: none !important;
	}
	
	.menuActive .x-btn-inner{
		color:#e7485d !important;
	}
	
	.menuInactive .x-btn-inner{
		color:#a98778 !important;
	}
	
	.x-btn-inner{
		color:#a98778 !important;
	}
	
	.x-form-display-field {
		margin-top: 0px !important;
	}
	
	.x-tab-default .x-tab-inner{
		color: #8c5f4f !important;
	}
	
	.x-tab-default-active .x-tab-inner{
		color: #c59d86 !important;
	}
	
	
	.mybtn button {
	  font-weight: bold;
	}
	
	
	
	.x-grid-cell.first-level{
		background-color: #99bce8;
		padding: 2px 0;
		margin-bottom:1px;
	}
	
	.x-grid-cell.first-level .x-tree-expander{
		background:none;
	}
	
	.x-grid-cell.first-level .x-tree-icon{
		background:none;
	}
	
	.x-grid-cell.first-level .x-grid-cell-inner{
		margin-left: -5px;
	}
	
	.x-grid-cell.second-level .x-grid-cell-inner{
		margin-left: -20px !important;
	}
	
	
	.menuContainer {
		position: relative;
		margin: 10% auto;
		width: 500px;
		height: 120px;
	}

	.menuContainer > div {
		background: transparent;
		height: 164px;
		position: absolute;
		width: 164px;
		text-align: center;
		cursor: pointer;
	}
	
	.menuContainer > div > div {
		padding: 10px;
		border: 1px;		
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		-khtml-border-radius: 5px;
		border-radius: 5px;
	}
	
	.menuContainer > div > div > img {
		width: 134px;
		height: 134px;
	}
	
	.menuContainer > div > p {
		font-size: 15px;
		margin-top: 5px;
		width: 170px;
		color:#0080e5;
		font-weight:bold;
	}

	.menuContainer > div[data-ss-colspan='2'] { width: 170px; }

	.menuContainer .ss-placeholder-child {
		background: transparent;
		border: 1px dashed gray;
	}
	
	
	.x-column-header-inner {
		text-align: center !important;
	}
	
	.inputfield .maroon {background-color:#FD998E !important;}
	
	#menu_mainView-innerCt {
		vertical-align : middle !important;
	}
	
	.x-tip {
		width: 200px !important;
	}
	.x-tip-body {
		width: auto !important;
	}
	
	.x-toolbar-separator-horizontal {
		border-left: 1px solid #c9997e !important;
	}
	
</style>
</head>
<body class=<?php echo $ub; ?> >
<!--.................................Start of Content.............................-->

<div id="loading">
</div>
<!--.................................End of Content.............................-->
</body>
<script type = "text/javascript">
	Ext.onReady( function(){
		mainView.initMethod({
			baseurl : "<?php echo site_url(); ?>"
		});
	});

	function setSchoolYear() {
		console.log( document.querySelector('#setSchoolYear').value );
		Ext.Ajax.request( {
			url : "<?php echo site_url(); ?>" + 'mainview/setSchoolYear/' + document.querySelector('#setSchoolYear').value
			,noMask : true
			,success : function( response, options ){
				var resp = Ext.decode( response.responseText );
				
				standards.callFunction( '_createMessageBox', { msg: resp.success ? 'School year is set' : 'failed to set school year' });

				window.location.reload();
			}
		} );
	}
</script>
</html>