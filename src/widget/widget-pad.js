(function(){
	//
	// 	Pad Widget defines mini bar with 4 buttons
	//
	//		-plus minus
	//		-backward forward
	//
	
	/**
	 * Abstract Pad Geometry
	 */
	JenScript.AbstractPadGeometry  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractPadGeometry, JenScript.AbstractWidgetGeometry);
	JenScript.Model.addMethods(JenScript.AbstractPadGeometry,{
		_init : function(config){
			/** widget bounding frame */
		    this.bound2D;
		    /** pad center x coordinate */
		    this.centerX;
		    /** pad center y coordinate */
		    this.centerY;
		    /** pad radius */
		    this.radius;
		    /** fragment radius */
		    this.fragmentRadius;
		    /** base shape */
		    this.baseShape;
		    /** control shape */
		    this.controlShape;
		    /** north button bounding rectangle */
		    this.rectNorth;
		    /** south button bounding rectangle */
		    this.rectSouth;
		    /** west button bounding rectangle */
		    this.rectWest;
		    /** button east bouding rectangle */
		    this.rectEast;
		    /** north button shape */
		    this.northButton;
		    /** east button shape */
		    this.eastButton;
		    /** south button shape */
		    this.southButton;
		    /** west button shape */
		    this.westButton;
		    /** north roll over flag */
		    this.northRollover = false;
		    /** east roll over flag */
		    this.eastRollover = false;
		    /** south roll over flag */
		    this.southRollover = false;
		    /** west roll over flag */
		    this.westRollover = false;
		    /** button inset */
		    this.inset = 6;
		    /** solve geometry request */
		    this.solveRequest = true;
		},
	
		/**
	     * solve pad base geometry
	     * solve base shape solve control shape solve each button bounding frame
	     * rectangle
	     */
	    solvePadGeometry : function() {
	    	var centerX = this.centerX;
	    	var centerY = this.centerY;
	    	var inset = this.inset;
	    	var radius = this.radius;
	    	var fragmentRadius = this.fragmentRadius;
	        
	    	// BASE SHAPE
	        this.baseShape = new JenScript.SVGCircle().center(centerX,centerY).radius(radius);
	                                       
	
	        this.controlShape = new JenScript.SVGPath();
	
	        var controlShape = this.controlShape;
	        // CONTROL SHAPE
	        // north control
	        controlShape.moveTo(centerX - fragmentRadius, centerY - fragmentRadius);
	        controlShape.lineTo(centerX - fragmentRadius, centerY - 2
	                * fragmentRadius);
	        controlShape.curveTo(centerX - fragmentRadius, centerY - radius,
	                             centerX + fragmentRadius, centerY - radius, centerX
	                                     + fragmentRadius, centerY - 2 * fragmentRadius);
	        controlShape.lineTo(centerX + fragmentRadius, centerY - fragmentRadius);
	
	        // east control
	        controlShape.lineTo(centerX + 2 * fragmentRadius, centerY
	                - fragmentRadius);
	        controlShape.curveTo(centerX + radius, centerY - fragmentRadius,
	                             centerX + radius, centerY + fragmentRadius, centerX + 2
	                                     * fragmentRadius, centerY + fragmentRadius);
	        controlShape.lineTo(centerX + fragmentRadius, centerY + fragmentRadius);
	
	        // south control
	        controlShape.lineTo(centerX + fragmentRadius, centerY + 2 * fragmentRadius);
	        controlShape.curveTo(centerX + fragmentRadius, centerY + radius,centerX - fragmentRadius, centerY + radius, centerX - fragmentRadius, centerY + 2 * fragmentRadius);
	        controlShape.lineTo(centerX - fragmentRadius, centerY + fragmentRadius);
	
	        // west control
	        controlShape.lineTo(centerX - 2 * fragmentRadius, centerY  + fragmentRadius);
	        controlShape.curveTo(centerX - radius, centerY + fragmentRadius, centerX - radius, centerY - fragmentRadius, centerX - 2 * fragmentRadius, centerY - fragmentRadius);
	        // controlShape.lineTo(centerX+fragmentRadius, centerY+fragmentRadius);
	        controlShape.close();
	
	        // BUTTONS FRAME
	
	        // sensible shape
	        // int deltaSensible = (int)(fragmentRadius/1.8);
	
	        
	        this.rectNorth = new JenScript.Bound2D(centerX - fragmentRadius + inset,
	                                           centerY - 3 * fragmentRadius + inset, 2 * fragmentRadius - 2
	                                                   * inset, 2 * fragmentRadius - 2 * inset);
	        this.rectSouth = new JenScript.Bound2D(centerX - fragmentRadius + inset,
	                                           centerY + fragmentRadius + inset, 2 * fragmentRadius - 2
	                                                   * inset, 2 * fragmentRadius - 2 * inset);
	        this.rectWest = new JenScript.Bound2D(centerX - 3 * fragmentRadius + inset,
	                                          centerY - fragmentRadius + inset, 2 * fragmentRadius - 2
	                                                  * inset, 2 * fragmentRadius - 2 * inset);
	        this.rectEast = new JenScript.Bound2D(centerX + fragmentRadius + inset,
	                                          centerY - fragmentRadius + inset, 2 * fragmentRadius - 2
	                                                  * inset, 2 * fragmentRadius - 2 * inset);
	
	        this.clearSensibleShape();
	        this.addSensibleShape(this.rectNorth);
	        this.addSensibleShape(this.rectSouth);
	        this.addSensibleShape(this.rectWest);
	        this.addSensibleShape(this.rectEast);
	
	    },

	    /**
	     * override this method to create button north shape inside specified
	     * bounding rectangle parameter
	     * 
	     * @param buttonNorthBound
	     */
	   solveButtonNorthGeometry : function(buttonNorthBound){},
	
	    /**
	     * override this method to create button south shape inside specified
	     * bounding rectangle parameter
	     * 
	     * @param buttonSouthBound
	     */
	    solveButtonSouthGeometry : function(buttonSouthBound){},
	
	    /**
	     * override this method to create button west shape inside specified
	     * bounding rectangle parameter
	     * 
	     * @param buttonWestBound
	     */
	    solveButtonWestGeometry : function(buttonWestBound){},
	
	    /**
	     * override this method to create button west shape inside specified
	     * bounding rectangle parameter
	     * 
	     * @param buttonEastBound
	     */
	    solveButtonEastGeometry : function(buttonEastBound){},

	    /**
	     * solve geometry if solveRequest is true, not solve geometry
	     * otherwise
	     * solve consist of following set operations solvePadGeometry()
	     * solveButtonNorthGeometry(Rectangle2D) that have to be override
	     * in subclass of this abstract definition solveButtonSouthGeometry(Rectangle2D) that have to be override
	     * in subclass of this abstract definition solveButtonWestGeometry(Rectangle2D) that have to be override in
	     * subclass of this abstract definition solveButtonEastGeometry(Rectangle2D) that have to be override in
	     * subclass of this abstract definition
	     */
	    
	    solveGeometry : function(bound2D) {
	        if (this.solveRequest) {
	
	            this.bound2D = bound2D;
	
	            this.centerX = bound2D.getCenterX();
	            this.centerY = bound2D.getCenterY();
	            this.radius = bound2D.getWidth() / 2;
	            // this.fragmentRadius = new Double(radius)/2.8;
	            this.fragmentRadius = this.radius / 3;
	
	            this.solvePadGeometry();
	
	            this.solveButtonNorthGeometry(this.rectNorth);
	            this.solveButtonSouthGeometry(this.rectSouth);
	            this.solveButtonWestGeometry(this.rectWest);
	            this.solveButtonEastGeometry(this.rectEast);
	
	            this.solveRequest = false;
	        }
	    }
	});
	
	
	/**
	 * Abstract pad widget that is suppose to use pad geometry like plus/minus or forward/backward
	 */
	JenScript.AbstractPadWidget  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractPadWidget, JenScript.Widget);
	JenScript.Model.addMethods(JenScript.AbstractPadWidget,{
		
		/**
		 * create abstract pad widget
		 * @param {Object} config
		 * @param {String} [config.Id] widget Id
		 * @param {Number} [config.width] widget width
		 * @param {Number} [config.height] widget height
		 * @param {Number} [config.xIndex] widget x index
		 * @param {Number} [config.yIndex] widget y index
		 * @param {String} [config.barOrientation] widget bar orientation
		 */
		_init : function(config){
		    /** widget geometry */
		    this.padGeometry = config.geometry;
		    
		    /** theme color to fill pad base */
		    this.baseFillColor = config.baseFillColor;
		    /** theme color to draw pad base */
		    this.baseStrokeColor = config.baseStrokeColor;
		    /** stroke width to draw pad base */
		    this.baseStrokeWidth = config.baseStrokeWidth;
		    /** theme color to fill pad control */
		    this.controlFillColor = config.controlFillColor;
		    /** theme color to draw pad control */
		    this.controlStrokeColor =config.controlStrokeColor;
		    /** stroke width to draw pad control */
		    this.controlStrokeWidth =config.controlStrokeWidth;
		    /** button fill color */
		    this.buttonFillColor =config.buttonFillColor;
		    /** button rollover fill color */
		    this.buttonRolloverFillColor =config.buttonRolloverFillColor;
		    /** button stroke color */
		    this.buttonStrokeColor =config.buttonStrokeColor;
		    /** button rollover stroke color */
		    this.buttonRolloverStrokeColor =config.buttonRolloverStrokeColor;
		    /** button stroke */
		    this.buttonStrokeWidth =config.buttonStrokeWidth;
		    
		    this.svg={};
		    JenScript.Widget.call(this,config);
		},
		
	   
	    interceptDrag : function(x,y) {
	    },

	    interceptReleased : function(x,y) {
	        this.onNorthButtonReleased();
	        this.onSouthButtonReleased();
	        this.onWestButtonReleased();
	        this.onEastButtonReleased();
	    },

	    paintWidget : function(g2d) {
//	        if (!this.getHost().isLockSelected()) {
//	            return;
//	        }

	        if (this.getWidgetFolder() == undefined || this.padGeometry == undefined) {
	            return;
	        }

	        g2d.deleteGraphicsElement(this.Id);
	        var svgRoot = new JenScript.SVGGroup().Id(this.Id);
	        
	        var currentFolder = this.getWidgetFolder();
	        var boundFolder = currentFolder.getBounds2D();

	        this.padGeometry.solveRequest=true;
	        this.padGeometry.solveGeometry(boundFolder);
	        this.setSensibleShapes(this.padGeometry.getSensibleShapes());

	        var padGeometry = this.padGeometry;
	       
	        // BASE(fill & draw)
	        if (this.baseFillColor !== undefined) {
	        	padGeometry.baseShape.fill(this.baseFillColor).strokeNone();
	        	this.svg.baseFill = padGeometry.baseShape.toSVG();
	        	svgRoot.child(this.svg.baseFill);
	        }
	        if (this.baseStrokeColor !== undefined) {
	        	padGeometry.baseShape.stroke(this.baseStrokeColor).strokeWidth(this.baseStrokeWidth).fillNone();
	        	this.svg.baseStroke = padGeometry.baseShape.toSVG();
	        	svgRoot.child(this.svg.baseStroke);
	        }
	        

	        // CONTROL(fill & draw)
	        if (this.controlFillColor != undefined) {
	        	 padGeometry.controlShape.fill(this.controlFillColor).strokeNone();
	        	 this.svg.controlFill = padGeometry.controlShape.toSVG();
	        	 svgRoot.child(this.svg.controlFill);
	        }
	        if (this.controlStrokeColor != undefined) {
	        	padGeometry.controlShape.stroke(this.controlStrokeColor).strokeWidth(this.controlStrokeWidth).fillNone();
	        	this.svg.controlStroke = padGeometry.controlShape.toSVG();
	        	svgRoot.child(this.svg.controlStroke);
	        }
	       

	        var that=this;
	        this.svg.buttons = {};
	        var pb = function processButton(rf,button,name){
        		that.svg.buttons[name]={};
        		var bf = (rf===true)?that.buttonRolloverFillColor:that.buttonFillColor;
        		var bs = (rf===true)?that.buttonRolloverStrokeColor:that.buttonStrokeColor;
        		if(bf !== undefined){
	        	   button.fill(bf).strokeNone();
	        	   that.svg.buttons[name].fill = button.toSVG();
	        	   svgRoot.child(that.svg.buttons[name].fill);
        		}
        		if(bs !== undefined){
	        	   button.stroke(bs).strokeWidth(this.buttonStrokeWidth).fillNone();
	        	   that.svg.buttons[name].stroke = button.toSVG();
	        	   svgRoot.child(that.svg.buttons[name].stroke);
        		}
	       };
	        
	       pb(padGeometry.northRollover,padGeometry.northButton,'north');
	       pb(padGeometry.southRollover,padGeometry.southButton,'south');
	       pb(padGeometry.westRollover,padGeometry.westButton,'west');
	       pb(padGeometry.eastRollover,padGeometry.eastButton,'east');
               
	     g2d.insertSVG(svgRoot.toSVG());
	    },
	    
	    
	    interceptMove : function(x,y) {
	    	this.checkMoveOperation(x, y);
	    	
	        if (this.getWidgetFolder() === undefined) {
	            return;
	        }

	        var padGeometry = this.padGeometry;
	        if (!this.getWidgetFolder().getBounds2D().contains(x, y)) {
	            padGeometry.northRollover=false;
	            padGeometry.southRollover=false;
	            padGeometry.westRollover=false;
	            padGeometry.eastRollover=false;
	            this.onNorthButtonRolloverOff();
	            this.onSouthButtonRolloverOff();
	            this.onWestButtonRolloverOff();
	            this.onEastButtonRolloverOff();
	            return;
	        }
	        
	        this.trackRollover(x, y);
	    },

	    /**
	     * track roll over on button 1 and button 2
	     * 
	     * @param x
	     * @param y
	     */
	    trackRollover : function(x,y) {
	    	var padGeometry = this.padGeometry;
	        if (padGeometry.rectNorth != undefined && padGeometry.rectNorth.contains(x, y)) {
	            if (!padGeometry.northRollover) {
	                padGeometry.northRollover=true;
	                this.onNorthButtonRolloverOn();
	            }
	        }
	        else {
	            if (padGeometry.northRollover) {
	                padGeometry.northRollover=false;
	                this.onNorthButtonRolloverOff();
	            }
	        }

	        if (padGeometry.rectSouth != undefined && padGeometry.rectSouth.contains(x, y)) {
	            if (!padGeometry.southRollover) {
	                padGeometry.southRollover=true;
	                this.onSouthButtonRolloverOn();
	            }
	        }
	        else {
	            if (padGeometry.southRollover) {
	                padGeometry.southRollover=false;
	                this.onSouthButtonRolloverOff();
	            }
	        }

	        if (padGeometry.rectWest != undefined && padGeometry.rectWest.contains(x, y)) {
	            if (!padGeometry.westRollover) {
	                padGeometry.westRollover=true;
	                this.onWestButtonRolloverOn();
	            }
	        }
	        else {
	            if (padGeometry.westRollover) {
	                padGeometry.westRollover=false;
	                this.onWestButtonRolloverOff();
	            }
	        }

	        if (padGeometry.rectEast != undefined && padGeometry.rectEast.contains(x, y)) {
	            if (!padGeometry.eastRollover) {
	                padGeometry.eastRollover=true;
	                this.onEastButtonRolloverOn();
	            }
	        }
	        else {
	            if (padGeometry.eastRollover) {
	                padGeometry.eastRollover=false;
	                this.onEastButtonRolloverOff();
	            }
	        }

	    },
	    
	    _rollOn : function(name){
	    	this.svg.buttons[name].stroke.setAttribute('stroke',this.buttonRolloverStrokeColor);
	    	this.svg.buttons[name].fill.setAttribute('fill',this.buttonRolloverFillColor);
	    },
	    _rollOff : function(name){
	    	this.svg.buttons[name].stroke.setAttribute('stroke',this.buttonStrokeColor);
	    	this.svg.buttons[name].fill.setAttribute('fill',this.buttonFillColor);
	    },

	    /**
	     * call when button north is roll over
	     */
	    onNorthButtonRolloverOn : function() {
	    	this._rollOn('north');
	    },

	    /**
	     * call when button north is no longer roll over
	     */
	    onNorthButtonRolloverOff : function() {
	    	this._rollOff('north');
	    },

	    /**
	     * call when button south is roll over
	     */
	    onSouthButtonRolloverOn : function() {
	    	this._rollOn('south');
	    },

	    /**
	     * call when button south is no longer roll over
	     */
	    onSouthButtonRolloverOff : function() {
	    	this._rollOff('south');
	    },

	    /**
	     * call when button west is roll over
	     */
	    onWestButtonRolloverOn : function() {
	    	this._rollOn('west');
	    },

	    /**
	     * call when button west is no longer roll over
	     */
	    onWestButtonRolloverOff : function() {
	    	this._rollOff('west');
	    },

	    /**
	     * call when button east is roll over
	     */
	    onEastButtonRolloverOn : function() {
	    	this._rollOn('east');
	    },

	    /**
	     * call when button east is no longer roll over
	     */
	    onEastButtonRolloverOff : function() {
	    	this._rollOff('east');
	    },

	    /**
	     * override this method to handle button north pressed
	     */
	    onNorthButtonPress : function() {
	    },

	    /**
	     * override this method to handle button south pressed
	     */
	    onSouthButtonPress : function() {
	    },

	    /**
	     * override this method to handle button west pressed
	     */
	    onWestButtonPress : function() {
	    },

	    /**
	     * override this method to handle button east pressed
	     */
	    onEastButtonPress : function() {
	    },

	    /**
	     * override this method to handle button north released
	     */
	    onNorthButtonReleased : function() {
	    },

	    /**
	     * override this method to handle button south released
	     */
	    onSouthButtonReleased : function() {
	    },

	    /**
	     * override this method to handle button west released
	     */
	    onWestButtonReleased : function() {
	    },

	    /**
	     * override this method to handle button east released
	     */
	    onEastButtonReleased : function() {
	    },


	    interceptPress : function(x,y) {
	        //super.interceptPress(x, y);
	    	var padGeometry = this.padGeometry;
	        if (padGeometry.rectNorth != undefined && this.padGeometry.rectNorth.contains(x, y)) {
	            this.onNorthButtonPress();
	        }
	        else {
	        }

	        if (this.padGeometry.rectSouth != undefined && padGeometry.rectSouth.contains(x, y)) {
	            this.onSouthButtonPress();
	        }
	        else {
	        }

	        if (padGeometry.rectWest != undefined && padGeometry.rectWest.contains(x, y)) {
	            this.onWestButtonPress();
	        }
	        else {
	        }

	        if (padGeometry.rectEast != undefined  && padGeometry.rectEast.contains(x, y)) {
	            this.onEastButtonPress();
	        }
	        else {
	        }

	    }
	    
	});
	
	
	
	/**
	 * Backward Forward Pad Geometry
	 */
	JenScript.BackwardForwardPadGeometry  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.BackwardForwardPadGeometry, JenScript.AbstractPadGeometry);
	JenScript.Model.addMethods(JenScript.BackwardForwardPadGeometry,{
		__init: function(config){
			config = config||{};
			JenScript.AbstractPadGeometry.call(this,config);
		},
		
	    solveButtonNorthGeometry : function(buttonNorthBound) {
	        this.northButton = new JenScript.SVGPath();
	        this.northButton.moveTo(buttonNorthBound.getX(), buttonNorthBound.getY() + buttonNorthBound.getHeight());
	        this.northButton.lineTo( buttonNorthBound.getX() + buttonNorthBound.getWidth() / 2,buttonNorthBound.getY());
	        this.northButton.lineTo( buttonNorthBound.getX() + buttonNorthBound.getWidth(),buttonNorthBound.getY() + buttonNorthBound.getHeight());
	        this.northButton.close();
	    },
	  
	    solveButtonSouthGeometry : function(buttonSouthBound) {
	        this.southButton = new JenScript.SVGPath();
	        this.southButton.moveTo(buttonSouthBound.getX(), buttonSouthBound.getY());
	        this.southButton.lineTo(buttonSouthBound.getX() + buttonSouthBound.getWidth() / 2, buttonSouthBound.getY() + buttonSouthBound.getHeight());
	        this.southButton.lineTo(buttonSouthBound.getX() + buttonSouthBound.getWidth(),buttonSouthBound.getY());
	        this.southButton.close();
	    },

	    solveButtonWestGeometry : function(buttonWestBound) {
	        this.westButton = new JenScript.SVGPath();
	        this.westButton.moveTo(buttonWestBound.getX(), buttonWestBound.getY()  + buttonWestBound.getHeight() / 2);
	        this.westButton.lineTo(buttonWestBound.getX() + buttonWestBound.getWidth(), buttonWestBound.getY());
	        this.westButton.lineTo(buttonWestBound.getX() + buttonWestBound.getWidth(), buttonWestBound.getY() + buttonWestBound.getHeight());
	        this.westButton.close();
	    },
	    
	    solveButtonEastGeometry : function(buttonEastBound) {
	    	this.eastButton = new JenScript.SVGPath();
	    	this.eastButton.moveTo(buttonEastBound.getX(), buttonEastBound.getY());
	    	this.eastButton.lineTo(buttonEastBound.getX() + buttonEastBound.getWidth(),buttonEastBound.getY() + buttonEastBound.getHeight()/2);
	    	this.eastButton.lineTo(buttonEastBound.getX(), buttonEastBound.getY()+ buttonEastBound.getHeight());
	    	this.eastButton.close();
	    }
	});
	
	
	/**
	 * Plus Minus Pad Geometry
	 */
	JenScript.PlusMinusPadGeometry  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PlusMinusPadGeometry, JenScript.AbstractPadGeometry);
	JenScript.Model.addMethods(JenScript.PlusMinusPadGeometry,{
		__init: function(config){
			config = config||{};
			JenScript.AbstractPadGeometry.call(this,config);
		},
		
	    solveButtonNorthGeometry : function(buttonNorthBound) {
	        this.northButton = new JenScript.SVGPath();
	        this.northButton.moveTo(buttonNorthBound.getX() + buttonNorthBound.getWidth() / 2, buttonNorthBound.getY());
	        this.northButton.lineTo(buttonNorthBound.getX() + buttonNorthBound.getWidth() / 2,buttonNorthBound.getY() + buttonNorthBound.getHeight());
	        this.northButton.moveTo(buttonNorthBound.getX(), buttonNorthBound.getY()+ buttonNorthBound.getHeight() / 2);
	        this.northButton.lineTo(buttonNorthBound.getX() + buttonNorthBound.getWidth(), buttonNorthBound.getY() + buttonNorthBound.getHeight() / 2);
	    },

	   
	    solveButtonSouthGeometry : function(buttonSouthBound) {
	    	this.southButton = new JenScript.SVGPath();
	    	this.southButton.moveTo(buttonSouthBound.getX(), buttonSouthBound.getY()+ buttonSouthBound.getHeight() / 2);
	    	this.southButton.lineTo(buttonSouthBound.getX() + buttonSouthBound.getWidth(),buttonSouthBound.getY() + buttonSouthBound.getHeight() / 2);
	    },

	    
	    solveButtonWestGeometry : function(buttonWestBound) {
	    	this.westButton = new JenScript.SVGPath();
	    	this.westButton.moveTo(buttonWestBound.getX(), buttonWestBound.getY() + buttonWestBound.getHeight() / 2);
	    	this.westButton.lineTo(buttonWestBound.getX() + buttonWestBound.getWidth(), buttonWestBound.getY() + buttonWestBound.getHeight() / 2);
	    },

	    solveButtonEastGeometry : function(buttonEastBound) {
	    	this.eastButton = new JenScript.SVGPath();
	    	this.eastButton.moveTo(buttonEastBound.getX() + buttonEastBound.getWidth() / 2, buttonEastBound.getY());
	    	this.eastButton.lineTo(buttonEastBound.getX() + buttonEastBound.getWidth()/ 2, buttonEastBound.getY() + buttonEastBound.getHeight());
	    	this.eastButton.moveTo(buttonEastBound.getX(), buttonEastBound.getY() + buttonEastBound.getHeight() / 2);
	    	this.eastButton.lineTo(buttonEastBound.getX() + buttonEastBound.getWidth(), buttonEastBound.getY() + buttonEastBound.getHeight() / 2);
	    }
	});
	
	
	/**
	 * Abstract Backward Forward Pad Widget
	 */
	JenScript.AbstractBackwardForwardPadWidget  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractBackwardForwardPadWidget, JenScript.AbstractPadWidget);
	JenScript.Model.addMethods(JenScript.AbstractBackwardForwardPadWidget,{
		__init: function(config){
			config = config||{};
			config.geometry= new JenScript.BackwardForwardPadGeometry(); 
			JenScript.AbstractPadWidget.call(this,config);
		},
	});
	
	
	/**
	 * Plus Minus Pad Widget
	 */
	JenScript.AbstractPlusMinusPadWidget  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractPlusMinusPadWidget, JenScript.AbstractPadWidget);
	JenScript.Model.addMethods(JenScript.AbstractPlusMinusPadWidget,{
		__init: function(config){
			config = config||{};
			config.geometry= new JenScript.PlusMinusPadGeometry(); 
			JenScript.AbstractPadWidget.call(this,config);
		},
	});
})();