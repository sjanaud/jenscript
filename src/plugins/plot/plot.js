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