(function(){
	
	JenScript.MapSemanticZoomPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MapSemanticZoomPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.MapSemanticZoomPlugin,{
		
		_init : function(config){
			config = config || {};
			config.priority = 1000;
			this.increment = 0.1;
			this.slaves = (config.slaves !== undefined)? config.slaves : [];
			config.name ='MapSemanticZoomPlugin';
			JenScript.Plugin.call(this, config);
		},
		
		onWheel : function(evt,part,x,y){
			evt.preventDefault();
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
			this.semantic(this.increment);
		},

		/**
		 * bound zoom out
		 */
		 zoomOut : function() {
			this.semantic(-this.increment);
		 },
		 
		 
		 u2p : function(plugin,u){
			 var p = this.getProjection().userToPixel(u);
			 return new JenScript.Point2D(p.x*plugin.sx+plugin.tx,p.y*plugin.sy+plugin.ty);
		 },
		 
		 p2u : function(plugin,p){
			 //??
			return this.getProjection().pixelToUser(new JenScript.Point2D((p.x-plugin.tx)/plugin.sx,(p.y-plugin.ty)/plugin.sy));
			//return this.getProjection().pixelToUser(new JenScript.Point2D(p.x/plugin.sx-plugin.tx,p.y/plugin.sy-plugin.ty));
		 },
		
		 
		 /***
		  * assign new scale transform and reset the translate transform to keep map centered
		  */
		 semantic : function(delta){
			
			for (var s = 0; s < this.slaves.length; s++) {
				var plugin = this.slaves[s];
				
				var w = this.getProjection().getView().getDevice().getWidth();
				var h = this.getProjection().getView().getDevice().getHeight();
				
				var oldCenterUser 	= this.p2u(plugin,new JenScript.Point2D(w/2,h/2));
				
				var sx = plugin.sx + delta;
				var sy = plugin.sy + delta;
				plugin.scale(sx,sy);
				
				//new geo and pixel center
				var newCenterUser 	= this.p2u(plugin,new JenScript.Point2D(w/2,h/2));
				var pixelCenter 	= this.u2p(plugin,newCenterUser);
				
				//do after scale
				var pixelCenter2 	= this.u2p(plugin,oldCenterUser);
				plugin.translate(plugin.tx-(pixelCenter2.x-pixelCenter.x), plugin.ty-(pixelCenter2.y-pixelCenter.y));
			}
		 }
			
	});
})();