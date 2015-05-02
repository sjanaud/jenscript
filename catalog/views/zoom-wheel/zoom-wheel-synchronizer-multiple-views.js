/**
 * Create view with zoom wheel
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewZoomWheelSynchronizerMultipleViews(container, width, height) {

	var rootContainer = document.getElementById(container);
	while (rootContainer.firstChild) {
		rootContainer.removeChild(rootContainer.firstChild);
	}

	var nodeView1 = document.createElement("div");
	nodeView1.setAttribute('id', container + 'vview1');
	nodeView1.setAttribute('style', 'float : left; padding-right : 5px;');
	var nodeView2 = document.createElement("div");
	nodeView2.setAttribute('id', container + 'vview2');
	nodeView2.setAttribute('style', 'float : left;');

	rootContainer.appendChild(nodeView1);
	rootContainer.appendChild(nodeView2);

	var view = new JenScript.View({
		name : container + 'vview1',
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
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
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

	var wheel1 = new JenScript.ZoomWheelPlugin();
	proj.registerPlugin(wheel1);

	var view = new JenScript.View({
		name : container + 'vview2',
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
		name : "proj2",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
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

	var wheel2 = new JenScript.ZoomWheelPlugin();
	proj.registerPlugin(wheel2);

	var synchronizer = new JenScript.ZoomWheelSynchronizer({
		wheels : [ wheel1, wheel2 ]
	});

	wheel1.select();

}
