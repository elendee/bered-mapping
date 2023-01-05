import BROKER from '../EventBroker.js?v=116'
import {
	build_button,
	build_section,
} from '../shared/build.js?v=116'
import STEPS from '../shared/STEPS.js?v=116'
import { 
	gen_input,
	b,
	hal,
	bered_spinner,
	formatBeredIcon,
} from '../lib.js?v=116'
// import { 
// 	Modal 
// } from '../Modal.js?v=116'
// import generate_sign from '../generate_sign.js?v=116'
import preview_modal from '../shared/preview_modal.js?v=116'
import bundle_map_data from '../shared/bundle_map_data.js?v=116'





const img_loader = b('div')
img_loader.style.position = 'absolute'
img_loader.style.width = '0px'
img_loader.style.height = '0px'
img_loader.style.opacity = 0
document.body.append( img_loader )


BERED.icon_count = 19


const icon_captions = [
	'Drivstofftanker',
	'Gass/propan',
	'Oljefat',
	'Stromkabler',
	'Inntaksilkringer',
	'Sikringsskap',
	'Vannledniger',
	'Stoppekran',
	'Brannslokkingsutstyr',
	'Brannalarm/panel',
	'Plantevernmidler',
	'Handelsgjodsellager',
	'Nodutgang',
	'Sagepunkt evakuering',
	'Personlig verneuststyr',
	'Forstehjelpsutstyr',
	'Moteplass ved brann',
	'Innganger',
	'Skiltets plassering',
]








let onetime
const build_fabric_picker = ( widget_ele, step ) => {

	console.log("picker for: ", step )

	// the GUI part
	const wrapper = b('div', false, 'icon-wrap')

	// const expl = b('p')
	// expl.innerText = 'Click an icon to add it to map.'
	// wrapper.append( expl )

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

	const back = b('div', false, 'nav', 'button', 'back', 'bered-bump-hover')
	back.setAttribute('data-dir', 'back')
	back.innerHTML = '<img src="' + BERED.plugin_url + '/resource/icons/BACK.png">'
	back.addEventListener('click', () => {
		BROKER.publish('SET_NAV_STEP', {
			dir: 'back',
		})
	})

	const forward = b('div', false, 'nav', 'button', 'forward', 'bered-bump-hover')
	forward.setAttribute('data-dir', 'forward')
	forward.innerHTML = '<img src="' + BERED.plugin_url + '/resource/icons/NEXT.png">'
	forward.addEventListener('click', () => {
		BROKER.publish('SET_NAV_STEP', {
			dir: 'forward',
		})
	})

	wrap.append( back )
	wrap.append( forward )

	section.append( wrap )

}


const step_logo = () => {
	const wrap = b('div', false, 'step-logo')
	const img = b('img')
	img.src = `${ BERED.plugin_url }/resource/icons/kartverket.png`
	wrap.append( img )
	return wrap
}






