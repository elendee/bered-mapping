import { Modal } from '../Modal.js?v=110'
import preview_modal from '../shared/preview_modal.js?v=110'
import * as lib from '../lib.js?v=110'


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

		try{

			if( order.getAttribute('data-bered-parsed')) continue
			for( const wcpa of order.querySelectorAll('.item_wcpa') ){
				if( wcpa.innerText.match(/bered order data/i ) ){
					const data1 = wcpa.querySelector('td.value .edit input')
					const data2 = wcpa.querySelector('td.value .view')
					if( !data2 ){
						console.log('could not find bered data')
						continue
					}

					console.log('found data row')

					order.setAttribute('data-bered-parsed', true)
					const json = data2.innerText
					data2.innerHTML = ''
					const preview = document.createElement('div')
					preview.classList.add('button')
					preview.innerText = 'preview'
					preview.addEventListener('click', () => {

						try{

							// console.log('parsing')
							const bounded = JSON.parse( json )
							const json_data = bounded[0] // bounded with array to help parsing
							preview_modal( JSON.stringify( json_data ) )
							
						}catch( err ){
							lib.hal('error', 'there was an error interpreting the map data', 15 * 1000)
							console.log( err )
						}
					})
					data2.append( preview )
				}
			}

		}catch( err ){
			console.log( err )
		}

	}

	c++
	if( c > 30 ){
		clearInterval( parsing )
	}

}, 1000 )

})();



export default {}