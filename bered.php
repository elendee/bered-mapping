<?php
/**
 * Plugin Name: BeredMapper 
 * Plugin URI: https://bered.no
 * Version: 1.0.9
 * Description: custom mapping plugin for bered.no
 * Text Domain: bered
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

/*
	BeredMapper is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 2 of the License, or
	any later version.
	 
	BeredMapper is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU General Public License for more details.
	 
	You should have received a copy of the GNU General Public License
	along with BeredMapper. If not, see https://www.gnu.org/licenses/.
*/


if ( !defined('ABSPATH') ) { 
    die;
}

if ( !defined('DS') ) { define( 'DS', DIRECTORY_SEPARATOR ); }

require_once( ABSPATH . 'wp-includes/pluggable.php' );

// require_once( __DIR__ . '/inc/gallery-form.php' );

$bered_dir = plugins_url( '', __FILE__ );

$bered_version = '1.0.9';

$bered_settings = [];

if ( !class_exists( 'BeredMapper' ) ) {

	abstract class BeredMapper{

	    public static function activate(){
			global $wpdb;

			// 

	    }

	    // public static function base_scripts() {
	  //   	global $bered_version;
   //  		wp_enqueue_script( 
			// 	'bered-base-js', 
			// 	plugins_url( '/static/js/init_base.js?v=' . $bered_version, __FILE__ ),
			// 	array() 
			// );
	    // }

	    public static function admin_scripts() {
	    	global $bered_version;
    		wp_enqueue_script( 
				'bered-admin-js', 
				plugins_url( '/static/js/init_admin.js?v=' . $bered_version, __FILE__ ),
				array('jquery')
			);

	    }

	    public static function admin_styles() {
	    	global $bered_version;
			wp_enqueue_style( 
				'bered-admin-css', 
				plugins_url('/static/css/admin.css?v=' . $bered_version, __FILE__ ), 
				array()
			);

	    }

	    public static function options_page() {
			$bered_page_title = 'BeredMapper';
			$bered_menu_title = 'BeredMapper';
			$bered_capability = 'administrator';
			$bered_menu_slug = 'inc/admin.php';

			add_menu_page(
			    $bered_page_title,
			    $bered_menu_title,
			    $bered_capability,
			    plugin_dir_path(__FILE__) . $bered_menu_slug,
			    null,
			    false,
			    20
			);	
	    }


 	    public static function global_scripts() {
 	    	global $bered_version;
    		wp_enqueue_style( 
				'bered-global-css', 
				plugins_url('/static/css/bered.css?v=' . $bered_version, __FILE__ ), 
				array()
			);
			wp_enqueue_style( 
				'bered-modal-css', 
				plugins_url('/static/css/modal.css?v=' . $bered_version, __FILE__ ), 
				array()
			);
    		wp_enqueue_script( // this is used for localized BERED global var
				'bered-global-js', 
				plugins_url( '/static/js/global.js?v=' . $bered_version, __FILE__ ),
				array()
			);
    		wp_enqueue_script( 
				'bered-fabric-js', 
				plugins_url( '/resource/fabric.min.js?v=' . $bered_version, __FILE__ ),
				array()
			);
    		wp_enqueue_script( 
				'bered-main-js', 
				plugins_url( '/static/js/client/init_bered_client.js?v=' . $bered_version, __FILE__ ),
				array()
			);

			wp_enqueue_style( 
				'bered-ol-css', 
				'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@main/dist/en/v7.0.0/legacy/ol.css', 
				array()
			);
    		wp_enqueue_script( // this is used for localized BERED global var
				'bered-ol-js', 
				'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@main/dist/en/v7.0.0/legacy/ol.js',
				array()
			);

			// <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@main/dist/en/v7.0.0/legacy/ol.js"></script>
			// <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@main/dist/en/v7.0.0/legacy/ol.css">

    		// <script type="module" defer="defer" src="' . plugins_url() . '/bered-mapping/static/js/init_bered_client.js?v=' . $bered_version . '"></script>

			wp_localize_script( 'bered-global-js', 'BERED', array(
					'plugin_url' => plugins_url( '', __FILE__ ), //plugins_url(), // '/static/js/global.js', __FILE__
					'home_url' => home_url(),
					'ajaxurl' => admin_url( 'global-ajax.php' ),
					'version' => $bered_version,
				)
			);

	    }

		public static function admin_menu_items(){
			global $bered_page_title;
			echo 
	        "<h1>" . $bered_page_title . "</h1>
	        <div class='nav-tab-wrapper'>
		    	<a class='nav-tab main-tab' data-section='model-library'>
		    		tab 1
		    	</a>
		    	<a class='nav-tab main-tab' data-section='model-galleries'>
		    		tab 2
	 	    	</a>
		    	<a class='nav-tab main-tab' data-section='tab-worlds'>
		    		tab 3
	 	    	</a>
		    	<a class='nav-tab main-tab' data-section='model-help'>
		    		tab 4
	 	    	</a>";
		}


		public static function allow_glb( $mimes ){
			$mimes['glb'] = 'application/octet-stream';
			return $mimes;
		}


	    public static function filter_modules( $tag, $handle, $src ) {
	    	$defer_modules = ['bered-main-js', 'bered-base-js', 'bered-admin-js']; // 'bered-posts-js', 'bered-lib-js'
		    if ( !in_array($handle, $defer_modules ) ){
		        return $tag;		    	
		    }
		    $tag = '<script type="module" src="' . $src . '" defer="defer"></script>';
		    return $tag;
		}

		public static function LOG( $msg ){

			if( !file_exists( __DIR__ . '/.bered-log.txt') ){
				// return;
			}

			$type = gettype( $msg );
			if( $type  === 'object' || $type === 'array' ){
				$msg = '(' . $type . ')
' . json_encode($msg, JSON_PRETTY_PRINT);
			}
		    $logfile = __DIR__ . '/.bered-log.txt';
		    // file_put_contents($logfile, date('M:D:H:i') . ':
// ' . $msg . PHP_EOL, FILE_APPEND | LOCK_EX);
		    file_put_contents($logfile, $msg . PHP_EOL, FILE_APPEND | LOCK_EX);

		}	

		 public static function shortcode( $attr, $content, $name ){

		 	global $bered_version;

    		return '

    		<div id="bered-widget">
    			<div id="bered-map" class="map"></div>
    		</div>';

    		// <script type="module" defer="defer" src="' . plugins_url() . '/bered-mapping/static/js/init_bered_client.js?v=' . $bered_version . '"></script>

	    }

	}
	// <link rel="stylesheet" href="' . plugins_url() . '/bered-mapping/static/css/ol.css">
	// <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@main/dist/en/v7.0.0/legacy/ol.js"></script>
	// <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@main/dist/en/v7.0.0/legacy/ol.css">

	// ------------- admin init
	$has_module = false;

	if( current_user_can('manage_options') ){

		$bered = strpos( $_SERVER['REQUEST_URI'], 'page=bered' );
		$admin_ajax = strpos( $_SERVER['REQUEST_URI'], 'wp-admin/admin-ajax' );		
		$post_edit = strpos( $_SERVER['REQUEST_URI'], 'wp-admin/post.php');
		$admin_any = strpos( $_SERVER['REQUEST_URI'], 'wp-admin/');

		if( $admin_ajax ){ // _____ ajax requests

		// 	add_action( 'wp_ajax_fill_library', 'BeredMapper::fill_library' );
		// 	add_action( 'wp_ajax_fill_gallery', 'BeredMapper::fill_gallery' );
		// 	add_action( 'wp_ajax_bered_save_shortcode', 'BeredMapper::save_shortcode' );
		// 	// add_action( 'wp_ajax_bered_save_settings', 'BeredMapper::save_settings' );
		// 	add_action( 'wp_ajax_bered_delete_gallery', 'BeredMapper::delete_gallery' );
		// 	add_action( 'wp_ajax_bered_get_model', 'BeredMapper::get_model' );
		// 	add_action( 'wp_ajax_bered_get_image', 'BeredMapper::get_image' );
		// 	add_action( 'wp_ajax_bered_settings', 'BeredMapper::get_settings', 100 );


		}else{

			if( $admin_any ){

				add_action( 'admin_enqueue_scripts', 'BeredMapper::admin_styles', 100 );
				add_action( 'admin_enqueue_scripts', 'wp_enqueue_media', 100 ); // for uploads i think

			}

			if( $bered ){ // _____ admin page

				add_action( 'admin_enqueue_scripts', 'BeredMapper::admin_scripts', 100 );
				// add_action( 'bered_gallery_form', 'bered_gallery_form');
				$has_module = true;

			}

		}

	}

	// ------------- global init

	add_action('init', 'BeredMapper::global_scripts', 100);
	add_action('admin_menu', 'BeredMapper::options_page');
	add_action('bered_admin_menu', 'BeredMapper::admin_menu_items');

	// if ( !$has_module ) add_action('init', 'BeredMapper::base_scripts', 100); // fallback script

	add_filter('script_loader_tag', 'BeredMapper::filter_modules' , 10, 3);
	add_filter('upload_mimes', 'BeredMapper::allow_glb');

	add_shortcode('bered', 'BeredMapper::shortcode');
	// add_shortcode('bered_world', 'BeredMapper::shortcode_world');

	register_activation_hook( __FILE__, 'BeredMapper::activate' );

}
