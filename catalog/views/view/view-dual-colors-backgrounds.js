
/**
 * Create view with dual colors background
 * @param container
 * @param width
 * @param height
 */
function createViewDualColorsBackground(container, width, height) {
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
	});

	var textureBackground = new JenScript.DualViewBackground({
		color1 : JenScript.RosePalette.AEGEANBLUE,
		color2 : JenScript.RosePalette.COALBLACK
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
		color : 'orange'
	});
	proj.registerPlugin(outline);
};