<?php

/**
 * @snippet       File Upload Input @ WooCommerce Ccheckout
 * @how-to        Get CustomizeWoo.com FREE
 * @author        Rodolfo Melogli
 * @compatible    WooCommerce 6
 * @donate $9     https://businessbloomer.com/bloomer-armada/
 */
 
add_action( 'woocommerce_short_description', 'bered_checkout_file_upload' );
// add_action( 'woocommerce_after_order_notes', 'bered_checkout_file_upload' );
 
function bered_checkout_file_upload() {
   echo '<p class="form-row"><label for="appform">Bered form (.png)<abbr class="required" title="required">*</abbr></label><span class="woocommerce-input-wrapper"><input type="file" id="appform" name="appform" accept=".png" required><input type="hidden" name="appform_field" /></span></p>';
   wc_enqueue_js( "
      jQuery( '#appform' ).change( function() {
         if ( this.files.length ) {
            const file = this.files[0];
            const formData = new FormData();
            formData.append( 'appform', file );
            bered_spinner.show()
            jQuery.ajax({
               url: BERED.ajaxurl + '?action=appformupload',
               type: 'POST',
               data: formData,
               contentType: false,
               enctype: 'multipart/form-data',
               processData: false,
               success: function ( response ) {
               		try{
               			const res = JSON.parse( response )
	                	console.log( res )
	               		let time = 0
	               		if( location.href.match(/localhost/)) time = 1000
	               		setTimeout(() => {
				            bered_spinner.hide()
				            jQuery('.wcpa_form_item.wcpa_type_textarea textarea').val( res.url )
		                	jQuery('input[name=\"appform_field\"]' ).val( res );
		                }, time )               			
	                }catch(err ){
	                	console.error( err )
	                }
               }
            });
         }
      });
	");
}


// --- the upload
 
add_action( 'wp_ajax_appformupload', 'bered_appformupload' );
add_action( 'wp_ajax_nopriv_appformupload', 'bered_appformupload' );
function bered_appformupload() {

	global $wpdb;
	$uploads_dir = wp_upload_dir();

	if ( isset( $_FILES['appform'] ) ) {

    	if ( $upload = wp_upload_bits( $_FILES['appform']['name'], null, file_get_contents( $_FILES['appform']['tmp_name'] ) ) ) {

    		$res = new stdClass();
    		$res->success = true;
    		$res->url = $upload['url'];
        	echo json_encode( $res );

    	}

   }
   die;
}
 
// add_action( 'woocommerce_checkout_process', 'bered_validate_new_checkout_field' );
   
// function bered_validate_new_checkout_field() {
//    if ( empty( $_POST['appform_field'] ) ) {
//       wc_add_notice( 'Please upload your Application Form', 'error' );
//    }
// }

// --- form updates
 
add_action( 'woocommerce_checkout_update_order_meta', 'bered_save_new_checkout_field' );
function bered_save_new_checkout_field( $order_id ) { 
   if ( ! empty( $_POST['appform_field'] ) ) {
      update_post_meta( $order_id, '_application', $_POST['appform_field'] );
   }
}
   
// --- DOM - show upload in checkout

add_action( 'woocommerce_admin_order_data_after_billing_address', 'bered_show_new_checkout_field_order', 10, 1 );
function bered_show_new_checkout_field_order( $order ) {    
   $order_id = $order->get_id();
   if ( get_post_meta( $order_id, '_application', true ) ) echo '<p><strong>Bered application data:</strong> <a href="' . get_post_meta( $order_id, '_application', true ) . '" target="_blank">' . get_post_meta( $order_id, '_application', true ) . '</a></p>';
}
  
// --- DOM - show upload in order table (?)

add_action( 'woocommerce_email_after_order_table', 'bered_show_new_checkout_field_emails', 20, 4 );
function bered_show_new_checkout_field_emails( $order, $sent_to_admin, $plain_text, $email ) {
    if ( $sent_to_admin && get_post_meta( $order->get_id(), '_application', true ) ) echo '<p><strong>Berd application data:</strong> ' . get_post_meta( $order->get_id(), '_application', true ) . '</p>';
}


