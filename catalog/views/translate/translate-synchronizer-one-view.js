/**
 * Create view with synchronized translate 
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewTranslateSynchronizerView(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 40,
		south : 100,
		west : 60,
		
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
	proj1.paintMode = 'ALWAYS';

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

	
	

	var tx1 = new JenScript.TranslatePlugin();
	proj1.registerPlugin(tx1);

	// Projection2
	var proj2 = new JenScript.LinearProjection({
		name : "proj2",
		minX : 0,
		maxX : 200,
		minY : -1000,
		maxY : 1000
	});
	proj2.paintMode = 'ACTIVE';
	view.registerProjection(proj2);
	var outline = new JenScript.DeviceOutlinePlugin('darkslategrey');
	proj2.registerPlugin(outline);

	var southMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisSouth
	});
	southMetrics.axisSpacing = 35;
	southMetrics.axisBaseLine = true;
	southMetrics.axisBaseLineColor = 'darkslategrey';
	// southMetrics.setTickMarkerSize('minor',8);
	southMetrics.setTickTextFontSize('major', 10);
	southMetrics.setTickTextFontSize('median', 8);
	proj2.registerPlugin(southMetrics);
	
//	var westMetrics = new JenScript.AxisMetricsModeled({
//		axis : JenScript.Axis.AxisWest
//	});
//	proj2.registerPlugin(westMetrics);

	var tx2 = new JenScript.TranslatePlugin();
	proj2.registerPlugin(tx2);

	// synchronize two translates plugin in the same view
	var synchronizer = new JenScript.TranslateSynchronizer({
		translates : [ tx1, tx2 ]
	});

	// select one those translate, drive the two
	tx1.select();

}