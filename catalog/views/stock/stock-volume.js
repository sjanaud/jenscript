
/**
 * Create stock volume view
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewStockVolume(container, width, height) {


	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		west : 80,
		south : 80,
	});

	
	var startDate = new Date(2013, 09, 01);
	var endDate = new Date(2013, 11, 01);

	var proj1 = new JenScript.TimeXProjection({
		cornerRadius : 6,
		name : "proj1",
		minXDate : startDate,
		maxXDate : endDate,
		minY : 0,
		maxY : 100000000
	});
	view.registerProjection(proj1);
	
	var outline = new JenScript.DeviceOutlinePlugin({color : 'black'});
	proj1.registerPlugin(outline);

	minor = {
		tickMarkerSize : 2,
		tickMarkerColor : 'purple',
		tickMarkerStroke : 1
	};
	median = {
		tickMarkerSize : 4,
		tickMarkerColor : JenScript.RosePalette.EMERALD,
		tickMarkerStroke : 1.2,
		tickTextColor : JenScript.RosePalette.EMERALD,
		tickTextFontSize : 10
	};
	major = {
		tickMarkerSize : 8,
		tickMarkerColor : 'purple',
		tickMarkerStroke : 3,
		tickTextColor : 'purple',
		tickTextFontSize : 12,
		tickTextOffset : 16
	};
	var southMetrics1 = new JenScript.AxisMetricsTiming({
		axis : JenScript.Axis.AxisSouth,
		models : [new JenScript.HourModel({}),new JenScript.DayModel({}),new JenScript.MonthModel({})],
		minor : minor,
		median : median,
		major:major
	});
	proj1.registerPlugin(southMetrics1);
	
	
	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest,
		minor : minor,
		median : median,
		major:major
	});
	proj1.registerPlugin(westMetrics);

	var tx1 = new JenScript.TranslatePlugin({
		mode : 'tx' //translate only along X
	});
	proj1.registerPlugin(tx1);
	tx1.select();

	var wheel = new JenScript.ZoomWheelPlugin({
		mode : 'WheelX'
	});
	proj1.registerPlugin(wheel);

	var stockPlugin = new JenScript.StockPlugin();
	proj1.registerPlugin(stockPlugin);

	stockPlugin.addLayer(new JenScript.VolumeBarLayer({
		volumeColor : 'orange'
	}));
	

	var loader = new StockLoader(proj1,[2013],function(year,stocks){
		stockPlugin.setStocks(stocks);
	});
}
