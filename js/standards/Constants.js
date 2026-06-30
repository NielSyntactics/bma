/** Overrides
  * [Developer]
  * In Memory: Salrio T. Salcedo
  * Date Created: January 2016
  
  * [Description]
	Stores all JS global variables and standard settings
  
  * [Modification]
    Almost each and every single day :D
	Except when Im gone :(
 **/

var constants = function(){
	
	function constantVar( params ){
		var config = {
			/** Messages **/
			MSGBOX_TITLE  			: 'SYSTEM MESSAGE'
			,SAVE_SUCCESS  			: 'Record has been successfully saved.'
			,SAVE_FAILURE 			: 'Database connectivity error: Failure during submission of record.'
			,SAVE_MODIFIED 			: 'This record has been modified by another user. Do you still want to proceed with your changes?'
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
			/** Default Image ***/
			,DEF_IMG			 	: 'default-no-img.jpg'
			
		};
		
		for( x in params ){
			config[ x.toUpperCase() ] = params[x]
			// console.info( x.toUpperCase()+':', params[x]  );
		}
		
		return config;
	}
	
	return {
		getConstants : constantVar
	}
}();