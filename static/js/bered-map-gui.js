import BROKER from './EventBroker.js?v=101'





const build_section = () => {
	const wrapper = document.createElement('div')
	wrapper.classList.add('section')
	return wrapper
}


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

let section

// BORDERS
section = build_section()
const add_borders = build_button('add countries')
add_borders.addEventListener('click', () => {
	BROKER.publish('MAP_ADD_LAYER', {
		type: 'borders',
	})
})
section.append( add_borders )
const clear_borders = build_button('clear countries')
clear_borders.addEventListener('click', () => {
	BROKER.publish('MAP_CLEAR', {
		type: 'borders'
	})
})
section.append( clear_borders )
panel.append( section )

// NORMAL DATA
section = build_section()
const add_data = build_button('add data')
add_data.addEventListener('click', () => {
	BROKER.publish('MAP_ADD_LAYER', {
		type: 'data',
	})
})
section.append( add_data )
// const clear_data = build_button('clear data')
// clear_data.addEventListener('click', () => {
// 	BROKER.publish('MAP_CLEAR', {
// 		type: 'data'
// 	})
// })
// section.append( clear_data )
panel.append( section )

// OSM
section = build_section()
const add_osm = build_button('add osm')
add_osm.addEventListener('click', () => {
	BROKER.publish('MAP_ADD_LAYER', {
		type: 'osm',
	})
})
section.append( add_osm )
// const clear_osm = build_button('clear osm')
// clear_osm.addEventListener('click', () => {
// 	BROKER.publish('MAP_CLEAR', {
// 		type: 'osm'
// 	})
// })
// section.append( clear_osm )
panel.append( section )


})();









export default {}