/*
	entry point module for clientside bered widget
*/
import BROKER from './EventBroker.js?v=103'
import { Modal } from './Modal.js?v=103'
import map from './map.js?v=103'
import * as gui from './bered-map-gui.js?v=103'


console.log('bered-widget js')


const details = document.querySelector('.woocommerce-product-details__short-description')

let widget


const size_map = event => {
	widget.style.height = widget.getBoundingClientRect().width + 'px'
}




const init_popup = () => {


	const m = new Modal({
		type: 'bered-map'
	})
	m.make_columns()
	document.body.append( m.ele )

	gui.build_instruction_panel( m.right_panel ) // ( container )

	m.left_panel.append( widget )
	// if( !widget ) return console.log('bered not detected on this page')

	// dev panel
	const ele = document.getElementById('bered-map')
	gui.build_dev_panel( ele )
	if( location.href.match('/oko/')){
		 // allow instruct panel
	}else{
		document.getElementById('bered-map-gui').style.display = 'none'
	}

	BROKER.publish('MAP_ADD_LAYER', {
		type: 'data',
	})

	size_map()

	setTimeout(() => {
		BROKER.publish('MAP_ADD_LAYER', {
			type: 'data',
		})
		size_map()
	}, 500 )

}




;(async() => {

// const content = document.querySelector('.entry-content')

widget = document.getElementById('bered-widget')
if( !widget ) console.log('missing bered widget')

document.body.classList.add('bered')

const begin = document.createElement('div')
begin.classList.add('button')
begin.innerText= 'Make your map'
begin.addEventListener('click', init_popup )
details.append( begin )

})();





window.addEventListener('resize', size_map )
BROKER.subscribe('MAP_RESIZE', size_map )