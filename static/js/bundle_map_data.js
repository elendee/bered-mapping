const bundle_data = () => {
	/*
		bundle:
		- OpenLayers map data 
		- fabricjs canvas data
		- form input values
	*/

	const bundle = {}

	// --- validations
	const form = document.querySelector('#bered-form')
	if( !form ) return hal('error', 'unable to send data', 5000)

	// --- fabric
	bundle.fabric = BERED.fCanvas.toDatalessJSON()

	// --- map
	const params = new URLSearchParams( location.search )
	bundle.map = {}
	bundle.map.x = params.get('x')
	bundle.map.y = params.get('y')
	bundle.map.z = params.get('z')
	bundle.map.r = params.get('r')

	// --- info
	bundle.info = {}
	let name
	const inputs = form.querySelectorAll('input')
	const textareas = form.querySelectorAll('textarea')
	for( const input of inputs ){
		name = input.name
		bundle.info[ name ] = input.value
	}
	for( const input of textareas ){
		name = input.name
		bundle.info[ name ] = input.value
	}

	return bundle

}

export default bundle_data