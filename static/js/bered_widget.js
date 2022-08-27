import map from './map.js?v=100'
// import map from './map-module.js?v=100'

console.log('bered-widget js')

const content = document.querySelector('.entry-content')

const widget = document.getElementById('bered-widget')
if( !widget ){
	console.log('bered failed to find own widget area')
}


