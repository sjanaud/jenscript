// JenScript - 1.3.2 2017-06-10
// http://jenscript.io - Copyright 2017 Sébastien Janaud. All Rights reserved

(function(){
	JenScript.RayPainter = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.RayPainter,{
		init : function(config){
			config=config||{};
		},
		paintRay : function(g2d,ray,viewPart) {}
	});
})();
(function(){
	JenScript.RayFill = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.RayFill, JenScript.RayPainter);
	JenScript.Model.addMethods(JenScript.RayFill,{
		
		_init : function(config){
			config=config||{};
			this.Id = 'rayfill'+JenScript.sequenceId++;
			JenScript.RayPainter.call(this, config);
		},
		
		paintRayFill : function(g2d,ray){},
		
		paintRay : function(g2d,ray,viewPart) {
		     this.paintRayFill(g2d,ray);
		}
		
	});
	
	JenScript.RayFill0 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.RayFill0, JenScript.RayFill);
	JenScript.Model.addMethods(JenScript.RayFill0,{
		
		__init : function(config){
			config=config||{};
			JenScript.RayFill.call(this, config);
		},
		
		paintRayFill : function(g2d,ray) {
	     	g2d.deleteGraphicsElement(this.Id+ray.Id);
		   	var elem =  ray.getRayShape().Id(this.Id+ray.Id).fill(ray.themeColor).fillOpacity(ray.opacity).toSVG();
		   	g2d.insertSVG(elem);
		   	//set bar bound2D
		   	var bbox = elem.getBBox();
		   	ray.setBound2D(new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height));
	    }
	});
	
