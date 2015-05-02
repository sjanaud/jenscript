
/**
 * Create view with simple button widget
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewWithButtonWidget(container, width, height) {

	//view
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 30,
		south : 60,
		west : 80,

	});

	//view background
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

	//wheel
	var wheel = new JenScript.ZoomWheelPlugin();
	proj.registerPlugin(wheel);
	
	//zoom box
	var zoombox = new JenScript.ZoomBoxPlugin({
		speed : 'fast', //slow, default, fast
		zoomBoxDrawColor : 'cyan',
		zoomBoxFillColor : 'pink'
	});
	proj.registerPlugin(zoombox);
	

	var buttonGroup = new JenScript.ButtonPlugin();
	proj.registerPlugin(buttonGroup);

	var button1 = new JenScript.ButtonWidget({
		width : 50,
		height : 30,
		radius : 0,
		inset : 8,
		text : 'Lock Translate',
		textColor : 'white',
		buttonDrawColor : 'white',
		buttonRolloverDrawColor : 'yellow',
		buttonFillColor : 'black',
		buttonRolloverFillColor : 'green',
		buttonFillColorOpacity : 0.5,
		buttonDrawColorOpacity : 1,
		xIndex : 0,
		onPress : function(){
			translate.select();
		}
	});
	buttonGroup.registerWidget(button1);
	
	
	var button2  = new JenScript.ButtonWidget({
		width : 50,
		height : 30,
		radius : 0,
		inset : 8,
		text : 'Lock Zoom Box',
		textColor : 'white',
		buttonDrawColor : 'white',
		buttonRolloverDrawColor : 'yellow',
		buttonFillColor : 'black',
		buttonRolloverFillColor : 'green',
		buttonFillColorOpacity : 0.5,
		buttonDrawColorOpacity : 1,
		xIndex : 1,
		onPress : function(){
			zoombox.select();
		}
	});
	buttonGroup.registerWidget(button2);
	//buttonGroup.select();
}
