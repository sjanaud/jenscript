(function(){
	JenScript.StockLayer = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.StockLayer, {
		init : function(config){
			config = config || {};
			this.Id = 'layer'+JenScript.sequenceId++;
			this.name = config.name;
			this.plugin;
			this.geometries = [];
			this.stockListeners = [];
		},
		
		clearGeometries : function(){
			this.geometries = [];
		},
		
		getGeometries : function(){
			return this.geometries;
		},
		
		addGeometry : function(geometry){
			this.geometries[this.geometries.length] = geometry;
		},
		
		getHost : function(){
			return this.plugin;
		},
		
		/**
		 * solve layer geometry.
		 * <p>
		 * process projection of stock values from user system coordinates to device
		 * pixel system coordinates and create geometry collection.
		 * </p>
		 */
		solveLayer : function(){},

		/**
		 * paint stock layer
		 * 
		 * @param g2d
		 *            graphics context
		 * @param windowPart
		 *            part to paint
		 */
		paintLayer : function(g2d,art){},
		
		/**
		 * on move callback
		 */
		onMove : function(evt,part,x, y) {
		},

		/**
		 * on press callback
		 */
		onPress : function(evt,part,x, y) {
		},

		/**
		 * on release callback
		 */
		onRelease : function(evt,part,x, y) {
		},
		
		/**
	     * add stock listener with given action
	     * 
	     * @param {String}   stock action event type
	     * @param {Function} listener
	     * @param {String}   listener owner name
	     */
		addStockListener  : function(actionEvent,listener,name){
			if(name === undefined)
				throw new Error('Stock listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener, name:name};
			this.stockListeners[this.stockListeners.length] = l;
		},
		
		/**
		 * fire listener when stock is entered, exited, pressed, released or any event that could occur in this layer
		 * @param {actionEvent}   event type name
		 * @param {Object}   event object
		 */
		fireStockEvent : function(actionEvent,event){
			for (var i = 0; i < this.stockListeners.length; i++) {
				var l = this.stockListeners[i];
				if(actionEvent === l.action){
					l.onEvent(event);
				}
			}
		},
		
	});
})();