
/**
 * Create view with zoom wheel
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewZoomWheelSynchronizerView(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 40,
		
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
	proj1.paintMode = 'ACTIVE';

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

	// a figure for illustration
	var donut3DPlugin = new JenScript.Donut3DPlugin();
	proj1.registerPlugin(donut3DPlugin);
	
	var donut = new JenScript.Donut3D();
	donut3DPlugin.addDonut(donut);
	donut.innerRadius = 0;
	var s1 = new JenScript.Donut3DSlice({
		name : "s1",
		value : 45,
		themeColor : 'rgba(240, 240, 240, 0.9)'
	});
	var s2 = new JenScript.Donut3DSlice({
		name : "s2",
		value : 5,
		themeColor : 'rgba(37,38,41,1)'
	});
	var s3 = new JenScript.Donut3DSlice({
		name : "s3",
		value : 30,
		themeColor : 'rgba(78,148,44,1)'
	});
	var s4 = new JenScript.Donut3DSlice({
		name : "s4",
		value : 5,
		themeColor : 'rgba(22,125,218, 1)'
	});
	var s5 = new JenScript.Donut3DSlice({
		name : "s5",
		value : 5,
		themeColor : 'rgba(61,44,105,1)'
	});
	donut.addSlice(s1);
	donut.addSlice(s2);
	donut.addSlice(s3);
	donut.addSlice(s4);
	donut.addSlice(s5);

	var wheel1 = new JenScript.ZoomWheelPlugin();
	proj1.registerPlugin(wheel1);

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
	// southMetrics.setTickMarkerSize('minor',8);
	southMetrics.setTickTextFontSize('major', 10);
	southMetrics.setTickTextFontSize('median', 8);
	proj2.registerPlugin(southMetrics);
	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest
	});
	proj2.registerPlugin(westMetrics);

	var wheel2 = new JenScript.ZoomWheelPlugin();
	proj2.registerPlugin(wheel2);

	var synchronizer = new JenScript.ZoomWheelSynchronizer({
		wheels : [ wheel1, wheel2 ]
	});

	wheel1.select();

}