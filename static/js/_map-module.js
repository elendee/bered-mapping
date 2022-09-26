// import Map from 'ol/Map';
// import OSM from 'ol/source/OSM';
// import TileLayer from 'ol/layer/Tile';
// import TileWMS from 'ol/source/TileWMS';
// import View from 'ol/View';

import Map from '../../node_modules/ol/Map.js';
import OSM from '../../node_modules/ol/source/OSM.js';
import TileLayer from '../../node_modules/ol/layer/Tile.js';
import TileWMS from '../../node_modules/ol/source/TileWMS.js';
import View from '../../node_modules/ol/View.js';

// import layer from '../../node_modules/ol/layer.js';
// import proj from '../../node_modules/ol/proj.js';



console.log('bered-map js')

;(() => {

// if( window.ol ) return console.log('namespace conflict - ol must be left global for OpenLayers')

// console.log('what is OSM..', OSM )

const layers = [
  new TileLayer({
    source: new OSM(),
  }),
  new TileLayer({
    extent: [-13884991, 2870341, -7455066, 6338219],
    source: new TileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      params: {'LAYERS': 'topp:states', 'TILED': true},
      serverType: 'geoserver',
      // Countries have transparency, so do not fade tiles:
      transition: 0,
    }),
  }),
];

// const map = new Map({
//   layers: layers,
//   target: 'bered-map',
//   view: new View({
//     center: [-10997148, 4569099],
//     zoom: 4,
//   }),
// });


// var map = new Map({
//     target: 'bered-map',
//     layers: [
//         // OpenStreetMap layer
//         new layer.Tile({
//             source: new OSM()
//         }),
//         // Norge topo3 layer
//         new layer.Tile({
//             source: new source.XYZ({
//                 url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
//                 attributions: '<a href="http://www.kartverket.no/">Kartverket</a>'
//             })
//         })
//     ],
//     view: new View({
//         center: proj.fromLonLat([13.41, 65.42]),
//         zoom: 5
//     })
// });








})();




export default {}