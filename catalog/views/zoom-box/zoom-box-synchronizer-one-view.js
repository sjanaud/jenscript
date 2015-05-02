 
/**
 * Create view with synchronized zoom box
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewZoomBoxSynchronizerView(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 40,
		south : 80,
		
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
	southMetrics.setTickTextFontSize('major', 10);
	southMetrics.setTickTextFontSize('median', 8);

	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest
	});
	proj1.registerPlugin(westMetrics);

	var box1 = new JenScript.ZoomBoxPlugin({
		zoomBoxDrawColor : 'yellow',
		zoomBoxFillColor : JenScript.RosePalette.LAVENDER
	});
	proj1.registerPlugin(box1);

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
	southMetrics.axisSpacing = 25;
	southMetrics.axisBaseLine = true;
	southMetrics.axisBaseLineColor = 'darkslategrey';
	southMetrics.setTickTextFontSize('major', 10);
	southMetrics.setTickTextFontSize('median', 8);
	proj2.registerPlugin(southMetrics);
	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest
	});
	proj2.registerPlugin(westMetrics);

	var box2 = new JenScript.ZoomBoxPlugin({
		zoomBoxDrawColor : 'yellow',
		zoomBoxFillColor : JenScript.RosePalette.LAVENDER
	});
	proj2.registerPlugin(box2);

	var synchronizer = new JenScript.ZoomBoxSynchronizer({
		boxes : [ box1, box2 ]
	});
	box1.select();

}