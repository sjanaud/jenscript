
/**
 * Create view with text foreground
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewTextForeground(container, width, height) {
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
	});

	var proj = new JenScript.LinearProjection({
		name : "proj1",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});
	view.registerProjection(proj);

	var bg1 = new JenScript.GradientViewBackground();
	view.addViewBackground(bg1);
	var textureBackground = new JenScript.TexturedViewBackground({
		opacity : 0.3,
		texture : JenScript.Texture.getTriangleCarbonFiber(),
		strokeColor : 'cyan',
		strokeWidth : 2,
		cornerRadius : 0
	});
	view.addViewBackground(textureBackground);

	var textForeground = new JenScript.TextViewForeground({
		x : 100,
		y : 200,
		textColor : 'cyan',
		fontSize : 16,
		text : 'JenScript'
	});
	view.addViewForeground(textForeground);

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'yellow'
	});
	proj.registerPlugin(outline);
}