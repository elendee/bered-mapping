import BROKER from './EventBroker.js?v=103'
import {
	build_button,
	build_section,
} from './build.js?v=103'

















const build_instruction_panel = () => {

	const details = document.querySelector('.woocommerce-product-details__short-description')
	if( !details ) return console.error('no panel found for bered instructions')

	const panel = document.createElement('div')
	panel.classList.add('bered-instructions')

	let step, expl

	step = build_section()
	expl = document.createElement('div')
	expl.innerHTML = `
	<h3>step 1</h3>
	<p>position the map to fit...</p>`
	step.append( expl )
	const r1 = build_button('rotate +')
	r1.addEventListener('mousedown', () => {
		BROKER.publish('MAP_ROTATE', {
			state: true,
			dir: 1,
		})
	})
	const r2 = build_button('rotate -')
	r2.addEventListener('mousedown', () => {
		BROKER.publish('MAP_ROTATE', {
			state: true,
			dir: -1,
		})
	})
	step.append( r1 )
	step.append( r2 )
	panel.append( step )

	step = build_section()
	expl = document.createElement('div')
	expl.innerHTML = `
	<h3>step 2</h3>
	<p>add your icons...</p>`
	step.append( expl )
	panel.append( step )

	step = build_section()
	expl = document.createElement('div')
	expl.innerHTML = `
	<h3>step 3</h3>
	<p>checkout...</p>`
	step.append( expl )
	panel.append( step )

	details.append( panel )

}


const build_dev_panel = () => {

	const ele = document.getElementById('bered-map')
	if( !ele ) return console.log('no bered map element found')

	const panel = document.createElement('div')
	panel.id = 'bered-map-gui'
	ele.append( panel )

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








;(async() => {

build_dev_panel()

build_instruction_panel()


})();












export default {}