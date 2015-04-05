(function(){
	
	/**
	 * Object PlotPlugin()
	 * Defines a plugin that takes the responsibility to manage plot
	 * @param {Object} config
	 */
	JenScript.PlotPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PlotPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.PlotPlugin, {
		
		/**
		 * Initialize Plot Plugin
		 * Defines a plugin that takes the responsibility to manage function
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.priority = 100;
			config.name='PlotPlugin';
		    JenScript.Plugin.call(this,config);
		    this.plots = [];
		},
		
		/**
		 * add the given plot in this plot plugin
		 * @param {Object} plot
		 */
		addPlot : function(plot){
			plot.plugin = this;
			this.plots[this.plots.length] = plot;
			this.repaintPlugin();
		},
		
		/**
		 * remove the given plot in this plot plugin
		 * @param {Object} bubble
		 */
		removePlot : function(plot){
			var nb = [];
			for (var i = 0; i < this.plots.length; i++) {
				if(!this.plots[i].equals(plot))
					nb[nb.length]=this.plots[i];
			}
			this.plots = nb;
		},
		
		/**
		 * on projection register add 'bound changed' projection listener that invoke repaint plugin
		 * when projection bound changed event occurs.
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'PlotPlugin projection bound changed');
		},
		
		
		/**
		 * paint plot plugin
		 */
		 paintPlugin : function(g2d,viewPart) {
			 if(viewPart!== 'Device')return;
			 for (var i = 0; i < this.plots.length; i++) {
				 var plot = this.plots[i];
				 plot.solvePlot();
				
				 var pixelsPoints = plot.devicePoints;
				 var svgPath = new JenScript.SVGPath().Id(plot.Id);
				 for (var i = 0; i < pixelsPoints.length; i++) {
					var p = pixelsPoints[i];
					if(i === 0)
						svgPath.moveTo(p.x,p.y);
					else
						svgPath.lineTo(p.x,p.y);
				}
				g2d.deleteGraphicsElement(plot.Id);
				g2d.insertSVG(svgPath.fillNone().stroke(plot.plotColor).strokeWidth(plot.plotWidth).toSVG());
			 }
		 } 
		
	});
	
})();