const build_instruction_panel = ( wrapper, widget, map ) => {

	const panel = b('div', false, 'bered-instructions')

	let step, expl //header,

	let s = 1
	const steps = STEPS.length

	// --- step 1
	step = build_section()
	step.classList.add('selected')
	expl = b('div')
	expl.innerHTML = `<h3>steg ${s} av ${steps}</h3>`
	step.append( expl )
	const gards_expl = b('div')
	gards_expl.innerHTML = ``
	step.append( build_form() )
	add_navs( step )

	panel.append( step )
	s++

	// --- step 2 - move & rotate map
	step = build_section()
	expl = b('div')
	expl.innerHTML = `
	<h3>steg ${s} av ${steps}</h3>
	<p>
		Zoom inn på kartet og finn din gård ved å bruke rulleknapp på mus eller pluss og minus knappene under. Bruk pilen på skjermen for å flytte kartet til riktig posisjon.  Roter deretter kartet med rotasjonsknappene slik at tunet med alle bygg er korrekt i forhold til hvor skiltet skal plasseres.  Trenger du forklaring trykker du på hjelpesymbolet under.
	</p>
	<div class='bered-center bered-bump-hover'>
		<img class='bered-standard-icon' src='${ BERED.plugin_url }/resource/icons/QUESTION.png'>
	</div>
	`
	step.append( expl )
	const r1 = build_button('<img src="' + BERED.plugin_url + '/resource/icons/rotateright.png">')
	r1.classList.add('rotate', 'bered-bump-hover')
	r1.addEventListener('mousedown', () => {
		BROKER.publish('MAP_ROTATE', {
			state: true,
			dir: 1,
			map: map,
		})
	})
	const r2 = build_button('<img src="' + BERED.plugin_url + '/resource/icons/rotateleft.png">')
	r2.classList.add('rotate', 'bered-bump-hover')
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

	const zoom_holder1 = b('div', false, 'zoom-holder') // placeholder because zooms are appended /detached dynamically
	step.append( zoom_holder1 )

	const footer2 = b('div', false, 'bered-step-bottom')
	footer2.innerText = `Når du er fornøyd med kartutsnittet så går du til neste vindu ved å trykke på neste.`
	step.append( footer2 )

	step.append( step_logo() )
	panel.append( step )
	s++


	// --- step 3 - first icons
	step = build_section()
	expl = b('div')
	expl.innerHTML = `<h3>steg ${s} av ${steps}</h3>`
	step.append( expl )
	const expl2 = b('div')
	expl2.innerHTML = `
	<p>
		Trykk på de symbolene du ønsker å benytte, de vil komme frem på  kartbildet. Flytt deretter symbolet hvor det skal være. Du kan trykke flere ganger på et symbol for å få flere symboler av samme type. For å slette symbol drar du det  bare ut av skjermen. Pilsymbolet kan roteres ved å ta tak i ankeret til symbolet.
	</p>
	`
	step.append( expl2 )
	step.append( build_fabric_picker( widget, s ) )
	add_navs( step )

	const footer3 = b('div', false, 'bered-step-bottom')
	footer3.innerText = `Når du er ferdig med kart over tunet trykker du på neste.`
	step.append( footer3 )

	step.append( b('br') )
	step.append( step_logo() )
	panel.append( step )
	s++

	// --- step 4 - rezoom map
	step = build_section()
	expl = b('div')
	expl.innerHTML = `
	<h3>steg ${s} av ${steps}</h3>
	<p>
		Nå skal du zoome inn på driftsbygningen og få den til å fylle skjermen så godt som  mulig. Du kan holde inne shifttasten på  tastaturet samtidig som du bruker pilen på  skjermen for å rotere og skalére.
	</p>`
	step.append( expl )
	const r1b = build_button('<img src="' + BERED.plugin_url + '/resource/icons/rotateright.png">')
	r1b.classList.add('rotate', 'bered-bump-hover')
	r1b.addEventListener('mousedown', () => {
		BROKER.publish('MAP_ROTATE', {
			state: true,
			dir: 1,
			map: map,
		})
	})
	const r2b = build_button('<img src="' + BERED.plugin_url + '/resource/icons/rotateleft.png">')
	r2b.classList.add('rotate', 'bered-bump-hover')
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

	const zoom_holder2 = b('div', false, 'zoom-holder') // placeholder because zooms are appended /detached dynamically
	step.append( zoom_holder2 )

	const footer4 = b('div', false, 'bered-step-bottom')
	footer4.innerText = `Når du er ferdig med kart over driftsbygningentrykker du på neste.`
	step.append( footer4 )

	add_navs( step )
	step.append( step_logo() )
	panel.append( step )
	s++

	// --- step 5 - second icons
	step = build_section()
	expl = b('div')
	expl.innerHTML = `
	<h3>steg ${s} av ${steps}</h3>
	<p>
		Trykk på de symbolene du ønsker å benytte for driftsbygget,  Her ser du en del nye symboler, og det er viktig at du plasserer dem så nøyaktig som mulig, spesielt nødutganger og evt trygge sagepunkter som kan lette evakuering.
	</p>
	<p class='step-bottom'>
		Når du er ferdig med kart over driftsbygget trykker du på neste.
	</p>`
	step.append( expl )
	add_navs( step )
	step.append( b('br') )
	step.append( step_logo() )
	panel.append( step )
	s++

	// --- step 6 - checkout
	step = build_section()
	expl = b('div')
	expl.innerHTML = `
	<h3>steg ${s} av ${steps}</h3>
	<p class='step-bottom'>
		Nå er du ferdig med å designe planen og du kan legge planen i handlekurven for å fullføre kjøpet. Før du gjør dette kan du se en forhåndsvisning av beredskapsplanen - se nøye gjennom denne før du  fullfører kjøpet.
	</p>`
	step.append( expl )
	step.append( build_checkout_button() )
	add_navs( step )
	panel.append( step )

	wrapper.append( panel )

}





