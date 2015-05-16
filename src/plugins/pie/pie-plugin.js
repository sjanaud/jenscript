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
						that.firePieEvent('enter',slice);
						that.firePieEvent('move',slice);
					}else{
						that.firePieEvent('move',slice);
					}
				}
				else if(action === 'press'){
					that.firePieEvent('press',slice);
				}
				else if(action === 'release' ){
					that.firePieEvent('release',slice);
				}
				else{
					
				}
			};
			var fire2 = function(slice){
				if(action === 'move' && slice.lockRollover){
					slice.lockRollover = false;
					that.firePieEvent('exit',slice);
					return true;	
				}else{
					
				}
			};
			for (var i = 0; i < this.pies.length; i++) {
				var pie = this.pies[i];
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
				}
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
					pie.svg.pieRoot = new JenScript.SVGGroup().Id(pie.Id).toSVG();
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
						
						//slice stroke ?
						
						//slice fill?
						
						if (s.getSliceLabel() !== undefined) {
							s.getSliceLabel().paintPieSliceLabel(g2d, s);
						}
					}
				}
			}
		}
	});

	
})();