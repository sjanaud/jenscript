
/**
 * Create stock MACD view
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewStockMACD(container, width, height) {

	var rootContainer = document.getElementById(container);
	while (rootContainer.firstChild) {
		rootContainer.removeChild(rootContainer.firstChild);
	}
	
	var nodeView1 = document.createElement("div");
	nodeView1.setAttribute('id',container+'vview1');
	nodeView1.setAttribute('style','float : left; padding-right : 5px;');
	var nodeView2 = document.createElement("div");
	nodeView2.setAttribute('id',container+'vview2');
	nodeView2.setAttribute('style','float : left;');
	
	
	rootContainer.appendChild(nodeView1);
	rootContainer.appendChild(nodeView2);

	//view
	var view = new JenScript.View({
		name : container + 'vview1',
		width : width,
		height : height,
		east : 10,
		west : 80,
		south : 80,
	});
	
	//date range
	var startDate = new Date(2013, 04, 25);
	var endDate = new Date(2013, 08, 05);
	
	var minor = {
		tickMarkerSize : 2,
		tickMarkerColor : JenScript.RosePalette.AEGEANBLUE,
		tickMarkerStroke : 1
	};
	var median = {
		tickMarkerSize : 4,
		tickMarkerColor : JenScript.RosePalette.EMERALD,
		tickMarkerStroke : 1.2,
		tickTextColor : JenScript.RosePalette.EMERALD,
		tickTextFontSize : 10,
		tickTextOffset : 8
	};
	var major = {
		tickMarkerSize : 8,
		tickMarkerColor : JenScript.RosePalette.INDIGO,
		tickMarkerStroke : 3,
		tickTextColor : JenScript.RosePalette.INDIGO,
		tickTextFontSize : 12,
		tickTextOffset : 16
	};

	var proj1 = new JenScript.TimeXProjection({
		name : "proj1",
		minXDate : startDate,
		maxXDate : endDate,
		minY : 17,
		maxY : 25
	});
	view.registerProjection(proj1);
	
	//device outline
	var outline = new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
	proj1.registerPlugin(outline);

	
	
	var southMetrics1 = new JenScript.AxisMetricsTiming({
		axis : JenScript.Axis.AxisSouth,
		models : [new JenScript.HourModel({}),new JenScript.DayModel({}),new JenScript.MonthModel({})],
		minor : minor,
		median:median,
		major:major
	});
	proj1.registerPlugin(southMetrics1);
	
	
	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest,
		minor : minor,
		median:median,
		major:major
	});
	proj1.registerPlugin(westMetrics);

	var tx1 = new JenScript.TranslatePlugin({});
	proj1.registerPlugin(tx1);
	
	tx1.registerWidget(new JenScript.TranslateCompassWidget({
		ringFillColor : 'purple'
	}));
	
	tx1.select();
	
	

	

	var stockPlugin = new JenScript.StockPlugin({
		bearishColor : JenScript.RosePalette.CORALRED,
		bullishColor : JenScript.RosePalette.EMERALD,
	});
	proj1.registerPlugin(stockPlugin);

	stockPlugin.addLayer(new JenScript.CandleStickLayer({
		lowHighColor : JenScript.RosePalette.COALBLACK
	}));
	
	stockPlugin.addLayer(new JenScript.StockExponentialMovingAverageLayer({moveCount:12,curveColor:'purple'}));
	stockPlugin.addLayer(new JenScript.StockExponentialMovingAverageLayer({moveCount:26,curveColor:'green'}));
	
	
	var mme12Legend = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'MME 12',
		fontSize : 14,
		textColor : 'purple',
		xAlign : 'right',
		yAlign : 'top',
	});
	proj1.registerPlugin(mme12Legend);
	var mme26Legend = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'MME 26',
		fontSize : 14,
		textColor : 'green',
		xAlign : 'right',
		yAlign : 'top',
		yMargin: 26
	});
	
	
	proj1.registerPlugin(mme26Legend);
	
	//proj 1 manage loading and duplicate on proj2
	var loader = new StockLoader(proj1,[2012,2013],function(year,stocks){
		stockPlugin.setStocks(stocks);
		stockPlugin2.setStocks(stocks);
	});


	
	//view
	var view2 = new JenScript.View({
		name : container + 'vview2',
		width : width,
		height : height,
		east : 80,
		west : 40,
		south : 80,
	});
	//ANOTHER PROJ FOR MANAGE MACD IN DIFFERENT PROJECTION
	var proj2 = new JenScript.TimeXProjection({
		cornerRadius : 6,
		name : "proj2",
		minXDate : startDate,
		maxXDate : endDate,
		minY : -1.5,
		maxY : 1.5
	});
	view2.registerProjection(proj2);
	
	//device outline
	var outline2 = new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
	proj2.registerPlugin(outline2);
	

	var southMetrics2 = new JenScript.AxisMetricsTiming({
		axis : JenScript.Axis.AxisSouth,
		models : [new JenScript.HourModel({}),new JenScript.DayModel({}),new JenScript.MonthModel({})],
		minor : minor,
		median:median,
		major:major
	});
	proj2.registerPlugin(southMetrics2);
	
	var eastMetrics2 = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisEast,
		minor : minor,
		median:median,
		major:major
	});
	proj2.registerPlugin(eastMetrics2);
	
	var stockPlugin2 = new JenScript.StockPlugin();
	proj2.registerPlugin(stockPlugin2);
	stockPlugin2.addLayer(new JenScript.StockMACDLayer({
		moveCountSignal:9,
		moveCountMin:12,
		moveCountMax:26,
		lineColor:JenScript.RosePalette.MANDARIN,
		lineOpacity:1,
		lineWidth:1,
		
		macdColor:JenScript.RosePalette.CORALRED,
		signalColor:JenScript.RosePalette.CALYPSOBLUE,
		
		
		
	}));
	
	var legend1 = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'MACD (12-26-9)',
		fontSize : 14,
		textColor : JenScript.RosePalette.MANDARIN,
		xAlign : 'right',
		yAlign : 'top',
		yMargin: 5
	});
	proj2.registerPlugin(legend1);
	
	var legend2 = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'Signal MME 9',
		fontSize : 14,
		textColor : JenScript.RosePalette.CALYPSOBLUE,
		xAlign : 'right',
		yAlign : 'bottom',
		yMargin: 5
	});
	proj2.registerPlugin(legend2);
	var legend3 = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'MACD (12/26)',
		fontSize : 14,
		textColor : JenScript.RosePalette.CORALRED,
		xAlign : 'right',
		yAlign : 'bottom',
		yMargin: 25
	});
	proj2.registerPlugin(legend3);
	
	var tx2 = new JenScript.TranslatePlugin({
		mode:'tx'
	});
	tx2.registerWidget(new JenScript.TranslateCompassWidget({
		ringFillColor : 'purple'
	}));
	
	proj2.registerPlugin(tx2);
	var synchronizer = new JenScript.TranslateSynchronizer({
		translates : [ tx1, tx2 ]
	});
	tx1.select();
}
