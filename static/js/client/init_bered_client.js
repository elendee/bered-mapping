/*
	entry point for both client and admin module


*/
import STEPS from '../shared/STEPS.js?v=110'
import * as lib from '../lib.js?v=110'
import BROKER from '../EventBroker.js?v=110'
import { Modal } from '../Modal.js?v=110'
import * as map from '../shared/map.js?v=110'
import * as gui from './bered-panels.js?v=110'
import admin from '../admin/bered_admin.js?v=110' // no op
import DEV from '../dev.js?v=110'
import bundle_json from '../shared/bundle_map_data.js?v=110'
// import combine_blobs from '../shared/combine_blobs.js?v=110'
import html2canvas from '../shared/html2canvas.esm.js'
// import get_blob from './get-blob.js?v=110'

console.log('bered-client js')

const details = document.querySelector('.summary.entry-summary')
const bered_hidden = document.querySelectorAll('.bered-order-data')


window.html2canvas = html2canvas


// logging ...
const print_sign_widths = window.print_sign_widths = () => {

	const sign = document.querySelector('#bered-sign')

	for( const ele of sign.querySelectorAll('*')){
		const id = ele.id // || ( ele.classList?.length ? ele.classList[0] : 'somethign' )
		if( id ){
			console.log( id, ele.getBoundingClientRect().width )
		}
	}
}






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

	const map_obj = map.init( widget, 'bered-map' )


	// instruction / steps / fabric widget
	gui.build_instruction_panel( m.right_panel, widget, map_obj ) // ( container )
	gui.add_zoom( widget, map_obj )

	// dev panel
	// const ele = document.getElementById('bered-map')
	// gui.build_dev_panel( ele )
	// console.log('hiding bered dev panel')
	// document.getElementById('bered-dev-gui').style.display = 'none'

	// map.init( widget, 'bered-map' )

	setTimeout(() => {
		console.log('adding selected', widget.parentElement )
		const modal_content = widget.parentElement.parentElement
		modal_content.classList.add('selected-0')
		// left_col.style['max-width'] = '0px'
		// const right_col = left_col.parentElement.querySelector('.right-panel')
		// right_col.style['max-width'] = '100%'
		// right_col.style.max-width = '0px'
	}, 500)

}










// lock / unlock canvas for drawing, map moving etc:
// const steps_map = [1]
// const steps_fabric = [2,3] // - buildings and icons (but zero indexed)
// const steps_bundle = [2,3]
// const MAP_ONE = [2,3]
// const MAP_TWO = [4,5]
const set_map_active = ( step_iter ) => {
	/*
		display only
		set map active / inactive
	*/

	// blank slate
	const map_ele = document.querySelector('#bered-map .ol-viewport')
	map_ele.style['pointer-events'] = 'none'
	BERED.fCanvas.wrapperEl.style['pointer-events'] = 'none'
	BERED.fCanvas.wrapperEl.style.opacity = 0.5

	// reactivate as appropriate
	if( STEPS[ step_iter ].match(/fabric/) ){ 
		BERED.fCanvas.wrapperEl.style['pointer-events'] = 'initial'
		BERED.fCanvas.wrapperEl.style.opacity = 1
		document.querySelector('.section.selected').append( BERED.fabricPicker )

	}else if( STEPS[ step_iter ].match(/map/) ){
		map_ele.style['pointer-events'] = 'initial'

		// if( BERED.json_data ){
		// 	const map_data = BERED.json_data[ STEPS[ step_iter ] ]?.map
		// 	if( map_data ){
		// 		BERED.MAP.set('x', map_data.x )
		// 		BERED.MAP.set('y', map_data.y )
		// 		BERED.MAP.set('z', map_data.z )
		// 		BERED.MAP.set('r', map_data.r )
		// 	}
		// }

	}else if( STEPS[ step_iter ].match(/info/) ){
		//
	}
	BERED.current_step = step_iter

}















const update_map_blobs = async( step_iter, last_iter ) => {

	let side
	if( step_iter == 3 && last_iter == 2 ){
		side = 'left'
	}else if( step_iter === 5 && last_iter === 4 ){
		side = 'right'
	}	
	if( !side ) return // ( runs on every step )

	await new Promise((resolve, reject) => {
		html2canvas( document.querySelector('#bered-widget'), {} )
		.then( canvas => {
			BERED.json_data.combined_images = BERED.json_data.combined_images || {}
			BERED.json_data.combined_images[ side ] = canvas.toDataURL()
			console.log('updated map blob: ', side )
		})
	})
}

