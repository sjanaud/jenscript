
/**
 * Create view with gradient background
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewGradientBackground(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
	});
	
	var bg1 = new JenScript.GradientViewBackground({
		shader : {
			percents : [ '0%', '100%' ],
			colors : [ 'rgb(0,0,100)', 'rgb(0,0,0)' ]
		}
	});
	view.addViewBackground(bg1);

	var proj = new JenScript.LinearProjection({
		name : "proj1",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
	proj.registerPlugin(outline);
}