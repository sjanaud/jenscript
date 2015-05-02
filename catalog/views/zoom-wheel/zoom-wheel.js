
/**
 * Create view with zoom wheel
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewZoomWheel(container, width, height) {

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

	var gloss = new JenScript.GlossViewForeground();
	view.addViewForeground(gloss);

	var proj = new JenScript.LinearProjection({
		name : "proj1",
		minX : 0,
		maxX : 1000,
		minY : 0,
		maxY : 1500
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin('darkslategrey');
	proj.registerPlugin(outline);

	
	var southMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisSouth
	});
	proj.registerPlugin(southMetrics);

	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest
	});
	proj.registerPlugin(westMetrics);
	
	

	//CURVE FUNCTION 
	var xValues = [ -100, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1200 ];
	var yValues = [ 600, 200, 1500, 200, 350, 610, 420, 850, 990, 1200, 800 ];
	var splineSource = new JenScript.SplineSource({
					nature : 'XFunction',
					xValues : xValues,
					yValues : yValues,
					delta : 20 //important to have delta that not produce two much interpolation point, be care full
				});
	
	
	var functionPlugin = new JenScript.FunctionPlugin();
	proj.registerPlugin(functionPlugin);
	
	var curve = new JenScript.Curve({
			name :'my spline curve function',
			themeColor : 'pink',
			source : splineSource
			});
	
	functionPlugin.addFunction(curve);
	
	var zoomwheel = new JenScript.ZoomWheelPlugin();
	proj.registerPlugin(zoomwheel);
}