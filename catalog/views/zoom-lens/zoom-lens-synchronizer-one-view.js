
/**
 * Create view with zoom lens synchronized in one view
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewZoomLensSynchronizerView(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		west : 80,
		south : 100
		
	});


	// Projection1
	var proj1 = new JenScript.LinearProjection({
		name : "proj1",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000,
		paintMode : 'ACTIVE', //is paint only if projection is active
	});
	//proj1.paintMode = 'ACTIVE';

	view.registerProjection(proj1);
	
	var legend = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'Zoom Lens Synchronizer',
		fontSize : 14,
		textColor : 'purple',
		xAlign : 'right',
		yAlign : 'top',
	});
	proj1.registerPlugin(legend);
	
	
	var outline = new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
	proj1.registerPlugin(outline);
	
	minor = {
			tickMarkerSize : 2,
			tickMarkerColor : JenScript.RosePalette.AEGEANBLUE,
			tickMarkerStroke : 1
		};
		median = {
			tickMarkerSize : 4,
			tickMarkerColor : JenScript.RosePalette.EMERALD,
			tickMarkerStroke : 1.2,
			tickTextColor : JenScript.RosePalette.EMERALD,
			tickTextFontSize : 10
		};
		major = {
			tickMarkerSize : 8,
			tickMarkerColor : JenScript.RosePalette.CORALRED,
			tickMarkerStroke : 3,
			tickTextColor : JenScript.RosePalette.CORALRED,
			tickTextFontSize : 12,
			//tickTextOffset : 16
		};
		var southMetrics1 = new JenScript.AxisMetricsModeled({
			axis : JenScript.Axis.AxisSouth,
			minor:minor,
			median:median,
			major:major
		});
		proj1.registerPlugin(southMetrics1);

		var westMetrics1 = new JenScript.AxisMetricsModeled({
			axis : JenScript.Axis.AxisWest,
			minor:minor,
			median:median,
			major:major
		});
		proj1.registerPlugin(westMetrics1);

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

	var lens1 = new JenScript.ZoomLensPlugin();
	var lx1 = new JenScript.LensX();
	lens1.registerWidget(lx1);
	proj1.registerPlugin(lens1);

	// Projection2
	var proj2 = new JenScript.LinearProjection({
		name : "proj2",
		minX : 0,
		maxX : 200,
		minY : -1000,
		maxY : 1000,
		paintMode : 'ACTIVE'
	});
	view.registerProjection(proj2);
	var outline = new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
	proj2.registerPlugin(outline);

	

	
	var southMetrics2 = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisSouth,
		//need if projection is paint always mode
//		axisSpacing : 25,
//		axisBaseLine : true,
//		axisBaseLineColor : 'darkslategrey',
		minor:minor,
		median:median,
		major:major,
	});
	proj2.registerPlugin(southMetrics2);

	var westMetrics2 = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest,
		minor:minor,
		median:median,
		major:major
	});
	proj2.registerPlugin(westMetrics2);

	var lens2 = new JenScript.ZoomLensPlugin();
	var lx2 = new JenScript.LensX();
	lens2.registerWidget(lx2);

	proj2.registerPlugin(lens2);

	var synchronizer = new JenScript.ZoomLensSynchronizer({
		lenses : [ lens1, lens2 ]
	});
	lens1.select();
}