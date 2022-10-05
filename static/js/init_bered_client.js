/*
	entry point module for clientside bered widget
*/
import * as lib from './lib.js?v=109'
import BROKER from './EventBroker.js?v=109'
import { Modal } from './Modal.js?v=109'
import * as map from './map.js?v=109'
import * as gui from './bered-panels.js?v=109'
import admin from './bered_admin.js?v=109' // no op

console.log('bered-client js')

const details = document.querySelector('.woocommerce-product-details__short-description')



setTimeout(() => {
	console.log( 'client hal: ', lib.hal.blorb )
}, 1000 )




// ------------------------------------------
// library
// ------------------------------------------

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


// lock / unlock canvas for drawing, map moving etc:
const steps_map = [1]
const steps_fabric = [2, 3] // - buildings and icons (but zero indexed)
const set_canvas_state = step_iter => {

	// blank slate
	const map_ele = document.querySelector('#bered-map .ol-viewport')
	map_ele.style['pointer-events'] = 'none'
	BERED.fCanvas.wrapperEl.style['pointer-events'] = 'none'
	BERED.fCanvas.wrapperEl.style.opacity = 0.5

	// reactivate as appropriate
	if( steps_fabric.includes( step_iter ) ){
		BERED.fCanvas.wrapperEl.style['pointer-events'] = 'initial'
		BERED.fCanvas.wrapperEl.style.opacity = 1
	}else if( steps_map.includes( step_iter ) ){
		map_ele.style['pointer-events'] = 'initial'
	}else{
		//
	}
	BERED.current_step = step_iter
}


// render poly on closing click
const render_live_poly = () => {

	const poly = new fabric.Polygon( BERED.live_polygon, {
		fill: 'khaki',
		stroke: 'black',
		strokeWidth: 3,
		hasControls: false,
	})
	BERED.fCanvas.add( poly )
	BERED.fCanvas.requestRenderAll()
	BROKER.publish('SET_DRAW_STATE', {
		state: false,
		button: document.querySelector('.bered-instructions .draw-wrap .button')
	})
	const objs = BERED.fCanvas._objects
	for( let i = objs.length-1; i >= 0; i-- ){
		if( objs[i].bered_is_marker ) BERED.fCanvas.remove( objs[i] )
	}
	delete BERED.live_polygon 
	BERED.fCanvas.requestRenderAll()
}


// canvas clicks
const set_polygon = e => {
	/* 
		update live-polygon points
	*/

	const { isClick, pointer } = e // absolutePointer
	const { x, y } = pointer

	if( BERED.live_polygon ){ // 
		console.log('set polygon', 1)
		for( const point of BERED.live_polygon ){
			if( Math.abs( point.x - x ) < 10 && Math.abs( point.y - y ) < 10 ){
				console.log('closing click')
				return render_live_poly()
			}
		}
		// BERED.live_polygon.push({ x: x, y: y }) // ( NOT a Polygon instance, just array )

	}else{ // just started drawing
		// BERED.live_polygon = [{x: x,y: y}]
		console.log('set polygon', 2)
	}
	update_polygon( x, y, true )
}


const update_polygon = ( x, y, called_by_set ) => {
	if( !called_by_set ) return console.log('only call from set_polygon')

	BERED.live_polygon = BERED.live_polygon || []
	BERED.live_polygon.push({x: x, y: y})

	// line marker
	if( BERED.live_polygon.length > 1 ){
		const len = BERED.live_polygon.length
		const penultimate_point = BERED.live_polygon[ len - 2 ]
		const ultimate_point = BERED.live_polygon[ len - 1 ]
		const points = [
			penultimate_point.x, 
			penultimate_point.y,
			ultimate_point.x, 
			ultimate_point.y,
		]
		console.log( 'points', points )
		const new_line = new fabric.Line(points, {
			stroke: 'black',
			// left: 50,
			// top: 50,
			strokeWidth: 3,
			selectable: false,
		})
		new_line.bered_is_marker = true
		console.log( new_line )
		BERED.fCanvas.add( new_line )
	}

	// circle marker
	const new_marker = new fabric.Circle({
		radius: 7,
		fill: 'orange',
		originX: 'center',
		originY: 'center',
		left: x,
		top: y,
		selectable: false,
	})
	new_marker.bered_is_marker = true
	BERED.fCanvas.add( new_marker )
}









// ------------------------------------------
// subscribers
// ------------------------------------------

const set_nav = event => {
	// console.log( event )
	const { dir } = event

	const modal = document.querySelector('.modal.bered-map')
	if( !modal ) return console.log('no popup')

	let next, prev, current

	const steps = modal.querySelectorAll('.bered-instructions>.section')

	let step_iter = 0

	for( let i = 0; i < steps.length; i++ ){

		if( steps[i].classList.contains('selected') ){

			// console.log('found step at : ', i )
			current = steps[i]

			if( dir === 'forward' ){

				step_iter = i+1
				next = steps[ step_iter ]

				if( next ){
					// set DOM
					for( const step of steps ) step.classList.remove('selected')
					next.classList.add('selected')
					// set canvas state
					set_canvas_state( step_iter )
					break;

				}else{
					console.log('at end...')
				}

			}else{

				step_iter = i-1
				prev = steps[ step_iter ]

				if( prev ){
					// set DOM class
					for( const step of steps ) step.classList.remove('selected')
					prev.classList.add('selected')
					// set canvas state
					set_canvas_state( step_iter )
					break;

				}else{
					console.log('at beginning...')
				}

			}
			
		}

	}

}

const set_draw_mode = event => {
	const { state, button } = event
	// fCanvas.isDrawingMode = state

	// object state
	BERED.is_polygon_mode = state
	// canvas state
	if( state ){
		BERED.fCanvas.on('mouse:up', set_polygon )
	}else{
		BERED.fCanvas.off('mouse:up', set_polygon )
	}
	// DOM state
	if( state ){
		button.classList.add('selected')
	}else{
		button.classList.remove('selected')
	}
}





// ------------------------------------------
// init
// ------------------------------------------

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








// ------------------------------------------
// subscriptions
// ------------------------------------------

BROKER.subscribe('SET_NAV_STEP', set_nav )
BROKER.subscribe('SET_DRAW_STATE', set_draw_mode )

