(function(){
	 /* a + b*u + c*u^2 +d*u^3 */
	JenScript.PlotCubic = function(a,b,c,d) {
		 this.a = a;
	     this.b = b;
	     this.c = c;
	     this.d = d;
		  /** evaluate cubic */
		 this.eval = function(u) {
		    return (((this.d*u) + this.c)*u + this.b)*u + this.a;
		 };
	};
	
	/**
	 * Object NaturalCubicPlot()
	 * Defines a Natural Cubic Plot
	 * @param {Object} config
	 */
	JenScript.NaturalCubicPlot = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.NaturalCubicPlot, JenScript.Plot);
	JenScript.Model.addMethods(JenScript.NaturalCubicPlot, {
		
		/**
		 * Initialize Natural Cubic Plot 
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			this.STEPS = (config.step !== undefined)?config.step : 12;
		    JenScript.Plot.call(this,config);
		},
		
		 calcNaturalCubic : function(n,x) {
		    var gamma = [];
		    var delta = [];
		    var D = [];
		    /* We solve the equation
		       [2 1       ] [D[0]]   [3(x[1] - x[0])  ]
		       |1 4 1     | |D[1]|   |3(x[2] - x[0])  |
		       |  1 4 1   | | .  | = |      .         |
		       |    ..... | | .  |   |      .         |
		       |     1 4 1| | .  |   |3(x[n] - x[n-2])|
		       [       1 2] [D[n]]   [3(x[n] - x[n-1])]
		       
		       by using row operations to convert the matrix to upper triangular
		       and then back sustitution.  The D[i] are the derivatives at the knots.
		       */
		    
		    gamma[0] = 1.0/2.0;
		    for ( var i = 1; i < n; i++) {
		      gamma[i] = 1/(4-gamma[i-1]);
		    }
		    gamma[n] = 1/(2-gamma[n-1]);
		    
		    delta[0] = 3*(x[1]-x[0])*gamma[0];
		    for (var i = 1; i < n; i++) {
		      delta[i] = (3*(x[i+1]-x[i-1])-delta[i-1])*gamma[i];
		    }
		    delta[n] = (3*(x[n]-x[n-1])-delta[n-1])*gamma[n];
		    
		    D[n] = delta[n];
		    for (var i = n-1; i >= 0; i--) {
		      D[i] = delta[i] - gamma[i]*D[i+1];
		    }

		    /* now compute the coefficients of the cubics */
		    var C = [];
		    for ( i = 0; i < n; i++) {
		      C[i] = new JenScript.PlotCubic(x[i], D[i], 3*(x[i+1] - x[i]) - 2*D[i] - D[i+1],
				       2*(x[i] - x[i+1]) + D[i] + D[i+1]);
		    }
		    return C;
		  },

		  solvePlot : function() {
				var devicePoints = [];
				if (this.userPoints.length >= 2) {
					var xpoints =[];
					var ypoints =[];
					 for (var k = 0; k < this.userPoints.length; k++) {
						 xpoints[k]=this.userPoints[k].x;
						 ypoints[k]=this.userPoints[k].y;
					 }
				      var X = this.calcNaturalCubic(this.userPoints.length-1,xpoints);
				      var Y = this.calcNaturalCubic(this.userPoints.length-1,ypoints);
				    
				      var q = new JenScript.Point2D(Math.round(X[0].eval(0)),Math.round(Y[0].eval(0)));
				      var uq = this.plugin.getProjection().userToPixel(q);
				      devicePoints[0]=uq; 
				      for (var i = 0; i < X.length; i++) {
						for (var j = 1; j <= this.STEPS; j++) {
						  var u = j /  this.STEPS;
						  var q2 = new JenScript.Point2D(Math.round(X[i].eval(u)),Math.round(Y[i].eval(u)));
					      var uq2 = this.plugin.getProjection().userToPixel(q2);
						  devicePoints[devicePoints.length]=uq2; 
						}
				      }
				  }
				  this.devicePoints = devicePoints;
			}
	});
	
})();