import gui from './bered-map-gui.js?v=101'
import BROKER from './EventBroker.js?v=101'

console.log('bered-map js')



// const download = document.getElementById('download');


// import {
//   DragRotateAndZoom,
//   defaults as defaultInteractions,
// } from 'ol/interaction';

// const map = new Map({
//   interactions: defaultInteractions().extend([new DragRotateAndZoom()]),

const map = BERED.MAP = new ol.Map({

	interactions: ol.interaction.defaults.defaults().extend( [ new ol.interaction.DragRotateAndZoom() ] ),

    target: 'bered-map',

    layers: [,
    	/*
    		much better control by adding these layers dynamically; see below
    	*/

        // show borders:
     // 	new ol.layer.Vector({
	    //   source: new ol.source.Vector({
	    //     format: new ol.format.GeoJSON(),
	    //     url: '/oko.nyc/wp-content/plugins/bered-mapping/_storage/olw/data/countries.json',
	    //   }),
	    // }),

	    // basic:
        // new ol.layer.Tile({
        //     source: new ol.source.OSM()
        // }),

        // nordic data from kartverket:
        // // Norge topo3 layer
        // new ol.layer.Tile({
        //     source: new ol.source.XYZ({
        //         url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
        //         attributions: '<a href="http://www.kartverket.no/">Kartverket</a>'
        //     })
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




// const source = new ol.source.Vector({
// 	format: new ol.format.GeoJSON(),
// 	url: '/oko.nyc/wp-content/plugins/bered-mapping/_storage/olw/data/countries.json',
// })
// const layer = new ol.layer.Vector({
// 	source: source,
// })
// map.addLayer( layer )



// const add_layer = event => {
// 	const { type } = event

// 	// const source = new ol.source.Vector()

// 	// add layer dynamically instead of at instantiation:
// 	let layer, source
// 	// = new ol.layer.Vector({
// 	// 	source: source,
// 	// });

// 	switch( type ){

// 		case 'borders':
// 			source = new ol.source.Vector({
// 	        	format: new ol.format.GeoJSON(),
// 	        	url: '/oko.nyc/wp-content/plugins/bered-mapping/_storage/olw/data/countries.json',
// 	    	})
// 			layer = new ol.layer.Vector({
// 		    	source: source,
// 		    })
// 		 //    source.on('change', function () {
// 			// 	const features = source.getFeatures();
// 			// 	const json = format.writeFeatures(features);
// 			// 	console.log('sweet', json )
// 			// })
// 			break;

// 		default:
// 			return console.log('unknown vector layer', type )
// 	}

// 	map.addLayer(layer);

// }





// automagical localStorage persistence of view
// map.addInteraction(new ol.interaction.Link());






// const format = new ol.format.GeoJSON({
// 	featureProjection: 'EPSG:3857'
// });





// subscribers

const clear = event => {
	console.log("map clear: " , event )
	// source.clear()
}





BROKER.subscribe('MAP_CLEAR', clear )
BROKER.subscribe('MAP_ADD_LAYER', add_layer )


export default {}