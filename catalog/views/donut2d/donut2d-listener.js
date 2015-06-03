
/**
 * Create Donut2D with listener
 * @param container
 * @param width
 * @param height
 */
function createDonut2DListener(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
	});

	var proj = new JenScript.IdentityProjection();
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin('darkslategrey');
	proj.registerPlugin(outline);

	var donut2DPlugin = new JenScript.Donut2DPlugin();
	proj.registerPlugin(donut2DPlugin);

	var donut = new JenScript.Donut2D({
		name : 'The Donut'
	});
	donut2DPlugin.addDonut(donut);

	// reflection effect
	donut.addEffect(new JenScript.Donut2DLinearEffect());
	donut.addEffect(new JenScript.Donut2DReflectionEffect());

	
	var labelPlugin = new JenScript.TextLabelPlugin();
	proj.registerPlugin(labelPlugin);
	
	
	var label = new JenScript.TextLabel({
		fillColor : 'white',
		outlineColor : 'orange',
		outlineWidth : 2,
		textColor : JenScript.RosePalette.HENNA,
		nature : 'Device'
	});
	
	labelPlugin.addLabel(label);
	
	var updateText = function(action, point) {
		label.setText(action);
		label.setTextAnchor('middle');
		label.setX(point.x);
		label.setY(point.y);
		labelPlugin.repaintPlugin();
	};

	/**
	 * add Donut listener such as press, release, move, enter, exit and click
	 */
	donut2DPlugin.addDonutListener('enter', function(event) {
		updateText("enter "+event.slice.name,event.device);
	});
	donut2DPlugin.addDonutListener('exit', function(event) {
		updateText("exit "+event.slice.name,slice.device);
		setTimeout(function(){label.setText(undefined);label.repaintPlugin();},1000);
	});
	donut2DPlugin.addDonutListener('press', function(event) {
		updateText("press "+event.slice.name,slice.device);
	});
	donut2DPlugin.addDonutListener('release', function(event) {
		updateText("release "+event.slice.name,slice.device);
	});
	donut2DPlugin.addDonutListener('move', function(event) {
		updateText("rollover "+event.slice.name,slice.device);
	});

	var s1 = new JenScript.Donut2DSlice({
		name : "s1",
		value : 45,
		themeColor : 'rgba(240, 240, 240, 0.9)'
	});
	var s2 = new JenScript.Donut2DSlice({
		name : "s2",
		value : 5,
		themeColor : 'rgba(37,38,41,1)'
	});
	var s3 = new JenScript.Donut2DSlice({
		name : "s3",
		value : 30,
		themeColor : 'rgba(78,148,44,1)'
	});
	var s4 = new JenScript.Donut2DSlice({
		name : "s4",
		value : 5,
		themeColor : 'rgba(22,125,218, 1)'
	});
	var s5 = new JenScript.Donut2DSlice({
		name : "s5",
		value : 5,
		themeColor : 'rgba(61,44,105,1)'
	});

	donut.setFill(new JenScript.Donut2DRadialFill());

	donut.addSlice(s1);
	donut.addSlice(s2);
	donut.addSlice(s3);
	donut.addSlice(s4);
	donut.addSlice(s5);

	donut2DPlugin.repaintPlugin();


}