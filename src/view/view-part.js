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
			
			on : function(actionEvent,evt, x, y) {
				//				if(evt.preventDefault){
				//					evt.preventDefault();	
				//				}
				
				//console.log('action event : '+actionEvent+", x,y : "+x+','+y);
				var widgetHandler   = this.view.getWidgetPlugin()['on'+actionEvent];
				var selectorHandler = this.view.getSelectorPlugin()['on'+actionEvent];
				
				widgetHandler.call(this.view.getWidgetPlugin(),evt,this.part,x,y);
				selectorHandler.call(this.view.getSelectorPlugin(),evt,this.part,x,y);

				if(this.view === undefined) return;
				
			//	if(this.view.policy.event === 'ALWAYS'){
					var projs = this.view.getProjections();
					for (var pi = 0; pi < projs.length; pi++) {
						if(projs[pi].isAuthorizedPolicy('event')){
							var plugins = projs[pi].getPlugins();
							for (var p = 0; p < plugins.length; p++) {
								var pluginHandler   = plugins[p]['on'+actionEvent];
								//if(this.view.policy.event === 'ALWAYS' || (this.view.policy.event === 'ACTIVE' && projs[pi].isActive()) || (this.view.policy.event === 'MAYBE' && this.view.policy.isEventReceiver(projs[pi],plugins[p])))
								pluginHandler.call(plugins[p],evt,this.part,x, y);
							}
						}
			    		
					}
//				}
//				else if(this.view.policy.event === 'ACTIVE'){
//					if(this.view.getActiveProjection() === undefined) return;
//					var projection = this.view.getActiveProjection();
//					var plugins = projection.getPlugins();
//					for (var p = 0; p < plugins.length; p++) {
//						var pluginHandler   = plugins[p]['on'+actionEvent];
//						pluginHandler.call(plugins[p],evt,this.part,x, y);
//					}
//				}
				
				
				

				
				
			},
	});
})();