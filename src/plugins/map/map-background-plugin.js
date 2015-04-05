(function(){
	
	JenScript.MapBackgroundPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MapBackgroundPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.MapBackgroundPlugin,{
		
		_init : function(config){
			config = config || {};
			config.priority = 1000;
			config.name ='MapBackgroundPlugin';
			JenScript.Plugin.call(this, config);
		},
		
		
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			var w = this.getProjection().getView().getDevice().getWidth();
			var h = this.getProjection().getView().getDevice().getHeight();
			var rect = new JenScript.SVGRect().origin(0,0).size(w,h);
			//JenScript.Color.brighten(JenScript.RosePalette.CALYPSOBLUE,50)
			g2d.insertSVG(rect.strokeNone().fill(JenScript.Color.brighten(JenScript.RosePalette.CALYPSOBLUE,30)).toSVG());
		}
			
	});
})();