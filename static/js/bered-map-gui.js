import BROKER from './EventBroker.js?v=101'




const build_button = text => {
	const wrapper = document.createElement('div')
	wrapper.innerText = text
	wrapper.classList.add('button')
	return wrapper
}





;(async() => {

const ele = document.getElementById('bered-map')
if( !ele ) return console.log('no bered map element found')

const panel = document.createElement('div')
panel.id = 'bered-map-gui'
ele.append( panel )

const add_countries = build_button('add countries')
add_countries.addEventListener('click', () => {
	BROKER.publish('MAP_ADD_LAYER', {
		type: 'borders',
	})
})
panel.append( add_countries )

const clear = build_button('clear')
clear.addEventListener('click', () => {
	BROKER.publish('MAP_CLEAR')
})
panel.append( clear )


})();









export default {}