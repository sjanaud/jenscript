// JenScript -  JavaScript HTML5/SVG Library
// Product of JenSoftAPI - Visualization Java & JS Libraries
// version : 1.1.9
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2015 JenScript, product by JenSoftAPI company, France.
// build: 2016-06-16
// All Rights reserved

(function(){
	/**
	 * Donut 3D Plugin
	 * @param {Object} config
	 */
	JenScript.Donut3DPlugin = function(config) {
		config = config || {};
		config.name = 'Donut3DPlugin';
		this.donuts = [];
		//this.listeners=[];
		JenScript.Plugin.call(this,config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut3DPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.Donut3DPlugin, {
		
		/**
		 * add Donut 3D and repaint plugin
		 * @param {Object} donut
		 */
		addDonut : function(donut) {
			donut.plugin = this;
			this.donuts[this.donuts.length] = donut;
			this.repaintPlugin();
		},
		
		/**
		 * repaint plugin on projection bound changed 
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'donut3D projection bound changed');
		},
		
		repaintDonuts : function(){
			 this.repaintPlugin();
		},
		
		/**
		 * paint donut 3D plugin
		 * @param {Object} g2d the graphics context
		 * @param {Object} the part being paint
		 */
		paintPlugin : function(g2d,part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			for (var i = 0; i < this.donuts.length; i++) {
				var donut = this.donuts[i];
				if(donut.isSolvable()){
					donut.solveDonut3D();
					
					g2d.deleteGraphicsElement(donut.Id);
					donut.svg.donutRoot = new JenScript.SVGGroup().Id(donut.Id).toSVG();
					g2d.insertSVG(donut.svg.donutRoot);
					
					donut.donut3DPaint.paintDonut3D(g2d, donut);
					
					for (var i = 0; i < donut.effects.length; i++) {
						var effect = donut.effects[i];
						effect.effectDonut3D(g2d,donut);
					}
					
					for (var j = 0; j < donut.slices.length; j++) {
						var slice = donut.slices[j];
						var labels = slice.getSliceLabels();
						for (var l = 0; l < labels.length; l++) {
							labels[l].paintDonut3DSliceLabel(g2d,slice);
						}
					}
				}
			}
		}
	});
})();
(function(){
	/**
	 * Donut 3D Object
	 * @param {Object} config
	 * @param {Number} [config.tilt] the donut tilt
	 * @param {Number} [config.thickness] the donut thickness
	 * @param {Number} [config.startAngleDegree] the donut start angle degree
	 * @param {Number} [config.innerRadius] the donut inner radius, absolute in pixel
	 * @param {Number} [config.outerRadius] the donut outer radius, absolute in pixel
	 * @param {Number} [config.centerX] the donut center X
	 * @param {Number} [config.centerY] the donut center Y
	 * @param {Number} [config.nature] 'User' projection 'Device' projection (component)
	 * 
	 */
	JenScript.Donut3D = function(config) {
		this.init(config);
	};
	
	JenScript.Model.addMethods(JenScript.Donut3D, {
		
		 /**
		  * init the donut with given config
		  * @param {Object} config
		  */
		 init:function(config){
			 config = config || {};
			 /**donut instance Id*/
			 this.Id = 'donut3d'+JenScript.sequenceId++;
			
			/** donut 3d name */
			 this.name = (config.name !== undefined)? config.name : 'donut3D'+JenScript.sequenceId++;
			
			 /** inner radius in pixel */
		    this.innerRadius = (config.innerRadius !== undefined)? config.innerRadius : 60;

		    /** outer radius in pixel */
		    this.outerRadius = (config.outerRadius !== undefined)? config.outerRadius : 120;

		    /** donut3D thickness */
		    this.thickness = (config.thickness !== undefined)? config.thickness : 50;

		    /** tilt angle in degree 0 to 90 */
		    this.tilt = (config.tilt !== undefined)? config.tilt : 40;
		    
		    /** start angle degree */
		    this.startAngleDegree = (config.startAngleDegree !== undefined)? config.startAngleDegree : 40;

		    /** center x coordinate in the specified coordinate system nature */
		    this.centerX  = (config.centerX !== undefined)? config.centerX : 0;

		    /** center y coordinate in the specified coordinate system nature */
		    this.centerY = (config.centerY !== undefined)? config.centerY : 0;
		    
		    /** donut 3D nature , User or Device*/
		    this.nature = (config.nature !== undefined)? config.nature : 'User';
		    
		    /** donut3D projection thickness */
		    this.projectionThickness;
		    
		    /** outer A radius */
		    this.outerA;

		    /** outer B radius */
		    this.outerB;

		    /** inner A radius */
		    this.innerA;

		    /** inner B radius */
		    this.innerB;

		    /** donut 3D paint */
		    this.donut3DPaint = new JenScript.Donut3DDefaultPaint();

		    /** host plugin */
		    this.plugin;

		    /** slices of this donut 3D */
		    this.slices = [];
		    
		    this.effects = [];
		    
		    /**svg elements*/
		    this.svg={};
		 },
		 
		 
		 setInnerRadius : function(ir){
			 this.innerRadius = ir;
		 },
		 
		 setOuterRadius : function(or){
			 this.outerRadius = or;
		 },
		 
		 setThickness : function(t){
			 this.thickness = t;
		 },
		 
		 setTilt : function(t){
			 this.tilt = t;
		 },
		 
		 setStartAngleDegree : function(a){
			this.startAngleDegree = a;
		 },
		 
		 setCenterX : function(x){
			this.centerX  = x;
		 },
		 
		 setCenterY : function(y){
			this.centerY = y;
		 },
		 
		 setCenter : function(x,y){
			 this.centerX  = x;
			 this.centerY = y;
		 },
		 
		 setNature : function(n){
			this.nature = n;
		 },
		 
	 	/**
		 * add Donut3D effect
		 * @param {Object} effect to add
		 */
		addEffect : function(effect){
			this.effects[this.effects.length]  = effect;
			this.plugin.repaintPlugin();
		},
		 
		 /**
		  * shift start angle for this donut
		  */
		 shift : function(){
				var that = this;
				for (var i = 0; i < 10; i++) {
					shiftAngle(i);
				}
				function shiftAngle(i){
					setTimeout(function(){
						that.startAngleDegree=that.startAngleDegree+36;
						that.plugin.repaint();
					},i*100);
				}
			},
			
		/**
		  * shift start angle for this donut
		  */
		 shift : function(angle,millis,frame){
			var timeStep = millis/frame;
			var angleStep = angle/frame;
			var that = this;
			for (var i = 0; i < frame; i++) {
				shiftAngle(i);
			}
			function shiftAngle(i){
				setTimeout(function(){
					if(that.startAngleDegree + angleStep > 360)
						that.startAngleDegree = that.startAngleDegree +angleStep - 360;
					else if(that.startAngleDegree + angleStep < 0)
						that.startAngleDegree = that.startAngleDegree +angleStep + 360;
					else
						that.startAngleDegree=that.startAngleDegree+angleStep;
					
					that.plugin.repaintDonuts();
				},i*timeStep);
			}
		},
		 
		 /**
		  * add slice in this donut
		  * @param {Object} slice
		  */
		 addSlice : function (slice) {
	        slice.donut=this;
	        this.slices[this.slices.length] = slice;
	        this.plugin.repaintDonuts();
	        return this;
		 },
		 
	 	/**
	     * create a new slice with given config, append it to this donut and return donut
	     * @param config the slice config
	     */
	    slice : function(config){
			var s = new JenScript.Donut3DSlice(config);
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
	     * get the top face of this donut 3d
	     * @return the top face
	     */
	    getTopFace : function() {
	        var top = '';
	        for (var i = 0; i < this.slices.length; i++) {
				var s = this.slices[i];
				for (var j = 0; j < s.fragments.length; j++) {
					var f = s.fragments[j];
					top=top+f.topFace;
				}
			}
	        return top;
	    },
	    
	    isSolvable : function(){
	    	return this.slices.length > 0;
	    },

	    /**
	     * solve donut 3D geometry
	     */
	    solveDonut3D : function() {
	    	if(this.tilt<0 || this.tilt > 90){
	    		throw new Error("donut 3D tilt out of range[0,90]");
	    	}
	        var that = this;
	        (function() {
	        	if(that.startAngleDegree > 0){
	        		if(that.startAngleDegree >= 360){
	        			while(that.startAngleDegree >=360){that.startAngleDegree = that.startAngleDegree - 360;}
	        		}
	        	}else{
	        		while(that.startAngleDegree >=0){that.startAngleDegree = that.startAngleDegree + 360;}
	        	}
		    })();
	        (function() {
		        var oneDegreeTiltThickness = that.thickness / 90;
		        that.projectionThickness = oneDegreeTiltThickness * (90 - that.tilt);
		    })();
	        (function() {
		        var oneTiltExternalProfil = that.outerRadius / 90;
		        var oneTiltInternalProfil = that.innerRadius / 90;

		        that.outerA = that.outerRadius;
		        that.outerB = oneTiltExternalProfil * that.tilt;

		        that.innerA = that.innerRadius;
		        that.innerB = oneTiltInternalProfil * that.tilt;
		    })();
	        (function() {
	        	        var sum = 0;
	        	        for (var i = 0; i < that.slices.length; i++) {
	        	            sum = sum + that.slices[i].value;
	        	        }

	        	        for (var i = 0; i < that.slices.length; i++) {
	        	            var percent = that.slices[i].value / sum;
	        	            that.slices[i].normalizedValue = percent;
	        	        }
	        	    })();
	        var buildAngleDegree = this.startAngleDegree;
	        for (var i = 0; i < this.slices.length; i++) {
	        	//this.solveSliceGeometry(this.slices[i], buildAngleDegree);
	            this.solveSliceFragments(this.slices[i], buildAngleDegree);
	            buildAngleDegree = this.slices[i].endAngleDegree;
	            if (buildAngleDegree > 360) {
	                buildAngleDegree = buildAngleDegree - 360;
	            }
	        }
	    },
	    
	    
	    /**
	     * solve slice fragment geometry
	     * 
	     * @param donutSlice
	     *            the slice to solve
	     * @param buildAngleDegree
	     *            the start build angle degree of the specified slice
	     */
	    solveSliceFragments : function(donutSlice,buildAngleDegree) {
	        donutSlice.clearFragments();
	        donutSlice.painted = false;
	        var sliceStartDegree = buildAngleDegree;
	        var sliceExtendsDegree = donutSlice.normalizedValue * 360;
	        donutSlice.startAngleDegree= sliceStartDegree;
	        donutSlice.endAngleDegree = sliceStartDegree + sliceExtendsDegree;
	        
	        //for label
	        
	        var medianDegree = sliceStartDegree + sliceExtendsDegree / 2;
	        if (medianDegree > 360) {
	            medianDegree = medianDegree - 360;
	        }
	        donutSlice.medianDegree=medianDegree;
	        var c = this.getDonutCenter();
	        var sliceCenterX = c.x + donutSlice.divergence * Math.cos(JenScript.Math.toRadians(medianDegree));
	        var sliceCenterY = c.y - donutSlice.divergence * Math.sin(JenScript.Math.toRadians(medianDegree));
	        
	        donutSlice.sc = {x:sliceCenterX,y:sliceCenterY};
	        
	        //end for label
	        
	        var fragmentStartAngleDegree = sliceStartDegree;
	        var fragmentExtends = sliceExtendsDegree;
	        var resteExtends = sliceExtendsDegree;
	        while (resteExtends > 0) {
	            fragmentExtends = this.getFragmentExtendsDegree(sliceStartDegree,sliceExtendsDegree, fragmentStartAngleDegree, resteExtends);
	            var fragment = this.createSliceFragment(donutSlice,fragmentStartAngleDegree, fragmentExtends);
	            donutSlice.addFragment(fragment);
	            resteExtends = resteExtends - fragmentExtends;
	            fragmentStartAngleDegree = fragmentStartAngleDegree+ fragmentExtends;
	            if (fragmentStartAngleDegree >= 360) {
	                fragmentStartAngleDegree = fragmentStartAngleDegree - 360;
	            }
	        }
	    },
	    
	    /**
	     * get the next fragment angle extends for given parameters
	     * @param {Number} sliceStartDegree
	     * @param {Number} sliceExtendsDegree
	     * @param {Number} fragmentStartDegre
	     * @param {Number} resteExtendsDegree
	     */
	    getFragmentExtendsDegree : function(sliceStartDegree,sliceExtendsDegree,fragmentStartDegree,resteExtendsDegree) {
	        if (fragmentStartDegree >= 0 && fragmentStartDegree < 180) {
	            var potentialExtends = 180 - fragmentStartDegree;
	            if (potentialExtends <= resteExtendsDegree) {
	                return potentialExtends;
	            }
	            else {
	                return resteExtendsDegree;
	            }
	        }
	        else if (fragmentStartDegree >= 180 && fragmentStartDegree < 360) {
	            var potentialExtends = 360 - fragmentStartDegree;
	            if (potentialExtends <= resteExtendsDegree) {
	                return potentialExtends;
	            }
	            else {
	                return resteExtendsDegree;
	            }
	        }
	        return 0;
	    },
	    
	    
	    /**
	     * get the donut center depends on donut nature
	     */
	    getDonutCenter : function(){
	    	if (this.nature === 'User') {
	            return this.plugin.getProjection().userToPixel({x:this.centerX,y: this.centerY});
	        }
	        if (this.nature == 'Device') {
	            return {x:this.centerX,y: this.centerY};
	        }
	    },
	    
	    /**
	     * create slice fragment for parent slice given by start and extends degree angle
	     * @param {Object} donutSlice
	     * @param {Number} startAngleDegree
	     * @param {Number} extendsDegree
	     */
	    createSliceFragment: function(donutSlice,startAngleDegree, extendsDegree) {

	        var fragment = new JenScript.Donut3DSlice({name : donutSlice.name+".part", value : 1,themeColor: donutSlice.themeColor});
	        fragment.fragment=true;
	        fragment.parentSlice = donutSlice;
	        
	        if (startAngleDegree >= 0 && startAngleDegree < 180) {
	            fragment.type='Back';
	            fragment.name=fragment.name + ".back";
	        }
	        else if (startAngleDegree >= 180 && startAngleDegree < 360) {
	            fragment.type='Front';
	            fragment.name = fragment.name + ".front";
	        }

	        var c = this.getDonutCenter();
	        var exploseTiltRadius = donutSlice.divergence / 90;
	        var exploseRadius = exploseTiltRadius * this.tilt;
	        var exploseA = donutSlice.divergence;
	        var exploseB = exploseRadius;
	        var cX = c.x + exploseA* Math.cos(JenScript.Math.toRadians(donutSlice.startAngleDegree + Math.abs(donutSlice.endAngleDegree - donutSlice.startAngleDegree) / 2));
	        var cY = c.y - exploseB* Math.sin(JenScript.Math.toRadians(donutSlice.startAngleDegree + Math.abs(donutSlice.endAngleDegree - donutSlice.startAngleDegree) / 2));
	        var ssOuterTop = {
	        	x : cX + this.outerA* Math.cos(JenScript.Math.toRadians(startAngleDegree)),
				y : cY - this.outerB* Math.sin(JenScript.Math.toRadians(startAngleDegree))
	        };
	        var seOuterTop = {
				x : cX+ this.outerA* Math.cos(JenScript.Math.toRadians(startAngleDegree+extendsDegree)),
				y : cY- this.outerB* Math.sin(JenScript.Math.toRadians(startAngleDegree+extendsDegree))
	        };
	        fragment.sos = ssOuterTop;
	        fragment.soe = seOuterTop;
	        var largeArcFlag = (extendsDegree > 180) ? '1' : '0';
	        var outerArcTop = "M" + ssOuterTop.x + "," + ssOuterTop.y + " A" + this.outerA + ","
								+ this.outerB + " 0 " + largeArcFlag + ",0 " + seOuterTop.x + ","
								+ seOuterTop.y;
	        
	        var outerArcBottom = "M" + ssOuterTop.x + "," + (ssOuterTop.y+ this.projectionThickness) + " A" + this.outerA + ","
								+ this.outerB + " 0 " + largeArcFlag + ",0 " + seOuterTop.x + ","
								+ (seOuterTop.y+this.projectionThickness);
	        fragment.outerArcTop = outerArcTop;
	        fragment.outerArcBottom = outerArcBottom;
	        var ssInnerTop = {
		        	x : cX + this.innerA* Math.cos(JenScript.Math.toRadians(startAngleDegree)),
					y : cY - this.innerB* Math.sin(JenScript.Math.toRadians(startAngleDegree))
		    };
		    var seInnerTop = {
					x : cX+ this.innerA* Math.cos(JenScript.Math.toRadians(startAngleDegree+extendsDegree)),
					y : cY- this.innerB* Math.sin(JenScript.Math.toRadians(startAngleDegree+extendsDegree))
		    };
		    fragment.sis = ssInnerTop;
	        fragment.sie = seInnerTop;
		    var innerArcTop =  "M" + ssInnerTop.x + "," + ssInnerTop.y + " A" + this.innerA + ","
							+ this.innerB + " 0 " + largeArcFlag + ",0 " + seInnerTop.x + ","
							+ seInnerTop.y;
		    
		    var innerArcBottom = "M" + ssInnerTop.x + "," + (ssInnerTop.y+ this.projectionThickness) + " A" + this.innerA + ","
							+ this.innerB + " 0 " + largeArcFlag + ",0 " + seInnerTop.x + ","
							+ (seInnerTop.y+ this.projectionThickness);
		    	
		    fragment.innerArcTop = innerArcTop;
		    fragment.innerArcBottom = innerArcBottom;

	        var topFace = "M" + ssOuterTop.x + "," + ssOuterTop.y + " A" + this.outerA + ","
							+ this.outerB + " 0 " + largeArcFlag + ",0 " + seOuterTop.x + ","
							+ seOuterTop.y+' L '+seInnerTop.x+','+seInnerTop.y+ " A" + this.innerA + ","
							+ this.innerB + " 0 " + largeArcFlag + ",1 " + ssInnerTop.x + ","
							+ ssInnerTop.y+' Z';
	        
	        fragment.topFace = topFace;

	        
	        var bottomFace = "M" + ssOuterTop.x + "," + (ssOuterTop.y+ this.projectionThickness) + " A" + this.outerA + ","
							+ this.outerB + " 0 " + largeArcFlag + ",0 " + seOuterTop.x + ","
							+ (seOuterTop.y+this.projectionThickness)+' L '+seInnerTop.x+','+(seInnerTop.y+this.projectionThickness)+ " A" + this.innerA + ","
							+ this.innerB + " 0 " + largeArcFlag + ",1 " + ssInnerTop.x + ","
							+ (ssInnerTop.y+this.projectionThickness)+' Z';
	        
	        fragment.bottomFace = bottomFace;

	        
	        fragment.startFace= 'M '+ssOuterTop.x+','+ssOuterTop.y
	        							+' L '+ssInnerTop.x+','+ssInnerTop.y
	        							+' L '+ssInnerTop.x+','+(ssInnerTop.y+this.projectionThickness)
	        							+' L '+ssOuterTop.x+','+(ssOuterTop.y+this.projectionThickness)
	        							+' Z';

	        fragment.endFace = 'M '+seOuterTop.x+','+seOuterTop.y
									+' L '+seInnerTop.x+','+seInnerTop.y
									+' L '+seInnerTop.x+','+(seInnerTop.y+this.projectionThickness)
									+' L '+seOuterTop.x+','+(seOuterTop.y+this.projectionThickness)
									+' Z';


	        fragment.innerFace="M " + ssInnerTop.x + "," + ssInnerTop.y + " A " + this.innerA + ","
								+ this.innerB + " 0 " + largeArcFlag + ",0 " + seInnerTop.x + ","
								+ seInnerTop.y+' L '+seInnerTop.x+','+(seInnerTop.y+this.projectionThickness)
								+ " A " + this.innerA + ","
								+ this.innerB + " 0 " + largeArcFlag + ",1 " + ssInnerTop.x + ","
								+ (ssInnerTop.y+ this.projectionThickness)
								+' Z';
	       
	        fragment.outerFace = "M " + ssOuterTop.x + "," + ssOuterTop.y + " A " + this.outerA + ","
								+ this.outerB + " 0 " + largeArcFlag + ",0 " + seOuterTop.x + ","
								+ seOuterTop.y+' L '+seOuterTop.x+','+(seOuterTop.y+this.projectionThickness)
								+ " A " + this.outerA + ","
								+ this.outerB + " 0 " + largeArcFlag + ",1 " + ssOuterTop.x + ","
								+ (ssOuterTop.y+ this.projectionThickness)
								+' Z';

	        fragment.startAngleDegree=startAngleDegree;
	        fragment.endAngleDegree=startAngleDegree + extendsDegree;
	        return fragment;
	    },
	    
	    /**
	     * true if the specified slice is in specified slice collection, false
	     * otherwise
	     * 
	     * @param {Object} donutSlice
	     * @param {Object} slices
	     * @return true if the specified slice is in specified slice collection,
	     *         false otherwise
	     */
	    isIn : function(donutSlice,slices) {
	        for (var i = 0; i < slices.length; i++) {
	        	if (donutSlice.Id === slices[i].Id) {
	                return true;
	            }
	        }
	        return false;
	    },
	    
	    
	    /**
	     * get slices found on the specified frame angle
	     * 
	     * @param {Number} startAngleDegree
	     *            the start angle degree
	     * @param {Number} endAngleDegree
	     *            the end angle degree
	     * @return {Object} the slices intercept by the specified frame angle
	     */
	    getSlicesFragmentOnAngle : function(sliceParent,startAngleDegree, endAngleDegree) {
	        if (startAngleDegree < 0 || startAngleDegree > 360
	                || endAngleDegree < 0 || endAngleDegree > 360) {
	            throw new Error("StarAngleDegree and EndAngleDegree out of range [0,360]");
	        }
	        if (endAngleDegree < startAngleDegree) {
	            throw new Error("EndAngleDegree should be  greater than StartAngleDegree");
	        }
	        var slicesOnAngle = [];
	        for (var i = 0; i < sliceParent.fragments.length; i++) {
				var s = sliceParent.fragments[i];
	            if (s.startAngleDegree >= startAngleDegree
	                    && s.endAngleDegree >= startAngleDegree
	                    && s.startAngleDegree <= endAngleDegree
	                    && s.endAngleDegree <= endAngleDegree) {
	                slicesOnAngle[slicesOnAngle.length]=s;
	            }
	            else if (s.startAngleDegree <= startAngleDegree
	                    && s.endAngleDegree >= startAngleDegree
	                    && s.startAngleDegree <= endAngleDegree
	                    && s.endAngleDegree <= endAngleDegree) {
	            	 slicesOnAngle[slicesOnAngle.length]=s;
	            }
	            else if (s.startAngleDegree >= startAngleDegree
	                    && s.endAngleDegree >= startAngleDegree
	                    && s.startAngleDegree <= endAngleDegree
	                    && s.endAngleDegree >= endAngleDegree) {
	            	 slicesOnAngle[slicesOnAngle.length]=s;
	            }
	            else if (s.startAngleDegree <= startAngleDegree
	                    && s.endAngleDegree >= startAngleDegree
	                    && s.startAngleDegree <= endAngleDegree
	                    && s.endAngleDegree >= endAngleDegree) {
	            	 slicesOnAngle[slicesOnAngle.length]=s;
	            }
			}
	        return slicesOnAngle;
	    },
	    
	    /**
	     * get first slice found with the specified angle degree
	     * 
	     * @param {Number} angleDegree
	     *            the angle degree
	     * @return {Object} the slices across this angle degree
	     */
	    getSliceOnAngle : function(angleDegree) {
	        if (angleDegree < 0 && angleDegree > 360) {
	            throw new Error("angleDegree out of range [0,360]");
	        }
	        for (var i = 0; i < this.slices.length; i++) {
				var s = this.slices[i];
				if (s.endAngleDegree <= 360) {
	                if (s.startAngleDegree <= angleDegree
	                        && s.endAngleDegree >= angleDegree) {
	                	return s;
	                }
	            }
	            else if (s.endAngleDegree > 360) {
	                var reboundAngleDegree = angleDegree;
	                if (angleDegree < s.startAngleDegree) {
	                    reboundAngleDegree = angleDegree + 360;
	                }

	                var f1 = s.startAngleDegree <= reboundAngleDegree;
	                var f2 = s.endAngleDegree >= reboundAngleDegree;

	                if (f1 && f2) {
	                	return s;
	                }
	            }
			}
	        return undefined;
	    },
	    
	    /**
	     * get all slices found with the specified angle degree
	     * 
	     * @param {Number} angleDegree
	     *            the angle degree
	     * @return {Object} the slices across this angle degree
	     */
	    getSlicesOnAngle : function(angleDegree) {
	        if (angleDegree < 0 && angleDegree > 360) {
	            throw new Error("angleDegree out of range [0,360]");
	        }
	        var slicesOnAngle = [];
	        for (var i = 0; i < this.slices.length; i++) {
				var s = this.slices[i];
				if (s.endAngleDegree <= 360) {
	                if (s.startAngleDegree <= angleDegree
	                        && s.endAngleDegree >= angleDegree) {
	                    slicesOnAngle[slicesOnAngle.length] = s;
	                }
	            }
	            else if (s.endAngleDegree > 360) {
	                var reboundAngleDegree = angleDegree;
	                if (angleDegree < s.startAngleDegree) {
	                    reboundAngleDegree = angleDegree + 360;
	                }

	                var f1 = s.startAngleDegree <= reboundAngleDegree;
	                var f2 = s.endAngleDegree >= reboundAngleDegree;

	                if (f1 && f2) {
	                	slicesOnAngle[slicesOnAngle.length] = s;
	                }
	            }
			}
	        return slicesOnAngle;
	    },

	    /**
	     * get slices found on the specified frame angle
	     * @param {Number} startAngleDegree
	     *            the start angle degree
	     * @param {Number} endAngleDegree
	     *            the end angle degree
	     * @return {Object} the slices intercept by the specified frame angle
	     */
	    getSlicesOnRangeAngle : function(startAngleDegree,endAngleDegree) {
	        if (startAngleDegree < 0 || startAngleDegree > 360
	                || endAngleDegree < 0 || endAngleDegree > 360) {
	            throw new Error("StarAngleDegree and EndAngleDegree out of range [0,360]");
	        }
	        if (endAngleDegree < startAngleDegree) {
	            throw new Error("EndAngleDegree should be  greater than StartAngleDegree");
	        }
	        var slicesOnAngle = [];
	        for (var i = 0; i < this.slices.length; i++) {
	        	var s = this.slices[i];
	            if (s.startAngleDegree >= startAngleDegree
	                    && s.endAngleDegree >= startAngleDegree
	                    && s.startAngleDegree <= endAngleDegree
	                    && s.endAngleDegree <= endAngleDegree) {
	            	slicesOnAngle[slicesOnAngle.length] = s;
	            }
	            else if (s.startAngleDegree <= startAngleDegree
	                    && s.endAngleDegree >= startAngleDegree
	                    && s.startAngleDegree <= endAngleDegree
	                    && s.endAngleDegree <= endAngleDegree) {
	            	slicesOnAngle[slicesOnAngle.length] = s;
	            }
	            else if (s.startAngleDegree >= startAngleDegree
	                    && s.endAngleDegree >= startAngleDegree
	                    && s.startAngleDegree <= endAngleDegree
	                    && s.endAngleDegree >= endAngleDegree) {
	            	slicesOnAngle[slicesOnAngle.length] = s;
	            }
	            else if (s.startAngleDegree <= startAngleDegree
	                    && s.endAngleDegree >= startAngleDegree
	                    && s.startAngleDegree <= endAngleDegree
	                    && s.endAngleDegree >= endAngleDegree) {
	            	slicesOnAngle[slicesOnAngle.length] = s;
	            }
	        }
	        return slicesOnAngle;
	    },
	    
	    /**
	     * get ordered slice to paint
	     * 
	     * @return {Object} sorted slices to be paint
	     */
	    getPaintOrder : function() {
	    	this.getPaintOrderFragments();
	        var paintOrder = [];
	        var firstSlices = this.getSlicesOnAngle(90);
	        var lastSlices = this.getSlicesOnAngle(270);
	        
	        for (var f = 0; f < firstSlices.length; f++) {
	        	if (firstSlices[f] !== undefined && !this.isIn(firstSlices[f], paintOrder)
	                    && !this.isIn(firstSlices[f], lastSlices)) {
	                paintOrder[paintOrder.length] =firstSlices[f];
	            }
			}
	        // LEFT
	        var slicesLeft = this.getSlicesOnRangeAngle(90, 270);
	        
	        for (var l = 0; l < slicesLeft.length; l++) {
	        	
	        	 if (!this.isIn(slicesLeft[l], paintOrder) && ! this.isIn(slicesLeft[l], lastSlices)) {
	        		 paintOrder[paintOrder.length] =slicesLeft[l];
		         }
	        }
	        // RIGHT
	        var zeroSlice = this.getSliceOnAngle(0);
	        var slicesRight1 = this.getSlicesOnRangeAngle(0, 90);
	        slicesRight1.reverse();
	        for (var r1 = 0; r1 < slicesRight1.length; r1++) {
	        	 if (!this.isIn(slicesRight1[r1], paintOrder) && !slicesRight1[r1].Id === zeroSlice.Id
		                    && !this.isIn(slicesRight1[r1], lastSlices)) {
	        		 paintOrder[paintOrder.length] =slicesRight1[r1];
		         }
	        }
	        if (zeroSlice !== undefined && !this.isIn(zeroSlice, paintOrder)
	                && !this.isIn(zeroSlice, lastSlices)) {
	            paintOrder[paintOrder.length] = zeroSlice;
	        }
	        // RIGHT 2
	        var slicesRight2 = this.getSlicesOnRangeAngle(270, 360);
	        slicesRight2.reverse();
	        for (var r2 = 0; r2 < slicesRight2.length; r2++) {
	        	 if (!this.isIn(slicesRight2[r2], paintOrder) && !this.isIn(slicesRight2[r2], lastSlices)) {
	        		 paintOrder[paintOrder.length] =slicesRight2[r2];
		         }
	        }
	        for (var last = 0; last < lastSlices.length; last++) {
	        	if (lastSlices[last] !== undefined) {            	
	        		 paintOrder[paintOrder.length] =lastSlices[last];
	            }
	        }
	        return paintOrder;
	    },
	    
	    /**
	     * get ordered slice to paint
	     * 
	     * @return {Object} sorted slices to be paint
	     */
	    getPaintOrderFragments : function() {
	    	 var paintOrderFragments = [];
	    	 var firstSlices = this.getSlicesOnAngle(90);    	 
	    	 var flattenFirstSlicesFragments = [];
	    	 for (var i = 0; i < firstSlices.length; i++) {
				 var firstSlice = firstSlices[i];
				 var fragments = firstSlice.fragments;
				 for (var j = 0; j < fragments.length; j++) {
					 flattenFirstSlicesFragments[flattenFirstSlicesFragments.length] = fragments[j];
				 }
	    	 }
	         var lastSlices = this.getSlicesOnAngle(270);
	         var flattenLastSlicesFragments = [];
	         for (var i = 0; i < lastSlices.length; i++) {
				 var lastSlice = lastSlices[i];
				 var fragments = lastSlice.fragments;
				 for (var j = 0; j < fragments.length; j++) {
					 flattenLastSlicesFragments[flattenLastSlicesFragments.length] = fragments[j];
				 }
	    	 }
	         //first fragment on 90°        
	         for (var i = 0; i < flattenFirstSlicesFragments.length; i++) {
	        	 var firstSliceFragment = flattenFirstSlicesFragments[i];
	        	 if(firstSliceFragment.startAngleDegree <= 90 && firstSliceFragment.endAngleDegree >= 90){
						paintOrderFragments[paintOrderFragments.length] = firstSliceFragment;
					}
			 }
	         //other from first
	         for (var i = 0; i < flattenFirstSlicesFragments.length; i++) {
	        	 var firstSliceFragment = flattenFirstSlicesFragments[i];
	        	 if (!this.isIn(firstSliceFragment, paintOrderFragments) && !this.isIn(firstSliceFragment, flattenLastSlicesFragments)) {
	        		 paintOrderFragments[paintOrderFragments.length] = firstSliceFragment;
	              }
			 }
	         //left
	         var slicesLeft = this.getSlicesOnRangeAngle(90, 270);
	         for (var i = 0; i < slicesLeft.length; i++) {
	        	 var sliceLeft = slicesLeft[i];
	        	 var fragments = sliceLeft.fragments;
	        	 for (var j = 0; j < fragments.length; j++) {
					var leftFragment = fragments[j];
					if (!this.isIn(leftFragment, paintOrderFragments) && !this.isIn(leftFragment, flattenLastSlicesFragments)) {
						 paintOrderFragments[paintOrderFragments.length] = leftFragment;
	                 }
				}
			 }
	         // right
	         var zeroSlice = this.getSliceOnAngle(0);
	         var slicesRight1 = this.getSlicesOnRangeAngle(0, 90);
	         slicesRight1.reverse();
	         for (var i = 0; i < slicesRight1.length; i++) {
				var sliceRight1 = slicesRight1[i];
				var right1Fragments = this.getSlicesFragmentOnAngle(sliceRight1, 0, 90);
				for (var j = 0; j < right1Fragments.length; j++) {
					var right1Fragment = right1Fragments[j];
					if (!this.isIn(right1Fragment, paintOrderFragments) && !this.isIn(right1Fragment,zeroSlice.fragments)) {
						if(this.isIn(right1Fragment, flattenLastSlicesFragments)){
			   				 for (var k = 0; k < flattenLastSlicesFragments.length; k++) {
								var dLastFragment = flattenLastSlicesFragments[k];
								if(dLastFragment.Id === right1Fragment.Id && right1Fragment.type === 'Back'){
									paintOrderFragments[paintOrderFragments.length] = right1Fragment;
								}
			   				 }
			   			 }else{
			   				paintOrderFragments[paintOrderFragments.length] = right1Fragment;
			   			 }
		            }
				}
			 }
	         var zeroFragments = zeroSlice.fragments;
	         for (var i = zeroFragments.length-1; i >= 0; i--) {
	        	 var zeroFragment = zeroFragments[i];
	         	  if (zeroFragment !== undefined && !this.isIn(zeroFragment, paintOrderFragments)) {
	         		 if(this.isIn(zeroFragment, flattenLastSlicesFragments)){
	         			 for (var j = 0; j < flattenLastSlicesFragments.length; j++) {
							var dLastFragment = flattenLastSlicesFragments[j];
							if(dLastFragment.Id===zeroFragment.Id && zeroFragment.type === 'Back'){
								paintOrderFragments[paintOrderFragments.length] = zeroFragment;
							}
						}
	        			 
	       			 }else{
	       				paintOrderFragments[paintOrderFragments.length] = zeroFragment;
	       			 }
	               }
			}
	         // RIGHT 2
	         var slicesRight2 = this.getSlicesOnRangeAngle(270, 360);
	         slicesRight2.reverse();
	         for (var i = 0; i < slicesRight2.length; i++) {
	        	 var sliceRight2 = slicesRight2[i];
	        	 var right2Fragments = this.getSlicesFragmentOnAngle(sliceRight2, 270, 360);
	        	 for (var j = 0; j < right2Fragments.length; j++) {
					var right2Fragment = right2Fragments[j];
					if (!this.isIn(right2Fragment, paintOrderFragments) && !this.isIn(right2Fragment,zeroSlice.fragments)) {
			   			 if(this.isIn(right2Fragment, flattenLastSlicesFragments)){
			   				 for (var k = 0; k < flattenLastSlicesFragments.length; k++) {
								var dLastFragment = flattenLastSlicesFragments[k];
								if(dLastFragment.Id === right2Fragment.Id && right2Fragment.type === 'Back'){
									paintOrderFragments[paintOrderFragments.length] = right2Fragment;
								}
							}
			   			 }else{
			   				paintOrderFragments[paintOrderFragments.length] = right2Fragment;
			   			 }
		            }
				}
			}
	        for (var i = 0; i < flattenLastSlicesFragments.length; i++) {
				var lastFragment = flattenLastSlicesFragments[i];
				 if (!this.isIn(lastFragment, paintOrderFragments)){
	        		 paintOrderFragments[paintOrderFragments.length] = lastFragment;
	        	 }
			}
	        return paintOrderFragments;
	    }
	});
})();
(function(){
	/**
	 * Donut3D Slice
	 * @param {Object} config
	 */
	JenScript.Donut3DSlice = function(config) {
		this.init(config);
	};
	
	JenScript.Model.addMethods(JenScript.Donut3DSlice,{
		
		/**
		 * init the donut 3D slice
		 * @param {Object} config
		 */
		init : function(config){
			config = config || {};
			this.Id = 'donut3dslice'+JenScript.sequenceId++;
			/** slice name */
		    this.name = config.name;
		    /** value */
		    this.value =  (config.value !== undefined)?config.value:1;
		    /** theme color */
		    this.themeColor = config.themeColor;
		    /** divergence */
		    this.divergence = (config.divergence !== undefined)?config.divergence:0;
		    /** percent normalize value */
		    this.normalizedValue;
		    /** start angle degree */
		    this.startAngleDegree;
		    /** end angle degree */
		    this.endAngleDegree;
		    /** outer arc top */
		    this.outerArcTop;
		    /** inner arc top */
		    this.innerArcTop;
		    /** outer arc bottom */
		    this.outerArcBottom;
		    /** inner Arc bottom */
		    this.innerArcBottom;
		    /** top face */
		    this.topFace;
		    /** bottom face */
		    this.bottomFace;
		    /** start face */
		    this.startFace;
		    /** end face */
		    this.endFace;
		    /** inner face */
		    this.innerFace;
		    /** outer face */
		    this.outerFace;
		    /** edge point */
		    this.sos;
		    /** edge point */
		    this.soe;
		    /** edge point */
		    this.sis;
		    /** edge point */
		    this.sie;
		    /** slice label */
		    this.sliceLabels = [];
		    /** fragment type Front or Back */
		    this.type;
		    /**fragment slice flag*/
		    this.isFragment;
		    /**slice parent for this fragment*/
		    this.parentSlice;
		    /** inner model */
		    this.innerModel;
		    /** center x */
		    this.centerX;
		    /** center y */
		    this.centerY;
		    /** paint flag */
		    this.painted = false;
		    /** enter flag */
		    this.lockEnter = false;
		    /** host donut 3D */
		    this.donut;
		    /**fragment*/
		    this.fragments = [];
		    
		   // alert("slice value : "+this.name+","+this.value);
		    if(this.value <= 0 )
		    	throw new Error('Slice value should be greater than 0');
		},
		
		setName : function(name) {
			this.name = name;
		},

		getName : function() {
			return this.name;
		},

		setValue : function(value) {
			this.value = value;
		},

		getValue : function() {
			return this.value;
		},
		
		setDivergence : function(divergence) {
			this.divergence = divergence;
		},

		getDivergence : function() {
			return this.divergence;
		},
		
		setThemeColor : function(themeColor) {
			this.themeColor = themeColor;
		},

		getThemeColor : function() {
			return this.themeColor;
		},

		
		/**
	     * get all slice label that have been registered on this slice
	     * 
	     * @return the slice Label collection of this slice
	     */
	     getSliceLabels : function() {
	        return this.sliceLabels;
	     },

	    /**
	     * @param sliceLabel
	     *            the slice label to add
	     */
	    addSliceLabel : function(sliceLabel) {
	        this.sliceLabels[this.sliceLabels.length] = sliceLabel;
	        sliceLabel.slice = this;
	        if(this.donut !== undefined && this.donut.plugin !== undefined){
	        	this.donut.plugin.repaintDonuts();	
	        }
	    },
		
		/**
		 * set slice parameters
		 */
		set : function(name,value,themeColor){
		    this.name = name;
		    this.value = value;
		    this.themeColor = themeColor;
		    if(this.donut !== undefined && this.donut.plugin !== undefined){
	        	this.donut.plugin.repaintDonuts();	
	        }
		},
		
		/**
		 * clear slice fragments
		 */
		clearFragments : function(){
			this.fragments = [];
		},
		
		/**
		 * add fragment in this slice
		 * @param {Object} fragment
		 */
		addFragment : function(fragment){
			this.fragments[this.fragments.length] = fragment;
		},
		
		/**
	     * return true if the specified fragment is the first fragment of this slice, false otherwise
	     * @param {Object} fragment
	     * @return true if the specified fragment is the first fragment of this   slice, false otherwise
	     */
	    isFirst : function(fragment) {
	        return this.fragments[0].Id === fragment.Id;
	    },

	    /**
	     * return true if the specified fragment is the last fragment of this slice, false otherwise
	     * @param {Object} fragment
	     * @return true if the specified fragment is the last fragment of this slice, false otherwise
	     *        
	     */
	    isLast : function(fragment) {
	    	return this.fragments[this.fragments.length-1].Id === fragment.Id;
	    },

		
		/**
	     * get the front inner face of this slice
	     * @return {Object} front inner face of this slice
	     */
	    getFrontInnerFace : function() {
	        var frontInnerFace='';
	        for (var f = 0; f < this.fragments.length; f++) {
	        	var fragment = this.fragments[f];
	        	 if (fragment.type === 'Front') {
		                frontInnerFace = frontInnerFace + fragment.innerFace;
		         }
			}
	        return frontInnerFace;
	    },

	    /**
	     * get the back inner face of this slice
	     * @return {Object} back inner face of this slice
	     */
	    getBackInnerFace : function() {
	        var backInnerFace ='';
	        for (var f = 0; f < this.fragments.length; f++) {
	        	var fragment = this.fragments[f];
	        	 if (fragment.type === 'Back') {
	        		 backInnerFace = backInnerFace + fragment.innerFace;
		         }
			}
	        return backInnerFace;
	    }
	});	
})();
(function(){
	/**
	 * donut 3D painter
	 */
	JenScript.Donut3DDefaultPaint = function() {	
		/** incidence angle degree */
		this.incidenceAngleDegree = 90;

		/** paint flag top effect */
		this.paintTopEffect = true;

		/** paint flag inner effect */
		this.paintInnerEffect = true;

		/** paint flag outer effect */
		this.paintOuterEffect = true;

		/** alpha use to paint top effect */
		this.alphaTop = 0.8;

		/** alpha use to paint inner effect */
		this.alphaInner = 1;

		/** alpha use to paint outer effect */
		this.alphaOuter = 1;

		/** alpha use to fill */
		this.alphaFill = 0.7;

		// fill back flag
		this.fillBackBottom = true;
		this.fillBackOuter = true;
		this.fillBackInner = true;
		this.fillBackTop = true;
		this.fillBackStart = true;
		this.fillBackEnd = true;

		// front back flag
		this.fillFrontBottom = true;
		this.fillFrontOuter = true;
		this.fillFrontInner = true;
		this.fillFrontTop = true;
		this.fillFrontStart = true;
		this.fillFrontEnd = true;
	};
	
	JenScript.Model.addMethods(JenScript.Donut3DDefaultPaint, {
		
		
		/**
		 * paint the given donut 3D
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut3d the graphics context
		 */
		paintDonut3D : function(g2d,donut3d) {
			var slicesFragments = donut3d.getPaintOrderFragments();
			for (var f = 0; f < slicesFragments.length; f++) {
				var fragment = slicesFragments[f];
				this._paintDonut3DFill(g2d, donut3d, fragment);
				if (this.paintTopEffect) {
					this._paintTopEffect(g2d, donut3d, fragment);
				}
				if (this.paintOuterEffect) {
					this._paintOuterEffect(g2d, donut3d, fragment);
				}
				if (this.paintInnerEffect) {
					this._paintInnerEffect(g2d, donut3d, fragment);
				}
				fragment.painted = true;
			}
		},
		
		/**
		 * paint outer effect of given donut 3D
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut3d the graphics context
		 */
		_paintOuterEffect : function(g2d,donut3d,section) {
			var c = donut3d.getDonutCenter();
			var outerFrontFace = '';
			for (var i = 0; i < donut3d.slices.length; i++) {
				var fragments = donut3d.slices[i].fragments;
				for (var j = 0; j < fragments.length; j++) {
					var frag = fragments[j];
					if (frag.type === 'Front') {
						outerFrontFace = outerFrontFace+' '+frag.outerFace;
					}
				}
			}
			var gradientId = 'gradient'+JenScript.sequenceId++;
			var startX = c.x-donut3d.outerA;
			var startY = c.y;
			var endX = c.x+donut3d.outerA;
			var endY = c.y;
			var percents = [ '0%', '40%', '80%', '100%' ];
			var c1 = 'rgb(40, 40, 40)';
			var c2 = 'rgb(40, 40, 40)';
			var c3 = 'rgb(255, 255, 255)';
			var c4 = 'rgb(255, 255, 255)';
			var colors = [ c1, c2, c3, c4 ];
			var opacity = [0.3,0.05,0.05,0.5];
			var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(startX,startY).to(endX, endY).shade(percents,colors,opacity).toSVG();
			g2d.definesSVG(gradient);
			var outerEffect = new JenScript.SVGElement().name('path')
													.attr('d',outerFrontFace)
													.attr('fill','url(#'+gradientId+')')
													.attr('opacity',this.alphaOuter)
													.buildHTML();
			
			donut3d.svg.donutRoot.appendChild(outerEffect);
			//g2d.insertSVG(outerEffect);
		},
		
		
		
		/**
		 * paint inner effect of given donut 3D
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut3d the graphics context
		 */
		_paintInnerEffect : function(g2d,donut3d,section) {
			var innerBackFace = '';
			for (var i = 0; i < donut3d.slices.length; i++) {
				var fragments = donut3d.slices[i].fragments;
				for (var j = 0; j < fragments.length; j++) {
					var frag = fragments[j];
					if (frag.type === 'Back') {
						innerBackFace = innerBackFace+' '+frag.innerFace;
					}
				}
			}
			
			var clipId1 = 'clip'+JenScript.sequenceId++;
			var clip1 = new JenScript.SVGElement().name('clipPath')
												.attr('id',clipId1)
												.buildHTML();
			var c = donut3d.getDonutCenter();
			var clip1Path = new JenScript.SVGElement().name('ellipse')
													.attr('cx',c.x)
													.attr('cy',c.y)
													.attr('rx',donut3d.innerA)
													.attr('ry',donut3d.innerB)
													.buildHTML();
			
			clip1.appendChild(clip1Path);
			g2d.definesSVG(clip1);
			
			var startX = c.x +donut3d.innerA;
			var startY = c.y;
			var endX = c.x-donut3d.innerA;
			var endY = c.y;
			var percents = [ '0%', '40%', '80%', '100%' ];
			var c1 = 'rgb(40, 40, 40)';
			var c2 = 'rgb(40, 40, 40)';
			var c3 = 'rgb(240, 240, 240)';
			var c4 = 'rgb(240, 240, 240)';
			var colors = [ c1, c2, c3, c4 ];
			var opacity = [0.2,0.3,0,0.6];
			var gradientId = 'gradient'+JenScript.sequenceId++;
			var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(startX,startY).to(endX, endY).shade(percents,colors,opacity).toSVG();
			g2d.definesSVG(gradient);
			var innerEffect = new JenScript.SVGElement().name('path')
												.attr('d',innerBackFace)
												.attr('clip-path','url(#'+clipId1+')')
												.attr('fill','url(#'+gradientId+')')
												.attr('opacity',this.alphaInner)
												.buildHTML();
			donut3d.svg.donutRoot.appendChild(innerEffect);
			//g2d.insertSVG(innerEffect);
		},
		
		/**
		 * paint end face effect of given donut 3D
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut3d the graphics context
		 * @param {Object} section the graphics context
		 */
		paintEndEffect : function(g2d,donut3d,section) {

			//g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1f));

//			Line2D lineBottom = section.getEndBottomLine();
//			Line2D lineTop = section.getEndTopLine();
//
//			double a = (lineTop.getY1() - lineTop.getY2()) / (lineTop.getX1() - lineTop.getX2());
//			double bTop = lineTop.getY1() - 2 * a * lineTop.getX1();
//			double bBottom = lineBottom.getY1() - 2 * a * lineBottom.getX1();
//
//			double distanceLineTop = Math.abs(bBottom - bTop) / Math.sqrt(a * a + 1);
//
//			double cxBottom = (lineBottom.getX1() + lineBottom.getX2()) / 2d;
//			double cyBottom = (lineBottom.getY1() + lineBottom.getY2()) / 2d;
//
//			double cxTop = (lineTop.getX1() + lineTop.getX2()) / 2d;
//			double cyTop = (lineTop.getY1() + lineTop.getY2()) / 2d;
//
//			GeometryPath path = new GeometryPath(lineBottom);
//			float topLength = (float) Math.sqrt((lineTop.getX2() - lineTop.getX1()) * (lineTop.getX2() - lineTop.getX1()) + (lineTop.getY2() - lineTop.getY1()) * (lineTop.getY2() - lineTop.getY1()));
//			double angleRadian = path.angleAtLength(topLength / 2f);
//
//			double px = cxBottom + distanceLineTop * Math.cos(angleRadian + Math.PI / 2);
//			double py = cyBottom + distanceLineTop * Math.sin(angleRadian + Math.PI / 2);
//
//			Point2D start2 = new Point2D.Double(cxBottom, cyBottom);
//			Point2D end2 = new Point2D.Double(px, py);
//
//			float[] dist2 = { 0f, 0.4f, 0.6f, 1.0f };
//
//			Color cStart2 : 'rgb(40, 40, 40, 140);
//			Color cStart2bis : 'rgb(40, 40, 40, 10);
//			Color cEnd2bis : 'rgb(255, 255, 255, 10);
//			Color cEnd2 : 'rgb(240, 240, 240, 140);
//
//			Color[] colors2 = { cStart2, cStart2bis, cEnd2bis, cEnd2 };
//
//			if (!start2.equals(end2)) {
//				LinearGradientPaint p2 = new LinearGradientPaint(start2, end2, dist2, colors2);
//
//				g2d.setPaint(p2);
//
//				g2d.fill(section.getEndFace());
//			}

		},
	
		/**
		 * paint top effect of given donut 3D
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut3d the graphics context
		 */
		_paintTopEffect:function(g2d,donut3d,section) {
			var c = donut3d.getDonutCenter();
			var startSection = donut3d.getSliceOnAngle(this.incidenceAngleDegree);
			var exploseStartTiltRadius = startSection.divergence / 90;
			var exploseStartRadius = exploseStartTiltRadius * donut3d.tilt;
			var exploseStartA = startSection.divergence;
			var exploseStartB = exploseStartRadius;
			var centerStartX = c.x + exploseStartA * Math.cos(JenScript.Math.toRadians(startSection.startAngleDegree + Math.abs(startSection.endAngleDegree-startSection.startAngleDegree) / 2));
			var centerStartY = c.y - exploseStartB * Math.sin(JenScript.Math.toRadians(startSection.startAngleDegree + Math.abs(startSection.endAngleDegree-startSection.startAngleDegree) / 2));
			var startX = centerStartX + donut3d.outerA * Math.cos(JenScript.Math.toRadians(this.incidenceAngleDegree));
			var startY = centerStartY - donut3d.outerB * Math.sin(JenScript.Math.toRadians(this.incidenceAngleDegree));
			var endSection = donut3d.getSliceOnAngle(this.incidenceAngleDegree + 180);
			var exploseEndTiltRadius = endSection.divergence / 90;
			var exploseEndRadius = exploseEndTiltRadius * donut3d.tilt;
			var exploseEndA = endSection.divergence;
			var exploseEndB = exploseEndRadius;
			var centerEndX = c.x + exploseEndA * Math.cos(JenScript.Math.toRadians(endSection.startAngleDegree + Math.abs(endSection.endAngleDegree-endSection.startAngleDegree) / 2));
			var centerEndY = c.y - exploseEndB * Math.sin(JenScript.Math.toRadians(endSection.startAngleDegree + Math.abs(endSection.endAngleDegree-endSection.startAngleDegree) / 2));
			var endX = centerEndX + donut3d.outerA * Math.cos(JenScript.Math.toRadians(this.incidenceAngleDegree + 180));
			var endY = centerEndY - donut3d.outerB * Math.sin(JenScript.Math.toRadians(this.incidenceAngleDegree + 180));
			var c1 = 'rgb(40, 40, 40)';
			var c2 = 'rgb(40, 40, 40)';
			var c3 = 'rgb(255, 255, 255)';
			var c4 = 'rgb(255, 255, 255)';
			var percents = ['0%','45%','55%','100%'];
			var colors = [ c1, c2, c3, c4 ];
			var opacity =[0.5,0,0,0.8];
			var gradientId = 'gradient'+ JenScript.sequenceId++;
			var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(startX,startY).to(endX, endY).shade(percents,colors,opacity).toSVG();
			g2d.definesSVG(gradient);
			if (section !== undefined && section.topFace !== undefined) {
				var topFaceEffect = new JenScript.SVGElement().name('path')
									.attr('d',section.topFace)
									.attr('opacity',this.alphaTop)
									.attr('fill','url(#'+gradientId+')')
									//.attr('clip-path','url(#'+clipId1+')')
									.buildHTML();
				
				donut3d.svg.donutRoot.appendChild(topFaceEffect);
				//g2d.insertSVG(topFaceEffect);
			}
		},
		
		

		/**
		 * fill given donut 3D
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut3d the graphics context
		 */
		_paintDonut3DFill : function(g2d,donut3d,s) {
			/**
			 * Back fragment outer face
			 */
			if (this.fillBackOuter) {
				if (s.type === 'Back') {
					var outerFace = new JenScript.SVGElement().name('path')
														.attr('d',s.outerFace)
														.attr('opacity',this.alphaFill)
														.attr('fill',s.themeColor)
														.buildHTML();
					donut3d.svg.donutRoot.appendChild(outerFace);
					//g2d.insertSVG(outerFace);
				}
			}

			/**
			 * Back fragment bottom face
			 */
			if (this.fillBackBottom) {
				if (s.type === 'Back') {
					var bottomFace = new JenScript.SVGElement().name('path')
														.attr('d',s.bottomFace)
														.attr('opacity',this.alphaFill)
														.attr('fill',s.themeColor)
														.buildHTML();
					donut3d.svg.donutRoot.appendChild(bottomFace);
					//g2d.insertSVG(bottomFace);
				}
			}

			/**
			 * Back fragment inner face
			 */
			if (this.fillBackInner) {
				if (s.type == 'Back') {
					
					var clipId1 = 'clip'+JenScript.sequenceId++;
					var clip1 = new JenScript.SVGElement().name('clipPath')
														.attr('id',clipId1)
														.buildHTML();

					var clip1Path = new JenScript.SVGElement().name('path')
															.attr('d',donut3d.getTopFace())
															.buildHTML();
					
					clip1.appendChild(clip1Path);
					g2d.definesSVG(clip1);

					var visibleInnerBackFace = new JenScript.SVGElement().name('path')
															.attr('d',s.innerFace)
															.attr('opacity',this.alphaFill)
															.attr('fill',s.themeColor)
															//.attr('clip-path','url(#'+clipId1+')')
															.buildHTML();
					donut3d.svg.donutRoot.appendChild(visibleInnerBackFace);
					//g2d.insertSVG(visibleInnerBackFace);
				}
			}
			
			/**
			 * Back fragment start and end face
			 */
			if (this.fillBackStart) {
				if (s.type === 'Back') {
					if (s.parentSlice.isFirst(s)) {
						var startFace = new JenScript.SVGElement().name('path')
												.attr('d',s.startFace)
												.attr('opacity',this.alphaFill)
												.attr('fill',s.themeColor)
												.buildHTML();
						//g2d.insertSVG(startFace);
						donut3d.svg.donutRoot.appendChild(startFace);
						
						if (s.parentSlice.isFirst(s) && (s.parentSlice.startAngleDegree <= 90 || s.parentSlice.startAngleDegree >= 270)) {
							//paintStartEffect(g2d, donut3d, s);
						}
					}

				}
			}

			if (this.fillBackEnd) {
				if (s.type === 'Back') {
					if (s.parentSlice.isLast(s)) {
						var endFace = new JenScript.SVGElement().name('path')
															.attr('d',s.endFace)
															.attr('opacity',this.alphaFill)
															.attr('fill',s.themeColor)
															.buildHTML();
						//g2d.insertSVG(endFace);
						donut3d.svg.donutRoot.appendChild(endFace);
						
						if (s.parentSlice.isLast(s) && (s.endAngleDegree >= 90 && s.endAngleDegree <= 270)) {
							//paintEndEffect(g2d, donut3d, s);
						}
					}
				}
			}


			/**
			 * Back fragment top face
			 */
			if (this.fillBackTop) {
				if (s.type === 'Back') {
					var topFace = new JenScript.SVGElement().name('path')
									.attr('d',s.topFace)
									.attr('opacity',this.alphaFill)
									.attr('fill',s.themeColor)
									.buildHTML();
					//g2d.insertSVG(topFace);
					donut3d.svg.donutRoot.appendChild(topFace);
				}
			}

			/***
			 * FRONT
			 */

			/**
			 * Front fragment inner face
			 */
			if (this.fillFrontInner) {
				if (s.type === 'Front') {
					var innerFace = new JenScript.SVGElement().name('path')
												.attr('d',s.innerFace)
												.attr('opacity',this.alphaFill)
												.attr('fill',s.themeColor)
												.buildHTML();
					//g2d.insertSVG(innerFace);
					donut3d.svg.donutRoot.appendChild(innerFace);
				}
				
			}
			/**
			 * Front fragment bottom face
			 */
			if (this.fillFrontBottom) {
				if (s.type === 'Front') {
					var bottomFace = new JenScript.SVGElement().name('path')
												.attr('d',s.bottomFace)
												.attr('opacity',this.alphaFill)
												.attr('fill',s.themeColor)
												.buildHTML();
					//g2d.insertSVG(bottomFace);
					donut3d.svg.donutRoot.appendChild(bottomFace);
				}
			}
			
			/**
			 * Front fragment start and end face
			 */
			if (this.fillFrontStart) {
				if (s.type === 'Front') {
					if (s.parentSlice.isFirst(s)) {
						var startFace = new JenScript.SVGElement().name('path')
																.attr('d',s.startFace)
																.attr('opacity',this.alphaFill)
																.attr('fill',s.themeColor)
																.buildHTML();
						//g2d.insertSVG(startFace);
						donut3d.svg.donutRoot.appendChild(startFace);
						
						if (s.parentSlice.isFirst(s) && (s.startAngleDegree < 90 || s.startAngleDegree > 270)) {
							//paintStartEffect(g2d, donut3d, s);
						}
					}

				}
			}

			if (this.fillFrontEnd) {
				if (s.type === 'Front') {
					if (s.parentSlice.isLast(s)) {
						var endFace = new JenScript.SVGElement().name('path')
																.attr('d',s.endFace)
																.attr('opacity',this.alphaFill)
																.attr('fill',s.themeColor)
																.buildHTML();
						//g2d.insertSVG(endFace);
						donut3d.svg.donutRoot.appendChild(endFace);
						
						if (s.parentSlice.isLast(s) && (s.endAngleDegree > 90 && s.endAngleDegree < 270)) {
							//paintEndEffect(g2d, donut3d, s);
						}
					}
				}
			}

			/**
			 * Front fragment outer face
			 */
			if (this.fillFrontOuter) {
				if (s.type === 'Front') {
					var outerFace = new JenScript.SVGElement().name('path')
														.attr('d',s.outerFace)
														.attr('opacity',this.alphaFill)
														.attr('fill',s.themeColor)
														.buildHTML();
					//g2d.insertSVG(outerFace);
					donut3d.svg.donutRoot.appendChild(outerFace);
				}
			}
			/**
			 * Front fragment top face
			 */
			if (this.fillFrontTop) {
				if (s.type === 'Front') {
					var topFace = new JenScript.SVGElement().name('path')
														.attr('d',s.topFace)
														.attr('opacity',this.alphaFill)
														.attr('fill',s.themeColor)
														.buildHTML();
					//g2d.insertSVG(topFace);
					donut3d.svg.donutRoot.appendChild(topFace);
				}
			}
		},
		
	});
})();
(function(){
	
	
	/**
	 * Object Donut3DAbstractLabel()
	 * Defines Donut3D Abstract Label
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
	JenScript.Donut3DAbstractLabel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut3DAbstractLabel,JenScript.AbstractLabel);
	JenScript.Model.addMethods(JenScript.Donut3DAbstractLabel,{
		
		/**
		 * Initialize Abstract Donut3D Label
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
		 * Abstract label paint for Donut3D 
		 */
		paintDonut3DSliceLabel : function(g2d,slice){
			throw new Error('paintDonut3DSliceLabel method should be provide by override');
		}
		
	});
	
	/**
	 * Object Donut3DBorderLabel()
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
	JenScript.Donut3DBorderLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut3DBorderLabel, JenScript.Donut3DAbstractLabel);
	JenScript.Model.addMethods(JenScript.Donut3DBorderLabel, {
		
		/**
		 * Initialize Donut3D Border Label, a label which is paint on the donut border left or right side 
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
			config.name = 'JenScript.Donut3DBorderLabel';
			JenScript.Donut3DAbstractLabel.call(this, config);
		},
		
		/**
		 * set margin for this border label
		 * @param {Object} margin
		 */
		setMargin : function(margin){
			this.margin = margin;
			//this.slice.donut.plugin.repaintPlugin(); // think to lighter repaint mechanism
			
			//cool alternative
			var g2d = this.slice.donut.plugin.getGraphicsContext(JenScript.ViewPart.Device);
			this.paintDonut3DSliceLabel(g2d,this.slice);
		},
		
		/**
		 * set links extends for this border label
		 * @param {Object} margin
		 */
		setLinkExtends : function(linkExtends){
			this.linkExtends = linkExtends;
			//this.slice.donut.plugin.repaintPlugin();
			
			var g2d = this.slice.donut.plugin.getGraphicsContext(JenScript.ViewPart.Device);
			this.paintDonut3DSliceLabel(g2d,this.slice);
		},
		
		/**
		 * paint donut3D slice border label
		 * @param {Object} g2d the graphics context
		 * @param {Object} slice
		 */
		paintDonut3DSliceLabel : function(g2d, slice) {
			var pc = slice.donut.getDonutCenter();
		      
	        var medianDegree = slice.startAngleDegree + Math.abs(slice.endAngleDegree - slice.startAngleDegree) / 2;
	        if (medianDegree >= 360) {
	            medianDegree = medianDegree - 360;
	        }

	        var px1 = pc.x + (slice.donut.outerA + slice.divergence)
	                * Math.cos(JenScript.Math.toRadians(medianDegree));
	        var py1 = pc.y - (slice.donut.outerB + slice.divergence)
	                * Math.sin(JenScript.Math.toRadians(medianDegree));

	        var px2 = pc.x
	                + (slice.donut.outerA + this.linkExtends + slice.divergence)
	                * Math.cos(JenScript.Math.toRadians(medianDegree));
	        var py2 = pc.y
	                - (slice.donut.outerB + this.linkExtends + slice.divergence)
	                * Math.sin(JenScript.Math.toRadians(medianDegree));

	        var px3 = 0;
	        var py3 = py2;
	        var px4 = 0;
	        var py4 = py2;
	        var pos = 'middle';
	        if (medianDegree >= 270 && medianDegree <= 360
	                || medianDegree >= 0 && medianDegree <= 90) {
	            px3 = pc.x + slice.donut.outerA + this.margin  - 5;
	            px4 = pc.x + slice.donut.outerA + this.margin  + 5;
	            
	            pos='start';
	            if(medianDegree === 270)
	            	pos = 'middle';
	            if(medianDegree === 90)
	            	pos = 'middle';
	        }
	        else {// 90-->270
	            px3 = pc.x- slice.donut.outerA - this.margin + 5;
	            px4 = pc.x- slice.donut.outerA - this.margin -5;
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
	 * Object Donut3DRadialLabel()
	 * Defines Donut3D Radial Label, a label which is paint on the median radian segment of slice
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
	JenScript.Donut3DRadialLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut3DRadialLabel, JenScript.Donut3DAbstractLabel);
	JenScript.Model.addMethods(JenScript.Donut3DRadialLabel,{
		
		/**
		 * Initialize Donut3D Radial Label, a label which is paint on the median radian segment of slice
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
			config.name = 'JenScript.Donut3DRadialLabel';
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
		paintDonut3DSliceLabel : function(g2d, slice) {
			var anchor = {
				x : slice.sc.x + (slice.donut.outerA + this.offsetRadius)
						* Math.cos(JenScript.Math.toRadians(slice.medianDegree)),
				y : slice.sc.y - (slice.donut.outerB + this.offsetRadius)
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
	
	JenScript.Donut3DBuilder = function(view,projection,config) {
		view.registerProjection(projection);
		var dp = new JenScript.Donut3DPlugin();
		projection.registerPlugin(dp);
		
		var donut = new JenScript.Donut3D(config);
		dp.addDonut(donut);
		
		var labels = [];
		var slices = [];
		var lastSlice;
		
		//improve with index 
		var slice = function(config){
			var s = new JenScript.Donut3DSlice(config);
			lastSlice = s;
			donut.addSlice(s);
			slices.push(s);
			return this;
		}
		var label = function(type,config){
			var l;
			if('radial' === type)
				l = new JenScript.Donut3DRadialLabel(config);
			if('border' === type)
				l = new JenScript.Donut3DBorderLabel(config);
			lastSlice.addSliceLabel(l);
			labels.push(l);
			return this;
		}
		
		var effect = function(type, config){
			var fx;
			if('reflection' === type)
				fx = new JenScript.Donut3DReflectionEffect(config);
			donut.addEffect(fx);
			effects.push(fx);
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
			reflectFx : reflectFx,
			
			view : function(){return view;},
			projection : function(){return projection;},
			donut : function(){return donut;},
			labels : function(){return labels;},
			slices : function(){return slice;},
		};
	};
})();


(function(){

	/**
	 * Object AbstractDonut3DEffect()
	 * Defines Abstract Donut3D Effect
	 * @param {Object} config
	 * @param {Object} [config.name] donut effect name
	 */
	JenScript.AbstractDonut3DEffect = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractDonut3DEffect,{
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
	     * effect donut 3D
	     * @param {Object} g2d
	     * @param {Object} donut3D
	     */
	    effectDonut3D : function(g2d,donut3D){}
	});
	
	
	
	/**
	 * Object Donut3DReflectionEffect()
	 * Defines Donut3D Reflection Effect
	 * @param {Object} config
	 * @param {Object} [config.deviation]
	 * @param {Object} [config.opacity]
	 */
	JenScript.Donut3DReflectionEffect = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut3DReflectionEffect, JenScript.AbstractDonut3DEffect);
	JenScript.Model.addMethods(JenScript.Donut3DReflectionEffect,{
		
		/**
		 * Initialize Donut3D Reflection Effect
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
			config.name = "JenScript.Donut3DReflectionEffect";
			JenScript.AbstractDonut3DEffect.call(this,config);
		},
		
		/**
		 * Paint donut reflection effect
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut 
		 */
		effectDonut3D : function(g2d, donut) {
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