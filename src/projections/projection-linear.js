(function(){
	/**
	 *Linear projection</code> defines a linear transformation
	 *between user space coordinate to device pixel coordinate
	 */
	JenScript.LinearProjection = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LinearProjection, JenScript.Projection);
	JenScript.Model.addMethods(JenScript.LinearProjection,{
		
		_init : function(config){
			JenScript.Projection.call(this, config);
			this.bound(config.minX,config.maxX,config.minY,config.maxY);
		},
		
		validateBound : function (minX,maxX,minY,maxY){
			if (minX > maxX) {
				throw new Error("projection error: maxx argument should be greater than minx");
			}
			if (minY > maxY) {
				throw new Error("projection error: maxy argument should be greater than miny");
			}
		},
		
		/**
		 * bound this linear projection with the specified
		 * parameters.<br>
		 * 
		 * @param {Number} minX
		 * @param {Number} maxX
		 * @param {Number} minY
		 * @param {Number} maxY
		 * @throws Error
		 *             if min is greater than max of both dimensions x,y
		 */
		bound : function(minX, maxX, minY, maxY) {
			try{
				this.validateBound(minX, maxX, minY, maxY);
				
				if (this.initial) {
					this.initialMinX = minX;
					this.initialMaxX = maxX;
					this.initialMinY = minY;
					this.initialMaxY = maxY;
					this.initial = false;
				}
				
				this.minX = minX;
				this.maxX = maxX;
				this.minY = minY;
				this.maxY = maxY;
				
				if(this.view !== undefined && this.view.getDevice() !== undefined){
					this.scaleX = this.getPixelWidth() / this.getUserWidth();
					this.scaleY = this.getPixelHeight() / this.getUserHeight();
				}
			}
			catch(err){
				throw new Error("Invalid bound projection with cause :"+err.message);
				console.error( this.name+' invalid bound projection '+err);
			}
			//console.log('proj '+this.Id+' bound:'+this.toString());
			// fire listeners about this projection bound
			this.fireProjectionEvent('boundChanged');
		},
			
		getScaleX : function(){
			if(this.scaleX === undefined)
				this.scaleX = this.getPixelWidth() / this.getUserWidth();
			return this.scaleX;
		},
		
		getScaleY : function(){
			if(this.scaleY === undefined)
				this.scaleY = this.getPixelHeight() / this.getUserHeight();
			return this.scaleY;
		},
		
		userToPixelX : function(userX) {
			return this.getScaleX() * (userX - this.getMinX());
		},

		userToPixelY : function(userY) {
			//var scaleY = this.getPixelHeight() / this.getUserHeight();
			return -this.getScaleY() * (userY - this.getMaxY());
		},
		
		pixelToUserX : function(pixelX) {
			//var scaleX = this.getPixelWidth() / this.getUserWidth();
			return pixelX / this.getScaleX() + this.getMinX();
		},

		pixelToUserY : function(pixelY) {
			//var scaleY = this.getPixelHeight() / this.getUserHeight();
			return -(pixelY / this.getScaleY() - this.getMaxY());
		},
	});
	
})();