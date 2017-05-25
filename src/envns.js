/**
* @namespace JenScript
*/
var JenScript = {};


(function() {
	
		JenScript = {
				
				version : '@VERSION',
				views : [],
				sequenceId: 0,
				SVG_NS : 'http://www.w3.org/2000/svg',
				XLINK_NS : 'http://www.w3.org/1999/xlink',
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