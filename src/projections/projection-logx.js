	
(function(){
	/**
	 * The <code>LogX</code> class defines a composite logarithmic linear projection
	 * with logarithmic x and linear y projection.
	 * Constructs a new projection with logarithmic on x dimension and linear
	 * on y dimension with specified user metrics parameters.
	 * 
	 */
	JenScript.LogXProjection = function(config) { 
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LogXProjection, JenScript.LinearProjection);
	JenScript.Model.addMethods(JenScript.LogXProjection,{
		
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
			if (minX <= 0) {
				throw new Error("projection "+this.name+" error: min x value should be grater than 0 , out of Log range authorized.");
			}
			
		},
		
		userToPixelX : function(userX) {
			var scaleXLog = this.getPixelWidth() / (JenScript.Math.log10(this.getMaxX()) - JenScript.Math.log10(this.getMinX()));
			return scaleXLog * (JenScript.Math.log10(userX) - JenScript.Math.log10(this.getMinX()));
		},

		pixelToUserX : function(pixelX) {
			var scaleXLog = this.getPixelWidth() / (JenScript.Math.log10(this.getMaxX()) - JenScript.Math.log10(this.getMinX()));
			return Math.pow(10, pixelX / scaleXLog + JenScript.Math.log10(this.getMinX()));
		},
		
	});
})();