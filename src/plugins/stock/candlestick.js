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