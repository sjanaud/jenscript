(function(){
	
	JenScript.SymbolBarLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarLayer, JenScript.SymbolLayer);
	JenScript.Model.addMethods(JenScript.SymbolBarLayer,{
		
		/**
		 * Initialize symbol bar layer
		 * @param {Object} config
		 */
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
		 * @param {actionEvent}   event type name
		 * @param {Object}   event object
		 */
		fireSymbolEvent : function(actionEvent,event){
			for (var i = 0; i < this.symbolListeners.length; i++) {
				var l = this.symbolListeners[i];
				if(actionEvent === l.action){
					l.onEvent(event);
				}
			}
		},
		
		/**
		 * get flattened symbols
		 * @return symbols the flatten array symbols
		 */
	    getFlattenSymbolComponents : function() {
	       var flattenSymbolComponents = [];
	       for (var i = 0; i < this.getSymbols().length; i++) {
	    	    var comp = this.getSymbols()[i];
	    	   	if (comp instanceof JenScript.SymbolComponent && !(comp instanceof JenScript.SymbolBarGroup)) {
	    	   		flattenSymbolComponents[flattenSymbolComponents.length]=comp;
	            }
	            else if (comp instanceof JenScript.SymbolBarGroup) {
	            	var g =  comp.getSymbolComponents();
	            	for (var j = 0; j < g.length; j++) {
	            		flattenSymbolComponents[flattenSymbolComponents.length]=g[j];
					}
	            }
	       }
	        return flattenSymbolComponents;
	    },

	    /**
	     * paint layer
	     * 
	     * @param {Object}   g2d graphic context
	     * @param {String}   view part
	     * @param {String}   paint request, symbol or labels
	     */
	    paintLayer : function(g2d,viewPart,paintRequest) {
	        this.paintSymbols(g2d,this.getSymbols(),viewPart,paintRequest);
	    },

	    /**
	     * paint symbols
	     * 
	     * @param {Object}  g2d graphic context
	     * @param {Array} 	symbols
	     * @param {String}  view part
	     * @param {String}  paint request, symbol or labels
	     *            
	     */
	    paintSymbols : function(g2d,symbols,viewPart,paintRequest) {
	        this.solveGeometry();
	        if (viewPart === 'Device') {
	        	  for (var i = 0; i < symbols.length; i++) {
	   	    	   	var symbol = symbols[i];
		   	    	if (symbol instanceof JenScript.SymbolBar) {
		   	    		if (symbol instanceof JenScript.SymbolBarGroup) {
	                        this.paintGroup(g2d,symbol,viewPart,paintRequest);
	                    }
	                    else if (symbol instanceof JenScript.SymbolBarStacked) {
	                        this.paintBarStacked(g2d,symbol,viewPart, paintRequest);
	                    }
	                    else {
	                        this.paintBar(g2d,symbol,viewPart,paintRequest);
	                    }
		   	    	}
	            }
	        }
	        if (viewPart !== 'Device'   && paintRequest === 'LabelLayer') {
	            this.paintSymbolsAxisLabel(g2d,symbols,viewPart);
	        }
	    },

	    /**
	     * paint group
	     * 
	     * @param {Object}  g2d graphic context
	     * @param {Object}  barGroup
	     * @param {String}  view part
	     * @param {String}  paint request, symbol or labels
	     */
	    paintGroup : function(g2d,barGroup,viewPart,paintRequest) {
	        barGroup.setHost(this.getHost());
	        barGroup.setLayer(this);

	        // paint only the label for group
	        if (paintRequest === 'LabelLayer') {
	            this.paintBar(g2d,barGroup,viewPart,paintRequest);
	        }

	        // paint children of this group
	        var barSymbolComponents = barGroup.getSymbolComponents();
	        this.paintSymbols(g2d,barSymbolComponents,viewPart,paintRequest);
	    },

	    /**
	     * paint bars axis symbols
	     * 
	     * @param {Object}  g2d graphic context
	     * @param {Array} 	barSymbolComponents    the symbols components to paint
	     * @param {String}  view part
	     */
	    paintSymbolsAxisLabel : function(g2d,barSymbolComponents,viewPart) {
	    	 for (var i = 0; i < barSymbolComponents.length; i++) {
	   	    	var barComponent = barSymbolComponents[i];
	            barComponent.setHost(this.getHost());
	            if (barComponent instanceof JenScript.SymbolBar) {
	                if (barComponent instanceof JenScript.SymbolBarGroup) {
	                    var barGroup = barComponent;
	                    var groupBarSymbolComponents = barGroup.getSymbolComponents();

	                    this.paintSymbolsAxisLabel(g2d,groupBarSymbolComponents,viewPart);

	                    if (barGroup.getAxisLabel() != null) {
	                        barGroup.getAxisLabel().paintSymbol(g2d, barGroup, viewPart);
	                    }
	                }
	                else {// simple symbol or stackedSymbol
	                    this.paintBarAxisLabel(g2d,barComponent,viewPart);
	                }
	            }

	        }
	    },

	    /**
	     * paint bars axis symbols
	     * 
	     * @param {Object}  g2d graphic context
	     * @param {Object} barSymbol  the symbol component
	     * @param {String} viewPart
	     */
	    paintBarAxisLabel : function(g2d,barSymbol,viewPart) {
	        if (barSymbol.getAxisLabel() !== undefined) {
	            barSymbol.getAxisLabel().paintSymbol(g2d, barSymbol, viewPart);
	        }
	    },

	    /**
	     * paint bar
	     * 
	     * @param {Object} g2d graphic context
	     * @param {Object} bar  the bar to paint
	     * @param {String} viewPart
	     * @param {String} paint request      
	     */
	    paintBar : function(g2d,bar,viewPart,paintRequest) {
	        bar.setHost(this.getHost());
	        bar.setLayer(this);
	        if (paintRequest === 'SymbolLayer') {
	            if (bar.getBarFill() !== undefined) {
	                bar.getBarFill().paintSymbol(g2d,bar,viewPart);
	            }
	            if (bar.getBarEffect() !== undefined) {
	                bar.getBarEffect().paintSymbol(g2d,bar,viewPart);
	            }
	            if (bar.getBarStroke() !== undefined) {
	                bar.getBarStroke().paintSymbol(g2d,bar,viewPart);
	            }
	        }
	        else if (paintRequest == 'LabelLayer') {
	            if (bar.getBarLabel() != null) {
	                bar.getBarLabel().paintSymbol(g2d,bar,viewPart);
	            }
	        }
	    },
	    
	    /**
	     * paint stacked bar
	     * 
	     * @param {Object}  g2d graphic context
	     * @param {Object}  stackedBar the stacked bar symbol to paint
	     * @param {String}  view part
	     * @param {String}  paintRequest symbol or label paint request
	     */
	    paintBarStacked : function(g2d,stackedBar,viewPart,paintRequest) {
	        stackedBar.setHost(this.getHost());
	        stackedBar.setLayer(this);
	        var stacks = stackedBar.getStacks();
	        if (paintRequest === 'SymbolLayer') {
	            for (var i = 0; i < stacks.length; i++) {
	            	stacks[i].barFill = stackedBar.barFill;
	                this.paintBar(g2d, stacks[i],viewPart,paintRequest);
	            }
	            if (stackedBar.getBarEffect() !== undefined) {
	                stackedBar.getBarEffect().paintSymbol(g2d, stackedBar,viewPart);
	            }
	            if (stackedBar.getBarStroke() !== undefined) {
	                stackedBar.getBarStroke().paintSymbol(g2d, stackedBar, viewPart);
	            }
	        }
	        else if (paintRequest == 'LabelLayer') {
	            if (stackedBar.getBarLabel() != null) {
	                stackedBar.getBarLabel().paintSymbol(g2d,stackedBar, viewPart);
	            }
	            for (var i = 0; i < stacks.length; i++) {
	            	var s = stacks[i];
	                if (s.getBarLabel() != null) {
	                    s.getBarLabel().paintSymbol(g2d, s, viewPart);
	                }
	            }
	        }
	    },

	    /**
	     * solve symbol component
	     * @param {Object}  symbol the symbol to solve
	     */
	    solveSymbolComponent : function(symbol) {
	        if (symbol.isFiller) {
	            return;
	        }
	        symbol.setLayer(this);
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
	     * @param {Object}  symbol the vertical symbol to solve
	     */
	    solveVSymbolComponent : function(symbol) {
	        if (symbol.isFiller) {
	            return;
	        }
	        symbol.setNature('Vertical');
	        symbol.setLayer(this);
	        if (symbol instanceof JenScript.SymbolBarGroup) {
	            this.solveVBarGroup(symbol);
	        }
	        else if (symbol instanceof JenScript.SymbolBarStacked) {
	            this.solveVStackedBar(symbol);
	        }
	        else {
	            this.solveVBarSymbol(symbol);
	        }
	    },

	    /**
	     * solve vertical bar
	     * 
	     * @param {Object}  symbol the vertical symbol bar to solve
	     */
	    solveVBarSymbol : function(bar) {
	    	//console.log('solveVBarSymbol'+bar.Id);
	        if (this.getHost() === undefined || this.getHost().getProjection() === undefined) {
	            return;
	        }
	        bar.setHost(this.getHost());
	        var proj = this.getHost().getProjection();
	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() + bar.getValue());
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() - bar.getValue());
	        }
	        if (!bar.isValueSet()) {
	            throw new Error("bar symbol ascent or descent value should be supplied.");
	        }
	        if (!bar.isBaseSet()) {
	            throw new Error("bar symbol base value should be supplied.");
	        }

	        var p2ddevice = proj.userToPixel(p2dUser);
	        var p2dUserBase = new JenScript.Point2D(0, bar.getBase());
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var x = this.getComponentXLocation(bar);
	        var y = p2ddevice.y;
	        if (bar.isAscent()) {
	            y = p2ddevice.y;
	        }
	        if (bar.isDescent()) {
	            y = p2ddeviceBase.y;
	        }
	        var width = bar.getThickness();
	        var height = Math.abs(p2ddeviceBase.y - p2ddevice.y);

	        if (bar.getMorpheStyle() === 'Round') {
	        	var round = bar.getRound();
	        	
	           var barPath = new JenScript.SVGPath().Id(bar.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y + round);
	                barPath.lineTo(x, y + height);
	                barPath.lineTo(x + width, y + height);
	                barPath.lineTo(x + width, y + round);
	                barPath.quadTo(x + width, y, x + width - round, y);
	                barPath.lineTo(x + round, y);
	                barPath.quadTo(x, y, x, y + round);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x, y + height - round);
	                barPath.quadTo(x, y + height, x + round, y + height);
	                barPath.lineTo(x + width - round, y + height);
	                barPath.quadTo(x + width, y + height, x + width, y + height - round);
	                barPath.lineTo(x + width, y);
	                barPath.close();
	            }
	            bar.setBarShape(barPath);
	        }
	        else if (bar.getMorpheStyle() === 'Rectangle') {
	            var barRec = new JenScript.SVGRect().origin(x, y).size(width,height);
	            bar.setBarShape(barRec);
	        }
	    },

	    /**
	     * solve the given vertical stacked bar
	     * 
	     * @param {Object}  stackedBar the vertical stacked bar symbol to solve
	     */
	    solveVStackedBar : function(stackedBar) {
	        if (this.getHost() === undefined || this.getHost().getProjection() === undefined) {
	            return;
	        }
	        stackedBar.setHost(this.getHost());
	        stackedBar.normalize();
	        var proj = this.getHost().getProjection();
	        var p2dUser = undefined;
	        if (stackedBar.isAscent()) {
	            p2dUser = new JenScript.Point2D(0, stackedBar.getBase() + stackedBar.getValue());
	                    
	        }
	        if (stackedBar.isDescent()) {
	            p2dUser = new new JenScript.Point2D(0, stackedBar.getBase() - stackedBar.getValue());
	                   
	        }
	        if (!stackedBar.isValueSet()) {
	            throw new Error("stacked bar symbol ascent or descent value should be supplied.");
	        }
	        if (!stackedBar.isBaseSet()) {
	            throw new Error("stacked bar symbol base value should be supplied.");
	        }

	        var p2ddevice = proj.userToPixel(p2dUser);
	        var p2dUserBase = new JenScript.Point2D(0, stackedBar.getBase());
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var x = this.getComponentXLocation(stackedBar);
	        var y = p2ddevice.y;
	        if (stackedBar.isAscent()) {
	            y = p2ddevice.y;
	        }
	        if (stackedBar.isDescent()) {
	            y = p2ddeviceBase.y;
	        }

	        var width = stackedBar.getThickness();
	        var height = Math.abs(p2ddeviceBase.y - p2ddevice.y);

	        if (stackedBar.getMorpheStyle() === 'Round') {
	            var round = stackedBar.getRound();
	            var barPath = new JenScript.SVGPath().Id(stackedBar.Id);
	            if (stackedBar.isAscent()) {
	                barPath.moveTo(x, y + round);
	                barPath.lineTo(x, y + height);
	                barPath.lineTo(x + width, y + height);
	                barPath.lineTo(x + width, y + round);
	                barPath.quadTo(x + width, y, x + width - round, y);
	                barPath.lineTo(x + round, y);
	                barPath.quadTo(x, y, x, y + round);
	                barPath.close();
	            }
	            else if (stackedBar.isDescent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x, y + height - round);
	                barPath.quadTo(x, y + height, x + round, y + height);
	                barPath.lineTo(x + width - round, y + height);
	                barPath.quadTo(x + width, y + height, x + width, y + height  - round);
	                barPath.lineTo(x + width, y);
	                barPath.close();
	            }
	            stackedBar.setBarShape(barPath);
	        }
	        else if (stackedBar.getMorpheStyle() === 'Rectangle') {
	            var barRec = new JenScript.SVGRect().Id(stackedBar.Id).origin(x, y).size(width, height);
	            stackedBar.setBarShape(barRec);
	        }

	        var stacks = stackedBar.getStacks();
	        var count = 0;
	        for (var i = 0; i < stacks.length; i++) {
				var stack = stacks[i];
				
	            // data from host stacked bar
	            stack.setThickness(stackedBar.getThickness());
	            stack.setBase(stackedBar.getStackBase(stack));
	            stack.setNature(stackedBar.getNature());
	            stack.setBarFill(stackedBar.getBarFill());

	            if (stackedBar.isAscent()) {
	                stack.setAscentValue(stack.getNormalizedValue());
	            }
	            else if (stackedBar.isDescent()) {
	                stack.setDescentValue(stack.getNormalizedValue());
	            }

	            var stackedp2dUser = undefined;
	            if (stackedBar.isAscent()) {
	                stackedp2dUser = new JenScript.Point2D(0,stackedBar.getStackBase(stack) + stack.getNormalizedValue());
	            }
	            else if (stackedBar.isDescent()) {
	                stackedp2dUser = new JenScript.Point2D(0,stackedBar.getStackBase(stack) - stack.getNormalizedValue());
	            }

	            var stackedp2ddevice = proj.userToPixel(stackedp2dUser);
	            var stackedp2dUserBase = new JenScript.Point2D(0, stackedBar.getStackBase(stack));
	            var stackedp2ddeviceBase = proj.userToPixel(stackedp2dUserBase);

	            var stackedx = this.getComponentXLocation(stackedBar);
	            var stackedy = stackedp2ddevice.y;
	            if (stackedBar.isAscent()) {
	                stackedy = stackedp2ddevice.y;
	            }
	            if (stackedBar.isDescent()) {
	                stackedy = stackedp2ddeviceBase.y;
	            }
	            var stackedwidth = stackedBar.getThickness();
	            var stackedheight = Math.abs(stackedp2ddeviceBase.y- stackedp2ddevice.y);
	             
	            if (stackedBar.getMorpheStyle() === 'Round') {
	                if (count == stacks.length - 1) {
	                    var round = stackedBar.getRound();
	                    var barPath = new JenScript.SVGPath().Id(stack.Id);
	                    if (stackedBar.isAscent()) {
	                        barPath.moveTo(stackedx, stackedy + round);
	                        barPath.lineTo(stackedx, stackedy + stackedheight);
	                        barPath.lineTo(stackedx + stackedwidth, stackedy   + stackedheight);
	                        barPath.lineTo(stackedx + stackedwidth, stackedy    + round);
	                        barPath.quadTo(stackedx + stackedwidth, stackedy,   stackedx + stackedwidth - round, stackedy);
	                        barPath.lineTo(stackedx + round, stackedy);
	                        barPath.quadTo(stackedx, stackedy, stackedx, stackedy  + round);
	                        barPath.close();
	                    }
	                    else if (stackedBar.isDescent()) {
	                        barPath.moveTo(stackedx, stackedy);
	                        barPath.lineTo(stackedx, stackedy + stackedheight - round);
	                        barPath.quadTo(stackedx, stackedy + stackedheight,   stackedx + round, stackedy + stackedheight);
	                        barPath.lineTo(stackedx + stackedwidth - round,    stackedy + stackedheight);
	                        barPath.quadTo(stackedx + stackedwidth, stackedy    + stackedheight, stackedx + stackedwidth,  stackedy + stackedheight - round);
	                        barPath.lineTo(stackedx + stackedwidth, stackedy);
	                        barPath.close();
	                    }
	                   stack.setBarShape(barPath);
	                }
	                else {
	                    var barRec = new JenScript.SVGRect().Id(stack.Id).origin(stackedx,stackedy).size(stackedwidth, stackedheight);
	                    stack.setBarShape(barRec);
	                }
	            }
	            else if (stackedBar.getMorpheStyle() === 'Rectangle') {
	            	 var barRec = new JenScript.SVGRect().Id(stack.Id).origin(stackedx,stackedy).size(stackedwidth, stackedheight);
	                 stack.setBarShape(barRec);
	            }
	            count++;
	        }
	    },

	    /**
	     * solve horizontal group
	     * 
	     * @param {Object}  barGroup the horizontal bar group symbol to solve
	     */
	    solveHBarGroup : function(barGroup) {
	        barGroup.setHost(this.getHost());
	        barGroup.copyToBar();
	        var bars = barGroup.getSymbolComponents();
	        for (var i = 0; i < bars.length; i++) {
	        	var bc = bars[i];
	        	bc.setLayer(this);
		        this.solveHSymbolComponent(bc);
			}
	    },

	    /**
	     * solve the specified horizontal component
	     * 
	     * @param {Object}  symbol the horizontal symbol to solve
	     */
	    solveHSymbolComponent : function(symbol) {
	        if (symbol.isFiller) {
	            return;
	        }
	        symbol.setNature('Horizontal');
	        if (symbol instanceof JenScript.SymbolBarGroup) {
	            this.solveHBarGroup(symbol);
	        }
	        else if (symbol instanceof JenScript.SymbolBarStacked) {
	            this.solveHStackedBar(symbol);
	        }
	        else {
	            this.solveHBarSymbol(symbol);
	        }
	    },

	    /**
	     * solve horizontal bar group
	     * 
	     * @param {Object}  barGroup the vertical bar group symbol to solve
	     */
	    solveVBarGroup : function(barGroup) {
	        barGroup.setHost(this.getHost());
	        barGroup.copyToBar();
	       var bars = barGroup.getSymbolComponents();
	       for (var i = 0; i < bars.length; i++) {
	    	   var bc = bars[i];
	    	   bc.setLayer(this);
	           bc.setHost(this.getHost());
	           this.solveVSymbolComponent(bc);
	       }
	    },

	    /**
	     * solve horizontal bar
	     * 
	     * @param {Object}  bar the horizontal bar symbol to solve
	     */
	    solveHBarSymbol : function(bar) {
	        if (this.getHost() === undefined || this.getHost().getProjection() === undefined) {
	            return;
	        }
	        bar.setHost(this.getHost());
	        var proj = this.getHost().getProjection();

	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(bar.getBase() + bar.getValue(), 0);
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(bar.getBase() - bar.getValue(), 0);
	        }
	        if (!bar.isValueSet()) {
	            throw new Error("bar symbol ascent or descent value should be supplied.");
	        }
	        if (!bar.isBaseSet()) {
	            throw new error("stacked bar symbol base value should be supplied.");
	        }
	        var p2ddevice = proj.userToPixel(p2dUser);
	        var p2dUserBase = new JenScript.Point2D(bar.getBase(), 0);
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var y = this.getComponentYLocation(bar);
	        var x = p2ddeviceBase.x;
	        if (bar.isAscent()) {
	            x = p2ddeviceBase.x;
	        }
	        if (bar.isDescent()) {
	            x = p2ddevice.x;
	        }

	        var height = bar.getThickness();
	        var width = Math.abs(p2ddevice.x - p2ddeviceBase.x);
	        if (bar.getMorpheStyle() == 'Round') {
	        	var round = bar.getRound();
	            var barPath = new JenScript.SVGPath().Id(this.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x + width - round, y);
	                barPath.quadTo(x + width, y, x + width, y + round);
	                barPath.lineTo(x + width, y + height - round);
	                barPath.quadTo(x + width, y + height, x + width - round, y + height);
	                barPath.lineTo(x, y + height);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x + round, y);
	                barPath.lineTo(x + width, y);
	                barPath.lineTo(x + width, y + height);
	                barPath.lineTo(x + round, y + height);
	                barPath.quadTo(x, y + height, x, y + height - round);
	                barPath.lineTo(x, y + round);
	                barPath.quadTo(x, y, x + round, y);
	                barPath.close();
	            }
	            bar.setBarShape(barPath);
	        }
	        else {
	            var barRec = new JenScript.SVGRect().Id(this.Id).origin(x,y).size(width,height);
	            bar.setBarShape(barRec);
	        }

	    },

	    /**
	     * solve the horizontal stacked bar
	     * 
	     * @param {Object}  stackedBar the horizontal stacked bar symbol to solve
	     */
	    solveHStackedBar : function(stackedBar) {
	        if (this.getHost() == null || this.getHost().getProjection() == null) {
	            return;
	        }
	        stackedBar.setHost(this.getHost());
	        stackedBar.normalize();
	        
	        var w2d = getHost().getProjection();
	        var p2dUser = null;
	        if (stackedBar.isAscent()) {
	            p2dUser = new JenScript.Point2D(stackedBar.getBase() + stackedBar.getValue(), 0);
	        }
	        if (stackedBar.isDescent()) {
	            p2dUser = new JenScript.Point2D(stackedBar.getBase()- stackedBar.getValue(), 0);
	        }
	        if (!stackedBar.isValueSet()) {
	            throw new Error("stacked bar symbol ascent or descent value should be supplied.");
	        }
	        if (!stackedBar.isBaseSet()) {
	            throw new Error("stacked bar symbol base value should be supplied.");
	        }
	        var p2ddevice = w2d.userToPixel(p2dUser);

	        var p2dUserBase = new JenScript.Point2D(stackedBar.getBase(), 0);
	        var p2ddeviceBase = w2d.userToPixel(p2dUserBase);

	        var y = this.getComponentYLocation(stackedBar);
	        var x = p2ddeviceBase.x;
	        if (stackedBar.isAscent()) {
	            x = p2ddeviceBase.x;
	        }
	        if (stackedBar.isDescent()) {
	            x = p2ddevice.x;
	        }

	        var height = stackedBar.getThickness();
	        var width = Math.abs(p2ddevice.x - p2ddeviceBase.x);

	        if (stackedBar.getMorpheStyle() === 'Round') {
	        	var round = stackedBar.getRound();
	        	var barPath = new JenScript.SVGPath().Id(stackedBar.Id);
	            if (stackedBar.isAscent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x + width - round, y);
	                barPath.quadTo(x + width, y, x + width, y + round);
	                barPath.lineTo(x + width, y + height - round);
	                barPath.quadTo(x + width, y + height, x + width - round, y + height);
	                barPath.lineTo(x, y + height);
	                barPath.close();
	            }
	            else if (stackedBar.isDescent()) {
	                barPath.moveTo(x + round, y);
	                barPath.lineTo(x + width, y);
	                barPath.lineTo(x + width, y + height);
	                barPath.lineTo(x + round, y + height);
	                barPath.quadTo(x, y + height, x, y + height - round);
	                barPath.lineTo(x, y + round);
	                barPath.quadTo(x, y, x + round, y);
	                barPath.close();
	            }
	            stackedBar.setBarShape(barPath);
	        }
	        else {
	        	  var barRec = new JenScript.SVGRect().Id(stackedBar.Id).origin(x,y).size(width,height);
	        	  stackedBar.setBarShape(barRec);
	        }

	        // stack Fill
	        var stacks = stackedBar.getStacks();

	        var count = 0;
	        for (var int = 0; int < stacks.length; int++) {
				var stack = stacks[i];

	            // data from host bar
	            stack.setThickness(stackedBar.getThickness());
	            stack.setBase(stackedBar.getStackBase(stack));
	            stack.setNature(stackedBar.getNature());
	            stack.setBarFill(stackedBar.getBarFill());

	            if (stackedBar.isAscent()) {
	                stack.setAscentValue(stack.getNormalizedValue());
	            }
	            else if (stackedBar.isDescent()) {
	                stack.setDescentValue(stack.getNormalizedValue());
	            }

	            var stackedp2dUser = null;
	            if (stackedBar.isAscent()) {
	                stackedp2dUser = new JenScript.Point2D( stackedBar.getStackBase(stack) + stack.getNormalizedValue(), 0);
	            }
	            else if (stackedBar.isDescent()) {
	                stackedp2dUser = new JenScript.Point2D(stackedBar.getStackBase(stack) - stack.getNormalizedValue(), 0);
	            }
	            var stackedp2ddevice = w2d.userToPixel(stackedp2dUser);

	            var stackedp2dUserBase = new JenScript.Point2D(stackedBar.getStackBase(stack), 0);
	                                                            
	            var stackedp2ddeviceBase = w2d.userToPixel(stackedp2dUserBase);

	            var stackedy = this.getComponentYLocation(stackedBar);
	            var stackedx = stackedp2ddeviceBase.x;
	            if (stackedBar.isAscent()) {
	                stackedx = stackedp2ddeviceBase.x;
	            }
	            if (stackedBar.isDescent()) {
	                stackedx = stackedp2ddevice.x;
	            }
	            var stackedheight = stackedBar.getThickness();
	            var stackedwidth = Math.abs(stackedp2ddevice.x - stackedp2ddeviceBase.x);
	                   

	            if (stackedBar.getMorpheStyle() === 'Round') {
	                if (count == stacks.length - 1) {
	                    var round = stackedBar.getRound();
	                    var barPath = new JenScript.SVGPath().Id(stack.Id);
	                    if (stackedBar.isAscent()) {
	                        barPath.moveTo(stackedx, stackedy);
	                        barPath.lineTo(stackedx + stackedwidth - round,stackedy);
	                        barPath.quadTo(stackedx + stackedwidth, stackedy,  stackedx + stackedwidth, stackedy + round);
	                        barPath.lineTo(stackedx + stackedwidth, stackedy  + stackedheight - round);
	                        barPath.quadTo(stackedx + stackedwidth, stackedy  + stackedheight, stackedx + stackedwidth   - round, stackedy + stackedheight);
	                        barPath.lineTo(stackedx, stackedy + stackedheight);
	                        barPath.close();
	                    }
	                    else if (stackedBar.isDescent()) {
	                        barPath.moveTo(stackedx + round, stackedy);
	                        barPath.lineTo(stackedx + stackedwidth, stackedy);
	                        barPath.lineTo(stackedx + stackedwidth, stackedy + stackedheight);
	                        barPath.lineTo(stackedx + round, stackedy + stackedheight);
	                        barPath.quadTo(stackedx, stackedy + stackedheight,stackedx, stackedy + stackedheight - round);
	                        barPath.lineTo(stackedx, stackedy + round);
	                        barPath.quadTo(stackedx, stackedy, stackedx + round,  stackedy);
	                                     
	                        barPath.close();
	                    }
	                    stack.setBarShape(barPath);
	                }
	                else {
	                	var barRec = new JenScript.SVGRect().Id(stack.Id).origin(stackedx,stackedy).size(stackedwidth,stackedheight);
	                	stackedBar.setBarShape(barRec);
	                }
	            }
	            else {
	            	 var barRec = new JenScript.SVGRect().Id(stack.Id).origin(stackedx,stackedy).size(stackedwidth,stackedheight);
		        	 stackedBar.setBarShape(barRec);
	            }
	            count++;
	        }
	    },
	   
	    onRelease : function(evt,part,x, y) {
	    	this.barCheck('release',evt,x,y);
	    },
	   
	    onPress : function(evt,part,x, y) {
	    	this.barCheck('press',evt,x,y);
	    },
	   
	    onMove : function(evt,part,x, y) {
	    	this.barCheck('move',evt,x,y);
	    },
	    
	    /**
	     * check symbol event
	     * 
	     * @param {String}  action the action press, release, move, etc.
	     * @param {Object}  original event
	     * @param {Number}  x location
	     * @param {Number}  y location
	     */
	    barCheck: function(action, evt,x,y){
	    	var that=this;
	    	var _d = function(bar){
	    	   if(action === 'press')
	    		   that.fireSymbolEvent('press',{symbol : bar, x:x,y:y, device :{x:x,y:y}});
               else if(action === 'release')
            	   that.fireSymbolEvent('release',{symbol : bar, x:x,y:y, device :{x:x,y:y}});
               else 
            	   that.barEnterExitTracker(bar,x,y);
	    	};
	    	var _c = function(bar){
	    		if(bar.isFiller) return;
	    		var contains = (bar.getBound2D() !== undefined  && bar.getBound2D().contains(x,y));
        		if(action !== 'move' && contains && bar.isLockEnter()){
        			_d(bar);
        		}
        		else if (action === 'move') {
                	_d(bar);
                }
	    	};
	    	 var bars = this.getSymbols();
		        for (var i = 0; i < bars.length; i++) {
		        	
		        	var symbolComponent = bars[i];
		        	
		            if (symbolComponent instanceof JenScript.SymbolBarStacked) {
		                var stackedBar = symbolComponent;
		                _c(stackedBar);
		               var barStacks = stackedBar.getStacks();
		               for (var j = 0; j < barStacks.length; j++) {
		            	   var barStack = barStacks[j];
		            		_c(barStack);
		                }
		            }
		            else if (symbolComponent instanceof JenScript.SymbolBarGroup) {
		                var group = symbolComponent;
		                var gss = group.getSymbolComponents();
		                for (var k = 0; k < gss.length; k++) {
		                	var sg = gss[k];
		                    if (sg instanceof JenScript.SymbolBarStacked) {
		                        var stackedBar = sg;
		                        if (stackedBar.getBound2D() !== undefined   && stackedBar.getBound2D().contains(x, y)) {
		                        	_c(stackedBar);
		                        }
		                        var barStacks = stackedBar.getStacks();
		     	                for (var j = 0; j < barStacks.length; j++) {
		     	            	   var barStack = bars[j];
		     	                    if (barStack.getBound2D() !== undefined  && barStack.getBound2D().contains(x,y) && barStack.isLockEnter()) {
		     	                    	_c(barStack);
		     	                    }
		     	                }
		                    }
		                    else if (sg instanceof JenScript.SymbolBar) {
		                        if (sg.getBound2D() !== undefined  && sg.getBound2D().contains(x, y) && sg.isLockEnter()) {
		                        	_c(sg);
		                        }
		                    }
		                }
		            }
		            else if (symbolComponent instanceof JenScript.SymbolBar) {
		                _c(symbolComponent);
		            }
		        }
	    },

	    /**
	     * track bar enter or exit for the specified bar for device location x,y
	     * 
	     * @param {Object}  bar symbol
	     * @param {Number}  x location in device coordinate
	     * @param {Number}  y location in device coordinate
	     */
	    barEnterExitTracker : function(bar,x,y) {
	        if (bar.getBound2D() === undefined) {
	            return;
	        }
	        if (bar.getBound2D().contains(x, y) && !bar.isLockEnter()) {
	            bar.setLockEnter(true);
	            this.fireSymbolEvent('enter',{symbol : bar, x:x,y:y, device :{x:x,y:y}});
	        }
	        if (bar.getBound2D().contains(x, y) && bar.isLockEnter()) {
	            this.fireSymbolEvent('move',{symbol : bar, x:x,y:y, device :{x:x,y:y}});
	        }
	        else if (!bar.getBound2D().contains(x, y) && bar.isLockEnter()) {
	            bar.setLockEnter(false);
	            this.fireSymbolEvent('exit',{symbol : bar, x:x,y:y, device :{x:x,y:y}});
	        }
	    },
	});
})();