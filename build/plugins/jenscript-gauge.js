// JenScript -  JavaScript HTML5/SVG Library
// version : 1.3.1
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-06-03
// All Rights reserved

(function(){
	
	/**
	 * Object JenScript.RadialGaugePlugin()
	 * Takes the responsability to paint gauge in view.
	 * @param {Object} config
	 */
	JenScript.RadialGaugePlugin = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.RadialGaugePlugin,JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.RadialGaugePlugin,{
		
		/**
		 * Initialize Gauge Plugin
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.name = 'JenScript.RadialGaugePlugin';
			this.gauge = config.gauge;
			JenScript.Plugin.call(this,config);
		},
		
		/**
		 * paint gauge plugin
		 * @param {Object} graphics context
		 * @param {String} view part
		 */
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			this.gauge.setProjection(this.getProjection());
			if (this.gauge.getEnvelop() !== undefined) {
				this.gauge.getEnvelop().paintPart(g2d, this.gauge);
			}
			if (this.gauge.getBackgrounds() !== undefined) {
				for (var i = 0; i < this.gauge.getBackgrounds().length; i++) {
					this.gauge.getBackgrounds()[i].paintPart(g2d,this.gauge);
				}
			}
			if (this.gauge.getGlasses() !== undefined) {
				for (var i = 0; i < this.gauge.getGlasses().length; i++) {
					this.gauge.getGlasses()[i].paintPart(g2d,this.gauge);
				}
			}
			if (this.gauge.getBodies() !== undefined) {
				for (var i = 0; i < this.gauge.getBodies().length; i++) {
					this.gauge.getBodies()[i].paintPart(g2d,this.gauge);
				}
			}
		}
	});
	
})();
(function(){
	/**
	 * Object JenScript.GaugePart()
	 * Defines Abstract Gauge Part like envelope, background, body or glass.
	 * @param {Object} config
	 */
	JenScript.GaugePart = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.GaugePart,{
		/**
		 * Initialize Gauge Part
		 * @param {Object} config
		 */
		init : function(config){
			this.gauge;
			this.partBuffer;
		},
		
		/**
		 * get gauge of this path
		 * @return {Object} gauge
		 */
		getGauge : function() {
			return this.gauge;
		},

		/**
		 * set gauge of this part
		 * @param {Object} gauge
		 */
		setGauge : function(gauge) {
			this.gauge = gauge;
		},
		
		/**
		 * Paint this part of the given gauge 
		 * 
		 * @param {Object} graphics context
		 * @param {Object} radialGauge
		 */
		paintPart : function(g2d,radialGauge){throw new Error('JenScript.GaugePart, paintPart method should be provide by override.');},
	});
})();
(function(){

	/**
	 * Object JenScript.GaugeEnvelope()
	 * Defines Abstract Gauge envelope. Envelop is decorator of gauge that extends after gauge radius.
	 * @param {Object} config
	 */
	JenScript.GaugeEnvelope = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GaugeEnvelope,JenScript.GaugePart);
	JenScript.Model.addMethods(JenScript.GaugeEnvelope,{
		/**
		 * Initialize Gauge Envelope
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			JenScript.GaugePart.call(this,config);
		},
		
		/**
		 * Paint this envelope part
		 * @param {Object} graphics context
		 * @param {Object} radialGauge
		 */
		paintEnvelope  : function( g2d,  radialGauge){},
		
		/**
		 * Final, Paint this part
		 * @param {Object} graphics context
		 * @param {Object} radialGauge
		 */
		paintPart  : function(g2d,radialGauge){
			this.paintEnvelope(g2d,radialGauge);
		},
	});
	
	/**
	 * Object JenScript.Cisero()
	 * Cisero Envelope.
	 * @param {Object} config
	 */
	JenScript.Cisero = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Cisero,JenScript.GaugeEnvelope);
	JenScript.Model.addMethods(JenScript.Cisero,{
		/**
		 * Initialize Cisero Envelope
		 * @param {Object} config
		 * @param {Object} [config.extendsRatio] default value, 3
		 * @param {Object} [config.alpha] cubic decoration apperture angle, default 10
		 */
		__init : function(config){
			config = config || {};
			/** extends ratio */
			this.extendsRatio = (config.extendsRatio !== undefined)? config.extendsRatio :3;
			/** alpha angle degree to crew place holder */
			this.alpha = (config.alpha !== undefined)? config.alpha :10;
			JenScript.GaugeEnvelope.call(this,config);
		},
		
		/**
		 * create cisero cubic fragment
		 * @param {Object} path to append
		 * @param {Number} theta
		 * @param {Number} alpha
		 * @param {Number} internalRadius
		 * @param {Number} externalRadius
		 */
		createFragment : function(path, theta,  alpha,  internalRadius,  externalRadius,  radialGauge) {
			var centerX = radialGauge.getProjection().userToPixelX(radialGauge.getX());
			var centerY = radialGauge.getProjection().userToPixelY(radialGauge.getY());
			var radius = radialGauge.getRadius();
			var p1 = new JenScript.Point2D(centerX + internalRadius * Math.cos(JenScript.Math.toRadians(theta - alpha - alpha / 2)), centerY - internalRadius * Math.sin(JenScript.Math.toRadians(theta - alpha - alpha / 2)));
			var p2 = new JenScript.Point2D(centerX + externalRadius * Math.cos(JenScript.Math.toRadians(theta - alpha / 2)), centerY - externalRadius * Math.sin(JenScript.Math.toRadians(theta - alpha / 2)));
			var p3 = new JenScript.Point2D(centerX + externalRadius * Math.cos(JenScript.Math.toRadians(theta + alpha / 2)), centerY - externalRadius * Math.sin(JenScript.Math.toRadians(theta + alpha / 2)));
			var p4 = new JenScript.Point2D(centerX + internalRadius * Math.cos(JenScript.Math.toRadians(theta + alpha + alpha / 2)), centerY - internalRadius * Math.sin(JenScript.Math.toRadians(theta + alpha + alpha / 2)));
			var pc1 = new JenScript.Point2D(centerX + internalRadius * Math.cos(JenScript.Math.toRadians(theta - alpha)), centerY - internalRadius * Math.sin(JenScript.Math.toRadians(theta - alpha)));
			var pc2 = new JenScript.Point2D(centerX + externalRadius * Math.cos(JenScript.Math.toRadians(theta - alpha)), centerY - externalRadius * Math.sin(JenScript.Math.toRadians(theta - alpha)));
			var pc3 = new JenScript.Point2D(centerX + externalRadius * Math.cos(JenScript.Math.toRadians(theta + alpha)), centerY - externalRadius * Math.sin(JenScript.Math.toRadians(theta + alpha)));
			var pc4 = new JenScript.Point2D(centerX + internalRadius * Math.cos(JenScript.Math.toRadians(theta + alpha)), centerY - internalRadius * Math.sin(JenScript.Math.toRadians(theta + alpha)));
			if(this.first){
				path.moveTo(p1.getX(), p1.getY());
				this.first=false;
			}
			path.curveTo(pc1.getX(), pc1.getY(), pc2.getX(), pc2.getY(), p2.getX(), p2.getY());
			var endX = centerX + externalRadius * Math.cos(JenScript.Math.toRadians(theta + alpha/2));
			var endY = centerY - externalRadius * Math.sin(JenScript.Math.toRadians(theta + alpha/2));
			path.arcTo(externalRadius,externalRadius,0,0,0,endX,endY);
			path.curveTo(pc3.getX(), pc3.getY(), pc4.getX(), pc4.getY(), p4.getX(), p4.getY());
		},

		/**
		 * create cisero arc fragment
		 * @param {Object} path to append
		 * @param {Number} theta1
		 * @param {Number} theta2
		 * @param {Number} alpha
		 * @param {Number} internalRadius
		 * @param {Number} externalRadius
		 */
		createArcFragment : function(path, theta1,  theta2,  alpha,  internalRadius,  externalRadius,  radialGauge) {
			var centerX = radialGauge.getProjection().userToPixelX(radialGauge.getX());
			var centerY = radialGauge.getProjection().userToPixelY(radialGauge.getY());
			var angle =  theta2  - 2 * alpha +alpha / 2 ;
			var endX = centerX + internalRadius * Math.cos(JenScript.Math.toRadians(angle));
			var endY = centerY - internalRadius * Math.sin(JenScript.Math.toRadians(angle));
			path.arcTo(internalRadius,internalRadius,0,0,0,endX,endY);
		},

		
		/**
		 * Paint this cisero envelop 
		 * @param {Object} graphics context
		 * @param {Object}  radialGauge
		 */
		paintEnvelope  : function( g2d,  radialGauge){
			var deltaExternal = (radialGauge.getRadius() / this.extendsRatio);
			var radiusExternal = radialGauge.getRadius() + deltaExternal;
			var centerX = radialGauge.getProjection().userToPixelX(radialGauge.getX());
			var centerY = radialGauge.getProjection().userToPixelY(radialGauge.getY());
			var eExternal = new JenScript.SVGCircle().center(centerX,centerY).radius(radiusExternal);
			var start = new JenScript.Point2D(centerX, centerY - radiusExternal);
			var end = new JenScript.Point2D(centerX, centerY + radiusExternal);
			var shader = {percents:['0%','50%','100%'],colors:['darkgray','lightgray','black']};
			var gradient= new JenScript.SVGLinearGradient().Id('ciseroGd1').from(start.x,start.y).to(end.x,end.y).shade(shader.percents,shader.colors);
			g2d.definesSVG(gradient.toSVG());
			g2d.insertSVG(eExternal.fillURL('ciseroGd1').strokeNone().toSVG());
			
			
			var alpha = this.alpha;
			var path = new JenScript.SVGPath();
			var epsilonPixel = 2;

			var baseRadius = radialGauge.getRadius() + deltaExternal / 2;
			var extendsRadius = radialGauge.getRadius() + deltaExternal - epsilonPixel;

			this.first = true;
			var s0 = this.createFragment(path,30, alpha, baseRadius, extendsRadius, radialGauge);
			var a1 = this.createArcFragment(path,30, 90, alpha, baseRadius, extendsRadius, radialGauge);
			var s1 = this.createFragment(path,90, alpha, baseRadius, extendsRadius, radialGauge);
			var a2 = this.createArcFragment(path,90, 90 + 60, alpha, baseRadius, extendsRadius, radialGauge);
			var s2 = this.createFragment(path,90 + 60, alpha, baseRadius, extendsRadius, radialGauge);
			var a3 = this.createArcFragment(path,90 + 60, 180 + 30, alpha, baseRadius, extendsRadius, radialGauge);
			var s3 = this.createFragment(path,180 + 30, alpha, baseRadius, extendsRadius, radialGauge);
			var a4 = this.createArcFragment(path,180 + 30, 270, alpha, baseRadius, extendsRadius, radialGauge);
			var s4 = this.createFragment(path,270, alpha, baseRadius, extendsRadius, radialGauge);
			var a5 = this.createArcFragment(path,270, 270 + 60, alpha, baseRadius, extendsRadius, radialGauge);
			var s5 = this.createFragment(path,270 + 60, alpha, baseRadius, extendsRadius, radialGauge);
			var a0 = this.createArcFragment(path,-30, 30, alpha, baseRadius, extendsRadius, radialGauge);
			
			var start4 = new JenScript.Point2D(centerX, centerY - extendsRadius);
			var end4 = new JenScript.Point2D(centerX, centerY + extendsRadius);
			var shader2 = {percents:['0%','50%','100%'],colors:['black','gray','black']};
			var gradient2= new JenScript.SVGLinearGradient().Id('ciseroGd2').from(start4.x,start4.y).to(end4.x,end4.y).shade(shader2.percents,shader2.colors);
			g2d.definesSVG(gradient2.toSVG());
			g2d.insertSVG(path.stroke('#2980b9').attr('fill-rule','nonzero').fillURL('ciseroGd2').toSVG());
		}
	});
})();
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
(function(){

	/**
	 * Object JenScript.GaugeBody()
	 * Gauge Body defines a gauge part that belongs path metrics
	 * 
	 * @param {Object} config
	 */
	JenScript.GaugeBody = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GaugeBody,JenScript.GaugePart);
	JenScript.Model.addMethods(JenScript.GaugeBody,{
		/**
		 * Initialize Gauge Body
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			/** gauges metrics paths */
			this.gaugeMetricsPaths = [];
			/** gauges texts paths */
			this.gaugeTextPaths = [];
			JenScript.GaugePart.call(this,config);
		},
		
		/**
		 * paint this gauge body
		 * @param {Object} graphics context
		 * @param {Object} radialGauge
		 */
		paintBody  : function( g2d,  radialGauge){
			for (var i = 0; i < this.getMetricsPaths().length; i++) {
				var path = this.getMetricsPaths()[i];
				path.setProjection(this.getGauge().getProjection());
				if(path.getPathBinder() !== undefined){
					var shape = path.getPathBinder().bindPath(radialGauge);
					if (shape !== undefined) {
						path.extPath = shape;
						//path.append(path.getPathBinder().bindPath(radialGauge));
						path.draw(g2d);
						g2d.insertSVG(shape.stroke('black').strokeWidth(1).fillNone().toSVG());
					}
				}
				if(path.getPathBinder() !== undefined && path.getPathBinder().isDebug()){
					path.getPathBinder().paintDebug(g2d, radialGauge);
				}
			}
			
//			for (var i = 0; i < this.getTextPaths().length; i++) {
//				var path = this.getTextPaths()[i];
//				//if (path.getPartBuffer() == null) {
//					path.setPath(path.getPathBinder().bindPath(radialGauge));
//					path.createPartBuffer(g2d);
//				//}
//				//paintPart(g2d, path.getPartBuffer());
//			}

			for (var i = 0; i < this.getMetricsPaths().length; i++) {
				var path = this.getMetricsPaths()[i];
				if (path.getGaugeNeedlePainter() != undefined) {
					//var needleBase = path.getNeedleBaseAnchorBinder().bindAnchor(gaugeMetricsPath.getBody().getGauge());
					//gaugeMetricsPath.getNeedleValueAnchorBinder().baseAnchor = needleBase;
					path.getGaugeNeedlePainter().paintNeedle(g2d, path);
				}
			}
		},
		
		/**
		 * register a gauge metrics path in this gauge
		 * @param {Object} path metrics to add
		 */
		registerGaugeMetricsPath : function(pathMetrics) {
			pathMetrics.setBody(this);
			this.gaugeMetricsPaths[this.gaugeMetricsPaths.length] = pathMetrics;
		},

		/**
		 * get gauge path metrics array
		 * @return {Array} path metrics array
		 */
		getMetricsPaths : function() {
			return this.gaugeMetricsPaths;
		},

		/**
		 * register a gauge text path in this gauge
		 * @param {Object} textPath
		 */
		registerGaugeTextPath : function(textPath) {
			textPath.setBody(this);
			this.gaugeTextPaths[this.gaugeTextPaths.length] = textPath;
		},

		/**
		 * get gauge text paths array
		 * @return {Array} gauge text paths
		 */
		getTextPaths : function() {
			return this.gaugeTextPaths;
		},

		/**
		 * Paint gauge part
		 * @param {Object} graphics context
		 * @param {Object} radialGauge
		 */
		paintPart  : function(g2d,gauge){
			this.paintBody(g2d,gauge);
		},
	});
})();
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
(function(){

	
	
	/**
	 * Object JenScript.PathBinder()
	 * Defines a mechanism to bind path to a gauge.
	 * This path will be used by gauge to lay out metrics on the binded path
	 * 
	 * @param {Object} config
	 * @param {Boolean} [config.debug] debug flag
	 */
	JenScript.PathBinder = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.PathBinder,{
		/**
		 * Initialize path binder
		 * @param {Object} config
		 * @param {Boolean} [config.debug] debug flag
		 */
		init : function(config){
			config = config || {};
			this.debug = (config.debug !== undefined)? config.debug :  false;
			/** the metrics path that own this binder */
			this.metricsPath;
		},
		
		/**
		 * true if debug enabled, false otherwise
		 * @return {Boolean} the debug flag
		 */
		isDebug : function() {
			return this.debug;
		},

		/**
		 * set true to debug path binder
		 * @param {Boolean} debug flag
		 */
		setDebug : function(debug) {
			this.debug = debug;
		},

		/**
		 * get metrics path that own this binder
		 * @return {Object}  metrics path
		 */
		getMetricsPath : function() {
			return this.metricsPath;
		},

		/**
		 * set metrics path owner
		 * @param {Object} metrics path to set
		 */
		setMetricsPath : function(metricsPath) {
			this.metricsPath = metricsPath;
		},

		/**
		 * bind path for given gauge, this method should be provide by override.
		 * @param {Object} gauge
		 * @return {Object} the given path to bind
		 */
		bindPath : function(gauge){throw new Error('JenScript.PathBinder, bindPath method should be provide by override.');},

		/**
		 * debug paint path binder by painting all geometries 
		 * objects that makes sense to understand path binding
		 * 
		 * @param {Object} g2d
		 * @param {Object} gauge
		 */
		paintDebug : function(g2d,gauge){}
	});
	
	
	/**
	 * Object JenScript.AbstractPathAutoBinder()
	 * Defines abstract automatic path binder that takes the responsibility 
	 * to solve intersections with arc which is defined by input parameters.
	 * 
	 * After solving these points, provides a path by implementing createPath method.
	 * Default implementation are provided for arc path, cubic path and quad path
	 * 
	 * @param {Object} config
	 * @param {Number} [config.radius] arc radius
	 * @param {Number} [config.polarRadius] polar radius
	 * @param {Number} [config.polarAngle] polar angle
	 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
	 */
	JenScript.AbstractPathAutoBinder = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractPathAutoBinder,JenScript.PathBinder);
	JenScript.Model.addMethods(JenScript.AbstractPathAutoBinder,{
		
		/**
		 * Initialize auto path binder
		 * @param {Object} config
		 * @param {Number} [config.radius] arc radius
		 * @param {Number} [config.polarRadius] polar radius
		 * @param {Number} [config.polarAngle] polar angle
		 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
		 */
		_init : function(config){
			config = config || {};
			/** binder radius */
			this.radius = config.radius;
			/** polar radius */
			this.polarRadius = config.polarRadius;
			/** polar angle degree */
			this.polarDegree = config.polarDegree;
			/** direction */
			this.direction = (config.direction !== undefined)? config.direction :'Clockwise';
			this.x0;this.y0;this.r0;this.arc0;
			this.x1;this.y1;this.r1;this.arc1;
			this.intersectionPointStart;
			this.theta1Radian1;
			this.intersectionPointEnd;
			this.theta1Radian2;
			JenScript.PathBinder.call(this,config);
		},
		
		/**
		 * given the polar angle radian of point P(px,py) which is on the circle
		 * define by its center C(refX,refY)
		 * 
		 * @param {Number} refX
		 * @param {Number} refY
		 * @param {Number} px
		 * @param {Number} py
		 * @return {Number} polar angle radian
		 */
		getPolarAngle : function( refX,  refY,  px,  py) {
			var tethaRadian = -1;
			if ((px - refX) > 0 && (refY - py) >= 0) {
				tethaRadian = Math.atan((refY - py) / (px - refX));
			} else if ((px - refX) > 0 && (refY - py) < 0) {
				tethaRadian = Math.atan((refY - py) / (px - refX)) + 2 * Math.PI;
			} else if ((px - refX) < 0) {
				tethaRadian = Math.atan((refY - py) / (px - refX)) + Math.PI;
			} else if ((px - refX) == 0 && (refY - py) > 0) {
				tethaRadian = Math.PI / 2;
			} else if ((px - refX) == 0 && (refY - py) < 0) {
				tethaRadian = 3 * Math.PI / 2;
			}
			return tethaRadian;
		},
		
		/**
		 * bind path for given gauge
		 * @param {Object} gaug
		 * @returns binded path
		 */
		bindPath : function(gauge) {
			if(this.solveIntersectionPoints())
				return this.createPath();
			else
				return undefined;
		},

		/**
		 * create the shape according to the binder
		 * @return {Object} path to bind 
		 */
		createPath : function(){throw new Error('JenScript.AbstractPathAutoBinder, createPath should be supplied by override.');},

		/**
		 * solve the arc0 (gauge arc) and arc1(path arc) intersection
		 */
		solveIntersectionPoints : function() {
			var gauge = this.getMetricsPath().getBody().getGauge();
			
			// define first circle which is gauge outline circle
			this.x0 = gauge.getCenterDevice().getX();
			this.y0 = gauge.getCenterDevice().getY();
			this.r0 = gauge.getRadius();
			this.arc0 = new JenScript.SVGCircle().center(this.x0,this.y0).radius(this.r0);
			
			// define the second circle with given parameters
			this.x1 = this.x0 + this.polarRadius * Math.cos(JenScript.Math.toRadians(this.polarDegree));
			this.y1 = this.y0 - this.polarRadius * Math.sin(JenScript.Math.toRadians(this.polarDegree));
			this.r1 = this.radius;

			this.arc1 = new JenScript.SVGCircle().center(this.x1,this.y1).radius(this.r1);
			var x0 =this.x0;
			var y0 =this.y0;
			var r0 =this.r0;
			var x1 =this.x1;
			var y1 =this.y1;
			var r1 =this.r1;
			if (this.polarDegree != 0 && this.polarDegree != 180) {
				// Ax²+Bx+B = 0
				var N = (r1 * r1 - r0 * r0 - x1 * x1 + x0 * x0 - y1 * y1 + y0 * y0) / (2 * (y0 - y1));
				var A = Math.pow((x0 - x1) / (y0 - y1), 2) + 1;
				var B = 2 * y0 * (x0 - x1) / (y0 - y1) - 2 * N * (x0 - x1) / (y0 - y1) - 2 * x0;
				var C = x0 * x0 + y0 * y0 + N * N - r0 * r0 - 2 * y0 * N;
				var delta = Math.sqrt(B * B - 4 * A * C);

				if (delta < 0) {
					return false;
				} else if (delta >= 0) {

					// p1
					var p1x = (-B - delta) / (2 * A);
					var p1y = N - p1x * (x0 - x1) / (y0 - y1);
					this.intersectionPointStart = new JenScript.Point2D(p1x, p1y);

					// p2
					var p2x = (-B + delta) / (2 * A);
					var p2y = N - p2x * (x0 - x1) / (y0 - y1);
					this.intersectionPointEnd = new JenScript.Point2D(p2x, p2y);

					this.theta1Radian1 = this.getPolarAngle(x1, y1, p1x, p1y);
					this.theta1Radian2 = this.getPolarAngle(x1, y1, p2x, p2y);
					return true;

				}
			} else if (this.polarDegree == 0 || this.polarDegree == 180) {
				// polar degree = 0|180 -> y0=y1
				// Ay²+By + C = 0;
				var x = (r1 * r1 - r0 * r0 - x1 * x1 + x0 * x0) / (2 * (x0 - x1));
				var A = 1;
				var B = -2 * y1;
				var C = x1 * x1 + x * x - 2 * x1 * x + y1 * y1 - r1 * r1;
				var delta = Math.sqrt(B * B - 4 * A * C);

				if (delta < 0) {
					//alert("no solution");
					return false;
				} else if (delta >= 0) {

					// p1
					var p1x = x;
					var p1y = (-B - delta) / 2 * A;
					this.intersectionPointStart = new JenScript.Point2D(p1x, p1y);

					// p2
					var p2x = x;
					var p2y = (-B + delta) / 2 * A;
					this.intersectionPointEnd = new JenScript.Point2D(p2x, p2y);

					this.theta1Radian1 = this.getPolarAngle(x1, y1, p1x, p1y);
					this.theta1Radian2 = this.getPolarAngle(x1, y1, p2x, p2y);
					return true;

				}
			}
		},

		/**
		 * paint debug for this auto path binder
		 * @param {Object} graphics context
		 * @param {Object} gauge
		 */
		paintDebug : function(g2d,gauge) {
		
			var p =this.createPath();
			if(p === undefined)
				return;
			this.solveIntersectionPoints();

			var line3 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.x0,this.y0);
			g2d.insertSVG(line3.stroke(JenScript.Color.brighten('#2980b9',30).toHexString()).fillNone().toSVG());
			
			g2d.insertSVG(this.arc0.stroke('black').fillNone().toSVG());
			g2d.insertSVG(this.arc1.stroke('darkgray').fillNone().toSVG());
			
			if(this.intersectionPointStart === undefined || this.intersectionPointEnd === undefined)
				return;
			
			var line1 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.intersectionPointStart.x,this.intersectionPointStart.y);
			g2d.insertSVG(line1.stroke('yellow').fillNone().toSVG());
			
			var line2 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.intersectionPointEnd.x,this.intersectionPointEnd.y);
			g2d.insertSVG(line2.stroke('yellow').fillNone().toSVG());
			
			var i1 = new JenScript.SVGCircle().center(this.intersectionPointStart.getX(), this.intersectionPointStart.getY()).radius(4);
			var i2 = new JenScript.SVGCircle().center(this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY()).radius(4);
			
			var color = (this.direction == 'Clockwise')? '#1abc9c' : '#e74c3c';
			this.drawPath(g2d, p, color);
			
			g2d.insertSVG(i1.fill('#f1c40f').toSVG());
			g2d.insertSVG(i2.fill('#f1c40f').toSVG());
			
		},

		/**
		 * draw the given path with given color
		 * @param {Object} graphics context
		 * @param {Object} path
		 * @param {String} color
		 */
		drawPath : function(g2d,path,c) {
			if (path == undefined)
				return;
			g2d.insertSVG(path.stroke(c).strokeWidth(2).fillNone().toSVG());
			var geom = new JenScript.GeometryPath(path.toSVG());
			var s1 = this.creatTickDirection(path, geom.lengthOfPath() / 2, 5);
			var s2 = this.creatTickDirection(path, geom.lengthOfPath() / 4, 4);
			var s3 = this.creatTickDirection(path, geom.lengthOfPath() * 3 / 4, 4);
			if (s1 != undefined)
				g2d.insertSVG(s1.fill(c).toSVG());
			if (s2 != undefined)
				g2d.insertSVG(s2.fill(c).toSVG());
			if (s3 != undefined)
				g2d.insertSVG(s3.fill(c).toSVG());
		},

		/**
		 * create tick direction according to path direction
		 * @param {Object} shape
		 * @param {Number} length
		 * @param {Number} size
		 * @return {Object} tick shape
		 */
		creatTickDirection : function(shape,length,size) {
			var geom = new JenScript.GeometryPath(shape.toSVG());
			var div = size;
			if (length - div > 0 && length + 2 * div < geom.lengthOfPath()) {
				var path = new JenScript.SVGPath();
				var p1 = geom.pointAtLength(length + 2 * div);
				var pl = geom.orthoLeftPointAtLength(length - div, div);
				var pr = geom.orthoRightPointAtLength(length - div, div);
				path.moveTo(p1.getX(), p1.getY());
				path.lineTo(pr.getX(), pr.getY());
				path.lineTo(pl.getX(), pl.getY());
				path.close();
				return path;
			}
			return undefined;
		}
	});
	
	
	/**
	 * Object JenScript.PathArcAutoBinder()
	 * Auto Path Binder for gauge arc metrics
	 * 
	 * @param {Object} config
	 * @param {Number} [config.radius] arc radius
	 * @param {Number} [config.polarRadius] polar radius
	 * @param {Number} [config.polarAngle] polar angle
	 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
	 */
	JenScript.PathArcAutoBinder = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PathArcAutoBinder,JenScript.AbstractPathAutoBinder);
	JenScript.Model.addMethods(JenScript.PathArcAutoBinder,{
		
		/**
		 * Initialize Arc Auto Path Binder
		 * 
		 * @param {Object} config
		 * @param {Number} [config.radius] arc radius
		 * @param {Number} [config.polarRadius] polar radius
		 * @param {Number} [config.polarAngle] polar angle
		 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
		 */
		__init : function(config){
			config = config || {};
			/** the arc which is bind by this binder */
			this.intersectionArc;
			JenScript.AbstractPathAutoBinder.call(this,config);
		},
		
		/**
		 * get intersected arc 
		 * @return {Object} the intersectionArc
		 */
		getIntersectionArc : function() {
			return this.intersectionArc;
		},

		/**
		 * set intersected arc
		 * @param {Object} intersectionArc
		 */
		setIntersectionArc : function(intersectionArc) {
			this.intersectionArc = intersectionArc;
		},

		/**
		 * create path for this auto arc path binder
		 * @returns {Object} arc to bind
		 */
		createPath : function() {
			var polar = function (anchor,radius, angleRadian){
				return {
					x : anchor.x +radius*Math.cos(angleRadian),
					y : anchor.y -radius*Math.sin(angleRadian)
				};
			};
			var x1 =this.x1;
			var y1 =this.y1;
			var r1 =this.r1;
			var theta1Radian1 = this.theta1Radian1;
			var theta1Radian2 = this.theta1Radian2; 
			var path = new JenScript.SVGPath();
			if (this.polarDegree > 0 && this.polarDegree < 180) {
				if (this.theta1Radian2 > this.theta1Radian1) {
					var extendsDegree = JenScript.Math.toDegrees(this.theta1Radian2) - JenScript.Math.toDegrees(this.theta1Radian1);
					var largeArcFlag = (extendsDegree >=180 || extendsDegree <= -180)? 1:0;
					if (this.direction == 'AntiClockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian1);
						var a = polar({x:x1,y:y1},r1,theta1Radian1 + JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,0,a.x,a.y);
					} else if (this.direction == 'Clockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian2);
						var a = polar({x:x1,y:y1},r1,theta1Radian2 - JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,1,a.x,a.y);
					}
				} else {
					var extendsDegree = Math.abs(JenScript.Math.toDegrees(2 * Math.PI + theta1Radian2) - JenScript.Math.toDegrees(theta1Radian1));
					var largeArcFlag = (extendsDegree >=180 || extendsDegree <= -180)? 1:0;
					if (this.direction == 'AntiClockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian1);
						var a = polar({x:x1,y:y1},r1,theta1Radian1 + JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,0,a.x,a.y);
						
					} else if (this.direction == 'Clockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian2);
						var a = polar({x:x1,y:y1},r1,theta1Radian2 - JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,1,a.x,a.y);
					}
				}
			} 
			else if (this.polarDegree > 180 && this.polarDegree < 360) {
				if (this.theta1Radian2 > this.theta1Radian1) {
					var extendsDegree = (360 - (JenScript.Math.toDegrees(theta1Radian2) - JenScript.Math.toDegrees(theta1Radian1)));
					var largeArcFlag = (extendsDegree >=180 || extendsDegree <= -180)? 1:0;
					if (this.direction == 'AntiClockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian2);
						var a = polar({x:x1,y:y1},r1,theta1Radian2 + JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,0,a.x,a.y);
					} else if (this.direction == 'Clockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian1);
						var a = polar({x:x1,y:y1},r1,theta1Radian1 - JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,1,a.x,a.y);
					}
				} else {
					var extendsDegree = (JenScript.Math.toDegrees(theta1Radian1) - JenScript.Math.toDegrees(theta1Radian2));
					var largeArcFlag = (extendsDegree >=180 || extendsDegree <= -180)? 1:0;
					if (this.direction == 'AntiClockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian2);
						var a = polar({x:x1,y:y1},r1,theta1Radian2 + JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,0,a.x,a.y);
					} else if (this.direction == 'Clockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian1);
						var a = polar({x:x1,y:y1},r1,theta1Radian1 - JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,1,a.x,a.y);
					}
				}
			} 
			else if (this.polarDegree === 0) {
				var extendsDegree = JenScript.Math.toDegrees(theta1Radian2) - JenScript.Math.toDegrees(theta1Radian1);
				var largeArcFlag = (extendsDegree >=180 || extendsDegree <= -180)? 1:0;
				if (this.direction === 'AntiClockwise') {
					var m = polar({x:x1,y:y1},r1,theta1Radian1);
					var a = polar({x:x1,y:y1},r1,theta1Radian1 + JenScript.Math.toRadians(extendsDegree));
					path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,0,a.x,a.y);
				} else if (this.direction === 'Clockwise') {
					var m = polar({x:x1,y:y1},r1,theta1Radian2);
					var a = polar({x:x1,y:y1},r1,theta1Radian2 - JenScript.Math.toRadians(extendsDegree));
					path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,1,a.x,a.y);
				}
			}
			else if (this.polarDegree === 180) {
				var extendsDegree = 360 - JenScript.Math.toDegrees(theta1Radian2) + JenScript.Math.toDegrees(theta1Radian1);
				var largeArcFlag = (extendsDegree >=180 || extendsDegree <= -180)? 1:0;
				if (this.direction === 'AntiClockwise') {
					var m = polar({x:x1,y:y1},r1,theta1Radian2);
					var a = polar({x:x1,y:y1},r1,theta1Radian2 + JenScript.Math.toRadians(extendsDegree));
					path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,0,a.x,a.y);
				} else if (this.direction === 'Clockwise') {
					var m = polar({x:x1,y:y1},r1,theta1Radian1);
					var a = polar({x:x1,y:y1},r1,theta1Radian1 - JenScript.Math.toRadians(extendsDegree));
					path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,1,a.x,a.y);
				}
			}
			this.intersectionArc = path;
			return this.intersectionArc;
		}
	});
	
	
	/**
	 * Object JenScript.PathArcManualBinder()
	 * Manual Arc path binder for arc metrics.
	 * 
	 * @param {Object} config
	 * @param {Number} [config.startAngleDegree] manual start angle degree
	 * @param {Number} [config.extendsAngleDegree] manual extends angle degree
	 * @param {Number} [config.radius] arc radius
	 * @param {Number} [config.polarRadius] polar radius, default 0
	 * @param {Number} [config.polarAngle] polar angle, default 0
	 */
	JenScript.PathArcManualBinder = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PathArcManualBinder,JenScript.PathBinder);
	JenScript.Model.addMethods(JenScript.PathArcManualBinder,{
		/**
		 * Initialize Manual Arc Path Binder.
		 * @param {Object} config
		 * @param {Number} [config.startAngleDegree] manual start angle degree
		 * @param {Number} [config.extendsAngleDegree] manual extends angle degree
		 * @param {Number} [config.radius] arc radius
		 * @param {Number} [config.shiftRadius] polar radius, default 0
		 * @param {Number} [config.shiftAngleDegree] polar angle, default 0
		 */
		_init : function(config){
			config = config || {};
			/** binder radius */
			this.radius = config.radius;
			/** binder start angle degree */
			this.startAngleDegree = config.startAngleDegree;
			/** binder extends angle degree */
			this.extendsAngleDegree = config.extendsAngleDegree;
			/** shift radius */
			this.shiftRadius = (config.shiftRadius !== undefined) ? config.shiftRadius: 0;
			/** shift angle degree */
			this.shiftAngleDegree = (config.shiftAngleDegree !== undefined) ? config.shiftAngleDegree: 0;
		},
		
		/**
		 * bind the arc for the given gauge
		 * @param {Object} gauge
		 */
		bindPath : function(gauge) {
			var centerX = gauge.getCenterDevice().getX();
			var centerY = gauge.getCenterDevice().getY();
			var shiftCenterX = centerX + this.shiftRadius * Math.cos(JenScript.Math.toRadians(this.shiftAngleDegree));
			var shiftCenterY = centerY - this.shiftRadius * Math.sin(JenScript.Math.toRadians(this.shiftAngleDegree));
			var polar = function(anchor, radius,angle){
				return {
					x : anchor.x +radius * Math.cos(JenScript.Math.toRadians(angle)),
					y : anchor.y -radius * Math.sin(JenScript.Math.toRadians(angle)),
				};
			};
			var anchor =  {x : shiftCenterX,y:shiftCenterY};
			var p1 = polar(anchor,this.radius,this.startAngleDegree);
			var p2 = polar(anchor,this.radius,this.startAngleDegree+this.extendsAngleDegree);
			var path = new JenScript.SVGPath();
			var largeArcFlag = (this.extendsAngleDegree >=180 || this.extendsAngleDegree <= -180)? 1:0;
			var sweepFlag = (this.extendsAngleDegree < 0)? 1:0;
			path.moveTo(p1.x,p1.y).arcTo(this.radius,this.radius,0,largeArcFlag,sweepFlag,p2.x,p2.y);
			
//			if(this.extendsAngleDegree >= 0){
//				//alert("case 1");
//				path.moveTo(p1.x,p1.y).arcTo(this.radius,this.radius,0,largeArcFlag,sweepFlag,p2.x,p2.y);
//			}
//			else{
//				//alert("case 2");
//				path.moveTo(p2.x,p2.y).arcTo(this.radius,this.radius,0,largeArcFlag,sweepFlag,p1.x,p1.y);
//			}
			return path;
		}
	});
	
	
	
	
	/**
	 * Object JenScript.PathCubicAutoBinder()
	 * Auto Cubic Path Binder for gauge metrics
	 * 
	 * @param {Object} config
	 * @param {Number} [config.controlOffsetRadius] offset radius for control points
	 * @param {Number} [config.controlOffsetAngleDegree] offset angle for control points
	 * @param {Number} [config.radius] arc radius
	 * @param {Number} [config.polarRadius] polar radius
	 * @param {Number} [config.polarAngle] polar angle
	 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
	 */
	JenScript.PathCubicAutoBinder = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PathCubicAutoBinder,JenScript.AbstractPathAutoBinder);
	JenScript.Model.addMethods(JenScript.PathCubicAutoBinder,{
		
		/**
		 * Initialize Cubic Auto Path Binder
		 * 
		 * @param {Object} config
		 * @param {Number} [config.controlOffsetRadius] offset radius for control points
		 * @param {Number} [config.controlOffsetAngleDegree] offset angle for control points
		 * @param {Number} [config.radius] arc radius
		 * @param {Number} [config.polarRadius] polar radius
		 * @param {Number} [config.polarAngle] polar angle
		 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
		 */
		__init : function(config){
			config = config || {};
			/** the cubic curve which is bind by this binder */
			this.intersectionCubicCurve;
			/** control offset radius */
			this.controlOffsetRadius = 10;
			/** control offset angle degree */
			this.controlOffsetAngleDegree = 10;
			config.name='JenScript.PathCubicAutoBinder';
			JenScript.AbstractPathAutoBinder.call(this,config);
		},
		
		/**
		 * get cubic intersection curve
		 * @return {Object} the intersectionCubicCurve
		 */
		getIntersectionCubicCurve  : function() {
			return this.intersectionCubicCurve;
		},

		/**
		 * set cubic intersection curve
		 * @param {Object} intersectionCubicCurve
		 */
		setIntersectionCubicCurve  : function(intersectionCubicCurve) {
			this.intersectionCubicCurve = intersectionCubicCurve;
		},

		/**
		 * get cubic control offset radius
		 * @return {Number} controlOffsetRadius
		 */
		getControlOffsetRadius  : function() {
			return this.controlOffsetRadius;
		},

		/**
		 * set cubic control offset radius
		 * @param {Number} controlOffsetRadius
		 */
		setControlOffsetRadius  : function(controlOffsetRadius) {
			if (controlOffsetRadius < 0)
				throw new Error('control offset radius must be positive');
			this.controlOffsetRadius = controlOffsetRadius;
		},

		/**
		 * get cubic cubic offset angle
		 * @return {Number} the controlOffsetAngleDegree
		 */
		getControlOffsetAngleDegree  : function() {
			return this.controlOffsetAngleDegree;
		},

		/**
		 * set offset angle degree for cubic control point
		 * @param {Number} controlOffsetAngleDegree
		 */
		setControlOffsetAngleDegree  : function( controlOffsetAngleDegree) {
			if (controlOffsetAngleDegree < 0)
				throw new Error('control offset angle must be positive');
			this.controlOffsetAngleDegree = controlOffsetAngleDegree;
		},

		/**
		 * create cubic curve segment from start to end point
		 * @return {Object} cubic curve segment
		 */
		createCubicStart2End  : function() {
			return new JenScript.SVGPath().moveTo(this.intersectionPointStart.getX(), this.intersectionPointStart.getY()).cubicTo(this.getControlPoint1().getX(), this.getControlPoint1().getY(), this.getControlPoint2().getX(), this.getControlPoint2().getY(), this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY());
		},

		/**
		 * create cubic curve segment from end to start point
		 * @return {Object} cubic curve segment
		 */
		createCubicEnd2Start  : function() {
			return new JenScript.SVGPath().moveTo(this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY()).cubicTo(this.getControlPoint1().getX(), this.getControlPoint1().getY(), this.getControlPoint2().getX(), this.getControlPoint2().getY(), this.intersectionPointStart.getX(), this.intersectionPointStart.getY());
		},

		/**
		 * create cubic curve to bind
		 */
		createPath  : function() {
			if (this.intersectionPointStart === undefined || this.intersectionPointEnd === undefined)
				return undefined;
			if (this.polarDegree >= 0 && this.polarDegree < 180) {
				if (this.direction === 'AntiClockwise') {
					this.intersectionCubicCurve = this.createCubicStart2End();
				} else if(this.direction === 'Clockwise') {
					this.intersectionCubicCurve = this.createCubicEnd2Start();
				}
			} else if (this.polarDegree >= 180 && this.polarDegree < 360) {
				if (this.direction === 'AntiClockwise') {
					this.intersectionCubicCurve = this.createCubicEnd2Start();
				} else if(this.direction === 'Clockwise') {
					this.intersectionCubicCurve = this.createCubicStart2End();
				}
			}
			return this.intersectionCubicCurve;
		},

		/**
		 * return the control point 1 according the cubic binder configuration
		 * @return {Object} control point 1
		 */
		getControlPoint1 : function() {
			if (this.direction === 'Clockwise'){
				var x = this.x1 + (this.radius + this.controlOffsetRadius) * Math.cos(JenScript.Math.toRadians(this.polarDegree) + Math.PI + JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				var y = this.y1 - (this.radius + this.controlOffsetRadius) * Math.sin(JenScript.Math.toRadians(this.polarDegree) + Math.PI + JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				return new JenScript.Point2D(x, y);
			} else if(this.direction === 'AntiClockwise'){
				var x = this.x1 + (this.radius + this.controlOffsetRadius) * Math.cos(JenScript.Math.toRadians(this.polarDegree) + Math.PI - JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				var y = this.y1 - (this.radius + this.controlOffsetRadius) * Math.sin(JenScript.Math.toRadians(this.polarDegree) + Math.PI - JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				return new JenScript.Point2D(x, y);
			}
		},

		/**
		 * return the control point 2 according the cubic binder configuration
		 * @return {Object} control point 2
		 */
		getControlPoint2 : function() {
			if (this.direction === 'Clockwise'){
				var x = this.x1 + (this.radius + this.controlOffsetRadius) * Math.cos(JenScript.Math.toRadians(this.polarDegree) + Math.PI - JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				var y = this.y1 - (this.radius + this.controlOffsetRadius) * Math.sin(JenScript.Math.toRadians(this.polarDegree) + Math.PI - JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				return new JenScript.Point2D(x, y);
			} else if(this.direction === 'AntiClockwise'){
				var x = this.x1 + (this.radius + this.controlOffsetRadius) * Math.cos(JenScript.Math.toRadians(this.polarDegree) + Math.PI + JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				var y = this.y1 - (this.radius + this.controlOffsetRadius) * Math.sin(JenScript.Math.toRadians(this.polarDegree) + Math.PI + JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				return new JenScript.Point2D(x, y);
			}
		},

		/**
		 * paint cubic debug path finder
		 * @param {Object} graphics context
		 * @param {Object} gauge
		 */
		paintDebug : function(g2d,gauge) {
			
			//TODO : super block, waiting for super method impl
			var p =this.createPath();
			if(p === undefined)
				return;
			this.solveIntersectionPoints();

			var line3 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.x0,this.y0);
			g2d.insertSVG(line3.stroke(JenScript.Color.brighten('#2980b9',30).toHexString()).fillNone().toSVG());
			
			g2d.insertSVG(this.arc0.stroke('black').fillNone().toSVG());
			g2d.insertSVG(this.arc1.stroke('darkgray').fillNone().toSVG());
			
			if(this.intersectionPointStart === undefined || this.intersectionPointEnd === undefined)
				return;
			
			var line1 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.intersectionPointStart.x,this.intersectionPointStart.y);
			g2d.insertSVG(line1.stroke('yellow').fillNone().toSVG());
			
			var line2 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.intersectionPointEnd.x,this.intersectionPointEnd.y);
			g2d.insertSVG(line2.stroke('yellow').fillNone().toSVG());
			
			var i1 = new JenScript.SVGCircle().center(this.intersectionPointStart.getX(), this.intersectionPointStart.getY()).radius(4);
			var i2 = new JenScript.SVGCircle().center(this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY()).radius(4);
			
			var color = (this.direction == 'Clockwise')? '#1abc9c' : '#e74c3c';
			this.drawPath(g2d, p, color);
			
			g2d.insertSVG(i1.fill('#f1c40f').toSVG());
			g2d.insertSVG(i2.fill('#f1c40f').toSVG());
			
			//this debug block
			//super.debug(g2d, gauge);

//			g2d.setColor(NanoChromatique.BLUE);
//			g2d.draw(new Ellipse2D.Double(getControlPoint1().getX() - 2, getControlPoint1().getY() - 2, 4, 4));
//			g2d.drawString("C1", (int) getControlPoint1().getX(), (int) getControlPoint1().getY());
//
//			g2d.setColor(NanoChromatique.RED);
//			g2d.draw(new Ellipse2D.Double(getControlPoint2().getX() - 2, getControlPoint2().getY() - 2, 4, 4));
//			g2d.drawString("C2", (int) getControlPoint2().getX(), (int) getControlPoint2().getY());
//
//			g2d.setColor(new Alpha(NanoChromatique.GREEN, 80));
//			g2d.draw(new Ellipse2D.Double(x1 - (r1 + controlOffsetRadius), y1 - (r1 + controlOffsetRadius), 2 * (r1 + controlOffsetRadius), 2 * (r1 + controlOffsetRadius)));
		}
	});
	
	/**
	 * Object JenScript.PathQuadAutoBinder()
	 * Auto Quadratic Path Binder for gauge metrics
	 * 
	 * @param {Object} config
	 * @param {Number} [config.controlOffsetRadius] offset radius for control points
	 * @param {Number} [config.radius] arc radius
	 * @param {Number} [config.polarRadius] polar radius
	 * @param {Number} [config.polarAngle] polar angle
	 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
	 */
	JenScript.PathQuadAutoBinder = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PathQuadAutoBinder,JenScript.AbstractPathAutoBinder);
	JenScript.Model.addMethods(JenScript.PathQuadAutoBinder,{
		
		/**
		 * Initialize Quadratic Auto Path Binder
		 * 
		 * @param {Object} config
		 * @param {Number} [config.controlOffsetRadius] offset radius for quadratic control points
		 * @param {Number} [config.radius] arc radius
		 * @param {Number} [config.polarRadius] polar radius
		 * @param {Number} [config.polarAngle] polar angle
		 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
		 */
		__init : function(config){
			config = config || {};
			/** the quadratic curve which is bind by this binder */
			this.intersectionQuadCurve;
			/** control offset radius */
			this.controlOffsetRadius = 10;
			config.name='JenScript.PathQuadAutoBinder';
			JenScript.AbstractPathAutoBinder.call(this,config);
		},
		
		/**
		 * get intersection quad curve
		 * @return {Object} intersectionQuadCurve
		 */
		getIntersectionQuadCurve : function() {
			return this.intersectionQuadCurve;
		},

		/**
		 * set intersection quad curve
		 * @param {Object} intersectionQuadCurve
		 */
		setIntersectionQuadCurve : function(intersectionQuadCurve) {
			this.intersectionQuadCurve = intersectionQuadCurve;
		},

		/**
		 * get control offset radius
		 * @return {Number} controlOffsetRadius
		 */
		getControlOffsetRadius : function() {
			return this.controlOffsetRadius;
		},

		/**
		 * set control offset radius
		 * @param {Number} controlOffsetRadius
		 */
		setControlOffsetRadius : function(controlOffsetRadius) {
			if (this.controlOffsetRadius < 0)
				throw new Error('control offset radius must be positive');
			this.controlOffsetRadius = controlOffsetRadius;
		},

		/**
		 * create quadratic segment from start to end point
		 * @return {Object} quadratic segment
		 */
		createQuadStart2End : function() {
			return new JenScript.SVGPath().moveTo(this.intersectionPointStart.getX(),this.intersectionPointStart.getY()).quadTo(this.getControlPoint().getX(), this.getControlPoint().getY(), this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY());
		},

		/**
		 * create quadratic segment from end to start point
		 * @return {Object} quadratic segment
		 */
		createQuadEnd2Start : function() {
			return new JenScript.SVGPath().moveTo(this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY()).quadTo(this.getControlPoint().getX(), this.getControlPoint().getY(), this.intersectionPointStart.getX(), this.intersectionPointStart.getY());
		},

		/**
		 * create quad path to bind
		 */
		createPath : function() {
			if (this.intersectionPointStart === undefined || this.intersectionPointEnd == undefined)
				return undefined;
			if (this.polarDegree >= 0 && this.polarDegree < 180) {
				if (this.direction === 'AntiClockwise') {
					this.intersectionQuadCurve = this.createQuadStart2End();
				} else if (this.direction == Direction.Clockwise) {
					this.intersectionQuadCurve = this.createQuadEnd2Start();
				}
			} else if (this.polarDegree >= 180 && this.polarDegree < 360) {
				if (this.direction === 'AntiClockwise') {
					this.intersectionQuadCurve = this.createQuadEnd2Start();
				} else if (this.direction == Direction.Clockwise) {
					this.intersectionQuadCurve = this.createQuadStart2End();
				}
			}
			return this.intersectionQuadCurve;
		},

		/**
		 * return the control point according the quadratic binder configuration
		 * @return {Object} control point
		 */
		getControlPoint : function() {
			var x = this.x1 + (this.radius + this.controlOffsetRadius) * Math.cos(JenScript.Math.toRadians(this.polarDegree) + Math.PI);
			var y = this.y1 - (this.radius + this.controlOffsetRadius) * Math.sin(JenScript.Math.toRadians(this.polarDegree) + Math.PI);
			return new JenScript.Point2D(x, y);
		},

		/**
		 * paint quad debug path finder
		 * @param {Object} graphics context
		 * @param {Object} gauge
		 */
		paintDebug : function(g2d,gauge) {
			//TODO : super block, waiting for super method impl
			var p =this.createPath();
			if(p === undefined)
				return;
			this.solveIntersectionPoints();

			var line3 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.x0,this.y0);
			g2d.insertSVG(line3.stroke(JenScript.Color.brighten('#2980b9',30).toHexString()).fillNone().toSVG());
			
			g2d.insertSVG(this.arc0.stroke('black').fillNone().toSVG());
			g2d.insertSVG(this.arc1.stroke('darkgray').fillNone().toSVG());
			
			if(this.intersectionPointStart === undefined || this.intersectionPointEnd === undefined)
				return;
			
			var line1 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.intersectionPointStart.x,this.intersectionPointStart.y);
			g2d.insertSVG(line1.stroke('yellow').fillNone().toSVG());
			
			var line2 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.intersectionPointEnd.x,this.intersectionPointEnd.y);
			g2d.insertSVG(line2.stroke('yellow').fillNone().toSVG());
			
			var i1 = new JenScript.SVGCircle().center(this.intersectionPointStart.getX(), this.intersectionPointStart.getY()).radius(4);
			var i2 = new JenScript.SVGCircle().center(this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY()).radius(4);
			
			var color = (this.direction == 'Clockwise')? '#1abc9c' : '#e74c3c';
			this.drawPath(g2d, p, color);
			
			g2d.insertSVG(i1.fill('#f1c40f').toSVG());
			g2d.insertSVG(i2.fill('#f1c40f').toSVG());
			
			//this quad debug
//			g2d.setColor(NanoChromatique.GREEN);
//
//			g2d.draw(new Ellipse2D.Double(getControlPoint().getX() - 2, getControlPoint().getY() - 2, 4, 4));
//
//			g2d.setColor(new Alpha(NanoChromatique.GREEN, 100));
//			g2d.draw(new Ellipse2D.Double(x1 - (r1 + controlOffsetRadius), y1 - (r1 + controlOffsetRadius), 2 * (r1 + controlOffsetRadius), 2 * (r1 + controlOffsetRadius)));
		}
	});
})();
(function(){
	
	/**
	 * Object JenScript.GaugeNeedlePainter()
	 * 
	 * Defines a gauge needle painter taht takes the responsibility to paint a needle
	 * which is based on anchors binders declared in gauge path metrics
	 * @param {Object} config
	 */
	JenScript.GaugeNeedlePainter = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.GaugeNeedlePainter,{
		/**
		 * Initialize gauge needle painter
		 * 
		 * @param {Object} config
		 */
		init : function(config){
			config = config || {};
		},
		
		/**
		 * paint needle for the given gauge metrics path anchor configuration
		 * 
		 * @param {Object} graphics context
		 * @param {Object} gaugeMetricsPath
		 */
		paintNeedle : function(g2d,metricsPath){throw new Error('JenScript.GaugeNeedlePainter, paintNeedle method should be provide by override');}
	});
	
	
	/**
	 * Object JenScript.GaugeNeedleClassicPainter()
	 * 
	 * Defines classic needle
	 * @param {Object} config
	 */
	JenScript.GaugeNeedleClassicPainter = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GaugeNeedleClassicPainter,JenScript.GaugeNeedlePainter);
	JenScript.Model.addMethods(JenScript.GaugeNeedleClassicPainter,{
		/**
		 * Initialize classic gauge needle
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			JenScript.GaugeNeedlePainter.call(this,config);
		},

		/**
		 * paint classic needle for the given gauge metrics path anchor configuration
		 * @param {Object} graphics context
		 * @param {Object} gauge metrics path
		 */
		paintNeedle : function(g2d,gaugeMetricsPath) {
			var needleBase = gaugeMetricsPath.getNeedleBaseAnchorBinder().bindAnchor(gaugeMetricsPath.getBody().getGauge());
			var needleValue = gaugeMetricsPath.getNeedleValueAnchorBinder().bindAnchor(gaugeMetricsPath.getBody().getGauge());
			var needleLine = new JenScript.SVGPath().moveTo(needleBase.x,needleBase.y).lineTo(needleValue.x,needleValue.y);
			var s1 = needleLine.strokeWidth(4).strokeLineCap('round').opacity(0.6).stroke('black').toSVG();
			var s2 = needleLine.strokeWidth(10).strokeLineCap('round').opacity(0.4).stroke('#2980b9').toSVG();
			g2d.insertSVG(s2);
			g2d.insertSVG(s1);
			var centerRadius =14;
			var shader = {percents:['0%','100%'],colors:['#2980b9','black']};
			var gradientId = "gradient"+JenScript.sequenceId++;
			var gradient= new JenScript.SVGRadialGradient().Id(gradientId).center(needleBase.getX(),needleBase.getY()).focus(needleBase.getX(),needleBase.getY()).radius(centerRadius).shade(shader.percents,shader.colors).toSVG();
			g2d.definesSVG(gradient);
			var center = new JenScript.SVGCircle().center(needleBase.getX(),needleBase.getY()).radius(centerRadius);
			g2d.insertSVG(center.fillURL(gradientId).fillOpacity(0.6).strokeOpacity(0.5).strokeWidth(2).stroke('#2980b9').toSVG());
		}
	});
	
})();
(function(){

	
	/**
	 * Object JenScript.GaugeMetricsPath()
	 * Defines a gauge metrics path
	 * @param {Object} config
	 */
	JenScript.GaugeMetricsPath = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GaugeMetricsPath,JenScript.GeneralMetricsPath);
	JenScript.Model.addMethods(JenScript.GaugeMetricsPath,{
		_init : function(config){
			config = config || {};
			config.nature = 'Device';
			/** current value */
			this.currentValue;
			/** needle base anchor binder */
			this.needleBaseAnchorBinder;
			/** needle value anchor binder */
			this.needleValueAnchorBinder;
			/** gauge body this metrics path */
			this.body;
			/** path binder */
			this.pathBinder;
			/** gauge needle painter */
			this.gaugeNeedlePainter;
			JenScript.GeneralMetricsPath.call(this,config);
		},
		
		/**
		 * get gauge needle painter
		 * @returns {Object} needle painter
		 */
		getGaugeNeedlePainter : function() {
			return this.gaugeNeedlePainter;
		},

		/**
		 * set gauge needle painter
		 * @param {Object} gauge needle painter
		 */
		setGaugeNeedlePainter : function(gaugeNeedlePainter) {
			this.gaugeNeedlePainter = gaugeNeedlePainter;
		},

		/**
		 * get the current user value
		 * @returns {Number} current value
		 */
		getCurrentValue : function() {
			return this.currentValue;
		},

		/**
		 * set current user value
		 * @param {Number} currentValue
		 */
		setCurrentValue : function(currentValue) {
			if (this.currentValue < this.getMin() || this.currentValue > this.getMax())
				throw new Error("Gauge Metrics out of range. " + this.currentValue + " [min,max] path range.");
			this.currentValue = currentValue;
		},

		/**
		 * get path binder
		 * 
		 * @return path binder
		 */
		getPathBinder : function() {
			return this.pathBinder;
		},

		/**
		 * get path binder
		 * 
		 * @param pathBinder
		 */
		setPathBinder : function(pathBinder) {
			if(pathBinder !== undefined){
				pathBinder.setMetricsPath(this);
			}
			this.pathBinder = pathBinder;
		},

		/**
		 * get needle base anchor binder
		 * 
		 * @return needle base anchor binder
		 */
		getNeedleBaseAnchorBinder : function() {
			return this.needleBaseAnchorBinder;
		},

		/**
		 * set needle anchor binder
		 * 
		 * @param needleAnchorBinder
		 */
		setNeedleBaseAnchorBinder : function(needleAnchorBinder) {
			needleAnchorBinder.setMetricsPath(this);
			this.needleBaseAnchorBinder = needleAnchorBinder;
		},

		/**
		 * get needle value anchor binder
		 * 
		 * @return needle value anchor binder
		 */
		getNeedleValueAnchorBinder : function() {
			return this.needleValueAnchorBinder;
		},

		/**
		 * set needle value anchor binder
		 * 
		 * @param needleValueAnchorBinder
		 */
		setNeedleValueAnchorBinder : function(needleValueAnchorBinder) {
			needleValueAnchorBinder.setMetricsPath(this);
			this.needleValueAnchorBinder = needleValueAnchorBinder;
		},

		/**
		 * @return the body
		 */
		getBody : function() {
			return this.body;
		},

		/**
		 * @param body
		 *            the body to set
		 */
		setBody : function(body) {
			this.body = body;
		},

		/**
		 * create part buffer of this metrics path from original context.
		 * 
		 * @param g2d
		 */
		draw : function(g2d) {
			this.graphicsContext = g2d;
			this.getMetrics();


//			if (getPathPainter() != null) {
//				getPathPainter().paintPath(g2dPart, this);
//			}
//
//			List<GlyphMetric> metrics = getMetrics();
//			for (GlyphMetric m : metrics) {
//
//				if (m.getGlyphMetricMarkerPainter() != null) {
//					m.getGlyphMetricMarkerPainter().paintGlyphMetric(g2dPart, m);
//				}
//				if (m.getGlyphMetricFill() != null) {
//					m.getGlyphMetricFill().paintGlyphMetric(g2dPart, m);
//				}
//				if (m.getGlyphMetricDraw() != null) {
//					m.getGlyphMetricDraw().paintGlyphMetric(g2dPart, m);
//				}
//				if (m.getGlyphMetricEffect() != null) {
//					m.getGlyphMetricEffect().paintGlyphMetric(g2dPart, m);
//				}
//			}
		},
	});
})();
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
(function(){


	
	JenScript.GaugeCompass = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GaugeCompass,JenScript.RadialGauge);
	JenScript.Model.addMethods(JenScript.GaugeCompass,{
		_init : function(config){
			config = config || {};
			this.gaugeRadius = 110;
			config.radius = 110;
			JenScript.RadialGauge.call(this,config);
			
			var env = new JenScript.Cisero();
			this.setEnvelop(env);
			//var bg = new JenScript.LinearGradientCircularBackground();
			var bg = new JenScript.TextureCircularBackground();
			
			this.addBackground(bg);
			
			
			this.body = new JenScript.GaugeBody();
			this.addBody(this.body);
			
			this.createSecondaryMetrics();
		},
		
		/**
		 * create secondary metrics label
		 */
		createSecondaryMetrics : function() {

			
			this.secondaryPathManager = new JenScript.GaugeMetricsPath();
			//this.secondaryPathManager.setAutoReverseGlyph(false);
			//this.secondaryPathManager.setReverseAll(true);
			this.secondaryPathManager.setRange(0, 360);
			
			this.secondaryPathManager.setPathBinder(new JenScript.PathArcManualBinder({radius : this.gaugeRadius - 50, startAngleDegree :  0, extendsAngleDegree : 359}));
			this.body.registerGaugeMetricsPath(this.secondaryPathManager);

			//GlyphMetric metric;
			//Font f = InputFonts.getElements(12);
			var metric = new JenScript.GlyphMetric();
			metric.setValue(30);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature('Median');
			metric.setMetricsLabel("30");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.YELLOW.brighter()));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new  JenScript.GlyphMetric();
			metric.setValue(60);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			metric.setMetricsLabel("60");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.BLUE));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(120);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			metric.setMetricsLabel("120");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.BLUE));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(150);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			metric.setMetricsLabel("150");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.ORANGE.brighter()));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(210);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			metric.setMetricsLabel("210");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.ORANGE.brighter()));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(240);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			metric.setMetricsLabel("240");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.RED));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(300);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			//metric.setMetricsLabel("300");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.RED));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(330);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			metric.setMetricsLabel("330");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.YELLOW.brighter()));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);
		}
	});
})();