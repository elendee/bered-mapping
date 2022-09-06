/*
	entry point module for clientside bered widget
*/

import map from './map.js?v=101'
// import map from './map-module.js?v=101'

console.log('bered-widget js')


;(async() => {

const content = document.querySelector('.entry-content')

const widget = document.getElementById('bered-widget')
const gallery = document.querySelector('.woocommerce-product-gallery')
if( !gallery || !widget ){
	if( widget ) widget.remove()
	return console.error('invalid bered init (widget only works on Product pages)')
}

document.body.classList.add('bered')

gallery.innerHTML = ''
console.log('hiding woocomerce product gallery')

gallery.append( widget )




const size_map = () => {
	// widget.style.width = widget.getBoundingClientRect().height + 'px'
	widget.style.height = widget.getBoundingClientRect().width + 'px'
}
size_map()
window.addEventListener('resize', size_map )


// setTimeout(() => {

// 	// BERED.MAP
// }, 500)


})();

