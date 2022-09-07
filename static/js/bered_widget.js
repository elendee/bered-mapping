/*
	entry point module for clientside bered widget
*/

import BROKER from './EventBroker.js?v=103'
import map from './map.js?v=103'
// import map from './map-module.js?v=103'

console.log('bered-widget js')


let widget





const size_map = event => {
	widget.style.height = widget.getBoundingClientRect().width + 'px'
}







;(async() => {

const content = document.querySelector('.entry-content')

widget = document.getElementById('bered-widget')
const gallery = document.querySelector('.woocommerce-product-gallery')
if( !gallery || !widget ){
	if( widget ) widget.remove()
	return console.error('invalid bered init (widget only works on Product pages)')
}

document.body.classList.add('bered')

gallery.innerHTML = ''
console.log('hiding woocomerce product gallery')

gallery.append( widget )


size_map()





})();





window.addEventListener('resize', size_map )
BROKER.subscribe('MAP_RESIZE', size_map )