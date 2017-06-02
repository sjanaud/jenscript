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

			getSqDist : function (p1,p2){
			    var dx = p1.x - p2.x,
			        dy = p1.y - p2.y;
			    return dx * dx + dy * dy;
			},

		    getSqSegDist : function(p,p1,p2){
			    var x = p1.x,
			        y = p1.y,
			        dx = p2.x - x,
			        dy = p2.y - y;
			    if (dx !== 0 || dy !== 0) {
			        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
			        if (t > 1) {
			            x = p2.x;
			            y = p2.y;

			        } else if (t > 0) {
			            x += dx * t;
			            y += dy * t;
			        }
			    }
			    dx = p.x - x;
			    dy = p.y - y;
			    return dx * dx + dy * dy;
			},
			
			simplifyRadialDist : function(points,sqTolerance) {
			    var prevPoint = points[0],
			        newPoints = [prevPoint],
			        point;
			    for (var i = 1, len = points.length; i < len; i++) {
			        point = points[i];
			        if (this.getSqDist(point, prevPoint) > sqTolerance) {
			            newPoints.push(point);
			            prevPoint = point;
			        }
			    }
			    if (prevPoint !== point) newPoints.push(point);
			    return newPoints;
			},

			simplifyDPStep : function(points, first, last, sqTolerance, simplified) {
			    var maxSqDist = sqTolerance,index;
			    for (var i = first + 1; i < last; i++) {
			        var sqDist = this.getSqSegDist(points[i], points[first], points[last]);
			        if (sqDist > maxSqDist) {
			            index = i;
			            maxSqDist = sqDist;
			        }
			    }
			    if (maxSqDist > sqTolerance) {
			        if (index - first > 1) this.simplifyDPStep(points, first, index, sqTolerance, simplified);
			        simplified.push(points[index]);
			        if (last - index > 1) this.simplifyDPStep(points, index, last, sqTolerance, simplified);
			    }
			},

			simplifyDouglasPeucker : function (points, sqTolerance) {
			    var last = points.length - 1;
			    var simplified = [points[0]];
			    this.simplifyDPStep(points, 0, last, sqTolerance, simplified);
			    simplified.push(points[last]);
			    return simplified;
			},

			simplify : function (points, tolerance, highestQuality) {
			    if (points.length <= 2) return points;
			    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;
			    points = highestQuality ? points : this.simplifyRadialDist(points, sqTolerance);
			    points = this.simplifyDouglasPeucker(points, sqTolerance);
			    return points;
			},

	};
})();