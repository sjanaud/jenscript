// JenScript -  JavaScript HTML5/SVG Library
// version : 1.3.1
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-06-03
// All Rights reserved

(function(){
	JenScript.SymbolFiller =  {
			/**
		     * create glue component for the specified symbol raw type
		     * 
		     * @return glue component
		     */
		    createGlue : function() {
		        try {
		            var glue = new JenScript.SymbolComponent({});
		            glue.setName("SymbolComponent.Glue");
		            glue.setFillerType('Glue');
		            glue.setOpaque(false);
		            glue.setFiller(true);
		            return glue;
		        }
		        catch(e) {
		        	console.log('error : '+e);
		        }
		        return undefined;
		    },

		    createStrut : function(thickness) {
		        try {
		            var strut = new JenScript.SymbolComponent({});
		            strut.setName("SymbolComponent.Strut." + strut);
		            strut.setOpaque(false);
		            strut.setThickness(thickness);
		            strut.setFillerType('Strut');
		            strut.setFiller(true);
		            return strut;
		        }
		        catch(e) {
		        	console.log('error : '+e);
		        }
		        return undefined;
		    }
	};
	
	JenScript.SymbolComponent = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.SymbolComponent,{
		
		init : function(config){
			config = config || {};
			this.Id = 'Symbol'+JenScript.sequenceId++;
			/** filler flag */
		    this.isFiller = false;
		    /** filler type */
		    this.fillerType; //Glue, Strut
		    /** symbol host layer */
		    this.layer;
		    /** bar nature */
		    this.nature;
		    /** bar opaque */
		    this.opaque;
		    /** bar thickness, default is 20 */
		    this.thickness = (config.thickness !== undefined)?config.thickness : 0;
		    /** bar theme color */
			this.themeColor = (config.themeColor !== undefined)?config.themeColor : 'gray';
		    /** bar name */
		    this.name = config.name;
		    /** bar host */
		    this.host;
		    /** enter flag */
		    this.lockEnter = false;
		    /** visible flag */
		    this.visible = true;
		    this.opacity =(config.opacity !== undefined)?config.opacity : 1;
		    /** user object */
		    this.userObject = config.userObject;
		    /**symbol bound*/
		    this.bound2D;
		},
		

		/**
		 * get theme color
		 * 
		 * @return theme color
		 */
		getThemeColor : function() {
			return this.themeColor;
		},

		/**
		 * set the theme color
		 * 
		 * @param themeColor
		 *            the theme color to set
		 */
		setThemeColor : function(themeColor) {
			this.themeColor = themeColor;
		},
		
		toString : function (){
			return "SymbolComponent:"+this.Id;
		},
		
		equals : function(o){
			if(o === undefined) return false;
			if(o.Id === undefined) return false;
			return (o.Id === this.Id);
		},
		/**
	     * get the host layer for this symbol
	     * 
	     * @return the layer
	     */
	    getLayer : function(){
	        return this.layer;
	    },

	    /**
	     * set the host layer for this symbol
	     * 
	     * @param layer
	     *            the layer to set
	     */
	    setLayer : function(layer) {
	        this.layer = layer;
	    },
	    
	    /**
	     * get the symbol bound
	     * 
	     * @return the layer
	     */
	    getBound2D : function(){
	        return this.bound2D;
	    },

	    /**
	     * set the symbol bound
	     * 
	     * @param bound2D
	     *            the bound2D to set
	     */
	    setBound2D : function(bound2D) {
	        this.bound2D = bound2D;
	    },

	    /**
	     * @param isFiller
	     *            the isFiller to set
	     */
	    setFiller : function(isFiller) {
	        this.isFiller = isFiller;
	    },

	    

	    /**
	     * get filler type
	     * 
	     * @return filler type
	     */
	    getFillerType : function(){
	        return this.fillerType;
	    },

	    /**
	     * set filler type
	     * 
	     * @param fillerType
	     */
	    setFillerType : function(fillerType) {
	        this.fillerType = fillerType;
	    },

	    /**
	     * get the host of this bar component
	     * 
	     * @return the host
	     */
	    getHost : function(){
	        return this.host;
	    },

	    /**
	     * set the host for this bar component
	     * 
	     * @param host
	     *            the host to set
	     */
	    setHost : function(host) {
	        this.host = host;
	    },

	    /**
	     * get the component name
	     * 
	     * @return the name
	     */
	    getName : function(){
	        if (name == null) {
	            if (getLayer() != null) {
	                name = getClass().getSimpleName() + "_"
	                        + getLayer().getSymbolIndex(this);
	            }
	            else {
	                name = getClass().getSimpleName();
	            }
	        }
	        return name;
	    },

	    /**
	     * set the name
	     * 
	     * @param name
	     *            the name to set
	     */
	    setName : function(name) {
	        this.name = name;
	    },

	    /**
	     * get the component thickness in device coordinate
	     * 
	     * @return the bar thickness
	     */
	    getThickness : function(){
	        return this.thickness;
	    },

	    /**
	     * set the component thickness
	     * 
	     * @param thickness
	     *            the thickness to set
	     */
	    setThickness : function( thickness) {
	        this.thickness = thickness;
	    },

	    /**
	     * return true if the component is opaque, false otherwise
	     * 
	     * @return true if the component is opaque, false otherwise
	     */
	    isOpaque : function(){
	        return this.opaque;
	    },

	    /**
	     * set the component opacity
	     * 
	     * @param opaque
	     *            the opacity
	     */
	    setOpaque : function(opaque) {
	        this.opaque = opaque;
	    },

	    /**
	     * get symbol location x in device coordinate
	     * 
	     * @return the location X
	     */
	   getLocationX : function(){
	        if (this.layer === undefined) {
	            return 0;
	        }
	        if (this.nature === 'Horizontal') {
	            throw new Error("Horizontal symbol has no location x");
	        }

	        return this.layer.getComponentXLocation(this);
	    },

	    /**
	     * get symbol center x in device coordinate
	     * 
	     * @return the center X
	     */
	    getCenterX : function(){
	        if (this.layer == null) {
	            return 0;
	        }
	        return this.getLocationX() + this.getThickness() / 2;
	    },

	    /**
	     * get location y in device coordinate
	     * 
	     * @return the location Y
	     */
	   getLocationY : function(){
	        if (this.layer === undefined) {
	            return 0;
	        }
	        if (this.nature == 'Vertical') {
	            throw new Error("Vertical symbol has no location y");
	        }
	        return this.layer.getComponentYLocation(this);
	    },

	    /**
	     * get symbol center y in device coordinate
	     * 
	     * @return the center X
	     */
	    getCenterY : function(){
	        if (this.layer === undefined) {
	            return 0;
	        }
	        return this.getLocationY() + this.getThickness() / 2;
	    },

	    /**
	     * get the component nature
	     * 
	     * @return bar nature
	     */
	    getNature : function(){
	        return this.nature;
	    },

	    /**
	     * set nature
	     * 
	     * @param nature
	     *            the nature to set
	     */
	    setNature : function(nature) {
	        this.nature = nature;
	    },

	    /**
	     * return true if mouse has just enter in this symbol, false otherwise
	     * 
	     * @return enter flag
	     */
	    isLockEnter : function(){
	        return this.lockEnter;
	    },

	    /**
	     * lock enter flag
	     */
	    setLockEnter : function(lock){
	        this.lockEnter = lock;
	    },


	    /**
	     * @return the visible
	     */
	    isVisible : function(){
	        return this.visible;
	    },

	    /**
	     * @param visible
	     *            the visible to set
	     */
	    setVisible: function( visible) {
	        this.visible = visible;
	    },

	    /**
	     * @return the userObject
	     */
	    getUserObject : function(){
	        return this.userObject;
	    },

	    /**
	     * @param userObject
	     *            the userObject to set
	     */
	    setUserObject: function(userObject) {
	        this.userObject = userObject;
	    }
	
	});
})();
(function(){
	
	JenScript.SymbolBar = function(config) {
		//SymbolBar
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBar, JenScript.SymbolComponent);
	JenScript.Model.addMethods(JenScript.SymbolBar,{
		
		_init : function(config){
			config=config||{};
			/** the bar value */
			this.value  = config.value;
			/** the bar base */
			this.base =  config.base;
			this.setBase(this.base);
			
			/** morphe style, default is Rectangle */
			this.morpheStyle =(config.morpheStyle !== undefined)?config.morpheStyle: 'Rectangle';
			
			/** bar symbol label*/
			this.symbol =(config.symbol !== undefined)?config.symbol : 'Unamed Bar Symbol';
			/** round constant */
			this.round = (config.round !== undefined)?config.round : 5;
			
			this.direction=(config.direction !== undefined)?config.direction : 'ascent';
			/** ascent bar type */
			this.ascent = false;
			/** descent bar type */
			this.descent = false;
			if(this.direction === 'descent'){
				this.setDescentValue(this.value);
			}
			else{
				this.setAscentValue(this.value);
			}
			
			/** bar stroke */
			this.barStroke = config.barStroke;
			/** bar fill */
			this.barFill = (config.barFill !== undefined)?config.barFill : new JenScript.SymbolBarFill0({});
			/** bar effect */
			this.barEffect = config.barEffect;
			/** bar label */
			this.barLabel;
			/** axis label */
			this.axisLabel;
			/** bar shape */
			this.barShape;
			/** part buffer */
			this.part;
			/** boolean inflating operation flag */
			this.inflating = false;
			/** deflating operation flag */
			this.deflating = false;
			/** current inflate */
			this.inflate;
			/** current deflate */
			this.deflate;
			JenScript.SymbolComponent.call(this, config);
		},
		
		/**
		 * get the bar label
		 * 
		 * @return the bar Label
		 */
		getBarLabel : function() {
			return this.barLabel;
		},

		/**
		 * set the bar label
		 * 
		 * @param barLabel
		 *            the bar label to set
		 */
		setBarLabel : function( barLabel) {
			this.barLabel = barLabel;
		},

		/**
		 * @return the axisLabel
		 */
		getAxisLabel : function() {
			return this.axisLabel;
		},

		/**
		 * @param axisLabel
		 *            the axisLabel to set
		 */
		setAxisLabel : function( axisLabel) {
			this.axisLabel = axisLabel;
		},

		/**
		 * get the part buffer
		 * 
		 * @return the part buffer
		 */
		getPart  : function() {
			return this.part;
		},

		/**
		 * set the bar part buffer
		 * 
		 * @param part
		 */
		setPart : function( part) {
			this.part = part;
		},

		/**
		 * get the round
		 * 
		 * @return the round
		 */
		getRound : function() {
			return this.round;
		},

		/**
		 * set round constant to set
		 * 
		 * @param round
		 *            the round to set
		 */
		setRound : function( round) {
			this.round = round;
		},

		/**
		 * get the morphe style
		 * 
		 * @return morphe style
		 */
		getMorpheStyle : function() {
			return this.morpheStyle;
		},

		/**
		 * set the morphe style
		 * 
		 * @param morpheStyle
		 *            the morphe style to set
		 */
		setMorpheStyle : function( morpheStyle) {
			this.morpheStyle = morpheStyle;
		},

		/**
		 * get bar shape
		 * 
		 * @return the bar shape
		 */
		getBarShape : function() {
			return this.barShape;
		},

		/**
		 * set bar shape
		 * 
		 * @param barShape
		 *            the bar shpae to set
		 */
		setBarShape : function( barShape) {
			this.barShape = barShape;
		},

		/**
		 * get symbol
		 * 
		 * @return the symbol
		 */
		getSymbol : function() {
			return this.symbol;
		},

		/**
		 * set symbol
		 * 
		 * @param symbol
		 *            the symbol to set
		 */
		setSymbol : function( symbol) {
			this.symbol = symbol;
		},

		getValue : function() {
			return this.value;
		},

		setAscentValue : function(value) {
			this.ascent = true;
			this.descent = false;
			if (value < 0) {
				throw new Error("bar value should be greater than 0");
			}
			this.value = value;
		},

		/**
		 * @return the inflating
		 */
		isInflating : function() {
			return this.inflating;
		},

		/**
		 * @param inflating
		 *            the inflating to set
		 */
		setInflating : function( inflating) {
			this.inflating = inflating;
		},

		/**
		 * @return the deflating
		 */
		isDeflating : function() {
			return this.deflating;
		},

		/**
		 * @param deflating
		 *            the deflating to set
		 */
		setDeflating : function( deflating) {
			this.deflating = deflating;
		},
		
		/**
		 * set the descent value
		 * 
		 * @param value
		 *            the descent value
		 */
		setDescentValue : function( value) {
			this.ascent = false;
			this.descent = true;
			if (value < 0) {
				throw new Error("bar value should be greater than 0");
			}
			this.value = value;
		},

		/**
		 * get bar base
		 * 
		 * @return  bar base
		 */
		getBase : function() {
			return this.base;
		},

		/**
		 * set bar base
		 * 
		 * @param base
		 *            the base to set
		 */
		setBase : function( base) {
			this.baseSet = true;
			this.base = base;
		},

		/**
		 * return true if the base has been set, false otherwise
		 * 
		 * @return true if the base has been set, false otherwise
		 */
		isBaseSet : function() {
			return this.baseSet;
		},

		/**
		 * return true is the bar is ascent, false otherwise
		 * 
		 * @return true is the bar is ascent, false otherwise
		 */
		isAscent : function() {
			return this.ascent;
		},

		/**
		 * return true is the bar is descent, false otherwise
		 * 
		 * @return true is the bar is descent, false otherwise
		 */
		isDescent : function() {
			return this.descent;
		},

		/**
		 * true if the bar symbol descent or ascent value is set, false otherwise
		 * 
		 * @return true if the bar symbol descent or ascent value is set, false
		 *         otherwise
		 */
		isValueSet : function() {
			return this.ascent || this.descent;
		},

		/**
		 * get the bar stroke
		 * 
		 * @return the bar stroke
		 */
		getBarStroke : function() {
			return this.barStroke;
		},

		/**
		 * set the bar stroke
		 * 
		 * @param barStroke
		 *            the bar stroke to set
		 */
		setBarStroke : function(barStroke) {
			this.barStroke = barStroke;
		},

		/**
		 * get bar fill
		 * 
		 * @return the bar fill
		 */
		getBarFill : function() {
			return this.barFill;
		},

		/**
		 * set the bar fill
		 * 
		 * @param barFill
		 *            the bar fill to ser
		 */
		setBarFill : function( barFill) {
			this.barFill = barFill;
		},

		/**
		 * get bar effect
		 * 
		 * @return the bar effect
		 */
		 getBarEffect : function() {
			return this.barEffect;
		 },

		/**
		 * set the bar effect
		 * 
		 * @param barEffect
		 *            the bar effect to set
		 */
		setBarEffect : function(barEffect) {
			this.barEffect = barEffect;
		},
		
		
		
	});
	
	
})();
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
(function(){
	
	JenScript.SymbolBarGroup = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarGroup, JenScript.SymbolBar);
	JenScript.Model.addMethods(JenScript.SymbolBarGroup,{
		
		__init : function(config){
			config=config||{};
			JenScript.SymbolBar.call(this, config);
			/** component registry */
			this.symbolComponents = [];
		},

		getThickness : function() {
	        var groupThickness = 0;
	        for (var i = 0; i < this.symbolComponents.length; i++) {
	            groupThickness = groupThickness + this.symbolComponents[i].getThickness();
	        }
	        return groupThickness;
	    },


	    /**
	     * get max value in device coordinate for this group in the scalar dimension
	     * 
	     * @return the max value in device coordinate
	     */
	    getMaxValue : function() {
	        var max = -1;
	        var setMax = false;
	        for (var i = 0; i < this.symbolComponents.length; i++) {
	        	var b = this.symbolComponents[i];
	            if (!b.isFiller) {
	                var rect2D = b.getBarShape().getBounds2D();
	                if (this.getNature() === 'Vertical') {
	                    if (!setMax) {
	                        max = rect2D.getMaxY();
	                        setMax = true;
	                    }
	                    max = Math.max(max, rect2D.getMaxY());
	                }
	                else if (this.getNature() === 'Horizontal') {
	                    if (!setMax) {
	                        max = rect2D.getMaxX();
	                        setMax = true;
	                    }
	                    max = Math.max(max, rect2D.getMaxX());
	                }
	            }
	        }
	        return max;
	    },

	    /**
	     * get min value in device coordinate for this group in the scalar dimension
	     * 
	     * @return the min value in device coordinate
	     */
	    getMinValue : function() {
	        var min = -1;
	        var setMin = false;
	        for (var i = 0; i < this.symbolComponents.length; i++) {
	        	var b = this.symbolComponents[i];
	            if (!b.isFiller) {
	                var rect2D = b.getBarShape().getBounds2D();
	                if (this.getNature() === 'Vertical') {
	                    if (!setMin) {
	                        min = rect2D.getMinY();
	                        setMin = true;
	                    }
	                    min = Math.min(min, rect2D.getMinY());
	                }
	                else if (this.getNature() == 'Horizontal') {
	                    if (!setMin) {
	                        min = rect2D.getMinX();
	                        setMin = true;
	                    }
	                    min = Math.min(min, rect2D.getMinX());
	                }
	            }
	        }
	        return min;
	    },

	    /**
	     * get center value in device coordinate for this group in the scalar
	     * dimension
	     * 
	     * @return the center value in device coordinate
	     */
	    getCenterValue : function() {
	        var max = this.getMaxValue();
	        var min = this.getMinValue();
	        return min + Math.abs(max - min) / 2;
	    },

	    /**
	     * get the bar group virtual shape the bar shape for this group is the
	     * bounding rectangle which contains all bar symbol
	     */
	   getBarShape : function() {
//	        Area a = new Area();
//	        double max = getMaxValue();
//	        double min = getMinValue();
//
//	        for (BarSymbol b : getSymbolComponents()) {
//	            if (!b.isFiller()) {
//	                a.add(new Area(b.getBarShape()));
//	            }
//	            else if (b.isFiller() && b.getFillerType() == FillerType.Strut) {
//	                Rectangle2D strutShape = null;
//	                if (getNature() == SymbolNature.Vertical) {
//	                    strutShape = new Rectangle2D.Double(b.getLocationX(), max,
//	                                                        b.getThickness(), max - min);
//	                }
//	                else if (getNature() == SymbolNature.Horizontal) {
//	                    strutShape = new Rectangle2D.Double(min, b.getLocationY(),
//	                                                        max - min, b.getThickness());
//	                }
//	                // a.add(new Area(strutShape));
//	            }
//	        }
//	        return a.getBounds2D();
	    },
	    
	    /**
	     * add symbol component
	     * 
	     * @param symbol
	     *            the symbol to add
	     * @throws IllegalArgumentException
	     *             if glue is add in this group
	     */
	    addSymbol : function(symbol) {
	        if (symbol.isFiller && symbol.getFillerType() === 'Glue') {
	            throw new Error("Glue can not be add in group.");
	        }
	        this.symbolComponents.add(symbol);
	    },

	    /**
	     * remove symbol component
	     * 
	     * @param symbol
	     *            the symbol to remove
	     */
	    removeSymbolComponent : function(symbol) {
	        //symbolComponents.remove(symbol);
	    },

	    /**
	     * get symbol components
	     * 
	     * @return symbol components
	     */
	    getSymbolComponents : function() {
	        return this.symbolComponents;
	    },

	    /**
	     * set symbols components to set
	     * 
	     * @param symbolComponents
	     */
	   setSymbolComponents : function(symbolComponents) {
	        this.symbolComponents = symbolComponents;
	   }
		
	});
	
	
})();
(function(){
	
	JenScript.SymbolPoint = function(config) {
		//SymbolPoint
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPoint, JenScript.SymbolComponent);
	JenScript.Model.addMethods(JenScript.SymbolPoint,{
		
		_init : function(config){
			config=config||{};
			 /** the point value in user system coordinate */
		   this.value = config.value;
		    /** transformed value in device coordinate */
		   this.deviceValue;
		    /** the point of this symbol */
		   this.devicePoint;
		    /** symbol point painter */
		   this.pointSymbolPainters = [];
		   this.pointSymbolPainters[0] = new JenScript.SymbolPointSquare(); 
		   /** sensible radius in pixel */
		   this.sensibleRadius = 10;
		    /** sensible shape */
		   this.sensibleShape;
		   JenScript.SymbolComponent.call(this, config);
		},
		
		
		 /**
	     * get the value in the user system coordinate
	     * 
	     * @return the value
	     */
	    getValue : function() {
	        return this.value;
	    },

	    /**
	     * set the value in the user system coordinate
	     * 
	     * @param value
	     *            the value to set
	     */
	    setValue : function(value) {
	        this.value = value;
	    },

	    // /**
	    // * a point symbol has no thickness, so this return 0
	    // */
	    // @Override
	    // public double getThickness() {
	    // return 0;
	    // }

	    /**
	     * @return the sensibleShape
	     */
	    getSensibleShape : function() {
	        return this.sensibleShape;
	    },

	    /**
	     * @param sensibleShape
	     *            the sensibleShape to set
	     */
	    setSensibleShape : function(sensibleShape) {
	        this.sensibleShape = sensibleShape;
	    },

	    /**
	     * get the transformed value coordinate in the device system
	     * 
	     * @return the deviceValue
	     */
	    getDeviceValue : function() {
	        return this.deviceValue;
	    },

	    /**
	     * set the transformed value coordinate in the device system
	     * 
	     * @param deviceValue
	     *            the deviceValue to set
	     */
	    setDeviceValue : function(deviceValue) {
	        this.deviceValue = deviceValue;
	    },

	    /**
	     * @return the devicePoint
	     */
	    getDevicePoint : function() {
	        return this.devicePoint;
	    },

	    /**
	     * @param devicePoint
	     *            the devicePoint to set
	     */
	    setDevicePoint : function(devicePoint) {
	        this.devicePoint = devicePoint;
	    },

	    /**
	     * @return the pointSymbolPainter
	     */
	    getPointSymbolPainters : function() {
	        return this.pointSymbolPainters;
	    },

	    /**
	     * @param pointSymbolPainterList
	     *            the pointSymbolPainter list to set
	     */
	    setPointSymbolPainters : function(painters) {
	        this.pointSymbolPainters = painters;
	    },

	    /**
	     * @param pointSymbolPainter
	     *            the pointSymbolPainter to add
	     */
	    addPointSymbolPainter : function( painter) {
	        this.pointSymbolPainters[this.pointSymbolPainters] = painter;
	    },

	    /**
	     * @return the sensibleRadius
	     */
	    getSensibleRadius : function() {
	        return this.sensibleRadius;
	    },

	    /**
	     * @param sensibleRadius
	     *            the sensibleRadius to set
	     */
	    setSensibleRadius : function(sensibleRadius) {
	        this.sensibleRadius = sensibleRadius;
	    }

	});
})();
(function(){
	
	JenScript.SymbolPolylinePoint = function(config) {
		//SymbolPolylinePoint
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPolylinePoint, JenScript.SymbolPoint);
	JenScript.Model.addMethods(JenScript.SymbolPolylinePoint,{
		
		__init : function(config){
			config=config||{};
			 /** bar members */
		    this.symbolComponents = [];
		    /** polyline painter */
		    this.polylinePainter = new JenScript.SymbolPolylinePainter();
		    JenScript.SymbolPoint.call(this, config);
		},
		
	    getNature : function() {
	        return this.getHost().getNature();
	    },

	    getThickness : function() {
	        return 0;
	    },

	    /***
	     * get the polyline painter
	     * 
	     * @return polyline painter
	     */
	    getPolylinePainter : function() {
	        return this.polylinePainter;
	    },

	    /**
	     * set the polyline painter
	     * 
	     * @param polylinePainter
	     *            the polyline painter to set
	     */
	    setPolylinePainter : function(polylinePainter) {
	        this.polylinePainter = polylinePainter;
	    },

	    /**
	     * add symbol component
	     * 
	     * @param symbol
	     *            the symbol to add
	     */
	    addSymbol : function(point) {
	    	if(point instanceof JenScript.SymbolPoint)
	    		this.symbolComponents[this.symbolComponents.length]= point;
	    },

	    /**
	     * remove symbol component
	     * 
	     * @param symbol
	     *            the bar to remove
	     */
	    removeSymbolComponent : function(point) {
	    	var pts = [];
	    	for (var i = 0; i < this.symbolComponents.length; i++) {
				if(!this.symbolComponents[i].equals(point))
					pts[pts.length]=this.symbolComponents[i];
			}
	        this.symbolComponents=pts;
	    },

	    /**
	     * get symbol components
	     * 
	     * @return symbol components
	     */
	    getSymbolComponents : function() {
	        return this.symbolComponents;
	    },

	    /**
	     * set symbol components
	     * 
	     * @param symbolComponents
	     */
	    setSymbolComponents : function(symbolComponents) {
	        this.symbolComponents = symbolComponents;
	    }
	});
})();
(function(){
	JenScript.SymbolPainter = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.SymbolPainter,{
		init : function(config){
			config=config||{};
		},
		paintSymbol : function(g2d,symbol,xviewPart) {}
	});
})();
(function(){
	JenScript.SymbolBarFill = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarFill, JenScript.SymbolPainter);
	JenScript.Model.addMethods(JenScript.SymbolBarFill,{
		
		_init : function(config){
			config=config||{};
			this.Id = 'symbolfill'+JenScript.sequenceId++;
			JenScript.SymbolPainter.call(this, config);
		},
		
		paintBarFill : function(g2d,bar){},
		
		paintSymbol : function(g2d,symbol,xviewPart) {
			 if (symbol.isVisible()) {
		            this.paintBarFill(g2d,symbol);
		     }
		}
		
	});
	
	JenScript.SymbolBarFill0 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarFill0, JenScript.SymbolBarFill);
	JenScript.Model.addMethods(JenScript.SymbolBarFill0,{
		
		__init : function(config){
			config=config||{};
			JenScript.SymbolBarFill.call(this, config);
		},
		
	    paintBarFill : function(g2d,bar) {
	     	g2d.deleteGraphicsElement(this.Id+bar.Id);
		   	var elem =  bar.getBarShape().Id(this.Id+bar.Id).fill(bar.themeColor).fillOpacity(bar.opacity).toSVG();
		   	g2d.insertSVG(elem);
		   	var bbox = elem.getBBox();
		   	bar.setBound2D(new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height));
	    }
	});
	
	JenScript.SymbolBarFill1 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarFill1, JenScript.SymbolBarFill);
	JenScript.Model.addMethods(JenScript.SymbolBarFill1,{
		
		__init : function(config){
			config=config||{};
			JenScript.SymbolBarFill.call(this, config);
		},
		
	    paintBarFill : function(g2d,bar) {
	        if (bar.getNature() === 'Vertical') {
	            this.v(g2d, bar);
	        }
	        if (bar.getNature() === 'Horizontal') {
	            this.h(g2d, bar);
	        }
	    },

	   v : function(g2d,bar) {
		   	//g2d.insertSVG(bar.getBarShape().Id(this.Id+bar.Id).stroke(bar.getThemeColor()).fillNone().toSVG());
		   	g2d.deleteGraphicsElement(this.Id+bar.Id);
		   	var elem =  bar.getBarShape().Id(this.Id+bar.Id).fillOpacity(bar.opacity).toSVG();
		   	g2d.insertSVG(elem);
	        var bbox = elem.getBBox();
	        var start = new JenScript.Point2D(bbox.x, bbox.y + bbox.height/2);
	        var end = new JenScript.Point2D(bbox.x + bbox.width,bbox.y + bbox.height/2);
	        var cBase = bar.getThemeColor();
	        var brighther1 = JenScript.Color.brighten(cBase, 20);
	        var dist = [ '0%', '50%', '100%' ];
	        var colors = [ brighther1, cBase, brighther1 ];
	        var opacity = [ 0.6, 0.8, 0.4 ];
	        var gradient1= new JenScript.SVGLinearGradient().Id(this.Id+bar.Id+'gradient').from(start.x, start.y).to(end.x, end.y).shade(dist,colors);
	        g2d.deleteGraphicsElement(this.Id+bar.Id+'gradient');
	        g2d.definesSVG(gradient1.toSVG());
	        elem.setAttribute('fill','url(#'+this.Id+bar.Id+'gradient'+')');
	    	//set bar bound2D
		   	var bbox = elem.getBBox();
		   	bar.setBound2D(new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height));
	    },

	    h : function(g2d,bar) {
	    	g2d.deleteGraphicsElement(bar.Id);
		   	var elem =  bar.getBarShape().Id(bar.Id).fillOpacity(bar.opacity).toSVG();
		   	g2d.insertSVG(elem);
	        var bbox = elem.getBBox();
	        var start = new JenScript.Point2D(bbox.x+bbox.width/2,bbox.y);
	        var end = new JenScript.Point2D(bbox.x+bbox.width/2, bbox.y + bbox.height);
	        var cBase = bar.getThemeColor();
	        var brighther1 = JenScript.Color.brighten(cBase, 20);

	        var dist = [ '0%', '50%', '100%' ];
	        var colors = [ brighther1, cBase, brighther1 ];
	        var opacity = [ 0.6, 0.8, 0.4 ];
	        var gradient1= new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x, start.y).to(end.x, end.y).shade(dist,colors);
	        g2d.deleteGraphicsElement(this.Id+'gradient');
	        g2d.definesSVG(gradient1.toSVG());
	        elem.setAttribute('fill','url(#'+this.Id+'gradient'+')');
	    	//set bar bound2D
		   	var bbox = elem.getBBox();
		   	bar.setBound2D(new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height));
	    }
		
	});
})();
(function(){
	JenScript.SymbolBarEffect = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarEffect, JenScript.SymbolPainter);
	JenScript.Model.addMethods(JenScript.SymbolBarEffect,{
		
		_init : function(config){
			config=config||{};
			this.Id = 'symboleffect'+JenScript.sequenceId++;
			JenScript.SymbolPainter.call(this, config);
		},
		
		paintBarEffect : function(g2d,bar){},
		
		paintSymbol : function(g2d,symbol,xviewPart) {
			 if (symbol.isVisible()) {
		            this.paintBarEffect(g2d,symbol);
		     }
		}
		
	});
	
	JenScript.SymbolBarEffect0 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarEffect0, JenScript.SymbolBarEffect);
	JenScript.Model.addMethods(JenScript.SymbolBarEffect0,{
		
		__init : function(config){
			config=config||{};
			this.Id = 'symboleffect0_'+JenScript.sequenceId++;
			JenScript.SymbolBarEffect.call(this,config);
		},
		
		paintBarEffect : function(g2d,bar){
			if (bar.getNature() === 'Vertical') {
		        this.v(g2d,bar);
	        }
	        if (bar.getNature() === 'Horizontal') {
	            this.h(g2d,bar);
	        }
		},
		
		 v : function(g2d,bar) {

	        var proj = bar.getHost().getProjection();
	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() + bar.getValue());
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() - bar.getValue());
	        }
	        var p2ddevice = proj.userToPixel(p2dUser);

	        var p2dUserBase = new JenScript.Point2D(0, bar.getBase());
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var x = bar.getLocationX();
	        var y = p2ddevice.getY();
	        if (bar.isDescent()) {
	            y = p2ddeviceBase.getY();
	        }
	        var width = bar.getThickness();
	        var height = Math.abs(p2ddeviceBase.getY() - p2ddevice.getY());

	        var shapeEffect = undefined;

	        var inset = 2;
	        x = x + inset;
	        y = y + inset;
	        width = width - 2 * inset;
	        height = height - 2 * inset;
	        if (bar.getMorpheStyle() === 'Round') {

	        	var round = bar.getRound();
	        	var barPath = new JenScript.SVGPath().Id(this.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y + round);
	                barPath.lineTo(x, y + height);
	                barPath.lineTo(x + width / 2, y + height);
	                barPath.lineTo(x + width / 2, y);
	                barPath.lineTo(x + round, y);
	                barPath.quadTo(x, y, x, y + round);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x, y + height - round);
	                barPath.quadTo(x, y + height, x + round, y + height);
	                barPath.lineTo(x + width / 2, y + height);
	                barPath.lineTo(x + width / 2, y);
	                barPath.close();

	            }
	            shapeEffect = barPath;
	        }
	        else if (bar.getMorpheStyle() === 'Rectangle') {
	            var barRec = new JenScript.SVGRect().Id(this.Id).origin(x, y).size(width / 2, height);
	            shapeEffect = barRec;
	        }

	        var boun2D2 =  new JenScript.Bound2D(x, y,width, height);

	        var start = null;
	        var end = null;
	        if (bar.isAscent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	            end = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(), boun2D2.getY() + boun2D2.getHeight());
	        }
	        else if (bar.isDescent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY()+ boun2D2.getHeight());
	                    
	        }
	        var dist = [ '0%', '100%' ];
	        var colors = [ 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.5)' ];

	        var gradient1= new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x, start.y).to(end.x, end.y).shade(dist,colors);
	        g2d.deleteGraphicsElement(this.gradientId);
	        g2d.definesSVG(gradient1.toSVG());
	        
	        
	        var el = shapeEffect.fillURL(this.Id+'gradient').toSVG();
	        g2d.insertSVG(el);

	    },

	    h : function(g2d, bar) {

	        var proj = bar.getHost().getProjection();

	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(bar.getBase() + bar.getValue(), 0);
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(bar.getBase() - bar.getValue(), 0);
	        }

	        var p2ddevice = proj.userToPixel(p2dUser);

	        var p2dUserBase = new JenScript.Point2D(bar.getBase(), 0);
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var y = bar.getLocationY();
	        var x = p2ddeviceBase.getX();
	        if (bar.isDescent()) {
	            x = p2ddevice.getX();
	        }

	        var height = bar.getThickness();
	        var width = Math.abs(p2ddevice.getX() - p2ddeviceBase.getX());

	        var shapeEffect = null;

	        var inset = 2;
	        x = x + inset;
	        y = y + inset;
	        width = width - 2 * inset;
	        height = height - 2 * inset;
	        if (bar.getMorpheStyle() == 'Round') {
	            var round = bar.getRound();
	            var barPath = new JenScript.SVGPath().Id(this.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x + width - round, y);
	                barPath.quadTo(x + width, y, x + width, y + round);
	                barPath.lineTo(x + width, y + height / 2);
	                barPath.lineTo(x, y + height / 2);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x + round, y);
	                barPath.lineTo(x + width, y);
	                barPath.lineTo(x + width, y + height / 2);
	                barPath.lineTo(x, y + height / 2);
	                barPath.quadTo(x, y, x + round, y);
	                barPath.close();
	            }
	            shapeEffect = barPath;
	        }
	        else {
	            var barRec = new JenScript.SVGRect().Id(this.Id).origin(x, y).size(width, height/2);
	            shapeEffect = barRec;
	        }

	        var boun2D2 = new JenScript.Bound2D(x, y,width, height);
	        var start = null;
	        var end = null;
	        if (bar.isAscent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getCenterY());
	            end = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
	                                     boun2D2.getCenterY());
	        }
	        else if (bar.isDescent()) {
	            start = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
	                                       boun2D2.getCenterY());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getCenterY());
	        }
	        var dist =  [ '0%', '100%' ];
	        var colors = ['rgba(255, 255, 255, 0.3)','rgba(255, 255, 255, 0.5)'];
	               
	        var gradient1= new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x, start.y).to(end.x, end.y).shade(dist,colors);
	        g2d.deleteGraphicsElement(this.gradientId);
	        g2d.definesSVG(gradient1.toSVG());
	        
	        var el = shapeEffect.fillURL(this.Id+'gradient').toSVG();
	        g2d.insertSVG(el);
	    }
		
	});
	
	
	JenScript.SymbolBarEffect1 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarEffect1, JenScript.SymbolBarEffect);
	JenScript.Model.addMethods(JenScript.SymbolBarEffect1,{
		
		__init : function(config){
			config=config||{};
			this.Id = 'symboleffect1_'+JenScript.sequenceId++;
			JenScript.SymbolBarEffect.call(this,config);
		},
		
		paintBarEffect : function(g2d,bar){
			 if (bar.getNature() === 'Vertical') {
		            this.v(g2d,bar);
		        }
		        if (bar.getNature() === 'Horizontal') {
		            this.h(g2d,bar);
		        }
		},
		
		v : function(g2d, bar) {

	        var proj = bar.getHost().getProjection();

	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() + bar.getValue());
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() - bar.getValue());
	        }
	        var p2ddevice = proj.userToPixel(p2dUser);

	        var p2dUserBase = new JenScript.Point2D(0, bar.getBase());
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var x = bar.getLocationX();
	        var y =  p2ddevice.getY();
	        if (bar.isDescent()) {
	            y =  p2ddeviceBase.getY();
	        }
	        var width = bar.getThickness();
	        var height = Math.abs(p2ddeviceBase.getY() - p2ddevice.getY());

	        var shapeEffect = null;

	        var inset = 2;
	        x = x + inset;
	        y = y + inset;
	        width = width - 2 * inset;
	        height = height - 2 * inset;
	        if (bar.getMorpheStyle() === 'Round') {
	        	var round = bar.getRound();
	        	var  barPath = new JenScript.SVGPath().Id(this.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y + round);
	                barPath.lineTo(x, y + height);
	                barPath.lineTo(x + width, y + height);
	                barPath.lineTo(x + width, y + round);
	                barPath.quadTo(x + width, y, x + width - round, y);
	                barPath.lineTo(x + round, y);
	                barPath.quadTo(x, y, x, y + round);
	                barPath.close();
	                shapeEffect = barPath;
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x, y + height - round);
	                barPath.quadTo(x, y + height, x + round, y + height);
	                barPath.lineTo(x + width - round, y + height);
	                barPath.quadTo(x + width, y + height, x + width, y + height - round);
	                barPath.lineTo(x + width, y);
	                barPath.close();
	                shapeEffect = barPath;
	            }
	        }
	        else if (bar.getMorpheStyle() === 'Rectangle') {
	        	var barRec = new JenScript.SVGRect().Id(this.Id).origin(x, y).size(width, height);
	            shapeEffect = barRec;
	        }
	        var boun2D2 =  new JenScript.Bound2D(x, y,width,height);
	        var start = undefined;
	        var end = undefined;
	        if (bar.isAscent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY() + boun2D2.getHeight());
	        }
	        else if (bar.isDescent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY()  + boun2D2.getHeight());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	        }
	        var dist = [ '0%', '33%', '66%', '100%' ];
	        var colors = [ 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0)', 'rgba(40, 40, 40, 0)', 'rgba(40, 40, 40, 0.4)' ];
	        var gd = new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x,start.y).to(end.x,end.y).shade(dist,colors).toSVG();
	        g2d.definesSVG(gd);                                              
	        g2d.insertSVG(shapeEffect.fillURL(this.Id+'gradient').toSVG());
	    },

	    h : function(g2d, bar) {

//	        Projection proj = bar.getHost().getProjection();
//
//	        Point2D p2dUser = null;
//	        if (bar.isAscent()) {
//	            p2dUser = new JenScript.Point2D(bar.getBase() + bar.getValue(), 0);
//	        }
//	        if (bar.isDescent()) {
//	            p2dUser = new JenScript.Point2D(bar.getBase() - bar.getValue(), 0);
//	        }
//
//	        Point2D p2ddevice = proj.userToPixel(p2dUser);
//
//	        Point2D p2dUserBase = new JenScript.Point2D(bar.getBase(), 0);
//	        Point2D p2ddeviceBase = proj.userToPixel(p2dUserBase);
//
//	        double y = bar.getLocationY();
//	        double x = (int) p2ddeviceBase.getX();
//	        if (bar.isAscent()) {
//	            x = (int) p2ddeviceBase.getX();
//	        }
//	        if (bar.isDescent()) {
//	            x = (int) p2ddevice.getX();
//	        }
//
//	        double height = bar.getThickness();
//	        double width = Math.abs(p2ddevice.getX() - p2ddeviceBase.getX());
//
//	        Shape shapeEffect = null;
//
//	        int inset = 2;
//	        x = x + inset;
//	        y = y + inset;
//	        width = width - 2 * inset;
//	        height = height - 2 * inset;
//	        if (bar.getMorpheStyle() == MorpheStyle.Round) {
//	            double round = bar.getRound();
//	            GeneralPath barPath = new GeneralPath();
//	            if (bar.isAscent()) {
//	                barPath.moveTo(x, y);
//	                barPath.lineTo(x + width - round, y);
//	                barPath.quadTo(x + width, y, x + width, y + round);
//	                barPath.lineTo(x + width, y + height - round);
//	                barPath.quadTo(x + width, y + height, x + width - round, y
//	                        + height);
//	                barPath.lineTo(x, y + height);
//	                barPath.closePath();
//	            }
//	            else if (bar.isDescent()) {
//
//	                barPath.moveTo(x + round, y);
//	                barPath.lineTo(x + width, y);
//	                barPath.lineTo(x + width, y + height);
//	                barPath.lineTo(x + round, y + height);
//	                barPath.quadTo(x, y + height, x, y + height - round);
//	                barPath.lineTo(x, y + round);
//	                barPath.quadTo(x, y, x + round, y);
//	                barPath.closePath();
//	            }
//	            shapeEffect = barPath;
//	        }
//	        else {
//
//	            Rectangle2D barRec = new Rectangle2D.Double(x, y, width, height);
//	            shapeEffect = barRec;
//
//	        }
//
//	        Rectangle2D boun2D2 = shapeEffect.getBounds2D();
//
//	        Point2D start = null;
//	        Point2D end = null;
//	        if (bar.isAscent()) {
//	            start = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
//	                                       boun2D2.getY());
//	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
//	        }
//	        else if (bar.isDescent()) {
//	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
//	            end = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
//	                                     boun2D2.getY());
//	        }
//
//	        float[] dist = { 0.0f, 0.33f, 0.66f, 1.0f };
//	        Color[] colors = { 'rgba(255, 255, 255, 180),
//	                'rgba(255, 255, 255, 0), 'rgba(40, 40, 40, 0),
//	                'rgba(40, 40, 40, 100) };
//	        LinearGradientPaint p2 = new LinearGradientPaint(start, end, dist,
//	                                                         colors);
//
//	        g2d.setPaint(p2);
//	        g2d.fill(shapeEffect);

	    }
		
		
	});
	
	
	
	
	JenScript.SymbolBarEffect2 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarEffect2, JenScript.SymbolBarEffect);
	JenScript.Model.addMethods(JenScript.SymbolBarEffect2,{
		
		__init : function(config){
			config=config||{};
			this.Id = 'symboleffect2_'+JenScript.sequenceId++;
			JenScript.SymbolBarEffect.call(this,config);
		},
		
		paintBarEffect : function(g2d,bar){
			 if (bar.getNature() === 'Vertical') {
		            this.v(g2d,bar);
		        }
		        if (bar.getNature() === 'Horizontal') {
		            this.h(g2d,bar);
		        }
		},
		
		v : function(g2d, bar) {

	        var proj = bar.getHost().getProjection();

	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() + bar.getValue());
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() - bar.getValue());
	        }
	        var p2ddevice = proj.userToPixel(p2dUser);

	        var p2dUserBase = new JenScript.Point2D(0, bar.getBase());
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var x = bar.getLocationX();
	        var y =  p2ddevice.getY();
	        if (bar.isDescent()) {
	            y = p2ddeviceBase.getY();
	        }
	        var width = bar.getThickness();
	        var height = Math.abs(p2ddeviceBase.getY() - p2ddevice.getY());
	        var shapeEffect = null;
	        var inset = 2;
	        x = x + inset;
	        y = y + inset;
	        width = width - 2 * inset;
	        height = height - 2 * inset;
	        var biais = 10;
	        if (bar.getMorpheStyle() === 'Round') {
	        	var round = bar.getRound();
	        	var barPath = new JenScript.SVGPath().Id(this.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y + round);
	                barPath.lineTo(x, y + height / 2 + biais);
	                barPath.lineTo(x + width, y + height / 2 - biais);
	                barPath.lineTo(x + width, y + round);
	                barPath.quadTo(x + width, y, x + width - round, y);
	                barPath.lineTo(x + round, y);
	                barPath.quadTo(x, y, x, y + round);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x, y + height / 2 - biais);
	                barPath.lineTo(x, y + height - round);
	                barPath.quadTo(x, y + height, x + round, y + height);
	                barPath.lineTo(x + width - round, y + height);
	                barPath.quadTo(x + width, y + height, x + width, y + height - round);
	                barPath.lineTo(x + width, y + height / 2 + biais);
	                barPath.close();
	            }
	            shapeEffect = barPath;
	        }
	        else if (bar.getMorpheStyle() === 'Rectangle') {
	        	var barPath = new JenScript.SVGPath().Id(this.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x, y + height / 2 + biais);
	                barPath.lineTo(x + width, y + height / 2 - biais);
	                barPath.lineTo(x + width, y);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x, y + height / 2 - biais);
	                barPath.lineTo(x, y + height);
	                barPath.lineTo(x + width, y + height);
	                barPath.lineTo(x + width, y + height / 2 + biais);
	                barPath.close();
	            }
	            shapeEffect = barPath;
	        }

	        var elem = shapeEffect.toSVG();
	        g2d.insertSVG(elem);
	        
	        var bbox = elem.getBBox();
	        var boun2D2 = new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height);

	        var start = null;
	        var end = null;
	        if (bar.isAscent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY()  + boun2D2.getHeight());
	        }
	        else if (bar.isDescent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY()  + boun2D2.getHeight());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	        }

	        var dist = ['0%','100%'];
	        var colors = [ 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.2)' ];
	               
	        var p2 = new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x,start.y).to(end.x,end.y).shade(dist, colors).toSVG();
	        g2d.deleteGraphicsElement(this.Id+'gradient');
	        g2d.definesSVG(p2);
	        
	        elem.setAttribute('fill','url(#'+this.Id+'gradient'+')');
	    },

	    h:function(g2d, bar) {

//	        Projection proj = bar.getHost().getProjection();
//
//	        Point2D p2dUser = null;
//	        if (bar.isAscent()) {
//	            p2dUser = new JenScript.Point2D(bar.getBase() + bar.getValue(), 0);
//	        }
//	        if (bar.isDescent()) {
//	            p2dUser = new JenScript.Point2D(bar.getBase() - bar.getValue(), 0);
//	        }
//
//	        Point2D p2ddevice = proj.userToPixel(p2dUser);
//
//	        Point2D p2dUserBase = new JenScript.Point2D(bar.getBase(), 0);
//	        Point2D p2ddeviceBase = proj.userToPixel(p2dUserBase);
//
//	        double y = bar.getLocationY();
//	        double x = (int) p2ddeviceBase.getX();
//	        if (bar.isAscent()) {
//	            x = (int) p2ddeviceBase.getX();
//	        }
//	        if (bar.isDescent()) {
//	            x = (int) p2ddevice.getX();
//	        }
//
//	        double height = bar.getThickness();
//	        double width = Math.abs(p2ddevice.getX() - p2ddeviceBase.getX());
//
//	        Shape shapeEffect = null;
//
//	        int inset = 2;
//	        x = x + inset;
//	        y = y + inset;
//	        width = width - 2 * inset;
//	        height = height - 2 * inset;
//
//	        int biais = 10;
//
//	        if (bar.getMorpheStyle() == MorpheStyle.Round) {
//	            double round = bar.getRound();
//	            GeneralPath barPath = new GeneralPath();
//	            if (bar.isAscent()) {
//	                barPath.moveTo(x + width / 2 + biais, y);
//	                barPath.lineTo(x + width - round, y);
//	                barPath.quadTo(x + width, y, x + width, y + round);
//	                barPath.lineTo(x + width, y + height - round);
//	                barPath.quadTo(x + width, y + height, x + width - round, y
//	                        + height);
//	                barPath.lineTo(x + width / 2 - biais, y + height);
//	                barPath.closePath();
//	            }
//	            else if (bar.isDescent()) {
//
//	                barPath.moveTo(x + round, y);
//	                barPath.lineTo(x + width / 2 - biais, y);
//	                barPath.lineTo(x + width / 2 + biais, y + height);
//	                barPath.lineTo(x + round, y + height);
//	                barPath.quadTo(x, y + height, x, y + height - round);
//	                barPath.lineTo(x, y + round);
//	                barPath.quadTo(x, y, x + round, y);
//	                barPath.closePath();
//	            }
//	            shapeEffect = barPath;
//	        }
//	        else {
//
//	            GeneralPath barPath = new GeneralPath();
//
//	            if (bar.isAscent()) {
//	                barPath.moveTo(x + width / 2 + biais, y);
//	                barPath.lineTo(x + width, y);
//	                barPath.lineTo(x + width, y + height);
//	                barPath.lineTo(x + width / 2 - biais, y + height);
//	                barPath.closePath();
//	            }
//	            else if (bar.isDescent()) {
//	                barPath.moveTo(x + width / 2 - biais, y);
//	                barPath.lineTo(x, y);
//	                barPath.lineTo(x, y + height);
//	                barPath.lineTo(x + width / 2 + biais, y + height);
//	                barPath.closePath();
//	            }
//	            shapeEffect = barPath;
//
//	        }
//
//	        Rectangle2D boun2D2 = shapeEffect.getBounds2D();
//
//	        Point2D start = null;
//	        Point2D end = null;
//	        if (bar.isAscent()) {
//	            start = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
//	                                       boun2D2.getY());
//	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
//	        }
//	        else if (bar.isDescent()) {
//	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
//	            end = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
//	                                     boun2D2.getY());
//	        }
//
//	        float[] dist = { 0.0f, 1.0f };
//	        Color[] colors = {'rgba(255, 255, 255, 180),
//	               'rgba(255, 255, 255, 60) };
//	        LinearGradientPaint p2 = new LinearGradientPaint(start, end, dist,
//	                                                         colors);
//
//	        g2d.setPaint(p2);
//	        g2d.fill(shapeEffect);

	    }
	});
	
	
	JenScript.SymbolBarEffect3 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarEffect3, JenScript.SymbolBarEffect);
	JenScript.Model.addMethods(JenScript.SymbolBarEffect3,{
		
		__init : function(config){
			config=config||{};
			this.Id = 'symboleffect3_'+JenScript.sequenceId++;
			JenScript.SymbolBarEffect.call(this,config);
		},
		
		paintBarEffect : function(g2d,bar){
			 if (bar.getNature() === 'Vertical') {
		            this.v(g2d,bar);
		        }
		        if (bar.getNature() === 'Horizontal') {
		            this.h(g2d,bar);
		        }
		},
		
	   v : function(g2d,bar) {
	        if (bar.getHost() === undefined || bar.getHost().getProjection() === undefined) {
	            return;
	        }
	        var proj = bar.getHost().getProjection();
	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() + bar.getValue());
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() - bar.getValue());
	        }
	        var p2ddevice = proj.userToPixel(p2dUser);
	        var p2dUserBase = new JenScript.Point2D(0, bar.getBase());
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var x = bar.getLocationX();
	        var y = p2ddevice.getY();
	        if (bar.isDescent()) {
	            y = p2ddeviceBase.getY();
	        }
	        var width = bar.getThickness();
	        var height = Math.abs(p2ddeviceBase.getY() - p2ddevice.getY());

	        var shapeEffect = null;
	        var inset = 2;
	        x = x + inset;
	        y = y + inset;
	        width = width - 2 * inset;
	        height = height - 2 * inset;
	        var barPath = new JenScript.SVGPath().Id(this.Id);
	        if (bar.getMorpheStyle() == 'Round') {
	        	var round = bar.getRound();
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y + round);
	                barPath.quadTo(x + width / 2, y + height / 2, x, y + height);
	                barPath.lineTo(x + width, y + height);
	                barPath.quadTo(x + width / 2, y + height / 2, x + width, y + round);
	                barPath.quadTo(x + width, y, x + width - round, y);
	                barPath.lineTo(x + round, y);
	                barPath.quadTo(x, y, x, y + round);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x, y);
	                barPath.quadTo(x + width / 2, y + height / 2, x, y + height- round);
	                barPath.quadTo(x, y + height, x + round, y + height);
	                barPath.lineTo(x + width - round, y + height);
	                barPath.quadTo(x + width, y + height, x + width, y + height- round);
	                barPath.quadTo(x + width / 2, y + height / 2, x + width, y);
	                barPath.close();
	            }
	        }
	        else if (bar.getMorpheStyle() === 'Rectangle') {
	            barPath.moveTo(x, y);
	            barPath.quadTo(x + width / 2, y + height / 2, x, y + height);
	            barPath.lineTo(x + width, y + height);
	            barPath.quadTo(x + width / 2, y + height / 2, x + width, y);
	            barPath.close();
	        }
	        shapeEffect = barPath;
	        
	        var elem = shapeEffect.toSVG();
	        g2d.insertSVG(elem);
	        
	        var bbox = elem.getBBox();
	        var boun2D2 = new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height);

	        var start = null;
	        var end = null;
	        if (bar.isAscent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY() + boun2D2.getHeight());
	        }
	        else if (bar.isDescent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY()  + boun2D2.getHeight());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	        }

	        var dist = ['0%','33%','66%','100%' ];
	        var colors = ['rgba(255, 255, 255, 0.55)',  'rgba(255, 255, 255, 0)','rgba(40, 40, 40, 0)','rgba(40, 40, 40, 0.45)' ];
	        var p2 = new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x,start.y).to(end.x,end.y).shade(dist,colors).toSVG();
	        g2d.deleteGraphicsElement(this.Id+'gradient');
	        g2d.definesSVG(p2);
	        
	        elem.setAttribute('fill','url(#'+this.Id+'gradient'+')');

	       
	    },

	    h : function(g2d,bar) {

//	        Projection proj = bar.getHost().getProjection();
//
//	        Point2D p2dUser = null;
//	        if (bar.isAscent()) {
//	            p2dUser = new JenScript.Point2D(bar.getBase() + bar.getValue(), 0);
//	        }
//	        if (bar.isDescent()) {
//	            p2dUser = new JenScript.Point2D(bar.getBase() - bar.getValue(), 0);
//	        }
//
//	        Point2D p2ddevice = proj.userToPixel(p2dUser);
//
//	        Point2D p2dUserBase = new JenScript.Point2D(bar.getBase(), 0);
//	        Point2D p2ddeviceBase = proj.userToPixel(p2dUserBase);
//
//	        double y = bar.getLocationY();
//	        double x = (int) p2ddeviceBase.getX();
//	        if (bar.isAscent()) {
//	            x = (int) p2ddeviceBase.getX();
//	        }
//	        if (bar.isDescent()) {
//	            x = (int) p2ddevice.getX();
//	        }
//
//	        double height = bar.getThickness();
//	        double width = Math.abs(p2ddevice.getX() - p2ddeviceBase.getX());
//
//	        Shape shapeEffect = null;
//
//	        int inset = 2;
//	        x = x + inset;
//	        y = y + inset;
//	        width = width - 2 * inset;
//	        height = height - 2 * inset;
//	        if (bar.getMorpheStyle() == MorpheStyle.Round) {
//	            double round = bar.getRound();
//	            GeneralPath barPath = new GeneralPath();
//	            if (bar.isAscent()) {
//	                barPath.moveTo(x, y);
//	                barPath.quadTo(x + width / 2, y + height / 2,
//	                               x + width - round, y);
//	                barPath.quadTo(x + width, y, x + width, y + round);
//	                barPath.lineTo(x + width, y + height - round);
//	                barPath.quadTo(x + width, y + height, x + width - round, y
//	                        + height);
//	                barPath.quadTo(x + width / 2, y + height / 2, x, y + height);
//	                barPath.closePath();
//
//	            }
//	            else if (bar.isDescent()) {
//
//	                barPath.moveTo(x + round, y);
//	                barPath.quadTo(x + width / 2, y + height / 2, x + width, y);
//	                barPath.lineTo(x + width, y + height);
//	                barPath.quadTo(x + width / 2, y + height / 2, x + round, y
//	                        + height);
//	                barPath.quadTo(x, y + height, x, y + height - round);
//	                barPath.lineTo(x, y + round);
//	                barPath.quadTo(x, y, x + round, y);
//	                barPath.closePath();
//
//	            }
//	            shapeEffect = barPath;
//	        }
//	        else {
//
//	            GeneralPath barPath = new GeneralPath();
//	            barPath.moveTo(x, y);
//	            barPath.quadTo(x + width / 2, y + height / 2, x + width, y);
//	            barPath.lineTo(x + width, y + height);
//	            barPath.quadTo(x + width / 2, y + height / 2, x, y + height);
//	            barPath.closePath();
//	            shapeEffect = barPath;
//
//	        }
//
//	        Rectangle2D boun2D2 = shapeEffect.getBounds2D();
//
//	        Point2D start = null;
//	        Point2D end = null;
//	        if (bar.isAscent()) {
//	            start = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
//	                                       boun2D2.getY());
//	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
//	        }
//	        else if (bar.isDescent()) {
//	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
//	            end = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
//	                                     boun2D2.getY());
//	        }
//
//	        float[] dist = { 0.0f, 0.33f, 0.66f, 1.0f };
//	        Color[] colors2 = {'rgba(255, 255, 255, 180),
//	               'rgba(255, 255, 255, 0),'rgba(40, 40, 40, 0),
//	               'rgba(40, 40, 40, 100) };
//	        LinearGradientPaint p2 = new LinearGradientPaint(start, end, dist,
//	                                                         colors2);
//
//	        g2d.setPaint(p2);
//	        g2d.fill(shapeEffect);

	    }
	});
	
	
	
})();
(function(){
	JenScript.SymbolBarStroke = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarStroke, JenScript.SymbolPainter);
	JenScript.Model.addMethods(JenScript.SymbolBarStroke,{
		
		_init : function(config){
			config=config||{};
			this.Id = 'symbolstroke'+JenScript.sequenceId++;
			this.strokeColor = config.strokeColor;
			this.strokeWidth = (config.strokeWidth !== undefined)?config.strokeWidth :1;
			JenScript.SymbolPainter.call(this, config);
		},
		
		paintBarStroke : function(g2d,bar){
			g2d.deleteGraphicsElement(this.Id);
			var c = (this.strokeColor !== undefined)?this.strokeColor : bar.getThemeColor();
		   	var elem =  bar.getBarShape().Id(this.Id).fillNone().stroke(c).strokeWidth(this.strokeWidth).toSVG();
		   	g2d.insertSVG(elem);
		},
		
		paintSymbol : function(g2d,symbol,viewPart) {
			 if (symbol.isVisible()) {
		            this.paintBarStroke(g2d,symbol);
		     }
		}
		
	});
	
	
})();
(function(){
	
})();
(function(){
	
	/**
	 * Object SymbolAbstractLabel()
	 * Defines Symbol Abstract Label
	 * @param {Object} config
	 * @param {String} [config.name] the label type name
	 * @param {String} [config.text] the label text
	 * @param {String} [config.textColor] the label text color
	 * @param {Number} [config.fontSize] the label text font size
	 * @param {String} [config.textAnchor] the label text anchor
	 * @param {Object} [config.shader] the label fill shader
	 * @param {Object} [config.shader.percents] the label fill shader percents
	 * @param {Object} [config.shader.colors] the label fill shader colors
	 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the label outline color
	 * @param {String} [config.cornerRadius] the label outline corner radius
	 * @param {String} [config.fillColor] the label fill color
	 */
	JenScript.SymbolAbstractLabel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolAbstractLabel,JenScript.AbstractLabel);
	JenScript.Model.addMethods(JenScript.SymbolAbstractLabel,{
		
		/**
		 * Initialize Abstract Symbol Label
		 * @param {Object} config
		 * @param {String} [config.name] the label type name
		 * @param {String} [config.text] the label text
		 * @param {String} [config.textColor] the label text color
		 * @param {Number} [config.fontSize] the label text font size
		 * @param {String} [config.textAnchor] the label text anchor
		 * @param {Object} [config.shader] the label fill shader
		 * @param {Object} [config.shader.percents] the label fill shader percents
		 * @param {Object} [config.shader.colors] the label fill shader colors
		 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the label outline color
		 * @param {String} [config.cornerRadius] the label outline corner radius
		 * @param {String} [config.fillColor] the label fill color
		 */
		_init : function(config){
			JenScript.AbstractLabel.call(this,config);
		},
		
		/**
		 * Abstract label paint for Symbol
		 */
		paintSymbol : function(g2d,symbol,part){
			throw new Error('paintSymbolLabel method should be provide by override');
		}
		
	});
	
	
	/**
	 * Object SymbolAxisLabel()
	 * Defines symbol axis label 
	 * @param {Object} config
	 * @param {String} [config.name] the label type name
	 * @param {String} [config.text] the label text
	 * @param {String} [config.textColor] the label text color
	 * @param {Number} [config.fontSize] the label text font size
	 * @param {String} [config.textAnchor] the label text anchor
	 * @param {Object} [config.shader] the label fill shader
	 * @param {Object} [config.shader.percents] the label fill shader percents
	 * @param {Object} [config.shader.colors] the label fill shader colors
	 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the label outline color
	 * @param {String} [config.cornerRadius] the label outline corner radius
	 * @param {String} [config.fillColor] the label fill color
	 * @param {String} [config.rotate] active rotate
	 * @param {String} [config.rotateAngle] the label rotation angle
	 * @param {String} [config.part] the label view part, east, west, south, east, device
	 * @param {String} [config.position] the label position, top, bottom, middle
	 */
	JenScript.SymbolAxisLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolAxisLabel, JenScript.SymbolAbstractLabel);
	JenScript.Model.addMethods(JenScript.SymbolAxisLabel, {
		
		/**
		 * Initialize Symbol Axis Label
		 * @param {Object} config
		 * @param {String} [config.name] the label type name
		 * @param {String} [config.text] the label text
		 * @param {String} [config.textColor] the label text color
		 * @param {Number} [config.fontSize] the label text font size
		 * @param {String} [config.textAnchor] the label text anchor
		 * @param {Object} [config.shader] the label fill shader
		 * @param {Object} [config.shader.percents] the label fill shader percents
		 * @param {Object} [config.shader.colors] the label fill shader colors
		 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the label outline color
		 * @param {String} [config.cornerRadius] the label outline corner radius
		 * @param {String} [config.fillColor] the label fill color
		 * @param {String} [config.rotate] active rotate
		 * @param {String} [config.rotateAngle] the label rotation angle
		 * @param {String} [config.part] the label view part, east, west, south, east, device
		 * 
		 */
		__init : function(config){
			config = config || {};
			config.name = 'JenScript.SymbolAxisLabel';
			this.part = (config.part !== undefined)? config.part:'West';
			JenScript.SymbolAbstractLabel.call(this, config);
		},
		
		/**
		 *Paint default label Symbol
		 */
		paintSymbol : function(g2d,symbol,part){
			if (symbol.getNature() === 'Vertical') {
				this.paintVLabel(g2d,symbol,part);
		    }
		    if (symbol.getNature() === 'Horizontal') {
		    	this.paintHLabel(g2d,symbol,part);
		    }
		},
		
		paintHLabel : function(g2d,symbol,part){
			var cy = symbol.getCenterY();
			var w = symbol.getHost().getWest();
			if(this.part === 'West' && part === 'West'){
		        this.setLocation(new JenScript.Point2D(w-5,cy));
		        this.paintLabel(g2d);
			}
			if(this.part === 'East'  && part === 'East'){
		        this.setLocation(new JenScript.Point2D(5,cy));
		        this.paintLabel(g2d);
			}
			
		},
		
		paintVLabel : function(g2d,symbol,part){
			var cx = symbol.getCenterX();
			var w = symbol.getHost().getWest();
			var n = symbol.getHost().getNorth();
			if(this.part === 'South' && part === 'South'){
		        this.setLocation(new JenScript.Point2D(w+cx,5));
		        this.paintLabel(g2d);
			}
			else if(this.part === 'North' && part === 'North'){
		        this.setLocation(new JenScript.Point2D(w+cx,n-5));
		        this.paintLabel(g2d);
			}
			
		},
	});
	
	
	/**
	 * Object SymbolBarLabel()
	 * Defines symbol bar label 
	 * @param {Object} config
	 * @param {String} [config.name] the label type name
	 * @param {String} [config.text] the label text
	 * @param {String} [config.textColor] the label text color
	 * @param {Number} [config.fontSize] the label text font size
	 * @param {String} [config.textAnchor] the label text anchor
	 * @param {Object} [config.shader] the label fill shader
	 * @param {Object} [config.shader.percents] the label fill shader percents
	 * @param {Object} [config.shader.colors] the label fill shader colors
	 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the label outline color
	 * @param {String} [config.cornerRadius] the label outline corner radius
	 * @param {String} [config.fillColor] the label fill color
	 * @param {String} [config.rotate] active rotate
	 * @param {String} [config.rotateAngle] the label rotation angle
	 * @param {String} [config.part] the label view part, east, west, south, east, device
	 * @param {String} [config.position] the label position, top, bottom, middle
	 */
	JenScript.SymbolBarLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarLabel, JenScript.SymbolAbstractLabel);
	JenScript.Model.addMethods(JenScript.SymbolBarLabel, {
		
		/**
		 * Initialize Symbol Default Label
		 * @param {Object} config
		 * @param {String} [config.name] the label type name
		 * @param {String} [config.text] the label text
		 * @param {String} [config.textColor] the label text color
		 * @param {Number} [config.fontSize] the label text font size
		 * @param {String} [config.textAnchor] the label text anchor
		 * @param {Object} [config.shader] the label fill shader
		 * @param {Object} [config.shader.percents] the label fill shader percents
		 * @param {Object} [config.shader.colors] the label fill shader colors
		 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the label outline color
		 * @param {String} [config.cornerRadius] the label outline corner radius
		 * @param {String} [config.fillColor] the label fill color
		 * @param {String} [config.rotate] active rotate
		 * @param {String} [config.rotateAngle] the label rotation angle
		 * @param {String} [config.part] the label view part, east, west, south, east, device
		 * 
		 */
		__init : function(config){
			config = config || {};
			config.name = 'JenScript.SymbolBarLabel';
			this.part = (config.part !== undefined)? config.part:'West';
			this.barAnchor = (config.barAnchor !== undefined)? config.barAnchor:'middle';
			JenScript.SymbolAbstractLabel.call(this, config);
		},
		
		/**
		 *Paint default label Symbol
		 */
		paintSymbol : function(g2d,symbol,part){
			if (symbol.getNature() === 'Vertical') {
				this.paintVLabel(g2d,symbol,part);
		    }
		    if (symbol.getNature() === 'Horizontal') {
		    	this.paintHLabel(g2d,symbol,part);
		    }
		},
		
		paintHLabel : function(g2d,symbol,part){
		  if(part === 'Device'){
				var b = symbol.getBound2D();
				if(this.barAnchor === 'bottom'){
					 this.setLocation(new JenScript.Point2D(b.getX(),b.getCenterY()));
				}
				else if(this.barAnchor === 'top'){
					 this.setLocation(new JenScript.Point2D(b.getX()+b.getWidth(),b.getCenterY()));
				}
				else if(this.barAnchor === 'middle'){
					 this.setLocation(new JenScript.Point2D(b.getCenterX(),b.getCenterY()));
				}
				this.paintLabel(g2d);
			}
		},
		
		paintVLabel : function(g2d,symbol,part){
			if(part === 'Device'){
				var b = symbol.getBound2D();
		        if(this.barAnchor === 'bottom'){
					 this.setLocation(new JenScript.Point2D(b.getCenterX(),b.getY()+b.getHeight()));
				}
				else if(this.barAnchor === 'top'){
					 this.setLocation(new JenScript.Point2D(b.getCenterX(),b.getY()));
				}
				else if(this.barAnchor === 'middle'){
					 this.setLocation(new JenScript.Point2D(b.getCenterX(),b.getCenterY()));
				}
				this.paintLabel(g2d);
			}
		},
		
	});
	
})();
(function(){
	JenScript.SymbolPointPainter = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPointPainter, JenScript.SymbolPainter);
	JenScript.Model.addMethods(JenScript.SymbolPointPainter,{
		
		_init : function(config){
			config=config||{};
			this.Id = 'symbolpainter'+JenScript.sequenceId++;
			JenScript.SymbolPainter.call(this, config);
		},
		
		/**
		 * override this method provides a point painter
		 * 
		 */
		paintSymbolPoint : function(g2d,point){},
		
		paintSymbol : function(g2d,symbol,viewPart) {
			 if (symbol.isVisible()) {
		            this.paintSymbolPoint(g2d,symbol);
		     }
		}
	});
	
	JenScript.SymbolPointSquare = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPointSquare, JenScript.SymbolPointPainter);
	JenScript.Model.addMethods(JenScript.SymbolPointSquare,{
		
		__init : function(config){
			config=config||{};
			JenScript.SymbolPointPainter.call(this, config);
		},
		
		paintSymbolPoint : function(g2d,point){
			var square = new JenScript.SVGRect().Id(this.Id).origin(point.devicePoint.x-2,point.devicePoint.y-2).size(4,4);
			square.fill(point.getThemeColor());
			g2d.insertSVG(square.toSVG());
		},
	});
})();
(function(){
	JenScript.SymbolPolylinePainter = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPolylinePainter, JenScript.SymbolPainter);
	JenScript.Model.addMethods(JenScript.SymbolPolylinePainter,{
		
		_init : function(config){
			config=config||{};
			this.Id = 'symbolpolyline'+JenScript.sequenceId++;
			JenScript.SymbolPainter.call(this, config);
		},
		
		paintSymbolPolyline : function(g2d,polyline){
			var points = polyline.getSymbolComponents();
			var svgPolyline = new JenScript.SVGPath().Id(this.Id);
			for (var i = 0; i < points.length; i++) {
				var point =points[i];
				if(i == 0)
					svgPolyline.moveTo(point.devicePoint.x,point.devicePoint.y);
				else
					svgPolyline.lineTo(point.devicePoint.x,point.devicePoint.y);
			}
			g2d.insertSVG(svgPolyline.stroke(polyline.getThemeColor()).fillNone().toSVG());
		},
		
		paintSymbol : function(g2d,symbol,viewPart) {
			 if (symbol.isVisible()) {
		            this.paintSymbolPolyline(g2d,symbol);
		     }
		}
	});
})();
(function(){
	
	JenScript.SymbolLayer = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.SymbolLayer,{
		
		init : function(config){
			config=config||{};
			/** host symbol plug in */
		    this.host;
		    /** layer symbols */
		    this.symbols = [];
		},
		
		 /**
	     * @return the host
	     */
	    getHost : function() {
	        return this.host;
	    },

	    /**
	     * @param host
	     *            the host to set
	     */
	    setHost : function(host) {
	        this.host = host;
	    },

	    /**
	     * add specified symbol in this layer
	     * 
	     * @param symbol
	     *            the symbol to add
	     */
	    addSymbol : function(symbol,repaint) {
	        symbol.setLayer(this);
	        this.symbols[this.symbols.length] = symbol;
	        if(repaint)
	        if(this.host !== undefined) this.host.repaintPlugin();
	    },

	    /**
	     * remove specified symbol in this layer
	     * 
	     * @param symbol
	     *            the symbol to remove
	     */
	    removeSymbol : function(symbol) {
	        //symbol.setLayer(null);
	        //symbols.remove(symbol);
	    },

	    /**
	     * count the symbols in this layer
	     * 
	     * @return the symbol number items
	     */
	    countSymbols : function() {
	        return this.symbols.length;
	    },

	    /**
	     * get symbol at the specified index
	     * 
	     * @param index
	     * @return symbol at the given index
	     */
	   getSymbol : function(index) {
	        return this.symbols[index];
	    },

	    /**
	     * get all registered symbol in this layer
	     * 
	     * @return the symbols
	     */
	    getSymbols : function() {
	        return this.symbols;
	    },

	    /**
	     * set symbol collection in this layer
	     * 
	     * @param symbols
	     *            the symbols to set
	     */
	    setSymbols : function(symbols) {
	        this.symbols = symbols;
	    },

	    /**
	     * get the symbol index for the specified symbol
	     * 
	     * @param symbol
	     * @return the symbol index, -1 otherwise
	     */
	   getSymbolIndex : function(symbol) {
	        if (symbol === undefined) {
	            return -1;
	        }
	        for (var i = 0; i < this.symbols.length; i++) {
	            var s = this.symbols[i];
	            if (s.equals(symbol)) {
	                return i;
	            }
	        }
	        return -1;
	    },
	    
	    
	    /**
	     * solve the specified component
	     * 
	     * @param symbol
	     */
	    solveSymbolComponent : function(symbol){},

	    /**
	     * solve this layer geometry
	     */
	    paintLayer : function(g2d,part,paintRequest){},
	                                   

	    /**
	     * return flatten symbol components in the projection
	     * flatten mean include symbol registered in group
	     * 
	     * @return the flattened list of symbol components
	     */
	    getFlattenSymbolComponents : function(){},

	    /**
	     * solve this layer geometry
	     */
	    solveGeometry : function() {
	        var symbols = this.getSymbols();
	        for (var i = 0; i < symbols.length; i++) {
	        	 if (!symbols[i].isFiller) {
		                this.solveSymbolComponent(symbols[i]);
		          }
			}
	    },

	   

	    /**
	     * call on mouse move
	     * 
	     * @param me
	     */
	    onMove : function(me){
	    },

	    /**
	     * call on mouse click
	     * 
	     * @param me
	     */
	    onClick : function(me){
	    },

	    /**
	     * call on mouse exit
	     * 
	     * @param me
	     */
	    onExit : function(me) {
	    },

	    /**
	     * call on mouse enter
	     * 
	     * @param me
	     */
	    onEnter : function(me) {
	    },

	    /**
	     * call on mouse press
	     * 
	     * @param me
	     */
	    onPress : function(me) {
	    },

	    /**
	     * call on mouse released
	     * 
	     * @param me
	     */
	    onRelease : function(me) {
	    },

	    /**
	     * call on mouse drag
	     * 
	     * @param me
	     */
	    onDrag : function(me) {
	    },

	    /**
	     * get symbol x Location
	     * 
	     * @param symbol
	     *            the bar component
	     * @return component x location
	     */
	    getComponentXLocation : function(symbol) {
	    	//System.out.println("symbol class : "+symbol.getClass().getSimpleName());
	    	if(symbol instanceof JenScript.SymbolStack){
	    		//System.out.println("location for stack"+((Stack)symbol).getHostSymbol());
	    		//symbol = ((Stack)symbol).getHostSymbol();
	    	}
	        var flattenSymbols = this.getFlattenSymbolComponents();
	        var total = 0;
	        var glues = [];
	        for (var i = 0; i < flattenSymbols.length; i++) {
				var bc = flattenSymbols[i];
				//console.log('symbols : '+bc.isFiller+','+ bc.getFillerType());
	            if (bc.isFiller && bc.getFillerType() === 'Glue') {
	            	//console.log('>glue');
	                glues[glues.length] = bc;
	            }
	            else {
	            	//console.log('>other comp');
	                total = total + bc.getThickness();
	            }
	        }
	        if (this.getHost().getProjection().getView().getDevice().getWidth() > total) {
	            var reste = this.getHost().getProjection().getView().getDevice().getWidth() - total;
	            var gluesCount = glues.length;
	            if (gluesCount > 0) {
	            	 for (var i = 0; i < glues.length; i++) {
	            		 var glue = glues[i];
	            		 glue.setThickness(reste / gluesCount);
	                }
	            }
	        }
	        var positionX = 0;
	        for (var i = 0; i < flattenSymbols.length; i++) {
				var bc = flattenSymbols[i];
	            if (!bc.equals(symbol)) {
	                positionX = positionX + bc.getThickness();
	            }
	            else {
	                return positionX;
	            }
	        }
	        return positionX;
	    },

	    /**
	     * get symbol y location
	     * 
	     * @param symbol
	     * @return component y location
	     */
	    getComponentYLocation : function(symbol) {
	        var flattenSymbols = this.getFlattenSymbolComponents();
	        var total = 0;
	        var glues = [];
	        for (var i = 0; i < flattenSymbols.length; i++) {
				var bc = flattenSymbols[i];
	            if (bc.isFiller && bc.getFillerType() === 'Glue') {
	            	 glues[glues.length] = bc;
	            }
	            else {
	                total = total + bc.getThickness();
	            }
	        }
	        if (this.getHost().getProjection().getView().getDevice().getHeight() > total) {
	            var reste = this.getHost().getProjection().getView().getDevice().getHeight() - total;
	            var gluesCount = glues.length;
	            if (gluesCount > 0) {
	            	for (var i = 0; i < glues.length; i++) {
	            		var glue = glues[i];
	                    glue.setThickness(reste / gluesCount);
	                }
	            }
	        }
	        var positionY = 0;
	        for (var i = 0; i < flattenSymbols.length; i++) {
				var bc = flattenSymbols[i];
	            if (!bc.equals(symbol)) {
	                positionY = positionY + bc.getThickness();
	            }
	            else {
	                return positionY;
	            }
	        }
	        return positionY;
	    }
		
	});
	
	
})();
(function(){
	
	/**
	 * Defines the symbol bar layer
	 * @constructor
	 * @param {Object} config the layer configuration
	 */
	JenScript.SymbolBarLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarLayer, JenScript.SymbolLayer);
	JenScript.Model.addMethods(JenScript.SymbolBarLayer,{
		
		/**
		 * Initialize symbol bar layer
		 * @param {Object} config the layer configuration
		 */
		_init : function(config){
			config=config||{};
			JenScript.SymbolLayer.call(this, config);
			this.symbolListeners = [];
		},
		
		/**
		 * String representation of this SymbolBarLayer
		 * @override
		 */
		toString : function(){
			return "JenScript.SymbolBarLayer";
		},
		
		/**
	     * add symbol listener with given action
	     * 
	     * enter : when symbol is entered
	     * exit : when symbol is exited
	     * move : when move in bar
	     * press : when symbol is pressed
	     * release : when symbol is released
	     * 
	     * 
	     * @param {String}   symbol action event type like enter, exit, press, release
	     * @param {Function} listener
	     * @param {String}   listener owner name
	     */
		addSymbolListener  : function(actionEvent,listener,name){
			if(name === undefined)
				throw new Error('Symbol listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener, name:name};
			this.symbolListeners[this.symbolListeners.length] =l;
		},
		
		/**
		 * fire listener when symbol is entered, exited, pressed, released
		 * @param {actionEvent}   event type name
		 * @param {Object}   event object
		 */
		fireSymbolEvent : function(actionEvent,event){
			for (var i = 0; i < this.symbolListeners.length; i++) {
				var l = this.symbolListeners[i];
				if(actionEvent === l.action){
					l.onEvent(event);
				}
			}
		},
		
		/**
		 * get flattened symbols
		 * @return symbols the flatten array symbols
		 */
	    getFlattenSymbolComponents : function() {
	       var flattenSymbolComponents = [];
	       for (var i = 0; i < this.getSymbols().length; i++) {
	    	    var comp = this.getSymbols()[i];
	    	   	if (comp instanceof JenScript.SymbolComponent && !(comp instanceof JenScript.SymbolBarGroup)) {
	    	   		flattenSymbolComponents[flattenSymbolComponents.length]=comp;
	            }
	            else if (comp instanceof JenScript.SymbolBarGroup) {
	            	var g =  comp.getSymbolComponents();
	            	for (var j = 0; j < g.length; j++) {
	            		flattenSymbolComponents[flattenSymbolComponents.length]=g[j];
					}
	            }
	       }
	        return flattenSymbolComponents;
	    },

	    /**
	     * paint layer
	     * 
	     * @param {Object}   g2d graphic context
	     * @param {String}   view part
	     * @param {String}   paint request, symbol or labels
	     */
	    paintLayer : function(g2d,viewPart,paintRequest) {
	        this.paintSymbols(g2d,this.getSymbols(),viewPart,paintRequest);
	    },

	    /**
	     * paint symbols
	     * 
	     * @param {Object}  g2d graphic context
	     * @param {Array} 	symbols
	     * @param {String}  view part
	     * @param {String}  paint request, symbol or labels
	     *            
	     */
	    paintSymbols : function(g2d,symbols,viewPart,paintRequest) {
	        this.solveGeometry();
	        if (viewPart === 'Device') {
	        	  for (var i = 0; i < symbols.length; i++) {
	   	    	   	var symbol = symbols[i];
		   	    	if (symbol instanceof JenScript.SymbolBar) {
		   	    		if (symbol instanceof JenScript.SymbolBarGroup) {
	                        this.paintGroup(g2d,symbol,viewPart,paintRequest);
	                    }
	                    else if (symbol instanceof JenScript.SymbolBarStacked) {
	                        this.paintBarStacked(g2d,symbol,viewPart, paintRequest);
	                    }
	                    else {
	                        this.paintBar(g2d,symbol,viewPart,paintRequest);
	                    }
		   	    	}
	            }
	        }
	        if (paintRequest === 'LabelLayer') {
	            this.paintSymbolsAxisLabel(g2d,symbols,viewPart);
	        }
	    },

	    /**
	     * paint group
	     * 
	     * @param {Object}  g2d graphic context
	     * @param {Object}  barGroup
	     * @param {String}  view part
	     * @param {String}  paint request, symbol or labels
	     */
	    paintGroup : function(g2d,barGroup,viewPart,paintRequest) {
	        barGroup.setHost(this.getHost());
	        barGroup.setLayer(this);
	        if (paintRequest === 'LabelLayer') {
	            this.paintBar(g2d,barGroup,viewPart,paintRequest);
	        }
	        var barSymbolComponents = barGroup.getSymbolComponents();
	        this.paintSymbols(g2d,barSymbolComponents,viewPart,paintRequest);
	    },

	    /**
	     * paint bars axis symbols
	     * 
	     * @param {Object}  g2d graphic context
	     * @param {Array} 	barSymbolComponents    the symbols components to paint
	     * @param {String}  view part
	     */
	    paintSymbolsAxisLabel : function(g2d,barSymbolComponents,viewPart) {
	    	 for (var i = 0; i < barSymbolComponents.length; i++) {
	   	    	var barComponent = barSymbolComponents[i];
	            barComponent.setHost(this.getHost());
	            if (barComponent instanceof JenScript.SymbolBar) {
	                if (barComponent instanceof JenScript.SymbolBarGroup) {
	                    var barGroup = barComponent;
	                    var groupBarSymbolComponents = barGroup.getSymbolComponents();

	                    this.paintSymbolsAxisLabel(g2d,groupBarSymbolComponents,viewPart);

	                    if (barGroup.getAxisLabel() != null) {
	                        barGroup.getAxisLabel().paintSymbol(g2d, barGroup, viewPart);
	                    }
	                }
	                else {
	                    this.paintBarAxisLabel(g2d,barComponent,viewPart);
	                }
	            }
	        }
	    },

	    /**
	     * paint bars axis symbols
	     * 
	     * @param {Object}  g2d graphic context
	     * @param {Object} barSymbol  the symbol component
	     * @param {String} viewPart
	     */
	    paintBarAxisLabel : function(g2d,barSymbol,viewPart) {
	        if (barSymbol.getAxisLabel() !== undefined) {
	            barSymbol.getAxisLabel().paintSymbol(g2d, barSymbol, viewPart);
	        }
	    },

	    /**
	     * paint bar
	     * 
	     * @param {Object} g2d graphic context
	     * @param {Object} bar  the bar to paint
	     * @param {String} viewPart
	     * @param {String} paint request      
	     */
	    paintBar : function(g2d,bar,viewPart,paintRequest) {
	        bar.setHost(this.getHost());
	        bar.setLayer(this);
	        if (paintRequest === 'SymbolLayer') {
	            if (bar.getBarFill() !== undefined) {
	                bar.getBarFill().paintSymbol(g2d,bar,viewPart);
	            }
	            if (bar.getBarEffect() !== undefined) {
	                bar.getBarEffect().paintSymbol(g2d,bar,viewPart);
	            }
	            if (bar.getBarStroke() !== undefined) {
	                bar.getBarStroke().paintSymbol(g2d,bar,viewPart);
	            }
	        }
	        else if (paintRequest == 'LabelLayer') {
	            if (bar.getBarLabel() != null) {
	                bar.getBarLabel().paintSymbol(g2d,bar,viewPart);
	            }
	        }
	    },
	    
	    /**
	     * paint stacked bar
	     * 
	     * @param {Object}  g2d graphic context
	     * @param {Object}  stackedBar the stacked bar symbol to paint
	     * @param {String}  view part
	     * @param {String}  paintRequest symbol or label paint request
	     */
	    paintBarStacked : function(g2d,stackedBar,viewPart,paintRequest) {
	        stackedBar.setHost(this.getHost());
	        stackedBar.setLayer(this);
	        var stacks = stackedBar.getStacks();
	        if (paintRequest === 'SymbolLayer') {
	            for (var i = 0; i < stacks.length; i++) {
	            	stacks[i].barFill = stackedBar.barFill;
	                this.paintBar(g2d, stacks[i],viewPart,paintRequest);
	            }
	            if (stackedBar.getBarEffect() !== undefined) {
	                stackedBar.getBarEffect().paintSymbol(g2d, stackedBar,viewPart);
	            }
	            if (stackedBar.getBarStroke() !== undefined) {
	                stackedBar.getBarStroke().paintSymbol(g2d, stackedBar, viewPart);
	            }
	        }
	        else if (paintRequest == 'LabelLayer') {
	            if (stackedBar.getBarLabel() != null) {
	                stackedBar.getBarLabel().paintSymbol(g2d,stackedBar, viewPart);
	            }
	            for (var i = 0; i < stacks.length; i++) {
	            	var s = stacks[i];
	                if (s.getBarLabel() != null) {
	                    s.getBarLabel().paintSymbol(g2d, s, viewPart);
	                }
	            }
	        }
	    },

	    /**
	     * solve symbol component
	     * @param {Object}  symbol the symbol to solve
	     */
	    solveSymbolComponent : function(symbol) {
	        if (symbol.isFiller) {
	            return;
	        }
	        symbol.setLayer(this);
	        if (this.getHost().getNature() === 'Vertical') {
	            this.solveVSymbolComponent(symbol);
	        }
	        if (this.getHost().getNature() === 'Horizontal') {
	            this.solveHSymbolComponent(symbol);
	        }
	    },

	    /**
	     * solve vertical component geometry
	     * 
	     * @param {Object}  symbol the vertical symbol to solve
	     */
	    solveVSymbolComponent : function(symbol) {
	        if (symbol.isFiller) {
	            return;
	        }
	        symbol.setNature('Vertical');
	        symbol.setLayer(this);
	        if (symbol instanceof JenScript.SymbolBarGroup) {
	            this.solveVBarGroup(symbol);
	        }
	        else if (symbol instanceof JenScript.SymbolBarStacked) {
	            this.solveVStackedBar(symbol);
	        }
	        else {
	            this.solveVBarSymbol(symbol);
	        }
	    },

	    /**
	     * solve vertical bar
	     * 
	     * @param {Object}  symbol the vertical symbol bar to solve
	     */
	    solveVBarSymbol : function(bar) {
	        if (this.getHost() === undefined || this.getHost().getProjection() === undefined) {
	            return;
	        }
	        bar.setHost(this.getHost());
	        var proj = this.getHost().getProjection();
	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() + bar.getValue());
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() - bar.getValue());
	        }
	        if (!bar.isValueSet()) {
	            throw new Error("bar symbol ascent or descent value should be supplied.");
	        }
	        if (!bar.isBaseSet()) {
	            throw new Error("bar symbol base value should be supplied.");
	        }

	        var p2ddevice = proj.userToPixel(p2dUser);
	        var p2dUserBase = new JenScript.Point2D(0, bar.getBase());
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var x = this.getComponentXLocation(bar);
	        var y = p2ddevice.y;
	        if (bar.isAscent()) {
	            y = p2ddevice.y;
	        }
	        if (bar.isDescent()) {
	            y = p2ddeviceBase.y;
	        }
	        var width = bar.getThickness();
	        var height = Math.abs(p2ddeviceBase.y - p2ddevice.y);

	        if (bar.getMorpheStyle() === 'Round') {
	        	var round = bar.getRound();
	        	var barPath = new JenScript.SVGPath().Id(bar.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y + round);
	                barPath.lineTo(x, y + height);
	                barPath.lineTo(x + width, y + height);
	                barPath.lineTo(x + width, y + round);
	                barPath.quadTo(x + width, y, x + width - round, y);
	                barPath.lineTo(x + round, y);
	                barPath.quadTo(x, y, x, y + round);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x, y + height - round);
	                barPath.quadTo(x, y + height, x + round, y + height);
	                barPath.lineTo(x + width - round, y + height);
	                barPath.quadTo(x + width, y + height, x + width, y + height - round);
	                barPath.lineTo(x + width, y);
	                barPath.close();
	            }
	            bar.setBarShape(barPath);
	        }
	        else if (bar.getMorpheStyle() === 'Rectangle') {
	            var barRec = new JenScript.SVGRect().origin(x, y).size(width,height);
	            bar.setBarShape(barRec);
	        }
	        bar.setBound2D(new JenScript.Bound2D(x,y,width,height));
	    },

	    /**
	     * solve the given vertical stacked bar
	     * 
	     * @param {Object}  stackedBar the vertical stacked bar symbol to solve
	     */
	    solveVStackedBar : function(stackedBar) {
	        if (this.getHost() === undefined || this.getHost().getProjection() === undefined) {
	            return;
	        }
	        stackedBar.setHost(this.getHost());
	        stackedBar.normalize();
	        var proj = this.getHost().getProjection();
	        var p2dUser = undefined;
	        if (stackedBar.isAscent()) {
	            p2dUser = new JenScript.Point2D(0, stackedBar.getBase() + stackedBar.getValue());
	        }
	        if (stackedBar.isDescent()) {
	            p2dUser = new JenScript.Point2D(0, stackedBar.getBase() - stackedBar.getValue());
	        }
	        if (!stackedBar.isValueSet()) {
	            throw new Error("stacked bar symbol ascent or descent value should be supplied.");
	        }
	        if (!stackedBar.isBaseSet()) {
	            throw new Error("stacked bar symbol base value should be supplied.");
	        }
	        var p2ddevice = proj.userToPixel(p2dUser);
	        var p2dUserBase = new JenScript.Point2D(0, stackedBar.getBase());
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);
	        var x = this.getComponentXLocation(stackedBar);
	        var y = p2ddevice.y;
	        if (stackedBar.isAscent()) {
	            y = p2ddevice.y;
	        }
	        if (stackedBar.isDescent()) {
	            y = p2ddeviceBase.y;
	        }
	        var width = stackedBar.getThickness();
	        var height = Math.abs(p2ddeviceBase.y - p2ddevice.y);
	        if (stackedBar.getMorpheStyle() === 'Round') {
	            var round = stackedBar.getRound();
	            var barPath = new JenScript.SVGPath().Id(stackedBar.Id);
	            if (stackedBar.isAscent()) {
	                barPath.moveTo(x, y + round);
	                barPath.lineTo(x, y + height);
	                barPath.lineTo(x + width, y + height);
	                barPath.lineTo(x + width, y + round);
	                barPath.quadTo(x + width, y, x + width - round, y);
	                barPath.lineTo(x + round, y);
	                barPath.quadTo(x, y, x, y + round);
	                barPath.close();
	            }
	            else if (stackedBar.isDescent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x, y + height - round);
	                barPath.quadTo(x, y + height, x + round, y + height);
	                barPath.lineTo(x + width - round, y + height);
	                barPath.quadTo(x + width, y + height, x + width, y + height  - round);
	                barPath.lineTo(x + width, y);
	                barPath.close();
	            }
	            stackedBar.setBarShape(barPath);
	        }
	        else if (stackedBar.getMorpheStyle() === 'Rectangle') {
	            var barRec = new JenScript.SVGRect().Id(stackedBar.Id).origin(x, y).size(width, height);
	            stackedBar.setBarShape(barRec);
	        }
	        
	        stackedBar.setBound2D(new JenScript.Bound2D(x,y,width,height));
	        
	        var stacks = stackedBar.getStacks();
	        var count = 0;
	        for (var i = 0; i < stacks.length; i++) {
				var stack = stacks[i];
	            stack.setThickness(stackedBar.getThickness());
	            stack.setBase(stackedBar.getStackBase(stack));
	            stack.setNature(stackedBar.getNature());
	            stack.setBarFill(stackedBar.getBarFill());
	            if (stackedBar.isAscent()) {
	                stack.setAscentValue(stack.getNormalizedValue());
	            }
	            else if (stackedBar.isDescent()) {
	                stack.setDescentValue(stack.getNormalizedValue());
	            }
	            var stackedp2dUser = undefined;
	            if (stackedBar.isAscent()) {
	                stackedp2dUser = new JenScript.Point2D(0,stackedBar.getStackBase(stack) + stack.getNormalizedValue());
	            }
	            else if (stackedBar.isDescent()) {
	                stackedp2dUser = new JenScript.Point2D(0,stackedBar.getStackBase(stack) - stack.getNormalizedValue());
	            }
	            var stackedp2ddevice = proj.userToPixel(stackedp2dUser);
	            var stackedp2dUserBase = new JenScript.Point2D(0, stackedBar.getStackBase(stack));
	            var stackedp2ddeviceBase = proj.userToPixel(stackedp2dUserBase);
	            var stackedx = this.getComponentXLocation(stackedBar);
	            var stackedy = stackedp2ddevice.y;
	            if (stackedBar.isAscent()) {
	                stackedy = stackedp2ddevice.y;
	            }
	            if (stackedBar.isDescent()) {
	                stackedy = stackedp2ddeviceBase.y;
	            }
	            var stackedwidth = stackedBar.getThickness();
	            var stackedheight = Math.abs(stackedp2ddeviceBase.y- stackedp2ddevice.y);
	            if (stackedBar.getMorpheStyle() === 'Round') {
	                if (count == stacks.length - 1) {
	                    var round = stackedBar.getRound();
	                    var barPath = new JenScript.SVGPath().Id(stack.Id);
	                    if (stackedBar.isAscent()) {
	                        barPath.moveTo(stackedx, stackedy + round);
	                        barPath.lineTo(stackedx, stackedy + stackedheight);
	                        barPath.lineTo(stackedx + stackedwidth, stackedy   + stackedheight);
	                        barPath.lineTo(stackedx + stackedwidth, stackedy    + round);
	                        barPath.quadTo(stackedx + stackedwidth, stackedy,   stackedx + stackedwidth - round, stackedy);
	                        barPath.lineTo(stackedx + round, stackedy);
	                        barPath.quadTo(stackedx, stackedy, stackedx, stackedy  + round);
	                        barPath.close();
	                    }
	                    else if (stackedBar.isDescent()) {
	                        barPath.moveTo(stackedx, stackedy);
	                        barPath.lineTo(stackedx, stackedy + stackedheight - round);
	                        barPath.quadTo(stackedx, stackedy + stackedheight,   stackedx + round, stackedy + stackedheight);
	                        barPath.lineTo(stackedx + stackedwidth - round,    stackedy + stackedheight);
	                        barPath.quadTo(stackedx + stackedwidth, stackedy    + stackedheight, stackedx + stackedwidth,  stackedy + stackedheight - round);
	                        barPath.lineTo(stackedx + stackedwidth, stackedy);
	                        barPath.close();
	                    }
	                   stack.setBarShape(barPath);
	                }
	                else {
	                    var barRec = new JenScript.SVGRect().Id(stack.Id).origin(stackedx,stackedy).size(stackedwidth, stackedheight);
	                    stack.setBarShape(barRec);
	                }
	            }
	            else if (stackedBar.getMorpheStyle() === 'Rectangle') {
	            	 var barRec = new JenScript.SVGRect().Id(stack.Id).origin(stackedx,stackedy).size(stackedwidth, stackedheight);
	                 stack.setBarShape(barRec);
	            }
	            stack.setBound2D(new JenScript.Bound2D(stackedx,stackedx,stackedwidth,stackedheight));
	            count++;
	        }
	    },

	    /**
	     * solve horizontal group
	     * 
	     * @param {Object}  barGroup the horizontal bar group symbol to solve
	     */
	    solveHBarGroup : function(barGroup) {
	        barGroup.setHost(this.getHost());
	        barGroup.copyToBar();
	        var bars = barGroup.getSymbolComponents();
	        for (var i = 0; i < bars.length; i++) {
	        	var bc = bars[i];
	        	bc.setLayer(this);
		        this.solveHSymbolComponent(bc);
			}
	    },

	    /**
	     * solve the specified horizontal component
	     * 
	     * @param {Object}  symbol the horizontal symbol to solve
	     */
	    solveHSymbolComponent : function(symbol) {
	        if (symbol.isFiller) {
	            return;
	        }
	        symbol.setNature('Horizontal');
	        if (symbol instanceof JenScript.SymbolBarGroup) {
	            this.solveHBarGroup(symbol);
	        }
	        else if (symbol instanceof JenScript.SymbolBarStacked) {
	            this.solveHStackedBar(symbol);
	        }
	        else {
	            this.solveHBarSymbol(symbol);
	        }
	    },

	    /**
	     * solve horizontal bar group
	     * 
	     * @param {Object}  barGroup the vertical bar group symbol to solve
	     */
	    solveVBarGroup : function(barGroup) {
	        barGroup.setHost(this.getHost());
	        barGroup.copyToBar();
	       var bars = barGroup.getSymbolComponents();
	       for (var i = 0; i < bars.length; i++) {
	    	   var bc = bars[i];
	    	   bc.setLayer(this);
	           bc.setHost(this.getHost());
	           this.solveVSymbolComponent(bc);
	       }
	    },

	    /**
	     * solve horizontal bar
	     * 
	     * @param {Object}  bar the horizontal bar symbol to solve
	     */
	    solveHBarSymbol : function(bar) {
	        if (this.getHost() === undefined || this.getHost().getProjection() === undefined) {
	            return;
	        }
	        bar.setHost(this.getHost());
	        var proj = this.getHost().getProjection();

	        var p2dUser = undefined;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(bar.getBase() + bar.getValue(), 0);
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(bar.getBase() - bar.getValue(), 0);
	        }
	        if (!bar.isValueSet()) {
	            throw new Error("bar symbol ascent or descent value should be supplied.");
	        }
	        if (!bar.isBaseSet()) {
	            throw new error("stacked bar symbol base value should be supplied.");
	        }
	        var p2ddevice = proj.userToPixel(p2dUser);
	        var p2dUserBase = new JenScript.Point2D(bar.getBase(), 0);
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);
	        var y = this.getComponentYLocation(bar);
	        var x = p2ddeviceBase.x;
	        if (bar.isAscent()) {
	            x = p2ddeviceBase.x;
	        }
	        if (bar.isDescent()) {
	            x = p2ddevice.x;
	        }
	        var height = bar.getThickness();
	        var width = Math.abs(p2ddevice.x - p2ddeviceBase.x);
	        if (bar.getMorpheStyle() == 'Round') {
	        	var round = bar.getRound();
	            var barPath = new JenScript.SVGPath().Id(this.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x + width - round, y);
	                barPath.quadTo(x + width, y, x + width, y + round);
	                barPath.lineTo(x + width, y + height - round);
	                barPath.quadTo(x + width, y + height, x + width - round, y + height);
	                barPath.lineTo(x, y + height);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x + round, y);
	                barPath.lineTo(x + width, y);
	                barPath.lineTo(x + width, y + height);
	                barPath.lineTo(x + round, y + height);
	                barPath.quadTo(x, y + height, x, y + height - round);
	                barPath.lineTo(x, y + round);
	                barPath.quadTo(x, y, x + round, y);
	                barPath.close();
	            }
	            bar.setBarShape(barPath);
	        }
	        else {
	            var barRec = new JenScript.SVGRect().Id(this.Id).origin(x,y).size(width,height);
	            bar.setBarShape(barRec);
	        }
	        bar.setBound2D(new JenScript.Bound2D(x,y,width,height));
	    },

	    /**
	     * solve the horizontal stacked bar
	     * 
	     * @param {Object}  stackedBar the horizontal stacked bar symbol to solve
	     */
	    solveHStackedBar : function(stackedBar) {
	        if (this.getHost() == null || this.getHost().getProjection() == null) {
	            return;
	        }
	        stackedBar.setHost(this.getHost());
	        stackedBar.normalize();
	        var proj = this.getHost().getProjection();
	        var p2dUser = undefined;
	        if (stackedBar.isAscent()) {
	            p2dUser = new JenScript.Point2D(stackedBar.getBase() + stackedBar.getValue(), 0);
	        }
	        if (stackedBar.isDescent()) {
	            p2dUser = new JenScript.Point2D(stackedBar.getBase()- stackedBar.getValue(), 0);
	        }
	        if (!stackedBar.isValueSet()) {
	            throw new Error("stacked bar symbol ascent or descent value should be supplied.");
	        }
	        if (!stackedBar.isBaseSet()) {
	            throw new Error("stacked bar symbol base value should be supplied.");
	        }
	        var p2ddevice = proj.userToPixel(p2dUser);
	        var p2dUserBase = new JenScript.Point2D(stackedBar.getBase(), 0);
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);
	        var y = this.getComponentYLocation(stackedBar);
	        var x = p2ddeviceBase.x;
	        if (stackedBar.isAscent()) {
	            x = p2ddeviceBase.x;
	        }
	        if (stackedBar.isDescent()) {
	            x = p2ddevice.x;
	        }
	        var height = stackedBar.getThickness();
	        var width = Math.abs(p2ddevice.x - p2ddeviceBase.x);

	        if (stackedBar.getMorpheStyle() === 'Round') {
	        	var round = stackedBar.getRound();
	        	var barPath = new JenScript.SVGPath().Id(stackedBar.Id);
	            if (stackedBar.isAscent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x + width - round, y);
	                barPath.quadTo(x + width, y, x + width, y + round);
	                barPath.lineTo(x + width, y + height - round);
	                barPath.quadTo(x + width, y + height, x + width - round, y + height);
	                barPath.lineTo(x, y + height);
	                barPath.close();
	            }
	            else if (stackedBar.isDescent()) {
	                barPath.moveTo(x + round, y);
	                barPath.lineTo(x + width, y);
	                barPath.lineTo(x + width, y + height);
	                barPath.lineTo(x + round, y + height);
	                barPath.quadTo(x, y + height, x, y + height - round);
	                barPath.lineTo(x, y + round);
	                barPath.quadTo(x, y, x + round, y);
	                barPath.close();
	            }
	            stackedBar.setBarShape(barPath);
	        }
	        else {
	        	  var barRec = new JenScript.SVGRect().Id(stackedBar.Id).origin(x,y).size(width,height);
	        	  stackedBar.setBarShape(barRec);
	        }
	        
	        stackedBar.setBound2D(new JenScript.Bound2D(x,y,width,height));
	        
	        var stacks = stackedBar.getStacks();
	        var count = 0;
	        for (var i = 0; i < stacks.length; i++) {
				var stack = stacks[i];
	            stack.setThickness(stackedBar.getThickness());
	            stack.setBase(stackedBar.getStackBase(stack));
	            stack.setNature(stackedBar.getNature());
	            stack.setBarFill(stackedBar.getBarFill());

	            if (stackedBar.isAscent()) {
	                stack.setAscentValue(stack.getNormalizedValue());
	            }
	            else if (stackedBar.isDescent()) {
	                stack.setDescentValue(stack.getNormalizedValue());
	            }

	            var stackedp2dUser = null;
	            if (stackedBar.isAscent()) {
	                stackedp2dUser = new JenScript.Point2D( stackedBar.getStackBase(stack) + stack.getNormalizedValue(), 0);
	            }
	            else if (stackedBar.isDescent()) {
	                stackedp2dUser = new JenScript.Point2D(stackedBar.getStackBase(stack) - stack.getNormalizedValue(), 0);
	            }
	            var stackedp2ddevice = proj.userToPixel(stackedp2dUser);
	            var stackedp2dUserBase = new JenScript.Point2D(stackedBar.getStackBase(stack), 0);
	            var stackedp2ddeviceBase = proj.userToPixel(stackedp2dUserBase);

	            var stackedy = this.getComponentYLocation(stackedBar);
	            var stackedx = stackedp2ddeviceBase.x;
	            if (stackedBar.isAscent()) {
	                stackedx = stackedp2ddeviceBase.x;
	            }
	            if (stackedBar.isDescent()) {
	                stackedx = stackedp2ddevice.x;
	            }
	            var stackedheight = stackedBar.getThickness();
	            var stackedwidth = Math.abs(stackedp2ddevice.x - stackedp2ddeviceBase.x);

	            if (stackedBar.getMorpheStyle() === 'Round') {
	                if (count == stacks.length - 1) {
	                    var round = stackedBar.getRound();
	                    var barPath = new JenScript.SVGPath().Id(stack.Id);
	                    if (stackedBar.isAscent()) {
	                        barPath.moveTo(stackedx, stackedy);
	                        barPath.lineTo(stackedx + stackedwidth - round,stackedy);
	                        barPath.quadTo(stackedx + stackedwidth, stackedy,  stackedx + stackedwidth, stackedy + round);
	                        barPath.lineTo(stackedx + stackedwidth, stackedy  + stackedheight - round);
	                        barPath.quadTo(stackedx + stackedwidth, stackedy  + stackedheight, stackedx + stackedwidth   - round, stackedy + stackedheight);
	                        barPath.lineTo(stackedx, stackedy + stackedheight);
	                        barPath.close();
	                    }
	                    else if (stackedBar.isDescent()) {
	                        barPath.moveTo(stackedx + round, stackedy);
	                        barPath.lineTo(stackedx + stackedwidth, stackedy);
	                        barPath.lineTo(stackedx + stackedwidth, stackedy + stackedheight);
	                        barPath.lineTo(stackedx + round, stackedy + stackedheight);
	                        barPath.quadTo(stackedx, stackedy + stackedheight,stackedx, stackedy + stackedheight - round);
	                        barPath.lineTo(stackedx, stackedy + round);
	                        barPath.quadTo(stackedx, stackedy, stackedx + round,  stackedy);
	                                     
	                        barPath.close();
	                    }
	                    stack.setBarShape(barPath);
	                }
	                else {
	                	var barRec = new JenScript.SVGRect().Id(stack.Id).origin(stackedx,stackedy).size(stackedwidth,stackedheight);
	                	stack.setBarShape(barRec);
	                }
	            }
	            else {
	            	 var barRec = new JenScript.SVGRect().Id(stack.Id).origin(stackedx,stackedy).size(stackedwidth,stackedheight);
	            	 stack.setBarShape(barRec);
	            }
	            stack.setBound2D(new JenScript.Bound2D(stackedx,stackedy,stackedwidth,stackedheight));
	            count++;
	        }
	    },
	   
	    onRelease : function(evt,part,x, y) {
	    	this.barCheck('release',evt,x,y);
	    },
	   
	    onPress : function(evt,part,x, y) {
	    	this.barCheck('press',evt,x,y);
	    },
	   
	    onMove : function(evt,part,x, y) {
	    	this.barCheck('move',evt,x,y);
	    },
	    
	    /**
	     * check symbol event
	     * 
	     * @param {String}  action the action press, release, move, etc.
	     * @param {Object}  original event
	     * @param {Number}  x location
	     * @param {Number}  y location
	     */
	    barCheck: function(action, evt,x,y){
	    	var that=this;
	    	var _d = function(bar){
	    	   if(action === 'press')
	    		   that.fireSymbolEvent('press',{symbol : bar, x:x,y:y, device :{x:x,y:y}});
               else if(action === 'release')
            	   that.fireSymbolEvent('release',{symbol : bar, x:x,y:y, device :{x:x,y:y}});
               else 
            	   that.barEnterExitTracker(bar,x,y);
	    	};
	    	var _c = function(bar){
	    		if(bar.isFiller) return;
	    		var contains = (bar.getBound2D() !== undefined  && bar.getBound2D().contains(x,y));
        		if(action !== 'move' && contains && bar.isLockEnter()){
        			_d(bar);
        		}
        		else if (action === 'move') {
                	_d(bar);
                }
	    	};
	    	 var bars = this.getSymbols();
		        for (var i = 0; i < bars.length; i++) {
		        	
		        	var symbolComponent = bars[i];
		        	
		            if (symbolComponent instanceof JenScript.SymbolBarStacked) {
		                var stackedBar = symbolComponent;
		                _c(stackedBar);
		               var barStacks = stackedBar.getStacks();
		               for (var j = 0; j < barStacks.length; j++) {
		            	   var barStack = barStacks[j];
		            		_c(barStack);
		                }
		            }
		            else if (symbolComponent instanceof JenScript.SymbolBarGroup) {
		                var group = symbolComponent;
		                var gss = group.getSymbolComponents();
		                for (var k = 0; k < gss.length; k++) {
		                	var sg = gss[k];
		                    if (sg instanceof JenScript.SymbolBarStacked) {
		                        var stackedBar = sg;
		                        if (stackedBar.getBound2D() !== undefined   && stackedBar.getBound2D().contains(x, y)) {
		                        	_c(stackedBar);
		                        }
		                        var barStacks = stackedBar.getStacks();
		     	                for (var j = 0; j < barStacks.length; j++) {
		     	            	   var barStack = bars[j];
		     	                    if (barStack.getBound2D() !== undefined  && barStack.getBound2D().contains(x,y) && barStack.isLockEnter()) {
		     	                    	_c(barStack);
		     	                    }
		     	                }
		                    }
		                    else if (sg instanceof JenScript.SymbolBar) {
		                        if (sg.getBound2D() !== undefined  && sg.getBound2D().contains(x, y) && sg.isLockEnter()) {
		                        	_c(sg);
		                        }
		                    }
		                }
		            }
		            else if (symbolComponent instanceof JenScript.SymbolBar) {
		                _c(symbolComponent);
		            }
		        }
	    },

	    /**
	     * track bar enter or exit for the specified bar for device location x,y
	     * 
	     * @param {Object}  bar symbol
	     * @param {Number}  x location in device coordinate
	     * @param {Number}  y location in device coordinate
	     */
	    barEnterExitTracker : function(bar,x,y) {
	        if (bar.getBound2D() === undefined) {
	            return;
	        }
	        if (bar.getBound2D().contains(x, y) && !bar.isLockEnter()) {
	            bar.setLockEnter(true);
	            this.fireSymbolEvent('enter',{symbol : bar, x:x,y:y, device :{x:x,y:y}});
	        }
	        if (bar.getBound2D().contains(x, y) && bar.isLockEnter()) {
	            this.fireSymbolEvent('move',{symbol : bar, x:x,y:y, device :{x:x,y:y}});
	        }
	        else if (!bar.getBound2D().contains(x, y) && bar.isLockEnter()) {
	            bar.setLockEnter(false);
	            this.fireSymbolEvent('exit',{symbol : bar, x:x,y:y, device :{x:x,y:y}});
	        }
	    },
	});
})();
(function(){
	
	JenScript.SymbolPointLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPointLayer, JenScript.SymbolLayer);
	JenScript.Model.addMethods(JenScript.SymbolPointLayer,{
		
		_init : function(config){
			config=config||{};
			JenScript.SymbolLayer.call(this, config);
			this.symbolListeners = [];
		},
		
		/**
	     * add symbol listener with given action
	     * 
	     * enter : when symbol is entered
	     * exit : when symbol is exited
	     * move : when move in bar
	     * press : when symbol is pressed
	     * release : when symbol is released
	     * 
	     * 
	     * @param {String}   symbol action event type like enter, exit, press, release
	     * @param {Function} listener
	     * @param {String}   listener owner name
	     */
		addSymbolListener  : function(actionEvent,listener,name){
			if(name === undefined)
				throw new Error('Symbol listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener, name:name};
			this.symbolListeners[this.symbolListeners.length] =l;
		},
		
		/**
		 * fire listener when symbol is entered, exited, pressed, released
		 */
		fireSymbolEvent : function(actionEvent,bar){
			for (var i = 0; i < this.symbolListeners.length; i++) {
				var l = this.symbolListeners[i];
				if(actionEvent === l.action){
					l.onEvent(bar);
				}
			}
		},
		
		
	    getFlattenSymbolComponents : function() {
	        var flattenSymbolComponents = [];
	    	for (var i = 0; i < this.getSymbols().length; i++) {
				var comp = this.getSymbols()[i];
				if (comp instanceof JenScript.SymbolComponent   && !(comp instanceof JenScript.SymbolPolylinePoint)) {
	                flattenSymbolComponents[flattenSymbolComponents.length] = comp;
	            }
	    	}
	        return flattenSymbolComponents;
	    },

	    
	   paintLayer : function(g2d,viewPart,paintRequest) {
	        if (viewPart === 'Device' && paintRequest === 'SymbolLayer') {
	        	for (var i = 0; i < this.getSymbols().length; i++) {
					var ps = this.getSymbols()[i];
					
	                if (!ps.isFiller) {
	                    if (ps instanceof JenScript.SymbolPoint && !(ps instanceof JenScript.SymbolPolylinePoint)) {
	                    	var painters = ps.getPointSymbolPainters();
	                    	for (var j = 0; j < painters.length; j++) {
	                    		painters[j].paintSymbol(g2d, ps, viewPart);
							}
	                    }
	                    else if (ps instanceof JenScript.SymbolPolylinePoint) {
	                        if (ps.getPolylinePainter() !== undefined) {
	                            ps.getPolylinePainter().paintSymbol(g2d, ps, viewPart);
	                        }
	                    }

	                }
				}
	           
	        }
	    },

	    
	   solveSymbolComponent : function(symbol) {
	        if (symbol.isFiller) {
	            return;
	        }
	        if (this.getHost().getNature() === 'Vertical') {
	            this.solveVSymbolComponent(symbol);
	        }
	        if (this.getHost().getNature() === 'Horizontal') {
	            this.solveHSymbolComponent(symbol);
	        }
	    },

	    /**
	     * solve vertical component geometry
	     * 
	     * @param symbol
	     *            the component to solve
	     */
	   solveVSymbolComponent : function(symbol) {
	        symbol.setNature('Vertical');
	        if (symbol instanceof JenScript.SymbolPoint && !(symbol instanceof JenScript.SymbolPolylinePoint)) {
	            this.solveVPointSymbol(symbol);
	        }
	        else if (symbol instanceof JenScript.SymbolPolylinePoint) {
	            // does not solving for polyline
	        }
	    },

	    /**
	     * solve the specified horizontal component
	     * 
	     * @param symbol
	     *            the bar component to solve
	     */
	    solveHSymbolComponent : function(symbol) {
	        symbol.setNature(SymbolNature.Horizontal);
	        if (symbol instanceof PointSymbol && !(symbol instanceof PolylinePointSymbol)) {
	            solveHPointSymbol(symbol);
	        }
	        else if (symbol instanceof PolylinePointSymbol) {
	            // does not solving for polyline
	        }
	    },

	    /**
	     * solve symbol points for vertical nature
	     * 
	     * @param pointSymbol
	     *            the symbol point to solve
	     */
	    solveVPointSymbol : function(pointSymbol) {
	        var proj = this.getHost().getProjection();
	        pointSymbol.setHost(this.getHost());
	        var p2dUser = new JenScript.Point2D(0, pointSymbol.getValue());
	        var p2ddevice = proj.userToPixel(p2dUser);
	        pointSymbol.setDeviceValue(p2ddevice.getY());
	        var x = this.getComponentXLocation(pointSymbol);
	        var devicePoint = new JenScript.Point2D(x, p2ddevice.getY());
	        var rectangle = new JenScript.SVGRect().origin(devicePoint.getX() - pointSymbol.getSensibleRadius(),  devicePoint.getY() - pointSymbol.getSensibleRadius())
	                                               .size(2 * pointSymbol.getSensibleRadius(),2 * pointSymbol.getSensibleRadius());
	                                                     
	        pointSymbol.setSensibleShape(rectangle);
	        pointSymbol.setDevicePoint(devicePoint);
	    },

	    /**
	     * solve symbol points for horizontal nature
	     * 
	     * @param pointSymbol
	     *            the symbol point to solve
	     */
	    solveHPointSymbol : function(pointSymbol) {
	        var w2d = this.getHost().getProjection();
	        pointSymbol.setHost(this.getHost());
	        var p2dUser = new JenScript.Point2D(pointSymbol.getValue(), 0);
	        var p2ddevice = w2d.userToPixel(p2dUser);
	        pointSymbol.setDeviceValue(p2ddevice.getX());
	        //var y = this.getComponentYLocation(pointSymbol);
	        pointSymbol.setDevicePoint(new JenScript.Point2D(p2ddevice.getX(), pointSymbol.getLocationY()));
	    },

	   
	   onRelease : function(evt,part,x, y) {
//	    	 var symbols = this.getSymbols();
//		     for (var i = 0; i < symbols.length; i++) {
//		    	   var symbolComponent = symbols[i];
//		            if (symbolComponent instanceof JenScript.SymbolPoint) {
//		                if (symbolComponent.getSensibleShape() != undefined
//		                        && symbolComponent.getSensibleShape().contains(x, y)
//		                        && symbolComponent.isLockEnter()) {
//		                	  this.fireSymbolEvent('release',{symbol : symbolComponent, x:x,y:y, device :{x:x,y:y}});
//		                }
//		            }
//
//		     }
	    },

	  
	   onPress : function(evt,part,x, y) {
//		   var symbols = this.getSymbols();
//	       for (var i = 0; i < symbols.length; i++) {
//	    	   var symbolComponent = symbols[i];
//	            if (symbolComponent instanceof JenScript.SymbolPoint) {
//	                if (symbolComponent.getSensibleShape() != undefined
//	                        && symbolComponent.getSensibleShape().contains(x, y)
//	                        && symbolComponent.isLockEnter()) {
//	                	 this.fireSymbolEvent('press',{symbol : symbolComponent, x:x,y:y, device :{x:x,y:y}});
//	                }
//	            }
//
//	        }
	    },

	   

	   
	   onMove : function(evt,part,x, y) {
//	       var symbols = this.getSymbols();
//	       for (var i = 0; i < symbols.length; i++) {
//	    	   var symbolComponent = symbols[i];
//			   if (symbolComponent instanceof PointSymbol) {
//	                this.barEnterExitTracker(symbolComponent, x, y);
//	            }
//	       }
	    },
	    
	    /**
	     * track symbol enter or exit for the specified symbol for device location x,y
	     * 
	     * @param bar
	     *            the bar to track
	     * @param x
	     *            the x in device coordinate
	     * @param y
	     *            the y in device coordinate
	     */
	    symbolEnterExitTracker : function(symbol,x,y) {
	        if (symbol.getBound2D() === undefined) {
	            return;
	        }
	        if (symbol.getBound2D().contains(x, y) && !symbol.isLockEnter()) {
	            symbol.setLockEnter(true);
	            this.fireSymbolEvent('enter',{symbol : symbol, x:x,y:y, device :{x:x,y:y}});
	        }
	        else if (!symbol.getBound2D().contains(x, y) && symbol.isLockEnter()) {
	            symbol.setLockEnter(false);
	            this.fireSymbolEvent('exit',{symbol : symbol, x:x,y:y, device :{x:x,y:y}});
	        }
	    },


	});
})();
(function(){
		
	/**
	 * Defines Symbol plugin
	 * @constructor
	 * @param {Object} config the plugin configuration
	 */
	JenScript.SymbolPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.SymbolPlugin,{
		
		/**
		 * Initialize symbol plugin with given configuration
		 * @param {Object} config the plugin configuration
		 */
		_init : function(config){
			config=config||{};
			config.name='SymbolPlugin';
			config.priority = 500;
			JenScript.Plugin.call(this,config);
			/** symbol nature */
		    this.nature = (config.nature !== undefined)?config.nature : 'Vertical';
		    /** symbol layers */
		    this.layers = [];
		},
		
		/**
		 * String of representation of this symbol plugin
		 * @override
		 */
		toString : function(){
			return 'JenScript.SymbolPlugin';
		},
		
		/**
		 * on projection register add 'bound changed' projection listener that invoke repaint plugin
		 * when projection bound changed event occurs.
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'SymbolPlugin projection bound changed');
		},
		
		 /**
	     * get the plug in symbol nature
	     * 
	     * @return the plug in symbol nature
	     */
	    getNature : function() {
	        return this.nature;
	    },

	    /**
	     * set the plug in symbol nature
	     * 
	     * @param {String} nature the symbol nature, vertical or horizontal
	     */
	    setNature : function(nature) {
	        this.nature = nature;
	    },

	    /**
	     * add the specified symbol layer to this symbol plug in
	     * 
	     * @param {Object} layer the layer to add
	     */
	    addLayer : function(layer) {
	        layer.setHost(this);
	        this.layers[this.layers.length]=layer;
	        this.repaintPlugin();
	    },


	    /**
	     * count the number of layer registered in this symbol plug in
	     * @return the numbers of layers in this symbol plugin
	     */
	    countLayers : function() {
	        return this.layers.length;
	    },

	    /**
	     * get the layer at the specified index
	     * 
	     * @param {Number} index  the layer index
	     * @return layer at the given index
	     */
	    getLayer : function(index) {
	        return this.layers[index];
	    },

	   /**
	    * paint symbols
	    * @param {Object} g2d the graphic context
	    * @param {String} viewPart the view part
	    */
	    paintPlugin : function(g2d,viewPart) {
	    	//if(viewPart !== 'Device') return;
	        this.solveLayers();
	        for (var i = 0; i < this.countLayers(); i++) {
	        	var layer = this.getLayer(i);
	            layer.paintLayer(g2d,viewPart,'SymbolLayer');
	            layer.paintLayer(g2d,viewPart,'LabelLayer');
	        }
	    },
	    
	    /**
	     * solve layer
	     */
	    solveLayers : function() {
	        for (var i = 0; i < this.countLayers(); i++) {
	            this.getLayer(i).solveGeometry();
	        }
	    },

	    onRelease : function(evt,part,x, y) {
	        for (var i = 0; i < this.countLayers(); i++) {
	           this.getLayer(i).onRelease(evt,part,x, y);
	        }
	    },

	   onPress : function(evt,part,x, y) {
	        for (var i = 0; i < this.countLayers(); i++) {
	            this.getLayer(i).onPress(evt,part,x, y);
	        }
	    },
	   
	   onMove : function(evt,part,x, y) {
	        for (var i = 0; i < this.countLayers(); i++) {
	            this.getLayer(i).onMove(evt,part,x, y);
	        }
	    },
	});
})();