import BROKER from '../EventBroker.js?v=115'
import {
	build_button,
	build_section,
} from '../shared/build.js?v=115'
import STEPS from '../shared/STEPS.js?v=115'
import { 
	gen_input,
	b,
	hal,
	bered_spinner,
	formatBeredIcon,
} from '../lib.js?v=115'
// import { 
// 	Modal 
// } from '../Modal.js?v=115'
// import generate_sign from '../generate_sign.js?v=115'
import preview_modal from '../shared/preview_modal.js?v=115'
import bundle_map_data from '../shared/bundle_map_data.js?v=115'





const img_loader = b('div')
img_loader.style.position = 'absolute'
img_loader.style.width = '0px'
img_loader.style.height = '0px'
img_loader.style.opacity = 0
document.body.append( img_loader )


BERED.icon_count = 19


const icon_captions = [
	'drivstofftanker',
	'gass/propan',
	'oljefat',
	'stromkabler',
	'inntaksilkringer',
	'sikringsskap',
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








let onetime
const build_fabric_picker = ( widget_ele, step ) => {

	console.log("picker for: ", step )

	// the GUI part
	const wrapper = b('div', false, 'icon-wrap')

	const expl = b('p')
	expl.innerText = 'Click an icon to add it to map.'
	wrapper.append( expl )

	// the map overlay part
	const canvas = b('canvas')
	canvas.width = widget_ele.getBoundingClientRect().width
	canvas.height = widget_ele.getBoundingClientRect().height
	widget_ele.append( canvas )

	if( onetime ) return console.error('--- need to run this one time only... ---')
	onetime = true

	// if( !BERED.fCanvas ){ // ( runs multiple times )
		const fCanvas = BERED.fCanvas = new fabric.Canvas( canvas, {
			// width: canvas.width,
			// height: canvas.height,
		})		
		const w = widget_ele.getBoundingClientRect().width
		fCanvas.setWidth( w )
		fCanvas.setHeight( w )
		window.addEventListener('resize', () => {
			// console.log('w', canvas.width )
			const m = document.querySelector('.modal.bered-map')
			if( !m ) return console.log('no map to resize')

			canvas.width = widget_ele.getBoundingClientRect().width
			canvas.height = widget_ele.getBoundingClientRect().height
			
			fCanvas.setWidth( canvas.width )
			fCanvas.setHeight( canvas.width )
			fCanvas.requestRenderAll()
		})

	// }

	const icon_options = b('div')

	// const ele = b('div')
	// ele.classList.add('bered-preview-icons')
	for( let i = 0; i < BERED.icon_count; i++ ){

		const wrap = b('div', false, 'bered-icon-wrap')
		const img = b('img', false, 'bered-marker')
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
			fimg.crossOrigin = 'Anonymous'
			fimg.src = BERED.plugin_url + '/resource/markers/' + (i+1) + '.svg'
			img_loader.append( fimg )
			fimg.onload = e => {
				const dest = {
					x: fCanvas.getWidth() / 2 + ( Math.random() * 100 ),
					y: 50 + ( Math.random() * 100 ),
				}
				const fIcon = new fabric.Image( fimg, {
					// should work for different types:
					// should be same for all types:
					width: fimg.width,
					height: fimg.height,
					top: fCanvas.getHeight() / 2,
					left: fCanvas.getWidth(),
					hasRotatingPoint: false,
				})

				formatBeredIcon( fIcon, i === 17 )

				fCanvas.add( fIcon )
				fIcon.animate('left', dest.x, {
					onChange: fCanvas.renderAll.bind( fCanvas )
				})
				fIcon.animate('top', dest.y, {
					onChange: fCanvas.renderAll.bind( fCanvas )
				})
				fCanvas.requestRenderAll()
				fimg.remove()
			}

		})

	}

	wrapper.append( icon_options )

	BERED.fabricPicker = wrapper

	return wrapper
	// console.log('what is widget though..', widget_ele )

}





