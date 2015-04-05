(function(){

	/**
	 * Abstract widget geometry contains sensible shapes and have to solve it's geometry
	 */
	JenScript.AbstractWidgetGeometry  = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractWidgetGeometry,{
		
		/**
		 * init this widget geometry
		 * @param {Object} config
		 */
		init : function(config){
			/** sensible shape on this geometry */
		    this.sensibleShapes = [];
		},
		
		/**
	     * solve geometry for the specified widget bound
	     * @param {Object} widgetBound2D
	     */
	    solveGeometry : function(widgetBound2D){},

	    /**
	     * return true if the point defines by x and y coordinates is contains in
	     * one of the sensible shape
	     * 
	     * @param x {Number} the x point coordinate
	     * @param y {Number} the x point coordinate
	     * @return true if intercept, false otherwise
	     */
	    interceptSensibleShape : function(x,y) {
	    	for (var i = 0; i < this.sensibleShapes.length; i++) {
	    		 if (sensibleShapes[i].contains(x, y)) {
		                return true;
		            }
			}
	        return false;
	    },

	    /**
	     * @return the sensibleShapes
	     */
	    getSensibleShapes : function() {
	        return this.sensibleShapes;
	    },

	    /**
	     * clear sensible shape
	     */
	    clearSensibleShape : function() {
	        this.sensibleShapes = [];
	    },

	    /**
	     * @param sensibleShapes
	     *            the sensibleShapes to set
	     */
	    setSensibleShapes : function(sensibleShapes) {
	        this.sensibleShapes = sensibleShapes;
	    },

	    /**
	     * add sensible shape
	     * 
	     * @param sensibleShape
	     *            the sensible shape to add
	     */
	    addSensibleShape : function(sensibleShape) {
	        this.sensibleShapes[this.sensibleShapes.length] = sensibleShape;
	    },
	});
	
})();