
/**
 * Create view with outline background
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewOutline(container, width, height) {
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
	});
	
	var proj = new JenScript.LinearProjection({
		name : "proj1",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});
	view.registerProjection(proj);

	var bg1 = new JenScript.ViewOutlineBackground({
		strokeColor : JenScript.RosePalette.AEGEANBLUE
	});
	view.addViewBackground(bg1);

	var outline = new JenScript.DeviceOutlinePlugin({color : 'pink'});
	proj.registerPlugin(outline);
}