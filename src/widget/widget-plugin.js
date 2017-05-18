(function(){
	JenScript.WidgetPlugin = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.WidgetPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.WidgetPlugin,{
		_init: function(config){
			config = config||{};
			config.name='WidgetPlugin';
			JenScript.Plugin.call(this,config);
			this.press = false;
			this.contextualized = true;
		},
		
		/**
		 * get widget plugin string representation
		 */
		toString : function(){
			return 'WidgetPlugin';
		},
		
		/**
		 * override function
		 * get the plugin part graphics context
		 * @param {String} part
		 * @returns {Object} plugin graphics context
		 */
		getGraphicsContext : function(part){
			return new JenScript.Graphics({definitions : this.view.svgWidgetsDefinitions,graphics : this.view.svgWidgetsGraphics, selectors : this.view.svgSelectors});
		},
		
		/**
		 * override function
		 * repaint 
		 */
		repaintPlugin : function(caller){
		},
		
		/**
		 * override function
		 * repaint part 
		 */
		repaintPluginPart : function(part){
		},
		
	    /**
		 * paint plugin view part
		 *  @param {Object} graphics context
		 *  @param {Object} view part
		 */
	    paintPlugin : function(g2d,viewPart) {
	    },
		
		/**
		 * get view
		 * @returns {Object} view
		 */
		getView : function() {
	        return this.view;
	    },
	    
	    /**
		 * set view
		 * @param {Object} view
		 */
	    setView : function(view) {
	        this.view=view;
	    },
	    
	    /**
	     * check pressed event for widget move operation
	     * 
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    moveWidgetOperationCheckPress : function(event,part,x,y) {
	    	var contains = function(folder,x,y) {
		        if (x > folder.x && x < folder.x + folder.width && y > folder.y
		                && y < folder.y + folder.height) {
		            return true;
		        }
		        return false;
		    };
	    	//var proj = this.getActiveProjection();
	    	//console.log('moveWidgetOperationCheckPress for proj '+this.getActiveProjection().name);
		    var projs = this.getView().getProjections();
	    	for (var p = 0; p < projs.length; p++) {
	    		var proj = projs[p];
	    		
	    		
		    	for (var i = 0; i < proj.plugins.length; i++) {
		        	var plugin = proj.plugins[i];
//		            if (plugin.isSelectable() && !plugin.isLockSelected()) {
//		                continue;
//		            }
		            
		            for (var j = 0; j < plugin.widgets.length; j++) {
		            	var widget = plugin.widgets[j];
		            	
		            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
		            		
		            		//console.log('process moveWidgetOperationCheckPress widget : name : '+widget.name);
			                var widgetFolder = widget.getWidgetFolder();
			                if (widgetFolder === undefined) {
			                    continue;
			                }
			                
			                //console.log('process move flags : contains (x,y) :'+contains(widgetFolder,x, y)+", widget NoMoveOperation :"+widget.isNoMoveOperation());
			                if (contains(widgetFolder,x, y) && !widget.isNoMoveOperation()) {
			                    widgetFolder.currentDragX = x;
			                    widgetFolder.currentDragY = y;
			                    widgetFolder.startPress();
			                    widget.create();
								widget.createGhost();
								this.passivePlugins();
			                }
//			                else {
//			                    widgetFolder.interruptPress();
//			                    this.activePlugins();
//			                }
		            		
		            	}else{
		            		//console.log('incompatible mode process moveWidgetOperationCheckPress widget'+widget.name);
		            	}
		            }
				}	
	    	}
	    },

	    /**
	     * check drag event for widget move operation
	     * 
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    moveWidgetOperationCheckDrag : function(event,part,x,y) {
	        //var proj = this.getActiveProjection();
	    	
	    	var projs = this.getView().getProjections();
	    	for (var p = 0; p < projs.length; p++) {
	    		var proj = projs[p];
	    		
		        for (var i = 0; i < proj.plugins.length; i++) {
		        	var plugin = proj.plugins[i];
		            for (var j = 0; j < plugin.widgets.length; j++) {
		            	var widget = plugin.widgets[j];
		            	
		            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
		            		var widgetFolder = widget.getWidgetFolder();
			                if (widgetFolder !== undefined) {
			                    if (widgetFolder.lockPress) {
			                        widgetFolder.currentDragX = x;
			                        widgetFolder.currentDragY = y;
			                        widget.create();
									widget.createGhost();
			                    }
			                }
		            	}
		            }
		        }
	    	}
	    },

	    /**
	     * check release event for widget move operation
	     * 
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    moveWidgetOperationCheckRelease : function(evt,part,x,y) {
	    	//var proj = this.getActiveProjection();
	    	var projs = this.getView().getProjections();
	    	for (var p = 0; p < projs.length; p++) {
	    		var proj = projs[p];
	    		
	    		for (var i = 0; i < proj.plugins.length; i++) {
		        	var plugin = proj.plugins[i];
		        	for (var j = 0; j < plugin.widgets.length; j++) {
		            	var widget = plugin.widgets[j];
		            	
		            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
		            		
			                var widgetFolder = widget.getWidgetFolder();
			                if (widgetFolder === undefined) {
			                    continue;
			                }
			                if (widgetFolder.lockPress) {
			                    if (widgetFolder.targetFolder !== undefined) {
			                    	widget.postWidget();
			                        this.activePlugins();
			                        widget.create();
									widget.destroyGhost();
									 
			                    }
			                    widgetFolder.interruptPress();
			                }
		            	}
		            }
		        }
	    	}
	    },
	    
	    /**
	     * on move plugin handler
	     * 
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    onMove : function(event,part,x, y) {
	    	if(this.press){
	    		// handle widget drag for move operation
		        this.moveWidgetOperationCheckDrag(event,part,x, y);
		        // dispatch drag on widget for functional operation
		        this.dispatchDrag(event,part,x,y);
	    	}else{
	    		this.dispatchMove(event,part,x, y);
	    	}
	    },

	    /**
	     * on move dispatch
	     * @param {Object} event  the mouse move event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    dispatchMove : function(event,part,x,y) {
	    	if(part !== JenScript.ViewPart.Device) return;
	    	
	    	//var proj = this.getActiveProjection();
	    	var projs = this.getView().getProjections();
	    	for (var p = 0; p < projs.length; p++) {
	    		var proj = projs[p];
	    		
		        for (var i = 0; i < proj.plugins.length; i++) {
		        	var plugin = proj.plugins[i];
		        	for (var j = 0; j < plugin.widgets.length; j++) {
		            	var widget = plugin.widgets[j];
		            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
		            		widget.interceptMove(x, y);
		            	}
		        	}
		        }
	    	}
	    },

	    /**
	     * on wheel plugin handler
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    onWheel : function(event,part,x, y) {
	        this.dispatchWheel(event,part,x, y);
	    },

	    /**
	     * on wheel dispatch
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    dispatchWheel : function(event,part,x, y) {
	    	var proj = this.getActiveProjection();
	        for (var i = 0; i < proj.plugins.length; i++) {
	        	var plugin = proj.plugins[i];
	        	
	        	
	            if (plugin.isSelectable() && plugin.isLockSelected()) {
	            	 for (var j = 0; j < plugin.widgets.length; j++) {
			            //var widget = plugin.widgets[j];
	                    //widget.interceptWheel(mwe.getWheelRotation());
	                }
	            }
	            else {
	            	 for (var j = 0; j < plugin.widgets.length; j++) {
			            //var widget = plugin.widgets[j];
	                    //widget.interceptWheel(mwe.getWheelRotation());
	                }
	            }
	        }
	    },

	    /**
	     * on drag dispatch
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    dispatchDrag : function(event,part,x,y) {
	    	var proj = this.getActiveProjection();
	        for (var i = 0; i < proj.plugins.length; i++) {
	        	var plugin = proj.plugins[i];
	        	
	        	for (var j = 0; j < plugin.widgets.length; j++) {
	            	var widget = plugin.widgets[j];
	            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
	            		widget.interceptDrag(x, y);
	            	}
	        	}
	        	
//	            if (plugin.isSelectable() && plugin.isLockSelected()) {
//	            	 for (var j = 0; j < plugin.widgets.length; j++) {
//			            	var widget = plugin.widgets[j];
//		                    widget.interceptDrag(x,y);
//	                }
//	            }
//	            else {
//	            	 //duplicate, keep if change in future for non selectable widget
//	            	 for (var j = 0; j < plugin.widgets.length; j++) {
//			            	var widget = plugin.widgets[j];
//			            	widget.interceptDrag(x,y);
//	                }
//	            }
	        }
	    },

	    /**
	     * on press plugin handler
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	   onPress : function(event,part,x, y) {
		    this.press = true;
	        // handle widget press for move operation
	        this.moveWidgetOperationCheckPress(event,part,x,y);

	        // dispatch press on widget for functional operation
	        this.dispatchPress(event,part,x,y);
	    },
	    

	    /**
	     * on press dispatch
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    dispatchPress : function(event,part,x,y) {
	    	
	    	var projs = this.getView().getProjections();
	    	for (var p = 0; p < projs.length; p++) {
	    		var proj = projs[p];
		        for (var i = 0; i < proj.plugins.length; i++) {
		        	var plugin = proj.plugins[i];
		        	for (var j = 0; j < plugin.widgets.length; j++) {
		            	var widget = plugin.widgets[j];
		            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
		            		//console.log('widget plugin intercept press for widget : '+widget.name+' part '+part);
		            		widget.interceptPress(x, y);
		            	}
		        	}
		        }
	    	}
	    },

	    
	    /**
	     * on release plugin handler
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    onRelease :function(event,part,x, y) {
	    	 this.press = false;
	        // handle widget released for move operation
	        this.moveWidgetOperationCheckRelease(event,part,x,y);

	        // dispatch released on widget for functional operation
	        this.dispatchRelease(event,part,x,y);
	    },

	    /**
	     * on release dispatch
	     * @param {Object} event  the mouse pressed event
	     * @param {String} part component where event occurs
	     * @param {Number} x  the mouse x coordinate
	     * @param {Number} y  the mouse y coordinate
	     */
	    dispatchRelease : function(evt,part,x,y) {
	    	
	    	var projs = this.getView().getProjections();
	    	for (var p = 0; p < projs.length; p++) {
	    		var proj = projs[p];
		        for (var i = 0; i < proj.plugins.length; i++) {
		        	var plugin = proj.plugins[i];
		        	
		        	for (var j = 0; j < plugin.widgets.length; j++) {
		            	var widget = plugin.widgets[j];
		            	if(widget.isProjModeCondition('paint') && widget.isPluginModeCondition('paint')){
		            		//console.log("intercept release "+widget.name);
		            		widget.interceptReleased(x,y);
		            	}else{
		            		//console.log("no condition to intercept release "+widget.name);
		            	}
		        	}
		        }
	    	}

	    },
	    

	    /**
	     * passive plugins
	     */
	    passivePlugins : function() {
	    	var proj = this.getActiveProjection();
	        for (var i = 0; i < proj.plugins.length; i++) {
	        	var plugin = proj.plugins[i];
	        	plugin.passive();
	        }
	    },

	    /**
	     * active plugins
	     */
	    activePlugins : function() {
	    	var proj = this.getActiveProjection();
	        for (var i = 0; i < proj.plugins.length; i++) {
	        	var plugin = proj.plugins[i];
	        	plugin.unpassive();
	        }
	    },
	    
	    /**
	     * get Active projection
	     * @return {Object} active projection
	     */
	    getActiveProjection : function(){
	    	return this.getView().getActiveProjection();
	    },
	});
})();