(function(){
	
	JenScript.ZoomWheelMode = function(mode) {
		this.mode = mode.toLowerCase();
		
		this.isWx= function(){
			return (this.mode === 'x' || this.mode === 'wx' || this.mode === 'wheelx');
		};
		this.isWy= function(){
			return (this.mode === 'y' || this.mode === 'wy' || this.mode === 'wheely');
		};
		this.isWxy= function(){
			return (this.mode === 'xy' || this.mode === 'wxy' || this.mode === 'wheelxy');
		};
	};
	
	JenScript.ZoomWheelPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ZoomWheelPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.ZoomWheelPlugin, {
		_init : function(config){
			config = config || {};
			
			config.name =  "ZoomWheelPlugin";
			config.selectable = false;
			config.priority = 1000;
			this.mode = (config.mode !== undefined) ? new JenScript.ZoomWheelMode(config.mode) : new JenScript.ZoomWheelMode('xy');
			
			/** zoom wheel multiplier, deltaY is always +1,-1, then deltaY is multiply */
			this.multiplier = (config.multiplier !== undefined) ? config.multiplier : 2;
			
			/** zoom wheel factor that get the projection fraction factor to increase/decrease*/
			this.factor = 60;
			
			this.wheelListeners = [];
			JenScript.Plugin.call(this,config);
		},
		
		addWheelListener : function(actionEvent,listener,name) {
			var l={action:actionEvent,onEvent:listener,name:name};
			this.wheelListeners[this.wheelListeners.length] = l;
		},
		
		fireWheelEvent : function(action){
			for(var i = 0 ;i<this.wheelListeners.length;i++){
				var l = this.wheelListeners[i];
				if(l.action === action)
					l.onEvent(this);
			}
		},
		
		onPress : function(evt,part,x,y){
			this.stopWheel = true;
		},
		
		onRelease : function(evt,part,x,y){
			this.stopWheel = false;
		},
		
		onWheel : function(evt,part,x,y){
			evt.preventDefault();
			//console.log('zoomWheel onWheel');
			
			var that=this;
			var temporizeIn = function(i){
				setTimeout(function(){
					that.zoomIn();
				},100*i);
			};
			var temporizeOut = function(i){
				setTimeout(function(){
					that.zoomOut();
				},100*i);
			};
			
			var exe = function(rotation){
				if (rotation < 0) {
					var count = -rotation;
					for (var i = 0; i < count; i++) {
						temporizeIn(i);
					}
				} else {
					var count = rotation;
					for (var i = 0; i < count; i++) {
						temporizeOut(i);
					}
				}
			};
			
			if(evt.deltaY){
				exe(evt.deltaY*this.multiplier);
			}
		},
	
		/**
		 * bound zoom in
		 */
		zoomIn : function() {
			if(this.stopWheel) return;
			//console.log("zoom in");
			var w = this.getProjection().getPixelWidth();
			var h = this.getProjection().getPixelHeight();
			var pMinXMinYDevice = undefined;
			var pMaxXMaxYDevice = undefined;
			if (this.mode.isWxy()) {
				pMinXMinYDevice = {x:w / this.factor, y:h - h / this.factor};
				pMaxXMaxYDevice = {x:w - w / this.factor,y: h / this.factor};
			} else if (this.mode.isWx()) {
				pMinXMinYDevice = {x:w / this.factor,y: h};
				pMaxXMaxYDevice = {x:w - w / this.factor,y: 0};
			} else if (this.mode.isWy()) {
				pMinXMinYDevice = {x:0, y:h - h / this.factor};
				pMaxXMaxYDevice = {x:w, y:h / this.factor};
			}
			var pMinXMinYUser = this.getProjection().pixelToUser(pMinXMinYDevice);
			var pMaxXMaxYUser = this.getProjection().pixelToUser(pMaxXMaxYDevice);
			//if (getWindow2D() instanceof Window2D.Linear) {
				//Window2D.Linear wl = (Window2D.Linear) getWindow2D();
				this.getProjection().bound(pMinXMinYUser.x, pMaxXMaxYUser.x, pMinXMinYUser.y, pMaxXMaxYUser.y);
			//}
				this.fireWheelEvent('zoomIn');
		},

		/**
		 * bound zoom out
		 */
		 zoomOut : function() {
			 if(this.stopWheel) return;
			 //console.log("zoom out");
			var w = this.getProjection().getPixelWidth();
			var h = this.getProjection().getPixelHeight();
			var pMinXMinYDevice = undefined;
			var pMaxXMaxYDevice = undefined;
			if (this.mode.isWxy()) {
				pMinXMinYDevice = {x:-w / this.factor,y: h + h / this.factor};
				pMaxXMaxYDevice = {x:w + w / this.factor,y: -h / this.factor};
			} else if (this.mode.isWx()) {
				pMinXMinYDevice = {x:-w / this.factor, y:h};
				pMaxXMaxYDevice = {x:w + w / this.factor,y: 0};
			} else if (this.mode.isWy()) {
				pMinXMinYDevice = {x:0,y: h + h / this.factor};
				pMaxXMaxYDevice = {x:w,y: -h / this.factor};
			}
			var pMinXMinYUser = this.getProjection().pixelToUser(pMinXMinYDevice);
			var pMaxXMaxYUser = this.getProjection().pixelToUser(pMaxXMaxYDevice);
			//if (getWindow2D() instanceof Window2D.Linear) {
			//	Window2D.Linear wl = (Window2D.Linear) getWindow2D();
				this.getProjection().bound(pMinXMinYUser.x, pMaxXMaxYUser.x, pMinXMinYUser.y, pMaxXMaxYUser.y);
				this.fireWheelEvent('zoomOut');
			//}
		}
	});	
})();