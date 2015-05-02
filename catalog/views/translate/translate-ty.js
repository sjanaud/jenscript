
/**
 * Create view with translate with ty widget
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewTranslateTy(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 40,
		west : 80,
		
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

	// Projection1
	var proj1 = new JenScript.LinearProjection({
		name : "proj1",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});

	view.registerProjection(proj1);
	var outline = new JenScript.DeviceOutlinePlugin('darkslategrey');
	proj1.registerPlugin(outline);
	var southMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisSouth,
		minor : {
			tickMarkerSize : 4,
			tickMarkerColor : 'red',
			tickMarkerStroke : 1
		}
	});
	proj1.registerPlugin(southMetrics);
	// southMetrics.setTickMarkerSize('minor',8);
	southMetrics.setTickTextFontSize('major', 10);
	southMetrics.setTickTextFontSize('median', 8);

	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest
	});
	proj1.registerPlugin(westMetrics);



	var translate = new JenScript.TranslatePlugin();
	proj1.registerPlugin(translate);
	
	var ty = new JenScript.TranslateY();
	translate.registerWidget(ty);

	translate.select();

}