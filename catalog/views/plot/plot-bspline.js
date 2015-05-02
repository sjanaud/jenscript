
/**
 * Create view with B Spline
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewBSplinePlot(container, width, height) {

	//view
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 30,
		south : 60,
		west : 80,

	});

	
	//projection
	var proj = new JenScript.LinearProjection({
		name : "proj1",
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
	
	//metrics
	var minor = {
			tickMarkerSize : 2,
			tickMarkerColor : 'cyan',
			tickMarkerStroke : 1
		};
		var median = {
			tickMarkerSize : 4,
			tickMarkerColor : 'cyan',
			tickMarkerStroke : 1.2,
			tickTextColor : 'cyan',
			tickTextFontSize : 10
		};
		var major = {
			tickMarkerSize : 8,
			tickMarkerColor : JenScript.Color.brighten(JenScript.RosePalette.CALYPSOBLUE),
			tickMarkerStroke : 3,
			tickTextColor : JenScript.Color.brighten(JenScript.RosePalette.CALYPSOBLUE),
			tickTextFontSize : 12
		};
		var southMetrics = new JenScript.AxisMetricsModeled({
			axis : JenScript.Axis.AxisSouth,
			minor : minor,
			median : median,
			major :major
		});
		proj.registerPlugin(southMetrics);
		
		var westMetrics = new JenScript.AxisMetricsModeled({
			axis : JenScript.Axis.AxisWest, gravity :'natural', //gravity :'rotate'
			minor : minor,
			median : median,
			major :major
		});
		proj.registerPlugin(westMetrics);
	
		
	//translate
	var translate = new JenScript.TranslatePlugin();
	proj.registerPlugin(translate);
	translate.select();

	//wheel
	var wheel = new JenScript.ZoomWheelPlugin();
	proj.registerPlugin(wheel);
	
	
	

	//add plot 
	
	var plotPlugin = new JenScript.PlotPlugin({});
	proj.registerPlugin(plotPlugin);
	
	var bezier = new JenScript.BezierG1Plot({
		plotColor : 'purple',
		plotWidth : 3
	});
	bezier.addPoint(-500,-500);
	bezier.addPoint(-500,-200);
	bezier.addPoint(-300,-100);
	bezier.addPoint(-200,200);
	bezier.addPoint(0,600);
	bezier.addPoint(200,400);
	bezier.addPoint(500,200);
	bezier.addPoint(500,100);
	bezier.addPoint(300,-200);
	bezier.addPoint(200,-400);
	bezier.addPoint(100,-500);
	bezier.addPoint(0,-600);
	bezier.addPoint(-100,-800);
		
	
	plotPlugin.addPlot(bezier);
	
}
