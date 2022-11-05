import * as lib from '../lib.js?v=110'


const loader = lib.b('div')
loader.classList.add('bered-hidden')
document.body.append( loader )

const load_canvas = lib.b('canvas')
load_canvas.classList.add('bered-offscreen')
load_canvas.crossOrigin = 'Anonymous'
const load_ctx = load_canvas.getContext('2d')
document.body.append( load_canvas )


const get_blob = async( mapCanvas, fCanvas ) => {

	load_ctx.clearRect(0,0,load_ctx.width, load_ctx.height )

	const w = mapCanvas.width
	const h = mapCanvas.height

	const map_ctx = mapCanvas.getContext('2d')
	const img1 = map_ctx.getImageData(0,0, w, h )
	const img2 = map_ctx.getImageData(0,0, w, h )

	// load_canvas.
	// load_ctx.drawImage( )
	load_ctx.putImageData( img1, w, h )
	load_ctx.putImageData( img2, w, h )

	const b = await new Promise((resolve, reject ) => {
		load_canvas.toBlob(function(blob) {        // get content as JPEG blob
	    	// here the image is a blob
	    	// console.log('loaded img: ', blob)
	    	resolve( blob )
		})
	})

	return b

}


export default get_blob








// const src_to_blob = src => {

// 	return new Promise((resolve, reject ) => {

// 		var img = new Image;
// 		// var c = document.createElement("canvas");
// 		// var ctx = c.getContext("2d");

// 		img.onload = function() {
// 			load_canvas.width = this.naturalWidth;     // update canvas size to match image
// 			load_canvas.height = this.naturalHeight;
// 			load_ctx.drawImage(this, 0, 0);       // draw in image
// 			load_canvas.toBlob(function(blob) {        // get content as JPEG blob
// 		    	// here the image is a blob
// 		    	// console.log('loaded img: ', blob)
// 		    	resolve( blob )
// 			}, "image/jpeg", 0.75);
// 		};
// 		img.crossOrigin = "";              // if from different origin
// 		img.src = 'http://localhost/oko.nyc/wp-content/uploads/2021/11/emu.png';

// 	})

// }