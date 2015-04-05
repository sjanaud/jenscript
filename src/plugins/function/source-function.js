(function(){
	/***
	 * SOURCE FUNCTION
	 */
	JenScript.AbstractSourceFunction = function(config){
		//JenScript.AbstractSourceFunction
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractSourceFunction,{
		init : function(config){
			config = config || {};
			/** the function that hosts this source function */
			this.hostFunction;
			/** source id */
			this.id;
			/** source name */
			this.name;
			/** function x or function y nature */
			this.nature = (config.nature !== undefined)?new JenScript.FunctionNature(config.nature): new JenScript.FunctionNature('x');
			/** current solved source for the current projection */
			this.currentFunction = undefined;
		},
		
		/**
		 * clear current function
		 */
		clearCurrentFunction : function(){
			this.currentFunction = [];
		},

		/**
		 * get the current solved function
		 * @returns solved function
		 */
		getCurrentFunction : function() {
			if(this.currentFunction === undefined || this.currentFunction.length === 0){
				var proj = this.getHostFunction().getProjection();
				if(this.getNature().isXFunction()){
					this.currentFunction = this.solveFunction(proj.getMinX(), proj.getMaxX());
				}
				else if(this.getNature().isYFunction()){
					this.currentFunction = this.solveFunction(proj.getMinY(), proj.getMaxY());
				}			
			}
			return this.currentFunction;
		},


		/**
		 * solve the function on the given interval. this abstract method is called
		 * by getCurrentFunction if current function is null or empty
		 * @param start the range start to evaluate function
		 * @param end the range end to evaluate function
		 * 
		 */
		solveFunction : function(start,end){throw new Error('SourceFunction Error, solveFunction method should be provided.');},

		
		/**
		 * evaluate the function at teh given point value
		 * @param value the x or y value according to function nature
		 */
		evaluate : function(value){},

		/**
		 * @return the host function
		 */
		getHostFunction : function() {
			return this.hostFunction;
		},

		/**
		 * @param hostFunction
		 *            the host function to set
		 */
		setHostFunction : function(hostFunction) {
			this.hostFunction = hostFunction;
		},

		/**
		 * @return the source id
		 */
		getId : function() {
			return this.id;
		},

		/**
		 * @param id
		 *            the source id to set
		 */
		setId : function(id) {
			this.id = id;
		},

		/**
		 * @return the source name
		 */
		getName : function() {
			return this.name;
		},

		/**
		 * @param name
		 *            the source name to set
		 */
		setName : function(name) {
			this.name = name;
		},

		/**
		 * @return the source nature
		 */
		getNature : function() {
			return this.nature;
		},

		/**
		 * @param nature
		 *            the source nature to set
		 */
		setNature : function(nature) {
			this.nature = nature;
		}
	});
	
	
	
	/***
	 * USER SOURCE FUNCTION
	 */
	JenScript.UserSourceFunction = function(config){
		//JenScript.UserSourceFunction
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.UserSourceFunction,JenScript.AbstractSourceFunction);
	JenScript.Model.addMethods(JenScript.UserSourceFunction,{
		_init : function(config){
			config = config || {};
			JenScript.AbstractSourceFunction.call(this,config);
		},
	});
	
	

	/***
	 * LINE SOURCE FUNCTION
	 */
	JenScript.LineSource = function(config){
		//JenScript.LineSource
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LineSource,JenScript.UserSourceFunction);
	JenScript.Model.addMethods(JenScript.LineSource,{
		__init : function(config){
			config = config || {};
			/** source x,y values*/
			this.xValues = config.xValues;
			this.yValues = config.yValues;
			/** source */
			this.source = this.createPointsFromArray(this.xValues,this.yValues);
			JenScript.UserSourceFunction.call(this,config);
		},
		
		/**
		 * create list of points from x and y arrays.
		 * 
		 * @param xValues
		 * @param yValues
		 * @return list of points
		 */
		createPointsFromArray : function(xValues,yValues) {
			//console.log('createPointsFromArray');
			if (xValues.length !== yValues.length) {
				throw new Error(" x and y  array values length does not match");
			}
			var source = [];
			for (var i = 0; i < xValues.length; i++) {
				source[source.length] = new JenScript.Point2D(xValues[i], yValues[i]);
			}
			return source;
		},
		
		/**
		 * set original source of this function
		 * 
		 * @param source
		 *            the source to set
		 */
		setSource : function(source) {
			this.source = source;
			this.clearCurrentFunction();
			this.sortFunction();
		},

		/**
		 * @return the original source of this function
		 */
		getSource : function() {
			return this.source;
		},

		/**
		 * solve the line function on the given range interval
		 */
		solveFunction : function(start,end) {
			var newFunction = [];
			var source = this.getSource();
			if(this.getNature().isXFunction()){
				for (var i = 0; i < source.length; i++) {
					var p = source[i];
					if (p.x >= start && p.x <= end) {
						newFunction[newFunction.length] = p;
					}
				}
			} else if(this.getNature().isYFunction()){
				for (var i = 0; i < source.length; i++) {
					var p = source[i];
					if (p.y >= start && p.y <= end) {
						newFunction[newFunction.length] = p;
					}
				}
			}

			if (newFunction.length >= 1) {
				var previous = undefined;
				var next = undefined;
				if (this.getNature().isXFunction()) {
					previous = this.previous(newFunction[0].x);
					next = this.next(newFunction[newFunction.length - 1].x);

				} else if (this.getNature().isYFunction()) {
					previous = this.previous(newFunction[0].y);
					next = this.next(newFunction[newFunction.length - 1].y);
				}
				//console.log("previous:"+previous);
				//console.log("next    :"+next);
				if (previous != undefined && !previous.equals(newFunction[0])) {
					var c = [previous].concat(newFunction);
					newFunction = c;
					
				}
				if (next != undefined && !next.equals(newFunction[newFunction.length - 1])) {
					newFunction[newFunction.length]=next;
				}
			} else {
				var previous = this.previous(start);
				var next = this.next(end);

				if (previous != undefined) {
					var c = [previous].concat(newFunction);
					newFunction = c;
				}
				if (next != null) {
					newFunction[newFunction.length]=next;
				}
			}
			return newFunction;
		},

		/**
		 * get next source point greater than the given value
		 * @param value
		 */
		next : function(value) {
			var functionPoints = this.getSource();
			for (var i = 0; i < functionPoints.length; i++) {
				//console.log('iter for next point:'+i);
				var p = functionPoints[i];
				if(this.getNature().isXFunction()){
					if (p.x > value) {
						return new JenScript.Point2D(p.x, p.y);
					}
				} else 	if(this.getNature().isYFunction()){
					if (p.y > value) {
						return new JenScript.Point2D(p.x, p.y);
					}
				}
			}
			return undefined;
		},

		/**
		 * get previous source point lesser than the given value
		 * @param value
		 */
		previous : function(value) {
			var functionPoints = this.getSource();
			for (var i = functionPoints.length - 1; i >= 0; i--) {
				//console.log('iter for previous point:'+i);
				var p = functionPoints[i];
				if(this.getNature().isXFunction()){
					if (p.x < value) {
						return new JenScript.Point2D(p.x, p.y);
					}
				} 
				else if(this.getNature().isYFunction()){
					if (p.y < value) {
						return new JenScript.Point2D(p.x, p.y);
					}
				}
			}
			return undefined;
		},

		/**
		 * evaluate line function at the given value
		 * @param value
		 */
		evaluate  : function(value) {
			var previous = this.previous(value);
			var next = this.next(value);
			if (previous != undefined && next != undefined) {
				var coefficient = 0;
				var constant = 0;
				if(this.getNature().isXFunction()){
					coefficient = (next.getY() - previous.getY()) / (next.getX() - previous.getX());
					constant = previous.getY() - coefficient * previous.getX();
					return new JenScript.Point2D(value, coefficient * value + constant);
				} else 	if(this.getNature().isYFunction()){
					coefficient = (next.getX() - previous.getX()) / (next.getY() - previous.getY());
					constant = previous.getX() - coefficient * previous.getY();
					return new JenScript.Point2D(coefficient * value + constant, value);
				}
			} else {
				return undefined;
			}
		},
		
		sortFunction : function(){
			var that = this;
			this.getSource().sort(function(p2d1,p2d2){
				if(that.getNature().isXFunction()){
					if (p2d1.x > p2d2.x) {
						return 1;
					} else if (p2d1.x < p2d2.x) {
						return -1;
					}
					return 0;
				} else 	if(that.getNature().isYFunction()){
					if (p2d1.y > p2d2.y) {
						return 1;
					} else if (p2d1.y < p2d2.y) {
						return -1;
					}
					return 0;
				}
			});
		}
	});
	
	
	/***
	 * SPLINE SOURCE FUNCTION
	 */
	JenScript.SplineSource = function(config){
		//JenScript.SplineSource
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SplineSource,JenScript.LineSource);
	JenScript.Model.addMethods(JenScript.SplineSource,{
		___init : function(config){
			config = config || {};
			/**delta step increment*/
			this.delta=config.delta;
			/**evaluate spline function*/
			this.evaluateFunction = undefined;
			/** source */
			JenScript.LineSource.call(this,config);
		},
		
		setSource : function(source) {
			this.source = source;
			this.clearCurrentFunction();
			this.sortFunction();
			this.evaluateFunction = undefined;
		},

		evaluate : function(value) {
			if (this.evaluateFunction === undefined) {
				this.createInterpolateFunction();
			}
			var evaluatePoint = undefined;
			try {
				if(this.getNature().isXFunction()){
					evaluatePoint = new JenScript.Point2D(value,this.evaluateFunction.value(value));
				} else 	if(this.getNature().isYFunction()){
					evaluatePoint = new Point2D.Double(this.evaluateFunction.value(value),value);
				}
			} catch (err) {
				console.log(err);
			}
			return evaluatePoint;
		},

		solveFunction : function(start,end) {
			this.sortFunction();
			var interpolateSource = [];
			var superSource = this.getSource();

			if (this.evaluateFunction === undefined) {
				this.createInterpolateFunction();
			}
			if (this.evaluateFunction === undefined) {
				return this.getSource();
			}
			var pd2Min = superSource[0];
			var pd2Max = superSource[superSource.length - 1];
			if(this.getNature().isXFunction()){
				for (var x = pd2Min.x; x <= pd2Max.x; x = x + this.delta) {
					try {
						if (x > pd2Min.x && x < pd2Max.x) {
							interpolateSource[interpolateSource.length] = new JenScript.Point2D(x, this.evaluateFunction.value(x));
						}
					} catch (err) {
						console.log(err);
						return this.getSource();
					}
				}
			} else 	if(this.getNature().isYFunction()){
				for (var y = pd2Min.y; y <= pd2Max.y; y = y + this.delta) {
					try {
						if (y > pd2Min.y && y < pd2Max.y) {
							interpolateSource[interpolateSource.length] = new JenScript.Point2D(this.evaluateFunction.value(y), y);
						}
					} catch (err) {
						console.log(err);
						return this.getSource();
					}
				}
			}

			return interpolateSource;
		},

		/**
		 * create interpolate function for given source.
		 */
		createInterpolateFunction : function() {
			try {
				var superSource = this.getSource();
				var len = superSource.length;
				var xValues = [];
				var yValues =  [];
				for (var i = 0; i < len; i++) {
					var p2dUser = superSource[i];
					xValues[i] = p2dUser.x;
					yValues[i] = p2dUser.y;
				}
				var interpolator = new JenScript.SplineInterpolator();
				if(this.getNature().isXFunction()){
					this.evaluateFunction = interpolator.interpolate(xValues, yValues);
				} else 	if(this.getNature().isYFunction()){
					this.evaluateFunction = interpolator.interpolate(yValues, xValues);
				}
			} catch (err) {
				console.log(err);
			}
		}

	});
})();