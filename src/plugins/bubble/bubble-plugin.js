(function(){
	
	/**
	 * Object BubblePlugin()
	 * Defines a plugin that takes the responsibility to manage bubble
	 * @param {Object} config
	 */
	JenScript.BubblePlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.BubblePlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.BubblePlugin, {
		
		/**
		 * Initialize Function Plugin
		 * Defines a plugin that takes the responsibility to manage function
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.priority = 100;
			config.name = 'BubblePlugin';
		    JenScript.Plugin.call(this,config);
		    this.bubbles = [];
		},
		
		/**
		 * add the given bubble in this bubble plugin and return this plugin
		 * @param {Object} bubble
		 */
		addBubble : function(bubble){
			bubble.plugin = this;
			this.bubbles[this.bubbles.length] = bubble;
			this.repaintPlugin();
			return this;
		},
		
		/**
		 * create a bubble with given properties and return this plugin
		 *  @param {Object} bubble properties
		 */
		bubble : function(properties){
			var b = new JenScript.Bubble(properties);
			this.addBubble(b);
			return this;
		},
		
		/**
		 * remove the given bubble in this bubble plugin
		 * @param {Object} bubble
		 */
		removeBubble : function(bubble){
			var nb = [];
			for (var i = 0; i < this.bubbles.length; i++) {
				if(!this.bubbles[i].equals(bubble))
					nb[nb.length]=this.bubbles[i];
			}
			this.bubbles = nb;
		},
		
		/**
		 * on projection register add 'bound changed' projection listener that invoke repaint plugin
		 * when projection bound changed event occurs.
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'BubblePlugin projection bound changed');
		},
		
		
		/**
		 * paint bubble plugin
		 */
		 paintPlugin : function(g2d,viewPart) {
			 if(viewPart !== 'Device') return;
			 for (var i = 0; i < this.bubbles.length; i++) {
				 var bubble = this.bubbles[i];
				 
				 var cp = this.getProjection().userToPixel(bubble.center);
				 var svg = new JenScript.SVGCircle().Id(bubble.Id).center(cp.x,cp.y).radius(bubble.radius);
				 
				 svg.fill(bubble.fillColor).fillOpacity(bubble.fillOpacity);
				 if(bubble.strokeColor !== undefined)
					 svg.stroke(bubble.strokeColor).strokeWidth(bubble.strokeWidth).strokeOpacity(bubble.strokeOpacity);
				 
				 g2d.deleteGraphicsElement(bubble.Id);
				 g2d.insertSVG(svg.toSVG());
			 }
		 } 
		
	});
	
})();