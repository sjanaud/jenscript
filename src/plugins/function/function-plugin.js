(function(){
	/**
	 * Object FunctionPlugin()
	 * Defines a plugin that takes the responsibility to manage functions
	 * @param {Object} config
	 */
	JenScript.FunctionPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.FunctionPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.FunctionPlugin, {
		
		/**
		 * Initialize Function Plugin
		 * Defines a plugin that takes the responsibility to manage function
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.priority = 100;
			config.name='FunctionPlugin';
			/** functions */
		    this.functions = [];
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
			},'FunctionPlugin projection bound changed');
		},
		
		/**
	     * register function
	     * @param fn
	     */
	    addFunction : function(fn) {
    		fn.setHostPlugin(this);
            this.functions[this.functions.length] = fn;
            this.repaintPlugin();
	    },
	    
	    /**
	     * @return the functions
	     */
	    getFunctions : function() {
	        return this.functions;
	    },
	    
	    /**
	     * @param g2d
	     * @param viewPart
	     */
	    paintFunctions : function(g2d,viewPart){
	    	 if (viewPart !== JenScript.ViewPart.Device) {
		        return;
		     }
	    	 for (var c = 0; c < this.getFunctions().length; c++) {
            	var pathFunction = this.getFunctions()[c];
            	pathFunction.source.hostFunction = pathFunction;//required for share source between function
            	pathFunction.paintFunction(g2d);
	         }
	    },
	    
	    
	    /**
	     * paint metrics path function
	     * 
	     * @param g2d
	     * @param viewPart
	     */
	    paintMetricsGlyphFunction : function(g2d,viewPart) {
	        if (viewPart !== JenScript.ViewPart.Device) {
	            return;
	        }
	        for (var c = 0; c < this.getFunctions().length; c++) {
            	var pathFunction = this.getFunctions()[c];
            	pathFunction.graphicsContext = g2d;
            	pathFunction.source.hostFunction = pathFunction;//required for share source between function
	            var metrics = pathFunction.getMetrics();
//	            for (GlyphMetric glyphMetric : metrics) {
//	                if (glyphMetric.getGlyphMetricMarkerPainter() != null) {
//	                    glyphMetric.getGlyphMetricMarkerPainter().paintGlyphMetric(g2d, glyphMetric);
//	                }
//
//	                if (glyphMetric.getGlyphMetricFill() != null) {
//	                    glyphMetric.getGlyphMetricFill().paintGlyphMetric(g2d, glyphMetric);
//	                }
//
//	                if (glyphMetric.getGlyphMetricDraw() != null) {
//	                    glyphMetric.getGlyphMetricDraw().paintGlyphMetric(g2d, glyphMetric);
//	                }
//	            }
	        }

	    },
	   
	   /**
	    * paint function plugin
	    */
	   paintPlugin : function(g2d,viewPart) {
		   if (viewPart !== JenScript.ViewPart.Device) {
               return;
           }
		  
	       this.paintFunctions(g2d,viewPart);
	       this.paintMetricsGlyphFunction(g2d,viewPart);
	   }
	    
	});
})();