const build_checkout_button = () => {

	const wrapper = b('div', 'bered-checkout-wrap')

	// preview
	const preview = b('div', 'bered-preview', 'bered-icon-button')
	preview.innerHTML = `<img src='${ BERED.plugin_url }/resource/icons/PREVIEW.png' class='bered-bump-hover'>`
	preview.addEventListener('click', () => {
		preview_modal( JSON.stringify( BERED.json_data ) )
	})
	wrapper.append( preview )

	wrapper.append( b('br') )
	wrapper.append( b('br') )

	// checkout
	const checkout = b('div', false, 'bered-icon-button')
	checkout.innerHTML = `<img src='${ BERED.plugin_url }/resource/icons/kjop.png' class='bered-bump-hover'>`
	checkout.addEventListener('click', () => {

		bered_spinner.show()
		hal('standard', 'Thanks!  This can take a minute to add to cart, please be patient...', 5000)

		setTimeout(() => { // time to show spinner

			let msg
			const data_area = document.querySelector('textarea.bered-order-data')
			if( !data_area ) msg = 'Unable to find "order data" field to append map data'
			const bounded = [ BERED.json_data ]
			data_area.value = JSON.stringify( bounded )
			const real_checkout = document.querySelector('form.cart button[name="add-to-cart"]')
			if( !real_checkout ) msg = 'Unable to process order; invalid checkout button'
			if( msg ){
				console.error( msg )
				bered_spinner.hide()
				return hal('error', 'error attempting checkout; see console', 3000 )
			}
			console.log('checkout button for dev: ', real_checkout )
			if( 1 ){
				localStorage.setItem('bered-order-redirect', Date.now() )
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

	const addresse = gen_input('text', { placeholder: 'addresse', name: 'addresse' })


	const ansvarlig = gen_input('text', { placeholder: 'ansvarlig', name: 'ansvarlig' })
	const telefon = gen_input('text', { placeholder: 'telefon', name: 'telefon' })
	const kommune = gen_input('number', { label_content: 'kommunenummer', name: 'kommune', max: 9999 }) // placeholder: 'kommune',
	kommune.classList.add('bered-input-inline')
	const gardsnummer = gen_input('number', { label_content: 'gardsnummer', name: 'gards', max: 9999 })
	gardsnummer.classList.add('bered-input-inline')
	const bruksnr = gen_input('number', { label_content: 'bruksnummer', name: 'bruksnr', max: 999 })
	bruksnr.classList.add('bered-input-inline')

	LEFT.append( gardsnavn )
	LEFT.append( font_drop )
	LEFT.append( addresse )
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
	zoomin.querySelector('img').onerr = err => {
		if( c > 10 ) return
		zoomin.src = url.in
		c++
	}
	widget.append( zoomin )

	let c2 = 0
	const zoomout = b('div')
	zoomout.classList.add('bered-zoom', 'zoomout')
	zoomout.innerHTML = `<img src="${ url.out }">`
	zoomout.querySelector('img').onerr = err => {
		if( c2 > 10 ) return 
		zoomout.src = url.out
		c2++
	}
	widget.append( zoomout )
}





export {
	// build_dev_panel,
	build_instruction_panel,
	add_zoom,
}