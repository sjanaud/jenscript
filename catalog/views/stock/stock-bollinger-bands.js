
/**
 * Create stock bollinger bands view
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewStockBollingerBand(container, width, height) {


	//view
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		west : 80,
		south : 80,
	});
	
	//date range
	var startDate = new Date(2013, 04, 25);
	var endDate = new Date(2013, 08, 05);

	var proj1 = new JenScript.TimeXProjection({
		cornerRadius : 6,
		name : "proj1",
		minXDate : startDate,
		maxXDate : endDate,
		minY : 16,
		maxY : 40
	});
	view.registerProjection(proj1);
	
	//device outline
	var outline = new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
	proj1.registerPlugin(outline);

	
	
	var southMetrics1 = new JenScript.AxisMetricsTiming({
		axis : JenScript.Axis.AxisSouth,
		models : [new JenScript.HourModel({}),new JenScript.DayModel({}),new JenScript.MonthModel({})],
		minor : {
			tickMarkerSize : 2,
			tickMarkerColor : JenScript.RosePalette.AEGEANBLUE,
			tickMarkerStroke : 1
		},
		median : {
			tickMarkerSize : 4,
			tickMarkerColor : JenScript.RosePalette.EMERALD,
			tickMarkerStroke : 1.2,
			tickTextColor : JenScript.RosePalette.EMERALD,
			tickTextFontSize : 10
		},
		major : {
			tickMarkerSize : 8,
			tickMarkerColor : JenScript.RosePalette.CORALRED,
			tickMarkerStroke : 3,
			tickTextColor : JenScript.RosePalette.CORALRED,
			tickTextFontSize : 12,
			tickTextOffset : 16
		}
	});
	proj1.registerPlugin(southMetrics1);
	
	
	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest
	});
	proj1.registerPlugin(westMetrics);

	var tx1 = new JenScript.TranslatePlugin({
		lockB2T : false //bottom to top translate not authorized , should be changed to same strategy of wheel like TranslateXY, TranslateX, TranslateY
	});
	proj1.registerPlugin(tx1);
	tx1.select();

	var wheel = new JenScript.ZoomWheelPlugin({
		mode :'wx'
	});
	proj1.registerPlugin(wheel);

	var stockPlugin = new JenScript.StockPlugin();
	proj1.registerPlugin(stockPlugin);

	stockPlugin.addLayer(new JenScript.StockFixingLayer({curveColor:'pink'}));
	stockPlugin.addLayer(new JenScript.StockBollingerLayer({
		bandColor:JenScript.RosePalette.EMERALD,
		bandOpacity:0.5
	}));
	

	var loader = new StockLoader(proj1,[2012,2013],function(year,stocks){
		stockPlugin.setStocks(stocks);
	});

}
