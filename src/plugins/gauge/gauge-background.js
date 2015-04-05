(function(){

	
	/**
	 * Object JenScript.GaugeBackground()
	 * Gauge Background defines the area with is paintedafter envelope and before body.
	 * It take the responsibility to decorate body background,should paint everything which is inside gauge radius
	 * @param {Object} config
	 */
	JenScript.GaugeBackground = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GaugeBackground,JenScript.GaugePart);
	JenScript.Model.addMethods(JenScript.GaugeBackground,{
		/**
		 * Initialize Gauge Background
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			JenScript.GaugePart.call(this,config);
		},
		
		/**
		 * Paint this background part
		 * @param {Object} graphics context
		 * @param {Object} radialGauge
		 */
		paintBackground  : function(g2d,radialGauge){},
		
		/**
		 * Final, Paint this gauge part
		 * @param {Object} graphics context
		 * @param {Object} radialGauge
		 */
		paintPart  : function( g2d,  radialGauge){
			this.paintBackground(g2d,radialGauge);
		},
	});
	
	
	/**
	 * Object JenScript.CircularBackground()
	 * Circular background defines circulat area that can be filled with gradient shader,
	 * color or texture.
	 * 
	 * You should extends this class and provide fill method by override.
	 * fill method passed parameters are graphics context, radial gauge and shpae background to fill
	 * 
	 * @param {Object} config
	 * @param {Number} [config.radius], default gauge radius, for main body background, should be equal to gauge radius.
	 * @param {Number} [config.polarRadius] polar radius for inner background body, default 0
	 * @param {Number} [config.polarAngle]  polar angle for inner background body, default 0
	 */
	JenScript.CircularBackground = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.CircularBackground,JenScript.GaugeBackground);
	JenScript.Model.addMethods(JenScript.CircularBackground,{
		/**
		 * Initialize Circular Gauge Background
		 * @param {Object} config
		 * @param {Number} [config.radius], default gauge radius, for main body background, should be equal to gauge radius.
		 * @param {Number} [config.polarRadius] polar radius for inner background body, default 0
		 * @param {Number} [config.polarAngle]  polar angle for inner background body, default 0
		 */
		__init : function(config){
			config = config || {};
			this.radius = (config.radius !== undefined)?config.radius : 0;
			this.polarRadius = (config.polarRadius !== undefined)?config.polarRadius : 0;
			this.polarAngle = (config.polarAngle !== undefined)?config.polarAngle : 0;
			JenScript.GaugeBackground.call(this,config);
		},
		
		/**
		 * get background radius
		 * @return {Object} background radius
		 */
		getRadius : function() {
			return this.radius;
		},

		/**
		 * set background radius
		 * @param {Object} background radius
		 */
		setRadius : function(radius) {
			this.radius = radius;
		},

		/**
		 * get background polar radius
		 * @return {Object} background polar radius
		 */
		getPolarRadius : function() {
			return this.polarRadius;
		},

		/**
		 * set background polar radius
		 * @param {Object} background polar radius
		 */
		setPolarRadius : function( polarRadius) {
			this.polarRadius = polarRadius;
		},

		/**
		 * get background polar angle
		 * @return {Object} background polar angle
		 */
		getPolarAngle : function() {
			return this.polarAngle;
		},

		/**
		 * set background polar angle
		 * @param {Object} background polar angle
		 */
		setPolarAngle : function( polarAngle) {
			this.polarAngle = polarAngle;
		},
		
		/**
		 * fill the circular background shape
		 * @param {Object} graphics context
		 * @param {Object} gauge
		 * @param {Object} shape to fill
		 */
		fill: function(g2d,radialGauge,shape){throw new Error('JenScript.CircularBackground, fill method should be provide by override.');},
		
		/**
		 * Final, Paint this background part
		 * @param {Object} graphics context
		 * @param {Object} radialGauge
		 */
		paintBackground  : function( g2d,  radialGauge){
			var centerDef = radialGauge.getRadialPointAt(this.polarRadius, this.polarAngle);
			if (this.radius == 0) {
				this.radius = radialGauge.getRadius();
			}
			var baseShape = new JenScript.SVGCircle().center(centerDef.getX(),centerDef.getY()).radius(this.radius);
			this.fill(g2d,radialGauge,baseShape);
		},
	});
	
	/**
	 * Object JenScript.GradientCircularBackground()
	 * Defines a circular gradient background
	 * @param {Object} config
	 * @param {Object} [config.shader]
	 * @param {Array} [config.shader.percents] array of percents
	 * @param {Array} [config.shader.colors] array of colors
	 */
	JenScript.GradientCircularBackground = function(config){
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GradientCircularBackground,JenScript.CircularBackground);
	JenScript.Model.addMethods(JenScript.GradientCircularBackground,{
		
		/**
		 * Initialize circular gradient background
		 * @param {Object} config
		 * @param {Object} [config.shader]
		 * @param {Array} [config.shader.percents] array of percents
		 * @param {Array} [config.shader.colors] array of colors
		 */
		___init : function(config){
			config = config || {};
			this.shader = (config.shader !== undefined)? config.shader : {percents : ['0%','100%'], colors : ['red','black']};
			JenScript.CircularBackground.call(this,config);
		},
		
		/**
		 * fill the circular background shape with gradient shader
		 * @param {Object} graphics context
		 * @param {Object} gauge
		 * @param {Object} shape to fill
		 */
		fill : function(g2d,radialGauge,shape) {
			var gradient = this.getGradient(radialGauge);
			var gradientId = 'gradient'+JenScript.sequenceId++;
			gradient.Id(gradientId);
			g2d.definesSVG(gradient.toSVG());
			g2d.insertSVG(shape.fillURL(gradientId).toSVG());
		},

		/**
		 * get the gradient paint to use
		 * @return {Object} linear or radial gradient
		 */
		getGradient : function(radialGauge){throw new Error('JenScript.GradientCircularBackground, getGradient method should be provide by override');},
	});
	
	
	/**
	 * Object JenScript.LinearGradientCircularBackground()
	 * Defines a linear background paint
	 * @param {Object} config
	 * @param {Object} [config.gradientAngle] gradient incidence angle
	 * @param {Object} [config.shader] gradient shader
	 * @param {Array}  [config.shader.percents] array of percents
	 * @param {Array}  [config.shader.colors] array of colors
	 */
	JenScript.LinearGradientCircularBackground = function(config){
		this.____init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LinearGradientCircularBackground,JenScript.GradientCircularBackground);
	JenScript.Model.addMethods(JenScript.LinearGradientCircularBackground,{
		/**
		 * Initialize linear background paint
		 * @param {Object} config
		 * @param {Object} [config.gradientAngle] gradient incidence angle
		 * @param {Object} [config.shader] gradient shader
		 * @param {Array}  [config.shader.percents] array of percents
		 * @param {Array}  [config.shader.colors] array of colors
		 */
		____init : function(config){
			config = config || {};
			/** gradient angle */
			this.gradientAngle = (config.gradientAngle !== undefined )? config.gradientAngle: 90;
			config.name='JenScript.LinearGradientCircularBackground';
			JenScript.GradientCircularBackground.call(this,config);
		},

		/**
		 * get the linear gradient to use
		 * @return {Object} linear gradient gauge background
		 */
		getGradient : function(radialGauge){
			var centerDef = radialGauge.getRadialPointAt(this.polarRadius, this.polarAngle);
			var startX = centerDef.getX() + this.getRadius() * Math.cos(JenScript.Math.toRadians(this.gradientAngle));
			var startY = centerDef.getY() - this.getRadius() * Math.sin(JenScript.Math.toRadians(this.gradientAngle));
			var endX = centerDef.getX() + this.getRadius() * Math.cos(JenScript.Math.toRadians(this.gradientAngle) + Math.PI);
			var endY = centerDef.getY() - this.getRadius() * Math.sin(JenScript.Math.toRadians(this.gradientAngle) + Math.PI);
			var start = new JenScript.Point2D(startX, startY);
			var end = new JenScript.Point2D(endX, endY);
	        var gradient= new JenScript.SVGLinearGradient().from(start.x,start.y).to(end.x,end.y).shade(this.shader.percents,this.shader.colors);
	        return gradient;
		},
	});
	
	
	/**
	 * Object JenScript.TextureCircularBackground()
	 * Defines a circular texture background
	 * @param {Object} config
	 * @param {Object} [config.opacity] texture opacity, default 0.5
	 * @param {Object} [config.texture] texture pattern, default triangle carbon texture
	 */
	JenScript.TextureCircularBackground = function(config){
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TextureCircularBackground,JenScript.CircularBackground);
	JenScript.Model.addMethods(JenScript.TextureCircularBackground,{
		/**
		 * Intialize circular texture background
		 * @param {Object} config
		 * @param {Object} [config.opacity] texture opacity, default 0.5
		 * @param {Object} [config.texture] texture pattern, default triangle carbon texture
		 */
		___init : function(config){
			config = config || {};
			this.opacity = (config.opacity !== undefined)? config.opacity : 0.5;
			this.texture = (config.texture !== undefined)? config.texture : JenScript.Texture.getTriangleCarbonFiber(5);
			JenScript.CircularBackground.call(this,config);
		},
		
		/**
		 * fill the circular background shape with texture
		 * @param {Object} graphics context
		 * @param {Object} gauge
		 * @param {Object} shape to fill
		 */
		fill : function(g2d,radialGauge,shape) {
			g2d.definesTexture(this.texture);
			g2d.insertSVG(shape.fillURL(this.texture.Id).opacity(this.opacity).toSVG());
		},

	});
})();