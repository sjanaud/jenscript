// JenScript -  JavaScript HTML5/SVG Library
// Product of JenSoftAPI - Visualization Java & JS Libraries
// version : 1.1.9
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2015 JenScript, product by JenSoftAPI company, France.
// build: 2017-05-08
// All Rights reserved

(function(){
	JenScript.StockPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockPlugin, JenScript.Plugin);

	JenScript.Model.addMethods(JenScript.StockPlugin, {
		_init : function(config){
			config = config || {};
			this.stocks = [];
			this.stockLayers=[];
			config.priority = 10000;
			config.name = (config.name !== undefined)?config.name:'StockPlugin';
			JenScript.Plugin.call(this,config);
			this.bearishColor = (config.bearishColor !== undefined)?config.bearishColor:'red';
			this.bullishColor = (config.bullishColor !== undefined)?config.bullishColor:'green';
		},
		
		getBearishColor :function() {
			return this.bearishColor;
		},

		setBearishColor :function(bearishColor) {
			this.bearishColor = bearishColor;
		},

		getBullishColor :function() {
			return this.bullishColor;
		},

		setBullishColor :function(bullishColor) {
			this.bullishColor = bullishColor;
		},
		
		/**
		 * get all stocks
		 * @returns stocks
		 */
		getStocks : function(){
			return this.stocks;
		},
		
		/**
		 * get stocks bounded in projection more previous and next points
		 * @returns stocks in current projection date range
		 */
		getBoundedStocks : function(){
			//console.log('get bounded stock');
			var boundedStocks = [];
			for (var i = 0; i < this.stocks.length; i++) {
				var s = this.stocks[i];
				var sp = this.stocks[i-1];
				var sn = this.stocks[i+1];
				if(s.fixing.getTime()>=this.getProjection().minX && s.fixing.getTime()<=this.getProjection().maxX){
					if(sp !== undefined && sp.fixing.getTime()<this.getProjection().minX){
						boundedStocks[boundedStocks.length] = sp;
					}
					boundedStocks[boundedStocks.length] = s;
					if(sn !== undefined && sn.fixing.getTime()>this.getProjection().maxX){
						boundedStocks[boundedStocks.length] = sn;
					}
				}
				
			}
			return boundedStocks;
		},
		
		/**
		 * get stocks bounded in given min and max date
		 * @returns stocks in given date range
		 */
		getRangeStocks : function(minDate,maxDate){
			//console.log('get bounded stock');
			var boundedStocks = [];
			for (var i = 0; i < this.stocks.length; i++) {
				var s = this.stocks[i];
				if(s.fixing.getTime()>=minDate.getTime() && s.fixing.getTime()<=maxDate.getTime()){
					boundedStocks[boundedStocks.length] = s;
				}
				
			}
			return boundedStocks;
		},
		
		
		/**
		 * get all layers of stock plugin
		 * @returns layers
		 */
		getLayers : function(){
			return this.stockLayers;
		},
		
		/**
		 * add the given layer to stock plugin
		 * @param {Object} layer
		 */
		addLayer : function(layer){
			layer.plugin=this;
			this.stockLayers[this.stockLayers.length]=layer;
			this.repaintPlugin();
		},
		
		/**
		 * remove given layers 
		 * @param {Object} layer
		 */
		removeLayer : function(layer){
			var layers = [];
			for (var i = 0; i < this.stockLayers.length; i++) {
				var l = this.stockLayers[i];
				if(l.Id !== layer.Id)
					layers = l;
			}
			this.stockLayers = layers;
			this.repaintPlugin();
		},
		
		/**
		 * remove all layers
		 */
		removeAllLayer : function(){
			this.stockLayers = [];
			this.repaintPlugin();
		},
		
		/**
		 * set stocks
		 * @param {Array} stock array
		 */
		setStocks : function(stocks){
			this.stocks=stocks;
			stocks.sort(function(s1, s2) {
				var f1 = s1.fixing.getTime();
				var f2 = s2.fixing.getTime();
				if (f1 > f2)
					return 1;
				else
					return -1;
			});
			this.repaintPlugin();
		},
		
		/**
		 * add given stock
		 * @param {Object} stock
		 */
		addStock : function(stock){
			this.stocks[this.stocks.length]=stock;
			this.setStocks(this.stocks);
		},
		
		
		/**
		 * paint this stock plugin
		 * @param {Object} g2d
		 * @param {Object} part
		 */
		paintPlugin : function(g2d, part) {
			if(part === 'Device'){
				for (var i = 0; i < this.stockLayers.length; i++) {
					var l = this.stockLayers[i];
					l.solveLayer();
					l.paintLayer(g2d,part);
				}
			}
		},
		
		/**
		 * on projection register, add projection bound listener to repaint this plugin
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'Stock plugin listener for projection bound changed');
		},
	});
})();
(function(){

	
	JenScript.Stock = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.Stock, {
		init : function(config){
			

			//date and millis
			this.fixing = config.fixing;
			this.fixingDurationMillis = config.fixingDurationMillis;

			//scalar values
			this.open = config.open;
			this.close = config.close;
			this.low = config.low;
			this.high = config.high;
			this.volume = config.volume;
		},
		
		getFixing :function() {
			return this.fixing;
		},

		setFixing :function(fixing) {
			this.fixing = fixing;
		},

		getOpen :function() {
			return this.open;
		},

		setOpen :function(open) {
			this.open = open;
		},

		getClose :function() {
			return this.close;
		},

		setClose :function( close) {
			this.close = close;
		},

		getLow :function() {
			return this.low;
		},

		setLow :function(low) {
			this.low = low;
		},

		getHigh :function() {
			return this.high;
		},

		setHigh :function( high) {
			this.high = high;
		},

		getVolume :function() {
			return this.volume;
		},

		setVolume :function( volume) {
			this.volume = volume;
		},

		getFixingDurationMillis :function() {
			return this.fixingDurationMillis;
		},

		setFixingDurationMillis :function( fixingDurationMillis) {
			this.fixingDurationMillis = fixingDurationMillis;
		},

		isBearish :function() {
			return (this.close < this.open);
		},

		isBullish :function() {
			return (this.close > this.open);
		},

	});

})();
(function(){
	JenScript.StockGeometry = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.StockGeometry, {
		init : function(config){
			config = config || {};
			this.name = config.name;
			this.layer;
		},
		
		setLayer : function(layer){
			this.layer =layer;
		},
		
		getLayer : function(){
			return this.layer;
		},
		
		solveGeometry : function(){},
	});
	
	JenScript.StockItemGeometry = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockItemGeometry, JenScript.StockGeometry);

	JenScript.Model.addMethods(JenScript.StockItemGeometry, {
		_init : function(config){
			config = config || {};
			this.stock;
			
			//points
			this.deviceLow;
			this.deviceHigh;
			this.deviceOpen;
			this.deviceClose;
			this.deviceVolume;
			this.deviceVolumeBase;

			//scalar float value
			this.deviceFixing;
			this.deviceFixingStart;
			this.deviceFixingEnd;
			this.deviceFixingDuration;
			
			JenScript.StockGeometry.call(this,{ name : "StockItemGeometry"});
		},
		
		setStock : function(stock){
			this.stock=stock;
		},
		
		getStock : function(){
			return this.stock;
		},
		
		solveGeometry : function() {
			var stock = this.stock;
			// stock session
			this.deviceLow = this.getProjection().userToPixel(new JenScript.Point2D(stock.getFixing().getTime(), stock.getLow()));
			this.deviceHigh = this.getProjection().userToPixel(new JenScript.Point2D(stock.getFixing().getTime(), stock.getHigh()));
			this.deviceOpen = this.getProjection().userToPixel(new JenScript.Point2D(stock.getFixing().getTime(), stock.getOpen()));
			this.deviceClose = this.getProjection().userToPixel(new JenScript.Point2D(stock.getFixing().getTime(), stock.getClose()));
			
			// volume
			this.deviceVolume = this.getProjection().userToPixel(new JenScript.Point2D(stock.getFixing().getTime(), stock.getVolume()));
			this.deviceVolumeBase = this.getProjection().userToPixel(new JenScript.Point2D(stock.getFixing().getTime(), 0));

			// fixing
			this.deviceFixingStart = this.getProjection().userToPixelX(stock.getFixing().getTime() - stock.getFixingDurationMillis() / 2);
			this.deviceFixingEnd = this.getProjection().userToPixelX(stock.getFixing().getTime() + stock.getFixingDurationMillis() / 2);

			this.deviceFixingDuration = Math.abs(this.deviceFixingEnd - this.deviceFixingStart);
			this.deviceFixing = this.getProjection().userToPixelX(stock.getFixing().getTime());
			
			this.solveItemGeometry();
		},
		
		solveItemGeometry : function(){},
		
		getProjection : function(){
			return this.getLayer().plugin.getProjection();
		},
	});
	
	
	
	
	JenScript.StockGroupGeometry = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockGroupGeometry, JenScript.StockGeometry);

	JenScript.Model.addMethods(JenScript.StockGroupGeometry, {
		_init : function(config){
			config = config || {};
			/** stock primitive geometries */
			this.stockItemGeometries = [];
			JenScript.StockGeometry.call(this,{ name : "StockGroupGeometry"});
		},

		setStockItemGeometries : function(stockItemGeometries) {
			this.stockItemGeometries = stockItemGeometries;
		},

		addStockItemGeometries : function(stockItemGeometry) {
			this.stockItemGeometries[this.stockItemGeometries.length] = stockItemGeometry;
		},

		getStockItemGeometries : function() {
			return this.stockItemGeometries;
		},
		
		//reset solve function
		solveGeometry : function() {
		}

	});
})();
(function(){
	JenScript.StockLayer = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.StockLayer, {
		init : function(config){
			config = config || {};
			this.Id = 'layer'+JenScript.sequenceId++;
			this.name = config.name;
			this.plugin;
			this.geometries = [];
		},
		
		clearGeometries : function(){
			this.geometries = [];
		},
		
		getGeometries : function(){
			return this.geometries;
		},
		
		addGeometry : function(geometry){
			this.geometries[this.geometries.length] = geometry;
		},
		
		getHost : function(){
			return this.plugin;
		},
		
		/**
		 * solve layer geometry.
		 * <p>
		 * process projection of stock values from user system coordinates to device
		 * pixel system coordinates and create geometry collection.
		 * </p>
		 */
		solveLayer : function(){},

		/**
		 * paint stock layer
		 * 
		 * @param g2d
		 *            graphics context
		 * @param windowPart
		 *            part to paint
		 */
		paintLayer : function(g2d,art){},
		
	});
})();
(function(){
	JenScript.CandleStickGeometry = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.CandleStickGeometry, JenScript.StockItemGeometry);

	JenScript.Model.addMethods(JenScript.CandleStickGeometry, {
		__init : function(config){
			config = config || {};
			this.lowHighColor = 'darkgray';

			/**line low/high shape*/
			this.deviceLowHighGap;
			
			/**rectangle open/close shape*/
			this.deviceOpenCloseGap;
		},
		
		solveItemGeometry : function(){
			//console.log('CandleStickGeometry.solveItemGeometry');
			var deviceLow = this.deviceLow;
			var deviceHigh = this.deviceHigh;
			var deviceOpen = this.deviceOpen;
			var deviceClose = this.deviceClose;
			var deviceFixingStart = this.deviceFixingStart;
			var deviceFixingDuration = this.deviceFixingDuration;
			
			this.deviceLowHighGap = new JenScript.SVGLine().from(deviceLow.x,deviceLow.y).to(deviceHigh.x,deviceHigh.y);
			if (this.getStock().getOpen() > this.getStock().getClose()) {
				this.deviceOpenCloseGap = new JenScript.SVGRect().origin(deviceFixingStart, deviceOpen.y).size(deviceFixingDuration, Math.abs(deviceOpen.y - deviceClose.y));
			} else {
				this.deviceOpenCloseGap = new JenScript.SVGRect().origin(deviceFixingStart, deviceClose.y).size(deviceFixingDuration, Math.abs(deviceOpen.y - deviceClose.y));
			}
		},
	});
	
	JenScript.CandleStickLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.CandleStickLayer, JenScript.StockLayer);
	JenScript.Model.addMethods(JenScript.CandleStickLayer, {
		_init : function(config){
			config = config || {};
			this.lowHighColor = (config.lowHighColor !== undefined)?config.lowHighColor:'black';
			JenScript.StockLayer.call(this,{ name : "CandleStickLayer"});
		},
		
		setLowHighColor : function(color){
			this.color=color;
		},
		
		getLowHighColor : function(){
			return this.color;
		},
		
		
		solveLayer : function() {
			this.geometries = [];
			for (var i = 0; i < this.plugin.getBoundedStocks().length; i++) {
				var stock = this.plugin.getBoundedStocks()[i];
				var geom = new JenScript.CandleStickGeometry();
				geom.setLayer(this);
				geom.setStock(stock);
				geom.solveGeometry();
				this.addGeometry(geom);
			}
		},

		paintLayer : function(g2d,part) {
			if (part === 'Device') {
				var svgLayer = new JenScript.SVGGroup().Id(this.Id).name('CandleStickLayer');
				for (var i = 0; i < this.getGeometries().length; i++) {
					var geom = this.getGeometries()[i];
					var svgCandleStick = geom.deviceLowHighGap.stroke(this.lowHighColor).fillNone();
					svgLayer.child(svgCandleStick.toSVG());

					var fillColor = (geom.getStock().isBearish())? this.plugin.getBearishColor():this.plugin.getBullishColor();
					var svgCandleStickFill = geom.deviceOpenCloseGap.strokeNone().fill(fillColor);
					svgLayer.child(svgCandleStickFill.toSVG());
				}
				g2d.deleteGraphicsElement(this.Id);
				g2d.insertSVG(svgLayer.toSVG());
			}
		},
	});
})();
(function(){

	
	JenScript.OhlcGeometry = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.OhlcGeometry, JenScript.StockItemGeometry);

	JenScript.Model.addMethods(JenScript.OhlcGeometry, {
		__init : function(config){
			config = config || {};
			this.deviceLowHighGap;
			this.deviceOpenTick;
			this.deviceCloseTick;
		},
		
		solveItemGeometry : function(){
			var deviceLow = this.deviceLow;
			var deviceHigh = this.deviceHigh;
			var deviceOpen = this.deviceOpen;
			var deviceClose = this.deviceClose;
			var deviceFixingStart = this.deviceFixingStart;
			var deviceFixingDuration = this.deviceFixingDuration;
			
			this.deviceLowHighGap = new JenScript.SVGLine().from(deviceLow.x,deviceLow.y).to(deviceHigh.x,deviceHigh.y);
			if (this.getStock().getOpen() > this.getStock().getClose()) {
				this.deviceLowOpenCloseGap = new JenScript.SVGRect().origin(deviceFixingStart, deviceOpen.y).size(deviceFixingDuration, Math.abs(deviceOpen.y - deviceClose.y));
			} else {
				this.deviceLowOpenCloseGap = new JenScript.SVGRect().origin(deviceFixingStart, deviceClose.y).size(deviceFixingDuration, Math.abs(deviceOpen.y - deviceClose.y));
			}
			
			this.deviceLowHighGap = new JenScript.SVGLine().from(deviceLow.x,deviceLow.y).to(deviceHigh.x,deviceHigh.y);
			this.deviceOpenTick = new JenScript.SVGLine().from(deviceOpen.x-deviceFixingDuration/2,deviceOpen.y).to(deviceOpen.x,deviceOpen.y);
			this.deviceCloseTick = new  JenScript.SVGLine().from(deviceClose.x,deviceClose.y).to(deviceClose.x+deviceFixingDuration/2,deviceClose.y);
		},
	});
	
	
	JenScript.OhlcLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.OhlcLayer, JenScript.StockLayer);
	JenScript.Model.addMethods(JenScript.OhlcLayer, {
		_init : function(config){
			config = config || {};
			this.markerColor=(config.markerColor !== undefined)? config.markerColor : 'black';
			this.markerWidth=(config.markerWidth !== undefined)? config.markerWidth : 1.5;
			JenScript.StockLayer.call(this,{ name : "OhlcLayer"});
		},
		
		setMarkerColor : function(mc) {
			this.markerColor = mc;
		},
		
		setMarkerWidth : function(mw) {
			this.markerWidth = mw;
		},
		
		solveLayer : function() {
			this.geometries = [];
			for (var i = 0; i < this.plugin.getBoundedStocks().length; i++) {
				var stock = this.plugin.getBoundedStocks()[i];
				var geom = new JenScript.OhlcGeometry();
				geom.setLayer(this);
				geom.setStock(stock);
				geom.solveGeometry();
				this.addGeometry(geom);
			}
		},

		paintLayer : function(g2d,part) {
			if (part === 'Device') {
				var svgLayer = new JenScript.SVGGroup().Id(this.Id);
				for (var i = 0; i < this.getGeometries().length; i++) {
					var geom = this.getGeometries()[i];
					svgLayer.child(geom.deviceLowHighGap.fillNone().stroke(this.markerColor).strokeWidth(this.markerWidth).toSVG());
					svgLayer.child(geom.deviceOpenTick.fillNone().stroke(this.markerColor).strokeWidth(this.markerWidth).toSVG());
					svgLayer.child(geom.deviceCloseTick.fillNone().stroke(this.markerColor).strokeWidth(this.markerWidth).toSVG());
				}
				g2d.deleteGraphicsElement(this.Id);
				g2d.insertSVG(svgLayer.toSVG());
			}
		},
	});
	
	
})();
(function(){

	JenScript.VolumeBarGeometry = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.VolumeBarGeometry, JenScript.StockItemGeometry);

	JenScript.Model.addMethods(JenScript.VolumeBarGeometry, {
		__init : function(config){
			config = config || {};
			this.lowHighColor = 'darkgray';
			this.deviceVolumeGap;
		},
		
		solveItemGeometry : function(){
			var deviceFixingStart = this.deviceFixingStart;
			var deviceFixingDuration = this.deviceFixingDuration;
			var deviceVolume = this.deviceVolume;
			var deviceVolumeBase = this.deviceVolumeBase;
			
			this.deviceVolumeGap = new JenScript.SVGRect().origin(deviceFixingStart, deviceVolume.y).size(deviceFixingDuration, Math.abs(deviceVolume.y - deviceVolumeBase.y));
		},
	});
	
	JenScript.VolumeBarLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.VolumeBarLayer, JenScript.StockLayer);
	JenScript.Model.addMethods(JenScript.VolumeBarLayer, {
		_init : function(config){
			config = config || {};
			this.volumeColor = (config.volumeColor !== undefined)?config.volumeColor:'cyan';
			JenScript.StockLayer.call(this,{ name : "VolumeBarLayer"});
		},
		
		solveLayer : function() {
			this.geometries = [];
			for (var i = 0; i < this.plugin.getBoundedStocks().length; i++) {
				var stock = this.plugin.getBoundedStocks()[i];
				var geom = new JenScript.VolumeBarGeometry();
				geom.setLayer(this);
				geom.setStock(stock);
				geom.solveGeometry();
				this.addGeometry(geom);
			}
		},

		paintLayer : function(g2d,part) {
			if (part === 'Device') {
				var svgLayer = new JenScript.SVGGroup().Id(this.Id);
				for (var i = 0; i < this.getGeometries().length; i++) {
					var geom = this.getGeometries()[i];
					svgLayer.child(geom.deviceVolumeGap.fill(this.volumeColor).strokeNone().toSVG());
				}
				g2d.deleteGraphicsElement(this.Id);
				g2d.insertSVG(svgLayer.toSVG());
			}
		},
	});
})();
(function(){
	
	//encapsulate path
	JenScript.CurveStockGeometry = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.CurveStockGeometry, JenScript.StockGroupGeometry);

	JenScript.Model.addMethods(JenScript.CurveStockGeometry, {
		__init : function(config){
			config = config || {};
			this.moveCount = (config.moveCount !== undefined)? config.moveCount : 20;
			JenScript.StockGroupGeometry.call(this,config);
			this.points=[];
		},
		
		setMoveCount : function(mc){
			this.moveCount = mc;
		},
		getMoveCount : function(){
			return this.moveCount;
		},
		
		getCurvePoints : function() {
			return this.points;
		},
		
		//reset solve an re throw error to force solve geometry curve (stock group) 
		solveGeometry : function() {
			throw new Error('CurveStockGeometry solve should be supplied');
		}
	});
	
	
	JenScript.StockCurveLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockCurveLayer, JenScript.StockLayer);
	JenScript.Model.addMethods(JenScript.StockCurveLayer, {
		_init : function(config){
			config = config || {};
			this.curveColor = (config.curveColor !== undefined)? config.curveColor : 'black';
			this.curveWidth = (config.curveWidth !== undefined)? config.curveWidth : 1;
			this.moveCount = (config.moveCount !== undefined)? config.moveCount : 20;
			this.Id = 'fixing'+JenScript.sequenceId++;
			config.name = (config.name !== undefined)?config.name: "StockCurveLayer";
			JenScript.StockLayer.call(this,config);
		},
		
		setMoveCount : function(mc){
			this.moveCount = mc;
		},
		getMoveCount : function(){
			return this.moveCount;
		},
		
		getGeomInstance : function() {
			throw new Error("Geometry should be supplied");
		},
		
		solveLayer : function() {
			this.clearGeometries();
			var geom = this.getGeomInstance();
			geom.setLayer(this);
			geom.solveGeometry();
			this.addGeometry(geom);
		},

		paintLayer : function(g2d,part) {
			if (part === 'Device') {
				for (var i = 0; i < this.getGeometries().length; i++) {
					var geom = this.getGeometries()[i];
					var proj = this.plugin.getProjection();
					var points = geom.getCurvePoints();
					var svgLayer = new JenScript.SVGGroup().Id(this.Id).name(this.name);
					var stockCurve = new JenScript.SVGPath().Id(this.Id+'_path');
					for (var p = 0; p < points.length; p++) {
						var point = points[p];
						if(p == 0)
							stockCurve.moveTo(proj.userToPixelX(point.x),proj.userToPixelY(point.y));
						else
							stockCurve.lineTo(proj.userToPixelX(point.x),proj.userToPixelY(point.y));
					}
					g2d.deleteGraphicsElement(this.Id);
					//g2d.insertSVG();
					svgLayer.child(stockCurve.stroke(this.curveColor).strokeWidth(this.curveWidth).fillNone().toSVG());
					g2d.insertSVG(svgLayer.toSVG());
				}
			}
		},
	});
	
})();
(function(){
	
	JenScript.StockFixingGeometry = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockFixingGeometry, JenScript.CurveStockGeometry);

	JenScript.Model.addMethods(JenScript.StockFixingGeometry, {
		___init : function(config){
			config = config || {};
			JenScript.CurveStockGeometry.call(this,config);
		},
		
		solveGeometry : function(){
			var pts = [];
			var stocks = this.getLayer().getHost().getStocks();
			var proj = this.getLayer().getHost().getProjection();
			var minMillis = proj.minX;
			var maxMillis = proj.maxX;
			for (var s = 0; s < stocks.length; s++) {
				var stock = stocks[s];
				var fm = stock.getFixing().getTime();
				if(fm>minMillis && fm<maxMillis)
				pts[pts.length] = {
						x : stock.getFixing().getTime(),
						y : stock.getClose()
				};
			}
			this.points = pts;
		},
		
	});
	
	/**
	 * Stock fixing layer extends stock curve layer
	 */
	JenScript.StockFixingLayer = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockFixingLayer, JenScript.StockCurveLayer);
	JenScript.Model.addMethods(JenScript.StockFixingLayer, {
		__init : function(config){
			config = config || {};
			config.name = "StockFixingLayer";
			JenScript.StockCurveLayer.call(this,config);
		},
		
		/**
		 * return the stock fixing geometry
		 */
		getGeomInstance : function() {
			return new JenScript.StockFixingGeometry();
		},
	});
	
	
})();
(function(){
	JenScript.StockMovingAverageGeometry = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockMovingAverageGeometry, JenScript.CurveStockGeometry);

	JenScript.Model.addMethods(JenScript.StockMovingAverageGeometry, {
		___init : function(config){
			config = config || {};
			JenScript.CurveStockGeometry.call(this,config);
		},
		
		
		solveGeometry : function(){

			var proj = this.getLayer().getHost().getProjection();
			var minMillis = proj.minX;
			var maxMillis = proj.maxX;
			
			//TODO, better impl is to take only bound point and get index-moveCount and stop on need when condition(for example, not stock record available)
			var points = [];
			var stocks = this.getLayer().getHost().getStocks();
			if(stocks){
				stocks.sort(function(s1,s2){
					if(s1.getFixing().getTime()>s2.getFixing().getTime())
						return 1;
					return -1;
				});
			}
			
			for (var i = this.moveCount; i < stocks.length; i++) {
				var root = stocks[i];
				var sum = 0;
				for (var j = 0; j < this.moveCount; j++) {
					var s = stocks[i - j];
					sum = sum +s.getClose();
				}
				var movingAverage = sum / this.moveCount;
				
				var rootMillis = root.getFixing().getTime();
				//keep only bound point for drawing
				if(rootMillis>=minMillis && rootMillis<=maxMillis)
					points[points.length] = new JenScript.Point2D(root.getFixing().getTime(), movingAverage);
				
			}
			
			this.points = points;
		},
		
	});
	
	
	/**
	 * Stock moving average layer extends stock curve layer
	 */
	JenScript.StockMovingAverageLayer = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockMovingAverageLayer, JenScript.StockCurveLayer);
	JenScript.Model.addMethods(JenScript.StockMovingAverageLayer, {
		__init : function(config){
			config = config || {};
			config.name = "StockMovingAverageLayer";
			JenScript.StockCurveLayer.call(this,config);
		},
		
		/**
		 * return the stock fixing geometry
		 */
		getGeomInstance : function() {
			var conf = {moveCount : this.moveCount};
			return new JenScript.StockMovingAverageGeometry(conf);
		},
	});
	
	
})();
(function(){
	JenScript.StockWeightedMovingAverageGeometry = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockWeightedMovingAverageGeometry, JenScript.CurveStockGeometry);

	JenScript.Model.addMethods(JenScript.StockWeightedMovingAverageGeometry, {
		___init : function(config){
			config = config || {};
			JenScript.CurveStockGeometry.call(this,config);
		},
		
		solveGeometry : function(){

			var proj = this.getLayer().getHost().getProjection();
			var minMillis = proj.minX;
			var maxMillis = proj.maxX;
			
			var points = [];
			var stocks = this.getLayer().getHost().getStocks();
			if(stocks){
				stocks.sort(function(s1,s2){
					if(s1.getFixing().getTime()>s2.getFixing().getTime())
						return 1;
					return -1;
				});
			}
			
			for (var i = this.moveCount; i < stocks.length; i++) {
				var root = stocks[i];
				var sum = 0;
				var divider = 0;
				for (var j = 0; j < this.moveCount; j++) {
					var s = stocks[i - j];
					sum = sum + (this.moveCount-j)*s.getClose();
					divider = divider + (this.moveCount-j);
				}
				var movingAverage = sum / divider;
				
				var rootMillis = root.getFixing().getTime();
				//keep only bound point for drawing
				if(rootMillis>=minMillis && rootMillis<=maxMillis)
					points[points.length] = new JenScript.Point2D(root.getFixing().getTime(), movingAverage);
			}
			
			this.points = points;
		},
		
	});
	
	
	/**
	 * Stock weighted moving average layer extends stock curve layer
	 */
	JenScript.StockWeightedMovingAverageLayer = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockWeightedMovingAverageLayer, JenScript.StockCurveLayer);
	JenScript.Model.addMethods(JenScript.StockWeightedMovingAverageLayer, {
		__init : function(config){
			config = config || {};
			config.name = "StockWeightedMovingAverageLayer";
			JenScript.StockCurveLayer.call(this,config);
		},
		
		/**
		 * return the stock fixing geometry
		 */
		getGeomInstance : function() {
			var conf = {moveCount : this.moveCount};
			return new JenScript.StockWeightedMovingAverageGeometry(conf);
		},
	});
	
	
})();
(function(){
	JenScript.StockExponentialMovingAverageGeometry = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockExponentialMovingAverageGeometry, JenScript.CurveStockGeometry);

	JenScript.Model.addMethods(JenScript.StockExponentialMovingAverageGeometry, {
		___init : function(config){
			config = config || {};
			JenScript.CurveStockGeometry.call(this,config);
		},
		
		solveGeometry : function(){	
			
			var proj = this.getLayer().getHost().getProjection();
			var minMillis = proj.minX;
			var maxMillis = proj.maxX;
			
			
			//TODO, better impl is to take only bound point and get index-moveCount and stop on need when condition(for example, not stock record available)
			var points = [];
			var stocks = this.getLayer().getHost().getStocks();
			
			if(stocks){
				stocks.sort(function(s1,s2){
					if(s1.getFixing().getTime()>s2.getFixing().getTime())
						return 1;
					return -1;
				});
			}
			var alpha = 2/(this.moveCount+1);
			for (var i = this.moveCount; i < stocks.length; i++) {
				var root = stocks[i];
				var sum = root.getClose();
				var divider = 1;
				for (var j = 1; j < this.moveCount; j++) {
					var s = stocks[i - j];
					//sum = sum + (this.moveCount-j)*s.getClose();
					//divider = divider + (this.moveCount-j);
					sum = sum + Math.pow((1-alpha),j)*s.getClose();
					divider = divider + Math.pow((1-alpha),j);
				}
				var movingAverage = sum / divider;
				
				var rootMillis = root.getFixing().getTime();
				
				//keep only bound point for drawing
				if(rootMillis>=minMillis && rootMillis<=maxMillis)
					points[points.length] = new JenScript.Point2D(root.getFixing().getTime(), movingAverage);
			}
			
			this.points = points;
		},
		
	});
	
	
	/**
	 * Stock exponential moving average layer extends stock curve layer
	 */
	JenScript.StockExponentialMovingAverageLayer = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockExponentialMovingAverageLayer, JenScript.StockCurveLayer);
	JenScript.Model.addMethods(JenScript.StockExponentialMovingAverageLayer, {
		__init : function(config){
			config = config || {};
			config.name = "StockExponentialMovingAverageLayer";
			JenScript.StockCurveLayer.call(this,config);
		},
		
		/**
		 * return the stock fixing geometry
		 */
		getGeomInstance : function() {
			var conf = {moveCount : this.moveCount};
			return new JenScript.StockExponentialMovingAverageGeometry(conf);
		},
	});
	
	
})();
(function(){
	//encapsulate path
	JenScript.BollingerStockGeometry = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.BollingerStockGeometry, JenScript.StockGroupGeometry);

	JenScript.Model.addMethods(JenScript.BollingerStockGeometry, {
		__init : function(config){
			config = config || {};
			JenScript.StockGroupGeometry.call(this,config);
			this.moveCount = (config.moveCount !== undefined)?config.moveCount : 20;
			this.upperPoint=[];
			this.bottomPoint=[];
		},
		
		setMoveCount : function(mc){
			this.moveCount = mc;
		},
		getMoveCount : function(){
			return this.moveCount;
		},
		
		getCurveUp : function() {
			return this.upperPoint;
		},
		
		getCurveAverage : function() {
			return this.stockMAs;
		},
		
		getCurveBottom : function() {
			return this.bottomPoint;
		},
		
		//reset solve an re throw error to force solve geometry curve (stock group) 
		solveGeometry : function() {
			
			var proj = this.getLayer().getHost().getProjection();
			var minMillis = proj.minX;
			var maxMillis = proj.maxX;
			
			var upperPoint = [];
			var bottomPoint = [];
			var stockMAs = [];
			
			var stocks = this.getLayer().getHost().getStocks();
			if(stocks){
				stocks.sort(function(s1,s2){
					if(s1.getFixing().getTime()>s2.getFixing().getTime())
						return 1;
					return -1;
				});
			}

			for (var i = this.moveCount; i < stocks.length; i++) {
				var root = stocks[i];
				var rootMillis = root.getFixing().getTime();
				
				var sum = 0;
				for (var j = 0; j < this.moveCount; j++) {
					var s = stocks[i-j];
					sum = sum + s.getClose();
				}
				var movingAverage = sum / this.moveCount;
				
				
				//keep only bound point for drawing
				if(rootMillis>=minMillis && rootMillis<=maxMillis)
					stockMAs[stockMAs.length] = new JenScript.Point2D(root.getFixing().getTime(), movingAverage);
				
				

				var squarred = 0;
				for (var j = 0; j < this.moveCount; j++) {
					var s = stocks[i-j];
					squarred = squarred + Math.pow((s.getClose() - movingAverage), 2);
				}
				var deviation = Math.sqrt(squarred / this.moveCount);
				
				if(rootMillis>=minMillis && rootMillis<=maxMillis){
					upperPoint[upperPoint.length]   = new JenScript.Point2D(root.getFixing().getTime(), movingAverage + 2 * deviation);
					bottomPoint[bottomPoint.length] = new JenScript.Point2D(root.getFixing().getTime(), movingAverage - 2 * deviation);
				}
				
			}
			
			this.upperPoint  = upperPoint;
			this.bottomPoint = bottomPoint;
			this.stockMAs 	 = stockMAs;
		}
	});
	
	
	JenScript.StockBollingerLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockBollingerLayer, JenScript.StockLayer);
	JenScript.Model.addMethods(JenScript.StockBollingerLayer, {
		_init : function(config){
			config = config || {};
			
			this.lineColor = (config.lineColor !== undefined)? config.lineColor : 'black';
			this.lineOpacity = (config.lineOpacity !== undefined)? config.lineOpacity : 1;
			this.lineWidth = (config.lineWidth !== undefined)? config.lineWidth : 1;
			
			this.bandColor = (config.bandColor !== undefined)? config.bandColor : 'orange';
			this.bandOpacity = (config.bandOpacity !== undefined)? config.bandOpacity : 0.4;
			
			this.Id = 'StockBollinger'+JenScript.sequenceId++;
			this.bandId = this.Id+'_band';
			this.upId = this.Id+'_up';
			this.bottomId =  this.Id+'_bottom';
			JenScript.StockLayer.call(this,{ name : "StockBollingerLayer"});
		},
		
		solveLayer : function() {
			this.clearGeometries();
			var geom = new JenScript.BollingerStockGeometry();
			geom.setLayer(this);
//			for (var i = 0; i < this.plugin.getBoundedStocks().length; i++) {
//				var stock = this.plugin.getBoundedStocks()[i];
//				var itemGeom = new JenScript.StockItemGeometry();
//				itemGeom.setStock(stock);
//				itemGeom.setLayer(this);
//				geom.addStockItemGeometries(itemGeom);
//			}
			geom.solveGeometry();
			this.addGeometry(geom);
		},
		
		paintCurve : function(layer,g2d,part,points,id) {
			var proj = this.plugin.getProjection();
			var stockCurve = new JenScript.SVGPath().Id(id);
			for (var p = 0; p < points.length; p++) {
				var point = points[p];
				if(p == 0)
					stockCurve.moveTo(proj.userToPixelX(point.x),proj.userToPixelY(point.y));
				else
					stockCurve.lineTo(proj.userToPixelX(point.x),proj.userToPixelY(point.y));
			}
			//g2d.deleteGraphicsElement(id);
			//g2d.insertSVG(stockCurve.stroke(this.lineColor).strokeWidth(this.lineWidth).strokeOpacity(this.lineOpacity).fillNone().toSVG());
			var c = stockCurve.stroke(this.lineColor).strokeWidth(this.lineWidth).strokeOpacity(this.lineOpacity).fillNone().toSVG();
			layer.child(c);
		},
		
		paintBand : function(layer,g2d,part,up,bo) {
			var proj = this.plugin.getProjection();
			var stockBand = new JenScript.SVGPath().Id(this.bandId);
			for (var p = 0; p < up.length; p++) {
				var point = up[p];
				if(p == 0)
					stockBand.moveTo(proj.userToPixelX(point.x),proj.userToPixelY(point.y));
				else
					stockBand.lineTo(proj.userToPixelX(point.x),proj.userToPixelY(point.y));
			}
			for (var p = bo.length-1; p >= 0; p--) {
				var point = bo[p];
				stockBand.lineTo(proj.userToPixelX(point.x),proj.userToPixelY(point.y));
			}
			if(up.length > 0 && bo.length >0)
				stockBand.close();
			
			//g2d.deleteGraphicsElement(this.bandId);
			//g2d.insertSVG(stockBand.strokeNone().fill(this.bandColor).fillOpacity(this.bandOpacity).toSVG());
			var c = stockBand.strokeNone().fill(this.bandColor).fillOpacity(this.bandOpacity).toSVG();
			layer.child(c);
		},

		paintLayer : function(g2d,part) {
			if (part === 'Device') {
				for (var i = 0; i < this.getGeometries().length; i++) {
					var svgLayer = new JenScript.SVGGroup().Id(this.Id).name('StockBollingerLayer');
					
					var geom = this.getGeometries()[i];
					this.paintBand(svgLayer,g2d,part,geom.getCurveUp(),geom.getCurveBottom());
					this.paintCurve(svgLayer,g2d,part,geom.getCurveBottom(),this.bottomId);
					this.paintCurve(svgLayer,g2d,part,geom.getCurveUp(),this.upId);
					g2d.deleteGraphicsElement(this.Id);
					g2d.insertSVG(svgLayer.toSVG());
				}
			}
		},
	});
})();
(function(){
	JenScript.StockMACDGeometry = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockMACDGeometry, JenScript.StockGeometry);

	JenScript.Model.addMethods(JenScript.StockMACDGeometry, {
		_init : function(config){
			config = config || {};
			this.moveCountMin=(config.moveCountMin !== undefined)? config.moveCountMin : 12;
			this.moveCountMax=(config.moveCountMax !== undefined)? config.moveCountMax : 26;
			this.moveCountSignal=(config.moveCountSignal !== undefined)? config.moveCountSignal : 9;
			JenScript.StockGeometry.call(this,config);
			this.fixingMap = [];
		},
		
		
		getFixing : function(stock){
			for (var i = 0; i < this.fixingMap.length; i++) {
				var f = this.fixingMap[i];
				if(stock.getFixing().getTime() === f.stock.getFixing().getTime())
					return f;
			}
			var nf = {stock : stock};
			this.fixingMap[this.fixingMap.length] = nf;
			return nf;
		},
		
		_solveGeometry : function(tag,moveCount,stocks){	
			
			var alpha = 2/(moveCount+1);
			for (var i = moveCount; i < stocks.length; i++) {
				var root = stocks[i];
				var sum = root.getClose();
				var divider = 1;
				for (var j = 1; j < moveCount; j++) {
					var s = stocks[i - j];
					sum = sum + Math.pow((1-alpha),j)*s.getClose();
					divider = divider + Math.pow((1-alpha),j);
				}
				var movingAverage = sum / divider;
				
				if(tag === 'min')
					this.getFixing(root).min = movingAverage;
				if(tag === 'max')
					this.getFixing(root).max = movingAverage;
			}
			
		},
		
		_solveSignal : function(moveCount,stocks){
			
			var alpha = 2/(moveCount+1);
			for (var i = moveCount; i < stocks.length; i++) {
				var root = stocks[i];
				var fmacd = this.getFixing(root);
				var sum = fmacd.macd;
				var divider = 1;
				for (var j = 1; j < moveCount; j++) {
					var s = stocks[i - j];
					var fmacd2 = this.getFixing(s);
					sum = sum + Math.pow((1-alpha),j)*fmacd2.macd;
					divider = divider + Math.pow((1-alpha),j);
				}
				var movingAverage = sum / divider;
				fmacd.signal = movingAverage;
			}
			
		},
		
		solveGeometry : function(){
			var stocks = this.getLayer().getHost().getStocks();
			
//			if(stocks){
//				stocks.sort(function(s1,s2){
//					if(s1.getFixing().getTime()>s2.getFixing().getTime())
//						return 1;
//					return -1;
//				});
//			}
			//solve mme min and mme max
			this._solveGeometry('min',this.moveCountMin,stocks);
			this._solveGeometry('max',this.moveCountMax,stocks);
			
			var proj = this.getLayer().getHost().getProjection();
			var minMillis = proj.minX;
			var maxMillis = proj.maxX;

//			var points= [];
//			for (var i = 0; i < this.fixingMap.length; i++) {
//				var f = this.fixingMap[i];
//				var root = f.stock;
//				var macd = f.min - f.max;
//				f.macd = macd;
//				var rootMillis = root.getFixing().getTime();
//				//keep only bound point for drawing
//				if(rootMillis>=minMillis && rootMillis<=maxMillis)
//					points[points.length] = new JenScript.Point2D(root.getFixing().getTime(), macd);
//			}
			
			//solve macd
			for (var i = 0; i < stocks.length; i++) {
				var root = stocks[i];
				var fm = this.getFixing(root); 
				if(fm.min !== undefined && fm.max !== undefined){
					var macd = fm.min - fm.max;
					fm.macd = macd;
				}
			}
			
			//solve signal
			this._solveSignal(this.moveCountSignal,stocks);
			
		},
		
		
		getMACD : function(){
			var points = [];
			var proj = this.getLayer().getHost().getProjection();
			var minMillis = proj.minX;
			var maxMillis = proj.maxX;
			var stocks = this.getLayer().getHost().getStocks();
			for (var i = 0; i < stocks.length; i++) {
				var root = stocks[i];
				var rootMillis = root.getFixing().getTime();
				var fm = this.getFixing(root); 
				if(rootMillis>=minMillis && rootMillis<=maxMillis)
					points[points.length] = new JenScript.Point2D(root.getFixing().getTime(), fm.macd);
			}
			return points;
		},
		
		getSignal : function(){
			var points = [];
			var proj = this.getLayer().getHost().getProjection();
			var minMillis = proj.minX;
			var maxMillis = proj.maxX;
			//console.log("macd get signal min/max miilis:"+minMillis+"/"+maxMillis);
			var stocks = this.getLayer().getHost().getStocks();
			//console.log("macd getsignal : "+stocks.length);
			for (var i = 0; i < stocks.length; i++) {
				var root = stocks[i];
				var rootMillis = root.getFixing().getTime();
				var fm = this.getFixing(root); 
				if(rootMillis>=minMillis && rootMillis<=maxMillis){
					points[points.length] = new JenScript.Point2D(root.getFixing().getTime(), fm.signal);
				}
			}
			return points;
		},
		
		
	});
	
	
	/**
	 * Stock MACD Layer
	 */
	JenScript.StockMACDLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockMACDLayer, JenScript.StockLayer);
	JenScript.Model.addMethods(JenScript.StockMACDLayer, {
		_init : function(config){
			config = config || {};
			this.macdId='macdlayer'+JenScript.sequenceId++;
			this.signalId='signallayer'+JenScript.sequenceId++;
			
			this.lineColor = (config.lineColor !== undefined)? config.lineColor : 'black';
			this.lineOpacity = (config.lineOpacity !== undefined)? config.lineOpacity : 1;
			this.lineWidth = (config.lineWidth !== undefined)? config.lineWidth : 1;
			
			this.signalColor = (config.signalColor !== undefined)? config.signalColor : 'red';
			this.signalOpacity = (config.signalOpacity !== undefined)? config.signalOpacity : 1;
			this.signalWidth = (config.signalWidth !== undefined)? config.signalWidth : 1;
			
			this.macdColor = (config.macdColor !== undefined)? config.macdColor : 'blue';
			this.macdOpacity = (config.macdOpacity !== undefined)? config.macdOpacity : 1;
			this.macdWidth = (config.macdWidth !== undefined)? config.macdWidth : 1;
			
			this.moveCountSignal=(config.moveCountSignal !== undefined)? config.moveCountSignal : 9;
			this.moveCountMin=(config.moveCountMin !== undefined)? config.moveCountMin : 12;
			this.moveCountMax=(config.moveCountMax !== undefined)? config.moveCountMax : 26;
			config.name = "StockMACDLayer";
			JenScript.StockLayer.call(this,config);
		},
		
		solveLayer : function() {
			this.clearGeometries();
			var conf = {
					moveCountSignal : this.moveCountSignal,
					moveCountMin : this.moveCountMin,
					moveCountMax : this.moveCountMax
			};
			var geom = new JenScript.StockMACDGeometry(conf);
			geom.setLayer(this);
			geom.solveGeometry();
			this.addGeometry(geom);
		},
		
		paintCurve : function(svgLayer,g2d,part,points,id,color,width,opacity) {
			var proj = this.plugin.getProjection();
			var curve = new JenScript.SVGPath().Id(id);
			//console.log("create macd curve, points.length:"+points.length);
			for (var p = 0; p < points.length; p++) {
				var point = points[p];
				if(p == 0)
					curve.moveTo(proj.userToPixelX(point.x),proj.userToPixelY(point.y));
				else
					curve.lineTo(proj.userToPixelX(point.x),proj.userToPixelY(point.y));
			}
			
			//console.log("create macd curve : ");
			//g2d.deleteGraphicsElement(id);
			//g2d.insertSVG(curve.stroke(color).strokeWidth(width).strokeOpacity(opacity).fillNone().toSVG());
			svgLayer.child(curve.stroke(color).strokeWidth(width).strokeOpacity(opacity).fillNone().toSVG());
		},
		
		paintLayer : function(g2d,part) {
			if (part === 'Device') {
				for (var i = 0; i < this.getGeometries().length; i++) {
					var svgLayer = new JenScript.SVGGroup().Id(this.Id).name('StockMACDLayer');
					
					var geom = this.getGeometries()[i];
					var macd = geom.getMACD();
					var signal = geom.getSignal();
					this.paintCurve(svgLayer,g2d,part,macd,this.macdId,this.macdColor,this.macdWidth,this.macdOpacity);
					this.paintCurve(svgLayer,g2d,part,signal,this.signalId,this.signalColor,this.signalWidth,this.signalOpacity);
					g2d.deleteGraphicsElement(this.Id);
					g2d.insertSVG(svgLayer.toSVG());
				}
			}
		},
	});
	
	
})();