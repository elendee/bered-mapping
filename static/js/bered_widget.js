/*
	entry point module for clientside bered widget
*/
import BROKER from './EventBroker.js?v=106'
import { Modal } from './Modal.js?v=106'
import * as map from './map.js?v=106'
import * as gui from './bered-map-gui.js?v=106'


console.log('bered-widget js')


const details = document.querySelector('.woocommerce-product-details__short-description')





const init_popup = () => {


	const m = new Modal({
		type: 'bered-map'
	})
	m.make_columns()
	document.body.append( m.ele )

	gui.build_instruction_panel( m.right_panel ) // ( container )

	const widget = document.getElementById('bered-widget')
	m.left_panel.append( widget )
	// if( !widget ) return console.log('bered not detected on this page')

	// dev panel
	const ele = document.getElementById('bered-map')
	gui.build_dev_panel( ele )
	// if( location.href.match('/oko/')){
	// }else{
	// 	 console.log('hiding bereddev panel')
	// }
	console.log('hiding bered dev panel')
	document.getElementById('bered-map-gui').style.display = 'none'

	map.init()

	// BROKER.publish('MAP_ADD_LAYER', {
	// 	type: 'data',
	// })

	// size_map()

	// setTimeout(() => {
	// 	BROKER.publish('MAP_ADD_LAYER', {
	// 		type: 'data',
	// 	})
	// 	size_map()
	// }, 500 )

}









;(async() => {

	document.body.classList.add('bered')

	const begin = document.createElement('div')
	begin.classList.add('button')
	begin.innerText= 'Make your map'
	begin.addEventListener('click', init_popup )
	details.append( begin )

	const checkout = document.querySelector('form.cart button[name="add-to-cart"]')
	if( !checkout ) console.log('could not find woocommerce checkout button for bered')

	checkout.classList.add('disabled')

})();










// subscribers

const set_nav = event => {
	// console.log( event )
	const { dir } = event

	const modal = document.querySelector('.modal.bered-map')
	if( !modal ) return console.log('no popup')

	let current, next, prev
	const steps = modal.querySelectorAll('.bered-instructions>.section')
	for( let i = 0; i < steps.length; i++ ){
		if( steps[i].classList.contains('selected')){
			console.log('sfound step at : ', i )
			current = steps[i]
			next = steps[i+1]
			prev = steps[i-1]
			if( dir === 'forward' ){
				if( next ){
					for( const step of steps ) step.classList.remove('selected')
					next.classList.add('selected')
				}else{
					console.log('at end...')
				}
			}else{
				if( prev ){
					for( const step of steps ) step.classList.remove('selected')
					prev.classList.add('selected')
				}else{
					console.log('at beginning...')
				}
			}
		}
		// const forward = step.querySelector('.nav[data-dir="forward"]')
		// const back = step.querySelector('.nav[data-dir="back"]')
	}
}






// subscriptions

BROKER.subscribe('SET_NAV_STEP', set_nav )



