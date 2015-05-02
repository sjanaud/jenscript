
/**
 * Create view with part's sizing
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewPartSize(container, width, height) {
	
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 10,
		west : 30,
		south : 20,
		
	});

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

	var proj = new JenScript.LinearProjection({
		name : "proj1",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin(
			JenScript.RosePalette.CALYPSOBLUE);
	proj.registerPlugin(outline);
}