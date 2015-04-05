(function(){
	
	JenScript.MapTranslatePlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MapTranslatePlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.MapTranslatePlugin,{
		
		_init : function(config){
			config = config || {};
			config.priority = 1000;
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
			this.currentPoint = new JenScript.Point2D(x,y);
			var dLong =  this.getProjection().pixelToLong(this.startPoint.x)-this.getProjection().pixelToLong(this.currentPoint.x);
			var dLat =   this.getProjection().pixelToLat(this.startPoint.y)-this.getProjection().pixelToLat(this.currentPoint.y);
			var cp = this.getProjection().getCenterPosition();
			this.getProjection().setCenterPosition(new JenScript.GeoPosition(cp.latitude+dLat,cp.longitude+dLong));
			this.startPoint = this.currentPoint;
		},
			
	});
})();