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