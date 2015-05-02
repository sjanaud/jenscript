
/**
 * Create view with textured background
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewTextureBackground(container, width, height) {
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
	});

	var textureBackground = new JenScript.TexturedViewBackground({
		texture : JenScript.Texture.getSquareCarbonFiber(),
		strokeColor : 'cyan',
		strokeWidth : 2,
		cornerRadius : 10
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

	var outline = new JenScript.DeviceOutlinePlugin('red');
	proj.registerPlugin(outline);
}