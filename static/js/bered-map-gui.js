import BROKER from './EventBroker.js?v=106'
import {
	build_button,
	build_section,
} from './build.js?v=106'





const add_navs = section => {
	const back = document.createElement('div')
	back.setAttribute('data-dir', 'back')
	back.classList.add('nav')
	back.innerText = 'back'
	back.addEventListener('click', () => {
		BROKER.publish('SET_NAV_STEP', {
			dir: 'back',
		})
	})
	const forward = document.createElement('div')
	forward.setAttribute('data-dir', 'forward')
	forward.classList.add('nav')
	forward.innerText = 'forward'
	forward.addEventListener('click', () => {
		BROKER.publish('SET_NAV_STEP', {
			dir: 'forward',
		})
	})
	section.append( back )
	section.append( forward )
}




const build_instruction_panel = wrapper => {

	const panel = document.createElement('div')
	panel.classList.add('bered-instructions')

	let step, expl

	// step 1
	step = build_section()
	step.classList.add('selected')
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
	add_navs( step )
	panel.append( step )

	// step 2
	step = build_section()
	expl = document.createElement('div')
	expl.innerHTML = `
	<h3>step 2</h3>
	<p>add your icons...</p>`
	step.append( expl )
	add_navs( step )
	panel.append( step )

	// step 3
	step = build_section()
	expl = document.createElement('div')
	expl.innerHTML = `
	<h3>step 3</h3>
	<p>checkout...</p>`
	step.append( expl )
	add_navs( step )
	panel.append( step )

	// for( const step of panel.querySelector('.section')){
	// 	const navs = step.querySelectorAll('.nav')
	// 	for( const btn of navs ){
	// 		btn.addEventListener('click', () => {
	// 			BROKER.publish('STEP_GUI', {
	// 				step: 
	// 			})
	// 		})
	// 	}
	// }

	wrapper.append( panel )

}


const build_dev_panel = wrapper => {

	const panel = document.createElement('div')
	panel.id = 'bered-map-gui'
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