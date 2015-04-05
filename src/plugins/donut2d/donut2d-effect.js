(function(){

	/**
	 * Object AbstractDonut2DEffect()
	 * Defines Abstract Donut2D Effect
	 * @param {Object} config
	 * @param {Object} [config.name] donut effect name
	 */
	JenScript.AbstractDonut2DEffect = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractDonut2DEffect,{
		/**
		 * Initialize Abstract Donut2D Effect
		 * @param {Object} config
		 * @param {Object} [config.name] donut effect name
		 */
		init : function(config){
			config = config || {};
			this.name = config.name;
		},
		/**
	     * effect donut 2D
	     * @param {Object} g2d
	     * @param {Object} donut2D
	     */
	    effectDonut2D : function(g2d,donut2D){}
	});
	
	/**
	 * Object Donut2DLinearEffect()
	 * Defines Linear Donut2D Effect
	 * @param {Object} config
	 * @param {Object} [config.offsetRadius] effect offsetRadius, default 3 pixel
	 * @param {Object} [config.incidenceAngleDegree] effect incidence angle degree, default 120
	 * @param {Object} [config.shader] effect shader
	 * @param {Object} [config.shader.percents] effect shader percents array
	 * @param {Object} [config.shader.colors] effect shader colors array
	 */
	JenScript.Donut2DLinearEffect = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DLinearEffect,JenScript.AbstractDonut2DEffect);
	JenScript.Model.addMethods(JenScript.Donut2DLinearEffect,{
		/**
		 * Initialize Linear Donut2D Effect
		 * @param {Object} config
		 * @param {Object} [config.offsetRadius] effect offsetRadius, default 3 pixel
		 * @param {Object} [config.incidenceAngleDegree] effect incidence angle degree, default 120
		 * @param {Object} [config.shader] effect shader
		 * @param {Object} [config.shader.percents] effect shader percents array
		 * @param {Object} [config.shader.colors] effect shader colors array
		 */
		_init : function(config){
			config = config || {};
		    /** offset radius */
		    this.offsetRadius = 3;
		    /** gradient incidence angle degree */
		    this.incidenceAngleDegree = 120;
		    /** shader */
		    this.shader;
		    /** default shader fractions */
		    this.defaultShader = {percents : [ '0%', '49%', '51%', '100%' ],opacity:[0.6,0,0,0.6], colors : ['rgb(60, 60, 60)', 'rgb(255,255,255)','rgb(255,255,255)','rgb(255, 255, 255)']};
		    /**effect name*/
		    config.name = 'JenScript.Donut2DLinearEffect';
		    this.gradientsIds = [];
		    JenScript.AbstractDonut2DEffect.call(this,config);        
		},
		
		/**
		 * paint effect on the given donut
		 * @param {Object} graphics context
		 * @param {Object} donut 
		 */
		effectDonut2D : function(g2d,donut2D) {
			for (var i = 0; i < this.gradientsIds.length; i++) {
				g2d.deleteGraphicsElement(this.gradientsIds[i]);
			}
			this.gradientsIds = [];
			for (var i = 0; i < donut2D.slices.length; i++) {
				var slice = donut2D.slices[i];
		        var outerRadius = donut2D.outerRadius - this.offsetRadius;
		        var innerRadius = donut2D.innerRadius + this.offsetRadius;
		        var startAngleDegree = slice.startAngleDegree;
		        var extendsDegree = slice.extendsDegree;
		        var largeArcFlag = (extendsDegree > 180) ? '1' : '0';
		        var polar = function(r,a){
		        	return {
			        	x : slice.sc.x + r* Math.cos(JenScript.Math.toRadians(a)),
						y : slice.sc.y - r* Math.sin(JenScript.Math.toRadians(a))
			        };
		        };
		        var sliceOuterBegin = polar(outerRadius,startAngleDegree);
		        var sliceOuterEnd   = polar(outerRadius,startAngleDegree+extendsDegree);
		        var sliceInnerBegin = polar(innerRadius,startAngleDegree);
		        var sliceInnerEnd   = polar(innerRadius,startAngleDegree+extendsDegree);
		        var effectFace = "M" + sliceOuterBegin.x + "," + sliceOuterBegin.y + " A" + outerRadius + ","
								+ outerRadius + " 0 " + largeArcFlag + ",0 " + sliceOuterEnd.x + ","
								+ sliceOuterEnd.y+' L '+sliceInnerEnd.x+','+sliceInnerEnd.y+ " A" + innerRadius + ","
								+ innerRadius + " 0 " + largeArcFlag + ",1 " + sliceInnerBegin.x + ","
								+ sliceInnerBegin.y+' Z';                       

		        var start = polar(outerRadius,this.incidenceAngleDegree);
		        var end   = polar(outerRadius,this.incidenceAngleDegree+180);
		        if (this.shader === undefined) {
		           this.shader = this.defaultShader;
		        }
		      
		        var gradientId = 'gradient'+JenScript.sequenceId++;
		        this.gradientsIds[this.gradientsIds.length] = gradientId;
				var gradient   = new JenScript.SVGLinearGradient().Id(gradientId).from(start.x,start.y).to(end.x, end.y).shade(this.shader.percents,this.shader.colors,this.shader.opacity).toSVG();
				g2d.definesSVG(gradient);
				var svg = new JenScript.SVGElement().name('path').attr('d',effectFace).attr('stroke','none').attr('fill-opacity',slice.fillOpacity).attr('fill','url(#'+gradientId+')');
				donut2D.svg.donutRoot.appendChild(svg.buildHTML());
			}
	    }
	});
	
	/**
	 * Object Donut2DReflectionEffect()
	 * Defines Donut2D Reflection Effect
	 * @param {Object} config
	 * @param {Object} [config.deviation]
	 * @param {Object} [config.opacity]
	 */
	JenScript.Donut2DReflectionEffect = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DReflectionEffect, JenScript.AbstractDonut2DEffect);
	JenScript.Model.addMethods(JenScript.Donut2DReflectionEffect,{
		
		/**
		 * Initialize Donut2D Reflection Effect
		 * @param {Object} config
		 * @param {Object} [config.deviation] blur deviation, default 3 pixels
		 * @param {Object} [config.opacity] effect opacity, default 0.3
		 * @param {Object} [config.verticalOffset] effect vertical offset, default 5 pixels
		 * @param {Object} [config.length] effect length [0,1], 1 reflect whole donut, 0.5 half of the donut, etc
		 */
		_init: function(config){
			config = config || {};
			this.deviation = (config.deviation !== undefined)?config.deviation : 3;
			this.opacity = (config.opacity !== undefined)?config.opacity : 0.3;
			this.length = (config.length !== undefined)?config.length : 0.5;
			this.verticalOffset = (config.verticalOffset !== undefined)?config.verticalOffset : 0;
			config.name = "JenScript.Donut2DReflectionEffect";
			JenScript.AbstractDonut2DEffect.call(this,config);
		},
		
		/**
		 * Paint donut reflection effect
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut 
		 */
		effectDonut2D : function(g2d, donut) {
			var bbox = donut.svg.donutRoot.getBBox();
			
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
		
			var e = donut.svg.donutRoot.cloneNode(true);
			e.removeAttribute('id');
			e.setAttribute('filter','url(#'+filterId+')');
			e.setAttribute('transform','translate(0,'+bbox.height+'), scale(1,-1), translate(0,'+(-2*(bbox.y+bbox.height/2)-this.verticalOffset)+')'  );
			e.setAttribute('opacity',this.opacity);
			
			var ng = new JenScript.SVGElement().name('g').buildHTML();
			e.setAttribute('id',e.getAttribute('id')+'_reflection'+JenScript.sequenceId++);
			ng.setAttribute('clip-path','url(#'+clipId+')');
			ng.appendChild(e);
			g2d.insertSVG(ng);	
		}
	});
})();