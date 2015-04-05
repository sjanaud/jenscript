(function(){
	/**
	 * Object BSplinePlot()
	 * Defines a B Spline Plot
	 * @param {Object} config
	 */
	JenScript.BSplinePlot = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.BSplinePlot, JenScript.Plot);
	JenScript.Model.addMethods(JenScript.BSplinePlot, {
		
		/**
		 * Initialize Bezier Plot 
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			this.STEPS = (config.step !== undefined)?config.step : 12;
		    JenScript.Plot.call(this,config);
		},
		
		/**
		 * the basis function for a B Spline spline
		 * @param i
		 * @param t
		 * @return coefficient
		 */
		 b : function(i,t) {
			 switch (i) {
			    case -2:
			      return (((-t+3)*t-3)*t+1)/6;
			    case -1:
			      return (((3*t-6)*t)*t+4)/6;
			    case 0:
			      return (((-3*t+3)*t+3)*t+1)/6;
			    case 1:
			      return (t*t*t)/6;
			  }
			  return 0; //we only get here if an invalid i is specified
		},

		/**
		 * evaluate a point on the B spline
		 * 
		 * @param i
		 * @param t
		 * @return eval the pojnt on the spline
		 */
		p : function(i,t) {
			var px = 0;
			var py = 0;
			for (var j = -2; j <= 1; j++) {
				px += this.b(j,t) * this.getPoints()[i+j].getX();
				py += this.b(j,t) * this.getPoints()[i+j].getY();
			}
			return new JenScript.Point2D(Math.round(px), Math.round(py));
			
		},
		
		solvePlot : function() {
			var devicePoints = [];
			var q = this.p(2,0);
			var uq = this.plugin.getProjection().userToPixel(q);
			devicePoints[0]=uq;
			for (var i = 2; i < this.getPoints().length - 1; i ++) {
				for (var j = 1; j <= this.STEPS; j++) {
					q = this.p(i, j / this.STEPS);
					uq = this.plugin.getProjection().userToPixel(q);				
					devicePoints[devicePoints.length]=uq;
				}
			}
			this.devicePoints = devicePoints;
		},
		
	});
	
})();