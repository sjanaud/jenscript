(function(){
	/**
	 * Object AbstractDonut2DFill()
	 * Defines Donut2D Abstract Fill
	 * @param {Object} config
	 * @param {String} [config.name] fill name
	 */
	JenScript.AbstractDonut2DFill = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractDonut2DFill,{
		/**
		 * Initialize Donut2D Abstract Fill
		 * @param {Object} config
		 * @param {String} [config.name] fill name
		 */
		init : function(config){
			config = config || {};
			this.name = config.name;
		},
		/**
	     * Abstract fill donut 2D, provide paint by override
	     * @param {Object} g2d  graphics context
	     * @param {Object} donut2D
	     */
	    fillDonut2D : function(g2d,donut2D){
	    	throw new Error("AbstractDonut2DFill fillDonut2D method should be provide by override.");
	    }
	});
	
	/**
	 * Object Donut2DDefaultFill()
	 * Defines Donut2D Default Fill
	 * @param {Object} config
	 * @param {String} [config.fillColor] fill color for whole donut if provide
	 */
	JenScript.Donut2DDefaultFill = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DDefaultFill,JenScript.AbstractDonut2DFill);
	JenScript.Model.addMethods(JenScript.Donut2DDefaultFill,{
		/**
		 * Initialize Donut2D Default Fill
		 * @param {Object} config
		 * @param {String} [config.fillColor] fill color for whole donut if provide
		 */
		_init : function(config){
			config = config || {};
			/** fill color */
			this.fillColor = config.fillColor;
			config.name='JenScript.Donut2DDefaultFill';
			JenScript.AbstractDonut2DFill.call(this,config);
		},
		
		/**
	     * default fill donut 2D
	     * @param {Object} g2d  graphics context
	     * @param {Object} donut2D
	     */
		fillDonut2D : function(g2d,donut2D){
	    	for (var i = 0; i < donut2D.slices.length; i++) {
		        var s = donut2D.slices[i];
		        
		        var color = (this.fillColor !== undefined)?this.fillColor : s.themeColor;
		        var svg = new JenScript.SVGElement().name('path')
								.attr('d',s.face).attr('stroke','none').attr('fill',color).attr('fill-opacity',s.fillOpacity);
	
		        donut2D.svg.donutRoot.appendChild(svg.buildHTML());
	        }
	    }
	});
	
	/**
	 * Object Donut2DRadialFill()
	 * Defines Donut2D Radial Fill
	 * @param {Object} config
	 * @param {String} [config.fillColor] fill color for whole donut if provide, else slice color is use for radial fill
	 */
	JenScript.Donut2DRadialFill = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DRadialFill,JenScript.AbstractDonut2DFill);
	JenScript.Model.addMethods(JenScript.Donut2DRadialFill,{
		/**
		 * Initialize Donut2D Radial Fill
		 * @param {Object} config
		 * @param {String} [config.fillColor] fill color for whole donut if provide, else slice color is use for radial fill
		 */
		_init : function(config){
			config = config || {};
			/** fill color */
			this.fillColor = config.fillColor;
			config.name='JenScript.Donut2DRadialFill';
			JenScript.AbstractDonut2DFill.call(this,config);
		},
		
		/**
	     * Radial fill donut 2D
	     * @param {Object} g2d  graphics context
	     * @param {Object} donut2D
	     */
		fillDonut2D : function(g2d,donut2D){
			
			var or = donut2D.outerRadius;
	        var ir = donut2D.innerRadius;
	        var mr = ir + (or - ir) / 2;
	        var mrf = (mr / or)*100+'%';
	        var irf = (ir / or)*100+'%';
	        var percents = [ irf,  mrf, '100%' ];
	        
	    	for (var i = 0; i < donut2D.slices.length; i++) {
		        var s = donut2D.slices[i];
		        
		        var c = (this.fillColor !== undefined) ? new JenScript.Color(this.fillColor).toHexString():new JenScript.Color(s.themeColor).toHexString();
		        var darken = JenScript.Color.darken(c).toHexString();
		        var colors = [darken,c,darken];
		       
		        var gradientId = "gradient"+JenScript.sequenceId++;
				var gradient= new JenScript.SVGRadialGradient().Id(gradientId).center(s.sc.x,s.sc.y).focus(s.sc.x,s.sc.y).radius(donut2D.outerRadius).shade(percents,colors).toSVG();
				g2d.definesSVG(gradient);
		        
				var svg = new JenScript.SVGElement().name('path')
								.attr('d',s.face).attr('stroke','none')
								.attr('fill','url(#'+gradientId+')')
								.attr('fill-opacity',s.fillOpacity);
	
				donut2D.svg.donutRoot.appendChild(svg.buildHTML());
	        }
	    }
	});
	
	
	
	
	/**
	 * Object AbstractDonut2DSliceFill()
	 * Defines Abstract Donut2D Slice Fill
	 * @param {Object} config
	 * @param {Object} [config.name] donut slice fill name
	 */
	JenScript.AbstractDonut2DSliceFill = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractDonut2DSliceFill,{
		/**
		 * Initialize Abstract Donut2D Slice Fill
		 * @param {Object} config
		 * @param {Object} [config.name] donut slice fill name
		 */
		init : function(config){
			config = config || {};
			this.name = config.name;
		},
		/**
	     * fill donut 2D slice
	     * @param {Object} g2d
	     * @param {Object} slice
	     */
	    fillDonut2DSlice : function(g2d,slice){
	    	throw new Error('JenScript.AbstractDonut2DSliceFill fillDonut2DSlice method should be provide by override');
	    }
	});
	
	
	/**
	 * Object Donut2DSliceDefaultFill()
	 * Defines Donut2D Slice Default Fill
	 * @param {Object} config
	 * @param {Object} [config.fillColor] donut slice fill color, else slice theme color is used
	 */
	JenScript.Donut2DSliceDefaultFill = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DSliceDefaultFill,JenScript.AbstractDonut2DSliceFill);
	JenScript.Model.addMethods(JenScript.Donut2DSliceDefaultFill,{
		/**
		 * Initialize Donut2D Slice Default Fill
		 * @param {Object} config
		 * @param {Object} [config.fillColor] donut slice fill color, else slice theme color is used
		 */
		_init : function(config){
			config = config || {};
			/** fill color */
			this.fillColor = config.fillColor;
			config.name ='JenScript.Donut2DSliceDefaultFill';
			JenScript.AbstractDonut2DSliceFill.call(this,config);
		},
		
		/**
	     * Default fill donut 2D slice
	     * @param {Object} g2d
	     * @param {Object} slice
	     */
		fillDonut2DSlice : function(g2d,slice){
	        var color = (this.fillColor !== undefined)?this.fillColor : slice.themeColor;
	        var svg = new JenScript.SVGElement().name('path')
							.attr('d',slice.face).attr('stroke','none').attr('fill',color).attr('fill-opacity',slice.fillOpacity);

	        slice.donut.svg.donutRoot.appendChild(svg.buildHTML());
	    }
	});
	
	/**
	 * Object Donut2DSliceRadialFill()
	 * Defines Donut2D Slice Radial Fill
	 * @param {Object} config
	 * @param {Object} [config.fillColor] donut slice fill color, else slice theme color is used
	 */
	JenScript.Donut2DSliceRadialFill = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DSliceRadialFill,JenScript.AbstractDonut2DFill);
	JenScript.Model.addMethods(JenScript.Donut2DSliceRadialFill,{
		/**
		 * Initialize Donut2D Slice Radial Fill
		 * @param {Object} config
		 * @param {Object} [config.fillColor] donut slice fill color, else slice theme color is used
		 */
		_init : function(config){
			config = config || {};
			/** fill color */
			this.fillColor = config.fillColor;
			config.name ='JenScript.Donut2DSliceRadialFill';
			JenScript.AbstractDonut2DSliceFill.call(this,config);
		},
		
		/**
	     * Default fill donut 2D slice
	     * @param {Object} g2d
	     * @param {Object} slice
	     */
		fillDonut2DSlice : function(g2d,slice){
			var or = slice.donut.outerRadius;
	        var ir = slice.donut.innerRadius;
	        var mr = ir + (or - ir) / 2;
	        var mrf = (mr / or)*100+'%';
	        var irf = (ir / or)*100+'%';
	        var percents = [ irf,  mrf, '100%' ];
	        var c = (this.fillColor !== undefined) ? new JenScript.Color(this.fillColor).toHexString():new JenScript.Color(slice.themeColor).toHexString();
	        var darken = JenScript.Color.darken(c).toHexString();
	        var colors = [darken,c,darken];
	        var gradientId = "gradient"+JenScript.sequenceId++;
			var gradient= new JenScript.SVGRadialGradient().Id(gradientId).center(slice.sc.x,slice.sc.y).focus(slice.sc.x,slice.sc.y).radius(slice.donut.outerRadius).shade(percents,colors).toSVG();
			g2d.definesSVG(gradient);
			var svg = new JenScript.SVGElement().name('path')
							.attr('d',slice.face).attr('stroke','none').attr('fill','url(#'+gradientId+')');

			slice.donut.svg.donutRoot.appendChild(svg.buildHTML());
	    }
	});
})();