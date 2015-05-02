
/**
 * Create stock MACD view
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewStockMACD(container, width, height) {
alert('width:'+width);
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
	
	var nodeView3 = document.createElement("div");
	nodeView3.setAttribute('id',container+'vview3');
	//nodeView3.setAttribute('style','float : left;');
	
	
	rootContainer.appendChild(nodeView1);
	rootContainer.appendChild(nodeView2);
	//rootContainer.appendChild(nodeView3);

	//view
	var view = new JenScript.View({
		name : container + 'vview1',
		width : 400,
		height : 300,
		west : 60,
		south : 80,
		east:20
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
		tickTextFontSize : 8,
		tickTextOffset : 4
	};
	var major = {
		tickMarkerSize : 8,
		tickMarkerColor : JenScript.RosePalette.INDIGO,
		tickMarkerStroke : 3,
		tickTextColor : JenScript.RosePalette.INDIGO,
		tickTextFontSize : 10,
		tickTextOffset : 8
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
	var loader = new StockLoader(proj1,2013,function(year,stocks){
		stockPlugin.setStocks(stocks);
		stockPlugin2.setStocks(stocks);
	});


	
	//view
	var view2 = new JenScript.View({
		name : container + 'vview2',
		width : 400,
		height : 300,
		west:20,
		east : 80,
		south : 80,
	});
	

	var bg1 = new JenScript.GradientViewBackground();
	view2.addViewBackground(bg1);
	var textureBackground = new JenScript.TexturedViewBackground({
		opacity : 0.3,
		texture : JenScript.Texture.getTriangleCarbonFiber(),
		strokeColor : 'cyan',
		strokeWidth : 2,
		cornerRadius : 0
	});
	view2.addViewBackground(textureBackground);

	var gloss = new JenScript.GlossViewForeground();
	view2.addViewForeground(gloss);

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
	proj2.registerPlugin(tx2);
	var synchronizer = new JenScript.TranslateSynchronizer({
		translates : [ tx1, tx2 ]
	});
	tx1.select();
	
	//view 3 time picker
	
//	
//	//view
//	var view3 = new JenScript.View({
//		name : container + 'vview3',
//		width : 900,
//		height : 100,
//		east : 140,
//		west : 60,
//		south : 40,
//		north : 10,
//	});
//	
//	
//	//ANOTHER PROJ FOR MANAGE PICKER IN DIFFERENT PROJECTION
//	//date range
//	var dateMin = new Date(2007, 01, 01);
//	var dateMax = new Date(2015, 06, 01);
//	
//	var proj3 = new JenScript.TimeXProjection({
//		cornerRadius : 6,
//		name : "proj3",
//		minXDate : dateMin,
//		maxXDate : dateMax,
//		minY : 8,
//		maxY : 50
//	});
//	view3.registerProjection(proj3);
//	
//	//device outline
//	var outline3 = new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
//	proj3.registerPlugin(outline3);
//	
//	var tpLegend3 = new JenScript.TitleLegendPlugin({
//		layout : 'relative',
//		part   : JenScript.ViewPart.Device,
//		text   : 'Select stock frame',
//		fontSize : 8,
//		textColor : 'black',
//		xAlign : 'right',
//		yAlign : 'top',
//		yMargin: 5
//	});
//	proj3.registerPlugin(tpLegend3);
//	
//
//	var southMetrics3 = new JenScript.AxisMetricsTiming({
//		axis : JenScript.Axis.AxisSouth,
//		models : [new JenScript.HourModel({}),new JenScript.DayModel({}),new JenScript.MonthModel({}),new JenScript.YearModel({})],
//		minor : minor,
//		median:median,
//		major:major
//	});
//	proj3.registerPlugin(southMetrics3);
//	
//	
//	var stockPlugin3 = new JenScript.StockPlugin();
//	proj3.registerPlugin(stockPlugin3);
//
//	stockPlugin3.addLayer(new JenScript.StockFixingLayer({
//		curveColor :'black',
//		curveWidth : 0.4
//	}));
//	
//	JenScript.StockTimePickerPlugin = function(config) {
//		this._init(config);
//	};
//	JenScript.Model.inheritPrototype(JenScript.StockTimePickerPlugin, JenScript.Plugin);
//	JenScript.Model.addMethods(JenScript.StockTimePickerPlugin,{
//		
//		_init : function(config){
//			config=config||{};
//			config.name = 'StockTimePickerPlugin';
//			JenScript.Plugin.call(this, config);
//			this.bound;
//			
//			this.lock = false;
//			this.initialTime;
//			this.currentTime;
//			this.leftMillis;
//			this.rightMillis;
//		},
//		
//		onPress : function(evt,part,x, y){
//			if(this.bound !== undefined && this.bound.contains(x,y)){
//				this.lock = true;
//				this.initialTime = this.getProjection().pixelToTime(x);
//				
//				var p0 = this.initialTime.getTime();
//				var p1 = proj1.getMinDate().getTime();
//				var p2 = proj1.getMaxDate().getTime();
//				
//				this.leftMillis = p0-p1;
//				this.rightMillis = p2-p0;
//				
//			}
//		},
//		
//		onMove : function(evt,part,x, y){
//			if(this.lock){
//				this.currentTime = this.getProjection().pixelToTime(x);
//				var p0 = this.currentTime.getTime();
//				var p1 = p0-this.leftMillis;
//				var p2 = p0+this.rightMillis;
//				
//				proj1.bound(p1,p2,proj1.minY,proj1.maxY);
//				proj2.bound(p1,p2,proj1.minY,proj1.maxY);
//			}
//		},
//		
//		onRelease : function(evt,part,x, y){
//			if(this.lock){
//				var p0 = this.currentTime.getTime();
//				var p1 = p0-this.leftMillis;
//				var p2 = p0+this.rightMillis;
//				
//				proj1.bound(p1,p2,proj1.minY,proj1.maxY);
//				this.lock = false;
//			}
//		},
//
//		
//		paintPlugin : function(g2d, part) {
//			if (part === JenScript.ViewPart.Device) {
//				var proj1MinDate = proj1.getMinDate();
//				var proj1MaxDate = proj1.getMaxDate();
//				
//				//add wrap userToPixel in plugin
//				var minPixel = this.getProjection().timeToPixel(proj1MinDate);
//				var maxPixel = this.getProjection().timeToPixel(proj1MaxDate);
//				
//				//add wrap detDeviceWidth, etc in plugin
//				var dh = this.getProjection().getView().getDevice().getHeight();
//				var dw = this.getProjection().getView().getDevice().getWidth();
//				
//				var svgRectLeft = new JenScript.SVGRect().origin(0,0).size(minPixel,dh).Id('rectLeft');
//				var svgRectRight = new JenScript.SVGRect().origin(maxPixel,0).size(dw-maxPixel,dh).Id('rectRight');
//				var svgRectView = new JenScript.SVGRect().origin(minPixel,0).size(maxPixel-minPixel,dh).Id('rectView');
//				
//				this.bound = new JenScript.Bound2D(minPixel,0,maxPixel-minPixel,dh);
//				
//				g2d.deleteGraphicsElement('rectLeft');
//				g2d.deleteGraphicsElement('rectRight');
//				g2d.deleteGraphicsElement('rectView');
//				g2d.insertSVG(svgRectLeft.fill(JenScript.RosePalette.CORALRED).fillOpacity(0.2).toSVG());
//				g2d.insertSVG(svgRectRight.fill(JenScript.RosePalette.CORALRED).fillOpacity(0.2).toSVG());
//				g2d.insertSVG(svgRectView.fill(JenScript.RosePalette.CALYPSOBLUE).fillOpacity(0.4).toSVG());
//				
//			}
//		}
//		
//	});
//	
//	var timePicker = new JenScript.StockTimePickerPlugin({});
//	proj3.registerPlugin(timePicker);
//	
//	proj1.addProjectionListener('boundChanged',function(){
//		timePicker.repaintPlugin();
//		
//	},'Stock projection listener');
	
	
	
}
