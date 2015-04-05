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
				var scatter = new JenScript.SVGRect().origin(proj.userToPixelX(p.x),proj.userToPixelY(p.y)).size(3,3).fill(this.getThemeColor());
				g2d.insertSVG(scatter.toSVG());
			}
		}
	});
})();