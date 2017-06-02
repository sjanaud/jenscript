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
			
//			if(stocks){
//				stocks.sort(function(s1,s2){
//					if(s1.getFixing().getTime()>s2.getFixing().getTime())
//						return 1;
//					return -1;
//				});
//			}
			var alpha = 2/(this.moveCount+1);
			for (var i = this.moveCount; i < stocks.length; i++) {
				var root = stocks[i];
				var sum = root.getClose();
				var divider = 1;
				for (var j = 1; j < this.moveCount; j++) {
					var s = stocks[i - j];
					sum = sum + Math.pow((1-alpha),j)*s.getClose();
					divider = divider + Math.pow((1-alpha),j);
				}
				var movingAverage = sum / divider;
				
				var rootMillis = root.getFixing().getTime();
				
				//keep only bound point for drawing
				if(rootMillis>=minMillis && rootMillis<=maxMillis)
					points[points.length] = new JenScript.Point2D(root.getFixing().getTime(), movingAverage);
			}
			//console.log("points in geometry exp : "+this.points.length);
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
			//config.name = "StockExponentialMovingAverageLayer";
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