import BROKER from '../EventBroker.js?v=109'
import {
	build_button,
	build_section,
} from '../shared/build.js?v=109'
import { 
	gen_input,
	b,
} from '../lib.js?v=109'
import { Modal } from '../Modal.js?v=109'
// import generate_sign from '../generate_sign.js?v=109'
import preview_modal from '../shared/preview_modal.js?v=109'
import bundle_map_data from '../shared/bundle_map_data.js?v=109'





const img_loader = document.createElement('div')
img_loader.style.position = 'absolute'
img_loader.style.width = '0px'
img_loader.style.height = '0px'
img_loader.style.opacity = 0
document.body.append( img_loader )





const icon_captions = [
	'drivstofftanker',
	'gass/propan',
	'oljefat',
	'stromkabler',
	'inntaksilkringer',
	'silkringsskap',
	'vannledniger',
	'stoppekran',
	'brannslokkingsutstyr',
	'brannalarm/panel',
	'plantevernmidler',
	'handelsgjodsellager',
	'nodutgang',
	'sagepunkt evakuering',
	'personlig verneuststyr',
	'forstehjelpsutstyr',
	'moteplass ved brann',
	'innganger',
	'skiltets plassering',
]










const icons = [
	{
		type: 'circle',
		color: 'yellow',
	},
	{
		type: 'circle',
		color: 'green',
	},
	{
		type: 'circle',
		color: 'red',
	},
	{
		type: 'rect',
		color: 'green',
	},
	{
		type: 'rect',
		color: 'purple',
	},
	{
		type: 'rect',
		color: 'yellow',
	},
	{
		type: 'rect',
		color: 'red',
	},
	{
		type: 'image',
		color: 'green',
		src: 'pin-drop.png',
	},
	{
		type: 'image',
		color: 'yellow',
		src: 'pin-drop.png',
	}
]

const type_map = {
	'circle': fabric.Circle,
	'rect': fabric.Rect,
	'image': fabric.Image,
}

const build_fabric_drawer = widget_ele => {

	const wrapper = document.createElement('div')
	wrapper.classList.add('draw-wrap')

	const expl = document.createElement('p')
	expl.innerText = `Click the pencil to draw your building.  
Connect the dots to complete a shape.
You can click and drag the shape to fit.
`
	wrapper.append( expl )

	const pencil = document.createElement('div')
	pencil.classList.add('button')
	pencil.innerText = 'pencil'
	pencil.addEventListener('click', () => {
		BROKER.publish('SET_DRAW_STATE', { 
			// state: !BERED.fCanvas.isDrawingMode, 
			state: !BERED.is_polygon_mode,
			button: pencil,
		})
	})
	wrapper.append( pencil )

	return wrapper

}

