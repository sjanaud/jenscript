(function(){
	
		JenScript.Model.addMethods(JenScript.Plugin, {
		
		init : function(config){
			config = config || {};
			this.projection = undefined;
			this.name = (config.name !== undefined) ? config.name : "AnonymousPlugin";
			this.Id = 'plugin_'+this.name+'_'+JenScript.sequenceId++;
			this.priority = (config.priority!== undefined) ? config.priority : 0;
			this.selectable = (config.selectable!== undefined) ? config.selectable : false;
			this.pluginlisteners=[];
			this.widgets=[];
			this.lockSelected = false;
			this.lockPassive = false;
			this.contextualized = false;
			
			//transforms beta
			this.tx = 0;
			this.ty = 0;
			this.sx = 1;
			this.sy = 1;
		},
		
		resetTransform : function(){
			this.tx = 0;
			this.ty = 0;
			this.sx = 1;
			this.sy = 1;
			if(this.svgRoot !== undefined){
				this.applyTransform();
			}
		},
		
		applyTransform : function(){
			this.svgRoot['Device'].setAttribute("transform","translate("+this.tx+","+this.ty+") scale("+this.sx+","+this.sy+")");
			this.svgRoot['West'].setAttribute("transform","translate("+this.tx+","+this.ty+") scale("+this.sx+","+this.sy+")");
			this.svgRoot['East'].setAttribute("transform","translate("+this.tx+","+this.ty+") scale("+this.sx+","+this.sy+")");
			this.svgRoot['South'].setAttribute("transform","translate("+this.tx+","+this.ty+") scale("+this.sx+","+this.sy+")");
		},
		
		translate : function(tx,ty,fire){
			this.tx = tx;
			this.ty = ty;
			if(this.svgRoot !== undefined){
				this.applyTransform();
				if(fire === undefined || fire !== false)
				this.firePluginEvent('translate');
			}
		},
		
		scale : function(sx,sy,fire){
			this.sx = sx;
			this.sy = sy;
			if(this.svgRoot !== undefined){
				this.applyTransform();
				if(fire === undefined || fire !== false)
				this.firePluginEvent('scale');
			}
		},
		
		u2p : function(u){
			 var p = this.getProjection().userToPixel(u);
			 return new JenScript.Point2D(p.x*this.sx+this.tx,p.y*this.sy+this.ty);
		},
		 
		p2u : function(p){
			return this.getProjection().pixelToUser(new JenScript.Point2D((p.x-this.tx)/this.sx,(p.y-this.ty)/this.sy));
			//return this.getProjection().pixelToUser(new JenScript.Point2D(p.x/plugin.sx-plugin.tx,p.y/plugin.sy-plugin.ty));
		},
		
		getId : function(){
			return this.Id;
		},
		
		toString : function(){
			return 'JenScript.Plugin=[' +this.name+','+this.Id+']';
		},
		
		getProjection : function() {
			return this.projection;
		},
		
		
		/**
		 * get convenient way to get view
		 */
		getView : function(){
			try{
				return this.getProjection().getView();
			}catch(e){
				return undefined;
			}
		},
		
		getProjections : function() {
			return this.getView().getProjections();
		},
		
		getSouth : function(h){
			return this.getView().south;
		},
		getWest : function(h){
			return this.getView().west;
		},
		getNorth : function(h){
			return this.getView().north;
		},
		getEast : function(h){
			return this.getView().east;
		},
		
		
		/**
		 * get convenient way to get Device
		 */
		getDevice : function(){
			try{
				return this.getView().getDevice();
			}catch(e){
				return undefined;
			}
		},
		
		/**
		 * get widget plugin
		 */
		getWidgetPlugin: function(){
			return this.getView().getWidgetPlugin();
		},
		
		/**
		 * get the plugin part graphics context
		 * @param {String} part
		 * @returns {Object} plugin graphics context
		 */
		getGraphicsContext : function(part){
			if(!this.contextualized)
				return undefined;
			try{
				return new JenScript.Graphics({definitions : this.svgPluginPartsDefinitions[part],graphics : this.svgPluginPartsGraphics[part], selectors : this.getProjection().getView().svgSelectors});	
			}catch(e)
			{
				//console.log("catch bad graphics");
				return undefined;
			}
		},
		
		
		/**
		 * destroy all plugin graphics elements
		 */
		destroyGraphics : function(){
			this.getGraphicsContext(JenScript.ViewPart.South).clearGraphics();
			this.getGraphicsContext(JenScript.ViewPart.North).clearGraphics();
			this.getGraphicsContext(JenScript.ViewPart.East).clearGraphics();
			this.getGraphicsContext(JenScript.ViewPart.West).clearGraphics();
			this.getGraphicsContext(JenScript.ViewPart.Device).clearGraphics();
		},
		
		
		/**
		 * repaint whole plugin by call repaint each part with clear context
		 */
		repaintPlugin : function(){
			if(!this.contextualized)
				return;
			
			this.repaintPluginPart(JenScript.ViewPart.South);
			this.repaintPluginPart(JenScript.ViewPart.North);
			this.repaintPluginPart(JenScript.ViewPart.East);
			this.repaintPluginPart(JenScript.ViewPart.West);
			this.repaintPluginPart(JenScript.ViewPart.Device);
			this.firePluginEvent('repaint');
		},
		
		
		/**
		 * repaint plugin for the given part
		 * @param {String} part
		 */
		repaintPluginPart : function(part){
			if(!this.contextualized)
				return;
			var graphics = this.getGraphicsContext(part);
			if(graphics !== undefined){
				graphics.clearGraphics();
				this.paintPlugin(graphics,part);
			}
		},
		
		
		/**
		 * bind listener for actions : lock,unlock, projectionRegister
		 * @param {String} actionEvent
		 * @param {Function} listener
		 * @param {name} the listener owner name
		 */
		addPluginListener  : function(actionEvent,listener,name){
			if(name === undefined)
				throw new Error('Plugin listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener, name:name};
			this.pluginlisteners[this.pluginlisteners.length] =l;
		},
		
		/**
		 * fire listener when plugin is being to lock, unlock, repaint
		 */
		firePluginEvent : function(actionEvent){
			for (var i = 0; i < this.pluginlisteners.length; i++) {
				var l = this.pluginlisteners[i];
				if(actionEvent === l.action){
					l.onEvent(this);
				}
			}
		},
		
		onProjectionRegister: function(){
		},
		
		/**
		 * assign projection to this plugin
		 */
		setProjection : function(projection) {
			this.projection = projection;
			var that = this;
			projection.addProjectionListener('pluginRegister',function(){
				that.firePluginEvent('projectionRegister');
			}," pluglin fire to listener plugin registered in projection")
		},

		setPriority : function(priority) {
			this.priority = priority;
		},

		getPriority : function() {
			return this.priority;
		},

		isSelectable : function() {
			return this.selectable;
		},

		setSelectable : function(selectable) {
			this.selectable = selectable;
		},

		isLockSelected : function() {
			return this.lockSelected;
		},

		select : function() {
			this.lockSelected = true;
			this.firePluginEvent('lock');
		},

		unselect : function() {
			this.lockSelected = false;
			this.firePluginEvent('unlock');
		},

		isLockPassive : function() {
			return this.lockPassive;
		},

		passive : function() {
			this.lockPassive = true;
			this.firePluginEvent('passive');
		},

		unpassive : function() {
			this.lockPassive = false;
			this.firePluginEvent('unpassive');
		},

		/**
		 * override this method to paint plugin
		 * @param {Object} g2d graphics context
		 * @param {String} part the part being paint
		 */
		paintPlugin : function(g2d, part) {
		},

		/**
		 * onClick call back
		 * @deprecated
		 */
		onClick : function(evt,part,x, y) {
		},
		
		/**
		 * move callback
		 * @param {Object} evt event
		 * @param {String} part the part being move
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		onMove : function(evt,part,x, y) {
		},

		/**
		 * press (down) callback
		 * @param {Object} evt event
		 * @param {String} part the part being press
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		onPress : function(evt,part,x, y) {
		},

		/**
		 * release (up) callback
		 * @param {Object} evt event
		 * @param {String} part the part being release
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		onRelease : function(evt,part,x, y) {
		},
		
		/**
		 * enter part callback
		 * @param {Object} evt event
		 * @param {String} part the part being enter
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		onEnter : function(evt,part,x, y) {
		},

		/**
		 * exit part callback
		 * @param {Object} evt event
		 * @param {String} part the part being exit
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		onExit : function(evt,part,x, y) {
		},
		
		/**
		 * wheel part callback
		 * @param {Object} evt event
		 * @param {String} part the part being wheel
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		onWheel : function(evt,part,x, y) {
		},
		
		/**
		 * return true if this plugin hosts widgets, false otherwise
		 */
		hasWidgets : function(){
			return (this.widgets.length >0);
		},
		
		/**
		 * return true if the given point (x,y) intercepts any widgets sensible shapes
		 * in all registered projection in the shared view.
		 * @param {Number} x pixel coordinate
		 * @param {Number} y pixel coordinate
		 */
		isWidgetSensible : function(x,y){
			
			var projs = this.getProjection().getView().getProjections();
			for (var p = 0; p < projs.length; p++) {
				for (var k = 0; k < projs[p].getPlugins().length; k++) {
					var ws = projs[p].getPlugins()[k].getWidgets();
					for (var l = 0; l < ws.length; l++) {
						if(ws[l].isSensible(x,y)){
							return true;
						}
							
					}
				}
			}
			return false;
		},
		
	    /**
	     * register widget
	     * 
	     * @param widget
	     *            the widget to register
	     */
	    registerWidget : function(widget) {
            widget.setHost(this);
            widget.attachLifeCycle();
            widget.onRegister();
            this.widgets[this.widgets.length]=widget;
	    },
	    
	    getWidgets: function() {
	    	return this.widgets;
	    }
	});
})();