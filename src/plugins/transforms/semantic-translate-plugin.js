(function(){
	
	JenScript.MapSemanticTranslatePlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MapSemanticTranslatePlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.MapSemanticTranslatePlugin,{
		
		_init : function(config){
			config = config || {};
			config.priority = 1000;
			this.slaves = (config.slaves !== undefined)? config.slaves : [];
			config.name ='MapTranslatePlugin';
			JenScript.Plugin.call(this, config);
			this.startPoint;
			this.currentPoint;
			this.translate = false;
		},
		
		onPress : function(evt,part,x,y){
			//mozilla, prevent Default to enable dragging correctly
			if(evt.preventDefault){
				evt.preventDefault();
			}
			this.translate = true;
			this.startPoint = new JenScript.Point2D(x,y);
		},

		onRelease : function(evt,part,x,y){
			this.translate = false;
		},
		
		onMove : function(evt,part,x,y){
			if(!this.translate) return;
			this.semantic(evt,part,x,y);
			this.startPoint = this.currentPoint;
		},
		
		semantic : function(evt,part,x,y){
			this.currentPoint = new JenScript.Point2D(x,y);
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
				console.log('translate semantic result center for plugin : long:'+geo.x+',lat:'+geo.y);
				
			}
		}
			
			
	});
})();