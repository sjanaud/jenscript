(function(){
	/**
	 * Object LinePlot()
	 * Defines a LINE Plot
	 * @param {Object} config
	 */
	JenScript.LinePlot = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LinePlot, JenScript.Plot);
	JenScript.Model.addMethods(JenScript.LinePlot, {
		
		/**
		 * Initialize Bezier Plot 
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
		    JenScript.Plot.call(this,config);
		},
		
		solvePlot : function() {
			var devicePoints = [];
			for (var i = 0; i < this.getPoints().length; i++) {
				var uq = this.plugin.getProjection().userToPixel(this.getPoints()[i]);				
				devicePoints[devicePoints.length]=uq;
			}
			this.devicePoints = devicePoints;
		},


	});
	
})();