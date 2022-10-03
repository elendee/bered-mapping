import BROKER from './EventBroker.js?v=107'
// import TileLayer from 'ol/layer/Tile';
// import TileWMS from 'ol/source/TileWMS';

console.log('bered-map js')


const widget = document.getElementById('bered-widget')

const IS_LOCAL = !!location.href.match(/localhost/)

const LAYERS = BERED.LAYERS = {}
const SOURCES = BERED.SOURCES = {}


// await new Promise(( resolve ) => {
// 	setTimeout(() => {
// 		resolve()
// 	}, 1000 )
// })
let map

const init = () => {


	// const map = new Map({
	//   interactions: defaultInteractions().extend([new DragRotateAndZoom()]),

	size_map()
	
	const source = new ol.source.OSM()

	map = BERED.MAP = new ol.Map({

		interactions: ol.interaction.defaults.defaults().extend( [ new ol.interaction.DragRotateAndZoom() ] ),

	    target: 'bered-map',

	    layers: [
	    	/*
	    		much better control by adding these layers dynamically; see below
	    	*/

	        // new ol.layer.Tile({
	        //     source: source,
	        // })
	    ],

	    // controls: [new ol.Control.PanZoomBar()],
	    // projection: new OpenLayers.Projection('EPSG:32633'),
	    // maxExtent: new OpenLayers.Bounds(-2500000.0, 3500000.0, 3045984.0, 9045984.0),
	    // units: "m",
	    // maxResolution: 2708.0, // tilsvarer zoom level 3 (hele er 21664.0)
	    // //numZoomLevels: 15 				
	    // // egentlig 18, men maxResolution tilsvarer zoom level 3 (følgelig er 0-3 skrudd av)

	    view: new ol.View({
	        center: ol.proj.fromLonLat([
	        	13.41, 
	        	65.42
	        ]),
	        zoom: 5
	    })
	    
	});

	/*
		could probably add these in instantiation but whatevs:
	*/
	// automagical localStorage persistence of view
	map.addInteraction(new ol.interaction.Link());


	setTimeout(() => {
		BROKER.publish('MAP_ADD_LAYER', {
			type: 'data',
		})
	}, 500)
	// const format = new ol.format.GeoJSON({
	// 	featureProjection: 'EPSG:3857'
	// });


}// init




// subscribers

const size_map = event => {
	if( document.querySelector('.modal')){
		widget.style.height = widget.getBoundingClientRect().width + 'px'
	}
}

const add_layer = event => {

	const { type } = event

	// add layer dynamically instead of at instantiation:
	let layer, source

	switch( type ){

		case 'borders':
			source = new ol.source.Vector({
	        	format: new ol.format.GeoJSON(),
	        	url: '/oko/wp-content/plugins/bered-mapping/_storage/olw/data/countries.json',
	    	})
			layer = new ol.layer.Vector({
		    	source: source,
		    })
		    /*
		    	downloading / saving:
		    */
		 	// source.on('change', function () {
			// 	const features = source.getFeatures();
			// 	const json = format.writeFeatures(features);
			// 	console.log('sweet', json )
			// })
			break;

		case 'data':
			// ping for timeout 
			let testing = setTimeout(() => {
				hal('error', 'it appears the map server may be having trouble returning data; try again later')
			}, ( IS_LOCAL ? 5 : 15 ) * 1000 )

			// fetch('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}')
			// .then( res => {
			// 	clearTimeout( testing )
			// })
			// proceed
			if( 0 && IS_LOCAL ){ // for when the URL is unresponsive
				source = new ol.source.TileWMS({
					url: 'https://ahocevar.com/geoserver/wms',
				    params: {
				    	'LAYERS': 'topp:states', 
				    	'TILED': true
				    },
				    serverType: 'geoserver',
				    // Countries have transparency, so do not fade tiles:
				    transition: 0,
				})
			}else{
	            source = new ol.source.XYZ({
	                url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
	                attributions: '<a href="http://www.kartverket.no/">Kartverket</a>',
	            })
			}
			layer = new ol.layer.Tile({
		    	source: source,
		    })
			break;

		case 'osm':
			source = new ol.source.OSM()
	        layer = new ol.layer.Tile({
	            source: source,
	        })
	        break;

		default:
			return console.log('unknown vector layer', type )
	}

    LAYERS[ type ]= layer
    SOURCES[ type ] = source

	map.addLayer(layer);

	// setTimeout(() => {
	// 	BROKER.publish('MAP_RESIZE')
	// }, 500)

} // add layer

const clear = event => {
	console.log("map clear: " , event )
	const { type } = event

	SOURCES[ type ].clear() // ??
	// source.clear()
}


let rotating

const clear_rotation = e => {
	BROKER.publish('MAP_ROTATE', {
		state: false,
	})
	window.removeEventListener('mouseup', clear_rotation )
}

const rotate_map = event => {
	const { dir, state } = event

	// console.log( dir, map.getView().getRotation())

	if( !state ){
		clearInterval( rotating )
		return rotating = false
	}

	const view = map.getView()

	view.setRotation( ( view.getRotation() + ( .1 * dir ) ) )

	if( !rotating ){

		window.addEventListener('mouseup', clear_rotation )

		rotating = setInterval(() => {

			view.setRotation( ( view.getRotation() + ( .1 * dir ) ) )

		}, 150)
	}

}





BROKER.subscribe('MAP_CLEAR', clear )
BROKER.subscribe('MAP_ADD_LAYER', add_layer )
BROKER.subscribe('MAP_ROTATE', rotate_map )
BROKER.subscribe('MAP_RESIZE', size_map )


window.addEventListener('resize', size_map )



export { init }