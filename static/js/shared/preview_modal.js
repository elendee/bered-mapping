import { Modal } from '../Modal.js?v=115'
import { init } from './map.js?v=115'
import { 
	b,
	capitalize,
} from '../lib.js?v=115'
import BROKER from '../EventBroker.js?v=115'
import html2canvas from './html2canvas.esm.js'
import { bered_spinner } from '../lib.js?v=115'

/*

	preview dimensions
	1" == 2.54cm
	150px / inch printer

	20
	20cm / 2.54 = 7.87"
	7.87 * 150 = 1180px <<

	x
	
	30
	30cm / 2.54 = 11.8"
	11.8 * 150 = 1770px <<

*/




// ---- init

// boilerplate

const init_popup = json => {

	// console.log('json data for modal: ', json )

	const json_data = BERED.json_data = JSON.parse( json )

	// console.log('previewing json: ', json_data )

	const modal = new Modal({
		type: 'preview-order',
	})
	// modal.content.style.top = '40px'
	// append modal
	document.body.append( modal.ele )

	gard()

	fill_popup( modal, json_data )

	add_print( modal )

}

const add_print = modal => {
	if( !location.href.match(/wp-admin/)) return

	const print = b('div', 'download-sign', 'button')
	print.innerHTML = 'download raster'
	print.addEventListener('click', () => {
		const sign = modal.ele.querySelector('#bered-sign')
		if( !sign ) return hal('error', 'could not find sign element', 5000)
		bered_spinner.show()
		html2canvas( sign, { })
		.then( canvas => {
			const dataURL = canvas.toDataURL()
			const link = document.createElement('a')
			// link.target ='_blank'
			link.download = 'Bered-' + ( BERED.json_data.info.gardsnavn || 'sign' ).replace(/ /g, '-') + '-' + Date.now()
			link.href = dataURL
			document.body.append( link )
			link.click()
			link.remove()

			setTimeout(() => {
				bered_spinner.hide() 
			}, 100)

		})
	})
	document.body.append( print )
	modal.ele.querySelector('.modal-close').addEventListener('click', () => {
		print.remove()
	})
}

const rfalse = e => {
	e.preventDefault()
	e.stopPropagation()
	console.log('rfalse')
	return false
}


let check
const gard = () => {
	if( location.href.match(/wp-admin/)) return
	if( check ){
		clearInterval(check)
		check = false
	}
	check = setInterval(() => {
		const m = document.querySelector('.modal.preview-order')
		if( !m ){
			clearInterval( check )
			check = false
			window.removeEventListener('contextmenu', rfalse )
			return
		}
		if( m.querySelector('.gard')) return
		const p = b('div', false, 'gard')
		p.innerHTML = `preview`
		m.querySelector('.modal-content').append( p )
		p.addEventListener('click', e => {
			e.preventDefault()
			window.addEventListener('contextmenu', rfalse )
		})
	}, 400)

}


// rendering

const fill_popup = ( modal, json_data ) => {

	const { info } = json_data

	const SIGN = b('div')
	SIGN.id = 'bered-sign'

	const header = build_header( info )
	SIGN.append( header )

	const subheader = build_subheader( info )
	SIGN.append( subheader )

	const map_left = show_map('left')
	SIGN.append( map_left )

	const icons = build_icons( info )
	SIGN.append( icons )

	const map_right = show_map('right')
	SIGN.append( map_right )

	const footer_left = build_footer('left', info )
	SIGN.append( footer_left )

	const footer_right = build_footer('right', info )
	SIGN.append( footer_right )

	modal.content.append( SIGN )

}







const show_map = side => {

	const dataURL = BERED.json_data.combined_images[side]

	const wrap = b('div', false, 'bered-preview-map')

	const img = b('img')
	// console.log( 'showin..', dataURL )
	img.src = dataURL

	wrap.append( img )
	// URL.createObjectURL( dataURL )
	return wrap

}






// ----- builders

