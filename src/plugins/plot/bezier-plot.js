(function(){
	/**
	 * Object BezierPlot()
	 * Defines a Bezier Plot
	 * @param {Object} config
	 */
	JenScript.BezierPlot = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.BezierPlot, JenScript.Plot);
	JenScript.Model.addMethods(JenScript.BezierPlot, {
		
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
		 * the basis function for a Bezier spline
		 * @param i
		 * @param t
		 * @return coefficient
		 */
		 b : function(i,t) {
			switch (i) {
			case 0:
				return (1 - t) * (1 - t) * (1 - t);
			case 1:
				return 3 * t * (1 - t) * (1 - t);
			case 2:
				return 3 * t * t * (1 - t);
			case 3:
				return t * t * t;
			}
			return 0; // we only get here if an invalid i is specified
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
			for (var j = 0; j <= 3; j++) {
				px += this.b(j,t) * this.getPoints()[i+j].getX();
				py += this.b(j,t) * this.getPoints()[i+j].getY();
			}
			return new JenScript.Point2D(px, py);
		},
		
		solvePlot : function() {
			var devicePoints = [];
			var q = this.p(0, 0);
			var uq = this.plugin.getProjection().userToPixel(q);
			devicePoints[0]=uq;
			for (var i = 0; i < this.getPoints().length - 3; i += 3) {
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