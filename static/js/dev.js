
window.bered_enable_dev = state => {
	if( state ){
		localStorage.setItem('bered-dev', true)
	}else{
		delete localStorage['bered-dev']
	}
}


const client_dev = async() => {

	// pop map widget 
	// ( its js rendered )
	setTimeout(() => {

		// document.querySelectorAll('.entry-summary .button').forEach(ele => {
		// 	if( ele.innerText.match(/make/i)){
		// 		console.log('running dev init')
		// 		ele.click()
		// 	}
		// })

		const begin = document.querySelector('#bered-begin img')
		if( begin ){
			begin.click()
		}


		// const checkout = document.querySelector('.woocommerce-product-details__short-description .button')
		// // document.querySelector('.entry-summary .button')
		// if( checkout ){
		// 	checkout.click()

		// 	// step to:
		// 	const PREVIEW = true // can skip START_STEP if so

		// 	let START_STEP = 5
		// 	const SPEED = 500
		// 	const next = document.querySelector('#bered-nav .forward')
		// 	if( 1 && next ){
		// 		const iter = PREVIEW ? 4 : START_STEP-1 // if previewing, make sure its set to step all the way through
		// 		let c
		// 		for( let i = 0; i < iter; i++ ){
		// 			setTimeout(() => {
		// 				next.click()
		// 			}, (i+1) * SPEED )
		// 			c = i
		// 		}
		// 		// open preview:
		// 		setTimeout(() => {
		// 			const preview = document.querySelector('#bered-checkout-wrap .button')
		// 			preview.click()
		// 		}, (c+1) * SPEED)
		// 	}

		// }
	}, 500 )

}


const admin_dev = async() => {


}



window.preview_canvas = async( time, canvas, src_type ) => {

	const c = canvas || document.querySelector('.ol-layer canvas')
	const blob = await new Promise((resolve, reject ) => {
		c.toBlob( blob => {
			resolve( blob )
		})		
	})

	const dataURL = c.toDataURL()

	const preview = document.createElement('div')
	window.preview_ele = preview
	preview.style.position = 'fixed' 
	preview.style.top = '50px'
	preview.style.left = '50px'
	preview.style.transform = 'rotate(2deg)'
	preview.style.background = 'maroon'
	preview.style.border = '3px solid black'
	preview.style.width = '500px'
	preview.style.height = '500px'
	preview.style['z-index'] = '99999'
	document.body.append( preview )
	setTimeout(() => {
		preview.remove()
	}, time || 25000 )

	const img = document.createElement('img')
	if( src_type == 'blob' ){
		img.src = URL.createObjectURL( blob )
	}else if( src_type == 'dataURL' ){
		img.src = dataURL
	}else{
		console.log('unrecognized src_type', src_type )
	}
	img.style.border = '2px solid red'

	preview.append( img )
	console.log( 'img: ', img )

	return true

}




if( localStorage.getItem('bered-dev') ){
	if( location.href.match(/wp-admin/)){
		admin_dev()
	}else{
		client_dev()
	}
}else if( location.href.match(/localhost/)){
	console.log('(skipping dev init)')
}


export default {}