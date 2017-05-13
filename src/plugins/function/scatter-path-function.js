(function(){

	
	/**
	 * Object Scatter()
	 * Defines scatter function
	 * @param {Object} config
	 */
	JenScript.Scatter = function(config) {
		//JenScript.Scatter
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Scatter, JenScript.AbstractPathFunction);
	JenScript.Model.addMethods(JenScript.Scatter, {
		/**
		 * Initialize Scatter Function
		 * Defines a scatter function
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.name = 'ScatterPathFunction';
			this.radius = (config.radius !== undefined)? config.radius : 4;
		    JenScript.AbstractPathFunction.call(this,config);
		},
		
		/**
		 * paint scatter function
		 * @param g2d the graphics context
		 */
		paintFunction : function(g2d){
			//this.paintPathFunction(g2d);
			this.source.clearCurrentFunction();
			var userPointsFunction = this.source.getCurrentFunction();
			var proj = this.getProjection();
			for (var i = 0; i < userPointsFunction.length; i++) {
				var p = userPointsFunction[i];
				var scatter = new JenScript.SVGRect().origin(proj.userToPixelX(p.x)-this.radius/2,proj.userToPixelY(p.y)-this.radius/2).size(this.radius,this.radius).fill(this.getThemeColor());
				g2d.insertSVG(scatter.toSVG());
			}
		}
	});
})();