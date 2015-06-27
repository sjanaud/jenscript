(function(){
	/**
	 * Object Ray()
	 * Defines Ray
	 * @param {Object} config ray configuration
	 * @param {Object} [config.name] ray name
	 * @param {Object} [config.Id] ray Id, generated if undefined
	 * 
	 */
	JenScript.Ray = function(config){
		config = config||{};
		this.name = (config.name !== undefined)?config.name:'ray name undefined';
		this.Id = (config.Id !== undefined)?config.Id:'ray'+JenScript.sequenceId++;
	    /** the ray theme color */
	    this.themeColor = (config.themeColor !== undefined)?config.themeColor:'blue';
	    /**ray opacity*/
	    this.opacity = (config.opacity !== undefined)?config.opacity : 1;
	    /** the ray thickness */
	    this.thickness;
	    /** the ray thickness type, device or user coordinate */
	    this.thicknessType; 
	    /** the center of the ray value in user coordinate */
	    this.ray;
	    /** the ray base */
	    this.rayBase;
	    /** the ray value in device coordinate */
	    this.rayValue;
	    /** ray ascent */
	    this.ascent = false;
	    /** ray descent */
	    this.descent = false;
	    /** ray nature, XRay or YRay */
	    this.rayNature;
	    /** the ray basic shape */
	    this.rayShape;
	    /** the ray draw painter */
	    this.rayDraw;
	    /** the ray fill painter */
	    this.rayFill = new JenScript.RayFill0();
	    /** the ray effect painter */
	    this.rayEffect;
	    /** the ray label painter */
	    this.rayLabel;
	    /** the ray axis label painter */
	    this.rayAxisLabel;
	    /** the ray host plugin */
	    this.plugin;
	    /** enter flag */
	    this.lockEnter = false;
	    /** boolean inflating operation flag */
	    this.inflating = false;
	    /** deflating operation flag */
	    this.deflating = false;
	    this.bound2D;
	};
	
	JenScript.Model.addMethods(JenScript.Ray,{
		
		 /**
	     * get the bound2D
	     * 
	     * @return bound2D
	     */
	    getBound2D : function() {
	        return this.bound2D;
	    },

	    /**
	     * set bound2D
	     * 
	     * @param bound2D
	     *            the bound2D to set
	     */
	    setBound2D : function(bound2D) {
	        this.bound2D = bound2D;
	    },

	    
		 /**
	     * get the ray draw painter
	     * 
	     * @return ray draw painter
	     */
	    getRayDraw : function() {
	        return this.rayDraw;
	    },

	    /**
	     * set ray draw painter
	     * 
	     * @param rayDraw
	     *            the ray draw painter to set
	     */
	    setRayDraw : function(rayDraw) {
	        this.rayDraw = rayDraw;
	    },

	    /**
	     * get the ray fill painter
	     * 
	     * @return ray fill painter
	     */
	    getRayFill : function() {
	        return this.rayFill;
	    },

	    /**
	     * set the ray fill painter
	     * 
	     * @param rayFill
	     *            the ray fill painter to set
	     */
	    setRayFill : function(rayFill) {
	        this.rayFill = rayFill;
	    },

	    /**
	     * get the ray effect painter
	     * 
	     * @return the ray effect painter
	     */
	    getRayEffect : function() {
	        return this.rayEffect;
	    },

	    /**
	     * set the ray effect
	     * 
	     * @param rayEffect
	     *            the ray effect painter to set
	     */
	    setRayEffect : function(rayEffect) {
	        this.rayEffect = rayEffect;
	    },

	    /**
	     * get the ray label
	     * 
	     * @return the rayLabel
	     */
	    getRayLabel : function() {
	        return this.rayLabel;
	    },

	    /**
	     * set the ray label
	     * 
	     * @param rayLabel
	     *            the rayLabel to set
	     */
	    setRayLabel : function(rayLabel) {
	        this.rayLabel = rayLabel;
	    },

	    /**
	     * get ray axis label
	     * 
	     * @return the rayAxisLabel
	     */
	    getRayAxisLabel : function() {
	        return this.rayAxisLabel;
	    },

	    /**
	     * set the ray axis label
	     * 
	     * @param rayAxisLabel
	     *            the rayAxisLabel to set
	     */
	    setRayAxisLabel : function(rayAxisLabel) {
	        this.rayAxisLabel = rayAxisLabel;
	    },

	    /**
	     * get the ray name
	     * 
	     * @return the ray name
	     */
	    getName : function() {
	        return this.name;
	    },

	    /**
	     * set the ray name
	     * 
	     * @param name
	     *            the ray name to set
	     */
	    setName : function(name) {
	        this.name = name;
	    },

	    /**
	     * get the ray theme color
	     * 
	     * @return the ray theme color
	     */
	    getThemeColor : function() {
	        return this.themeColor;
	    },

	    /**
	     * set the ray theme color
	     * 
	     * @param themeColor
	     *            the theme color to set
	     */
	    setThemeColor : function(themeColor) {
	        this.themeColor = themeColor;
	    },

	    /**
	     * get the ray thickness
	     * 
	     * @return the ray thickness
	     */
	    getThickness : function() {
	        return this.thickness;
	    },

	    /**
	     * set the ray thickness
	     * 
	     * @param thickness
	     *            the ray thickness to set
	     */
	    setThickness : function(thickness) {
	        this.thickness = thickness;
	    },

	    /**
	     * get the thickness type
	     * 
	     * @return the thickness type
	     */
	    getThicknessType : function() {
	        return this.thicknessType;
	    },

	    /**
	     * set the thickness type
	     * 
	     * @param thicknessType
	     *            the ray thickness to set
	     */
	    setThicknessType : function(thicknessType) {
	        this.thicknessType = thicknessType;
	    },

	    /**
	     * get the ray nature
	     * 
	     * @return the ray nature
	     */
	    getRayNature : function() {
	        return this.rayNature;
	    },

	    /**
	     * set the ray nature
	     * 
	     * @param rayNature
	     *            the ray nature to set
	     */
	    setRayNature : function(rayNature) {
	        this.rayNature = rayNature;
	    },

	    /**
	     * get the ray define by the ray center in user coordinate
	     * 
	     * @return the ray center in user coordinate
	     */
	    getRay : function() {
	        return this.ray;
	    },

	    /**
	     * set the ray center in user coordinate
	     * 
	     * @param ray
	     *            the ray center in user coordinate to set
	     */
	    setRay : function(ray) {
	        this.ray = ray;
	    },

	    /**
	     * get the ray value in device coordinate
	     * 
	     * @return the ray value in device coordinate
	     */
	    getRayValue : function() {
	        return this.rayValue;
	    },

	    /**
	     * set ray ascent value, value should be greater than 0
	     * 
	     * @param value
	     *            the ray ascent to set
	     */
	    setAscentValue : function(value) {
	        this.ascent = true;
	        this.descent = false;
	        if (value < 0) {
	            throw new Error("ray value should be greater than 0");
	        }
	        this.rayValue = value;
	    },

	    /**
	     * set ray descent value, value should be greater than 0
	     * 
	     * @param value
	     *            the ray descent to set
	     */
	    setDescentValue : function(value) {
	        this.ascent = false;
	        this.descent = true;
	        if (value < 0) {
	            throw new Error("ray value should be greater than 0");
	        }
	        this.rayValue = value;
	    },

	    /**
	     * get this ray base
	     * 
	     * @return ray base
	     */
	    getRayBase : function() {
	        return this.rayBase;
	    },

	    /**
	     * set this ray base
	     * 
	     * @param rayBase
	     *            the ray base to set
	     */
	    setRayBase : function(rayBase) {
	        this.rayBase = rayBase;
	    },

	    /**
	     * return true if this ray is ascent, false otherwise
	     * 
	     * @return true if this ray is ascent, false otherwise
	     */
	    isAscent : function() {
	        return this.ascent;
	    },

	    /**
	     * return true if this ray is descent, false otherwise
	     * 
	     * @return true if this ray is descent, false otherwise
	     */
	    isDescent : function() {
	        return this.descent;
	    },

	    /**
	     * get this ray shape
	     * 
	     * @return the shape of this ray
	     */
	    getRayShape : function() {
	        return this.rayShape;
	    },

	    /**
	     * set this ray shape
	     * 
	     * @param rayShape
	     */
	    setRayShape : function(rayShape) {
	        this.rayShape = rayShape;
	    },

	    /**
	     * get this ray host
	     * 
	     * @return the host of this ray
	     */
	    getPlugin : function() {
	        return this.plugin;
	    },

	    /**
	     * set host of this ray
	     * 
	     * @param host
	     *            this ray host to set
	     */
	    setPlugin : function(plugin) {
	        this.plugin = plugin;
	    },

	    /**
	     * return true if mouse has just enter in this ray, false otherwise
	     * 
	     * @return enter flag
	     */
	    isLockEnter : function() {
	        return this.lockEnter;
	    },

	    /**
	     * lock ray enter flag
	     */
	    setLockEnter : function(flag) {
	         this.lockEnter = flag;
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
	    setInflating : function(inflating) {
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
	    setDeflating : function(deflating) {
	        this.deflating = deflating;
	    },      

	    /**
	     * @param lockEnter
	     *            the lockEnter to set
	     */
	    setLockEnter : function(lockEnter) {
	        this.lockEnter = lockEnter;
	    },

		
	});
	
	
	JenScript.StackedRay = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StackedRay, JenScript.Ray);
	JenScript.Model.addMethods(JenScript.StackedRay, {
		_init : function(config){
			this.stacks = [];
			JenScript.Ray.call(this,config);
		},
		
		 /**
	     * get the stack base for the specified stack
	     * 
	     * @param stack
	     *            the stack to find base
	     * @return the stack base
	     */
	    getStackBase : function(stack) {
	        //var base = super.getRayBase();
	    	//console.log(".................getStackBase ");
			var base = this.getRayBase();
			//console.log("ray base : "+base);
			//console.log("check stack base : "+stack);
			for (var i = 0; i < this.stacks.length; i++) {
				var s = this.stacks[i];
				//console.log("compare to stack "+s);
	            if (stack.equals(s)) {
	            	//console.log("return base "+base);
	                return base;
	            }

	            if (this.isAscent()) {
	            	 //console.log("increment ascent base : "+base);
	                base = base + s.getNormalizedValue();
	            }
	            else if (this.isDescent()) {
	            	 //console.log("increment descent base : "+base);
	                base = base - s.getNormalizedValue();
	            }
	            else{
	            	// console.log("not ascent/descent");
	            }
	            //console.log("increment base : "+base);
	        }
			//console.log('ray stack'+stack+' base : '+base);
	        return base;
	    },

	    /**
	     * add a ray stack on this ray
	     * 
	     * @param rStack
	     *            the stack to add
	     */
	    addStack : function(stack) {
	        if (stack.getValue() < 0) {
	            throw new Error( "stack value value should be greater than 0");
	        }
	        stack.setHost(this);
	        this.stacks.push(stack);
	    },

	    /**
	     * normalize registered stacks on this ray
	     */
	    normalize : function() {
	        var deltaValue = Math.abs(this.getRayValue());
	        var stacksValue = 0;
	        for (var i = 0; i < this.stacks.length; i++) {
	        	 stacksValue = stacksValue + this.stacks[i].getValue();
			}
	        for (var i = 0; i < this.stacks.length; i++) {
	        	this.stacks[i].setNormalizedValue(this.stacks[i].getValue() * deltaValue / stacksValue);
	        }
	    },

	    /**
	     * get the stack registry
	     * 
	     * @return the stack registry
	     */
	    getStacks : function() {
	        return this.stacks;
	    },

	    /**
	     * set the stack registry
	     * 
	     * @param stacks
	     *            the stack registry to set
	     */
	    setStacks : function(stacks) {
	        this.stacks = stacks;
	    },
	});
	
	JenScript.RayStack = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.RayStack, {
		
		init : function(config){
			config = config||{};
			this.name = (config.name !== undefined)?config.name:'raystack name undefined';
			this.Id = (config.Id !== undefined)?config.Id:'raystack'+JenScript.sequenceId++;
			 /** the host of this stack */
		    this.host;
		    /** stack theme color */
		    this.themeColor = (config.themeColor !== undefined)?config.themeColor:JenScript.createColor();
		    /** stack value */
		    this.value = (config.value !== undefined)?config.value:1;
		    /** stack normalized value */
		    this.normalizedValue;
		    /** the generated ray of this stack */
		    this.ray;
		    /** ray draw */
		    this.rayDraw;
		    /** ray fill */
		    this.rayFill = new JenScript.RayFill0();
		    /** ray effect */
		    this.rayEffect;
		},
	
		equals : function(stack){
			return (stack.Id === this.Id);
		},
		
	    toString : function() {
	        return "Ray Stack [name=" +  this.name + ", Id=" + this.Id + ", value=" + this.value
	                + ", normalizedValue=" + this.normalizedValue + "]";
	    },

	    /**
	     * get the stack name
	     * 
	     * @return the stack name
	     */
	    getName : function() {
	        return this.name;
	    },

	    /**
	     * set the stack name
	     * 
	     * @param stackName
	     *            the stack name to set
	     */
	    setName : function(name) {
	        this.name = name;
	    },

	    /**
	     * get stack theme color
	     * 
	     * @return stack theme color
	     */
	    getThemeColor : function() {
	        if (this.themeColor === undefined) {
	            this.themeColor = JenScript.createColor();
	        }
	        return this.themeColor;
	    },

	    /**
	     * set stack theme color
	     * 
	     * @param themeColor
	     *            stack theme color to set
	     */
	    setThemeColor : function(themeColor) {
	        this.themeColor = themeColor;
	    },

	    /**
	     * get stack value
	     * 
	     * @return stack value
	     */
	    getValue : function() {
	        return this.value;
	    },

	    /**
	     * set stack value
	     * 
	     * @param value
	     *            the stack value to set
	     */
	    setValue : function(value) {
	        this.value = value;
	    },

	    /**
	     * get stack normalize value
	     * 
	     * @return normalize value
	     */
	    getNormalizedValue : function() {
	        return this.normalizedValue;
	    },

	    /**
	     * set stack normalize value
	     * 
	     * @param normalizedValue
	     *            the stack normalize value to set
	     */
	    setNormalizedValue : function(normalizedValue) {
	        this.normalizedValue = normalizedValue;
	    },

	    /**
	     * get the generated ray of this stack
	     * 
	     * @return the generated stack
	     */
	    getRay : function() {
	        return this.ray;
	    },

	    /**
	     * set the generated ray
	     * 
	     * @param ray
	     *            the generated ray to set
	     */
	    setRay : function(ray) {
	        this.ray = ray;
	    },

	    /**
	     * get stacked ray host of this stack
	     * 
	     * @return stacked ray host
	     */
	    getHost : function() {
	        return this.host;
	    },

	    /**
	     * set stacked ray host
	     * 
	     * @param host
	     *            the stacked ray host to set
	     */
	    setHost : function(host) {
	        this.host = host;
	    },

	    /**
	     * get the ray draw
	     * 
	     * @return the ray draw
	     */
	    getRayDraw : function() {
	        return this.rayDraw;
	    },

	    /**
	     * set the ray draw
	     * 
	     * @param rayDraw
	     *            the ray draw to set
	     */
	    setRayDraw : function(rayDraw) {
	        this.rayDraw = rayDraw;
	    },

	    /**
	     * get the ray fill
	     * 
	     * @return the ray fill
	     */
	    getRayFill : function() {
	        return this.rayFill;
	    },

	    /**
	     * set the ray fill
	     * 
	     * @param rayFill
	     *            the ray fill to set
	     */
	    setRayFill : function(rayFill) {
	        this.rayFill = rayFill;
	    },

	    /**
	     * get the ray effect
	     * 
	     * @return the ray effect
	     */
	    getRayEffect : function() {
	        return this.rayEffect;
	    },

	    /**
	     * set the ray effect
	     * 
	     * @param rayEffect
	     *            the ray effect to set
	     */
	    setRayEffect : function(rayEffect) {
	        this.rayEffect = rayEffect;
	    },
	});
	

})();