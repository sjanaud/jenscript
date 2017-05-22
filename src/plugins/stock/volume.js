(function(){

	JenScript.VolumeBarGeometry = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.VolumeBarGeometry, JenScript.StockItemGeometry);

	JenScript.Model.addMethods(JenScript.VolumeBarGeometry, {
		__init : function(config){
			config = config || {};
			this.lowHighColor = 'darkgray';
			this.deviceVolumeGap;
		},
		
		solveItemGeometry : function(){
			var deviceFixingStart = this.deviceFixingStart;
			var deviceFixingDuration = this.deviceFixingDuration;
			var deviceVolume = this.deviceVolume;
			var deviceVolumeBase = this.deviceVolumeBase;
			
			this.deviceVolumeGap = new JenScript.SVGRect().origin(deviceFixingStart, deviceVolume.y).size(deviceFixingDuration, Math.abs(deviceVolume.y - deviceVolumeBase.y));
		},
	});
	
	JenScript.VolumeBarLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.VolumeBarLayer, JenScript.StockLayer);
	JenScript.Model.addMethods(JenScript.VolumeBarLayer, {
		_init : function(config){
			config = config || {};
			this.volumeColor = (config.volumeColor !== undefined)?config.volumeColor:'cyan';
			this.bearishColor = config.bearishColor;
			this.bullishColor = config.bullishColor;
			JenScript.StockLayer.call(this,{ name : "VolumeBarLayer"});
		},
		
		solveLayer : function() {
			this.geometries = [];
			for (var i = 0; i < this.plugin.getBoundedStocks().length; i++) {
				var stock = this.plugin.getBoundedStocks()[i];
				var geom = new JenScript.VolumeBarGeometry();
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
					var bearc = (this.bearishColor !== undefined)?this.bearishColor:this.plugin.getBearishColor();
					var bullc = (this.bullishColor !== undefined)?this.bullishColor:this.plugin.getBullishColor();
					var fillColor = (geom.getStock().isBearish())? bearc:bullc;
					svgLayer.child(geom.deviceVolumeGap.fill(fillColor).strokeNone().toSVG());
				}
				g2d.deleteGraphicsElement(this.Id);
				g2d.insertSVG(svgLayer.toSVG());
			}
		},
	});
})();