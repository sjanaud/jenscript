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
	        if (nature == SymbolNature.Vertical) {
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
	        return this.getLocationY() - this.getThickness() / 2;
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
	     * return true if mouse has just enter in this ray, false otherwise
	     * 
	     * @return enter flag
	     */
	    isLockEnter : function(){
	        return this.lockEnter;
	    },

	    /**
	     * lock ray enter flag
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