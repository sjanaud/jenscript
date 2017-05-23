// JenScript -  JavaScript HTML5/SVG Library
// version : 1.2.0
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-05-23
// All Rights reserved

(function () {
    'use strict';

   
    /*********************************** DEFAULTS ************************************/

    /*
     * The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP,
     * MAX_EXP, and the argument to toFixed, toPrecision and toExponential, beyond
     * which an exception is thrown (if ERRORS is true).
     */
    var MAX = 1E9;                                  // 0 to 1e+9

    // Limit of magnitude of exponent argument to toPower.
    var MAX_POWER = 1E6;                             // 1 to 1e+6

    // The maximum number of decimal places for operations involving division.
    var DECIMAL_PLACES = 20;                         // 0 to MAX

    /*
     * The rounding mode used when rounding to the above decimal places, and when
     * using toFixed, toPrecision and toExponential, and round (default value).
     * UP         0 Away from zero.
     * DOWN       1 Towards zero.
     * CEIL       2 Towards +Infinity.
     * FLOOR      3 Towards -Infinity.
     * HALF_UP    4 Towards nearest neighbour. If equidistant, up.
     * HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
     * HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
     * HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
     * HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
     */
    var ROUNDING_MODE = 4;                           // 0 to 8

    // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

    // The exponent value at and beneath which toString returns exponential notation.
    // Number type: -7
    var TO_EXP_NEG = -7;                            // 0 to -MAX

    // The exponent value at and above which toString returns exponential notation.
    // Number type: 21
    var TO_EXP_POS = 21;                             // 0 to MAX

    // RANGE : [MIN_EXP, MAX_EXP]

    // The minimum exponent value, beneath which underflow to zero occurs.
    // Number type: -324  (5e-324)
    var MIN_EXP = -MAX;                         // -1 to -MAX

    // The maximum exponent value, above which overflow to Infinity occurs.
    // Number type:  308  (1.7976931348623157e+308)
    var MAX_EXP = MAX;                               // 1 to MAX

    // Whether BigNumber Errors are ever thrown.
    // CHANGE parseInt to parseFloat if changing ERRORS to false.
    var ERRORS = true;                               // true or false
    var parse = parseInt;                            // parseInt or parseFloat


    var DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_';
    var outOfRange;
    var id = 0;
    var isValid = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
    var trim = String.prototype.trim || function(){return this.replace(/^\s+|\s+$/g, '');};
      

    /*
     * The exported function.
     * Create and return a new instance of a BigNumber object.
     *
     * n {number|string|BigNumber} A numeric value.
     * [b] {number} The base of n. Integer, 2 to 64 inclusive.
     */
     JenScript.BigNumber  = function(n,b) {
        var e, i, isNum, digits, valid, orig,
            x = this;

        // Enable constructor usage without new.
        if ( !(x instanceof JenScript.BigNumber) ) {
            return new JenScript.BigNumber(n,b);
        }

        // Duplicate.
        if ( n instanceof JenScript.BigNumber ) {
            id = 0;

            // e is undefined.
            if ( b !== e ) {
                n += '';
            } else {
                x['s'] = n['s'];
                x['e'] = n['e'];
                x['c'] = ( n = n['c'] ) ? n.slice() : n;
                return;
            }
        }

        // If number, check if minus zero.
        if ( typeof n != 'string' ) {
            n = ( isNum = typeof n == 'number' ||
                Object.prototype.toString.call(n) == '[object Number]' ) &&
                    n === 0 && 1 / n < 0 ? '-0' : n + '';
        }

        orig = n;
       
        if ( b === e && isValid.test(n) ) {
            // Determine sign.
            x['s'] = n.charAt(0) == '-' ? ( n = n.slice(1), -1 ) : 1;

        // Either n is not a valid BigNumber or a base has been specified.
        } else {
            // Enable exponential notation to be used with base 10 argument.
            // Ensure return value is rounded to DECIMAL_PLACES as with other bases.
            if ( b == 10 ) {

                return setMode( n, DECIMAL_PLACES, ROUNDING_MODE );
            }

            n = trim.call(n).replace( /^\+(?!-)/, '' );

            x['s'] = n.charAt(0) == '-' ? ( n = n.replace( /^-(?!-)/, '' ), -1 ) : 1;

            if ( b != null ) {

                if ( ( b == (b | 0) || !ERRORS ) &&
                  !( outOfRange = !( b >= 2 && b < 65 ) ) ) {

                    digits = '[' + DIGITS.slice( 0, b = b | 0 ) + ']+';

                    // Before non-decimal number validity test and base conversion
                    // remove the `.` from e.g. '1.', and replace e.g. '.1' with '0.1'.
                    n = n.replace( /\.$/, '' ).replace( /^\./, '0.' );

                    // Any number in exponential form will fail due to the e+/-.
                    if ( valid = new RegExp(
                      '^' + digits + '(?:\\.' + digits + ')?$', b < 37 ? 'i' : '' ).test(n) ) {

                        if ( isNum ) {

                            if ( n.replace( /^0\.0*|\./, '' ).length > 15 ) {

                                // 'new JenScript.BigNumber() number type has more than 15 significant digits: {n}'
                                ifExceptionsThrow( orig, 0 );
                            }

                            // Prevent later check for length on converted number.
                            isNum = !isNum;
                        }
                        n = convert( n, 10, b, x['s'] );

                    } else if ( n != 'Infinity' && n != 'NaN' ) {

                        // 'new JenScript.BigNumber() not a base {b} number: {n}'
                        ifExceptionsThrow( orig, 1, b );
                        n = 'NaN';
                    }
                } else {

                    // 'new JenScript.BigNumber() base not an integer: {b}'
                    // 'new JenScript.BigNumber() base out of range: {b}'
                    ifExceptionsThrow( b, 2 );

                    // Ignore base.
                    valid = isValid.test(n);
                }
            } else {
                valid = isValid.test(n);
            }

            if ( !valid ) {

                // Infinity/NaN
                x['c'] = x['e'] = null;

                // NaN
                if ( n != 'Infinity' ) {

                    // No exception on NaN.
                    if ( n != 'NaN' ) {

                        // 'new JenScript.BigNumber() not a number: {n}'
                        ifExceptionsThrow( orig, 3 );
                    }
                    x['s'] = null;
                }
                id = 0;

                return;
            }
        }

        // Decimal point?
        if ( ( e = n.indexOf('.') ) > -1 ) {
            n = n.replace( '.', '' );
        }

        // Exponential form?
        if ( ( i = n.search( /e/i ) ) > 0 ) {

            // Determine exponent.
            if ( e < 0 ) {
                e = i;
            }
            e += +n.slice( i + 1 );
            n = n.substring( 0, i );

        } else if ( e < 0 ) {

            // Integer.
            e = n.length;
        }

        // Determine leading zeros.
        for ( i = 0; n.charAt(i) == '0'; i++ ) {
        }

        b = n.length;

        // Disallow numbers with over 15 significant digits if number type.
        if ( isNum && b > 15 && n.slice(i).length > 15 ) {

            // 'new JenScript.BigNumber() number type has more than 15 significant digits: {n}'
            ifExceptionsThrow( orig, 0 );
        }
        id = 0;

        // Overflow?
        if ( ( e -= i + 1 ) > MAX_EXP ) {

            // Infinity.
            x['c'] = x['e'] = null;

        // Zero or underflow?
        } else if ( i == b || e < MIN_EXP ) {

            // Zero.
            x['c'] = [ x['e'] = 0 ];
        } else {

            // Determine trailing zeros.
            for ( ; n.charAt(--b) == '0'; ) {
            }

            x['e'] = e;
            x['c'] = [];

            // Convert string to array of digits (without leading and trailing zeros).
            for ( e = 0; i <= b; x['c'][e++] = +n.charAt(i++) ) {
            }
        }
    };


    // CONSTRUCTOR PROPERTIES/METHODS

   
    JenScript.BigNumber['ROUND_UP'] = 0;
    JenScript.BigNumber['ROUND_DOWN'] = 1;
    JenScript.BigNumber['ROUND_CEIL'] = 2; 
    JenScript.BigNumber['ROUND_FLOOR'] = 3;
    JenScript.BigNumber['ROUND_HALF_UP'] = 4;
    JenScript.BigNumber['ROUND_HALF_DOWN'] = 5;
    JenScript.BigNumber['ROUND_HALF_EVEN'] = 6;
    JenScript.BigNumber['ROUND_HALF_CEIL'] = 7;
    JenScript.BigNumber['ROUND_HALF_FLOOR'] = 8;


    /*
     * Configure infrequently-changing library-wide settings.
     *
     * Accept an object or an argument list, with one or many of the following
     * properties or parameters respectively:
     * [ DECIMAL_PLACES [, ROUNDING_MODE [, EXPONENTIAL_AT [, RANGE [, ERRORS ]]]]]
     *
     * E.g.
     * BigNumber.config(20, 4) is equivalent to
     * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
     * Ignore properties/parameters set to null or undefined.
     *
     * Return an object with the properties current values.
     */
    JenScript.BigNumber['config'] = function () {
        var v, p,
            i = 0,
            r = {},
            a = arguments,
            o = a[0],
            c = 'config',
            inRange = function ( n, lo, hi ) {
              return !( ( outOfRange = n < lo || n > hi ) ||
                parse(n) != n && n !== 0 );
            },
            has = o && typeof o == 'object'
              ? function () {if ( o.hasOwnProperty(p) ) return ( v = o[p] ) != null}
              : function () {if ( a.length > i ) return ( v = a[i++] ) != null};

        // [DECIMAL_PLACES] {number} Integer, 0 to MAX inclusive.
        if ( has( p = 'DECIMAL_PLACES' ) ) {

            if ( inRange( v, 0, MAX ) ) {
                DECIMAL_PLACES = v | 0;
            } else {

                // 'config() DECIMAL_PLACES not an integer: {v}'
                // 'config() DECIMAL_PLACES out of range: {v}'
                ifExceptionsThrow( v, p, c );
            }
        }
        r[p] = DECIMAL_PLACES;

        // [ROUNDING_MODE] {number} Integer, 0 to 8 inclusive.
        if ( has( p = 'ROUNDING_MODE' ) ) {

            if ( inRange( v, 0, 8 ) ) {
                ROUNDING_MODE = v | 0;
            } else {

                // 'config() ROUNDING_MODE not an integer: {v}'
                // 'config() ROUNDING_MODE out of range: {v}'
                ifExceptionsThrow( v, p, c );
            }
        }
        r[p] = ROUNDING_MODE;

        /*
         * [EXPONENTIAL_AT] {number|number[]} Integer, -MAX to MAX inclusive or
         * [ integer -MAX to 0 inclusive, 0 to MAX inclusive ].
         */
        if ( has( p = 'EXPONENTIAL_AT' ) ) {

            if ( inRange( v, -MAX, MAX ) ) {
                TO_EXP_NEG = -( TO_EXP_POS = ~~( v < 0 ? -v : +v ) );
            } else if ( !outOfRange && v && inRange( v[0], -MAX, 0 ) &&
              inRange( v[1], 0, MAX ) ) {
                TO_EXP_NEG = ~~v[0];
                TO_EXP_POS = ~~v[1];
            } else {

                // 'config() EXPONENTIAL_AT not an integer or not [integer, integer]: {v}'
                // 'config() EXPONENTIAL_AT out of range or not [negative, positive: {v}'
                ifExceptionsThrow( v, p, c, 1 );
            }
        }
        r[p] = [ TO_EXP_NEG, TO_EXP_POS ];

        /*
         * [RANGE][ {number|number[]} Non-zero integer, -MAX to MAX inclusive or
         * [ integer -MAX to -1 inclusive, integer 1 to MAX inclusive ].
         */
        if ( has( p = 'RANGE' ) ) {

            if ( inRange( v, -MAX, MAX ) && ~~v ) {
                MIN_EXP = -( MAX_EXP = ~~( v < 0 ? -v : +v ) );
            } else if ( !outOfRange && v && inRange( v[0], -MAX, -1 ) &&
              inRange( v[1], 1, MAX ) ) {
                MIN_EXP = ~~v[0], MAX_EXP = ~~v[1];
            } else {

                // 'config() RANGE not a non-zero integer or not [integer, integer]: {v}'
                // 'config() RANGE out of range or not [negative, positive: {v}'
                ifExceptionsThrow( v, p, c, 1, 1 );
            }
        }
        r[p] = [ MIN_EXP, MAX_EXP ];

        // [ERRORS] {boolean|number} true, false, 1 or 0.
        if ( has( p = 'ERRORS' ) ) {

            if ( v === !!v || v === 1 || v === 0 ) {
                parse = ( outOfRange = id = 0, ERRORS = !!v )
                  ? parseInt
                  : parseFloat;
            } else {

                // 'config() ERRORS not a boolean or binary digit: {v}'
                ifExceptionsThrow( v, p, c, 0, 0, 1 );
            }
        }
        r[p] = ERRORS;

        return r;
    };


    // Assemble error messages. Throw BigNumber Errors.
    function ifExceptionsThrow( arg, argName, methodName, isArray, isRange, isErrors) {
        if ( ERRORS ) {
            var error,
                method = ['new JenScript.BigNumber', 'compareTo', 'divide', 'equals', 'gt', 'gte', 'lt',
                     'lte', 'substract', 'modulo', 'add', 'multiply', 'toFraction'
                    ][ id ? id < 0 ? -id : id : 1 / id < 0 ? 1 : 0 ] + '()',
                message = outOfRange ? ' out of range' : ' not a' +
                  ( isRange ? ' non-zero' : 'n' ) + ' integer';

            message = ( [
                method + ' number type has more than 15 significant digits',
                method + ' not a base ' + methodName + ' number',
                method + ' base' + message,
                method + ' not a number' ][argName] ||
                methodName + '() ' + argName + ( isErrors
                    ? ' not a boolean or binary digit'
                    : message + ( isArray
                      ? ' or not [' + ( outOfRange
                        ? ' negative, positive'
                        : ' integer, integer' ) + ' ]'
                      : '' ) ) ) + ': ' + arg;

            outOfRange = id = 0;
            error = new Error(message);
            error['name'] = 'JenScript.BigNumber Error';

            throw error;
        }
    }

    
    /*
     * Convert a numeric string of baseIn to a numeric string of baseOut.
     */
    function convert( nStr, baseOut, baseIn, sign ) {
        var e, dvs, dvd, nArr, fracArr, fracBN;

        // Convert string of base bIn to an array of numbers of baseOut.
        // Eg. strToArr('255', 10) where baseOut is 16, returns [15, 15].
        // Eg. strToArr('ff', 16)  where baseOut is 10, returns [2, 5, 5].
        function strToArr( str, bIn ) {
            var j,
                i = 0,
                strL = str.length,
                arrL,
                arr = [0];

            for ( bIn = bIn || baseIn; i < strL; i++ ) {

                for ( arrL = arr.length, j = 0; j < arrL; arr[j] *= bIn, j++ ) {
                }

                for ( arr[0] += DIGITS.indexOf( str.charAt(i) ), j = 0;
                      j < arr.length;
                      j++ ) {

                    if ( arr[j] > baseOut - 1 ) {

                        if ( arr[j + 1] == null ) {
                            arr[j + 1] = 0;
                        }
                        arr[j + 1] += arr[j] / baseOut ^ 0;
                        arr[j] %= baseOut;
                    }
                }
            }

            return arr.reverse();
        }

        // Convert array to string.
        // E.g. arrToStr( [9, 10, 11] ) becomes '9ab' (in bases above 11).
        function arrToStr( arr ) {
            var i = 0,
                arrL = arr.length,
                str = '';

            for ( ; i < arrL; str += DIGITS.charAt( arr[i++] ) ) {
            }

            return str;
        }

        if ( baseIn < 37 ) {
            nStr = nStr.toLowerCase();
        }

        /*
         * If non-integer convert integer part and fraction part separately.
         * Convert the fraction part as if it is an integer than use division to
         * reduce it down again to a value less than one.
         */
        if ( ( e = nStr.indexOf( '.' ) ) > -1 ) {

            /*
             * Calculate the power to which to raise the base to get the number
             * to divide the fraction part by after it has been converted as an
             * integer to the required base.
             */
            e = nStr.length - e - 1;

            // Use toFixed to avoid possible exponential notation.
            dvs = strToArr( new JenScript.BigNumber(baseIn)['pow'](e)['toF'](), 10 );

            nArr = nStr.split('.');

            // Convert the base of the fraction part (as integer).
            dvd = strToArr( nArr[1] );

            // Convert the base of the integer part.
            nArr = strToArr( nArr[0] );

            // Result will be a BigNumber with a value less than 1.
            fracBN = divideAndRound( dvd, dvs, dvd.length - dvs.length, sign, baseOut,
              // Is least significant digit of integer part an odd number?
              nArr[nArr.length - 1] & 1 );

            fracArr = fracBN['c'];

            // e can be <= 0  ( if e == 0, fracArr is [0] or [1] ).
            if ( e = fracBN['e'] ) {

                // Append zeros according to the exponent of the result.
                for ( ; ++e; fracArr.unshift(0) ) {
                }

                // Append the fraction part to the converted integer part.
                nStr = arrToStr(nArr) + '.' + arrToStr(fracArr);

            // fracArr is [1].
            // Fraction digits rounded up, so increment last digit of integer part.
            } else if ( fracArr[0] ) {

                if ( nArr[ e = nArr.length - 1 ] < baseOut - 1 ) {
                    ++nArr[e];
                    nStr = arrToStr(nArr);
                } else {
                    nStr = new JenScript.BigNumber( arrToStr(nArr),
                      baseOut ).add(new JenScript.BigNumber(1)).toString(baseOut);
                }

            // fracArr is [0]. No fraction digits.
            } else {
                nStr = arrToStr(nArr);
            }
        } else {

            // Simple integer. Convert base.
            nStr = arrToStr( strToArr(nStr) );
        }

        return nStr;
    }


    // Perform division in the specified base. Called by div and convert.
    function divideAndRound( dvd, dvs, exp, s, base, isOdd ) {
        var dvsL, dvsT, next, cmp, remI,
            dvsZ = dvs.slice(),
            dvdI = dvsL = dvs.length,
            dvdL = dvd.length,
            rem = dvd.slice( 0, dvsL ),
            remL = rem.length,
            quo = new JenScript.BigNumber(1),
            qc = quo['c'] = [],
            qi = 0,
            dig = DECIMAL_PLACES + ( quo['e'] = exp ) + 1;

        quo['s'] = s;
        s = dig < 0 ? 0 : dig;

        // Add zeros to make remainder as long as divisor.
        for ( ; remL++ < dvsL; rem.push(0) ) {
        }

        // Create version of divisor with leading zero.
        dvsZ.unshift(0);

        do {

            // 'next' is how many times the divisor goes into the current remainder.
            for ( next = 0; next < base; next++ ) {

                // Compare divisor and remainder.
                if ( dvsL != ( remL = rem.length ) ) {
                    cmp = dvsL > remL ? 1 : -1;
                } else {
                    for ( remI = -1, cmp = 0; ++remI < dvsL; ) {

                        if ( dvs[remI] != rem[remI] ) {
                            cmp = dvs[remI] > rem[remI] ? 1 : -1;
                            break;
                        }
                    }
                }

                // Subtract divisor from remainder (if divisor < remainder).
                if ( cmp < 0 ) {

                    // Remainder cannot be more than one digit longer than divisor.
                    // Equalise lengths using divisor with extra leading zero?
                    for ( dvsT = remL == dvsL ? dvs : dvsZ; remL; ) {

                        if ( rem[--remL] < dvsT[remL] ) {

                            for ( remI = remL;
                              remI && !rem[--remI];
                                rem[remI] = base - 1 ) {
                            }
                            --rem[remI];
                            rem[remL] += base;
                        }
                        rem[remL] -= dvsT[remL];
                    }
                    for ( ; !rem[0]; rem.shift() ) {
                    }
                } else {
                    break;
                }
            }

            // Add the 'next' digit to the result array.
            qc[qi++] = cmp ? next : ++next;

            // Update the remainder.
            rem[0] && cmp
              ? ( rem[remL] = dvd[dvdI] || 0 )
              : ( rem = [ dvd[dvdI] ] );

        } while ( ( dvdI++ < dvdL || rem[0] != null ) && s-- );

        // Leading zero? Do not remove if result is simply zero (qi == 1).
        if ( !qc[0] && qi != 1 ) {

            // There can't be more than one zero.
            --quo['e'];
            qc.shift();
        }

        // Round?
        if ( qi > dig ) {
            rnd( quo, DECIMAL_PLACES, base, isOdd, rem[0] != null );
        }

        // Overflow?
        if ( quo['e'] > MAX_EXP ) {

            // Infinity.
            quo['c'] = quo['e'] = null;

        // Underflow?
        } else if ( quo['e'] < MIN_EXP ) {

            // Zero.
            quo['c'] = [quo['e'] = 0];
        }

        return quo;
    }


    /*
     * Return a string representing the value of BigNumber n in normal or
     * exponential notation rounded to the specified decimal places or
     * significant digits.
     * Called by toString, toExponential (exp 1), toFixed, and toPrecision (exp 2).
     * d is the index (with the value in normal notation) of the digit that may be
     * rounded up.
     */
    function format( n, d, exp ) {

        // Initially, i is the number of decimal places required.
        var i = d - (n = new JenScript.BigNumber(n))['e'],
            c = n['c'];

        // +-Infinity or NaN?
        if ( !c ) {
            return n.toString();
        }

        // Round?
        if ( c.length > ++d ) {
            rnd( n, i, 10 );
        }

        // Recalculate d if toFixed as n['e'] may have changed if value rounded up.
        i = c[0] == 0 ? i + 1 : exp ? d : n['e'] + i + 1;

        // Append zeros?
        for ( ; c.length < i; c.push(0) ) {
        }
        i = n['e'];

        /*
         * toPrecision returns exponential notation if the number of significant
         * digits specified is less than the number of digits necessary to
         * represent the integer part of the value in normal notation.
         */
        return exp == 1 || exp == 2 && ( --d < i || i <= TO_EXP_NEG )

          // Exponential notation.
          ? ( n['s'] < 0 && c[0] ? '-' : '' ) + ( c.length > 1
            ? ( c.splice( 1, 0, '.' ), c.join('') )
            : c[0] ) + ( i < 0 ? 'e' : 'e+' ) + i

          // Normal notation.
          : n.toString();
    }


    // Round if necessary.
    // Called by divideAndRound, format, setMode and sqrt.
    function rnd( x, dp, base, isOdd, r ) {
        var xc = x['c'],
            isNeg = x['s'] < 0,
            half = base / 2,
            i = x['e'] + dp + 1,

            // 'next' is the digit after the digit that may be rounded up.
            next = xc[i],

            /*
             * 'more' is whether there are digits after 'next'.
             * E.g.
             * 0.005 (e = -3) to be rounded to 0 decimal places (dp = 0) gives i = -2
             * The 'next' digit is zero, and there ARE 'more' digits after it.
             * 0.5 (e = -1) dp = 0 gives i = 0
             * The 'next' digit is 5 and there are no 'more' digits after it.
             */
            more = r || i < 0 || xc[i + 1] != null;

        r = ROUNDING_MODE < 4
          ? ( next != null || more ) &&
            ( ROUNDING_MODE == 0 ||
               ROUNDING_MODE == 2 && !isNeg ||
                 ROUNDING_MODE == 3 && isNeg )
          : next > half || next == half &&
            ( ROUNDING_MODE == 4 || more ||

              /*
               * isOdd is used in base conversion and refers to the least significant
               * digit of the integer part of the value to be converted. The fraction
               * part is rounded by this method separately from the integer part.
               */
              ROUNDING_MODE == 6 && ( xc[i - 1] & 1 || !dp && isOdd ) ||
                ROUNDING_MODE == 7 && !isNeg ||
                  ROUNDING_MODE == 8 && isNeg );

        if ( i < 1 || !xc[0] ) {
            xc.length = 0;
            xc.push(0);

            if ( r ) {

                // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                xc[0] = 1;
                x['e'] = -dp;
            } else {

                // Zero.
                x['e'] = 0;
            }

            return x;
        }

        // Remove any digits after the required decimal places.
        xc.length = i--;

        // Round up?
        if ( r ) {

            // Rounding up may mean the previous digit has to be rounded up and so on.
            for ( --base; ++xc[i] > base; ) {
                xc[i] = 0;

                if ( !i-- ) {
                    ++x['e'];
                    xc.unshift(1);
                }
            }
        }

        // Remove trailing zeros.
        for ( i = xc.length; !xc[--i]; xc.pop() ) {
        }

        return x;
    }


    // Round after setting the appropriate rounding mode.
    // Handles ceil, floor and round.
    function setMode( x, dp, rm ) {
        var r = ROUNDING_MODE;

        ROUNDING_MODE = rm;
        x = new JenScript.BigNumber(x);
        x['c'] && rnd( x, dp, 10 );
        ROUNDING_MODE = r;

        return x;
    }


    // PROTOTYPE/INSTANCE METHODS


    /*
     * Return a new JenScript.BigNumber whose value is the absolute value of this BigNumber.
     */
    //P['abs'] = P['absoluteValue'] = function () {
    JenScript.BigNumber.prototype.abs = function () {
        var x = new JenScript.BigNumber(this);

        if ( x['s'] < 0 ) {
            x['s'] = 1;
        }

        return x;
    };


    /*
     * Return a new JenScript.BigNumber whose value is the value of this BigNumber
     * rounded to a whole number in the direction of Infinity.
     */
    //P['ceil'] = function () {
    JenScript.BigNumber.prototype.ceil = function () {
        return setMode( this, 0, 2 );
    };


    /*
     * Return
     * 1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
     * -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
     * 0 if they have the same value,
     * or null if the value of either is NaN.
     */
    JenScript.BigNumber.prototype.compareTo = function ( y, b ) {
        var a,
            x = this,
            xc = x['c'],
            yc = ( id = -id, y = new JenScript.BigNumber( y, b ) )['c'],
            i = x['s'],
            j = y['s'],
            k = x['e'],
            l = y['e'];

        // Either NaN?
        if ( !i || !j ) {
            return null;
        }

        a = xc && !xc[0], b = yc && !yc[0];

        // Either zero?
        if ( a || b ) {
            return a ? b ? 0 : -j : i;
        }

        // Signs differ?
        if ( i != j ) {
            return i;
        }

        // Either Infinity?
        if ( a = i < 0, b = k == l, !xc || !yc ) {
            return b ? 0 : !xc ^ a ? 1 : -1;
        }

        // Compare exponents.
        if ( !b ) {
            return k > l ^ a ? 1 : -1;
        }

        // Compare digit by digit.
        for ( i = -1,
              j = ( k = xc.length ) < ( l = yc.length ) ? k : l;
              ++i < j; ) {

            if ( xc[i] != yc[i] ) {
                return xc[i] > yc[i] ^ a ? 1 : -1;
            }
        }
        // Compare lengths.
        return k == l ? 0 : k > l ^ a ? 1 : -1;
    };


    /*
     *  n / 0 = I
     *  n / N = N
     *  n / I = 0
     *  0 / n = 0
     *  0 / 0 = N
     *  0 / N = N
     *  0 / I = 0
     *  N / n = N
     *  N / 0 = N
     *  N / N = N
     *  N / I = N
     *  I / n = I
     *  I / 0 = I
     *  I / N = N
     *  I / I = N
     *
     * Return a new JenScript.BigNumber whose value is the value of this BigNumber
     * divided by the value of BigNumber(y, b), rounded according to
     * DECIMAL_PLACES and ROUNDING_MODE.
     */
    JenScript.BigNumber.prototype.divide = function ( y, b ) {
        var xc = this['c'],
            xe = this['e'],
            xs = this['s'],
            yc = ( id = 2, y = new JenScript.BigNumber( y, b ) )['c'],
            ye = y['e'],
            ys = y['s'],
            s = xs == ys ? 1 : -1;

        // Either NaN/Infinity/0?
        return !xe && ( !xc || !xc[0] ) || !ye && ( !yc || !yc[0] )

          // Either NaN?
          ? new JenScript.BigNumber( !xs || !ys ||

            // Both 0 or both Infinity?
            ( xc ? yc && xc[0] == yc[0] : !yc )

              // Return NaN.
              ? NaN

              // x is 0 or y is Infinity?
              : xc && xc[0] == 0 || !yc

                // Return +-0.
                ? s * 0

                // y is 0. Return +-Infinity.
                : s / 0 )

          : divideAndRound( xc, yc, xe - ye, s, 10 );
    };


    /*
     * Return true if the value of this BigNumber is equal to the value of
     * BigNumber(n, b), otherwise returns false.
     */
    //P['equals'] = P['eq'] = function ( n, b ) {
    JenScript.BigNumber.prototype.equals = function ( n, b ){
        id = 3;
        return this.compareTo( n, b ) === 0;
    };


    /*
     * Return a new JenScript.BigNumber whose value is the value of this BigNumber
     * rounded to a whole number in the direction of -Infinity.
     */
    //P['floor'] = function () {
    JenScript.BigNumber.prototype.floor = function () {
        return setMode( this, 0, 3 );
    };


    /*
     * Return true if the value of this BigNumber is greater than the value of
     * BigNumber(n, b), otherwise returns false.
     */
   // P['greaterThan'] = P['gt'] = function ( n, b ) {
    JenScript.BigNumber.prototype.greaterThan = function ( n, b ) {
        id = 4;
        return this.compareTo( n, b ) > 0;
    };


    /*
     * Return true if the value of this BigNumber is greater than or equal to
     * the value of BigNumber(n, b), otherwise returns false.
     */
    //P['greaterThanOrEqualTo'] = P['gte'] = function ( n, b ) {
    JenScript.BigNumber.prototype.greaterThanOrEqualTo = function ( n, b ) {
        id = 5;
        return ( b = this.compareTo( n, b ) ) == 1 || b === 0;
    };


    /*
     * Return true if the value of this BigNumber is a finite number, otherwise
     * returns false.
     */
   // P['isFinite'] = P['isF'] = function () {
    JenScript.BigNumber.prototype.isFinite = function () {
        return !!this['c'];
    };


    /*
     * Return true if the value of this BigNumber is NaN, otherwise returns
     * false.
     */
    //P['isNaN'] = function () {
    JenScript.BigNumber.prototype.isNaN = function () {
        return !this['s'];
    };


    /*
     * Return true if the value of this BigNumber is negative, otherwise
     * returns false.
     */
    //P['isNegative'] = P['isNeg'] = function () {
    JenScript.BigNumber.prototype.isNegative = function () {
        return this['s'] < 0;
    };


    /*
     * Return true if the value of this BigNumber is 0 or -0, otherwise returns
     * false.
     */
    //P['isZero'] = P['isZ'] = function () {
    JenScript.BigNumber.prototype.isZero = function () {
        return !!this['c'] && this['c'][0] == 0;
    };


    /*
     * Return true if the value of this BigNumber is less than the value of
     * BigNumber(n, b), otherwise returns false.
     */
    //P['lessThan'] = P['lt'] = function ( n, b ) {
    JenScript.BigNumber.prototype.lessThan = function ( n, b ) {
        id = 6;
        return this.compareTo( n, b ) < 0;
    };


    /*
     * Return true if the value of this BigNumber is less than or equal to the
     * value of BigNumber(n, b), otherwise returns false.
     */
    //P['lessThanOrEqualTo'] = P['lte'] = function ( n, b ) {
    JenScript.BigNumber.prototype.lessThanOrEqualTo = function ( n, b ) {
        id = 7;
        return ( b = this.compareTo( n, b ) ) == -1 || b === 0;
    };


    /*
     *  n - 0 = n
     *  n - N = N
     *  n - I = -I
     *  0 - n = -n
     *  0 - 0 = 0
     *  0 - N = N
     *  0 - I = -I
     *  N - n = N
     *  N - 0 = N
     *  N - N = N
     *  N - I = N
     *  I - n = I
     *  I - 0 = I
     *  I - N = N
     *  I - I = N
     *
     * Return a new JenScript.BigNumber whose value is the value of this BigNumber minus
     * the value of BigNumber(y, b).
     */
    JenScript.BigNumber.prototype.subtract = function ( y, b ) {
        var d, i, j, xLTy,
            x = this,
            a = x['s'];

        b = ( id = 8, y = new JenScript.BigNumber( y, b ) )['s'];

        // Either NaN?
        if ( !a || !b ) {
            return new JenScript.BigNumber(NaN);
        }

        // Signs differ?
        if ( a != b ) {
            return y['s'] = -b, x.add(y);
        }

        var xc = x['c'],
            xe = x['e'],
            yc = y['c'],
            ye = y['e'];

        if ( !xe || !ye ) {

            // Either Infinity?
            if ( !xc || !yc ) {
                return xc ? ( y['s'] = -b, y ) : new JenScript.BigNumber( yc ? x : NaN );
            }

            // Either zero?
            if ( !xc[0] || !yc[0] ) {

                // y is non-zero?
                return yc[0]
                  ? ( y['s'] = -b, y )

                  // x is non-zero?
                  : new JenScript.BigNumber( xc[0]
                    ? x

                    // Both are zero.
                    // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
                    : ROUNDING_MODE == 3 ? -0 : 0 );
            }
        }

        // Determine which is the bigger number.
        // Prepend zeros to equalise exponents.
        if ( xc = xc.slice(), a = xe - ye ) {
            d = ( xLTy = a < 0 ) ? ( a = -a, xc ) : ( ye = xe, yc );

            for ( d.reverse(), b = a; b--; d.push(0) ) {
            }
            d.reverse();
        } else {

            // Exponents equal. Check digit by digit.
            j = ( ( xLTy = xc.length < yc.length ) ? xc : yc ).length;

            for ( a = b = 0; b < j; b++ ) {

                if ( xc[b] != yc[b] ) {
                    xLTy = xc[b] < yc[b];
                    break;
                }
            }
        }

        // x < y? Point xc to the array of the bigger number.
        if ( xLTy ) {
            d = xc, xc = yc, yc = d;
            y['s'] = -y['s'];
        }

        /*
         * Append zeros to xc if shorter. No need to add zeros to yc if shorter
         * as subtraction only needs to start at yc.length.
         */
        if ( ( b = -( ( j = xc.length ) - yc.length ) ) > 0 ) {

            for ( ; b--; xc[j++] = 0 ) {
            }
        }

        // Subtract yc from xc.
        for ( b = yc.length; b > a; ){

            if ( xc[--b] < yc[b] ) {

                for ( i = b; i && !xc[--i]; xc[i] = 9 ) {
                }
                --xc[i];
                xc[b] += 10;
            }
            xc[b] -= yc[b];
        }

        // Remove trailing zeros.
        for ( ; xc[--j] == 0; xc.pop() ) {
        }

        // Remove leading zeros and adjust exponent accordingly.
        for ( ; xc[0] == 0; xc.shift(), --ye ) {
        }

        /*
         * No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
         * when neither x or y are Infinity.
         */

        // Underflow?
        if ( ye < MIN_EXP || !xc[0] ) {

            /*
             * Following IEEE 754 (2008) 6.3,
             * n - n = +0  but  n - n = -0 when rounding towards -Infinity.
             */
            if ( !xc[0] ) {
                y['s'] = ROUNDING_MODE == 3 ? -1 : 1;
            }

            // Result is zero.
            xc = [ye = 0];
        }

        return y['c'] = xc, y['e'] = ye, y;
    };


    /*
     *   n % 0 =  N
     *   n % N =  N
     *   0 % n =  0
     *  -0 % n = -0
     *   0 % 0 =  N
     *   0 % N =  N
     *   N % n =  N
     *   N % 0 =  N
     *   N % N =  N
     *
     * Return a new JenScript.BigNumber whose value is the value of this BigNumber modulo
     * the value of BigNumber(y, b).
     */
    JenScript.BigNumber.prototype.modulo = function ( y, b ) {
        var x = this,
            xc = x['c'],
            yc = ( id = 9, y = new JenScript.BigNumber( y, b ) )['c'],
            i = x['s'],
            j = y['s'];

        // Is x or y NaN, or y zero?
        b = !i || !j || yc && !yc[0];

        if ( b || xc && !xc[0] ) {
            return new JenScript.BigNumber( b ? NaN : x );
        }

        x['s'] = y['s'] = 1;
        b = y.compareTo(x) == 1;
        x['s'] = i, y['s'] = j;

        return b
          ? new JenScript.BigNumber(x)
          : ( i = DECIMAL_PLACES, j = ROUNDING_MODE,
            DECIMAL_PLACES = 0, ROUNDING_MODE = 1,
              x = x.divide(y),
                DECIMAL_PLACES = i, ROUNDING_MODE = j,
                  this.subtract( x.multiply(y) ) );
    };


    /*
     * Return a new JenScript.BigNumber whose value is the value of this BigNumber
     * negated, i.e. multiplied by -1.
     */
    JenScript.BigNumber.prototype.negated = function () {
        var x = new JenScript.BigNumber(this);

        return x['s'] = -x['s'] || null, x;
    };


    /*
     *  n + 0 = n
     *  n + N = N
     *  n + I = I
     *  0 + n = n
     *  0 + 0 = 0
     *  0 + N = N
     *  0 + I = I
     *  N + n = N
     *  N + 0 = N
     *  N + N = N
     *  N + I = N
     *  I + n = I
     *  I + 0 = I
     *  I + N = N
     *  I + I = I
     *
     * Return a new JenScript.BigNumber whose value is the value of this BigNumber plus
     * the value of BigNumber(y, b).
     */
    JenScript.BigNumber.prototype.add = function ( y, b ) {
        var d,
            x = this,
            a = x['s'];

        b = ( id = 10, y = new JenScript.BigNumber( y, b ) )['s'];

        // Either NaN?
        if ( !a || !b ) {
            return new JenScript.BigNumber(NaN);
        }

        // Signs differ?
        if ( a != b ) {
            return y['s'] = -b, x.subtract(y);
        }

        var xe = x['e'],
            xc = x['c'],
            ye = y['e'],
            yc = y['c'];

        if ( !xe || !ye ) {

            // Either Infinity?
            if ( !xc || !yc ) {

                // Return +-Infinity.
                return new JenScript.BigNumber( a / 0 );
            }

            // Either zero?
            if ( !xc[0] || !yc[0] ) {

                // y is non-zero?
                return yc[0]
                  ? y

                  // x is non-zero?
                  : new JenScript.BigNumber( xc[0]
                    ? x

                    // Both are zero. Return zero.
                    : a * 0 );
            }
        }

        // Prepend zeros to equalise exponents.
        // Note: Faster to use reverse then do unshifts.
        if ( xc = xc.slice(), a = xe - ye ) {
            d = a > 0 ? ( ye = xe, yc ) : ( a = -a, xc );

            for ( d.reverse(); a--; d.push(0) ) {
            }
            d.reverse();
        }

        // Point xc to the longer array.
        if ( xc.length - yc.length < 0 ) {
            d = yc, yc = xc, xc = d;
        }

        /*
         * Only start adding at yc.length - 1 as the
         * further digits of xc can be left as they are.
         */
        for ( a = yc.length, b = 0; a;
             b = ( xc[--a] = xc[a] + yc[a] + b ) / 10 ^ 0, xc[a] %= 10 ) {
        }

        // No need to check for zero, as +x + +y != 0 && -x + -y != 0

        if ( b ) {
            xc.unshift(b);

            // Overflow? (MAX_EXP + 1 possible)
            if ( ++ye > MAX_EXP ) {

                // Infinity.
                xc = ye = null;
            }
        }

         // Remove trailing zeros.
        for ( a = xc.length; xc[--a] == 0; xc.pop() ) {
        }

        return y['c'] = xc, y['e'] = ye, y;
    };


    /*
     * Return a BigNumber whose value is the value of this BigNumber raised to
     * the power e. If e is negative round according to DECIMAL_PLACES and
     * ROUNDING_MODE.
     *
     * e {number} Integer, -MAX_POWER to MAX_POWER inclusive.
     */
    JenScript.BigNumber.prototype.toPower = function (e) {

        // e to integer, avoiding NaN or Infinity becoming 0.
        var i = e * 0 == 0 ? e | 0 : e,
            x = new JenScript.BigNumber(this),
            y = new JenScript.BigNumber(1);

        // Use Math.pow?
        // Pass +-Infinity for out of range exponents.
        if ( ( ( ( outOfRange = e < -MAX_POWER || e > MAX_POWER ) &&
          (i = e * 1 / 0) ) ||

             /*
              * Any exponent that fails the parse becomes NaN.
              *
              * Include 'e !== 0' because on Opera -0 == parseFloat(-0) is false,
              * despite -0 === parseFloat(-0) && -0 == parseFloat('-0') is true.
              */
             parse(e) != e && e !== 0 && !(i = NaN) ) &&

              // 'pow() exponent not an integer: {e}'
              // 'pow() exponent out of range: {e}'
              !ifExceptionsThrow( e, 'exponent', 'pow' ) ||

                // Pass zero to Math.pow, as any value to the power zero is 1.
                !i ) {

            // i is +-Infinity, NaN or 0.
            return new JenScript.BigNumber( Math.pow( x.toString(), i ) );
        }

        for ( i = i < 0 ? -i : i; ; ) {

            if ( i & 1 ) {
                y = y.multiply(x);
            }
            i >>= 1;

            if ( !i ) {
                break;
            }
            x = x.multiply(x);
        }

        return e < 0 ? (new JenScript.BigNumber(1)).divide(y) : y;
    };


    /*
     * Return a new JenScript.BigNumber whose value is the value of this BigNumber
     * rounded to a maximum of dp decimal places using rounding mode rm, or to
     * 0 and ROUNDING_MODE respectively if omitted.
     *
     * [dp] {number} Integer, 0 to MAX inclusive.
     * [rm] {number} Integer, 0 to 8 inclusive.
     */
    JenScript.BigNumber.prototype.round = function (dp,rm) {

        dp = dp == null || ( ( ( outOfRange = dp < 0 || dp > MAX ) ||
          parse(dp) != dp ) &&

            // 'round() decimal places out of range: {dp}'
            // 'round() decimal places not an integer: {dp}'
            !ifExceptionsThrow( dp, 'decimal places', 'round' ) )
              ? 0
              : dp | 0;

        rm = rm == null || ( ( ( outOfRange = rm < 0 || rm > 8 ) ||

          // Include '&& rm !== 0' because with Opera -0 == parseFloat(-0) is false.
          parse(rm) != rm && rm !== 0 ) &&

            // 'round() mode not an integer: {rm}'
            // 'round() mode out of range: {rm}'
            !ifExceptionsThrow( rm, 'mode', 'round' ) )
              ? ROUNDING_MODE
              : rm | 0;

        return setMode( this, dp, rm );
    };


    /*
     *  sqrt(-n) =  N
     *  sqrt( N) =  N
     *  sqrt(-I) =  N
     *  sqrt( I) =  I
     *  sqrt( 0) =  0
     *  sqrt(-0) = -0
     *
     * Return a new JenScript.BigNumber whose value is the square root of the value of
     * this BigNumber, rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    JenScript.BigNumber.prototype.squareRoot = function () {
        var n, r, re, t,
            x = this,
            c = x['c'],
            s = x['s'],
            e = x['e'],
            dp = DECIMAL_PLACES,
            rm = ROUNDING_MODE,
            half = new JenScript.BigNumber('0.5');

        // Negative/NaN/Infinity/zero?
        if ( s !== 1 || !c || !c[0] ) {

            return new JenScript.BigNumber( !s || s < 0 && ( !c || c[0] )
              ? NaN
              : c ? x : 1 / 0 );
        }

        // Initial estimate.
        s = Math.sqrt( x.toString() );
        ROUNDING_MODE = 1;

        /*
          Math.sqrt underflow/overflow?
          Pass x to Math.sqrt as integer, then adjust the exponent of the result.
         */
        if ( s == 0 || s == 1 / 0 ) {
            n = c.join('');

            if ( !( n.length + e & 1 ) ) {
                n += '0';
            }
            r = new JenScript.BigNumber( Math.sqrt(n) + '' );

            // r may still not be finite.
            if ( !r['c'] ) {
                r['c'] = [1];
            }
            r['e'] = ( ( ( e + 1 ) / 2 ) | 0 ) - ( e < 0 || e & 1 );
        } else {
            r = new JenScript.BigNumber( n = s.toString() );
        }
        re = r['e'];
        s = re + ( DECIMAL_PLACES += 4 );

        if ( s < 3 ) {
            s = 0;
        }
        e = s;

        // Newton-Raphson iteration.
        for ( ; ; ) {
            t = r;
            r = half.multiply( t.add( x.divide(t) ) );

            if ( t['c'].slice( 0, s ).join('') === r['c'].slice( 0, s ).join('') ) {
                c = r['c'];

                /*
                  The exponent of r may here be one less than the final result
                  exponent (re), e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust
                  s so the rounding digits are indexed correctly.
                 */
                s = s - ( n && r['e'] < re );

                /*
                  The 4th rounding digit may be in error by -1 so if the 4 rounding
                  digits are 9999 or 4999 (i.e. approaching a rounding boundary)
                  continue the iteration.
                 */
                if ( c[s] == 9 && c[s - 1] == 9 && c[s - 2] == 9 &&
                        ( c[s - 3] == 9 || n && c[s - 3] == 4 ) ) {

                    /*
                      If 9999 on first run through, check to see if rounding up
                      gives the exact result as the nines may infinitely repeat.
                     */
                    if ( n && c[s - 3] == 9 ) {
                        t = r.round( dp, 0 );

                        if ( t.multiply(t).equals(x) ) {
                            ROUNDING_MODE = rm;
                            DECIMAL_PLACES = dp;

                            return t;
                        }
                    }
                    DECIMAL_PLACES += 4;
                    s += 4;
                    n = '';
                } else {

                    /*
                      If the rounding digits are null, 0000 or 5000, check for an
                      exact result. If not, then there are further digits so
                      increment the 1st rounding digit to ensure correct rounding.
                     */
                    if ( !c[e] && !c[e - 1] && !c[e - 2] &&
                            ( !c[e - 3] || c[e - 3] == 5 ) ) {

                        // Truncate to the first rounding digit.
                        if ( c.length > e - 2 ) {
                            c.length = e - 2;
                        }

                        if ( !r.multiply(r).equals(x) ) {

                            while ( c.length < e - 3 ) {
                                c.push(0);
                            }
                            c[e - 3]++;
                        }
                    }
                    ROUNDING_MODE = rm;
                    rnd( r, DECIMAL_PLACES = dp, 10 );

                    return r;
                }
            }
        }
    };


    /*
     *  n * 0 = 0
     *  n * N = N
     *  n * I = I
     *  0 * n = 0
     *  0 * 0 = 0
     *  0 * N = N
     *  0 * I = N
     *  N * n = N
     *  N * 0 = N
     *  N * N = N
     *  N * I = N
     *  I * n = I
     *  I * 0 = N
     *  I * N = N
     *  I * I = I
     *
     * Return a new JenScript.BigNumber whose value is the value of this BigNumber times
     * the value of BigNumber(y, b).
     */
    JenScript.BigNumber.prototype.multiply = function (y,b) {
        var c,
            x = this,
            xc = x['c'],
            yc = ( id = 11, y = new JenScript.BigNumber( y, b ) )['c'],
            i = x['e'],
            j = y['e'],
            a = x['s'];

        y['s'] = a == ( b = y['s'] ) ? 1 : -1;

        // Either NaN/Infinity/0?
        if ( !i && ( !xc || !xc[0] ) || !j && ( !yc || !yc[0] ) ) {

            // Either NaN?
            return new JenScript.BigNumber( !a || !b ||

              // x is 0 and y is Infinity  or  y is 0 and x is Infinity?
              xc && !xc[0] && !yc || yc && !yc[0] && !xc

                // Return NaN.
                ? NaN

                // Either Infinity?
                : !xc || !yc

                  // Return +-Infinity.
                  ? y['s'] / 0

                  // x or y is 0. Return +-0.
                  : y['s'] * 0 );
        }
        y['e'] = i + j;

        if ( ( a = xc.length ) < ( b = yc.length ) ) {
            c = xc, xc = yc, yc = c, j = a, a = b, b = j;
        }

        for ( j = a + b, c = []; j--; c.push(0) ) {
        }

        // Multiply!
        for ( i = b - 1; i > -1; i-- ) {

            for ( b = 0, j = a + i;
                  j > i;
                  b = c[j] + yc[i] * xc[j - i - 1] + b,
                  c[j--] = b % 10 | 0,
                  b = b / 10 | 0 ) {
            }

            if ( b ) {
                c[j] = ( c[j] + b ) % 10;
            }
        }

        b && ++y['e'];

        // Remove any leading zero.
        !c[0] && c.shift();

        // Remove trailing zeros.
        for ( j = c.length; !c[--j]; c.pop() ) {
        }

        // No zero check needed as only x * 0 == 0 etc.

        // Overflow?
        y['c'] = y['e'] > MAX_EXP

          // Infinity.
          ? ( y['e'] = null )

          // Underflow?
          : y['e'] < MIN_EXP

            // Zero.
            ? [ y['e'] = 0 ]

            // Neither.
            : c;

        return y;
    };


    /*
     * Return a string representing the value of this BigNumber in exponential
     * notation to dp fixed decimal places and rounded using ROUNDING_MODE if
     * necessary.
     *
     * [dp] {number} Integer, 0 to MAX inclusive.
     */
    JenScript.BigNumber.prototype.toExponential = function (dp) {

        return format( this,
          ( dp == null || ( ( outOfRange = dp < 0 || dp > MAX ) ||

            /*
             * Include '&& dp !== 0' because with Opera -0 == parseFloat(-0) is
             * false, despite -0 == parseFloat('-0') && 0 == -0 being true.
             */
            parse(dp) != dp && dp !== 0 ) &&

              // 'toE() decimal places not an integer: {dp}'
              // 'toE() decimal places out of range: {dp}'
              !ifExceptionsThrow( dp, 'decimal places', 'toE' ) ) && this['c']
                ? this['c'].length - 1
                : dp | 0, 1 );
    };


    /*
     * Return a string representing the value of this BigNumber in normal
     * notation to dp fixed decimal places and rounded using ROUNDING_MODE if
     * necessary.
     *
     * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
     * but e.g. (-0.00001).toFixed(0) is '-0'.
     *
     * [dp] {number} Integer, 0 to MAX inclusive.
     */
    JenScript.BigNumber.prototype.toFixed = function (dp) {
        var n, str, d,
            x = this;

        if ( !( dp == null || ( ( outOfRange = dp < 0 || dp > MAX ) ||
            parse(dp) != dp && dp !== 0 ) &&

            // 'toF() decimal places not an integer: {dp}'
            // 'toF() decimal places out of range: {dp}'
            !ifExceptionsThrow( dp, 'decimal places', 'toF' ) ) ) {
              d = x['e'] + ( dp | 0 );
        }

        n = TO_EXP_NEG, dp = TO_EXP_POS;
        TO_EXP_NEG = -( TO_EXP_POS = 1 / 0 );

        // Note: str is initially undefined.
        if ( d == str ) {
            str = x.toString();
        } else {
            str = format( x, d );

            // (-0).toFixed() is '0', but (-0.1).toFixed() is '-0'.
            // (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
            if ( x['s'] < 0 && x['c'] ) {

                // As e.g. -0 toFixed(3), will wrongly be returned as -0.000 from toString.
                if ( !x['c'][0] ) {
                    str = str.replace(/^-/, '');

                // As e.g. -0.5 if rounded to -0 will cause toString to omit the minus sign.
                } else if ( str.indexOf('-') < 0 ) {
                    str = '-' + str;
                }
            }
        }
        TO_EXP_NEG = n, TO_EXP_POS = dp;

        return str;
    };


    /*
     * Return a string array representing the value of this BigNumber as a
     * simple fraction with an integer numerator and an integer denominator.
     * The denominator will be a positive non-zero value less than or equal to
     * the specified maximum denominator. If a maximum denominator is not
     * specified, the denominator will be the lowest value necessary to
     * represent the number exactly.
     *
     * [maxD] {number|string|BigNumber} Integer >= 1 and < Infinity.
     */
    JenScript.BigNumber.prototype.toFraction = function (maxD) {
        var q, frac, n0, d0, d2, n, e,
            n1 = d0 = new JenScript.BigNumber(1),
            d1 = n0 = new JenScript.BigNumber('0'),
            x = this,
            xc = x['c'],
            exp = MAX_EXP,
            dp = DECIMAL_PLACES,
            rm = ROUNDING_MODE,
            d = new JenScript.BigNumber(1);

        // NaN, Infinity.
        if ( !xc ) {
            return x.toString();
        }

        e = d['e'] = xc.length - x['e'] - 1;

        // If max denominator is undefined or null...
        if ( maxD == null ||

             // or NaN...
             ( !( id = 12, n = new JenScript.BigNumber(maxD) )['s'] ||

               // or less than 1, or Infinity...
               ( outOfRange = n.compareTo(n1) < 0 || !n['c'] ) ||

                 // or not an integer...
                 ( ERRORS && n['e'] < n['c'].length - 1 ) ) &&

                   // 'toFr() max denominator not an integer: {maxD}'
                   // 'toFr() max denominator out of range: {maxD}'
                   !ifExceptionsThrow( maxD, 'max denominator', 'toFr' ) ||

                     // or greater than the maxD needed to specify the value exactly...
                     ( maxD = n ).compareTo(d) > 0 ) {

            // d is e.g. 10, 100, 1000, 10000... , n1 is 1.
            maxD = e > 0 ? d : n1;
        }

        MAX_EXP = 1 / 0;
        n = new JenScript.BigNumber( xc.join('') );

        for ( DECIMAL_PLACES = 0, ROUNDING_MODE = 1; ; )  {
            q = n.divide(d);
            d2 = d0.add( q.multiply(d1) );

            if ( d2.compareTo(maxD) == 1 ) {
                break;
            }

            d0 = d1, d1 = d2;

            n1 = n0.add( q.multiply( d2 = n1 ) );
            n0 = d2;

            d = n.subtract( q.multiply( d2 = d ) );
            n = d2;
        }

        d2 = maxD.subtract(d0).divide(d1);
        n0 = n0.add( d2.multiply(n1) );
        d0 = d0.add( d2.multiply(d1) );

        n0['s'] = n1['s'] = x['s'];

        DECIMAL_PLACES = e * 2;
        ROUNDING_MODE = rm;

        // Determine which fraction is closer to x, n0 / d0 or n1 / d1?
        frac = n1.divide(d1).subtract(x).abs().compareTo(
          n0.divide(d0).subtract(x).abs() ) < 1
          ? [ n1.toString(), d1.toString() ]
          : [ n0.toString(), d0.toString() ];

        return MAX_EXP = exp, DECIMAL_PLACES = dp, frac;
    };


    /*
     * Return a string representing the value of this BigNumber to sd significant
     * digits and rounded using ROUNDING_MODE if necessary.
     * If sd is less than the number of digits necessary to represent the integer
     * part of the value in normal notation, then use exponential notation.
     *
     * sd {number} Integer, 1 to MAX inclusive.
     */
    JenScript.BigNumber.prototype.toPrecision = function (sd) {

        /*
         * ERRORS true: Throw if sd not undefined, null or an integer in range.
         * ERRORS false: Ignore sd if not a number or not in range.
         * Truncate non-integers.
         */
        return sd == null || ( ( ( outOfRange = sd < 1 || sd > MAX ) ||
          parse(sd) != sd ) &&

            // 'toP() precision not an integer: {sd}'
            // 'toP() precision out of range: {sd}'
            !ifExceptionsThrow( sd, 'precision', 'toP' ) )
              ? this.toString()
              : format( this, --sd | 0, 2 );
    };


    /*
     * Return a string representing the value of this BigNumber in base b, or
     * base 10 if b is omitted. If a base is specified, including base 10,
     * round according to DECIMAL_PLACES and ROUNDING_MODE.
     * If a base is not specified, and this BigNumber has a positive exponent
     * that is equal to or greater than TO_EXP_POS, or a negative exponent equal
     * to or less than TO_EXP_NEG, return exponential notation.
     *
     * [b] {number} Integer, 2 to 64 inclusive.
     */
    JenScript.BigNumber.prototype.toString = function (b) {
        var u, str, strL,
            x = this,
            xe = x['e'];

        // Infinity or NaN?
        if ( xe === null ) {
            str = x['s'] ? 'Infinity' : 'NaN';

        // Exponential format?
        } else if ( b === u && ( xe <= TO_EXP_NEG || xe >= TO_EXP_POS ) ) {
            return format( x, x['c'].length - 1, 1 );
        } else {
            str = x['c'].join('');

            // Negative exponent?
            if ( xe < 0 ) {

                // Prepend zeros.
                for ( ; ++xe; str = '0' + str ) {
                }
                str = '0.' + str;

            // Positive exponent?
            } else if ( strL = str.length, xe > 0 ) {

                if ( ++xe > strL ) {

                    // Append zeros.
                    for ( xe -= strL; xe-- ; str += '0' ) {
                    }
                } else if ( xe < strL ) {
                    str = str.slice( 0, xe ) + '.' + str.slice(xe);
                }

            // Exponent zero.
            } else {
                if ( u = str.charAt(0), strL > 1 ) {
                    str = u + '.' + str.slice(1);

                // Avoid '-0'
                } else if ( u == '0' ) {
                    return u;
                }
            }

            if ( b != null ) {

                if ( !( outOfRange = !( b >= 2 && b < 65 ) ) &&
                  ( b == (b | 0) || !ERRORS ) ) {
                    str = convert( str, b | 0, 10, x['s'] );

                    // Avoid '-0'
                    if ( str == '0' ) {
                        return str;
                    }
                } else {

                    // 'toS() base not an integer: {b}'
                    // 'toS() base out of range: {b}'
                    ifExceptionsThrow( b, 'base', 'toString' );
                }
            }

        }

        return x['s'] < 0 ? '-' + str : str;
    };


    /*
     * Return the value of this BigNumber converted to a number primitive.
     *
     */
    JenScript.BigNumber.prototype.toNumber = function () {
        var x = this;

        // Ensure zero has correct sign.
        return +x || ( x['s'] ? 0 * x['s'] : NaN );
    };

    /*
     * Return as toString, but do not accept a base argument.
     */
    JenScript.BigNumber.prototype.valueOf = function () {
    	return this.toString();
    };


})();
(function(){
	JenScript.MetricsType = {
			XMetrics : 'XMetrics',
			YMetrics : 'YMetrics',
	};
	JenScript.Axis = {
			AxisSouth : 'AxisSouth',
			AxisEast  : 'AxisEast',
			AxisWest  : 'AxisWest',
			AxisNorth : 'AxisNorth',
	};
	JenScript.DeviceAxis = {
			AxisX : 'AxisX',
			AxisY : 'AxisY',
	};
	
	JenScript.Metrics = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.Metrics, {
		
	 init : function(config){
			config=config||{};
			/**Id*/
			this.Id='metrics'+JenScript.sequenceId++;
			/**metric type*/
			this.metricsType = config.metricsType;
			/** device value */
			this.deviceValue;
		    /** user value */
			this.userValue;
		    /** metrics marker color */
			this.metricsMarkerColor;
		    /** metrics label color */
			this.metricsLabelColor;
		    /** metrics format */
			this.format;
		    /** metrics label */
			this.metricsLabel;
			/** lock marker flag */
		    this.lockMarker;
		    /** lock label */
		    this.lockLabel;
		    /** visible flag */
		    this.visible = true;
			
		    this.rotate = false;
			//this.gravity ='Neutral';
			this.markerLocation;
			this.markerPosition;
			
	 },
	 
	 getTickMarkerSize : function(){
		 if(this.minor)
	    	return this.metricsPlugin.minor.tickMarkerSize;
		 if(this.median)
		    return this.metricsPlugin.median.tickMarkerSize;
		 return this.metricsPlugin.major.tickMarkerSize;
	 },
	 getTickMarkerColor : function(){
		 if(this.minor)
	    	return this.metricsPlugin.minor.tickMarkerColor;
		 if(this.median)
		    return this.metricsPlugin.median.tickMarkerColor;
		 return this.metricsPlugin.major.tickMarkerColor;
	 },
	 getTickMarkerStroke : function(){
		 if(this.minor)
	    	return this.metricsPlugin.minor.tickMarkerStroke;
		 if(this.median)
		    return this.metricsPlugin.median.tickMarkerStroke;
		 return this.metricsPlugin.major.tickMarkerColor;
	 },
	 getTickTextColor : function(){
		 if(this.minor)
	    	return this.metricsPlugin.minor.tickTextColor;
		 if(this.median)
		    return this.metricsPlugin.median.tickTextColor;
		 return this.metricsPlugin.major.tickTextColor;
	 },
	 getTickTextFontSize : function(){
		 if(this.minor)
	    	return 0;
		 if(this.median)
		    return this.metricsPlugin.median.tickTextFontSize;
		 return this.metricsPlugin.major.tickTextFontSize;
	 },
	 getTickTextOffset : function(){
		 if(this.minor)
	    	return 0;
		 if(this.median)
		    return this.metricsPlugin.median.tickTextOffset;
		 return this.metricsPlugin.major.tickTextOffset;
	 },
	 
	 setDeviceValue : function(value){
	    	this.deviceValue=value;
	 },
	 
	 setUserValue : function(value){
	    	this.userValue=value;
	 },
	
	 getDeviceValue : function(){
	    	return this.deviceValue;
	 },
	 getUserValue : function(){
	    	return this.userValue;
	 },
		
//	  setGravity : function(gravity){
//	    	this.gravity=gravity;
//	  },
//	  getGravity : function(){
//	    	return this.gravity;
//	  },
	  
	  setRotate : function(rotate){
	    	this.rotate=rotate;
	  },
	  isRotate : function(){
	    	return this.rotate;
	  },
	  
	  setMarkerLocation : function(markerLocation){
	    	this.markerLocation=markerLocation;
	  },
	  getMarkerLocation : function(){
	    	return this.markerLocation;
	  },
	  
	  setMarkerPosition : function(markerPosition){
	    	this.markerPosition=markerPosition;
	  },
	  getMarkerPosition : function(){
	    	return this.markerPosition;
	  },
	  
	  setMetricsType : function(metricsType){
	    	this.metricsType=metricsType;
	  },
	  getMetricsType : function(){
	    	return this.metricsType;
	  },
	  
	  getMetricsMarkerColor : function() {
        return this.metricsMarkerColor;
	  },
	    
	  setMetricsMarkerColor :  function(metricsMarkerColor) {
	        this.metricsMarkerColor = metricsMarkerColor;
	  },
	  
	});
	
	
	//
	// TIMING METRICS
	//
	
	/**
	 * time metrics point extends metrics with date time
	 */
	JenScript.TimePointMetrics = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TimePointMetrics, JenScript.Metrics);
	JenScript.Model.addMethods(JenScript.TimePointMetrics, {
		/**
		 * init time metrics point
		 */
		_init : function(config){
			config = config ||{};
			JenScript.Metrics.call(this,config);
			this.time = config.time;
		},
		
		/**
		 * get time metrics
		 * @returns {Object} time
		 */
		getTime : function(){
			return this.time;
		},
		
		/**
		 * set time metrics
		 * @param {Object} time
		 */
		setTime : function(time){
			this.time = time;
		},
	});
	
	
	/**
	 * time duration metrics point extends metrics with 2 date time and 2 metrics reference
	 */
	JenScript.TimeDurationMetrics = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TimeDurationMetrics, JenScript.Metrics);
	JenScript.Model.addMethods(JenScript.TimeDurationMetrics, {
		/**
		 * init duration time metrics point
		 */
		_init : function(config){
			config = config ||{};
			JenScript.Metrics.call(this,config);
			this.timeStart;
			this.timeEnd;
			this.metricsStart;
			this.metricsEnd;
		},
		
		 /**
         * @return the metricsStart
         */
        getMetricsStart : function() {
            return this.metricsStart;
        },

        /**
         * @param metricsStart
         *            the metricsStart to set
         */
        setMetricsStart : function(metricsStart) {
            this.metricsStart = metricsStart;
        },

        /**
         * @return the metricsEnd
         */
        getMetricsEnd : function() {
            return this.metricsEnd;
        },

        /**
         * @param metricsEnd
         *            the metricsEnd to set
         */
        setMetricsEnd : function(metricsEnd) {
            this.metricsEnd = metricsEnd;
        },

        /**
         * @return the timeStart
         */
        getTimeCenter : function() {
            var diff = this.timeEnd.getTime() - this.timeStart.getTime();
            var centerTime = this.timeStart.getTime() + diff / 2;
            return new Date(centerTime);
        },

        /**
         * @return the timeStart
         */
        getTimeStart : function() {
            return this.timeStart;
        },

        /**
         * @param timeStart
         *            the timeStart to set
         */
        setTimeStart : function(timeStart) {
            this.timeStart = timeStart;
        },

        /**
         * @return the timeEnd
         */
        getTimeEnd : function() {
            return this.timeEnd;
        },

        /**
         * @param timeEnd
         *            the timeEnd to set
         */
        setTimeEnd : function(timeEnd) {
            this.timeEnd = timeEnd;
        },

	});
	
	
})();
(function(){

	/**
	 * Metrics painter takes the responsibility to paint metrics
	 */
	JenScript.MetricsPainter = function(){
		this.axisBaseLine;
	};
	JenScript.Model.addMethods(JenScript.MetricsPainter, {
		
		setMetricsPlugin : function(metricsPlugin){
			this.metricsPlugin=metricsPlugin;
		},
		
		getMetricsPlugin : function(){
			return this.metricsPlugin;
		},
		
		 /**
	     * paint metrics base line
	     * @param {Object} g2d the graphics context
	     * @param {Object} start  the start point of the axis base line
	     * @param {Object}end  the end point of the axis base line
	     * @param {String} axisBaseColor axis base color
	     */
	    doPaintLineMetrics : function(g2d,part,start,end,axisBaseColor,axisBaseLineStrokeWidth){
	    	var axisBaseLine = new JenScript.SVGElement().name('line')
								 .attr('id','metricsaxisline'+JenScript.sequenceId++)
								 .attr('x1',start.x)
								 .attr('y1',start.y)
								 .attr('x2',end.x)
								 .attr('y2',end.y)
								 .attr('style','stroke:'+axisBaseColor+';stroke-width:'+axisBaseLineStrokeWidth);
			
	    	
	    	g2d.insertSVG(axisBaseLine.buildHTML());
	    },
	    
	    /**
	     * paint metric tick marker
	     * @param {Object} g2d the graphics context
	     * @param {Object} metrics the metrics to paint
	     */
	    paintMetricsTickMarker : function(g2d,part,metric) {
	    	var tickMarkerSize = metric.getTickMarkerSize();
	    	var tickMarkerStroke = metric.getTickMarkerStroke();
	    	var tickMarkerColor = metric.getTickMarkerColor();
	        var start=undefined;
	        var end=undefined;
	        var prefix=undefined;
	        var position = metric.getMarkerLocation();
	       // console.log("position "+position.x+"/"+position.y);
            if (metric.getMarkerPosition() === 'S') {
            	prefix = 'southtick';
            	start = {x:position.x,y:position.y + 2};
            	end= {x:position.x,y:position.y + tickMarkerSize + 2};
            }
            if (metric.getMarkerPosition() == 'N') {
            	prefix = 'northtick';
            	start = {x:position.x,y:position.y - 2};
            	end= {x:position.x,y:position.y - tickMarkerSize - 2};
            }
            if (metric.getMarkerPosition() == 'W') {
            	prefix = 'westtick';
            	start = {x:position.x- tickMarkerSize - 2,y:position.y};
            	end= {x:position.x-2,y:position.y};

            }
            if (metric.getMarkerPosition() == 'E') {
            	prefix = 'easttick';
            	start = {x:position.x+ 2,y:position.y};
            	end= {x:position.x + tickMarkerSize + 2,y:position.y};
            }
	        var tick = new JenScript.SVGElement().name('line')
								 .attr('id',prefix+JenScript.sequenceId++)
								 .attr('x1',start.x)
								 .attr('y1',start.y)
								 .attr('x2',end.x)
								 .attr('y2',end.y)
								 .attr('stroke',tickMarkerColor)
								 .attr('stroke-width',tickMarkerStroke);
					
	       
	        g2d.insertSVG(tick.buildHTML());
	    },
	    
	    
	    /**
	     * paint south metric label
	     * @param {Object} g2d the graphics context
	     * @param {Object} metrics the metrics to paint
	     */
	   paintSouthMetricsLabel : function (g2d,metric){
	        var loc = metric.getMarkerLocation();
	        var tickMarkerSize = metric.getTickMarkerSize();
	    	var tickTextColor = metric.getTickTextColor();
	    	var tickTextFontSize = metric.getTickTextFontSize();
	    	var tickTextOffset = metric.getTickTextOffset();
	    	
	        var text = new JenScript.SVGElement().name('text')
												.attr('id',"southmetrics"+JenScript.sequenceId++)
												.attr('x',loc.x+'px')
												.attr('y',(loc.y+tickMarkerSize +tickTextFontSize+tickTextOffset+ 2)+'px')
												.attr('font-size',tickTextFontSize)
												.attr('fill',tickTextColor)
												.attr('text-anchor','middle')
												.textContent(metric.format());
			
	        var label = text.buildHTML();
	        g2d.insertSVG(label);
	        
//	        var svgRect = label.getBBox();
//		       console.log("south label bbox : "+svgRect.x+","+svgRect.y+","+svgRect.width+","+svgRect.height);
//		       var box = new JenScript.SVGRect().origin(svgRect.x,svgRect.y)
//								.size(svgRect.width,svgRect.height)
//								.strokeWidth(1)
//								.stroke('pink')
//								.fillNone()
//								.strokeOpacity(0.8)
//								.toSVG();
//			
//		       g2d.insertSVG(box);
	    },
	    
	    /**
	     * paint north metric label
	     * @param {Object} g2d the graphics context
	     * @param {Object} metrics the metrics to paint
	     */
		paintNorthMetricsLabel : function (g2d,metric){
			   var loc = metric.getMarkerLocation();
		       var tickMarkerSize = metric.getTickMarkerSize();
		       var tickTextColor = metric.getTickTextColor();
		       var tickTextFontSize = metric.getTickTextFontSize();
		       var tickTextOffset = metric.getTickTextOffset();
		       var text = new JenScript.SVGElement().name('text')
												.attr('id',"northmetrics"+JenScript.sequenceId++)
												.attr('x',loc.x+'px')
												.attr('y',(loc.y-tickMarkerSize-tickTextOffset - 4)+'px')
												.attr('font-size',tickTextFontSize)
												.attr('fill',tickTextColor)
												.attr('text-anchor','middle')
												.textContent(metric.format());

		       g2d.insertSVG(text.buildHTML());
		    },
		    
		    /**
		     * paint west metric label
		     * @param {Object} g2d the graphics context
		     * @param {Object} metrics the metrics to paint
		     */
		    paintWestMetricsLabel : function (g2d,metric){
		    	
		    	if(metric.isRotate()){
		    		 	var loc = metric.getMarkerLocation();
				        var tickMarkerSize = metric.getTickMarkerSize();
				    	var tickTextColor = metric.getTickTextColor();
				    	var tickTextFontSize = metric.getTickTextFontSize();
				    	var tickTextOffset = metric.getTickTextOffset();
				    	var Id = "metrics"+JenScript.sequenceId++;
				        var text = new JenScript.SVGElement().name('text')
															.attr('id',Id)
															.attr('x',loc.x+'px')
															.attr('y',loc.y+'px')
															.attr('font-size',tickTextFontSize)
															.attr('fill',tickTextColor)
															.attr('text-anchor','middle')
															.attr('transform','translate('+(-tickMarkerSize-tickTextOffset-6)+',0) rotate(-90,'+loc.x+','+loc.y+')')
															.textContent(metric.format());
				        
				       
				        var label= text.buildHTML();
				       g2d.insertSVG(label);
				       
				       var bb = this.transformedBoundingBox(label);
				       if(bb.y < 0 || (bb.y+bb.height) > this.getMetricsPlugin().getProjection().getView().getDevice().getHeight()){
//					       var box = new JenScript.SVGRect().origin(bb.x,bb.y)
//											.size(bb.width,bb.height)
//											.strokeWidth(1)
//											.stroke('red')
//											.fillNone()
//											.strokeOpacity(1)
//											.toSVG();
//					       g2d.insertSVG(box);
					       g2d.deleteGraphicsElement(Id);
				       }
		    	}else{
		    		var loc = metric.getMarkerLocation();
			        var tickMarkerSize = metric.getTickMarkerSize();
			    	var tickTextColor = metric.getTickTextColor();
			    	var tickTextFontSize = metric.getTickTextFontSize();
			    	 var tickTextOffset = metric.getTickTextOffset();
			    	var Id = "metrics"+JenScript.sequenceId++;
			        var text = new JenScript.SVGElement().name('text')
														.attr('id',Id)
														.attr('x',loc.x+'px')
														.attr('y',loc.y+'px')
														.attr('font-size',tickTextFontSize)
														.attr('fill',tickTextColor)
														.attr('text-anchor','end')
														.attr('transform','translate('+(-tickMarkerSize-tickTextOffset-6)+','+tickTextFontSize/2+')')
														.textContent(metric.format());
			        
			       // console.log("metrics marker size : "+tickMarkerSize+" for metrics value : "+metric.format());
			        
			       var label= text.buildHTML();
			       
			       g2d.insertSVG(label);
			       
			       var bb = this.transformedBoundingBox(label);
			       if(bb!== null && (bb.y < -1 || (bb.y+bb.height) > this.getMetricsPlugin().getProjection().getView().getDevice().getHeight()+1)){
//				       var box = new JenScript.SVGRect().origin(bb.x,bb.y)
//										.size(bb.width,bb.height)
//										.strokeWidth(1)
//										.stroke('red')
//										.fillNone()
//										.strokeOpacity(1)
//										.toSVG();
//				       g2d.insertSVG(box);
				       g2d.deleteGraphicsElement(Id);
			       }
		    	}
		       
		       	
		    },
		    
		    
		 // Calculate the bounding box of an element with respect to its parent element
		 transformedBoundingBox : function(el){
			 if(el === undefined) return null;
		      var bb  = el.getBBox(),
		          svg = el.ownerSVGElement,
		          m   = el.getTransformToElement(el.parentNode);
		      var pts = [
		        svg.createSVGPoint(), svg.createSVGPoint(),
		        svg.createSVGPoint(), svg.createSVGPoint()
		      ];
		      pts[0].x=bb.x;          pts[0].y=bb.y;
		      pts[1].x=bb.x+bb.width; pts[1].y=bb.y;
		      pts[2].x=bb.x+bb.width; pts[2].y=bb.y+bb.height;
		      pts[3].x=bb.x;          pts[3].y=bb.y+bb.height;

		      var xMin=Infinity,xMax=-Infinity,yMin=Infinity,yMax=-Infinity;
		      pts.forEach(function(pt){
		        pt = pt.matrixTransform(m);
		        xMin = Math.min(xMin,pt.x);
		        xMax = Math.max(xMax,pt.x);
		        yMin = Math.min(yMin,pt.y);
		        yMax = Math.max(yMax,pt.y);
		      });

		     // bb.x = xMin; bb.width  = xMax-xMin;
		      //bb.y = yMin; bb.height = yMax-yMin;
		      
		        /**
			     * create new bow object
			     * (IE, BUG)
			     */
			    return {x: xMin, y: yMin, width: (xMax-xMin), height: (yMax-yMin)};
			    
		    },
		    
		    /**
		     * paint east metric label
		     * @param {Object} g2d the graphics context
		     * @param {Object} metrics the metrics to paint
		     */
		    paintEastMetricsLabel : function (g2d,metric){
		    	if(metric.isRotate()){
		    		   var loc = metric.getMarkerLocation();
				       var tickMarkerSize = metric.getTickMarkerSize();
				       var tickTextColor = metric.getTickTextColor();
				       var tickTextFontSize = metric.getTickTextFontSize();
				       var tickTextOffset = metric.getTickTextOffset();
				       var Id = "metrics"+JenScript.sequenceId++;
				       var text = new JenScript.SVGElement().name('text')
				        									.attr('id',Id)
				        									.attr('x',loc.x)
				        									.attr('y',loc.y)
				        									.attr('font-size',tickTextFontSize)
															.attr('fill',tickTextColor)
				        									.attr('text-anchor','middle')
				        									.attr('transform','translate('+(tickMarkerSize+tickTextOffset-6)+',0) rotate(90,'+(loc.x)+','+loc.y+')')
				        									.textContent(metric.format());
				        									
				       var label= text.buildHTML();									
				       g2d.insertSVG(label);
				       
				       var bb = this.transformedBoundingBox(label);
				       if(bb.y < 0 || (bb.y+bb.height) > this.getMetricsPlugin().getProjection().getView().getDevice().getHeight()){
//					       var box = new JenScript.SVGRect().origin(bb.x,bb.y)
//											.size(bb.width,bb.height)
//											.strokeWidth(1)
//											.stroke('red')
//											.fillNone()
//											.strokeOpacity(1)
//											.toSVG();
//					       g2d.insertSVG(box);
					       g2d.deleteGraphicsElement(Id);
				       }
				       
		    	}else{
		    		var loc = metric.getMarkerLocation();
			        var tickMarkerSize = metric.getTickMarkerSize();
			    	var tickTextColor = metric.getTickTextColor();
			    	var tickTextFontSize = metric.getTickTextFontSize();
			    	var tickTextOffset = metric.getTickTextOffset();
			    	var Id = "metrics"+JenScript.sequenceId++;
			        var text = new JenScript.SVGElement().name('text')
														.attr('id',Id)
														.attr('x',loc.x+'px')
														.attr('y',loc.y+'px')
														.attr('font-size',tickTextFontSize)
														.attr('fill',tickTextColor)
														.attr('text-anchor','start')
														.attr('transform','translate('+(tickMarkerSize+tickTextOffset)+','+tickTextFontSize/2+')')
														.textContent(metric.format());
			        
			       // console.log("metrics marker size : "+tickMarkerSize+" for metrics value : "+metric.format());
			        
			       var label= text.buildHTML();
			       g2d.insertSVG(label);
			       
			       var bb = this.transformedBoundingBox(label);
			       if(bb !== null && (bb.y < -1 || (bb.y+bb.height) > this.getMetricsPlugin().getProjection().getView().getDevice().getHeight()+1)){
//				       var box = new JenScript.SVGRect().origin(bb.x,bb.y)
//										.size(bb.width,bb.height)
//										.strokeWidth(1)
//										.stroke('red')
//										.fillNone()
//										.strokeOpacity(1)
//										.toSVG();
//				       g2d.insertSVG(box);
				       g2d.deleteGraphicsElement(Id);
			       }
		    	}
			
		    },
	    
	    /**
	     * paint metrics tick labels
	     * @param {Object} g2d the graphics context
	     * @param {Object} metrics the metrics to paint
	     */
	    paintMetricsTickLabel : function(g2d,part,metric) {
	    	if(metric.minor === true) return;
            if (metric.getMarkerPosition() === 'S') {
               this.paintSouthMetricsLabel(g2d, metric);
            }
            if (metric.getMarkerPosition() === 'N') {
               this.paintNorthMetricsLabel(g2d, metric);
            }
            if (metric.getMarkerPosition() === 'W') {
               this.paintWestMetricsLabel(g2d, metric);
            }
            if (metric.getMarkerPosition() === 'E') {
               this.paintEastMetricsLabel(g2d, metric);
            }
	    },

	    /**
	     * paint metrics
	     * @param {Object} g2d the graphics context
	     * @param {Object} metrics the metrics to paint
	     */
	    doPaintMetrics :  function(g2d,part,metrics){
	        for (var i = 0; i < metrics.length; i++) {
	            var metric = metrics[i];
	            if (!metric.visible) {
	                continue;
	            }
	            var loc = metric.getMarkerLocation();
	            if(!isNaN(loc.x) && !isNaN(loc.y)){
	            	this.paintMetricsTickMarker(g2d, part,metric);
	 	            this.paintMetricsTickLabel(g2d,part, metric);
	            }
	        }
	    }
	});
})();
(function(){
	JenScript.MetricsPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MetricsPlugin, JenScript.Plugin);

	JenScript.Model.addMethods(JenScript.MetricsPlugin, {
		_init : function(config){
			config = config ||{};
			
			/** the metrics manager */
			this.metricsManager = config.manager;
			
			/**metrics formater*/
			this.metricsFormat = config.metricsFormat;
			
			/**TODO, get only non undefined values and not all block*/
			this.minor =  {tickMarkerSize : 2,tickMarkerColor:'rgb(230, 193, 153)',tickMarkerStroke:0.8,tickTextOffset : 0};
			this.median = {tickMarkerSize : 4,tickMarkerColor:'rgb(230, 193, 153)',tickMarkerStroke:1.2,tickTextColor:'rgb(230, 193, 153)',tickTextFontSize:10,tickTextOffset : 0};
			this.major =  {tickMarkerSize : 6,tickMarkerColor:'rgb(37, 38, 41)',tickMarkerStroke:1.6,tickTextColor:'rgb(37, 38, 41)',tickTextFontSize:12,tickTextOffset : 0};
			
			if(config.minor !== undefined){
				this.minor.tickMarkerSize = (config.minor.tickMarkerSize !== undefined) ? config.minor.tickMarkerSize : 2;
				this.minor.tickMarkerColor = (config.minor.tickMarkerColor !== undefined) ? config.minor.tickMarkerColor : 'rgb(230, 193, 153)';
				this.minor.tickMarkerStroke = (config.minor.tickMarkerStroke !== undefined) ? config.minor.tickMarkerStroke : 0.8;
			}
			if(config.median !== undefined){
				this.median.tickMarkerSize 	= (config.median.tickMarkerSize !== undefined) ? config.median.tickMarkerSize : 4;
				this.median.tickMarkerColor 	= (config.median.tickMarkerColor !== undefined) ? config.median.tickMarkerColor : 'rgb(230, 193, 153)';
				this.median.tickMarkerStroke = (config.median.tickMarkerStroke !== undefined) ? config.median.tickMarkerStroke : 1;
				this.median.tickTextColor 	= (config.median.tickTextColor !== undefined) ? config.median.tickTextColor : 'rgb(230, 193, 153)';
				this.median.tickTextFontSize = (config.median.tickTextFontSize !== undefined) ? config.median.tickTextFontSize : 10;
				this.median.tickTextOffset 	= (config.median.tickTextOffset !== undefined) ? config.median.tickTextOffset : 0;
			}
			if(config.major !== undefined){
				this.major.tickMarkerSize 	= (config.major.tickMarkerSize !== undefined) ? config.major.tickMarkerSize : 6;
				this.major.tickMarkerColor 	= (config.major.tickMarkerColor !== undefined) ? config.major.tickMarkerColor : 'rgb(37, 38, 41)';
				this.major.tickMarkerStroke 	= (config.major.tickMarkerStroke !== undefined) ? config.major.tickMarkerStroke : 1.8;
				this.major.tickTextColor 	= (config.major.tickTextColor !== undefined) ? config.major.tickTextColor : 'rgb(37, 38, 41)';
				this.major.tickTextFontSize 	= (config.major.tickTextFontSize !== undefined) ? config.major.tickTextFontSize : 12;
				this.major.tickTextOffset 	= (config.major.tickTextOffset !== undefined) ? config.major.tickTextOffset : 0;
			}
			
			this.gravity =  (config.gravity !== undefined)? config.gravity : 'natural';
			JenScript.Plugin.call(this,config);
		},
		
		setGravity  : function(gravity){
			this.gravity = gravity;
		},
		
		getGravity  : function(){
			return this.gravity;
		},
		
		setMetricsManager  : function(metricsManager){
			this.metricsManager = metricsManager;
		},
		
		getMetricsManager  : function(){
			return this.metricsManager;
		},
		
		setTickMarkerSize  : function(type,size){
			this[type].tickMarkerSize = size;
		},
		
		setTickMarkerColor  : function(type,color){
			this[type].tickMarkerColor = color;
		},
		
		setTickMarkerStrokeWidth  : function(type,width){
			this[type].tickMarkerStroke = width;
		},
		
		setTickTextColor  : function(type,color){
			this[type].tickTextColor = color;
		},
		
		setTickTextFontSize  : function(type,width){
			this[type].tickTextFontSize = width;
		},
		setTickTextOffset  : function(type,offset){
			this[type].tickTextOffset = offset;
		},
		
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},that.toString());
		},
	});	
})();
(function(){
	JenScript.AxisMetricsPlugin = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AxisMetricsPlugin, JenScript.MetricsPlugin);

	JenScript.Model.addMethods(JenScript.AxisMetricsPlugin, {
		__init : function(config){
			config = config ||{};
			
			/** the metrics painter */
			this.metricsPainter = new JenScript.MetricsPainter();
			
			/** the accessible zone */
			this.axis = config.axis;

			/** the axis spacing */
			this.axisSpacing = (config.axisSpacing !== undefined)?config.axisSpacing:0;

			/** paint flag axis base line, default is false */
			this.axisBaseLine =  (config.axisBaseLine !== undefined)?config.axisBaseLine:false;
			
			/** color axis base line, default is black */
			this.axisBaseLineColor =  (config.axisBaseLineColor !== undefined)?config.axisBaseLineColor:'black';
			
			/** stroke axis base line, default is 0.8 */
			this.axisBaseLineStrokeWidth =  (config.axisBaseLineStrokeWidth !== undefined)?config.axisBaseLineStrokeWidth: 0.8;
			
			JenScript.MetricsPlugin.call(this,config);
		},
		
		toString : function(){
			return  this.name+' '+this.Id+' '+this.axis;
		},
		
		isAccessible : function(viewPart) {
			//console.log('isAccessible: '+viewPart+' '+this.axis);
			if (this.axis === JenScript.Axis.AxisSouth && viewPart !== JenScript.ViewPart.South) {
				return false;
			}
			if (this.axis == JenScript.Axis.AxisNorth && viewPart !== JenScript.ViewPart.North) {
				return false;
			}
			if (this.axis === JenScript.Axis.AxisWest && viewPart !== JenScript.ViewPart.West) {
				return false;
			}
			if (this.axis === JenScript.Axis.AxisEast && viewPart !== JenScript.ViewPart.East) {
				return false;
			}
			if (viewPart == JenScript.ViewPart.Device) {
				return false;
			}
			return true;
		},
		
		_paintAxisBaseLine : function(view,g2d,viewPart) {
			if (this.axisBaseLine) {
				var axisStartLocation={};
				var axisEndLocation={};
				if (viewPart === JenScript.ViewPart.South) {
					var component = view.getComponent(JenScript.ViewPart.South);
					axisStartLocation = {x: view.getPlaceHolderAxisWest(), y:this.axisSpacing};
					axisEndLocation ={x:component.getWidth() - view.getPlaceHolderAxisEast(),y: this.axisSpacing};
				}
				if (viewPart === JenScript.ViewPart.West) {
					var component = view.getComponent(JenScript.ViewPart.West);
					axisStartLocation = {x:component.getWidth() - 1 - this.axisSpacing,y: 0};
					axisEndLocation = {x:component.getWidth() - 1 - this.axisSpacing, y:component.getHeight()};
				}
				if (viewPart === JenScript.ViewPart.East) {
					var component = view.getComponent(JenScript.ViewPart.East);
					axisStartLocation = {x:this.axisSpacing, y:0};
					axisEndLocation = {x:this.axisSpacing, y:component.getHeight()};
				}
				if (viewPart === JenScript.ViewPart.North) {
					var component = view.getComponent(JenScript.ViewPart.North);
					axisStartLocation = {x:view.getPlaceHolderAxisWest(),y: component.getHeight() - 1 - this.axisSpacing};
					axisEndLocation = {x:component.getWidth() - view.getPlaceHolderAxisEast(),y: component.getHeight() - 1 - this.axisSpacing};
				}
				this.metricsPainter.doPaintLineMetrics(g2d,viewPart, axisStartLocation, axisEndLocation, this.axisBaseLineColor,this.axisBaseLineStrokeWidth);
			}
		},
		
		_paintAxisMetrics : function(view,g2d,viewPart) {
			
			var metrics = [];
			metrics = this.metricsManager.getDeviceMetrics();

			if(metrics === undefined) return;
			
			metrics.sort(function(m1, m2) {
				var val1 = m1.userValue;
				var val2 = m2.userValue;
				return ((val1 < val2) ? -1 : ((val1 > val2) ? 1 : 0));
			});
			for (var i = 0; i < metrics.length; i++) {
				var m = metrics[i];
				m.metricsPlugin = this;
				if (this.getGravity() === 'rotate') {
					m.setRotate(true);
				}else{
					m.setRotate(false);
				}
				
				var markerLocation = {};
				if (viewPart === JenScript.ViewPart.South) {
					markerLocation = {x:view.getPlaceHolderAxisWest() + m.getDeviceValue(),y: this.axisSpacing};
					m.setMarkerLocation(markerLocation);
					m.setMarkerPosition('S');
				}
				if (viewPart === JenScript.ViewPart.West) {
					var component = view.getComponent(JenScript.ViewPart.West);
					markerLocation = {x:component.getWidth() - 1 - this.axisSpacing,y: m.getDeviceValue()};
					m.setMarkerLocation(markerLocation);
					m.setMarkerPosition('W');
				}
				if (viewPart === JenScript.ViewPart.East) {
					markerLocation = {x:this.axisSpacing,y: m.getDeviceValue()};
					m.setMarkerLocation(markerLocation);
					m.setMarkerPosition('E');
				}
				if (viewPart === JenScript.ViewPart.North) {
					var component = view.getComponent(JenScript.ViewPart.North);
					markerLocation = {x:view.getPlaceHolderAxisWest() + m.getDeviceValue(),y: component.getHeight() - 1 - this.axisSpacing};
					m.setMarkerLocation(markerLocation);
					m.setMarkerPosition('N');
				}
			}
			this.metricsPainter.doPaintMetrics(g2d,viewPart, metrics);
		},
		
		/**
		 * assign manager type x or y given by given axis.
		 */
		_assignType : function() {
			if (this.axis == JenScript.Axis.AxisSouth || this.axis == JenScript.Axis.AxisNorth) {
				this.metricsManager.setMetricsType(JenScript.MetricsType.XMetrics);
			}
			if (this.axis == JenScript.Axis.AxisEast || this.axis == JenScript.Axis.AxisWest) {
				this.metricsManager.setMetricsType(JenScript.MetricsType.YMetrics);
			}
		},

		/**
		 * Paints metrics.
		 */
		_paintMetrics : function(view, g2d,viewPart) {
			if (!this.isAccessible(viewPart)) {
				return;
			}
			this.metricsManager.setMetricsPlugin(this);
			this.metricsPainter.setMetricsPlugin(this);
			this._assignType();
			this._paintAxisMetrics(view, g2d, viewPart);
			this._paintAxisBaseLine(view, g2d, viewPart);
		},
		
		paintPlugin : function(g2d, part) {
			this._paintMetrics(this.getProjection().getView(),g2d,part);
		},

	});
	

	
})();
(function(){
	JenScript.DeviceMetricsPlugin = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.DeviceMetricsPlugin, JenScript.MetricsPlugin);

	JenScript.Model.addMethods(JenScript.DeviceMetricsPlugin, {
		__init : function(config){
			config = config ||{};
			
			/** the metrics painter */
			this.metricsPainter = new JenScript.MetricsPainter();
			
			/** axis base line at the constant x or y value */
			this.baseLine = config.baseLine;

			/** device axis x or y */
			this.deviceAxis = config.deviceAxis;

			/** marker position */
			this.deviceMarkerPosition;

			/** paint base line flag */
			this.paintLine = true;
			
			/** color axis base line, default is red */
			this.axisBaseLineColor = 'red';
			
			/** stroke axis base line, default is 0.8 */
			this.axisBaseLineStrokeWidth = 0.8;
			
			JenScript.MetricsPlugin.call(this,config);
		},
		
		setBaseLine  : function(baseLine){
			this.baseLine = baseLine;
		},
		
		getBaseLine  : function(){
			return this.baseLine;
		},
		
		setDeviceAxis  : function(deviceAxis){
			this.deviceAxis = deviceAxis;
		},
		
		getDeviceAxis  : function(){
			return this.deviceAxis;
		},
		
		setDeviceMarkerPosition  : function(deviceMarkerPosition){
			this.deviceMarkerPosition = deviceMarkerPosition;
		},
		
		getDeviceMarkerPosition  : function(){
			return this.deviceMarkerPosition;
		},
		
		setPaintLine  : function(paintLine){
			this.paintLine = paintLine;
		},
		
		isPaintLine  : function(){
			return this.paintLine;
		},
		
		/**
		 * assign manager type x or y given by given axis.
		 */
		_assignType : function() {
			if (this.deviceAxis === JenScript.DeviceAxis.AxisX ) {
				this.metricsManager.setMetricsType(JenScript.MetricsType.XMetrics);
			}
			if (this.deviceAxis === JenScript.DeviceAxis.AxisY) {
				this.metricsManager.setMetricsType(JenScript.MetricsType.YMetrics);
			}
		},
		
		/**
		 * true if the device part context, false otherwise
		 */
		isAccessible : function(viewPart) {
			if (viewPart === JenScript.ViewPart.Device) {
				return true;
			}
			return false;
		},
		
		/**
		 * paint X metrics for the given parameters
		 * 
		 * @param v2d
		 * @param g2d
		 */
		_paintMetricsX : function(view,part,g2d,metricsX,baseLine,offsetPixel) {
			//alert("this getProj "+this.getProjection());
			//alert("this getProj "+this.getProjection().userToPixel(new JenScript.Point2D(0, this.baseLine)));
			var deviceBaseLine = this.getProjection().userToPixel(new JenScript.Point2D(0, this.baseLine));
			//alert("deviceBaseLine : "+deviceBaseLine)
			for (var i = 0; i< metricsX.length;i++) {
				var m = metricsX[i];
				
				m.metricsPlugin = this;
//				if (MarkerPosition.isXCompatible(this.deviceMarkerPosition)) {
//					m.setMarkerPosition(this.deviceMarkerPosition);
//				} else {
					m.setMarkerPosition('S');
				//}
//				m.setLockMarker(true);
//				if (offsetPixel > 0) {
//					m.setLockMarker(false);
//				}
				var p = undefined;
				if (m.getMarkerPosition() === 'S') {
					p = new JenScript.Point2D(m.getDeviceValue(), deviceBaseLine.y + offsetPixel);
				}
				if (m.getMarkerPosition() === 'N') {
					p = new JenScript.Point2D(m.getDeviceValue(), deviceBaseLine.y - offsetPixel);
				}
				m.setMarkerLocation(p);
			}
			this.metricsPainter.doPaintMetrics(g2d,part,metricsX);
		},

		/**
		 * paint the base line for x metrics
		 * 
		 * @param v2d
		 * @param g2d
		 */
		_paintMetricsXBaseLine : function(view,part,g2d,baseLine) {
			var deviceBaseLine = this.getProjection().userToPixel(new JenScript.Point2D(0, baseLine));
			this.metricsPainter.doPaintLineMetrics(g2d,part, new JenScript.Point2D(0, deviceBaseLine.y), new JenScript.Point2D(this.getProjection().getView().getDevice().getWidth(), deviceBaseLine.y), this.axisBaseLineColor,this.axisBaseLineStrokeWidth);
		},

		_paintMetricsY : function(view,part,g2d,metricsY,baseLine,offsetPixel) {
			var deviceBaseLine = this.getProjection().userToPixel(new JenScript.Point2D(baseLine, 0));
			for (var i = 0; i< metricsY.length;i++) {
				var m = metricsY[i];
				m.metricsPlugin = this;
				
				var p = undefined;
				p = new JenScript.Point2D(deviceBaseLine.x, m.getDeviceValue());
				m.setMarkerLocation(p);
				//if (MarkerPosition.isYCompatible(deviceMarkerPosition)) {
				//	m.setMarkerPosition(deviceMarkerPosition);
				//} else {
					m.setMarkerPosition('W');
				//}
			}
			this.metricsPainter.doPaintMetrics(g2d,part,metricsY);
		},

		/**
		 * paint the base line for y metrics
		 * 
		 * @param v2d
		 * @param g2d
		 */
		_paintMetricsYBaseLine : function(view,part,g2d,baseLine) {
			var deviceBaseLine = this.getProjection().userToPixel(new JenScript.Point2D(baseLine, 0));
			this.metricsPainter.doPaintLineMetrics(g2d,part,new JenScript.Point2D(deviceBaseLine.x, 0), new JenScript.Point2D(deviceBaseLine.x, this.getProjection().getView().getDevice().getHeight()), this.axisBaseLineColor,this.axisBaseLineStrokeWidth);
		},

		/**
		 * Paints metrics.
		 */
		_paintMetrics : function(view,g2d,viewPart) {
			if (!this.isAccessible(viewPart)) {
				return;
			}
			this.metricsManager.setMetricsPlugin(this);
			this.metricsPainter.setMetricsPlugin(this);
			this._assignType();
			var metrics = this.metricsManager.getDeviceMetrics();
			if (this.deviceAxis === JenScript.DeviceAxis.AxisX) {
				this._paintMetricsX(view,viewPart, g2d, metrics, this.baseLine, 0);
				if (this.isPaintLine()) {
					this._paintMetricsXBaseLine(view,viewPart, g2d, this.baseLine);
				}
			}
			if (this.deviceAxis == JenScript.DeviceAxis.AxisY) {
				this._paintMetricsY(view,viewPart,g2d,metrics,this.baseLine, 0);
				if (this.isPaintLine()) {
					this._paintMetricsYBaseLine(view,viewPart,g2d,this.baseLine);
				}
			}
		},
		
		/**
		 * paint device metrics plugin
		 */
		paintPlugin : function(g2d, part) {
			this._paintMetrics(this.getProjection().getView(),g2d,part);
		},
	});
	
})();
(function(){
	JenScript.MetricsManager = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.MetricsManager, {
		init : function(config){
			config = config ||{};
			this.metricsType;
			this.metricsPlugin;
		},
		
		setMetricsPlugin : function(metricsPlugin){
			this.metricsPlugin=metricsPlugin;
		},
		getMetricsPlugin : function(){
			return this.metricsPlugin;
		},
		
		setMetricsType : function(metricsType){
			this.metricsType=metricsType;
		},
		getMetricsType : function(){
			return this.metricsType;
		},
		
		getProjection : function(){
			return this.metricsPlugin.getProjection();
		},
		
		getDeviceMetrics : function(){
			return [];
		}
	});
})();
(function(){
	//
	// MODELED METRICS
	//
	/**
	 * metrics model takes the responsibility to create metrics based on multiplier exponent model
	 */
	JenScript.MetricsModel = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.MetricsModel, {
		/**
		 * init metrics model
		 */
		init : function(config){
			config = config||{};
	        /**model exponent*/
	        this.exponent = config.exponent;
	        /** metrics factor */
	        this.factor = config.factor;
	        /** metrics manager */
	        this.metricsManager;
	        /** the start reference to generate metrics */
	        this.ref;
	        /** the max value to attempt */
	        this.maxValue;
	        /** pixel label holder */
	        this.pixelLabelHolder;
	        /** metrics label color */
	        this.metricsLabelColor;
	        /** metrics marker color */
	        this.metricsMarkerColor;
	        /** minimal tag for this domain */
	        this.solveType = 'major';
		},
		
		/**
		 * get metrics manager of this model
		 * @returns {Object} metrics manager
		 */
		getMetricsManager : function(){
			return this.metricsManager;
		},
		
		/**
		 * set metrics manager of this model
		 * @param {Object} metrics manager
		 */
		setMetricsManager : function(metricsManager){
			this.metricsManager = metricsManager;
		},
		
		/**
         * generates median metrics for this model
         * @return metrics
         */
        generateMedianMetrics : function() {
        	this.solveType = 'median';
        	this.solve();
        	var originFactor = this.factor;
        	this.factor = this.factor.multiply(0.5);
        	var that = this;
        	var formater = function(){
            	if(that.exponent < 0){
            		if(new JenScript.BigNumber("0").equals(this.userValue))return '0';
    	        	return this.userValue.toFixed(Math.abs(that.exponent)+1);
    	        }
    	        else{
    	        	return this.userValue;
    	        }
            };
        	var metrics = this.generateMetrics();
        	for(var i = 0;i<metrics.length;i++){
        		metrics[i].median = formater;
        		metrics[i].format = formater;
        	}
        	this.factor = originFactor;
        	return metrics;
        },
		
		/**
         * generates all metrics for this model
         * @return {Object} metrics array
         */
        generateMetrics : function() {
        	this.solveType = 'major';
        	this.solve();
        	var metrics = [];
            var flag = true;
            var metricsValue = this.ref;
            var that = this;
            var formater = function(){
            	if(that.exponent < 0){
    	        	if(new JenScript.BigNumber("0").equals(this.userValue))return '0';
            		return this.userValue.toFixed(Math.abs(that.exponent));
    	        }
    	        else{
    	        	return this.userValue;
    	        }
            };
            var m0 = this.getMetricsManager().generateMetrics(metricsValue.toNumber(), this);
            if (m0 !== undefined) {
                metrics[metrics.length]=m0;
                m0.major = true;
                m0.format = formater;
            }
            while(flag){
            	metricsValue = metricsValue.add(this.factor);
            	 var m = this.getMetricsManager().generateMetrics(metricsValue.toNumber(), this);
                 if (m !== undefined) {
                	 m.major = true;
                	 m.format = formater;
                     metrics[metrics.length]=m;
                 }
                 if(metricsValue.greaterThanOrEqualTo(this.maxValue))
                	 flag = false;
            }
            return metrics;
        },
		
        /**
         * solve this model according with given model parameters
         */
        solve : function (){
        	var proj = this.metricsManager.getProjection();
            if (this.getMetricsManager().getMetricsType() === JenScript.MetricsType.XMetrics) {
            	this.userSize = new JenScript.BigNumber(proj.getUserWidth()+'');
            	JenScript.BigNumber.config({ ROUNDING_MODE : JenScript.BigNumber.ROUND_CEIL });
                var bd1 = new JenScript.BigNumber(proj.getMinX()+'').divide(this.factor);
                var bi1 = new JenScript.BigNumber(bd1.toFixed(0));
                this.ref = new JenScript.BigNumber(bi1).multiply(this.factor);
                this.ref = this.ref.subtract(this.factor);
                if(this.ref.equals(0)){
                	this.ref = this.ref.subtract(this.factor);
                }
                this.pixelSize = new JenScript.BigNumber(proj.getPixelWidth()+'');
                this.maxValue = new JenScript.BigNumber(proj.getMaxX()+'');
            }
            else if (this.getMetricsManager().getMetricsType() === JenScript.MetricsType.YMetrics) {
            	this.userSize = new JenScript.BigNumber(proj.getUserHeight()+'');
            	JenScript.BigNumber.config({ ROUNDING_MODE : JenScript.BigNumber.ROUND_CEIL });
                var bd1 = new JenScript.BigNumber(proj.getMinY()+'').divide(this.factor);
                var bi1 = new JenScript.BigNumber(bd1.toFixed(0));
                this.ref = new JenScript.BigNumber(bi1).multiply(this.factor);
                this.ref = this.ref.subtract(this.factor);
                
                if(this.ref.equals(0)){
                	this.ref = this.ref.subtract(this.factor);
                }
                this.pixelSize = new JenScript.BigNumber(proj.getPixelHeight()+'');
                this.maxValue = new JenScript.BigNumber(proj.getMaxY()+'');
            }
            JenScript.BigNumber.config({ ROUNDING_MODE : JenScript.BigNumber.ROUND_HALF_EVEN });
            var s = (this.ref.toNumber()+'').length;
            if(this.solveType === 'major')
            	this.pixelLabelHolder = 3/4*s*this.metricsManager.metricsPlugin.median.tickTextFontSize;
            else if(this.solveType === 'median')
            	this.pixelLabelHolder = 3/4*s*this.metricsManager.metricsPlugin.median.tickTextFontSize;
            else if(this.solveType === 'minor')
            	this.pixelLabelHolder = 8;
        },
        
    
        
		 /**
         * return true if this model is applicable, false otherwise
         * @return {Boolean} true if this model is applicable, false otherwise
         */
        isValid : function() {
            this.solve();
            var compare = (this.userSize.divide(this.factor)).multiply(new JenScript.BigNumber(this.pixelLabelHolder)).compareTo(this.pixelSize);
            return (compare === -1) ? true: false;
        }
	});
})();
(function(){

	
	 
	/**
	 * modeled metrics manager generate metrics based on exponent models
	 */
	JenScript.MetricsManagerModeled = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MetricsManagerModeled, JenScript.MetricsManager);
	JenScript.Model.addMethods(JenScript.MetricsManagerModeled, {
		/**
		 * init modeled metrics manager
		 */
		_init : function(config){
			config = config ||{};
			JenScript.MetricsManager.call(this,config);
			this.metricsModels = [];
		},
		
		/**
	     * create symmetric list model for given exponent (from -exponent to +exponent list model)
	     * @param {Object} exp  the reference exponent model
	     * @return {Object} a new collection of exponent model from -exp to +exp
	     */
	    createSymmetricListModel : function(exp) {
	        var models =[];
	        for (var i = -exp; i <= exp; i++) {
	            var m = this.createExponentModel(i);
	            models[models.length]=m;
	        }
	        return models;
	    },
		
	    /**
	     * create standard exponent model {@link MetricsModel} with the given exponent
	     * @param {Object} exp  the reference exponent model
	     * @return {Object} a new exponent model
	     */
	    createExponentModel : function(exp) {
	        var model = undefined;
	        var mutPattern = '';
	        if (exp < 0) {
	            mutPattern = mutPattern+"0.";
	            for (var j = 1; j < Math.abs(exp); j++) {
	                mutPattern = mutPattern+"0";
	            }
	            mutPattern = mutPattern+"1";
	            var multiplier = mutPattern;
	            model = new JenScript.MetricsModel({exponent : exp,factor :new JenScript.BigNumber(multiplier)});

	        }
	        else if (exp > 0) {
	            mutPattern = mutPattern +"1";
	            for (var j = 1; j <= Math.abs(exp); j++) {
	            	mutPattern = mutPattern+"0";
	            }
	            var multiplier = mutPattern;
	            model = new JenScript.MetricsModel({exponent : exp,factor:new JenScript.BigNumber(multiplier)});

	        }
	        else if (exp == 0) {
	            model = new JenScript.MetricsModel({exponent : 0,factor : new JenScript.BigNumber("1")});
	        }
	        return model;
	    },
		
		
		
	    /**
	     * register the given model
	     * @param {Object} model
	     */
	    registerMetricsModel :  function(model) {
	    	model.setMetricsManager(this);
	    	this.metricsModels[this.metricsModels.length] = model;
	        this.metricsModels.sort(function(m1,m2){
	        	return m1.factor.compareTo(m2.factor);
	        });
	    },

	    /**
	     * register the given model array
	     * @param {Object} models array
	     */
	    registerMetricsModels : function(models) {
	        for (var i = 0; i < models.length; i++) {
	            this.registerMetricsModel(models[i]);
	        }
	    },
	    
	    /**
	     * get all generated metrics based on the registered exponent model
	     */
	    getDeviceMetrics : function(){
	    	var m1=[];
	    	var m2=[];
	    	var m3=[];
			for (var m = 0; m < this.metricsModels.length; m++) {
				var valid = this.metricsModels[m].isValid();
				if(valid){
					//console.log("Apply exponent model: "+this.metricsModels[m].exponent);
					m1 = this.metricsModels[m].generateMetrics();
					var filterm1 = function(mf){
						 for (var f = 0; f < m1.length; f++) {
							 if(mf.userValue === m1[f].userValue)
								 return true;
						 }
						 return false;
					 };
					
					 if(m1.length < 4){
						var mf2 = this.metricsModels[m].generateMedianMetrics();
						for (var a = 0; a < mf2.length; a++) {
							if(!filterm1(mf2[a])){
								//mf2[a].median = true;
								m2[m2.length] = mf2[a];
							}
						}
					 }
					 var filterm2 = function(mf){
						 for (var f = 0; f < m2.length; f++) {
							 if(mf.userValue === m2[f].userValue)
								 return true;
						 }
						 return false;
					 };
					 
					 var subModel = this.createExponentModel((this.metricsModels[m].exponent-1));
					 subModel.setMetricsManager(this);
					 subModel.solveType = 'minor';
					 if(subModel.isValid()){
						var subMetrics = subModel.generateMetrics();
						for (var i = 0; i < subMetrics.length; i++) {
							if(!filterm1(subMetrics[i]) && !filterm2(subMetrics[i])){
								subMetrics[i].minor = true;
								m3[m3.length] = subMetrics[i];
							}
						}
					 }
					 return [].concat(m1,m2,m3);
				}
			}
	    },

	    /**
	     * generat metrics for the given value
	     * @param  {Number} userValue the user value for this metrics
	     * @param  {Number} model the given exponent model
	     * @return {Object} return new metrics
	     */
	    generateMetrics : function (userValue, model) {
	        var metrics = new JenScript.Metrics({metricsType:this.getMetricsType()});
	        var proj = this.getProjection();
	        var deviceValue = 0;
	        var maxPixelValue = 0;
	        if (this.getMetricsType() === JenScript.MetricsType.XMetrics) {
	            deviceValue = proj.userToPixelX(userValue);
	            maxPixelValue = proj.getPixelWidth();
	        }
	        else if (this.getMetricsType() === JenScript.MetricsType.YMetrics) {
	            deviceValue = proj.userToPixelY(userValue);
	            maxPixelValue = proj.getPixelHeight();
	        }

	        if (deviceValue < 0 || deviceValue > maxPixelValue) {
	            return undefined;
	        }

	        metrics.setDeviceValue(deviceValue);
	        metrics.setUserValue(userValue);
	        
//	        console.log("generate 1 metric for value label: "+metrics.label+" with type : "+this.getMetricsType() +" with model exponent :"+model.exponent);
//	        metrics.setLockLabel(isLockLabel());
//	        metrics.setLockMarker(isLockMarker());

	        return metrics;
	    }
	});
})();
(function(){

	/**
	 * time metrics model takes the responsibility to create time metrics based on time model
	 */
	JenScript.TimeModel = function(config) {
		//TimeModel
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.TimeModel, {
		/**
		 * init metrics model
		 */
		init : function(config){
			config = config||{};
	        /**time model*/
	        this.millis = config.millis;
	        /** metrics manager */
	        this.metricsManager;
	        /** the model name  */
	        this.name = config.name;
	        /** the model family name */
	        this.familyName = config.familyName;
	        /** pixel label holder */
	        this.pixelLabelHolder = (config.pixelLabelHolder !== undefined )?config.pixelLabelHolder : 18;
	        /**minimal*/
	        this.minimal = (config.minimal !== undefined)?config.minimal : false;
	        /**unit*/
	        this.unit;
	        /**user formater*/
	        this.format = config.format;
		},
		
		/**
         * @param 
         */
        setFormat : function(format) {
             this.format = format;
        },
        
        /**
         * @return the format
         */
        getFormat : function() {
            return this.format;
        },
		
		/**
         * @return the millis
         */
        getMillis : function() {
            return this.millis;
        },
		
		/**
		 * get metrics manager of this model
		 * @returns {Object} metrics manager
		 */
		getMetricsManager : function(){
			return this.metricsManager;
		},
		
		/**
		 * set metrics manager of this model
		 * @param {Object} metrics manager
		 */
		setMetricsManager : function(metricsManager){
			this.metricsManager = metricsManager;
		},
		
		/**
		 * override this method to provide metrics for this model 
		 */
		generateMetrics : function() {return[];},
		
		
		/**
		 * override this method to provide minify of this model 
		 */
		getMinify : function() {
			var conf = {};
    		conf.millis =  this.millis;
    		conf.name = this.name+ ' minified';
    		conf.familyName = this.familyName;
    		conf.unit = this.unit;
    		conf.pixelLabelHolder = 4;
    		conf.minimal = true;
    		var minifyModel = new JenScript.TimeModel(conf);
    		minifyModel.generateMetrics = this.generateMetrics;
			return minifyModel;
		},
		
	});
})();
(function(){
	/**
	 * abstract minute model based on time model
	 */
	JenScript.MinuteModel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MinuteModel, JenScript.TimeModel);
	JenScript.Model.addMethods(JenScript.MinuteModel, {
		/**
		 * init minute model
		 */
		_init : function(config){
			config = config ||{};
			config.familyName = 'Minute Model';
			config.unit = 'minute';
			this.minuteMultiplier=config.minuteMultiplier;
			config.millis = 1000*60*this.minuteMultiplier;
			JenScript.TimeModel.call(this,config);
		},
		
//		getMinify : function() {
//			var conf = {};
//    		conf.millis =  this.millis;
//    		conf.name = this.name+ ' minified';
//    		conf.familyName = this.familyName;
//    		conf.unit = this.unit;
//    		conf.pixelLabelHolder = 4;
//    		conf.minimal = true;
//    		conf.minuteMultiplier = this.minuteMultiplier;
//			return new JenScript.MinuteModel(conf);
//		},
		
        generateMetrics : function() {
            var proj = this.getMetricsManager().getTimingProjection();
            var cal = new Date(proj.getMinDate());
            var ref = new Date(cal.getFullYear(),cal.getMonth(),cal.getDate(),cal.getHours(),0,0,0);
            //console.log("generic call generate metrics for model : "+this.name);
            //console.log("minute multiplier def : : "+this.minuteMultiplier);
            var points = this.getMetricsManager().generateMinutesPoint(ref,(proj.durationMinutes()+cal.getMinutes()),this.minuteMultiplier,this);
            for (var p = 0; p < points.length; p++) {
            	if(this.format){
            		var that = this;
                	if(!this.minimal){
                		points[p].format = function (){
                    		return that.format(this.getTime());
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}else{
            		if(!this.minimal){
            			points[p].format = function (){
                    		return this.getTime().getMinutes();
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}
			}
            return points;
        }
	});
	

	/**
	 * one 1 minute model based on time model
	 */
	JenScript.Minute1Model = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Minute1Model, JenScript.MinuteModel);
	JenScript.Model.addMethods(JenScript.Minute1Model, {
		/**
		 * init 1 minute model
		 */
		__init : function(config){
			config = config ||{};
			config.minuteMultiplier = 1;
			config.name = '1 minute model';
			JenScript.MinuteModel.call(this,config);
		},
	});
	
	
	/**
	 * 10 minutes model based on time model
	 */
	JenScript.Minute10Model = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Minute10Model, JenScript.MinuteModel);
	JenScript.Model.addMethods(JenScript.Minute10Model, {
		/**
		 * init 10 minutes model
		 */
		__init : function(config){
			config = config ||{};
			config.minuteMultiplier = 10;
			config.name = '10 minute model';
			JenScript.MinuteModel.call(this,config);
		},
		
	});
	
	
	/**
	 * 15 minutes model based on time model
	 */
	JenScript.Minute15Model = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Minute15Model, JenScript.MinuteModel);
	JenScript.Model.addMethods(JenScript.Minute15Model, {
		/**
		 * init 15 minutes model
		 */
		__init : function(config){
			config = config ||{};
			config.minuteMultiplier = 15;
			config.name = '15 minute model';
			JenScript.MinuteModel.call(this,config);
		},
		
	});
	
	
	/**
	 * 20 minutes model based on time model
	 */
	JenScript.Minute20Model = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Minute20Model, JenScript.MinuteModel);
	JenScript.Model.addMethods(JenScript.Minute20Model, {
		/**
		 * init 20 minutes model
		 */
		__init : function(config){
			config = config ||{};
			config.minuteMultiplier = 20;
			config.name = '20 minute model';
			JenScript.MinuteModel.call(this,config);
		},
		
	});
	
	
	/**
	 * one hour model based on time model
	 */
	JenScript.HourModel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.HourModel, JenScript.TimeModel);
	JenScript.Model.addMethods(JenScript.HourModel, {
		/**
		 * init minute model
		 */
		_init : function(config){
			config = config ||{};
			config.millis = 1000*60*60;
			config.name = 'one hour';
			config.familyName = 'hour model';
			config.unit = 'hour';
			JenScript.TimeModel.call(this,config);
		},
		
        generateMetrics : function() {
            var time = this.getMetricsManager().getTimingProjection();
            var cal = new Date(time.getMinDate());
            var ref = new Date(cal.getFullYear(),cal.getMonth(),cal.getDate(),cal.getHours(),0,0,0);
            var points = this.getMetricsManager().generateHoursPoint(ref,time.durationHours(),1,this);
            for (var p = 0; p < points.length; p++) {
            	if(this.format){
            		var that = this;
                	if(!this.minimal){
    	            	points[p].format = function (){
    	            		return that.format(this.getTime());
    	            	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}else{
            		if(!this.minimal){
    	            	points[p].format = function (){
    	            		return this.getTime().getHours();
    	            	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}
            	
			}
            return points;
        }
	});
	
	
	/**
	 * one day model based on time model
	 */
	JenScript.DayModel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.DayModel, JenScript.TimeModel);
	JenScript.Model.addMethods(JenScript.DayModel, {
		/**
		 * init day model
		 */
		_init : function(config){
			config = config ||{};
			config.millis = 1000*60*60*24;
			config.name = 'one day';
			config.familyName = 'day model';
			config.unit = 'day';
			config.pixelLabelHolder = (config.pixelLabelHolder !== undefined)?config.pixelLabelHolder : 30;
			JenScript.TimeModel.call(this,config);
		},
		
        generateMetrics : function() {
            var time = this.getMetricsManager().getTimingProjection();
            var cal = new Date(time.getMinDate());
            var ref = new Date(cal.getFullYear(),cal.getMonth(),cal.getDate(),12,0,0);
            var points = this.getMetricsManager().generateDaysPoint(ref,time.durationDays(),1,this);
            for (var p = 0; p < points.length; p++) {
            	if(this.format){
            		var that = this;
                	if(!this.minimal){
    	            	points[p].format = function (){
    	            		return that.format(this.getTime());
    	            	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}else{
            		if(!this.minimal){
            			points[p].format = function (){
                    		var shortMonthNames = [ "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
                    		                   "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec." ];
                    		
                    		return shortMonthNames[this.getTime().getMonth()]+','+this.getTime().getDate();
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            		
            	}
            	
			}
            return points;
        }
	});
	
	

	/**
	 * one month model based on time model
	 */
	JenScript.MonthModel = function(config) {
		//MonthModel
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MonthModel, JenScript.TimeModel);
	JenScript.Model.addMethods(JenScript.MonthModel, {
		/**
		 * init month model
		 */
		_init : function(config){
			config = config ||{};
			config.millis =  1000 * 60*60*24*7*4;
			config.name = 'one month';
			config.familyName = 'month model';
			config.unit = 'month';
			config.pixelLabelHolder = (config.pixelLabelHolder !== undefined)?config.pixelLabelHolder : 40;
			JenScript.TimeModel.call(this,config);
		},
		
        generateMetrics : function() {
            var time = this.getMetricsManager().getTimingProjection();
            var cal = new Date(time.getMinDate());
            var ref = new Date(cal.getFullYear(),cal.getMonth(),1,0,0,0);//first day of month
            var points = this.getMetricsManager().generateMonthsPoint(ref,time.durationMonth(),1,this);
            for (var p = 0; p < points.length; p++) {
            	if(this.format){
            		var that = this;
                	if(!this.minimal){
                		points[p].format = function (){
                    		return that.format(this.getTime());
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}else{
            		if(!this.minimal){
            			points[p].format = function (){
            				var shortMonthNames = [ "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
                         		                   "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec." ];
                         		
                         		return shortMonthNames[this.getTime().getMonth()]+' '+this.getTime().getFullYear();
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}
			}
            return points;
        }
	});
	
	
	/**
	 * one year model based on time model
	 */
	JenScript.YearModelOLD = function(config) {
		//YearModel
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.YearModelOLD, JenScript.TimeModel);
	JenScript.Model.addMethods(JenScript.YearModelOLD, {
		/**
		 * init year model
		 */
		_init : function(config){
			config = config ||{};
			config.millis =  1000*60*60*24*31*12;
			config.name = 'one year';
			config.familyName = 'year model';
			config.unit = 'year';
			config.pixelLabelHolder = (config.pixelLabelHolder !== undefined)?config.pixelLabelHolder : 30;
			JenScript.TimeModel.call(this,config);
		},
		
        generateMetrics : function() {
            var time = this.getMetricsManager().getTimingProjection();
            var cal = new Date(time.getMinDate());
            var ref = new Date(cal.getFullYear(),0,1,0,0,0);//first day of year
            var points = this.getMetricsManager().generateMonthsPoint(ref,time.durationMonth(),12,this);
            for (var p = 0; p < points.length; p++) {
            	if(this.format){
            		var that = this;
                	if(!this.minimal){
                		points[p].format = function (){
                    		return that.format(this.getTime());
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}else{
            		if(!this.minimal){
            			points[p].format = function (){
                    		return this.getTime().getFullYear();
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}
			}
            return points;
        }
	});
	
	
	/**
	 * one year model based on time model
	 */
	JenScript.YearModel = function(config) {
		//YearModel
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.YearModel, JenScript.TimeModel);
	JenScript.Model.addMethods(JenScript.YearModel, {
		/**
		 * init year model
		 */
		_init : function(config){
			config = config ||{};
			this.yearMultiplier = (config.yearMultiplier !== undefined)?config.yearMultiplier:1;
			config.millis =  1000*60*60*24*365*this.yearMultiplier;
			config.name = 'one year';
			config.familyName = 'year model';
			config.unit = 'year';
			config.pixelLabelHolder = (config.pixelLabelHolder !== undefined)?config.pixelLabelHolder : 30;
			JenScript.TimeModel.call(this,config);
		},
		
        generateMetrics : function() {
            var time = this.getMetricsManager().getTimingProjection();
            var cal = new Date(time.getMinDate());
            var ref = new Date(cal.getFullYear(),0,1,0,0,0);//first day of year
            var points = this.getMetricsManager().generateYearsPoint(ref,time.durationYear(),this.yearMultiplier,this);
            for (var p = 0; p < points.length; p++) {
            	if(this.format){
            		var that = this;
                	if(!this.minimal){
                		points[p].format = function (){
                    		return that.format(this.getTime());
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}else{
            		if(!this.minimal){
            			points[p].format = function (){
                    		return this.getTime().getFullYear();
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}
			}
            return points;
        }
	});
	
})();
(function(){

	
	/**
	 * time metrics manager generate metrics based on timing models
	 */
	JenScript.TimeMetricsManager = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TimeMetricsManager, JenScript.MetricsManager);
	JenScript.Model.addMethods(JenScript.TimeMetricsManager, {
		/**
		 * initialize timing metrics manager
		 */
		_init : function(config){
			config = config ||{};
			JenScript.MetricsManager.call(this,config);
			this.timingModels = [];
			
			if(config.models !== undefined){
				for (var m = 0; m < config.models.length; m++) {
					var model = config.models[m];
					this.registerModel(model);
				}
			}
		},
		
		/**
		 * register time model
		 */
		registerModel : function(model){
			model.setMetricsManager(this);
			this.timingModels[this.timingModels.length] = model;
		},
		
		/**
	     * get the applicable sequence metrics timing according to managers timing models
	     * 
	     * @return timing sequence
	     */
	    getTimingSequence : function() {
	    	var sequence = [];
	        var timeProjection = this.getTimingProjection();
	        this.timingModels.sort(function (tm1, tm2) {
	        	 if (tm1.getMillis() > tm2.getMillis()) {
	                 return 1;
	             }
	             else if (tm1.getMillis() > tm2.getMillis()) {
	                 return -1;
	             }
	             else {
	                   return 0;
	             }
	        });
	        //console.log("count timing models : "+this.timingModels.length);
	        for (var m = 0; m < this.timingModels.length; m++) {
	        	var  timingModel = this.timingModels[m];
	        	//console.log("check timing model : "+timingModel.name+" with pixel holder: "+timingModel.pixelLabelHolder);
	        	var projTimeMillis = timeProjection.durationMillis();
	        	var modelTimeMillis = timingModel.getMillis();
	        	
	        	//in normal mode ?
	        	if ((projTimeMillis / modelTimeMillis) * timingModel.pixelLabelHolder < timeProjection.getTimeDurationPixel()) {
	        		//console.log("accept model : "+timingModel.name);
	            	sequence[sequence.length] = timingModel;
	            }//in minimal with 4 pixel holder ?
	        	else if ((projTimeMillis / modelTimeMillis) * 4 < timeProjection.getTimeDurationPixel()) {
	        		//console.log("accept minified model : "+timingModel.name);
	        		var minifyModel = timingModel.getMinify();
	            	sequence[sequence.length] = minifyModel;
	            }else{
	            	//console.log("non accept model : "+timingModel.name);
	            }
	        	if(sequence.length >= 3) return sequence;
	        }
	        return sequence;
	    },
		
		
		 /**
	     * get all generated metrics based on the registered exponent model
	     */
	    getDeviceMetrics : function(){
	    	
	    	var models = this.getTimingSequence();
	    	//console.log("getDeviceMetrics with timing sequence model count "+models.length);
	    	var metrics = [];
	    	var sequenceCount = models.length;
	    	
	    	var perfomFilter = function(met){
	    		var filteredMetrics = [];
	    		//console.log("compare for total metrics : "+metrics.length);
	    		for (var m = 0; m < metrics.length; m++) {
	    			//console.log("compare = "+metrics[m].userValue+" with "+met.userValue);
					if(metrics[m].userValue === met.userValue){
						//console.log('remove metrics : '+metrics[m].userValue+" ,"+metrics[m].format());
					}
					else{
						filteredMetrics[filteredMetrics.length] = metrics[m];
					}
				}
	    		metrics = filteredMetrics;
	    	};
	    	
	    	var makeMinor = function (metrics){
	    		for (var gm = 0; gm < metrics.length; gm++) {
	    			var met = metrics[gm];
	    			met.minor=true;met.median=false;met.major=false;
	    		}
	    	};
	    	var makeMedian = function (metrics){
	    		for (var gm = 0; gm < metrics.length; gm++) {
	    			var met = metrics[gm];
	    			met.minor=false;met.median=true;met.major=false;
	    		}
	    	};
	    	var makeMajor = function (metrics){
	    		for (var gm = 0; gm < metrics.length; gm++) {
	    			var met = metrics[gm];
	    			met.minor=false;met.median=false;met.major=true;
	    		}
	    	};
	    	if(sequenceCount === 1){
	    		//console.log('sequence strategy : 1 '+models[0].name);
	    		models[0].setMetricsManager(this);
	    		var metrics1 = models[0].generateMetrics();
	    		if(models[0].minimal)
	    			makeMinor(metrics1);
	    		else
	    			makeMajor(metrics1);
	    		metrics = metrics.concat(metrics1);
	    	}
	    	else if(sequenceCount === 2){
	    		//console.log('sequence strategy : 2 '+models[0].name);
	    		models[0].setMetricsManager(this);
	    		models[1].setMetricsManager(this);
	    		var metrics1 = models[0].generateMetrics();
	    		var metrics2 = models[1].generateMetrics();
	    		if(models[0].minimal){
	    			makeMinor(metrics1);
	    			makeMajor(metrics2);
	    		}else{
	    			makeMedian(metrics1);
	    			makeMajor(metrics2);
	    		}
	    		
	    		metrics = metrics.concat(metrics1);
	    		for (var i = 0; i < metrics2.length; i++) {
					var m = metrics2[i];
					perfomFilter(m);
				}
	    		metrics = metrics.concat(metrics2);
	    	}
	    	else if(sequenceCount === 3){
	    		//console.log('sequence strategy : 3 '+models[0].name);
	    		
	    		models[0].setMetricsManager(this);
	    		models[1].setMetricsManager(this);
	    		models[2].setMetricsManager(this);
	    		
	    		var metrics1 = models[0].generateMetrics();
	    		var metrics2 = models[1].generateMetrics();
	    		var metrics3 = models[2].generateMetrics();
	    		
	    		//console.log("models generation ok");
	    		
	    		makeMinor(metrics1);
	    		metrics = metrics.concat(metrics1);
	    		//console.log("minor generation ok : "+metrics.length);
	    		
	    		makeMedian(metrics2);
//	    		for (var i = 0; i < metrics2.length; i++) {
//					var m = metrics2[i];
//					//perfomFilter(m);
//				}
	    		metrics = metrics.concat(metrics2);
	    		//console.log("median generation ok : "+metrics.length);
	    		
	    		makeMajor(metrics3);
	    		//console.log("major m3 size : "+metrics3.length);
	    		for (var j = 0; j < metrics3.length; j++) {
					var m = metrics3[j];
					//console.log('compare m3 : '+m.format());
					perfomFilter(m);
				}
	    		//console.log("median after filter ok : "+metrics.length);
	    		
	    		metrics = metrics.concat(metrics3);
	    		//console.log("major generation ok : "+metrics.length);
	    		
	    	}
	    	return metrics;
	    },

		
		/**
	     * get the window worker
	     * 
	     * @return time window
	     */
	    getTimingProjection : function() {
	        var proj = this.getProjection();
	        if (proj instanceof JenScript.LinearProjection) {
	            if (this.getMetricsType() === JenScript.MetricsType.XMetrics) {
	            	
	                var timeX = new JenScript.TimeXProjection(
	                					{
	                						minXDate : new Date(proj.getMinX()),
	                                        maxXDate : new Date(proj.getMaxX()),
	                                        minY : proj.getMinY(),
	                                        maxY : proj.getMaxY()
	                                    }
	                );
	                timeX.setView(proj.getView());
	                return timeX;
	            }
	            else if (this.getMetricsType() == JenScript.MetricsType.YMetrics) {
	            	var timeY =  new JenScript.TimeYProjection(
	            				{
	            					minX : proj.getMinX(),
	            					maxX : proj.getMaxX(),
	            					minYDate : new Date(proj.getMinY()),
	                                maxYDate : new Date(proj.getMaxY())                   
	            				}		
	            	);
	                timeY.setView(proj.getView());
	                return timeY;
	            }
	        }
	        else if (proj instanceof JenScript.TimeXProjection || proj instanceof JenScript.TimeYProjection) {
	            return  proj;
	        }
	        return undefined;
	    },
	    
	    /**
	     * generate a metrics for the given calendar
	     * 
	     * @param time
	     *            the time for this metrics
	     * @return metrics
	     */
	    generateMetricsPoint : function(time,model) {
	        var metrics = new JenScript.TimePointMetrics({metricsType:this.getMetricsType()});
	        metrics.setTime(time);
	        var userValue = time.getTime();
	        var timingWindow = this.getTimingProjection();
	        var deviceValue = timingWindow.timeToPixel(time);
	        var max = timingWindow.getTimeDurationPixel();
	        if (deviceValue < 0 || deviceValue > max){
	            return undefined;
	        }
	        metrics.setDeviceValue(deviceValue);
	        metrics.setUserValue(userValue);
	        return metrics;
	    },

	    /**
	     * generate metrics duration for the given start and end time
	     * 
	     * @param startTime
	     *            the start time of the duration
	     * @param endTime
	     *            the end time of the duration
	     * @return time duration
	     */
	    generateMetricsDuration : function(startTime,endTime,model) {
	        var pointStart = this.generateMetricsPoint(startTime, model);
	        var pointEnd = this.generateMetricsPoint(endTime, model);

	        var centerMillis = startTime.getTime() + (endTime.getTime() - startTime.getTime()) / 2;
	       
	        var middleTime = new Date(centerMillis);

	        var durationMetrics = new JenScript.TimeDurationMetrics(this.getMetricsType());
	        var userValue = middleTime.getTime();
	        var timingWindow = getTimingProjection();
	        var deviceValue = timingWindow.timeToPixel(middleTime);
	        var max = timingWindow.getTimeDurationPixel();

	        if (deviceValue < 0 || deviceValue > max)
	            return null;

	        durationMetrics.setDeviceValue(deviceValue);
	        durationMetrics.setUserValue(userValue);
	       
	        durationMetrics.setMetricsStart(pointStart);
	        durationMetrics.setMetricsEnd(pointEnd);
	        durationMetrics.setTimeStart(startTime.getTime());
	        durationMetrics.setTimeEnd(endTime.getTime());

	        return durationMetrics;
	    },


	    /**
	     * generate seconds from reference for the given duration and seconds increment
	     * 
	     * @param ref
	     * @param duration
	     * @param secondIncrement
	     * @return seconds metrics
	     */
	    generateSecondsPoint : function(ref,duration,secondIncrement,model) {
	    	var seconds = [];
	        for (var i = 0; i <= parseInt(duration) + 1; i = i + secondIncrement) {
	            var c = new Date(ref.getFullYear(),ref.getMonth(),ref.getDate(),ref.getHours(),ref.getMinutes(),ref.getSeconds()+i,0);
	            var m = this.generateMetricsPoint(c,model);
	            if (m != undefined) {
	            	seconds[seconds.length] = m;
	            }
	        }
	        return seconds;
	    },

	    /**
	     * generate minutes from reference for the given duration and minute increment
	     * 
	     * @param ref
	     * @param durationMinutes
	     * @param minuteIncrement
	     * @return minutes metrics
	     */
	    generateMinutesPoint : function(ref,durationMinutes,minuteIncrement,model) {
	    	//console.log('>>> generate minute points for model : '+model.name+' with ref :  '+ref +' and duration minutes : '+durationMinutes);
	    	var minutes = [];
	        for (var i = 0; i <= (parseInt(durationMinutes)); i = i + minuteIncrement) {
	            var c = new Date(ref.getFullYear(),ref.getMonth(),ref.getDate(),ref.getHours(),(ref.getMinutes()+i),0,0);
	            var m = this.generateMetricsPoint(c,model);
	            if (m !== undefined) {
	                minutes[minutes.length] = m;
	            }
	        }
	        return minutes;
	    },

	  
	    /**
	     *  generate hours from reference for the given duration and hours increment
	     * @param ref
	     * @param durationHours
	     * @param hoursIncrement
	     * @param model
	     * @return time point metrics collection
	     */
	    generateHoursPoint : function(ref,durationHours,hoursIncrement,model) {
	    	var hours = [];
	        for (var i = 0; i <= parseInt(durationHours) + 1; i = i + hoursIncrement) {
	            var c = new Date(ref.getFullYear(),ref.getMonth(),ref.getDate(),ref.getHours()+i,ref.getMinutes(),0,0);
	            var m = this.generateMetricsPoint(c,model);
	            if (m != undefined) {
	            	hours[hours.length] = m;
	            }
	        }
	        return hours;
	    },

	    /**
	     * generate days from reference for the given duration and days increment
	     * 
	     * @param ref
	     * @param durationDays
	     * @param daysIncrement
	     * @return days metrics
	     */
	    generateDaysPoint : function(ref,durationDays,daysIncrement,model) {
	        var days = [];
	        for (var i = 0; i <= parseInt(durationDays) + 1; i = i + daysIncrement) {
	            var c = new Date(ref.getFullYear(),ref.getMonth(),ref.getDate()+i,ref.getHours(),0,0,0);
	            var m = this.generateMetricsPoint(c,model);
	            if (m != undefined) {
	            	days[days.length] = m;
	            }
	        }
	        return days;
	    },

	    /**
	     * generate months from reference for the given duration and months increment
	     * 
	     * @param ref
	     * @param durationMonth
	     * @param monthsIncrement
	     * @return months metrics
	     */
	    generateMonthsPoint : function(ref,durationMonth,monthsIncrement,model) {
	        var days = [];
	        for (var i = 0; i <= parseInt(durationMonth) + 12 + 1; i = i + monthsIncrement) {
	        	var c = new Date(ref.getFullYear(),ref.getMonth()+i,1,0,0,0);
	            var m = this.generateMetricsPoint(c, model);
	            if (m != undefined) {
	            	days[days.length] = m;
	            }
	        }
	        return days;
	    },
	    
	    /**
	     * generate years from reference for the given duration and months increment
	     * 
	     * @param ref
	     * @param durationYears
	     * @param yearsIncrement
	     * @return years metrics
	     */
	    generateYearsPoint : function(ref,durationYears,yearsIncrement,model) {
	        var years = [];
	        for (var i = 0; i <= parseInt(durationYears); i = i + yearsIncrement) {
	        	var c = new Date(ref.getFullYear()+i,0,1,0,0,0);
	            var m = this.generateMetricsPoint(c, model);
	            if (m != undefined) {
	            	years[years.length] = m;
	            }
	        }
	        return years;
	    },
	});
})();
(function(){

	JenScript.MetricsManagerStatic = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MetricsManagerStatic, JenScript.MetricsManager);
	JenScript.Model.addMethods(JenScript.MetricsManagerStatic, {
		_init : function(config){
			config = config ||{};
			this.metricsCount = config.metricsCount;
			JenScript.MetricsManager.call(this,config);
		},
		
		getDeviceMetrics : function(){
			var metrics = [];
	        var proj = this.getProjection();
	        var userWidth = proj.getUserWidth();
	        var userHeight = proj.getUserHeight();
	        if (this.getMetricsType() === JenScript.MetricsType.XMetrics) {
	            var userMetricsX;
	            for (var i = 0; i < this.metricsCount; i++) {
	                userMetricsX = proj.getMinX() + i * userWidth /(this.metricsCount - 1);
	                var pixelMetricsX = proj.userToPixelX(userMetricsX);
	                var m = new JenScript.Metrics({metricsType:JenScript.MetricsType.XMetrics});
	                m.setDeviceValue(pixelMetricsX);
	                m.setUserValue(userMetricsX);
 	                m.format = function(){
	                	return this.userValue;
	                };
	                metrics[metrics.length]=m;
	            }

	        }
	        else if (this.getMetricsType()  === JenScript.MetricsType.YMetrics) {
	            var userMetricsY;
	            for (var i = 0; i < this.metricsCount; i++) {
	                userMetricsY = proj.getMinY() + i * userHeight / (this.metricsCount - 1);
	                var pixelMetricsY = proj.userToPixelY(userMetricsY);
	                var m = new JenScript.Metrics({metricsType:JenScript.MetricsType.YMetrics});
	                m.setDeviceValue(pixelMetricsY);
	                m.setUserValue(userMetricsY);
	                m.format = function(){
	                	return this.userValue;
	                };
	                metrics[metrics.length]=m;
	            }

	        }
			return metrics;
		}
	});

})();
(function(){

	JenScript.MetricsManagerFree = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MetricsManagerFree, JenScript.MetricsManager);
	JenScript.Model.addMethods(JenScript.MetricsManagerFree, {
		_init : function(config){
			config = config ||{};
			this.inputMetrics = [];
			JenScript.MetricsManager.call(this,config);
		},
		
		/**
		 * add metrics with specified parameter
		 * 
		 * @param {Number} value
		 *          metric value
		 * @param {String} label
		 * 			metric label
		 */
		addMetrics : function(value,label) {
		    this.inputMetrics.push({value : value, label : label});
		},
		
		getDeviceMetrics : function(){
			var metrics = [];
	        var proj = this.getProjection();
	        var userWidth = proj.getUserWidth();
	        var userHeight = proj.getUserHeight();
	        
	        if (this.getMetricsType() === JenScript.MetricsType.XMetrics) {
	        	for (var i = 0; i < this.inputMetrics.length; i++) {
	                var t = this.inputMetrics[i];
	                var userMetricsX = t.value;
	                if (userMetricsX >= proj.getMinX() && userMetricsX <= proj.getMaxX()) {
	                    var pd = proj.userToPixelX(userMetricsX);
	                    var m = new JenScript.Metrics({metricsType:JenScript.MetricsType.XMetrics});
	                   
	                    m.setDeviceValue(pd);
	                    m.setUserValue(userMetricsX);
	                    m.label = t.label;
	                    if(t.label === undefined)
		                    m.format = function(){
			                	return this.userValue;
			                };
		                else
		                	m.format = function(){
		                		return this.label;
		                	};
		                metrics[metrics.length]=m; 
	                }
	            }
	        }
	        else if (this.getMetricsType()  === JenScript.MetricsType.YMetrics) {
	        	  for (var i = 0; i < this.inputMetrics.length; i++) {
	                  var t = this.inputMetrics[i];
	                  var userMetricsY = t.value;
	                  if (userMetricsY > proj.getMinY() && userMetricsY < proj.getMaxY()) {
	                      var pd = proj.userToPixelY(userMetricsY);
	                      var m = new JenScript.Metrics({metricsType:JenScript.MetricsType.YMetrics});
	                      m.setDeviceValue(pd);
	                      m.setUserValue(userMetricsY);
	                      m.label = t.label;
	                      if(t.label === undefined)
			                    m.format = function(){
				                	return this.userValue;
				                };
			                else
			                	m.format = function(){
			                		return this.label;
			                	};
			              metrics[metrics.length]=m; 
	                  }
	        	  }
	        }
	        return metrics;
	}
});

})();
(function(){

	JenScript.MetricsManagerFlow = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MetricsManagerFlow, JenScript.MetricsManager);
	JenScript.Model.addMethods(JenScript.MetricsManagerFlow, {
		_init : function(config){
			config = config ||{};
			this.flowStart = config.flowStart;
		    this.flowEnd = config.flowEnd;
		    this.flowInterval = config.flowInterval;
			this.inputMetrics = [];
			JenScript.MetricsManager.call(this,config);
		},
		
		getDeviceMetrics : function(){
			var metrics = [];
	        var proj = this.getProjection();
	        var userWidth = proj.getUserWidth();
	        var userHeight = proj.getUserHeight();
	        

	        if(this.flowEnd <= this.flowStart)
	        	throw new Error("metrics flow end should be greater than metrics flow start");
	        
	        var start    = new JenScript.BigNumber(this.flowStart+"");
	        var end      = new JenScript.BigNumber(this.flowEnd+"");
	        var interval = new JenScript.BigNumber(this.flowInterval+"");
	        var flag = true;
	        var count = 0;
	        while(flag){
	        	var increment = new JenScript.BigNumber(count);
	        	var u = start.add(increment.multiply(interval));
	        	var uv = u.toNumber();
		        if (this.getMetricsType() === JenScript.MetricsType.XMetrics) {
	        		 var dx = proj.userToPixelX(uv);
	                 var m = new JenScript.Metrics({metricsType:JenScript.MetricsType.XMetrics});
	                 m.setDeviceValue(dx);
	                 m.setUserValue(uv);
	                 //m.setUserValueAsBigDecimal(mv);
	                 //m.setMetricsLabel(format(mv));
	                 m.format = function(){
		                	return this.userValue;
		             };
	                 if (uv >= proj.getMinX()  && uv <= proj.getMaxX()) {
	                	 metrics.push(m);
	                 }
	        	}
	        	else if (this.getMetricsType() === JenScript.MetricsType.YMetrics) {
	        		 var dy = proj.userToPixelY(uv);
	                 var m = new JenScript.Metrics({metricsType:JenScript.MetricsType.YMetrics});
	                 m.setDeviceValue(dy);
	                 m.setUserValue(uv);
	                 //metrics.setUserValueAsBigDecimal(m);
	                 //metrics.setMetricsLabel(format(m));
	                 m.format = function(){
		                	return this.userValue;
		             };
	                 if (uv >= proj.getMinY()  && uv <= proj.getMaxY()) {
	                	 metrics.push(m);
	                 }
	        	}
	        	
	        	if(uv > end.toNumber())
	        		flag = false;
	        	
	        	count++;
	        }
	        
	        return metrics;
	}
});

})();
(function(){
	//Modeled metrics based on exponent model
	JenScript.AxisMetricsModeled = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AxisMetricsModeled, JenScript.AxisMetricsPlugin);

	JenScript.Model.addMethods(JenScript.AxisMetricsModeled, {
		___init : function(config){
			config = config ||{};
			var manager = new JenScript.MetricsManagerModeled(config);
			var models = manager.createSymmetricListModel(20);
			manager.registerMetricsModels(models);
			config.manager = manager;
			config.name='AxisMetricsModeled';
			JenScript.AxisMetricsPlugin.call(this,config);
		},
	});
})();
(function(){
	JenScript.AxisMetricsStatic = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AxisMetricsStatic, JenScript.AxisMetricsPlugin);

	JenScript.Model.addMethods(JenScript.AxisMetricsStatic, {
		___init : function(config){
			config = config ||{};
			var manager = new JenScript.MetricsManagerStatic(config);
			config.manager = manager;
			JenScript.AxisMetricsPlugin.call(this,config);
		},
	});
})();
(function(){
	//Timing metrics based on time model
	JenScript.AxisMetricsTiming = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AxisMetricsTiming, JenScript.AxisMetricsPlugin);

	JenScript.Model.addMethods(JenScript.AxisMetricsTiming, {
		___init : function(config){
			config = config ||{};
			var manager = new JenScript.TimeMetricsManager(config);
			config.manager = manager;
			config.name='AxisMetricsTiming';
			JenScript.AxisMetricsPlugin.call(this,config);
		},
	});
})();
(function(){
	//Modeled metrics based on manual free model
	JenScript.AxisMetricsFree = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AxisMetricsFree, JenScript.AxisMetricsPlugin);

	JenScript.Model.addMethods(JenScript.AxisMetricsFree, {
		___init : function(config){
			config = config ||{};
			var manager = new JenScript.MetricsManagerFree(config);
			config.manager = manager;
			config.name='AxisMetricsFree';
			JenScript.AxisMetricsPlugin.call(this,config);
		},
		
		addMetrics : function(value,label){
			this.getMetricsManager().addMetrics(value,label);
		},
		
	});
})();
(function(){
	//Modeled metrics based on flow model
	JenScript.AxisMetricsFlow = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AxisMetricsFlow, JenScript.AxisMetricsPlugin);

	JenScript.Model.addMethods(JenScript.AxisMetricsFlow, {
		___init : function(config){
			config = config ||{};
			var manager = new JenScript.MetricsManagerFlow(config);
			config.manager = manager;
			config.name='AxisMetricsFlow';
			JenScript.AxisMetricsPlugin.call(this,config);
		},
		
	});
})();
(function(){
	//Modeled metrics based on exponent model
	JenScript.DeviceMetricsModeled = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.DeviceMetricsModeled, JenScript.DeviceMetricsPlugin);

	JenScript.Model.addMethods(JenScript.DeviceMetricsModeled, {
		___init : function(config){
			config = config ||{};
			var manager = new JenScript.MetricsManagerModeled(config);
			var models = manager.createSymmetricListModel(20);
			manager.registerMetricsModels(models);
			config.manager = manager;
			config.name='DeviceMetrics';
			JenScript.DeviceMetricsPlugin.call(this,config);
		},
	});
})();