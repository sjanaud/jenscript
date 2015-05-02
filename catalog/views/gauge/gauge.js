
/**
 * Create view with metrics
 * 
 * @param container
 * @param width
 * @param height
 */
function createGauge(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 40,
		
	});

	var proj = new JenScript.LinearProjection({
		name : "proj1",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin({color :'darkslategrey'});
	proj.registerPlugin(outline);

	

	var tx = new JenScript.TranslatePlugin();
	proj.registerPlugin(tx);
	tx.select();

	

	// create metrics path with min and max value and append segemnt on path,
	// line, curve, arc, etc...
	var metricsPath = new JenScript.GeneralMetricsPath({
		min : 0,
		max : 300
	});
	metricsPath.setProjection(proj);
	// metricsPath.moveTo(-950,-950).quadTo(0,1000,800,500);//user projection by
	// default
	metricsPath.moveTo(950, 950).quadTo(0, 1000, -800, -500);// user
																// projection by
																// default

	var g1 = new JenScript.GlyphMetric({
		fontSize : 10,
		value : 22,
		metricsLabel : '22'
	});
	var g2 = new JenScript.GlyphMetric({
		fontSize : 10,
		value : 42,
		metricsLabel : '42'
	});
	var g3 = new JenScript.GlyphMetric({
		fontSize : 10,
		value : 62,
		metricsLabel : '62'
	});
	var g4 = new JenScript.GlyphMetric({
		fontSize : 10,
		value : 82,
		metricsLabel : '82'
	});

	var g5 = new JenScript.GlyphMetric({
		fontSize : 14,
		value : 130,
		metricsLabel : '130'
	});

	metricsPath.addMetric(g1);
	metricsPath.addMetric(g2);
	metricsPath.addMetric(g3);
	metricsPath.addMetric(g4);
	metricsPath.addMetric(g5);

	var gmpp = new JenScript.GeneralMetricsPathPlugin({
		path : metricsPath
	});
	proj.registerPlugin(gmpp);

}