//	JenScript.SymbolBarFill1 = function(config) {
//		this.__init(config);
//	};
//	JenScript.Model.inheritPrototype(JenScript.SymbolBarFill1, JenScript.SymbolBarFill);
//	JenScript.Model.addMethods(JenScript.SymbolBarFill1,{
//		
//		__init : function(config){
//			config=config||{};
//			JenScript.SymbolBarFill.call(this, config);
//		},
//		
//	    paintBarFill : function(g2d,bar) {
//	        if (bar.getNature() === 'Vertical') {
//	            this.v(g2d, bar);
//	        }
//	        if (bar.getNature() === 'Horizontal') {
//	            this.h(g2d, bar);
//	        }
//	    },
//
//	   v : function(g2d,bar) {
//		   
//		   	//g2d.insertSVG(bar.getBarShape().Id(this.Id+bar.Id).stroke(bar.getThemeColor()).fillNone().toSVG());
//		   	g2d.deleteGraphicsElement(this.Id+bar.Id);
//		   	var elem =  bar.getBarShape().Id(this.Id+bar.Id).toSVG();
//		   	g2d.insertSVG(elem);
//	        var bbox = elem.getBBox();
//	        var start = new JenScript.Point2D(bbox.x, bbox.y + bbox.height/2);
//	        var end = new JenScript.Point2D(bbox.x + bbox.width,bbox.y + bbox.height/2);
//	        var cBase = bar.getThemeColor();
//	        var brighther1 = JenScript.Color.brighten(cBase, 20);
//	        var dist = [ '0%', '50%', '100%' ];
//	        var colors = [ brighther1, cBase, brighther1 ];
//	        var opacity = [ 0.6, 0.8, 0.4 ];
//	        var gradient1= new JenScript.SVGLinearGradient().Id(this.Id+bar.Id+'gradient').from(start.x, start.y).to(end.x, end.y).shade(dist,colors);
//	        g2d.deleteGraphicsElement(this.Id+bar.Id+'gradient');
//	        g2d.definesSVG(gradient1.toSVG());
//	        elem.setAttribute('fill','url(#'+this.Id+bar.Id+'gradient'+')');
//	    	//set bar bound2D
//		   	var bbox = elem.getBBox();
//		   	bar.setBound2D(new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height));
//	    },
//
//	    h : function(g2d,bar) {
//	    	g2d.deleteGraphicsElement(bar.Id);
//		   	var elem =  bar.getBarShape().Id(bar.Id).toSVG();
//		   	g2d.insertSVG(elem);
//	        var bbox = elem.getBBox();
//	        var start = new JenScript.Point2D(bbox.x+bbox.width/2,bbox.y);
//	        var end = new JenScript.Point2D(bbox.x+bbox.width/2, bbox.y + bbox.height);
//	        var cBase = bar.getThemeColor();
//	        var brighther1 = JenScript.Color.brighten(cBase, 20);
//
//	        var dist = [ '0%', '50%', '100%' ];
//	        var colors = [ brighther1, cBase, brighther1 ];
//	        var opacity = [ 0.6, 0.8, 0.4 ];
//	        var gradient1= new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x, start.y).to(end.x, end.y).shade(dist,colors);
//	        g2d.deleteGraphicsElement(this.Id+'gradient');
//	        g2d.definesSVG(gradient1.toSVG());
//	        elem.setAttribute('fill','url(#'+this.Id+'gradient'+')');
//	    	//set bar bound2D
//		   	var bbox = elem.getBBox();
//		   	bar.setBound2D(new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height));
//	    }
//		
//	});
})();
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
	    
	    this.parent;
	};
	
	JenScript.Model.addMethods(JenScript.Ray,{
		
		 /**
	     * get the bound2D
	     * @return {Object} bound2D
	     */
	    getBound2D : function() {
	        return this.bound2D;
	    },

	    /**
	     * set bound2D
	     * @param {Object} bound2D
	     */
	    setBound2D : function(bound2D) {
	        this.bound2D = bound2D;
	    },
	    
		 /**
	     * get the ray draw painter
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
			var base = this.getRayBase();
			for (var i = 0; i < this.stacks.length; i++) {
				var s = this.stacks[i];
	            if (stack.equals(s)) {
	                return base;
	            }

	            if (this.isAscent()) {
	                base = base + s.getNormalizedValue();
	            }
	            else if (this.isDescent()) {
	                base = base - s.getNormalizedValue();
	            }
	        }
	        return base;
	    },

	    /**
	     * add a ray stack on this ray
	     * 
	     * @param rStack
	     *            the stack to add
	     */
	    addStack : function(stack) {
	        if (stack.getStackValue() < 0) {
	            throw new Error( "stack value value should be greater than 0");
	        }
	        stack.parent = this;
	        this.stacks.push(stack);
	    },

	    /**
	     * normalize registered stacks on this ray
	     */
	    normalize : function() {
	        var deltaValue = Math.abs(this.getRayValue());
	        var stacksValue = 0;
	        for (var i = 0; i < this.stacks.length; i++) {
	        	 stacksValue = stacksValue + this.stacks[i].getStackValue();
			}
	        for (var i = 0; i < this.stacks.length; i++) {
	        	this.stacks[i].setNormalizedValue(this.stacks[i].getStackValue() * deltaValue / stacksValue);
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
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.RayStack, JenScript.Ray);
	JenScript.Model.addMethods(JenScript.RayStack, {
		
		_init : function(config){
			config = config||{};
			//this.name = (config.name !== undefined)?config.name:'raystack name undefined';
			//this.Id = (config.Id !== undefined)?config.Id:'raystack'+JenScript.sequenceId++;
			 /** the stacked ray host of this stack */
		    //this.host;
		    /** stack theme color */
		    //this.themeColor = (config.themeColor !== undefined)?config.themeColor:JenScript.createColor();
		    /** stack value */
		    this.stackValue = (config.stackValue !== undefined)?config.stackValue:1;
		    /** stack normalized value */
		    this.normalizedValue;
		    /** the generated ray of this stack */
		    this.ray;
		    /** ray draw */
		    //this.rayDraw;
		    /** ray fill */
		    //this.rayFill = new JenScript.RayFill0();
		    /** ray effect */
		    //this.rayEffect;
		    //this.bound2D;
		    
		    JenScript.Ray.call(this,config);
		},
	
		equals : function(stack){
			return (stack.Id === this.Id);
		},
		
	    toString : function() {
	        return "Ray Stack [name=" +  this.name + ", Id=" + this.Id + ", stackValue=" + this.stackValue
	                + ", normalizedValue=" + this.normalizedValue + "]";
	    },
	    
//	    /**
//	     * get the bound2D
//	     * @return {Object} bound2D
//	     */
//	    getBound2D : function() {
//	        return this.bound2D;
//	    },
//
//	    /**
//	     * set bound2D
//	     * @param {Object} bound2D
//	     */
//	    setBound2D : function(bound2D) {
//	        this.bound2D = bound2D;
//	    },
//
//	    /**
//	     * get the stack name
//	     * 
//	     * @return the stack name
//	     */
//	    getName : function() {
//	        return this.name;
//	    },
//
//	    /**
//	     * set the stack name
//	     * 
//	     * @param stackName
//	     *            the stack name to set
//	     */
//	    setName : function(name) {
//	        this.name = name;
//	    },
//
//	    /**
//	     * get stack theme color
//	     * 
//	     * @return stack theme color
//	     */
//	    getThemeColor : function() {
//	        if (this.themeColor === undefined) {
//	            this.themeColor = JenScript.createColor();
//	        }
//	        return this.themeColor;
//	    },
//
//	    /**
//	     * set stack theme color
//	     * 
//	     * @param themeColor
//	     *            stack theme color to set
//	     */
//	    setThemeColor : function(themeColor) {
//	        this.themeColor = themeColor;
//	    },

	    /**
	     * get stack value
	     * 
	     * @return stack value
	     */
	    getStackValue : function() {
	        return this.stackValue;
	    },

	    /**
	     * set stack value
	     * 
	     * @param value
	     *            the stack value to set
	     */
	    setStackValue : function(stackValue) {
	        this.stackValue = stackValue;
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

//	    /**
//	     * get stacked ray host of this stack
//	     * 
//	     * @return stacked ray host
//	     */
//	    getHost : function() {
//	        return this.host;
//	    },
//
//	    /**
//	     * set stacked ray host
//	     * 
//	     * @param host
//	     *            the stacked ray host to set
//	     */
//	    setHost : function(host) {
//	        this.host = host;
//	    },
//
//	    /**
//	     * get the ray draw
//	     * 
//	     * @return the ray draw
//	     */
//	    getRayDraw : function() {
//	        return this.rayDraw;
//	    },
//
//	    /**
//	     * set the ray draw
//	     * 
//	     * @param rayDraw
//	     *            the ray draw to set
//	     */
//	    setRayDraw : function(rayDraw) {
//	        this.rayDraw = rayDraw;
//	    },
//
//	    /**
//	     * get the ray fill
//	     * 
//	     * @return the ray fill
//	     */
//	    getRayFill : function() {
//	        return this.rayFill;
//	    },
//
//	    /**
//	     * set the ray fill
//	     * 
//	     * @param rayFill
//	     *            the ray fill to set
//	     */
//	    setRayFill : function(rayFill) {
//	        this.rayFill = rayFill;
//	    },
//
//	    /**
//	     * get the ray effect
//	     * 
//	     * @return the ray effect
//	     */
//	    getRayEffect : function() {
//	        return this.rayEffect;
//	    },
//
//	    /**
//	     * set the ray effect
//	     * 
//	     * @param rayEffect
//	     *            the ray effect to set
//	     */
//	    setRayEffect : function(rayEffect) {
//	        this.rayEffect = rayEffect;
//	    },
	});
	

})();
(function(){
	/**
	 * Ray Plugin takes the responsibility to paint rays
	 */
	JenScript.RayPlugin = function(config) {
		this._init(config)
	};
	JenScript.Model.inheritPrototype(JenScript.RayPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.RayPlugin, {
		
		_init : function(config){
			config = config || {};
			this.rays = [];
			this.raysListeners=[];
			config.name = "RayPlugin"
			JenScript.Plugin.call(this,config);
		},
		
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},that.toString());
		},
		
		
		/**
		 * register the specified ray
		 * 
		 * @param ray
		 *            the ray to register
		 */
		addRay : function(ray) {
			ray.plugin = this;
			this.rays.push(ray);
		},
		
		
		/**
		 * String representation of this RayPlugin
		 * @override
		 */
		toString : function(){
			return "JenScript.RayPlugin";
		},
		
		/**
	     * add ray listener with given action
	     * 
	     * enter : when ray is entered
	     * exit : when ray is exited
	     * move : when move in ray
	     * press : when ray is pressed
	     * release : when ray is released
	     * 
	     * 
	     * @param {String}   ray action event type like enter, exit, press, release
	     * @param {Function} listener
	     * @param {String}   listener owner name
	     */
		addRayListener  : function(actionEvent,listener,name){
			if(name === undefined)
				throw new Error('Ray listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener, name:name};
			this.raysListeners[this.raysListeners.length] =l;
		},
		
		/**
		 * fire listener when ray is entered, exited, pressed, released
		 * @param {actionEvent}   event type name
		 * @param {Object}   event object
		 */
		fireRayEvent : function(actionEvent,event){
			for (var i = 0; i < this.raysListeners.length; i++) {
				var l = this.raysListeners[i];
				if(actionEvent === l.action){
					l.onEvent(event);
				}
			}
		},

		/**
		 * check and validate the specified ray
		 * 
		 * @param ray
		 *            the ray to validate
		 */
		checkRay : function(ray) {
			if (ray.getRayNature() === undefined) {
				throw new Error("Ray nature should be supplied");
			}
			// other check
			// value, thickness, ray, etc
		},

		/**
		 * resolve ray registry geometry
		 */
		resolveRayPluginGeometry : function() {
			var that = this;
			var solve = function(ray, index, array) {
				that.checkRay(ray);
				if (ray instanceof JenScript.StackedRay) {
					that.resolveStackedRayGeometry(ray);
				}
				else {
					that.resolveRayGeometry(ray);
				}
			}
			this.rays.forEach(solve);
		},

		/**
		 * resolve ray registry geometry
		 */
		resolveRayComponent : function(ray) {
			if (ray instanceof JenScript.StackedRay) {
				this.resolveStackedRayGeometry(ray);
			}
			else {
				this.resolveRayGeometry(ray);
			}
		},


		/**
		 * resolve the specified ray geometry
		 * 
		 * @param ray
		 *            the ray geometry to resolve
		 */
		resolveRayGeometry : function(ray) {
			var proj = this.getProjection();
			if (ray.getRayNature() === 'XRay') {

				var centerUserX = ray.getRay();
				var centerDeviceX = proj.userToPixel(new JenScript.Point2D(centerUserX, 0)).getX();
				
				var deviceRayWidth = 0;
				if (ray.getThicknessType() === 'Device') {
					deviceRayWidth = ray.getThickness();
				} else {
					var left = centerUserX - ray.getThickness() / 2;
					var pLeft = proj.userToPixel(new JenScript.Point2D(left, 0));

					var right = centerUserX + ray.getThickness() / 2;
					var pRight = proj.userToPixel(new JenScript.Point2D(right, 0));

					deviceRayWidth = pRight.getX() - pLeft.getX();
				}

				var yUserRayBase = 0;
				if (ray.isAscent()) {
					yUserRayBase = ray.getRayBase();
				}
				if (ray.isDescent()) {
					yUserRayBase = ray.getRayBase() - ray.getRayValue();
				}

				var yDeviceRayBase = proj.userToPixel(new JenScript.Point2D(0, yUserRayBase)).getY();

				var yUserRayFleche = 0;
				if (ray.isAscent()) {
					yUserRayFleche = ray.getRayBase() + ray.getRayValue();
				}
				if (ray.isDescent()) {
					yUserRayFleche = ray.getRayBase();
				}

				var yDeviceRayFleche = proj.userToPixel(new JenScript.Point2D(0, yUserRayFleche)).getY();

				var x = centerDeviceX - deviceRayWidth / 2;
				var y = yDeviceRayFleche;
				var width = deviceRayWidth;
				var height = Math.abs(yDeviceRayFleche - yDeviceRayBase);

				var rayShape = new JenScript.SVGRect().origin(x, y).size(width,height);
				ray.setRayShape(rayShape);

			} else if (ray.getRayNature() === 'YRay') {

				var centerUserY = ray.getRay();
				var centerDeviceY = proj.userToPixel(new JenScript.Point2D(0, centerUserY)).getY();

				var deviceRayHeight = 0;
				if (ray.getThicknessType() == 'Device') {
					deviceRayHeight = ray.getThickness();
				} else {
					var top = centerUserY - ray.getThickness() / 2;
					var pTop = proj.userToPixel(new JenScript.Point2D(0, top));

					var bottom = centerUserY + ray.getThickness() / 2;
					var pBottom = proj.userToPixel(new JenScript.Point2D(0, bottom));

					deviceRayHeight = Math.abs(pTop.getY() - pBottom.getY());
				}

				var xUserRayBase = 0;
				if (ray.isAscent()) {
					xUserRayBase = ray.getRayBase();
				}
				if (ray.isDescent()) {
					xUserRayBase = ray.getRayBase() - ray.getRayValue();
				}

				var xDeviceRayBase = proj.userToPixel(new JenScript.Point2D(xUserRayBase, 0)).getX();

				var xUserRayFleche = 0;
				if (ray.isAscent()) {
					xUserRayFleche = ray.getRayBase() - ray.getRayValue();
				}
				if (ray.isDescent()) {
					xUserRayFleche = ray.getRayBase();
				}

				var xDeviceRayFleche = proj.userToPixel(new JenScript.Point2D(xUserRayFleche, 0)).getX();

				var x = xDeviceRayBase;
				var y = centerDeviceY - deviceRayHeight / 2;
				var width = Math.abs(xDeviceRayFleche - xDeviceRayBase);
				var height = deviceRayHeight;

				var rayShape = new JenScript.SVGRect().origin(x, y).size(width,height);
				ray.setRayShape(rayShape);
			}
		},

		/**
		 * resolve specified stacked ray geometry
		 * 
		 * @param stackedRay
		 *            the stacked ray geometry to resolve
		 */
		resolveStackedRayGeometry : function(stackedRay) {
			var proj = this.getProjection();
			stackedRay.normalize();
			if (stackedRay.getRayNature() === 'XRay') {

				var centerUserX = stackedRay.getRay();
				var centerDeviceX = proj.userToPixel(new JenScript.Point2D(centerUserX, 0)).getX();
				var deviceRayWidth = 0;
				if (stackedRay.getThicknessType() == 'Device') {
					deviceRayWidth = stackedRay.getThickness();
				} else {
					var left = centerUserX - stackedRay.getThickness() / 2;
					var pLeft = proj.userToPixel(new JenScript.Point2D(left, 0));

					var right = centerUserX + stackedRay.getThickness() / 2;
					var pRight = proj.userToPixel(new JenScript.Point2D(right, 0));

					deviceRayWidth = pRight.getX() - pLeft.getX();
				}

				var yUserRayBase = 0;
				if (stackedRay.isAscent()) {
					yUserRayBase = stackedRay.getRayBase();
				}
				if (stackedRay.isDescent()) {
					yUserRayBase = stackedRay.getRayBase() - stackedRay.getRayValue();
				}

				var yDeviceRayBase = proj.userToPixel(new JenScript.Point2D(0, yUserRayBase)).getY();

				var yUserRayFleche = 0;
				if (stackedRay.isAscent()) {
					yUserRayFleche = stackedRay.getRayBase() + stackedRay.getRayValue();
				}
				if (stackedRay.isDescent()) {
					yUserRayFleche = stackedRay.getRayBase();
				}

				var yDeviceRayFleche = proj.userToPixel(new JenScript.Point2D(0, yUserRayFleche)).getY();

				var x = centerDeviceX - deviceRayWidth / 2;
				var y = yDeviceRayFleche;
				var width = deviceRayWidth;
				var height = Math.abs(yDeviceRayFleche - yDeviceRayBase);

				var rayShape = new JenScript.SVGRect().origin(x, y).size(width,height);
				stackedRay.setRayShape(rayShape);

				// stacks
				for (var i = 0; i < stackedRay.getStacks().length; i++) {
					var s = stackedRay.getStacks()[i];
					
					s.setRayNature(stackedRay.getRayNature());
					s.setThickness(stackedRay.getThickness());
					s.setThicknessType(stackedRay.getThicknessType());
					s.setRay(stackedRay.getRay());
					s.setRayBase(stackedRay.getStackBase(s));
					s.setThemeColor(s.getThemeColor());
					s.setRayFill(s.getRayFill());
					s.setRayDraw(s.getRayDraw());
					s.setRayEffect(s.getRayEffect());
					if (s.isAscent()) {
						s.setAscentValue(s.getNormalizedValue());
					} else if (stackedRay.isDescent()) {
						s.setDescentValue(s.getNormalizedValue());
					}
					
					var yUserStackRayBase = 0;
					if (stackedRay.isAscent()) {
						yUserStackRayBase = stackedRay.getStackBase(s);
					}
					if (stackedRay.isDescent()) {
						yUserStackRayBase = stackedRay.getStackBase(s) - s.getNormalizedValue();
					}

					var yDeviceStackRayBase = proj.userToPixel(new JenScript.Point2D(0, yUserStackRayBase)).getY();

					var yUserStackRayFleche = 0;
					if (stackedRay.isAscent()) {
						yUserStackRayFleche = stackedRay.getStackBase(s) + s.getNormalizedValue();
					}
					if (stackedRay.isDescent()) {
						yUserStackRayFleche = stackedRay.getStackBase(s);
					}

					var yDeviceStackRayFleche = proj.userToPixel(new JenScript.Point2D(0, yUserStackRayFleche)).getY();

					var stackx = centerDeviceX - deviceRayWidth / 2;
					var stacky = yDeviceStackRayFleche;
					var stackwidth = deviceRayWidth;
					var stackheight = Math.abs(yDeviceStackRayFleche - yDeviceStackRayBase);

					var stackRayShape = new JenScript.SVGRect().origin(stackx, stacky).size(stackwidth,stackheight);
					s.setRayShape(stackRayShape);
				}

			} else if (stackedRay.getRayNature() === 'YRay') {

				var centerUserY = stackedRay.getRay();
				var centerDeviceY = proj.userToPixel(new JenScript.Point2D(0, centerUserY)).getY();

				var deviceRayHeight = 0;
				if (stackedRay.getThicknessType() == 'Device') {
					deviceRayHeight = stackedRay.getThickness();
				} else {
					var top = centerUserY - stackedRay.getThickness() / 2;
					var pTop = proj.userToPixel(new JenScript.Point2D(0, top));

					var bottom = centerUserY + stackedRay.getThickness() / 2;
					var pBottom = proj.userToPixel(new JenScript.Point2D(0, bottom));

					deviceRayHeight = Math.abs(pTop.getY() - pBottom.getY());
				}

				var xUserRayBase = 0;
				if (stackedRay.isAscent()) {
					xUserRayBase = stackedRay.getRayBase();
				}
				if (stackedRay.isDescent()) {
					xUserRayBase = stackedRay.getRayBase() - stackedRay.getRayValue();
				}

				var xDeviceRayBase = proj.userToPixel(new JenScript.Point2D(xUserRayBase, 0)).getX();

				var xUserRayFleche = 0;
				if (stackedRay.isAscent()) {
					xUserRayFleche = stackedRay.getRayBase() - stackedRay.getRayValue();
				}
				if (stackedRay.isDescent()) {
					xUserRayFleche = stackedRay.getRayBase();
				}

				var xDeviceRayFleche = proj.userToPixel(new JenScript.Point2D(xUserRayFleche, 0)).getX();

				var x = xDeviceRayBase;
				var y = centerDeviceY - deviceRayHeight / 2;
				var width = Math.abs(xDeviceRayFleche - xDeviceRayBase);
				var height = deviceRayHeight;

				var rayShape = new JenScript.SVGRect().origin(x, y).size(width,height);
				stackedRay.setRayShape(rayShape);

				// stacks
				for (var i = 0; i < stackedRay.getStacks().length; i++) {
					var s = stackedRay.getStacks()[i];

					s.setRayNature(stackedRay.getRayNature());
					s.setThickness(stackedRay.getThickness());
					s.setThicknessType(stackedRay.getThicknessType());
					s.setRay(stackedRay.getRay());
					s.setRayBase(stackedRay.getStackBase(s));
					s.setThemeColor(s.getThemeColor());
					s.setRayFill(s.getRayFill());
					s.setRayDraw(s.getRayDraw());
					s.setRayEffect(s.getRayEffect());
					if (stackedRay.isAscent()) {
						s.setAscentValue(s.getNormalizedValue());
					} else if (stackedRay.isDescent()) {
						s.setDescentValue(s.getNormalizedValue());
					}

					var xUserStackRayBase = 0;
					if (stackedRay.isAscent()) {
						xUserStackRayBase = stackedRay.getStackBase(s);
					}
					if (stackedRay.isDescent()) {
						xUserStackRayBase = stackedRay.getStackBase(s) - s.getNormalizedValue();
					}

					var xDeviceStackRayBase = proj.userToPixel(new JenScript.Point2D(xUserStackRayBase, 0)).getX();

					var xUserStackRayFleche = 0;
					if (stackedRay.isAscent()) {
						xUserStackRayFleche = stackedRay.getStackBase(s) - s.getNormalizedValue();
					}
					if (stackedRay.isDescent()) {
						xUserStackRayFleche = stackedRay.getStackBase(s);
					}

					var xDeviceStackRayFleche = proj.userToPixel(new JenScript.Point2D(xUserStackRayFleche, 0)).getX();

					var stackx = xDeviceStackRayBase;
					var stacky = centerDeviceY - deviceRayHeight / 2;
					var stackwidth = Math.abs(xDeviceStackRayFleche - xDeviceStackRayBase);
					var stackheight = deviceRayHeight;

					var stackRayShape = new JenScript.SVGRect().origin(stackx, stacky).size(stackwidth,stackheight);
					s.setRayShape(stackRayShape);
				}

			}
		},

		/**
		 * paint the specified ray
		 * 
		 * @param g2d
		 *            graphics context
		 * @param ray
		 *            the ray to paint
		 */
		paintRay : function(g2d,ray,viewPart,paintRequest) {

			ray.plugin = this;

			if (paintRequest === 'RayLayer') {
				if (ray.getRayFill() !== undefined) {
					ray.getRayFill().paintRay(g2d, ray, viewPart);
				}

				if (ray.getRayEffect() !== undefined) {
					ray.getRayEffect().paintRay(g2d, ray, viewPart);
				}

				if (ray.getRayDraw() !== undefined) {
					ray.getRayDraw().paintRay(g2d, ray, viewPart);
				}
			} else {
				if (ray.getRayLabel() != null) {
					ray.getRayLabel().paintRay(g2d, ray, viewPart);
				}
			}

		},

		/**
		 * paint the specified stacked ray
		 * 
		 * @param g2d
		 *            graphics context
		 * @param stackedRay
		 *            the stackedRay to paint
		 */
		paintStackedRay : function(g2d,stackedRay,viewPart,paintRequest) {
			var stacks = stackedRay.getStacks();
			for (var i = 0; i < stacks.length; i++) {
				var s = stacks[i];
				this.paintRay(g2d, s, viewPart, paintRequest);
			}
			//this.paintRay(g2d, stackedRay, viewPart, paintRequest);
		},

		
		/**
		 * paint Ray Plugin
		 * @param g2d graphics context
		 * @param viewPart the view part
		 * 
		 */
		paintPlugin : function(g2d,viewPart) {
			this.resolveRayPluginGeometry();
			if (viewPart === JenScript.ViewPart.Device) {

				for (var i = 0; i < this.rays.length; i++) {
					var ray = this.rays[i]
					if (ray instanceof JenScript.StackedRay) {
						this.paintStackedRay(g2d, ray, viewPart, 'RayLayer');
					}
					else {
						this.paintRay(g2d, ray, viewPart, 'RayLayer');
					}
				}

				for (var i = 0; i < this.rays.length; i++) {
					var ray = this.rays[i]
					if (ray instanceof JenScript.StackedRay) {
						this.paintStackedRay(g2d, ray, viewPart, 'LabelLayer');
					}
					else {
						this.paintRay(g2d, ray, viewPart, 'LabelLayer');
					}
				}
			} else {
				//this.paintRayAxisLabel(g2d, viewPart);
			}
		},

		/**
		 * paint rays axis symbols
		 * 
		 * @param g2d
		 *            the graphics context to paint
		 * @param viewPart
		 *            to view part to paint
		 */
		paintRayAxisLabel : function(g2d,viewPart) {

//			for (Ray ray : rays) {
//				ray.setHost(this);
//
//				if (ray instanceof RayGroup) {
//					RayGroup group = (RayGroup) ray;
//
//					if (group.getRayAxisLabel() != null) {
//						group.getRayAxisLabel().paintRay(g2d, ray, viewPart);
//					}
//
//					List<Ray> rays = group.getRays();
//					for (Ray r : rays) {
//						ray.setHost(this);
//						if (!(r instanceof RayGroup)) {
//							if (r.getRayAxisLabel() != null) {
//								r.getRayAxisLabel().paintRay(g2d, r, viewPart);
//							}
//						}
//					}
//				} else {
//					if (ray.getRayAxisLabel() != null) {
//						ray.getRayAxisLabel().paintRay(g2d, ray, viewPart);
//					}
//				}
//			}

		},
		
	    onRelease : function(evt,part,x, y) {
	    	this.rayCheck('release',evt,x,y);
	    },
	   
	    onPress : function(evt,part,x, y) {
	    	this.rayCheck('press',evt,x,y);
	    },
	   
	    onMove : function(evt,part,x, y) {
	    	this.rayCheck('move',evt,x,y);
	    },
	    
	    /**
	     * check ray event
	     * 
	     * @param {String}  action the action press, release, move, etc.
	     * @param {Object}  original event
	     * @param {Number}  x location
	     * @param {Number}  y location
	     */
	    rayCheck: function(action, evt,x,y){
	    	var that=this;
	    	var _d = function(ray){
	    	   if(action === 'press')
	    		   that.fireRayEvent('press',{ray : ray, x:x,y:y, device :{x:x,y:y}});
               else if(action === 'release')
            	   that.fireRayEvent('release',{ray : ray, x:x,y:y, device :{x:x,y:y}});
               else 
            	   that.rayEnterExitTracker(ray,x,y);
	    	};
	    	var _c = function(ray){
	    		if (ray.getBound2D() === undefined) {
	 	            return;
	 	        }
	    		var contains = (ray.getBound2D() !== undefined  && ray.getBound2D().contains(x,y));
        		if(action !== 'move' && contains && ray.isLockEnter()){
        			_d(ray);
        		}
        		else if (action === 'move') {
                	_d(ray);
                }
	    	};
		        for (var i = 0; i < this.rays.length; i++) {
		        	
		        	var ray = this.rays[i];
		        	
		            if (ray instanceof JenScript.StackedRay) {
		               var stackedRay = ray;
		               _c(stackedRay);
		               var rayStacks = stackedRay.getStacks();
		               for (var j = 0; j < rayStacks.length; j++) {
		            	   var rayStack = rayStacks[j];
		            		_c(rayStack);
		                }
		            }
		            else if (ray instanceof JenScript.Ray) {
		                _c(ray);
		            }
		        }
	    },

	    /**
	     * track ray enter or exit for the specified ray for device location x,y
	     * 
	     * @param {Object}  ray symbol
	     * @param {Number}  x location in device coordinate
	     * @param {Number}  y location in device coordinate
	     */
	    rayEnterExitTracker : function(ray,x,y) {
	        if (ray.getBound2D() === undefined) {
	            return;
	        }
	        if (ray.getBound2D().contains(x, y) && !ray.isLockEnter()) {
	        	ray.setLockEnter(true);
	            this.fireRayEvent('enter',{ray : ray, x:x,y:y, device :{x:x,y:y}});
	        }
	        if (ray.getBound2D().contains(x, y) && ray.isLockEnter()) {
	            this.fireRayEvent('move',{ray : ray, x:x,y:y, device :{x:x,y:y}});
	        }
	        else if (!ray.getBound2D().contains(x, y) && ray.isLockEnter()) {
	        	ray.setLockEnter(false);
	            this.fireRayEvent('exit',{ray : ray, x:x,y:y, device :{x:x,y:y}});
	        }
	    },
		
	});

	
})();