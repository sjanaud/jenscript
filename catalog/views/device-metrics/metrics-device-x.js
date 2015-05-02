
/**
 * Create view with metrics device X
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewMetricsDeciceX(container, width, height) {

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
		minX : -1200,
		maxX : 1200,
		minY : -1200,
		maxY : 1200
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'yellow'
	});
	proj.registerPlugin(outline);

	var deviceMetrics = new JenScript.DeviceMetricsModeled({
		deviceAxis : JenScript.DeviceAxis.AxisX,
		baseLine : 0,
		minor : {
			tickMarkerSize : 2,
			tickMarkerColor : JenScript.RosePalette.AEGEANBLUE,
			tickMarkerStroke : 1
		},
		median : {
			tickMarkerSize : 4,
			tickMarkerColor : JenScript.RosePalette.EMERALD,
			tickMarkerStroke : 1.2,
			tickTextColor : JenScript.RosePalette.EMERALD,
			tickTextFontSize : 10
		},
		major : {
			tickMarkerSize : 8,
			tickMarkerColor : JenScript.RosePalette.CORALRED,
			tickMarkerStroke : 3,
			tickTextColor : JenScript.RosePalette.CORALRED,
			tickTextFontSize : 12
		}
	});
	proj.registerPlugin(deviceMetrics);


	var tx = new JenScript.TranslatePlugin();
	proj.registerPlugin(tx);

	tx.select();
	
	var zw = new JenScript.ZoomWheelPlugin();
	proj.registerPlugin(zw);

}
