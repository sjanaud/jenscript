
/**
 * Create view with simple grid
 * @param container
 * @param width
 * @param height
 */
function createViewGridSimple(container, width, height) {
	
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


var proj = new JenScript.LinearProjection({name : "proj1",minX: -1000,maxX: 1000,minY: -1000,maxY: 1000});
view.registerProjection(proj);

var outline =new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
proj.registerPlugin(outline);


var gridPlugin = new JenScript.GridModeledPlugin({gridOrientation : 'Vertical',gridColor : 'green'});
proj.registerPlugin(gridPlugin);

var zoomwheel = new JenScript.ZoomWheelPlugin();
proj.registerPlugin(zoomwheel);

}






