(function(){

	
	/**
	 * Object JenScript.AnchorBinder()
	 * Defines a mechanism to bind needle anchor point
	 * This anchor binder will be used by gauge to create needle anchor
	 * 
	 * @param {Object} config
	 */
	JenScript.AnchorBinder = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AnchorBinder,{
		/**
		 * Initialize anchor binder
		 * @param {Object} config
		 */
		init : function(config){
			config = config || {};
			/** the gauge metrics path binded to this anchor */
			this.metricsPath;
		},
		
		/**
		 * get the binded gauge metrics path
		 * 
		 * @return metrics path
		 */
		getMetricsPath : function() {
			return this.metricsPath;
		},

		/**
		 * set the gauge metrics path to this anchor
		 * 
		 * @param metricsPath
		 */
		setMetricsPath : function(metricsPath) {
			this.metricsPath = metricsPath;
		},

		/**
		 * bind the anchor to caller
		 * @param {Object} gauge
		 * @return {Object} anchor point
		 */
		bindAnchor  : function(gauge){throw new Error('JenScript.AnchorBinder, bindAnchor method should be provide by override');}
	});
	
	
	
	
	/** 
	 * Object JenScript.AnchorBaseBinder()
	 * Defines a mechanism to bind needle base anchor point
	 * 
	 * @param {Object} config
	 * @param {Number} [config.radius] the shift radius
	 * @param {Number} [config.angleDegree] the shift angle
	 */
	JenScript.AnchorBaseBinder = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AnchorBaseBinder,JenScript.AnchorBinder);
	JenScript.Model.addMethods(JenScript.AnchorBaseBinder,{
		/**
		 * Initialize anchor base binder
		 * @param {Object} config
		 * @param {Number} [config.radius] the shift radius
		 * @param {Number} [config.angleDegree] the shift angle
		 */
		_init : function(config){
			config = config || {};
			this.radius = (config.radius !== undefined) ? config.radius:0;
			this.angleDegree = (config.angleDegree !== undefined) ? config.angleDegree:0;
			JenScript.AnchorBinder.call(this,config);
		},
		
		/**
		 * set anchor base binder radius
		 * @return {Number} radius
		 */
		getRadius : function() {
			return this.radius;
		},

		/**
		 * set anchor base binder radius
		 * @param {Number} radius to set
		 */
		setRadius : function(radius) {
			this.radius = radius;
		},

		/**
		 * get anchor base binder angle degree
		 * @return {Number} angleDegree
		 */
		getAngleDegree : function() {
			return this.angleDegree;
		},

		/**
		 * set anchor base binder angle degree
		 * @param {Number} angleDegree
		 */
		setAngleDegree : function(angleDegree) {
			this.angleDegree = angleDegree;
		},
		
		/**
		 * bind base anchor for given gauge
		 * @param {Object} gauge to bind
		 */
		bindAnchor : function(gauge) {
			var anchorX = gauge.getCenterDevice().getX() + this.radius*Math.cos(JenScript.Math.toRadians(this.angleDegree));
			var anchorY = gauge.getCenterDevice().getY() - this.radius*Math.sin(JenScript.Math.toRadians(this.angleDegree));
			return new JenScript.Point2D(anchorX, anchorY);
		}
	});
	
	
	/** 
	 * Object JenScript.AnchorValueBinder()
	 * Defines a mechanism to bind needle value anchor point
	 * 
	 * @param {Object} config
	 * @param {Number} [config.radialOffset] the radial offset from the metrics path, default 10
	 */
	JenScript.AnchorValueBinder = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AnchorValueBinder,JenScript.AnchorBinder);
	JenScript.Model.addMethods(JenScript.AnchorValueBinder,{
		/**
		 * Initialize anchor value binder
		 * @param {Object} config
		 * @param {Number} [config.radialOffset] the radial offset from the metrics path, default 10
		 */
		_init : function(config){
			config = config || {};
			this.radialOffset = (config.radialOffset !== undefined) ? config.radialOffset:10;
			JenScript.AnchorBinder.call(this,config);
		},
		
		/**
		 * get anchor radial offset 
		 * @return {Number} radialOffset
		 */
		getRadialOffset : function() {
			return this.radialOffset;
		},

		/**
		 * set anchor radial offset 
		 * @param {Number} radialOffset
		 */
		setRadialOffset : function(radialOffset) {
			this.radialOffset = radialOffset;
		},

		/**
		 * bind value anchor for given gauge
		 * @param {Object} gauge to bind
		 */
		bindAnchor : function(gauge) {
			this.baseAnchor = this.getMetricsPath().getNeedleBaseAnchorBinder().bindAnchor(gauge);
			var needlePointValue = this.getMetricsPath().getMetricsPoint(this.getMetricsPath().getCurrentValue(), this.radialOffset);
			var arcRadius = Math.sqrt((this.baseAnchor.x - needlePointValue.x)*(this.baseAnchor.x - needlePointValue.x)+(this.baseAnchor.y - needlePointValue.y)*(this.baseAnchor.y - needlePointValue.y));
			var thetaRadian = JenScript.Math.getPolarAngle(this.baseAnchor.x,this.baseAnchor.y,needlePointValue.x,needlePointValue.y);
			var nx = this.baseAnchor.x + (arcRadius - this.radialOffset)*Math.cos(thetaRadian);
			var ny = this.baseAnchor.y - (arcRadius - this.radialOffset)*Math.sin(thetaRadian);
			return new JenScript.Point2D(nx,ny);
		}
	});
})();