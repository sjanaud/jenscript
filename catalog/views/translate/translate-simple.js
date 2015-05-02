
/**
 * Create view with translate
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewTranslate(container, width, height) {

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
		minX : 0,
		maxX : 1000,
		minY : 0,
		maxY : 1500
	});

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
	proj1.registerPlugin(functionPlugin);
	
	var curve = new JenScript.Curve({
			name :'my spline curve function',
			themeColor : 'pink',
			source : splineSource
			});
	
	functionPlugin.addFunction(curve);
	

	var tx1 = new JenScript.TranslatePlugin();
	proj1.registerPlugin(tx1);

	tx1.select();

}