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