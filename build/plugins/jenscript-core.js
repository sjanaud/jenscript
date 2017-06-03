// JenScript -  JavaScript HTML5/SVG Library
// version : 1.3.1
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-06-03
// All Rights reserved

/**
* @namespace JenScript
*/
var JenScript = {};


(function() {
	
		JenScript = {
				
				version : '1.3.1',
				views : [],
				sequenceId: 0,
				SVG_NS : 'http://www.w3.org/2000/svg',
				XLINK_NS : 'http://www.w3.org/1999/xlink',
				XHTML_NS : 'http://www.w3.org/1999/xhtml',
				SVG_VERSION : '1.1',
				
				/**
	             * create color as hex representation
	             * @method
	             * @return {String} color as hex string
	             * @memberof JenScript
	             */
	            createColor: function() {
	                var color = (Math.random() * 0xFFFFFF << 0).toString(16);
	                while (color.length < 6) {
	                	color = '0' + color;
	                }
	                return '#' + color;
	            },
		       	
	            /**
	             * get browser agent
	             * @method
	             * @returns {Object} browser.name and browser.version
	             */
		        agent: (function() {
		            var ua = navigator.userAgent.toLowerCase(),
		                // jQuery UA regex
		                match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		                /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		                /(msie) ([\w.]+)/.exec( ua ) ||
		                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		                [];
		            return {
		                browser: match[ 1 ] || '',
		                version: match[ 2 ] || '0'
		            };
		        })(),
		        
		       
		        /**
		         * View Part Name
		         * @contructor
		         * @memberof JenScript
		         */
		        ViewPart : {
		        		View   : 'View',
		        		North  : 'North',
		        		South  : 'South',
		        		West   : 'West',
		        		East   : 'East',
		        		Device : 'Device'
		        },
		        
		    	/**
		         * @constructor
		         * @memberof JenScript
		         * @param {Object} config
		         * @param {String} [config.part] South, West, East, North, Device
		         * @param {Number} [config.width] The component width in pixel
		         * @param {Number} [config.height] The component height in pixel
		         * @param {Object} [config.view] The component parent views
		         */
		    	ViewPartComponent : function(config) {
		    		this.init(config);
		    	},
		       
		    	/**
		    	 * Object View()
		         * @constructor
		         * @memberof JenScript
		         * @param {Object} config
		         * @param {String} [config.name] The view chart name
		         * @param {Number} [config.width] The view width in pixel
		         * @param {Number} [config.height] The view height in pixel
		         * @param {Number} [config.west] The west part width
		         * @param {Number} [config.east] The east part width
		         * @param {Number} [config.north] The north part height
		         * @param {Number} [config.south] The south part height
		         * 
		         */
		        View: function(config) {
		            this.init(config);
		        },
		        
		        /**
		         * Object Projection()
		         * @constructor
		         * @memberof JenScript
		         * @abstract
		         */
		    	Projection : function(config) {
		    		this.init(config);
		    	},
		        
		    	/**
		    	 * Object Plugin()
		         * @constructor
		         * @memberof JenScript
		         * @abstract
		         */
		        Plugin : function(config) {
		    		this.init(config);
		    	},
		    	
		    	//stream wrapper function with interfaces builders
	    		view : function(config){
	    			return new JenScript.ViewBuilder(config);
				},
		};

		//EXPORT
		(function(root, factory) {
		 if(typeof exports === 'object') {
		     // Node
		     module.exports = factory();
		 }
		 else if(typeof define === 'function' && define.amd) {
		     // AMD
		     define(factory);
		 }
		 else {
		     // globals UMD
		     root.returnExports = factory();
		 }
		}(this, function() {
			return JenScript;
		}));
})();
(function() {
	JenScript.Model = {
			
			/**
	         * adds methods prototype to child prototype
	         * @method
	         * @memberof JenScript.Model.prototype
	         * @param {Object} childObject
	         * @param {Object} parentObject
	         */
	        inheritPrototype : function(childObject, parentObject) {
	        	var copyOfParent = Object.create(parentObject.prototype);
	        	copyOfParent.constructor = childObject;
	        	childObject.prototype = copyOfParent;
	        },
	        
	        /**
	         * adds methods to a constructor prototype
	         * @method
	         * @memberof JenScript.Model.prototype
	         * @param {Function} constructor
	         * @param {Object} methods
	         */
	        addMethods: function(constructor, methods) {
	          var key = undefined;
	          for (key in methods) {
	            constructor.prototype[key] = methods[key];
	          }
	        },	        
	};
})();
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
(function(){
	
	var trimLeft = /^[\s,#]+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    math = Math,
    mathRound = math.round,
    mathMin = math.min,
    mathMax = math.max,
    mathRandom = math.random;

 JenScript.Color  = function(color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a JenScript.Color, return itself
    if (color instanceof JenScript.Color) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof JenScript.Color)) {
        return new JenScript.Color(color, opts);
    }

    var rgb = inputToRGB(color);
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
};

JenScript.Color.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function() {
        return rgbaToHex(this._r, this._g, this._b, this._a);
    },
    toHex8String: function() {
        return '#' + this.toHex8();
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
//    toFilter: function(secondColor) {
//        var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
//        var secondHex8String = hex8String;
//        var gradientType = this._gradientType ? "GradientType = 1, " : "";
//
//        if (secondColor) {
//            var s = JenScript.Color(secondColor);
//            secondHex8String = s.toHex8String();
//        }
//
//        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
//    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
JenScript.Color.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return JenScript.Color(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
            color.s = convertToPercentage(color.s);
            color.v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, color.s, color.v);
            ok = true;
            format = "hsv";
        }
        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
            color.s = convertToPercentage(color.s);
            color.l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, color.s, color.l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}
    // `rgbaToHex`
    // Converts an RGBA color plus alpha transparency to hex
    // Assumes r, g, b and a are contained in the set [0, 255]
    // Returns an 8 character hex
    function rgbaToHex(r, g, b, a) {

        var hex = [
            pad2(convertDecimalToHex(a)),
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];

        return hex.join("");
    }

