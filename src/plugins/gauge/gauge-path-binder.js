(function(){

	
	
	/**
	 * Object JenScript.PathBinder()
	 * Defines a mechanism to bind path to a gauge.
	 * This path will be used by gauge to lay out metrics on the binded path
	 * 
	 * @param {Object} config
	 * @param {Boolean} [config.debug] debug flag
	 */
	JenScript.PathBinder = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.PathBinder,{
		/**
		 * Initialize path binder
		 * @param {Object} config
		 * @param {Boolean} [config.debug] debug flag
		 */
		init : function(config){
			config = config || {};
			this.debug = (config.debug !== undefined)? config.debug :  false;
			/** the metrics path that own this binder */
			this.metricsPath;
		},
		
		/**
		 * true if debug enabled, false otherwise
		 * @return {Boolean} the debug flag
		 */
		isDebug : function() {
			return this.debug;
		},

		/**
		 * set true to debug path binder
		 * @param {Boolean} debug flag
		 */
		setDebug : function(debug) {
			this.debug = debug;
		},

		/**
		 * get metrics path that own this binder
		 * @return {Object}  metrics path
		 */
		getMetricsPath : function() {
			return this.metricsPath;
		},

		/**
		 * set metrics path owner
		 * @param {Object} metrics path to set
		 */
		setMetricsPath : function(metricsPath) {
			this.metricsPath = metricsPath;
		},

		/**
		 * bind path for given gauge, this method should be provide by override.
		 * @param {Object} gauge
		 * @return {Object} the given path to bind
		 */
		bindPath : function(gauge){throw new Error('JenScript.PathBinder, bindPath method should be provide by override.');},

		/**
		 * debug paint path binder by painting all geometries 
		 * objects that makes sense to understand path binding
		 * 
		 * @param {Object} g2d
		 * @param {Object} gauge
		 */
		paintDebug : function(g2d,gauge){}
	});
	
	
	/**
	 * Object JenScript.AbstractPathAutoBinder()
	 * Defines abstract automatic path binder that takes the responsibility 
	 * to solve intersections with arc which is defined by input parameters.
	 * 
	 * After solving these points, provides a path by implementing createPath method.
	 * Default implementation are provided for arc path, cubic path and quad path
	 * 
	 * @param {Object} config
	 * @param {Number} [config.radius] arc radius
	 * @param {Number} [config.polarRadius] polar radius
	 * @param {Number} [config.polarAngle] polar angle
	 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
	 */
	JenScript.AbstractPathAutoBinder = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractPathAutoBinder,JenScript.PathBinder);
	JenScript.Model.addMethods(JenScript.AbstractPathAutoBinder,{
		
		/**
		 * Initialize auto path binder
		 * @param {Object} config
		 * @param {Number} [config.radius] arc radius
		 * @param {Number} [config.polarRadius] polar radius
		 * @param {Number} [config.polarAngle] polar angle
		 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
		 */
		_init : function(config){
			config = config || {};
			/** binder radius */
			this.radius = config.radius;
			/** polar radius */
			this.polarRadius = config.polarRadius;
			/** polar angle degree */
			this.polarDegree = config.polarDegree;
			/** direction */
			this.direction = (config.direction !== undefined)? config.direction :'Clockwise';
			this.x0;this.y0;this.r0;this.arc0;
			this.x1;this.y1;this.r1;this.arc1;
			this.intersectionPointStart;
			this.theta1Radian1;
			this.intersectionPointEnd;
			this.theta1Radian2;
			JenScript.PathBinder.call(this,config);
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
		
		/**
		 * bind path for given gauge
		 * @param {Object} gaug
		 * @returns binded path
		 */
		bindPath : function(gauge) {
			if(this.solveIntersectionPoints())
				return this.createPath();
			else
				return undefined;
		},

		/**
		 * create the shape according to the binder
		 * @return {Object} path to bind 
		 */
		createPath : function(){throw new Error('JenScript.AbstractPathAutoBinder, createPath should be supplied by override.');},

		/**
		 * solve the arc0 (gauge arc) and arc1(path arc) intersection
		 */
		solveIntersectionPoints : function() {
			var gauge = this.getMetricsPath().getBody().getGauge();
			
			// define first circle which is gauge outline circle
			this.x0 = gauge.getCenterDevice().getX();
			this.y0 = gauge.getCenterDevice().getY();
			this.r0 = gauge.getRadius();
			this.arc0 = new JenScript.SVGCircle().center(this.x0,this.y0).radius(this.r0);
			
			// define the second circle with given parameters
			this.x1 = this.x0 + this.polarRadius * Math.cos(JenScript.Math.toRadians(this.polarDegree));
			this.y1 = this.y0 - this.polarRadius * Math.sin(JenScript.Math.toRadians(this.polarDegree));
			this.r1 = this.radius;

			this.arc1 = new JenScript.SVGCircle().center(this.x1,this.y1).radius(this.r1);
			var x0 =this.x0;
			var y0 =this.y0;
			var r0 =this.r0;
			var x1 =this.x1;
			var y1 =this.y1;
			var r1 =this.r1;
			if (this.polarDegree != 0 && this.polarDegree != 180) {
				// Ax²+Bx+B = 0
				var N = (r1 * r1 - r0 * r0 - x1 * x1 + x0 * x0 - y1 * y1 + y0 * y0) / (2 * (y0 - y1));
				var A = Math.pow((x0 - x1) / (y0 - y1), 2) + 1;
				var B = 2 * y0 * (x0 - x1) / (y0 - y1) - 2 * N * (x0 - x1) / (y0 - y1) - 2 * x0;
				var C = x0 * x0 + y0 * y0 + N * N - r0 * r0 - 2 * y0 * N;
				var delta = Math.sqrt(B * B - 4 * A * C);

				if (delta < 0) {
					return false;
				} else if (delta >= 0) {

					// p1
					var p1x = (-B - delta) / (2 * A);
					var p1y = N - p1x * (x0 - x1) / (y0 - y1);
					this.intersectionPointStart = new JenScript.Point2D(p1x, p1y);

					// p2
					var p2x = (-B + delta) / (2 * A);
					var p2y = N - p2x * (x0 - x1) / (y0 - y1);
					this.intersectionPointEnd = new JenScript.Point2D(p2x, p2y);

					this.theta1Radian1 = this.getPolarAngle(x1, y1, p1x, p1y);
					this.theta1Radian2 = this.getPolarAngle(x1, y1, p2x, p2y);
					return true;

				}
			} else if (this.polarDegree == 0 || this.polarDegree == 180) {
				// polar degree = 0|180 -> y0=y1
				// Ay²+By + C = 0;
				var x = (r1 * r1 - r0 * r0 - x1 * x1 + x0 * x0) / (2 * (x0 - x1));
				var A = 1;
				var B = -2 * y1;
				var C = x1 * x1 + x * x - 2 * x1 * x + y1 * y1 - r1 * r1;
				var delta = Math.sqrt(B * B - 4 * A * C);

				if (delta < 0) {
					//alert("no solution");
					return false;
				} else if (delta >= 0) {

					// p1
					var p1x = x;
					var p1y = (-B - delta) / 2 * A;
					this.intersectionPointStart = new JenScript.Point2D(p1x, p1y);

					// p2
					var p2x = x;
					var p2y = (-B + delta) / 2 * A;
					this.intersectionPointEnd = new JenScript.Point2D(p2x, p2y);

					this.theta1Radian1 = this.getPolarAngle(x1, y1, p1x, p1y);
					this.theta1Radian2 = this.getPolarAngle(x1, y1, p2x, p2y);
					return true;

				}
			}
		},

		/**
		 * paint debug for this auto path binder
		 * @param {Object} graphics context
		 * @param {Object} gauge
		 */
		paintDebug : function(g2d,gauge) {
		
			var p =this.createPath();
			if(p === undefined)
				return;
			this.solveIntersectionPoints();

			var line3 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.x0,this.y0);
			g2d.insertSVG(line3.stroke(JenScript.Color.brighten(JenScript.RosePalette.CALYPSOBLUE,30).toHexString()).fillNone().toSVG());
			
			g2d.insertSVG(this.arc0.stroke('black').fillNone().toSVG());
			g2d.insertSVG(this.arc1.stroke('darkgray').fillNone().toSVG());
			
			if(this.intersectionPointStart === undefined || this.intersectionPointEnd === undefined)
				return;
			
			var line1 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.intersectionPointStart.x,this.intersectionPointStart.y);
			g2d.insertSVG(line1.stroke('yellow').fillNone().toSVG());
			
			var line2 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.intersectionPointEnd.x,this.intersectionPointEnd.y);
			g2d.insertSVG(line2.stroke('yellow').fillNone().toSVG());
			
			var i1 = new JenScript.SVGCircle().center(this.intersectionPointStart.getX(), this.intersectionPointStart.getY()).radius(4);
			var i2 = new JenScript.SVGCircle().center(this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY()).radius(4);
			
			var color = (this.direction == 'Clockwise')? 'cyan' : 'orange';
			this.drawPath(g2d, p, color);
			
			g2d.insertSVG(i1.fill(JenScript.RosePalette.LIME).toSVG());
			g2d.insertSVG(i2.fill(JenScript.RosePalette.LIME).toSVG());
			
		},

		/**
		 * draw the given path with given color
		 * @param {Object} graphics context
		 * @param {Object} path
		 * @param {String} color
		 */
		drawPath : function(g2d,path,c) {
			if (path == undefined)
				return;
			g2d.insertSVG(path.stroke(c).strokeWidth(2).fillNone().toSVG());
			var geom = new JenScript.GeometryPath(path.toSVG());
			var s1 = this.creatTickDirection(path, geom.lengthOfPath() / 2, 5);
			var s2 = this.creatTickDirection(path, geom.lengthOfPath() / 4, 4);
			var s3 = this.creatTickDirection(path, geom.lengthOfPath() * 3 / 4, 4);
			if (s1 != undefined)
				g2d.insertSVG(s1.fill(c).toSVG());
			if (s2 != undefined)
				g2d.insertSVG(s2.fill(c).toSVG());
			if (s3 != undefined)
				g2d.insertSVG(s3.fill(c).toSVG());
		},

		/**
		 * create tick direction according to path direction
		 * @param {Object} shape
		 * @param {Number} length
		 * @param {Number} size
		 * @return {Object} tick shape
		 */
		creatTickDirection : function(shape,length,size) {
			var geom = new JenScript.GeometryPath(shape.toSVG());
			var div = size;
			if (length - div > 0 && length + 2 * div < geom.lengthOfPath()) {
				var path = new JenScript.SVGPath();
				var p1 = geom.pointAtLength(length + 2 * div);
				var pl = geom.orthoLeftPointAtLength(length - div, div);
				var pr = geom.orthoRightPointAtLength(length - div, div);
				path.moveTo(p1.getX(), p1.getY());
				path.lineTo(pr.getX(), pr.getY());
				path.lineTo(pl.getX(), pl.getY());
				path.close();
				return path;
			}
			return undefined;
		}
	});
	
	
	/**
	 * Object JenScript.PathArcAutoBinder()
	 * Auto Path Binder for gauge arc metrics
	 * 
	 * @param {Object} config
	 * @param {Number} [config.radius] arc radius
	 * @param {Number} [config.polarRadius] polar radius
	 * @param {Number} [config.polarAngle] polar angle
	 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
	 */
	JenScript.PathArcAutoBinder = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PathArcAutoBinder,JenScript.AbstractPathAutoBinder);
	JenScript.Model.addMethods(JenScript.PathArcAutoBinder,{
		
		/**
		 * Initialize Arc Auto Path Binder
		 * 
		 * @param {Object} config
		 * @param {Number} [config.radius] arc radius
		 * @param {Number} [config.polarRadius] polar radius
		 * @param {Number} [config.polarAngle] polar angle
		 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
		 */
		__init : function(config){
			config = config || {};
			/** the arc which is bind by this binder */
			this.intersectionArc;
			JenScript.AbstractPathAutoBinder.call(this,config);
		},
		
		/**
		 * get intersected arc 
		 * @return {Object} the intersectionArc
		 */
		getIntersectionArc : function() {
			return this.intersectionArc;
		},

		/**
		 * set intersected arc
		 * @param {Object} intersectionArc
		 */
		setIntersectionArc : function(intersectionArc) {
			this.intersectionArc = intersectionArc;
		},

		/**
		 * create path for this auto arc path binder
		 * @returns {Object} arc to bind
		 */
		createPath : function() {
			var polar = function (anchor,radius, angleRadian){
				return {
					x : anchor.x +radius*Math.cos(angleRadian),
					y : anchor.y -radius*Math.sin(angleRadian)
				};
			};
			var x1 =this.x1;
			var y1 =this.y1;
			var r1 =this.r1;
			var theta1Radian1 = this.theta1Radian1;
			var theta1Radian2 = this.theta1Radian2; 
			var path = new JenScript.SVGPath();
			if (this.polarDegree > 0 && this.polarDegree < 180) {
				if (this.theta1Radian2 > this.theta1Radian1) {
					var extendsDegree = JenScript.Math.toDegrees(this.theta1Radian2) - JenScript.Math.toDegrees(this.theta1Radian1);
					var largeArcFlag = (extendsDegree >=180 || extendsDegree <= -180)? 1:0;
					if (this.direction == 'AntiClockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian1);
						var a = polar({x:x1,y:y1},r1,theta1Radian1 + JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,0,a.x,a.y);
					} else if (this.direction == 'Clockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian2);
						var a = polar({x:x1,y:y1},r1,theta1Radian2 - JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,1,a.x,a.y);
					}
				} else {
					var extendsDegree = Math.abs(JenScript.Math.toDegrees(2 * Math.PI + theta1Radian2) - JenScript.Math.toDegrees(theta1Radian1));
					var largeArcFlag = (extendsDegree >=180 || extendsDegree <= -180)? 1:0;
					if (this.direction == 'AntiClockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian1);
						var a = polar({x:x1,y:y1},r1,theta1Radian1 + JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,0,a.x,a.y);
						
					} else if (this.direction == 'Clockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian2);
						var a = polar({x:x1,y:y1},r1,theta1Radian2 - JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,1,a.x,a.y);
					}
				}
			} 
			else if (this.polarDegree > 180 && this.polarDegree < 360) {
				if (this.theta1Radian2 > this.theta1Radian1) {
					var extendsDegree = (360 - (JenScript.Math.toDegrees(theta1Radian2) - JenScript.Math.toDegrees(theta1Radian1)));
					var largeArcFlag = (extendsDegree >=180 || extendsDegree <= -180)? 1:0;
					if (this.direction == 'AntiClockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian2);
						var a = polar({x:x1,y:y1},r1,theta1Radian2 + JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,0,a.x,a.y);
					} else if (this.direction == 'Clockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian1);
						var a = polar({x:x1,y:y1},r1,theta1Radian1 - JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,1,a.x,a.y);
					}
				} else {
					var extendsDegree = (JenScript.Math.toDegrees(theta1Radian1) - JenScript.Math.toDegrees(theta1Radian2));
					var largeArcFlag = (extendsDegree >=180 || extendsDegree <= -180)? 1:0;
					if (this.direction == 'AntiClockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian2);
						var a = polar({x:x1,y:y1},r1,theta1Radian2 + JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,0,a.x,a.y);
					} else if (this.direction == 'Clockwise') {
						var m = polar({x:x1,y:y1},r1,theta1Radian1);
						var a = polar({x:x1,y:y1},r1,theta1Radian1 - JenScript.Math.toRadians(extendsDegree));
						path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,1,a.x,a.y);
					}
				}
			} 
			else if (this.polarDegree === 0) {
				var extendsDegree = JenScript.Math.toDegrees(theta1Radian2) - JenScript.Math.toDegrees(theta1Radian1);
				var largeArcFlag = (extendsDegree >=180 || extendsDegree <= -180)? 1:0;
				if (this.direction === 'AntiClockwise') {
					var m = polar({x:x1,y:y1},r1,theta1Radian1);
					var a = polar({x:x1,y:y1},r1,theta1Radian1 + JenScript.Math.toRadians(extendsDegree));
					path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,0,a.x,a.y);
				} else if (this.direction === 'Clockwise') {
					var m = polar({x:x1,y:y1},r1,theta1Radian2);
					var a = polar({x:x1,y:y1},r1,theta1Radian2 - JenScript.Math.toRadians(extendsDegree));
					path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,1,a.x,a.y);
				}
			}
			else if (this.polarDegree === 180) {
				var extendsDegree = 360 - JenScript.Math.toDegrees(theta1Radian2) + JenScript.Math.toDegrees(theta1Radian1);
				var largeArcFlag = (extendsDegree >=180 || extendsDegree <= -180)? 1:0;
				if (this.direction === 'AntiClockwise') {
					var m = polar({x:x1,y:y1},r1,theta1Radian2);
					var a = polar({x:x1,y:y1},r1,theta1Radian2 + JenScript.Math.toRadians(extendsDegree));
					path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,0,a.x,a.y);
				} else if (this.direction === 'Clockwise') {
					var m = polar({x:x1,y:y1},r1,theta1Radian1);
					var a = polar({x:x1,y:y1},r1,theta1Radian1 - JenScript.Math.toRadians(extendsDegree));
					path.moveTo(m.x,m.y).arcTo(r1,r1,0,largeArcFlag,1,a.x,a.y);
				}
			}
			this.intersectionArc = path;
			return this.intersectionArc;
		}
	});
	
	
	/**
	 * Object JenScript.PathArcManualBinder()
	 * Manual Arc path binder for arc metrics.
	 * 
	 * @param {Object} config
	 * @param {Number} [config.startAngleDegree] manual start angle degree
	 * @param {Number} [config.extendsAngleDegree] manual extends angle degree
	 * @param {Number} [config.radius] arc radius
	 * @param {Number} [config.polarRadius] polar radius, default 0
	 * @param {Number} [config.polarAngle] polar angle, default 0
	 */
	JenScript.PathArcManualBinder = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PathArcManualBinder,JenScript.PathBinder);
	JenScript.Model.addMethods(JenScript.PathArcManualBinder,{
		/**
		 * Initialize Manual Arc Path Binder.
		 * @param {Object} config
		 * @param {Number} [config.startAngleDegree] manual start angle degree
		 * @param {Number} [config.extendsAngleDegree] manual extends angle degree
		 * @param {Number} [config.radius] arc radius
		 * @param {Number} [config.polarRadius] polar radius, default 0
		 * @param {Number} [config.polarAngle] polar angle, default 0
		 */
		_init : function(config){
			config = config || {};
			/** binder radius */
			this.radius = config.radius;
			/** binder start angle degree */
			this.startAngleDegree = config.startAngleDegree;
			/** binder extends angle degree */
			this.extendsAngleDegree = config.extendsAngleDegree;
			/** shift radius */
			this.shiftRadius = (config.shiftRadius !== undefined) ? config.polarRadius: 0;
			/** shift angle degree */
			this.shiftAngleDegree = (config.shiftAngleDegree !== undefined) ? config.polarAngle: 0;
		},
		
		/**
		 * bind the arc for the given gauge
		 * @param {Object} gauge
		 */
		bindPath : function(gauge) {
			var centerX = gauge.getCenterDevice().getX();
			var centerY = gauge.getCenterDevice().getY();
			var shiftCenterX = centerX + this.shiftRadius * Math.cos(JenScript.Math.toRadians(this.shiftAngleDegree));
			var shiftCenterY = centerY - this.shiftRadius * Math.sin(JenScript.Math.toRadians(this.shiftAngleDegree));
			var polar = function(anchor, radius,angle){
				return {
					x : anchor.x +radius * Math.cos(JenScript.Math.toRadians(angle)),
					y : anchor.y -radius * Math.sin(JenScript.Math.toRadians(angle)),
				};
			};
			var anchor =  {x : shiftCenterX,y:shiftCenterY};
			var p1 = polar(anchor,this.radius,this.startAngleDegree);
			var p2 = polar(anchor,this.radius,this.startAngleDegree+this.extendsAngleDegree);
			var path = new JenScript.SVGPath();
			var largeArcFlag = (this.extendsAngleDegree >=180 || this.extendsAngleDegree <= -180)? 1:0;
			var sweepFlag = (this.extendsAngleDegree < 0)? 1:0;
			path.moveTo(p1.x,p1.y).arcTo(this.radius,this.radius,0,largeArcFlag,sweepFlag,p2.x,p2.y);
			
//			if(this.extendsAngleDegree >= 0){
//				//alert("case 1");
//				path.moveTo(p1.x,p1.y).arcTo(this.radius,this.radius,0,largeArcFlag,sweepFlag,p2.x,p2.y);
//			}
//			else{
//				//alert("case 2");
//				path.moveTo(p2.x,p2.y).arcTo(this.radius,this.radius,0,largeArcFlag,sweepFlag,p1.x,p1.y);
//			}
			return path;
		}
	});
	
	
	
	
	/**
	 * Object JenScript.PathCubicAutoBinder()
	 * Auto Cubic Path Binder for gauge metrics
	 * 
	 * @param {Object} config
	 * @param {Number} [config.controlOffsetRadius] offset radius for control points
	 * @param {Number} [config.controlOffsetAngleDegree] offset angle for control points
	 * @param {Number} [config.radius] arc radius
	 * @param {Number} [config.polarRadius] polar radius
	 * @param {Number} [config.polarAngle] polar angle
	 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
	 */
	JenScript.PathCubicAutoBinder = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PathCubicAutoBinder,JenScript.AbstractPathAutoBinder);
	JenScript.Model.addMethods(JenScript.PathCubicAutoBinder,{
		
		/**
		 * Initialize Cubic Auto Path Binder
		 * 
		 * @param {Object} config
		 * @param {Number} [config.controlOffsetRadius] offset radius for control points
		 * @param {Number} [config.controlOffsetAngleDegree] offset angle for control points
		 * @param {Number} [config.radius] arc radius
		 * @param {Number} [config.polarRadius] polar radius
		 * @param {Number} [config.polarAngle] polar angle
		 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
		 */
		__init : function(config){
			config = config || {};
			/** the cubic curve which is bind by this binder */
			this.intersectionCubicCurve;
			/** control offset radius */
			this.controlOffsetRadius = 10;
			/** control offset angle degree */
			this.controlOffsetAngleDegree = 10;
			config.name='JenScript.PathCubicAutoBinder';
			JenScript.AbstractPathAutoBinder.call(this,config);
		},
		
		/**
		 * get cubic intersection curve
		 * @return {Object} the intersectionCubicCurve
		 */
		getIntersectionCubicCurve  : function() {
			return this.intersectionCubicCurve;
		},

		/**
		 * set cubic intersection curve
		 * @param {Object} intersectionCubicCurve
		 */
		setIntersectionCubicCurve  : function(intersectionCubicCurve) {
			this.intersectionCubicCurve = intersectionCubicCurve;
		},

		/**
		 * get cubic control offset radius
		 * @return {Number} controlOffsetRadius
		 */
		getControlOffsetRadius  : function() {
			return this.controlOffsetRadius;
		},

		/**
		 * set cubic control offset radius
		 * @param {Number} controlOffsetRadius
		 */
		setControlOffsetRadius  : function(controlOffsetRadius) {
			if (controlOffsetRadius < 0)
				throw new Error('control offset radius must be positive');
			this.controlOffsetRadius = controlOffsetRadius;
		},

		/**
		 * get cubic cubic offset angle
		 * @return {Number} the controlOffsetAngleDegree
		 */
		getControlOffsetAngleDegree  : function() {
			return this.controlOffsetAngleDegree;
		},

		/**
		 * set offset angle degree for cubic control point
		 * @param {Number} controlOffsetAngleDegree
		 */
		setControlOffsetAngleDegree  : function( controlOffsetAngleDegree) {
			if (controlOffsetAngleDegree < 0)
				throw new Error('control offset angle must be positive');
			this.controlOffsetAngleDegree = controlOffsetAngleDegree;
		},

		/**
		 * create cubic curve segment from start to end point
		 * @return {Object} cubic curve segment
		 */
		createCubicStart2End  : function() {
			return new JenScript.SVGPath().moveTo(this.intersectionPointStart.getX(), this.intersectionPointStart.getY()).cubicTo(this.getControlPoint1().getX(), this.getControlPoint1().getY(), this.getControlPoint2().getX(), this.getControlPoint2().getY(), this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY());
		},

		/**
		 * create cubic curve segment from end to start point
		 * @return {Object} cubic curve segment
		 */
		createCubicEnd2Start  : function() {
			return new JenScript.SVGPath().moveTo(this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY()).cubicTo(this.getControlPoint1().getX(), this.getControlPoint1().getY(), this.getControlPoint2().getX(), this.getControlPoint2().getY(), this.intersectionPointStart.getX(), this.intersectionPointStart.getY());
		},

		/**
		 * create cubic curve to bind
		 */
		createPath  : function() {
			if (this.intersectionPointStart === undefined || this.intersectionPointEnd === undefined)
				return undefined;
			if (this.polarDegree >= 0 && this.polarDegree < 180) {
				if (this.direction === 'AntiClockwise') {
					this.intersectionCubicCurve = this.createCubicStart2End();
				} else if(this.direction === 'Clockwise') {
					this.intersectionCubicCurve = this.createCubicEnd2Start();
				}
			} else if (this.polarDegree >= 180 && this.polarDegree < 360) {
				if (this.direction === 'AntiClockwise') {
					this.intersectionCubicCurve = this.createCubicEnd2Start();
				} else if(this.direction === 'Clockwise') {
					this.intersectionCubicCurve = this.createCubicStart2End();
				}
			}
			return this.intersectionCubicCurve;
		},

		/**
		 * return the control point 1 according the cubic binder configuration
		 * @return {Object} control point 1
		 */
		getControlPoint1 : function() {
			if (this.direction === 'Clockwise'){
				var x = this.x1 + (this.radius + this.controlOffsetRadius) * Math.cos(JenScript.Math.toRadians(this.polarDegree) + Math.PI + JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				var y = this.y1 - (this.radius + this.controlOffsetRadius) * Math.sin(JenScript.Math.toRadians(this.polarDegree) + Math.PI + JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				return new JenScript.Point2D(x, y);
			} else if(this.direction === 'AntiClockwise'){
				var x = this.x1 + (this.radius + this.controlOffsetRadius) * Math.cos(JenScript.Math.toRadians(this.polarDegree) + Math.PI - JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				var y = this.y1 - (this.radius + this.controlOffsetRadius) * Math.sin(JenScript.Math.toRadians(this.polarDegree) + Math.PI - JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				return new JenScript.Point2D(x, y);
			}
		},

		/**
		 * return the control point 2 according the cubic binder configuration
		 * @return {Object} control point 2
		 */
		getControlPoint2 : function() {
			if (this.direction === 'Clockwise'){
				var x = this.x1 + (this.radius + this.controlOffsetRadius) * Math.cos(JenScript.Math.toRadians(this.polarDegree) + Math.PI - JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				var y = this.y1 - (this.radius + this.controlOffsetRadius) * Math.sin(JenScript.Math.toRadians(this.polarDegree) + Math.PI - JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				return new JenScript.Point2D(x, y);
			} else if(this.direction === 'AntiClockwise'){
				var x = this.x1 + (this.radius + this.controlOffsetRadius) * Math.cos(JenScript.Math.toRadians(this.polarDegree) + Math.PI + JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				var y = this.y1 - (this.radius + this.controlOffsetRadius) * Math.sin(JenScript.Math.toRadians(this.polarDegree) + Math.PI + JenScript.Math.toRadians(this.controlOffsetAngleDegree));
				return new JenScript.Point2D(x, y);
			}
		},

		/**
		 * paint cubic debug path finder
		 * @param {Object} graphics context
		 * @param {Object} gauge
		 */
		paintDebug : function(g2d,gauge) {
			
			//TODO : super block, waiting for super method impl
			var p =this.createPath();
			if(p === undefined)
				return;
			this.solveIntersectionPoints();

			var line3 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.x0,this.y0);
			g2d.insertSVG(line3.stroke(JenScript.Color.brighten(JenScript.RosePalette.CALYPSOBLUE,30).toHexString()).fillNone().toSVG());
			
			g2d.insertSVG(this.arc0.stroke('black').fillNone().toSVG());
			g2d.insertSVG(this.arc1.stroke('darkgray').fillNone().toSVG());
			
			if(this.intersectionPointStart === undefined || this.intersectionPointEnd === undefined)
				return;
			
			var line1 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.intersectionPointStart.x,this.intersectionPointStart.y);
			g2d.insertSVG(line1.stroke('yellow').fillNone().toSVG());
			
			var line2 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.intersectionPointEnd.x,this.intersectionPointEnd.y);
			g2d.insertSVG(line2.stroke('yellow').fillNone().toSVG());
			
			var i1 = new JenScript.SVGCircle().center(this.intersectionPointStart.getX(), this.intersectionPointStart.getY()).radius(4);
			var i2 = new JenScript.SVGCircle().center(this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY()).radius(4);
			
			var color = (this.direction == 'Clockwise')? 'cyan' : 'orange';
			this.drawPath(g2d, p, color);
			
			g2d.insertSVG(i1.fill(JenScript.RosePalette.LIME).toSVG());
			g2d.insertSVG(i2.fill(JenScript.RosePalette.LIME).toSVG());
			
			//this debug block
			//super.debug(g2d, gauge);

//			g2d.setColor(NanoChromatique.BLUE);
//			g2d.draw(new Ellipse2D.Double(getControlPoint1().getX() - 2, getControlPoint1().getY() - 2, 4, 4));
//			g2d.drawString("C1", (int) getControlPoint1().getX(), (int) getControlPoint1().getY());
//
//			g2d.setColor(NanoChromatique.RED);
//			g2d.draw(new Ellipse2D.Double(getControlPoint2().getX() - 2, getControlPoint2().getY() - 2, 4, 4));
//			g2d.drawString("C2", (int) getControlPoint2().getX(), (int) getControlPoint2().getY());
//
//			g2d.setColor(new Alpha(NanoChromatique.GREEN, 80));
//			g2d.draw(new Ellipse2D.Double(x1 - (r1 + controlOffsetRadius), y1 - (r1 + controlOffsetRadius), 2 * (r1 + controlOffsetRadius), 2 * (r1 + controlOffsetRadius)));
		}
	});
	
	/**
	 * Object JenScript.PathQuadAutoBinder()
	 * Auto Quadratic Path Binder for gauge metrics
	 * 
	 * @param {Object} config
	 * @param {Number} [config.controlOffsetRadius] offset radius for control points
	 * @param {Number} [config.radius] arc radius
	 * @param {Number} [config.polarRadius] polar radius
	 * @param {Number} [config.polarAngle] polar angle
	 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
	 */
	JenScript.PathQuadAutoBinder = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PathQuadAutoBinder,JenScript.AbstractPathAutoBinder);
	JenScript.Model.addMethods(JenScript.PathQuadAutoBinder,{
		
		/**
		 * Initialize Quadratic Auto Path Binder
		 * 
		 * @param {Object} config
		 * @param {Number} [config.controlOffsetRadius] offset radius for quadratic control points
		 * @param {Number} [config.radius] arc radius
		 * @param {Number} [config.polarRadius] polar radius
		 * @param {Number} [config.polarAngle] polar angle
		 * @param {String} [config.direction] path direction, Clockwise or AntiClockwise
		 */
		__init : function(config){
			config = config || {};
			/** the quadratic curve which is bind by this binder */
			this.intersectionQuadCurve;
			/** control offset radius */
			this.controlOffsetRadius = 10;
			config.name='JenScript.PathQuadAutoBinder';
			JenScript.AbstractPathAutoBinder.call(this,config);
		},
		
		/**
		 * get intersection quad curve
		 * @return {Object} intersectionQuadCurve
		 */
		getIntersectionQuadCurve : function() {
			return this.intersectionQuadCurve;
		},

		/**
		 * set intersection quad curve
		 * @param {Object} intersectionQuadCurve
		 */
		setIntersectionQuadCurve : function(intersectionQuadCurve) {
			this.intersectionQuadCurve = intersectionQuadCurve;
		},

		/**
		 * get control offset radius
		 * @return {Number} controlOffsetRadius
		 */
		getControlOffsetRadius : function() {
			return this.controlOffsetRadius;
		},

		/**
		 * set control offset radius
		 * @param {Number} controlOffsetRadius
		 */
		setControlOffsetRadius : function(controlOffsetRadius) {
			if (this.controlOffsetRadius < 0)
				throw new Error('control offset radius must be positive');
			this.controlOffsetRadius = controlOffsetRadius;
		},

		/**
		 * create quadratic segment from start to end point
		 * @return {Object} quadratic segment
		 */
		createQuadStart2End : function() {
			return new JenScript.SVGPath().moveTo(this.intersectionPointStart.getX(),this.intersectionPointStart.getY()).quadTo(this.getControlPoint().getX(), this.getControlPoint().getY(), this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY());
		},

		/**
		 * create quadratic segment from end to start point
		 * @return {Object} quadratic segment
		 */
		createQuadEnd2Start : function() {
			return new JenScript.SVGPath().moveTo(this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY()).quadTo(this.getControlPoint().getX(), this.getControlPoint().getY(), this.intersectionPointStart.getX(), this.intersectionPointStart.getY());
		},

		/**
		 * create quad path to bind
		 */
		createPath : function() {
			if (this.intersectionPointStart === undefined || this.intersectionPointEnd == undefined)
				return undefined;
			if (this.polarDegree >= 0 && this.polarDegree < 180) {
				if (this.direction === 'AntiClockwise') {
					this.intersectionQuadCurve = this.createQuadStart2End();
				} else if (this.direction == Direction.Clockwise) {
					this.intersectionQuadCurve = this.createQuadEnd2Start();
				}
			} else if (this.polarDegree >= 180 && this.polarDegree < 360) {
				if (this.direction === 'AntiClockwise') {
					this.intersectionQuadCurve = this.createQuadEnd2Start();
				} else if (this.direction == Direction.Clockwise) {
					this.intersectionQuadCurve = this.createQuadStart2End();
				}
			}
			return this.intersectionQuadCurve;
		},

		/**
		 * return the control point according the quadratic binder configuration
		 * @return {Object} control point
		 */
		getControlPoint : function() {
			var x = this.x1 + (this.radius + this.controlOffsetRadius) * Math.cos(JenScript.Math.toRadians(this.polarDegree) + Math.PI);
			var y = this.y1 - (this.radius + this.controlOffsetRadius) * Math.sin(JenScript.Math.toRadians(this.polarDegree) + Math.PI);
			return new JenScript.Point2D(x, y);
		},

		/**
		 * paint quad debug path finder
		 * @param {Object} graphics context
		 * @param {Object} gauge
		 */
		paintDebug : function(g2d,gauge) {
			//TODO : super block, waiting for super method impl
			var p =this.createPath();
			if(p === undefined)
				return;
			this.solveIntersectionPoints();

			var line3 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.x0,this.y0);
			g2d.insertSVG(line3.stroke(JenScript.Color.brighten(JenScript.RosePalette.CALYPSOBLUE,30).toHexString()).fillNone().toSVG());
			
			g2d.insertSVG(this.arc0.stroke('black').fillNone().toSVG());
			g2d.insertSVG(this.arc1.stroke('darkgray').fillNone().toSVG());
			
			if(this.intersectionPointStart === undefined || this.intersectionPointEnd === undefined)
				return;
			
			var line1 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.intersectionPointStart.x,this.intersectionPointStart.y);
			g2d.insertSVG(line1.stroke('yellow').fillNone().toSVG());
			
			var line2 = new JenScript.SVGPath().moveTo(this.x1,this.y1).lineTo(this.intersectionPointEnd.x,this.intersectionPointEnd.y);
			g2d.insertSVG(line2.stroke('yellow').fillNone().toSVG());
			
			var i1 = new JenScript.SVGCircle().center(this.intersectionPointStart.getX(), this.intersectionPointStart.getY()).radius(4);
			var i2 = new JenScript.SVGCircle().center(this.intersectionPointEnd.getX(), this.intersectionPointEnd.getY()).radius(4);
			
			var color = (this.direction == 'Clockwise')? 'cyan' : 'orange';
			this.drawPath(g2d, p, color);
			
			g2d.insertSVG(i1.fill(JenScript.RosePalette.LIME).toSVG());
			g2d.insertSVG(i2.fill(JenScript.RosePalette.LIME).toSVG());
			
			//this quad debug
//			g2d.setColor(NanoChromatique.GREEN);
//
//			g2d.draw(new Ellipse2D.Double(getControlPoint().getX() - 2, getControlPoint().getY() - 2, 4, 4));
//
//			g2d.setColor(new Alpha(NanoChromatique.GREEN, 100));
//			g2d.draw(new Ellipse2D.Double(x1 - (r1 + controlOffsetRadius), y1 - (r1 + controlOffsetRadius), 2 * (r1 + controlOffsetRadius), 2 * (r1 + controlOffsetRadius)));
		}
	});
})();