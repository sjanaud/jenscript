
/**
 * Create view with text label in user coordinate
 * 
 * @param container
 * @param width
 * @param height
 */
function createUserTextLabel(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		west : 80,
		south:60
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
		tickMarkerColor : JenScript.RosePalette.TURQUOISE,
		tickMarkerStroke : 3,
		tickTextColor : JenScript.RosePalette.TURQUOISE,
		tickTextFontSize : 12
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
	
	//TOOL
	var tx1 = new JenScript.TranslatePlugin();
	proj.registerPlugin(tx1);
	tx1.registerWidget(new JenScript.TranslateCompassWidget({
		ringFillColor : 'pink'
	}));
	tx1.select();
	
	var zoomwheel = new JenScript.ZoomWheelPlugin();
	proj.registerPlugin(zoomwheel);
	
	
	var labelPlugin = new JenScript.TextLabelPlugin();
	proj.registerPlugin(labelPlugin);
	
	var label = new JenScript.TextLabel({
		fillColor : 'white',
		outlineColor : 'darkgray',
		outlineWidth : 2,
		textColor : JenScript.RosePalette.COALBLACK,
		nature : 'User',
		location : {x : 500, y:500}
	});
	labelPlugin.addLabel(label);
	
}
