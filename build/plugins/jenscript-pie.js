// JenScript -  JavaScript HTML5/SVG Library
// version : 1.3.1
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-06-02
// All Rights reserved

(function(){
	/**
	 * Pie Plugin takes the responsibility to paint pies
	 */
	JenScript.PiePlugin = function(config) {
		config = config || {};
		this.pies = [];
		this.pieListeners=[];
		JenScript.Plugin.call(this,{ name : "PiePlugin"});
	};
	JenScript.Model.inheritPrototype(JenScript.PiePlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.PiePlugin, {
		
		/**
		 * add the given pie in this pie plugin
		 * @param pie
		 */
		addPie : function(pie) {
			pie.plugin = this;
			this.pies[this.pies.length] = pie;
			this.repaintPlugin();
		},
		
		/**
		 * override, on bound change repaint the plugin
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'Pie projection bound changed');
		},
		
		/**
		 * add Pie listener such as press, release, move, enter, exit
		 * @param {String} actionEvent 
		 * @param {Function} listener
		 */
		addPieListener : function(actionEvent,listener) {
			var l={action:actionEvent,onEvent : listener};
			this.pieListeners[this.pieListeners.length] = l;
		},
		
		/**
		 * fire pie event
		 */
		firePieEvent : function(action,slice){
			for (var l = 0; l < this.pieListeners.length; l++) {
				if(this.pieListeners[l].action === action){
					this.pieListeners[l].onEvent(slice);
				}
			}
		},
		
		/**
		 * dispatch action
		 */
		dispatchPieAction : function(evt,action,deviceX,deviceY){
			var that = this;
			var fire1 = function(slice){
				if(action === 'move'){
					if(!slice.lockRollover){
						slice.lockRollover = true;
						that.firePieEvent('enter',{slice : slice, x:deviceX,y:deviceY, device :{x:deviceX,y:deviceY}});
						that.firePieEvent('move',{slice : slice, x:deviceX,y:deviceY, device :{x:deviceX,y:deviceY}});
					}else{
						that.firePieEvent('move',{slice : slice, x:deviceX,y:deviceY, device :{x:deviceX,y:deviceY}});
					}
				}
				else if(action === 'press'){
					that.firePieEvent('press',{slice : slice, x:deviceX,y:deviceY, device :{x:deviceX,y:deviceY}});
				}
				else if(action === 'release' ){
					that.firePieEvent('release',{slice : slice, x:deviceX,y:deviceY, device :{x:deviceX,y:deviceY}});
				}
				else{
					
				}
			};
			var fire2 = function(slice){
				if(action === 'move' && slice.lockRollover){
					slice.lockRollover = false;
					that.firePieEvent('exit',{slice : slice, x:deviceX,y:deviceY, device :{x:deviceX,y:deviceY}});
					return true;	
				}else{
					
				}
			};
			for (var i = 0; i < this.pies.length; i++) {
				var pie = this.pies[i];
				if(pie.solved){
				for (var s = 0; s < pie.slices.length; s++) {
					var slice = pie.slices[s];
					var distance = Math.sqrt((slice.sc.y - deviceY)*(slice.sc.y - deviceY) + (slice.sc.x - deviceX)*(slice.sc.x - deviceX));
					var theta =0;
					if(distance < pie.radius){
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
						if(JenScript.Math.toDegrees(theta) > slice.startAngleDegree && JenScript.Math.toDegrees(theta)<(slice.startAngleDegree+slice.extendsDegree)){
							fire1(slice);
						}
						else if(JenScript.Math.toDegrees(theta) < slice.startAngleDegree && (slice.startAngleDegree+slice.extendsDegree) > 360 && ((slice.startAngleDegree+slice.extendsDegree)-360)>=JenScript.Math.toDegrees(theta)){
							fire1(slice);
						}
						else{
							fire2(slice);
						}
					}else{
						fire2(slice);
					}
				}}
			}
			return false;
		},
		
		onPress : function(evt,part,x,y){
			 this.dispatchPieAction(evt,'press',x,y);
		},

		onRelease : function(evt,part,x,y){
			 this.dispatchPieAction(evt,'release',x,y);
		},

		onMove : function(evt,part,x,y){
			 this.dispatchPieAction(evt,'move',x,y);
		},

		onClick : function(evt,part,x,y){
			 this.dispatchPieAction(evt,'click',x,y);
		},

		onEnter : function(evt,part,x,y){
			 this.dispatchPieAction(evt,'enter',x,y);
		},
		
		onExit : function(evt,part,x,y){
			 this.dispatchPieAction(evt,'exit',x,y);
		},
		
		/**
		 * paint pie plugin
		 * @param {Object} graphics context
		 * @param {String} view part
		 */
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			for (var i = 0; i < this.pies.length; i++) {
				var pie = this.pies[i];
				if(pie.isSolvable()){
					pie.solvePie();
					
					g2d.deleteGraphicsElement(pie.Id);
					pie.svg.pieRoot = new JenScript.SVGGroup().Id(pie.Id).opacity(pie.opacity).toSVG();
					g2d.insertSVG(pie.svg.pieRoot);
					
					if(pie.stroke !== undefined){
						pie.stroke.strokePie(g2d, pie);
					}
					
					if (pie.fill !== undefined) {
						pie.fill.fillPie(g2d, pie);
					}
										
					for (var j = 0; j < pie.effects.length; j++) {
						pie.effects[j].paintPieEffect(g2d, pie);
					}
					
					for (var j = 0; j < pie.slices.length; j++) {
						var s = pie.slices[j];
						
						//re fill/re stroke by slice for secondary paint style?
						//slice stroke ?
						//slice fill?
						
						//route graphics to pieRoot
						var g2dIn = new JenScript.Graphics({definitions : this.svgPluginPartsDefinitions[part],graphics : pie.svg.pieRoot, selectors : this.getProjection().getView().svgSelectors});
						if (s.getSliceLabel() !== undefined) {
							s.getSliceLabel().paintPieSliceLabel(g2dIn, s);
						}
					}
					
					
				}
			}
		}
	});

	
})();
(function(){
	/**
	 * Object Pie()
	 * Defines Pie
	 * @constructor
	 * @param {Object} config the pie configuration
	 * @param {Object} [config.name] pie name
	 * @param {Object} [config.radius] pie radius in pixel
	 * @param {Object} [config.opacity] pie opacity
	 * @param {Object} [config.nature] pie projection nature, User or Device
	 * @param {Object} [config.x] pie center x, depends on projection nature
	 * @param {Object} [config.y] pie center y, depends on projection nature
	 * @param {Object} [config.startAngleDegree] pie center y, depends on projection nature
	 * 
	 */
	JenScript.Pie = function(config){
		this.init(config);
	};
	
	JenScript.Model.addMethods(JenScript.Pie,{
		
		init : function(config){
			config = config||{};
			this.name = (config.name !== undefined)?config.name:'Pie name undefined';
			this.Id = (config.Id !== undefined)?config.Id:'pie'+JenScript.sequenceId++;
			this.x =  (config.x !== undefined)?config.x:0;
			this.y =  (config.y !== undefined)?config.y:0;
			this.radius =  (config.radius !== undefined)?config.radius:80;
			this.opacity =  (config.opacity !== undefined)?config.opacity:1;
			this.startAngleDegree =  (config.startAngleDegree !== undefined)?config.startAngleDegree:0;
			this.nature =  (config.nature !== undefined)?config.nature:'User';
			this.effects= [];
			this.slices = [];
			this.svg= {};
			
			//TODO paint strategy : stream or final render?
			//check is this paint strategy pattern is good enough ?
			//really need paint strategy? paint is fast enough? wait for user feedback...
			
			this.paint = true;
		},
		
		/**
		 * repaint pie
		 */
		repaint : function(){
			if(this.plugin !== undefined && this.paint)
			this.plugin.repaintPlugin();
		},
		
		/**
		 * set pie center x
		 * @param {Number} pie center x
		 */
		setX : function(x) {
			this.x = x;
			this.repaint();
		},

		/**
		 * get pie center x
		 * @returns {Number} get pie center x
		 */
		getX : function() {
			return this.x;
		},

		/**
		 * set pie center y
		 * @param {Number} pie center y
		 */
		setY : function(y) {
			this.y = y;
			this.repaint();
		},

		/**
		 * get pie center y
		 * @returns {Number} get pie center y
		 */
		getY : function() {
			return this.y;
		},

		/**
		 * set pie radius in pixel
		 * @param {Number} pie radius
		 */
		setRadius : function(radius) {
			this.radius = radius;
			this.repaint();
		},

		/**
		 * get pie radius in pixel
		 * @returns {Number} get pie radius
		 */
		getRadius : function() {
			return this.radius;
		},

		/**
		 * set pie projection nature, user or Device
		 * @param {String} projection nature to set
		 */
		setNature : function(nature) {
			this.nature = nature;
			this.repaint();
		},

		/**
		 * get pie projection nature, user or Device
		 * @returns {String} get projection nature
		 */
		getNature : function() {
			return this.nature;
		},

		/**
		 * set pie start angle degreee
		 * @param {Number} start angle degree to set
		 */
		setStartAngleDegree : function(startAngleDegree) {
			this.startAngleDegree = startAngleDegree;
			this.repaint();
		},

		/**
		 * set pie start angle degreee
		 * @returns {Number} ge start angle degree
		 */
		getStartAngleDegree : function() {
			return this.startAngleDegree;
		},
		
		/**
		 * add pie effect
		 * @param {Object} effect to add
		 */
		addEffect : function(effect) {
			this.effects[this.effects.length] = effect;
			this.repaint();
		},
		
		/**
		 * set pie stroke
		 * @param {Object} stroke to set
		 */
		setStroke : function(stroke) {
			this.stroke = stroke;
			this.repaint();
		},

		/**
		 * set pie fill
		 * @param {Object} fill to set
		 */
		setFill : function(fill) {
			this.fill = fill;
			this.repaint();
		},

		/**
		 * add slice in this pie
		 * @param {Object} slice
		 *  @returns this pie
		 */
		addSlice : function(slice) {
			slice.pie = this;
			this.slices[this.slices.length] = slice;
			this.repaint();
			return this;
		},
		
		
		/**
		 * generate a slice with given config, add in pie and return pie.
		 * @param {Object} config slice configuration
		 * @returns this pie
		 */
		slice : function(config){
			var s = new JenScript.PieSlice(config);
			this.addSlice(s);
			return this;
		},
		
		 /**
		  * add slices array in this pie
		  * @param {Object} slice
		  * @returns this pie
		  */
		 addSlices : function (slices) {
	       for (var s = 0; s < slices.length; s++) {
	    	   this.addSlice(slices[s]);
	       }
	       return this;
		 },

		/**
		 * build the given slice
		 * @param {Object} slice The slice to build
		 */
		buildSlice : function(slice) {
		
			var deltaDegree = slice.getRatio() * 360;
			slice.extendsDegree = deltaDegree;
			
			if (this.startAngleDegree > 360)
				this.startAngleDegree = this.startAngleDegree - 360;

			slice.startAngleDegree = this.startAngleDegree;
			slice.endAngleDegree = this.startAngleDegree+deltaDegree;
			var medianDegree = this.startAngleDegree + deltaDegree/2;
			if (medianDegree > 360)
				medianDegree = medianDegree - 360;

			slice.medianDegree = medianDegree;
			
			var polar = function(origin,radius,angle){
				return {
					x : origin.x + radius* Math.cos(JenScript.Math.toRadians(angle)),
					y : origin.y - radius* Math.sin(JenScript.Math.toRadians(angle))
				};
			};
			var sc = polar(this.buildCenter,slice.divergence,medianDegree);
			var ss = polar(sc,this.radius,slice.startAngleDegree);
			var se = polar(sc,this.radius,slice.endAngleDegree);
			slice.sc = sc;
			slice.ss = ss;
			slice.se = se;
			
			var largeArcFlag = "0";
			if (deltaDegree > 180) {
				largeArcFlag = "1";
			}

			slice.svgPath = "M" + ss.x + "," + ss.y + " A" + this.radius + ","
					+ this.radius + " 0 " + largeArcFlag + ",0 " + se.x + ","
					+ se.y + " L" + sc.x + "," + sc.y + " Z";

			this.startAngleDegree = this.startAngleDegree + deltaDegree;
		},
		
		 /**
	     * compute buildCenterX and buildCenterY with given projection nature
	     */
	    projection : function() {
	        if (this.nature == 'User') {
	            var projectedCenter = this.plugin.getProjection().userToPixel(new JenScript.Point2D(this.x,this.y));
	            this.buildCenterX = projectedCenter.x;
	            this.buildCenterY = projectedCenter.y;
	            this.buildCenter = new JenScript.Point2D(this.buildCenterX,this.buildCenterY);
	        }
	        else  if (this.nature == 'Device') {
	            this.buildCenterX = this.centerX;
	            this.buildCenterY = this.centerY;
	            this.buildCenter = new JenScript.Point2D(this.buildCenterX,this.buildCenterY);
	        }
	    },
	    

		/**
		 * build pie by slice normalization, center projection and build slices geometry
		 */
		solvePie : function() {
			var that = this;
			var normalization = (function(){
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
			this.projection();
			for (var i = 0; i < this.slices.length; i++) {
				var s = this.slices[i];
				this.buildSlice(s);
			}
			this.solved = true;
		},
		
		/**
		 * true if pie has more one slice, false otherwise
		 * @returns true if pie has more one slice, false otherwise
		 */
		isSolvable : function(){
		    	return this.slices.length > 0;
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
					that.plugin.repaintPlugin();
				},i*100);
			}
		},
		
	});
})();
(function(){
	/**
	 * Defines Pie Slice
	 * @param {Object} config
	 * @param {Object} [config.name] pie slice name
	 * @param {Object} [config.value] pie slice value, this value will be ratio normalized
	 * @param {Object} [config.themeColor] pie slice color, randomized if undefined
	 * @param {Object} [config.divergence] pie divergence from center
	 * 
	 */
	JenScript.PieSlice = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.PieSlice,{
		/**
		 * Defines Pie Slice
		 * @param {Object} config
		 * @param {Object} [config.name] pie slice name
		 * @param {Object} [config.value] pie slice value, this value will be ratio normalized
		 * @param {Object} [config.opacity] slice opacity
		 * @param {Object} [config.themeColor] pie slice color, randomized if undefined
		 * @param {Object} [config.divergence] pie divergence from center
		 * 
		 */
		init: function(config){
			config = config||{};
			this.Id = (config.Id !== undefined)?config.Id:'slice'+JenScript.sequenceId++;
			this.name = (config.name !== undefined)?config.name:'PieSlice name undefined';
			this.value =  (config.value !== undefined)?config.value:1;
			this.opacity =  (config.opacity !== undefined)?config.opacity:1;
			this.themeColor =(config.themeColor !== undefined)?config.themeColor:JenScript.createColor();
			this.divergence =  (config.divergence !== undefined)?config.divergence:0;
			if(this.value < 0 )
			    	throw new Error('Slice value should be greater than 0');
		},
		
		repaint : function(){
			if(this.pie !== undefined)
			this.pie.repaint();
		},
		
		setName : function(name) {
			this.name = name;
		},

		getName : function() {
			return this.name;
		},

		setValue : function(value) {
			if(this.value < 0 )
		    	throw new Error('Slice value should be greater than 0');
			this.value = value;
			this.repaint();
		},

		getValue : function() {
			return this.value;
		},

		getRatio : function() {
			return this.ratio;
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

		setThemeColor : function(themeColor) {
			this.themeColor = themeColor;
			this.repaint();
		},

		getThemeColor : function() {
			return this.themeColor;
		},

		setDivergence : function(divergence) {
			this.divergence = divergence;
			this.repaint();
		},

		getDivergence : function() {
			return this.divergence;
		},
	});
})();
(function(){

	
	/**
	 * Object AbstractPieStroke()
	 * Defines Abstract Pie Stroke
	 * @param {Object} config
	 * @param {String} [config.name] stroke name
	 */
	JenScript.AbstractPieStroke = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractPieStroke,{
		
		/**
		 * Initialize Abstract Pie Stroke
		 * @param {Object} config
		 * @param {String} [config.name] stroke name
		 */
		init: function(config){
			config = config || {};
			this.name = config.name;
		},
		/**
	     * stroke pie
	     * @param {Object} g2d graphics context
	     * @param {Object} pie to stroke
	     */
	    strokePie : function(g2d,pie){}
	});
	
	/**
	 * Object PieDefaultStroke()
	 * Defines Pie Default Stroke
	 * @param {Object} config
	 * @param {String} [config.strokeColor] stroke whole pie with this color
	 * @param {Number} [config.strokeWidth] stroke width
	 */
	JenScript.PieDefaultStroke = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieDefaultStroke,JenScript.AbstractPieStroke);
	JenScript.Model.addMethods(JenScript.PieDefaultStroke,{
		
		/**
		 * Initialize Pie Default Stroke
		 * @param {Object} config
		 * @param {String} [config.strokeColor] stroke whole pie with this color
		 * @param {Number} [config.strokeWidth] stroke width
		 */
		_init : function(config){
			config = config || {};
			/** draw color */
			this.strokeColor = config.strokeColor;
			/** stroke color */
			this.strokeWidth = (config.strokeWidth !== undefined)?config.strokeWidth : 1;
			config.name = "JenScript.PieDefaultStroke";
			JenScript.AbstractPieStroke.call(this,config);
		},
		
		/**
		 * stroke pie
		 * @param {Object} graphics context
		 * @param {Object} pie to stroke
		 */
		strokePie : function(g2d,pie){
	    	for (var i = 0; i < pie.slices.length; i++) {
		        var s = pie.slices[i];
		        
		        var color = (this.strokeColor !== undefined)?this.strokeColor : s.themeColor;
		        var svg = new JenScript.SVGElement().name('path')
								.attr('d',s.svgPath).attr('stroke',color).attr('strokeWidth',this.strokeWidth).attr('fill','none');
	
		        pie.svg.pieRoot.appendChild(svg.buildHTML());
	        }
	    }
	});
})();
(function(){

	/**
	 * Object AbstractPieFill()
	 * Defines Abstract Pie Fill
	 * @param {Object} config
	 * @param {String} [config.name] fill name
	 */
	JenScript.AbstractPieFill = function(config) {
		this.init(config);
	};

	JenScript.AbstractPieFill.prototype = {
			
		/**
		 * Initialize Abstract Pie Fill
		 * @param {Object} config
		 * @param {String} [config.name] fill name
		 */
		init : function(config){
			config = config||{};
			this.Id = (config.Id !== undefined)?config.Id:'_fill'+JenScript.sequenceId++;
			this.opacity =  (config.opacity !== undefined)?config.opacity:1;
			this.name = config.name;
		},
		
		/**
		 * fill pie
		 * @param {Object} g2d graphics context
		 * @param {Object} pie to fill
		 */
		fillPie : function(g2d, pie) {
			throw new Error("Abstract Pie Fill, this method should be provide by overriden.");
		},

	};

	/**
	 * Object PieDefaultFill()
	 * Defines Pie Default Fill
	 * @param {Object} config
	 * @param {String} [config.fillColor] fill color for fill the whole pie
	 */
	JenScript.PieDefaultFill = function(config) {
		this.init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieDefaultFill, JenScript.AbstractPieFill);
	JenScript.Model.addMethods(JenScript.PieDefaultFill,{
		
		/**
		 * Initialize Pie Default Fill
		 * @param {Object} config
		 * @param {String} [config.fillColor] fill color for fill the whole pie
		 */
		_init : function(config){
			config = config || {};
			this.fillColor = config.fillColor;
			config.name = "JenScript.PieDefaultFill";
			JenScript.AbstractPieFill.call(this,config);
		},
		
		/**
		 * default fill pie
		 * @param {Object} g2d graphics context
		 * @param {Object} pie to fill
		 */
		fillPie : function(g2d, pie) {
			var pieFill = new JenScript.SVGGroup().Id(pie.Id+this.Id).opacity(this.opacity).toSVG();
			g2d.deleteGraphicsElement(pie.Id+this.Id);
			
			for (var i = 0; i < pie.slices.length; i++) {
				var s = pie.slices[i];
				var c = (this.fillColor !== undefined)?this.fillColor : s.themeColor;
				var fill = new JenScript.SVGElement().name('path')
													.attr('fill',c)
													.attr('d',s.svgPath)
													.buildHTML();
				
				
				
				var sliceFill = new JenScript.SVGGroup().Id(pie.Id+this.Id+s.Id).opacity(s.opacity).toSVG();
				g2d.deleteGraphicsElement(pie.Id+this.Id+s.Id);
				sliceFill.appendChild(fill);
				pieFill.appendChild(sliceFill);
			}
			
			pie.svg.pieRoot.appendChild(pieFill);
		}
	});
})();
(function(){

	/**
	 * Object AbstractPieEffect()
	 * Defines Abstract Pie Effect
	 * @param {object} config
	 * @param {String} [config.name] the effect name
	 */
	JenScript.AbstractPieEffect = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractPieEffect,{
		/**
		 * Initialize Abstract Pie Effect
		 * @param {object} config
		 * @param {String} [config.name] the effect name
		 */
		init:function(config){
			config = config||{};
			this.Id = (config.Id !== undefined)?config.Id:'_effect'+JenScript.sequenceId++;
			this.name = config.name;
			this.opacity =  (config.opacity !== undefined)?config.opacity:1;
			this.projection = undefined;
		},
		
		/**
		 * set projection to this effect
		 * @param {Object} projection
		 */
		setProjection : function(projection) {
			this.projection = projection;
		},

		/**
		 * get projection to this effect
		 * @returns {Object} projection
		 */
		getProjection : function() {
			return this.projection;
		},

		/**
		 * paint effect on the given pie
		 * @param {Object} the graphics context
		 * @param {Object} the pie
		 */
		paintPieEffect : function(g2d, pie) {
			throw new Error("Abstract Pie Effect, this method should be provide by overriden.");
		}

	});
	
	/**
	 * Object PieReflectionEffect()
	 * Defines Pie Reflection Effect
	 * @param {Object} config
	 * @param {Object} [config.deviation]
	 * @param {Object} [config.opacity]
	 * @param {Object} [config.length]
	 * @param {Object} [config.verticalOffset]
	 */
	JenScript.PieReflectionEffect = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieReflectionEffect, JenScript.AbstractPieEffect);
	JenScript.Model.addMethods(JenScript.PieReflectionEffect,{
		
		/**
		 * Initialize Pie Reflection Effect
		 * @param {Object} config
		 * @param {Object} [config.deviation] blur deviation, default 3 pixels
		 * @param {Object} [config.opacity] effect opacity, default 0.3
		 * @param {Object} [config.verticalOffset] effect vertical offset, default 5 pixels
		 * @param {Object} [config.length] effect length [0,1], 1 reflect whole pie, 0.5 half of the pie, etc
		 */
		_init: function(config){
			config = config || {};
			this.deviation = (config.deviation !== undefined)?config.deviation : 3;
			this.opacity = (config.opacity !== undefined)?config.opacity : 0.3;
			this.length = (config.length !== undefined)?config.length : 0.5;
			this.verticalOffset = (config.verticalOffset !== undefined)?config.verticalOffset : 0;
			config.name = "JenScript.PieReflectionEffect";
			JenScript.AbstractPieEffect.call(this,config);
		},
		
		/**
		 * Paint pie reflection effect
		 * @param {Object} g2d the graphics context
		 * @param {Object} pie 
		 */
		paintPieEffect : function(g2d, pie) {
			
			var pieEffect = new JenScript.SVGGroup().Id(pie.Id+this.Id).opacity(this.opacity).toSVG();
			g2d.deleteGraphicsElement(pie.Id+this.Id);
			
			var bbox = pie.svg.pieRoot.getBBox();
			
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
		
			var e = pie.svg.pieRoot.cloneNode(true);
			e.removeAttribute('id');
			e.setAttribute('filter','url(#'+filterId+')');
			e.setAttribute('transform','translate(0,'+bbox.height+'), scale(1,-1), translate(0,'+(-2*(bbox.y+bbox.height/2)-this.verticalOffset)+')'  );
			e.setAttribute('opacity',this.opacity);
			
			var ng = new JenScript.SVGElement().name('g').buildHTML();
			e.setAttribute('id',e.getAttribute('id')+'_reflection'+JenScript.sequenceId++);
			ng.setAttribute('clip-path','url(#'+clipId+')');
			ng.appendChild(e);
			
			pieEffect.appendChild(ng);
			pie.svg.pieRoot.appendChild(pieEffect);
		}
		
	});

	/**
	 * Object PieLinearEffect()
	 * Defines Pie Linear Effect
	 * @param {Object} config
	 * @param {Object} [config.incidence] the incidence angle degree [0,360]
	 * @param {Number} [config.offset] offset pie radius, [0,..5] depends the pie size and desired effect
	 */
	JenScript.PieLinearEffect = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieLinearEffect, JenScript.AbstractPieEffect);
	JenScript.Model.addMethods(JenScript.PieLinearEffect,{
		/**
		 * Initialize Pie Linear Effect
		 * @param {Object} config
		 * @param {Object} [config.incidence] the incidence angle degree [0,360]
		 * @param {Number} [config.offset] offset pie radius, [0,..5] depends the pie size and desired effect
		 */
		_init: function(config){
			config = config || {};
			config.name = "JenScript.PieLinearEffect";
			this.incidence = (config.incidence !== undefined)?config.incidence : 120;
			this.offset = (config.offset !== undefined)?config.offset : 3;
			this.fillOpacity = (config.fillOpacity !== undefined)?config.fillOpacity : 1;
			this.shader = config.shader;
			this.gradientIds = [];
			JenScript.AbstractPieEffect.call(this, config);
		},
		
		/**
		 * set linear effect incidence degree
		 * @param {Number} incidence in degrees
		 */
		setIncidence : function(incidence) {
			this.incidence = incidence;
		},

		/**
		 * get linear effect incidence in degree
		 * @returns {Object} linear effect incidence
		 */
		getIncidence : function() {
			return this.incidence;
		},

		/**
		 * set offset radius on linear effect
		 * @param {Number} offset
		 */
		setOffserRadius : function(offset) {
			this.offset = offset;
		},
		
		/**
		 * get offset radius of linear effect
		 * @returns {Number} offset
		 */
		getOffserRadius : function() {
			return this.offset;
		},

		/**
		 * Paint pie linear effect
		 * @param {Object} g2d the graphics context
		 * @param {Object} pie 
		 */
		paintPieEffect : function(g2d, pie) {
			
			//TODO : delete redundant gradient according to divergence. create map <divergence, gradient>
			//and delete/create only if needed.
			
			//delete all useless olds gradients
			
			
			var pieEffect = new JenScript.SVGGroup().Id(pie.Id+this.Id).opacity(this.opacity).toSVG();
			g2d.deleteGraphicsElement(pie.Id+this.Id);
			
			for (var i = 0; i < this.gradientIds.length; i++) {
				g2d.deleteGraphicsElement(this.gradientIds[i]);
			}
			this.gradientIds = [];
			
			for (var i = 0; i < pie.slices.length; i++) {
				var s = pie.slices[i];
				var largeArcFlag = "0";
				if (s.extendsDegree > 180) {
					largeArcFlag = "1";
				}
				var polar = function(origin,radius,angle){
					return {
						x : origin.x + radius* Math.cos(JenScript.Math.toRadians(angle)),
						y : origin.y - radius* Math.sin(JenScript.Math.toRadians(angle))
					};
				};
				var ss=polar(s.sc,(pie.radius - this.offset),s.startAngleDegree);
				var se=polar(s.sc,(pie.radius - this.offset),s.endAngleDegree);
				// gradient
				var start = polar(s.sc,(pie.radius - this.offset),this.incidence);
				var end   = polar(s.sc,(pie.radius - this.offset),this.incidence+180);
				var percents = ['0%','49%','51%','100%'];
				var colors = ['rgb(60,60,60)','rgb(255,255,255)','rgb(255,255,255)','rgb(255,255,255)'];
				var opacity = [0.8,0,0,0.8];
				if(this.shader === undefined){
					this.shader = {percents : percents, colors: colors,opacity:opacity};
				}
				
				var gradientSliceId = 'gradient'+JenScript.sequenceId++;
				this.gradientIds[this.gradientIds.length] = gradientSliceId;
				var gradient= new JenScript.SVGLinearGradient().Id(gradientSliceId).from(start.x,start.y).to(end.x, end.y).shade(this.shader.percents,this.shader.colors,this.shader.opacity).toSVG();
				
				g2d.definesSVG(gradient);
				var fxPath = "M" + ss.x + "," + ss.y + " A"
						+ (pie.radius - this.offset) + ","
						+ (pie.radius - this.offset) + " 0 " + largeArcFlag + ",0 "
						+ se.x + "," + se.y + " L" + s.sc.x + "," + s.sc.y + " Z";
				
				var sFx = new JenScript.SVGElement().name('path')
														.attr('fill','url(#'+gradientSliceId+')')
														.attr('d',fxPath)
														.attr('fill-opacity',this.fillOpacity)
														.buildHTML();
			
				g2d.deleteGraphicsElement(pie.Id+this.Id+s.Id);
				var sliceEffect = new JenScript.SVGGroup().Id(pie.Id+this.Id+s.Id).opacity(s.opacity).toSVG();
				
				//s.svg.effects[s.Id+this.Id] = sliceEffect;
				sliceEffect.appendChild(sFx);
				
				//pie.svg.pieRoot.appendChild(sliceEffect);
				pieEffect.appendChild(sliceEffect);
			}
			
			pie.svg.pieRoot.appendChild(pieEffect);
		}
	});
})();
(function(){
	
	
	/**
	 * Object PieAbstractLabel()
	 * Defines Pie Abstract Label
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
	JenScript.PieAbstractLabel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieAbstractLabel,JenScript.AbstractLabel);
	JenScript.Model.addMethods(JenScript.PieAbstractLabel,{
		
		/**
		 * Initialize Abstract Pie Label
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
		 * Abstract label paint for Pie
		 */
		paintPieSliceLabel : function(g2d,slice){
			throw new Error('paintPieSliceLabel method should be provide by override');
		}
		
	});
	
	/**
	 * Object PieBorderLabel()
	 * Defines Pie Border Label, a label which is paint on the pie border left or right side 
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
	 * @param {Number} [config.margin] the margin distance from pie to draw the label
	 * @param {Number} [config.linkExtends] the quad edge control point for label link
	 */
	JenScript.PieBorderLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieBorderLabel, JenScript.PieAbstractLabel);
	JenScript.Model.addMethods(JenScript.PieBorderLabel, {
		
		/**
		 * Initialize Pie Border Label, a label which is paint on the pie border left or right side 
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
		 * @param {Number} [config.margin] the margin distance from pie to draw the label
		 * @param {Number} [config.linkExtends] the quad edge control point for label link
		 */
		__init : function(config){
			config = config || {};
			this.margin = (config.margin !== undefined)? config.margin : 50;
			this.linkExtends = (config.linkExtends !== undefined)? config.linkExtends : 30;
			config.name = 'JenScript.PieBorderLabel';
			JenScript.PieAbstractLabel.call(this, config);
		},
		
		/**
		 * set margin for this border label
		 * @param {Object} margin
		 */
		setMargin : function(margin){
			this.margin = margin;
			this.slice.pie.plugin.repaintPlugin();
		},
		
		/**
		 * set links extends for this border label
		 * @param {Object} margin
		 */
		setLinkExtends : function(linkExtends){
			this.linkExtends = linkExtends;
			this.slice.pie.plugin.repaintPlugin();
		},
		
		/**
		 * paint pie slice border label
		 * @param {Object} g2d the graphics context
		 * @param {Object} slice
		 */
		paintPieSliceLabel : function(g2d, slice) {
		        var radius = slice.pie.radius;
		        var medianDegree = slice.medianDegree;

		     
		        var px1 = slice.pie.buildCenterX + (radius + slice.getDivergence())* Math.cos(JenScript.Math.toRadians(medianDegree));
		        var py1 = slice.pie.buildCenterY - (radius + slice.getDivergence()) * Math.sin(JenScript.Math.toRadians(medianDegree));
		        var px2 = slice.pie.buildCenterX + (radius + this.linkExtends + slice.getDivergence())* Math.cos(JenScript.Math.toRadians(medianDegree));
		        var py2 = slice.pie.buildCenterY- (radius + this.linkExtends + slice.getDivergence()) * Math.sin(JenScript.Math.toRadians(medianDegree));

		        var px3 = 0;
		        var py3 = py2;
		        var px4 = 0;
		        var py4 = py2;
		        var pos = 'middle';
		        if (medianDegree >= 270 && medianDegree <= 360
		                || medianDegree >= 0 && medianDegree <= 90) {
		            px3 = slice.pie.buildCenterX + radius + this.margin  - 5;
		            px4 = slice.pie.buildCenterX + radius + this.margin  + 5;
		            
		            pos='start';
		            if(medianDegree === 270)
		            	pos = 'middle';
		            if(medianDegree === 90)
		            	pos = 'middle';
		        }
		        else {// 90-->270
		            px3 = slice.pie.buildCenterX- radius - this.margin + 5;
		            px4 = slice.pie.buildCenterX- radius - this.margin -5;
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
				this.setOpacity(slice.opacity);
				this.paintLabel(g2d);
				this.svg.label.appendChild(quadlink);
		 }
	});
	
	
	/**
	 * Object PieRadialLabel()
	 * Defines Pie Radial Label, a label which is paint on the median radian segment of slice
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
	 * @param {Number} [config.offsetRadius] the offset radius define the extends radius from pie radius
	 */
	JenScript.PieRadialLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieRadialLabel, JenScript.PieAbstractLabel);
	JenScript.Model.addMethods(JenScript.PieRadialLabel,{
		
		/**
		 * Initialize Pie Radial Label, a label which is paint on the median radian segment of slice
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
		 * @param {Number} [config.offsetRadius] the offset radius define the extends radius from pie radius
		 */
		__init : function(config){
			config = config || {};
			this.offsetRadius = (config.offsetRadius !== undefined)?config.offsetRadius : 20;
			config.name = 'JenScript.PieRadialLabel';
			JenScript.PieAbstractLabel.call(this,config);
		},

		/**
		 * set offset radius for this radial label.
		 * offset radius is the extends distance from radius to draw the radial label
		 * @param {Number} offsetRadius
		 */
		setOffsetRadius : function(offsetRadius) {
			this.offsetRadius = offsetRadius;
			this.slice.pie.plugin.repaintPlugin();
		},
		
		/**
		 * paint slice radial label
		 * @param {Object} g2d the graphics context
		 * @param {Object} slice
		 */
		paintPieSliceLabel : function(g2d, slice) {
			var anchor = {
				x : slice.sc.x + (slice.pie.radius + this.offsetRadius)
						* Math.cos(JenScript.Math.toRadians(slice.medianDegree)),
				y : slice.sc.y - (slice.pie.radius + this.offsetRadius)
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
			this.setOpacity(slice.opacity);
			this.paintLabel(g2d);
		}
	});
})();
(function(){
	
	//R. Module pattern
	
	JenScript.PieBuilder = function(view,projection,config) {
		view.registerProjection(projection);
		var pp = new JenScript.PiePlugin();
		projection.registerPlugin(pp);
		var pie = new JenScript.Pie(config);
		pp.addPie(pie);
		var fill = new JenScript.PieDefaultFill();
		pie.setFill(fill);
		
		var labels = [];
		var slices = [];
		var effects = [];
		var lastSlice;
		
		//improve with index 
		var slice = function(config){
			var s = new JenScript.PieSlice(config);
			lastSlice = s;
			pie.addSlice(s);
			slices.push(s);
			return this;
		}
		var label = function(type,config){
			var l;
			if('radial' === type)
				l = new JenScript.PieRadialLabel(config);
			if('border' === type)
				l = new JenScript.PieBorderLabel(config);
			lastSlice.setSliceLabel(l);
			labels.push(l);
			return this;
		}
		var effect = function(type, config){
			var fx;
			if('linear' === type)
				fx = new JenScript.PieLinearEffect(config);
			if('reflection' === type)
				fx = new JenScript.PieReflectionEffect(config);
			pie.addEffect(fx);
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
			pie : function(){return pie;},
			labels : function(){return labels;},
			slices : function(){return slice;},
			effects : function(){return effects;},
		};
	};
})();

