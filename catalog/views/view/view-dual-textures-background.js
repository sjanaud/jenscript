
/**
 * Create view with dual texture background
 * @param container
 * @param width
 * @param height
 */
function createViewDualTexturesBackground(container, width, height) {
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
	});

	var bg1 = new JenScript.GradientViewBackground();
	view.addViewBackground(bg1);
	var textureBackground = new JenScript.DualViewBackground({
		texture1 : JenScript.Texture.getTriangleCarbonFiber(),
		texture2 : JenScript.Texture.getSquareCarbonFiber(),
		opacity : 0.4,
		strokeColor : 'cyan',
		strokeWidth : 2
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

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'pink'
	});
	proj.registerPlugin(outline);
}