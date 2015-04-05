(function(){

	/**
	 * Object JenScript.RadialGauge()
	 * Defines a radial gauge.
	 * @param {Object} config
	 * @param {Number} [config.x] the gauge center x position
	 * @param {Number} [config.y] the gauge center y position
	 * @param {Number} [config.radius] the gauge radius
	 */
	JenScript.RadialGauge = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.RadialGauge,{
		/**
		 * Initailize this radial gauge.
		 * @param {Object} config
		 * @param {Number} [config.x] the gauge center x position
		 * @param {Number} [config.y] the gauge center y position
		 * @param {Number} [config.radius] the gauge radius
		 */
		init : function(config){
			/** gauge center x */
			this.x = (config.x !== undefined )? config.x : 0;
			/** gauge center y */
			this.y = (config.y !== undefined )? config.y :0;
			/** gauge radius */
			this.radius = config.radius;
			/** gauge projection */
			this.projection;
			/** gauge envelop */
			this.envelop;
			/** gauge glass effects */
			this.glasses = [];
			/** gauge backgrounds */
			this.backgrounds=[];
			/** gauge bodies */
			this.bodies=[];
		},
		
		/**
		 * get the gauge center in the device system coordinate according to the
		 * given x and y coordinate define in user coordinate
		 * @return {Object} gauge center device
		 */
		getCenterDevice : function() {
			var centerX = this.getProjection().userToPixelX(this.x);
			var centerY = this.getProjection().userToPixelY(this.y);
			return new JenScript.Point2D(centerX, centerY);
		},

		/**
		 * get radial point from center gauge according to given polar coordiante given
		 * @param {Number} radius
		 * @param {Number} angle degree
		 * @return {Object} radial point
		 */
		getRadialPointAt : function(radius,angleDegree) {
			var bc = this.getCenterDevice();
			var centerX = bc.getX();
			var centerY = bc.getY();
			var shiftCenterX = centerX + radius * Math.cos(JenScript.Math.toRadians(angleDegree));
			var shiftCenterY = centerY - radius * Math.sin(JenScript.Math.toRadians(angleDegree));
			return new JenScript.Point2D(shiftCenterX, shiftCenterY);
		},

		/**
		 * get gauge backgrounds
		 * @return {Array} gauge backgrounds array
		 */
		getBackgrounds : function() {
			return this.backgrounds;
		},

		/**
		 * set gauge backgrounds array
		 * @param {Array} backgrounds
		 */
		setBackgrounds : function(backgrounds) {
			this.backgrounds = backgrounds;
		},

		/**
		 * add gauge background
		 * @param {Object} background
		 */
		addBackground : function(background) {
			this.backgrounds[this.backgrounds.length] = background;
		},

		/**
		 * get gauge projection
		 * @return {Object} projection
		 */
		getProjection : function() {
			return this.projection;
		},

		/**
		 * set gauge projection
		 * @param {Object} projection
		 */
		setProjection : function(projection) {
			this.projection = projection;
		},

		/**
		 * get gauge radius
		 * @return {Number} gauge radius
		 */
		getRadius : function() {
			return this.radius;
		},

		/**
		 * set gauge radius
		 * @param {Number} radius
		 */
		setRadius : function(radius) {
			this.radius = radius;
		},

		/**
		 * get gauge center x
		 * @return {Number} center x
		 */
		getX : function() {
			return this.x;
		},

		/**
		 * set gauge center x
		 * @param {Number} x
		 */
		setX : function(x) {
			this.x = x;
		},

		/**
		 * get gauge center y
		 * @return {Number} center y
		 */
		getY : function() {
			return this.y;
		},

		/**
		 * set gauge center y
		 * @param {Number} y
		 */
		setY : function( y) {
			this.y = y;
		},

		/**
		 * get gauge envelop
		 * @return {Object} gauge envelop
		 */
		getEnvelop : function() {
			return this.envelop;
		},

		/**
		 * set gauge envelop
		 * @param {Object} envelop
		 */
		setEnvelop : function(envelop) {
			envelop.setGauge(this);
			this.envelop = envelop;
		},

		/**
		 * get gauge glasses array
		 * @return {Array} glasses
		 */
		getGlasses : function() {
			return this.glasses;
		},

		/**
		 * set gauge glasses array
		 * @param {Array} glasses
		 */
		setGlasses : function(glasses) {
			for (var i = 0; i < glasses.length; i++) {
				this.addGlass(glasses[i]);
			}
		},

		/**
		 * add given glass
		 * @param {Object} glass
		 */
		addGlass : function(glass) {
			glass.setGauge(this);
			this.glasses[this.glasses.length] = glass;
		},
		
		/**
		 * get gauge bodies array
		 * @return {Array} gauge bodies array
		 */
		getBodies:function() {
			return this.bodies;
		},

		/**
		 * set gauge bodies array 
		 * @param {Array} bodies array
		 */
		setBodies : function(bodies) {
			for (var i = 0; i < bodies.length; i++) {
				this.addBody(bodies[i]);
			}
		},

		/**
		 * add given body in this gauge
		 * @param {Object} body
		 */
		addBody : function( body) {
			body.setGauge(this);
			this.bodies[this.bodies.length] = body;
		},
	});
})();