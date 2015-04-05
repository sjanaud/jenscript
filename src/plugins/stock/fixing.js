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