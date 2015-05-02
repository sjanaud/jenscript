
/**
 * Create view with bubbles
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewWithBubbles(container, width, height) {

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
		minX : -600,
		maxX : 1600,
		minY : -600,
		maxY : 1600
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

	//wheel
	var wheel = new JenScript.ZoomWheelPlugin();
	proj.registerPlugin(wheel);
	
	
	translate.select();
	

	var bubblePlugin = new JenScript.BubblePlugin();
	proj.registerPlugin(bubblePlugin);
	
	var b1 = new JenScript.Bubble({
		center : {x : 500, y:500},
		radius : 120,
		fillColor : 'green',
		strokeColor : 'orange',
		fillOpacity:0.6,
		strokeOpacity:0.7,
		strokeWidth:2
	});
	
	var b2 = new JenScript.Bubble({
		center : {x : 200, y:500},
		radius : 80,
		fillColor : 'blue',
		strokeColor : 'black',
		fillOpacity:0.5,
		strokeOpacity:0.8,
		strokeWidth:2
	});
	
	var b3 = new JenScript.Bubble({
		center : {x : 500, y:200},
		radius : 60,
		fillColor : 'cyan',
		strokeColor : 'red',
		fillOpacity:0.6,
		strokeOpacity:0.8,
		strokeWidth:2
	});
	
	var b4 = new JenScript.Bubble({
		center : {x : 20, y:350},
		radius : 40,
		fillColor : 'purple',
		strokeColor : 'yellow',
		fillOpacity:0.4,
		strokeOpacity:1,
		strokeWidth:2
	});
	
	var b5 = new JenScript.Bubble({
		center : {x : 300, y:100},
		radius : 20,
		fillColor : 'pink',
		strokeColor : 'blue',
		fillOpacity:0.6,
		strokeOpacity:0.3,
		strokeWidth:2
	});
	
	bubblePlugin.addBubble(b1).addBubble(b2).addBubble(b3).addBubble(b4).addBubble(b5);
	
}
