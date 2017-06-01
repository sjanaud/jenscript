(function(){
	JenScript.Model.addMethods(JenScript.Projection,{
		
		/**
		 * Initialize this projection with given parameters config
		 * @param {Object} config
		 * @param {String} [config.name] Projection name
		 * @param {String} [config.themeColor] Projection theme color 
		 */
		init : function(config){
			config = config || {};
			this.Id = 'proj_'+JenScript.sequenceId++;
			this.name = (config.name !== undefined)?config.name : 'proj_undefined_name'+this.Id;
			this.initial = true;
			this.themeColor = (config.themeColor !== undefined)?config.themeColor:JenScript.createColor();
			this.listeners =[];
			this.view = undefined;
			this.plugins = [];
			this.visible = true;
			
			/**paint mode is always(paint always) or active(paint only if active)*/
			//this.paintMode = (config.paintMode !== undefined)?config.paintMode : 'ALWAYS';
			
			this.policy = (config.policy !== undefined)?config.policy : { paint : 'ALWAYS' /** ALWAYS, RUNTIME */ , event :  'ACTIVE' /** ALWAYS, RUNTIME */ }
			
			if(this.policy.paint === undefined)
				this.policy.paint = 'ACTIVE';
			if(this.policy.event === undefined)
				this.policy.event = 'ACTIVE';
			
			this.isPaintPolicy = (config.isPaintPolicy !== undefined)?config.isPaintPolicy :function(){return true;};
			this.isEventPolicy = (config.isEventPolicy !== undefined)?config.isEventPolicy :function(){return true;};
			
			
			/**active , active put projection at the last level painting z order, and received events. see view setActive projection*/
			this.active = false;
		},
		
		isAuthorizedPolicy : function(check){
			if(check === 'paint'){
				if((this.policy.paint === 'ACTIVE' && this.active) || this.policy.paint === 'ALWAYS')
					return true;
				if((this.policy.paint === 'ACTIVE' && !this.active))
					return false
				if(this.policy.paint === 'RUNTIME'){
					return this.isPaintPolicy();
				}
			}else if(check === 'event'){
				if((this.policy.event === 'ACTIVE' && this.active) || this.policy.event === 'ALWAYS')
					return true;
				if((this.policy.event === 'ACTIVE' && !this.active))
					return false
				if(this.policy.event === 'RUNTIME'){
					return this.isEventPolicy();
				}
			}
		},
		
		/**
		 * return string representation of this projection
		 */
		toString : function(){
			var v = (this.getView() === undefined)?'view not still bind' : this.getView().Id;
			return 'JenScript.Projection=[Id:'+this.Id+',active :'+this.isActive()+','+this.getMinX()+','+this.getMaxX()+','+this.getMinY()+','+this.getMaxY()+','+v+']';
		},
		
		/**
		 * bind actions : lockActive,unlockActive,boundChanged,viewRegister, pluginRegister
		 */
		addProjectionListener  : function(actionEvent,listener,name){
			if(name === undefined)
				throw new Error('Projection listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener,name:name};
			this.listeners[this.listeners.length] =l;
		},
		
		
	
		/**
		 * fire listener when projection is being to lock, unlock, and bound changed.
		 */
		fireProjectionEvent : function(actionEvent){
			for (var i = 0; i < this.listeners.length; i++) {
				var l = this.listeners[i];
				if(actionEvent === l.action){
					//l.onEvent({projection : this});
					l.onEvent(this);
				}
			}
		},

		/**
		 * get projection Id
		 */
		getId : function() {
			return this.Id;
		},

		setVisible : function(visible) {
			this.visible = visible;
			if(visible && this.svgRootGroup)
				this.svgRootGroup.setAttribute('opacity',1);
			else
				this.svgRootGroup.setAttribute('opacity',0);
		},

		isVisible : function() {
			return this.visible;
		},
		
		setActive : function(active) {
			this.active = active;
			if(this.active){
				this.fireProjectionEvent('lockActive');
			}else{
				this.fireProjectionEvent('unlockActive');
			}
		},

		isActive : function() {
			return this.active;
		},
		
		setName : function(name) {
			this.name = name;
		},

		getName : function() {
			return this.name;
		},

		setView : function(view) {
			this.view = view;
			var that = this;
			view.addViewListener('projectionRegister', function(){
				that.fireProjectionEvent('viewRegister');
			}, " fire view registered in projection")
		},

		getView : function() {
			return this.view;
		},

		setThemeColor : function(themeColor) {
			this.themeColor = themeColor;
		},

		getThemeColor : function() {
			return this.themeColor;
		},
		

		/**
		 * register the given plugin in this projection
		 * @param {Object} plugin to unregister
		 */
		unregisterPlugin : function(plugin) {
			var plugins = [];
			for (var i = 0; i < this.plugins.length; i++) {
				var p = this.plugins[i];
				if(p.Id === plugin.Id){
					plugin.destroyGraphics();
					plugin.contextualized = false;
				}else{
					plugins[plugins.length] = p;
				}
			}
			this.plugins = plugins;
		},
		
		/**
		 * register the given plugin in this projection
		 * @param {Object} plugin to register
		 */
		registerPlugin : function(plugin) {
			//console.log("register plugin : "+plugin.name);
			if(plugin.getProjection() !== undefined && plugin.getProjection().Id !== this.Id)
				throw new Error('Plugin '+plugin.name+' projection is already set, plugin can not be shared projection.');
			//console.log("register plugin "+plugin);
			plugin.setProjection(this);
			this.plugins[this.plugins.length] = plugin;
			var that = this;
			
			plugin.addPluginListener('lock',function(selectedPlugin){
				//console.log("plugin selected : "+selectedPlugin.name+ " from projection +"+that.name);
				//unselect other selectable plugin that shared this projection
				for (var p = 0; p < that.plugins.length; p++) {
					var plugin = that.plugins[p];
					if(plugin.Id !== selectedPlugin.Id  && plugin.isSelectable() && plugin.isLockSelected()){
						//console.log("plugin to passivate : "+plugin.name);
						plugin.unselect();
					}
				}
			},'Projection plugin lock/unlock listener');
			
			this.plugins.sort(function(p1, p2) {
				var x = p1.getPriority();
				var y = p2.getPriority();
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
			
			plugin.onProjectionRegister();
			this.getView().contextualizePluginGraphics(plugin);
			this.fireProjectionEvent('pluginRegister');
		},
		
		/**
		 * get plugin registered in this projection
		 */
		getPlugins : function() {
			return this.plugins;
		},
		
		
		/**
		 * get plugin at the given index
		 */
		getPluginAtIndex : function(index) {
			return this.plugins[index];
		},
		
		/**
		 * get the index of the given plugin
		 */
		getIndexOf : function(plugin) {
			for (var p = 0; p < this.plugins.length; p++) {
				if(plugin.Id === this.plugins[p].Id)
					return p;
			}
			return -1;
		},

		getUserWidth : function() {
			return this.maxX - this.minX;
		},

		getUserHeight : function() {
			return this.maxY - this.minY;
		},

		getPixelWidth : function() {
			return this.view.getDevice().width;
		},

		getPixelHeight : function() {
			return this.view.getDevice().height;
		},

		getMinX : function() {
			return this.minX;
		},

		getMaxX : function() {
			return this.maxX;
		},

		getMinY : function() {
			return this.minY;
		},

		getMaxY : function() {
			return this.maxY;
		},
		
		getBounds : function(){
			return {minX : this.getMinX(),maxX : this.getMaxX(),minY : this.getMinY(),maxY : this.getMaxY()};
		},

		userToPixel : function(userPoint) {
			return new JenScript.Point2D(this.userToPixelX(userPoint.x),this.userToPixelY(userPoint.y));
		},

		pixelToUser : function(pixelPoint) {
			return new JenScript.Point2D(this.pixelToUserX(pixelPoint.x),this.pixelToUserY(pixelPoint.y));
		},
});
})();