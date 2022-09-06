import gui from './bered-map-gui.js?v=101'
import BROKER from './EventBroker.js?v=101'

console.log('bered-map js')






// const map = new Map({
//   interactions: defaultInteractions().extend([new DragRotateAndZoom()]),

const map = BERED.MAP = new ol.Map({

	interactions: ol.interaction.defaults.defaults().extend( [ new ol.interaction.DragRotateAndZoom() ] ),

    target: 'bered-map',

    layers: [
    	/*
    		much better control by adding these layers dynamically; see below
    	*/
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







// const format = new ol.format.GeoJSON({
// 	featureProjection: 'EPSG:3857'
// });





const LAYERS = BERED.LAYERS = {}
const SOURCES = BERED.SOURCES = {}









// subscribers

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
            source = new ol.source.XYZ({
                url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
                attributions: '<a href="http://www.kartverket.no/">Kartverket</a>'
            })
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

} // add layer

const clear = event => {
	console.log("map clear: " , event )
	const { type } = event

	SOURCES[ type ].clear() // ??
	// source.clear()
}





BROKER.subscribe('MAP_CLEAR', clear )
BROKER.subscribe('MAP_ADD_LAYER', add_layer )






export default {}