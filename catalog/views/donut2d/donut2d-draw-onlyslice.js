/**
 * Create Donut2D with Draw slice only
 * 
 * @param container
 * @param width
 * @param height
 */
function createDonut2DDrawSlice(container, width, height) {

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

	donut.setFill(undefined);// no fill to see draw

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

	s2.divergence = 20;
	s4.divergence = 20;

	s3.setStroke(new JenScript.Donut2DSliceDefaultStroke());

	donut.addSlice(s1);
	donut.addSlice(s2);
	donut.addSlice(s3);
	donut.addSlice(s4);
	donut.addSlice(s5);


	donut2DPlugin.repaintPlugin();

}