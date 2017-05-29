// JenScript -  JavaScript HTML5/SVG Library
// version : 1.3.1
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-05-29
// All Rights reserved

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
(function(){
	JenScript.FunctionNature = function(nature){
		this.nature = nature;
		
		this.isXFunction = function (){
			if(this.nature === undefined)
				return false;
			if(this.nature instanceof JenScript.FunctionNature){
				return this.nature.isXFunction();
			}
			if(this.nature.toLowerCase() === 'xfunction' || this.nature.toLowerCase() === 'x')
				return true;
			return false;
		};
		
		this.isYFunction = function (){
			if(this.nature === undefined)
				return false;
			if(this.nature instanceof JenScript.FunctionNature){
				return this.nature.isYFunction();
			}
			if(this.nature.toLowerCase() === 'yfunction' || this.nature.toLowerCase() === 'y')
				return true;
			return false;
		};
		
		this.toString = function(){
			if(this.isXFunction())
				return 'x';
			if(this.isYFunction())
				return 'y';
			return 'undefined nature';
		};
	};
})();
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
						if (x >= pd2Min.x && x <= pd2Max.x) {
							interpolateSource[interpolateSource.length] = new JenScript.Point2D(x, this.evaluateFunction.value(x));
						}
					} catch (err) {
						//console.log(err);
						return this.getSource();
					}
				}
			} else 	if(this.getNature().isYFunction()){
				for (var y = pd2Min.y; y <= pd2Max.y; y = y + this.delta) {
					try {
						if (y >= pd2Min.y && y <= pd2Max.y) {
							interpolateSource[interpolateSource.length] = new JenScript.Point2D(this.evaluateFunction.value(y), y);
						}
					} catch (err) {
						//console.log(err);
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
(function(){
	

	/***
	 * Abstract Path function
	 */
	JenScript.AbstractPathFunction = function(config){
		//JenScript.AbstractPathFunction
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractPathFunction,{
		init : function(config){
			config = config || {};
			this.name = (config.name !== undefined)? config.name :'Abstract Path Function';
			this.themeColor=(config.themeColor !== undefined)? config.themeColor:'red';
			this.strokeWidth=(config.strokeWidth !== undefined)? config.strokeWidth:1;
		    /** source function */
		    this.source= config.source;
		    //this.source.hostFunction = this;
			this.hostPlugin;
			this.Id = 'pathfunction'+JenScript.sequenceId++;
			/** the geometry path */
			this.geometryPath;
			/** length of path in the device space */
			this.lengthPathDevice;
			/** input metrics registered for this path */
			this.metrics = [];
			this.segments = [];
			this.pathSegments = [];
			this.graphicsContext;
		},
		
		/**
		 * get the projection
		 * @returns projection
		 */
		getProjection : function() {
			return this.hostPlugin.getProjection();
		},

		
		/**
		 * get the function host plugin
		 * @returns hostPlugin
		 */
		getHostPlugin : function() {
			return this.hostPlugin;
		},

		/**
		 * set the function host plugin
		 * @param hostPlugin
		 */
		setHostPlugin : function(hostPlugin) {
			this.hostPlugin = hostPlugin;
		},
		
	    /**
	     * @return the themeColor
	     */
	    getThemeColor : function() {
	        return this.themeColor;
	    },

	    /**
	     * @param themeColor
	     *            the themeColor to set
	     */
	    setThemeColor : function(themeColor) {
	        this.themeColor = themeColor;
	    },

	    /**
	     * get function name
	     * 
	     * @return the name
	     */
	    getName : function() {
	        return this.name;
	    },

	    /**
	     * set function name
	     * 
	     * @param name
	     *            the name to set
	     */
	    setName : function(name) {
	        this.name = name;
	    },
		
		
		/**
		 * set the source function
		 * 
		 * @param source
		 */
		setSource : function(source) {
			this.source = source;
			this.source.hostFunction = this;
		},
		
		
		/**
		 * return the min peak of the current function
		 * @returns minimum peak
		 */
		minFunction : function() {
			var currentFunction = this.source.getCurrentFunction();
			var minFunction = currentFunction[0];
			if (this.source.getNature().isXFunction()) {
				for (var i = 0; i < currentFunction.length; i++) {
					var p = currentFunction[i];
					if (p.getY() < minFunction.getY()) {
						minFunction = p;
					}
				}
			}
			if (this.source.getNature().isYFunction()) {
				for (var i = 0; i < currentFunction.length; i++) {
					var p = currentFunction[i];
					if (p.getX() < minFunction.getX()) {
						minFunction = p;
					}
				}
			}
			return minFunction;
		},
		
		/**
		 * return the max peak of the current function
		 * @returns minimum peak
		 */
		maxFunction : function() {
			var currentFunction = this.source.getCurrentFunction();
			var maxFunction = currentFunction[0];
			if (this.source.getNature().isXFunction()) {
				for (var i = 0; i < currentFunction.length; i++) {
					var p = currentFunction[i];
					if (p.getY() > maxFunction.getY()) {
						maxFunction = p;
					}
				}
			}
			if (this.source.getNature().isYFunction()) {
				for (var i = 0; i < currentFunction.length; i++) {
					var p = currentFunction[i];
					if (p.getX() > maxFunction.getX()) {
						maxFunction = p;
					}
				}
			}
			return maxFunction;
		},
		
		
		/**
		 * scale the manager between two space and assign delegate super geometry
		 * path for all method that have to use geometry.
		 */
		createPath : function() {
			this.svgPathElement = new JenScript.SVGElement().attr('id',this.Id).name('path').attr('stroke','none').attr('fill','none').attr('d',this.buildPath()).buildHTML();
			this.geometryPath = new JenScript.GeometryPath(this.svgPathElement);
			this.lengthPathDevice = this.geometryPath.lengthOfPath();
			return this.svgPathElement;
		},

		/**
		 * add pre initialized metric {@link GlyphMetric} to this general path.
		 * @param metric
		 */
		addMetric : function(metric) {
			this.metrics[this.metrics.length]= metric;
			if(this.hostPlugin !== undefined)
			this.hostPlugin.repaintPlugin();
		},

		/**
		 * clear metrics
		 */
		clearMetric : function() {
			this.metrics = [];
		},
		
		/**
		 * get metrics on this path
		 */
		getMetrics : function(){
			this.createPath();
			
			var pp = new JenScript.SVGElement().attr('id',(this.Id+'_path')).name('path').attr('stroke','none').attr('fill','none').attr('d',this.buildPath()).buildHTML();
			this.graphicsContext.deleteGraphicsElement((this.Id+'_path'));
			this.graphicsContext.definesSVG(pp);
			if(this.svgPathElement === undefined)
				return;
			
			if (this.geometryPath.lengthOfPath() === 0) {
				return [];
			}
			for (var i = 0; i < this.metrics.length; i++) {
				var m = this.metrics[i];
				var proj = this.getProjection();
				if (this.source.getNature().isXFunction()) {
					if (m.getValue() < proj.getMinX() || m.getValue() > proj.getMaxX()) {
						return;
					}
				}else if (this.source.getNature().isYFunction()) {
					if (m.getValue() < proj.getMinY() || m.getValue() > proj.getMaxY()) {
						return;
					}
				}
				
				
				
				
				var userVal = m.getValue(); //x or y according to function nature
				var pathSegment = this.getPathSegment(userVal);
				if(pathSegment === undefined)
					continue;
				var userPoint = pathSegment.getUserPoint(userVal);
				
				var devicePointX = function(){
					return proj.userToPixelX(userPoint.x);
				};
				var devicePointY = function(){
						return proj.userToPixelY(userPoint.y);
				};
				
				var baseLength = this.getLengthAtSegment(pathSegment);
				var p0 = this.geometryPath.pointAtLength(this.getLengthAtSegment(pathSegment));
				//var recUserPoint0 = new JenScript.SVGRect().origin(p0.x,p0.y).size(3,3).fill('yellow');
				//this.graphicsContext.insertSVG(recUserPoint0.toSVG());
				
				var X = Math.pow((p0.x-devicePointX()),2);
				var Y = Math.pow((p0.y-devicePointY()),2);
				var distDelta= Math.sqrt(X + Y);
				
				//ortho right point
				//var r3 = m.getOrthoRightPoint(0,15);
				var recUserPoint = new JenScript.SVGRect().origin(devicePointX(),devicePointY()).size(3,3).fill('pink');
				this.graphicsContext.insertSVG(recUserPoint.toSVG());
				
				var deviceLength = (baseLength+distDelta);
				var percent = deviceLength/this.lengthPathDevice*100;

				m.setLengthOnPath(deviceLength);
				m.setPercentOnPath(percent);
				m.setMetricPointRef(this.geometryPath.pointAtLength((baseLength+distDelta)));
				m.setMetricAngle(this.geometryPath.angleAtLength((baseLength+distDelta)).deg);
				
				
				
//				//point base
//				var r = m.getMetricPointRef();
//				var svgRect = new JenScript.SVGCircle().center(r.x,r.y).radius(3).fill('black');
//				this.graphicsContext.insertSVG(svgRect.toSVG());
//				
//				//radial point
//				var r2 = m.getRadialPoint(10,'Right');
//				//alert('r2:'+r2);
//				var svgRect2 = new JenScript.SVGRect().origin(r2.x,r2.y).size(3,3).fill('red');
//				this.graphicsContext.insertSVG(svgRect2.toSVG());
//				
//				//ortho right point
//				var r3 = m.getOrthoRightPoint(0,15);
//				var svgRect3 = new JenScript.SVGRect().origin(r3.x,r3.y).size(3,3).fill('green');
//				this.graphicsContext.insertSVG(svgRect3.toSVG());
//				
//				//ortho right point
//				var r4 = m.getOrthoRightPoint(0,-10);
//				var svgRect4 = new JenScript.SVGRect().origin(r4.x,r4.y).size(3,3).fill('blue');
//				this.graphicsContext.insertSVG(svgRect4.toSVG());



				//.attr('transform','rotate(0 '+m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')')
				var svgText = new JenScript.SVGText().textAnchor('middle').attr('id',this.Id+'_metrics'+i).attr('transform','rotate('+m.getRotate()+' ' +m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')').fill(m.getFillColor()).stroke('white').strokeWidth(0.5).fontSize(m.getFontSize());
				var svgTextPath = new JenScript.SVGTextPath().xlinkHref('#'+this.Id+'_path').startOffset(m.getPercentOnPath()+'%');
				var tspan = new JenScript.SVGTSpan().dy(m.getDy()).textContent(m.getMetricsLabel());
				//group.child(tspan.toSVG());
				
				
//				methodAlign
//				methodStretch
//				spacingAuto
//				spacingExact
				svgTextPath.methodStretch();
				svgTextPath.spacingExact();
				svgTextPath.child(tspan.toSVG());
				var s = svgTextPath.toSVG();
				svgText.child(s);
				//alert("::"+svgText.toSVG().outerHTML);
				var svg = svgText.toSVG();
				
				this.graphicsContext.insertSVG(svg);
				
			}

			return this.metrics;
		},

		/**
		 * get the device metrics point for the given metrics value in device coordinate
		 * 
		 * @param {Number} the metric value
		 *            metrics value
		 * @return metrics device pixel point
		 */
		getMetricsPoint : function(metricsValue) {
			if (this.source.getNature().isXFunction()) {
				if (m.getValue() < proj.getMinX() || m.getValue() > proj.getMaxX()) {
					return;
				}
			}else if (this.source.getNature().isYFunction()) {
				if (m.getValue() < proj.getMinY() || m.getValue() > proj.getMaxY()) {
					return;
				}
			}
			var pathSegment = this.getPathSegment(metricsValue);
			var userPoint = pathSegment.getUserPoint(metricsValue);
			var baseLength = this.getLengthAtSegment(pathSegment);
			var p0 = this.geometryPath.pointAtLength(this.getLengthAtSegment(pathSegment));
			var X = Math.pow((p0.x-proj.userToPixelX(userPoint.x)),2);
			var Y = Math.pow((p0.y-proj.userToPixelY(userPoint.y)),2);
			var distDelta= Math.sqrt(X + Y);
			return this.geometryPath.pointAtLength((baseLength+distDelta));
		},

		
		/**
		 * get path segments
		 */
		getSegments : function(){
			return this.segments;
		},
		
		
		/**
		 * get the curve segment that contains the specified x in user projection
		 * system
		 * 
		 * @param value
		 *            the value in user projection
		 * @return the curve segment that contains the specified x in user
		 *         projection system
		 */
		getPathSegment : function(value) {
			for (var p = 0; p < this.pathSegments.length; p++) {
				if (this.pathSegments[p].match(value)) {
					return this.pathSegments[p];
				}
			}
			return undefined;
		},

		/**
		 * get the length in device coordinate at the specified segment, excluding matched segment.
		 * 
		 * @param segment
		 *            the curve segment
		 * @return the length in device coordinate at the specified segment
		 */
		getLengthAtSegment : function(segment) {
			var length = 0;
			for (var p = 0; p < this.pathSegments.length; p++) {
				var cs = this.pathSegments[p];
				if (cs.equals(segment)) {
					return length;
				}
				length = length + cs.deviceLength();
			}
			return 0;
		},
		
		/**
		 * build user segment point from function in user coordinate
		 */
//		buildSegment : function(){
//			this.segments=[];
//			this.pathSegments=[];
//			this.source.clearCurrentFunction();
//			var userPointsFunction = this.source.getCurrentFunction();
//			//console.log("spline points number : "+userPointsFunction.length);
//			for (var i = 0; i < userPointsFunction.length; i++) {
//				var p = userPointsFunction[i];
//				if(i == 0)
//					this.moveTo(p.x,p.y);
//				else
//					this.lineTo(p.x,p.y);
//			}
//		},
		
		
		/**
		 * build the path based on segments
		 */
		buildPath : function(){
			
			this.segments=[];
			this.pathSegments=[];
			this.source.clearCurrentFunction();
			var userPointsFunction = this.source.getCurrentFunction();
			//console.log("spline points number : "+userPointsFunction.length);
			for (var i = 0; i < userPointsFunction.length; i++) {
				var p = userPointsFunction[i];
				if(i == 0)
					this.moveTo(p.x,p.y);
				else
					this.lineTo(p.x,p.y);
			}

			
			
			var path='';
			var segments = this.segments;
			var proj = this.getProjection();
			
			var toX = function(x){
					return proj.userToPixelX(x);
			};
			var toY = function(y){
					return proj.userToPixelY(y);
			};
			for (var i = 0; i < segments.length; i++) {
				
				var x = segments[i].x;
				var y = segments[i].y;
				var dx = toX(x);
				var dy = toY(y);
				
				//path
				if(segments[i].type === 'M')
					path = path  + segments[i].type+dx+','+dy+' ';
				if(segments[i].type === 'L')
					path = path  + segments[i].type+dx+','+dy+' ';
				if(segments[i].type === 'Z')
					path = path  + segments[i].type+' ';
				
				
				//path segment
				if(i<segments.length-1){
					
					//i+1
					//console.log('si:'+segments[i+1]);
					var x2 = segments[i+1].x;
					var y2 = segments[i+1].y;
					var dx2 = toX(x2);
					var dy2 = toY(y2);
					
					var ps = new JenScript.PathSegment({
						userStart : new JenScript.Point2D(x,y),
						userEnd : new JenScript.Point2D(x2,y2),
						deviceStart : new JenScript.Point2D(dx,dy),
						deviceEnd : new JenScript.Point2D(dx2,dy2),
					});
					ps.sourceFunction = this.source;
					this.pathSegments[this.pathSegments.length]=ps;
				}
			}
			this.pathdata = path;
			return path;
		},
		
		/**
		 * paint path function
		 */
		paintPathFunction : function(g2d) {
			this.createPath();
			g2d.deleteGraphicsElement(this.Id);
			var path = new JenScript.SVGElement().attr('id',this.Id).name('path').attr('stroke',this.themeColor).attr('stroke-width',this.strokeWidth).attr('fill','none').attr('d',this.buildPath()).buildHTML();
			g2d.insertSVG(path);
		},
		
		
		/**
		 * provides method for function painting operation
		 * @param g2d the graphics context
		 */
		paintFunction : function(g2d){throw new Error('Paint function should be supplied.');},
		
		
		/**
		 * register path segment like move, line or close path in user coordinate
		 */
		registerSegment : function(fragment){
			this.segments[this.segments.length] = fragment;
			return this;
		},
		
		/**
		 * path move to in user coordinate
		 * @param x
		 * @param y
		 */
		moveTo : function(x,y){
			this.registerSegment({type : 'M',x:x,y:y});
			return this;
		},
		
		/**
		 * path line to in user coordinate
		 * @param x
		 * @param y
		 */
		lineTo : function(x,y){
			this.registerSegment({type : 'L',x:x,y:y});
			return this;
		},
		
		/**
		 * path close
		 */
		close : function(){
			this.registerSegment({type : 'Z'});
			return this;
		}
		
	});
	
})();
(function(){
	/**
	 * Object Curve()
	 * Defines curve function
	 * @param {Object} config
	 */
	JenScript.Curve = function(config) {
		//JenScript.Curve
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Curve, JenScript.AbstractPathFunction);
	JenScript.Model.addMethods(JenScript.Curve, {
		/**
		 * Initialize Curve Function
		 * Defines a curve function
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.name = 'CurvePathFunction';
		    JenScript.AbstractPathFunction.call(this,config);
		},
		
		/**
		 * paint curve function
		 * @param g2d the graphics context
		 */
		paintFunction : function(g2d){
			this.paintPathFunction(g2d);
		}
	});
})();
(function(){
	
	/**
	 * Object Area()
	 * Defines area function
	 * @param {Object} config
	 */
	JenScript.Area = function(config) {
		//JenScript.Area
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Area, JenScript.AbstractPathFunction);
	JenScript.Model.addMethods(JenScript.Area, {
		/**
		 * Initialize Area Function
		 * Defines a area function
		 * @param {Object} config
		 * @param {Number} config.areaBase
		 * @param {Object} config.shader
		 */
		_init : function(config){
			config = config || {};
			config.name = 'AreaPathFunction';
			this.areaBase = config.areaBase;
			this.shader = config.shader;
		    JenScript.AbstractPathFunction.call(this,config);
		},
		
		
		createAreaPath : function (){
			var pathData = this.buildPath();
			var p = this.getProjection();
			if (this.source.getNature().isXFunction()) {
				if(this.areaBase === undefined)
				this.areaBase = this.minFunction().y; //assume XFunction
				this.base = p.userToPixelY(this.areaBase);
				var areaMax = this.maxFunction().y; //assume XFunction
				this.max = p.userToPixelY(areaMax);
				var userPointsFunction = this.source.getCurrentFunction();			
				var first = userPointsFunction[0];
				var last  = userPointsFunction[userPointsFunction.length-1];
				pathData = pathData+'L'+p.userToPixelX(last.x)+','+this.base+'L'+p.userToPixelX(first.x)+','+this.base+'Z';
				
			}else if(this.source.getNature().isYFunction()){
				if(this.areaBase === undefined)
				this.areaBase = this.minFunction().x; //assume YFunction
				var base = p.userToPixelX(this.areaBase);
				var areaMax = this.maxFunction().x; //assume YFunction
				this.max = p.userToPixelX(areaMax);
				var userPointsFunction = this.source.getCurrentFunction();			
				var first = userPointsFunction[0];
				var last  = userPointsFunction[userPointsFunction.length-1];
				pathData = pathData+'L'+this.base+','+p.userToPixelY(last.y)+'L'+this.base+','+p.userToPixelY(first.y)+'Z';
			}
			return pathData;
		},
		
		/**
		 * paint area function
		 * @param g2d the graphics context
		 */
		paintFunction : function(g2d){
			var pd = this.createAreaPath();
			var gradientId = this.Id+'_areagradient';
			g2d.deleteGraphicsElement(gradientId);
			 /** default shader fractions */
			if(this.shader === undefined)
				this.shader = {percents : [ '0%', '100%' ],opacity:[1,0.2], colors : [this.themeColor,this.themeColor]};
		    var gradient   = new JenScript.SVGLinearGradient().Id(gradientId).from(0,this.max).to(0, this.base).shade(this.shader.percents,this.shader.colors,this.shader.opacity);
		    if(this.source.getNature().isXFunction()){
		    	 gradient.from(0,this.max).to(0, this.base);
		    }
			else if(this.source.getNature().isYFunction()){
				gradient.from(this.max,0).to(this.base, 0);
			}
			g2d.definesSVG(gradient.toSVG());
			var path = new JenScript.SVGElement().attr('id',this.Id).name('path').attr('stroke',this.strokeWidth).attr('fill','url(#'+gradientId+')').attr('d',pd).buildHTML();
			g2d.insertSVG(path);
		}
	});
})();
(function(){

	
	/**
	 * Object Scatter()
	 * Defines scatter function
	 * @param {Object} config
	 */
	JenScript.Scatter = function(config) {
		//JenScript.Scatter
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Scatter, JenScript.AbstractPathFunction);
	JenScript.Model.addMethods(JenScript.Scatter, {
		/**
		 * Initialize Scatter Function
		 * Defines a scatter function
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.name = 'ScatterPathFunction';
			this.radius = (config.radius !== undefined)? config.radius : 4;
		    JenScript.AbstractPathFunction.call(this,config);
		},
		
		/**
		 * paint scatter function
		 * @param g2d the graphics context
		 */
		paintFunction : function(g2d){
			//this.paintPathFunction(g2d);
			this.source.clearCurrentFunction();
			var userPointsFunction = this.source.getCurrentFunction();
			var proj = this.getProjection();
			for (var i = 0; i < userPointsFunction.length; i++) {
				var p = userPointsFunction[i];
				var scatter = new JenScript.SVGRect().origin(proj.userToPixelX(p.x)-this.radius/2,proj.userToPixelY(p.y)-this.radius/2).size(this.radius,this.radius).fill(this.getThemeColor());
				g2d.insertSVG(scatter.toSVG());
			}
		}
	});
})();
(function(){
	/**
	 * Object FunctionPlugin()
	 * Defines a plugin that takes the responsibility to manage functions
	 * @param {Object} config
	 */
	JenScript.FunctionPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.FunctionPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.FunctionPlugin, {
		
		/**
		 * Initialize Function Plugin
		 * Defines a plugin that takes the responsibility to manage function
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.priority = 100;
			config.name='FunctionPlugin';
			/** functions */
		    this.functions = [];
		    JenScript.Plugin.call(this,config);
		},
		
		/**
		 * on projection register add 'bound changed' projection listener that invoke repaint plugin
		 * when projection bound changed event occurs.
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'FunctionPlugin projection bound changed');
		},
		
		/**
	     * register function
	     * @param fn
	     */
	    addFunction : function(fn) {
    		fn.setHostPlugin(this);
            this.functions[this.functions.length] = fn;
            this.repaintPlugin();
	    },
	    
	    /**
	     * @return the functions
	     */
	    getFunctions : function() {
	        return this.functions;
	    },
	    
	    /**
	     * @param g2d
	     * @param viewPart
	     */
	    paintFunctions : function(g2d,viewPart){
	    	 if (viewPart !== JenScript.ViewPart.Device) {
		        return;
		     }
	    	 for (var c = 0; c < this.getFunctions().length; c++) {
            	var pathFunction = this.getFunctions()[c];
            	pathFunction.source.hostFunction = pathFunction;//required for share source between function
            	pathFunction.paintFunction(g2d);
	         }
	    },
	    
	    
	    /**
	     * paint metrics path function
	     * 
	     * @param g2d
	     * @param viewPart
	     */
	    paintMetricsGlyphFunction : function(g2d,viewPart) {
	        if (viewPart !== JenScript.ViewPart.Device) {
	            return;
	        }
	        for (var c = 0; c < this.getFunctions().length; c++) {
            	var pathFunction = this.getFunctions()[c];
            	pathFunction.graphicsContext = g2d;
            	pathFunction.source.hostFunction = pathFunction;//required for share source between function
	            var metrics = pathFunction.getMetrics();
//	            for (GlyphMetric glyphMetric : metrics) {
//	                if (glyphMetric.getGlyphMetricMarkerPainter() != null) {
//	                    glyphMetric.getGlyphMetricMarkerPainter().paintGlyphMetric(g2d, glyphMetric);
//	                }
//
//	                if (glyphMetric.getGlyphMetricFill() != null) {
//	                    glyphMetric.getGlyphMetricFill().paintGlyphMetric(g2d, glyphMetric);
//	                }
//
//	                if (glyphMetric.getGlyphMetricDraw() != null) {
//	                    glyphMetric.getGlyphMetricDraw().paintGlyphMetric(g2d, glyphMetric);
//	                }
//	            }
	        }

	    },
	   
	   /**
	    * paint function plugin
	    */
	   paintPlugin : function(g2d,viewPart) {
		   if (viewPart !== JenScript.ViewPart.Device) {
               return;
           }
		  
	       this.paintFunctions(g2d,viewPart);
	       this.paintMetricsGlyphFunction(g2d,viewPart);
	   }
	    
	});
})();