// const update_map_blobs = async( step_iter, last_iter ) => {
// 	/*
// 		set BERED raw image blobs depending on last step
// 		- openlayers 
// 		- fabricjs
// 	*/

// 	const ol_map = document.querySelector('.ol-layer canvas')

// 	let loaded = new Array(2)

// 	const params = {
// 		side: '',
// 		map: '',
// 		fcanvas: '',
// 	}

// 	// update image eles 
// 	if( step_iter == 3 && last_iter == 2 ){
// 		params.side = 'left'
// 		params.map = 'imageBlob1'
// 		params.fcanvas = 'imageBlob1_fCanvas'
// 	}else if( step_iter === 5 && last_iter === 4 ){
// 		params.side = 'right'
// 		params.map = 'imageBlob2'
// 		params.fcanvas = 'imageBlob2_fCanvas'
// 	}else{
// 		return // ( function runs on every step but only in conditions ^^ )
// 	}

// 	await new Promise(( resolve, reject ) => {
// 		// set the 2 raw blobs
// 		ol_map.toBlob( blob => {
// 			BERED[ params.map ] = blob
// 			loaded[0] = true
// 			if( loaded[0] && loaded[1] ) resolve()
// 		})
// 		BERED.fCanvas.lowerCanvasEl.toBlob( blob => {
// 			BERED[ params.fcanvas ] = blob
// 			loaded[1] = true
// 			if( loaded[0] && loaded[1] ) resolve()
// 		})
// 	})

// 	combine_blobs( params.side, BERED[ params.map ], BERED[ params.fcanvas ] )
// 	.then( img => {
// 		console.log('updated ' + params.side + ' image blob')
// 	})

// }


// const render_test = n => {

// 	if( !localStorage.getItem('bered-dev') ) return console.log('skipping dev render')

// 	lib.hal('standard', 'rendering test....', 3000 )

// 	console.log('rendering test', n )

// 	setTimeout(() => { // otherwise blobs arent loaded yet
// 		const test = document.createElement('img')
// 		test.style.position = 'fixed'
// 		test.style['z-index'] = '999999'
// 		test.style.border = '3px solid lightgreen'
// 		test.style.top = '50px'
// 		test.style.left = '50px'
// 		test.src = URL.createObjectURL( BERED['imageBlob' + n] )
// 		document.body.append( test )

// 		setTimeout(() => {
// 			test.src = URL.createObjectURL( BERED['imageBlob' + n + '_fCanvas' ])
// 			test.style.border = '3px solid red'
// 			setTimeout(() => {
// 				test.remove()
// 			}, 4000 )
// 		}, 4000 )

// 	}, 3000 )

// }












const classes = [
	'selected-0',
	'selected-1',
	'selected-2',
	'selected-3',
	'selected-4',
	'selected-5',
]

const render_map_state = step => {
	/*
		render maps from BERED.json-data
	*/

	const mc = document.querySelector('.modal.bered-map .modal-content')
	if( mc ){
		for( const c of classes ){
			mc.classList.remove( c )
		}
		mc.classList.add( classes[ step ])
	}

	BERED.fCanvas.clear()
	let map_data, f_data

	switch( step ){
		case 0:
		case 1:
		case 2:
			f_data = BERED.json_data.a.fabric
			map_data = BERED.json_data.a.map
			break;
		case 3:
		case 4:
		case 5:
			f_data = BERED.json_data.b.fabric
			map_data = BERED.json_data.b.map
			break;
		default: return console.log("missing map state case ", step )

	}
	if( f_data ) BERED.fCanvas.loadFromDatalessJSON( f_data )
	if( map_data ) render_map_view( map_data )
}



const render_map_view = map_data => {
	/*
		render openlayers properties from BERED.json-data
	*/

	BERED.MAPS['bered-map'].getView().setCenter([ map_data.x, map_data.y ])
	if( map_data.r ) BERED.MAPS['bered-map'].getView().setRotation( map_data.r )
	if( map_data.z ) BERED.MAPS['bered-map'].getView().setZoom( map_data.z )
	// BERED.MAPS['bered-map'].set('x', map_data.x )
	// BERED.MAPS['bered-map'].set('y', map_data.y )
	// BERED.MAPS['bered-map'].set('z', map_data.z )
	// BERED.MAPS['bered-map'].set('r', map_data.r )
}



// // render poly on closing click
// const render_live_poly = () => {

