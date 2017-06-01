// JenScript -  JavaScript HTML5/SVG Library
// version : 1.3.1
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-06-01
// All Rights reserved

(function(){
	/**
	 * Object Donut2DPlugin()
	 * Defines a plugin that takes the responsibility to manage Donut 2D
	 * @param {Object} config
	 */
	JenScript.Donut2DPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.Donut2DPlugin, {
		/**
		 * Initialize Donut2D Plugin
		 * Defines a plugin that takes the responsibility to manage Donut 2D
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.name = 'Donut2DPlugin';
			this.donuts = [];
			this.donutListeners=[];
			JenScript.Plugin.call(this,config);
		},
		
		/**
		 * add Donut 2D object
		 * @param {Object} donut
		 * 
		 */
		addDonut : function(donut) {
			donut.plugin = this;
			this.donuts[this.donuts.length] = donut;
			this.repaintPlugin();
		},
		
		/**
		 * select the donut by the given name
		 */
		select : function(name){
			for (var i = 0; i < this.donuts.length; i++) {
				if(this.donuts[i].name === name)
					return this.donuts[i];
			}
		},
		
		/**
		 * add Donut listener such as press, release, move, enter, exit and click
		 */
		addDonutListener : function(actionEvent,listener) {
			var l={action:actionEvent,onEvent : listener};
			this.donutListeners[this.donutListeners.length] = l;
		},
		
		/**
		 * fire donut event
		 * @param {String} the donut action
		 * @param {Slice} the donut slice
		 * @param {Number} the device x coordinate
		 * @param {Number} the device y coordinate
		 */
		fireDonutEvent : function(action,event){
			for (var l = 0; l < this.donutListeners.length; l++) {
				if(this.donutListeners[l].action === action){
					this.donutListeners[l].onEvent(event);
				}
			}
		},
		
		dispatchDonutAction : function(evt,action,deviceX,deviceY){
			var that = this;
			var fire1 = function(slice){
				if(action === 'move'){
					if(!slice.lockRollover){
						
						slice.lockRollover = true;
						that.fireDonutEvent('enter',{slice : slice, x:deviceX,y:deviceY, device :{x:deviceX,y:deviceY}});
						that.fireDonutEvent('move',{slice : slice, x:deviceX,y:deviceY, device :{x:deviceX,y:deviceY}});
					}else{
						that.fireDonutEvent('move',{slice : slice, x:deviceX,y:deviceY, device :{x:deviceX,y:deviceY}});
					}
				}
				else if(action === 'press'){
					that.fireDonutEvent('press',{slice : slice, x:deviceX,y:deviceY, device :{x:deviceX,y:deviceY}});
				}
				else if(action === 'release' ){
					that.fireDonutEvent('release',{slice : slice, x:deviceX,y:deviceY, device :{x:deviceX,y:deviceY}});
				}
				else{
					
				}
			};
			var fire2 = function(slice){
				if(action === 'move' && slice.lockRollover){
					slice.lockRollover = false;
					that.fireDonutEvent('exit',{slice : slice, x:deviceX,y:deviceY, device :{x:deviceX,y:deviceY}});
					return true;	
				}else{
					
				}
			};
			
			for (var i = 0; i < this.donuts.length; i++) {
				var donut = this.donuts[i];
				for (var s = 0; s < donut.slices.length; s++) {
					var slice = donut.slices[s];
					var distance = Math.sqrt((slice.sc.y - deviceY)*(slice.sc.y - deviceY) + (slice.sc.x - deviceX)*(slice.sc.x - deviceX));
					var theta =0;
					if(distance <= donut.outerRadius && distance >= donut.innerRadius){
						
						if(deviceX>slice.sc.x && deviceY<slice.sc.y){
							theta = Math.atan((slice.sc.y-deviceY)/(deviceX-slice.sc.x));
						}
						else if(deviceX>slice.sc.x && deviceY>=slice.sc.y){
							theta = Math.atan((slice.sc.y-deviceY)/(deviceX-slice.sc.x)) + 2*Math.PI;
						}
						else if(deviceX<slice.sc.x){
							theta = Math.atan((slice.sc.y-deviceY)/(deviceX-slice.sc.x)) + Math.PI;
						}
						else if(deviceX === slice.sc.x &&  deviceY<slice.sc.y){
							theta=Math.PI/2;
						}
						else if(deviceX === slice.sc.x &&  deviceY>slice.sc.y){
							theta=3*Math.PI/2;
						}
						var td = JenScript.Math.toDegrees(theta);
						if(td > slice.startAngleDegree && td<(slice.startAngleDegree+slice.extendsDegree)){
							//evt.stopPropagation();
							fire1(slice);
						}
						else if(td < slice.startAngle && (slice.startAngleDegree+slice.extendsDegree) > 360 && ((slice.startAngleDegree+slice.extendsDegree)-360) >= td){
							//evt.stopPropagation();
							fire1(slice);
						}else{
							fire2(slice);
						}
					}else{ //radius is out of range
						fire2(slice);
					}
				}
			}
			return false;
		},
		
		onPress : function(evt,part,x,y){
			return this.dispatchDonutAction(evt,'press',x,y);
		},

		onRelease : function(evt,part,x,y){
			return this.dispatchDonutAction(evt,'release',x,y);
		},

		onMove : function(evt,part,x,y){
			return this.dispatchDonutAction(evt,'move',x,y);
		},

		onClick : function(evt,part,x,y){
			return this.dispatchDonutAction(evt,'click',x,y);
		},

		onEnter : function(evt,part,x,y){
			return this.dispatchDonutAction(evt,'enter',x,y);
		},
		
		onExit : function(evt,part,x,y){
			return this.dispatchDonutAction(evt,'exit',x,y);
		},
		
		
		/**
		 * on projection register add 'bound changed' projection listener that invoke repaint plugin
		 * when projection bound changed event occurs.
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'donut2D projection bound changed');
		},
		
		/**
		 * convenience method that repaint donut by repainting whole plugin
		 */
		repaintDonuts : function(){
			 this.repaintPlugin();
		},
		
		/**
		 * paint donut 2D plugin
		 * @param {Object} g2d the graphics context
		 * @param {Object} the part being paint
		 */
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			for (var i = 0; i < this.donuts.length; i++) {
				var donut = this.donuts[i];
				if(donut.isSolvable()){
					donut.solveDonut2D();
					
					g2d.deleteGraphicsElement(donut.Id);
					donut.svg.donutRoot = new JenScript.SVGGroup().Id(donut.Id).toSVG();
					g2d.insertSVG(donut.svg.donutRoot);
					//global donut
					if(donut.fill !== undefined){
						donut.fill.fillDonut2D(g2d,donut);
					}
					if(donut.stroke !== undefined){
						donut.stroke.strokeDonut2D(g2d,donut);
					}
					for (var i = 0; i < donut.effects.length; i++) {
						var effect = donut.effects[i];
						effect.effectDonut2D(g2d,donut);
					}
					
					//slice
					for (var i = 0; i < donut.slices.length; i++) {
						var s = donut.slices[i];
						
						if(s.fill !== undefined){
							s.fill.fillDonut2DSlice(g2d,s);
						}
						
						if(s.stroke !== undefined){
							s.stroke.strokeDonut2DSlice(g2d,s);
						}
					}
					
					//effects
					
					for (var j = 0; j < donut.slices.length; j++) {
						var slice = donut.slices[j];
						var label = slice.getSliceLabel();
						if(label !== undefined)
						label.paintDonut2DSliceLabel(g2d,slice);
					}
				}
			}
		}
	});
})();
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
		    this.centerX = (config.x !== undefined)?config.x : 0;
		    /** donut2D center y */
		    this.centerY = (config.y !== undefined)?config.y : 0;
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
		 * repaint donut
		 */
		repaint : function(){
			if(this.plugin !== undefined)
			this.plugin.repaintPlugin();
		},
		
		/**
		 * set start angle degree
		 * @param {Number} start angle degrees
		 */
		setStartAngleDegree : function(startAngleDegree){
			this.startAngleDegree=startAngleDegree;
			this.repaint();
		},
		
		/**
		 * get inner radius
		 * @returns {Number} inner radius
		 */
		getInnerRadius : function(){
			return this.innerRadius;
		},
		
		/**
		 * set inner radius
		 * @param {Number} inner radius
		 */
		setInnerRadius : function(innerRadius){
			this.innerRadius=innerRadius;
			this.repaint();
		},
		
		/**
		 * get outer radius
		 * @returns {Number} outer radius
		 */
		getOuterRadius : function(){
			return this.outerRadius;
		},
		
		/**
		 * set outer radius
		 * @param {Number} outer radius
		 */
		setOuterRadius : function(outerRadius){
			this.outerRadius=outerRadius;
			this.repaint();
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
			this.repaint();
		},
		
		/**
		 * set Donut2D fill
		 * @param {Object} fill to set
		 */
		setFill : function(fill){
			this.fill  = fill;
			this.repaint();
		},
		
		/**
		 * add Donut2D effect
		 * @param {Object} effect to add
		 */
		addEffect : function(effect){
			this.effects[this.effects.length]  = effect;
			this.repaint();
		},
		
		/**
	     * add slice object in this donut and return donut
	     * @param {Object} slice to add
	     *           
	     */
	    addSlice : function(slice) {
	        slice.donut = this;
	        this.slices[this.slices.length]=slice;
	        this.repaint();
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
	    
	    /**
		 * shift pie
		 */
		shift : function(){
			var that = this;
			for (var i = 0; i < 10; i++) {
				shiftAngle(i);
			}
			function shiftAngle(i){
				setTimeout(function(){
					that.startAngleDegree=that.startAngleDegree+36;
					that.repaint();
				},i*100);
			}
		},
	});
	
})();
(function(){

	/**
	 * Object Donut2DSlice()
	 * Defines Donut2D Slice
	 * @param {Object} config
	 * @param {Object} [config.name] donut slice name
	 * @param {Object} [config.value] value that will be ratio normalize
	 * @param {Object} [config.themeColor] slice theme color, randomized if undefined
	 * @param {Object} [config.divergence] slice divergence in pixel
	 * 
	 */
	JenScript.Donut2DSlice = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.Donut2DSlice,{
		
		/**
		 * Initialize Donut2D Slice
		 * @param {Object} config
		 * @param {Object} [config.name] donut slice name
		 * @param {Object} [config.value] value that will be ratio normalize
		 * @param {Object} [config.themeColor] slice theme color, randomized if undefined
		 * @param {Object} [config.divergence] slice divergence in pixel
		 * 
		 */
		init:function(config){
			config = config || {};
			/** slice name */
		    this.name = (config.name !== undefined)?config.name : 'Donut2DSlice name undefined';
		    /** slice value */
		    this.value = (config.value !== undefined)?config.value : 1 ;
		    /** slice theme color */
		    this.themeColor=(config.themeColor !== undefined)?config.themeColor : JenScript.createColor() ;
		    /** divergence */
		    this.divergence = (config.divergence !== undefined)?config.divergence : 0 ;
		    /**slice fill opacity*/
		    this.fillOpacity=(config.fillOpacity !== undefined)?config.fillOpacity : 1 ;
		    /**slice stroke opacity*/
		    this.strokeOpacity=(config.strokeOpacity !== undefined)?config.strokeOpacity : 1 ;
		    /** slice normalized value */
		    this.ratio;
		    /** start angle degree */
		    this.startAngleDegree;
		    /** end angle degree */
		    this.endAngleDegree;
		    /** slice path */
		    this.face;
		    /** slice outer arc */
		    this.outerArc;
		    /** slice inner arc */
		    this.innerArc;
		    /** lock roll over */
		    this.lockRollover = false;
		    /** slice draw */
		    this.stroke;
		    /** slice fill */
		    this.fill;
		    /** slice label */
		    this.sliceLabel;
		    /** host donut2D of this slice */
		    this.donut;
		    
		    if(this.value <= 0 )
		    	throw new Error('Slice value should be greater than 0');
		   
		},
		
		repaint : function(){
			if(this.donut !== undefined)
			this.donut.repaint();
		},
		

		/**
		 * set slice theme color
		 * @param {String} slice theme color
		 */
		setThemeColor : function(color){
			this.color=color;
			this.repaint();
		},
		
		/**
		 * get slice theme color
		 * @return {String} slice theme color
		 */
		getThemeColor : function(){
			return this.themeColor;
		},
		/**
		 * set slice divergence
		 * @param {Number} slice divergence
		 */
		setDivergence : function(divergence){
			this.divergence=divergence;
			this.repaint();
		},
		
		/**
		 * get slice divergence
		 * @return {Number} slice divergence
		 */
		getDivergence : function(){
			return this.divergence;
		},
		
		/**
		 * set slice fill opacity
		 * @param {Number} slice opacity
		 */
		setFillOpacity : function(opacity){
			this.fillOpacity=opacity;
			this.repaint();
		},
		
		/**
		 * get slice fill opacity
		 * @return {Number} slice opacity
		 */
		getFillOpacity : function(){
			return this.fillOpacity;
		},
		
		/**
		 * set slice stroke opacity
		 * @param {Number} slice opacity
		 */
		setStrokeOpacity : function(opacity){
			this.strokeOpacity=opacity;
			this.repaint();
		},
		
		/**
		 * get slice stroke opacity
		 * @return {Number} slice stroke opacity
		 */
		getStrokeOpacity : function(){
			return this.strokeOpacity;
		},
		
		setSliceLabel : function(sliceLabel) {
			if(sliceLabel !== undefined)
				sliceLabel.slice = this;
			this.sliceLabel = sliceLabel;
			this.repaint();
		},

		getSliceLabel : function() {
			return this.sliceLabel;
		},
		
		
		/**
		 * get ratio of this slice
		 * @returns {Number} the slice ratio
		 */
		getRatio : function(){
			return this.ratio;
		},
		
		/**
		 * set donut slice stroke
		 * @param {Object} stroke
		 */
		setStroke : function(stroke){
			this.stroke = stroke;
			this.repaint();
		},
		
		/**
		 * set donut slice fill
		 * @param {Object} fill
		 */
		setFill : function(fill){
			this.fill = fill;
			this.repaint();
		},
		
		/**
		 * set donut slice stroke
		 * @returns {Object} stroke
		 */
		getStroke : function(){
			return this.stroke;
		},
		
		/**
		 * set donut slice fill
		 * @returns {Object} fill
		 */
		getFill : function(){
			return this.fill;
		},
	});
})();
(function(){
	/**
	 * Object AbstractDonut2DFill()
	 * Defines Donut2D Abstract Fill
	 * @param {Object} config
	 * @param {String} [config.name] fill name
	 */
	JenScript.AbstractDonut2DFill = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractDonut2DFill,{
		/**
		 * Initialize Donut2D Abstract Fill
		 * @param {Object} config
		 * @param {String} [config.name] fill name
		 */
		init : function(config){
			config = config || {};
			this.name = config.name;
		},
		/**
	     * Abstract fill donut 2D, provide paint by override
	     * @param {Object} g2d  graphics context
	     * @param {Object} donut2D
	     */
	    fillDonut2D : function(g2d,donut2D){
	    	throw new Error("AbstractDonut2DFill fillDonut2D method should be provide by override.");
	    }
	});
	
	/**
	 * Object Donut2DDefaultFill()
	 * Defines Donut2D Default Fill
	 * @param {Object} config
	 * @param {String} [config.fillColor] fill color for whole donut if provide
	 */
	JenScript.Donut2DDefaultFill = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DDefaultFill,JenScript.AbstractDonut2DFill);
	JenScript.Model.addMethods(JenScript.Donut2DDefaultFill,{
		/**
		 * Initialize Donut2D Default Fill
		 * @param {Object} config
		 * @param {String} [config.fillColor] fill color for whole donut if provide
		 */
		_init : function(config){
			config = config || {};
			/** fill color */
			this.fillColor = config.fillColor;
			config.name='JenScript.Donut2DDefaultFill';
			JenScript.AbstractDonut2DFill.call(this,config);
		},
		
		/**
	     * default fill donut 2D
	     * @param {Object} g2d  graphics context
	     * @param {Object} donut2D
	     */
		fillDonut2D : function(g2d,donut2D){
	    	for (var i = 0; i < donut2D.slices.length; i++) {
		        var s = donut2D.slices[i];
		        
		        var color = (this.fillColor !== undefined)?this.fillColor : s.themeColor;
		        var svg = new JenScript.SVGElement().name('path')
								.attr('d',s.face).attr('stroke','none').attr('fill',color).attr('fill-opacity',s.fillOpacity);
	
		        donut2D.svg.donutRoot.appendChild(svg.buildHTML());
	        }
	    }
	});
	
	/**
	 * Object Donut2DRadialFill()
	 * Defines Donut2D Radial Fill
	 * @param {Object} config
	 * @param {String} [config.fillColor] fill color for whole donut if provide, else slice color is use for radial fill
	 */
	JenScript.Donut2DRadialFill = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DRadialFill,JenScript.AbstractDonut2DFill);
	JenScript.Model.addMethods(JenScript.Donut2DRadialFill,{
		/**
		 * Initialize Donut2D Radial Fill
		 * @param {Object} config
		 * @param {String} [config.fillColor] fill color for whole donut if provide, else slice color is use for radial fill
		 */
		_init : function(config){
			config = config || {};
			/** fill color */
			this.fillColor = config.fillColor;
			config.name='JenScript.Donut2DRadialFill';
			JenScript.AbstractDonut2DFill.call(this,config);
		},
		
		/**
	     * Radial fill donut 2D
	     * @param {Object} g2d  graphics context
	     * @param {Object} donut2D
	     */
		fillDonut2D : function(g2d,donut2D){
			
			var or = donut2D.outerRadius;
	        var ir = donut2D.innerRadius;
	        var mr = ir + (or - ir) / 2;
	        var mrf = (mr / or)*100+'%';
	        var irf = (ir / or)*100+'%';
	        var percents = [ irf,  mrf, '100%' ];
	        
	    	for (var i = 0; i < donut2D.slices.length; i++) {
		        var s = donut2D.slices[i];
		        
		        var c = (this.fillColor !== undefined) ? new JenScript.Color(this.fillColor).toHexString():new JenScript.Color(s.themeColor).toHexString();
		        var darken = JenScript.Color.darken(c).toHexString();
		        var colors = [darken,c,darken];
		       
		        var gradientId = "gradient"+JenScript.sequenceId++;
				var gradient= new JenScript.SVGRadialGradient().Id(gradientId).center(s.sc.x,s.sc.y).focus(s.sc.x,s.sc.y).radius(donut2D.outerRadius).shade(percents,colors).toSVG();
				g2d.definesSVG(gradient);
		        
				var svg = new JenScript.SVGElement().name('path')
								.attr('d',s.face).attr('stroke','none')
								.attr('fill','url(#'+gradientId+')')
								.attr('fill-opacity',s.fillOpacity);
	
				donut2D.svg.donutRoot.appendChild(svg.buildHTML());
	        }
	    }
	});
	
	
	
	
	/**
	 * Object AbstractDonut2DSliceFill()
	 * Defines Abstract Donut2D Slice Fill
	 * @param {Object} config
	 * @param {Object} [config.name] donut slice fill name
	 */
	JenScript.AbstractDonut2DSliceFill = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractDonut2DSliceFill,{
		/**
		 * Initialize Abstract Donut2D Slice Fill
		 * @param {Object} config
		 * @param {Object} [config.name] donut slice fill name
		 */
		init : function(config){
			config = config || {};
			this.name = config.name;
		},
		/**
	     * fill donut 2D slice
	     * @param {Object} g2d
	     * @param {Object} slice
	     */
	    fillDonut2DSlice : function(g2d,slice){
	    	throw new Error('JenScript.AbstractDonut2DSliceFill fillDonut2DSlice method should be provide by override');
	    }
	});
	
	
	/**
	 * Object Donut2DSliceDefaultFill()
	 * Defines Donut2D Slice Default Fill
	 * @param {Object} config
	 * @param {Object} [config.fillColor] donut slice fill color, else slice theme color is used
	 */
	JenScript.Donut2DSliceDefaultFill = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DSliceDefaultFill,JenScript.AbstractDonut2DSliceFill);
	JenScript.Model.addMethods(JenScript.Donut2DSliceDefaultFill,{
		/**
		 * Initialize Donut2D Slice Default Fill
		 * @param {Object} config
		 * @param {Object} [config.fillColor] donut slice fill color, else slice theme color is used
		 */
		_init : function(config){
			config = config || {};
			/** fill color */
			this.fillColor = config.fillColor;
			config.name ='JenScript.Donut2DSliceDefaultFill';
			JenScript.AbstractDonut2DSliceFill.call(this,config);
		},
		
		/**
	     * Default fill donut 2D slice
	     * @param {Object} g2d
	     * @param {Object} slice
	     */
		fillDonut2DSlice : function(g2d,slice){
	        var color = (this.fillColor !== undefined)?this.fillColor : slice.themeColor;
	        var svg = new JenScript.SVGElement().name('path')
							.attr('d',slice.face).attr('stroke','none').attr('fill',color).attr('fill-opacity',slice.fillOpacity);

	        slice.donut.svg.donutRoot.appendChild(svg.buildHTML());
	    }
	});
	
	/**
	 * Object Donut2DSliceRadialFill()
	 * Defines Donut2D Slice Radial Fill
	 * @param {Object} config
	 * @param {Object} [config.fillColor] donut slice fill color, else slice theme color is used
	 */
	JenScript.Donut2DSliceRadialFill = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DSliceRadialFill,JenScript.AbstractDonut2DFill);
	JenScript.Model.addMethods(JenScript.Donut2DSliceRadialFill,{
		/**
		 * Initialize Donut2D Slice Radial Fill
		 * @param {Object} config
		 * @param {Object} [config.fillColor] donut slice fill color, else slice theme color is used
		 */
		_init : function(config){
			config = config || {};
			/** fill color */
			this.fillColor = config.fillColor;
			config.name ='JenScript.Donut2DSliceRadialFill';
			JenScript.AbstractDonut2DSliceFill.call(this,config);
		},
		
		/**
	     * Default fill donut 2D slice
	     * @param {Object} g2d
	     * @param {Object} slice
	     */
		fillDonut2DSlice : function(g2d,slice){
			var or = slice.donut.outerRadius;
	        var ir = slice.donut.innerRadius;
	        var mr = ir + (or - ir) / 2;
	        var mrf = (mr / or)*100+'%';
	        var irf = (ir / or)*100+'%';
	        var percents = [ irf,  mrf, '100%' ];
	        var c = (this.fillColor !== undefined) ? new JenScript.Color(this.fillColor).toHexString():new JenScript.Color(slice.themeColor).toHexString();
	        var darken = JenScript.Color.darken(c).toHexString();
	        var colors = [darken,c,darken];
	        var gradientId = "gradient"+JenScript.sequenceId++;
			var gradient= new JenScript.SVGRadialGradient().Id(gradientId).center(slice.sc.x,slice.sc.y).focus(slice.sc.x,slice.sc.y).radius(slice.donut.outerRadius).shade(percents,colors).toSVG();
			g2d.definesSVG(gradient);
			var svg = new JenScript.SVGElement().name('path')
							.attr('d',slice.face).attr('stroke','none').attr('fill','url(#'+gradientId+')');

			slice.donut.svg.donutRoot.appendChild(svg.buildHTML());
	    }
	});
})();
(function(){
	
	/**
	 * Object AbstractDonut2Stroke()
	 * Defines Donut2D Abstract Draw
	 * @param {Object} config
	 * @param {String} [config.name] draw name
	 */
	JenScript.AbstractDonut2Stroke = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractDonut2Stroke,{
		/**
		 * Initialize Donut2D Abstract Draw
		 * @param {Object} config
		 * @param {String} [config.name] draw name
		 */
		init : function(config){
			config = config || {};
			this.name = config.name;
		},
		/**
	     * Abstract stroke donut 2D, override this method to provide stroke
	     * @param {Object} g2d graphics context
	     * @param {Object} donut2D
	     */
	    strokeDonut2D : function(g2d,donut2D){
	    	throw new Error('AbstractDonut2Stroke, strokeDonut2D method should be provide by override');
	    }
	});
	
	/**
	 * Object Donut2DDefaultDraw()
	 * Defines Donut2D Default Draw
	 * @param {Object} config
	 * @param {Object} [config.strokeColor] color for stroking whole donut, else slice theme color is use for each slice
	 * @param {Object} [config.strokeWidth] stroke width
	 */
	JenScript.Donut2DDefaultStroke = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DDefaultStroke,JenScript.AbstractDonut2Stroke);
	JenScript.Model.addMethods(JenScript.Donut2DDefaultStroke,{
		/**
		 * Initialize Donut2D Default Draw
		 * @param {Object} config
		 * @param {Object} [config.strokeColor] color for stroking whole donut, else slice theme color is use for each slice
		 * @param {Object} [config.strokeWidth] stroke width
		 */
		_init : function(config){
			config = config || {};
			/** draw color */
			this.strokeColor = config.strokeColor;
			/** stroke color */
			this.strokeWidth = config.strokeWidth;
			config.name = 'JenScript.Donut2DDefaultDraw';
			JenScript.AbstractDonut2Stroke.call(this,config);
		},
		
		/**
	     * fill donut 2D
	     * @param {Object} g2d graphics context
	     * @param {Object} donut2D
	     */
		strokeDonut2D : function(g2d,donut2D){
	    	for (var i = 0; i < donut2D.slices.length; i++) {
		        var s = donut2D.slices[i];
		        
		        var color = (this.strokeColor !== undefined)?this.strokeColor : s.themeColor;
		        var svg = new JenScript.SVGElement().name('path')
								.attr('d',s.face).attr('stroke',color).attr('stroke-opacity',s.strokeOpacity).attr('fill','none');
	
		        donut2D.svg.donutRoot.appendChild(svg.buildHTML());
	        }
	    }
	});
	
	
	
	
	/**
	 * Object AbstractDonut2DSliceStroke()
	 * Defines Donut2D Slice Stroke
	 * @param {Object} config
	 * @param {Object} [config.name] donut slice stroke name
	 */
	JenScript.AbstractDonut2DSliceStroke = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractDonut2DSliceStroke,{
		/**
		 * Initialize Donut2D Slice Stroke
		 * @param {Object} config
		 * @param {Object} [config.name] donut slice stroke name
		 */
		init : function(config){
			config = config || {};
			this.name = config.name;
		},
		/**
	     * Abstract donut 2D slice stroke
	     * @param {Object} g2d
	     * @param {Object} slice
	     */
	    strokeDonut2DSlice : function(g2d,slice){
	    	throw new Error('JenScript.AbstractDonut2DSliceStroke strokeDonut2DSlice method should be provide by override.');
	    }
	});
	
	/**
	 * Object Donut2DSliceDefaultStroke()
	 * Defines Donut2D Slice Default Stroke
	 * @param {Object} config
	 * @param {Object} [config.strokeColor] color for stroking donut slice, else slice theme color is use.
	 * @param {Object} [config.strokeWidth] stroke width
	 */
	JenScript.Donut2DSliceDefaultStroke = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DSliceDefaultStroke,JenScript.AbstractDonut2DSliceStroke);
	JenScript.Model.addMethods(JenScript.Donut2DSliceDefaultStroke,{
		/**
		 * Initialize Donut2D Slice Default Stroke
		 * @param {Object} config
		 * @param {Object} [config.strokeColor] color for stroking donut slice, else slice theme color is use.
		 * @param {Object} [config.strokeWidth] stroke width
		 */
		_init : function(config){
			config = config || {};
			/** draw color */
			this.strokeColor = config.strokeColor;
			/** stroke color */
			this.strokeWidth = config.strokeWidth;
			config.name='JenScript.Donut2DSliceDefaultStroke';
			JenScript.AbstractDonut2DSliceStroke.call(this,config);
		},
		
		/**
	     * Default donut 2D slice stroke
	     * @param {Object} g2d
	     * @param {Object} slice
	     */
		strokeDonut2DSlice : function(g2d,slice){
	        var color = (this.strokeColor !== undefined)?this.strokeColor : slice.themeColor;
	        var svg = new JenScript.SVGElement().name('path')
							.attr('d',slice.face).attr('stroke',color).attr('fill','none');

	        slice.donut.svg.donutRoot.appendChild(svg.buildHTML());
	    }
	});
})();
(function(){

	/**
	 * Object AbstractDonut2DEffect()
	 * Defines Abstract Donut2D Effect
	 * @param {Object} config
	 * @param {Object} [config.name] donut effect name
	 */
	JenScript.AbstractDonut2DEffect = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractDonut2DEffect,{
		/**
		 * Initialize Abstract Donut2D Effect
		 * @param {Object} config
		 * @param {Object} [config.name] donut effect name
		 */
		init : function(config){
			config = config || {};
			this.name = config.name;
		},
		/**
	     * effect donut 2D
	     * @param {Object} g2d
	     * @param {Object} donut2D
	     */
	    effectDonut2D : function(g2d,donut2D){}
	});
	
	/**
	 * Object Donut2DLinearEffect()
	 * Defines Linear Donut2D Effect
	 * @param {Object} config
	 * @param {Object} [config.offsetRadius] effect offsetRadius, default 3 pixel
	 * @param {Object} [config.incidenceAngleDegree] effect incidence angle degree, default 120
	 * @param {Object} [config.shader] effect shader
	 * @param {Object} [config.shader.percents] effect shader percents array
	 * @param {Object} [config.shader.colors] effect shader colors array
	 */
	JenScript.Donut2DLinearEffect = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DLinearEffect,JenScript.AbstractDonut2DEffect);
	JenScript.Model.addMethods(JenScript.Donut2DLinearEffect,{
		/**
		 * Initialize Linear Donut2D Effect
		 * @param {Object} config
		 * @param {Object} [config.offsetRadius] effect offsetRadius, default 3 pixel
		 * @param {Object} [config.incidenceAngleDegree] effect incidence angle degree, default 120
		 * @param {Object} [config.shader] effect shader
		 * @param {Object} [config.shader.percents] effect shader percents array
		 * @param {Object} [config.shader.colors] effect shader colors array
		 */
		_init : function(config){
			config = config || {};
		    /** offset radius */
		    this.offsetRadius = (config.offsetRadius !== undefined)?config.offsetRadius : 3;
		    /** gradient incidence angle degree */
		    this.incidence = (config.incidence !== undefined)?config.incidence : 120;
		    /** default shader fractions */
		    this.defaultShader = {percents : [ '0%', '49%', '51%', '100%' ],opacity:[0.6,0,0,0.6], colors : ['rgb(60, 60, 60)', 'rgb(255,255,255)','rgb(255,255,255)','rgb(255, 255, 255)']};
		    /** shader */
		    this.shader = (config.shader !== undefined)?config.shader : this.defaultShader;

		    /**effect name*/
		    config.name = 'JenScript.Donut2DLinearEffect';
		    this.fillOpacity = (config.fillOpacity !== undefined)?config.fillOpacity : 1;
		    this.gradientsIds = [];
		    JenScript.AbstractDonut2DEffect.call(this,config);        
		},
		
		/**
		 * paint effect on the given donut
		 * @param {Object} graphics context
		 * @param {Object} donut 
		 */
		effectDonut2D : function(g2d,donut2D) {
			for (var i = 0; i < this.gradientsIds.length; i++) {
				g2d.deleteGraphicsElement(this.gradientsIds[i]);
			}
			this.gradientsIds = [];
			for (var i = 0; i < donut2D.slices.length; i++) {
				var slice = donut2D.slices[i];
		        var outerRadius = donut2D.outerRadius - this.offsetRadius;
		        var innerRadius = donut2D.innerRadius + this.offsetRadius;
		        var startAngleDegree = slice.startAngleDegree;
		        var extendsDegree = slice.extendsDegree;
		        var largeArcFlag = (extendsDegree > 180) ? '1' : '0';
		        var polar = function(r,a){
		        	return {
			        	x : slice.sc.x + r* Math.cos(JenScript.Math.toRadians(a)),
						y : slice.sc.y - r* Math.sin(JenScript.Math.toRadians(a))
			        };
		        };
		        var sliceOuterBegin = polar(outerRadius,startAngleDegree);
		        var sliceOuterEnd   = polar(outerRadius,startAngleDegree+extendsDegree);
		        var sliceInnerBegin = polar(innerRadius,startAngleDegree);
		        var sliceInnerEnd   = polar(innerRadius,startAngleDegree+extendsDegree);
		        var effectFace = "M" + sliceOuterBegin.x + "," + sliceOuterBegin.y + " A" + outerRadius + ","
								+ outerRadius + " 0 " + largeArcFlag + ",0 " + sliceOuterEnd.x + ","
								+ sliceOuterEnd.y+' L '+sliceInnerEnd.x+','+sliceInnerEnd.y+ " A" + innerRadius + ","
								+ innerRadius + " 0 " + largeArcFlag + ",1 " + sliceInnerBegin.x + ","
								+ sliceInnerBegin.y+' Z';                       

		        var start = polar(outerRadius,this.incidence);
		        var end   = polar(outerRadius,this.incidence+180);
		        if (this.shader === undefined) {
		           this.shader = this.defaultShader;
		        }
		      
		        var gradientId = 'gradient'+JenScript.sequenceId++;
		        this.gradientsIds[this.gradientsIds.length] = gradientId;
				var gradient   = new JenScript.SVGLinearGradient().Id(gradientId).from(start.x,start.y).to(end.x, end.y).shade(this.shader.percents,this.shader.colors,this.shader.opacity).toSVG();
				g2d.definesSVG(gradient);
				var svg = new JenScript.SVGElement().name('path').attr('d',effectFace).attr('stroke','none').attr('fill-opacity',slice.fillOpacity).attr('fill','url(#'+gradientId+')');
				donut2D.svg.donutRoot.appendChild(svg.buildHTML());
			}
	    }
	});
	
	/**
	 * Object Donut2DReflectionEffect()
	 * Defines Donut2D Reflection Effect
	 * @param {Object} config
	 * @param {Object} [config.deviation]
	 * @param {Object} [config.length]
	 * @param {Object} [config.opacity]
	 * @param {Object} [config.verticalOffset]
	 */
	JenScript.Donut2DReflectionEffect = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DReflectionEffect, JenScript.AbstractDonut2DEffect);
	JenScript.Model.addMethods(JenScript.Donut2DReflectionEffect,{
		
		/**
		 * Initialize Donut2D Reflection Effect
		 * @param {Object} config
		 * @param {Object} [config.deviation] blur deviation, default 3 pixels
		 * @param {Object} [config.opacity] effect opacity, default 0.3
		 * @param {Object} [config.verticalOffset] effect vertical offset, default 5 pixels
		 * @param {Object} [config.length] effect length [0,1], 1 reflect whole donut, 0.5 half of the donut, etc
		 */
		_init: function(config){
			config = config || {};
			this.deviation = (config.deviation !== undefined)?config.deviation : 3;
			this.opacity = (config.opacity !== undefined)?config.opacity : 0.3;
			this.length = (config.length !== undefined)?config.length : 0.5;
			this.verticalOffset = (config.verticalOffset !== undefined)?config.verticalOffset : 0;
			config.name = "JenScript.Donut2DReflectionEffect";
			JenScript.AbstractDonut2DEffect.call(this,config);
		},
		
		/**
		 * Paint donut reflection effect
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut 
		 */
		effectDonut2D : function(g2d, donut) {
			var bbox = donut.svg.donutRoot.getBBox();
			
			 //clip
			var clipId = 'clip'+JenScript.sequenceId++;
			var rectClip = new JenScript.SVGRect().origin(bbox.x,bbox.y+bbox.height).size(bbox.width,bbox.height*this.length);
			var clip = new JenScript.SVGClipPath().Id(clipId).appendPath(rectClip);
			g2d.definesSVG(clip.toSVG());
				
			
			//filter
			var filterId = 'filter'+JenScript.sequenceId++;
			var filter = new JenScript.SVGFilter().Id(filterId).from(bbox.x,bbox.y).size(bbox.width,bbox.height).toSVG();
			var gaussianFilter = new JenScript.SVGElement().name('feGaussianBlur')
															.attr('in','SourceGraphic')
															.attr('stdDeviation',this.deviation);
															
			filter.appendChild(gaussianFilter.buildHTML());
			g2d.definesSVG(filter);
		
			var e = donut.svg.donutRoot.cloneNode(true);
			e.removeAttribute('id');
			e.setAttribute('filter','url(#'+filterId+')');
			e.setAttribute('transform','translate(0,'+bbox.height+'), scale(1,-1), translate(0,'+(-2*(bbox.y+bbox.height/2)-this.verticalOffset)+')'  );
			e.setAttribute('opacity',this.opacity);
			
			var ng = new JenScript.SVGElement().name('g').buildHTML();
			e.setAttribute('id',e.getAttribute('id')+'_reflection'+JenScript.sequenceId++);
			ng.setAttribute('clip-path','url(#'+clipId+')');
			ng.appendChild(e);
			g2d.insertSVG(ng);	
		}
	});
})();
(function(){
	
	
	/**
	 * Object Donut2DAbstractLabel()
	 * Defines Donut2D Abstract Label
	 * @param {Object} config
	 * @param {String} [config.name] the label type name
	 * @param {String} [config.text] the label text
	 * @param {String} [config.textColor] the label text color
	 * @param {Number} [config.fontSize] the label text font size
	 * @param {String} [config.textAnchor] the label text anchor
	 * @param {Object} [config.shader] the label fill shader
	 * @param {Object} [config.shader.percents] the label fill shader percents
	 * @param {Object} [config.shader.colors] the label fill shader colors
	 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the label outline color
	 * @param {String} [config.cornerRadius] the label outline corner radius
	 * @param {String} [config.fillColor] the label fill color
	 */
	JenScript.Donut2DAbstractLabel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DAbstractLabel,JenScript.AbstractLabel);
	JenScript.Model.addMethods(JenScript.Donut2DAbstractLabel,{
		
		/**
		 * Initialize Abstract Donut2D Label
		 * @param {Object} config
		 * @param {String} [config.name] the label type name
		 * @param {String} [config.text] the label text
		 * @param {String} [config.textColor] the label text color
		 * @param {Number} [config.fontSize] the label text font size
		 * @param {String} [config.textAnchor] the label text anchor
		 * @param {Object} [config.shader] the label fill shader
		 * @param {Object} [config.shader.percents] the label fill shader percents
		 * @param {Object} [config.shader.colors] the label fill shader colors
		 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the label outline color
		 * @param {String} [config.cornerRadius] the label outline corner radius
		 * @param {String} [config.fillColor] the label fill color
		 */
		_init : function(config){
			JenScript.AbstractLabel.call(this,config);
		},
		
		/**
		 * Abstract label paint for Donut2D 
		 */
		paintDonut2DSliceLabel : function(g2d,slice){
			throw new Error('paintDonut2DSliceLabel method should be provide by override');
		}
		
	});
	
	/**
	 * Object Donut2DBorderLabel()
	 * Defines Donut Border Label, a label which is paint on the donut border left or right side 
	 * @param {Object} config
	 * @param {String} [config.name] the label type name
	 * @param {String} [config.text] the label text
	 * @param {String} [config.textColor] the label text color
	 * @param {Number} [config.fontSize] the label text font size
	 * @param {String} [config.textAnchor] the label text anchor
	 * @param {Object} [config.shader] the label fill shader
	 * @param {Object} [config.shader.percents] the label fill shader percents
	 * @param {Object} [config.shader.colors] the label fill shader colors
	 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the label outline color
	 * @param {String} [config.cornerRadius] the label outline corner radius
	 * @param {String} [config.fillColor] the label fill color
	 * @param {Number} [config.margin] the margin distance from donut to draw the label
	 * @param {Number} [config.linkExtends] the quad edge control point for label link
	 */
	JenScript.Donut2DBorderLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DBorderLabel, JenScript.Donut2DAbstractLabel);
	JenScript.Model.addMethods(JenScript.Donut2DBorderLabel, {
		
		/**
		 * Initialize Donut2D Border Label, a label which is paint on the donut border left or right side 
		 * @param {Object} config
		 * @param {String} [config.name] the label type name
		 * @param {String} [config.text] the label text
		 * @param {String} [config.textColor] the label text color
		 * @param {Number} [config.fontSize] the label text font size
		 * @param {String} [config.textAnchor] the label text anchor
		 * @param {Object} [config.shader] the label fill shader
		 * @param {Object} [config.shader.percents] the label fill shader percents
		 * @param {Object} [config.shader.colors] the label fill shader colors
		 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the label outline color
		 * @param {String} [config.cornerRadius] the label outline corner radius
		 * @param {String} [config.fillColor] the label fill color
		 * @param {Number} [config.margin] the margin distance from donut to draw the label
		 * @param {Number} [config.linkExtends] the quad edge control point for label link
		 */
		__init : function(config){
			config = config || {};
			this.margin = (config.margin !== undefined)? config.margin : 50;
			this.linkExtends = (config.linkExtends !== undefined)? config.linkExtends : 30;
			config.name = 'JenScript.Donut2DBorderLabel';
			JenScript.Donut2DAbstractLabel.call(this, config);
		},
		
		/**
		 * set margin for this border label
		 * @param {Object} margin
		 */
		setMargin : function(margin){
			this.margin = margin;
			this.slice.donut.plugin.repaintPlugin();
		},
		
		/**
		 * set links extends for this border label
		 * @param {Object} margin
		 */
		setLinkExtends : function(linkExtends){
			this.linkExtends = linkExtends;
			this.slice.donut.plugin.repaintPlugin();
		},
		
		/**
		 * paint donut2D slice border label
		 * @param {Object} g2d the graphics context
		 * @param {Object} slice
		 */
		paintDonut2DSliceLabel : function(g2d, slice) {
		        var radius = slice.donut.getOuterRadius();
		        var medianDegree = slice.medianDegree;
		     
		        var px1 = slice.donut.buildCenterX + (radius + slice.getDivergence())* Math.cos(JenScript.Math.toRadians(medianDegree));
		        var py1 = slice.donut.buildCenterY - (radius + slice.getDivergence()) * Math.sin(JenScript.Math.toRadians(medianDegree));
		        var px2 = slice.donut.buildCenterX + (radius + this.linkExtends + slice.getDivergence())* Math.cos(JenScript.Math.toRadians(medianDegree));
		        var py2 = slice.donut.buildCenterY- (radius + this.linkExtends + slice.getDivergence()) * Math.sin(JenScript.Math.toRadians(medianDegree));

		        var px3 = 0;
		        var py3 = py2;
		        var px4 = 0;
		        var py4 = py2;
		        var pos = 'middle';
		        if (medianDegree >= 270 && medianDegree <= 360
		                || medianDegree >= 0 && medianDegree <= 90) {
		            px3 = slice.donut.buildCenterX + radius + this.margin  - 5;
		            px4 = slice.donut.buildCenterX + radius + this.margin  + 5;
		            
		            pos='start';
		            if(medianDegree === 270)
		            	pos = 'middle';
		            if(medianDegree === 90)
		            	pos = 'middle';
		        }
		        else {// 90-->270
		            px3 = slice.donut.buildCenterX- radius - this.margin + 5;
		            px4 = slice.donut.buildCenterX- radius - this.margin -5;
		            pos='end';
		        }
		        
		        
		        var quaddata = 'M '+px1+','+py1+' Q '+px2+','+py2+' '+px3+','+py3;
		        var quadlink = new JenScript.SVGElement().name('path')
													.attr('d',quaddata)
													.attr('fill','none')
													.attr('stroke','darkgray')
													.buildHTML();

		        
		        this.setTextAnchor(pos);
		        this.setLocation(new JenScript.Point2D(px4,py4));
		        var ct = (this.textColor !== undefined)? this.textColor : slice.themeColor;
				this.setTextColor(ct);
				
				this.paintLabel(g2d);
				this.svg.label.appendChild(quadlink);
		 }
	});
	
	
	/**
	 * Object Donut2DRadialLabel()
	 * Defines Donut2D Radial Label, a label which is paint on the median radian segment of slice
	 * @param {Object} config
	 * @param {String} [config.name] the label type name
	 * @param {String} [config.text] the label text
	 * @param {String} [config.textColor] the label text color
	 * @param {Number} [config.fontSize] the label text font size
	 * @param {String} [config.textAnchor] the label text anchor
	 * @param {Object} [config.shader] the label fill shader
	 * @param {Object} [config.shader.percents] the label fill shader percents
	 * @param {Object} [config.shader.colors] the label fill shader colors
	 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the label outline color
	 * @param {String} [config.cornerRadius] the label outline corner radius
	 * @param {String} [config.fillColor] the label fill color
	 * @param {Number} [config.offsetRadius] the offset radius define the extends radius from donut radius
	 */
	JenScript.Donut2DRadialLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DRadialLabel, JenScript.Donut2DAbstractLabel);
	JenScript.Model.addMethods(JenScript.Donut2DRadialLabel,{
		
		/**
		 * Initialize Donut2D Radial Label, a label which is paint on the median radian segment of slice
		 * @param {Object} config
		 * @param {String} [config.name] the label type name
		 * @param {String} [config.text] the label text
		 * @param {String} [config.textColor] the label text color
		 * @param {Number} [config.fontSize] the label text font size
		 * @param {String} [config.textAnchor] the label text anchor
		 * @param {Object} [config.shader] the label fill shader
		 * @param {Object} [config.shader.percents] the label fill shader percents
		 * @param {Object} [config.shader.colors] the label fill shader colors
		 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the label outline color
		 * @param {String} [config.cornerRadius] the label outline corner radius
		 * @param {String} [config.fillColor] the label fill color
		 * @param {Number} [config.offsetRadius] the offset radius define the extends radius from donut radius
		 */
		__init : function(config){
			config = config || {};
			this.offsetRadius = (config.offsetRadius !== undefined)?config.offsetRadius : 20;
			config.name = 'JenScript.Donut2DAbstractLabel';
			JenScript.Donut2DAbstractLabel.call(this,config);
		},

		/**
		 * set offset radius for this radial label.
		 * offset radius is the extends distance from radius to draw the radial label
		 * @param {Number} offsetRadius
		 */
		setOffsetRadius : function(offsetRadius) {
			this.offsetRadius = offsetRadius;
			this.slice.donut.plugin.repaintPlugin();
		},
		
		/**
		 * paint slice radial label
		 * @param {Object} g2d the graphics context
		 * @param {Object} slice
		 */
		paintDonut2DSliceLabel : function(g2d, slice) {
			var anchor = {
				x : slice.sc.x + (slice.donut.outerRadius + this.offsetRadius)
						* Math.cos(JenScript.Math.toRadians(slice.medianDegree)),
				y : slice.sc.y - (slice.donut.outerRadius + this.offsetRadius)
						* Math.sin(JenScript.Math.toRadians(slice.medianDegree))
			};
			var pos = "middle";
			var dx = 0;
			if (slice.medianDegree > 0 && slice.medianDegree < 90) {
				pos = "start";
				dx = 10;
			} else if (slice.medianDegree > 90 && slice.medianDegree < 270) {
				pos = "end";
				dx = -10;
			} else if (slice.medianDegree > 270 && slice.medianDegree <= 360) {
				pos = "start";
				dx = 10;
			} else if (slice.medianDegree === 90 || slice.medianDegree === 270) {
				pos = "middle";
			}
			this.setLocation(new JenScript.Point2D(anchor.x,anchor.y));
			this.setTextAnchor(pos);
			var ct = (this.textColor !== undefined)? this.textColor : slice.themeColor;
			this.setTextColor(ct);
			
			this.paintLabel(g2d);
		}
	});
})();
(function(){
	
	//R. Module pattern
	
	JenScript.Donut2DBuilder = function(view,projection,config) {
		view.registerProjection(projection);
		var dp = new JenScript.Donut2DPlugin();
		projection.registerPlugin(dp);
		
		var donut = new JenScript.Donut2D(config);
		dp.addDonut(donut);
		
		var labels = [];
		var slices = [];
		var effects = [];
		var lastSlice;
		
		//improve with index 
		var slice = function(config){
			var s = new JenScript.Donut2DSlice(config);
			lastSlice = s;
			donut.addSlice(s);
			slices.push(s);
			return this;
		}
		var label = function(type,config){
			var l;
			if('radial' === type)
				l = new JenScript.Donut2DRadialLabel(config);
			if('border' === type)
				l = new JenScript.Donut2DBorderLabel(config);
			lastSlice.setSliceLabel(l);
			labels.push(l);
			return this;
		}
		var effect = function(type, config){
			var fx;
			if('linear' === type)
				fx = new JenScript.Donut2DLinearEffect(config);
			if('reflection' === type)
				fx = new JenScript.Donut2DReflectionEffect(config);
			donut.addEffect(fx);
			effects.push(fx);
			return this;
		}
		var linearFx = function(config){
			effect('linear',config);
			return this;
		}
		var reflectFx = function(config){
			effect('reflection',config);
			return this;
		}
		
		
		//Pie Builder Interface
		return {
			slice : slice,
			label : label,
			effect : effect,
			linearFx : linearFx,
			reflectFx : reflectFx,
			
			view : function(){return view;},
			projection : function(){return projection;},
			donut : function(){return donut;},
			labels : function(){return labels;},
			slices : function(){return slice;},
		};
	};
})();

