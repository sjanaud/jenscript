
/**
 * Create Stock and compare Geometric vs Semantic Transform
 * 
 * 
 * @param container
 * @param width
 * @param height
 * 
 * @author JenSoft API
 */
function createStock(container, width, height) {

	
	//create 2 containers
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
	
	createS1((container+'vview1'),width,height);
	createS2((container+'vview2'),width,height);
	
}

function createS1(container ,width, height){
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
	var startDate = new Date(2013, 09, 01);
	var endDate = new Date(2013, 11, 01);

	var proj1 = new JenScript.TimeXProjection({
		cornerRadius : 6,
		name : "proj1",
		minXDate : startDate,
		maxXDate : endDate,
		minY : 19,
		maxY : 24
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

	var tx1 = new JenScript.TranslatePlugin();
	proj1.registerPlugin(tx1);
	tx1.registerWidget(new JenScript.TranslateCompassWidget({
		ringFillColor : 'pink'
	}));
	tx1.select();

	var wheel = new JenScript.ZoomWheelPlugin();
	proj1.registerPlugin(wheel);

	var stockPlugin = new JenScript.StockPlugin({
		bearishColor : JenScript.RosePalette.CORALRED,
		bullishColor : JenScript.RosePalette.EMERALD,
	});
	proj1.registerPlugin(stockPlugin);

	stockPlugin.addLayer(new JenScript.CandleStickLayer({
		lowHighColor : JenScript.RosePalette.COALBLACK
	}));

	var legend = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'SLV Fixing',
		fontSize : 14,
		textColor : 'purple',
		xAlign : 'right',
		yAlign : 'top',
	});
	proj1.registerPlugin(legend);
	
	var loader = new StockLoader(proj1,[2013,2014],function(year,stocks){
		stockPlugin.setStocks(stocks);
	});
}

function createS2(container ,width, height){
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
	var startDate = new Date(2013, 09, 01);
	var endDate = new Date(2013, 11, 01);

	var proj1 = new JenScript.TimeXProjection({
		cornerRadius : 6,
		name : "proj1",
		minXDate : startDate,
		maxXDate : endDate,
		minY : 19,
		maxY : 24
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

	

	var stockPlugin = new JenScript.StockPlugin({
		bearishColor : JenScript.RosePalette.CORALRED,
		bullishColor : JenScript.RosePalette.EMERALD,
	});
	proj1.registerPlugin(stockPlugin);

	stockPlugin.addLayer(new JenScript.CandleStickLayer({
		lowHighColor : JenScript.RosePalette.COALBLACK
	}));

	var legend = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'SLV Fixing',
		fontSize : 14,
		textColor : 'purple',
		xAlign : 'right',
		yAlign : 'top',
	});
	proj1.registerPlugin(legend);
	
	var loader = new StockLoader(proj1,[2013,2014],function(year,stocks){
		stockPlugin.setStocks(stocks);
	});
	
	//we work with semantic translate only on stock plugin
	var transform = new JenScript.AffineTranformPlugin({
		slaves : [stockPlugin]
	});
	proj1.registerPlugin(transform);
	
	
	//Houston? we have a problem! with semantic transform, projection does not changed (only slaves plugins do) and
	//1 - loader which listen for projection bound changed does not load stocks automatically
	//2 - Metrics not changed because projection still the same
	
	//solution : add transform scale and translate listener
	stockPlugin.addPluginListener('scale',function(){
		//console.log('stock plugin has been scaled !');
	},'stock listener');
	
	stockPlugin.addPluginListener('translate',function(){
		//console.log('stock plugin has been translated !');
		
		//look up correction of equivalent projection
		var minX = transform.minX(stockPlugin);
		var maxX = transform.maxX(stockPlugin);
		
		var minY = transform.minY(stockPlugin);
		var maxY = transform.maxY(stockPlugin);
		
	},'stock listener');
	
	transform.addPluginListener('transform-release',function(){
		console.log('transform release');
		
		//look up correction of equivalent projection
		var minX = transform.minX(stockPlugin);
		var maxX = transform.maxX(stockPlugin);
		
		var minY = transform.minY(stockPlugin);
		var maxY = transform.maxY(stockPlugin);
		
		//console.log('minX,maxX : '+new Date(minX)+','+new Date(maxX));
		//console.log('minY,maxY : '+minY+','+maxY);
		
		//rebound
		proj1.bound(minX,maxX,minY,maxY);
		
		//reset plugin transform
		stockPlugin.resetTransform();
		
	},'transform Release');
	
}
