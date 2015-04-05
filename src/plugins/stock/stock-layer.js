(function(){
	JenScript.StockLayer = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.StockLayer, {
		init : function(config){
			config = config || {};
			this.Id = 'layer'+JenScript.sequenceId++;
			this.name = config.name;
			this.plugin;
			this.geometries = [];
		},
		
		clearGeometries : function(){
			this.geometries = [];
		},
		
		getGeometries : function(){
			return this.geometries;
		},
		
		addGeometry : function(geometry){
			this.geometries[this.geometries.length] = geometry;
		},
		
		getHost : function(){
			return this.plugin;
		},
		
		/**
		 * solve layer geometry.
		 * <p>
		 * process projection of stock values from user system coordinates to device
		 * pixel system coordinates and create geometry collection.
		 * </p>
		 */
		solveLayer : function(){},

		/**
		 * paint stock layer
		 * 
		 * @param g2d
		 *            graphics context
		 * @param windowPart
		 *            part to paint
		 */
		paintLayer : function(g2d,art){},
		
	});
})();