
/**
 * Create view slippy map
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewSlippyMap(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : 900,
		height : 600,
		holders : 10,
	});

	var proj = new JenScript.MapProjection({
		level : 2
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'black'
	});
	proj.registerPlugin(outline);


	var tilePlugin = new JenScript.TilePlugin({
		opacity : 0.5
	});
	proj.registerPlugin(tilePlugin);

	//in just tile way, geometric transforms should be ok
	//in geo json way (lot of projections processing, prefer use semantic affine transform)
	var zoom = new JenScript.ZoomMapWheelPlugin();
	proj.registerPlugin(zoom);

	var translatePlugin = new JenScript.MapTranslatePlugin();
	proj.registerPlugin(translatePlugin);
}