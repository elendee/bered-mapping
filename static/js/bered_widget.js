/*
	entry point module for clientside bered widget
*/

import map from './map.js?v=101'
// import map from './map-module.js?v=101'

console.log('bered-widget js')

const content = document.querySelector('.entry-content')

const widget = document.getElementById('bered-widget')
if( !widget ){
	console.log('bered failed to find own widget area')
}


