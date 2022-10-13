
const client_dev = async() => {

	// pop map widget 
	// ( its js rendered )
	setTimeout(() => {
		const checkout = document.querySelector('.woocommerce-product-details__short-description .button')
		if( checkout ){
			checkout.click()

			// step to:
			const START_STEP = 5
			const SPEED = 200
			const next = document.querySelector('#bered-nav .forward')
			if( next ){
				let c
				for( let i = 0; i < START_STEP-1; i++ ){
					setTimeout(() => {
						next.click()
					}, i * SPEED )
					c = i
				}
				// open preview:
				setTimeout(() => {
					const preview = document.querySelector('#bered-checkout-wrap .button')
					preview.click()
				}, (c+1) * SPEED)
			}

		}
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