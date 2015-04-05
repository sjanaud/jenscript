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
		        
		        selectAll: function(pattern) {
		        	var nodeList = document.querySelectorAll(pattern);
		        	return {
		        		nodes : nodeList,
		        		style : function(style){
		        			this.attr('style',style);
		        		},
		        		attr : function(name,value){
		        			console.log('typeof value:'+typeof value);
		        			if (typeof(value) == "function") {
		        				// do something
		        				alert('do something');
		        			}
		        			
		        			for (var i = 0; i < this.nodes.length; ++i) {
		        				  var n = this.nodes[i];
		        				  n.setAttribute(name,value);
		        			}
		        		},
		        	};
		        },
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
		    	
		    	//stream wrapper ?
		    	
//		    	j : {
//		    		view : function(config){
//		    			if( Object.prototype.toString.call(config) == '[object String]' ) {
//		    				   // a string
//		    				alert('string');
//		    			}else{
//		    				
//		    			}
//		    			//if(typeof config)
//						return new JenScript.View(config);
//					},
//		    	}
		    	
		    	
		};

		//EXPORT
		(function(root, factory) {
		 if(typeof exports === 'object') {
		     // Node
			 console.log('export for node');
		     module.exports = factory();
		 }
		 else if(typeof define === 'function' && define.amd) {
		     // AMD
			 console.log('export for amd');
		     define(factory);
		 }
		 else {
		     // globals UMD
		     root.returnExports = factory();
		 }
		}(this, function() {
			//really need stream style? I'am not sure...
//		    if (window === this) {
//		    	window.jenscript = JenScript.j;
//		    }
			return JenScript;
		}));
})();

//creates a global "addWheelListener" method
//example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
(function(window,document) {

 var prefix = "", _addEventListener, onwheel, support;

 // detect event model
 if ( window.addEventListener ) {
     _addEventListener = "addEventListener";
 } else {
     _addEventListener = "attachEvent";
     prefix = "on";
 }

 // detect available wheel event
 support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
           document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
           "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

 window.addWheelListener = function( elem, callback, useCapture ) {
     _addWheelListener( elem, support, callback, useCapture );
     console.log('add wheel listener  support'+support);
     // handle MozMousePixelScroll in older Firefox
     if( support == "DOMMouseScroll" ) {
         _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
     }
 };

 function _addWheelListener( elem, eventName, callback, useCapture ) {
     elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
         !originalEvent && ( originalEvent = window.event );

         console.log("support : "+support);
         
         // create a normalized event object
         var event = {
             // keep a ref to the original event object
             originalEvent: originalEvent,
             target: originalEvent.target || originalEvent.srcElement,
             type: "wheel",
             deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
             deltaX: 0,
             deltaZ: 0,
             preventDefault: function() {
                 originalEvent.preventDefault ?
                     originalEvent.preventDefault() :
                     originalEvent.returnValue = false;
             }
         };
         
         // calculate deltaY (and deltaX) according to the event
         if ( support == "mousewheel" ) {
             event.deltaY = - 1/40 * originalEvent.wheelDelta;
        	 //event.deltaY =  originalEvent.wheelDelta;
             // Webkit also support wheelDeltaX
            // originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
        	 originalEvent.wheelDeltaX && ( event.deltaX =  originalEvent.wheelDeltaX );
         } else {
             event.deltaY = - 1/40 *originalEvent.detail;
         }

         // it's time to fire the callback
         return callback( event );

     }, useCapture || false );
 }

})(window,document);