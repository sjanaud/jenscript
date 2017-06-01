(function(){
	
	JenScript.DalleProjection = function(level,square) {
		/** square tile size */
	    this.squareTileSize = square;
	    /** zoom level */
	    this.zoom=level;
	    /** max tile index */
	    this.maxTileIndex = Math.pow(2, this.zoom) - 1;
	    var max = Math.pow(2, this.zoom);
	    this.dimension =  {width : max * this.squareTileSize, height:max * this.squareTileSize, getWidth : function(){return this.width;},getHeight : function(){return this.height;}};
	   
	};
	
	 JenScript.DalleProjection.prototype = {
		 /**
	     * get zoom level for this paving projection
	     * 
	     * @return zomm level
	     */
		getZoom : function() {
	        return this.zoom;
	    },
	
	    /**
	     * get the square size tile for this paving projection
	     * 
	     * @return the squareTileSize
	     */
	    getSquareTileSize : function() {
	        return this.squareTileSize;
	    },
	
	    /**
	     * get the max tile index for this paving projection
	     * 
	     * @return the maxTileIndex
	     */
	    getMaxTileIndex : function() {
	        return this.maxTileIndex;
	    },
	
	    toString : function() {
	        return "projection dalle[Level:"+this.zoom+";square:"+this.squareTileSize+"]";
	    },
	
	    /**
	     * get paving pixel dimension
	     * 
	     * @return paving pixel dimension
	     */
	    getDalleDimension : function() {
	       // var max = Math.pow(2, this.zoom);
	       // return {width : max * this.squareTileSize, height:max * this.squareTileSize, getWidth : function(){return this.width;},getHeight : function(){return this.height;}};
	    	return this.dimension;
	    },
	
	
	    /**
	     * get the paving center in pixel coordinate
	     * 
	     * @return the center pixel
	     */
	    getDalleCenter : function() {
	        return new JenScript.Point2D(this.dimension.width/2, this.dimension.height/2);
	    },
	   
	    /***
	     * transforms geographic position to pixel in this dalle projection
	     * @param geoPosition
	     * @returns {JenScript.Point2D}
	     */
	    geoToPixel : function(geoPosition) {
		   var pixelX = this.dimension.getWidth()* ((geoPosition.getLongitude() + 180) / 360);
		   var pixelY = this.dimension.getHeight() / 2- Math.log(Math.tan(Math.PI / 4  + JenScript.Math.toRadians(geoPosition.getLatitude()) / 2)) / (2 * Math.PI) * this.dimension.getWidth();
	       return new JenScript.Point2D(pixelX, pixelY);
	    },
	   
	    /***
	     * transforms latitude to pixel y dimension
	     * @param latitude
	     * @returns {Number} pixel y
	     */
	    latitudeToPixel : function(latitude) {
		   var pixelY = this.dimension.getHeight()/2- Math.log(Math.tan(Math.PI / 4 + JenScript.Math.toRadians(latitude) / 2)) / (2 * Math.PI) * this.dimension.getWidth();
	       return pixelY;
	    },
	   
	    /***
	     * transforms longitude to pixel x dimension
	     * @param longitude
	     * @returns {Number} pixel x
	     */
	    longitudeToPixel : function(longitude) {
	        var pixelX = this.dimension.getWidth() * ((longitude + 180) / 360);
	        return pixelX;
	    },
	  
	   /**
	    * transform pixel point to geographic point
	    * @param point the pixel point coordinate 
	    * @returns {JenScript.GeoPosition} geographic position
	    */
	    pixelToGeo  : function(point) {
	    	var longitude = point.getX() / this.dimension.getWidth() * 360 - 180;
	    	var A = 2 * Math.PI / this.dimension.getWidth();
	    	var B = this.dimension.getHeight() / 2 - point.getY();
	    	var C = Math.exp(A * B);
	        var D = Math.atan(C);
	        var latitudeRadian = 2 * (D - Math.PI / 4);
	        var latitude = JenScript.Math.toDegrees(latitudeRadian);
	        return new JenScript.GeoPosition(latitude, longitude);
	    },
	
	    /***
	     * transform pixel y coordinate in latitude
	     * @param pixelY
	     * @returns {Number}
	     */
	    pixelToLatitude : function(pixelY) {
	        var A = 2 * Math.PI / this.dimension.getWidth();
	        var B = this.dimension.getHeight() / 2 - pixelY;
	        var C = Math.exp(A * B);
	        var D = Math.atan(C);
	        var latitudeRadian = 2 * (D - Math.PI / 4);
	        var latitude = JenScript.Math.toDegrees(latitudeRadian);
	        return latitude;
	    },
	
	    /***
	     * transform pixel x coordinate in longitude
	     * @param pixelX
	     * @returns {Number}
	     */
	    pixelToLongitude : function(pixelX) {
	        var longitude = pixelX / this.dimension.getWidth() * 360 - 180;
	        return longitude;
	    },
	
	    /***
	     * transform latitude in y tiled index 
	     * @param latitude
	     * @returns {Number}
	     */
	    latToYIndex : function(latitude) {
	    	 var ytile = Math.floor((1 - Math.log(Math.tan(latitude * Math.PI / 180) + 1 / Math.cos(latitude * Math.PI / 180)) / Math.PI) / 2 * (1<<this.zoom));
	    	 return parseInt(ytile);
	    },
	    
	    /***
	     * transform longitude in x tiled index 
	     * @param longitude
	     * @returns {Number}
	     */
	    longToXIndex : function(longitude) {
	    	var xtile = Math.floor((longitude + 180) / 360 * (1<<this.zoom)) ;
	    	return  parseInt(xtile);
	    },
	    
	    /***
	     * transforms x tiled index in longitude
	     * @param x
	     * @returns {Number}
	     */
	    tileToLong : function(x) {
	    	 return (x/Math.pow(2,this.zoom)*360-180);
	    },
	    
	    /***
	     *  transforms y tiled index in latitude
	     * @param y
	     * @returns {Number}
	     */
	    tileToLat : function(y) {
	    	 var n=Math.PI-2*Math.PI*y/Math.pow(2,this.zoom);
	    	 return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
	    }
};
	 /**
	  * 
	  * UUUUUSSSEEELESSSSS, take point2D instead
	  * 
	  * 
     * Creates a new instance of GeoPosition from the specified latitude and
     * longitude. These are double values in decimal degrees, not degrees,
     * minutes, and seconds. Use the other constructor for those.
     * 
     * @param latitude
     *            a latitude value in decmial degrees
     * @param longitude
     *            a longitude value in decimal degrees
     */
	JenScript.GeoPosition = function(latitude,longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    };
    JenScript.GeoPosition.prototype = {
		/**
	     * Get the latitude as decimal degrees
	     * 
	     * @return the latitude as decimal degrees
	     */
	    getLatitude : function() {
	        return this.latitude;
	    },

	    /**
	     * Get the longitude as decimal degrees
	     * 
	     * @return the longitude as decimal degrees
	     */
	    getLongitude : function() {
	        return this.longitude;
	    },

	    /**
	     * Returns true the specified GeoPosition and this GeoPosition represent the
	     * exact same latitude and longitude coordinates.
	     * 
	     * @param obj
	     *            a GeoPosition to compare this GeoPosition to
	     * @return returns true if the specified GeoPosition is equal to this one
	     */
	    equals : function(obj) {
	        if (obj instanceof JenScript.GeoPosition) {
	            return obj.latitude == this.latitude && obj.longitude == this.longitude;
	        }
	        return false;
	    },

	    toPoint2D : function() {
	        return new JenScript.Point2D(this.longitude, this.latitude);
	    },

	    toString : function() {
	        return "geo position[" + this.latitude + ", " + this.longitude + "]";
	    }	
    };
	
	/**
	 *Map projection</code> defines a Merkator transformation
	 *between user space coordinate to device pixel coordinate
	 */
	JenScript.MapProjection = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MapProjection, JenScript.Projection);
	JenScript.Model.addMethods(JenScript.MapProjection,{
		
		_init : function(config){
			JenScript.Projection.call(this, config);
			/** zoom level & center position */
			this.level =(config.level !== undefined)?config.level : 3;
			this.square =(config.square !== undefined)?config.square : 256;
			this.centerPosition =(config.centerPosition !== undefined)?config.centerPosition : new JenScript.GeoPosition(20,0);
			/** dalle projection */
			this.projection= new JenScript.DalleProjection(this.level,this.square);
			
		},
		
		/**
		 * get the center position of this projection map
		 * 
		 * @return the centerPosition
		 */
		getCenterPosition : function() {
			return this.centerPosition;
		},

		/**
		 * @param centerPosition
		 *            the centerPosition to set
		 */
		setCenterPosition : function(centerPosition) {
			this.centerPosition = centerPosition;
			this.fireProjectionEvent('boundChanged');
		},
		
		/**
		 * WARNING!!
		 * keep compatible with other window bound call but very bad behavior,
		 * use setCenterPosition
		 */
		bound : function(minX, maxX, minY, maxY) {
			try{
				///this.validateBound(minX, maxX, minY, maxY);
				var longMedian = minX + Math.abs(maxX-minX)/2;
				var latMedian = minY + Math.abs(maxY-minY)/2;
				this.setCenterPosition(new JenScript.GeoPosition(latMedian,longMedian));
				
//				if (this.initial) {
//					this.initialMinX = minX;
//					this.initialMaxX = maxX;
//					this.initialMinY = minY;
//					this.initialMaxY = maxY;
//					this.initial = false;
//				}
//				
//				this.minX = minX;
//				this.maxX = maxX;
//				this.minY = minY;
//				this.maxY = maxY;
//				
//				if(this.view !== undefined && this.view.getDevice() !== undefined){
//					this.scaleX = this.getPixelWidth() / this.getUserWidth();
//					this.scaleY = this.getPixelHeight() / this.getUserHeight();
//				}
			}
			catch(err){
				throw new Error("Invalid bound projection with cause :"+err.message);
				console.error( this.name+' invalid bound projection '+err);
			}
			
		},

		/**
		 * @return the projection
		 */
		getProjection : function() {
			return this.projection;
		},

		/**
		 * @return the level
		 */
		getLevel : function() {
			return this.level;
		},

		/**
		 * @param level
		 *            the level to set
		 */
		setLevel : function(level) {
			if(level < 0) return;
			this.level = level;
			this.projection = new JenScript.DalleProjection(level,this.square);
			this.fireProjectionEvent('boundChanged');
		},

		/**
		 * return the minimum longitude of this merkator projection
		 */
		getMinX : function() {
			var centerXPixel = this.projection.longitudeToPixel(this.getCenterPosition().getLongitude());
			return this.projection.pixelToLongitude(centerXPixel - this.getPixelWidth() / 2);
		},

		
		/**
		 * return the maximum longitude of this merkator projection
		 */
		getMaxX : function() {
			var centerXPixel = this.projection.longitudeToPixel(this.getCenterPosition().getLongitude());
			return this.projection.pixelToLongitude(centerXPixel + this.getPixelWidth() / 2);
		},

		
		/**
		 * return the minimum latitude of this merkator projection
		 */
		getMinY : function() {
			var centerYPixel = this.projection.latitudeToPixel(this.getCenterPosition().getLatitude());
			return this.projection.pixelToLatitude(centerYPixel + this.getPixelHeight() / 2);
		},

		/**
		 * return the maximum latitude of this merkator projection
		 */
		getMaxY : function() {
			var centerYPixel = this.projection.latitudeToPixel(this.getCenterPosition().getLatitude());
			return this.projection.pixelToLatitude(centerYPixel - this.getPixelHeight() / 2);
		},

		/**
		 * transform user longitude (x axis) in the x pixel coordinate
		 */
		userToPixelX : function(userX) {
			var centerXPixel = this.projection.longitudeToPixel(this.getCenterPosition().getLongitude());
			return -centerXPixel + this.getPixelWidth() / 2 + this.projection.longitudeToPixel(userX);
		},
		
		/**
		 * transform user latitude (y axis) in the y pixel coordinate
		 */
		userToPixelY : function(userY) {
			var centerYPixel = this.projection.latitudeToPixel(this.getCenterPosition().getLatitude());
			return -centerYPixel + this.getPixelHeight() / 2 + this.projection.latitudeToPixel(userY);
		},
		
		/**
		 * transforms latitude to pixel y coordinate
		 * @param latitude
		 * @returns {Number} pixel y
		 */
		latToPixel : function(latitude){
			return this.userToPixelY(latitude);
		},
		
		/**
		 * transforms longitude to pixel x coordinate
		 * @param longitude
		 * @returns {Number} pixel x
		 */
		longToPixel : function(longitude){
			return this.userToPixelX(longitude);
		},

		/**
		 * transforms pixel x to longitude
		 * @param {Number} pixelX
		 * @returns {Number} longitude
		 */
		pixelToUserX : function(pixelX) {
			var centerXPixel = this.projection.longitudeToPixel(this.getCenterPosition().getLongitude());
			var long = this.projection.pixelToLongitude(centerXPixel - this.getPixelWidth() / 2 + pixelX);
			return long;
		},

		/**
		 * transforms pixel y to latitude
		 * @param {Number} pixelY
		 * @returns {Number} latitude
		 */
		pixelToUserY : function(pixelY) {
			var centerYPixel = this.projection.latitudeToPixel(this.getCenterPosition().getLatitude());
			var lat = this.projection.pixelToLatitude(centerYPixel - this.getPixelHeight() / 2 + pixelY);
			return lat;
		},
		
		
		/**
		 * Delegate transforms pixel y to latitude, see pixelToUserY
		 * @param {Number} pixelY
		 * @returns {Number} latitude
		 */
		pixelToLat : function(pixelY){
			return this.pixelToUserY(pixelY);
		},
		
		/**
		 * Delegate transforms pixel x to longitude, see pixelToUserX
		 * @param {Number} pixelX
		 * @returns {Number} longitude
		 */
		pixelToLong : function(pixelX){
			return this.pixelToUserX(pixelX);
		},
		
		geoToPixel : function(geo) {
			return new JenScript.Point2D(this.userToPixelX(geo.longitude),this.userToPixelY(geo.latitude));
		},

		pixelToGeo : function(pixelPoint) {
			return new JenScript.GeoPosition(this.pixelToUserX(pixelPoint.x),this.pixelToUserY(pixelPoint.y));
		},
		
	});
	
})();