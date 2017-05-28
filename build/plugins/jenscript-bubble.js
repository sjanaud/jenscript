// JenScript -  JavaScript HTML5/SVG Library
// version : 1.3.0
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-05-28
// All Rights reserved

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
(function(){
	
	/**
	 * Object Bubble()
	 * Defines a plugin that takes the responsibility to manage bubble
	 * @param {Object} config
	 */
	JenScript.Bubble = function(config) {
		this.init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Bubble, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.Bubble, {
		
		/**
		 * Initialize Bubble
		 * Defines bubble
		 * @param {Object} config
		 */
		init : function(config){
			config = config || {};
			config.priority = 100;
			this.Id = 'bubble'+JenScript.sequenceId++;
			this.center = (config.center !== undefined)?config.center : new JenScript.Point2D(0,0);
			this.radius = (config.radius !== undefined)?config.radius : 50;
			
			this.fillColor = (config.fillColor !== undefined)?config.fillColor : JenScript.RosePalette.INDIGO;
			this.fillOpacity = (config.fillOpacity !== undefined)?config.fillOpacity : 1;
			this.strokeColor = config.strokeColor;
			this.strokeWidth = (config.strokeWidth !== undefined)?config.strokeWidth : 1;
			this.strokeOpacity = (config.strokeOpacity !== undefined)?config.strokeOpacity : 1;
		},
		
		/**
		 * get bubble center in user coordiante
		 * @returns bubble center
		 */
		getCenter : function(){
			return this.center;
		},
		
		/**
		 * set bubble center in user coordinate
		 * @param {Object} bubble center
		 */
		setCenter : function(center){
			this.center = center;
		},
		
		/**
		 * get bubble radius in pixel
		 * @returns bubble radius
		 */
		getRadius : function(){
			return this.radius;
		},
		
		/**
		 * set bubble radius in pixel
		 * @param {Number} bubble radius
		 */
		setRadius : function(radius){
			this.radius = radius;
		},
		
		/**
		 * equals bubble if this bubble id match with the given bubble o
		 * @param {Object} o
		 */
		equals : function(o){
			if(!(o instanceof JenScript.Bubble))
				return false;
			if(o.Id === this.Id)
				return true;
		}
		
		
	});
	
})();