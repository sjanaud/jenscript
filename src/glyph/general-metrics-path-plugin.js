(function(){
	JenScript.GeneralMetricsPathPlugin = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GeneralMetricsPathPlugin,JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.GeneralMetricsPathPlugin,{
		_init : function(config){
			config = config||{};
			config.name = 'JenScript.GeneralMetricsPathPlugin';
			this.generalMetricsPath = config.path;
			this.generalMetricsPath.plugin = this;
			JenScript.Plugin.call(this,config);
		},
		
		/**
		 * on projection register add 'bound changed' projection listener that invoke repaint plugin
		 * when projection bound changed event occurs.
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'GeneralMetricsPath projection bound changed');
		},
		
		paintPlugin : function(g2d,part) {
	        if (part != JenScript.ViewPart.Device) {
	            return;
	        }
	        this.generalMetricsPath.projection = this.getProjection();
	        
	        this.generalMetricsPath.graphicsContext = g2d;
	        this.generalMetricsPath.createPath();
	        
	        this.generalMetricsPath.svgPathElement.setAttribute('stroke','red');
	        this.generalMetricsPath.svgPathElement.setAttribute('fill','none');
	        g2d.insertSVG(this.generalMetricsPath.svgPathElement.cloneNode(true));
	        
	        var metrics = this.generalMetricsPath.getMetrics(g2d);
	        for (var i = 0; i < metrics.length; i++) {
				var m = metrics[i];
				
				
				
			}
	        
	    },

	});

	
})();