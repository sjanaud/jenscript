(function(){
	/**
	 * Object JenScript.GaugePart()
	 * Defines Abstract Gauge Part like envelope, background, body or glass.
	 * @param {Object} config
	 */
	JenScript.GaugePart = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.GaugePart,{
		/**
		 * Initialize Gauge Part
		 * @param {Object} config
		 */
		init : function(config){
			this.gauge;
			this.partBuffer;
		},
		
		/**
		 * get gauge of this path
		 * @return {Object} gauge
		 */
		getGauge : function() {
			return this.gauge;
		},

		/**
		 * set gauge of this part
		 * @param {Object} gauge
		 */
		setGauge : function(gauge) {
			this.gauge = gauge;
		},
		
		/**
		 * Paint this part of the given gauge 
		 * 
		 * @param {Object} graphics context
		 * @param {Object} radialGauge
		 */
		paintPart : function(g2d,radialGauge){throw new Error('JenScript.GaugePart, paintPart method should be provide by override.');},
	});
})();