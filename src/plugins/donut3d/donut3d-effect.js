(function(){

	/**
	 * Object AbstractDonut3DEffect()
	 * Defines Abstract Donut3D Effect
	 * @param {Object} config
	 * @param {Object} [config.name] donut effect name
	 */
	JenScript.AbstractDonut3DEffect = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractDonut3DEffect,{
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
	     * effect donut 3D
	     * @param {Object} g2d
	     * @param {Object} donut3D
	     */
	    effectDonut3D : function(g2d,donut3D){}
	});
	
	
	
	/**
	 * Object Donut3DReflectionEffect()
	 * Defines Donut3D Reflection Effect
	 * @param {Object} config
	 * @param {Object} [config.deviation]
	 * @param {Object} [config.opacity]
	 */
	JenScript.Donut3DReflectionEffect = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut3DReflectionEffect, JenScript.AbstractDonut3DEffect);
	JenScript.Model.addMethods(JenScript.Donut3DReflectionEffect,{
		
		/**
		 * Initialize Donut3D Reflection Effect
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
			config.name = "JenScript.Donut3DReflectionEffect";
			JenScript.AbstractDonut3DEffect.call(this,config);
		},
		
		/**
		 * Paint donut reflection effect
		 * @param {Object} g2d the graphics context
		 * @param {Object} donut 
		 */
		effectDonut3D : function(g2d, donut) {
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