import STEPS from './STEPS.js?v=113'


const bundle_json = ( current_canvas_state_iter ) => {
	/*
		bundle:
		- OpenLayers map data 
		- fabricjs canvas data
		- form input values
	*/

	// hydrate
	const bundle = BERED.json_data || {}
	// map data sets
	bundle.a = bundle.a || {}
	bundle.b = bundle.b || {}
	// make step more legible
	const step = {
		iter: current_canvas_state_iter,
		key: STEPS[ current_canvas_state_iter ],
	}
	console.log('bundling ', step )

	// --- validations
	const form = document.querySelector('#bered-form')
	if( !form ) return hal('error', 'unable to send data', 5000)

	const which_map = step.key.split('.')[0]

	// --- fabric
	if( step.key.match(/fabric/) ){
		// const init_opacity = BERED.fCanvas.wrapperEl.style.opacity
		// BERED.fCanvas.wrapperEl.style.opacity = 1
		bundle[ which_map ].fabric = BERED.fCanvas.toDatalessJSON()
		// BERED.fCanvas.wrapperEl.style.opacity = init_opacity
	}

	// --- map
	if( step.key.match(/map/) ){
		const params = new URLSearchParams( location.search )
		bundle[ which_map ].map = {}
		// if( !BERED.MAPS['bered-map'] ) debugger
		const center = BERED.MAPS['bered-map'].getView().getCenter()
		bundle[ which_map ].map.x = center[0] 
		bundle[ which_map ].map.y = center[1] 
		bundle[ which_map ].map.z = params.get('z')
		bundle[ which_map ].map.r = params.get('r')
	}

	// --- info
	if( step.key.match(/info/)){
		bundle[ step.key ] = {}
		let name
		const inputs = form.querySelectorAll('input')
		const textareas = form.querySelectorAll('textarea')
		for( const input of inputs ){
			name = input.name
			bundle[ step.key ][ name ] = input.value
		}
		for( const input of textareas ){
			name = input.name
			bundle[ step.key ][ name ] = input.value
		}
	}

	BERED.json_data = bundle

	return bundle

}

export default bundle_json