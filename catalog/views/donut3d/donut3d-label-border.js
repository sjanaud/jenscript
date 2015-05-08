
/**
 * Create Donut3D border label
 * @param container
 * @param width
 * @param height
 */
function createDonut3DLabelBorder(container, width, height) {

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


	var donut3DPlugin = new JenScript.Donut3DPlugin();
	proj.registerPlugin(donut3DPlugin);

	var donut = new JenScript.Donut3D({innerRadius:100,outerRadius:150,thickness : 60, startAngle : 300, tilt:40});
	donut3DPlugin.addDonut(donut);

	donut.tilt = 60;

	var s1 = new JenScript.Donut3DSlice({
		name : "s1",
		value : 45,
		themeColor : 'rgb(250, 250, 250)'
	});
	var s2 = new JenScript.Donut3DSlice({
		name : "s2",
		value : 5,
		themeColor : 'rgb(244, 145, 26)'
	});
	var s3 = new JenScript.Donut3DSlice({
		name : "s3",
		value : 30,
		themeColor : 'rgb(78, 148, 44)'
	});
	var s4 = new JenScript.Donut3DSlice({
		name : "s4",
		value : 5,
		themeColor : JenScript.RosePalette.CORALRED
	});

	donut.addSlice(s1);
	donut.addSlice(s2);
	donut.addSlice(s3);
	donut.addSlice(s4);
	
	var s1Label = new JenScript.Donut3DBorderLabel({
		text : "Silver",
		fillColor:'black',
		outlineColor : s1.getThemeColor(),
		cornerRadius : 8,
		outlineWidth : 2,
		//textColor :'white'
	});
	s1.addSliceLabel(s1Label);

	var s2Label = new JenScript.Donut3DBorderLabel({
		text : "Platinium",
		fillColor:'black',
		outlineColor : s2.getThemeColor(),
		cornerRadius : 8,
		outlineWidth : 2,
		//textColor :'white'
	});
	s2.addSliceLabel(s2Label);

	var s3Label = new JenScript.Donut3DBorderLabel({
		text : "Rhodium",
		fillColor:'black',
		outlineColor : s3.getThemeColor(),
		cornerRadius : 8,
		outlineWidth : 2,
		//textColor :'white'
	});
	s3.addSliceLabel(s3Label);
	
	var s4Label = new JenScript.Donut3DBorderLabel({
		text : "Silicium",
		fillColor:'black',
		outlineColor : s4.getThemeColor(),
		cornerRadius : 8,
		outlineWidth : 2,
		//textColor :'white'
	});
	s4.addSliceLabel(s4Label);

}