
/**
 * Create Donut3D shift tilt angle animation
 * 
 * @param container
 * @param width
 * @param height
 */
function createDonut3DShiftTiltAngle(container, width, height) {

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

	var donut = new JenScript.Donut3D();
	donut3DPlugin.addDonut(donut);

	donut.tilt = 0;
	donut.thickness = 30;
	donut.startAngleDegree = 240;

	var s1 = new JenScript.Donut3DSlice({
		name : "s1",
		value : 45,
		themeColor : 'rgba(240, 240, 240, 0.9)'
	});
	var s2 = new JenScript.Donut3DSlice({
		name : "s2",
		value : 5,
		themeColor : 'rgba(37,38,41,1)'
	});
	var s3 = new JenScript.Donut3DSlice({
		name : "s3",
		value : 30,
		themeColor : 'rgba(78,148,44,1)'
	});
	var s4 = new JenScript.Donut3DSlice({
		name : "s4",
		value : 5,
		themeColor : 'rgba(22,125,218, 1)'
	});
	var s5 = new JenScript.Donut3DSlice({
		name : "s5",
		value : 5,
		themeColor : 'rgba(61,44,105,1)'
	});

	donut.addSlice(s1);
	donut.addSlice(s2);
	donut.addSlice(s3);
	donut.addSlice(s4);
	donut.addSlice(s5);

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



	var tx = new JenScript.TranslatePlugin();
	proj.registerPlugin(tx);
	tx.select();

	
	

	setTimeout(function() {
		shiftTilt = function(i) {
			setTimeout(function() {
				donut.tilt = i;
				donut3DPlugin.repaintDonuts();
			}, i * 5);
		};
		for (var i = 0; i <= 90; i = i + 4) {
			shiftTilt(i);
		}

	}, 1000);
}