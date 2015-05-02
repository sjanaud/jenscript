
/**
 * Create view with dual texture/color background
 * @param container
 * @param width
 * @param height
 */
function createViewDualTextureColorBackground(container, width, height) {
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
	});

	var bg1 = new JenScript.GradientViewBackground();
	view.addViewBackground(bg1);

	// opacity 0.4 to see the first background contribution
	var textureBackground = new JenScript.DualViewBackground({
		texture1 : JenScript.Texture.getTriangleCarbonFiber(),
		opacity : 0.4
	});
	view.addViewBackground(textureBackground);

	var proj = new JenScript.LinearProjection({
		name : "proj1",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
	proj.registerPlugin(outline);
};

