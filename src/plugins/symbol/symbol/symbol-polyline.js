(function(){
	
	JenScript.SymbolPolylinePoint = function(config) {
		//SymbolPolylinePoint
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPolylinePoint, JenScript.SymbolPoint);
	JenScript.Model.addMethods(JenScript.SymbolPolylinePoint,{
		
		__init : function(config){
			config=config||{};
			 /** bar members */
		    this.symbolComponents = [];
		    /** polyline painter */
		    this.polylinePainter = new JenScript.SymbolPolylinePainter();
		    JenScript.SymbolPoint.call(this, config);
		},
		
	    getNature : function() {
	        return this.getHost().getNature();
	    },

	    getThickness : function() {
	        return 0;
	    },

	    /***
	     * get the polyline painter
	     * 
	     * @return polyline painter
	     */
	    getPolylinePainter : function() {
	        return this.polylinePainter;
	    },

	    /**
	     * set the polyline painter
	     * 
	     * @param polylinePainter
	     *            the polyline painter to set
	     */
	    setPolylinePainter : function(polylinePainter) {
	        this.polylinePainter = polylinePainter;
	    },

	    /**
	     * add symbol component
	     * 
	     * @param symbol
	     *            the symbol to add
	     */
	    addSymbol : function(point) {
	    	if(point instanceof JenScript.SymbolPoint)
	    		this.symbolComponents[this.symbolComponents.length]= point;
	    },

	    /**
	     * remove symbol component
	     * 
	     * @param symbol
	     *            the bar to remove
	     */
	    removeSymbolComponent : function(point) {
	    	var pts = [];
	    	for (var i = 0; i < this.symbolComponents.length; i++) {
				if(!this.symbolComponents[i].equals(point))
					pts[pts.length]=this.symbolComponents[i];
			}
	        this.symbolComponents=pts;
	    },

	    /**
	     * get symbol components
	     * 
	     * @return symbol components
	     */
	    getSymbolComponents : function() {
	        return this.symbolComponents;
	    },

	    /**
	     * set symbol components
	     * 
	     * @param symbolComponents
	     */
	    setSymbolComponents : function(symbolComponents) {
	        this.symbolComponents = symbolComponents;
	    }
	});
})();