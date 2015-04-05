(function(){

	/**
	 * Object AbstractPieFill()
	 * Defines Abstract Pie Fill
	 * @param {Object} config
	 * @param {String} [config.name] fill name
	 */
	JenScript.AbstractPieFill = function(config) {
		this.init(config);
	};

	JenScript.AbstractPieFill.prototype = {
			
		/**
		 * Initialize Abstract Pie Fill
		 * @param {Object} config
		 * @param {String} [config.name] fill name
		 */
		init : function(config){
			config =config || {};
			this.name = config.name;
		},
		
		/**
		 * fill pie
		 * @param {Object} g2d graphics context
		 * @param {Object} pie to fill
		 */
		fillPie : function(g2d, pie) {
			throw new Error("Abstract Pie Fill, this method should be provide by overriden.");
		},

	};

	/**
	 * Object PieDefaultFill()
	 * Defines Pie Default Fill
	 * @param {Object} config
	 * @param {String} [config.fillColor] fill color for fill the whole pie
	 */
	JenScript.PieDefaultFill = function(config) {
		this.init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieDefaultFill, JenScript.AbstractPieFill);
	JenScript.Model.addMethods(JenScript.PieDefaultFill,{
		
		/**
		 * Initialize Pie Default Fill
		 * @param {Object} config
		 * @param {String} [config.fillColor] fill color for fill the whole pie
		 */
		_init : function(config){
			config = config || {};
			this.fillColor = config.fillColor;
			config.name = "JenScript.PieDefaultFill";
			JenScript.AbstractPieFill.call(this,config);
		},
		
		/**
		 * default fill pie
		 * @param {Object} g2d graphics context
		 * @param {Object} pie to fill
		 */
		fillPie : function(g2d, pie) {
			for (var i = 0; i < pie.slices.length; i++) {
				var s = pie.slices[i];
				var c = (this.fillColor !== undefined)?this.fillColor : s.themeColor;
				var sliceFill = new JenScript.SVGElement().name('path')
													.attr('fill',c)
													.attr('d',s.svgPath)
													.buildHTML();
				
				pie.svg.pieRoot.appendChild(sliceFill);
			}
		}
	});
})();