// 	const poly = new fabric.Polygon( BERED.live_polygon, {
// 		fill: 'khaki',
// 		stroke: 'black',
// 		strokeWidth: 3,
// 		hasControls: false,
// 	})
// 	BERED.fCanvas.add( poly )
// 	BERED.fCanvas.requestRenderAll()
// 	BROKER.publish('SET_DRAW_STATE', {
// 		state: false,
// 		button: document.querySelector('.bered-instructions .draw-wrap .button')
// 	})
// 	const objs = BERED.fCanvas._objects
// 	for( let i = objs.length-1; i >= 0; i-- ){
// 		if( objs[i].bered_is_marker ) BERED.fCanvas.remove( objs[i] )
// 	}
// 	delete BERED.live_polygon 
// 	BERED.fCanvas.requestRenderAll()
// }


// // canvas clicks
// const set_polygon = e => {
// 	/* 
// 		update live-polygon points
// 	*/

// 	const { isClick, pointer } = e // absolutePointer
// 	const { x, y } = pointer

// 	if( BERED.live_polygon ){ // 
// 		console.log('set polygon', 1)
// 		for( const point of BERED.live_polygon ){
// 			if( Math.abs( point.x - x ) < 10 && Math.abs( point.y - y ) < 10 ){
// 				console.log('closing click')
// 				return render_live_poly()
// 			}
// 		}
// 		// BERED.live_polygon.push({ x: x, y: y }) // ( NOT a Polygon instance, just array )

// 	}else{ // just started drawing
// 		// BERED.live_polygon = [{x: x,y: y}]
// 		console.log('set polygon', 2)
// 	}
// 	update_polygon( x, y, true )
// }


// const update_polygon = ( x, y, called_by_set ) => {
// 	if( !called_by_set ) return console.log('only call from set_polygon')

// 	BERED.live_polygon = BERED.live_polygon || []
// 	BERED.live_polygon.push({x: x, y: y})

// 	// line marker
// 	if( BERED.live_polygon.length > 1 ){
// 		const len = BERED.live_polygon.length
// 		const penultimate_point = BERED.live_polygon[ len - 2 ]
// 		const ultimate_point = BERED.live_polygon[ len - 1 ]
// 		const points = [
// 			penultimate_point.x, 
// 			penultimate_point.y,
// 			ultimate_point.x, 
// 			ultimate_point.y,
// 		]
// 		console.log( 'points', points )
// 		const new_line = new fabric.Line(points, {
// 			stroke: 'black',
// 			// left: 50,
// 			// top: 50,
// 			strokeWidth: 3,
// 			selectable: false,
// 		})
// 		new_line.bered_is_marker = true
// 		console.log( new_line )
// 		BERED.fCanvas.add( new_line )
// 	}

// 	// circle marker
// 	const new_marker = new fabric.Circle({
// 		radius: 7,
// 		fill: 'orange',
// 		originX: 'center',
// 		originY: 'center',
// 		left: x,
// 		top: y,
// 		selectable: false,
// 	})
// 	new_marker.bered_is_marker = true
// 	BERED.fCanvas.add( new_marker )
// }









// ------------------------------------------
// subscribers
// ------------------------------------------

const set_nav = event => {
	/*
		handle CSS and set-canvas-state
	*/

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
					set_map_active( step_iter )
					// bundle last step
					bundle_json( i ) 
					update_map_blobs( step_iter, i )
					.then( res => {
						render_map_state( step_iter )
					})
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
					set_map_active( step_iter )
					bundle_json( i ) 
					update_map_blobs( step_iter, i )
					.then( res => {
						render_map_state( step_iter )
					})
					break;

				}else{
					console.log('at beginning...')
				}

			}
			
		}

	}

}

// const set_draw_mode = event => {
// 	const { state, button } = event
// 	// fCanvas.isDrawingMode = state

// 	// object state
// 	BERED.is_polygon_mode = state
// 	// canvas state
// 	if( state ){
// 		BERED.fCanvas.on('mouse:up', set_polygon )
// 	}else{
// 		BERED.fCanvas.off('mouse:up', set_polygon )
// 	}
// 	// DOM state
// 	if( state ){
// 		button.classList.add('selected')
// 	}else{
// 		button.classList.remove('selected')
// 	}
// }










// ------------------------------------------
// init
// ------------------------------------------

;(async() => {

	if( !details ) return console.log('halting bered - invalid woo field')
	if( !bered_hidden?.length ) return console.log('halting bered - no hidden field')

	document.body.classList.add('bered')

	const begin = lib.b('div')
	begin.classList.add('button')
	begin.innerText= 'Make your map'
	begin.style['text-shadow'] = 'none'
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
// BROKER.subscribe('SET_DRAW_STATE', set_draw_mode )

