
console.log('bered-map js')





const map = new ol.Map({

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

    view: new ol.View({
        center: ol.proj.fromLonLat([
        	13.41, 
        	65.42
        ]),
        zoom: 5
    })
    
});








export default {}