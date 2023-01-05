/*
	entry point for both client and admin module


*/
import STEPS from '../shared/STEPS.js?v=116'
import * as lib from '../lib.js?v=116'
import BROKER from '../EventBroker.js?v=116'
import { Modal } from '../Modal.js?v=116'
import * as map from '../shared/map.js?v=116'
import * as gui from './bered-panels.js?v=116'
import admin from '../admin/bered_admin.js?v=116' // no op
import DEV from '../dev.js?v=116'
import bundle_json from '../shared/bundle_map_data.js?v=116'
// import combine_blobs from '../shared/combine_blobs.js?v=116'
import html2canvas from '../shared/html2canvas.esm.js'
// import get_blob from './get-blob.js?v=116'

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

	// if( BERED.resized ) return hal('error', 'page was resized - please refresh page and click again', 10 * 1000)

	const req = 1000
	if( window.innerWidth < req ) return hal('error', 'the map builder requires at least a '+ req + ' pixel screen', 10 * 1000 )

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
	gui.build_instruction_panel( m.right_panel, widget, map_obj )
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
	}, 500)

}



const set_icon_visibility = ( i, section ) => {

	/*
		i == zero indexed
		2,4 = steps 3,5
	*/

	const icons = section.querySelectorAll('.bered-icon-wrap')

	const allowed = {
		2: [1,2,3,4,7,9,10,11,12,15,16,17,18,19],
		4: [ 6, 8, 9, 10, 13, 14, 15, 16, 18],
	}

	switch( i ){

	case 2:
	case 4:
		for( let x = 0; x < icons.length; x++ ){
			if( allowed[i].includes( x+1 ) ){ // more zero indexing...
				icons[x].style.display = 'block'
			}else{
				icons[x].style.display = 'none'
				// console.log('hiding: ' + x )
			}
		}
		break;

	default:
		console.log('no icons to set viz', i )
		break;
	}

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
	BERED.fCanvas.wrapperEl.style.opacity = 0

	// reactivate as appropriate
	if( STEPS[ step_iter ].match(/fabric/) ){ 
		BERED.fCanvas.wrapperEl.style['pointer-events'] = 'initial'
		BERED.fCanvas.wrapperEl.style.opacity = 1
		document.querySelector('.section.selected').append( BERED.fabricPicker )

	}else if( STEPS[ step_iter ].match(/map/) ){
		map_ele.style['pointer-events'] = 'initial'

	}else if( STEPS[ step_iter ].match(/info/) ){
		//
	}else{
		BERED.fCanvas.wrapperEl.style.opacity = 1
	}

	// for( const obj of BERED.fCanvas.getObjects() ){
	// 	// console.log('rehydrating set-map-active: ', obj.type, obj.src )
	// 	lib.formatBeredIcon( obj, !!obj.src.match(/17.svg/) )
	// }

	BERED.current_step = step_iter

}








let last_opacity, last_active

const map_say_cheese = state => {
	if( state ){
		last_opacity = BERED.fCanvas.wrapperEl.style.opacity
		BERED.fCanvas.wrapperEl.style.opacity = 1		
		last_active = BERED.fCanvas.getActiveObject()
		BERED.fCanvas.discardActiveObject()
	}else{
		BERED.fCanvas.wrapperEl.style.opacity = last_opacity
		if( last_active ) BERED.fCanvas.setActiveObject( last_active )
	}
	BERED.fCanvas.requestRenderAll()
}





const update_map_blobs = async( step_iter, last_iter ) => {

	let side
	if( step_iter == 3 && last_iter == 2 ){
		side = 'left'
	}else if( step_iter === 5 && last_iter === 4 ){
		side = 'right'
	}	
	if( !side ) return // ( runs on every step )

	bered_spinner.show() 

	// --- make sure opaque for save
	map_say_cheese( true )

	await new Promise((resolve, reject) => {

		setTimeout(() => { // wait for canvas to render cheese

			html2canvas( document.querySelector('#bered-widget'), {
				// allowTaint: true
				// useCORS: true,
			})
			.then( canvas => {
				BERED.json_data.combined_images = BERED.json_data.combined_images || {}
				BERED.json_data.combined_images[ side ] = canvas.toDataURL()
				console.log('updated map blob: ', side )

				// --- reset opacity
				map_say_cheese( false )

				setTimeout(() => {
					bered_spinner.hide() 
					resolve()
				}, 100)

			})
		}, 200 )

	})
}








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
	// handle fcanvas
	if( f_data ) BERED.fCanvas.loadFromJSON( f_data ) // loadFromDatalessJSON
		// console.log('yes we load...')
	setTimeout(() => {
		for( const obj of BERED.fCanvas.getObjects() ){
			console.log('rehydrating icon render-map-state: ', obj.type, obj.src )
			lib.formatBeredIcon( obj, !!obj.src.match(/18.svg/) )
		}
		BERED.fCanvas.requestRenderAll()
	}, 100)
	// handle open-layer map
	if( map_data ) render_map_view( map_data )
}



const render_map_view = map_data => {
	/*
		render openlayers properties from BERED.json-data
	*/

	BERED.MAPS['bered-map'].getView().setCenter([ map_data.x, map_data.y ])
	if( map_data.r ) BERED.MAPS['bered-map'].getView().setRotation( map_data.r )
	if( map_data.z ) BERED.MAPS['bered-map'].getView().setZoom( map_data.z )
}










// ------------------------------------------
// subscribers
// ------------------------------------------

