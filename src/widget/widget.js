(function(){
	
	
	/**
	 * Widget
	 */
	JenScript.Widget = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.Widget,{
		
		/**
		 * init this widget
		 * @param {Object} config
		 * @param {String} [config.name]   widget name
		 * @param {Number} [config.width]  widget width
		 * @param {Number} [config.height] widget height
		 * @param {Number} [config.xIndex] widget x index
		 * @param {Number} [config.yIndex] widget y index
		 */
		init: function(config){
			config = config||{};
			 /** widget name */
		    this.name = (config.name !== undefined)?config.name:'widget undefined name';
		    /** the widget Id */
		    this.Id = (config.Id !== undefined)?config.Id:'widget'+JenScript.sequenceId++;
		    /** the host plugin of this widget */
		    this.host;
		    /** the widget folder */
		    this.widgetFolder;
		    /** widget width */
		    this.width = (config.width !== undefined)?config.width : 0;
		    /** widget height */
		    this.height = (config.height !== undefined)?config.height : 0;
		    /** x index */
		    this.xIndex = (config.xIndex !== undefined)?config.xIndex : 0;
		    /** y index */
		    this.yIndex = (config.yIndex !== undefined)?config.yIndex : 0;
		    /** sensible shape on this widget */
		    this.sensibleShapes = [];
		    /** lock move operation */
		    this.noMoveOperation = false;
		    /** movable widget flag */
		    this.isMovable = true;
		    this.orphanLock = false;
		},
		
		/**
	     * callback method call on widget plugin host registering.
	     */
	    onRegister : function(){
	    },
	    
	    /**
	     * get widget Id
	     * @return {String} widget Id
	     */
	    getId : function() {
	        return this.Id;
	    },
	    
	    /**
	     * get widget width
	     * @return {Number} widget width
	     */
	    getWidth : function() {
	        return this.width;
	    },
	    
	    /**
	     * get widget height
	     * @return {Number} widget height
	     */
	    getHeight : function() {
	        return this.height;
	    },
	    
	    /**
	     * get widget x index
	     * @return {Number} widget x index
	     */
	    getxIndex : function() {
	        return this.xIndex;
	    },
	    
	    /**
	     * get widget y index
	     * @return {Number} widget y index
	     */
	    getyIndex : function() {
	        return this.yIndex;
	    },

	    /**
	     * set move operation flag
	     * @param {Boolean} noMoveOperation
	     */
	    setNoMoveOperation : function(noMoveOperation) {
	        this.noMoveOperation = noMoveOperation;
	    },
	    
	    /**
	     * get move operation flag
	     * @returns {Boolean} noMoveOperation
	     */
	    isNoMoveOperation : function() {
	        return this.noMoveOperation;
	    },

		/**
	     * return true if the point defines by x and y coordinates is contains in
	     * one of the sensible shape, false otherwise
	     * @param x {Number} the x point coordinate
	     * @param y {Number} the y point coordinate
	     * @return {Boolean} true if specified coordinate is a sensible point, false otherwise
	     */
	    isSensible : function(x,y) {
	    	for (var i = 0; i < this.sensibleShapes.length; i++) {
	    		 if (this.sensibleShapes[i].contains(x, y)) {
		                return true;
		         }
			}
	    	return false;
	    },
	    
	    /**
	     * get widget sensible shapes
	     * @return {Array} the widget sensible shapes
	     */
	    getSensibleShapes : function() {
	        return this.sensibleShapes;
	    },

	    /**
	     * clear widget sensible shape
	     */
	    clearSensibleShape : function() {
	        this.sensibleShapes= [];
	    },

	    /**
	     * set widget sensible shapes
	     * @param {Array} widget sensibleShapes 
	     */
	    setSensibleShapes : function(sensibleShapes) {
	        this.sensibleShapes = sensibleShapes;
	    },

	    /**
	     * add widget sensible shape
	     * @param {Object} sensibleShape to add
	     */
	    addSensibleShape : function(sensibleShape) {
	        this.sensibleShapes[this.sensibleShapes.length] = sensibleShape;
	    },
	    
	    /**
	     * override this method in subclass widget to intercept move very important
	     * to call this method in subclass method override to manage move operation
	     * or call in method override
	     * @param {Number} x location
	     * @param {Number} y location   
	     */
	    interceptMove : function(x,y) {
	        this.checkMoveOperation(x,y);
	    },

	    /**
	     * override this method in subclass widget to intercept press
	     * @param {Number} x location
	     * @param {Number} y location   
	     */
	    interceptPress : function(x,y) {
	    },

	    /**
	     * override this method in subclass widget to intercept drag
	     * @param {Number} x location
	     * @param {Number} y location   
	     */
	    interceptDrag : function(x,y) {
	    },

	    /**
	     * override this method in subclass widget to intercept released.
	     * important to call this method in subclass method override to manage move
	     * operation or call setNoMoveOperation(boolean) in method override
	     * with false parameter, move operation are now available after released.
	     * @param {Number} x location
	     * @param {Number} y location   
	     */
	    interceptReleased : function(x,y) {
	        this.setNoMoveOperation(false);
	    },

	    /**
	     * override this method in subclass widget to intercept wheel rotation
	     * @param {Number}  rotation
	     */
	    interceptWheel : function(rotation) {
	    },
	    
	    
	    /**
	     * return plugin that host this widget
	     * @returns {Object} widget host
	     */
	    getHost: function() {
	        return this.host;
	    },

	    /**
	     * set plugin that host this widget
	     * @param {Object} host
	     */
	    setHost : function(host) {
	        this.host = host;
	    },

	    
	    /**
	     * get the widget folder
	     * @returns {Object} widget folder
	     */
	    getWidgetFolder : function() {
	        return this.widgetFolder;
	    },

	    /**
	     * set the widget folder
	     * @param {Object} widgetFolder
	     */
	    setWidgetFolder : function(widgetFolder) {
	    	//console.log('widget folder : '+widgetFolder);
	        this.widgetFolder = widgetFolder;
	    },

	    /**
	     * get theme color
	     * @return {String} widget theme color
	     */
	    getThemeColor : function() {
	        return this.host.getThemeColor();
	    },
	    
	    /**
	     * set index on post widget
	     */
	    postWidget : function() {
	        this.xIndex = this.widgetFolder.targetFolder.xIndex;
	        this.yIndex = this.widgetFolder.targetFolder.yIndex;
	    },
	    
	    /**
	     * create widget
	     */
	    create : function(){
	    	var view = this.getHost().getView();
			var g2d =  new JenScript.Graphics({definitions : view.svgWidgetsDefinitions,graphics : view.svgWidgetsGraphics});
			g2d.deleteGraphicsElement(this.Id);
			this.paint(g2d);
	    },
	    
	    /**
	     * destroy widget
	     */
	    destroy : function(){
	    	var view = this.getHost().getView();
	    	var g2d =  new JenScript.Graphics({definitions : view.svgWidgetsDefinitions,graphics : view.svgWidgetsGraphics});
	    	g2d.deleteGraphicsElement(this.Id);
	    },
	    
	    /**
	     * create ghost
	     */
	   createGhost : function() {
		   var view = this.getHost().getView();
		   var g2d =  new JenScript.Graphics({definitions : view.svgWidgetsDefinitions,graphics : view.svgWidgetsGraphics});
		   g2d.deleteGraphicsElement(this.Id+'_ghost');
		   if (this.getWidgetFolder() != undefined && this.getWidgetFolder().lockPress) {
        	   this.createPotential(g2d);
           }
	    },
	    
	    /**
	     * destroy ghost
	     */
	    destroyGhost : function() {
	    	var view = this.getHost().getView();
	    	var g2d =  new JenScript.Graphics({definitions : view.svgWidgetsDefinitions,graphics : view.svgWidgetsGraphics});
	    	g2d.deleteGraphicsElement(this.Id+'_ghost');
	    },

	    /**
	     * create potential widget folder
	     * @param {Object} graphics context
	     * @param {Object} widget
	     * @param {Object} widget host plugin
	     */
	    createPotential : function(g2d) {
	    	g2d.deleteGraphicsElement(this.Id+'_ghost');
	    	var potentialElement = new JenScript.SVGGroup().Id(this.Id+'_ghost');
	    	
	    	var widget = this;
	        var widgetFolder = widget.getWidgetFolder();
	       // console.log('create potential for '+this.Id+ " with folder "+widgetFolder);
	        //console.log('createPotential : '+widget.Id+' with folder : '+widget.getWidgetFolder());
	        var p = new JenScript.SVGRect().origin(widgetFolder.currentDragX-widgetFolder.width/2,widgetFolder.currentDragY-widgetFolder.height/2)
			        .size(widgetFolder.width,widgetFolder.height);     
				             
	        p.stroke('green').fillNone();
            
	        potentialElement.child(p.toSVG());
	       
	        //console.log('curent drag '+widgetFolder.getCurrentDragX()+','+widgetFolder.getCurrentDragY());
	       // console.log('test folder id : '+widgetFolder.Id);
	        var widgetPotentialFolder = this.getHost().getView()
	                							.newFolderIntanceByPosition(widgetFolder.Id,
	                                            widgetFolder.width, widgetFolder.height,
	                                            widgetFolder.currentDragX,
	                                            widgetFolder.currentDragY);

	        if (widgetPotentialFolder !== undefined) {
	        	//console.log('new potential : '+widgetPotentialFolder);
	        	var potential = new JenScript.SVGRect().origin(widgetPotentialFolder.x,widgetPotentialFolder.y)
														.size(widgetPotentialFolder.width,widgetPotentialFolder.height);
	           
	        	
	        	
	        	if (this.isEmptyFolder(widgetPotentialFolder)) {
	                widgetFolder.potentialFolder = widgetPotentialFolder;
	                widgetFolder.targetFolder = widgetPotentialFolder;
	                potential.fill('rgba(0, 255, 0, 0.6)').strokeNone();
	             
	            }
	            else {
	            	potential.fill('rgba(255,0,0,0.6)').strokeNone();
	            }
	            
	            potentialElement.child(potential.toSVG());
	            g2d.insertSVG(potentialElement.toSVG());
	        }

	    },
	    
	    /**
	     * true if the potential folder is empty, false otherwise.
	     * @param {Object} widget
	     * @param {Object} potentialFolder
	     * @return {Boolean} true if the potential folder is empty, false otherwise.
	     */
	    isEmptyFolder : function(potentialFolder) {
	    	//console.log('control potential  : '+potentialFolder.Id+" with folder :"+potentialFolder.getBounds2D());
	    	//console.log('isEmptyFolder process widget '+this.Id+' for proj : '+this.getHost().getProjection().name);
	    	//console.log('potential folder : '+potentialFolder);
	    	var boundPotential = potentialFolder.getBounds2D();
	        var hostPlugin = this.getHost();
	        for (var j = 0; j < hostPlugin.widgets.length; j++) {
            	var hostedPluginWidget = hostPlugin.widgets[j];
	            if (hostedPluginWidget.Id !== this.Id) {
	                var widgetFolder = hostedPluginWidget.getWidgetFolder();
	                //TODO, for hide widget that never been created a folder, ask for the invisible folder
	                //console.log("check folder of "+hostedPluginWidget.Id+' of proj '+hostedPluginWidget.host.getProjection().name+' with folder : '+widgetFolder);
	                if (boundPotential.intersects(widgetFolder.getBounds2D())) {
	                    return false;
	                }
	            }
	        }
	        var proj = this.getHost().getProjection();
	        for (var i = 0; i < proj.plugins.length; i++) {
	        	var plugin = proj.plugins[i];
	        	if(!plugin.hasWidgets()) //control other that have widgets
	        		continue;
	        	
	            if (hostPlugin.Id === plugin.Id) { //host plugin has already been controled
	                continue;
	            }
	            
	           
	            for (var j = 0; j < plugin.widgets.length; j++) {
	            	var pluginWidget = plugin.widgets[j];
	            	 
	                var widgetFolder = pluginWidget.getWidgetFolder();
	               // console.log('control potential with plugin widget : '+pluginWidget.name+" with folder :"+widgetFolder.getBounds2D());
//	                if (widgetFolder.getId() === potentialFolder.getId()) {
//	                    continue;
//	                }
	                if (boundPotential.intersects(widgetFolder.getBounds2D())) {
	                	console.log('collide with '+pluginWidget.name);
	                    return false;
	                }
	            }
	        }
	        return true;
	    },

	    /**
	     * sub class this for painting widget
	     * 
	     * @param {Object} graphics context
	     */
	    paintWidget : function(g2d){},

	    /**
	     * lay out widget folder
	     * @param {Object} view
	     */
	    layoutFolder : function () {
	    	//console.log('layoutFolder for widget : '+this.Id);
	    	var view = this.getHost().getProjection().getView();
	        if (this.getWidgetFolder() === undefined) {
	        	//console.log('layout set folder 1: '+this.getId());
	            this.setWidgetFolder(view.newWidgetFolderIntance(this.getId(), this.getWidth(), this.getHeight(), this.getxIndex(), this.getyIndex()));
	        }
	        else {
	        	//console.log('layout set folder 2: '+this.getId());
	            var vdf = view.newWidgetFolderIntance(this.getId(), this.getWidth(),this.getHeight(), this.getxIndex(), this.getyIndex());
	            this.getWidgetFolder().updateFrame(vdf.x, vdf.y,vdf.width, vdf.height);
	        }
	    },

	    /**
	     * final paint widget
	     * @param {Object} view
	     * @param {Object} graphics context
	     */
	    paint : function(g2d) {
	    	//console.log('paint widget plugin');
	        if (!this.getHost().isLockSelected() && this.isOrphanLock()) {
	        	//console.log('paint widget plugin RETURN, NO PAINT');
	            return;
	        }
	        
	        //widget can be active, but not in the current active projection, no need to paint
	        if(!this.getHost().getProjection().isActive()){
	        	//alert('no paint selected widget, cause, proj not active : '+this.Id+' for proj '+this.getHost().getProjection().name);
	        	return;
	        }
	        this.layoutFolder();
	        this.paintWidget(g2d);
	    },

	    /**
	     * prevent move operation if sensible shape are intercept
	     * @param {number} the x coordinate
	     * @param {number} the y coordinate           
	     */
	    checkMoveOperation : function(x,y) {
	        if (!this.getHost().isLockSelected() && this.isOrphanLock()){
	            return;
	        }
	        if (!this.isMovable) {
	            this.setNoMoveOperation(true);
	            return;
	        }
	        if (this.isSensible(x,y)) {
	            this.setNoMoveOperation(true);
	        }
	        else {
	            this.setNoMoveOperation(false);
	        }
	    },

	    /**
	     * true if widget is ovable, false otherwise
	     * @returns {Boolean} widget movable flag
	     */
	    isMovable : function() {
	        return this.isMovable;
	    },

	    /**
	     * set widget movable flag
	     * @param {Boolean} isMovable
	     */
	    setMovable : function(isMovable) {
	        this.isMovable = isMovable;
	    },

	    /**
	     * true if widget is orphan lock, false otherwise
	     * @return {Boolean} the orphanLock
	     */
	    isOrphanLock : function() {
	        return this.orphanLock;
	    },

	    /**
	     * set widget orphan lock flag
	     * @param {Boolean} orphanLock
	     */
	    setOrphanLock : function(orphanLock) {
	        this.orphanLock = orphanLock;
	    },
	    
	    
	    /**
	     * helper method to attach listener on host plugin for:
	     * -plugin lock : create widget
	     * -plugin unlock : destroy widget
	     * -plugin projection register : chain attach view listener in view is defined
	     * else attach projection listener for view registering that will attach
	     * 
	     * view listener
	     * - projection active  : create  widget if host is lock selected
	     * - projection passive : destroy widget if host is lock selected 
	     * 
	     */
	    attachPluginLockUnlockFactory : function(reason){
	    	var that = this;
			this.getHost().addPluginListener('lock',function (plugin){
				that.create();
				
			},'Plugin lock listener, create for reason : '+reason);
			
			this.getHost().addPluginListener('unlock',function (plugin){
				that.destroy();
				
			},'Plugin lock listener, destroy for reason : '+reason);
			
			this.getHost().addPluginListener('projectionRegister',function (plugin){
				if(plugin.getProjection().getView() !== undefined){
						that.attachViewActivePassiveFactory();
				}else{
					//wait view registering
					plugin.getProjection().addProjectionListener('viewRegister',function(proj){
						that.attachViewActivePassiveFactory();
					},'Wait for projection view registering for reason : '+reason);
				}
			},'Plugin listener for projection register for reason : '+reason);
	    },
	    
	    attachViewActivePassiveFactory : function(reason){
	    	var that = this;
	    	var view = this.getHost().getProjection().getView();
			if(view !== undefined){
				view.addViewListener('projectionActive',function(){
					if(that.getHost().isLockSelected()){
						that.create();
					}
				},'Projection active listener, create for reason :'+reason);
				
				view.addViewListener('projectionPassive',function(){
					if(that.getHost().isLockSelected()){
						that.destroy();
					}
				
				},'Projection passive listener, destroy for reason : '+reason);
			}
			
	    },

	});
	


})();