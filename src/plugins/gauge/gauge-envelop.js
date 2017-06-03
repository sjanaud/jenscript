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