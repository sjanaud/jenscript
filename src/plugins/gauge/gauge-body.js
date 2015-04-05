(function(){

	/**
	 * Object JenScript.GaugeBody()
	 * Gauge Body defines a gauge part that belongs path metrics
	 * 
	 * @param {Object} config
	 */
	JenScript.GaugeBody = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GaugeBody,JenScript.GaugePart);
	JenScript.Model.addMethods(JenScript.GaugeBody,{
		/**
		 * Initialize Gauge Body
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			/** gauges metrics paths */
			this.gaugeMetricsPaths = [];
			/** gauges texts paths */
			this.gaugeTextPaths = [];
			JenScript.GaugePart.call(this,config);
		},
		
		/**
		 * paint this gauge body
		 * @param {Object} graphics context
		 * @param {Object} radialGauge
		 */
		paintBody  : function( g2d,  radialGauge){
			for (var i = 0; i < this.getMetricsPaths().length; i++) {
				var path = this.getMetricsPaths()[i];
				path.setProjection(this.getGauge().getProjection());
				if(path.getPathBinder() !== undefined){
					var shape = path.getPathBinder().bindPath(radialGauge);
					if (shape !== undefined) {
						path.extPath = shape;
						//path.append(path.getPathBinder().bindPath(radialGauge));
						path.draw(g2d);
						g2d.insertSVG(shape.stroke('black').strokeWidth(1).fillNone().toSVG());
					}
				}
				if(path.getPathBinder() !== undefined && path.getPathBinder().isDebug()){
					path.getPathBinder().paintDebug(g2d, radialGauge);
				}
			}
			
//			for (var i = 0; i < this.getTextPaths().length; i++) {
//				var path = this.getTextPaths()[i];
//				//if (path.getPartBuffer() == null) {
//					path.setPath(path.getPathBinder().bindPath(radialGauge));
//					path.createPartBuffer(g2d);
//				//}
//				//paintPart(g2d, path.getPartBuffer());
//			}

			for (var i = 0; i < this.getMetricsPaths().length; i++) {
				var path = this.getMetricsPaths()[i];
				if (path.getGaugeNeedlePainter() != undefined) {
					//var needleBase = path.getNeedleBaseAnchorBinder().bindAnchor(gaugeMetricsPath.getBody().getGauge());
					//gaugeMetricsPath.getNeedleValueAnchorBinder().baseAnchor = needleBase;
					path.getGaugeNeedlePainter().paintNeedle(g2d, path);
				}
			}
		},
		
		/**
		 * register a gauge metrics path in this gauge
		 * @param {Object} path metrics to add
		 */
		registerGaugeMetricsPath : function(pathMetrics) {
			pathMetrics.setBody(this);
			this.gaugeMetricsPaths[this.gaugeMetricsPaths.length] = pathMetrics;
		},

		/**
		 * get gauge path metrics array
		 * @return {Array} path metrics array
		 */
		getMetricsPaths : function() {
			return this.gaugeMetricsPaths;
		},

		/**
		 * register a gauge text path in this gauge
		 * @param {Object} textPath
		 */
		registerGaugeTextPath : function(textPath) {
			textPath.setBody(this);
			this.gaugeTextPaths[this.gaugeTextPaths.length] = textPath;
		},

		/**
		 * get gauge text paths array
		 * @return {Array} gauge text paths
		 */
		getTextPaths : function() {
			return this.gaugeTextPaths;
		},

		/**
		 * Paint gauge part
		 * @param {Object} graphics context
		 * @param {Object} radialGauge
		 */
		paintPart  : function(g2d,gauge){
			this.paintBody(g2d,gauge);
		},
	});
})();