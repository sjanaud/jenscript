(function(){
	
	JenScript.MapSemanticTranformPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MapSemanticTranformPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.MapSemanticTranformPlugin,{
		
		_init : function(config){
			config = config || {};
			config.priority = 1000;
			this.slaves = (config.slaves !== undefined)? config.slaves : [];
			this.increment = (config.increment !== undefined)? config.increment : 1;
			config.name ='MapSemanticTranformPlugin';
			JenScript.Plugin.call(this, config);
			this.startPoint;
			this.currentPoint;
			this.wheelPoint;
			this.translate = false;
			
			this.factor = (config.factor !== undefined)? config.factor : 1.1;
		},
		
		onPress : function(evt,part,x,y){
			//mozilla, prevent Default to enable dragging correctly
			if(evt.preventDefault){
				evt.preventDefault();
			}
			if(part !== 'Device') return;
			this.translate = true;
			this.startPoint = new JenScript.Point2D(x,y);
		},

		onRelease : function(evt,part,x,y){
			this.translate = false;
		},
		
		onMove : function(evt,part,x,y){
			if(part !== 'Device') return;
			if(!this.translate) return;
			this.affineTranslate(evt,part,x,y);
			this.startPoint = this.currentPoint;
		},
		
		onWheel : function(evt,part,x,y){
			evt.preventDefault();
			var that=this;
			var temporizeIn = function(i){
				setTimeout(function(){
					//that.affineScale(that.increment);
					that.affineScale2(that.factor);
				},20*i);
			};
			var temporizeOut = function(i){
				setTimeout(function(){
					//that.affineScale(-that.increment);
					that.affineScale2(1/that.factor);
				},20*i);
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
		
		 
		 u2p : function(plugin,u){
			 var p = this.getProjection().userToPixel(u);
			 return new JenScript.Point2D(p.x*plugin.sx+plugin.tx,p.y*plugin.sy+plugin.ty);
		 },
		 
		 p2u : function(plugin,p){
			return this.getProjection().pixelToUser(new JenScript.Point2D((p.x-plugin.tx)/plugin.sx,(p.y-plugin.ty)/plugin.sy));
		 },
		
		affineTranslate : function(evt,part,x,y){
			this.currentPoint = new JenScript.Point2D(x,y);
			if(this.startPoint !== undefined){
				var dx =  this.currentPoint.x - this.startPoint.x;
				var dy =  this.currentPoint.y - this.startPoint.y;
				for (var s = 0; s < this.slaves.length; s++) {
					
					var plugin = this.slaves[s];
					var tx = plugin.tx+dx;
					var ty = plugin.ty+dy;
					plugin.translate(tx,ty);
					
					//update center position without bound changed
					var w = this.getProjection().getView().getDevice().getWidth();
					var h = this.getProjection().getView().getDevice().getHeight();
					var proj = this.getProjection();
					var geo = proj.pixelToUser(new JenScript.Point2D((w/2-plugin.tx)/plugin.sx,(h/2-plugin.ty)/plugin.sy));
					//console.log('translate semantic result center for plugin : long:'+geo.x+',lat:'+geo.y);
					
				}
			}
		},
		
		 /***
		  * assign new scale transform and reset the translate transform to keep map centered
		  */
		 affineScale2 : function(factor){
			 
			for (var s = 0; s < this.slaves.length; s++) {
				var plugin = this.slaves[s];
				
				//console.log("affineScale : "+plugin.sx+','+plugin.sy);
				//console.log("on level :"+this.getProjection().getLevel());
				//console.log("equivalent  :"+(this.getProjection().getLevel()+delta));
				
				var w = this.getProjection().getView().getDevice().getWidth();
				var h = this.getProjection().getView().getDevice().getHeight();
				
				var oldCenterUser 	= this.p2u(plugin,new JenScript.Point2D(w/2,h/2));
				
				var oldSx = plugin.sx;
				var oldSy = plugin.sy;
				
				var sx = plugin.sx*factor;
				var sy = plugin.sy*factor;
				plugin.scale(sx,sy);
				
				//new geo and pixel center
				var newCenterUser 	= this.p2u(plugin,new JenScript.Point2D(w/2,h/2));
				var pixelCenter 	= this.u2p(plugin,newCenterUser);
				
				//do after scale
				var pixelCenter2 	= this.u2p(plugin,oldCenterUser);
				if(pixelCenter !== undefined && pixelCenter2 !== undefined){
					var tx = plugin.tx-(pixelCenter2.x-pixelCenter.x);
					var ty = plugin.ty-(pixelCenter2.y-pixelCenter.y);
					//console.log('set tx/ty after scale :'+tx+','+ty);
					if(isFinite(tx) && isFinite(ty)){
						plugin.translate(tx,ty);
					}else{
						plugin.scale(oldSx,oldSy);
					}
				}
				
			}
		 },
		
		/***
		  * assign new scale transform and reset the translate transform to keep map centered
		  */
		 affineScale : function(delta){
			 
			for (var s = 0; s < this.slaves.length; s++) {
				var plugin = this.slaves[s];
				
//				console.log("affineScale : "+plugin.sx+','+plugin.sy);
//				console.log("on level :"+this.getProjection().getLevel());
//				console.log("equivalent  :"+(this.getProjection().getLevel()+delta));
				
				var w = this.getProjection().getView().getDevice().getWidth();
				var h = this.getProjection().getView().getDevice().getHeight();
				
				var oldCenterUser 	= this.p2u(plugin,new JenScript.Point2D(w/2,h/2));
				
				var oldSx = plugin.sx;
				var oldSy = plugin.sy;
				
				var sx = plugin.sx + delta;
				var sy = plugin.sy + delta;
				plugin.scale(sx,sy);
				
				//new geo and pixel center
				var newCenterUser 	= this.p2u(plugin,new JenScript.Point2D(w/2,h/2));
				var pixelCenter 	= this.u2p(plugin,newCenterUser);
				
				//do after scale
				var pixelCenter2 	= this.u2p(plugin,oldCenterUser);
				if(pixelCenter !== undefined && pixelCenter2 !== undefined){
					var tx = plugin.tx-(pixelCenter2.x-pixelCenter.x);
					var ty = plugin.ty-(pixelCenter2.y-pixelCenter.y);
					//console.log('set tx/ty after scale :'+tx+','+ty);
					if(isFinite(tx) && isFinite(ty)){
						plugin.translate(tx,ty);
					}else{
						plugin.scale(oldSx,oldSy);
					}
				}
				
			}
		 }
			
			
	});
})();