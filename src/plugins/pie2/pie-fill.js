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
			config = config||{};
			this.Id = (config.Id !== undefined)?config.Id:'_fill'+JenScript.sequenceId++;
			this.opacity =  (config.opacity !== undefined)?config.opacity:1;
			this.name = config.name;
		},
		
		/**
		 * fill pie
		 * @param {Object} g2d graphics context
		 * @param {Object} pie to fill
		 */
		fillSlice : function(g2d, slice) {
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
		fillSlice : function(g2d, slice) {
			var pie = slice.pie;
			var pieFill = new JenScript.SVGGroup().Id(slice.Id+this.Id).opacity(this.opacity).toSVG();
			g2d.deleteGraphicsElement(pie.Id+this.Id);
			
			//for (var i = 0; i < pie.slices.length; i++) {
				var s = slice;//pie.slices[i];
				var c = (this.fillColor !== undefined)?this.fillColor : s.themeColor;
				var fill = new JenScript.SVGElement().name('path')
													.attr('fill',c)
													.attr('d',s.svgPath)
													.buildHTML();
				
				
				
				var sliceFill = new JenScript.SVGGroup().Id(pie.Id+this.Id+s.Id).opacity(s.opacity).toSVG();
				g2d.deleteGraphicsElement(pie.Id+this.Id+s.Id);
				sliceFill.appendChild(fill);
				pieFill.appendChild(sliceFill);
			//}
				slice.svg.sliceRoot.appendChild(pieFill);
			//pie.svg.pieRoot.appendChild(pieFill);
		}
	});
})();