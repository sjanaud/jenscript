(function(){
	
	
	JenScript.ZoomMapWheelPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ZoomMapWheelPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.ZoomMapWheelPlugin, {
		_init : function(config){
			config = config || {};
			
			config.name =  "ZoomMapWheelPlugin";
			config.selectable = false;
			config.priority = 1000;
			this.increment = (config.increment !== undefined)?config.increment : 1;
			
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
		
		onMove: function(evt,part,x,y){
			var p = new JenScript.Point2D(x,y);
			this.mp = this.getProjection().pixelToUser(p);
			//console.log('set position mp :'+this.mp);
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
				exe(evt.deltaY);
			}
		},
	
		/**
		 * bound zoom in
		 */
		zoomIn : function() {
			if(this.stopWheel) return;
			this.getProjection().setLevel(this.getProjection().getLevel()+this.increment);
			if(this.mp !== undefined){
				//this.getProjection().setCenterPosition(this.mp);
			}
			
//			var that = this;
//			var exec = function(i){
//				setTimeout(function(){
//					that.getProjection().setLevel(that.getProjection().getLevel()+1/5);
//					if(that.mp !== undefined){
//						//this.getProjection().setCenterPosition(this.mp);
//					}
//				},i*10);
//			};
//			
//			
//			for (var i = 0; i <5; i++) {
//				exec(i);
//			}
			this.fireWheelEvent('zoomIn');
		},

		/**
		 * bound zoom out
		 */
		 zoomOut : function() {
			if(this.stopWheel) return;
			this.getProjection().setLevel(this.getProjection().getLevel()-this.increment);
			if(this.mp !== undefined){
				//this.getProjection().setCenterPosition(this.mp);
			}
//			var that = this;
//			var exec = function(i){
//				setTimeout(function(){
//					that.getProjection().setLevel(that.getProjection().getLevel()-1/5);
//					if(that.mp !== undefined){
//						//this.getProjection().setCenterPosition(this.mp);
//					}
//				},i*10);
//			};
//			for (var i = 0; i <5; i++) {
//				exec(i);
//			}
			this.fireWheelEvent('zoomOut');
		}
	});	
})();