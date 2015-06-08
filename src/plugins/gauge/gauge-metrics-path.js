(function(){

	
	/**
	 * Object JenScript.GaugeMetricsPath()
	 * Defines a gauge metrics path
	 * @param {Object} config
	 */
	JenScript.GaugeMetricsPath = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GaugeMetricsPath,JenScript.GeneralMetricsPath);
	JenScript.Model.addMethods(JenScript.GaugeMetricsPath,{
		_init : function(config){
			console.log('create gauge metrics path');
			config = config || {};
			config.nature = 'Device';
			/** current value */
			this.currentValue;
			/** needle base anchor binder */
			this.needleBaseAnchorBinder;
			/** needle value anchor binder */
			this.needleValueAnchorBinder;
			/** gauge body this metrics path */
			this.body;
			/** path binder */
			this.pathBinder;
			/** gauge needle painter */
			this.gaugeNeedlePainter;
			JenScript.GeneralMetricsPath.call(this,config);
		},
		
		/**
		 * get gauge needle painter
		 * @returns {Object} needle painter
		 */
		getGaugeNeedlePainter : function() {
			return this.gaugeNeedlePainter;
		},

		/**
		 * set gauge needle painter
		 * @param {Object} gauge needle painter
		 */
		setGaugeNeedlePainter : function(gaugeNeedlePainter) {
			this.gaugeNeedlePainter = gaugeNeedlePainter;
		},

		/**
		 * get the current user value
		 * @returns {Number} current value
		 */
		getCurrentValue : function() {
			return this.currentValue;
		},

		/**
		 * set current user value
		 * @param {Number} currentValue
		 */
		setCurrentValue : function(currentValue) {
			if (this.currentValue < this.getMin() || this.currentValue > this.getMax())
				throw new Error("Gauge Metrics out of range. " + this.currentValue + " [min,max] path range.");
			this.currentValue = currentValue;
		},

		/**
		 * get path binder
		 * 
		 * @return path binder
		 */
		getPathBinder : function() {
			return this.pathBinder;
		},

		/**
		 * get path binder
		 * 
		 * @param pathBinder
		 */
		setPathBinder : function(pathBinder) {
			if(pathBinder !== undefined){
				pathBinder.setMetricsPath(this);
			}
			this.pathBinder = pathBinder;
		},

		/**
		 * get needle base anchor binder
		 * 
		 * @return needle base anchor binder
		 */
		getNeedleBaseAnchorBinder : function() {
			return this.needleBaseAnchorBinder;
		},

		/**
		 * set needle anchor binder
		 * 
		 * @param needleAnchorBinder
		 */
		setNeedleBaseAnchorBinder : function(needleAnchorBinder) {
			needleAnchorBinder.setMetricsPath(this);
			this.needleBaseAnchorBinder = needleAnchorBinder;
		},

		/**
		 * get needle value anchor binder
		 * 
		 * @return needle value anchor binder
		 */
		getNeedleValueAnchorBinder : function() {
			return this.needleValueAnchorBinder;
		},

		/**
		 * set needle value anchor binder
		 * 
		 * @param needleValueAnchorBinder
		 */
		setNeedleValueAnchorBinder : function(needleValueAnchorBinder) {
			needleValueAnchorBinder.setMetricsPath(this);
			this.needleValueAnchorBinder = needleValueAnchorBinder;
		},

		/**
		 * @return the body
		 */
		getBody : function() {
			return this.body;
		},

		/**
		 * @param body
		 *            the body to set
		 */
		setBody : function(body) {
			this.body = body;
		},

		/**
		 * create part buffer of this metrics path from original context.
		 * 
		 * @param g2d
		 */
		draw : function(g2d) {
			console.log('gauge metrics path draw');
			this.graphicsContext = g2d;
			this.getMetrics();


//			if (getPathPainter() != null) {
//				getPathPainter().paintPath(g2dPart, this);
//			}
//
//			List<GlyphMetric> metrics = getMetrics();
//			for (GlyphMetric m : metrics) {
//
//				if (m.getGlyphMetricMarkerPainter() != null) {
//					m.getGlyphMetricMarkerPainter().paintGlyphMetric(g2dPart, m);
//				}
//				if (m.getGlyphMetricFill() != null) {
//					m.getGlyphMetricFill().paintGlyphMetric(g2dPart, m);
//				}
//				if (m.getGlyphMetricDraw() != null) {
//					m.getGlyphMetricDraw().paintGlyphMetric(g2dPart, m);
//				}
//				if (m.getGlyphMetricEffect() != null) {
//					m.getGlyphMetricEffect().paintGlyphMetric(g2dPart, m);
//				}
//			}
		},
	});
})();