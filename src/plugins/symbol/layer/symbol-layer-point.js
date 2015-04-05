(function(){
	
	JenScript.SymbolPointLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPointLayer, JenScript.SymbolLayer);
	JenScript.Model.addMethods(JenScript.SymbolPointLayer,{
		
		_init : function(config){
			config=config||{};
			JenScript.SymbolLayer.call(this, config);
			this.symbolListeners = [];
		},
		
		/**
	     * add symbol listener with given action
	     * 
	     * enter : when symbol is entered
	     * exit : when symbol is exited
	     * move : when move in bar
	     * press : when symbol is pressed
	     * release : when symbol is released
	     * 
	     * 
	     * @param {String}   symbol action event type like enter, exit, press, release
	     * @param {Function} listener
	     * @param {String}   listener owner name
	     */
		addSymbolListener  : function(actionEvent,listener,name){
			if(name === undefined)
				throw new Error('Symbol listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener, name:name};
			this.symbolListeners[this.symbolListeners.length] =l;
		},
		
		/**
		 * fire listener when symbol is entered, exited, pressed, released
		 */
		fireSymbolEvent : function(actionEvent,bar){
			for (var i = 0; i < this.symbolListeners.length; i++) {
				var l = this.symbolListeners[i];
				if(actionEvent === l.action){
					l.onEvent(bar);
				}
			}
		},
		
		
	    getFlattenSymbolComponents : function() {
	        var flattenSymbolComponents = [];
	    	for (var i = 0; i < this.getSymbols().length; i++) {
				var comp = this.getSymbols()[i];
				if (comp instanceof JenScript.SymbolComponent   && !(comp instanceof JenScript.SymbolPolylinePoint)) {
	                flattenSymbolComponents[flattenSymbolComponents.length] = comp;
	            }
	    	}
	        return flattenSymbolComponents;
	    },

	    
	   paintLayer : function(g2d,viewPart,paintRequest) {
		   console.log("paintLayer point ");
	        if (viewPart === 'Device' && paintRequest === 'SymbolLayer') {
	        	for (var i = 0; i < this.getSymbols().length; i++) {
					var ps = this.getSymbols()[i];
					
	                if (!ps.isFiller) {
	                	console.log("paint point symbol : "+ps);
	                    if (ps instanceof JenScript.SymbolPoint && !(ps instanceof JenScript.SymbolPolylinePoint)) {
	                    	var painters = ps.getPointSymbolPainters();
	                    	for (var j = 0; j < painters.length; j++) {
	                    		painters[j].paintSymbol(g2d, ps, viewPart);
							}
	                    }
	                    else if (ps instanceof JenScript.SymbolPolylinePoint) {
	                        if (ps.getPolylinePainter() !== undefined) {
	                            ps.getPolylinePainter().paintSymbol(g2d, ps, viewPart);
	                        }
	                    }

	                }
				}
	           
	        }
	    },

	    
	   solveSymbolComponent : function(symbol) {
	        if (symbol.isFiller) {
	            return;
	        }
	        if (this.getHost().getNature() === 'Vertical') {
	            this.solveVSymbolComponent(symbol);
	        }
	        if (this.getHost().getNature() === 'Horizontal') {
	            this.solveHSymbolComponent(symbol);
	        }
	    },

	    /**
	     * solve vertical component geometry
	     * 
	     * @param symbol
	     *            the component to solve
	     */
	   solveVSymbolComponent : function(symbol) {
	        symbol.setNature('Vertical');
	        if (symbol instanceof JenScript.SymbolPoint && !(symbol instanceof JenScript.SymbolPolylinePoint)) {
	            this.solveVPointSymbol(symbol);
	        }
	        else if (symbol instanceof JenScript.SymbolPolylinePoint) {
	            // does not solving for polyline
	        }
	    },

	    /**
	     * solve the specified horizontal component
	     * 
	     * @param symbol
	     *            the bar component to solve
	     */
	    solveHSymbolComponent : function(symbol) {
	        symbol.setNature(SymbolNature.Horizontal);
	        if (symbol instanceof PointSymbol && !(symbol instanceof PolylinePointSymbol)) {
	            solveHPointSymbol(symbol);
	        }
	        else if (symbol instanceof PolylinePointSymbol) {
	            // does not solving for polyline
	        }
	    },

	    /**
	     * solve symbol points for vertical nature
	     * 
	     * @param pointSymbol
	     *            the symbol point to solve
	     */
	    solveVPointSymbol : function(pointSymbol) {
	    	console.log('solveVPointSymbol');
	        var proj = this.getHost().getProjection();
	        pointSymbol.setHost(this.getHost());
	        var p2dUser = new JenScript.Point2D(0, pointSymbol.getValue());
	        var p2ddevice = proj.userToPixel(p2dUser);
	        pointSymbol.setDeviceValue(p2ddevice.getY());
	        var x = this.getComponentXLocation(pointSymbol);
	        console.log('x location of point : '+x);
	        var devicePoint = new JenScript.Point2D(x, p2ddevice.getY());
	        var rectangle = new JenScript.SVGRect().origin(devicePoint.getX() - pointSymbol.getSensibleRadius(),  devicePoint.getY() - pointSymbol.getSensibleRadius())
	                                               .size(2 * pointSymbol.getSensibleRadius(),2 * pointSymbol.getSensibleRadius());
	                                                     
	        pointSymbol.setSensibleShape(rectangle);
	        pointSymbol.setDevicePoint(devicePoint);
	    },

	    /**
	     * solve symbol points for horizontal nature
	     * 
	     * @param pointSymbol
	     *            the symbol point to solve
	     */
	    solveHPointSymbol : function(pointSymbol) {
	        var w2d = this.getHost().getProjection();
	        pointSymbol.setHost(this.getHost());
	        var p2dUser = new JenScript.Point2D(pointSymbol.getValue(), 0);
	        var p2ddevice = w2d.userToPixel(p2dUser);
	        pointSymbol.setDeviceValue(p2ddevice.getX());
	        //var y = this.getComponentYLocation(pointSymbol);
	        pointSymbol.setDevicePoint(new JenScript.Point2D(p2ddevice.getX(), pointSymbol.getLocationY()));
	    },

	   
	   onRelease : function(evt,part,x, y) {
//	    	 var symbols = this.getSymbols();
//		     for (var i = 0; i < symbols.length; i++) {
//		    	   var symbolComponent = symbols[i];
//		            if (symbolComponent instanceof JenScript.SymbolPoint) {
//		                if (symbolComponent.getSensibleShape() != undefined
//		                        && symbolComponent.getSensibleShape().contains(x, y)
//		                        && symbolComponent.isLockEnter()) {
//		                	  this.fireSymbolEvent('release',{symbol : symbolComponent, x:x,y:y, device :{x:x,y:y}});
//		                }
//		            }
//
//		     }
	    },

	  
	   onPress : function(evt,part,x, y) {
//		   var symbols = this.getSymbols();
//	       for (var i = 0; i < symbols.length; i++) {
//	    	   var symbolComponent = symbols[i];
//	            if (symbolComponent instanceof JenScript.SymbolPoint) {
//	                if (symbolComponent.getSensibleShape() != undefined
//	                        && symbolComponent.getSensibleShape().contains(x, y)
//	                        && symbolComponent.isLockEnter()) {
//	                	 this.fireSymbolEvent('press',{symbol : symbolComponent, x:x,y:y, device :{x:x,y:y}});
//	                }
//	            }
//
//	        }
	    },

	   

	   
	   onMove : function(evt,part,x, y) {
//	       var symbols = this.getSymbols();
//	       for (var i = 0; i < symbols.length; i++) {
//	    	   var symbolComponent = symbols[i];
//			   if (symbolComponent instanceof PointSymbol) {
//	                this.barEnterExitTracker(symbolComponent, x, y);
//	            }
//	       }
	    },
	    
	    /**
	     * track symbol enter or exit for the specified symbol for device location x,y
	     * 
	     * @param bar
	     *            the bar to track
	     * @param x
	     *            the x in device coordinate
	     * @param y
	     *            the y in device coordinate
	     */
	    symbolEnterExitTracker : function(symbol,x,y) {
	        if (symbol.getBound2D() === undefined) {
	            return;
	        }
	        if (symbol.getBound2D().contains(x, y) && !symbol.isLockEnter()) {
	            symbol.setLockEnter(true);
	            this.fireSymbolEvent('enter',{symbol : symbol, x:x,y:y, device :{x:x,y:y}});
	        }
	        else if (!symbol.getBound2D().contains(x, y) && symbol.isLockEnter()) {
	            symbol.setLockEnter(false);
	            this.fireSymbolEvent('exit',{symbol : symbol, x:x,y:y, device :{x:x,y:y}});
	        }
	    },


	});
})();