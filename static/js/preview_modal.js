import { Modal } from './Modal.js?v=109'
import { init } from './map.js?v=109'




const render_popup = json => {

	const json_data = JSON.parse( json )

	const modal = new Modal({
		type: 'preview-order',
	})
	modal.content.style.top = '40px'
	// append modal
	document.body.append( modal.ele )

	// ----- build canvas for map data
	const canvas_wrap = document.createElement('div')
	canvas_wrap.id = 'bered-preview-map'
	// used for sizing everything:
	canvas_wrap.style['max-width'] = '500px'
	const canvas = document.createElement('canvas')
	canvas_wrap.append( canvas )
	modal.content.append( canvas_wrap )

	const size = 500

	canvas.width = size
	canvas.height = size

	// ----- init map data
	const map = init( canvas_wrap, 'bered-preview-map' )
	const view = map.getView()

	map.getView().setCenter([ json_data.map.x, json_data.map.y ])

	view.setRotation( json_data.map.r )
	view.setZoom( json_data.map.z )

	// ----- fill fabric data
	const fabric_canvas = document.createElement('canvas')
	canvas_wrap.append( fabric_canvas )
	const fCanvas = new fabric.Canvas( fabric_canvas, {
		width: size,
		height: size,
	})
	fCanvas.loadFromDatalessJSON( json_data )

	// ----- build rest of map

	const info = json_data.map.info

}


export default render_popup