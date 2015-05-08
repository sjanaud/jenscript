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
		    this.host;

		    /** slices of this donut 3D */
		    this.slices = [];
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
						that.host.repaint();
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
					
					that.host.repaintDonuts();
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
	        this.host.repaintDonuts();
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
	            return this.host.getProjection().userToPixel({x:this.centerX,y: this.centerY});
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