const set_nav = event => {
	/*
		handle CSS and set-canvas-state
	*/

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
					setTimeout(() => {
						set_icon_visibility( step_iter, steps[step_iter] )
					}, 200 )
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
					setTimeout(() => {
						set_icon_visibility( step_iter, steps[step_iter] )
					}, 200 )
					break;

				}else{
					console.log('at beginning...')
				}

			} // is forward / back

		} // if this loop is selected

	} // for each step

	// add zoom if needed
	const s = next || prev
	const zoom_holder = s?.querySelector('.zoom-holder')
	if( zoom_holder ){
		const controls = document.querySelector('.ol-zoom.ol-control')
		if( !controls ) return console.log('no controls for zoomer...')
		zoom_holder.append( controls )

		const zooms = modal.querySelectorAll('.bered-zoom')
		for( const z of zooms ){
			zoom_holder.append( z )
		}

		// const zoomin = modal.querySelector('.bered-zoom.zoomin')
		// const zoomout = modal.querySelector('.bered-zoom.zoomout')
		// const zs = [ zoomin, zoomout ]
		for( const z of zoom_holder.querySelectorAll('button') ){
			if( !z.bound_hover ){
				z.bound_hover = true
				let selector 
				let bered_zoom
				z.addEventListener('mouseover', e => {
					selector = z.classList.contains('ol-zoom-in') ? 'zoomin' : 'zoomout'
					bered_zoom = z.parentElement.parentElement.querySelector('.bered-zoom.' + selector )
					bered_zoom.style.transform = 'scale(1.05)'
				})
				z.addEventListener('mouseout', e => {
					selector = z.classList.contains('ol-zoom-in') ? 'zoomin' : 'zoomout'
					bered_zoom = z.parentElement.parentElement.querySelector('.bered-zoom.' + selector )
					bered_zoom.style.transform = 'scale(1)'
				})
			}
		}

	}

} // set nav









// ------------------------------------------
// init
// ------------------------------------------

;(async() => {

	// check if this page load just placed an order; click cart link if so
	const redirect = localStorage.getItem('bered-order-redirect')
	const redirect_window = 1000 * 15
	if( redirect ){
		let c = 0
		let checking_redirect = setInterval(() => {
			if( c > 30 ) return clearInterval( checking_redirect )
			c++
			const cart_link = document.querySelector('.woocommerce-message .button')

			if( Number( redirect) > Date.now() - redirect_window ){
				if( cart_link ){
					if( location.href.match(/localhost/)){
						hal('dev', '(dev) found cart link, halting', 5000 )
					}else{
						cart_link.click()
					}
					clearInterval( checking_redirect )
				}else{
					console.log('no cart link')
				}
			}else{
				delete localStorage['bered-order-redirect']
				clearInterval( checking_redirect )
			}

		}, 300 )
	}

	const checkout = document.querySelector('form.cart button[name="add-to-cart"]')
	if( checkout ){ // valid product page

		if( !details ) return console.log('halting bered - invalid woo field')
		if( !bered_hidden?.length ) return console.log('halting bered - no hidden field')

		document.body.classList.add('bered')

		checkout.parentElement.classList.add('bered-hidden')
		// classList.add('disabled')

		const begin = lib.b('div', 'bered-begin', 'bered-font-medium')
		const intro = lib.b('div' )
		intro.innerText = `Her starter du med å lage din egen beredskaplan.
Du vil få god hjelp underveis og du kan også se 
på forklaringsvideoen under hvordan du går frem.`
		begin.append( intro )
		// begin.innerText= 'Make your map'
		const start = lib.b('img', false, 'bered-bump-hover')
		start.src = BERED.plugin_url + '/resource/icons/START.png'
		begin.append( start )
		begin.style['text-shadow'] = 'none'
		begin.style['margin-top'] = '20px'
		start.addEventListener('click', init_popup )
		details.append( begin )

		const vid = lib.b('div', 'bered-video')
		const vidheader = lib.b('h3')
		vidheader.innerText = 'Se forklaringsvideo'
		vid.append( vidheader )
		const vidimg = lib.b('img', false, 'bered-bump-hover')
		vidimg.src = BERED.plugin_url + '/resource/icons/VIDEO.png'
		vid.append( vidimg )
		details.append( vid )

		let order_data
		for( const outer of document.querySelectorAll('.wcpa_form_outer') ){
			if( outer.querySelector('textarea.bered-order-data') ){
				order_data = outer
				break
			}
		}
		if( order_data ){
			order_data.classList.add('bered-hidden')
		}

		const sponsor = lib.b('div', 'kart-logo')
		const sponimg = lib.b('img')
		sponimg.src = BERED.plugin_url + '/resource/icons/kartverket.png'
		sponsor.append( sponimg )
		details.append( sponsor )

	}else if( document.querySelector('.variation-BeredOrderData') ){ // checkout page

		const orders = document.querySelectorAll('dd.variation-BeredOrderData')
		let errors = []
		for( const data of orders ){
			const data_p = data.querySelector('p')
			try{
				const bered = JSON.parse( data_p?.innerText )[0]
				if( !bered.combined_images?.left || 
					!bered.combined_images?.right || 
					!bered.info 
				){
					errors.push('invalid map data found')
				}
				data_p.style.display = 'none'
				console.log('data: ', bered )
			}catch(err){
				console.error( err )
				errors.push('unable to parse order data')
				console.log('invalid order data', data_p )
			}
		}
		if( errors.length ){
			hal('error', 'invalid order data found - please confirm with us that your order is received correctly', 30 * 1000)
			for( const e of errors ){
				hal('error', e, 10 * 1000)
			}
		}

	}else{ // dont run on any other pages

		return console.log('not a bered page')

	}

})();

window.addEventListener('resize', () => {
	BERED.resized = true
})






// ------------------------------------------
// subscriptions
// ------------------------------------------

BROKER.subscribe('SET_NAV_STEP', set_nav )
// BROKER.subscribe('SET_DRAW_STATE', set_draw_mode )

