/*
	combine pre-existing BERED blobs into:

*/
import {
	b,
} from '../lib.js?v=110'



const combine_blobs = async( side, blob1, blob2 ) => {

	const result_img = await new Promise((resolve, reject) => {		

		// set blobs to images
		const img1 = b('img')
		const img2 = b('img')
		document.body.append( img1 )
		document.body.append( img2 )
		img1.src = URL.createObjectURL( blob1 )
		img2.src = URL.createObjectURL( blob2 )

		let loaded = [false, false]

		img1.onload = e => {
			loaded[0] = true
			if( loaded[0] && loaded[1] ){
				resolve( canvas_mash( side, img1, img2 ) )
			}
		}
		img2.onload = e => {
			loaded[1] = true
			if( loaded[0] && loaded[1] ){
				resolve( canvas_mash( side, img1, img2 ) )
			}
		}

		// console.log("combining, returning, dataURL", blob1, blob2 )

	})

	return result_img

}






const canvas_mash = ( side, img1, img2 ) => {
	// set both images to canvas
	const canvas = b('canvas')
	// document.body.append( canvas )
	canvas.width = 600
	canvas.height = 600
	const ctx = canvas.getContext('2d')
	ctx.drawImage( img1, 0,0, 600, 600 )
	ctx.drawImage( img2, 0,0, 600, 600 )

	document.body.append( canvas )

	const dataURL = canvas.toDataURL()

	// draw canvas back to image
	const result = b('img')
	result.src = dataURL

	// img1.remove()
	// img2.remove()
	// canvas.remove()

	// if ( !BERED.combined_images ) BERED.combined_images = {}
	// BERED.combined_images[ side ] = result
	BERED.json_data.combined_images = BERED.json_data.combined_images || {}
	BERED.json_data.combined_images[ side ] = dataURL

	return result
}



export default combine_blobs