const add_navs = section => {

	const wrap = b('div', 'bered-nav')

	const back = b('div', false, 'nav', 'button', 'back')
	back.setAttribute('data-dir', 'back')
	back.innerHTML = '<img src="' + BERED.plugin_url + '/resource/icons/BACK.png">'
	back.addEventListener('click', () => {
		BROKER.publish('SET_NAV_STEP', {
			dir: 'back',
		})
	})

	const forward = b('div', false, 'nav', 'button', 'forward')
	forward.setAttribute('data-dir', 'forward')
	forward.innerHTML = '<img src="' + BERED.plugin_url + '/resource/icons/NEXT.png">'
	forward.addEventListener('click', () => {
		BROKER.publish('SET_NAV_STEP', {
			dir: 'forward',
		})
		// BROKER.publish('SET_DRAW_STATE', { 
		// 	state: false, 
		// 	button: section.parentElement.querySelector('.draw-wrap .button'),
		// })
	})

	wrap.append( back )
	wrap.append( forward )

	section.append( wrap )

}






const build_instruction_panel = ( wrapper, widget, map ) => {

	const panel = b('div', false, 'bered-instructions')

	let step, expl //header,

	let s = 1
	const steps = STEPS.length

	// step 1
	step = build_section()
	step.classList.add('selected')
	expl = b('div')
	expl.innerHTML = `<h3>step ${s}/${steps}</h3>`
	step.append( expl )
	step.append( build_form() )
	add_navs( step )
	panel.append( step )
	s++

	// debugger

	// step 2 - move & rotate map
	step = build_section()
	expl = b('div')
	expl.innerHTML = `
	<h3>step ${s}/${steps}</h3>
	<p>Position the map to fit.</p>
	<p>Scroll your mouse for greater precision.</p>
	<!--p>
		<i>
			If you do not see a map, it is likely the window was resized.  Try closing this popup and re-opening.  Your data will be saved.
		</i>
	</p-->
	`
	step.append( expl )
	const r1 = build_button('<img src="' + BERED.plugin_url + '/resource/icons/rotateright.png">')
	r1.classList.add('rotate')
	r1.addEventListener('mousedown', () => {
		BROKER.publish('MAP_ROTATE', {
			state: true,
			dir: 1,
			map: map,
		})
	})
	const r2 = build_button('<img src="' + BERED.plugin_url + '/resource/icons/rotateleft.png">')
	r2.classList.add('rotate')
	r2.addEventListener('mousedown', () => {
		BROKER.publish('MAP_ROTATE', {
			state: true,
			dir: -1,
			map: map,
		})
	})
	const rwrapper = b('div', false, 'button-wrapper')
	rwrapper.append( r2 )
	rwrapper.append( r1 )
	step.append( rwrapper)
	add_navs( step )
	panel.append( step )
	s++

	// step 3 - first icons
	step = build_section()
	expl = b('div')
	expl.innerHTML = `<h3>step ${s}/${steps}</h3>`
	step.append( expl )
	step.append( build_fabric_picker( widget, s ) )
	add_navs( step )
	panel.append( step )
	s++

	// step 4 - rezoom map
	step = build_section()
	expl = b('div')
	expl.innerHTML = `
	<h3>step ${s}/${steps}</h3>
	<p>Now position the map to fit your main building...</p>`
	step.append( expl )
	const r1b = build_button('<img src="' + BERED.plugin_url + '/resource/icons/rotateright.png">')
	r1b.classList.add('rotate')
	r1b.addEventListener('mousedown', () => {
		BROKER.publish('MAP_ROTATE', {
			state: true,
			dir: 1,
			map: map,
		})
	})
	const r2b = build_button('<img src="' + BERED.plugin_url + '/resource/icons/rotateleft.png">')
	r2b.classList.add('rotate')
	r2b.addEventListener('mousedown', () => {
		BROKER.publish('MAP_ROTATE', {
			state: true,
			dir: -1,
			map: map,
		})
	})
	const rwrapper2 = b('div', false, 'button-wrapper')
	rwrapper2.append( r2b )
	rwrapper2.append( r1b )
	step.append( rwrapper2)
	// step.append( r1b )
	// step.append( r2b )
	add_navs( step )
	panel.append( step )
	s++

	// step 5 - second icons
	step = build_section()
	expl = b('div')
	expl.innerHTML = `
	<h3>step ${s}/${steps}</h3>
	Now place icons specifically on your main building`
	step.append( expl )
	// appends self later:
	// step.append( build_fabric_picker( widget ) )
	add_navs( step )
	panel.append( step )
	s++

	// step 6 - checkout
	step = build_section()
	expl = b('div')
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

	const wrapper = b('div', 'bered-checkout-wrap')

	// preview
	const preview = b('div', false, 'button')
	preview.innerText = 'preview'
	preview.addEventListener('click', () => {
		preview_modal( JSON.stringify( BERED.json_data ) )
	})
	wrapper.append( preview )

	// checkout
	const checkout = b('div', false, 'button')
	checkout.innerText = 'add to cart'
	checkout.addEventListener('click', () => {

		bered_spinner.show()
		hal('standard', 'This can take up to a full minute to process', 5000)

		setTimeout(() => { // time to show spinner

			const data_area = document.querySelector('textarea.bered-order-data')
			if( !data_area ) return console.error('Unable to find "order data" field to append map data')
			// const data_bundle = bundle_map_data()
			// data_area.value = JSON.stringify( data_bundle )
			const bounded = [ BERED.json_data ]
			data_area.value = JSON.stringify( bounded )
			const real_checkout = document.querySelector('form.cart button[name="add-to-cart"]')
			if( !real_checkout ) return hal('error', 'unable to process order; invalid checkout button', 5000 )
			console.log('checkout button for dev: ', real_checkout )
			if( 1 ){
				real_checkout.click()
			}

		}, 100 )

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
	const form = b('form', 'bered-form')
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
	melketankservice
	avloserlag
	elektriker
	rorlegger
	nabokontakt

	*/

	// const spoof = 0 && location.href.match(/localhost/) ? true : false


	const render_display = b('div', 'font-display', 'column')
	render_display.innerText = 'Gårdsnavn'
	form.append( render_display )

	// -------- LEFT panel
	const LEFT = b('div', false, 'column', 'column-2')

	const gardsnavn = gen_input('text', { placeholder: 'Gårdsnavn', name: 'gardsnavn' }) // placeholder: 'kommune',
	gardsnavn.querySelector('input').addEventListener('keyup', e => {
		const val = gardsnavn.querySelector('input').value
		if( val ){
			render_display.innerText = val
		}else{
			render_display.innerText = 'Gårdsnavn'
		}
	})
	const addresse = gen_input('text', { placeholder: 'addresse', name: 'addresse' })
	// font <select>
	const font_drop = gen_input('select', {
		name: 'font_drop',
	})
	font_drop.id = 'font-selection'
	const label = b('label', false)
	label.innerText = 'Choose a font for your title'
	font_drop.prepend( label )

	const fonts = ['Berkshire','Galada','Lobster','Oleo','Veracruz']


	let c = 0
	for( const font of fonts ){
		const option = gen_input('option', {
			select: font_drop.querySelector('select'),
			content: font,
			value: font,
		})
		c++
		if( c == 1 ) option.selected = true // querySelector('option')
	}
	const drop = font_drop.querySelector('select')
	drop.addEventListener('change', e => {
		console.log( drop.value )
		render_display.style['font-family'] = BERED.title_font = drop.value
	})
	render_display.style['font-family'] = BERED.title_font = drop.value = ( BERED.title_font || 'Berkshire' )


	const ansvarlig = gen_input('text', { placeholder: 'ansvarlig', name: 'ansvarlig' })
	const telefon = gen_input('text', { placeholder: 'telefon', name: 'telefon' })
	const kommune = gen_input('number', { label_content: 'kommunenummer', name: 'kommune', max: 9999 }) // placeholder: 'kommune',
	const gardsnummer = gen_input('number', { label_content: 'gardsnummer', name: 'gards', max: 9999 })
	const bruksnr = gen_input('number', { label_content: 'bruksnummer', name: 'bruksnr', max: 999 })

	LEFT.append( gardsnavn )
	LEFT.append( addresse )
	LEFT.append( font_drop )
	LEFT.append( kommune ) // 4 dig
	LEFT.append( gardsnummer )
	LEFT.append( bruksnr ) // user number 
	LEFT.append( ansvarlig ) // owner
	LEFT.append( telefon ) // owner

	// -------- RIGHT panel
	const RIGHT = b('div', false, 'column', 'column-2')

	// const tif = gen_input('text', { placeholder: 'tif', name: 'tif', force_number: true })
	const nødslakt = gen_input('text', { placeholder: 'nødslakt', name: 'nødslakt', force_number: false })
	const melketankservice = gen_input('text', { placeholder: 'melketankservice', name: 'melketankservice', force_number: false })
	const avløserlag = gen_input('text', { placeholder: 'avløserlag', name: 'avløserlag', force_number: false })
	const elektriker = gen_input('text', { placeholder: 'elektriker', name: 'elektriker', force_number: false })
	const rørlegger = gen_input('text', { placeholder: 'rørlegger', name: 'rørlegger', force_number: false })
	const nabokontakt = gen_input('text', { placeholder: 'nabokontakt', name: 'nabokontakt', force_number: false })

	// RIGHT.append( tif )
	RIGHT.append( nødslakt )
	RIGHT.append( melketankservice )
	RIGHT.append( avløserlag )
	RIGHT.append( elektriker )
	RIGHT.append( rørlegger )
	RIGHT.append( nabokontakt )

	form.append( LEFT )
	form.append( RIGHT )

	return form
}






// const build_dev_panel = wrapper => {

// 	const panel = b('div')
// 	panel.id = 'bered-dev-gui'
// 	wrapper.append( panel )

// 	let section

// 	// BORDERS
// 	section = build_section()
// 	const add_borders = build_button('add countries')
// 	add_borders.addEventListener('click', () => {
// 		BROKER.publish('MAP_ADD_LAYER', {
// 			type: 'borders',
// 		})
// 	})
// 	section.append( add_borders )
// 	const clear_borders = build_button('clear countries')
// 	clear_borders.addEventListener('click', () => {
// 		BROKER.publish('MAP_CLEAR', {
// 			type: 'borders'
// 		})
// 	})
// 	section.append( clear_borders )
// 	panel.append( section )

// 	// NORMAL DATA
// 	section = build_section()
// 	const add_data = build_button('add data')
// 	add_data.addEventListener('click', () => {
// 		BROKER.publish('MAP_ADD_LAYER', {
// 			type: 'data',
// 		})
// 	})
// 	section.append( add_data )
// 	// const clear_data = build_button('clear data')
// 	// clear_data.addEventListener('click', () => {
// 	// 	BROKER.publish('MAP_CLEAR', {
// 	// 		type: 'data'
// 	// 	})
// 	// })
// 	// section.append( clear_data )
// 	panel.append( section )

// 	// OSM
// 	section = build_section()
// 	const add_osm = build_button('add osm')
// 	add_osm.addEventListener('click', () => {
// 		BROKER.publish('MAP_ADD_LAYER', {
// 			type: 'osm',
// 		})
// 	})
// 	section.append( add_osm )
// 	// const clear_osm = build_button('clear osm')
// 	// clear_osm.addEventListener('click', () => {
// 	// 	BROKER.publish('MAP_CLEAR', {
// 	// 		type: 'osm'
// 	// 	})
// 	// })
// 	// section.append( clear_osm )
// 	panel.append( section )

// }


const add_zoom = ( widget, map_obj ) => {
	const url = {
		in: BERED.plugin_url + '/resource/icons/pluss.png',
		out: BERED.plugin_url + '/resource/icons/minus.png',
	}
	let c = 0
	const zoomin = b('div')
	zoomin.classList.add('bered-zoom', 'zoomin')
	zoomin.innerHTML = `<img src="${ url.in }">`
	widget.append( zoomin )
	zoomin.querySelector('img').onerr = err => {
		if( c > 10 ) return
		zoomin.src = url.in
		c++
	}
	let c2 = 0
	const zoomout = b('div')
	zoomout.classList.add('bered-zoom', 'zoomout')
	zoomout.innerHTML = `<img src="${ url.out }">`
	widget.append( zoomout )
	zoomout.querySelector('img').onerr = err => {
		if( c2 > 10 ) return 
		zoomout.src = url.out
		c2++
	}
}





export {
	// build_dev_panel,
	build_instruction_panel,
	add_zoom,
}