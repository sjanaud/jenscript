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
		
		_solveGeometry : function(tag,moveCount){
			var stocks = this.getLayer().stocksAdjusted;
			var alpha = 2/(moveCount+1);
			for (var i = stocks.length-1; i >= 30; i--) {
				var root = stocks[i];
				var sum = root.getClose();
				var divider = 1;
				for (var j = 1; j <= moveCount; j++) {
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
		
		_solveSignal : function(moveCount){
			var stocks = this.getLayer().stocksAdjusted;
			var alpha = 2/(moveCount+1);
			for (var i = stocks.length - 1; i >= 30+this.moveCountSignal; i--) {
				var root = stocks[i];
				var fmacd = this.getFixing(root);
				var sum = fmacd.macd;
				var divider = 1;
				for (var j = 1; j <= moveCount; j++) {
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
			this.fixingMap = [];
			//solve mme min and mme max
			this._solveGeometry('min',this.moveCountMin);
			this._solveGeometry('max',this.moveCountMax);
			
			//solve macd
			var stocks = this.getLayer().stocksAdjusted;
			for (var i = stocks.length-1; i >= 30; i--) {
				var root = stocks[i];
				var fm = this.getFixing(root); 
				if(fm.min !== undefined && fm.max !== undefined){
					var macd = fm.min - fm.max;
					fm.macd = macd;
				}else{
				}
			}
			
			//solve signal
			this._solveSignal(this.moveCountSignal);
		},
		
		getMACD : function(){
			return this.getPoints('macd',30,this.getLayer().stocksAdjusted.length - 1);
		},
		
		getSignal : function(){
			return this.getPoints('signal',30 + this.moveCountSignal,this.getLayer().stocksAdjusted.length - 1);
		},
		
		getPoints : function(type, start, stop){
			var points = [];
			var proj = this.getLayer().getHost().getProjection();
			var minMillis = proj.minX;
			var maxMillis = proj.maxX;
			var stocks = this.getLayer().stocksAdjusted;
			for (var i = start; i <= stop; i++) {
				var root = stocks[i];
				var rootMillis = root.getFixing().getTime();
				var fm = this.getFixing(root); 
				if(rootMillis>=minMillis && rootMillis<=maxMillis){
					var value = (type === 'signal')?fm.signal:fm.macd;
					points[points.length] = new JenScript.Point2D(root.getFixing().getTime(), value);
				}
			}
			return points;
		}
		
		
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
		
		
		selectStocks : function(){
			this.stocksAdjusted = this.getHost().getBoundedStocksAdjustedIndex(30, 30);
		},
		
		solveLayer : function() {
			this.selectStocks();
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
			for (var p = 0; p < points.length; p++) {
				var point = points[p];
				if(p == 0){
					curve.moveTo(proj.userToPixelX(point.x),proj.userToPixelY(point.y));
				}
				else{
					curve.lineTo(proj.userToPixelX(point.x),proj.userToPixelY(point.y));
				}
			}
			
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