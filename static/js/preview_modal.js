import { Modal } from './Modal.js?v=109'
import { init } from './map.js?v=109'




const render_popup = json => {

	const json_data = JSON.parse( json )

	const modal = new Modal({
		type: 'preview-order',
	})
	// append modal
	document.body.append( modal.ele )

	// fill fabric data
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

	const fCanvas = new fabric.Canvas( canvas, {
		width: size,
		height: size,
	})
	fCanvas.loadFromDatalessJSON( json_data )

	// init map data
	const map = init( canvas_wrap, 'bered-preview-map' )
	const view = map.getView()

	// hydrate map data
	// good except .. not lat lon...

	// const proj_lat_long = ol.proj.fromLonLat([lat, lon])

	map.getView().setCenter([ json_data.map.x, json_data.map.y ])

    // map.setView(
    //     new ol.View({
    //     center: proj_lat_long,
    //     zoom: 17
    // }))

	view.setRotation( json_data.map.r )
	view.setZoom( json_data.map.z )

}


export default render_popup