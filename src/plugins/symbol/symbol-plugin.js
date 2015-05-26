(function(){
		
		JenScript.SymbolPlugin = function(config) {
			this._init(config);
		};
		JenScript.Model.inheritPrototype(JenScript.SymbolPlugin, JenScript.Plugin);
		JenScript.Model.addMethods(JenScript.SymbolPlugin,{
			
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
		     * @param symbolNature
		     */
		    setNature : function(nature) {
		        this.nature = nature;
		    },

		    /**
		     * add the specified symbol layer to this symbol plug in
		     * 
		     * @param layer
		     *            the layer to add
		     */
		    addLayer : function(layer) {
		        layer.setHost(this);
		        this.layers[this.layers.length]=layer;
		        this.repaintPlugin();
		    },

		    /**
		     * remove the specified symbol layer from this symbol plug in
		     * 
		     * @param layer
		     *            the layer to remove
		     */
		   removeLayer : function(layer) {
		        //layer.setHost(null);
		        //layers.remove(layer);
		    },

		    /**
		     * count the number of layer registered in this symbol plug in
		     */
		    countLayers : function() {
		        return this.layers.length;
		    },

		    /**
		     * get the layer at the specified index
		     * 
		     * @param index
		     *            the layer index
		     * @return layer
		     */
		    getLayer : function(index) {
		        return this.layers[index];
		    },

		   /**
		    * paint symbols
		    */
		    paintPlugin : function(g2d,viewPart) {
		    	if(viewPart !== 'Device') return;
		        // solve layer
		        this.solveLayers();
		        // paint layer
		        for (var i = 0; i < this.countLayers(); i++) {
		        	var layer = this.getLayer(i);
		            layer.paintLayer(g2d,viewPart,'SymbolLayer');
		            //layer.paintLayer(g2d,viewPart,'LabelLayer');
		        }
		    },
		    
		    //TODO remove similar copy block

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