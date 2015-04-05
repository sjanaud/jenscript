(function(){
	
	/**
	 * Object AbstractDonut2Stroke()
	 * Defines Donut2D Abstract Draw
	 * @param {Object} config
	 * @param {String} [config.name] draw name
	 */
	JenScript.AbstractDonut2Stroke = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractDonut2Stroke,{
		/**
		 * Initialize Donut2D Abstract Draw
		 * @param {Object} config
		 * @param {String} [config.name] draw name
		 */
		init : function(config){
			config = config || {};
			this.name = config.name;
		},
		/**
	     * Abstract stroke donut 2D, override this method to provide stroke
	     * @param {Object} g2d graphics context
	     * @param {Object} donut2D
	     */
	    strokeDonut2D : function(g2d,donut2D){
	    	throw new Error('AbstractDonut2Stroke, strokeDonut2D method should be provide by override');
	    }
	});
	
	/**
	 * Object Donut2DDefaultDraw()
	 * Defines Donut2D Default Draw
	 * @param {Object} config
	 * @param {Object} [config.strokeColor] color for stroking whole donut, else slice theme color is use for each slice
	 * @param {Object} [config.strokeWidth] stroke width
	 */
	JenScript.Donut2DDefaultStroke = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DDefaultStroke,JenScript.AbstractDonut2Stroke);
	JenScript.Model.addMethods(JenScript.Donut2DDefaultStroke,{
		/**
		 * Initialize Donut2D Default Draw
		 * @param {Object} config
		 * @param {Object} [config.strokeColor] color for stroking whole donut, else slice theme color is use for each slice
		 * @param {Object} [config.strokeWidth] stroke width
		 */
		_init : function(config){
			config = config || {};
			/** draw color */
			this.strokeColor = config.strokeColor;
			/** stroke color */
			this.strokeWidth = config.strokeWidth;
			config.name = 'JenScript.Donut2DDefaultDraw';
			JenScript.AbstractDonut2Stroke.call(this,config);
		},
		
		/**
	     * fill donut 2D
	     * @param {Object} g2d graphics context
	     * @param {Object} donut2D
	     */
		strokeDonut2D : function(g2d,donut2D){
	    	for (var i = 0; i < donut2D.slices.length; i++) {
		        var s = donut2D.slices[i];
		        
		        var color = (this.strokeColor !== undefined)?this.strokeColor : s.themeColor;
		        var svg = new JenScript.SVGElement().name('path')
								.attr('d',s.face).attr('stroke',color).attr('stroke-opacity',s.strokeOpacity).attr('fill','none');
	
		        donut2D.svg.donutRoot.appendChild(svg.buildHTML());
	        }
	    }
	});
	
	
	
	
	/**
	 * Object AbstractDonut2DSliceStroke()
	 * Defines Donut2D Slice Stroke
	 * @param {Object} config
	 * @param {Object} [config.name] donut slice stroke name
	 */
	JenScript.AbstractDonut2DSliceStroke = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractDonut2DSliceStroke,{
		/**
		 * Initialize Donut2D Slice Stroke
		 * @param {Object} config
		 * @param {Object} [config.name] donut slice stroke name
		 */
		init : function(config){
			config = config || {};
			this.name = config.name;
		},
		/**
	     * Abstract donut 2D slice stroke
	     * @param {Object} g2d
	     * @param {Object} slice
	     */
	    strokeDonut2DSlice : function(g2d,slice){
	    	throw new Error('JenScript.AbstractDonut2DSliceStroke strokeDonut2DSlice method should be provide by override.');
	    }
	});
	
	/**
	 * Object Donut2DSliceDefaultStroke()
	 * Defines Donut2D Slice Default Stroke
	 * @param {Object} config
	 * @param {Object} [config.strokeColor] color for stroking donut slice, else slice theme color is use.
	 * @param {Object} [config.strokeWidth] stroke width
	 */
	JenScript.Donut2DSliceDefaultStroke = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DSliceDefaultStroke,JenScript.AbstractDonut2DSliceStroke);
	JenScript.Model.addMethods(JenScript.Donut2DSliceDefaultStroke,{
		/**
		 * Initialize Donut2D Slice Default Stroke
		 * @param {Object} config
		 * @param {Object} [config.strokeColor] color for stroking donut slice, else slice theme color is use.
		 * @param {Object} [config.strokeWidth] stroke width
		 */
		_init : function(config){
			config = config || {};
			/** draw color */
			this.strokeColor = config.strokeColor;
			/** stroke color */
			this.strokeWidth = config.strokeWidth;
			config.name='JenScript.Donut2DSliceDefaultStroke';
			JenScript.AbstractDonut2DSliceStroke.call(this,config);
		},
		
		/**
	     * Default donut 2D slice stroke
	     * @param {Object} g2d
	     * @param {Object} slice
	     */
		strokeDonut2DSlice : function(g2d,slice){
	        var color = (this.strokeColor !== undefined)?this.strokeColor : slice.themeColor;
	        var svg = new JenScript.SVGElement().name('path')
							.attr('d',slice.face).attr('stroke',color).attr('fill','none');

	        slice.donut.svg.donutRoot.appendChild(svg.buildHTML());
	    }
	});
})();