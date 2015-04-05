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
	    addSymbol : function(symbol) {
	        symbol.setLayer(this);
	        this.symbols[this.symbols.length] = symbol;
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