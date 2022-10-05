import { Modal } from './Modal.js?v=109'

/*
	client-safe admin module, to be run on orders page
*/



;(async() => {

if( !location.href.match(/wp-admin/) ) return

const orders = document.querySelectorAll('#order_line_items .item')

/*
	iterate orders and create preview buttons
*/
for( const order of orders ){
	for( const wcpa of order.querySelectorAll('.wcpa') ){
		if( wcpa.innerText.match(/bered order data/i ) ){
			const data = wcpa.querySelector('td.value .view')
			if( !data ){
				console.log('could not find bered data')
				continue
			}
			const json = data.innerHTML
			data.innerHTML = ''
			const preview = document.createElement('div')
			preview.classList.add('button')
			preview.innerText = 'preview'
			preview.addEventListener('click', () => {

				try{

					const json_data = JSON.parse( json )

					const modal = new Modal({
						type: 'preview-order',
					})
					// append modal
					document.body.append( modal.ele )

					// fill fabric data
					const canvas = document.createElement('canvas')
					modal.content.append( canvas )
					canvas.width = 500
					canvas.height = 500
					const fCanvas = new fabric.Canvas( canvas, {

					})
					fCanvas.loadFromDatalessJSON( json_data )

					// fill map data


				}catch( err ){
					lib.hal('error', 'there was an error interpreting the map data', 15000)
					console.log( err )
				}
			})
		}
	}
}

})();

