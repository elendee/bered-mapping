
const client_dev = async() => {

	// pop map widget 
	// ( its js rendered )
	setTimeout(() => {

		document.querySelectorAll('.entry-summary .button').forEach(ele => {
			if( ele.innerText.match(/make/i)){
				console.log('running dev init')
				ele.click()
			}
		})


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