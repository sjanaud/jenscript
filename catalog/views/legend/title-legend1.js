
/**
 * Create view with title legend
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewTitleAbsoluteLegend(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 40,
		north : 60,
		
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
		name : "proj1",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'darkslategrey'
	});
	proj.registerPlugin(outline);

	var title = new JenScript.TitleLegendPlugin({
		layout : 'absolute',
		part   : JenScript.ViewPart.Device,
		text   : 'JenSoft APIs',
		fontSize : 12,
		textColor : 'pink',
		x : 200,
		y : 20,
		textAnchor : 'middle',
		rotate : false,
		rotateAngle : 90
	});
	proj.registerPlugin(title);
	
	var title2 = new JenScript.TitleLegendPlugin({
		layout : 'absolute',
		part   : JenScript.ViewPart.Device,
		text   : 'JenScript',
		fontSize : 12,
		textColor : 'orange',
		x : 200,
		y : 200,
		textAnchor : 'middle',
		rotate : false,
		rotateAngle : 90
	});
	proj.registerPlugin(title2);
	
	var title3 = new JenScript.TitleLegendPlugin({
		layout : 'absolute',
		part   : JenScript.ViewPart.Device,
		text   : 'JenScript',
		fontSize : 10,
		textColor : 'yellow',
		x : 100,
		y : 100,
		textAnchor : 'middle',
		rotate : true,
		rotateAngle : -60
	});
	proj.registerPlugin(title3);

}