let onetime
const build_fabric_picker = widget_ele => {

	// the GUI part
	const wrapper = document.createElement('div')
	wrapper.classList.add('icon-wrap')

	const expl = document.createElement('p')
	expl.innerText = 'Click an icon to add it to map.'
	wrapper.append( expl )

	// the map overlay part
	const canvas = document.createElement('canvas')
	canvas.width = widget_ele.getBoundingClientRect().width
	canvas.height = widget_ele.getBoundingClientRect().height
	widget_ele.append( canvas )


	if( onetime ) return console.log('--- need to run this one time only... ---')
	onetime = true

	const fCanvas = BERED.fCanvas = new fabric.Canvas( canvas, {
		// width: canvas.width,
		// height: canvas.height,
	})
	const w = widget_ele.getBoundingClientRect().width
	fCanvas.setWidth( w )
	fCanvas.setHeight( w )
	window.addEventListener('resize', () => {
		// console.log('w', canvas.width )
		canvas.width = widget_ele.getBoundingClientRect().width
		canvas.height = widget_ele.getBoundingClientRect().height
		
		fCanvas.setWidth( canvas.width )
		fCanvas.setHeight( canvas.width )
	})

	const icon_options = document.createElement('div')

	// const ele = b('div')
	// ele.classList.add('bered-preview-icons')
	for( let i = 0; i < 15; i++ ){

		const wrap = b('div')
		wrap.classList.add('bered-icon-wrap')
		const img = b('img')
		img.classList.add('bered-marker')
		let c = 0
		const base = BERED.plugin_url + '/resource/markers/' + (i+1)
		img.onerror = e => {
			if( c ) return
			img.src = base + '.png'
			c++
		}
		img.src = base + '.svg'
		const label = b('label')
		label.innerHTML = icon_captions[i]
		wrap.append( img )
		wrap.append( label )
		icon_options.append( wrap )

		wrap.addEventListener('click', () => {

			// the fabric bit
			const fimg = new Image()
			fimg.src = BERED.plugin_url + '/resource/markers/' + (i+1) + '.svg'
			img_loader.append( fimg )
			fimg.onload = e => {
				const fIcon = new fabric.Image( fimg, {
					// should work for different types:
					// should be same for all types:
					width: fimg.width,
					height: fimg.height,
					top: 50,
					left: 50,
					hasRotatingPoint: false,
				})
				fIcon.bered_icon = true
				fIcon.scaleToWidth( 35 )
				fIcon.scaleToHeight( 35 )
				fIcon.setControlsVisibility({
					tr: false,
					tl: false,
					br: false,
					bl: false,
					ml: false,
					mt: false,
					mr: false,
					mb: false,
					mtr: false
				})
				fCanvas.add( fIcon )
				fCanvas.requestRenderAll()
				fimg.remove()
			}

		})

	}

	// for( const entry of icons ){
	// 	let icon
	// 	if( entry.type == 'image'){
	// 		icon = new Image()
	// 		icon.src = BERED.plugin_url + '/resource/' + entry.src
	// 	}else{
	// 		icon = document.createElement('div')
	// 		icon.style.background = entry.color
	// 	}
	// 	icon.classList.add('icon', entry.type )
	// 	icon.addEventListener('click', () => {
	// 		const TYPE = type_map[ entry.type ]
	// 		let fIcon
	// 		if( entry.type === 'image' ){
	// 			const img = new Image()
	// 			img.src = BERED.plugin_url + '/resource/' + entry.src
	// 			img_loader.append( img )
	// 			img.onload = e => {
	// 				fIcon = new TYPE( img, {
	// 					// should work for different types:
	// 					// should be same for all types:
	// 					width: img.width,
	// 					height: img.height,
	// 					top: 50,
	// 					left: 50,
	// 					hasRotatingPoint: false,
	// 				})
	// 				fIcon.bered_icon = true
	// 				fIcon.scaleToWidth( 35 )
	// 				fIcon.scaleToHeight( 35 )
	// 				fIcon.setControlsVisibility({
	// 					tr: false,
	// 					tl: false,
	// 					br: false,
	// 					bl: false,
	// 					ml: false,
	// 					mt: false,
	// 					mr: false,
	// 					mb: false,
	// 					mtr: false
	// 				})
	// 				fCanvas.add( fIcon )
	// 				fCanvas.requestRenderAll()
	// 				img.remove()
	// 			}

	// 		}else{
	// 			fIcon = new TYPE({
	// 				// should work for different types:
	// 				radius: 15,
	// 				width: 30,
	// 				height: 30,
	// 				// should be same for all types:
	// 				fill: entry.color,
	// 				top: 50,
	// 				left: 50,
	// 				hasRotatingPoint: false,
	// 			})

	// 			fIcon.setControlsVisibility({
	// 				tr: false,
	// 				tl: false,
	// 				br: false,
	// 				bl: false,
	// 				ml: false,
	// 				mt: false,
	// 				mr: false,
	// 				mb: false,
	// 				mtr: false
	// 			})
	// 			fCanvas.add( fIcon )
	// 			fCanvas.requestRenderAll()

	// 		}

	// 	})
	// 	icon_options.append( icon )
	// }

	wrapper.append( icon_options )

	return wrapper
	// console.log('what is widget though..', widget_ele )

}





