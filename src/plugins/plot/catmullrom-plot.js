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