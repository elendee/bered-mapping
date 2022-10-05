import { Modal } from './Modal.js?v=109'
import preview_modal from './preview_modal.js?v=109'


/*
	client-safe admin module, to be run on orders page
*/
console.log('bered-admin js')


;(async() => {

if( !location.href.match(/wp-admin/) ) return

let c = 0
let parsing = setInterval(() => {

	const orders = document.querySelectorAll('#order_line_items .item')

	/*
		iterate orders and create preview buttons
	*/
	for( const order of orders ){

		if( order.getAttribute('data-bered-parsed')) continue
		for( const wcpa of order.querySelectorAll('.item_wcpa') ){
			if( wcpa.innerText.match(/bered order data/i ) ){
				const data = wcpa.querySelector('td.value .view')
				if( !data ){
					console.log('could not find bered data')
					continue
				}

				console.log('found data row')

				order.setAttribute('data-bered-parsed', true)
				const json = data.innerText
				data.innerHTML = ''
				const preview = document.createElement('div')
				preview.classList.add('button')
				preview.innerText = 'preview'
				preview.addEventListener('click', () => {

					try{

						preview_modal( json )
						
					}catch( err ){
						lib.hal('error', 'there was an error interpreting the map data', 15 * 1000)
						console.log( err )
					}
				})
				data.append( preview )
			}
		}
	}

	c++
	if( c > 30 ){
		clearInterval( parsing )
	}

}, 1000 )

})();



export default {}