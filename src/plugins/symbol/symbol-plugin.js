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