(function(){
	/**
	 * <code>UnivariateRealFunction</code>
	 * <p>
	 * An interface representing a univariate real function.
	 * </p>
	 * <p>
	 * an univariate real function computes the corresponding value for the given x value
	 * </p>
	 */
	JenScript.UnivariateRealFunction = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.UnivariateRealFunction,{
		init : function(config){
		},
		
		
		/**
	     * Compute the value for the function.
	     * 
	     * @param x
	     *            the point for which the function value should be computed
	     * @return the value
	     * @throws AnalysisException
	     *             if the function evaluation fails
	     */
		value : function(x){},
	   
	});
	
	
	/**
	 * <code>DifferentiableUnivariateRealFunction</code> representing a
	 * differentiable univariate real function.
	 * 
	 */
	JenScript.DifferentiableUnivariateRealFunction = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.DifferentiableUnivariateRealFunction,JenScript.UnivariateRealFunction);
	JenScript.Model.addMethods(JenScript.DifferentiableUnivariateRealFunction,{
		_init : function(config){
			JenScript.UnivariateRealFunction.call(this,config);
		},
		
		/**
		 * Returns the derivative of the function
		 * 
		 * @return the derivative function
		 */
		 derivative : function(){},
	});
	
	

	/**
	 * <code>UnivariateRealInterpolator</code>
	 * <p>
	 * Interface representing a univariate real interpolator
	 * </p>
	 * <p>
	 * an interpolator defines an univariate function for a given set of points
	 * </p>
	 */
	JenScript.UnivariateRealInterpolator = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.UnivariateRealInterpolator,{
		init : function(config){
		},
		
		
		 /**
	     * Computes an interpolating function for the data set.
	     * 
	     * @param xval
	     *            the arguments for the interpolation points
	     * @param yval
	     *            the values for the interpolation points
	     * @return a function which interpolates the data set
	     * @throws AnalysisException
	     *             if arguments violate assumptions made by the interpolation
	     *             algorithm
	     */
		interpolate : function(xval,yval){},
	           
	});
	
	
	/**
	 * <code>PolynomialFunction</code>
	 */
	JenScript.PolynomialFunction = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PolynomialFunction,JenScript.DifferentiableUnivariateRealFunction);
	JenScript.Model.addMethods(JenScript.PolynomialFunction,{
		__init : function(config){
			config = config || {};
			
			/**
		     * Construct a polynomial with the given coefficients. The first element of
		     * the coefficients array is the constant term. Higher degree coefficients
		     * follow in sequence. The degree of the resulting polynomial is the index
		     * of the last non-null element of the array, or 0 if all elements are null.
		     */
			
			
			/**
		     * The coefficients of the polynomial, ordered by degree -- i.e.,
		     * coefficients[0] is the constant term and coefficients[n] is the
		     * coefficient of x^n where n is the degree of the polynomial.
		     */
		    var c = config.coefficients;
		    var n = c.length;
	        if (n == 0) {
	            throw new Error("coefficients should be supplied");
	                                               
	        }
	        while (n > 1 && c[n - 1] == 0) {
	            --n;
	        }
	        
	        this.coefficients = [];
	        for (var i = 0; i < n; i++) {
	        	this.coefficients[i] = c[i];
			}
		    
		    JenScript.DifferentiableUnivariateRealFunction.call(this,config);
		},
		
		
		/**
	     * Compute the value of the function for the given argument.
	     * <p>
	     * The value returned is <br>
	     * <code>coefficients[n] * x^n + ... + coefficients[1] * x  + coefficients[0]</code>
	     * </p>
	     * 
	     * @param x
	     *            the argument for which the function value should be computed
	     * @return the value of the polynomial at the given point
	     * @see UnivariateRealFunction#value(double)
	     */
	    value : function(x) {
	        return this.evaluate(this.coefficients, x);
	    },

	    /**
	     * Returns the degree of the polynomial
	     * 
	     * @return the degree of the polynomial
	     */
		degree : function() {
	        return this.coefficients.length - 1;
	    },

	    /**
	     * Returns a copy of the coefficients array.
	     * <p>
	     * Changes made to the returned copy will not affect the coefficients of the polynomial.
	     * </p>
	     * 
	     * @return a fresh copy of the coefficients array
	     */
	    getCoefficients : function() {
	        return this.coefficients.clone();
	    },

	    /**
	     * Uses Horner's Method to evaluate the polynomial with the given
	     * coefficients at the argument.
	     * 
	     * @param coefficients
	     *            the coefficients of the polynomial to evaluate
	     * @param argument
	     *            the input value
	     * @return the value of the polynomial
	     * @throws NullPointerException
	     *             if coefficients is null
	     */
	   evaluate : function(coefficients,argument) {
	        var n = coefficients.length;
	        if (n == 0) {
	            throw new Error("coefficients should be supplied");
	        }
	        var result = coefficients[n - 1];
	        for (var j = n - 2; j >= 0; j--) {
	            result = argument * result + coefficients[j];
	        }
	        return result;
	    },

	    /**
	     * Add a polynomial to the instance.
	     * 
	     * @param p
	     *            polynomial to add
	     * @return a new polynomial which is the sum of the instance and p
	     */
	    add :function(p) {

	        // identify the lowest degree polynomial
	        var lowLength = this.min(this.coefficients.length, p.coefficients.length);
	        var highLength = this.max(this.coefficients.length, p.coefficients.length);

	        // build the coefficients array
	        //var newCoefficients =[highLength];
	        var newCoefficients =[];
	        for (var i = 0; i < lowLength; ++i) {
	            newCoefficients[i] = this.coefficients[i] + p.coefficients[i];
	        }
	        
	        if(coefficients.length < p.coefficients.length){
	        	for (var i = lowLength; i < highLength - lowLength; i++) {
	        		var coef = p.coefficients[i];
	        		newCoefficients[newCoefficients.length] = coef;
				}
	        }else{
	        	for (var i = lowLength; i < highLength - lowLength; i++) {
	        		var coef = this.coefficients[i];
	        		newCoefficients[newCoefficients.length] = coef;
				}
	        }

	        return new JenScript.PolynomialFunction(newCoefficients);
	    },
	    
	    /**
	     * Subtract a polynomial from the instance.
	     * 
	     * @param p
	     *            polynomial to subtract
	     * @return a new polynomial which is the difference the instance minus p
	     */
	    subtract : function(p) {

	        // identify the lowest degree polynomial
	        var lowLength = this.min(this.coefficients.length, p.coefficients.length);
	        var highLength = this.max(this.coefficients.length, p.coefficients.length);

	        // build the coefficients array
	        var newCoefficients = [];
	        for (var i = 0; i < lowLength; ++i) {
	            newCoefficients[i] = this.coefficients[i] - p.coefficients[i];
	        }
	        if (this.coefficients.length < p.coefficients.length) {
	            for (var i = lowLength; i < highLength; ++i) {
	                newCoefficients[i] = -p.coefficients[i];
	            }
	        }
	        else {
	        	
	        	for (var i = lowLength; i < highLength - lowLength; i++) {
	        		var coef = this.coefficients[i];
	        		newCoefficients[newCoefficients.length] = coef;
				}
	        }

	        return new JenScript.PolynomialFunction(newCoefficients);
	    },
	    
	    /**
	     * Negate the instance.
	     * 
	     * @return a new polynomial
	     */
	    negate : function() {
	        var newCoefficients = [];
	        for (var i = 0; i < this.coefficients.length; ++i) {
	            newCoefficients[i] = -this.coefficients[i];
	        }
	        return new JenScript.PolynomialFunction(newCoefficients);
	    },

	    /**
	     * Multiply the instance by a polynomial.
	     * 
	     * @param p
	     *            polynomial to multiply by
	     * @return a new polynomial
	     */
	    multiply : function(p) {
	    	var newCoefficients = [];
	        for (var i = 0; i < (this.coefficients.length + p.coefficients.length - 1); ++i) {
	            newCoefficients[i] = 0.0;
	            for (var j = this.max(0, i + 1 - p.coefficients.length); j < this.min(this.coefficients.length, i + 1); ++j) {
	                newCoefficients[i] += this.coefficients[j] * p.coefficients[i - j];
	            }
	        }
	        return new JenScript.PolynomialFunction(newCoefficients);
	    },

	    /**
	     * Returns the coefficients of the derivative of the polynomial with the
	     * given coefficients.
	     * 
	     * @param coefficients
	     *            the coefficients of the polynomial to differentiate
	     * @return the coefficients of the derivative or null if coefficients has
	     *         length 1.
	     * @throws NullPointerException
	     *             if coefficients is null
	     */
	   differentiate : function(coefficients) {
	        var n = coefficients.length;
	        if (n == 0) {
	            throw new Error("coefficients should be supplied");
	        }
	        if (n == 1) {
	            return [0];
	        }
	        var result = [];
	        for (var i = n - 1; i > 0; i--) {
	            result[i - 1] = i * this.coefficients[i];
	        }
	        return result;
	    },

	    /**
	     * Returns the derivative as a PolynomialRealFunction
	     * 
	     * @return the derivative polynomial
	     */
	   polynomialDerivative : function() {
	        return new JenScript.PolynomialFunction({coefficients: this.differentiate(this.coefficients)});
	    },

	    /**
	     * Returns the derivative as a UnivariateRealFunction
	     * 
	     * @return the derivative function
	     */
	    derivative : function() {
	        return this.polynomialDerivative();
	    },
	    
	    
	    /**
	     * Compute the minimum of two values
	     * 
	     * @param a
	     *            first value
	     * @param b
	     *            second value
	     * @return a if a is lesser or equal to b, b otherwise
	     */
	    min : function(a,b) {
	        return a <= b ? a : b;
	    },


	    /**
	     * Compute the maximum of two values
	     * 
	     * @param a
	     *            first value
	     * @param b
	     *            second value
	     * @return b if a is lesser or equal to b, a otherwise
	     */
	    max : function(a,b) {
	        return a <= b ? b : a;
	    },


	    /**
	     * Absolute value.
	     * 
	     * @param x
	     *            number from which absolute value is requested
	     * @return abs(x)
	     */
	    abs : function(x) {
	        return x < 0.0 ? -x : x == 0.0 ? 0.0 : x; // -0.0 => +0.0
	    },
	    

	    toString : function() {
	    	return 'JenScript.PolynomialFunction';
	    }
	});
	
	
	/**
	 * <code>PolynomialSplineFunction</code>
	 * Represents a polynomial spline function.
	 * <p>
	 * A <strong>polynomial spline function</strong> consists of a set of <i>interpolating polynomials</i> and an ascending
	 * array of domain <i>knot points</i>, determining the intervals over which the spline function is defined by the
	 * constituent polynomials. The polynomials are assumed to have been computed to match the values of another function at
	 * the knot points. The value consistency constraints are not currently enforced by
	 * <code>PolynomialSplineFunction</code> itself, but are assumed to hold among the polynomials and knot points passed to
	 * the constructor.
	 * </p>
	 * <p>
	 * N.B.: The polynomials in the <code>polynomials</code> property must be centered on the knot points to compute the
	 * spline function values. See below.
	 * </p>
	 * <p>
	 * The domain of the polynomial spline function is <code>[smallest knot, largest knot]</code>. Attempts to evaluate the
	 * function at values outside of this range generate IllegalArgumentExceptions.
	 * </p>
	 * <p>
	 * The value of the polynomial spline function for an argument <code>x</code> is computed as follows:
	 * <ol>
	 * <li>The knot array is searched to find the segment to which <code>x</code> belongs. If <code>x</code> is less than
	 * the smallest knot point or greater than the largest one, an <code>IllegalArgumentException</code> is thrown.</li>
	 * <li>Let <code>j</code> be the index of the largest knot point that is less than or equal to <code>x</code>. The value
	 * returned is <br>
	 * <code>polynomials[j](x - knot[j])</code></li>
	 * </ol>
	 * </p>
	 */
	JenScript.PolynomialSplineFunction = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PolynomialSplineFunction,JenScript.DifferentiableUnivariateRealFunction);
	JenScript.Model.addMethods(JenScript.PolynomialSplineFunction,{
		__init : function(config){
			config = config || {};
			
			/**
		     * Construct a polynomial spline function with the given segment delimiters
		     * and interpolating polynomials.
		     * <p>
		     * The constructor copies both arrays and assigns the copies to the knots and polynomials properties, respectively.
		     * </p>
		     * 
		     * @param knots
		     *            spline segment interval delimiters
		     * @param polynomials
		     *            polynomial functions that make up the spline
		     * @throws NullPointerException
		     *             if either of the input arrays is null
		     * @throws IllegalArgumentException
		     *             if knots has length less than 2, <code>polynomials.length != knots.length - 1 </code>, or the
		     *             knots array is not strictly increasing.
		     */
			
			 /** Spline segment interval delimiters (knots). Size is n+1 for n segments. */
			this.knots = [];

		    /**
		     * The polynomial functions that make up the spline. The first element
		     * determines the value of the spline over the first subinterval, the second
		     * over the second, etc. Spline function values are determined by evaluating
		     * these functions at <code>(x - knot[i])</code> where i is the knot segment
		     * to which x belongs.
		     */
			this.polynomials = [];

		    /**
		     * Number of spline segments = number of polynomials = number of partition
		     * points - 1
		     */
			this.n;
			
			
			this.knots = config.knots;
			this.polynomials = config.polynomials;
			if (this.knots.length < 2) {
		        throw new Error("spline partition must have at least 2 points");
	        }
	        if (this.knots.length - 1 != this.polynomials.length) {
	            throw new Error("number of polynomial interpolants must match the number of segments");
	                                               
	        }
	        if (!this.isStrictlyIncreasing(this.knots)) {
	            throw new Error("knot values must be strictly increasing");
	        }

	        this.n = this.knots.length - 1;
		},
		
		binarySearch : function(a,key){
			 	var low = 0;
		        var high = a.length - 1;

		        while (low <= high) {
		            var mid = (low + high) >>> 1;
		            var midVal = a[mid];

		            if (midVal < key)
		                low = mid + 1;
		            else if (midVal > key)
		                high = mid - 1;
		            else
		                return mid; // key found
		        }
		        return -(low + 1);  // key not found.
		},
		
		/**
	     * Compute the value for the function. See {@link PolynomialSplineFunction} for details on the algorithm for
	     * computing the value of the function.</p>
	     * 
	     * @param v
	     *            the point for which the function value should be computed
	     * @returns the value
	     */
	    value : function(v) {
	        if (v < this.knots[0] || v > this.knots[this.n]) {
	            throw new Error("value "+v+" is outside function domain.");
	        }
	        var i = this.binarySearch(this.knots,v);
	        if (i < 0) {
	            i = -i - 2;
	        }
	        // This will handle the case where v is the last knot value
	        // There are only n-1 polynomials, so if v is the last knot
	        // then we will use the last polynomial to calculate the value.
	        if (i >= this.polynomials.length) {
	            i--;
	        }
	        return this.polynomials[i].value(v - this.knots[i]);
	    },

	    /**
	     * Returns the derivative of the polynomial spline function as a
	     * UnivariateRealFunction
	     * 
	     * @return the derivative function
	     */
	   
	    derivative : function() {
	        return this.polynomialSplineDerivative();
	    },

	    /**
	     * Returns the derivative of the polynomial spline function as a
	     * PolynomialSplineFunction
	     * 
	     * @return the derivative function
	     */
	    polynomialSplineDerivative : function() {
	        var derivativePolynomials = [];
	        for (var i = 0; i < this.n; i++) {
	            derivativePolynomials[i] = this.polynomials[i].polynomialDerivative();
	        }
	        return new JenScript.PolynomialSplineFunction({knots : knots, polynomials :  derivativePolynomials});
	    },

	    /**
	     * Returns the number of spline segments = the number of polynomials = the
	     * number of knot points - 1.
	     * 
	     * @return the number of spline segments
	     */
	    getN : function() {
	        return this.n;
	    },

	    /**
	     * Returns a copy of the interpolating polynomials array.
	     * <p>
	     * Returns a fresh copy of the array. Changes made to the copy will not affect the polynomials property.
	     * </p>
	     * 
	     * @return the interpolating polynomials
	     */
	    getPolynomials : function() {
	        var p = [];
	        for (var i = 0; i < this.polynomials.length; i++) {
				p[i] = this.polynomials[i];
			}
	        return p;
	    },

	    /**
	     * Returns an array copy of the knot points.
	     * <p>
	     * Returns a fresh copy of the array. Changes made to the copy will not affect the knots property.
	     * </p>
	     * 
	     * @return the knot points
	     */
	    getKnots : function() {
	        var out = [];
	        for (var i = 0; i < this.knots.length; i++) {
				out[i] = this.knots[i];
			}
	        return out;
	    },

	    /**
	     * Determines if the given array is ordered in a strictly increasing
	     * fashion.
	     * 
	     * @param x
	     *            the array to examine.
	     * @return <code>true</code> if the elements in <code>x</code> are ordered
	     *         in a stricly increasing manner. <code>false</code>, otherwise.
	     */
	    isStrictlyIncreasing : function(x) {
	        for (var i = 1; i < x.length; ++i) {
	            if (x[i - 1] >= x[i]) {
	                return false;
	            }
	        }
	        return true;
	    }
		
	});
	
	
	
	/**
	 * <code>SplineInterpolator</code>
	 * Computes a natural (also known as "free", "unclamped") cubic spline
	 * interpolation for the data set.
	 * <p>
	 * The interpolate(number[], number[]) method returns a
	 * PolynomialSplineFunction consisting of n cubic polynomials, defined
	 * over the subintervals determined by the x values, x[0] < x[i] ... < x[n]. The
	 * x values are referred to as "knot points."
	 * </p>
	 * <p>
	 * The value of the PolynomialSplineFunction at a point x that is greater than
	 * or equal to the smallest knot point and strictly less than the largest knot
	 * point is computed by finding the subinterval to which x belongs and computing
	 * the value of the corresponding polynomial at <code>x - x[i] </code> where
	 * <code>i</code> is the index of the subinterval. See
	 *  PolynomialSplineFunction for more details.
	 * </p>
	 * <p>
	 * The interpolating polynomials satisfy:
	 * <ol>
	 * <li>The value of the PolynomialSplineFunction at each of the input x values
	 * equals the corresponding y value.</li>
	 * <li>Adjacent polynomials are equal through two derivatives at the knot points
	 * (i.e., adjacent polynomials "match up" at the knot points, as do their first
	 * and second derivatives).</li>
	 * </ol>
	 * </p>
	 * <p>
	 * The cubic spline interpolation algorithm implemented is as described in R.L.
	 * Burden, J.D. Faires, <u>Numerical Analysis</u>, 4th Ed., 1989, PWS-Kent, ISBN
	 * 0-53491-585-X, pp 126-131.
	 * </p>
	 */
	JenScript.SplineInterpolator = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SplineInterpolator,JenScript.UnivariateRealInterpolator);
	JenScript.Model.addMethods(JenScript.SplineInterpolator,{
		_init : function(config){
			config = config || {};
		},
		
		/**
		 * Computes an interpolating function for the data set.
		 * 
		 * @param x
		 *            the arguments for the interpolation points
		 * @param y
		 *            the values for the interpolation points
		 * @return a function which interpolates the data set
		 */
		interpolate : function(x,y) {
			if (x.length != y.length) {
				throw new Error("x and y array values dimensions mismatch");
			}

			if (x.length < 3) {
				throw new Error("the number of points must be greater than 3");
			}

			// Number of intervals. The number of data points is n + 1.
			var n = x.length - 1;

			this.checkOrder(x, 'INCREASING', true);

			var h = [];
			for (var i = 0; i < n; i++) {
				h[i] = x[i + 1] - x[i];
			}


			var mu = [];
			var z = [] ;
			mu[0] = 0;
			z[0] = 0;
			var g = 0;
			for (var i = 1; i < n; i++) {
				g = 2 * (x[i + 1] - x[i - 1]) - h[i - 1] * mu[i - 1];
				mu[i] = h[i] / g;
				z[i] = (3 * (y[i + 1] * h[i - 1] - y[i] * (x[i + 1] - x[i - 1]) + y[i - 1] * h[i]) / (h[i - 1] * h[i]) - h[i - 1] * z[i - 1]) / g;
			}

			// cubic spline coefficients -- b is linear, c quadratic, d is cubic
			// (original y's are constants)
			var b = [];
			var c = [];
			var d = [];
			
			z[n] = 0;
			c[n] = 0;

			for (var j = n - 1; j >= 0; j--) {
				c[j] = z[j] - mu[j] * c[j + 1];
				b[j] = (y[j + 1] - y[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3;
				d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
			}

			var polynomials = [];
			var coefficients = [];
			for (var i = 0; i < n; i++) {
				coefficients[0] = y[i];
				coefficients[1] = b[i];
				coefficients[2] = c[i];
				coefficients[3] = d[i];
				polynomials[i] = new JenScript.PolynomialFunction({coefficients : coefficients});
			}
			
			return new JenScript.PolynomialSplineFunction({knots : x, polynomials : polynomials});
		},


		/**
		 * Checks that the given array is sorted.
		 * 
		 * @param val
		 *            Values.
		 * @param dir
		 *            Ordering direction.
		 * @param strict
		 *            Whether the order should be strict.
		 */
		checkOrder : function(val,dir,strict) {
			var previous = val[0];
			var ok = true;

			var max = val.length;
			for (var i = 1; i < max; i++) {
				switch (dir) {
				case 'INCREASING':
					if (strict) {
						if (val[i] <= previous) {
							ok = false;
						}
					} else {
						if (val[i] < previous) {
							ok = false;
						}
					}
					break;
				case 'DECREASING':
					if (strict) {
						if (val[i] >= previous) {
							ok = false;
						}
					} else {
						if (val[i] > previous) {
							ok = false;
						}
					}
					break;
				default:
					// Should never happen.
					throw new Error("checkOrder error");
				}

				if (!ok) {
					throw new Error("Spline interpolator can not be used with values which are not order");
				}
				previous = val[i];
			}
		}
		
	});
})();