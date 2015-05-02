
/**
 * Create view with line scatter x function
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewLineScatterXFunction(container, width, height) {
	
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


	var proj = new JenScript.LinearProjection({
		name : "proj1",
		minX : -1,
		maxX : 12,
		minY : 0,
		maxY : 20
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'pink'
	});
	proj.registerPlugin(outline);

	var southMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisSouth
	});
	proj.registerPlugin(southMetrics);
	
	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest, gravity :'natural' //gravity :'rotate'
	});
	
	proj.registerPlugin(westMetrics);
	
	
	//CURVE FUNCTION 
	var xValues = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
	var yValues = [ 6, 1.8, 15, 1.9, 3.4, 6.1, 4.2, 8.5, 9.9, 12, 8 ];
	var lineSourceFunction = new JenScript.LineSource({
					nature : 'XFunction',
					xValues : xValues,
					yValues : yValues
				});
	
	
	var functionPlugin = new JenScript.FunctionPlugin();
	proj.registerPlugin(functionPlugin);
	
	var scatter = new JenScript.Scatter({
			name :'my scatter function',
			themeColor : JenScript.RosePalette.EMERALD,
			source : lineSourceFunction
			});
	
	
	functionPlugin.addFunction(scatter);
	
	//TOOLS
	var tx = new JenScript.TranslatePlugin();
	proj.registerPlugin(tx);
	
	tx.select();
	
	var zw = new JenScript.ZoomWheelPlugin();
	proj.registerPlugin(zw);
	


}
