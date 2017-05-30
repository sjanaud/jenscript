/**
 * Create Donut2D with radial labels
 * 
 * @param container
 * @param width
 * @param height
 */
function createDonut2DLabelRadial(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
	});
	

	var proj = new JenScript.IdentityProjection();
	view.registerProjection(proj);


	var donut2DPlugin = new JenScript.Donut2DPlugin();
	proj.registerPlugin(donut2DPlugin);

	var donut = new JenScript.Donut2D();
	donut2DPlugin.addDonut(donut);

	donut.addEffect(new JenScript.Donut2DLinearEffect());
	donut.addEffect(new JenScript.Donut2DReflectionEffect());

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

	var s1Label = new JenScript.Donut2DRadialLabel({
		text : "Silver"
	});
	s1.setSliceLabel(s1Label);

	var s2Label = new JenScript.Donut2DRadialLabel({
		text : "Platinium"
	});
	s2.setSliceLabel(s2Label);

	var s3Label = new JenScript.Donut2DRadialLabel({
		text : "Rhodium"
	});
	s3.setSliceLabel(s3Label);

	var s4Label = new JenScript.Donut2DRadialLabel({
		text : "Gold"
	});
	s4.setSliceLabel(s4Label);

	var s5Label = new JenScript.Donut2DRadialLabel({
		text : "Uranium"
	});
	s5.setSliceLabel(s5Label);


	donut2DPlugin.repaintPlugin();

}