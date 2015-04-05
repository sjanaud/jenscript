(function(){
	/**
	 * Object Curve()
	 * Defines curve function
	 * @param {Object} config
	 */
	JenScript.Curve = function(config) {
		//JenScript.Curve
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Curve, JenScript.AbstractPathFunction);
	JenScript.Model.addMethods(JenScript.Curve, {
		/**
		 * Initialize Curve Function
		 * Defines a curve function
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.name = 'CurvePathFunction';
		    JenScript.AbstractPathFunction.call(this,config);
		},
		
		/**
		 * paint curve function
		 * @param g2d the graphics context
		 */
		paintFunction : function(g2d){
			this.paintPathFunction(g2d);
		}
	});
})();