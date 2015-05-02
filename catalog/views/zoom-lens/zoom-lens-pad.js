/**
 * Create view with zoom lens
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewZoomLensPad(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		west : 100,
		south : 80
	});

	

	var proj = new JenScript.LinearProjection({
		name : "proj1",
		minX : 0,
		maxX : 1000,
		minY : 0,
		maxY : 1500
	});
	view.registerProjection(proj);
	
	var legend = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'Zoom Lens Pad',
		fontSize : 14,
		textColor : 'purple',
		xAlign : 'left',
		yAlign : 'top',
	});
	proj.registerPlugin(legend);

	var outline = new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
	proj.registerPlugin(outline);

	var xValues = [ -100, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1200 ];
	var yValues = [ 600, 200, 1500, 200, 350, 610, 420, 850, 990, 1200, 800 ];
	var lineSourceFunction = new JenScript.LineSource({
					nature : 'XFunction',
					xValues : xValues,
					yValues : yValues
				});
	
	
	var functionPlugin = new JenScript.FunctionPlugin();
	proj.registerPlugin(functionPlugin);
	
	var curve = new JenScript.Curve({
			name :'my curve function',
			themeColor : 'purple',
			source : lineSourceFunction
			});
	functionPlugin.addFunction(curve);

	
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
	var southMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisSouth,
		minor:minor,
		median:median,
		major:major
	});
	proj.registerPlugin(southMetrics);

	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest,
		minor:minor,
		median:median,
		major:major
	});
	proj.registerPlugin(westMetrics);

	
	var lens = new JenScript.ZoomLensPlugin();
	proj.registerPlugin(lens);

	var lpad = new JenScript.LensPad();
	lens.registerWidget(lpad);

	lens.select();

}
