import { Modal } from '../Modal.js?v=110'
import { init } from './map.js?v=110'
import { b } from '../lib.js?v=110'
import BROKER from '../EventBroker.js?v=110'

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

	fill_popup( modal, json_data )

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

	const map_left = build_map('left', json_data )
	SIGN.append( map_left )

	const icons = build_icons( info )
	SIGN.append( icons )

	const map_right = build_map('right', json_data)
	SIGN.append( map_right )

	const footer_left = build_footer('left', info )
	SIGN.append( footer_left )

	const footer_right = build_footer('right', info )
	SIGN.append( footer_right )

	modal.content.append( SIGN )

}







// ----- builders

const build_header = info => {
	const header = b('div')
	header.classList.add('bered-preview-header')
	const main = b('h1')
	main.innerHTML = info.addresse
	const sub = b('h3')
	sub.innerHTML = '---  ' + info.addresse + '  ---'
	header.append( main )
	header.append( sub )
	return header
}

const build_subheader = ( info ) => {
	const subheader = b('div')
	subheader.classList.add('bered-preview-subheader')

	const gards = b('div')
	gards.id = 'gards'
	fill_sub( gards, 'gards', info )
	subheader.append( gards )

	const ansvarlig = b('div')
	ansvarlig.id = 'ansvarlig'
	fill_sub( ansvarlig, 'ansvarlig', info )
	subheader.append( ansvarlig )

	const telefon = b('div')
	telefon.id = 'telefon'
	fill_sub( telefon, 'telefon', info )
	subheader.append( telefon )

	return subheader
}

let offset = 1

const build_map = ( type, json_data ) => {

	offset = ( offset + 1 ) % 2

	const WIDTH = 705 // match with bered-preview-map CSS just in case

	const icondata = type === 'left' ? json_data.a.fabric : json_data.b.fabric

	const canvas_wrap = b('div')
	canvas_wrap.classList.add('bered-preview-map')
	canvas_wrap.id = 'bered-preview-map-' + type
	canvas_wrap.style['position'] = 'relative'
	let OL_MAP

	setTimeout(() => { // canvas has to be on DOM before init OL

		let canvas_ele, fCanvas

		console.log('should be loading', icondata )

		switch( type ){

			case 'left':
				// ----- build canvas for map data
				// used for sizing everything:
				canvas_wrap.style['max-width'] = WIDTH + 'px'

				// ----- fill fabric data
				window.preview_canvases = window.preview_canvases || []
				canvas_ele = b('canvas')
				canvas_wrap.append( canvas_ele )
				fCanvas = new fabric.Canvas( canvas_ele, {
					width: WIDTH,
					height: WIDTH,
				})
				window.preview_canvases.push( fCanvas )

				fCanvas.loadFromDatalessJSON( icondata )
				fCanvas.requestRenderAll()

				OL_MAP = init( canvas_wrap, 'bered-preview-map-left' ) 
				// console.log('res from ol map: ', OL_MAP )
				break;

			case 'right':
				// used for sizing everything:
				canvas_wrap.style['max-width'] = WIDTH + 'px'

				// ----- fill fabric data
				window.preview_canvases = window.preview_canvases || []
				canvas_ele = b('canvas')
				canvas_wrap.append( canvas_ele )
				fCanvas = new fabric.Canvas( canvas_ele, {
					width: WIDTH,
					height: WIDTH,
				})
				window.preview_canvases.push( fCanvas )

				fCanvas.loadFromDatalessJSON( icondata )
				fCanvas.requestRenderAll()
				OL_MAP = init( canvas_wrap, 'bered-preview-map-right' ) 
				// console.log('res from ol map2: ', OL_MAP )
				break;

			default: return b('div')
		}

		// ----- init map data
		
		if( OL_MAP ){ // because it is sometimes skipped in dev....

			const mapkey = type == 'left' ? 'a' : 'b'

			setTimeout(() => {

				BROKER.publish('MAP_ADD_LAYER', {
					type: 'data',
					map: OL_MAP,
				})

				setTimeout(() => {

					const view = OL_MAP.getView()

					OL_MAP.getView().setCenter([ 
						Number( json_data[mapkey].map.x ),
						Number( json_data[mapkey].map.y ),
					])

					view.setRotation( Number( json_data[mapkey].map.r ) )
					view.setZoom( Number( json_data[mapkey].map.z ) )

				}, 500 )

			}, 500)

			// problem is here somewhere...

		}

	}, 500 + ( 500 * offset ) )

	return canvas_wrap

}

const build_icons = json_data => {

	const captions = [
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
	ele.classList.add('bered-preview-footer')
	const top = b('div')
	top.classList.add('bered-footer-top')
	ele.append( top )

	switch( type ){

		case 'left':
			top.innerHTML = 'viktige telefonnumbre'
			const leftkeys = {
				'brann': true,
				'politi': true,
				'ambulanse': true,
				'giftinformasjon': true,
				'mattilsynet': true,
				'arbeidstilsynet': true,
			}
			const rightkeys = {
				'nodslakt': true,
				'meiketankservice': true,
				'avloserlag': true,
				'elektriker': true,
				'rorlegger': true,
				'nabokontakt': true,
			}
			const left = b('div')
			left.classList.add('column', 'column-2')
			for( const key in leftkeys ){
				left.append( footer_data( 'footer-column-2', key, info[ key ] ) )
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
				brann: 'lorem ipsum',
				stromstans: 'lorem ipsum',
				gjodelgass: 'lorem ipsum',
				silogass: 'lorem ipsum',
			}
			top.innerHTML = 'viktige rutiner'
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







// ----- library

const fill_sub = ( wrapper, type, info ) => {
	const label = b('label')
	label.innerHTML = type
	wrapper.append( label )
	const input = b('input')
	input.value = info[ type ] || ''
	wrapper.append( input )
}

const footer_data = ( column_type, key, value ) => {
	const wrap = b('div')
	wrap.classList.add('bered-footer-data', column_type )
	const label = b('label')
	label.innerHTML = key
	const data = b('div')
	data.innerHTML = value || '(none)'
	wrap.append( label )
	wrap.append( data )
	return wrap
}



export default init_popup