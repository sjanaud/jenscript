(function() {
	JenScript.Math = {
			/**
	         * get the log base 10 for the given value
	         * @param {Number} value
	         * @returns {Number} the log 10 value.
	         */
	        log10 : function(value) {
	        	  return Math.log(value) / Math.LN10;
	        },
	        
	        /**
	         * get the radians value for this degrees value.
	         * @param {Number} degrees
	         * @returns {Number} the radians value
	         */
	        toRadians : function(degrees) {
	        	return degrees * Math.PI / 180;
	        },

	        /**
	         * get the degree value for this radians value.
	         * @param {Number} radians
	         * @returns {Number} degrees
	         */
	        toDegrees : function(radians) {
	        	return radians * 180 / Math.PI;
	        },
	        
			/**
			 * given the polar angle radian of point P(px,py) which is on the circle
			 * define by its center C(refX,refY)
			 * 
			 * @param {Number} refX
			 * @param {Number} refY
			 * @param {Number} px
			 * @param {Number} py
			 * @return {Number} polar angle radian
			 */
			getPolarAngle : function( refX,  refY,  px,  py) {
				var tethaRadian = -1;
				if ((px - refX) > 0 && (refY - py) >= 0) {
					tethaRadian = Math.atan((refY - py) / (px - refX));
				} else if ((px - refX) > 0 && (refY - py) < 0) {
					tethaRadian = Math.atan((refY - py) / (px - refX)) + 2 * Math.PI;
				} else if ((px - refX) < 0) {
					tethaRadian = Math.atan((refY - py) / (px - refX)) + Math.PI;
				} else if ((px - refX) == 0 && (refY - py) > 0) {
					tethaRadian = Math.PI / 2;
				} else if ((px - refX) == 0 && (refY - py) < 0) {
					tethaRadian = 3 * Math.PI / 2;
				}
				return tethaRadian;
			},
	};
})();