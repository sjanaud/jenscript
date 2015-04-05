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