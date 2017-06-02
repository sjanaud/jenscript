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
//			if(stocks){
//				stocks.sort(function(s1,s2){
//					if(s1.getFixing().getTime()>s2.getFixing().getTime())
//						return 1;
//					return -1;
//				});
//			}

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