const add_navs = section => {

	const wrap = document.createElement('div')
	wrap.id = 'bered-nav'

	const back = document.createElement('div')
	back.setAttribute('data-dir', 'back')
	back.classList.add('nav', 'button', 'back')
	back.innerText = 'back'
	back.addEventListener('click', () => {
		BROKER.publish('SET_NAV_STEP', {
			dir: 'back',
		})
		BROKER.publish('SET_DRAW_STATE', { 
			state: false, 
			button: section.parentElement.querySelector('.draw-wrap .button'),
		})
	})

	const forward = document.createElement('div')
	forward.setAttribute('data-dir', 'forward')
	forward.classList.add('nav', 'button', 'forward')
	forward.innerText = 'next'
	forward.addEventListener('click', () => {
		BROKER.publish('SET_NAV_STEP', {
			dir: 'forward',
		})
		BROKER.publish('SET_DRAW_STATE', { 
			state: false, 
			button: section.parentElement.querySelector('.draw-wrap .button'),
		})
	})

	wrap.append( back )
	wrap.append( forward )

	section.append( wrap )

}






const build_instruction_panel = ( wrapper, widget ) => {

	const panel = document.createElement('div')
	panel.classList.add('bered-instructions')

	let step, header, expl


	let s = 1
	const steps = 5

	// step 1
	step = build_section()
	step.classList.add('selected')
	expl = document.createElement('div')
	expl.innerHTML = `<h3>step ${s}/${steps}</h3>`
	step.append( expl )
	step.append( build_form() )
	add_navs( step )
	panel.append( step )
	s++

	// step 2
	step = build_section()
	expl = document.createElement('div')
	expl.innerHTML = `
	<h3>step ${s}/${steps}</h3>
	<p>position the map to fit...</p>`
	step.append( expl )
	const r1 = build_button('rotate +')
	r1.classList.add('rotate')
	r1.addEventListener('mousedown', () => {
		BROKER.publish('MAP_ROTATE', {
			state: true,
			dir: 1,
		})
	})
	const r2 = build_button('rotate -')
	r2.classList.add('rotate')
	r2.addEventListener('mousedown', () => {
		BROKER.publish('MAP_ROTATE', {
			state: true,
			dir: -1,
		})
	})
	step.append( r1 )
	step.append( r2 )
	add_navs( step )
	panel.append( step )
	s++

	// step 3
	step = build_section()
	expl = document.createElement('div')
	expl.innerHTML = `
	<h3>step ${s}/${steps}</h3>
	`
	step.append( expl )
	step.append( build_fabric_drawer( widget ) )
	add_navs( step )
	panel.append( step )
	s++

	// step 4
	step = build_section()
	expl = document.createElement('div')
	expl.innerHTML = `<h3>step ${s}/${steps}</h3>`
	step.append( expl )
	step.append( build_fabric_picker( widget ) )
	add_navs( step )
	panel.append( step )
	s++

	// step 5
	step = build_section()
	expl = document.createElement('div')
	expl.innerHTML = `
	<h3>step ${s}/${steps}</h3>
	<p>checkout...</p>`
	step.append( expl )
	step.append( build_checkout_button() )
	add_navs( step )
	panel.append( step )

	wrapper.append( panel )

}





const build_checkout_button = () => {

	const wrapper = document.createElement('div')
	wrapper.id = 'bered-checkout-wrap'

	// preview
	const preview = document.createElement('div')
	preview.classList.add('button')
	preview.innerText = 'preview'
	preview.addEventListener('click', () => {
		const data_bundle = bundle_map_data()
		preview_modal( JSON.stringify( data_bundle ) )
	})
	wrapper.append( preview )

	// checkout
	const checkout = document.createElement('div')
	checkout.classList.add('button')
	checkout.innerText = 'add to cart'
	checkout.addEventListener('click', () => {
		const data_area = document.querySelector('textarea.bered-order-data')
		if( !data_area ) return console.error('Unable to find "order data" field to append map data')
		const data_bundle = bundle_map_data()
		data_area.value = JSON.stringify( data_bundle )
		const real_checkout = document.querySelector('form.cart button[name="add-to-cart"]')
		real_checkout.click()

		/*
			page refreshes here
			add localStorage redirect potentially..
		*/

	})
	wrapper.append( checkout )
	return wrapper

}