const build_header = info => {
	const header = b('div')
	header.classList.add('bered-preview-header')
	const main = b('h1')
	main.innerHTML = info.gardsnavn
	const sub = b('h3')
	sub.innerHTML = '---  ' + info.addresse + '  ---'
	header.append( main )
	header.append( sub )

	// fonts
	header.style['font-family'] = BERED.title_font || 'Berkshire' // sub.style['font-family']

	return header
}

const build_subheader = ( info ) => {

	const subheader = b('div')
	subheader.classList.add('bered-preview-subheader')

	const gards = b('div')
	gards.id = 'gards'
	fill_sub( gards, 'Kommune- Gårds og Bruksnummer', info )
	subheader.append( gards )

	const ansvarlig = b('div')
	ansvarlig.id = 'ansvarlig'
	fill_sub( ansvarlig, 'Ansvarlig', info )
	subheader.append( ansvarlig )

	const telefon = b('div')
	telefon.id = 'telefon'
	fill_sub( telefon, 'Tlf', info )
	subheader.append( telefon )

	return subheader
}









// let offset = 1

// const build_map = ( type, json_data ) => {
// 	/*
// 		build map for single image type
// 		use raw blobs
// 		combine to make single image
// 		output img element
// 	*/

// 	offset = ( offset + 1 ) % 2

// 	let WIDTH = 955 // match with bered-preview-map CSS just in case

// 	WIDTH = 600
// 	console.log('spoofing mini display width', WIDTH)

// 	const icondata = type === 'left' ? json_data.a.fabric : json_data.b.fabric

// 	const canvas_wrap = b('div')
// 	canvas_wrap.classList.add('bered-preview-map')
// 	canvas_wrap.id = 'bered-preview-map-' + type
// 	canvas_wrap.style['position'] = 'relative'
// 	canvas_wrap.style['max-width'] = WIDTH + 'px'
// 	let OL_MAP

// 	setTimeout(() => { // canvas has to be on DOM before init OL

// 		switch( type ){

// 			case 'left':
// 				window.preview_canvases = window.preview_canvases || []
// 				combine_blobs( 'left', BERED.imageBlob1, BERED.imageBlob1_fCanvas )
// 				.then( img => {
// 					// BERED.combined_img = 
// 					canvas_wrap.append( img )
// 				})
// 				break;

// 			case 'right':
// 				// ----- fill fabric data
// 				window.preview_canvases = window.preview_canvases || []
// 				combine_blobs( 'right', BERED.imageBlob2, BERED.imageBlob2_fCanvas )
// 				.then( img => {

// 					canvas_wrap.append( img )
// 				})
// 				break;

// 			default: return b('div')
// 		}

// 		// ----- init map data
		
// 		if( OL_MAP ){ // because it is sometimes skipped in dev....

// 			const mapkey = type == 'left' ? 'a' : 'b'

// 			setTimeout(() => {

// 				BROKER.publish('MAP_ADD_LAYER', {
// 					type: 'data',
// 					map: OL_MAP,
// 				})

// 				setTimeout(() => {

// 					const view = OL_MAP.getView()

// 					OL_MAP.getView().setCenter([ 
// 						Number( json_data[mapkey].map.x ),
// 						Number( json_data[mapkey].map.y ),
// 					])

// 					view.setRotation( Number( json_data[mapkey].map.r ) )
// 					view.setZoom( Number( json_data[mapkey].map.z ) )

// 				}, 500 )

// 			}, 500)

// 			// problem is here somewhere...

// 		}

// 	}, 500 + ( 500 * offset ) )

// 	return canvas_wrap

// }









