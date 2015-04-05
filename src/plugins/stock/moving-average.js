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