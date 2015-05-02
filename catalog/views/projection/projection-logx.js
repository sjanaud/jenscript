
/**
 * Create LogX projection with Label plugin 
 * @param container
 * @param width
 * @param height
 */
function createLogXProjection(container, width, height) {
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

	// LogX (= LogX Linear Y) projection. log requirement: x >0
	var proj = new JenScript.LogXProjection({
		name : "proj log x",
		minX : 0.001,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin(
			JenScript.RosePalette.AMETHYST);
	proj.registerPlugin(outline);

	//label for listener
	var labelPlugin = new JenScript.TextLabelPlugin();
	proj.registerPlugin(labelPlugin);
	
	var label = new JenScript.TextLabel({
		fillColor : 'white',
		outlineColor : 'orange',
		outlineWidth : 2,
		textColor : JenScript.RosePalette.HENNA,
	});
	labelPlugin.addLabel(label);

	var updateText = function(action, point) {
		label.setText(action + ' : P(' + point.user.x.toFixed(3) + ' , '
				+ point.user.y.toFixed(3) + ')');
		if (point.device.x > view.getDevice().getWidth() - 100) {
			label.setTextAnchor('end');
		} else if (point.device.x < 100) {
			label.setTextAnchor('start');
		} else {
			label.setTextAnchor('middle');
		}
		label.setX(point.device.x);
		label.setY(point.device.y);
		labelPlugin.repaintPlugin();
	};
	
	var linearCoordinate = new JenScript.DumpCoordinatePlugin();
	linearCoordinate.addDumpListener('press', function(point) {
		updateText('press', point);
	});
	linearCoordinate.addDumpListener('move', function(point) {
		updateText('move', point);
	});
	linearCoordinate.addDumpListener('release', function(point) {
		updateText('release', point);
	});
	proj.registerPlugin(linearCoordinate);
}