const build_form = () => {
	/*
		build step 1 info form
	*/
	const form = document.createElement('form')
	form.id = 'bered-form'
	/*
	name farm
	address 
	name
	phone
	other phones

	addresse
	kommune
	ansvarlig
	tif

	nodslakt
	melkentankservice
	avloserlag
	elektriker
	rorlegger
	nabokontakt

	*/

	const spoof = location.href.match(/localhost/) ? true : false

	const addresse = gen_input('text', { placeholder: 'addresse', name: 'addresse', spoof: 'addresse' })
	const kommune = gen_input('text', { placeholder: 'kommune', name: 'kommune', spoof: 'kommune' })
	const ansvarlig = gen_input('text', { placeholder: 'ansvarlig', name: 'ansvarlig', spoof: 'ansvarlig' })
	const tif = gen_input('text', { placeholder: 'tif', name: 'tif', spoof: 'tif' })
	const nodslakt = gen_input('text', { placeholder: 'nodslakt', name: 'nodslakt', spoof: 'nodslakt' })
	const melkentankservice = gen_input('text', { placeholder: 'melkentankservice', name: 'melkentankservice', spoof: 'melkentankservice' })
	const avloserlag = gen_input('text', { placeholder: 'avloserlag', name: 'avloserlag', spoof: 'avloserlag' })
	const elektriker = gen_input('text', { placeholder: 'elektriker', name: 'elektriker', spoof: 'elektriker' })
	const rorlegger = gen_input('text', { placeholder: 'rorlegger', name: 'rorlegger', spoof: 'rorlegger' })
	const nabokontakt = gen_input('text', { placeholder: 'nabokontakt', name: 'nabokontakt', spoof: 'nabokontakt' })
	form.append( addresse )
	form.append( kommune )
	form.append( ansvarlig )
	form.append( tif )
	form.append( nodslakt )
	form.append( melkentankservice )
	form.append( avloserlag )
	form.append( elektriker )
	form.append( rorlegger )
	form.append( nabokontakt )

	return form
}






const build_dev_panel = wrapper => {

	const panel = document.createElement('div')
	panel.id = 'bered-dev-gui'
	wrapper.append( panel )

	let section

	// BORDERS
	section = build_section()
	const add_borders = build_button('add countries')
	add_borders.addEventListener('click', () => {
		BROKER.publish('MAP_ADD_LAYER', {
			type: 'borders',
		})
	})
	section.append( add_borders )
	const clear_borders = build_button('clear countries')
	clear_borders.addEventListener('click', () => {
		BROKER.publish('MAP_CLEAR', {
			type: 'borders'
		})
	})
	section.append( clear_borders )
	panel.append( section )

	// NORMAL DATA
	section = build_section()
	const add_data = build_button('add data')
	add_data.addEventListener('click', () => {
		BROKER.publish('MAP_ADD_LAYER', {
			type: 'data',
		})
	})
	section.append( add_data )
	// const clear_data = build_button('clear data')
	// clear_data.addEventListener('click', () => {
	// 	BROKER.publish('MAP_CLEAR', {
	// 		type: 'data'
	// 	})
	// })
	// section.append( clear_data )
	panel.append( section )

	// OSM
	section = build_section()
	const add_osm = build_button('add osm')
	add_osm.addEventListener('click', () => {
		BROKER.publish('MAP_ADD_LAYER', {
			type: 'osm',
		})
	})
	section.append( add_osm )
	// const clear_osm = build_button('clear osm')
	// clear_osm.addEventListener('click', () => {
	// 	BROKER.publish('MAP_CLEAR', {
	// 		type: 'osm'
	// 	})
	// })
	// section.append( clear_osm )
	panel.append( section )

}




export {
	build_dev_panel,
	build_instruction_panel,
}