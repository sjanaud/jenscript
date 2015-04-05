(function(){	

	/**
	 * Bound2D rectangle
	 */
	JenScript.Bound2D  = function(x,y,width,height){
		this.x=x;this.y=y;this.width=width;this.height=height;
		this.getX = function(){return this.x;};
		this.getY = function(){return this.y;};
		this.getWidth = function(){return this.width;};
		this.getHeight = function(){return this.height;};
		this.getCenterX= function(){return (this.x + this.width/2);};
		this.getCenterY= function(){return (this.y + this.height/2);};
		this.toString = function(){
			return 'JenScript.Bound2D['+this.x+','+this.y+','+this.width+','+this.height+']';
		};
		
		/**
		 * true if the given point P(x,y) is contained in this geometry, false otherwise
		 * @param {Number} x coordinate
		 * @param {Number} y coordinate
		 * @returns {Boolean} true if the given point P(x,y) is contained in this geometry, false otherwise
		 */
		this.contains= function(x,y){
			return (x>=this.x && x<= this.x+this.width && y>=this.y && y<= this.y+this.height); 
		};
		
		/**
		 * true if the width or height are less than zero
		 * @returns {Boolean} true if this bound is empty, false otherwise
		 */
		this.isEmpty = function() {
            return (this.width <= 0.0) || (this.height <= 0.0);
        };
        
        /**
         * true if the given bound intersects this bound, false otherwise
         * @param {Object} bound
         * @returns {Boolean} true if the given bound intersects this bound, false otherwise
         */
		this.intersects= function(bound){
			if (this.isEmpty() || bound.getWidth() <= 0 || bound.getHeight() <= 0) {
	            return false;
	        }
	        var x0 = this.getX();
	        var y0 = this.getY();
	        return (bound.getX() + bound.getWidth() > x0 &&
	                bound.getY() + bound.getHeight() > y0 &&
	                bound.getX() < x0 + this.getWidth() &&
	                bound.getY() < y0 + this.getHeight());
		};
	};
	
	/**
	 * Point 2D defines the Point P(x,y)
	 */
	JenScript.Point2D  = function(x,y){
		this.x=x;this.y=y;
		this.getX = function(){return this.x;};
		this.getY = function(){return this.y;};
		this.toString = function(){
			return 'JenScript.Point2D['+this.x+','+this.y+']';
		};
		this.equals = function(p){
			if(this.x === p.x && this.y === p.y) return true;
			return false;
		};
	};
	
	
	
	
	/**
	 * Geometry Path
	 * @constructor
	 */
	JenScript.GeometryPath = function(path){
		this.path = path;
		
		
		/**
		 * get total length of this geometry path
		 * @returns {Number} total path length
		 */
		this.lengthOfPath = function() {
        	return this.path.getTotalLength();
        };
        
        this.toString = function(){
        	return '[object JenScript.GeometryPath]{path:'+this.path+'}';
        };
		
		/**
         * get point at the given length on the path
         * @param {Number} length
         * @returns {Object} point at length on the path
         */
        this.pointAtLength = function(length) {
        	var pt = this.path.getPointAtLength(length);
        	return new JenScript.Point2D(pt.x,pt.y);
        };
        
        /**
         * return the orthogonal point that diverges of radius from path at the given length by the left
         * @param length
         * @param radius
         * @return orthogonal left point
         */
        this.orthoLeftPointAtLength = function(length,radius){
        	var metricAngle = this.angleAtLength(length).rad;
    		var p = this.pointAtLength(length);
    		var px;var py;
    		
    		px = p.getX() + radius * Math.sin(metricAngle);
    		py = p.getY() - radius * Math.cos(metricAngle);
    		
    		return new JenScript.Point2D(px,py);
        },
        
        
        /**
         * return the orthogonal point that diverges of radius from path at the given length by the right
         * @param length
         * @param radius
         * @return orthogonal right point
         */
        this.orthoRightPointAtLength = function(length,radius){
        	var metricAngle = this.angleAtLength(length).rad;
    		var p = this.pointAtLength(length);
    		var px; var py;
    		px = p.getX() - radius * Math.sin(metricAngle);
    		py = p.getY() + radius * Math.cos(metricAngle);
    		
    		return new JenScript.Point2D(px,py);
        },
        
        /**
         * get angle at the given length on the path
         * @param {Number} length
         * @returns {Object} point at length on the path
         */
        this.angleAtLength = function(length) {
        	var precision = 2;
        	var lower = this.pointAtLength(length-precision);
        	var upper = this.pointAtLength(length+precision);
        	var rad = Math.atan2(upper.y - lower.y, upper.x - lower.x);
        	var deg = JenScript.Math.toDegrees(rad);
        	return {rad:rad,deg:deg,toString : function(){return 'angle radian :'+rad+', angle degree :'+deg;}};
        };
	};
	
	
})();