
console.log('bered-map js')



// import {
//   DragRotateAndZoom,
//   defaults as defaultInteractions,
// } from 'ol/interaction';

// const map = new Map({
//   interactions: defaultInteractions().extend([new DragRotateAndZoom()]),

const map = new ol.Map({//  BERED.MAP

	interactions: ol.interaction.defaults.defaults().extend( [ new ol.interaction.DragRotateAndZoom() ] ),

    target: 'bered-map',

    layers: [
        // OpenStreetMap layer
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
        // Norge topo3 layer
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
                attributions: '<a href="http://www.kartverket.no/">Kartverket</a>'
            })
        })
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








export default {}