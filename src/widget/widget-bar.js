(function(){

	
	
	//
	// 	Bar Widget defines mini bar with two buttons
	//
	//		-vertical/horizontal plus minus (-  +) 
	//		-vertical/horizontal backward forward (<  >)
	//
	
	
	/**
	 * Abstract Bar Geometry
	 */
	JenScript.AbstractBarGeometry  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractBarGeometry, JenScript.AbstractWidgetGeometry);
	JenScript.Model.addMethods(JenScript.AbstractBarGeometry,{
		_init : function(config){
			/** widget bounding frame */
		    this.bound2D;
		    /** bar outline shape */
		    this.outlineShape;
		    /** button 1 bounding rectangle */
		    this.rect1;
		    /** button 2 bounding rectangle */
		    this.rect2;
		    /** button 1 path */
		    this.button1;
		    /** button 2 path */
		    this.button2;
		    /** button 1 roll over flag */
		    this.rollover1 = false;
		    /** button 2 roll over flag */
		    this.rollover2 = false;
		    /** true make a solving geometry request */
		    this.solveRequest = true;
		    /** margin */
		    this.margin = 4;
		    /** round radius */
		    this.radius;
		    /** inset */
		    this.inset = 3;
		    /** widget orientation */
		    this.barOrientation = config.barOrientation;
		    JenScript.AbstractWidgetGeometry.call(this,config);
		},
		
		/**
	     * solve bar geometry outline
	     */
	    solveBarGeometry : function() {
	    	var bound2D = this.bound2D;
	    	var margin = this.margin;
	    	var inset = this.inset;
	    	var radius = this.radius;
	    	
	        if (this.barOrientation == 'Horizontal') {
	        	this.outlineShape = new JenScript.SVGRect().origin(bound2D.getX(),bound2D.getY())
					.size(bound2D.getWidth(), bound2D.getHeight())
					.radius(radius/3, radius/2);
	            this.rect1 = new JenScript.Bound2D(bound2D.getX() + margin + inset, bound2D.getY() + inset, radius - 2 * inset, radius - 2 * inset);
	            this.rect2 = new JenScript.Bound2D(bound2D.getX() + inset + bound2D.getWidth() - margin - radius, bound2D.getY() + inset ,radius - 2 * inset, radius - 2 * inset);
	        }
	        else if (this.barOrientation == 'Vertical') {
	        	this.outlineShape = new JenScript.SVGRect().origin(bound2D.getX(),bound2D.getY())
					.size(bound2D.getWidth(), bound2D.getHeight())
					.radius(radius/2, radius/3);
	            this.rect1 = new JenScript.Bound2D(bound2D.getX() + inset,  bound2D.getY() + margin + inset,radius - 2 * inset, radius   - 2 * inset);
	            this.rect2 = new JenScript.Bound2D(bound2D.getX() + inset, bound2D.getY() + bound2D.getHeight() - radius - margin+ inset,radius - 2 * inset, radius - 2 * inset);
	        }
	        this.clearSensibleShape();
	        this.addSensibleShape(this.rect1);
	        this.addSensibleShape(this.rect2);
	    },

	    /**
	     * override this method to create button 1 shape inside specified bounding
	     * rectangle parameter consider two orientation cases, horizontal and
	     * vertical
	     * 
	     * @param {Object} button1 Bound2D
	     */
	    solveButton1Geometry : function(button1Bound){},

	    /**
	     * override this method to create button 2 shape inside specified bounding
	     * rectangle parameter
	     * 
	     * @param {Object} button2 Bound2D
	     */
	    solveButton2Geometry : function(button2Bound){},

	    /**
	     * solve geometry if solveRequest is true, not solve geometry
	     * otherwise
	     * solve consist of following set operations solveBarGeometry() solveButton1Geometry(rec)
	     * that have to be override in
	     * subclass of this abstract definition solveButton2Geometry(rec) that have to be override in
	     * subclass of this abstract definition
	     * 
	     * @param {Object} the bar bound
	     */
    	 solveGeometry : function(bound2D) {
	        if (this.solveRequest) {
	        	
	            this.bound2D = bound2D;
	            if (this.barOrientation === 'Horizontal') {
	                this.radius = bound2D.height ;
	            }
	            else if (this.barOrientation === 'Vertical') {
	                this.radius = bound2D.width;
	            }

	            if (this.barOrientation == undefined) {
	                return;
	            }
	            
	            this.solveBarGeometry();
	            this.solveButton1Geometry(this.rect1);
	            this.solveButton2Geometry(this.rect2);
	            this.solveRequest = false;
	        }
	    },
	});
	
	/**
	 * Defines geometry bar with two buttons 'plus +' and 'minus -' geometry
	 */
	JenScript.PlusMinusBarGeometry  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PlusMinusBarGeometry, JenScript.AbstractBarGeometry);
	JenScript.Model.addMethods(JenScript.PlusMinusBarGeometry,{
		
		/**
		 * create a bar with two buttons 'plus +' and 'minus -' geometry
		 */
		__init : function(config){
			JenScript.AbstractBarGeometry.call(this,config);
		 },
		 
		 /**
		  * solve minus button
		  * @param {Object} minus button bound 
		  */
		 solveButton1Geometry : function(rect1) {
		        if (this.barOrientation === 'Horizontal') {
		        	this.button1 = new JenScript.SVGPath().moveTo(rect1.getX(), rect1.getY() + rect1.getHeight() / 2)
		            										.lineTo(rect1.getX() + rect1.getWidth(), rect1.getY()+ rect1.getHeight() / 2);
		            										
		        }
		        else {
		        	this.button1 = new JenScript.SVGPath().moveTo(rect1.getX() + rect1.getWidth() / 2, rect1.getY())
		            									   .lineTo(rect1.getX() + rect1.getWidth() / 2, rect1.getY()+ rect1.getHeight())
		            									   .moveTo(rect1.getX(), rect1.getY() + rect1.getHeight() / 2)
		            									   .lineTo(rect1.getX() + rect1.getWidth(), rect1.getY()+ rect1.getHeight() / 2);
		                    
		        }
		    },
		   
		    /**
			  * solve plus button
			  * @param {Object} plus button bound 
			  */
		    solveButton2Geometry :function(rect2) {
		        if (this.barOrientation === 'Horizontal') {
		        	this.button2 = new JenScript.SVGPath().moveTo(rect2.getX() + rect2.getWidth() / 2, rect2.getY())
												            .lineTo(rect2.getX() + rect2.getWidth() / 2, rect2.getY() + rect2.getHeight())
												            .moveTo(rect2.getX(), rect2.getY() + rect2.getHeight() / 2)
												            .lineTo(rect2.getX() + rect2.getWidth(), rect2.getY() + rect2.getHeight() / 2);
		                   
		        }
		        else {
		        	this.button2 = new JenScript.SVGPath().moveTo(rect2.getX(), rect2.getY() + rect2.getHeight() / 2)
		            										.lineTo(rect2.getX() + rect2.getWidth(), rect2.getY()+ rect2.getHeight() / 2);
		                    
		        }
		    }
	});
	
	
	/**
	 * Defines geometry bar with two buttons 'forward |>' and 'backward <|' geometry
	 */
	JenScript.BackwardForwardBarGeometry  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.BackwardForwardBarGeometry, JenScript.AbstractBarGeometry);
	JenScript.Model.addMethods(JenScript.BackwardForwardBarGeometry,{
		
		/**
		 * create a bar with two buttons 'forward |>' and 'backward <|' geometry
		 */
		__init : function(config){
			JenScript.AbstractBarGeometry.call(this,config);
		 },
	
	
		 /**
		  * solve backward button
		  * @param {Object} backward button bound 
		  */
	     solveButton1Geometry : function(rect1) {
	    	 
	        if (this.barOrientation == 'Horizontal') {
	            this.button1 = new JenScript.SVGPath().moveTo(rect1.getX(), rect1.getY() + rect1.getHeight() / 2)
	            									.lineTo(rect1.getX() + rect1.getWidth(), rect1.getY())
	            									.lineTo(rect1.getX() + rect1.getWidth(), rect1.getY()+ rect1.getHeight())
	            									.close();
	        }
	        else {
	            this.button1 = new JenScript.SVGPath().moveTo(rect1.getX(), rect1.getY() + rect1.getHeight())
	            										.lineTo(rect1.getX() + rect1.getWidth() / 2, rect1.getY())
	            										.lineTo(rect1.getX() + rect1.getWidth(), rect1.getY()+ rect1.getHeight())
	            										.close();
	        }
	    },

	    /**
		  * solve forward button
		  * @param {Object} forward button bound 
		  */
    	solveButton2Geometry : function(rect2) {
	        if (this.barOrientation == 'Horizontal') {
	            this.button2 = new JenScript.SVGPath().moveTo(rect2.getX(), rect2.getY())
	            										.lineTo(rect2.getX() + rect2.getWidth(), rect2.getY()+ rect2.getHeight() / 2)
	            										.lineTo(rect2.getX(), rect2.getY() + rect2.getHeight())
	            										.close();
	        }
	        else {
	        	 this.button2 = new JenScript.SVGPath().moveTo(rect2.getX(), rect2.getY())
	        	 										.lineTo(rect2.getX() + rect2.getWidth() / 2, rect2.getY()  + rect2.getHeight())
	        	 										.lineTo(rect2.getX() + rect2.getWidth(), rect2.getY())
	        	 										.close();
	        }
    	}
	});
	
	
	
	
	/**
	 * Abstract bar widget that is suppose to use bar geometry like plus/minus or forward/backward.
	 */
	JenScript.AbstractBarWidget  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractBarWidget, JenScript.Widget);
	JenScript.Model.addMethods(JenScript.AbstractBarWidget,{
		
		/**
		 * create abstract bar widget
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
		    this.geometry = config.geometry;
		    /** plus minus orientation */
		    this.barOrientation = config.barOrientation;
		    /** theme color to fill bar */
		    this.outlineFillColor = config.outlineFillColor;
		    /** shader*/
		    this.shader = config.shader;
		    /** outline color */
		    this.outlineStrokeColor = config.outlineStrokeColor;
		    /** outline bar widget stroke */
		    this.outlineStrokeWidth = (config.outlineStrokeWidth !== undefined) ? config.outlineStrokeWidth: 2;
		    /** button 1 fill color */
		    this.button1FillColor = config.button1FillColor;
		    /** button 2 fill color */
		    this.button2FillColor = config.button2FillColor;
		    /** button 1 draw color */
		    this.button1DrawColor = config.button1DrawColor;
		    /** button 2 draw color */
		    this.button2DrawColor = config.button2DrawColor;
		    /** button 1 rollover fill color */
		    this.button1RolloverFillColor = config.button1RolloverFillColor;
		    /** button 2 rollover fill color */
		    this.button2RolloverFillColor = config.button2RolloverFillColor;
		    /** button 1 rollover draw color */
		    this.button1RolloverDrawColor = config.button1RolloverDrawColor;
		    /** button 2 rollover draw color */
		    this.button2RolloverDrawColor = config.button2RolloverDrawColor;
		    
		    if(config.buttonFillColor !== undefined){
		    	this.setButtonFillColor(config.buttonFillColor);
		    }
		    if(config.buttonRolloverFillColor !== undefined){
		    	this.setButtonRolloverFillColor(config.buttonRolloverFillColor);
		    }
		   
		    if(config.buttonDrawColor !== undefined){
		    	this.setButtonDrawColor(config.buttonDrawColor);
		    }
		    if(config.buttonRolloverDrawColor !== undefined){
		    	this.setButtonRolloverDrawColor(config.buttonRolloverDrawColor);
		    }
		    
		    /** outline bar widget stroke */
		    this.buttonStrokeWidth = (config.buttonStrokeWidth !== undefined) ? config.buttonStrokeWidth: 1;
		    
		    /** visible flag for button 1 */
		    this.button1Visible = true;
		    /** visible flag for button 2 */
		    this.button2Visible = true;
		    
		    this.svg = {};
		    
		    config.Id =  (config.Id !== undefined)?config.Id : 'abstractbarwidget';
	        config.width =  (config.width !== undefined)?config.width : 80;
	        config.height = (config.height !== undefined)?config.height : 18;
	        config.xIndex = (config.xIndex !== undefined)?config.xIndex : 2;
	        config.yIndex = (config.yIndex !== undefined)?config.yIndex : 100;
	        config.barOrientation = (config.barOrientation !== undefined)?config.barOrientation : 'Horizontal';
	        
			JenScript.Widget.call(this,config);
		},
		
		/**
		 * set widget outline fill color
	     * @param {String} outlineFillColor
	     */
	    setOutlineFillColor : function(outlineFillColor) {
	        this.outlineFillColor = outlineFillColor;
	    },
		
		/**
		 * set widget outline stroke color
	     * @param {String} outlineStrokeColor
	     */
	    setOutlineStrokeColor : function(outlineStrokeColor) {
	        this.outlineStrokeColor = outlineStrokeColor;
	    },
	    
	    /**
		 * set widget outline stroke width
	     * @param {Number} outlineStrokeWidth
	     */
	    setOutlineStrokeWidth : function(outlineStrokeWidth) {
	        this.outlineStrokeWidth = outlineStrokeWidth;
	    },
		
		/**
	     * set identical button roll over fill color
	     * @param {String} buttonRolloverFillColor
	     */
	    setButtonRolloverFillColor : function(buttonRolloverFillColor) {
	        this.button1RolloverFillColor = buttonRolloverFillColor;
	        this.button2RolloverFillColor = buttonRolloverFillColor;
	    },
		
		/**
	     * set identical button roll over draw color
	     * @param {String} buttonRolloverDrawColor
	     */
	    setButtonRolloverDrawColor : function(buttonRolloverDrawColor) {
	    	this.button1RolloverDrawColor = buttonRolloverDrawColor;
	    	this.button2RolloverDrawColor = buttonRolloverDrawColor;
	    },
	    
	    /**
	     * set identical button fill color
	     * @param {String} buttonFillColor
	     */
	    setButtonFillColor : function(buttonFillColor) {
	    	this.button1FillColor = buttonFillColor;
	    	this.button2FillColor = buttonFillColor;
	    },
	    
	    /**
	     * set identical button1 and button2 stroke color
	     * @param {String} buttonDrawColor
	     */
	    setButtonDrawColor : function( buttonDrawColor) {
	    	this.button1DrawColor = buttonDrawColor;
	    	this.button2DrawColor = buttonDrawColor;
	    },
	    
	    /**
	     * set the shadow parameters
	     * @param {Object} shader
	     */
	    setShader : function(shader) {
	      this.shader = shader;
	    },
	    
	    /**
	     * bar widget intercept move
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptMove : function(x,y) {
	        this.checkMoveOperation(x,y);
	        this.trackRollover(x,y);
	    },

	    /**
	     * track roll over on button 1 and button 2
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    trackRollover : function(x,y) {
	        if (this.geometry.rect1 != undefined && this.geometry.rect1.contains(x, y)) {
	            if (!this.geometry.rollover1) {
	                this.geometry.rollover1 = true;
	                this.onButton1RolloverOn();
	            }
	        }
	        else {
	            if (this.geometry.rollover1) {
	                this.geometry.rollover1=false;
	                this.onButton1RolloverOff();
	            }
	        }
	        if (this.geometry.rect2 != undefined && this.geometry.rect2.contains(x, y)) {
	            if (!this.geometry.rollover2) {
	                this.geometry.rollover2 =true;
	                this.onButton2RolloverOn();
	            }
	        }
	        else {
	            if (this.geometry.rollover2) {
	                this.geometry.rollover2 = false;
	                this.onButton2RolloverOff();
	            }
	        }
	    },
	    


	    /**
	     * call when button 1 is roll over only call repaint button 2
	     */
	    onButton1RolloverOn : function() {
	    	if(this.button1RolloverDrawColor !== undefined)
	    		this.svg.button1.setAttribute('stroke',this.button1RolloverDrawColor);
	    	else
	    		this.svg.button1.removeAttribute('stroke');
	    	if(this.button1RolloverFillColor !== undefined)
	    		this.svg.button1.setAttribute('fill',this.button1RolloverFillColor);
	    },

	    /**
	     * call when button 1 is no longer roll over only call repaint button 1
	     */
	    onButton1RolloverOff : function() {
	    	if(this.button1DrawColor !== undefined)
	    		this.svg.button1.setAttribute('stroke',this.button1DrawColor);
	    	else
	    		this.svg.button1.removeAttribute('stroke');
	    	if(this.button1FillColor !== undefined)
	    		this.svg.button1.setAttribute('fill',this.button1FillColor);
	    },

	    /**
	     * call when button 1 is roll over only call repaint button 2
	     */
	    onButton2RolloverOn : function() {
	    	if(this.button2RolloverDrawColor !== undefined)
	    		this.svg.button2.setAttribute('stroke',this.button2RolloverDrawColor);
	    	else
	    		this.svg.button2.removeAttribute('stroke');
	    	if(this.button2RolloverFillColor !== undefined)
	    		this.svg.button2.setAttribute('fill',this.button2RolloverFillColor);
	    },

	    /**
	     * call when button 2 is no longer roll over
	     */
	    onButton2RolloverOff : function() {
	    	if(this.button1DrawColor !== undefined)
	    		this.svg.button2.setAttribute('stroke',this.button2DrawColor);
	    	else
	    		this.svg.button2.removeAttribute('stroke');
	    	if(this.button1FillColor !== undefined)
	    		this.svg.button2.setAttribute('fill',this.button2FillColor);
	    },

	    /**
	     * override this method to handle button 1 pressed
	     */
	    onButton1Press : function() {
	    },

	    /**
	     * override this method to handle button 2 pressed
	     */
	    onButton2Press : function() {
	    },

	    /**
	     * override this method to handle button 1 released
	     */
	    onButton1Released : function() {
	    },

	    /**
	     * override this method to handle button 2 released
	     */
	    onButton2Released : function() {
	    },

	    /**
	     * intercept press
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptPress : function(x,y) {
//	        if (!this.getHost().isLockSelected() && this.isOrphanLock()) {
//	            return;
//	        }

	        if (this.geometry.rect1 !== undefined && this.geometry.rect1.contains(x, y)) {
	            this.onButton1Press();
	        }

	        if (this.geometry.rect2 != undefined && this.geometry.rect2.contains(x, y)) {
	            this.onButton2Press();
	        }
	    },

	    /**
	     * intercept drag
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptDrag : function( x,  y) {
	    },

	 
	    /**
	     * intercept release
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptReleased : function(x,y) {
	        this.onButton1Released();
	        this.onButton2Released();
	    },

	    /**
	     * call before widget painting operation
	     */
	    onPaintStart : function() {
	    },

	    /**
	     * call after widget painting operation
	     */
	    onPaintEnd : function() {
	    },

	    /**
	     * pain this widget
	     * @param {Object} graphics context
	     */
	    paintWidget : function(g2d) {
	        if (this.getWidgetFolder() === undefined || this.geometry === undefined) {
	            return;
	        }
	        this.onPaintStart();
	        var currentFolder = this.getWidgetFolder();
	        var boundFolder = currentFolder.getBounds2D();
	        this.geometry.solveRequest=true;
	        this.geometry.solveGeometry(boundFolder);
	        this.setSensibleShapes(this.geometry.getSensibleShapes());

	        g2d.deleteGraphicsElement(this.Id);
	        var svgRoot = new JenScript.SVGGroup().Id(this.Id);
	        
	        var outline = undefined;
	        this.geometry.outlineShape.fillNone().strokeNone();
	        if (this.shader != undefined  && this.shader.percents != undefined && this.shader.colors != undefined) {
	            var start = undefined;
	            var end = undefined;
	            if (this.barOrientation == 'Horizontal') {
	                start = {x:boundFolder.getCenterX(),y: boundFolder.getY()};
	                end = {x:boundFolder.getCenterX(), y : boundFolder.getY() + boundFolder.getHeight()};
	            }
	            else {
	                start = {x:boundFolder.getX(),y: boundFolder.getCenterY()};
	                end = { x: boundFolder.getX() + boundFolder.getWidth(),y: boundFolder.getCenterY()};
	            }
	            var gradientId = 'gradient'+JenScript.sequenceId++;
	            var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(start.x,start.y).to(end.x,end.y).shade(this.shader.percents,this.shader.colors,this.shader.opacity).toSVG();
	            g2d.definesSVG(gradient);
				this.geometry.outlineShape.fill('url(#'+gradientId+')');
	        }
	        
	        if (this.outlineFillColor !== undefined) {
	        	this.geometry.outlineShape.fill(this.outlineFillColor);
	        }
        	if (this.outlineStrokeColor !== undefined) {
	        	this.geometry.outlineShape.stroke(this.outlineStrokeColor).strokeWidth(this.outlineStrokeWidth);
	        }
        	outline= this.geometry.outlineShape.toSVG();
        	svgRoot.child(outline);
	        
			this.svg.outline=outline;
			
	        if (this.button1Visible) {
	        	var  b1 =this.geometry.button1;
	        	var fillColor = (this.geometry.rollover1)?this.button1RolloverFillColor : this.button1FillColor;
	        	var strokeColor = (this.geometry.rollover1)?this.button1RolloverDrawColor : this.button1DrawColor;
	        	b1.fill(fillColor);
	        	b1.stroke(strokeColor).strokeWidth(this.buttonStrokeWidth);
	        	var but1 = b1.toSVG();
	        	this.svg.button1=but1;
	        	svgRoot.child(but1);

	        }
	        if (this.button2Visible) {
	        	var  b2 =this.geometry.button2;
	        	var fillColor = (this.geometry.rollover2)?this.button2RolloverFillColor : this.button2FillColor;
	        	var strokeColor = (this.geometry.rollover2)?this.button2RolloverDrawColor : this.button2DrawColor;
	        	b2.fill(fillColor);
	        	b2.stroke(strokeColor).strokeWidth(this.buttonStrokeWidth);
	        	var but2 = b2.toSVG();
	        	this.svg.button2=but2;
	        	svgRoot.child(but2);
	        }
	        
	        g2d.insertSVG(svgRoot.toSVG());
	        
	        this.onPaintEnd();
	    }
	});
	
	/**
	 * Abstract Plus Minus style bar Widget
	 */
	JenScript.AbstractPlusMinusBarWidget = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractPlusMinusBarWidget, JenScript.AbstractBarWidget);
	JenScript.Model.addMethods(JenScript.AbstractPlusMinusBarWidget,{
		__init: function(config){
			config = config || {};
			config.geometry = new JenScript.PlusMinusBarGeometry(config);
			JenScript.AbstractBarWidget.call(this,config);
		},
		
	});

	/**
	 * Abstract Backward Forward style bar Widget
	 */
	JenScript.AbstractBackwardForwardBarWidget = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractBackwardForwardBarWidget, JenScript.AbstractBarWidget);
	JenScript.Model.addMethods(JenScript.AbstractBackwardForwardBarWidget,{
		__init: function(config){
			config = config || {};
			config.geometry = new JenScript.BackwardForwardBarGeometry(config);
			JenScript.AbstractBarWidget.call(this,config);
		},
		
	});
	
})();