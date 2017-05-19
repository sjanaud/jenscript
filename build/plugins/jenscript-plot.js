// JenScript -  JavaScript HTML5/SVG Library
// version : 1.2.0
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-05-19
// All Rights reserved

(function(){
	
	/**
	 * Object PlotPlugin()
	 * Defines a plugin that takes the responsibility to manage plot
	 * @param {Object} config
	 */
	JenScript.PlotPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PlotPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.PlotPlugin, {
		
		/**
		 * Initialize Plot Plugin
		 * Defines a plugin that takes the responsibility to manage function
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.priority = 100;
			config.name='PlotPlugin';
		    JenScript.Plugin.call(this,config);
		    this.plots = [];
		},
		
		/**
		 * add the given plot in this plot plugin
		 * @param {Object} plot
		 */
		addPlot : function(plot){
			plot.plugin = this;
			this.plots[this.plots.length] = plot;
			this.repaintPlugin();
		},
		
		/**
		 * remove the given plot in this plot plugin
		 * @param {Object} bubble
		 */
		removePlot : function(plot){
			var nb = [];
			for (var i = 0; i < this.plots.length; i++) {
				if(!this.plots[i].equals(plot))
					nb[nb.length]=this.plots[i];
			}
			this.plots = nb;
		},
		
		/**
		 * on projection register add 'bound changed' projection listener that invoke repaint plugin
		 * when projection bound changed event occurs.
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'PlotPlugin projection bound changed');
		},
		
		
		/**
		 * paint plot plugin
		 */
		 paintPlugin : function(g2d,viewPart) {
			 if(viewPart!== 'Device')return;
			 for (var i = 0; i < this.plots.length; i++) {
				 var plot = this.plots[i];
				 plot.solvePlot();
				
				 var pixelsPoints = plot.devicePoints;
				 var svgPath = new JenScript.SVGPath().Id(plot.Id);
				 for (var i = 0; i < pixelsPoints.length; i++) {
					var p = pixelsPoints[i];
					if(i === 0)
						svgPath.moveTo(p.x,p.y);
					else
						svgPath.lineTo(p.x,p.y);
				}
				g2d.deleteGraphicsElement(plot.Id);
				g2d.insertSVG(svgPath.fillNone().stroke(plot.plotColor).strokeWidth(plot.plotWidth).toSVG());
			 }
		 } 
		
	});
	
})();
(function(){
	
	/**
	 * Object Plot()
	 * Defines a plot
	 * @param {Object} config
	 */
	JenScript.Plot = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.Plot, {
		init : function(config){
			this.Id = 'plot'+JenScript.sequenceId++;
			/** plot points in the user coordinates system */
			this.userPoints=[];
			/** plot points in the pixel coordinates system */
			this.devicePoints=[];
			/** plot anchors */
			this.anchorsPoints=[];
			/** plot host plugin for this plot */
			this.plugin;
			/** plot draw color */
			this.plotColor = (config.plotColor !== undefined)?config.plotColor : 'red';
			this.plotWidth = (config.plotWidth !== undefined)?config.plotWidth : 2;
		},
		
		/**
		 * add a control point in this plot
		 * 
		 * @param x
		 * @param y
		 */
		addPoint : function(x,y) {
			this.userPoints[this.userPoints.length] = new JenScript.Point2D(x,y);
		},
		
		getPoints : function(){
			return this.userPoints;
		},
	
		solvePlot : function(){
			throw new Error('SolvePlot should be provided');
		},
		
	});
})();
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
(function(){
	/**
	 * Object BezierG1Plot()
	 * Defines a Bezier Plot
	 * @param {Object} config
	 */
	JenScript.BezierG1Plot = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.BezierG1Plot, JenScript.BezierPlot);
	JenScript.Model.addMethods(JenScript.BezierG1Plot, {
		
		/**
		 * Initialize Bezier G1 Plot 
		 * @param {Object} config
		 */
		__init : function(config){
			config = config || {};
		    JenScript.BezierPlot.call(this,config);
		},
		


		/**
		 * move k such that it is collinear with i and j
		 * 
		 * @param i
		 * @param j
		 * @param k
		 */
		forceCollinear : function(i,j,k) {
			var distance = function( x1,y1,x2,y2) {
				return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
			};
			var ij = distance(this.userPoints[i].getX(), this.userPoints[i].getY(), this.userPoints[j].getX(), this.userPoints[j].getY());
			var jk = distance(this.userPoints[j].getX(), this.userPoints[j].getY(), this.userPoints[k].getX(), this.userPoints[k].getY());
			var r = jk / ij;
			var kx = this.userPoints[j].getX() + r * (this.userPoints[j].getX() - this.userPoints[i].getX());
			var ky = this.userPoints[j].getY() + r * (this.userPoints[j].getY() - this.userPoints[i].getY());
			this.userPoints[k] = new JenScript.Point2D(kx,ky);
		},

		/**
		 * add a control point in this plot
		 * 
		 * @param x
		 * @param y
		 */
		addPoint : function(x,y) {
			this.userPoints[this.userPoints.length] = new JenScript.Point2D(x,y);
			var i = this.userPoints.length-1;
			if (i % 3 == 1 && i > 1) {
				this.forceCollinear(i,i-1,i-2);
			}
		},
		
	});
	
})();
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
(function(){
	/**
	 * Object NaturalClosedCubicPlot()
	 * Defines a natural closed cubic Plot
	 * @param {Object} config
	 */
	JenScript.NaturalClosedCubicPlot = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.NaturalClosedCubicPlot, JenScript.NaturalCubicPlot);
	JenScript.Model.addMethods(JenScript.NaturalClosedCubicPlot, {
		
		/**
		 * Initialize natural closed cubic Plot 
		 * @param {Object} config
		 */
		__init : function(config){
			config = config || {};
		    JenScript.NaturalCubicPlot.call(this,config);
		},
		
		 
		  /* calculates the closed natural cubic spline that interpolates
		     x[0], x[1], ... x[n]
		     The first segment is returned as
		     C[0].a + C[0].b*u + C[0].c*u^2 + C[0].d*u^3 0<=u <1
		     the other segments are in C[1], C[2], ...  C[n] */

		calcNaturalCubic : function( n,x) {
		   var w =[];
		   var v =[];
		   var y = [];
		   var D = [];
		   var z, F, G, H;
		    /* We solve the equation
		       [4 1      1] [D[0]]   [3(x[1] - x[n])  ]
		       |1 4 1     | |D[1]|   |3(x[2] - x[0])  |
		       |  1 4 1   | | .  | = |      .         |
		       |    ..... | | .  |   |      .         |
		       |     1 4 1| | .  |   |3(x[n] - x[n-2])|
		       [1      1 4] [D[n]]   [3(x[0] - x[n-1])]
		       
		       by decomposing the matrix into upper triangular and lower matrices
		       and then back sustitution.  See Spath "Spline Algorithms for Curves
		       and Surfaces" pp 19--21. The D[i] are the derivatives at the knots.
		       */
		    w[1] = v[1] = z = 1.0/4.0;
		    y[0] = z * 3 * (x[1] - x[n]);
		    H = 4;
		    F = 3 * (x[0] - x[n-1]);
		    G = 1;
		    for (var k = 1; k < n; k++) {
		      v[k+1] = z = 1/(4 - v[k]);
		      w[k+1] = -z * w[k];
		      y[k] = z * (3*(x[k+1]-x[k-1]) - y[k-1]);
		      H = H - G * w[k];
		      F = F - G * y[k-1];
		      G = -v[k] * G;
		    }
		    H = H - (G+1)*(v[n]+w[n]);
		    y[n] = F - (G+1)*y[n-1];
		    
		    D[n] = y[n]/H;
		    D[n-1] = y[n-1] - (v[n]+w[n])*D[n]; /* This equation is WRONG! in my copy of Spath */
		    for (var k = n-2; k >= 0; k--) {
		      D[k] = y[k] - v[k+1]*D[k+1] - w[k+1]*D[n];
		    }


		    /* now compute the coefficients of the cubics */
		    var C = [];
		    for ( var k = 0; k < n; k++) {
		      C[k] = new JenScript.PlotCubic(x[k], D[k], 3*(x[k+1] - x[k]) - 2*D[k] - D[k+1],
				       2*(x[k] - x[k+1]) + D[k] + D[k+1]);
		    }
		    C[n] = new JenScript.PlotCubic(x[n], D[n], 3*(x[0] - x[n]) - 2*D[n] - D[0],
				     2*(x[n] - x[0]) + D[n] + D[0]);
		    return C;
		  }

	});
	
})();
(function(){
	/**
	 * Object CatmullRomPlot()
	 * Defines a Catmull-Rom Plot
	 * @param {Object} config
	 */
	JenScript.CatmullRomPlot = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.CatmullRomPlot, JenScript.BSplinePlot);
	JenScript.Model.addMethods(JenScript.CatmullRomPlot, {
		
		/**
		 * Initialize Catmull-Rom Plot 
		 * @param {Object} config
		 */
		__init : function(config){
			config = config || {};
		    JenScript.BSplinePlot.call(this,config);
		},
		
		/**
		 * Catmull-Rom spline is just like a B spline, only with a different basis
		 * the basis function for Catmull-Rom
		 * @param i
		 * @param t
		 * @return coefficient
		 */
		 b : function(i,t) {
		    switch (i) {
			    case -2:
			      return ((-t+2)*t-1)*t/2;
			    case -1:
			      return (((3*t-5)*t)*t+2)/2;
			    case 0:
			      return ((-3*t+4)*t+1)*t/2;
			    case 1:
			      return ((t-1)*t*t)/2;
		    }
		    return 0; //we only get here if an invalid i is specified
		  },

	});
	
})();