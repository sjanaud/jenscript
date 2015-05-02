
/**
 * Create view with monitor
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewMonitor(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
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
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'darkslategrey'
	});
	proj.registerPlugin(outline);

	 var monitorPlugin = new JenScript.ProgressPlugin({
			x : 30,
			y : 20,
			width : 100,
			height : 6,
	 });
	 proj.registerPlugin(monitorPlugin);
	 
	 
	 var m = new JenScript.ProgressMonitor({
			total : 20,//approximation of total which is (245/255 stock by year)
			onComplete : function() {
				proj.unregisterPlugin(this);
			},
			outlineColor : 'yellow',
			backgroundColor : 'black',
			backgroundOpacity : 0,
			foregroundColor : 'yellow',
			foregroundOpacity : 0.6,
			textColor : 'yellow'
		});
		monitorPlugin.addMonitor(m);

	var run = function(i) {
		setTimeout(function() {
			m.setValue(i,("loading item " + i));
		}, i * 200);
	};
	for (var i = 0; i <= 20; i++) {
		run(i);
	}

}