const build_icons = json_data => {

	const captions = [
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

	const ele = b('div')
	ele.classList.add('bered-preview-icons')
	for( let i = 0; i < BERED.icon_count; i++ ){
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
		label.innerHTML = captions[i]
		wrap.append( img )
		wrap.append( label )
		ele.append( wrap )
	}
	return ele
}

const build_footer = ( type, info ) => {

	const ele = b('div')
	ele.classList.add('bered-preview-footer', 'footer-' + type )
	const top = b('div')
	top.classList.add('bered-footer-top')
	ele.append( top )

	switch( type ){

		case 'left':
			top.innerHTML = 'Viktige telefonnumbre'
			const leftkeys = {
				'brann': 110,
				'politi': 112,
				'ambulanse': 113,
				'giftinformasjon': '22 59 13 00',
				'mattilsynet': '22 40 00 00',
				'arbeidstilsynet': '73 19 97 00',
			}
			const rightkeys = {
				// 'tif': true,
				'nødslakt': true,
				'melketankservice': true,
				// 'meiketankservice': true,
				'avløserlag': true,
				'elektriker': true,
				'rørlegger': true,
				'nabokontakt': true,
			}
			const left = b('div')
			left.classList.add('column', 'column-2')
			for( const key in leftkeys ){
				// left.append( footer_data( 'footer-column-2', key, info[ key ] ) )
				left.append( footer_data( 'footer-column-2', key, leftkeys[ key ] ) )
			}
			const right = b('div')
			right.classList.add('column', 'column-2')
			for( const key in rightkeys ){
				right.append( footer_data( 'footer-column-2', key, info[ key ] ) )
			}
			ele.append( left )
			ele.append( right )
			break;

		case 'right':
			const ruti_keys = {
				Brann: 'Kontakt brannvesenet umiddlebart.  Hold vinduer og dører lukket.  Vurder om det er forsvarlig å gå inn og slukke.  Tilkall slakteri og naboer for å evakuere dyra.',
				Strømstans: 'Sjekk jordfeilbryter.  Ha alltid reservesikringer på lager.  Beskriv muligheten for nødventilasjon.',
				Gjødselgass: 'Vær oppmerksom ved omrøring eller tømming av gjødselkjeller.  Gå ikke inn i husdyrrom ved mistanke om gjødselgass.',
				Silogass: 'Bruk alltid silovifte før du går ned i siloen.  Faren for gass er tilstede lenge etter at graset er stabilt.',
			}
			top.innerHTML = 'Viktige rutiner'
			const main = b('div')
			main.classList.add('column')
			for( const key in ruti_keys ){
				main.append( footer_data( 'footer-standard', key, ruti_keys[ key ] ) )
			}
			ele.append( main )
			break;

		default: break;
	}

	return ele

}

// Brann
// Kontakt brannvesenet umiddlebart.  Hold vinduer og dører lukket.  Vurder om det er forsvarlig å gå inn og slukke.  Tilkall slakteri og naboer for å evakuere dyra.  

// Strømstans
// Sjekk jordfeilbryter.  Ha alltid reservesikringer på lager.  Beskriv muligheten for nødventilasjon.  

// Gjødselgass
// Vær oppmerksom ved omrøring eller tømming av gjødselkjeller.  Gå ikke inn i husdyrrom ved mistanke om gjødselgass.

// Silogass
// Bruk alltid silovifte før du går ned i siloen.  Faren for gass er tilstede lenge etter at graset er stabilt.  







// ----- library

const fill_sub = ( wrapper, type, info ) => {
	const label = b('label')
	label.innerHTML = type
	wrapper.append( label )
	const input = b('input')
	if( type === 'Kommune- Gårds og Bruksnummer'){
		input.value = `${ info.kommune }-${ info.gards }/${ info.bruksnr }`
	}else if( type == 'Tlf' ){
		input.value = info.telefon
	}else{
		input.value = info[ type ] || info[ type.toLowerCase() ] || ''
	}
	// debugger
	wrapper.append( input )
}

const footer_data = ( column_type, key, value ) => {
	const wrap = b('div')
	wrap.classList.add('bered-footer-data', column_type )
	const label = b('label')
	label.innerHTML = capitalize( key ) + ': '
	const data = b('div')
	data.innerHTML = value || '(none)'
	wrap.append( label )
	wrap.append( data )
	return wrap
}



export default init_popup