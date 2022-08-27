// import Map from 'ol/Map';
// import OSM from 'ol/source/OSM';
// import TileLayer from 'ol/layer/Tile';
// import TileWMS from 'ol/source/TileWMS';
// import View from 'ol/View';

console.log('bered-map js')

;(() => {

// if( window.ol ) return console.log('namespace conflict - ol must be left global for OpenLayers')

const layers = [
  new ol.TileLayer({
    source: new OSM(),
  }),
  new ol.TileLayer({
    extent: [-13884991, 2870341, -7455066, 6338219],
    source: new ol.TileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      params: {'LAYERS': 'topp:states', 'TILED': true},
      serverType: 'geoserver',
      // Countries have transparency, so do not fade tiles:
      transition: 0,
    }),
  }),
];

const map = new ol.Map({
  layers: layers,
  target: 'map',
  view: new ol.View({
    center: [-10997148, 4569099],
    zoom: 4,
  }),
});








})();




export default {}