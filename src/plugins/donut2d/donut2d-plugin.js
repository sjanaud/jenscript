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
		fireDonutEvent : function(action,slice,deviceX,deviceY){
			for (var l = 0; l < this.donutListeners.length; l++) {
				if(this.donutListeners[l].action === action){
					var dp = new JenScript.Point2D(deviceX,deviceY);
					slice.devicePoint = dp;
					this.donutListeners[l].onEvent(slice);
				}
			}
		},
		
		dispatchDonutAction : function(evt,action,deviceX,deviceY){
			
			var that = this;
			var fire1 = function(slice){
				if(action === 'move'){
					if(!slice.lockRollover){
						
						slice.lockRollover = true;
						that.fireDonutEvent('enter',slice,deviceX,deviceY);
						that.fireDonutEvent('move',slice,deviceX,deviceY);
					}else{
						that.fireDonutEvent('move',slice,deviceX,deviceY);
					}
				}
				else if(action === 'press'){
					//slice.lockPress = true;
					that.fireDonutEvent('press',slice,deviceX,deviceY);
				}
				else if(action === 'release' ){
					//slice.lockPress = false;
					that.fireDonutEvent('release',slice,deviceX,deviceY);
				}
				else{
					
				}
			};
			var fire2 = function(slice){
				//console.log('fire 2 for slice : '+slice.name);
				if(action === 'move' && slice.lockRollover){
					slice.lockRollover = false;
					that.fireDonutEvent('exit',slice,deviceX,deviceY);
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
						var labels = slice.getSliceLabels();
						for (var l = 0; l < labels.length; l++) {
							labels[l].paintDonut2DSliceLabel(g2d,slice);
						}
					}
				}
			}
		}
	});
})();