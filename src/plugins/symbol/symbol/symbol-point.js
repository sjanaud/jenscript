(function(){
	
	JenScript.SymbolPoint = function(config) {
		//SymbolPoint
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPoint, JenScript.SymbolComponent);
	JenScript.Model.addMethods(JenScript.SymbolPoint,{
		
		_init : function(config){
			config=config||{};
			 /** the point value in user system coordinate */
		   this.value = config.value;
		    /** transformed value in device coordinate */
		   this.deviceValue;
		    /** the point of this symbol */
		   this.devicePoint;
		    /** symbol point painter */
		   this.pointSymbolPainters = [];//(config.pointSymbolPainter !== undefined)?config.pointSymbolPainter : new JenScript.SymbolPointSquare(); // = new ArrayList<AbstractPointSymbolPainter>();
		   this.pointSymbolPainters[0] = new JenScript.SymbolPointSquare(); 
		   /** sensible radius in pixel */
		   this.sensibleRadius = 10;
		    /** sensible shape */
		   this.sensibleShape;
		   JenScript.SymbolComponent.call(this, config);
		},
		
		
		 /**
	     * get the value in the user system coordinate
	     * 
	     * @return the value
	     */
	    getValue : function() {
	        return this.value;
	    },

	    /**
	     * set the value in the user system coordinate
	     * 
	     * @param value
	     *            the value to set
	     */
	    setValue : function(value) {
	        this.value = value;
	    },

	    // /**
	    // * a point symbol has no thickness, so this return 0
	    // */
	    // @Override
	    // public double getThickness() {
	    // return 0;
	    // }

	    /**
	     * @return the sensibleShape
	     */
	    getSensibleShape : function() {
	        return this.sensibleShape;
	    },

	    /**
	     * @param sensibleShape
	     *            the sensibleShape to set
	     */
	    setSensibleShape : function(sensibleShape) {
	        this.sensibleShape = sensibleShape;
	    },

	    /**
	     * get the transformed value coordinate in the device system
	     * 
	     * @return the deviceValue
	     */
	    getDeviceValue : function() {
	        return this.deviceValue;
	    },

	    /**
	     * set the transformed value coordinate in the device system
	     * 
	     * @param deviceValue
	     *            the deviceValue to set
	     */
	    setDeviceValue : function(deviceValue) {
	        this.deviceValue = deviceValue;
	    },

	    /**
	     * @return the devicePoint
	     */
	    getDevicePoint : function() {
	        return this.devicePoint;
	    },

	    /**
	     * @param devicePoint
	     *            the devicePoint to set
	     */
	    setDevicePoint : function(devicePoint) {
	        this.devicePoint = devicePoint;
	    },

	    /**
	     * @return the pointSymbolPainter
	     */
	    getPointSymbolPainters : function() {
	        return this.pointSymbolPainters;
	    },

	    /**
	     * @param pointSymbolPainterList
	     *            the pointSymbolPainter list to set
	     */
	    setPointSymbolPainters : function(painters) {
	        this.pointSymbolPainters = painters;
	    },

	    /**
	     * @param pointSymbolPainter
	     *            the pointSymbolPainter to add
	     */
	    addPointSymbolPainter : function( painter) {
	        this.pointSymbolPainters[this.pointSymbolPainters] = painter;
	    },

	    /**
	     * @return the sensibleRadius
	     */
	    getSensibleRadius : function() {
	        return this.sensibleRadius;
	    },

	    /**
	     * @param sensibleRadius
	     *            the sensibleRadius to set
	     */
	    setSensibleRadius : function(sensibleRadius) {
	        this.sensibleRadius = sensibleRadius;
	    }

	});
})();