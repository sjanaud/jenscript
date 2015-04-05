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
			var points = [];
			//var stocks = this.getLayer().getHost().getStocks();
			
			var proj = this.getLayer().getHost().getProjection();
			var minMillis = proj.minX;
			var maxMillis = proj.maxX;
			
			
			var minDate = new Date(minMillis);
			var maxDate = new Date(maxMillis);
			
			console.log('mme min date : '+minDate);
			console.log('mme max date : '+maxDate);
			
			//min date - move Count Days
			
			var minDate2 = new Date(minDate.getFullYear(),minDate.getMonth(),minDate.getDate()-this.moveCount);
			console.log('mme corrected min date : '+minDate2);
			
			var stocks = this.getLayer().getHost().getRangeStocks(minDate2,maxDate);
			console.log('stocks range length : '+stocks.length);
			console.log('stock min : '+stocks[0]);
			console.log('stock max : '+stocks[stocks.length-1]);
			if(stocks){
				stocks.sort(function(s1,s2){
					if(s1.getFixing().getTime()>s2.getFixing().getTime())
						return 1;
					return -1;
				});
			}
			var alpha = 2/(this.moveCount+1);
			//for (var i = this.moveCount; i < stocks.length; i++) {
			for (var i = 0; i < stocks.length; i++) {
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