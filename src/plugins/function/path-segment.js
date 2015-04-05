(function(){

	JenScript.PathSegment = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.PathSegment,{
		
		/**
		 * create a new segment with specified projections coordinates
		 * 
		 * @param segmentUserStart
		 *            the start segment in user projection
		 * @param segmentUserEnd
		 *            the end segment in user projection
		 * @param segmentDeviceStart
		 *            the start segment in device projection
		 * @param segmentDeviceEnd
		 *            the end segment in device projection
		 */
		init : function(config){
			/** segment start in user projection */
			this.segmentUserStart=config.userStart;
			/** segment end in user projection */
			this.segmentUserEnd=config.userEnd;
			/** segment start in device projection */
			this.segmentDeviceStart=config.deviceStart;
			/** segment end in device projection */
			this.segmentDeviceEnd=config.deviceEnd;
		},
		/**
		 * get segment start in device projection
		 * 
		 * @return segment start in device projection
		 */
		getSegmentDeviceStart : function() {
			return this.segmentDeviceStart;
		},

		/**
		 * set segment start in device projection
		 * 
		 * @param segmentStart
		 *            the segment start to set
		 */
		setSegmentDeviceStart : function(segmentStart) {
			this.segmentDeviceStart = segmentStart;
		},

		/**
		 * get segment end in device projection
		 * 
		 * @return segment end in device projection
		 */
		getSegmentDeviceEnd : function() {
			return this.segmentDeviceEnd;
		},

		/**
		 * set segment end in device projection
		 * 
		 * @param segmentEnd
		 *            the segment end to set
		 */
		setSegmentDeviceEnd : function(segmentEnd) {
			this.segmentDeviceEnd = segmentEnd;
		},

		/**
		 * return true if segment range contains specified user value, false
		 * otherwise
		 * 
		 * @param value
		 *            the user value coordinate to test
		 * @return true if segment range contains specified user  value,
		 *         false otherwise
		 */
		match : function(value) {
			if(this.sourceFunction.getNature().isXFunction()){
				return value >= this.segmentUserStart.getX() && value <= this.segmentUserEnd.getX();
			}else if(this.sourceFunction.getNature().isYFunction()){
				return value >= this.segmentUserStart.getY() && value <= this.segmentUserEnd.getY();
			}
		},

		/**
		 * get segment point for the specified value in user projection
		 * 
		 * @param value
		 *            the user value in user projection to evaluate
		 * @return evaluate point for specified x in user projection
		 */
		getUserPoint : function(value) {
			//console.log('coef : '+this.getCoefficient());
			//console.log('constant : '+this.getConstant());
			if(this.sourceFunction.getNature().isXFunction()){
				var userY = this.getCoefficient() * value + this.getConstant();
				return new JenScript.Point2D(value, userY);	
			}else if(this.sourceFunction.getNature().isYFunction()){
				var userX = this.getCoefficient() * value + this.getConstant();
				return new JenScript.Point2D(userX, value);
			}
		},

		/**
		 * get start point of this segment in user projection
		 * 
		 * @return start point of this segment in user projection
		 */
		getSegmentUserStart : function() {
			return this.segmentUserStart;
		},

		/**
		 * set start point of this segment in user projection
		 * 
		 * @param segmentUserStart
		 *            the segment start in user projection
		 */
		setSegmentUserStart : function(segmentUserStart) {
			this.segmentUserStart = segmentUserStart;
		},

		/**
		 * get end point of this segment in user projection
		 * 
		 * @return end point of this segment in user projection
		 */
		getSegmentUserEnd : function() {
			return this.segmentUserEnd;
		},

		/**
		 * set end point of this segment in user projection
		 * 
		 * @param segmentUserEnd
		 *            the segment end in user projection
		 */
		setSegmentUserEnd : function(segmentUserEnd) {
			this.segmentUserEnd = segmentUserEnd;
		},

		/**
		 * get the length of this segment in device projection
		 * 
		 * @return length of this segment in device projection
		 */
		deviceLength : function() {
			var X = Math.pow((this.segmentDeviceStart.getX()-this.segmentDeviceEnd.getX()),2);
			var Y = Math.pow((this.segmentDeviceStart.getY()-this.segmentDeviceEnd.getY()),2);
			return Math.sqrt(X + Y);
		},

		/**
		 * <p>
		 * get A slope coefficient of this segment, depends on function nature
		 * </p>
		 * <p>
		 * y = Ax + B (x function) or x = Ay + B (y function)
		 * </p>
		 * 
		 * @return coefficient of this segment
		 */
		getCoefficient : function() {
			if(this.sourceFunction.getNature().isXFunction()){
				return (this.segmentUserEnd.getY() - this.segmentUserStart.getY()) / (this.segmentUserEnd.getX() - this.segmentUserStart.getX());
			}else if(this.sourceFunction.getNature().isYFunction()){
				return (this.segmentUserEnd.getX() - this.segmentUserStart.getX()) / (this.segmentUserEnd.getY() - this.segmentUserStart.getY());
			}
		},

		/**
		 * <p>
		 * get B constant, the y-intercept of this segment
		 * </p>
		 * <p>
		 * y = Ax + B
		 * </p>
		 * 
		 * @return the y-intercept of this segment
		 */
		getConstant : function() {
			if(this.sourceFunction.getNature().isXFunction()){
				return this.segmentUserStart.getY() - this.getCoefficient() * this.segmentUserStart.getX();	
			}else if(this.sourceFunction.getNature().isYFunction()){
				return this.segmentUserStart.getX() - this.getCoefficient() * this.segmentUserStart.getY();
			}
		},

		toString : function() {
			return "PathSegment [segmentUserStart=" + this.segmentUserStart + ", segmentUserEnd=" + this.segmentUserEnd + "]";
		},

		/**
		 * equals point is based on user coordinate value
		 */
		equals : function(obj) {
			if (obj === undefined) {
				return false;
			}
			if (!obj instanceof JenScript.PathSegment) {
				return false;
			}
			if(this.segmentUserStart.equals(obj.segmentUserStart) && this.segmentUserEnd.equals(obj.segmentUserEnd))
				return true;
			return false;
		}

	});
})();