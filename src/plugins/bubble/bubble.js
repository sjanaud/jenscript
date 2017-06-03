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
			
			this.fillColor = (config.fillColor !== undefined)?config.fillColor : 'black';
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