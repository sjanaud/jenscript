(function(){
	
	JenScript.LogXLogYProjection = function(config) { 
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LogXLogYProjection, JenScript.LinearProjection);
	JenScript.Model.addMethods(JenScript.LogXLogYProjection,{
		
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
			if (minY <= 0) {
				throw new Error("projection "+this.name+" error: min y value should be grater than 0 , out of Log range authorized.");
			}
			
		},
		
		userToPixelX : function(userX) {
			return JenScript.LogXProjection.prototype.userToPixelX.call(this, userX);
		},
		
		userToPixelY : function(userY) {
			return JenScript.LogYProjection.prototype.userToPixelY.call(this, userY);
		},

		pixelToUserX : function(pixelX) {
			return JenScript.LogXProjection.prototype.pixelToUserX.call(this, pixelX);
		},

		pixelToUserY : function (pixelY) {
			return JenScript.LogYProjection.prototype.pixelToUserY.call(this, pixelY);
		},
		
	});
	
})();