// `equals`
// Can be called with any JenScript.Color input
JenScript.Color.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return JenScript.Color(color1).toRgbString() == JenScript.Color(color2).toRgbString();
};
JenScript.Color.random = function() {
    return JenScript.Color.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

//JenScript.Color.desaturate = function (color, amount) {
//    amount = (amount === 0) ? 0 : (amount || 10);
//    var hsl = JenScript.Color(color).toHsl();
//    hsl.s -= amount / 100;
//    hsl.s = clamp01(hsl.s);
//    return JenScript.Color(hsl);
//};
//JenScript.Color.saturate = function (color, amount) {
//    amount = (amount === 0) ? 0 : (amount || 10);
//    var hsl = JenScript.Color(color).toHsl();
//    hsl.s += amount / 100;
//    hsl.s = clamp01(hsl.s);
//    return JenScript.Color(hsl);
//};
//JenScript.Color.greyscale = function(color) {
//    return JenScript.Color.desaturate(color, 100);
//};
JenScript.Color.lighten = function(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = JenScript.Color(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return JenScript.Color(hsl);
};
JenScript.Color.brighten = function(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = JenScript.Color(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return JenScript.Color(rgb);
};
JenScript.Color.darken = function (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = JenScript.Color(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return JenScript.Color(hsl);
};
//JenScript.Color.complement = function(color) {
//    var hsl = JenScript.Color(color).toHsl();
//    hsl.h = (hsl.h + 180) % 360;
//    return JenScript.Color(hsl);
//};
//// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
//// Values outside of this range will be wrapped into this range.
//JenScript.Color.spin = function(color, amount) {
//    var hsl = JenScript.Color(color).toHsl();
//    var hue = (mathRound(hsl.h) + amount) % 360;
//    hsl.h = hue < 0 ? 360 + hue : hue;
//    return JenScript.Color(hsl);
//};
//JenScript.Color.mix = function(color1, color2, amount) {
//    amount = (amount === 0) ? 0 : (amount || 50);
//
//    var rgb1 = JenScript.Color(color1).toRgb();
//    var rgb2 = JenScript.Color(color2).toRgb();
//
//    var p = amount / 100;
//    var w = p * 2 - 1;
//    var a = rgb2.a - rgb1.a;
//
//    var w1;
//
//    if (w * a == -1) {
//        w1 = w;
//    } else {
//        w1 = (w + a) / (1 + w * a);
//    }
//
//    w1 = (w1 + 1) / 2;
//
//    var w2 = 1 - w1;
//
//    var rgba = {
//        r: rgb2.r * w1 + rgb1.r * w2,
//        g: rgb2.g * w1 + rgb1.g * w2,
//        b: rgb2.b * w1 + rgb1.b * w2,
//        a: rgb2.a * p  + rgb1.a * (1 - p)
//    };
//
//    return JenScript.Color(rgba);
//};

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

//JenScript.Color.triad = function(color) {
//    var hsl = JenScript.Color(color).toHsl();
//    var h = hsl.h;
//    return [
//        JenScript.Color(color),
//        JenScript.Color({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
//        JenScript.Color({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
//    ];
//};
//JenScript.Color.tetrad = function(color) {
//    var hsl = JenScript.Color(color).toHsl();
//    var h = hsl.h;
//    return [
//        JenScript.Color(color),
//        JenScript.Color({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
//        JenScript.Color({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
//        JenScript.Color({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
//    ];
//};
//JenScript.Color.splitcomplement = function(color) {
//    var hsl = JenScript.Color(color).toHsl();
//    var h = hsl.h;
//    return [
//        JenScript.Color(color),
//        JenScript.Color({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
//        JenScript.Color({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
//    ];
//};
//JenScript.Color.analogous = function(color, results, slices) {
//    results = results || 6;
//    slices = slices || 30;
//
//    var hsl = JenScript.Color(color).toHsl();
//    var part = 360 / slices;
//    var ret = [JenScript.Color(color)];
//
//    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
//        hsl.h = (hsl.h + part) % 360;
//        ret.push(JenScript.Color(hsl));
//    }
//    return ret;
//};
//JenScript.Color.monochromatic = function(color, results) {
//    results = results || 6;
//    var hsv = JenScript.Color(color).toHsv();
//    var h = hsv.h, s = hsv.s, v = hsv.v;
//    var ret = [];
//    var modification = 1 / results;
//
//    while (results--) {
//        ret.push(JenScript.Color({ h: h, s: s, v: v}));
//        v = (v + modification) % 1;
//    }
//
//    return ret;
//};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/AERT#color-contrast>

// `readability`
// Analyze the 2 colors and returns an object with the following properties:
//    `brightness`: difference in brightness between the two colors
//    `color`: difference in color/hue between the two colors
//JenScript.Color.readability = function(color1, color2) {
//    var c1 = JenScript.Color(color1);
//    var c2 = JenScript.Color(color2);
//    var rgb1 = c1.toRgb();
//    var rgb2 = c2.toRgb();
//    var brightnessA = c1.getBrightness();
//    var brightnessB = c2.getBrightness();
//    var colorDiff = (
//        Math.max(rgb1.r, rgb2.r) - Math.min(rgb1.r, rgb2.r) +
//        Math.max(rgb1.g, rgb2.g) - Math.min(rgb1.g, rgb2.g) +
//        Math.max(rgb1.b, rgb2.b) - Math.min(rgb1.b, rgb2.b)
//    );
//
//    return {
//        brightness: Math.abs(brightnessA - brightnessB),
//        color: colorDiff
//    };
//};

// `readable`
// http://www.w3.org/TR/AERT#color-contrast
// Ensure that foreground and background color combinations provide sufficient contrast.
// *Example*
//    JenScript.Color.readable("#000", "#111") => false
//JenScript.Color.readable = function(color1, color2) {
//    var readability = JenScript.Color.readability(color1, color2);
//    return readability.brightness > 125 && readability.color > 500;
//};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// *Example*
//    JenScript.Color.mostReadable("#123", ["#fff", "#000"]) => "#000"
//JenScript.Color.mostReadable = function(baseColor, colorList) {
//    var bestColor = null;
//    var bestScore = 0;
//    var bestIsReadable = false;
//    for (var i=0; i < colorList.length; i++) {
//
//        // We normalize both around the "acceptable" breaking point,
//        // but rank brightness constrast higher than hue.
//
//        var readability = JenScript.Color.readability(baseColor, colorList[i]);
//        var readable = readability.brightness > 125 && readability.color > 500;
//        var score = 3 * (readability.brightness / 125) + (readability.color / 500);
//
//        if ((readable && ! bestIsReadable) ||
//            (readable && bestIsReadable && score > bestScore) ||
//            ((! readable) && (! bestIsReadable) && score > bestScore)) {
//            bestIsReadable = readable;
//            bestScore = score;
//            bestColor = JenScript.Color(colorList[i]);
//        }
//    }
//    return bestColor;
//};

// http://www.w3.org/TR/css3-color/#svg-color
var names = JenScript.Color.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = JenScript.Color.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the JenScript.Color is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            a: convertHexToDecimal(match[1]),
            r: parseIntFromHex(match[2]),
            g: parseIntFromHex(match[3]),
            b: parseIntFromHex(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

})();

(function(){
	JenScript.RosePalette = {
	  	BORDEAUX : 'rgb(168, 45, 69)',
	    PRIMROSE : 'rgb(216, 90, 122)',
	    PLUMWINE : 'rgb(115, 51, 92)',
	    AMETHYST : 'rgb(170, 72, 134)',
	    LAVENDER : 'rgb(168, 151, 183)',
	    FOXGLOWE : 'rgb(136, 82, 152)',
	    FLANNELGRAY : 'rgb(109, 81, 75)',
	    STONEGRAY : 'rgb(166, 145, 140)',
	    INDIGO : 'rgb(61, 44, 105)',
	    COALBLACK : 'rgb(37, 38, 41)',
	    LAPISBLUE : 'rgb(88, 84, 141)',
	    COBALT : 'rgb(35, 56, 158)',
	    TURQUOISE : 'rgb(23, 130, 187)',
	    AEGEANBLUE : 'rgb(22, 125, 218)',
	    NEPTUNE : 'rgb(128, 182, 191)',
	    CALYPSOBLUE : 'rgb(91, 151, 168)',
	    JADE : 'rgb(143, 184, 175)',
	    DEEPHARBOR : 'rgb(44, 114, 97)',
	    EMERALD : 'rgb(62, 142, 78)',
	    LEAFGREEN : 'rgb(83, 133, 52)',
	    PINE : 'rgb(140, 187, 89)',
	    LIME : 'rgb(197, 208, 89)',
	    PALMLEAF : 'rgb(190, 168, 99)',
	    SAGE : 'rgb(203, 207, 148)',
	    LEMONPEEL : 'rgb(247, 239, 100)',
	    SAFFRON : 'rgb(235, 214, 92)',
	    SANDALWOOD : 'rgb(216, 204, 165)',
	    MELON : 'rgb(230, 193, 153)',
	    SUNBURST : 'rgb(235, 204, 131)',
	    CHOCOLATE : 'rgb(86, 51, 41)',
	    LIGHTBROWN : 'rgb(190, 94, 61)',
	    SIENNA : 'rgb(168, 72, 36)',
	    HENNA : 'rgb(219, 65, 32)',
	    MANDARIN : 'rgb(255, 136, 83)',
	    CORALRED : 'rgb(208, 58, 47)',
	    REDWOOD : 'rgb(203, 71, 52)',
	    FLAMINGO : 'rgb(225, 185, 197)',
	    CARDINAL : 'rgb(194, 37, 37)',
	    PINGPIZZAZZ : 'rgb(218, 118, 153)',
	    AZALEA : 'rgb(204, 74, 84)',	
	};
})();
(function(){
	
	/**
	 * Texture is defined by the pattern itself and related pattern definitions like gradients
	 * @param {Object} pattern
	 * @param {Object} definitions
	 */
	JenScript.Texture =  function(pattern,definitions){
		this.Id = 'texture'+JenScript.sequenceId++;
		this.pattern = pattern;
		this.definitions = definitions;
	};
	
	JenScript.Texture.prototype = {
		getId : function(){
			return this.Id;
		},
		getPattern : function(){
			return this.pattern;
		},
		getDefinitions : function(){
			return this.definitions;
		}
	};
	
	
	/**
	 * create a carbon texture with triangle pattern
	 */
	JenScript.Texture.getTriangleCarbonFiber = function(size){
		var width = (size !== undefined)?size :10;
		var height = (size !== undefined)?size :10;
		var pattern  = new JenScript.SVGPattern();
		var r0  = new JenScript.SVGRect().origin(0,0).size(width,height).strokeNone().fill('darkgray');
		var p1  = new JenScript.SVGPolygon().point(width/2,0).point(width/2,height).point(0,height/2).strokeNone().fill('black');
		var p2  = new JenScript.SVGPolygon().point(width/2,0).point(width,0).point(width,height/2).strokeNone().fill('black');
		var p3  = new JenScript.SVGPolygon().point(width,height/2).point(width,height).point(width/2,height).strokeNone().fill('black');
		pattern.size(width,height).child(r0.toSVG()).child(p1.toSVG()).child(p2.toSVG()).child(p3.toSVG());
		return new JenScript.Texture(pattern);
	},
	
	/**
	 * create a carbon texture with square pattern
	 */
	JenScript.Texture.getSquareCarbonFiber = function(){
		var width = 20;
		var height = 20;
		var pattern  = new JenScript.SVGPattern().size(width,height);
		var r0  = new JenScript.SVGRect().origin(0,0).size(width,height).strokeNone().fill('rgb(60,60,60)');
		pattern.child(r0.toSVG());
		var definitions =[];
		var w = 10;
		var h = 10;
		var x = 0;
		var y;
		for (var i = -10; i < 12; i = i + 2 * h) {
			y = i;
			x = -w / 2;
			for (var j = 0; j < 5; j++) {
				var gradient1Id = "texture_gradient"+JenScript.sequenceId++;
				var percents1 = ['0%','100%'];
				var colors1 =['black','darkgray'];
				var gradient1= new JenScript.SVGLinearGradient().Id(gradient1Id).from(x + w / 2, y).to(x + w / 2, y + h).shade(percents1,colors1);
				definitions[definitions.length] = gradient1;
				var r1  = new JenScript.SVGRect().origin(x,y).size(w,h).strokeNone().fill('url(#'+gradient1Id+')');
				pattern.child(r1.toSVG());

				var gradient2Id = "texture_gradient"+JenScript.sequenceId++;
				var percents2 = ['0%','100%'];
				var colors2 =['black','darkgray'];
				var gradient2= new JenScript.SVGLinearGradient().Id(gradient2Id).from(x, y / 4).to(x + w, y / 4).shade(percents2,colors2);
				definitions[definitions.length] = gradient2;
				var r2  = new JenScript.SVGRect().origin(x,y).size(w,h/2).strokeNone().fill('url(#'+gradient1Id+')');
				pattern.child(r2.toSVG());
				x = x + w / 2;
				y = y + h / 2;
			}
		}
		return new JenScript.Texture(pattern, definitions);
	};
})();
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
(function(){
	JenScript.GlyphMetric = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.GlyphMetric,{
		init : function(config){
			config = config || {};
			/** the user metric value along the path */
			this.value = config.value;
			
			this.fontSize = (config.fontSize !== undefined) ? config.fontSize :  12;
			this.fontFamily = config.fontFamily;
			
			this.metricsLabel = config.metricsLabel;
			/** metric radial delta y */
			this.dy = (config.dy !== undefined) ? config.dy :  -5;
			/** metric rotation */
			this.rotate = (config.rotate !== undefined) ? config.rotate :  0;
			
			/** the device length value */
			this.lengthOnPath;
			
			/** the device percent length value */
			this.percentOnPath;

			/** metric marker point reference */
			this.metricPointRef;

			/** angle path */
			this.metricAngle;

			/** glyph start location */
			this.pointStart;

			/** glyph end location */
			this.pointEnd;
			
			this.fillColor = (config.fillColor !== undefined) ? config.fillColor :  'red';
			this.strokeColor = config.strokeColor ;
			
			
		},
		
		getFontSize : function(){
			return this.fontSize;
		},
		setFontSize : function(fontSize){
			this.fontSize = fontSize;
		},
		getFontFamily : function(){
			return this.fontFamily;
		},
		setFontFamily : function(fontFamily){
			this.fontFamily = fontFamily;
		},
		getValue : function(){
			return this.value;
		},
		
		setValue : function(value){
			this.value = value;
		},
		
		getFillColor : function(){
			return this.fillColor;
		},
		
		setFillColor : function(fillColor){
			this.fillColor = fillColor;
		},


		/**
		 * get the glyph angle
		 * 
		 * @return the metric glyph angle
		 */
		getMetricAngle : function() {
			return this.metricAngle;
		},

		/**
		 * set the metric glyph angle
		 * 
		 * @param metricAngle
		 */
		setMetricAngle : function(metricAngle) {
			this.metricAngle = metricAngle;
		},

//		/**
//		 * get the radial point
//		 * 
//		 * @param div
//		 *            the divergence from the path
//		 * @param side
//		 *            the side relative to the path
//		 * @return the radial point
//		 */
//		getRadialPoint : function(div,side) {
//			alert("here");
//			if (this.metricPointRef == undefined) {
//				return undefined;
//			}
//
//			var px;
//			var py;
//			if (side === 'Right') {
//				
//				px = this.metricPointRef.getX() - div * Math.sin(this.metricAngle);
//				py = this.metricPointRef.getY() + div * Math.cos(this.metricAngle);
//			} else {
//				px = this.metricPointRef.getX() + div * Math.sin(this.metricAngle);
//				py = this.metricPointRef.getY() - div * Math.cos(this.metricAngle);
//			}
//			return new JenScript.Point2D(px, py);
//		},

		

//		/**
//		 * get the orthogonal left point
//		 * 
//		 * @param div
//		 *            the divergence from the path
//		 * @return the ortho point
//		 */
//		getOrthoLeftPoint : function(div) {
//			return getOrthoLeftPoint(div, 0);
//		},

		/**
		 * get the orthogonal left point shift
		 * 
		 * @param divOrtho
		 *            the divergence from the path
		 * @param divRadial
		 * @return the ortho point
		 */
		getOrthoLeftPoint : function(divOrtho,divRadial) {
			if (this.metricPointRef === undefined) {
				return undefined;
			}
			var px;
			var py;
			px = this.metricPointRef.getX() + divRadial * Math.sin(JenScript.Math.toRadians(this.metricAngle)) + divOrtho * Math.sin(JenScript.Math.toRadians(this.metricAngle + Math.PI / 2));
			py = this.metricPointRef.getY() - divRadial * Math.cos( JenScript.Math.toRadians(this.metricAngle)) - divOrtho * Math.cos(JenScript.Math.toRadians(this.metricAngle + Math.PI / 2));
			return new JenScript.Point2D(px, py);
		},


		/**
		 * get the orthogonal right point shift
		 * 
		 * @param divOrtho
		 *            the divergence from the path
		 * @param divRadial
		 * @return the ortho point
		 */
		getOrthoRightPoint : function(divOrtho,divRadial) {
			if (this.metricPointRef === undefined) {
				return undefined;
			}
			var px = this.metricPointRef.getX() + divRadial * Math.sin(JenScript.Math.toRadians(this.metricAngle)) + divOrtho * Math.sin(JenScript.Math.toRadians(this.metricAngle - Math.PI / 2));
			var py = this.metricPointRef.getY() - divRadial * Math.cos(JenScript.Math.toRadians(this.metricAngle)) - divOrtho * Math.cos(JenScript.Math.toRadians(this.metricAngle - Math.PI / 2));
			return new JenScript.Point2D(px, py);
		},

		/**
		 * get the radial point
		 * 
		 * @param divergence
		 *            the divergence from the path relative to the internal side of
		 *            this metrics
		 * @return the radial point
		 */
		getRadialPoint : function(divergence) {
			if (this.metricPointRef === undefined) {
				return undefined;
			}
			var px = this.metricPointRef.getX() + divergence * Math.sin(JenScript.Math.toRadians(this.metricAngle));
			var py = this.metricPointRef.getY() - divergence * Math.cos(JenScript.Math.toRadians(this.metricAngle));

			return new JenScript.Point2D(px, py);
		},

		/**
		 * get the marker metric point reference
		 * 
		 * @return the reference
		 */
		getMetricPointRef : function() {
			return this.metricPointRef;
		},

		/**
		 * set the marker metric reference
		 * 
		 * @param metricPointRef
		 */
		setMetricPointRef : function(metricPointRef) {
			this.metricPointRef = metricPointRef;
		},

		/**
		 * get the divergence of the metric from the path
		 * 
		 * @return the divergence
		 */
		getDy : function() {
			return this.dy;
		},

		/**
		 * set the divergence
		 * 
		 * @param divergence
		 */
		setDy : function(dy) {
			this.dy = dy;
		},
		
		/**
		 * get the metric rotation
		 * 
		 * @return rotation
		 */
		getRotate : function() {
			return this.rotate;
		},

		/**
		 * set the metric rotation
		 * 
		 * @param rotate
		 *            the metric rotation
		 */
		setRotate : function(rotate) {
			this.rotate = rotate;
		},
		
		/**
		 * get the the length on path for this metrics
		 * 
		 * @return length on path
		 */
		getLengthOnPath : function() {
			return this.lengthOnPath;
		},

		/**
		 * set the length on path for this metrics
		 * 
		 * @param lengthOnPath
		 */
		setLengthOnPath : function(lengthOnPath) {
			this.lengthOnPath = lengthOnPath;
		},
		
		/**
		 * get the percent length on path for this metrics
		 * 
		 * @return length on path
		 */
		getPercentOnPath : function() {
			return this.percentOnPath;
		},

		/**
		 * set the percent length on path for this metrics
		 * 
		 * @param percentOnPath
		 */
		setPercentOnPath : function(percentOnPath) {
			this.percentOnPath = percentOnPath;
		},
		
		/**
		 * get the metrics label
		 * 
		 * @return metrics label
		 */
		getMetricsLabel : function() {
			return this.metricsLabel;
		},

		/**
		 * set the metrics label
		 * 
		 * @param metricsLabel
		 */
		setMetricsLabel : function( metricsLabel) {
			this.metricsLabel = metricsLabel;
		},

		/**
		 * get the start point of this glyph metrics *
		 * 
		 * @return the start point
		 */
		getPointStart : function() {
			return this.pointStart;
		},

		/**
		 * set the start point of this glyph metrics *
		 * 
		 * @param pointStart
		 *            the start point
		 */
		setPointStart : function( pointStart) {
			this.pointStart = pointStart;
		},

		/**
		 * get the end point of this glyph metrics *
		 * 
		 * @return the end point
		 */
		getPointEnd : function() {
			return this.pointEnd;
		},

		/**
		 * set the end point of this glyph metrics
		 * 
		 * @param pointEnd
		 *            the end point
		 */
		setPointEnd : function( pointEnd) {
			this.pointEnd = pointEnd;
		}


	});
})();
(function(){

	
	JenScript.GeneralMetricsPath = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.GeneralMetricsPath,{
		init : function(config){
			//console.log('create general metrics path');
			config = config || {};
			this.Id = 'generalmetricspath'+JenScript.sequenceId++;
			/** default nature is the user space */
			this.nature = (config.nature !== undefined)? config.nature : 'User';
			
			/** the window 2D */
			this.projection;
			/** the geometry path */
			this.geometryPath;
			
			/** the minimum value in the user space */
			this.min = config.min;
			/** the maximum value in the user space */
			this.max = config.max;
			
			/** length of path in the device space */
			this.lengthPathDevice;
			/** user length of path */
			this.userWidth;
			/** base unit between user and device */
			//this.unitUserToDevice;
			
			/** input metrics registered for this path */
			this.metrics = [];
			
			this.segments = [];
			
			this.graphicsContext;
		},
		
		/**
		 * get the nature of path metrics
		 * 
		 * @return nature
		 */
		getProjectionNature : function() {
			return this.nature;
		},

		/**
		 * set the nature of the path metrics
		 * 
		 * @param nature
		 */
		setProjectionNature : function(nature) {
			this.nature = nature;
		},
		/**
		 * get the window2D
		 */
		getProjection : function() {
			return projection;
		},

		/**
		 * set the window2D
		 * 
		 * @param window2d
		 */
		setProjection : function(projection) {
			this.projection = projection;
		},
		
		/**
		 * set the ranges values of the path *
		 * 
		 * @param min
		 *            the minimum user metrics value for this path to set
		 * @param max
		 *            the maximum user metrics value for this path to set
		 * 
		 */
		setRange : function(min,max) {
			this.min = min;
			this.max = max;
		},

		/**
		 * get the minimum value of the path
		 * 
		 * @return minimum user metrics for this path
		 */
		getMin : function() {
			return this.min;
		},

		/**
		 * set the minimum user value of the path *
		 * 
		 * @param min
		 *            the minimum user metrics for this path to set
		 */
		setMin : function(min) {
			this.min = min;
		},

		/**
		 * get the maximum value of the path
		 * 
		 * @return maximum user metrics value for this path
		 */
		getMax : function() {
			return this.max;
		},

		/**
		 * set the maximum user value of the path
		 * 
		 * @param max
		 *            the maximum user metrics value for this path to set
		 */
		setMax : function( max) {
			this.max = max;
		},

		
		
		/**
		 * scale the manager between two space and assign delegate super geometry
		 * path for all method that have to use geometry.
		 */
		createPath : function() {
			if(this.extPath !== undefined)
				this.svgPathElement = this.extPath.attr('id',this.Id+'_path').attr('stroke','none').attr('fill','none').toSVG();
			else
				this.svgPathElement = new JenScript.SVGElement().attr('id',this.Id+'_path').name('path').attr('stroke','none').attr('fill','none').attr('d',this.buildPath()).buildHTML();
			
			this.geometryPath = new JenScript.GeometryPath(this.svgPathElement);
			this.lengthPathDevice = this.geometryPath.lengthOfPath();
			//this.userWidth = this.max - this.min;
			//this.unitUserToDevice = this.lengthPathDevice / this.userWidth;
			if(this.graphicsContext !== undefined){
				this.graphicsContext.deleteGraphicsElement(this.Id);
				this.graphicsContext.definesSVG(this.svgPathElement);
			}
		},

		/**
		 * add pre initialized metric {@link GlyphMetric} to this general path.
		 * @param metric
		 */
		addMetric : function(metric) {
//			if (volatileMetrics.contains(metric)) {
//				return;
//			}
			this.metrics[this.metrics.length]= metric;
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
			console.log('general metrics path get Metrics');
			this.createPath();
			
			if(this.svgPathElement === undefined)
				return;
			
			//console.log("geometry length of path : "+this.geometryPath.lengthOfPath());
			if (this.geometryPath.lengthOfPath() === 0) {
				return [];
			}
			for (var i = 0; i < this.metrics.length; i++) {
				var m = this.metrics[i];
				if (m.getValue() < this.getMin() || m.getValue() > this.getMax()) {
					throw new Error("metrics value out of path range :" + m.getValue());
				}
				
				var userVal = m.getValue();
				
				var deviceLength = this.lengthPathDevice * (userVal - this.min)/(this.max - this.min);
				var percent = deviceLength/this.lengthPathDevice*100;
				m.setLengthOnPath(deviceLength);
				m.setPercentOnPath(percent);
				m.setMetricPointRef(this.geometryPath.pointAtLength(deviceLength));
				m.setMetricAngle(this.geometryPath.angleAtLength(deviceLength).deg);
				
				
				
//				m.setMetricGlyphMarker(new Marker(geometry.pointAtLength((float) deviceLength)));
//				m.setFont(vm.getFont());
//				m.setGlyphMetricDraw(vm.getGlyphMetricDraw());
//				m.setGlyphMetricFill(vm.getGlyphMetricFill());
//				m.setGlyphMetricEffect(vm.getGlyphMetricEffect());
//				m.setGlyphMetricMarkerPainter(vm.getGlyphMetricMarkerPainter());
				
				//point base
				var r = m.getMetricPointRef();
				var svgRect = new JenScript.SVGCircle().center(r.x,r.y).radius(3).fill('black');
				this.graphicsContext.insertSVG(svgRect.toSVG());
				
				//radial point
				var r2 = m.getRadialPoint(10,'Right');
				//alert('r2:'+r2);
				var svgRect2 = new JenScript.SVGRect().origin(r2.x,r2.y).size(3,3).fill('red');
				this.graphicsContext.insertSVG(svgRect2.toSVG());
				
				//ortho right point
				var r3 = m.getOrthoRightPoint(0,15);
				var svgRect3 = new JenScript.SVGRect().origin(r3.x,r3.y).size(3,3).fill('green');
				this.graphicsContext.insertSVG(svgRect3.toSVG());
				
				//ortho right point
				var r4 = m.getOrthoRightPoint(0,-10);
				var svgRect4 = new JenScript.SVGRect().origin(r4.x,r4.y).size(3,3).fill('blue');
				this.graphicsContext.insertSVG(svgRect4.toSVG());



				//.attr('transform','rotate(0 '+m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')')
				var svgText = new JenScript.SVGText().textAnchor('middle').attr('id',this.Id+'_metrics'+i).attr('transform','rotate('+m.getRotate()+' ' +m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')').fill(JenScript.RosePalette.HENNA).stroke('white').strokeWidth(0.5).fontSize(20);
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
				
				//this.graphicsContext.insertSVG(svg);
				
//				if (m.getStylePosition() === 'Tangent') {
//					if(this.revertMode === 'RevertIfNeed'){
//						if(s.getStartPositionOfChar(0).x > s.getEndPositionOfChar(s.getNumberOfChars()-1).x){
//							//console.log("need revert");
//							document.getElementById(this.Id+'_metrics'+i).setAttribute('transform','rotate(180 ' +m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')');
//						}
//					}
//					else if(this.revertMode === 'Revert'){
//						document.getElementById(this.Id+'_metrics'+i).setAttribute('transform','rotate(180 ' +m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')');
//					}
//				}else{
//					if(s.getStartPositionOfChar(0).x > s.getEndPositionOfChar(s.getNumberOfChars()-1).x){
//						//console.log("need revert");
//						document.getElementById(this.Id+'_metrics'+i).setAttribute('transform','rotate('+(-m.getMetricAngle())+' ' +m.getMetricPointRef().x+' '+m.getMetricPointRef().y+')');
//					}else{
//						//console.log("not need revert");
//					}
//				}
				//console.log('draw text : '+m.getMetricsLabel());
				//console.log('computed length : '+s.getComputedTextLength());
				//console.log('number of char : '+s.getNumberOfChars());
				
				for (var j = 0; j < s.getNumberOfChars(); j++) {
					//console.log('char extends :'+s.getExtentOfChar(j));
					//var vv = s.getExtentOfChar(j);
					//var extendsChar = new JenScript.SVGRect().origin(vv.x,vv.y).size(vv.width,vv.height).stroke('red').fillNone();
					//g2d.insertSVG(extendsChar.toSVG());
					//g2d.insertSVG(s.getExtentOfChar(j));
					//console.log('char position start :'+s.getStartPositionOfChar(j).x+','+s.getStartPositionOfChar(j).y);
					//console.log('char position end   :'+s.getEndPositionOfChar(j).x+','+s.getEndPositionOfChar(j).y);
					//var marker = new JenScript.SVGCircle().center(s.getStartPositionOfChar(j).x,s.getStartPositionOfChar(j).y).radius(2).fill('black');
					//g2d.insertSVG(marker.toSVG());
				}
				//console.log(s.getNumberOfChars());
				//console.log(s.getCharNumAtPosition(s.getStartPositionOfChar('2')));
				
//				if (m.getStylePosition() == StylePosition.Tangent) {
//
//					AffineTransform af = new AffineTransform();
//					float gvWidth = GlyphUtil.getGlyphWidth(glyphVector);
//
//					float startLength = (float) deviceLength - gvWidth / 2;
//					float endLength = (float) deviceLength + gvWidth / 2;
//
//					Point2D pointStart = geometry.pointAtLength(startLength);
//					Point2D pointEnd = geometry.pointAtLength(endLength);
//					m.setPointStart(pointStart);
//					m.setPointEnd(pointEnd);
//
//					if (pointStart == null || pointEnd == null) {
//						continue;
//					}
//
//					boolean needRevert = m.isLockReverse();
//					if (isAutoReverseGlyph()) {
//						if (pointStart.getX() > pointEnd.getX()) {
//							needRevert = true;
//						}
//					}
//
//					for (int j = 0; j < glyphVector.getNumGlyphs(); j++) {
//
//						Point2D p = glyphVector.getGlyphPosition(j);
//						float px = (float) p.getX();
//						float py = (float) p.getY();
//						Point2D pointGlyph;
//
//						if (!needRevert) {
//							pointGlyph = geometry.pointAtLength(startLength + GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//						} else {
//							pointGlyph = geometry.pointAtLength(endLength - GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//						}
//
//						if (pointGlyph == null) {
//							continue;
//						}
//
//						m.addGlyphPoint(pointGlyph);
//
//						af.setToTranslation(pointGlyph.getX(), pointGlyph.getY());
//
//						float angle = 0;
//
//						if (!needRevert) {
//							angle = geometry.angleAtLength(startLength + GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//						} else {
//							angle = geometry.angleAtLength(endLength - GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//						}
//
//						if (!needRevert) {
//							af.rotate(angle);
//						} else {
//							af.rotate(angle + Math.PI);
//						}
//
//						af.translate(-px, -py + glyphVector.getVisualBounds().getHeight() / 2 - m.getDivergence());
//
//						Shape glyph = glyphVector.getGlyphOutline(j);
//						Shape glyphTransformed = af.createTransformedShape(glyph);
//
//						Point2D srcNorth = new Point2D.Double(glyph.getBounds2D().getCenterX(), glyph.getBounds2D().getY());
//						Point2D dstNorth = new Point2D.Double();
//
//						Point2D srcSouth = new Point2D.Double(glyph.getBounds2D().getCenterX(), glyph.getBounds2D().getY() + glyph.getBounds2D().getHeight());
//						Point2D dstSouth = new Point2D.Double();
//
//						Point2D srcEast = new Point2D.Double(glyph.getBounds2D().getX() + glyph.getBounds2D().getWidth(), glyph.getBounds2D().getCenterY());
//						Point2D dstEast = new Point2D.Double();
//
//						Point2D srcWest = new Point2D.Double(glyph.getBounds2D().getX(), glyph.getBounds2D().getCenterY());
//						Point2D dstWest = new Point2D.Double();
//
//						af.transform(srcNorth, dstNorth);
//						af.transform(srcSouth, dstSouth);
//						af.transform(srcEast, dstEast);
//						af.transform(srcWest, dstWest);
//
//						GlyphGeometry metricGlyphGeometry = new GlyphGeometry(glyphTransformed, dstNorth, dstSouth, dstWest, dstEast);
//
//						m.addMetricsGlyphGeometry(metricGlyphGeometry);
//
//					}
//				}
				
				
//				if (m.getStylePosition() == StylePosition.Radial) {
//
//					float gvWidth = GlyphUtil.getGlyphWidth(glyphVector);
//					Point2D pStart = m.getRadialPoint(m.getDivergence());
//					Point2D pEnd = m.getRadialPoint((int) (m.getDivergence() + gvWidth + 10));
//
//					if (pStart == null || pEnd == null) {
//						continue;
//					}
//
//					Line2D radialFragment;
//					if (pStart.getX() > pEnd.getX()) {
//						radialFragment = new Line2D.Double(pEnd.getX(), pEnd.getY(), pStart.getX(), pStart.getY());
//					} else {
//						radialFragment = new Line2D.Double(pStart.getX(), pStart.getY(), pEnd.getX(), pEnd.getY());
//					}
//
//					AffineTransform af = new AffineTransform();
//					GeometryPath geometryRadialpath = new GeometryPath(radialFragment);
//
//					for (int j = 0; j < glyphVector.getNumGlyphs(); j++) {
//
//						Point2D p = glyphVector.getGlyphPosition(j);
//						float px = (float) p.getX();
//						float py = (float) p.getY();
//
//						Point2D pointGlyph = geometryRadialpath.pointAtLength(GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//
//						if (pointGlyph == null) {
//							continue;
//						}
//
//						m.addGlyphPoint(pointGlyph);
//						Shape glyph = glyphVector.getGlyphOutline(j);
//
//						float angle = geometryRadialpath.angleAtLength(GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//						af.setToTranslation(pointGlyph.getX(), pointGlyph.getY());
//						af.rotate(angle);
//						af.translate(-px, -py + glyphVector.getVisualBounds().getHeight() / 2);
//
//						Shape glyphTransformed = af.createTransformedShape(glyph);
//
//						// new with glyphgeometry
//						Point2D srcNorth = new Point2D.Double(glyph.getBounds2D().getCenterX(), glyph.getBounds2D().getY());
//						Point2D dstNorth = new Point2D.Double();
//
//						Point2D srcSouth = new Point2D.Double(glyph.getBounds2D().getCenterX(), glyph.getBounds2D().getY() + glyph.getBounds2D().getHeight());
//						Point2D dstSouth = new Point2D.Double();
//
//						Point2D srcEast = new Point2D.Double(glyph.getBounds2D().getX() + glyph.getBounds2D().getWidth(), glyph.getBounds2D().getCenterY());
//						Point2D dstEast = new Point2D.Double();
//
//						Point2D srcWest = new Point2D.Double(glyph.getBounds2D().getX(), glyph.getBounds2D().getCenterY());
//						Point2D dstWest = new Point2D.Double();
//
//						af.transform(srcNorth, dstNorth);
//						af.transform(srcSouth, dstSouth);
//						af.transform(srcEast, dstEast);
//						af.transform(srcWest, dstWest);
//
//						GlyphGeometry metricGlyphGeometry = new GlyphGeometry(glyphTransformed, dstNorth, dstSouth, dstWest, dstEast);
//
//						m.addMetricsGlyphGeometry(metricGlyphGeometry);
//
//						// m.addGlyphShape(glyphTransformed);
//
//					}
//
//				}

//				if (m.getStylePosition() == StylePosition.Default) {
//
//					float gvWidth = GlyphUtil.getGlyphWidth(glyphVector);
//					Point2D pRadial = m.getRadialPoint(-m.getDivergence());
//
//					Point2D pStart = new Point2D.Double(pRadial.getX() - gvWidth / 2, pRadial.getY());
//					Point2D pEnd = new Point2D.Double(pRadial.getX() + gvWidth / 2, pRadial.getY());
//
//					Line2D l = new Line2D.Double(pStart.getX(), pStart.getY(), pEnd.getX(), pEnd.getY());
//
//					AffineTransform af = new AffineTransform();
//					GeometryPath geometryRadialpath = new GeometryPath(l);
//
//					for (int j = 0; j < glyphVector.getNumGlyphs(); j++) {
//
//						Point2D p = glyphVector.getGlyphPosition(j);
//						float px = (float) p.getX();
//						float py = (float) p.getY();
//
//						Point2D pointGlyph = geometryRadialpath.pointAtLength(GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//
//						if (pointGlyph == null) {
//							continue;
//						}
//
//						Shape glyph = glyphVector.getGlyphOutline(j);
//
//						float angle = geometryRadialpath.angleAtLength(GlyphUtil.getGlyphWidthAtToken(glyphVector, j));
//						af.setToTranslation(pointGlyph.getX(), pointGlyph.getY());
//						af.rotate(angle);
//						af.translate(-px, -py + glyphVector.getVisualBounds().getHeight() / 2);
//
//						Shape glyphTransformed = af.createTransformedShape(glyph);
//						// Shape glyphTransformed =
//						// af.createTransformedShape(glyphBound2D);
//
//						Point2D srcNorth = new Point2D.Double(glyph.getBounds2D().getCenterX(), glyph.getBounds2D().getY());
//						Point2D dstNorth = new Point2D.Double();
//
//						Point2D srcSouth = new Point2D.Double(glyph.getBounds2D().getCenterX(), glyph.getBounds2D().getY() + glyph.getBounds2D().getHeight());
//						Point2D dstSouth = new Point2D.Double();
//
//						Point2D srcEast = new Point2D.Double(glyph.getBounds2D().getX() + glyph.getBounds2D().getWidth(), glyph.getBounds2D().getCenterY());
//						Point2D dstEast = new Point2D.Double();
//
//						Point2D srcWest = new Point2D.Double(glyph.getBounds2D().getX(), glyph.getBounds2D().getCenterY());
//						Point2D dstWest = new Point2D.Double();
//
//						af.transform(srcNorth, dstNorth);
//						af.transform(srcSouth, dstSouth);
//						af.transform(srcEast, dstEast);
//						af.transform(srcWest, dstWest);
//
//						GlyphGeometry metricGlyphGeometry = new GlyphGeometry(glyphTransformed, dstNorth, dstSouth, dstWest, dstEast);
//
//						m.addMetricsGlyphGeometry(metricGlyphGeometry);
//
//					}
//				}

			}

			return this.metrics;
		},

		/**
		 * get the device metrics point for the given metrics value
		 * 
		 * @param metricsValue
		 *            metrics value
		 * @return metrics device point {@link Point2D}
		 * @throws IllegalArgumentException
		 * @throws if
		 *             metrics value is out of dimension minimum and maximum bound
		 *             segment
		 */
		getMetricsPoint : function(metricsValue) {
			if (metricsValue < this.getMin() || metricsValue > this.getMax()) {
				throw new Error('metrics value out of path range.');
			}
			if (metricsValue === this.getMax()) {
				return geometryPath.pointAtLength(geometry.lengthOfPath());
			}
			//var deviceLength = this.unitUserToDevice * metricsValue;
			var deviceLength = this.lengthPathDevice * (metricsValue - this.min)/(this.max - this.min);
			return this.geometryPath.pointAtLength(deviceLength);
		},

		getSegments : function(){
			return this.segments;
		},
		
		buildPath : function(){
			var path='';
			var segments = this.segments;
			
			var nature = this.nature;
			var proj = this.projection;
			var toX = function(x){
				if(nature === 'User'){
					return proj.userToPixelX(x);
				}else if(nature === 'Device'){
					return x;
				}
			};
			var toY = function(y){
				if(nature === 'User'){
					return proj.userToPixelY(y);
				}else if(nature === 'Device'){
					return y;
				}
			};
			
			for (var i = 0; i < segments.length; i++) {
				if(segments[i].type === 'M')
					path = path  + segments[i].type+toX(segments[i].x)+','+toY(segments[i].y)+' ';
				if(segments[i].type === 'L')
					path = path  + segments[i].type+toX(segments[i].x)+','+toY(segments[i].y)+' ';
				if(segments[i].type === 'Q')
					path = path  + segments[i].type+toX(segments[i].x1)+','+toY(segments[i].y1)+' '+toX(segments[i].x)+','+toY(segments[i].y)+' ';
				if(segments[i].type === 'C')
					path = path  + segments[i].type+toX(segments[i].x1)+','+toY(segments[i].y1)+' '+toX(segments[i].x2)+','+toY(segments[i].y2)+' '+toX(segments[i].x)+','+toY(segments[i].y)+' ';
				if(segments[i].type === 'A')
					path = path  + segments[i].type+segments[i].rx+','+segments[i].ry+' '+segments[i].xAxisRotation+' '+segments[i].largeArcFlag+','+segments[i].sweepFlag+' '+toX(segments[i].x)+','+toY(segments[i].y)+' ';
				if(segments[i].type === 'Z')
					path = path  + segments[i].type+' ';
			}
			this.pathdata = path;
			return path;
		},
		

		
		registerSegment : function(fragment){
			this.segments[this.segments.length] = fragment;
			//if(this.buildAuto)
			//	this.attr('d',this.buildPath());
			return this;
		},
		
		
		moveTo : function(x,y){
			this.registerSegment({type : 'M',x:x,y:y});
			return this;
		},
		lineTo : function(x,y){
			this.registerSegment({type : 'L',x:x,y:y});
			return this;
		},
		curveTo : function(x1,y1,x2,y2,x,y){
			this.registerSegment({type : 'C',x1:x1,y1:y1,x2:x2,y2:y2,x:x,y:y});
			return this;
		},
		smoothCurveTo : function(x2,y2,x,y){
			this.registerSegment({type : 'S',x2:x2,y2:y2,x:x,y:y});
			return this;
		},
		quadTo : function(x1,y1,x,y){
			this.registerSegment({type : 'Q',x1:x1,y1:y1,x:x,y:y});
			return this;
		},
		smoothQuadTo : function(x,y){
			this.registerSegment({type : 'T',x:x,y:y});
			return this;
		},
		arcTo : function(rx,ry,xAxisRotation,largeArcFlag,sweepFlag,x,y){
			this.registerSegment({type : 'A',rx:rx,ry:ry,xAxisRotation:xAxisRotation,largeArcFlag:largeArcFlag,sweepFlag:sweepFlag,x:x,y:y});
			return this;
		},
		close : function(){
			this.registerSegment({type : 'Z'});
			return this;
		}
		
	});
	
})();
(function(){
	JenScript.SelectorPlugin = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SelectorPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.SelectorPlugin,{
		_init: function(config){
			config = config||{};
			config.name='SelectorPlugin';
			JenScript.Plugin.call(this,config);
			this.press = false;
			this.selectors = [];
			this.contextualized = true;
		},
		
		/**
		 * get selector plugin string representation
		 */
		toString : function(){
			return 'SelectorPlugin';
		},
		
		/**
		 * override function
		 * get the selectors part graphics context
		 * @param {String} part
		 * @returns {Object} plugin graphics context
		 */
		getGraphicsContext : function(part){
			return new JenScript.Graphics({definitions : this.view.svgSelectorsDefinitions,graphics : this.view.svgSelectorsGraphics});
		},
		
		
		/**
		 * override function
		 * repaint 
		 */
		repaintPlugin : function(caller){
			//console.log('Selector plugin repaint, call by '+caller);
			this.repaintPluginPart(JenScript.ViewPart.South);
			this.repaintPluginPart(JenScript.ViewPart.North);
			this.repaintPluginPart(JenScript.ViewPart.East);
			this.repaintPluginPart(JenScript.ViewPart.West);
			this.repaintPluginPart(JenScript.ViewPart.Device);
		},
		
		
		/**
		 * override function
		 * repaint part 
		 */
		repaintPluginPart : function(part){
			var graphics = this.getGraphicsContext(part);
			graphics.clearGraphics();
			this.paintPlugin(graphics,part);
		},
		
	    /**
		 * paint plugin view part
		 *  @param {Object} graphics context
		 *  @param {Object} view part
		 */
	    paintPlugin : function(g2d,viewPart) {
	    	if(this.isLockPassive()) return;
	        if (viewPart === JenScript.ViewPart.Device && this.view.projections.length > 1) {
	        	this.paintSelectors(g2d,viewPart);
	        }
	    },
		
		/**
		 * get view
		 * @returns {Object} view
		 */
		getView : function() {
	        return this.view;
	    },
	    
	    /**
		 * set view
		 * @param {Object} view
		 */
	    setView : function(view) {
	        this.view=view;
	        var that = this;
			view.addViewListener('projectionActive',function(){
				that.repaintPlugin();
			},'Projection active listener, create for internal selector plugin');
	    },
	    
	    /**
	     * on press plugin handler
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	   onPress : function(event,part,x, y) {
		   if(part !== 'Device') return;
		    var x2View = this.getView().west+x;
	    	var y2View = this.getView().north+y;
	    	for(var i = 0 ;i< this.selectors.length;i++){
	    		if(this.selectors[i].sensible.getBound2D().contains(x2View,y2View)){
	   				var p = this.selectors[i].projection;
	   				if(!p.isActive()){
	   					this.openSelector(this.selectors[i]);
	   					return true;
	   				}
   				}
	   		}
		    return false;
		},
		
		/**
		 * open the given projection
		 * @param {Object} projection
		 */
		openSelector : function(selector) {
			if(this.openingSelector)return;//prevent other click
			var that = this;
			this.openingSelector = true;
			var projection = selector.projection;
			
			
			that.getView().setActiveProjection(projection);
			that.openingSelector = false;
			
//			var run = function(i,callback){
//				setTimeout(function(){
//					that.processOpeningSelector(selector,i);
//					callback(i);
//				},i*30);
//				
//			};
//			for(var i=1;i<=10;i++){
//				run(i,function callback(rank){
//					if(rank === 10){
//						that.getView().setActiveProjection(projection);
//						that.openingSelector = false;
//				    	document.getElementById(selector.Id).setAttribute('x',selector.x);
//				    	document.getElementById(selector.Id).setAttribute('y',selector.y);
//				    	document.getElementById(selector.Id).setAttribute('width','10%');
//				    	document.getElementById(selector.Id).setAttribute('height','10%');
//				    	that.checkSelectorSelectedOutline();
//					}
//				});
//			}
		 },
		 
		/**
		 * paint the opening projection
		 */
		 processOpeningSelector : function(selector,factor) {
			if(!this.openingSelector)return;
	    	document.getElementById(selector.Id).setAttribute('x',0);
	    	document.getElementById(selector.Id).setAttribute('y',0);
	    	document.getElementById(selector.Id).setAttribute('width',factor*10+'%');
	    	document.getElementById(selector.Id).setAttribute('height',factor*10+'%');
		},
		
		checkSelectorSelectedOutline : function(){
			for(var i = 0;i<this.selectors.length;i++){
	    		var s = this.selectors[i];
	    		if(s.projection.isActive()){
	    			s.outlineElement.setAttribute('stroke','cyan');
	    		}else{
	    			s.outlineElement.setAttribute('stroke','gray');
	    		}
	    	}
		},
		
		/**
		 * paint static projection selector
		 *  @param {Object} graphics context
		 *  @param {Object} view part
		 */
		paintSelectors : function(g2d,viewPart) {
			if(this.isLockPassive()) return;
			if (viewPart !== JenScript.ViewPart.Device) return;
	    		
				this.selectors=[];
	    		var view = this.getView();
	    		var projections = view.getProjections();
	    		var startX = view.west+10;
	    		var startY = view.north+10;
	    		for(var i = 0;i<projections.length;i++){
	    			var proj = projections[i];
	    			var svg = document.createElementNS(JenScript.SVG_NS,"use");
    	    		if(svg !== undefined){
    	    			var selectorId = 'selector_'+view.Id+'_'+proj.Id;
    	    			svg.setAttribute('id',selectorId);
    	    			svg.setAttribute('x',startX);
    	    			svg.setAttribute('opacity',1);
    	    			svg.setAttribute('y',startY);
    	    			svg.setAttribute('width','10%');
    	    			svg.setAttribute('height','10%');
    	    			//svg.setAttribute('preserveAspectRatio','xMinYMin slice');
    	    			//svg.setAttribute('preserveAspectRatio','xMinYMin');
    	    			svg.setAttributeNS(JenScript.XLINK_NS, 'xlink:href','#'+proj.Id);
    	    			g2d.insertSVG(svg);
    	    			
    	    			var projRect = new JenScript.SVGRect().origin(startX,startY).size(view.width*0.1,view.height*0.1);
	    	    						
    	    			projRect.fillNone().strokeWidth(0.6);
    	    			var outline = projRect.toSVG();
    	    			g2d.insertSVG(outline);
    	    			
    	    			this.selectors[this.selectors.length] = {Id :selectorId, x:startX,y:startY,projection : proj,svg:svg, outlineElement : outline,sensible :projRect};
    	    			startX = startX + view.width*0.1 + 10;
    	    		}
    			}
	    		this.checkSelectorSelectedOutline();
		},
		
		/**
		 * paint static projection selector
		 *  @param {Object} graphics context
		 *  @param {Object} view part
		 */
		paintSelectorsOLD : function(g2d,viewPart) {
			if(this.isLockPassive()) return;
			if (viewPart !== JenScript.ViewPart.Device) return;
	    		
				this.selectors=[];
	    		var view = this.getView();
	    		var projections = view.getProjections();
	    		var startX = view.west+10;
	    		var startY = view.north+10;
	    		for(var i = 0;i<projections.length;i++){
	    			var proj = projections[i];
	    			//var svg = proj.svgRootElement.cloneNode(true);
	    			var svg = document.createElement('use');
    	    		if(svg !== undefined){
    	    			var selectorId = 'selector_'+view.Id+'_'+proj.Id;
    	    			svg.removeAttribute('xmlns');
    	    			svg.removeAttribute('version');
    	    			svg.setAttribute('id',selectorId);
    	    			svg.setAttribute('x',startX);
    	    			svg.setAttribute('opacity',1);
    	    			svg.setAttribute('y',startY);
    	    			svg.setAttribute('width','10%');
    	    			svg.setAttribute('height','10%');
    	    			//svg.setAttribute('preserveAspectRatio','xMinYMin slice');
    	    			svg.setAttribute('preserveAspectRatio','xMinYMin');
    	    			g2d.insertSVG(svg);
    	    			
    	    			var projRect = new JenScript.SVGRect().origin(startX,startY).size(view.width*0.1,view.height*0.1);
	    	    						
	    	    		//if(proj.isActive()){
    	    			projRect.fillNone().strokeWidth(0.6);
    	    			var outline = projRect.toSVG();
    	    			g2d.insertSVG(outline);
    	    			
    	    			//}
    	    			this.selectors[this.selectors.length] = {Id :selectorId, x:startX,y:startY,projection : proj,svg:svg, outlineElement : outline,sensible :projRect};
    	    			startX = startX + view.width*0.1 + 10;
    	    		}
    			}
	    		this.checkSelectorSelectedOutline();
		},
	});
	
	
})();
(function(){
	/**
	 * Object JenScript.ViewBackground()
	 * @constructor
	 * @memberof JenScript
	 * @param {Object} config
	 */
	JenScript.ViewBackground = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.ViewBackground, {
		
		/**
		 * Initialize view background
		 * @param {Object} config
		 */
		init : function(config){
			config = config||{};
			this.Id='background'+JenScript.sequenceId++;
			this.clipId = 'backgroundclip'+JenScript.sequenceId++;
			this.clipable = false;
			
		},
		
		/**
		 * get this background Id
		 * @returns {String} this background Id
		 */
		getId : function(){
			return this.Id;
		},
		
		/**
		 * get the clip Id of this background
		 * @returns {String} this background clip Id
		 */
		getClipId : function(){
			return this.clipId;
		},
		
		/**
		 * get graphics context of this background
		 * @returns {Object} this background graphics context
		 */
		getGraphics : function(){
			return this.g2d;
		},
		
		/**
		 * return true if the clip should be apply on this background, false otherwise
		 * @returns {Boolean} true if the clip should be apply on this background, false otherwise
		 */
		isClipable : function(){
			return this.clipable;
		},
		
		/***
		 * clip the given shape with this background clip path
		 * @param {Object} shape
		 */
		clip : function(shape){
			if(this.isClipable()){
				shape.clip(this.getClipId());
			}
		},
		
		/**
		 * get clip for this background
		 * @returns {Object} svg clip path
		 */
		getClip : function(){
			var clips = this.view.getBackgroundClip(this);
			var clip = undefined;
			if(clips.length > 0){
				clip = new JenScript.SVGClipPath().Id(this.clipId);
				for (var i = 0; i < clips.length; i++) {
					clip.appendPath(clips[i]);
				}
			}
			return clip;
		},
		
		/**
		 * takes teh responsibility to paint the background.
		 * prepares and defines the clip path
		 * call paintViewBackground
		 */
		paint : function(){
			this.getGraphics().clearGraphics();
			var clip = this.getClip();
			if(clip !== undefined){
				this.getGraphics().definesSVG(clip.toSVG());
				this.clipable = true;
			}
			this.paintViewBackground(this.view,this.getGraphics());
		},
		
		/**
		 * Override this method
		 * get this background clip path
		 */
		getBackgroundPath  : function(){throw new Error('Abstract View Background, getBackgroundPath method should be provide by override.');},
		
		/**
		 * Override this method to provide paint this background
		 * @param {Object} view host view
		 * @param {Object} g2d  graphics context
		 * 
		 */
		paintViewBackground : function(view,g2d){throw new Error('Abstract View Background, paintViewBackground method should be provide by override.');}
	});
	
	
	
	/**
	 * Object JenScript.RectViewBackground()
	 * Defines rectangular view background
	 * @constructor
	 * @extends ViewBackground
	 * @param {Object} config
	 * @param {Number} [config.opacity] opacity, default 1
	 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
	 */
	JenScript.RectViewBackground = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.RectViewBackground,JenScript.ViewBackground);
	JenScript.Model.addMethods(JenScript.RectViewBackground, {
		/**
		 * Initialize rectangular view background
		 * @param {Object} config
		 * @param {Number} [config.opacity] opacity, default 1
		 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
		 */
		_init : function(config){
			config = config || {};
			this.opacity = (config.opacity !== undefined)? config.opacity :1;
			this.cornerRadius = (config.cornerRadius !== undefined)? config.cornerRadius :10;
			JenScript.ViewBackground.call(this,config);
		},
		
		/**
		 * get this rectangular background path
		 * @returns background path
		 */
		getBackgroundPath  : function(){
			return  new JenScript.SVGRect().origin(0,0)
			 								.size(this.view.width,this.view.height)
			 								.radius(this.cornerRadius,this.cornerRadius);
		},
	});
	
	/**
	 * Object JenScript.GradientViewBackground()
	 * Defines outline view background
	 * @constructor
	 * @extends JenScript.RectViewBackground
	 * @param {Object} config
	 * @param {String} [config.strokeColor] stroke color, default black 
     * @param {Number} [config.strokeWidth] stroke width, default 1
	 * @param {Number} [config.opacity] opacity, default 1
	 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
	 */
	JenScript.ViewOutlineBackground = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ViewOutlineBackground,JenScript.RectViewBackground);
	JenScript.Model.addMethods(JenScript.ViewOutlineBackground, {
		/**
		 * Initialize outline view background
		 * @param {Object} config
		 * @param {String} [config.strokeColor] stroke color, default black 
		 * @param {Number} [config.strokeWidth] stroke width, default 1
		 * @param {Number} [config.opacity] opacity, default 1
		 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
		 */
		__init : function(config){
			config = config || {};
			this.strokeColor = (config.strokeColor !== undefined)? config.strokeColor : 'black';
			this.strokeWidth = (config.strokeWidth !== undefined)? config.strokeWidth :1;
			JenScript.RectViewBackground.call(this,config);
		},
		
		/**
		 * paint outline view background
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewBackground : function(view,g2d){
			var cornerRadius = this.cornerRadius;
			var cr = this.cornerRadius;
			var sw = this.strokeWidth;
			var outer = new JenScript.SVGPath().Id(this.Id);
			outer.moveTo(0,cr).arcTo(cr,cr,0,0,1,cr,0).lineTo((view.width-cornerRadius),0).arcTo(cr,cr,0,0,1,view.width,cr).lineTo(view.width,view.height-cr).arcTo(cr,cr,0,0,1,view.width-cr,view.height).lineTo(cr,view.height).arcTo(cr,cr,0,0,1,0,view.height-cr).lineTo(0,cr);
			//outer.moveTo(sw,cr).arcTo(cr-sw,cr-sw,0,0,1,cr,sw).lineTo((view.width-cornerRadius),sw).arcTo(cr,cr,0,0,1,view.width-sw,cr).lineTo(view.width-sw,view.height-cr).arcTo(cr-sw,cr-sw,0,0,1,view.width-cr,view.height-sw).lineTo(cr,view.height-sw).arcTo(cr-sw,cr-sw,0,0,1,sw,view.height-cr).lineTo(sw,cr);
			outer.moveTo(sw,cr+sw).arcTo(cr,cr,0,0,1,cr+sw,sw).lineTo((view.width-cr-sw),sw).arcTo(cr,cr,0,0,1,view.width-sw,cr+sw).lineTo(view.width-sw,view.height-cr-sw).arcTo(cr,cr,0,0,1,view.width-cr-sw,view.height-sw).lineTo(cr+sw,view.height-sw).arcTo(cr,cr,0,0,1,sw,view.height-cr-sw).lineTo(sw,cr+sw);
			outer.attr('fill-rule','evenodd').opacity(this.opacity);
			this.clip(outer);
			outer.fill(this.strokeColor).strokeNone().opacity(this.opacity);
			g2d.insertSVG(outer.toSVG());
		}
	});
	
	/**
	 * Object JenScript.GradientViewBackground()
	 * Defines gradient view fill background
	 * @constructor
	 * @extends JenScript.RectViewBackground
	 * @param {Object} config
	 * @param {Object} shader
	 * @param {Array}  [config.shader.percents] string percents array
	 * @param {Array}  [config.shader.colors] string color array
	 * @param {Number} [config.opacity] opacity, default 1
	 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
	 */
	JenScript.GradientViewBackground = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GradientViewBackground,JenScript.RectViewBackground);
	JenScript.Model.addMethods(JenScript.GradientViewBackground, {
		/**
		 * Initialize gradient view fill background
		 * @param {Object} config
		 * @param {Object} shader
		 * @param {Array}  [config.shader.percents] string percents array
		 * @param {Array}  [config.shader.colors] string color array
		 * @param {Number} [config.opacity] opacity, default 1
		 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
		 */
		__init : function(config){
			config = config || {};
			this.gradientId = 'gradient'+JenScript.sequenceId++;
			this.shader = (config.shader !== undefined)?config.shader: {percents :['0%','100%'],colors:['rgb(32, 39, 55)','black']};
			JenScript.RectViewBackground.call(this,config);
		},
		
		/**
		 * paint gradient view background
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewBackground : function(view,g2d){
				var gradient= new JenScript.SVGLinearGradient().Id(this.gradientId).from(0,0).to(0, view.getHeight()).shade(this.shader.percents,this.shader.colors);
				g2d.definesSVG(gradient.toSVG());
				var background = new JenScript.SVGRect().Id(this.Id)
														 .origin(0,0)
														 .size(view.width,view.height)
														 .radius(this.cornerRadius,this.cornerRadius);
				background.fillURL(this.gradientId).strokeNone().opacity(this.opacity);
				this.clip(background);
				g2d.insertSVG(background.toSVG());
		}
	});
	
	/**
	 * Object JenScript.TexturedViewBackground()
	 * Defines view textured fill background
	 * @constructor
	 * @extends JenScript.RectViewBackground
	 * @param {Object} config
	 * @param {Object} [config.texture] texture
	 * @param {Number} [config.opacity] opacity, default 1
	 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
	 */
	JenScript.TexturedViewBackground = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TexturedViewBackground,JenScript.RectViewBackground);
	JenScript.Model.addMethods(JenScript.TexturedViewBackground, {
		/**
		 * Initialized texture view fill background
		 * @param {Object} config
		 * @param {Object} [config.texture] texture
		 * @param {Number} [config.opacity] opacity, default 1
		 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
		 */
		__init : function(config){
			this.texture = (config.texture !== undefined)? config.texture : JenScript.Texture.getTriangleCarbonFiber();
			JenScript.RectViewBackground.call(this,config);
		},
		
		/**
		 * paint texture view background
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewBackground : function(view,g2d){
	 		view.definesTexture(this.texture);
	 		var background = new JenScript.SVGRect().Id(this.Id)
													 .origin(0,0)
													 .size(view.width,view.height)
													 .radius(this.cornerRadius,this.cornerRadius);
			background.fillURL(this.texture.getId()).strokeNone().opacity(this.opacity);
			this.clip(background);
			g2d.insertSVG(background.toSVG());
		}
	});
	
	/**
	 * Object JenScript.DualViewBackground()
	 * Define a dual color or texture view background for outer (west, east, south, north) and inner part(device)
	 * @constructor
	 * @extends JenScript.RectViewBackground
	 * @param {Object} config
	 * @param {Object} [config.texture1] texture for outer (west, east, south, north)
	 * @param {Object} [config.texture2] texture for inner device
	 * @param {Object} [config.color1] color for outer (west, east, south, north) if texture1 is not provide, black default value
	 * @param {Object} [config.color2] color for inner device, rgb(32, 39, 55) default value 
	 * @param {Number} [config.opacity] opacity, default 1
	 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
	 */
	JenScript.DualViewBackground = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.DualViewBackground,JenScript.RectViewBackground);
	JenScript.Model.addMethods(JenScript.DualViewBackground, {
		/**
		 * Define a dual color or texture view background for outer (west, east, south, north) and inner part(device)
		 * @param {Object} config
		 * @param {Object} [config.texture1] texture for outer (west, east, south, north)
		 * @param {Object} [config.texture2] texture for inner device
		 * @param {Object} [config.color1] color for outer (west, east, south, north) if texture1 is not provide, black default value
		 * @param {Object} [config.color2] color for inner device, rgb(32, 39, 55) default value
		 * @param {Number} [config.opacity] opacity, default 1
		 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
		 */
		__init : function(config){
			this.texture1 = config.texture1;
			this.texture2 = config.texture2;
			this.color1 = (config.color1 !== undefined)? config.color1 : 'black';
			this.color2 = (config.color2 !== undefined)? config.color2 : 'rgb(32, 39, 55)';
			JenScript.RectViewBackground.call(this,config);
		},
		
		/**
		 * paint dual view background
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewBackground : function(view,g2d){
	 		if(this.texture1 !== undefined) view.definesTexture(this.texture1);
	 		if(this.texture2 !== undefined) view.definesTexture(this.texture2);
			var cornerRadius = this.cornerRadius;
			var outer = new JenScript.SVGPath().Id(this.Id);
			outer.moveTo(0,cornerRadius).quadTo(0,0,cornerRadius,0).lineTo((view.width-cornerRadius),0).quadTo(view.width,0,view.width,cornerRadius)
							.lineTo(view.width,(view.height-cornerRadius)).quadTo(view.width,view.height,(view.width-cornerRadius),view.height).
							lineTo(cornerRadius,view.height).quadTo(0,view.height,0,(view.height-cornerRadius)).lineTo(0,cornerRadius)
							.moveTo(view.west,view.north).lineTo(view.width-view.east,view.north)
							.lineTo(view.width-view.east,view.height-view.south).lineTo(view.west,view.height-view.south).lineTo(view.west,view.north);
			
			outer.attr('fill-rule','evenodd').opacity(this.opacity);
			if(this.texture1 !== undefined)
				outer.fillURL(this.texture1.getId());
			else
				outer.fill(this.color1);
			
			this.clip(outer);
			g2d.insertSVG(outer.toSVG());
			
			var inner = new JenScript.SVGRect().Id(this.Id).origin(view.west,view.north)
						 .size(view.devicePart.width,view.devicePart.height)
						 .opacity(this.opacity)
						 .strokeNone().fillNone();
			if(this.texture2 !== undefined)
				inner.fillURL(this.texture2.getId());
			else
				inner.fill(this.color2);
			
			this.clip(inner);
			g2d.insertSVG(inner.toSVG());
		}
	});	
})();
(function(){
	
	
	/**
	 * Object ViewForeground()
	 * @constructor
	 * @param {Object} config
	 */
	JenScript.ViewForeground = function(){
		this.init();
	};
	JenScript.Model.addMethods(JenScript.ViewForeground, {
		/**
		 * Initialize abstract view foreground
		 * @param {Object} config
		 */
		init : function(config){
			config = config||{};
			this.Id='foreground'+JenScript.sequenceId++;
			this.clipId = 'foregroundclip'+JenScript.sequenceId++;
			this.clipable = false;
		},
		
		/**
		 * get this foreground Id
		 * @returns {String} this foreground Id
		 */
		getId : function(){
			return this.Id;
		},
		
		/**
		 * get graphics context of this foreground
		 * @returns {Object} this foreground graphics context
		 */
		getGraphics : function(){
			return this.g2d;
		},
		
		/**
		 * get the clip Id of this foreground
		 * @returns {String} this foreground clip Id
		 */
		getClipId : function(){
			return this.clipId;
		},
		
		/**
		 * return true if the clip should be apply on this foreground, false otherwise
		 * @returns {}
		 */
		isClipable : function(){
			return this.clipable;
		},
		
		/***
		 * clip the given shape with this foreground clip path
		 * @param {Object} shape
		 */
		clip : function(shape){
			if(this.isClipable()){
				shape.clip(this.getClipId());
			}
		},
		
		/**
		 * get clip for this foreground
		 */
		getClip : function(){
			var clips = this.view.getBackgroundClip(this);
			var clip = undefined;
			if(clips.length > 0){
				clip = new JenScript.SVGClipPath().Id(this.clipId);
				for (var i = 0; i < clips.length; i++) {
					clip.appendPath(clips[i]);
				}
			}
			return clip;
		},
		
		/**
		 * takes teh responsibility to paint the foreground.
		 * prepares and defines the clip path
		 * call paintViewForeground
		 */
		paint : function(){
			this.getGraphics().clearGraphics();
			var clip = this.getClip();
			if(clip !== undefined){
				this.getGraphics().definesSVG(clip.toSVG());
				this.clipable = true;
			}
			this.paintViewForeground(this.view,this.getGraphics());
		},
		
		/**
		 * paint view foreground, provide method by override.
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewForeground : function(view,g2d){throw new Error('Abstract View Foreground, method should be overriden.');}
	});
	
	
	
	
	
	/**
	 * Object JenScript.TextViewForeground()
	 * Defines Text Foreground
	 * @param {Object} config
	 * @param {String} [config.text] text to draw in foreground
	 * @param {String} [config.textColor] text color
	 * @param {String} [config.textAnchor] text anchor : start, end or middle
	 * @param {Number} [config.x] text x location
	 * @param {Number} [config.y] text y location
	 * @param {Number} [config.fontSize] text font size
	 * @param {Number} [config.opacity] text opacity
	 */
	JenScript.TextViewForeground = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TextViewForeground,JenScript.ViewForeground);
	JenScript.Model.addMethods(JenScript.TextViewForeground, {
		/**
		 * Initalize Text Foreground
		 * @param {Object} config
		 * @param {String} [config.text] text to draw in foreground
		 * @param {String} [config.textColor] text color
		 * @param {String} [config.textAnchor] text anchor : start, end or middle
		 * @param {Number} [config.x] text x location
		 * @param {Number} [config.y] text y location
		 * @param {Number} [config.fontSize] text font size
		 * @param {Number} [config.opacity] text opacity
		 */
		_init : function(config){
			this.text = config.text;
			this.x = config.x;
			this.y = config.y;
			this.textColor = (config.textColor !== undefined)?config.textColor : JenScript.createColor();
			this.textAnchor = (config.textAnchor !== undefined)?config.textAnchor : 'start';
			this.opacity = (config.opacity !== undefined)?config.opacity : 1;
			this.fontSize = (config.fontSize !== undefined)?config.fontSize : 9;
			
			if(this.x === undefined ) throw new Error('TextViewForeground, x undefined, it should be supplied');
			if(this.y === undefined ) throw new Error('TextViewForeground, y undefined, it should be supplied');
			JenScript.ViewForeground.call(this,config);
		},
		
		setText :function(text){
			this.text=text;
			this.getGraphics().deleteGraphicsElement('text_'+this.Id);
			this.paintViewForeground(this.view,this.getGraphics());
		},
		
		/**
		 * paint text view foreground
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewForeground : function(view,g2d){
			//console.log("paint text :"+'text_'+this.text);
			var text = new JenScript.SVGElement().name('text')
				.attr('id','text_'+this.Id)
				.attr('x',this.x)
				.attr('y',this.y)
				.attr('font-size',this.fontSize)
				.attr('fill',this.textColor)
				.attr('fill-opacity',this.opacity)
				.attr('text-anchor',this.textAnchor)
				//.attr('transform','?')
				.textContent(this.text);
			this.svg = text.buildHTML();
			g2d.insertSVG(this.svg);
		}
	});
	
	/**
	 * Object GlossViewForeground()
	 * Defines Gloss Foreground
	 * @param {Object} config
	 * @param {Number} [config.heightRatio] view height ratio, 0.25 default value
	 * @param {Number} [config.heightQuadDeviation] height quad deviation in pixel, 50 pixel default value
	 */
	JenScript.GlossViewForeground = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GlossViewForeground,JenScript.ViewForeground);
	JenScript.Model.addMethods(JenScript.GlossViewForeground, {
		
		/**
		 * Initialize Gloss Foreground
		 * @param {Object} config
		 * @param {Number} [config.heightRatio] view height ratio, 0.25 default value
		 * @param {Number} [config.heightQuadDeviation] height quad deviation in pixel, 50 pixel default value
		 */
		_init : function(config){
			config = config || {};
			this.gradientId = 'gradient'+JenScript.sequenceId++;
			this.clipId = 'clip'+JenScript.sequenceId++;
			this.foregroundId = 'foreground'+JenScript.sequenceId++;
			this.heightRatio = (config.heightRatio)?config.heightRatio: 1/4;
			this.heightQuadDeviation =  (config.heightQuadDeviation)?config.heightQuadDeviation: 50;
			JenScript.ViewForeground.call(this,config);
		},
		
		/**
		 * paint view gloss foreground
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewForeground : function(view,g2d){
			var glossFace = new JenScript.SVGPath().moveTo(0,0).lineTo(0,this.heightRatio*view.height).quadTo(view.width/2,this.heightRatio*view.height+this.heightQuadDeviation,view.width,this.heightRatio*view.height).lineTo(view.width,0).close();
			this.clip(glossFace);
			var percents = ['20%','100%'];
			var colors = ['rgb(255,255,255)','rgb(255,255,255)'];
			var gradient= new JenScript.SVGLinearGradient().Id(this.gradientId).from(0,0).to(0, this.heightRatio*view.getHeight()).shade(percents,colors,[0,0.2]);
			g2d.definesSVG(gradient.toSVG());
			
			g2d.insertSVG(glossFace.strokeNone().fill('url(#'+this.gradientId+')').toSVG());	
		}
	});
	
})();
(function(){

	/**
	 * ViewPartComponent defines a view part like south, north, west, east or device component.
	 * 
	 */
	JenScript.Model.addMethods(JenScript.ViewPartComponent, {
		
			/**
			 * init this component with the given config
			 * @param {Object} config
	         * @param {String} [config.part] South, West, East, North, Device
	         * @param {Number} [config.width] Component width in pixel
	         * @param {Number} [config.height] Component height in pixel
	         * @param {Object} [config.view] Component parent views
			 */
			init : function(config){
				config = config || {};
				this.part = config.part;
				this.width = config.width;
				this.height = config.height;
				this.view = config.view;
				this.Id = this.part+JenScript.sequenceId++;
			},
			
			getId : function(){
				return this.Id;
			},
			
			getWidth :  function(){
				return this.width;
			},
			
			getHeight :  function(){
				return this.height;
			},
			
			on : function(actionEvent,evt, x, y) {
				//				if(evt.preventDefault){
				//					evt.preventDefault();	
				//				}
				
				//console.log('action event : '+actionEvent+", x,y : "+x+','+y);
				var widgetHandler   = this.view.getWidgetPlugin()['on'+actionEvent];
				var selectorHandler = this.view.getSelectorPlugin()['on'+actionEvent];
				
				widgetHandler.call(this.view.getWidgetPlugin(),evt,this.part,x,y);
				selectorHandler.call(this.view.getSelectorPlugin(),evt,this.part,x,y);

				if(this.view === undefined) return;
				var projs = this.view.getProjections();
				for (var pi = 0; pi < projs.length; pi++) {
					if(projs[pi].isAuthorizedPolicy('event')){
						var plugins = projs[pi].getPlugins();
						for (var p = 0; p < plugins.length; p++) {
							var pluginHandler   = plugins[p]['on'+actionEvent];
							pluginHandler.call(plugins[p],evt,this.part,x, y);
						}
					}
		    		
				}
			},
	});
})();
(function() {
	
	SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(elem) {
	    return elem.getScreenCTM().inverse().multiply(this.getScreenCTM());
	};
	
	/**
     * @constructor
     * @memberof JenScript
     */
	JenScript.Graphics = function(config) {
		this.init(config);
		this.definitions = config.definitions;
		this.graphics = config.graphics;
	},
	JenScript.Model.addMethods(JenScript.Graphics, {
		init : function(config){
			config=config || {};
		},
		
		/**
		 * clear the graphics content of the given element Id.
		 * clear all graphics if not specified
		 * @param {String} graphicsId
		 */
		clearGraphics : function(graphicsId){
			if(graphicsId === undefined){
				while (this.definitions.firstChild) {
					this.definitions.removeChild(this.definitions.firstChild);
				}
				while (this.graphics.firstChild) {
					this.graphics.removeChild(this.graphics.firstChild);
				}
				
			}
			else{
				var gfxNode = document.getElementById(graphicsId);
				if(gfxNode !== null){
					while (gfxNode.firstChild) {
						gfxNode.removeChild(gfxNode.firstChild);
					}
				}
				
			}
		},
		
		/**
		 * get the given graphics element specified by Id
		 * @param {String} graphicsId
		 * @returns graphics element
		 */
		getGraphicsElement : function(graphicsId){
			return document.getElementById(graphicsId);
		},
		
		/**
		 * delete the given graphics element specified by Id
		 * @param {String} graphicsId
		 * @returns graphics element
		 */
		deleteGraphicsElement : function(graphicsId){
			var element = document.getElementById(graphicsId);
			if(element !== undefined && element!== null && element.parentNode!==undefined && element.parentNode!==null){
				var removed = element.parentNode.removeChild(element);
				return removed;
			}
		},
		
		/**
		 * defines a texture in this graphics context
		 * @param {String} textureId
		 * @param {Object} texture
		 */
		definesTexture : function(texture){
			var texturePattern = texture.pattern;
			var textureDefinitions = texture.definitions;
			
			if(textureDefinitions !== undefined){
				for (var i = 0; i < textureDefinitions.length; i++) {
					var def = textureDefinitions[i];
					this.definitions.appendChild(def.toSVG());
				}
			}
			if(texturePattern !== undefined){
				this.definitions.appendChild(texturePattern.Id(texture.getId()).toSVG());
			}
		},
		
		
		/**
		 * defines a svg element
		 */
		definesSVG : function(def) {
			this.definitions.appendChild(def);
		},
		
		/**
		 * append the given svg element to the root of this graphics context
		 */
		insertSVG : function(svg,parent) {
			if(parent === undefined){
				this.graphics.appendChild(svg);
			}else{
				parent.appendChild(svg);
			}
		},
		
		
	});
		
	
	JenScript.SVGElement  = function(){
		 var builder = function(){
			this.attributes={};
			this.childs=[];
			
			this.name = function(name){
				this.n=name;
				return this;
			},
			
	   		this.textContent = function(text){
				this.t=text;
	   			return this;
	   		},
	   		
	   		this.attr = function(name,value){
	   			if(name !== undefined && value !== undefined){
	   				this.attributes[name] = {'name':name,'value':value};
	   				return this;
	   			}
	   			else if(name !== undefined && value === undefined){
	   				return this.attributes[name];
	   			}
	   		},
	   		
	   		this.attrNS = function(ns, name,value){
	   			if(name !== undefined && value !== undefined){
	   				this.attributes[name] = {ns : ns ,'name':name,'value':value};
	   				return this;
	   			}
	   			else if(name !== undefined && value === undefined){
	   				return this.attributes[name];
	   			}
	   		},
	   		
	   		this.removeAttr = function(name){
	   			if(name !== undefined ){
	   				delete this.attributes[name];
	   				return this;
	   			}
	   		},
	   		
	   		this.child = function(children){
	   			if(children !== undefined)
	   				this.childs[this.childs.length] = children;
	   			return this;
	   		},
	   		
	   		this.buildHTML = function(){
	   			var e = document.createElementNS(JenScript.SVG_NS,this.n);
	   			for(var propt in this.attributes){
	   				if(this.attributes[propt].ns === undefined)
	   					e.setAttribute(this.attributes[propt].name,this.attributes[propt].value);
	   				else
	   					e.setAttributeNS(this.attributes[propt].ns,this.attributes[propt].name,this.attributes[propt].value);
	   			}
	   			for(var i = 0;i<this.childs.length;i++){
	   				e.appendChild(this.childs[i]);	
	   			}
	   			if(this.t !== undefined){
	   				var tn = document.createTextNode(this.t);
	       			e.appendChild(tn);	
	   			}
	       		return e;
	   		};
		};
		var e = new builder();
		return e;
	};
	
	JenScript.SVGGeometry  = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.SVGGeometry,{
		init : function(config){
			this.rootBuilder = new JenScript.SVGElement();	
		},
		builder : function(){
			return this.rootBuilder;
		},
		toSVG : function(){
			return this.rootBuilder.buildHTML();
		},
		attr : function(name,value){
			if(name !== undefined && value !== undefined){
				this.rootBuilder.attr(name,value);
				return this;
			}
			else if(name !== undefined && value === undefined){
				return this.rootBuilder.attr(name);
			}
		},
		attrNS : function(ns,name,value){
			if(name !== undefined && value !== undefined){
				this.rootBuilder.attrNS(ns,name,value);
				return this;
			}
			else if(name !== undefined && value === undefined){
				return this.rootBuilder.attr(name);
			}
		},
		name : function(name){
			this.rootBuilder.attr('name',name);
			return this;
		},
		child : function(child){
			this.rootBuilder.child(child);
			return this;
		},
		textContent : function(text){
			this.rootBuilder.textContent(text);
			return this;
		},
		Id : function(Id){
			this.rootBuilder.attr('id',Id);
			return this;
		},
		clazz : function(clazzes){
			this.rootBuilder.attr('class',clazzes);
			return this;
		},
		style : function(style){
			this.rootBuilder.attr('style',style);
			return this;
		},
		stroke : function(color){
			this.rootBuilder.attr('stroke',color);
			return this;
		},
		strokeNone : function(){
			this.rootBuilder.attr('stroke','none');
			return this;
		},
		strokeWidth : function(width){
			this.rootBuilder.attr('stroke-width',width);
			return this;
		},
		strokeLineJoin : function(join){//mitter,round,bevel
			this.rootBuilder.attr('stroke-linejoin',join);
			return this;
		},
		strokeLineCap : function(cap){//cap : round,butt,square
			this.rootBuilder.attr('stroke-linecap',cap);
			return this;
		},
		strokeOpacity : function(opacity){
			this.rootBuilder.attr('stroke-opacity',opacity);
			return this;
		},
		fill : function(color){
			this.rootBuilder.attr('fill',color);
			return this;
		},
		fillURL : function(url){
			this.rootBuilder.attr('fill','url(#'+url+')');
			return this;
		},
		fillNone : function(){
			this.rootBuilder.attr('fill','none');
			return this;
		},
		fillOpacity : function(opacity){
			this.rootBuilder.attr('fill-opacity',opacity);
			return this;
		},
		opacity : function(opacity){
			this.rootBuilder.attr('opacity',opacity);
			return this;
		},
		clip : function(clipId){
			this.rootBuilder.attr('clip-path','url(#'+clipId+')');
			return this;
		},
		mask : function(maskId){
			this.rootBuilder.attr('mask','url(#'+maskId+')');
			return this;
		},
		fontSize : function(fontSize){
			this.rootBuilder.attr('font-size',fontSize);
			return this;
		},
		fontFamily : function(fontFamily){
			this.rootBuilder.attr('font-family',fontFamily);
			return this;
		},
		pointerEvents : function(type){
			this.rootBuilder.attr('pointer-events',type);
			return this;
		},
		
	});
	
	
	JenScript.SVGViewBox = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGViewBox, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGViewBox,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('svg').attr('xmlns',JenScript.SVG_NS).attr('xmlns:xlink',JenScript.XLINK_NS).attr('version',JenScript.SVG_VERSION);
		},		
		viewBox : function(box){
			this.attr('viewBox',box);
			return this;
		},
		width : function(width){
			this.attr('width',width);
			return this;
		},
		height : function(height){
			this.attr('height',height);
			return this;
		},
		
	});
	
	JenScript.SVGRect = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGRect, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGRect,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('rect');
		},
		
		getBound2D : function(){
			return new JenScript.Bound2D(this.attr('x').value,this.attr('y').value,this.attr('width').value,this.attr('height').value);
		},
		
		origin : function(x,y){
			this.attr('x',x);
			this.attr('y',y);
			return this;
		},
		size : function(width,height){
			this.attr('width',width);
			this.attr('height',height);
			return this;
		},
		radius : function(rx,ry){
			this.attr('rx',rx);
			this.attr('ry',ry);
			return this;
		},
	});
	
	JenScript.SVGPolygon = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGPolygon, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGPolygon,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('polygon');
			this.points = [];
		},
		
//		getBound2D : function(){
//			return new JenScript.Bound2D(this.attr('x').value,this.attr('y').value,this.attr('width').value,this.attr('height').value);
//		},
		
		buildPolygon : function(){
			var pathData ='';
			for (var i = 0; i < this.points.length; i++) {
				pathData= pathData+this.points[i].getX() +','+this.points[i].getY()+' ';
			}
			return pathData;
		},
		
		point : function(x,y){
			this.points[this.points.length] = new JenScript.Point2D(x,y);
			this.attr('points',this.buildPolygon());
			return this;
		},
	});
	
	JenScript.SVGClipPath = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGClipPath, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGClipPath,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('clipPath').attr('clipPathUnits','userSpaceOnUse');
		},
		
		appendPath : function(path){
			this.child(path.toSVG());
			return this;
		}
	});
	
	JenScript.SVGLine = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGLine, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGLine,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('line');
		},
		from : function(x1,y1){
			this.attr('x1',x1);
			this.attr('y1',y1);
			return this;
		},
		to : function(x2,y2){
			this.attr('x2',x2);
			this.attr('y2',y2);
			return this;
		},
	});
	
	JenScript.SVGLinearGradient = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGLinearGradient, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGLinearGradient,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('linearGradient').attr('gradientUnits','userSpaceOnUse');
		},
		from : function(x1,y1){
			this.attr('x1',x1);
			this.attr('y1',y1);
			return this;
		},
		to : function(x2,y2){
			this.attr('x2',x2);
			this.attr('y2',y2);
			return this;
		},
		shade : function(percents,colors,opacity){
			var len = percents.length;
			for (var i = 0; i < len; i++) {
				var op = 1;
				if(opacity !== undefined)
					op = opacity[i];
				var gs = new JenScript.SVGElement().name('stop')
										.attr('offset',percents[i])
										.attr('stop-color',colors[i])
										.attr('stop-opacity',op)
										.buildHTML();
				this.child(gs);
			}
			return this;
		}
		
	});
	
	JenScript.SVGRadialGradient = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGRadialGradient, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGRadialGradient,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('radialGradient').attr('gradientUnits','userSpaceOnUse');
		},
		center : function(x,y){
			this.attr('cx',x);
			this.attr('cy',y);
			return this;
		},
		focus : function(x,y){
			this.attr('fx',x);
			this.attr('fy',y);
			return this;
		},
		radius : function(r){
			this.attr('r',r);
			return this;
		},
		spread : function(spread){
			this.attr('spreadMethod',spread);
			return this;
		},
		transform : function(transform){
			this.attr('gradientTransform',transform);
			return this;
		},
		shade : function(percents,colors){
			var len = percents.length;
			for (var i = 0; i < len; i++) {
				var gs = new JenScript.SVGElement().name('stop')
										.attr('offset',percents[i])
										.attr('style','stop-color:'+colors[i])
										.buildHTML();
				this.child(gs);
			}
			return this;
		}
		
	});
	
	
	
	JenScript.SVGFilter = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGFilter, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGFilter,{
		_init: function(){
			JenScript.SVGGeometry.call(this,{});
			this.builder().name('filter').attr('filterUnits','userSpaceOnUse');
		},
		from : function(x,y){
			this.attr('x',x);
			this.attr('y',y);
			return this;
		},
		size : function(width,height){
			this.attr('width',width);
			this.attr('height',height);
			return this;
		},
		
	});
	
	JenScript.SVGMask = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGMask, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGMask,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('mask').attr('maskUnits','userSpaceOnUse');
		},
		from : function(x,y){
			this.attr('x',x);
			this.attr('y',y);
			return this;
		},
		size : function(width,height){
			this.attr('width',width);
			this.attr('height',height);
			return this;
		},
		
	});
	
	JenScript.SVGPattern = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGPattern, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGPattern,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('pattern').attr('patternUnits','userSpaceOnUse');
		},
		origin : function(x,y){
			this.attr('x',x);
			this.attr('y',y);
			return this;
		},
		size : function(width,height){
			this.attr('width',width);
			this.attr('height',height);
			return this;
		},
	});
	
	JenScript.SVGScript = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGScript, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGScript,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('script').attr('type','application/ecmascript');
		},
		script : function(script){
			//this.textContent('\n'+'//<![CDATA['+'\n'+script+'\n'+'//]]\>');
			//this.textContent('\n'+'//<![CDATA['+'\n'+script+'\n'+']]\>');
			//this.textContent('//<![CDATA['+script+']]\>');
			this.textContent('<![CDATA['+script+']]>');
			return this;
		}
	});
	
	
	
	JenScript.SVGGroup = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGGroup, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGGroup,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('g');
		},
	});
	
	JenScript.SVGDefinitions = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGDefinitions, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGDefinitions,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('defs');
		},
	});
	
	JenScript.SVGCircle = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGCircle, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGCircle,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('circle');
		},
		center : function(x,y){
			this.attr('cx',x);
			this.attr('cy',y);
			return this;
		},
		radius : function(r){
			this.attr('r',r);
			return this;
		},
		
	});
	
	JenScript.SVGText = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGText, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGText,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('text');
		},
		
		location : function(x,y){
			this.attr('x',x);
			this.attr('y',y);
			return this;
		},
		
		textAnchor : function(anchor){
			this.attr('text-anchor',anchor);
			return this;
		},
		
	});
	
	JenScript.SVGImage = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGImage, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGImage,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('image');
		},
		
		xlinkHref : function(imageURL){
			this.attrNS(JenScript.XLINK_NS,'href',imageURL);
			return this;
		},
		
		origin : function(x,y){
			this.attr('x',x);
			this.attr('y',y);
			return this;
		},
		size : function(w,h){
			this.attr('width',w);
			this.attr('height',h);
			return this;
		}
		
	});
	
	JenScript.SVGUse = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGUse, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGUse,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('use');
		},
		
		getBound2D : function(){
			return new JenScript.Bound2D(this.attr('x').value,this.attr('y').value,this.attr('width').value,this.attr('height').value);
		},
		
		xlinkHref : function(use){
			this.attrNS(JenScript.XLINK_NS,'xlink:href',use);
			return this;
		},
	});
	
	JenScript.SVGTextPath = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGTextPath, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGTextPath,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('textPath');
		},
		
		xlinkHref : function(pathRef){
			this.attrNS(JenScript.XLINK_NS,'href',pathRef);
			return this;
		},
		
		startOffset : function(startOffset){
			this.attr('startOffset',startOffset);
			return this;
		},
		method : function(method){
			this.attr('method',method);
			return this;
		},
		methodAlign : function(){
			this.attr('method','align');
			return this;
		},
		methodStretch : function(){
			this.attr('method','stretch');
			return this;
		},
		spacing : function(spacing){
			this.attr('spacing',spacing);
			return this;
		},
		spacingAuto : function(){
			this.attr('spacing','auto');
			return this;
		},
		spacingExact : function(){
			this.attr('spacing','exact');
			return this;
		}
		
	});
	
	JenScript.SVGTSpan = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGTSpan, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGTSpan,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('tspan');
		},
		
		dx : function(dx){
			this.attr('dx',dx);
			return this;
		},
		dy : function(dy){
			this.attr('dy',dy);
			return this;
		},
	});
	
	JenScript.SVGPath = function() {
		this._init();
	};
	JenScript.Model.inheritPrototype(JenScript.SVGPath, JenScript.SVGGeometry);
	JenScript.Model.addMethods(JenScript.SVGPath,{
		_init: function(){
			JenScript.SVGGeometry.call(this,null);
			this.builder().name('path');
			this.segments = [];
			this.buildAuto = true;
		},
		
		getSegments : function(){
			return this.segments;
		},
		
		pointAtLength : function(length){
			return this.geometryPath.pointAtLength(length);
		},
	
		angleAtLength : function(length){
			return this.geometryPath.angleAtLength(length);
		},
		
		buildPath : function(){
			var path='';
			var segments = this.segments;
			for (var i = 0; i < segments.length; i++) {
				if(segments[i].type === 'M')
					path = path  + segments[i].type+segments[i].x+','+segments[i].y+' ';
				if(segments[i].type === 'L')
					path = path  + segments[i].type+segments[i].x+','+segments[i].y+' ';
				if(segments[i].type === 'Q')
					path = path  + segments[i].type+segments[i].x1+','+segments[i].y1+' '+segments[i].x+','+segments[i].y+' ';
				if(segments[i].type === 'C')
					path = path  + segments[i].type+segments[i].x1+','+segments[i].y1+' '+segments[i].x2+','+segments[i].y2+' '+segments[i].x+','+segments[i].y+' ';
				if(segments[i].type === 'A')
					path = path  + segments[i].type+segments[i].rx+','+segments[i].ry+' '+segments[i].xAxisRotation+' '+segments[i].largeArcFlag+','+segments[i].sweepFlag+' '+segments[i].x+','+segments[i].y+' ';
				if(segments[i].type === 'Z')
					path = path  + segments[i].type+' ';
			}
			this.pathdata = path;
			//this.geometryPath = new JenScript.GeometryPath(this.toSVG());
			return path;
		},
		
		finalyze : function(){
			this.attr('d',this.buildPath());
		},
		
		registerSegment : function(fragment){
			this.segments[this.segments.length] = fragment;
			if(this.buildAuto)
				this.attr('d',this.buildPath());
			return this;
		},
		
//		append : function(svgPath){
//			var segments = svgPath.getSegments();
//			for(var i=0;i<segments.length;i++){
//				this.registerSegment(segments[i]);
//			}
//		},
		
		moveTo : function(x,y){
			this.registerSegment({type : 'M',x:x,y:y});
			return this;
		},
		lineTo : function(x,y){
			this.registerSegment({type : 'L',x:x,y:y});
			return this;
		},
		curveTo : function(x1,y1,x2,y2,x,y){
			this.registerSegment({type : 'C',x1:x1,y1:y1,x2:x2,y2:y2,x:x,y:y});
			return this;
		},
		smoothCurveTo : function(x2,y2,x,y){
			this.registerSegment({type : 'S',x2:x2,y2:y2,x:x,y:y});
			return this;
		},
		quadTo : function(x1,y1,x,y){
			this.registerSegment({type : 'Q',x1:x1,y1:y1,x:x,y:y});
			return this;
		},
		smoothQuadTo : function(x,y){
			this.registerSegment({type : 'T',x:x,y:y});
			return this;
		},
		arcTo : function(rx,ry,xAxisRotation,largeArcFlag,sweepFlag,x,y){
			this.registerSegment({type : 'A',rx:rx,ry:ry,xAxisRotation:xAxisRotation,largeArcFlag:largeArcFlag,sweepFlag:sweepFlag,x:x,y:y});
			return this;
		},
		close : function(){
			this.registerSegment({type : 'Z'});
			return this;
		}
	});
	
})();
(function(){
	
	JenScript.Model.addMethods(JenScript.View, {
		
		
		toString : function(){
			return 'JenScript.View[name :'+this.name+' , Id : '+this.Id+']';
		},
		/**
         * Initialize view with given parameters config.
         * @param {Object} config
         * @param {String} [config.name] The view chart name
         * @param {Number} [config.width] The view width in pixel
         * @param {Number} [config.height] The view height in pixel
         * @param {Number} [config.holders] The All outer's part width
         * @param {Number} [config.west] The west part width
         * @param {Number} [config.east] The east part width
         * @param {Number} [config.north] The north part height
         * @param {Number} [config.south] The south part height
         * @param {Number} [config.viewBackground] The view background painter
         * @param {Number} [config.scale] The scale in percent
         * 
         */
		init : function(config) {
			config = config || {};
			/**view part*/
			this.part = JenScript.ViewPart.View;
			
			/**div holder for the view, container Id*/
			this.name = config.name;
			this.Id = 'view_'+this.name;
			this.SVG_NS = "http://www.w3.org/2000/svg";
			this.XLINK_NS = "http://www.w3.org/1999/xlink";
			
			var container = document.getElementById(this.name);
			if(container === null || container === undefined){
				console.log('jenscript view container '+container+' does not exist');
				var element = document.createElement('div');
				element.setAttribute('id',this.name);
				document.body.appendChild(element);
				
			}else{
				while (container.hasChildNodes()) {
					container.removeChild(container.lastChild);
				}
			}
			
			//TODO : auto size strategy
			/**view dimension*/
			this.width  = (config.width !== undefined)?config.width : document.getElementById(this.name).clientWidth;
			this.height = (config.height !== undefined)?config.height : document.getElementById(this.name).clientHeight;
			this.scale  = (config.scale !== undefined)?config.scale : 1;
			
			/**part place holders*/
			if(config.holders!== undefined){
				config.west   = (config.west !== undefined)?  config.west  : config.holders;
				config.east   = (config.east !== undefined)?  config.east  : config.holders;
				config.south  = (config.south !== undefined)? config.south : config.holders;
				config.north  = (config.north !== undefined)? config.north : config.holders;
			}
			
			this.west  = (config.west!== undefined)?   config.west  : 40;
			this.east  = (config.east!== undefined)?   config.east  : 40;
			this.north = (config.north!== undefined)?  config.north : 40;
			this.south = (config.south!== undefined)? config.south : 40;

			if(this.width-this.west-this.east < 0)
				throw new Error('View width is two small with e/w holders');
			if(this.height-this.north-this.south < 0)
				throw new Error('View height is two small with n/s holders');
			
			/**view background painters*/
			this.viewBackgrounds = []; 
			this.backgroundEnable = true;
			
			/**view foreground painters*/
			this.viewForegrounds = [];
			this.foregroundEnable = true;
			
			/** view projections */
			this.projections = [];
			
			/** active projection */
			this.activeProjection;
			
			/** the widget folder guard interval */
			this.folderGuardInterval = 4;
			
			/** view listeners */
			this.listeners = [];
			
			this.dispatcherStrategy = (config.dispatcher !== undefined)? config.dispatcher : 'foreground';
			
			/** projection event propagation and visibility policies*/
			//this.policy = (config.policy !== undefined)?config.policy:{ paint : 'INHERITS' , event : 'ACTIVE' /**ALWAYS, MAYBE, INHERITS*/, isEventReceiver : function(){return false;}};
			
			
			/**
			 * the widget plug-in is a specific plug-in to handle widget and window meta
			 * data
			 */
			this.widgetPlugin = new JenScript.WidgetPlugin();
			this.widgetPlugin.setView(this);
			var that = this;
			
			this.addViewListener('projectionRegister',function(){that.widgetPlugin.repaintPlugin('view listener 1');},'widget plugin attach :view projection register listener');
			
			/**
			 * the selector plug-in is a specific plug-in to handle projections meta
			 * data
			 */
			this.selectorPlugin = new JenScript.SelectorPlugin();
			this.selectorPlugin.setView(this);
			var that = this;
			
			this.addViewListener('projectionRegister',function(){that.selectorPlugin.repaintPlugin('view listener 2');},'selector plugin attach :view projection register listener');
			
			//this.addViewListener('projectionActive',function(){that.widgetPlugin.repaintPlugin();},'widget plugin attach : projection active listener');
			
			/**create Part component*/
			this.createPartComponents();
			
			/**contextualize graphics*/
			this.contextualizeGraphics();
			
			//DO NOT REMOVE THIS LINE
			var copyright = new JenScript.TextViewForeground({/*textColor:'rgb(255,255,50)',*/fontSize:6,x:this.west,y:this.north-2,text:'JenScript '+JenScript.version+' - www.jenscript.io'});
			this.addViewForeground(copyright);
		},
		
		find : function(element){
			if(element.Id !== undefined)
				return document.getElementById(element.Id);
			return null;
		},
		
		/**
		 * get the background clip for the given background
		 * @param {Object} background
		 */
		getBackgroundClip : function(background){
			var clips=[];
			for (var i = 0; i < this.viewBackgrounds.length; i++) {
				var bg = this.viewBackgrounds[i];
				if(bg.Id === background.Id)
					return clips;
				var clip = bg.getBackgroundPath();
				clips[clips.length] = clip;
			}
			return clips;
		},
		
		/**
		 * add view background
		 * @param {Object} view background to add
		 */
		addViewBackground : function(background){
			this.viewBackgrounds[this.viewBackgrounds.length]=background;
			this.contextualizeBackground(background);
		},
		
		/**
		 * remove view background
		 * @param {Object} view background to remove
		 */
		removeViewBackground : function(background){
			if(background.Id === undefined)
				return null;
			var bgs = [];
			for (var i = 0; i < this.viewBackgrounds.length; i++) {
				var bg = this.viewBackgrounds[i];
				if(bg.Id === background.Id){
					background.getGraphics().clearGraphics();
				}else{
					bgs[bgs.length] = bg;
				}
			}
			this.viewBackgrounds=bgs;
		},
		
		/**
		 * create background node
		 */
		contextualizeBackground : function(background){
			var svgBackground = new JenScript.SVGGroup().Id(background.Id).toSVG();
			var svgBackgroundDefinitions = new JenScript.SVGGroup().Id(this.Id+'_background_definitions').toSVG();
			var svgBackgroundGraphics = new JenScript.SVGGroup().Id(this.Id+'_background_graphics').toSVG();
			svgBackground.appendChild(svgBackgroundDefinitions);
			svgBackground.appendChild(svgBackgroundGraphics);
			this.svgRootBackground.appendChild(svgBackground);
			
			var g2d = new JenScript.Graphics({definitions: svgBackgroundDefinitions,graphics : svgBackgroundGraphics});
			background.view = this;
			background.g2d = g2d;
			background.paint.call(background,{});
		},
		
		
		
		/**
		 * set view foreground painter
		 */
		addViewForeground : function(foreground){
			this.viewForegrounds[this.viewForegrounds.length]=foreground;
			this.contextualizeForeground(foreground);
		},
		
		/**
		 * remove view foreground
		 * @param {Object} view foreground to remove
		 */
		removeViewForeground : function(foreground){
			if(foreground.Id === undefined)
				return null;
			var fgs = [];
			for (var i = 0; i < this.viewForegrounds.length; i++) {
				var fg = this.viewForegrounds[i];
				if(fg.Id === foreground.Id){
					foreground.getGraphics().clearGraphics();
				}else{
					fgs[fgs.length] = fg;
				}
			}
			this.viewForegrounds=fgs;
		},
		
		/**
		 * create foreground node
		 */
		contextualizeForeground : function(foreground){
			var svgForeground = new JenScript.SVGGroup().Id(foreground.Id).toSVG();
			var svgForegroundDefinitions = new JenScript.SVGGroup().Id(this.Id+'_foreground_definitions').toSVG();
			var svgForegroundGraphics = new JenScript.SVGGroup().Id(this.Id+'_foreground_graphics').toSVG();
			svgForeground.appendChild(svgForegroundDefinitions);
			svgForeground.appendChild(svgForegroundGraphics);
			this.svgRootForeground.appendChild(svgForeground);
			
			var g2d = new JenScript.Graphics({definitions: svgForegroundDefinitions,graphics : svgForegroundGraphics});
			foreground.view = this;
			foreground.g2d = g2d;
			foreground.paint.call(foreground,{});
		},
		
		
		
		/**
		 * bind actions : projectionRegister, projectionActive
		 */
		addViewListener  : function(actionEvent,listener, name){
			if(name === undefined)
				throw new Error('View listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener,name:name};
			this.listeners[this.listeners.length] =l;
		},
		
		/**
		 * fire listener when view register new projection
		 */
		fireViewEvent : function(actionEvent){
			for (var i = 0; i < this.listeners.length; i++) {
				var l = this.listeners[i];
				if(actionEvent === l.action){
					l.onEvent(this);
				}
			}
		},
		
		/**
		 * create part component
		 */
		createPartComponents : function(){
			this.devicePart = new JenScript.ViewPartComponent({
					part   : JenScript.ViewPart.Device,
					width  : this.width - this.west - this.east,
					height : this.height - this.north - this.south,
					view   : this});
			
			this.westPart = new JenScript.ViewPartComponent({
					part   : JenScript.ViewPart.West,
					width  :  this.west,
					height : this.height - this.north- this.south,
					view   : this});
			
			this.eastPart = new JenScript.ViewPartComponent({
					part   : JenScript.ViewPart.East,
					width  : this.east,
					height : this.height-this.north-this.south,
					view   : this});
			
			this.southPart = new JenScript.ViewPartComponent({
					part   : JenScript.ViewPart.South,
					width  : this.width,
					height : this.south,
					view   : this});
			
			this.northPart = new JenScript.ViewPartComponent({
					part   : JenScript.ViewPart.North,
					width  : this.width,
					height : this.north,
					view   : this});
		},
		
		/**
		 * get view Id
		 */
		getId : function(){
			return this.Id;
		},
		
		/**
		 * get view width
		 */
		getWidth : function(){
			return this.width;
		},
		
		/**
		 * get view height
		 */
		getHeight : function(){
			return this.height;
		},
		
		/**
		 * get the widget plugin
		 * 
		 * @return the widget plugin
		 */
		getWidgetPlugin : function() {
			return this.widgetPlugin;
		},
		
		/**
		 * get the selector plugin
		 * 
		 * @return the widget plugin
		 */
		getSelectorPlugin : function() {
			return this.selectorPlugin;
		},
		
		/**
		 * get place holder east
		 */
		getPlaceHolderAxisEast : function() {
			return this.east;
		},
		
		/**
		 * get place holder west
		 */
		getPlaceHolderAxisWest : function() {
			return this.west;
		},
		
		/**
		 * get place holder south
		 */
		getPlaceHolderAxisSouth : function() {
			return this.south;
		},
		
		/**
		 * get place holder north
		 */
		getPlaceHolderAxisNorth : function() {
			return this.north;
		},
		
		setBackgroundEnable : function(flag){
			this.backgroundEnable = flag;
		},

		/**
		 * register projection in this view
		 * @param {Object} projection
		 * @method
		 */
		registerProjection : function(projection) {
			projection.setView(this);
			this.projections[this.projections.length] = projection;
			this.activeProjection=projection;
			this.activeProjection.setActive(true);
			this.projections.sort(function(p1, p2) {
				var x = p1.isActive();
				var y = p2.isActive();
				if(x && !y)
					return 1;
				else return -1;
			});
			this.contextualizeGraphicsProjection(projection);
			this.setActiveProjection(projection);
			this.fireViewEvent('projectionRegister');
		},
		
		
		//avoir un style stream et pour échapper au 'new JenScript.XXXXX' ?
		//affecte la clarté du paradigme?
		
//		linear : function(config){
//			var lp = new JenScript.LinearProjection(config);
//			this.registerProjection(lp);
//			return lp;
//		},
		
		/**
		 * get active projection
		 * @returns {Object} projection
		 */
		getActiveProjection : function(){
			return this.activeProjection;
		},
		
		/**
		 * get all projections of this view.
		 * @returns {Array} projections array
		 */
		getProjections : function(){
			return this.projections;
		},
		
		/**
		 * set the specified projection active
		 * fire 'projectionPassive' for projection already active that being passive
		 * fire 'projectionActive'  for projection that being active
		 * 
		 * @param {object} activeProjection the projection to activate
		 *          
		 */
		setActiveProjection : function(activeProjection) {
			for (var p = 0; p < this.projections.length; p++) {
				var proj =this.projections[p];
				if(proj.Id !== activeProjection.Id && proj.isActive()){
					proj.setActive(false);
					this.fireViewEvent('projectionPassive');
				}
			}
			
			if (this.activeProjection.Id !== activeProjection.Id) {
				this.activeProjection = activeProjection;
				this.activeProjection.setActive(true);
				this.fireViewEvent('projectionActive');
			}
		},

		/**
		 * get the component specified par given part
		 * @param {String} part the part name 
		 */
		getComponent : function(part) {
			if (part === JenScript.ViewPart.North) {
				return this.northPart;
			} else if (part === JenScript.ViewPart.South) {
				return this.southPart;
			} else if (part === JenScript.ViewPart.East) {
				return this.eastPart;
			} else if (part === JenScript.ViewPart.West) {
				return this.westPart;
			} else if (part === JenScript.ViewPart.Device) {
				return this.devicePart;
			}
		},
		
		/**
		 * contextualize view graphics
		 */
		contextualizeGraphics : function(){
			
			this.createViewNode();
			if(this.dispatcherStrategy === 'background')
				this.createDispatcherNode();
			this.createViewDefsNode();
			this.createBackgroundNode();
			this.createProjectionsNode();
			this.createSelectorsNode();
			this.createWidgetsNode();
			this.createForegroundNode();
			if(this.dispatcherStrategy === 'foreground')
				this.createDispatcherNode();
		},
		
		/**
		 * create background node
		 */
		createViewNode : function(){
			
			//this.svgRootElement = new JenScript.SVGViewBox().Id(this.Id).viewBox("0 0 "+this.width+" "+this.height).width(this.width).height(this.height).toSVG();
			
			var w = this.scale * parseFloat(this.width);
			var h = this.scale * parseFloat(this.height);
			this.svgRootElement = new JenScript.SVGViewBox().Id(this.Id).viewBox("0 0 "+this.width+" "+this.height).width(w).height(h).toSVG();
			var viewContainer = document.getElementById(this.name);
			viewContainer.appendChild(this.svgRootElement);
		},
		
		/**
		 * create view global definitions node
		 * add some commons textures with globals IDs
		 */
		createViewDefsNode : function(){
			this.svgViewGlobalDefinitions = new JenScript.SVGGroup().Id(this.Id+'_global_definitions').toSVG();
			this.svgRootElement.appendChild(this.svgViewGlobalDefinitions);
			
			var c1 =JenScript.Texture.getTriangleCarbonFiber();
			c1.Id = 'texture_carbon1';
			this.definesTexture(c1);
			
			var c2 =JenScript.Texture.getSquareCarbonFiber();
			c2.Id = 'texture_carbon2';
			this.definesTexture(c2);
		},
		
		
		/**
		 * defines a texture in the global view definitions
		 * @param {String} textureId
		 * @param {Object} texture
		 */
		definesTexture : function(texture){
			var texturePattern = texture.pattern;
			var textureDefinitions = texture.definitions;
			
			if(textureDefinitions !== undefined){
				for (var i = 0; i < textureDefinitions.length; i++) {
					var def = textureDefinitions[i];
					this.svgViewGlobalDefinitions.appendChild(def.toSVG());
				}
			}
			if(texturePattern !== undefined){
				this.svgViewGlobalDefinitions.appendChild(texturePattern.Id(texture.getId()).toSVG());
			}
			
		},
		
		/**
		 * create background node
		 */
		createBackgroundNode : function(){
			this.svgRootBackground = new JenScript.SVGGroup().Id(this.Id+'_background').toSVG();
			this.svgRootElement.appendChild(this.svgRootBackground);
		},
		
		/**
		 * create foreground node
		 */
		createForegroundNode : function(){
			this.svgRootForeground = new JenScript.SVGGroup().Id(this.Id+'_foreground').toSVG();
			this.svgRootElement.appendChild(this.svgRootForeground);
//			var svgForeground = new JenScript.SVGGroup().Id(this.Id+'_foreground').toSVG();
//			
//			this.svgForegroundDefinitions = new JenScript.SVGGroup().Id(this.Id+'_foreground_definitions').toSVG();
//			this.svgForegroundGraphics = new JenScript.SVGGroup().Id(this.Id+'_foreground_graphics').toSVG();
//			svgForeground.appendChild(this.svgForegroundDefinitions);
//			svgForeground.appendChild(this.svgForegroundGraphics);
//			
//			this.svgRootElement.appendChild(svgForeground);
//			this.setViewForeground(this.viewForeground);//force default
		},
		
		/**
		 * create projection node
		 */
		createProjectionsNode : function(){
			this.svgProjections = new JenScript.SVGGroup().Id(this.Id+'_projections').toSVG();
			this.svgRootElement.appendChild(this.svgProjections);
		},
		
		/**
		 * contextualize selectors graphics
		 */
		createSelectorsNode : function(){
			var svgSelectors = document.createElementNS(this.SVG_NS,"g");
			svgSelectors.setAttribute("id",this.Id+'_selectors');
			
			this.svgSelectorsDefinitions = document.createElementNS(this.SVG_NS,"g");
			this.svgSelectorsDefinitions.setAttribute("id",this.Id+'_selectors_definitions');
			
			this.svgSelectorsGraphics = document.createElementNS(this.SVG_NS,"g");
			this.svgSelectorsGraphics.setAttribute("id",this.Id+'_selectors_graphics');

			svgSelectors.appendChild(this.svgSelectorsDefinitions);
			svgSelectors.appendChild(this.svgSelectorsGraphics);
			
			this.svgRootElement.appendChild(svgSelectors);
		},
		
		
		/**
		 * create widgets node
		 */
		createWidgetsNode : function(){
			var svgWidgets = document.createElementNS(this.SVG_NS,"svg");
			svgWidgets.setAttribute("id",this.Id+'_widgets');
			svgWidgets.setAttribute("x",this.west);
			svgWidgets.setAttribute("y",this.north);
			svgWidgets.setAttribute("width",this.devicePart.getWidth());
			svgWidgets.setAttribute("height",this.devicePart.getHeight());
			
			this.svgWidgetsDefinitions = document.createElementNS(this.SVG_NS,"defs");
			this.svgWidgetsDefinitions.setAttribute('id',this.Id+'_widgets_definitions');
			svgWidgets.appendChild(this.svgWidgetsDefinitions);
			
			this.svgWidgetsGraphics = document.createElementNS(this.SVG_NS,"g");
			this.svgWidgetsGraphics.setAttribute('id',this.Id+'_widgets_graphics');
			svgWidgets.appendChild(this.svgWidgetsGraphics);
			
			this.svgRootElement.appendChild(svgWidgets);
		},
		
		/**
		 * create dispatcher node
		 */
		createDispatcherNode : function(){
			this.svgDispatcher = new JenScript.SVGGroup().Id(this.Id+'_dispatcher').toSVG();
			this.svgRootElement.appendChild(this.svgDispatcher);
			this.contextualizeViewDispatcher(this.southPart,new JenScript.Point2D(0,(this.height - this.south)));
			this.contextualizeViewDispatcher(this.northPart,new JenScript.Point2D(0,0));
			this.contextualizeViewDispatcher(this.eastPart,new JenScript.Point2D((this.width - this.east), this.north));
			this.contextualizeViewDispatcher(this.westPart,new JenScript.Point2D(0, this.north));
			this.contextualizeViewDispatcher(this.devicePart,new JenScript.Point2D(this.west, this.north));
		},
		
		/**
		 * contextualize projection on register
		 * @param {Object} projection
		 */
		contextualizeGraphicsProjection : function(projection){
			
			this.attachProjectionActiveListener(projection);
			this.attachProjectionSelectorListener(projection);
			
			projection.svgRootGroup = document.createElementNS(this.SVG_NS,"g");
			projection.svgRootGroup.setAttribute("xmlns",this.SVG_NS);
			projection.svgRootGroup.setAttribute("id",projection.Id+'_group');
			
			
			projection.svgRootElement = document.createElementNS(this.SVG_NS,"svg");
			projection.svgRootElement.setAttribute("id",projection.Id);
			projection.svgRootElement.setAttribute("xmlns",JenScript.SVG_NS);
			projection.svgRootElement.setAttribute("xmlns:xlink",JenScript.XLINK_NS);
			
			projection.svgRootElement.setAttribute("version","1.1");
			projection.svgRootElement.setAttribute("viewBox","0 0 "+this.width+" "+this.height);
			
			projection.svgDefsElement = document.createElementNS(this.SVG_NS,"defs");
			projection.svgDefsElement.setAttribute("id",projection.Id+'_definitions');
			projection.svgRootElement.appendChild(projection.svgDefsElement);
			
			projection.svgPartsGroup = document.createElementNS(this.SVG_NS,"g");
			projection.svgPartsGroup.setAttribute("xmlns",this.SVG_NS);
			projection.svgPartsGroup.setAttribute("id",projection.Id+'_parts');
			projection.svgRootElement.appendChild(projection.svgPartsGroup);
			
			
			projection.svgRootGroup.appendChild(projection.svgRootElement);
			
			this.svgProjections.appendChild(projection.svgRootGroup);
			
			projection.svgPartPlugins ={};
			this.contextualizeProjectionPartGraphics(projection,this.southPart,new JenScript.Point2D(0,(this.height - this.south)));
			this.contextualizeProjectionPartGraphics(projection,this.northPart,new JenScript.Point2D(0,0));
			this.contextualizeProjectionPartGraphics(projection,this.eastPart,new JenScript.Point2D((this.width - this.east), this.north));
			this.contextualizeProjectionPartGraphics(projection,this.westPart,new JenScript.Point2D(0, this.north));
			this.contextualizeProjectionPartGraphics(projection,this.devicePart,new JenScript.Point2D(this.west, this.north));
		},
		
		
		/**
		 * attach projection bound listener that update selector plugin 
		 *  - on projection bound change
		 */
		attachProjectionSelectorListener : function(projection){
			var that=this;
			projection.addProjectionListener('boundChanged',function(proj){
				that.selectorPlugin.repaintPlugin('selector bound listener');
			},'projection bound listener to repaint selector');
			projection.addProjectionListener('pluginRegister',function(proj){
				that.selectorPlugin.repaintPlugin('selector plugin register listener');
			},'projection plugin register listener to repaint selector');
			
		},
		
		/**
		 * attach projection lock/unlock listener that update projection visibility
		 * based on active state and projection policy
		 */
		attachProjectionActiveListener : function(projection){
			var that = this;
			var checkOpacity = function(){
				var projs = that.getProjections();
				for (var i = 0; i < projs.length; i++) {
					var proj = projs[i];
					if(proj.isAuthorizedPolicy('paint'))
						proj.svgRootGroup.setAttribute('opacity',1);
					else
						proj.svgRootGroup.setAttribute('opacity',0);
				}
			}
			
			projection.addProjectionListener('lockActive',function(proj){
				//proj.svgRootGroup.setAttribute('opacity',1);
				checkOpacity();
			},'view projection active listener to change projection opacity');
			projection.addProjectionListener('unlockActive',function(proj){
				checkOpacity();
//				if(proj.isAuthorizedPolicy('paint'))
//					proj.svgRootGroup.setAttribute('opacity',1);
//				else
//					proj.svgRootGroup.setAttribute('opacity',0);
			},'view projection unactive listener to change projection opacity');
		},
		
		
		/**
		 * contextualize projection part
		 * @param {Object} projection
		 * @param {Object} component
		 * @param {Object} location
		 */
		contextualizeProjectionPartGraphics : function(projection,component,location){
			var svgRootElement = document.createElementNS(this.SVG_NS,"svg");
			svgRootElement.setAttribute("id",projection.Id+'_'+component.part);
			
			var svgPluginPart = document.createElementNS(this.SVG_NS,"g");
			svgPluginPart.setAttribute('id',projection.Id+'_'+component.part+'_plugins');
			svgRootElement.appendChild(svgPluginPart);

			svgRootElement.setAttribute("x",location.getX());
			svgRootElement.setAttribute("y",location.getY());
			svgRootElement.setAttribute("width",component.getWidth());
			svgRootElement.setAttribute("height",component.getHeight());
			
			projection.svgPartPlugins[component.part] = svgPluginPart;
			projection.svgPartsGroup.appendChild(svgRootElement);
		},
		
		/**
		 * contextualize the given plugin on register
		 * @param {Object} plugin
		 */
		contextualizePluginGraphics : function(plugin){
			//console.log('contextualize plugin :'+plugin);
			var proj = plugin.getProjection();
			var that = this;
			plugin.svgRoot ={};
			plugin.svgPluginPartsGraphics ={};
			plugin.svgPluginPartsDefinitions={};
			var contextualizePluginPart = function(component){
				var svgRootElement = document.createElementNS(that.SVG_NS,"g");
				svgRootElement.setAttribute("id",proj.Id+'_'+component.part+'_'+plugin.Id);
				
				svgRootElement.setAttribute("transform","translate("+plugin.tx+","+plugin.ty+") scale("+plugin.sx+","+plugin.sy+")");
				
				var svgPluginPartDefinitions = document.createElementNS(that.SVG_NS,"defs");
				svgPluginPartDefinitions.setAttribute("id",proj.Id+'_'+component.part+'_'+plugin.Id+'_definition');
				svgRootElement.appendChild(svgPluginPartDefinitions);
				
				var svgPluginPartGraphics = document.createElementNS(that.SVG_NS,"g");
				svgPluginPartGraphics.setAttribute("id",proj.Id+'_'+component.part+'_'+plugin.Id+'_graphics');
				svgRootElement.appendChild(svgPluginPartGraphics);
				
				plugin.svgRoot[component.part] = svgRootElement;
				plugin.svgPluginPartsGraphics[component.part] = svgPluginPartGraphics;
				plugin.svgPluginPartsDefinitions[component.part] = svgPluginPartDefinitions;
				
				function insertAfter(plg, newNode) {
					var node = document.getElementById("id",proj.Id+'_'+component.part+'_'+plg.Id);
					proj.svgPartPlugins[component.part].insertBefore(newNode, node.nextSibling);
				}
				
//				var index = proj.getIndexOf(plugin);
//				var countAll = proj.getPlugins().length;
//				if(index === countAll-1){
//					if(component.part === 'Device'){
//						console.log('natural insert, contextualize plugin :'+plugin.Id+" with index : "+index+" for part "+component.part);	
//					}
//					
//				}else{
//					if(component.part === 'Device'){
//						
//						//console.log('shift insert, should be inserted');
//						console.log('shift insert, contextualize plugin :'+plugin.Id+" with index : "+index+" for part "+component.part);
//						
//						if(index == 0){//first position
//							
//						}else{
//							
//						}
//						
//						var pluginBefore = proj.getPluginAtIndex(index-1);
//						console.log('plugin before:'+pluginBefore);
////						if(pluginBefore !== undefined){
////							insertAfter(pluginBefore,svgRootElement);
////						}else{
////							proj.svgPartPlugins[component.part].appendChild(svgRootElement);
////						}
//					}
//					
//				}
				
				
				proj.svgPartPlugins[component.part].appendChild(svgRootElement);
				
			};
			contextualizePluginPart(this.southPart);
			contextualizePluginPart(this.northPart);
			contextualizePluginPart(this.eastPart);
			contextualizePluginPart(this.westPart);
			contextualizePluginPart(this.devicePart);
			plugin.contextualized = true;
			plugin.repaintPlugin();
			
			
			//repaint all according to new priority
			
		},
		
		/**
		 * contextualize view dispatcher for the given part component
		 * @param {Object} projection
		 * @param {Object} component the part component
		 * @param {Object} location the origin location of component in view
		 */
		contextualizeViewDispatcher : function(component,location){
			var svgRootElement = document.createElementNS(this.SVG_NS,"svg");
			svgRootElement.setAttribute("id",this.Id+'_'+component.part+'_dispatcher');
			svgRootElement.setAttribute("x",location.getX()+'px');
			svgRootElement.setAttribute("y",location.getY()+'px');
			svgRootElement.setAttribute("width",component.getWidth()+'px');
			svgRootElement.setAttribute("height",component.getHeight()+'px');
			
			var s = document.createElementNS(this.SVG_NS,"rect");
			s.setAttribute("id",this.Id+'_dispatcher');
			s.setAttribute("x",'0');
			s.setAttribute("y",'0');
			s.setAttribute("width",component.getWidth());
			s.setAttribute("height",component.getHeight());
			s.setAttribute('style','stroke: black;stroke-opacity: 0; fill: #0000ff;fill-opacity :0');
			//s.setAttribute("pointer-events",'all');
			
			
			var getLocation = function(evt) {
				
				//var rect = evt.currentTarget.getBoundingClientRect();
				var rect = s.getBoundingClientRect();
				var bx = rect.left;
				var by = rect.top;
				var x = evt.clientX-bx;
				var y = evt.clientY-by;
				return{x:x,y:y};
			};
			var that = this;
			
			var dispatchMouse = function(evt,action) {
				var loc = getLocation(evt);
				that.getComponent(component.part).on(action,evt, loc.x, loc.y);
			};
			
			var dispatchTouch = function(evt,action) {
				 if(evt.preventDefault){
					 evt.preventDefault();
				 }else if(evt.defaultPrevented){
					 evt.defaultPrevented=true;
				 }
				 var touch = evt.touches[0];
				 var type = undefined;
				 if(evt.type === 'touchmove')
					 type='mousemove';
				 if(evt.type === 'touchdstart')
					 type='mousedown';
				 if(evt.type === 'touchend'){
					 type='mouseup';
					 touch = evt.changedTouches[0];
				 }
				 
				 var mouseEvent = new MouseEvent(type, {
				    clientX: touch.clientX,
				    clientY: touch.clientY,
				  });
				 
				 var rect = s.getBoundingClientRect();
				  
				//console.log(action+" ",loc.x, loc.y+' in part '+component.part);
				that.getComponent(component.part).on(action,mouseEvent,(touch.clientX-rect.left), (touch.clientY-rect.top));
			};
			
			//bubling
			//Selection and Navigation of Overlapping SVG Objects
			//https://www.stat.auckland.ac.nz/~joh024/Research/D3js/SelNavSVG/SelNavSVG.html
	    	
			if ('ontouchstart' in window) {
				console.log("touch is supported");
				s.addEventListener("touchstart", function(evt){dispatchTouch(evt,'Press');},false);
				s.addEventListener("touchmove", function(evt){dispatchTouch(evt,'Move');},false);
				s.addEventListener("touchend", function(evt){dispatchTouch(evt,'Release');},false);
			}else{//assume that is classic desktop browser
				//classic dom mouse event
				s.addEventListener("mousemove", function(evt){dispatchMouse(evt,'Move');},false);
				s.addEventListener("mouseclick", function(evt){dispatchMouse(evt,'Click');},false);
				s.addEventListener("mousedown", function(evt){dispatchMouse(evt,'Press');},false);
				s.addEventListener("mouseup", function(evt){dispatchMouse(evt,'Release');},false);
				s.addEventListener("mouseover", function(evt){dispatchMouse(evt,'Enter');},false);
				s.addEventListener("mouseout", function(evt){dispatchMouse(evt,'Exit');},false);
				
				//special case wheel
				function MouseWheelHandler(originalEvent) {
					// cross-browser wheel delta
					var e = window.event || originalEvent; // old IE support
					var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
					
					// create a normalized event object
			         var event = {
			             // keep a ref to the original event object
			             originalEvent: e,
			             target: e.target || e.srcElement,
			             type: "wheel",
			             deltaMode: e.type == "MozMousePixelScroll" ? 0 : 1,
			             deltaX: 0,
			             deltaZ: 0,
			             preventDefault: function() {
			                 e.preventDefault ?
			                     e.preventDefault() :
			                     e.returnValue = false;
			             }
			         };
			         
			         event.deltaY = delta;
			         dispatchMouse(event,'Wheel');
				}
				if (s.addEventListener) {
					// IE9, Chrome, Safari, Opera
					s.addEventListener("mousewheel", MouseWheelHandler, false);
					// Firefox
					s.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
				}
				// IE 6/7/8
				else s.attachEvent("onmousewheel", MouseWheelHandler);
			}
			svgRootElement.appendChild(s);
			this.svgDispatcher.appendChild(svgRootElement);
		},

		/**
		 * get the device part component
		 * @returns {Object} device component
		 */
		getDevice : function() {
			return this.devicePart;
		},
		
		/**
		 * return the folder instance for the specified position
		 * 
		 * @param Id
		 *            the widget Id
		 * @param width
		 *            the widget width
		 * @param height
		 *            the widget height
		 * @param xp
		 *            the x position
		 * @param yp
		 *            the y position
		 * @return the folder instance
		 */
		newFolderIntanceByPosition : function(Id,width,height,xp,yp) {
			//console.log('newFolderIntanceByPosition for Id '+Id);
			var deviceWidth = this.getDevice().getWidth();
			var deviceHeight = this.getDevice().getHeight();
			var folderGuardInterval = this.folderGuardInterval;
			var folderMaxX =  parseInt((deviceWidth / (width + 2 * folderGuardInterval))+'');
			var folderMaxY =  parseInt((deviceHeight / (height + 2 * folderGuardInterval))+'');
			var volatilesFolders = [];
			for (var x = 0; x <= folderMaxX; x++) {
				for (var y = 0; y <= folderMaxY; y++) {
					var folder = new JenScript.WidgetFolder();
					folder.Id= Id;
					folder.width=width;
					folder.height=height;
					folder.xIndex =x ;
					folder.yIndex = y;
					folder.guardInterval= folderGuardInterval;
					volatilesFolders[volatilesFolders.length] = folder;
					if (x < folderMaxX && y < folderMaxY) {
						folder.x= (width + 2 * folderGuardInterval) * x + folderGuardInterval;
						folder.y = (height + 2 * folderGuardInterval) * y + folderGuardInterval;
					} else if (x === folderMaxX && y === folderMaxY) {
						folder.mx = true;
						folder.x=deviceWidth - width - folderGuardInterval;
						folder.y=deviceHeight - height - folderGuardInterval;
					} else if (x < folderMaxX && y === folderMaxY) {
						folder.mx = true;
						folder.x=(width + 2 * folderGuardInterval) * x + folderGuardInterval;
						folder.y=deviceHeight - height - folderGuardInterval;
					} else if (x === folderMaxX && y < folderMaxY) {
						folder.mx = false;
						folder.x=deviceWidth - width - folderGuardInterval;
						folder.y=(height + 2 * folderGuardInterval) * y + folderGuardInterval;
					}
				}
			}
			for (var i = 0; i < volatilesFolders.length; i++) {
				var vdf = volatilesFolders[i];
				if (xp > vdf.x && xp < (vdf.x + vdf.width) && yp > vdf.y && yp < vdf.y + vdf.height) {
					
					return vdf;
				}
			}
			return undefined;
		},

		/**
		 * create a new widget folder instance
		 * 
		 * @param Id
		 *            the widget Id
		 * @param width
		 *            the widget width
		 * @param height
		 *            the widget height
		 * @param xIndex
		 *            the widget folder x index
		 * @param yIndex
		 *            the widget folder y index
		 * @return widget folder
		 */
		 newWidgetFolderIntance : function(Id, width, height, xIndex, yIndex) {
			 //console.log('newWidgetFolderIntance for Id '+Id);
			var deviceWidth = this.getDevice().getWidth();
			var deviceHeight = this.getDevice().getHeight();
			var folderGuardInterval = this.folderGuardInterval;
			var folderMaxX = parseInt((deviceWidth / (width + 2 * folderGuardInterval)));
			var folderMaxY = parseInt((deviceHeight / (height + 2 * folderGuardInterval)));

			if (xIndex < 0) {
				xIndex = 0;
			}
			if (xIndex > folderMaxX) {
				xIndex = folderMaxX;
			}

			if (yIndex < 0) {
				yIndex = 0;
			}
			if (yIndex > folderMaxY) {
				yIndex = folderMaxY;
			}

			var folder = new JenScript.WidgetFolder();
			folder.Id= Id;
			folder.width=width;
			folder.height=height;
			folder.xIndex=xIndex;
			folder.yIndex=yIndex;
			folder.guardInterval=folderGuardInterval;
			if (xIndex < folderMaxX && yIndex < folderMaxY) {
				folder.x=(width + 2 * folderGuardInterval) * xIndex + folderGuardInterval; 
				folder.y=(height + 2 * folderGuardInterval) * yIndex + folderGuardInterval;
			} else if (xIndex == folderMaxX && yIndex == folderMaxY) {
				folder.x=deviceWidth - width - folderGuardInterval;
				folder.y=deviceHeight - height - folderGuardInterval;
			} else if (xIndex < folderMaxX && yIndex == folderMaxY) {
				folder.x=(width + 2 * folderGuardInterval) * xIndex + folderGuardInterval;
				folder.y = deviceHeight - height - folderGuardInterval;
			} else if (xIndex == folderMaxX && yIndex < folderMaxY) {
				folder.x=deviceWidth - width - folderGuardInterval;
				folder.y=(height + 2 * folderGuardInterval) * yIndex + folderGuardInterval;
			}
			//console.log('newWidgetFolderIntance return folder : '+folder);
			return folder;
		}
	});
})();
(function(){
	JenScript.ViewBuilder = function(config){
		config = config || {};
		var v = (config.view)? config.view :  new JenScript.View(config);
		return {
			projection : function(type, config){
				var p;
				
				if('linear' === type)
					p = new JenScript.LinearProjection(config);
				if('logx' === type)
					p = new JenScript.LogXProjection(config);
				if('logy' === type)
					p = new JenScript.LogYProjection(config);
				if('logxy' === type)
					p = new JenScript.LogXLogYProjection(config);
				if('timex' === type)
					p = new JenScript.TimeXProjection(config);
				if('timey' === type)
					p = new JenScript.TimeYProjection(config);
				
				//builder interfaces
				return {
					pie : function(config){return new JenScript.PieBuilder(v,p,config);},
					donut3d : function(config){return new JenScript.Donut3DBuilder(v,p,config);},
					donut2d : function(config){return new JenScript.Donut2DBuilder(v,p,config);},
				}
			}
		};
	};
})();
(function(){
	JenScript.Model.addMethods(JenScript.Projection,{
		
		/**
		 * Initialize this projection with given parameters config
		 * @param {Object} config
		 * @param {String} [config.name] Projection name
		 * @param {String} [config.themeColor] Projection theme color 
		 */
		init : function(config){
			config = config || {};
			this.Id = 'proj_'+JenScript.sequenceId++;
			this.name = (config.name !== undefined)?config.name : 'proj_undefined_name'+this.Id;
			this.initial = true;
			this.themeColor = (config.themeColor !== undefined)?config.themeColor:JenScript.createColor();
			this.listeners =[];
			this.view = undefined;
			this.plugins = [];
			this.visible = true;
			
			/**paint mode is always(paint always) or active(paint only if active)*/
			//this.paintMode = (config.paintMode !== undefined)?config.paintMode : 'ALWAYS';
			
			this.policy = (config.policy !== undefined)?config.policy : { paint : 'ALWAYS' /** ALWAYS, RUNTIME */ , event :  'ACTIVE' /** ALWAYS, RUNTIME */ }
			
			if(this.policy.paint === undefined)
				this.policy.paint = 'ACTIVE';
			if(this.policy.event === undefined)
				this.policy.event = 'ACTIVE';
			
			this.isPaintPolicy = (config.isPaintPolicy !== undefined)?config.isPaintPolicy :function(){return true;};
			this.isEventPolicy = (config.isEventPolicy !== undefined)?config.isEventPolicy :function(){return true;};
			
			
			/**active , active put projection at the last level painting z order, and received events. see view setActive projection*/
			this.active = false;
		},
		
		isAuthorizedPolicy : function(check){
			if(check === 'paint'){
				if((this.policy.paint === 'ACTIVE' && this.active) || this.policy.paint === 'ALWAYS')
					return true;
				if((this.policy.paint === 'ACTIVE' && !this.active))
					return false
				if(this.policy.paint === 'RUNTIME'){
					return this.isPaintPolicy();
				}
			}else if(check === 'event'){
				if((this.policy.event === 'ACTIVE' && this.active) || this.policy.event === 'ALWAYS')
					return true;
				if((this.policy.event === 'ACTIVE' && !this.active))
					return false
				if(this.policy.event === 'RUNTIME'){
					return this.isEventPolicy();
				}
			}
		},
		
		/**
		 * return string representation of this projection
		 */
		toString : function(){
			var v = (this.getView() === undefined)?'view not still bind' : this.getView().Id;
			return 'JenScript.Projection=[Id:'+this.Id+',active :'+this.isActive()+','+this.getMinX()+','+this.getMaxX()+','+this.getMinY()+','+this.getMaxY()+','+v+']';
		},
		
		/**
		 * bind actions : lockActive,unlockActive,boundChanged,viewRegister, pluginRegister
		 */
		addProjectionListener  : function(actionEvent,listener,name){
			if(name === undefined)
				throw new Error('Projection listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener,name:name};
			this.listeners[this.listeners.length] =l;
		},
		
		
	
		/**
		 * fire listener when projection is being to lock, unlock, and bound changed.
		 */
		fireProjectionEvent : function(actionEvent){
			for (var i = 0; i < this.listeners.length; i++) {
				var l = this.listeners[i];
				if(actionEvent === l.action){
					//l.onEvent({projection : this});
					l.onEvent(this);
				}
			}
		},

		/**
		 * get projection Id
		 */
		getId : function() {
			return this.Id;
		},

		setVisible : function(visible) {
			this.visible = visible;
			if(visible && this.svgRootGroup)
				this.svgRootGroup.setAttribute('opacity',1);
			else
				this.svgRootGroup.setAttribute('opacity',0);
		},

		isVisible : function() {
			return this.visible;
		},
		
		setActive : function(active) {
			this.active = active;
			if(this.active){
				this.fireProjectionEvent('lockActive');
			}else{
				this.fireProjectionEvent('unlockActive');
			}
		},

		isActive : function() {
			return this.active;
		},
		
		setName : function(name) {
			this.name = name;
		},

		getName : function() {
			return this.name;
		},

		setView : function(view) {
			this.view = view;
			var that = this;
			view.addViewListener('projectionRegister', function(){
				that.fireProjectionEvent('viewRegister');
			}, " fire view registered in projection")
		},

		getView : function() {
			return this.view;
		},

		setThemeColor : function(themeColor) {
			this.themeColor = themeColor;
		},

		getThemeColor : function() {
			return this.themeColor;
		},
		

		/**
		 * register the given plugin in this projection
		 * @param {Object} plugin to unregister
		 */
		unregisterPlugin : function(plugin) {
			var plugins = [];
			for (var i = 0; i < this.plugins.length; i++) {
				var p = this.plugins[i];
				if(p.Id === plugin.Id){
					plugin.destroyGraphics();
					plugin.contextualized = false;
				}else{
					plugins[plugins.length] = p;
				}
			}
			this.plugins = plugins;
		},
		
		/**
		 * register the given plugin in this projection
		 * @param {Object} plugin to register
		 */
		registerPlugin : function(plugin) {
			//console.log("register plugin : "+plugin.name);
			if(plugin.getProjection() !== undefined && plugin.getProjection().Id !== this.Id)
				throw new Error('Plugin '+plugin.name+' projection is already set, plugin can not be shared projection.');
			//console.log("register plugin "+plugin);
			plugin.setProjection(this);
			this.plugins[this.plugins.length] = plugin;
			var that = this;
			
			plugin.addPluginListener('lock',function(selectedPlugin){
				//console.log("plugin selected : "+selectedPlugin.name+ " from projection +"+that.name);
				//unselect other selectable plugin that shared this projection
				for (var p = 0; p < that.plugins.length; p++) {
					var plugin = that.plugins[p];
					if(plugin.Id !== selectedPlugin.Id  && plugin.isSelectable() && plugin.isLockSelected()){
						//console.log("plugin to passivate : "+plugin.name);
						plugin.unselect();
					}
				}
			},'Projection plugin lock/unlock listener');
			
			this.plugins.sort(function(p1, p2) {
				var x = p1.getPriority();
				var y = p2.getPriority();
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
			
			plugin.onProjectionRegister();
			this.getView().contextualizePluginGraphics(plugin);
			this.fireProjectionEvent('pluginRegister');
		},
		
		/**
		 * get plugin registered in this projection
		 */
		getPlugins : function() {
			return this.plugins;
		},
		
		
		/**
		 * get plugin at the given index
		 */
		getPluginAtIndex : function(index) {
			return this.plugins[index];
		},
		
		/**
		 * get the index of the given plugin
		 */
		getIndexOf : function(plugin) {
			for (var p = 0; p < this.plugins.length; p++) {
				if(plugin.Id === this.plugins[p].Id)
					return p;
			}
			return -1;
		},

		getUserWidth : function() {
			return this.maxX - this.minX;
		},

		getUserHeight : function() {
			return this.maxY - this.minY;
		},

		getPixelWidth : function() {
			return this.view.getDevice().width;
		},

		getPixelHeight : function() {
			return this.view.getDevice().height;
		},

		getMinX : function() {
			return this.minX;
		},

		getMaxX : function() {
			return this.maxX;
		},

		getMinY : function() {
			return this.minY;
		},

		getMaxY : function() {
			return this.maxY;
		},
		
		getBounds : function(){
			return {minX : this.getMinX(),maxX : this.getMaxX(),minY : this.getMinY(),maxY : this.getMaxY()};
		},

		userToPixel : function(userPoint) {
			return new JenScript.Point2D(this.userToPixelX(userPoint.x),this.userToPixelY(userPoint.y));
		},

		pixelToUser : function(pixelPoint) {
			return new JenScript.Point2D(this.pixelToUserX(pixelPoint.x),this.pixelToUserY(pixelPoint.y));
		},
});
})();
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
(function(){
	/**
	 *<code>Indentity projection</code> defines a linear projection bound on [-1,1,-1,1]
	 */
	JenScript.IdentityProjection = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.IdentityProjection, JenScript.LinearProjection);
	JenScript.Model.addMethods(JenScript.IdentityProjection,{
		
		__init : function(config){
			config = config || {};
			JenScript.LinearProjection.call(this, config);
			this.bound(-1,1,-1,1);
		},
	});
})();
	
(function(){
	/**
	 * The <code>LogX</code> class defines a composite logarithmic linear projection
	 * with logarithmic x and linear y projection.
	 * Constructs a new projection with logarithmic on x dimension and linear
	 * on y dimension with specified user metrics parameters.
	 * 
	 */
	JenScript.LogXProjection = function(config) { 
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LogXProjection, JenScript.LinearProjection);
	JenScript.Model.addMethods(JenScript.LogXProjection,{
		
		__init : function(config){
			JenScript.LinearProjection.call(this, config);
		},
		
		validateBound : function (minX,maxX,minY,maxY){
			if (minX > maxX) {
				throw new Error("projection "+this.name+" error: maxx argument should be greater than minx");
			}
			if (minY > maxY) {
				throw new Error("projection "+this.name+" error: maxy argument should be greater than miny");
			}
			if (minX <= 0) {
				throw new Error("projection "+this.name+" error: min x value should be grater than 0 , out of Log range authorized.");
			}
			
		},
		
		userToPixelX : function(userX) {
			var scaleXLog = this.getPixelWidth() / (JenScript.Math.log10(this.getMaxX()) - JenScript.Math.log10(this.getMinX()));
			return scaleXLog * (JenScript.Math.log10(userX) - JenScript.Math.log10(this.getMinX()));
		},

		pixelToUserX : function(pixelX) {
			var scaleXLog = this.getPixelWidth() / (JenScript.Math.log10(this.getMaxX()) - JenScript.Math.log10(this.getMinX()));
			return Math.pow(10, pixelX / scaleXLog + JenScript.Math.log10(this.getMinX()));
		},
		
	});
})();
(function(){
	
	/**
	 * The <code>LogY</code> class defines a composite logarithmic linear projection
	 * with linear x projection and logarithmic y projection 
	 * Constructs a new projection with logarithmic on x dimension and linear
	 * on y dimension with specified user metrics parameters.
	 * 
	 * @param minx
	 *            the projection minimum x to set
	 * @param maxx
	 *            the projection maximum x to set
	 * @param miny
	 *            the projection minimum y to set,should be greater than 0
	 * @param maxy
	 *            the projection maximum y to set
	 */
	JenScript.LogYProjection = function(config) { 
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LogYProjection, JenScript.LinearProjection);
	JenScript.Model.addMethods(JenScript.LogYProjection,{
		
		__init : function(config){
			JenScript.LinearProjection.call(this, config);
		},
		
		validateBound : function (minX,maxX,minY,maxY){
			if (minX > maxX) {
				throw new Error("projection "+this.name+" error: maxx argument should be greater than minx");
			}
			if (minY > maxY) {
				throw new Error("projection "+this.name+" error: maxy argument should be greater than miny");
			}
			if (minY <= 0) {
				throw new Error("projection "+this.name+" error: min y value should be grater than 0 , out of Log range authorized.");
			}
			
		},
		
		userToPixelY : function(userY) {
			var scaleYLog = this.getPixelHeight() / (JenScript.Math.log10(this.getMaxY()) - JenScript.Math.log10(this.getMinY()));
			return -scaleYLog * (JenScript.Math.log10(userY) - JenScript.Math.log10(this.getMaxY()));
		},

		pixelToUserY : function (pixelY) {
			
			var scaleYLog = this.getPixelHeight() / (JenScript.Math.log10(this.getMaxY()) - JenScript.Math.log10(this.getMinY()));
			return Math.pow(10, -(pixelY / scaleYLog - JenScript.Math.log10(this.getMaxY())));
		},
		
	});
	
})();
(function(){
	
	JenScript.LogXLogYProjection = function(config) { 
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LogXLogYProjection, JenScript.LinearProjection);
	JenScript.Model.addMethods(JenScript.LogXLogYProjection,{
		
		__init : function(config){
			JenScript.LinearProjection.call(this, config);
		},
		
		validateBound : function (minX,maxX,minY,maxY){
			if (minX > maxX) {
				throw new Error("projection "+this.name+" error: maxx argument should be greater than minx");
			}
			if (minY > maxY) {
				throw new Error("projection "+this.name+" error: maxy argument should be greater than miny");
			}
			if (minX <= 0) {
				throw new Error("projection "+this.name+" error: min x value should be grater than 0 , out of Log range authorized.");
			}
			if (minY <= 0) {
				throw new Error("projection "+this.name+" error: min y value should be grater than 0 , out of Log range authorized.");
			}
			
		},
		
		userToPixelX : function(userX) {
			return JenScript.LogXProjection.prototype.userToPixelX.call(this, userX);
		},
		
		userToPixelY : function(userY) {
			return JenScript.LogYProjection.prototype.userToPixelY.call(this, userY);
		},

		pixelToUserX : function(pixelX) {
			return JenScript.LogXProjection.prototype.pixelToUserX.call(this, pixelX);
		},

		pixelToUserY : function (pixelY) {
			return JenScript.LogYProjection.prototype.pixelToUserY.call(this, pixelY);
		},
		
	});
	
})();
(function(){
	JenScript.TimeProjection = function(config) { 
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TimeProjection, JenScript.LinearProjection);
	JenScript.Model.addMethods(JenScript.TimeProjection,{
		
		__init : function(config){
			JenScript.LinearProjection.call(this, config);
		},
	
		/**
		 * get the time duration in millisecond of this time projection between min
		 * date and max date
		 * 
		 * @return duration millisecond
		 */
		durationMillis : function() {
			return this.getMaxDate().getTime() - this.getMinDate().getTime();
		},

		/**
		 * get the time duration in minutes of this time projection between min date
		 * and max date
		 * 
		 * @return duration minutes
		 */
		durationMinutes : function() {
			var minutesMillis = 1000 * 60;
			var minutes = this.durationMillis() / minutesMillis;
			return minutes;
		},

		/**
		 * get the time duration in hours of this time projection between min date
		 * and max date
		 * 
		 * @return duration hours
		 */
		durationHours : function() {
			var hourMillis = 1000 * 60 * 60;
			var hours = this.durationMillis() / hourMillis;
			return hours;
		},

		/**
		 * get the time duration in days of this time projection between min date
		 * and max date
		 * 
		 * @return duration days
		 */
		durationDays : function() {
			var dayMillis = 1000 * 60 * 60 * 24;
			var days = this.durationMillis() / dayMillis;
			return days;
		},

		/**
		 * get the time duration in weeks of this time projection between min date
		 * and max date
		 * 
		 * @return duration weeks
		 */
		durationWeeks :  function() {
			var weekMillis = 1000 * 60 * 60 * 24 * 7;
			var weeks = this.durationMillis() / weekMillis;
			return weeks;
		},

		/**
		 * get the time duration in month of this time projection between min date
		 * and max date
		 * 
		 * @return duration month
		 */
		durationMonth : function() {
			var monthMillis = 1000 * 60 * 60 * 24 * 7 * 4;
			var months = this.durationMillis() / monthMillis;
			return months;
		},
		
		/**
		 * get the time duration in years of this time projection between min date
		 * and max date
		 * 
		 * @return duration years
		 */
		durationYear : function() {
			var yearMillis = 1000 * 60 * 60 * 24 * 365;
			var years = this.durationMillis() / yearMillis;
			return years;
		}
		
	});
})();
(function(){
	
	JenScript.TimeXProjection = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TimeXProjection, JenScript.TimeProjection);
	JenScript.Model.addMethods(JenScript.TimeXProjection,{
		
		___init : function(config){
			config.minX = config.minXDate.getTime();
			config.maxX = config.maxXDate.getTime();
			JenScript.TimeProjection.call(this, config);
		},
				
		getMinDate : function(){
			return this.getMinXAsDate();
		},

		getMaxDate :  function() {
			return this.getMaxXAsDate();
		},

		/**
		 * get min x as a date value
		 * 
		 * @return min date
		 */
		getMinXAsDate : function() {
			return new Date(this.getMinX());
		},

		/**
		 * get max x as date value
		 * 
		 * @return max date
		 */
		getMaxXAsDate : function() {
			return new Date(this.getMaxX());
		},
		
		pixelToTime : function(pixel) {
			var dateMillis = this.pixelToUserX(pixel);
			return new Date(dateMillis);
		},

		timeToPixel : function(date){
			var userValue = date.getTime();
			return this.userToPixelX(userValue);
		},

		
		getTimeDurationPixel : function() {
			return this.getPixelWidth();
		},

		/**
		 * bound this {@link TimeX} projection with given times min and max date for
		 * x dimension
		 * 
		 * @param minXDate
		 * @param maxXDate
		 * @param miny
		 * @param maxy
		 */
		boundTimeX : function(minXDate, maxXDate, miny, maxy) {
			this.bound(minXDate.getTime(), maxXDate.getTime(), miny, maxy);
		}
	});
})();


(function(){
	
	JenScript.TimeYProjection = function(config) {
		this.___init(config);
	};
	
	JenScript.Model.inheritPrototype(JenScript.TimeYProjection, JenScript.TimeProjection);
	JenScript.Model.addMethods(JenScript.TimeYProjection,{
	
		___init : function(config){
			config.minY = config.minYDate.getTime();
			config.maxY = config.maxYDate.getTime();
			JenScript.TimeProjection.call(this, config);
		},
	
		/**
		 * get min y as a date value
		 * 
		 * @return min date
		 */
		getMinYAsDate : function() {
			return new Date(this.getMinY());
		},

		/**
		 * get max y as date value
		 * 
		 * @return max date
		 */
		getMaxYAsDate :  function() {
			return new Date(this.getMaxY());
		},


		getMinDate : function() {
			return this.getMinYAsDate();
		},

		getMaxDate : function() {
			return this.getMaxYAsDate();
		},


		pixelToTime :  function(pixel) {
			var dateMillis = this.pixelToUserY(pixel);
			return new Date(dateMillis);
		},

		
		timeToPixel : function(time) {
			var userValue = time.getTime();
			return this.userToPixelY(userValue);
		},


		getTimeDurationPixel : function() {
			return this.getPixelHeight();
		},

		/**
		 * bound this {@link TimeY} projection with given times min and max date for
		 * y dimension
		 * 
		 * @param minx
		 * @param maxx
		 * @param minYDate
		 * @param maxYDate
		 */
		boundTimeY : function(minX,maxX,minYDate,maxYDate) {
			this.bound(minX, maxX, minYDate.getTime(),maxYDate.getTime());
		},

		/**
		 * get the y time frame as number of a minutes
		 * 
		 * @return number of minutes
		 */
		getHeightAsMinutes : function () {
			var startMillis = this.getMinY();
			var endMillis = this.getMaxY();
			var width = endMillis - startMillis;
			var minutesMillis = 1000 * 60;
			var heightAsMinutes = width / minutesMillis;
			return heightAsMinutes;
		}
	
	});
})();

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
(function(){
	
		JenScript.Model.addMethods(JenScript.Plugin, {
		
		init : function(config){
			config = config || {};
			this.projection = undefined;
			this.name = (config.name !== undefined) ? config.name : "AnonymousPlugin";
			this.Id = 'plugin_'+this.name+'_'+JenScript.sequenceId++;
			this.priority = (config.priority!== undefined) ? config.priority : 0;
			this.selectable = (config.selectable!== undefined) ? config.selectable : false;
			this.pluginlisteners=[];
			this.widgets=[];
			this.lockSelected = false;
			this.lockPassive = false;
			this.contextualized = false;
			
			//transforms beta
			this.tx = 0;
			this.ty = 0;
			this.sx = 1;
			this.sy = 1;
		},
		
		resetTransform : function(){
			this.tx = 0;
			this.ty = 0;
			this.sx = 1;
			this.sy = 1;
			if(this.svgRoot !== undefined){
				this.applyTransform();
			}
		},
		
		applyTransform : function(){
			this.svgRoot['Device'].setAttribute("transform","translate("+this.tx+","+this.ty+") scale("+this.sx+","+this.sy+")");
			this.svgRoot['West'].setAttribute("transform","translate("+this.tx+","+this.ty+") scale("+this.sx+","+this.sy+")");
			this.svgRoot['East'].setAttribute("transform","translate("+this.tx+","+this.ty+") scale("+this.sx+","+this.sy+")");
			this.svgRoot['South'].setAttribute("transform","translate("+this.tx+","+this.ty+") scale("+this.sx+","+this.sy+")");
		},
		
		translate : function(tx,ty,fire){
			this.tx = tx;
			this.ty = ty;
			if(this.svgRoot !== undefined){
				this.applyTransform();
				if(fire === undefined || fire !== false)
				this.firePluginEvent('translate');
			}
		},
		
		scale : function(sx,sy,fire){
			this.sx = sx;
			this.sy = sy;
			if(this.svgRoot !== undefined){
				this.applyTransform();
				if(fire === undefined || fire !== false)
				this.firePluginEvent('scale');
			}
		},
		
		u2p : function(u){
			 var p = this.getProjection().userToPixel(u);
			 return new JenScript.Point2D(p.x*this.sx+this.tx,p.y*this.sy+this.ty);
		},
		 
		p2u : function(p){
			return this.getProjection().pixelToUser(new JenScript.Point2D((p.x-this.tx)/this.sx,(p.y-this.ty)/this.sy));
			//return this.getProjection().pixelToUser(new JenScript.Point2D(p.x/plugin.sx-plugin.tx,p.y/plugin.sy-plugin.ty));
		},
		
		getId : function(){
			return this.Id;
		},
		
		toString : function(){
			return 'JenScript.Plugin=[' +this.name+','+this.Id+']';
		},
		
		getProjection : function() {
			return this.projection;
		},
		
		
		/**
		 * get convenient way to get view
		 */
		getView : function(){
			try{
				return this.getProjection().getView();
			}catch(e){
				return undefined;
			}
		},
		
		getProjections : function() {
			return this.getView().getProjections();
		},
		
		getSouth : function(h){
			return this.getView().south;
		},
		getWest : function(h){
			return this.getView().west;
		},
		getNorth : function(h){
			return this.getView().north;
		},
		getEast : function(h){
			return this.getView().east;
		},
		
		
		/**
		 * get convenient way to get Device
		 */
		getDevice : function(){
			try{
				return this.getView().getDevice();
			}catch(e){
				return undefined;
			}
		},
		
		/**
		 * get widget plugin
		 */
		getWidgetPlugin: function(){
			return this.getView().getWidgetPlugin();
		},
		
		/**
		 * get the plugin part graphics context
		 * @param {String} part
		 * @returns {Object} plugin graphics context
		 */
		getGraphicsContext : function(part){
			if(!this.contextualized)
				return undefined;
			try{
				return new JenScript.Graphics({definitions : this.svgPluginPartsDefinitions[part],graphics : this.svgPluginPartsGraphics[part], selectors : this.getProjection().getView().svgSelectors});	
			}catch(e)
			{
				//console.log("catch bad graphics");
				return undefined;
			}
		},
		
		
		/**
		 * destroy all plugin graphics elements
		 */
		destroyGraphics : function(){
			this.getGraphicsContext(JenScript.ViewPart.South).clearGraphics();
			this.getGraphicsContext(JenScript.ViewPart.North).clearGraphics();
			this.getGraphicsContext(JenScript.ViewPart.East).clearGraphics();
			this.getGraphicsContext(JenScript.ViewPart.West).clearGraphics();
			this.getGraphicsContext(JenScript.ViewPart.Device).clearGraphics();
		},
		
		
		/**
		 * repaint whole plugin by call repaint each part with clear context
		 */
		repaintPlugin : function(){
			if(!this.contextualized)
				return;
			
			this.repaintPluginPart(JenScript.ViewPart.South);
			this.repaintPluginPart(JenScript.ViewPart.North);
			this.repaintPluginPart(JenScript.ViewPart.East);
			this.repaintPluginPart(JenScript.ViewPart.West);
			this.repaintPluginPart(JenScript.ViewPart.Device);
			this.firePluginEvent('repaint');
		},
		
		
		/**
		 * repaint plugin for the given part
		 * @param {String} part
		 */
		repaintPluginPart : function(part){
			if(!this.contextualized)
				return;
			var graphics = this.getGraphicsContext(part);
			if(graphics !== undefined){
				graphics.clearGraphics();
				this.paintPlugin(graphics,part);
			}
		},
		
		
		/**
		 * bind listener for actions : lock,unlock, projectionRegister
		 * @param {String} actionEvent
		 * @param {Function} listener
		 * @param {name} the listener owner name
		 */
		addPluginListener  : function(actionEvent,listener,name){
			if(name === undefined)
				throw new Error('Plugin listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener, name:name};
			this.pluginlisteners[this.pluginlisteners.length] =l;
		},
		
		/**
		 * fire listener when plugin is being to lock, unlock, repaint
		 */
		firePluginEvent : function(actionEvent){
			for (var i = 0; i < this.pluginlisteners.length; i++) {
				var l = this.pluginlisteners[i];
				if(actionEvent === l.action){
					l.onEvent(this);
				}
			}
		},
		
		onProjectionRegister: function(){
		},
		
		/**
		 * assign projection to this plugin
		 */
		setProjection : function(projection) {
			this.projection = projection;
			var that = this;
			projection.addProjectionListener('pluginRegister',function(){
				that.firePluginEvent('projectionRegister');
			}," pluglin fire to listener plugin registered in projection")
		},

		setPriority : function(priority) {
			this.priority = priority;
		},

		getPriority : function() {
			return this.priority;
		},

		isSelectable : function() {
			return this.selectable;
		},

		setSelectable : function(selectable) {
			this.selectable = selectable;
		},

		isLockSelected : function() {
			return this.lockSelected;
		},

		select : function() {
			this.lockSelected = true;
			this.firePluginEvent('lock');
		},

		unselect : function() {
			this.lockSelected = false;
			this.firePluginEvent('unlock');
		},

		isLockPassive : function() {
			return this.lockPassive;
		},

		passive : function() {
			this.lockPassive = true;
			this.firePluginEvent('passive');
		},

		unpassive : function() {
			this.lockPassive = false;
			this.firePluginEvent('unpassive');
		},

		/**
		 * override this method to paint plugin
		 * @param {Object} g2d graphics context
		 * @param {String} part the part being paint
		 */
		paintPlugin : function(g2d, part) {
		},

		/**
		 * onClick call back
		 * @deprecated
		 */
		onClick : function(evt,part,x, y) {
		},
		
		/**
		 * move callback
		 * @param {Object} evt event
		 * @param {String} part the part being move
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		onMove : function(evt,part,x, y) {
		},

		/**
		 * press (down) callback
		 * @param {Object} evt event
		 * @param {String} part the part being press
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		onPress : function(evt,part,x, y) {
		},

		/**
		 * release (up) callback
		 * @param {Object} evt event
		 * @param {String} part the part being release
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		onRelease : function(evt,part,x, y) {
		},
		
		/**
		 * enter part callback
		 * @param {Object} evt event
		 * @param {String} part the part being enter
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		onEnter : function(evt,part,x, y) {
		},

		/**
		 * exit part callback
		 * @param {Object} evt event
		 * @param {String} part the part being exit
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		onExit : function(evt,part,x, y) {
		},
		
		/**
		 * wheel part callback
		 * @param {Object} evt event
		 * @param {String} part the part being wheel
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		onWheel : function(evt,part,x, y) {
		},
		
		/**
		 * return true if this plugin hosts widgets, false otherwise
		 */
		hasWidgets : function(){
			return (this.widgets.length >0);
		},
		
		/**
		 * return true if the given point (x,y) intercepts any widgets sensible shapes
		 * in all registered projection in the shared view.
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		isWidgetSensible : function(x,y){
			
			var projs = this.getProjection().getView().getProjections();
			for (var p = 0; p < projs.length; p++) {
				for (var k = 0; k < projs[p].getPlugins().length; k++) {
					var ws = projs[p].getPlugins()[k].getWidgets();
					for (var l = 0; l < ws.length; l++) {
						if(ws[l].isSensible(x,y)){
							return true;
						}
							
					}
				}
			}
			return false;
		},
		
	    /**
	     * register widget
	     * 
	     * @param widget
	     *            the widget to register
	     */
	    registerWidget : function(widget) {
            widget.setHost(this);
            widget.attachLifeCycle();
            widget.onRegister();
            this.widgets[this.widgets.length]=widget;
	    },
	    
	    getWidgets: function() {
	    	return this.widgets;
	    }
	});
})();
(function(){
	JenScript.WidgetPlugin = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.WidgetPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.WidgetPlugin,{
		_init: function(config){
			config = config||{};
			config.name='WidgetPlugin';
			JenScript.Plugin.call(this,config);
			this.press = false;
			this.contextualized = true;
		},
		
		/**
		 * get widget plugin string representation
		 */
		toString : function(){
			return 'WidgetPlugin';
		},
		
		/**
		 * override function
		 * get the plugin part graphics context
		 * @param {String} part
		 * @returns {Object} plugin graphics context
		 */
		getGraphicsContext : function(part){
			return new JenScript.Graphics({definitions : this.view.svgWidgetsDefinitions,graphics : this.view.svgWidgetsGraphics, selectors : this.view.svgSelectors});
		},
		
		/**
		 * override function
		 * repaint 
		 */
		repaintPlugin : function(caller){
		},
		
		/**
		 * override function
		 * repaint part 
		 */
		repaintPluginPart : function(part){
		},
		
	    /**
		 * paint plugin view part
		 *  @param {Object} graphics context
		 *  @param {Object} view part
		 */
	    paintPlugin : function(g2d,viewPart) {
	    },
		
		/**
		 * get view
		 * @returns {Object} view
		 */
		getView : function() {
	        return this.view;
	    },
	    
	    /**
		 * set view
		 * @param {Object} view
		 */
	    setView : function(view) {
	        this.view=view;
	    },
	    
	    /**
	     * check pressed event for widget move operation
	     * 
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    moveWidgetOperationCheckPress : function(event,part,x,y) {
	    	var contains = function(folder,x,y) {
		        if (x > folder.x && x < folder.x + folder.width && y > folder.y
		                && y < folder.y + folder.height) {
		            return true;
		        }
		        return false;
		    };
	    	//var proj = this.getActiveProjection();
	    	//console.log('moveWidgetOperationCheckPress for proj '+this.getActiveProjection().name);
		    var projs = this.getView().getProjections();
	    	for (var p = 0; p < projs.length; p++) {
	    		var proj = projs[p];
	    		
	    		
		    	for (var i = 0; i < proj.plugins.length; i++) {
		        	var plugin = proj.plugins[i];
//		            if (plugin.isSelectable() && !plugin.isLockSelected()) {
//		                continue;
//		            }
		            
		            for (var j = 0; j < plugin.widgets.length; j++) {
		            	var widget = plugin.widgets[j];
		            	
		            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
		            		
		            		//console.log('process moveWidgetOperationCheckPress widget : name : '+widget.name);
			                var widgetFolder = widget.getWidgetFolder();
			                if (widgetFolder === undefined) {
			                    continue;
			                }
			                
			                //console.log('process move flags : contains (x,y) :'+contains(widgetFolder,x, y)+", widget NoMoveOperation :"+widget.isNoMoveOperation());
			                if (contains(widgetFolder,x, y) && !widget.isNoMoveOperation()) {
			                    widgetFolder.currentDragX = x;
			                    widgetFolder.currentDragY = y;
			                    widgetFolder.startPress();
			                    widget.create();
								widget.createGhost();
								this.passivePlugins();
			                }
//			                else {
//			                    widgetFolder.interruptPress();
//			                    this.activePlugins();
//			                }
		            		
		            	}else{
		            		//console.log('incompatible mode process moveWidgetOperationCheckPress widget'+widget.name);
		            	}
		            }
				}	
	    	}
	    },

	    /**
	     * check drag event for widget move operation
	     * 
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    moveWidgetOperationCheckDrag : function(event,part,x,y) {
	        //var proj = this.getActiveProjection();
	    	
	    	var projs = this.getView().getProjections();
	    	for (var p = 0; p < projs.length; p++) {
	    		var proj = projs[p];
	    		
		        for (var i = 0; i < proj.plugins.length; i++) {
		        	var plugin = proj.plugins[i];
		            for (var j = 0; j < plugin.widgets.length; j++) {
		            	var widget = plugin.widgets[j];
		            	
		            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
		            		var widgetFolder = widget.getWidgetFolder();
			                if (widgetFolder !== undefined) {
			                    if (widgetFolder.lockPress) {
			                        widgetFolder.currentDragX = x;
			                        widgetFolder.currentDragY = y;
			                        widget.create();
									widget.createGhost();
			                    }
			                }
		            	}
		            }
		        }
	    	}
	    },

	    /**
	     * check release event for widget move operation
	     * 
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    moveWidgetOperationCheckRelease : function(evt,part,x,y) {
	    	//var proj = this.getActiveProjection();
	    	var projs = this.getView().getProjections();
	    	for (var p = 0; p < projs.length; p++) {
	    		var proj = projs[p];
	    		
	    		for (var i = 0; i < proj.plugins.length; i++) {
		        	var plugin = proj.plugins[i];
		        	for (var j = 0; j < plugin.widgets.length; j++) {
		            	var widget = plugin.widgets[j];
		            	
		            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
		            		
			                var widgetFolder = widget.getWidgetFolder();
			                if (widgetFolder === undefined) {
			                    continue;
			                }
			                if (widgetFolder.lockPress) {
			                    if (widgetFolder.targetFolder !== undefined) {
			                    	widget.postWidget();
			                        this.activePlugins();
			                        widget.create();
									widget.destroyGhost();
									 
			                    }
			                    widgetFolder.interruptPress();
			                }
		            	}
		            }
		        }
	    	}
	    },
	    
	    /**
	     * on move plugin handler
	     * 
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    onMove : function(event,part,x, y) {
	    	if(this.press){
	    		// handle widget drag for move operation
		        this.moveWidgetOperationCheckDrag(event,part,x, y);
		        // dispatch drag on widget for functional operation
		        this.dispatchDrag(event,part,x,y);
	    	}else{
	    		this.dispatchMove(event,part,x, y);
	    	}
	    },

	    /**
	     * on move dispatch
	     * @param {Object} event  the mouse move event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    dispatchMove : function(event,part,x,y) {
	    	if(part !== JenScript.ViewPart.Device) return;
	    	
	    	//var proj = this.getActiveProjection();
	    	var projs = this.getView().getProjections();
	    	for (var p = 0; p < projs.length; p++) {
	    		var proj = projs[p];
	    		
		        for (var i = 0; i < proj.plugins.length; i++) {
		        	var plugin = proj.plugins[i];
		        	for (var j = 0; j < plugin.widgets.length; j++) {
		            	var widget = plugin.widgets[j];
		            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
		            		widget.interceptMove(x, y);
		            	}
		        	}
		        }
	    	}
	    },

	    /**
	     * on wheel plugin handler
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    onWheel : function(event,part,x, y) {
	        this.dispatchWheel(event,part,x, y);
	    },

	    /**
	     * on wheel dispatch
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    dispatchWheel : function(event,part,x, y) {
	    	var proj = this.getActiveProjection();
	        for (var i = 0; i < proj.plugins.length; i++) {
	        	var plugin = proj.plugins[i];
	        	
	        	
	            if (plugin.isSelectable() && plugin.isLockSelected()) {
	            	 for (var j = 0; j < plugin.widgets.length; j++) {
			            //var widget = plugin.widgets[j];
	                    //widget.interceptWheel(mwe.getWheelRotation());
	                }
	            }
	            else {
	            	 for (var j = 0; j < plugin.widgets.length; j++) {
			            //var widget = plugin.widgets[j];
	                    //widget.interceptWheel(mwe.getWheelRotation());
	                }
	            }
	        }
	    },

	    /**
	     * on drag dispatch
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    dispatchDrag : function(event,part,x,y) {
	    	var proj = this.getActiveProjection();
	        for (var i = 0; i < proj.plugins.length; i++) {
	        	var plugin = proj.plugins[i];
	        	
	        	for (var j = 0; j < plugin.widgets.length; j++) {
	            	var widget = plugin.widgets[j];
	            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
	            		widget.interceptDrag(x, y);
	            	}
	        	}
	        	
//	            if (plugin.isSelectable() && plugin.isLockSelected()) {
//	            	 for (var j = 0; j < plugin.widgets.length; j++) {
//			            	var widget = plugin.widgets[j];
//		                    widget.interceptDrag(x,y);
//	                }
//	            }
//	            else {
//	            	 //duplicate, keep if change in future for non selectable widget
//	            	 for (var j = 0; j < plugin.widgets.length; j++) {
//			            	var widget = plugin.widgets[j];
//			            	widget.interceptDrag(x,y);
//	                }
//	            }
	        }
	    },

	    /**
	     * on press plugin handler
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	   onPress : function(event,part,x, y) {
		    this.press = true;
	        // handle widget press for move operation
	        this.moveWidgetOperationCheckPress(event,part,x,y);

	        // dispatch press on widget for functional operation
	        this.dispatchPress(event,part,x,y);
	    },
	    

	    /**
	     * on press dispatch
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    dispatchPress : function(event,part,x,y) {
	    	
	    	var projs = this.getView().getProjections();
	    	for (var p = 0; p < projs.length; p++) {
	    		var proj = projs[p];
		        for (var i = 0; i < proj.plugins.length; i++) {
		        	var plugin = proj.plugins[i];
		        	for (var j = 0; j < plugin.widgets.length; j++) {
		            	var widget = plugin.widgets[j];
		            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
		            		//console.log('widget plugin intercept press for widget : '+widget.name+' part '+part);
		            		widget.interceptPress(x, y);
		            	}
		        	}
		        }
	    	}
	    },

	    
	    /**
	     * on release plugin handler
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    onRelease :function(event,part,x, y) {
	    	 this.press = false;
	        // handle widget released for move operation
	        this.moveWidgetOperationCheckRelease(event,part,x,y);

	        // dispatch released on widget for functional operation
	        this.dispatchRelease(event,part,x,y);
	    },

	    /**
	     * on release dispatch
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    dispatchRelease : function(evt,part,x,y) {
	    	
	    	var projs = this.getView().getProjections();
	    	for (var p = 0; p < projs.length; p++) {
	    		var proj = projs[p];
		        for (var i = 0; i < proj.plugins.length; i++) {
		        	var plugin = proj.plugins[i];
		        	
		        	for (var j = 0; j < plugin.widgets.length; j++) {
		            	var widget = plugin.widgets[j];
		            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
		            		//console.log("intercept release "+widget.name);
		            		widget.interceptReleased(x,y);
		            	}else{
		            		//console.log("no condition to intercept release "+widget.name);
		            	}
		        	}
		        }
	    	}

	    },
	    

	    /**
	     * passive plugins
	     */
	    passivePlugins : function() {
	    	var proj = this.getActiveProjection();
	        for (var i = 0; i < proj.plugins.length; i++) {
	        	var plugin = proj.plugins[i];
	        	plugin.passive();
	        }
	    },

	    /**
	     * active plugins
	     */
	    activePlugins : function() {
	    	var proj = this.getActiveProjection();
	        for (var i = 0; i < proj.plugins.length; i++) {
	        	var plugin = proj.plugins[i];
	        	plugin.unpassive();
	        }
	    },
	    
	    /**
	     * get Active projection
	     * @return {Object} active projection
	     */
	    getActiveProjection : function(){
	    	return this.getView().getActiveProjection();
	    },
	});
})();
(function(){
		
	/**
	 * Widget
	 */
	JenScript.Widget = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.Widget,{
		
		/**
		 * init this widget
		 * @param {Object} config
		 * @param {String} [config.name]   widget name
		 * @param {Number} [config.width]  widget width
		 * @param {Number} [config.height] widget height
		 * @param {Number} [config.xIndex] widget x index
		 * @param {Number} [config.yIndex] widget y index
		 */
		init: function(config){
			config = config||{};
			 /** widget name */
		    this.name = (config.name !== undefined)?config.name:'widget undefined name';
		    /** the widget Id */
		    this.Id = (config.Id !== undefined)?config.Id:'widget'+JenScript.sequenceId++;
		    /** the host plugin of this widget */
		    this.host;
		    /** the widget folder */
		    this.widgetFolder;
		    /** widget width */
		    this.width = (config.width !== undefined)?config.width : 0;
		    /** widget height */
		    this.height = (config.height !== undefined)?config.height : 0;
		    /** x index */
		    this.xIndex = (config.xIndex !== undefined)?config.xIndex : 0;
		    /** y index */
		    this.yIndex = (config.yIndex !== undefined)?config.yIndex : 0;
		    /** sensible shape on this widget */
		    this.sensibleShapes = [];
		    /** lock move operation */
		    this.noMoveOperation = false;
		    /** movable widget flag */
		    this.isMovable = true;
		    
		    this.orphanLock = false;
		    
		    this.painted = false;
		    
		    //widget intercept event by another channel from host plugin (ie, widget plugin from view)
		    //mode defines the painting and event conditions according to projection status and plugin selection status
		    //for paint : projection parameter : active|passive|always , plugin parameter  selected|unselected|always
		    //for event parameter : projection parameter : active|passive|always , plugin parameter  selected|unselected|always
		    /** defines the widget mode */
		    this.mode = (config.mode !== undefined)?config.mode : {paint : {proj : 'active', plugin : 'selected'},event: {proj : 'active', plugin : 'selected'}};
		    
		},
		
		
	    /**
	     * get widget Id
	     * @return {String} widget Id
	     */
	    getId : function() {
	        return this.Id;
	    },
	    
	    /**
	     * get widget width
	     * @return {Number} widget width
	     */
	    getWidth : function() {
	        return this.width;
	    },
	    
	    /**
	     * get widget height
	     * @return {Number} widget height
	     */
	    getHeight : function() {
	        return this.height;
	    },
	    
	    /**
	     * get widget x index
	     * @return {Number} widget x index
	     */
	    getxIndex : function() {
	        return this.xIndex;
	    },
	    
	    /**
	     * get widget y index
	     * @return {Number} widget y index
	     */
	    getyIndex : function() {
	        return this.yIndex;
	    },

	    /**
	     * set move operation flag
	     * @param {Boolean} noMoveOperation
	     */
	    setNoMoveOperation : function(noMoveOperation) {
	        this.noMoveOperation = noMoveOperation;
	    },
	    
	    /**
	     * get move operation flag
	     * @returns {Boolean} noMoveOperation
	     */
	    isNoMoveOperation : function() {
	        return this.noMoveOperation;
	    },

		/**
	     * return true if the point defines by x and y coordinates is contains in
	     * one of the sensible shape, false otherwise
	     * @param x {Number} the x point coordinate
	     * @param y {Number} the y point coordinate
	     * @return {Boolean} true if specified coordinate is a sensible point, false otherwise
	     */
	    isSensible : function(x,y) {
	    	for (var i = 0; i < this.sensibleShapes.length; i++) {
	    		 if (this.sensibleShapes[i].contains(x, y)) {
		                return true;
		         }
			}
	    	return false;
	    },
	    
	    /**
	     * get widget sensible shapes
	     * @return {Array} the widget sensible shapes
	     */
	    getSensibleShapes : function() {
	        return this.sensibleShapes;
	    },

	    /**
	     * clear widget sensible shape
	     */
	    clearSensibleShape : function() {
	        this.sensibleShapes= [];
	    },

	    /**
	     * set widget sensible shapes
	     * @param {Array} widget sensibleShapes 
	     */
	    setSensibleShapes : function(sensibleShapes) {
	        this.sensibleShapes = sensibleShapes;
	    },

	    /**
	     * add widget sensible shape
	     * @param {Object} sensibleShape to add
	     */
	    addSensibleShape : function(sensibleShape) {
	        this.sensibleShapes[this.sensibleShapes.length] = sensibleShape;
	    },
	    
	    /**
	     * override this method in subclass widget to intercept move very important
	     * to call this method in subclass method override to manage move operation
	     * or call in method override
	     * @param {Number} x location
	     * @param {Number} y location   
	     */
	    interceptMove : function(x,y) {
	        this.checkMoveOperation(x,y);
	    },

	    /**
	     * override this method in subclass widget to intercept press
	     * @param {Number} x location
	     * @param {Number} y location   
	     */
	    interceptPress : function(x,y) {
	    },

	    /**
	     * override this method in subclass widget to intercept drag
	     * @param {Number} x location
	     * @param {Number} y location   
	     */
	    interceptDrag : function(x,y) {
	    },

	    /**
	     * override this method in subclass widget to intercept released.
	     * important to call this method in subclass method override to manage move
	     * operation or call setNoMoveOperation(boolean) in method override
	     * with false parameter, move operation are now available after released.
	     * @param {Number} x location
	     * @param {Number} y location   
	     */
	    interceptReleased : function(x,y) {
	        this.setNoMoveOperation(false);
	    },

	    /**
	     * override this method in subclass widget to intercept wheel rotation
	     * @param {Number}  rotation
	     */
	    interceptWheel : function(rotation) {
	    },
	    
	    
	    /**
	     * return plugin that host this widget
	     * @returns {Object} widget host
	     */
	    getHost: function() {
	        return this.host;
	    },

	    /**
	     * set plugin that host this widget
	     * @param {Object} host
	     */
	    setHost : function(host) {
	        this.host = host;
	    },

	    
	    /**
	     * get the widget folder
	     * @returns {Object} widget folder
	     */
	    getWidgetFolder : function() {
	        return this.widgetFolder;
	    },

	    /**
	     * set the widget folder
	     * @param {Object} widgetFolder
	     */
	    setWidgetFolder : function(widgetFolder) {
	    	//console.log("set widget folder : "+this.name+" folder : "+widgetFolder);
	        this.widgetFolder = widgetFolder;
	    },

	    /**
	     * get theme color
	     * @return {String} widget theme color
	     */
	    getThemeColor : function() {
	        return this.host.getThemeColor();
	    },
	    
	    /**
	     * set index on post widget
	     */
	    postWidget : function() {
	        this.xIndex = this.widgetFolder.targetFolder.xIndex;
	        this.yIndex = this.widgetFolder.targetFolder.yIndex;
	    },
	    
	    /**
	     * create widget
	     */
	    create : function(){
	    	if(this.painted) return;
	    	var view = this.getHost().getView();
			var g2d =  new JenScript.Graphics({definitions : view.svgWidgetsDefinitions,graphics : view.svgWidgetsGraphics});
			g2d.deleteGraphicsElement(this.Id);
			this.paint(g2d);
			this.painted = true;
	    },
	    
	    /**
	     * destroy widget
	     */
	    destroy : function(){
	    	var view = this.getHost().getView();
	    	var g2d =  new JenScript.Graphics({definitions : view.svgWidgetsDefinitions,graphics : view.svgWidgetsGraphics});
	    	g2d.deleteGraphicsElement(this.Id);
	    	this.painted = false;
	    },
	    
	    /**
	     * create ghost
	     */
	   createGhost : function() {
		   this.destroy();
		   var view = this.getHost().getView();
		   var g2d =  new JenScript.Graphics({definitions : view.svgWidgetsDefinitions,graphics : view.svgWidgetsGraphics});
		   g2d.deleteGraphicsElement(this.Id+'_ghost');
		   if (this.getWidgetFolder() != undefined && this.getWidgetFolder().lockPress) {
        	   this.createPotential(g2d);
           }
	    },
	    
	    /**
	     * destroy ghost
	     */
	    destroyGhost : function() {
	    	var view = this.getHost().getView();
	    	var g2d =  new JenScript.Graphics({definitions : view.svgWidgetsDefinitions,graphics : view.svgWidgetsGraphics});
	    	g2d.deleteGraphicsElement(this.Id+'_ghost');
	    },

	    /**
	     * create potential widget folder
	     * @param {Object} graphics context
	     * @param {Object} widget
	     * @param {Object} widget host plugin
	     */
	    createPotential : function(g2d) {
	    	g2d.deleteGraphicsElement(this.Id+'_ghost');
	    	var potentialElement = new JenScript.SVGGroup().Id(this.Id+'_ghost');
	    	
	    	var widget = this;
	        var widgetFolder = widget.getWidgetFolder();
	       // console.log('create potential for '+this.Id+ " with folder "+widgetFolder);
	        //console.log('createPotential : '+widget.Id+' with folder : '+widget.getWidgetFolder());
	        var p = new JenScript.SVGRect().origin(widgetFolder.currentDragX-widgetFolder.width/2,widgetFolder.currentDragY-widgetFolder.height/2)
			        .size(widgetFolder.width,widgetFolder.height);     
				             
	        p.stroke('green').fillNone();
            
	        potentialElement.child(p.toSVG());
	       
	        //console.log('curent drag '+widgetFolder.getCurrentDragX()+','+widgetFolder.getCurrentDragY());
	       // console.log('test folder id : '+widgetFolder.Id);
	        var widgetPotentialFolder = this.getHost().getView()
	                							.newFolderIntanceByPosition(widgetFolder.Id,
	                                            widgetFolder.width, widgetFolder.height,
	                                            widgetFolder.currentDragX,
	                                            widgetFolder.currentDragY);

	        if (widgetPotentialFolder !== undefined) {
	        	//console.log('new potential : '+widgetPotentialFolder);
	        	var potential = new JenScript.SVGRect().origin(widgetPotentialFolder.x,widgetPotentialFolder.y)
														.size(widgetPotentialFolder.width,widgetPotentialFolder.height);
	           
	        	
	        	
	        	if (this.isEmptyFolder(widgetPotentialFolder)) {
	                widgetFolder.potentialFolder = widgetPotentialFolder;
	                widgetFolder.targetFolder = widgetPotentialFolder;
	                potential.fill('rgba(0, 255, 0, 0.6)').strokeNone();
	             
	            }
	            else {
	            	potential.fill('rgba(255,0,0,0.6)').strokeNone();
	            }
	            
	            potentialElement.child(potential.toSVG());
	            g2d.insertSVG(potentialElement.toSVG());
	        }

	    },
	    
	    /**
	     * true if the potential folder is empty, false otherwise.
	     * @param {Object} widget
	     * @param {Object} potentialFolder
	     * @return {Boolean} true if the potential folder is empty, false otherwise.
	     */
	    isEmptyFolder : function(potentialFolder) {
	    	//console.log('control potential  : '+potentialFolder.Id+" with folder :"+potentialFolder.getBounds2D());
	    	//console.log('isEmptyFolder process widget '+this.Id+' for proj : '+this.getHost().getProjection().name);
	    	//console.log('potential folder : '+potentialFolder);
	    	var boundPotential = potentialFolder.getBounds2D();
	        var hostPlugin = this.getHost();
	        for (var j = 0; j < hostPlugin.widgets.length; j++) {
            	var hostedPluginWidget = hostPlugin.widgets[j];
	            if (hostedPluginWidget.Id !== this.Id) {
	                var widgetFolder = hostedPluginWidget.getWidgetFolder();
	                //TODO, for hide widget that never been created a folder, ask for the invisible folder
	                //console.log("check folder of "+hostedPluginWidget.Id+' of proj '+hostedPluginWidget.host.getProjection().name+' with folder : '+widgetFolder);
	                if (boundPotential.intersects(widgetFolder.getBounds2D())) {
	                    return false;
	                }
	            }
	        }
	        var proj = this.getHost().getProjection();
	        for (var i = 0; i < proj.plugins.length; i++) {
	        	var plugin = proj.plugins[i];
	        	if(!plugin.hasWidgets()) //control other that have widgets
	        		continue;
	        	
	            if (hostPlugin.Id === plugin.Id) { //host plugin has already been controled
	                continue;
	            }
	            
	           
	            for (var j = 0; j < plugin.widgets.length; j++) {
	            	var pluginWidget = plugin.widgets[j];

	            	var widgetFolder = pluginWidget.getWidgetFolder();
	               // console.log('control potential with plugin widget : '+pluginWidget.name+" with folder :"+widgetFolder.getBounds2D());
//	                if (widgetFolder.getId() === potentialFolder.getId()) {
//	                    continue;
//	                }
	                if (boundPotential.intersects(widgetFolder.getBounds2D())) {
	                	console.log('collide with '+pluginWidget.name);
	                    return false;
	                }
	            }
	        }
	        return true;
	    },

	    /**
	     * sub class this for painting widget
	     * 
	     * @param {Object} graphics context
	     */
	    paintWidget : function(g2d){},

	    
	    assignFolder : function(){
	    	var view = this.getHost().getProjection().getView();
	    	this.setWidgetFolder(view.newWidgetFolderIntance(this.getId(), this.getWidth(), this.getHeight(), this.getxIndex(), this.getyIndex()));
	    },
	    
	    /**
	     * lay out widget folder
	     * @param {Object} view
	     */
	    layoutFolder : function () {
	    	//console.log('layoutFolder for widget : '+this.Id);
	    	var view = this.getHost().getProjection().getView();
	        if (this.getWidgetFolder() === undefined) {
	        	//console.log('layout set folder 1: '+this.getId());
	            //this.setWidgetFolder(view.newWidgetFolderIntance(this.getId(), this.getWidth(), this.getHeight(), this.getxIndex(), this.getyIndex()));
	        	this.assignFolder();
	        }
	        else {
	        	//console.log('layout set folder 2: '+this.getId());
	            var vdf = view.newWidgetFolderIntance(this.getId(), this.getWidth(),this.getHeight(), this.getxIndex(), this.getyIndex());
	            this.getWidgetFolder().updateFrame(vdf.x, vdf.y,vdf.width, vdf.height);
	        }
	    },

	    /**
	     * final paint widget according to mode.paint(proj,plugin)
	     * @param {Object} view
	     * @param {Object} graphics context
	     */
	    paint : function(g2d) {
	    	if(this.isProjModeCondition('paint') && this.isPluginModeCondition('paint')){
	    		//console.log("paint widget "+this.name);
	    		this.layoutFolder();
		        this.paintWidget(g2d);
	    	}
	    },
	    
	    isProjModeCondition : function(oper){
	    	return (this.mode[oper].proj == 'always' || (this.mode[oper].proj == 'active' && this.getHost().getProjection().isActive()) || (this.mode[oper].proj == 'passive' && !this.getHost().getProjection().isActive()));
	    },
	    
	    isPluginModeCondition : function(oper){
    		return (this.mode[oper].plugin == 'always' || (this.mode[oper].plugin == 'selected' && this.getHost().isLockSelected()) || (this.mode[oper].plugin == 'unselected' && !this.getHost().isLockSelected()));
    	},
    	
	    /**
	     * prevent move operation if sensible shape are intercept
	     * @param {number} the x coordinate
	     * @param {number} the y coordinate           
	     */
	    checkMoveOperation : function(x,y) {
//	        if (!this.getHost().isLockSelected() && this.isOrphanLock()){
//	            return;
//	        }
	    	
	    	//if(this.isProjModeCondition('paint') && this.isPluginModeCondition('paint')){
	    		if (!this.isMovable) {
		            this.setNoMoveOperation(true);
		            return;
		        }
		        if (this.isSensible(x,y)) {
		            this.setNoMoveOperation(true);
		        }
		        else {
		            this.setNoMoveOperation(false);
		        }
	    	//}
	        
	    },

	    /**
	     * true if widget is ovable, false otherwise
	     * @returns {Boolean} widget movable flag
	     */
	    isMovable : function() {
	        return this.isMovable;
	    },

	    /**
	     * set widget movable flag
	     * @param {Boolean} isMovable
	     */
	    setMovable : function(isMovable) {
	        this.isMovable = isMovable;
	    },

	    /**
	     * true if widget is orphan lock, false otherwise
	     * @return {Boolean} the orphanLock
	     */
	    isOrphanLock : function() {
	        return this.orphanLock;
	    },

	    /**
	     * set widget orphan lock flag
	     * @param {Boolean} orphanLock
	     */
	    setOrphanLock : function(orphanLock) {
	        this.orphanLock = orphanLock;
	    },
	    
	    /**
	     * callback method call on widget plugin host registering.
	     */
	    onRegister : function(){
	    },
	    
	    checkWidgetState : function(){
	    	if(this.getHost() !== undefined && this.getHost().getProjection() !== undefined && this.getHost().getProjection() !== undefined){
	    		if(this.isProjModeCondition('paint') && this.isPluginModeCondition('paint')){
	    			this.create();
	    		}else{
	    			this.destroy();
	    		}
	    	}else{
	    		//console.log("widget ready state KO");
	    	}
	    },
	    
	    attachLifeCycle : function(){
	    	//console.log("attachLifeCycle for widget "+this.name);
	    	var that = this;
	    	var reason = 'widget attach attachLifeCycle '+this.name;
	    	
	    	this.getHost().addPluginListener('lock',function (plugin){
	    		//console.log("widget "+that.name+" plugin lock");
	    		that.checkWidgetState();
			},'Plugin lock listener, create for reason : '+reason);
			
			this.getHost().addPluginListener('unlock',function (plugin){
				//console.log("widget "+that.name+" plugin unlock");
				that.checkWidgetState();
			},'Plugin unlock listener, destroy for reason : '+reason);
			
			var activepassiveCheck = function (v){
				that.assignFolder();
				v.addViewListener('projectionActive',function(){
					that.checkWidgetState();
				},'Projection active listener, create for reason :'+reason);
					
				v.addViewListener('projectionPassive',function(){
					that.checkWidgetState();
				},'Projection passive listener, create for reason :'+reason);
			};
			
			var check = function(p){
				if(p.getProjection().getView() !== undefined){
					activepassiveCheck(p.getProjection().getView());
				}else{
					p.getProjection().addProjectionListener('viewRegister',function(proj){
						activepassiveCheck(proj.getView());
					},'Wait for projection view registering for reason : '+reason);
				}
			};
			if(this.getHost().getProjection() !== undefined){
				check(this.getHost());
			}else{
				this.getHost().addPluginListener('projectionRegister',function (plugin){
					check(plugin);
				},'Plugin listener for projection register for reason : '+reason);
			}
			
		},
	    
	    
	    /**
	     * helper method to attach listener on host plugin for:
	     * -plugin lock : create widget
	     * -plugin unlock : destroy widget
	     * -plugin projection register : chain attach view listener in view is defined
	     * else attach projection listener for view registering that will attach
	     * 
	     * view listener
	     * - projection active  : create  widget if host is lock selected
	     * - projection passive : destroy widget if host is lock selected 
	     * 
	     */
	    attachPluginLockUnlockFactory : function(reason){
	    	var that = this;
	    	if(this.mode.paint.plugin === 'always'){
	    		that.create();
	    	}
	    	if(this.mode.paint.plugin === 'selected'){
	    		this.getHost().addPluginListener('lock',function (plugin){
					that.create();
				},'Plugin lock listener, create for reason : '+reason);
				
				this.getHost().addPluginListener('unlock',function (plugin){
					that.destroy();
				},'Plugin unlock listener, destroy for reason : '+reason);
	    	}
	    	
	    	if(this.mode.paint.proj === 'active'){
	    		
	    	}
//			this.getHost().addPluginListener('projectionRegister',function (plugin){
//				if(plugin.getProjection().getView() !== undefined){
//						that.attachViewActivePassiveFactory();
//				}else{
//					//wait view registering
//					plugin.getProjection().addProjectionListener('viewRegister',function(proj){
//						that.attachViewActivePassiveFactory();
//					},'Wait for projection view registering for reason : '+reason);
//				}
//			},'Plugin listener for projection register for reason : '+reason);
	    },
	    
	    attachViewActivePassiveFactory : function(reason){
	    	var that = this;
	    	var view = this.getHost().getProjection().getView();
			if(view !== undefined){
				view.addViewListener('projectionActive',function(){
					if(that.getHost().isLockSelected()){
						that.create();
					}
				},'Projection active listener, create for reason :'+reason);
				
				view.addViewListener('projectionPassive',function(){
					if(that.getHost().isLockSelected()){
						that.destroy();
					}
				
				},'Projection passive listener, destroy for reason : '+reason);
			}
			
	    },
	    
	    attachLayoutFolderFactory : function(reason){
	    	//console.log("attachLayoutFolderFactory for reason : "+reason);
	    	var that = this;
	    	var proj = this.getHost().getProjection();
	    	if(proj !== undefined){
	    		var view = proj.getView();
	    		if(view !== undefined){
	    			//console.log("view is already register, assignFolder OK");
					that.assignFolder();
				}else{
					//console.log("view is NOT register, wait for assignFolder");
					proj.addProjectionListener('viewRegister',function(proj){
		    			that.assignFolder();
					},'Attach Widget Layout / Wait for projection view registering for reason : '+reason);
				}
	    	}
	    },

	});

})();
(function(){
	/**
	 * Widget folder contains the place holder properties of widget
	 */
	JenScript.WidgetFolder = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.WidgetFolder,{
		init: function(config){
			config = config||{};
		},
		
		/**
		 * get a string representation of this widget folder
		 * @return {String} folder string representation
		 */
		toString : function() {
	        return "WidgetFolder [Id="+this.Id+", xIndex=" + this.xIndex + ", yIndex=" + this.yIndex + ", x="
	                + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + "]";
	    },
	    
	    /**
	     * return this folder bound
	     * @return {Object} folder bound
	     */
	    getBounds2D : function(){
	    	return new JenScript.Bound2D(this.x,this.y,this.width,this.height);
	    },
	    
	    /**
	     * return the folder Id which is equal to widget Id
	     */
	    getId : function(){
	    	return this.Id;
	    },
		
  
	    /**
	     * start press this folder
	     */
	    startPress : function() {
	    	this.lockPress=true;
	    },
	    
	    /**
	     * interrupt press
	     */
	    interruptPress : function() {
	        this.lockPress = false;
	    },
	    
	    /**
	     * update widget folder frame
	     * 
	     * @param {Number} x
	     *            the new folder x coordinate
	     * @param {Number} y
	     *            the new folder y coordinate
	     * @param {Number} width
	     *            the new folder width
	     * @param {Number} height
	     *            the new folder height
	     */
	    updateFrame : function(x,y,width,height) {
	        this.x =x;
	        this.y= y;
	        this.width = width;
	        this.height = height;
	    },
	    
	});
})();
(function(){

	/**
	 * Abstract widget geometry contains sensible shapes and have to solve it's geometry
	 */
	JenScript.AbstractWidgetGeometry  = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractWidgetGeometry,{
		
		/**
		 * init this widget geometry
		 * @param {Object} config
		 */
		init : function(config){
			/** sensible shape on this geometry */
		    this.sensibleShapes = [];
		},
		
		/**
	     * solve geometry for the specified widget bound
	     * @param {Object} widgetBound2D
	     */
	    solveGeometry : function(widgetBound2D){},

	    /**
	     * return true if the point defines by x and y coordinates is contains in
	     * one of the sensible shape
	     * 
	     * @param x {Number} the x point coordinate
	     * @param y {Number} the x point coordinate
	     * @return true if intercept, false otherwise
	     */
	    interceptSensibleShape : function(x,y) {
	    	for (var i = 0; i < this.sensibleShapes.length; i++) {
	    		 if (sensibleShapes[i].contains(x, y)) {
		                return true;
		            }
			}
	        return false;
	    },

	    /**
	     * @return the sensibleShapes
	     */
	    getSensibleShapes : function() {
	        return this.sensibleShapes;
	    },

	    /**
	     * clear sensible shape
	     */
	    clearSensibleShape : function() {
	        this.sensibleShapes = [];
	    },

	    /**
	     * @param sensibleShapes
	     *            the sensibleShapes to set
	     */
	    setSensibleShapes : function(sensibleShapes) {
	        this.sensibleShapes = sensibleShapes;
	    },

	    /**
	     * add sensible shape
	     * 
	     * @param sensibleShape
	     *            the sensible shape to add
	     */
	    addSensibleShape : function(sensibleShape) {
	        this.sensibleShapes[this.sensibleShapes.length] = sensibleShape;
	    },
	});
	
})();
(function(){

	
	
	//
	// 	Bar Widget defines mini bar with two buttons
	//
	//		-vertical/horizontal plus minus (-  +) 
	//		-vertical/horizontal backward forward (<  >)
	//
	
	
	/**
	 * Abstract Bar Geometry
	 */
	JenScript.AbstractBarGeometry  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractBarGeometry, JenScript.AbstractWidgetGeometry);
	JenScript.Model.addMethods(JenScript.AbstractBarGeometry,{
		_init : function(config){
			/** widget bounding frame */
		    this.bound2D;
		    /** bar outline shape */
		    this.outlineShape;
		    /** button 1 bounding rectangle */
		    this.rect1;
		    /** button 2 bounding rectangle */
		    this.rect2;
		    /** button 1 path */
		    this.button1;
		    /** button 2 path */
		    this.button2;
		    /** button 1 roll over flag */
		    this.rollover1 = false;
		    /** button 2 roll over flag */
		    this.rollover2 = false;
		    /** true make a solving geometry request */
		    this.solveRequest = true;
		    /** margin */
		    this.margin = 4;
		    /** round radius */
		    this.radius;
		    /** inset */
		    this.inset = 3;
		    /** widget orientation */
		    this.barOrientation = config.barOrientation;
		    JenScript.AbstractWidgetGeometry.call(this,config);
		},
		
		/**
	     * solve bar geometry outline
	     */
	    solveBarGeometry : function() {
	    	var bound2D = this.bound2D;
	    	var margin = this.margin;
	    	var inset = this.inset;
	    	var radius = this.radius;
	    	
	        if (this.barOrientation == 'Horizontal') {
	        	this.outlineShape = new JenScript.SVGRect().origin(bound2D.getX(),bound2D.getY())
					.size(bound2D.getWidth(), bound2D.getHeight())
					.radius(radius/3, radius/2);
	            this.rect1 = new JenScript.Bound2D(bound2D.getX() + margin + inset, bound2D.getY() + inset, radius - 2 * inset, radius - 2 * inset);
	            this.rect2 = new JenScript.Bound2D(bound2D.getX() + inset + bound2D.getWidth() - margin - radius, bound2D.getY() + inset ,radius - 2 * inset, radius - 2 * inset);
	        }
	        else if (this.barOrientation == 'Vertical') {
	        	this.outlineShape = new JenScript.SVGRect().origin(bound2D.getX(),bound2D.getY())
					.size(bound2D.getWidth(), bound2D.getHeight())
					.radius(radius/2, radius/3);
	            this.rect1 = new JenScript.Bound2D(bound2D.getX() + inset,  bound2D.getY() + margin + inset,radius - 2 * inset, radius   - 2 * inset);
	            this.rect2 = new JenScript.Bound2D(bound2D.getX() + inset, bound2D.getY() + bound2D.getHeight() - radius - margin+ inset,radius - 2 * inset, radius - 2 * inset);
	        }
	        this.clearSensibleShape();
	        this.addSensibleShape(this.rect1);
	        this.addSensibleShape(this.rect2);
	    },

	    /**
	     * override this method to create button 1 shape inside specified bounding
	     * rectangle parameter consider two orientation cases, horizontal and
	     * vertical
	     * 
	     * @param {Object} button1 Bound2D
	     */
	    solveButton1Geometry : function(button1Bound){},

	    /**
	     * override this method to create button 2 shape inside specified bounding
	     * rectangle parameter
	     * 
	     * @param {Object} button2 Bound2D
	     */
	    solveButton2Geometry : function(button2Bound){},

	    /**
	     * solve geometry if solveRequest is true, not solve geometry
	     * otherwise
	     * solve consist of following set operations solveBarGeometry() solveButton1Geometry(rec)
	     * that have to be override in
	     * subclass of this abstract definition solveButton2Geometry(rec) that have to be override in
	     * subclass of this abstract definition
	     * 
	     * @param {Object} the bar bound
	     */
    	 solveGeometry : function(bound2D) {
	        if (this.solveRequest) {
	        	
	            this.bound2D = bound2D;
	            if (this.barOrientation === 'Horizontal') {
	                this.radius = bound2D.height ;
	            }
	            else if (this.barOrientation === 'Vertical') {
	                this.radius = bound2D.width;
	            }

	            if (this.barOrientation == undefined) {
	                return;
	            }
	            
	            this.solveBarGeometry();
	            this.solveButton1Geometry(this.rect1);
	            this.solveButton2Geometry(this.rect2);
	            this.solveRequest = false;
	        }
	    },
	});
	
	/**
	 * Defines geometry bar with two buttons 'plus +' and 'minus -' geometry
	 */
	JenScript.PlusMinusBarGeometry  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PlusMinusBarGeometry, JenScript.AbstractBarGeometry);
	JenScript.Model.addMethods(JenScript.PlusMinusBarGeometry,{
		
		/**
		 * create a bar with two buttons 'plus +' and 'minus -' geometry
		 */
		__init : function(config){
			JenScript.AbstractBarGeometry.call(this,config);
		 },
		 
		 /**
		  * solve minus button
		  * @param {Object} minus button bound 
		  */
		 solveButton1Geometry : function(rect1) {
		        if (this.barOrientation === 'Horizontal') {
		        	this.button1 = new JenScript.SVGPath().moveTo(rect1.getX(), rect1.getY() + rect1.getHeight() / 2)
		            										.lineTo(rect1.getX() + rect1.getWidth(), rect1.getY()+ rect1.getHeight() / 2);
		            										
		        }
		        else {
		        	this.button1 = new JenScript.SVGPath().moveTo(rect1.getX() + rect1.getWidth() / 2, rect1.getY())
		            									   .lineTo(rect1.getX() + rect1.getWidth() / 2, rect1.getY()+ rect1.getHeight())
		            									   .moveTo(rect1.getX(), rect1.getY() + rect1.getHeight() / 2)
		            									   .lineTo(rect1.getX() + rect1.getWidth(), rect1.getY()+ rect1.getHeight() / 2);
		                    
		        }
		    },
		   
		    /**
			  * solve plus button
			  * @param {Object} plus button bound 
			  */
		    solveButton2Geometry :function(rect2) {
		        if (this.barOrientation === 'Horizontal') {
		        	this.button2 = new JenScript.SVGPath().moveTo(rect2.getX() + rect2.getWidth() / 2, rect2.getY())
												            .lineTo(rect2.getX() + rect2.getWidth() / 2, rect2.getY() + rect2.getHeight())
												            .moveTo(rect2.getX(), rect2.getY() + rect2.getHeight() / 2)
												            .lineTo(rect2.getX() + rect2.getWidth(), rect2.getY() + rect2.getHeight() / 2);
		                   
		        }
		        else {
		        	this.button2 = new JenScript.SVGPath().moveTo(rect2.getX(), rect2.getY() + rect2.getHeight() / 2)
		            										.lineTo(rect2.getX() + rect2.getWidth(), rect2.getY()+ rect2.getHeight() / 2);
		                    
		        }
		    }
	});
	
	
	/**
	 * Defines geometry bar with two buttons 'forward |>' and 'backward <|' geometry
	 */
	JenScript.BackwardForwardBarGeometry  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.BackwardForwardBarGeometry, JenScript.AbstractBarGeometry);
	JenScript.Model.addMethods(JenScript.BackwardForwardBarGeometry,{
		
		/**
		 * create a bar with two buttons 'forward |>' and 'backward <|' geometry
		 */
		__init : function(config){
			JenScript.AbstractBarGeometry.call(this,config);
		 },
	
	
		 /**
		  * solve backward button
		  * @param {Object} backward button bound 
		  */
	     solveButton1Geometry : function(rect1) {
	    	 
	        if (this.barOrientation == 'Horizontal') {
	            this.button1 = new JenScript.SVGPath().moveTo(rect1.getX(), rect1.getY() + rect1.getHeight() / 2)
	            									.lineTo(rect1.getX() + rect1.getWidth(), rect1.getY())
	            									.lineTo(rect1.getX() + rect1.getWidth(), rect1.getY()+ rect1.getHeight())
	            									.close();
	        }
	        else {
	            this.button1 = new JenScript.SVGPath().moveTo(rect1.getX(), rect1.getY() + rect1.getHeight())
	            										.lineTo(rect1.getX() + rect1.getWidth() / 2, rect1.getY())
	            										.lineTo(rect1.getX() + rect1.getWidth(), rect1.getY()+ rect1.getHeight())
	            										.close();
	        }
	    },

	    /**
		  * solve forward button
		  * @param {Object} forward button bound 
		  */
    	solveButton2Geometry : function(rect2) {
	        if (this.barOrientation == 'Horizontal') {
	            this.button2 = new JenScript.SVGPath().moveTo(rect2.getX(), rect2.getY())
	            										.lineTo(rect2.getX() + rect2.getWidth(), rect2.getY()+ rect2.getHeight() / 2)
	            										.lineTo(rect2.getX(), rect2.getY() + rect2.getHeight())
	            										.close();
	        }
	        else {
	        	 this.button2 = new JenScript.SVGPath().moveTo(rect2.getX(), rect2.getY())
	        	 										.lineTo(rect2.getX() + rect2.getWidth() / 2, rect2.getY()  + rect2.getHeight())
	        	 										.lineTo(rect2.getX() + rect2.getWidth(), rect2.getY())
	        	 										.close();
	        }
    	}
	});
	
	
	
	
	/**
	 * Abstract bar widget that is suppose to use bar geometry like plus/minus or forward/backward.
	 */
	JenScript.AbstractBarWidget  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractBarWidget, JenScript.Widget);
	JenScript.Model.addMethods(JenScript.AbstractBarWidget,{
		
		/**
		 * create abstract bar widget
		 * @param {Object} config
		 * @param {String} [config.Id] widget Id
		 * @param {Number} [config.width] widget width
		 * @param {Number} [config.height] widget height
		 * @param {Number} [config.xIndex] widget x index
		 * @param {Number} [config.yIndex] widget y index
		 * @param {String} [config.barOrientation] widget bar orientation
		 */
		_init : function(config){
		    /** widget geometry */
		    this.geometry = config.geometry;
		    /** plus minus orientation */
		    this.barOrientation = config.barOrientation;
		    /** theme color to fill bar */
		    this.outlineFillColor = config.outlineFillColor;
		    /** shader*/
		    this.shader = config.shader;
		    /** outline color */
		    this.outlineStrokeColor = config.outlineStrokeColor;
		    /** outline bar widget stroke */
		    this.outlineStrokeWidth = (config.outlineStrokeWidth !== undefined) ? config.outlineStrokeWidth: 2;
		    /** button 1 fill color */
		    this.button1FillColor = config.button1FillColor;
		    /** button 2 fill color */
		    this.button2FillColor = config.button2FillColor;
		    /** button 1 draw color */
		    this.button1DrawColor = config.button1DrawColor;
		    /** button 2 draw color */
		    this.button2DrawColor = config.button2DrawColor;
		    /** button 1 rollover fill color */
		    this.button1RolloverFillColor = config.button1RolloverFillColor;
		    /** button 2 rollover fill color */
		    this.button2RolloverFillColor = config.button2RolloverFillColor;
		    /** button 1 rollover draw color */
		    this.button1RolloverDrawColor = config.button1RolloverDrawColor;
		    /** button 2 rollover draw color */
		    this.button2RolloverDrawColor = config.button2RolloverDrawColor;
		    
		    if(config.buttonFillColor !== undefined){
		    	this.setButtonFillColor(config.buttonFillColor);
		    }
		    if(config.buttonRolloverFillColor !== undefined){
		    	this.setButtonRolloverFillColor(config.buttonRolloverFillColor);
		    }
		   
		    if(config.buttonDrawColor !== undefined){
		    	this.setButtonDrawColor(config.buttonDrawColor);
		    }
		    if(config.buttonRolloverDrawColor !== undefined){
		    	this.setButtonRolloverDrawColor(config.buttonRolloverDrawColor);
		    }
		    
		    /** outline bar widget stroke */
		    this.buttonStrokeWidth = (config.buttonStrokeWidth !== undefined) ? config.buttonStrokeWidth: 1;
		    
		    /** visible flag for button 1 */
		    this.button1Visible = true;
		    /** visible flag for button 2 */
		    this.button2Visible = true;
		    
		    this.svg = {};
		    
		    config.Id =  (config.Id !== undefined)?config.Id : 'abstractbarwidget';
	        config.width =  (config.width !== undefined)?config.width : 80;
	        config.height = (config.height !== undefined)?config.height : 18;
	        config.xIndex = (config.xIndex !== undefined)?config.xIndex : 2;
	        config.yIndex = (config.yIndex !== undefined)?config.yIndex : 100;
	        config.barOrientation = (config.barOrientation !== undefined)?config.barOrientation : 'Horizontal';
	        
			JenScript.Widget.call(this,config);
		},
		
		/**
		 * set widget outline fill color
	     * @param {String} outlineFillColor
	     */
	    setOutlineFillColor : function(outlineFillColor) {
	        this.outlineFillColor = outlineFillColor;
	    },
		
		/**
		 * set widget outline stroke color
	     * @param {String} outlineStrokeColor
	     */
	    setOutlineStrokeColor : function(outlineStrokeColor) {
	        this.outlineStrokeColor = outlineStrokeColor;
	    },
	    
	    /**
		 * set widget outline stroke width
	     * @param {Number} outlineStrokeWidth
	     */
	    setOutlineStrokeWidth : function(outlineStrokeWidth) {
	        this.outlineStrokeWidth = outlineStrokeWidth;
	    },
		
		/**
	     * set identical button roll over fill color
	     * @param {String} buttonRolloverFillColor
	     */
	    setButtonRolloverFillColor : function(buttonRolloverFillColor) {
	        this.button1RolloverFillColor = buttonRolloverFillColor;
	        this.button2RolloverFillColor = buttonRolloverFillColor;
	    },
		
		/**
	     * set identical button roll over draw color
	     * @param {String} buttonRolloverDrawColor
	     */
	    setButtonRolloverDrawColor : function(buttonRolloverDrawColor) {
	    	this.button1RolloverDrawColor = buttonRolloverDrawColor;
	    	this.button2RolloverDrawColor = buttonRolloverDrawColor;
	    },
	    
	    /**
	     * set identical button fill color
	     * @param {String} buttonFillColor
	     */
	    setButtonFillColor : function(buttonFillColor) {
	    	this.button1FillColor = buttonFillColor;
	    	this.button2FillColor = buttonFillColor;
	    },
	    
	    /**
	     * set identical button1 and button2 stroke color
	     * @param {String} buttonDrawColor
	     */
	    setButtonDrawColor : function( buttonDrawColor) {
	    	this.button1DrawColor = buttonDrawColor;
	    	this.button2DrawColor = buttonDrawColor;
	    },
	    
	    /**
	     * set the shadow parameters
	     * @param {Object} shader
	     */
	    setShader : function(shader) {
	      this.shader = shader;
	    },
	    
	    /**
	     * bar widget intercept move
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptMove : function(x,y) {
	        this.checkMoveOperation(x,y);
	        this.trackRollover(x,y);
	    },

	    /**
	     * track roll over on button 1 and button 2
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    trackRollover : function(x,y) {
	        if (this.geometry.rect1 != undefined && this.geometry.rect1.contains(x, y)) {
	            if (!this.geometry.rollover1) {
	                this.geometry.rollover1 = true;
	                this.onButton1RolloverOn();
	            }
	        }
	        else {
	            if (this.geometry.rollover1) {
	                this.geometry.rollover1=false;
	                this.onButton1RolloverOff();
	            }
	        }
	        if (this.geometry.rect2 != undefined && this.geometry.rect2.contains(x, y)) {
	            if (!this.geometry.rollover2) {
	                this.geometry.rollover2 =true;
	                this.onButton2RolloverOn();
	            }
	        }
	        else {
	            if (this.geometry.rollover2) {
	                this.geometry.rollover2 = false;
	                this.onButton2RolloverOff();
	            }
	        }
	    },
	    


	    /**
	     * call when button 1 is roll over only call repaint button 2
	     */
	    onButton1RolloverOn : function() {
	    	if(this.button1RolloverDrawColor !== undefined)
	    		this.svg.button1.setAttribute('stroke',this.button1RolloverDrawColor);
	    	else
	    		this.svg.button1.removeAttribute('stroke');
	    	if(this.button1RolloverFillColor !== undefined)
	    		this.svg.button1.setAttribute('fill',this.button1RolloverFillColor);
	    },

	    /**
	     * call when button 1 is no longer roll over only call repaint button 1
	     */
	    onButton1RolloverOff : function() {
	    	if(this.button1DrawColor !== undefined)
	    		this.svg.button1.setAttribute('stroke',this.button1DrawColor);
	    	else
	    		this.svg.button1.removeAttribute('stroke');
	    	if(this.button1FillColor !== undefined)
	    		this.svg.button1.setAttribute('fill',this.button1FillColor);
	    },

	    /**
	     * call when button 1 is roll over only call repaint button 2
	     */
	    onButton2RolloverOn : function() {
	    	if(this.button2RolloverDrawColor !== undefined)
	    		this.svg.button2.setAttribute('stroke',this.button2RolloverDrawColor);
	    	else
	    		this.svg.button2.removeAttribute('stroke');
	    	if(this.button2RolloverFillColor !== undefined)
	    		this.svg.button2.setAttribute('fill',this.button2RolloverFillColor);
	    },

	    /**
	     * call when button 2 is no longer roll over
	     */
	    onButton2RolloverOff : function() {
	    	if(this.button1DrawColor !== undefined)
	    		this.svg.button2.setAttribute('stroke',this.button2DrawColor);
	    	else
	    		this.svg.button2.removeAttribute('stroke');
	    	if(this.button1FillColor !== undefined)
	    		this.svg.button2.setAttribute('fill',this.button2FillColor);
	    },

	    /**
	     * override this method to handle button 1 pressed
	     */
	    onButton1Press : function() {
	    },

	    /**
	     * override this method to handle button 2 pressed
	     */
	    onButton2Press : function() {
	    },

	    /**
	     * override this method to handle button 1 released
	     */
	    onButton1Released : function() {
	    },

	    /**
	     * override this method to handle button 2 released
	     */
	    onButton2Released : function() {
	    },

	    /**
	     * intercept press
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptPress : function(x,y) {
//	        if (!this.getHost().isLockSelected() && this.isOrphanLock()) {
//	            return;
//	        }

	        if (this.geometry.rect1 !== undefined && this.geometry.rect1.contains(x, y)) {
	            this.onButton1Press();
	        }

	        if (this.geometry.rect2 != undefined && this.geometry.rect2.contains(x, y)) {
	            this.onButton2Press();
	        }
	    },

	    /**
	     * intercept drag
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptDrag : function( x,  y) {
	    },

	 
	    /**
	     * intercept release
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptReleased : function(x,y) {
	        this.onButton1Released();
	        this.onButton2Released();
	    },

	    /**
	     * call before widget painting operation
	     */
	    onPaintStart : function() {
	    },

	    /**
	     * call after widget painting operation
	     */
	    onPaintEnd : function() {
	    },

	    /**
	     * pain this widget
	     * @param {Object} graphics context
	     */
	    paintWidget : function(g2d) {
	        if (this.getWidgetFolder() === undefined || this.geometry === undefined) {
	            return;
	        }
	        this.onPaintStart();
	        var currentFolder = this.getWidgetFolder();
	        var boundFolder = currentFolder.getBounds2D();
	        this.geometry.solveRequest=true;
	        this.geometry.solveGeometry(boundFolder);
	        this.setSensibleShapes(this.geometry.getSensibleShapes());

	        g2d.deleteGraphicsElement(this.Id);
	        var svgRoot = new JenScript.SVGGroup().Id(this.Id);
	        
	        var outline = undefined;
	        this.geometry.outlineShape.fillNone().strokeNone();
	        if (this.shader != undefined  && this.shader.percents != undefined && this.shader.colors != undefined) {
	            var start = undefined;
	            var end = undefined;
	            if (this.barOrientation == 'Horizontal') {
	                start = {x:boundFolder.getCenterX(),y: boundFolder.getY()};
	                end = {x:boundFolder.getCenterX(), y : boundFolder.getY() + boundFolder.getHeight()};
	            }
	            else {
	                start = {x:boundFolder.getX(),y: boundFolder.getCenterY()};
	                end = { x: boundFolder.getX() + boundFolder.getWidth(),y: boundFolder.getCenterY()};
	            }
	            var gradientId = 'gradient'+JenScript.sequenceId++;
	            var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(start.x,start.y).to(end.x,end.y).shade(this.shader.percents,this.shader.colors,this.shader.opacity).toSVG();
	            g2d.definesSVG(gradient);
				this.geometry.outlineShape.fill('url(#'+gradientId+')');
	        }
	        
	        if (this.outlineFillColor !== undefined) {
	        	this.geometry.outlineShape.fill(this.outlineFillColor);
	        }
        	if (this.outlineStrokeColor !== undefined) {
	        	this.geometry.outlineShape.stroke(this.outlineStrokeColor).strokeWidth(this.outlineStrokeWidth);
	        }
        	outline= this.geometry.outlineShape.toSVG();
        	svgRoot.child(outline);
	        
			this.svg.outline=outline;
			
	        if (this.button1Visible) {
	        	var  b1 =this.geometry.button1;
	        	var fillColor = (this.geometry.rollover1)?this.button1RolloverFillColor : this.button1FillColor;
	        	var strokeColor = (this.geometry.rollover1)?this.button1RolloverDrawColor : this.button1DrawColor;
	        	b1.fill(fillColor);
	        	b1.stroke(strokeColor).strokeWidth(this.buttonStrokeWidth);
	        	var but1 = b1.toSVG();
	        	this.svg.button1=but1;
	        	svgRoot.child(but1);

	        }
	        if (this.button2Visible) {
	        	var  b2 =this.geometry.button2;
	        	var fillColor = (this.geometry.rollover2)?this.button2RolloverFillColor : this.button2FillColor;
	        	var strokeColor = (this.geometry.rollover2)?this.button2RolloverDrawColor : this.button2DrawColor;
	        	b2.fill(fillColor);
	        	b2.stroke(strokeColor).strokeWidth(this.buttonStrokeWidth);
	        	var but2 = b2.toSVG();
	        	this.svg.button2=but2;
	        	svgRoot.child(but2);
	        }
	        
	        g2d.insertSVG(svgRoot.toSVG());
	        
	        this.onPaintEnd();
	    }
	});
	
	/**
	 * Abstract Plus Minus style bar Widget
	 */
	JenScript.AbstractPlusMinusBarWidget = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractPlusMinusBarWidget, JenScript.AbstractBarWidget);
	JenScript.Model.addMethods(JenScript.AbstractPlusMinusBarWidget,{
		__init: function(config){
			config = config || {};
			config.geometry = new JenScript.PlusMinusBarGeometry(config);
			JenScript.AbstractBarWidget.call(this,config);
		},
		
	});

	/**
	 * Abstract Backward Forward style bar Widget
	 */
	JenScript.AbstractBackwardForwardBarWidget = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractBackwardForwardBarWidget, JenScript.AbstractBarWidget);
	JenScript.Model.addMethods(JenScript.AbstractBackwardForwardBarWidget,{
		__init: function(config){
			config = config || {};
			config.geometry = new JenScript.BackwardForwardBarGeometry(config);
			JenScript.AbstractBarWidget.call(this,config);
		},
		
	});
	
})();
(function(){

	
	
	//
	// 	ToolBar Widget defines image buttons set
	//
	
	
	/**
	 * IconToolBargeometry Bar Geometry
	 */
	JenScript.IconToolBargeometry  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.IconToolBargeometry, JenScript.AbstractWidgetGeometry);
	JenScript.Model.addMethods(JenScript.IconToolBargeometry,{
		_init : function(config){
			 /** margin */
		    this.iconDefs = config.iconDefs;
			/** widget bounding frame */
		    this.bound2D;
		    /** bar outline shape */
		    this.outlineShape;
		    
		    this.buttons = [];
		    
		    /** true make a solving geometry request */
		    this.solveRequest = true;
		    /** margin */
		    this.margin = 4;
		    /** round radius */
		    this.radius = 3;
		    /** widget orientation */
		    this.barOrientation = config.barOrientation;
		    JenScript.AbstractWidgetGeometry.call(this,config);
		   
		    this.iconSize = (config.iconSize !== undefined)?config.iconSize: 20;
		},
		
	    addButton : function(button){
	    	this.buttons.push(button);
	    },
		
		/**
	     * solve bar geometry outline
	     */
	    solveBarGeometry : function() {
	    	var bound2D = this.bound2D;
	    	var margin = this.margin;
	    	var radius = this.radius;
	    	this.clearSensibleShape();
	        if (this.barOrientation == 'Horizontal') {
	        	this.outlineShape = new JenScript.SVGRect().origin(bound2D.getX(),bound2D.getY())
						.size(bound2D.getWidth(), bound2D.getHeight()).radius(radius, radius);
	        	
	        	var x = bound2D.getX()+margin;
	        	var y = bound2D.getY();
	        	 for (var i = 0; i < this.buttons.length; i++) {
		            	this.buttons[i].bound = new JenScript.Bound2D(x, y+2, this.iconSize,this.iconSize);
		            	x = x + this.iconSize + margin;
		            	this.addSensibleShape(this.buttons[i].bound);
		            	
				 }
	        }
	        else if (this.barOrientation == 'Vertical') {
	        	this.outlineShape = new JenScript.SVGRect().origin(bound2D.getX(),bound2D.getY())
					.size(bound2D.getWidth(), bound2D.getHeight());
					
	        }
	        
	    },

	   
	    solveButtonGeometry : function(button){
	    	  var buttonSVG = new JenScript.SVGUse()
	    	  		.xlinkHref(this.iconDefs+'#'+button.icon)
	    	  		.attr('x',button.bound.x)
	    	  		.attr('y',button.bound.y)
	    	  		.attr('width',this.iconSize)
	    	  		.attr('height',this.iconSize);
	    	  button.svg = buttonSVG;
	    },


    	 solveGeometry : function(bound2D) {
	        if (this.solveRequest) {
	            this.bound2D = bound2D;

	            if (this.barOrientation == undefined) {
	                return;
	            }
	            this.solveBarGeometry();
	            for (var i = 0; i < this.buttons.length; i++) {
	            	this.solveButtonGeometry(this.buttons[i]);
				}
	           
	            this.solveRequest = false;
	        }
	    },
	});
	
	
	
	/**
	 * IconToolBarWidget widget that is suppose to use icon tool bar geometry.
	 */
	JenScript.IconToolBarWidget  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.IconToolBarWidget, JenScript.Widget);
	JenScript.Model.addMethods(JenScript.IconToolBarWidget,{
		
		/**
		 * create abstract bar widget
		 * @param {Object} config
		 * @param {String} [config.Id] widget Id
		 * @param {Number} [config.width] widget width
		 * @param {Number} [config.height] widget height
		 * @param {Number} [config.xIndex] widget x index
		 * @param {Number} [config.yIndex] widget y index
		 * @param {String} [config.barOrientation] widget bar orientation
		 */
		_init : function(config){
			
		    /** widget geometry */
		    this.geometry = new JenScript.IconToolBargeometry(config);

		    /** theme color to fill bar */
		    this.outlineFillColor = config.outlineFillColor;
		    /** shader*/
		    this.shader = config.shader;
		    /** outline color */
		    this.outlineStrokeColor = config.outlineStrokeColor;
		    /** outline bar widget stroke */
		    this.outlineStrokeWidth = (config.outlineStrokeWidth !== undefined) ? config.outlineStrokeWidth: 1;
		    
		    /** button fill color */
		    this.buttonFillColor = config.buttonFillColor;
		    
		    /** button roll over fill color */
		    this.buttonRolloverFillColor = config.buttonRolloverFillColor;
		    
		    /** button press fill color */
		    this.buttonPressFillColor = config.buttonPressFillColor;
		    
		    config.Id =  'IconToolBar'+JenScript.sequenceId++;
			config.name = 'WidgetIconToolbar';
	        config.xIndex = (config.xIndex !== undefined)?config.xIndex : 2;
	        config.yIndex = (config.yIndex !== undefined)?config.yIndex : 100;
	        config.barOrientation = (config.barOrientation !== undefined)?config.barOrientation : 'Horizontal';
			JenScript.Widget.call(this,config);
			
		},
		
		addButton : function(button){
			this.geometry.addButton(button);
			this.width = (this.geometry.margin + this.geometry.buttons.length * (this.geometry.iconSize + this.geometry.margin ) + this.geometry.margin );
			this.height = this.geometry.iconSize + 4;
			button.setColor = function(color){
				this.element.setAttribute('fill',color);
			}
		},
	    
	    /**
	     * bar widget intercept move
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptMove : function(x,y) {
	        this.checkMoveOperation(x,y);
	        this.trackRollover(x,y);
	    },

	    /**
	     * track roll over on button 1 and button 2
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    trackRollover : function(x,y) {
	        for (var i = 0; i < this.geometry.buttons.length; i++) {
	        	var b = this.geometry.buttons[i];
	    		if (b.bound != undefined && b.bound.contains(x, y)) {
	 	            if (!b.rollover) {
	 	            	b.rollover = true;
	 	                this.onEnter(b);
	 	            }
	 	        }
	 	        else {
	 	            if (b.rollover) {
	 	            	b.rollover=false;
	 	                this.onExit(b);
	 	            }
	 	        }
			}
	    },

	    onEnter : function(button) {
	    	if(button.enter)
	    		button.enter();
	    	this.showTooltip(button);
	    	this.updateButtons();
	    },
	    
	    onExit : function(button) {
	    	if(button.exit)
	    		button.exit();
	    	this.hideTooltip(button);
	    	this.updateButtons();
	    },
	    
	    showTooltip : function(button) {
	    	if(button.tooltip !== undefined){
	    		if(button.tooltip.position === 'top')
	    			button.tooltip.setArrowAnchor({x : button.bound.x + button.bound.width/2, y : button.bound.y - 10});
	    		if(button.tooltip.position === 'right')
	    			button.tooltip.setArrowAnchor({x : button.bound.x + button.bound.width + 10, y : button.bound.y +  button.bound.height/2});
	    		if(button.tooltip.position === 'left')
	    			button.tooltip.setArrowAnchor({x : button.bound.x - 10, y : button.bound.y +  button.bound.height/2});
	    		if(button.tooltip.position === 'bottom')
	    			button.tooltip.setArrowAnchor({x : button.bound.x + button.bound.width/2, y : button.bound.y +  button.bound.height + 10});
	    		button.tooltip.setVisible(true);
	    		var view = this.getHost().getView();
				var g2d =  new JenScript.Graphics({definitions : view.svgWidgetsDefinitions,graphics : view.svgWidgetsGraphics});
	    		button.tooltip.paintTooltip(g2d);
        	}
	    },
	    
	    hideTooltip : function(button) {
	    	if(button.tooltip !== undefined){
	    		button.tooltip.setVisible(false);
	    		var view = this.getHost().getView();
				var g2d =  new JenScript.Graphics({definitions : view.svgWidgetsDefinitions, graphics : view.svgWidgetsGraphics});
	    		button.tooltip.paintTooltip(g2d);
        	}
	    },

	    onPress : function(button) {
	    	if(button.rollover)
	    		button.pressed = true;
	    	if(button.press)
	    		button.press();
	    	this.updateButtons();
	    },

	    onReleased : function(button) {
	    	button.pressed = false;
	    	if(button.release)
	    		button.release();
	    	this.updateButtons();
	    },
	    
	    updateButton : function(button){
	    	var c = this.buttonFillColor;
	    	if(button.rollover){
	    		c = this.buttonRolloverFillColor;
	    	}
	    	if(button.pressed){
	    		c = this.buttonPressFillColor;
	    		if(button.buttonPressFillColor !== undefined)
	    			c = button.buttonPressFillColor;
	    	}
	    	if(button.toggle && button.isToggled()){
	    		c = this.buttonPressFillColor;
	    		if(button.buttonPressFillColor !== undefined)
	    			c = button.buttonPressFillColor;
	    	}
	    	button.setColor(c);
	    },
	    
	    updateButtons : function(){
	    	  for (var i = 0; i < this.geometry.buttons.length; i++) {
		        	var b = this.geometry.buttons[i];
		        	this.updateButton(b);
	    	  }
	    },
	    
	  

	    /**
	     * intercept press
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptPress : function(x,y) {
	    	for (var i = 0; i < this.geometry.buttons.length; i++) {
	    		if (this.geometry.buttons[i].bound !== undefined && this.geometry.buttons[i].bound.contains(x, y)) {
		            this.onPress(this.geometry.buttons[i]);
		        }
			}
	    },

	    /**
	     * intercept drag
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptDrag : function( x,  y) {
	    },

	 
	    /**
	     * intercept release
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptReleased : function(x,y) {
	    	for (var i = 0; i < this.geometry.buttons.length; i++) {
	    		if (this.geometry.buttons[i].bound !== undefined && this.geometry.buttons[i].bound.contains(x, y)) {
	    			 this.onReleased(this.geometry.buttons[i]);
		        }
			}
	       
	    },

	    /**
	     * call before widget painting operation
	     */
	    onPaintStart : function() {
	    },

	    /**
	     * call after widget painting operation
	     */
	    onPaintEnd : function() {
	    },

	    /**
	     * pain this widget
	     * @param {Object} graphics context
	     */
	    paintWidget : function(g2d) {
	        if (this.getWidgetFolder() === undefined || this.geometry === undefined) {
	            return;
	        }
	        this.onPaintStart();
	        
	        var currentFolder = this.getWidgetFolder();
	        var boundFolder = currentFolder.getBounds2D();
	        this.geometry.solveRequest=true;
	        this.geometry.solveGeometry(boundFolder);
	        this.setSensibleShapes(this.geometry.getSensibleShapes());

	        g2d.deleteGraphicsElement(this.Id);
	        var svgRoot = new JenScript.SVGGroup().Id(this.Id);
	        
	        var outline = undefined;
	        this.geometry.outlineShape.fillNone().strokeNone();
	        if (this.shader != undefined  && this.shader.percents != undefined && this.shader.colors != undefined) {
	            var start = undefined;
	            var end = undefined;
	            if (this.barOrientation == 'Horizontal') {
	                start = {x:boundFolder.getCenterX(),y: boundFolder.getY()};
	                end = {x:boundFolder.getCenterX(), y : boundFolder.getY() + boundFolder.getHeight()};
	            }
	            else {
	                start = {x:boundFolder.getX(),y: boundFolder.getCenterY()};
	                end = { x: boundFolder.getX() + boundFolder.getWidth(),y: boundFolder.getCenterY()};
	            }
	            var gradientId = 'gradient'+JenScript.sequenceId++;
	            var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(start.x,start.y).to(end.x,end.y).shade(this.shader.percents,this.shader.colors,this.shader.opacity).toSVG();
	            g2d.definesSVG(gradient);
				this.geometry.outlineShape.fill('url(#'+gradientId+')');
	        }
	        
	        if (this.outlineFillColor !== undefined) {
	        	this.geometry.outlineShape.fill(this.outlineFillColor);
	        }
        	if (this.outlineStrokeColor !== undefined) {
	        	this.geometry.outlineShape.stroke(this.outlineStrokeColor).strokeWidth(this.outlineStrokeWidth);
	        }
        	outline= this.geometry.outlineShape.toSVG();
        	svgRoot.child(outline);
	        
			for (var i = 0; i < this.geometry.buttons.length; i++) {
				var b =this.geometry.buttons[i];
				var fillColor = this.buttonFillColor;
				if(b.rollover)
					fillColor = this.buttonRolloverFillColor;
				if(b.toggle && b.isToggled())
					fillColor = this.buttonPressFillColor;
	        	b.svg.fill(fillColor);
	        	b.element = b.svg.toSVG();
	        	svgRoot.child(b.element);
			}
			
	        g2d.insertSVG(svgRoot.toSVG());
	        this.onPaintEnd();
	    }
	});
	
})();
(function(){
	//
	// 	Pad Widget defines mini bar with 4 buttons
	//
	//		-plus minus
	//		-backward forward
	//
	
	/**
	 * Abstract Pad Geometry
	 */
	JenScript.AbstractPadGeometry  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractPadGeometry, JenScript.AbstractWidgetGeometry);
	JenScript.Model.addMethods(JenScript.AbstractPadGeometry,{
		_init : function(config){
			/** widget bounding frame */
		    this.bound2D;
		    /** pad center x coordinate */
		    this.centerX;
		    /** pad center y coordinate */
		    this.centerY;
		    /** pad radius */
		    this.radius;
		    /** fragment radius */
		    this.fragmentRadius;
		    /** base shape */
		    this.baseShape;
		    /** control shape */
		    this.controlShape;
		    /** north button bounding rectangle */
		    this.rectNorth;
		    /** south button bounding rectangle */
		    this.rectSouth;
		    /** west button bounding rectangle */
		    this.rectWest;
		    /** button east bouding rectangle */
		    this.rectEast;
		    /** north button shape */
		    this.northButton;
		    /** east button shape */
		    this.eastButton;
		    /** south button shape */
		    this.southButton;
		    /** west button shape */
		    this.westButton;
		    /** north roll over flag */
		    this.northRollover = false;
		    /** east roll over flag */
		    this.eastRollover = false;
		    /** south roll over flag */
		    this.southRollover = false;
		    /** west roll over flag */
		    this.westRollover = false;
		    /** button inset */
		    this.inset = 6;
		    /** solve geometry request */
		    this.solveRequest = true;
		},
	
		/**
	     * solve pad base geometry
	     * solve base shape solve control shape solve each button bounding frame
	     * rectangle
	     */
	    solvePadGeometry : function() {
	    	var centerX = this.centerX;
	    	var centerY = this.centerY;
	    	var inset = this.inset;
	    	var radius = this.radius;
	    	var fragmentRadius = this.fragmentRadius;
	        
	    	// BASE SHAPE
	        this.baseShape = new JenScript.SVGCircle().center(centerX,centerY).radius(radius);
	                                       
	
	        this.controlShape = new JenScript.SVGPath();
	
	        var controlShape = this.controlShape;
	        // CONTROL SHAPE
	        // north control
	        controlShape.moveTo(centerX - fragmentRadius, centerY - fragmentRadius);
	        controlShape.lineTo(centerX - fragmentRadius, centerY - 2
	                * fragmentRadius);
	        controlShape.curveTo(centerX - fragmentRadius, centerY - radius,
	                             centerX + fragmentRadius, centerY - radius, centerX
	                                     + fragmentRadius, centerY - 2 * fragmentRadius);
	        controlShape.lineTo(centerX + fragmentRadius, centerY - fragmentRadius);
	
	        // east control
	        controlShape.lineTo(centerX + 2 * fragmentRadius, centerY
	                - fragmentRadius);
	        controlShape.curveTo(centerX + radius, centerY - fragmentRadius,
	                             centerX + radius, centerY + fragmentRadius, centerX + 2
	                                     * fragmentRadius, centerY + fragmentRadius);
	        controlShape.lineTo(centerX + fragmentRadius, centerY + fragmentRadius);
	
	        // south control
	        controlShape.lineTo(centerX + fragmentRadius, centerY + 2 * fragmentRadius);
	        controlShape.curveTo(centerX + fragmentRadius, centerY + radius,centerX - fragmentRadius, centerY + radius, centerX - fragmentRadius, centerY + 2 * fragmentRadius);
	        controlShape.lineTo(centerX - fragmentRadius, centerY + fragmentRadius);
	
	        // west control
	        controlShape.lineTo(centerX - 2 * fragmentRadius, centerY  + fragmentRadius);
	        controlShape.curveTo(centerX - radius, centerY + fragmentRadius, centerX - radius, centerY - fragmentRadius, centerX - 2 * fragmentRadius, centerY - fragmentRadius);
	        // controlShape.lineTo(centerX+fragmentRadius, centerY+fragmentRadius);
	        controlShape.close();
	
	        // BUTTONS FRAME
	
	        // sensible shape
	        // int deltaSensible = (int)(fragmentRadius/1.8);
	
	        
	        this.rectNorth = new JenScript.Bound2D(centerX - fragmentRadius + inset,
	                                           centerY - 3 * fragmentRadius + inset, 2 * fragmentRadius - 2
	                                                   * inset, 2 * fragmentRadius - 2 * inset);
	        this.rectSouth = new JenScript.Bound2D(centerX - fragmentRadius + inset,
	                                           centerY + fragmentRadius + inset, 2 * fragmentRadius - 2
	                                                   * inset, 2 * fragmentRadius - 2 * inset);
	        this.rectWest = new JenScript.Bound2D(centerX - 3 * fragmentRadius + inset,
	                                          centerY - fragmentRadius + inset, 2 * fragmentRadius - 2
	                                                  * inset, 2 * fragmentRadius - 2 * inset);
	        this.rectEast = new JenScript.Bound2D(centerX + fragmentRadius + inset,
	                                          centerY - fragmentRadius + inset, 2 * fragmentRadius - 2
	                                                  * inset, 2 * fragmentRadius - 2 * inset);
	
	        this.clearSensibleShape();
	        this.addSensibleShape(this.rectNorth);
	        this.addSensibleShape(this.rectSouth);
	        this.addSensibleShape(this.rectWest);
	        this.addSensibleShape(this.rectEast);
	
	    },

	    /**
	     * override this method to create button north shape inside specified
	     * bounding rectangle parameter
	     * 
	     * @param buttonNorthBound
	     */
	   solveButtonNorthGeometry : function(buttonNorthBound){},
	
	    /**
	     * override this method to create button south shape inside specified
	     * bounding rectangle parameter
	     * 
	     * @param buttonSouthBound
	     */
	    solveButtonSouthGeometry : function(buttonSouthBound){},
	
	    /**
	     * override this method to create button west shape inside specified
	     * bounding rectangle parameter
	     * 
	     * @param buttonWestBound
	     */
	    solveButtonWestGeometry : function(buttonWestBound){},
	
	    /**
	     * override this method to create button west shape inside specified
	     * bounding rectangle parameter
	     * 
	     * @param buttonEastBound
	     */
	    solveButtonEastGeometry : function(buttonEastBound){},

	    /**
	     * solve geometry if solveRequest is true, not solve geometry
	     * otherwise
	     * solve consist of following set operations solvePadGeometry()
	     * solveButtonNorthGeometry(Rectangle2D) that have to be override
	     * in subclass of this abstract definition solveButtonSouthGeometry(Rectangle2D) that have to be override
	     * in subclass of this abstract definition solveButtonWestGeometry(Rectangle2D) that have to be override in
	     * subclass of this abstract definition solveButtonEastGeometry(Rectangle2D) that have to be override in
	     * subclass of this abstract definition
	     */
	    
	    solveGeometry : function(bound2D) {
	        if (this.solveRequest) {
	
	            this.bound2D = bound2D;
	
	            this.centerX = bound2D.getCenterX();
	            this.centerY = bound2D.getCenterY();
	            this.radius = bound2D.getWidth() / 2;
	            // this.fragmentRadius = new Double(radius)/2.8;
	            this.fragmentRadius = this.radius / 3;
	
	            this.solvePadGeometry();
	
	            this.solveButtonNorthGeometry(this.rectNorth);
	            this.solveButtonSouthGeometry(this.rectSouth);
	            this.solveButtonWestGeometry(this.rectWest);
	            this.solveButtonEastGeometry(this.rectEast);
	
	            this.solveRequest = false;
	        }
	    }
	});
	
	
	/**
	 * Abstract pad widget that is suppose to use pad geometry like plus/minus or forward/backward
	 */
	JenScript.AbstractPadWidget  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractPadWidget, JenScript.Widget);
	JenScript.Model.addMethods(JenScript.AbstractPadWidget,{
		
		/**
		 * create abstract pad widget
		 * @param {Object} config
		 * @param {String} [config.Id] widget Id
		 * @param {Number} [config.width] widget width
		 * @param {Number} [config.height] widget height
		 * @param {Number} [config.xIndex] widget x index
		 * @param {Number} [config.yIndex] widget y index
		 * @param {String} [config.barOrientation] widget bar orientation
		 */
		_init : function(config){
		    /** widget geometry */
		    this.padGeometry = config.geometry;
		    
		    /** theme color to fill pad base */
		    this.baseFillColor = config.baseFillColor;
		    /** theme color to draw pad base */
		    this.baseStrokeColor = config.baseStrokeColor;
		    /** stroke width to draw pad base */
		    this.baseStrokeWidth = config.baseStrokeWidth;
		    /** theme color to fill pad control */
		    this.controlFillColor = config.controlFillColor;
		    /** theme color to draw pad control */
		    this.controlStrokeColor =config.controlStrokeColor;
		    /** stroke width to draw pad control */
		    this.controlStrokeWidth =config.controlStrokeWidth;
		    /** button fill color */
		    this.buttonFillColor =config.buttonFillColor;
		    /** button rollover fill color */
		    this.buttonRolloverFillColor =config.buttonRolloverFillColor;
		    /** button stroke color */
		    this.buttonStrokeColor =config.buttonStrokeColor;
		    /** button rollover stroke color */
		    this.buttonRolloverStrokeColor =config.buttonRolloverStrokeColor;
		    /** button stroke */
		    this.buttonStrokeWidth =config.buttonStrokeWidth;
		    
		    this.svg={};
		    JenScript.Widget.call(this,config);
		},
		
	   
	    interceptDrag : function(x,y) {
	    },

	    interceptReleased : function(x,y) {
	        this.onNorthButtonReleased();
	        this.onSouthButtonReleased();
	        this.onWestButtonReleased();
	        this.onEastButtonReleased();
	    },

	    paintWidget : function(g2d) {
//	        if (!this.getHost().isLockSelected()) {
//	            return;
//	        }

	        if (this.getWidgetFolder() == undefined || this.padGeometry == undefined) {
	            return;
	        }

	        g2d.deleteGraphicsElement(this.Id);
	        var svgRoot = new JenScript.SVGGroup().Id(this.Id);
	        
	        var currentFolder = this.getWidgetFolder();
	        var boundFolder = currentFolder.getBounds2D();

	        this.padGeometry.solveRequest=true;
	        this.padGeometry.solveGeometry(boundFolder);
	        this.setSensibleShapes(this.padGeometry.getSensibleShapes());

	        var padGeometry = this.padGeometry;
	       
	        // BASE(fill & draw)
	        if (this.baseFillColor !== undefined) {
	        	padGeometry.baseShape.fill(this.baseFillColor).strokeNone();
	        	this.svg.baseFill = padGeometry.baseShape.toSVG();
	        	svgRoot.child(this.svg.baseFill);
	        }
	        if (this.baseStrokeColor !== undefined) {
	        	padGeometry.baseShape.stroke(this.baseStrokeColor).strokeWidth(this.baseStrokeWidth).fillNone();
	        	this.svg.baseStroke = padGeometry.baseShape.toSVG();
	        	svgRoot.child(this.svg.baseStroke);
	        }
	        

	        // CONTROL(fill & draw)
	        if (this.controlFillColor != undefined) {
	        	 padGeometry.controlShape.fill(this.controlFillColor).strokeNone();
	        	 this.svg.controlFill = padGeometry.controlShape.toSVG();
	        	 svgRoot.child(this.svg.controlFill);
	        }
	        if (this.controlStrokeColor != undefined) {
	        	padGeometry.controlShape.stroke(this.controlStrokeColor).strokeWidth(this.controlStrokeWidth).fillNone();
	        	this.svg.controlStroke = padGeometry.controlShape.toSVG();
	        	svgRoot.child(this.svg.controlStroke);
	        }
	       

	        var that=this;
	        this.svg.buttons = {};
	        var pb = function processButton(rf,button,name){
        		that.svg.buttons[name]={};
        		var bf = (rf===true)?that.buttonRolloverFillColor:that.buttonFillColor;
        		var bs = (rf===true)?that.buttonRolloverStrokeColor:that.buttonStrokeColor;
        		if(bf !== undefined){
	        	   button.fill(bf).strokeNone();
	        	   that.svg.buttons[name].fill = button.toSVG();
	        	   svgRoot.child(that.svg.buttons[name].fill);
        		}
        		if(bs !== undefined){
	        	   button.stroke(bs).strokeWidth(this.buttonStrokeWidth).fillNone();
	        	   that.svg.buttons[name].stroke = button.toSVG();
	        	   svgRoot.child(that.svg.buttons[name].stroke);
        		}
	       };
	        
	       pb(padGeometry.northRollover,padGeometry.northButton,'north');
	       pb(padGeometry.southRollover,padGeometry.southButton,'south');
	       pb(padGeometry.westRollover,padGeometry.westButton,'west');
	       pb(padGeometry.eastRollover,padGeometry.eastButton,'east');
               
	     g2d.insertSVG(svgRoot.toSVG());
	    },
	    
	    
	    interceptMove : function(x,y) {
	    	this.checkMoveOperation(x, y);
	    	
	        if (this.getWidgetFolder() === undefined) {
	            return;
	        }

	        var padGeometry = this.padGeometry;
	        if (!this.getWidgetFolder().getBounds2D().contains(x, y)) {
	            padGeometry.northRollover=false;
	            padGeometry.southRollover=false;
	            padGeometry.westRollover=false;
	            padGeometry.eastRollover=false;
	            this.onNorthButtonRolloverOff();
	            this.onSouthButtonRolloverOff();
	            this.onWestButtonRolloverOff();
	            this.onEastButtonRolloverOff();
	            return;
	        }
	        
	        this.trackRollover(x, y);
	    },

	    /**
	     * track roll over on button 1 and button 2
	     * 
	     * @param x
	     * @param y
	     */
	    trackRollover : function(x,y) {
	    	var padGeometry = this.padGeometry;
	        if (padGeometry.rectNorth != undefined && padGeometry.rectNorth.contains(x, y)) {
	            if (!padGeometry.northRollover) {
	                padGeometry.northRollover=true;
	                this.onNorthButtonRolloverOn();
	            }
	        }
	        else {
	            if (padGeometry.northRollover) {
	                padGeometry.northRollover=false;
	                this.onNorthButtonRolloverOff();
	            }
	        }

	        if (padGeometry.rectSouth != undefined && padGeometry.rectSouth.contains(x, y)) {
	            if (!padGeometry.southRollover) {
	                padGeometry.southRollover=true;
	                this.onSouthButtonRolloverOn();
	            }
	        }
	        else {
	            if (padGeometry.southRollover) {
	                padGeometry.southRollover=false;
	                this.onSouthButtonRolloverOff();
	            }
	        }

	        if (padGeometry.rectWest != undefined && padGeometry.rectWest.contains(x, y)) {
	            if (!padGeometry.westRollover) {
	                padGeometry.westRollover=true;
	                this.onWestButtonRolloverOn();
	            }
	        }
	        else {
	            if (padGeometry.westRollover) {
	                padGeometry.westRollover=false;
	                this.onWestButtonRolloverOff();
	            }
	        }

	        if (padGeometry.rectEast != undefined && padGeometry.rectEast.contains(x, y)) {
	            if (!padGeometry.eastRollover) {
	                padGeometry.eastRollover=true;
	                this.onEastButtonRolloverOn();
	            }
	        }
	        else {
	            if (padGeometry.eastRollover) {
	                padGeometry.eastRollover=false;
	                this.onEastButtonRolloverOff();
	            }
	        }

	    },
	    
	    _rollOn : function(name){
	    	this.svg.buttons[name].stroke.setAttribute('stroke',this.buttonRolloverStrokeColor);
	    	this.svg.buttons[name].fill.setAttribute('fill',this.buttonRolloverFillColor);
	    },
	    _rollOff : function(name){
	    	this.svg.buttons[name].stroke.setAttribute('stroke',this.buttonStrokeColor);
	    	this.svg.buttons[name].fill.setAttribute('fill',this.buttonFillColor);
	    },

	    /**
	     * call when button north is roll over
	     */
	    onNorthButtonRolloverOn : function() {
	    	this._rollOn('north');
	    },

	    /**
	     * call when button north is no longer roll over
	     */
	    onNorthButtonRolloverOff : function() {
	    	this._rollOff('north');
	    },

	    /**
	     * call when button south is roll over
	     */
	    onSouthButtonRolloverOn : function() {
	    	this._rollOn('south');
	    },

	    /**
	     * call when button south is no longer roll over
	     */
	    onSouthButtonRolloverOff : function() {
	    	this._rollOff('south');
	    },

	    /**
	     * call when button west is roll over
	     */
	    onWestButtonRolloverOn : function() {
	    	this._rollOn('west');
	    },

	    /**
	     * call when button west is no longer roll over
	     */
	    onWestButtonRolloverOff : function() {
	    	this._rollOff('west');
	    },

	    /**
	     * call when button east is roll over
	     */
	    onEastButtonRolloverOn : function() {
	    	this._rollOn('east');
	    },

	    /**
	     * call when button east is no longer roll over
	     */
	    onEastButtonRolloverOff : function() {
	    	this._rollOff('east');
	    },

	    /**
	     * override this method to handle button north pressed
	     */
	    onNorthButtonPress : function() {
	    },

	    /**
	     * override this method to handle button south pressed
	     */
	    onSouthButtonPress : function() {
	    },

	    /**
	     * override this method to handle button west pressed
	     */
	    onWestButtonPress : function() {
	    },

	    /**
	     * override this method to handle button east pressed
	     */
	    onEastButtonPress : function() {
	    },

	    /**
	     * override this method to handle button north released
	     */
	    onNorthButtonReleased : function() {
	    },

	    /**
	     * override this method to handle button south released
	     */
	    onSouthButtonReleased : function() {
	    },

	    /**
	     * override this method to handle button west released
	     */
	    onWestButtonReleased : function() {
	    },

	    /**
	     * override this method to handle button east released
	     */
	    onEastButtonReleased : function() {
	    },


	    interceptPress : function(x,y) {
	        //super.interceptPress(x, y);
	    	var padGeometry = this.padGeometry;
	        if (padGeometry.rectNorth != undefined && this.padGeometry.rectNorth.contains(x, y)) {
	            this.onNorthButtonPress();
	        }
	        else {
	        }

	        if (this.padGeometry.rectSouth != undefined && padGeometry.rectSouth.contains(x, y)) {
	            this.onSouthButtonPress();
	        }
	        else {
	        }

	        if (padGeometry.rectWest != undefined && padGeometry.rectWest.contains(x, y)) {
	            this.onWestButtonPress();
	        }
	        else {
	        }

	        if (padGeometry.rectEast != undefined  && padGeometry.rectEast.contains(x, y)) {
	            this.onEastButtonPress();
	        }
	        else {
	        }

	    }
	    
	});
	
	
	
	/**
	 * Backward Forward Pad Geometry
	 */
	JenScript.BackwardForwardPadGeometry  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.BackwardForwardPadGeometry, JenScript.AbstractPadGeometry);
	JenScript.Model.addMethods(JenScript.BackwardForwardPadGeometry,{
		__init: function(config){
			config = config||{};
			JenScript.AbstractPadGeometry.call(this,config);
		},
		
	    solveButtonNorthGeometry : function(buttonNorthBound) {
	        this.northButton = new JenScript.SVGPath();
	        this.northButton.moveTo(buttonNorthBound.getX(), buttonNorthBound.getY() + buttonNorthBound.getHeight());
	        this.northButton.lineTo( buttonNorthBound.getX() + buttonNorthBound.getWidth() / 2,buttonNorthBound.getY());
	        this.northButton.lineTo( buttonNorthBound.getX() + buttonNorthBound.getWidth(),buttonNorthBound.getY() + buttonNorthBound.getHeight());
	        this.northButton.close();
	    },
	  
	    solveButtonSouthGeometry : function(buttonSouthBound) {
	        this.southButton = new JenScript.SVGPath();
	        this.southButton.moveTo(buttonSouthBound.getX(), buttonSouthBound.getY());
	        this.southButton.lineTo(buttonSouthBound.getX() + buttonSouthBound.getWidth() / 2, buttonSouthBound.getY() + buttonSouthBound.getHeight());
	        this.southButton.lineTo(buttonSouthBound.getX() + buttonSouthBound.getWidth(),buttonSouthBound.getY());
	        this.southButton.close();
	    },

	    solveButtonWestGeometry : function(buttonWestBound) {
	        this.westButton = new JenScript.SVGPath();
	        this.westButton.moveTo(buttonWestBound.getX(), buttonWestBound.getY()  + buttonWestBound.getHeight() / 2);
	        this.westButton.lineTo(buttonWestBound.getX() + buttonWestBound.getWidth(), buttonWestBound.getY());
	        this.westButton.lineTo(buttonWestBound.getX() + buttonWestBound.getWidth(), buttonWestBound.getY() + buttonWestBound.getHeight());
	        this.westButton.close();
	    },
	    
	    solveButtonEastGeometry : function(buttonEastBound) {
	    	this.eastButton = new JenScript.SVGPath();
	    	this.eastButton.moveTo(buttonEastBound.getX(), buttonEastBound.getY());
	    	this.eastButton.lineTo(buttonEastBound.getX() + buttonEastBound.getWidth(),buttonEastBound.getY() + buttonEastBound.getHeight()/2);
	    	this.eastButton.lineTo(buttonEastBound.getX(), buttonEastBound.getY()+ buttonEastBound.getHeight());
	    	this.eastButton.close();
	    }
	});
	
	
	/**
	 * Plus Minus Pad Geometry
	 */
	JenScript.PlusMinusPadGeometry  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PlusMinusPadGeometry, JenScript.AbstractPadGeometry);
	JenScript.Model.addMethods(JenScript.PlusMinusPadGeometry,{
		__init: function(config){
			config = config||{};
			JenScript.AbstractPadGeometry.call(this,config);
		},
		
	    solveButtonNorthGeometry : function(buttonNorthBound) {
	        this.northButton = new JenScript.SVGPath();
	        this.northButton.moveTo(buttonNorthBound.getX() + buttonNorthBound.getWidth() / 2, buttonNorthBound.getY());
	        this.northButton.lineTo(buttonNorthBound.getX() + buttonNorthBound.getWidth() / 2,buttonNorthBound.getY() + buttonNorthBound.getHeight());
	        this.northButton.moveTo(buttonNorthBound.getX(), buttonNorthBound.getY()+ buttonNorthBound.getHeight() / 2);
	        this.northButton.lineTo(buttonNorthBound.getX() + buttonNorthBound.getWidth(), buttonNorthBound.getY() + buttonNorthBound.getHeight() / 2);
	    },

	   
	    solveButtonSouthGeometry : function(buttonSouthBound) {
	    	this.southButton = new JenScript.SVGPath();
	    	this.southButton.moveTo(buttonSouthBound.getX(), buttonSouthBound.getY()+ buttonSouthBound.getHeight() / 2);
	    	this.southButton.lineTo(buttonSouthBound.getX() + buttonSouthBound.getWidth(),buttonSouthBound.getY() + buttonSouthBound.getHeight() / 2);
	    },

	    
	    solveButtonWestGeometry : function(buttonWestBound) {
	    	this.westButton = new JenScript.SVGPath();
	    	this.westButton.moveTo(buttonWestBound.getX(), buttonWestBound.getY() + buttonWestBound.getHeight() / 2);
	    	this.westButton.lineTo(buttonWestBound.getX() + buttonWestBound.getWidth(), buttonWestBound.getY() + buttonWestBound.getHeight() / 2);
	    },

	    solveButtonEastGeometry : function(buttonEastBound) {
	    	this.eastButton = new JenScript.SVGPath();
	    	this.eastButton.moveTo(buttonEastBound.getX() + buttonEastBound.getWidth() / 2, buttonEastBound.getY());
	    	this.eastButton.lineTo(buttonEastBound.getX() + buttonEastBound.getWidth()/ 2, buttonEastBound.getY() + buttonEastBound.getHeight());
	    	this.eastButton.moveTo(buttonEastBound.getX(), buttonEastBound.getY() + buttonEastBound.getHeight() / 2);
	    	this.eastButton.lineTo(buttonEastBound.getX() + buttonEastBound.getWidth(), buttonEastBound.getY() + buttonEastBound.getHeight() / 2);
	    }
	});
	
	
	/**
	 * Abstract Backward Forward Pad Widget
	 */
	JenScript.AbstractBackwardForwardPadWidget  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractBackwardForwardPadWidget, JenScript.AbstractPadWidget);
	JenScript.Model.addMethods(JenScript.AbstractBackwardForwardPadWidget,{
		__init: function(config){
			config = config||{};
			config.geometry= new JenScript.BackwardForwardPadGeometry(); 
			JenScript.AbstractPadWidget.call(this,config);
		},
	});
	
	
	/**
	 * Plus Minus Pad Widget
	 */
	JenScript.AbstractPlusMinusPadWidget  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractPlusMinusPadWidget, JenScript.AbstractPadWidget);
	JenScript.Model.addMethods(JenScript.AbstractPlusMinusPadWidget,{
		__init: function(config){
			config = config||{};
			config.geometry= new JenScript.PlusMinusPadGeometry(); 
			JenScript.AbstractPadWidget.call(this,config);
		},
	});
})();
(function(){
	
	
	/**
	 * Button Geometry
	 */
	JenScript.AbstractButtonGeometry  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractButtonGeometry, JenScript.AbstractWidgetGeometry);
	JenScript.Model.addMethods(JenScript.AbstractButtonGeometry,{
		_init : function(config){
			/** widget bounding frame */
		    this.bound2D;
		    /** bar outline shape */
		    this.outlineShape;
		    /** button bounding rectangle */
		    this.rect;
		    /** button path */
		    this.button;
		    /** button 1 roll over flag */
		    this.rollover = false;
		    /** true make a solving geometry request */
		    this.solveRequest = true;
		    /** round radius */
		    this.radius = (config.radius !== undefined) ? config.radius: 3;
		    /** inset */
		    this.inset = (config.inset !== undefined) ? config.inset: 4;
		    JenScript.AbstractWidgetGeometry.call(this,config);
		},
		
		
	    /**
	     * override this method to create button shape inside specified bounding
	     * rectangle parameter consider two orientation cases, horizontal and
	     * vertical
	     * 
	     * @param {Object} button Bound2D
	     */
	    solveButtonGeometry : function(buttonBound){},


	    /**
	     * solve geometry if solveRequest is true, not solve geometry
	     * otherwise
	     * solve consist of solveButtonGeometry(rect)
	     * subclass of this abstract definition
	     * 
	     * @param {Object} the bar bound
	     */
    	 solveGeometry : function(bound2D) {
	        if (this.solveRequest) {
	           
	        	this.bound2D = bound2D;
		    	var inset = this.inset;
		    	
		        this.outlineShape = new JenScript.SVGRect().origin(bound2D.getX(),bound2D.getY())
						.size(bound2D.getWidth(), bound2D.getHeight());
		        
		        this.rect = new JenScript.Bound2D(bound2D.getX() + inset, bound2D.getY() + inset, bound2D.getWidth() - 2 * inset, bound2D.getHeight() - 2 * inset);
		        this.clearSensibleShape();
		        this.addSensibleShape(this.rect);
	            this.solveButtonGeometry(this.rect);
	            this.solveRequest = false;
	        }
	    },
	});
	
	/**
	 * Defines default button geometry
	 */
	JenScript.ButtonGeometry  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ButtonGeometry, JenScript.AbstractButtonGeometry);
	JenScript.Model.addMethods(JenScript.ButtonGeometry,{
		
		/**
		 * create a button geometry
		 */
		__init : function(config){
			JenScript.AbstractButtonGeometry.call(this,config);
		 },
		 
		 /**
		  * solve  button
		  * @param {Object} button bound 
		  */
		 solveButtonGeometry : function(rect) {
			 this.button =  new JenScript.SVGRect().origin(rect.getX(),rect.getY())
				.size(rect.getWidth(), rect.getHeight()).radius(this.radius,this.radius);
		 },
		   

	});
	
	/**
	 * Abstract button widget that is suppose to use button geometry
	 */
	JenScript.AbstractButtonWidget  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractButtonWidget, JenScript.Widget);
	JenScript.Model.addMethods(JenScript.AbstractButtonWidget,{
		
		/**
		 * create abstract bar widget
		 * @param {Object} config
		 * @param {String} [config.Id] widget Id
		 * @param {Number} [config.width] widget width
		 * @param {Number} [config.height] widget height
		 * @param {Number} [config.xIndex] widget x index
		 * @param {Number} [config.yIndex] widget y index
		 */
		_init : function(config){
		    /** widget geometry */
		    this.geometry = config.geometry;
		    /** text*/
		    this.text = config.text;
		    /** text*/
		    this.textId;
		    /** text*/
		    this.textColor=(config.textColor !== undefined) ? config.textColor: 'black';
		    /** text font size*/
		    this.fontSize =(config.fontSize !== undefined) ? config.fontSize: 12;
		    /** shader*/
		    this.shader = config.shader;
		    /** button fill color */
		    this.buttonFillColor = config.buttonFillColor;
		    /** button draw color */
		    this.buttonDrawColor = config.buttonDrawColor;
		    /** button  roll over fill color */
		    this.buttonRolloverFillColor = config.buttonRolloverFillColor;
		    /** button  roll over draw color */
		    this.buttonRolloverDrawColor = config.buttonRolloverDrawColor;
		    /** outline bar widget stroke */
		    this.buttonStrokeWidth = (config.buttonStrokeWidth !== undefined) ? config.buttonStrokeWidth: 1;
		    
		    /**fill and draw opacity*/
		    this.buttonFillColorOpacity = (config.buttonFillColorOpacity !== undefined) ? config.buttonFillColorOpacity: 1;
		    this.buttonDrawColorOpacity = (config.buttonDrawColorOpacity !== undefined) ? config.buttonDrawColorOpacity: 1;
		    
		    /** visible flag for button  */
		    this.buttonVisible = true;
		    this.svg = {};
		    config.Id =  (config.Id !== undefined)?config.Id : 'AbstractButtonWidget';
	        config.width =  (config.width !== undefined)?config.width : 80;
	        config.height = (config.height !== undefined)?config.height : 24;
	        //index, redefine if needed
	        config.xIndex = (config.xIndex !== undefined)?config.xIndex : 100;
	        config.yIndex = (config.yIndex !== undefined)?config.yIndex : 100;
			JenScript.Widget.call(this,config);
		},
		
		/**
	     * set  button roll over fill color
	     * @param {String} buttonRolloverFillColor
	     */
	    setButtonRolloverFillColor : function(buttonRolloverFillColor) {
	        this.buttonRolloverFillColor = buttonRolloverFillColor;
	    },
		
		/**
	     * set  button roll over draw color
	     * @param {String} buttonRolloverDrawColor
	     */
	    setButtonRolloverDrawColor : function(buttonRolloverDrawColor) {
	    	this.buttonRolloverDrawColor = buttonRolloverDrawColor;
	    },
	    
	    /**
	     * set  button fill color
	     * @param {String} buttonFillColor
	     */
	    setButtonFillColor : function(buttonFillColor) {
	    	this.buttonFillColor = buttonFillColor;
	    },
	    
	    /**
	     * set  button fill color opacity
	     * @param {String} buttonFillColor
	     */
	    setButtonFillColorOpacity : function(buttonFillColorOpacity) {
	    	this.buttonFillColorOpacity = buttonFillColorOpacity;
	    },
	    
	    /**
	     * set  button stroke color
	     * @param {String} buttonDrawColor
	     */
	    setButtonDrawColor : function( buttonDrawColor) {
	    	this.buttonDrawColor = buttonDrawColor;
	    },
	    
	    /**
	     * set  button stroke color opacity
	     * @param {String} buttonFillColor
	     */
	    setButtonDrawColorOpacity : function(buttonDrawColorOpacity) {
	    	this.buttonDrawColorOpacity = buttonDrawColorOpacity;
	    },
	    
	    /**
	     * set the shadow parameters
	     * @param {Object} shader
	     */
	    setShader : function(shader) {
	      this.shader = shader;
	    },
	    
	    /**
	     * bar widget intercept move
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptMove : function(x,y) {
	        this.checkMoveOperation(x,y);
	        this.trackRollover(x,y);
	    },

	    /**
	     * track roll over on button 
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    trackRollover : function(x,y) {
	        if (this.geometry.rect != undefined && this.geometry.rect.contains(x, y)) {
	            if (!this.geometry.rollover) {
	                this.geometry.rollover = true;
	                this.onButtonRolloverOn();
	            }
	        }
	        else {
	            if (this.geometry.rollover) {
	                this.geometry.rollover=false;
	                this.onButtonRolloverOff();
	            }
	        }
	       
	    },


	    /**
	     * call when button  is roll over only call repaint button
	     */
	    onButtonRolloverOn : function() {
	    	this.svg.button.setAttribute('stroke',this.buttonRolloverDrawColor);
	    	if(this.buttonRolloverFillColor !== undefined){
	    		this.svg.button.setAttribute('fill',this.buttonRolloverFillColor);
	    	}
	    	else if(this.buttonFillColor !== undefined){
	    		this.svg.button.setAttribute('fill',this.buttonFillColor);
	    	}
	    	else{
	    		this.svg.button.removeAttribute('fill');
	    	}
	    	var currentFolder = this.getWidgetFolder();
	    	var boundFolder = currentFolder.getBounds2D();
       	 	var textLabel = new JenScript.SVGElement().name('text')
				.attr('id',this.textId)
				.attr('x',boundFolder.getX()+boundFolder.getWidth())
				.attr('y',boundFolder.getY())
				.attr('font-size',this.fontSize)
				.attr('fill',this.textColor)
				.attr('fill-opacity',1)
				.attr('text-anchor','middle')
				.textContent(this.text);
       	 
       	 	this.svg.group.appendChild(textLabel.buildHTML());
	    },

	    /**
	     * call when button  is no longer roll over only call repaint button
	     */
	    onButtonRolloverOff : function() {
	    	this.svg.button.setAttribute('stroke',this.buttonDrawColor);
	    	if(this.buttonFillColor !== undefined){
	    		this.svg.button.setAttribute('fill',this.buttonFillColor);
	    	}
	    	else if(this.buttonFillColor !== undefined){
	    		this.svg.button.setAttribute('fill',this.buttonFillColor);
	    	}
	    	else{
	    		this.svg.button.removeAttribute('fill');
	    	}
	    	var tooltip = document.getElementById(this.textId);
	    	if(tooltip)
	    		this.svg.group.removeChild(tooltip);
	    },

	   

	    /**
	     * override this method to handle button  pressed
	     */
	    onButtonPress : function() {
	    },


	    /**
	     * override this method to handle button  released
	     */
	    onButtonReleased : function() {
	    },


	    /**
	     * intercept press
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptPress : function(x,y) {
	        if (!this.getHost().isLockSelected() && this.isOrphanLock()) {
	            return;
	        }
	        if (this.geometry.rect !== undefined && this.geometry.rect.contains(x, y)) {
	            this.onButtonPress();
	        }
	    },

	    /**
	     * intercept drag
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptDrag : function( x,  y) {
	    },

	 
	    /**
	     * intercept release
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptReleased : function(x,y) {
	        this.onButtonReleased();
	    },

	    /**
	     * call before widget painting operation
	     */
	    onPaintStart : function() {
	    },

	    /**
	     * call after widget painting operation
	     */
	    onPaintEnd : function() {
	    },

	    /**
	     * pain this widget
	     * @param {Object} graphics context
	     */
	    paintWidget : function(g2d) {
	        if (this.getWidgetFolder() === undefined || this.geometry === undefined) {
	            return;
	        }
	        this.onPaintStart();
	        var currentFolder = this.getWidgetFolder();
	        var boundFolder = currentFolder.getBounds2D();
	        this.geometry.solveRequest=true;
	        this.geometry.solveGeometry(boundFolder);
	        this.setSensibleShapes(this.geometry.getSensibleShapes());

	        g2d.deleteGraphicsElement(this.Id);
	        var svgRoot = new JenScript.SVGGroup().Id(this.Id);
	        
	        var outline = undefined;
	        //this.geometry.outlineShape.fillNone().strokeNone();
	        if (this.shader != undefined  && this.shader.percents != undefined && this.shader.colors != undefined) {
	            var start = {x:boundFolder.getCenterX(),y: boundFolder.getY()};
	            var end = {x:boundFolder.getCenterX(), y : boundFolder.getY() + boundFolder.getHeight()};
	            var gradientId = 'gradient'+JenScript.sequenceId++;
	            var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(start.x,start.y).to(end.x,end.y).shade(this.shader.percents,this.shader.colors).toSVG();
				
	            //g2d.definesSVG(gradient);
				//this.geometry.outlineShape.fill('url(#'+gradientId+')');
	        }
	        
//	        if (this.outlineFillColor !== undefined) {
//	        	this.geometry.outlineShape.fill(this.outlineFillColor);
//	        }
//        	if (this.outlineStrokeColor !== undefined) {
//	        	//this.geometry.outlineShape.stroke(this.outlineStrokeColor).strokeWidth(this.outlineStrokeWidth);
//        		
//	        }
        	//this.geometry.outlineShape.stroke('red').strokeWidth(1).fillNone();
        	
	        outline= this.geometry.outlineShape.toSVG();
        	//svgRoot.child(outline);
	        
			this.svg.outline=outline;
			
	        if (this.buttonVisible) {
	        	var  b =this.geometry.button;
	        	var fillColor = (this.geometry.rollover)?this.buttonRolloverFillColor : this.buttonFillColor;
	        	var strokeColor = (this.geometry.rollover)?this.buttonRolloverDrawColor : this.buttonDrawColor;
	        	
	        	if(fillColor !== undefined)
	        		b.fill(fillColor).fillOpacity(this.buttonFillColorOpacity);
	        	else
	        		b.fillNone();
	        	
	        	b.stroke(strokeColor).strokeWidth(this.buttonStrokeWidth).strokeOpacity(this.buttonDrawColorOpacity);
	        	
	        	var but = b.toSVG();
	        	this.svg.button=but;
	        	svgRoot.child(but);
	        }
	        this.textId = 'buttontext_'+this.Id;
	       
	        var rsvg = svgRoot.toSVG();
	        this.svg.group=rsvg;
	        g2d.insertSVG(rsvg);
	        
	        this.onPaintEnd();
	        
	    }
	});
	
	
	JenScript.ButtonWidget = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ButtonWidget, JenScript.AbstractButtonWidget);
	JenScript.Model.addMethods(JenScript.ButtonWidget,{
		___init: function(config){
			config = config || {};
			config.Id = 'buttonwidget'+JenScript.sequenceId++;
			
			//widget folder size
			config.width=(config.width !== undefined)?config.width:60;
			config.height=(config.height !== undefined)?config.height:24;
			
			
			config.text=(config.text !== undefined)?config.text:'Text Label';
			
			config.name=(config.name !== undefined)?config.name:'Unamed Button Widget';
			
			
			//folder index (corner right bottom)
			config.xIndex=(config.xIndex !== undefined)?config.xIndex:100;
			config.yIndex=(config.yIndex !== undefined)?config.yIndex:100;
			config.geometry = new JenScript.ButtonGeometry(config);
			
			
			config.buttonDrawColor=(config.buttonDrawColor !== undefined)?config.buttonDrawColor:'black';
			config.buttonRolloverDrawColor=(config.buttonRolloverDrawColor !== undefined)?config.buttonRolloverDrawColor:'green';
			config.buttonDrawColorOpacity=(config.buttonDrawColorOpacity !== undefined)?config.buttonDrawColorOpacity:1;
			
			config.buttonFillColor=(config.buttonFillColor !== undefined)?config.buttonFillColor:'gray';
			config.buttonRolloverFillColor=(config.buttonRolloverFillColor !== undefined)?config.buttonRolloverFillColor:'orange';
			config.buttonFillColorOpacity=(config.buttonFillColorOpacity !== undefined)?config.buttonFillColorOpacity:1;
			
			JenScript.AbstractButtonWidget.call(this,config);
			
			var percents = ['0%','20%','50%','80%','100%'];
		    var colors = [ 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0,0.6)', 'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.6)','rgba(0, 0, 0, 0.1)' ];
		    
//		    var buttonDrawColor = JenScript.RosePalette.COALBLACK;
//		    var buttonRolloverDrawColor = 'pink';
//			
//		    //this.setShader({percents:percents, colors:colors});
//		    this.setButtonFillColor('gray');
//		    this.setButtonRolloverFillColor('green');
//		    this.setButtonDrawColor(buttonDrawColor);
//		    this.setButtonRolloverDrawColor(buttonRolloverDrawColor);
		    this.setOrphanLock(false);
		    
		    this.onPress = config.onPress;
		},
	    onButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	       if(this.onPress)
	    	   this.onPress();
	    },
	    
	    
	    onRegister : function(){
	    	//console.log('button register on host '+this.getHost().name);
	    	if(this.getHost().getProjection() !== undefined){
	    		this.create();
	    		//console.log('repaint heere');
	    	}else{
	    		this.getHost().addPluginListener('projectionRegister',function (plugin){
		    		//console.log('on projectionRegister event');
					if(plugin.getProjection().getView() !== undefined){
						//console.log('111--');
						this.create();
						//console.log('on register repaint1 ok');
					}else{
					
						//wait view registering
						plugin.getProjection().addProjectionListener('viewRegister',function(proj){
							//console.log('222--');
							this.create();
							//console.log('on register repaint2 ok');
						},'Wait for projection view registering for reason : simple button plugin');
					}
				},'Plugin listener for projection register for reason : simple button plugin');
	    	}
	    	
	    }
	});

	
})();
(function(){
	//boilerplate plugin to handle anonymous widget
	JenScript.ButtonPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ButtonPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.ButtonPlugin, {
		_init : function(config) {
			config = config || {};
			config.name = 'SimpleButtonPlugin';
			config.selectable = false;
			JenScript.Plugin.call(this, config);
		},
		paintPlugin : function(g2d, part) {
		},
		
		
		/**
		 * Select this plugin on register (internal) to always paint this widgets 
		 * 
		 * make this plugin selectable = false and force to select it , make :
		 * 
		 * -not sensible to unlock  with another selectable plugin like translate or zoom
		 * (these plugin are selectable and on lock, all other selectable widget are unlock)
		 * 
		 * -allow to force to always paint widgets
		 */
		onProjectionRegister : function(){
			//console.log('Button Plugin, on projection register-->select');
			this.select();
//				if(this.getProjection().getView() !== undefined){
//					this.getProjection().getView().getWidgetPlugin().repaintPlugin('view listener button plugin');
//				}else{
//					//wait view registering
//					this.getProjection().addProjectionListener('viewRegister',function(proj){
//						this.getProjection().getView().getWidgetPlugin().repaintPlugin('view listener button plugin');
//					},'active ');
//				}
		},
	});
})();
(function(){
	/**
	 * Object AbstractLabel()
	 * Defines Abstract Label
	 * @param {Object} config
	 * @param {String} [config.name] the label type name
	 * @param {String} [config.text] the label text
	 * @param {String} [config.textColor] the label text color
	 * @param {Number} [config.fontSize] the label text font size
	 * @param {String} [config.textAnchor] the label text anchor, start , middle, end
	 * @param {Object} [config.shader] the label fill shader
	 * @param {Object} [config.shader.percents] the label fill shader percents
	 * @param {Object} [config.shader.colors] the label fill shader colors
	 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the label outline color
	 * @param {String} [config.cornerRadius] the label outline corner radius
	 * @param {String} [config.fillColor] the label fill color
	 */
	JenScript.AbstractLabel = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.AbstractLabel,{
		
		/**
		 * Initialize Abstract  Label
		 * @param {Object} config
		 * @param {String} [config.name] the label type name
		 * @param {String} [config.text] the label text
		 * @param {String} [config.textColor] the label text color
		 * @param {String} [location] the label location
		 * @param {Number} [config.fontSize] the label text font size
		 * @param {String} [config.textAnchor] the label text anchor
		 * @param {Object} [config.shader] the label fill shader
		 * @param {Object} [config.shader.percents] the label fill shader percents array
		 * @param {Object} [config.shader.colors] the label fill shader colors array
		 * @param {Object} [config.shader.opacity] the label fill shader opacity array
		 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the label outline color
		 * @param {String} [config.cornerRadius] the label outline corner radius
		 * @param {String} [config.fillColor] the label fill color
		 */
		init : function(config){
			config = config || {};
			this.Id = (config.Id !== undefined)?config.Id:'label'+JenScript.sequenceId++;
			this.opacity =  (config.opacity !== undefined)? config.opacity : 1;
			this.name = (config.name !== undefined)? config.name:'Unamed Label';
			this.location = (config.location !== undefined)? config.location:new JenScript.Point2D(0,0);
			this.visible = true;
			
			this.text = (config.text !== undefined)? config.text:'Label';
			this.textColor = config.textColor;
			this.fontSize = (config.fontSize !== undefined)? config.fontSize : 12;
			this.textAnchor = (config.textAnchor !== undefined)? config.textAnchor : 'start';
			
			this.paintType = (config.paintType !== undefined)? config.paintType : 'Both';//Stroke //Fill //None
			this.cornerRadius = (config.cornerRadius !== undefined)? config.cornerRadius : 0;
			this.outlineWidth = (config.outlineWidth !== undefined)? config.outlineWidth : 1;
			
			this.shader = config.shader ;
			this.outlineColor = config.outlineColor;
			this.fillColor = config.fillColor;
			this.fillOpacity =  (config.fillOpacity !== undefined)? config.fillOpacity : 1;
			
			
			//this.rotate =  (config.rotate !== undefined)? config.rotate : false;
			this.rotateAngle =  (config.rotateAngle !== undefined)? config.rotateAngle : 0;
			this.tx =  (config.tx !== undefined)? config.tx : 0;
			this.ty =  (config.ty !== undefined)? config.ty : 0;
			
			this.proj;
			this.nature = (config.nature !== undefined)? config.nature : 'Device';
			/**svg elements*/
		    this.svg={};
		},
		
		equals : function(o){
			if(o === undefined) return false;
			if(o.Id === undefined) return false;
			return (o.Id === this.Id);
		},
		
		setProjection : function(proj) {
			this.proj = proj;
		},

		getProjection : function() {
			return this.proj;
		},
		
		setNature : function(nature) {
			this.nature = nature;
		},

		getNature : function() {
			return this.nature;
		},
		
		setText : function(text) {
			this.text = text;
		},

		getText : function() {
			return this.text;
		},
		
		setVisible : function(visible) {
			this.visible = visible;
		},

		isVisible : function() {
			return this.visible;
		},
		
		setX : function(x) {
			this.location.x = x;
		},
		
		setY : function(y) {
			this.location.y = y;
		},
		
		getX : function() {
			return this.location.x;
		},
		
		getY : function() {
			return this.location.y;
		},
		
		setLocation : function(location) {
			this.location = location;
		},
		
		setLocation : function(location) {
			this.location = location;
		},

		getLocation : function() {
			return this.location;
		},

		setTextColor : function(textColor) {
			this.textColor = textColor;
		},

		getTextColor : function() {
			return this.textColor;
		},
		
		setFontSize : function(fontSize) {
			this.fontSize = fontSize;
		},

		getFontSize : function() {
			return this.fontSize;
		},
		
		setTextAnchor : function(textAnchor) {
			this.textAnchor = textAnchor;
		},

		getTextAnchor : function() {
			return this.textAnchor;
		},
		
		setShader : function(shader){
			this.shader = shader;
		},
		
		getShader : function(){
			return this.shader;
		},
		
		setOutlineColor : function(outlineColor){
			this.outlineColor = outlineColor;
		},
		
		getOutlineColor : function(){
			return this.outlineColor;
		},
		
		setOutlineWidth : function(outlineWidth){
			this.outlineWidth = outlineWidth;
		},
		
		getOutlineWidth : function(){
			return this.outlineWidth;
		},
		
		setFillColor : function(fillColor){
			this.fillColor = fillColor;
		},
		
		getFillColor : function(){
			return this.fillColor;
		},
		
		setOpacity : function(opacity){
			this.opacity = opacity;
		},
		
		getOpacity : function(){
			return this.opacity;
		},
		
		
		/**
		 * paint text and envelope if all parameter are set.
		 * helper method that can be call in inherits objects.
		 * @param {Object} graphics context
		 */
		paintLabel : function(g2d){
			if(!this.isVisible()){
				g2d.deleteGraphicsElement(this.Id);
				return;
			}
			var label = new JenScript.SVGGroup().Id(this.Id).opacity(this.opacity);
			var lx,ly;
			if(this.proj !== undefined && this.nature === 'User'){
				lx = this.proj.userToPixelX(this.getLocation().x);
				ly = this.proj.userToPixelY(this.getLocation().y);
				
			}else{
				lx = this.getLocation().x;
				ly = this.getLocation().y;
			}
			var c = (this.getTextColor() !== undefined)?this.getTextColor():'black';
			var sl = new JenScript.SVGElement().name('text')
												.attr('x',lx)
												.attr('y',ly)
												.attr('font-size',this.getFontSize())
												.attr('fill',c)
												.attr('text-anchor',this.getTextAnchor())
												.attr('transform','translate('+this.tx+','+this.ty+') rotate('+this.rotateAngle+','+lx+','+ly+')')
												.textContent(this.getText());
			
			var element = sl.buildHTML();									
			label.child(element);
			g2d.deleteGraphicsElement(this.Id);
			var svgLabel = label.toSVG();
			this.svg.label = svgLabel;
			g2d.insertSVG(svgLabel);
			
			var labelBBox = svgLabel.getBBox();
			var labelCTM = svgLabel.getCTM();
			
			if(this.paintType !== 'None'){
				var svgRect = element.getBBox();
						
				var tr = new JenScript.SVGRect().origin((svgRect.x-10),(svgRect.y-2))
								.size((svgRect.width+20),(svgRect.height+4))
								.radius(this.cornerRadius,this.cornerRadius)
								.strokeNone()
								.fillNone();
						
					
					if(this.paintType === 'Fill' || this.paintType === 'Both'){
							if(this.fillColor !== undefined){
								tr.fill(this.fillColor).fillOpacity(this.fillOpacity);
							}else{
								if(this.shader !== undefined && this.shader.percents !== undefined && this.shader.colors !== undefined){
									var gradient= new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(svgRect.x,(svgRect.y-2)).to(svgRect.x, (svgRect.y+4+svgRect.height)).shade(this.getShader().percents,this.getShader().colors,this.getShader().opacity).fillOpacity(this.fillOpacity).toSVG();
									g2d.deleteGraphicsElement(this.Id+'gradient');
									g2d.definesSVG(gradient);
									tr.fillURL(this.Id+'gradient');
								}
							}
						
					}
					if(this.paintType === 'Stroke' || this.paintType === 'Both' ){
						
						if(this.getOutlineColor() !== undefined){
							tr.stroke(this.getOutlineColor()).strokeWidth(this.outlineWidth);
						}
					}
					var bgLabel = tr.attr('transform','translate('+this.tx+','+this.ty+') rotate('+this.rotateAngle+','+lx+','+ly+')').toSVG();
					element.parentNode.insertBefore(bgLabel,element);
				}			
		},
	});
	
})();
(function(){
	
	
	JenScript.ImagePlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ImagePlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.ImagePlugin,{
		
		_init : function(config){
			config=config||{};
			this.images = [];
			JenScript.Plugin.call(this, config);
		},
		
		/**
		 * on projection register add 'bound changed' projection listener that invoke repaint plugin
		 * when projection bound changed event occurs.
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'ImagePlugin projection bound changed');
		},
		
		/**
		 * add given image in this plugin
		 * @param {Object} image 
		 */
		addImage : function(image){
			this.images[this.images.length] = image;
			this.repaintPlugin();
		},
		
		/**
		 * remove all image
		 */
		removeAll : function(){
			this.images= [];
			this.repaintPlugin();
		},
		
		
		/**
		 * paint image
		 * @param {Object} graphics context 
		 * @param {String} view part name
		 */
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			
			for (var i = 0; i < this.images.length; i++) {
				
				var image = new JenScript.SVGImage().opacity(1).xlinkHref(this.images[i].url).origin(this.images[i].x,this.images[i].y);
				if(this.images[i].width !== undefined && this.images[i].height !== undefined){
					image.size(this.images[i].width,this.images[i].height);
				}
				
				g2d.insertSVG(image.toSVG());
				
				//this.labels[i].setProjection(this.getProjection());
				//this.labels[i].paint(g2d);
			}
		}
		
	});
	
	
})();
(function(){
	
	
	JenScript.DumpCoordinatePlugin = function() {
		this.dumpListeners = [];
		JenScript.Plugin.call(this, {name : "DumpCoordinatePlugin"});
	};
	JenScript.Model.inheritPrototype(JenScript.DumpCoordinatePlugin, JenScript.Plugin);

	/**
	 * add listener maped with the given action event
	 * @param actionEvent
	 * @param listener
	 */
	JenScript.DumpCoordinatePlugin.prototype.addDumpListener = function(actionEvent,listener){
		var l = {action : actionEvent,onEvent : listener};
		this.dumpListeners[this.dumpListeners.length] = l;
	};
	
	/**
	 * add listener maped with the given action event
	 * @param actionEvent
	 * @param listener
	 */
	JenScript.DumpCoordinatePlugin.prototype.fireEvent = function(actionEvent,point,deviceX,deviceY){
		for (var i = 0; i < this.dumpListeners.length; i++) {
			if(actionEvent === this.dumpListeners[i].action)
				this.dumpListeners[i].onEvent({user:point,device:new JenScript.Point2D(deviceX,deviceY)});
		}
	};
	
	
	/**
	 * assume that x,y come from device part
	 */
	JenScript.DumpCoordinatePlugin.prototype.getUserProjection = function (deviceX,deviceY){
		return this.getProjection().pixelToUser({
			x : deviceX,
			y : deviceY
		});
	};
	
	JenScript.DumpCoordinatePlugin.prototype.onClick = function(evt,part,deviceX,deviceY) {
		if(part === JenScript.ViewPart.Device){
			var userPoint = this.getUserProjection(deviceX,deviceY);
			this.fireEvent('click',userPoint,deviceX, deviceY);
		}
	};
	
	JenScript.DumpCoordinatePlugin.prototype.onMove = function(evt,part,deviceX, deviceY) {
		if(part === JenScript.ViewPart.Device){
			var userPoint = this.getUserProjection(deviceX,deviceY);
			this.fireEvent('move',userPoint,deviceX,deviceY);
		}
	};
	
	JenScript.DumpCoordinatePlugin.prototype.onPress = function(evt,part,deviceX, deviceY) {
		if(part === JenScript.ViewPart.Device){
			var userPoint = this.getUserProjection(deviceX,deviceY);
			this.fireEvent('press',userPoint,deviceX, deviceY);
		}
	};
	
	JenScript.DumpCoordinatePlugin.prototype.onRelease = function(evt,part,deviceX, deviceY) {
		if(part === JenScript.ViewPart.Device){
			var userPoint = this.getUserProjection(deviceX,deviceY);
			this.fireEvent('release',userPoint,deviceX, deviceY);
		}
	};
})();
(function(){
	JenScript.GeneralMetricsPathPlugin = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GeneralMetricsPathPlugin,JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.GeneralMetricsPathPlugin,{
		_init : function(config){
			config = config||{};
			config.name = 'JenScript.GeneralMetricsPathPlugin';
			this.generalMetricsPath = config.path;
			this.generalMetricsPath.plugin = this;
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
			},'GeneralMetricsPath projection bound changed');
		},
		
		paintPlugin : function(g2d,part) {
	        if (part != JenScript.ViewPart.Device) {
	            return;
	        }
	        this.generalMetricsPath.projection = this.getProjection();
	        
	        this.generalMetricsPath.graphicsContext = g2d;
	        this.generalMetricsPath.createPath();
	        
	        this.generalMetricsPath.svgPathElement.setAttribute('stroke','red');
	        this.generalMetricsPath.svgPathElement.setAttribute('fill','none');
	        g2d.insertSVG(this.generalMetricsPath.svgPathElement.cloneNode(true));
	        
	        var metrics = this.generalMetricsPath.getMetrics(g2d);
	        for (var i = 0; i < metrics.length; i++) {
				var m = metrics[i];
				
				
				
			}
	        
	    },

	});

	
})();