(function(){
	/**
	 * Object Donut2D()
	 * Defines Donut2D
	 * @param {Object} config
	 * @param {Object} [config.name] donut name
	 * @param {Object} [config.innerRadius] donut inner radius in pixel
	 * @param {Object} [config.outerRadius] donut outer radius in pixel
	 * @param {Object} [config.nature] donut projection nature, User or Device
	 * @param {Object} [config.centerX] donut center x, depends on projection nature
	 * @param {Object} [config.centerY] donut center y, depends on projection nature
	 * @param {Object} [config.startAngleDegree] donut start angle degree
	 * 
	 */
	JenScript.Donut2D = function(config){
		this.init(config);
	};
	
	JenScript.Model.addMethods(JenScript.Donut2D,{
		
		/**
		 * Initialize Donut2D
		 * @param {Object} config
		 * @param {Object} [config.name] donut name
		 * @param {Object} [config.innerRadius] donut inner radius in pixel
		 * @param {Object} [config.outerRadius] donut outer radius in pixel
		 * @param {Object} [config.nature] donut projection nature, User or Device
		 * @param {Object} [config.centerX] donut center x, depends on projection nature
		 * @param {Object} [config.centerY] donut center y, depends on projection nature
		 * @param {Object} [config.startAngleDegree] donut start abgle degree
		 * 
		 */
		init : function(config){
			config=config || {};
			/**donut instance Id*/
			this.Id = 'donut2d'+JenScript.sequenceId++;
			/** donut2D name */
		    this.name = (config.name !== undefined)?config.name : 'Donut2D name undefined';
		    /** donut2D nature */
		    this.nature = (config.nature !== undefined)?config.nature : 'User';
		    /** donut2D center x */
		    this.centerX = (config.centerX !== undefined)?config.centerX : 0;
		    /** donut2D center y */
		    this.centerY = (config.centerY !== undefined)?config.centerY : 0;
		    /** donut2D external radius */
		    this.outerRadius = (config.outerRadius !== undefined)?config.outerRadius : 100;
		    /** donut2D internal radius */
		    this.innerRadius =(config.innerRadius !== undefined)?config.innerRadius : 60;
		    /** donut2D start angle degree */
		    this.startAngleDegree = (config.startAngleDegree !== undefined)?config.startAngleDegree : 0;
		    /** donut2D draw */
		    this.stroke;
		    /** donut2D fill */
		    this.fill = new JenScript.Donut2DDefaultFill();
		    /** donut2D effect */
		    this.effects = [];
		    /** donut2D slices */
		    this.slices=[];
		    /** private host plugin */
		    this.plugin;
		    /**svg elements*/
		    this.svg={};
		},
		
		
		
		/**
		 * get Id
		 * @returns {String} Id
		 */
		getId : function(){
			return this.Id;
		},
		
		/**
		 * get inner radius
		 * @returns {Number} inner radius
		 */
		getInnerRadius : function(){
			return this.innerRadius;
		},
		
		/**
		 * get outer radius
		 * @returns {Number} outer radius
		 */
		getOuterRadius : function(){
			return this.outerRadius;
		},
		
		/**
		 * get center X
		 * @returns {Number} center X
		 */
		getCenterX : function(){
			return this.centerX;
		},
		
		/**
		 * get center Y
		 * @returns {Number} center Y
		 */
		getCenterY : function(){
			return this.centerY;
		},
		
		
		/**
		 * set Donut2D stroke
		 * @param {Object} stroke to set
		 */
		setStroke : function(stroke){
			this.stroke  = stroke;
			this.plugin.repaintPlugin();
		},
		
		/**
		 * set Donut2D fill
		 * @param {Object} fill to set
		 */
		setFill : function(fill){
			this.fill  = fill;
			this.plugin.repaintPlugin();
		},
		
		/**
		 * add Donut2D effect
		 * @param {Object} effect to add
		 */
		addEffect : function(effect){
			this.effects[this.effects.length]  = effect;
			this.plugin.repaintPlugin();
		},
		
		/**
	     * add slice object in this donut and return donut
	     * @param {Object} slice to add
	     *           
	     */
	    addSlice : function(slice) {
	        slice.donut = this;
	        this.slices[this.slices.length]=slice;
	        this.plugin.repaintPlugin();
	        return this;
	    },
	    
	    /**
	     * create a new slice with given config, append it to this donut and return donut
	     * @param config the slice config
	     */
	    slice : function(config){
			var s = new JenScript.Donut2DSlice(config);
			this.addSlice(s);
			return this;
		},
		
		 /**
		  * add slices array in this donut
		  * @param {Object} slice
		  */
		 addSlices : function (slices) {
	       for (var s = 0; s < slices.length; s++) {
	    	   this.addSlice(slices[s]);
	       }
	       return this;
		 },
		
		/**
		 * select the donut slice by the given name
		 */
		select : function(name){
			for (var i = 0; i < this.slices.length; i++) {
				if(this.slices[i].name === name)
					return this.slices[i];
			}
		},

	    /**
	     * return true if donut has at least one slice, false otherwise
	     * @return true if donut has at least one slice, false otherwise
	     */
	    isSolvable : function(){
	    	return this.slices.length > 0;
	    },


	    /**
	     * solve donut
	     */
	    solveDonut2D : function() {
	    	var that = this;
	        var project = (function() {
		        if (that.nature == 'User') {
		            var projectedCenter = that.plugin.getProjection().userToPixel(new JenScript.Point2D(that.centerX,that.centerY));
		            that.buildCenterX = projectedCenter.x;
		            that.buildCenterY = projectedCenter.y;
		        }
		        else  if (that.nature == 'Device') {
		        	that.buildCenterX = that.centerX;
		        	that.buildCenterY = that.centerY;
		        }
		        that.buildCenter = new JenScript.Point2D(that.buildCenterX,that.buildCenterY);
		    })();
	        var normalization = (function() {
		        var sum = 0;
		        for (var i = 0; i < that.slices.length; i++) {
		            var s = that.slices[i];
		            sum = sum + s.value;
		        }

		        for (var i = 0; i < that.slices.length; i++) {
		        	var s = that.slices[i];
		            var ratio = s.value / sum;
		            s.ratio=ratio;
		        }
		    })();
	        for (var j = 0; j < this.slices.length; j++) {
	            var s = this.slices[j];
	            this.solveSlice(s);
	        }
	    },

	    /**
	     * solve slice
	     * @param {Object} slice to solve
	     */
	    solveSlice : function(slice) {

	        var extendsDegree = slice.getRatio() * 360;

	        if (this.startAngleDegree > 360) {
	            this.startAngleDegree = this.startAngleDegree - 360;
	        }

	        var medianDegree = this.startAngleDegree + extendsDegree / 2;
	        if (medianDegree > 360) {
	            medianDegree = medianDegree - 360;
	        }

	        var startAngleDegree = this.startAngleDegree;
	        var sliceCenterX = this.buildCenterX + slice.divergence * Math.cos(JenScript.Math.toRadians(medianDegree));
	        var sliceCenterY = this.buildCenterY - slice.divergence * Math.sin(JenScript.Math.toRadians(medianDegree));
	        
	        slice.sc = {x:sliceCenterX,y:sliceCenterY};
	        var sliceOuterBegin = {
	        	x : sliceCenterX + this.outerRadius* Math.cos(JenScript.Math.toRadians(startAngleDegree)),
				y : sliceCenterY - this.outerRadius* Math.sin(JenScript.Math.toRadians(startAngleDegree))
	        };
	        var sliceOuterEnd = {
				x : sliceCenterX+ this.outerRadius* Math.cos(JenScript.Math.toRadians(startAngleDegree+extendsDegree)),
				y : sliceCenterY- this.outerRadius* Math.sin(JenScript.Math.toRadians(startAngleDegree+extendsDegree))
	        };
	        slice.ob = sliceOuterBegin;
	        slice.oe = sliceOuterEnd;
	        var largeArcFlag = (extendsDegree > 180) ? '1' : '0';
	        var outerArc = "M" + sliceOuterBegin.x + "," + sliceOuterBegin.y + " A" + this.outerRadius + ","
								+ this.outerRadius + " 0 " + largeArcFlag + ",0 " + sliceOuterEnd.x + ","
								+ sliceOuterEnd.y;
	        
	        

	        slice.outerArc = outerArc;

	        var sliceInnerBegin = {
	        	x : sliceCenterX + this.innerRadius* Math.cos(JenScript.Math.toRadians(startAngleDegree)),
				y : sliceCenterY - this.innerRadius* Math.sin(JenScript.Math.toRadians(startAngleDegree))
	        };
	        var sliceInnerEnd = {
				x : sliceCenterX+ this.innerRadius* Math.cos(JenScript.Math.toRadians(startAngleDegree+extendsDegree)),
				y : sliceCenterY- this.innerRadius* Math.sin(JenScript.Math.toRadians(startAngleDegree+extendsDegree))
	        };
	        slice.ib = sliceInnerBegin;
	        slice.ie = sliceInnerEnd;
	        var innerArc = "M" + sliceInnerBegin.x + "," + sliceInnerBegin.y + " A" + this.sliceInnerEnd + ","
						+ this.sliceInnerEnd + " 0 " + largeArcFlag + ",0 " + sliceInnerEnd.x + ","
						+ sliceInnerEnd.y;
	        slice.innerArc = innerArc;
	        
	        //face
	        var sliceFace = "M" + sliceOuterBegin.x + "," + sliceOuterBegin.y + " A" + this.outerRadius + ","
							+ this.outerRadius + " 0 " + largeArcFlag + ",0 " + sliceOuterEnd.x + ","
							+ sliceOuterEnd.y+' L '+sliceInnerEnd.x+','+sliceInnerEnd.y+ " A" + this.innerRadius + ","
							+ this.innerRadius + " 0 " + largeArcFlag + ",1 " + sliceInnerBegin.x + ","
							+ sliceInnerBegin.y+' Z';
		        
	        
	        slice.face = sliceFace;
	        
	        slice.medianDegree =  medianDegree;
	        slice.startAngleDegree =  startAngleDegree;
	        slice.endAngleDegree = startAngleDegree + extendsDegree;
	        slice.extendsDegree = extendsDegree;
	        
	        startAngleDegree = startAngleDegree + extendsDegree;
	        this.startAngleDegree = startAngleDegree;
	    },

	    /**
	     * get donut slices
	     * @return donut slices
	     */
	    getSlices : function() {
	        return this.slices;
	    },

	    /**
	     * return true if donut is roll over, false otherwise
	     * @return true if donut is roll over, false otherwise
	     */
	    isLockRollover : function() {
	        for (var i = 0; i < this.slices.length; i++) {
	            var s = this.slices[i];
	            if (s.lockRollover) {
	                return true;
	            }
	        }
	        return false;
	    },
	});
	
})();