/**
 * Create view with outline
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewWithOutline2(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		
		holders : 10, //set south, east, west, north to 70 (default is 40)
		south : 60, //set south to 30
		west : 90, //set north to 30
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

	var gloss = new JenScript.GlossViewForeground();
	view.addViewForeground(gloss);

	var proj = new JenScript.LinearProjection({
		name : "proj",
		paintMode : 'ACTIVE',
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
