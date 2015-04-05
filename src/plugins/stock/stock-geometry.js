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