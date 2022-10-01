import BROKER from './EventBroker.js?v=107'
import {
	build_button,
	build_section,
} from './build.js?v=107'




const img_loader = document.createElement('div')
img_loader.style.position = 'absolute'
img_loader.style.width = '0px'
img_loader.style.height = '0px'
img_loader.style.opacity = 0
document.body.append( img_loader )


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



}

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

	const fCanvas = window.fCanvas = new fabric.Canvas( canvas, {
		// width: canvas.width,
		// height: canvas.height,
	})
	fCanvas.setWidth( canvas.width )
	fCanvas.setHeight( canvas.width )

	const icon_options = document.createElement('div')
	for( const entry of icons ){
		let icon
		if( entry.type == 'image'){
			icon = new Image()
			icon.src = BERED.plugin_url + '/resource/' + entry.src
		}else{
			icon = document.createElement('div')
			icon.style.background = entry.color
		}
		icon.classList.add('icon', entry.type )
		icon.addEventListener('click', () => {
			const TYPE = type_map[ entry.type ]
			let fIcon
			if( entry.type === 'image' ){
				const img = new Image()
				img.src = BERED.plugin_url + '/resource/' + entry.src
				img_loader.append( img )
				img.onload = e => {
					fIcon = new TYPE( img, {
						// should work for different types:
						// should be same for all types:
						width: img.width,
						height: img.height,
						top: 50,
						left: 50,
						hasRotatingPoint: false,
					})
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
					img.remove()
				}

			}else{
				fIcon = new TYPE({
					// should work for different types:
					radius: 15,
					width: 30,
					height: 30,
					// should be same for all types:
					fill: entry.color,
					top: 50,
					left: 50,
					hasRotatingPoint: false,
				})

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

			}

		})
		icon_options.append( icon )
	}

	wrapper.append( icon_options )

	return wrapper
	// console.log('what is widget though..', widget_ele )

}





const add_navs = section => {
	const back = document.createElement('div')
	back.setAttribute('data-dir', 'back')
	back.classList.add('nav', 'button', 'back')
	back.innerText = 'back'
	back.addEventListener('click', () => {
		BROKER.publish('SET_NAV_STEP', {
			dir: 'back',
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
	})
	section.append( back )
	section.append( forward )
}




const build_instruction_panel = ( wrapper, widget ) => {

	const panel = document.createElement('div')
	panel.classList.add('bered-instructions')

	let step, expl

	// step 1
	step = build_section()
	step.classList.add('selected')
	expl = document.createElement('div')
	expl.innerHTML = `
	<h3>step 1/3</h3>
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

	// step 2
	step = build_section()
	expl = document.createElement('div')
	expl.innerHTML = `
	<h3>step 2/3</h3>
	<p>draw your building</p>`
	step.append( expl )
	step.append( build_fabric_drawer( widget ) )
	add_navs( step )
	panel.append( step )

	// step 3
	step = build_section()
	step.append( build_fabric_picker( widget ) )
	add_navs( step )
	panel.append( step )

	assign the canvas upscope so it can be used for both icons and buildng

	// step 4
	step = build_section()
	expl = document.createElement('div')
	expl.innerHTML = `
	<h3>step 4/4</h3>
	<p>checkout...</p>`
	step.append( expl )
	add_navs( step )
	panel.append( step )

	wrapper.append( panel )

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