
/**
 * Create Natural Earth 2
 * @param container
 * @param width
 * @param height
 */
function createViewMapNaturalEarth2(container, width, height) {
	
	var view = new JenScript.View({
		name : container,
		width : 900,
		height : 900,
		holders : 10,
		
	});


	var proj = new JenScript.MapProjection({
		level : 2,
		centerPosition :new JenScript.GeoPosition(0,0)
	});
	view.registerProjection(proj);
	
	var tilePlugin = new JenScript.TilePlugin({
		tileServer : '/site/module/javascript/catalog/map/raster/ne2',
		tms : true, //y index go from bottom to the top
		opacity : 1
	});
	proj.registerPlugin(tilePlugin);
	

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'black'
	});
	proj.registerPlugin(outline);
	
	var transform = new JenScript.AffineTranformPlugin({
		slaves : [tilePlugin],
	});
	proj.registerPlugin(transform);
	

}
