(function(){
	
	JenScript.SymbolBarGroup = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarGroup, JenScript.SymbolBar);
	JenScript.Model.addMethods(JenScript.SymbolBarGroup,{
		
		__init : function(config){
			config=config||{};
			JenScript.SymbolBar.call(this, config);
			/** component registry */
			this.symbolComponents = [];
		},

		getThickness : function() {
	        var groupThickness = 0;
	        for (var i = 0; i < this.symbolComponents.length; i++) {
	            groupThickness = groupThickness + this.symbolComponents[i].getThickness();
	        }
	        return groupThickness;
	    },


	    /**
	     * get max value in device coordinate for this group in the scalar dimension
	     * 
	     * @return the max value in device coordinate
	     */
	    getMaxValue : function() {
	        var max = -1;
	        var setMax = false;
	        for (var i = 0; i < this.symbolComponents.length; i++) {
	        	var b = this.symbolComponents[i];
	            if (!b.isFiller) {
	                var rect2D = b.getBarShape().getBounds2D();
	                if (this.getNature() === 'Vertical') {
	                    if (!setMax) {
	                        max = rect2D.getMaxY();
	                        setMax = true;
	                    }
	                    max = Math.max(max, rect2D.getMaxY());
	                }
	                else if (this.getNature() === 'Horizontal') {
	                    if (!setMax) {
	                        max = rect2D.getMaxX();
	                        setMax = true;
	                    }
	                    max = Math.max(max, rect2D.getMaxX());
	                }
	            }
	        }
	        return max;
	    },

	    /**
	     * get min value in device coordinate for this group in the scalar dimension
	     * 
	     * @return the min value in device coordinate
	     */
	    getMinValue : function() {
	        var min = -1;
	        var setMin = false;
	        for (var i = 0; i < this.symbolComponents.length; i++) {
	        	var b = this.symbolComponents[i];
	            if (!b.isFiller) {
	                var rect2D = b.getBarShape().getBounds2D();
	                if (this.getNature() === 'Vertical') {
	                    if (!setMin) {
	                        min = rect2D.getMinY();
	                        setMin = true;
	                    }
	                    min = Math.min(min, rect2D.getMinY());
	                }
	                else if (this.getNature() == 'Horizontal') {
	                    if (!setMin) {
	                        min = rect2D.getMinX();
	                        setMin = true;
	                    }
	                    min = Math.min(min, rect2D.getMinX());
	                }
	            }
	        }
	        return min;
	    },

	    /**
	     * get center value in device coordinate for this group in the scalar
	     * dimension
	     * 
	     * @return the center value in device coordinate
	     */
	    getCenterValue : function() {
	        var max = this.getMaxValue();
	        var min = this.getMinValue();
	        return min + Math.abs(max - min) / 2;
	    },

	    /**
	     * get the bar group virtual shape the bar shape for this group is the
	     * bounding rectangle which contains all bar symbol
	     */
	   getBarShape : function() {
//	        Area a = new Area();
//	        double max = getMaxValue();
//	        double min = getMinValue();
//
//	        for (BarSymbol b : getSymbolComponents()) {
//	            if (!b.isFiller()) {
//	                a.add(new Area(b.getBarShape()));
//	            }
//	            else if (b.isFiller() && b.getFillerType() == FillerType.Strut) {
//	                Rectangle2D strutShape = null;
//	                if (getNature() == SymbolNature.Vertical) {
//	                    strutShape = new Rectangle2D.Double(b.getLocationX(), max,
//	                                                        b.getThickness(), max - min);
//	                }
//	                else if (getNature() == SymbolNature.Horizontal) {
//	                    strutShape = new Rectangle2D.Double(min, b.getLocationY(),
//	                                                        max - min, b.getThickness());
//	                }
//	                // a.add(new Area(strutShape));
//	            }
//	        }
//	        return a.getBounds2D();
	    },
	    
	    /**
	     * add symbol component
	     * 
	     * @param symbol
	     *            the symbol to add
	     * @throws IllegalArgumentException
	     *             if glue is add in this group
	     */
	    addSymbol : function(symbol) {
	        if (symbol.isFiller && symbol.getFillerType() === 'Glue') {
	            throw new Error("Glue can not be add in group.");
	        }
	        this.symbolComponents.add(symbol);
	    },

	    /**
	     * remove symbol component
	     * 
	     * @param symbol
	     *            the symbol to remove
	     */
	    removeSymbolComponent : function(symbol) {
	        //symbolComponents.remove(symbol);
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
	     * set symbols components to set
	     * 
	     * @param symbolComponents
	     */
	   setSymbolComponents : function(symbolComponents) {
	        this.symbolComponents = symbolComponents;
	   }
		
	});
	
	
})();