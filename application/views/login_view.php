
  
    <link href="<?=base_url();?>css/jquery-ui.min.css" rel="stylesheet">
	<style>
		body {
		  padding-top: 80px;
		  padding-bottom: 40px;
		  margin-bottom: 60px;
		}
		.container{
			max-width: 380px;
			background-color: #FDE6CE;
		}
		.form-signin {
		  max-width: 320px;
		  margin: -30% auto 0;
		}
		.form-signin .form-signin-heading,
		.form-signin .checkbox {
		  margin-bottom: 10px;
		}
		.form-signin .checkbox {
		  font-weight: normal;
		}
		.form-signin .form-control {
		  position: relative;
		  height: auto;
		  -webkit-box-sizing: border-box;
			 -moz-box-sizing: border-box;
				  box-sizing: border-box;
		  padding: 5px;
		  font-size: 12px;
		}
		.form-signin .form-control:focus {
		  z-index: 2;
		}
		.form-signin input[type="text"] {
		  margin-bottom: 10px;
		}
		.form-signin input[type="password"] {
		  margin-bottom: 10px;
		}
		.form-signin select {
		  margin-bottom: 10px;
		  border-top-left-radius: 0;
		  border-top-right-radius: 0;
		}
		html {
		  position: relative;
		  min-height: 100%;
		}
		.btn {
			height: 30px !important;
		}
		.btn-lg {
			padding: 0 !important;
			font-size: 12px !important;
			background-color: #512A03;
			border-color: #512A03;
			color: #fff;
			font-weight: bold;
		}
		
		.btn-primary {
			color: #fff !important;
			background-color: #512A03 !important;
			border-color: #512A03 !important;
			font-weight: bold;
		}
		
		.no-close .ui-widget-header {
			background: #9de8fd !important;
			border-color: #9de8fd !important;
			color: #000 !important;
		}
		
		.ui-widget-content {
			background: #fff !important;
			border: none !important;
		}
		
		.ui-widget{
			font-family: Century Gothic,CenturyGothic,AppleGothic,sans-serif !important;
		}
		
		.ui-dialog .ui-dialog-buttonpane {
			border-width: 0px !important;
			padding: 0 !important;
			margin-top: 0px !important;
			background-color: #dff0f6 !important;
		}
		
		.ui-corner-all, .ui-corner-bottom, .ui-corner-right, .ui-corner-br {
			-webkit-border-bottom-right-radius: 8px !important;
			-moz-border-bottom-right-radius: 8px !important;
			border-bottom-right-radius: 8px !important;
		}
		
		.ui-corner-all, .ui-corner-bottom, .ui-corner-left, .ui-corner-bl {
			-webkit-border-bottom-left-radius: 8px !important;
			-moz-border-bottom-left-radius: 8px !important;
			border-bottom-left-radius: 8px !important;
		}
		
		.ui-corner-all, .ui-corner-top, .ui-corner-right, .ui-corner-tr {
			-webkit-border-top-right-radius: 8px !important;
			-moz-border-top-right-radius: 8px !important;
			border-top-right-radius: 8px !important;
		}
		
		.ui-corner-all, .ui-corner-top, .ui-corner-left, .ui-corner-tl {
			-webkit-border-top-left-radius: 8px !important;
			-moz-border-top-left-radius: 8px !important;
			border-top-left-radius: 8px !important;
		}
		
		
		.ui-dialog {
			padding: 0 !important;
			border: 0.3em solid #9de8fd !important;
		}
		
		.ui-dialog .ui-dialog-titlebar{
			-webkit-border-radius: 0 !important;
			-moz-border-radius: 0 !important;
			border-radius: 0 !important;
		}
		
		.ui-widget-header {
			font-size: 0.8em !important;
		}
		
		.ui-widget-header .ui-dialog-title{
			height: 1.2em !important;
		}
		
		.ui-dialog .ui-dialog-titlebar-close {
			height: 25px !important;
			margin: -15px 0 0 !important;
			background: transparent !important;
			border: 0px !important;
			font-size: 1.4em !important;
			color: #4ad2fc !important;
		}
		
		.ui-dialog .ui-dialog-content{
			padding: 0.5em 1em;
		}
		
		.ui-dialog .ui-dialog-titlebar{
			padding: 0.4em 0.5em !important;
		}
		
		.ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset {
			float: none !important;
			text-align: center !important;
		}
		
		.ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset button {
			border: 1px solid #9de8fd !important;
			background-color: #9de8fd !important;
			background-image: -webkit-linear-gradient(center top , #7addfd, #9de8fd 50%, #7addfd 51%, #9de8fd) !important;
			background-image: -moz-linear-gradient(center top , #7addfd, #9de8fd 50%, #7addfd 51%, #9de8fd) !important;
			background-image: -ms-linear-gradient(center top , #7addfd, #9de8fd 50%, #7addfd 51%, #9de8fd) !important;
			background-image: -o-linear-gradient(center top , #7addfd, #9de8fd 50%, #7addfd 51%, #9de8fd) !important;
			padding: 7px !important;
			-webkit-border-radius: 5px !important;
			-moz-border-radius: 5px !important;
			border-radius: 5px !important;
			font-size: 0.8em !important;
			font-weight: bold !important;
		}
		.ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset button:hover {
			background-image: -webkit-linear-gradient(center top , #61d1f6, #7addfd 50%, #61d1f6 51%, #7addfd) !important;
			background-image: -moz-linear-gradient(center top , #61d1f6, #7addfd 50%, #61d1f6 51%, #7addfd) !important;
			background-image: -ms-linear-gradient(center top , #61d1f6, #7addfd 50%, #61d1f6 51%, #7addfd) !important;
			background-image: -o-linear-gradient(center top , #61d1f6, #7addfd 50%, #61d1f6 51%, #7addfd) !important;
		}
		
		#loading{
			display: block;
			margin-left: auto;
			margin-right: auto;
			margin-top:290px;
			width:160px;
		}
		
		.ui-widget input, .ui-widget select, .ui-widget textarea, .ui-widget button {
			font-family: Century Gothic,CenturyGothic,AppleGothic,sans-serif !important;
		}
		
		.ui-widget-overlay {
			background: #666 !important;
		}
		
		.alert {
			margin-bottom: 5px !important;
		}
		
	</style>
	<?php
		$this->load->model('Home_model','model');
		$getLogo = $this->model->getLogo();
		$logoname = '';
		$logo;
		if( @file_get_contents( $this->session->userdata('LOGOPATH').$getLogo->companyLogo  ) )	$image = 'data:image/png;base64,' . base64_encode(  @file_get_contents( $this->session->userdata('LOGOPATH').$getLogo->companyLogo  )  );
		else $image = base_url().'images/logo/'.$getLogo->companyLogo;
		
		
	?>
	
	<div id="loading" style="display:none">
		<img src="<?php echo base_url();?>images/loading.gif" style="margin-left:50px;">
		<center><h5 style="margin-top:5px;font-size:20px;color:#7f8c8d;">Please wait...</h5></center>
	</div>
	<div class="container">
		<div class="form-signin" role="form">
			<div style = "margin: auto !important; width : 270px;">
				<!-- <img src="<?php //echo base_url(); ?>images/logo/<?php //echo $this->logoName ?>" alt="bma" class="img-thumbnail" class="img-responsive" style="width: 270px; background: transparent !important; border: 0px;"> -->
				<!--<img src="<?php echo base_url(); ?>images/logo/<?php echo $companyLogo ?>" alt="bma" class="img-thumbnail" class="img-responsive" style="width: 270px; background: transparent !important; border: 0px;">-->
				<img src= "<?php echo $image ?>" alt="bma" class="img-thumbnail" class="img-responsive" style="width: 270px; background: transparent !important; border: 0px;">
			</div>
			<div id="logintitle">Payments System</div>
			<div id="warnmsg" class="alert alert-danger" style="display:none;padding: 8px;"></div>
			<?php $errlog=getflash('errlog');?>					
			<?php if(strlen($errlog)>0){ ?>
				<div class='inv' style="color:#DD4B39; padding:10px; border:2px solid #DD4B39; background:#f5f5f5">
					<?php $errlog;?>
				</div><br />
			<?php } ?>
			<input id="username" name="username" type="text" class="form-control" placeholder="Username" required="" autofocus="">
			<input id="password" name="password" type="password" class="form-control" placeholder="Password" required="">
			<button class="btn btn-lg btn-primary btn-block" type="submit" id="login_btn">Login</button>
	  </div>
		<div class="clear"></div>
	</div>
	
	<div id="selectCompany" title="Select Company" style="display:none;">
		<div id="warnmsg2" class="alert alert-danger" style="display:none;padding: 8px;"></div>
		<select id="accno">
			<option value=""></option>
		</select>
	</div>
	
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="<?=base_url();?>js/jquery-1.8.3.min.js"></script>
    <script src="<?=base_url();?>js/jquery-ui.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="<?=base_url();?>css/bootstrap_login/js/bootstrap.min.js"></script>
	<script type="text/javascript">
		
		baseurl = "<?=site_url();?>";
		
		$(document).ready(function(){
			$( '#loading' ).hide();
			$("#login_btn").click(function(){
			  var user_name = document.getElementById('username');
			  var pass_word = document.getElementById('password');
			  if(user_name.value.length == 0){
				$('#warnmsg').show();
				document.getElementById('warnmsg').innerHTML = '<span class="glyphicon glyphicon-remove-sign"></span> Username is required';
				return;
			  }
			  if(pass_word.value.length == 0){
				$('#warnmsg').show();
				document.getElementById('warnmsg').innerHTML = '<span class="glyphicon glyphicon-remove-sign"></span> Password is required';
				return;
			  }
			  $('.container').hide();
			  $('#loading').show();
			  $.ajax({
				url:"<?php echo base_url() ?>home/loginUser",
				type:'post',
				data: {
					username:user_name.value,
					password:pass_word.value
				},
				dataType: 'json',
				success:function(result){
					
					// console.log(result.match);
					// return;
					
					$('#loading').hide();
					if( result.match == 1 ){
						$('.container').show();
						$('#warnmsg').show();
						document.getElementById('warnmsg').innerHTML = '<span class="glyphicon glyphicon-remove-sign"></span>  Invalid username/password';
						user_name.value = "";
						pass_word.value = "";
					}
					// else if( result.match == 2 ){
						// $('.container').show();
						// $('#warnmsg').show();
						// document.getElementById('warnmsg').innerHTML = '<span class="glyphicon glyphicon-remove-sign"></span>  You dont have any module access setup, please contact administrator.';
						// user_name.value = "";
						// pass_word.value = "";
					// }
					// else if( result.match == 3 ){
						// $('.container').show();
						// $('#warnmsg').show();
						// document.getElementById('warnmsg').innerHTML = '<span class="glyphicon glyphicon-remove-sign"></span>  Database for this user is not yet configured, please contact administrator';
					// }
					// else if( result.match == 0 ){
						// $('#warnmsg').hide();
						// localStorage.clear();
						// $('.container').hide();
						// document.getElementById('warnmsg').innerHTML = '';
						// $( '#accno' ).find( 'option:gt( 0 )' ).remove( );
						// var accno = $( '#accno' );
						// $.each( result.record, function( index, data ) {
							// accno.append( new Option( data.dis, data.val, false, false ) );
						// } );
						// $('#loading').hide();
						// localStorage.clear();
						// document.getElementById('warnmsg').innerHTML = '';
						// window.location.href = '<?php echo site_url('home/redirurl') ?>';
					// }
					else{
						$('#warnmsg').hide();
						localStorage.clear();
						document.getElementById('warnmsg').innerHTML = '';
						window.location.href = '<?php echo site_url('home/redirurl') ?>';
					}
				}
				,failure: function(){					
					$('#loading').hide();
					document.getElementById('warnmsg').innerHTML = '<span class="glyphicon glyphicon-remove-sign"></span>  Database connectivity error. Please make sure you are connected to the network and try again.';
					$('#warnmsg').show();
				}
			  });
			});
			
			$("#username").keypress(function(e){
				evalidate(e.which);
				 $('#warnmsg').hide();
			});
			
			$("#password").keypress(function(e){
				evalidate(e.which);
				 $('#warnmsg').hide();
			});
			function evalidate(e){
				switch(e){
					case 13:
						document.getElementById('login_btn').click();
						break;
				}
			}
		});
		
	</script>
	