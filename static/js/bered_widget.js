/*
	entry point module for clientside bered widget
*/
import * as lib from './lib.js?v=107'
import BROKER from './EventBroker.js?v=107'
import { Modal } from './Modal.js?v=107'
import * as map from './map.js?v=107'
import * as gui from './bered-map-gui.js?v=107'

console.log('bered-widget js')

const details = document.querySelector('.woocommerce-product-details__short-description')




let m

const init_popup = () => {

	if( m ){
		console.log('ay')
		return m.ele.style.display = 'block'
	}

	m = new Modal({
		type: 'bered-map',
		close_type: 'hide',
	})
	m.make_columns()
	document.body.append( m.ele )

	// move the map into popup
	const widget = document.getElementById('bered-widget')
	m.left_panel.append( widget )

	// instruction / steps / fabric widget
	gui.build_instruction_panel( m.right_panel, widget ) // ( container )

	// dev panel
	const ele = document.getElementById('bered-map')
	gui.build_dev_panel( ele )
	// console.log('hiding bered dev panel')
	document.getElementById('bered-dev-gui').style.display = 'none'

	map.init()

}









;(async() => {

	document.body.classList.add('bered')

	const begin = document.createElement('div')
	begin.classList.add('button')
	begin.innerText= 'Make your map'
	begin.addEventListener('click', init_popup )
	details.append( begin )

	const checkout = document.querySelector('form.cart button[name="add-to-cart"]')
	if( !checkout ) return console.log('could not find woocommerce checkout button for bered')

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

		if( steps[i].classList.contains('selected') ){
			console.log('found step at : ', i )
			current = steps[i]
			next = steps[i+1]
			prev = steps[i-1]
			if( dir === 'forward' ){
				if( next ){
					// set DOM
					for( const step of steps ) step.classList.remove('selected')
					next.classList.add('selected')
					// set canvas state
					if( i === 0 ){
						document.querySelector('.modal .canvas-container').style['pointer-events'] = 'initial'
					}else{
						document.querySelector('.modal .canvas-container').style['pointer-events'] = 'none'
					}
					break;
				}else{
					console.log('at end...')
				}
			}else{
				if( prev ){
					// set DOM class
					for( const step of steps ) step.classList.remove('selected')
					prev.classList.add('selected')
					// set canvas state
					if( i === 2 ){
						document.querySelector('.modal .canvas-container').style['pointer-events'] = 'initial'
					}else{
						document.querySelector('.modal .canvas-container').style['pointer-events'] = 'none'
					}
					break;
				}else{
					console.log('at beginning...')
				}
			}
			
		}
		// const forward = step.querySelector('.nav[data-dir="forward"]')
		// const back = step.querySelector('.nav[data-dir="back"]')

	}

}

const set_draw_mode = event => {
	const { state, fCanvas, button } = event
	fCanvas.isDrawingMode = state
	if( state ){
		button.classList.add('selected')
	}else{
		button.classList.remove('selected')
	}
}






// subscriptions

BROKER.subscribe('SET_NAV_STEP', set_nav )
BROKER.subscribe('SET_DRAW_STATE', set_draw_mode )

