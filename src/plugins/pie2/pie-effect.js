(function(){

	/**
	 * Object AbstractPieEffect()
	 * Defines Abstract Pie Effect
	 * @param {object} config
	 * @param {String} [config.name] the effect name
	 */
	JenScript.AbstractPieEffect = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractPieEffect,{
		/**
		 * Initialize Abstract Pie Effect
		 * @param {object} config
		 * @param {String} [config.name] the effect name
		 */
		init:function(config){
			config = config||{};
			this.Id = (config.Id !== undefined)?config.Id:'_effect'+JenScript.sequenceId++;
			this.name = config.name;
			this.opacity =  (config.opacity !== undefined)?config.opacity:1;
			this.projection = undefined;
		},
		
		/**
		 * set projection to this effect
		 * @param {Object} projection
		 */
		setProjection : function(projection) {
			this.projection = projection;
		},

		/**
		 * get projection to this effect
		 * @returns {Object} projection
		 */
		getProjection : function() {
			return this.projection;
		},

		/**
		 * paint effect on the given pie
		 * @param {Object} the graphics context
		 * @param {Object} the pie
		 */
		paintPieEffect : function(g2d, pie) {
			throw new Error("Abstract Pie Effect, this method should be provide by overriden.");
		}

	});
	
	
	
	
	/**
	 * Object PieReflectionEffect()
	 * Defines Pie Reflection Effect
	 * @param {Object} config
	 * @param {Object} [config.deviation]
	 * @param {Object} [config.opacity]
	 * @param {Object} [config.length]
	 * @param {Object} [config.verticalOffset]
	 */
	JenScript.PieReflectionEffect = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieReflectionEffect, JenScript.AbstractPieEffect);
	JenScript.Model.addMethods(JenScript.PieReflectionEffect,{
		
		/**
		 * Initialize Pie Reflection Effect
		 * @param {Object} config
		 * @param {Object} [config.deviation] blur deviation, default 3 pixels
		 * @param {Object} [config.opacity] effect opacity, default 0.3
		 * @param {Object} [config.verticalOffset] effect vertical offset, default 5 pixels
		 * @param {Object} [config.length] effect length [0,1], 1 reflect whole pie, 0.5 half of the pie, etc
		 */
		_init: function(config){
			config = config || {};
			this.deviation = (config.deviation !== undefined)?config.deviation : 3;
			this.opacity = (config.opacity !== undefined)?config.opacity : 0.3;
			this.length = (config.length !== undefined)?config.length : 0.5;
			this.verticalOffset = (config.verticalOffset !== undefined)?config.verticalOffset : 0;
			config.name = "JenScript.PieReflectionEffect";
			JenScript.AbstractPieEffect.call(this,config);
		},
		
		/**
		 * Paint pie reflection effect
		 * @param {Object} g2d the graphics context
		 * @param {Object} pie 
		 */
		paintPieEffect : function(g2d, pie) {
			
			var pieEffect = new JenScript.SVGGroup().Id(pie.Id+this.Id).opacity(this.opacity).toSVG();
			g2d.deleteGraphicsElement(pie.Id+this.Id);
			
			var bbox = pie.svg.pieRoot.getBBox();
			
			 //clip
			var clipId = 'clip'+JenScript.sequenceId++;
			var rectClip = new JenScript.SVGRect().origin(bbox.x,bbox.y+bbox.height).size(bbox.width,bbox.height*this.length);
			var clip = new JenScript.SVGClipPath().Id(clipId).appendPath(rectClip);
			g2d.definesSVG(clip.toSVG());
				
			
			//filter
			var filterId = 'filter'+JenScript.sequenceId++;
			var filter = new JenScript.SVGFilter().Id(filterId).from(bbox.x,bbox.y).size(bbox.width,bbox.height).toSVG();
			var gaussianFilter = new JenScript.SVGElement().name('feGaussianBlur')
															.attr('in','SourceGraphic')
															.attr('stdDeviation',this.deviation);
															
			filter.appendChild(gaussianFilter.buildHTML());
			g2d.definesSVG(filter);
		
			var e = pie.svg.pieRoot.cloneNode(true);
			e.removeAttribute('id');
			e.setAttribute('filter','url(#'+filterId+')');
			e.setAttribute('transform','translate(0,'+bbox.height+'), scale(1,-1), translate(0,'+(-2*(bbox.y+bbox.height/2)-this.verticalOffset)+')'  );
			e.setAttribute('opacity',this.opacity);
			
			var ng = new JenScript.SVGElement().name('g').buildHTML();
			e.setAttribute('id',e.getAttribute('id')+'_reflection'+JenScript.sequenceId++);
			ng.setAttribute('clip-path','url(#'+clipId+')');
			ng.appendChild(e);
			
			pieEffect.appendChild(ng);
			pie.svg.pieRoot.appendChild(pieEffect);
		}
		
	});

	/**
	 * Object PieLinearEffect()
	 * Defines Pie Linear Effect
	 * @param {Object} config
	 * @param {Object} [config.incidence] the incidence angle degree [0,360]
	 * @param {Number} [config.offset] offset pie radius, [0,..5] depends the pie size and desired effect
	 */
	JenScript.PieLinearEffect = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieLinearEffect, JenScript.AbstractPieEffect);
	JenScript.Model.addMethods(JenScript.PieLinearEffect,{
		/**
		 * Initialize Pie Linear Effect
		 * @param {Object} config
		 * @param {Object} [config.incidence] the incidence angle degree [0,360]
		 * @param {Number} [config.offset] offset pie radius, [0,..5] depends the pie size and desired effect
		 */
		_init: function(config){
			config = config || {};
			config.name = "JenScript.PieLinearEffect";
			this.incidence = (config.incidence !== undefined)?config.incidence : 120;
			this.offset = (config.offset !== undefined)?config.offset : 3;
			this.fillOpacity = (config.fillOpacity !== undefined)?config.fillOpacity : 1;
			this.shader = config.shader;
			this.gradientIds = [];
			JenScript.AbstractPieEffect.call(this, config);
		},
		
		/**
		 * set linear effect incidence degree
		 * @param {Number} incidence in degrees
		 */
		setIncidence : function(incidence) {
			this.incidence = incidence;
		},

		/**
		 * get linear effect incidence in degree
		 * @returns {Object} linear effect incidence
		 */
		getIncidence : function() {
			return this.incidence;
		},

		/**
		 * set offset radius on linear effect
		 * @param {Number} offset
		 */
		setOffserRadius : function(offset) {
			this.offset = offset;
		},
		
		/**
		 * get offset radius of linear effect
		 * @returns {Number} offset
		 */
		getOffserRadius : function() {
			return this.offset;
		},

		/**
		 * Paint pie linear effect
		 * @param {Object} g2d the graphics context
		 * @param {Object} pie 
		 */
		paintPieEffect : function(g2d, pie) {
			
			//TODO : delete redundant gradient according to divergence. create map <divergence, gradient>
			//and delete/create only if needed.
			
			//delete all useless olds gradients
			
			
			//var pieEffect = new JenScript.SVGGroup().Id(pie.Id+this.Id).opacity(this.opacity).toSVG();
			//g2d.deleteGraphicsElement(pie.Id+this.Id);
			
			for (var i = 0; i < this.gradientIds.length; i++) {
				g2d.deleteGraphicsElement(this.gradientIds[i]);
			}
			this.gradientIds = [];
			
			for (var i = 0; i < pie.slices.length; i++) {
				var s = pie.slices[i];
				var largeArcFlag = "0";
				if (s.extendsDegree > 180) {
					largeArcFlag = "1";
				}
				var polar = function(origin,radius,angle){
					return {
						x : origin.x + radius* Math.cos(JenScript.Math.toRadians(angle)),
						y : origin.y - radius* Math.sin(JenScript.Math.toRadians(angle))
					};
				};
				var ss=polar(s.sc,(pie.radius - this.offset),s.startAngleDegree);
				var se=polar(s.sc,(pie.radius - this.offset),s.endAngleDegree);
				// gradient
				var start = polar(s.sc,(pie.radius - this.offset),this.incidence);
				var end   = polar(s.sc,(pie.radius - this.offset),this.incidence+180);
				var percents = ['0%','49%','51%','100%'];
				var colors = ['rgb(60,60,60)','rgb(255,255,255)','rgb(255,255,255)','rgb(255,255,255)'];
				var opacity = [0.8,0,0,0.8];
				if(this.shader === undefined){
					this.shader = {percents : percents, colors: colors,opacity:opacity};
				}
				
				var gradientSliceId = 'gradient'+JenScript.sequenceId++;
				this.gradientIds[this.gradientIds.length] = gradientSliceId;
				var gradient= new JenScript.SVGLinearGradient().Id(gradientSliceId).from(start.x,start.y).to(end.x, end.y).shade(this.shader.percents,this.shader.colors,this.shader.opacity).toSVG();
				
				g2d.definesSVG(gradient);
				var fxPath = "M" + ss.x + "," + ss.y + " A"
						+ (pie.radius - this.offset) + ","
						+ (pie.radius - this.offset) + " 0 " + largeArcFlag + ",0 "
						+ se.x + "," + se.y + " L" + s.sc.x + "," + s.sc.y + " Z";
				
				var sFx = new JenScript.SVGElement().name('path')
														.attr('fill','url(#'+gradientSliceId+')')
														.attr('d',fxPath)
														.attr('fill-opacity',this.fillOpacity)
														.buildHTML();
			
				g2d.deleteGraphicsElement(pie.Id+this.Id+s.Id);
				var sliceEffect = new JenScript.SVGGroup().Id(pie.Id+this.Id+s.Id).opacity(s.opacity).toSVG();
				
				//s.svg.effects[s.Id+this.Id] = sliceEffect;
				sliceEffect.appendChild(sFx);
				
				//pie.svg.pieRoot.appendChild(sliceEffect);
				//pieEffect.appendChild(sliceEffect);
				s.svg.sliceRoot.appendChild(sliceEffect);
			}
			
			//pie.svg.pieRoot.appendChild(pieEffect);
		}
	});
})();