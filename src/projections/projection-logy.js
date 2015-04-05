(function(){
	
	/**
	 * The <code>LogY</code> class defines a composite logarithmic linear projection
	 * with linear x projection and logarithmic y projection 
	 * Constructs a new projection with logarithmic on x dimension and linear
	 * on y dimension with specified user metrics parameters.
	 * 
	 * @param minx
	 *            the projection minimum x to set
	 * @param maxx
	 *            the projection maximum x to set
	 * @param miny
	 *            the projection minimum y to set,should be greater than 0
	 * @param maxy
	 *            the projection maximum y to set
	 */
	JenScript.LogYProjection = function(config) { 
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LogYProjection, JenScript.LinearProjection);
	JenScript.Model.addMethods(JenScript.LogYProjection,{
		
		__init : function(config){
			JenScript.LinearProjection.call(this, config);
		},
		
		validateBound : function (minX,maxX,minY,maxY){
			if (minX > maxX) {
				throw new Error("projection "+this.name+" error: maxx argument should be greater than minx");
			}
			if (minY > maxY) {
				throw new Error("projection "+this.name+" error: maxy argument should be greater than miny");
			}
			if (minY <= 0) {
				throw new Error("projection "+this.name+" error: min y value should be grater than 0 , out of Log range authorized.");
			}
			
		},
		
		userToPixelY : function(userY) {
			var scaleYLog = this.getPixelHeight() / (JenScript.Math.log10(this.getMaxY()) - JenScript.Math.log10(this.getMinY()));
			return -scaleYLog * (JenScript.Math.log10(userY) - JenScript.Math.log10(this.getMaxY()));
		},

		pixelToUserY : function (pixelY) {
			
			var scaleYLog = this.getPixelHeight() / (JenScript.Math.log10(this.getMaxY()) - JenScript.Math.log10(this.getMinY()));
			return Math.pow(10, -(pixelY / scaleYLog - JenScript.Math.log10(this.getMaxY())));
		},
		
	});
	
})();