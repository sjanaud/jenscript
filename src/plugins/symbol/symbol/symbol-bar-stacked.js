(function(){
	
	JenScript.SymbolStack = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolStack, JenScript.SymbolBar);
	JenScript.Model.addMethods(JenScript.SymbolStack,{
		__init : function(config){
			config=config||{};
			JenScript.SymbolBar.call(this, config);
			 /** stacked bar symbol host */
		    this.hostSymbol;
		    /** stack relative value */
		    this.stackValue = config.stackValue;
		    /** stack normalized value */
		    this.normalizedValue;
		},
		
	    toString : function() {
	        return "Stack [hostSymbol=" + this.hostSymbol + ", stackValue=" + this.stackValue
	                + ", normalizedValue=" + this.normalizedValue + ", lockEnter="
	                + this.lockEnter + "]";
	    },

	    /**
	     * @return the stackValue
	     */
	    getStackValue : function() {
	        return this.stackValue;
	    },

	    /**
	     * @param stackValue
	     *            the stackValue to set
	     */
	    setStackValue : function(stackValue) {
	        this.stackValue = stackValue;
	    },

	    /**
	     * get normalized value of this stack
	     * 
	     * @return normalized value of this stack
	     */
	    getNormalizedValue : function() {
	        return this.normalizedValue;
	    },

	    /**
	     * set the normalized value of this stack
	     * 
	     * @param normalizedValue
	     *            the normalized value to set
	     */
	    setNormalizedValue : function(normalizedValue) {
	        this.normalizedValue = normalizedValue;
	    },

	    /**
	     * get stacked bar symbol host for this stack
	     * 
	     * @return bar symbol host for this stack
	     */
	    getHostSymbol : function() {
	        return this.hostSymbol;
	    },

	    /**
	     * set stacked bar symbol host for this stack
	     * 
	     * @param hostSymbol
	     *            the stacked bar symbol host to set
	     */
	    setHostSymbol : function(hostSymbol) {
	        this.hostSymbol = hostSymbol;
	    }

	});
	
	
	
	JenScript.SymbolBarStacked = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarStacked, JenScript.SymbolBar);
	JenScript.Model.addMethods(JenScript.SymbolBarStacked,{
		
		__init : function(config){
			config=config||{};
			JenScript.SymbolBar.call(this, config);
			/** stacks registry */
			this.stacks = [];
		},

	    /**
	     * get the base of the specified stack
	     * 
	     * @param stack
	     *            the stack
	     * @return the base of specified stack
	     */
	   getStackBase : function(stack) {
	        var base = this.getBase();
	        for (var i = 0; i < this.stacks.length; i++) {
	        	var s = this.stacks[i];
	        	if (stack.equals(s)) {
	        		//console.log('getStackBase:'+base);
	                return base;
	            }
	            if (this.isAscent()) {
	                base = base + s.getNormalizedValue();
	            }
	            else if (this.isDescent()) {
	                base = base - s.getNormalizedValue();
	            }
			}
	       // console.log('getStackBase:'+base);
	        return base;
	    },

//	    /**
//	     * create and add a new stack with specified parameters
//	     * 
//	     * @param name
//	     *            the stack name to set
//	     * @param themeColor
//	     *            the theme color to set
//	     * @param proportionValue
//	     *            the proportion value
//	     */
//	    addStack : function(name,themeColor,proportionValue) {
//	        if (proportionValue < 0) {
//	            throw new Error("stack proportion value should be greater than 0");
//	        }
//
//	        var stack = new JenScript.Stack(name, themeColor, proportionValue);
//	        stack.setHostSymbol(this);
//	        this.stacks[stacks.length].add(stack);
//	    },



	    /**
	     * add the specified stack in this stacked symbol
	     * 
	     * @param stack
	     *            the stack to add
	     */
	    addStack : function(stack) {
	        if (stack.getValue() < 0) {
	            throw new Error("stack proportion value should be greater than 0");
	        }
	        stack.setHostSymbol(this);
	        this.stacks[this.stacks.length] = stack;
	    },

	    /**
	     * normalization of the stack value
	     */
	   normalize : function() {
	        var deltaValue = Math.abs(this.getValue());
	        var stacksSumValue = 0;
	        for (var i = 0; i < this.stacks.length; i++) {
	        	stacksSumValue = stacksSumValue + this.stacks[i].getStackValue();
	        }
	        for (var i = 0; i < this.stacks.length; i++) {
				this.stacks[i].setNormalizedValue(this.stacks[i].getStackValue() * deltaValue / stacksSumValue);
			}
	    },

	    /**
	     * get stacks registry
	     * 
	     * @return stacks registry
	     */
	    getStacks : function() {
	        return this.stacks;
	    }
		
	});
	
	
})();