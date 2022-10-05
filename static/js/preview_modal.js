import { Modal } from './Modal.js?v=109'



const render_popup = json => {

	const json_data = JSON.parse( json )

	const modal = new Modal({
		type: 'preview-order',
	})
	// append modal
	document.body.append( modal.ele )

	// fill fabric data
	const canvas = document.createElement('canvas')
	modal.content.append( canvas )

	const size = 500

	canvas.width = size
	canvas.height = size

	const fCanvas = new fabric.Canvas( canvas, {
		width: size,
		height: size,
	})
	fCanvas.loadFromDatalessJSON( json_data )

	// fill map data
	

}


export default render_popup