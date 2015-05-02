
/**
 * Create view with metrics
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewMetrics(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 40,
		
	});

	var bg1 = new JenScript.GradientViewBackground();
	view.addViewBackground(bg1);

	var textureBackground = new JenScript.DualViewBackground({
		texture1 : JenScript.Texture.getTriangleCarbonFiber(),
		opacity : 0.4
	});
	view.addViewBackground(textureBackground);

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

	var southMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisSouth
	});
	proj.registerPlugin(southMetrics);
	
	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest, gravity :'natural' //gravity :'rotate'
	});
	
	
	proj.registerPlugin(westMetrics);
	

	var tx = new JenScript.TranslatePlugin();
	proj.registerPlugin(tx);
	
	tx.select();


}
