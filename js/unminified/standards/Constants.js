var constants = function(){
	
	function constantVar( params ){
		return {
			/** Global **/
			BASEURL 				: params.baseurl
			,EUID 					: params.euID
			,FNAME 					: params.fname
			,MNAME 					: params.mname
			,LNAME 					: params.lname
			,FULLNAME 				: params.fullname
			,EUNAME 				: params.euName
			,USERTYPE 				: params.usertype
			,USERTYPENAME 			: params.usertypename
			,COOPID 				: params.coopID
			,COOPNAME 				: params.coopName
			,COMPANYNAME 			: params.companyName
			,TAGLINE 				: params.tagLine
			,ACRONYM 				: params.acronym
			
			/** Messages **/
			,MSGBOX_TITLE  			: 'SYSTEM MESSAGE'
			,SAVE_SUCCESS  			: 'Record has been successfully saved.'
			,SAVE_FAILURE 			: 'Database connectivity error: Failure during submission of record.'
			,SAVE_MODIFIED 			: 'Record has been already modified. Would you like to proceed?'
			,DELETE_SUCCESS 		: 'Record has been successfully deleted.'
			,DELETE_USED 			: 'This record is already used and cannot be deleted.'
			,DELETE_CONFIRM 		: 'Are you sure you want to delete this record?'
			,EDIT_UNABLE 			: 'Unable to find this record.'
			,EDIT_USED 				: 'This record is already used and cannot be modified.'
			,NOREC_PRINT 			: 'No records to print.'
			,AJAX_FAILURE 			: 'Database connectivity error. Please make sure you are connected to the network and try again.'
			
			/** Forms **/
			,FORM_VALID 			: '<em style="color:green">Form is valid.</em>'
			,FORM_INVALID 			: '<em style="color:red">Fields with * are required.</em>'
			,REQ 					: '<em style="color:red;">*</em>'
			,FORM_ISCENTER			: true
			,FORM_HASBORDER			: false
			,REPORTBTN_ISVERTICAL	: true
			
			/** Fields **/
			,DEF_PAGE_SIZE 			: 50
			,DEF_WIDTH 				: 350
			,DEF_LABEL_WIDTH 		: 135
			
			/** Grids **/
			,HEX_ACTIVE 			: '#3498db'
			,HEX_INACTIVE 			: '#ecf0f1'
			
			/** Others **/
			,DEF_CURRENCY 			: '₱'
			,DATE_FORMAT			: 'm/d/Y'
			
		};
	}
	
	return {
		getConstants : constantVar
	}
}();