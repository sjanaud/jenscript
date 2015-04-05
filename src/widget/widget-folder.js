(function(){
	/**
	 * Widget folder contains the place holder properties of widget
	 */
	JenScript.WidgetFolder = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.WidgetFolder,{
		init: function(config){
			config = config||{};
		},
		
		/**
		 * get a string representation of this widget folder
		 * @return {String} folder string representation
		 */
		toString : function() {
	        return "WidgetFolder [Id="+this.Id+", xIndex=" + this.xIndex + ", yIndex=" + this.yIndex + ", x="
	                + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + "]";
	    },
	    
	    /**
	     * return this folder bound
	     * @return {Object} folder bound
	     */
	    getBounds2D : function(){
	    	return new JenScript.Bound2D(this.x,this.y,this.width,this.height);
	    },
	    
	    /**
	     * return the folder Id which is equal to widget Id
	     */
	    getId : function(){
	    	return this.Id;
	    },
		
  
	    /**
	     * start press this folder
	     */
	    startPress : function() {
	    	this.lockPress=true;
	    },
	    
	    /**
	     * interrupt press
	     */
	    interruptPress : function() {
	        this.lockPress = false;
	    },
	    
	    /**
	     * update widget folder frame
	     * 
	     * @param {Number} x
	     *            the new folder x coordinate
	     * @param {Number} y
	     *            the new folder y coordinate
	     * @param {Number} width
	     *            the new folder width
	     * @param {Number} height
	     *            the new folder height
	     */
	    updateFrame : function(x,y,width,height) {
	        this.x =x;
	        this.y= y;
	        this.width = width;
	        this.height = height;
	    },
	    
	});
})();