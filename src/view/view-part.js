(function(){

	/**
	 * ViewPartComponent defines a view part like south, north, west, east or device component.
	 * 
	 */
	JenScript.Model.addMethods(JenScript.ViewPartComponent, {
		
			/**
			 * init this component with the given config
			 * @param {Object} config
	         * @param {String} [config.part] South, West, East, North, Device
	         * @param {Number} [config.width] Component width in pixel
	         * @param {Number} [config.height] Component height in pixel
	         * @param {Object} [config.view] Component parent views
			 */
			init : function(config){
				config = config || {};
				this.part = config.part;
				this.width = config.width;
				this.height = config.height;
				this.view = config.view;
				this.Id = this.part+JenScript.sequenceId++;
			},
			
			getId : function(){
				return this.Id;
			},
			
			getWidth :  function(){
				return this.width;
			},
			
			getHeight :  function(){
				return this.height;
			},
			
			/**
			 * callback for the given action event that happens with the specified event, 
			 * and specified location (x,y) in the component coordinate system.
			 */
			on : function(actionEvent,evt, x, y) {
				//				if(evt.preventDefault){
				//					evt.preventDefault();	
				//				}
				
				//console.log('action event : '+actionEvent);
				var widgetHandler   = this.view.getWidgetPlugin()['on'+actionEvent];
				var selectorHandler = this.view.getSelectorPlugin()['on'+actionEvent];
				
				widgetHandler.call(this.view.getWidgetPlugin(),evt,this.part,x,y);
				selectorHandler.call(this.view.getSelectorPlugin(),evt,this.part,x,y);

				if(this.view === undefined || this.view.getActiveProjection() === undefined) return;
				var projection = this.view.getActiveProjection();
				var plugins = projection.getPlugins();
				for (var p = 0; p < plugins.length; p++) {
					var pluginHandler   = plugins[p]['on'+actionEvent];
					
					//TODO?
					//call if plugin is not selectable
					//if selectable, call only if plugin is lock selected
					
					pluginHandler.call(plugins[p],evt,this.part,x, y);
				}
			},
	});
})();