(function(){

	
	/**
	 * Object AbstractPieStroke()
	 * Defines Abstract Pie Stroke
	 * @param {Object} config
	 * @param {String} [config.name] stroke name
	 */
	JenScript.AbstractPieStroke = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractPieStroke,{
		
		/**
		 * Initialize Abstract Pie Stroke
		 * @param {Object} config
		 * @param {String} [config.name] stroke name
		 */
		init: function(config){
			config = config || {};
			this.name = config.name;
		},
		/**
	     * stroke pie
	     * @param {Object} g2d graphics context
	     * @param {Object} pie to stroke
	     */
	    strokePie : function(g2d,pie){}
	});
	
	/**
	 * Object PieDefaultStroke()
	 * Defines Pie Default Stroke
	 * @param {Object} config
	 * @param {String} [config.strokeColor] stroke whole pie with this color
	 * @param {Number} [config.strokeWidth] stroke width
	 */
	JenScript.PieDefaultStroke = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieDefaultStroke,JenScript.AbstractPieStroke);
	JenScript.Model.addMethods(JenScript.PieDefaultStroke,{
		
		/**
		 * Initialize Pie Default Stroke
		 * @param {Object} config
		 * @param {String} [config.strokeColor] stroke whole pie with this color
		 * @param {Number} [config.strokeWidth] stroke width
		 */
		_init : function(config){
			config = config || {};
			/** draw color */
			this.strokeColor = config.strokeColor;
			/** stroke color */
			this.strokeWidth = (config.strokeWidth !== undefined)?config.strokeWidth : 1;
			config.name = "JenScript.PieDefaultStroke";
			JenScript.AbstractPieStroke.call(this,config);
		},
		
		/**
		 * stroke pie
		 * @param {Object} graphics context
		 * @param {Object} pie to stroke
		 */
		strokePie : function(g2d,pie){
	    	for (var i = 0; i < pie.slices.length; i++) {
		        var s = pie.slices[i];
		        
		        var color = (this.strokeColor !== undefined)?this.strokeColor : s.themeColor;
		        var svg = new JenScript.SVGElement().name('path')
								.attr('d',s.svgPath).attr('stroke',color).attr('strokeWidth',this.strokeWidth).attr('fill','none');
	
		        pie.svg.pieRoot.appendChild(svg.buildHTML());
	        }
	    }
	});
})();