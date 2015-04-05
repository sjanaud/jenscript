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