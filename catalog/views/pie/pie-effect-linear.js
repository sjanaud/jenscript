
/**
 * Create pie with linear effect
 * @param container
 * @param width
 * @param height
 */
function createPieEffectLinear(container, width, height) {

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


	var piePlugin = new JenScript.PiePlugin();
	proj.registerPlugin(piePlugin);

	var pie = new JenScript.Pie();
	piePlugin.addPie(pie);

	var s1 = new JenScript.PieSlice({
		name : "s1",
		value : 45,
		themeColor : 'rgba(240, 240, 240, 0.9)'
	});
	var s2 = new JenScript.PieSlice({
		name : "s2",
		value : 5,
		themeColor : 'rgba(37,38,41,1)'
	});
	var s3 = new JenScript.PieSlice({
		name : "s3",
		value : 30,
		themeColor : 'rgba(78,148,44,1)'
	});
	var s4 = new JenScript.PieSlice({
		name : "s4",
		value : 5,
		themeColor : 'rgba(22,125,218, 1)'
	});
	var s5 = new JenScript.PieSlice({
		name : "s5",
		value : 5,
		themeColor : 'rgba(61,44,105,1)'
	});

	pie.setRadius(90);
	pie.setStartAngleDegree(30);

	pie.addSlice(s1);
	pie.addSlice(s2);
	pie.addSlice(s3);
	pie.addSlice(s4);
	pie.addSlice(s5);

	var fill = new JenScript.PieDefaultFill();
	pie.setFill(fill);

	var fxl = new JenScript.PieLinearEffect();
	pie.addEffect(fxl);

}