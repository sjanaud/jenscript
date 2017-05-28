(function(){

	
	
	//
	// 	ToolBar Widget defines image buttons set
	//
	
	
	/**
	 * IconToolBargeometry Bar Geometry
	 */
	JenScript.IconToolBargeometry  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.IconToolBargeometry, JenScript.AbstractWidgetGeometry);
	JenScript.Model.addMethods(JenScript.IconToolBargeometry,{
		_init : function(config){
			 /** margin */
		    this.iconDefs = config.iconDefs;
			/** widget bounding frame */
		    this.bound2D;
		    /** bar outline shape */
		    this.outlineShape;
		    
		    this.buttons = [];
		    
		    /** true make a solving geometry request */
		    this.solveRequest = true;
		    /** margin */
		    this.margin = 4;
		    /** round radius */
		    this.radius = 3;
		    /** widget orientation */
		    this.barOrientation = config.barOrientation;
		    JenScript.AbstractWidgetGeometry.call(this,config);
		   
		    this.iconSize = (config.iconSize !== undefined)?config.iconSize: 20;
		},
		
	    addButton : function(button){
	    	this.buttons.push(button);
	    },
		
		/**
	     * solve bar geometry outline
	     */
	    solveBarGeometry : function() {
	    	var bound2D = this.bound2D;
	    	var margin = this.margin;
	    	var radius = this.radius;
	    	this.clearSensibleShape();
	        if (this.barOrientation == 'Horizontal') {
	        	this.outlineShape = new JenScript.SVGRect().origin(bound2D.getX(),bound2D.getY())
						.size(bound2D.getWidth(), bound2D.getHeight()).radius(radius, radius);
	        	
	        	var x = bound2D.getX()+margin;
	        	var y = bound2D.getY();
	        	 for (var i = 0; i < this.buttons.length; i++) {
		            	this.buttons[i].bound = new JenScript.Bound2D(x, y+2, this.iconSize,this.iconSize);
		            	x = x + this.iconSize + margin;
		            	this.addSensibleShape(this.buttons[i].bound);
		            	
				 }
	        }
	        else if (this.barOrientation == 'Vertical') {
	        	this.outlineShape = new JenScript.SVGRect().origin(bound2D.getX(),bound2D.getY())
					.size(bound2D.getWidth(), bound2D.getHeight());
					
	        }
	        
	    },

	   
	    solveButtonGeometry : function(button){
	    	  var buttonSVG = new JenScript.SVGUse()
	    	  		.xlinkHref(this.iconDefs+'#'+button.icon)
	    	  		.attr('x',button.bound.x)
	    	  		.attr('y',button.bound.y)
	    	  		.attr('width',this.iconSize)
	    	  		.attr('height',this.iconSize);
	    	  button.svg = buttonSVG;
	    },


    	 solveGeometry : function(bound2D) {
	        if (this.solveRequest) {
	            this.bound2D = bound2D;

	            if (this.barOrientation == undefined) {
	                return;
	            }
	            this.solveBarGeometry();
	            for (var i = 0; i < this.buttons.length; i++) {
	            	this.solveButtonGeometry(this.buttons[i]);
				}
	           
	            this.solveRequest = false;
	        }
	    },
	});
	
	
	
	/**
	 * IconToolBarWidget widget that is suppose to use icon tool bar geometry.
	 */
	JenScript.IconToolBarWidget  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.IconToolBarWidget, JenScript.Widget);
	JenScript.Model.addMethods(JenScript.IconToolBarWidget,{
		
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
		    this.geometry = new JenScript.IconToolBargeometry(config);

		    /** theme color to fill bar */
		    this.outlineFillColor = config.outlineFillColor;
		    /** shader*/
		    this.shader = config.shader;
		    /** outline color */
		    this.outlineStrokeColor = config.outlineStrokeColor;
		    /** outline bar widget stroke */
		    this.outlineStrokeWidth = (config.outlineStrokeWidth !== undefined) ? config.outlineStrokeWidth: 1;
		    
		    /** button fill color */
		    this.buttonFillColor = config.buttonFillColor;
		    
		    /** button roll over fill color */
		    this.buttonRolloverFillColor = config.buttonRolloverFillColor;
		    
		    /** button press fill color */
		    this.buttonPressFillColor = config.buttonPressFillColor;
		    
		    config.Id =  'IconToolBar'+JenScript.sequenceId++;
			config.name = 'WidgetIconToolbar';
	        config.xIndex = (config.xIndex !== undefined)?config.xIndex : 2;
	        config.yIndex = (config.yIndex !== undefined)?config.yIndex : 100;
	        config.barOrientation = (config.barOrientation !== undefined)?config.barOrientation : 'Horizontal';
			JenScript.Widget.call(this,config);
			
		},
		
		addButton : function(button){
			this.geometry.addButton(button);
			this.width = (this.geometry.margin + this.geometry.buttons.length * (this.geometry.iconSize + this.geometry.margin ) + this.geometry.margin );
			this.height = this.geometry.iconSize + 4;
			button.setColor = function(color){
				this.element.setAttribute('fill',color);
			}
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
	        for (var i = 0; i < this.geometry.buttons.length; i++) {
	        	var b = this.geometry.buttons[i];
	    		if (b.bound != undefined && b.bound.contains(x, y)) {
	 	            if (!b.rollover) {
	 	            	b.rollover = true;
	 	                this.onEnter(b);
	 	            }
	 	        }
	 	        else {
	 	            if (b.rollover) {
	 	            	b.rollover=false;
	 	                this.onExit(b);
	 	            }
	 	        }
			}
	    },

	    onEnter : function(button) {
	    	if(button.enter)
	    		button.enter();
	    	this.showTooltip(button);
	    	this.updateButtons();
	    },
	    
	    onExit : function(button) {
	    	if(button.exit)
	    		button.exit();
	    	this.hideTooltip(button);
	    	this.updateButtons();
	    },
	    
	    showTooltip : function(button) {
	    	if(button.tooltip !== undefined){
	    		if(button.tooltip.position === 'top')
	    			button.tooltip.setArrowAnchor({x : button.bound.x + button.bound.width/2, y : button.bound.y - 10});
	    		if(button.tooltip.position === 'right')
	    			button.tooltip.setArrowAnchor({x : button.bound.x + button.bound.width + 10, y : button.bound.y +  button.bound.height/2});
	    		if(button.tooltip.position === 'left')
	    			button.tooltip.setArrowAnchor({x : button.bound.x - 10, y : button.bound.y +  button.bound.height/2});
	    		if(button.tooltip.position === 'bottom')
	    			button.tooltip.setArrowAnchor({x : button.bound.x + button.bound.width/2, y : button.bound.y +  button.bound.height + 10});
	    		button.tooltip.setVisible(true);
	    		var view = this.getHost().getView();
				var g2d =  new JenScript.Graphics({definitions : view.svgWidgetsDefinitions,graphics : view.svgWidgetsGraphics});
	    		button.tooltip.paintTooltip(g2d);
        	}
	    },
	    
	    hideTooltip : function(button) {
	    	if(button.tooltip !== undefined){
	    		button.tooltip.setVisible(false);
	    		var view = this.getHost().getView();
				var g2d =  new JenScript.Graphics({definitions : view.svgWidgetsDefinitions, graphics : view.svgWidgetsGraphics});
	    		button.tooltip.paintTooltip(g2d);
        	}
	    },

	    onPress : function(button) {
	    	if(button.rollover)
	    		button.pressed = true;
	    	if(button.press)
	    		button.press();
	    	this.updateButtons();
	    },

	    onReleased : function(button) {
	    	button.pressed = false;
	    	if(button.release)
	    		button.release();
	    	this.updateButtons();
	    },
	    
	    updateButton : function(button){
	    	var c = this.buttonFillColor;
	    	if(button.rollover){
	    		c = this.buttonRolloverFillColor;
	    	}
	    	if(button.pressed){
	    		c = this.buttonPressFillColor;
	    		if(button.buttonPressFillColor !== undefined)
	    			c = button.buttonPressFillColor;
	    	}
	    	if(button.toggle && button.isToggled()){
	    		c = this.buttonPressFillColor;
	    		if(button.buttonPressFillColor !== undefined)
	    			c = button.buttonPressFillColor;
	    	}
	    	button.setColor(c);
	    },
	    
	    updateButtons : function(){
	    	  for (var i = 0; i < this.geometry.buttons.length; i++) {
		        	var b = this.geometry.buttons[i];
		        	this.updateButton(b);
	    	  }
	    },
	    
	  

	    /**
	     * intercept press
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptPress : function(x,y) {
	    	for (var i = 0; i < this.geometry.buttons.length; i++) {
	    		if (this.geometry.buttons[i].bound !== undefined && this.geometry.buttons[i].bound.contains(x, y)) {
		            this.onPress(this.geometry.buttons[i]);
		        }
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
	    	for (var i = 0; i < this.geometry.buttons.length; i++) {
	    		if (this.geometry.buttons[i].bound !== undefined && this.geometry.buttons[i].bound.contains(x, y)) {
	    			 this.onReleased(this.geometry.buttons[i]);
		        }
			}
	       
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
	        
			for (var i = 0; i < this.geometry.buttons.length; i++) {
				var b =this.geometry.buttons[i];
				var fillColor = this.buttonFillColor;
				if(b.rollover)
					fillColor = this.buttonRolloverFillColor;
				if(b.toggle && b.isToggled())
					fillColor = this.buttonPressFillColor;
	        	b.svg.fill(fillColor);
	        	b.element = b.svg.toSVG();
	        	svgRoot.child(b.element);
			}
			
	        g2d.insertSVG(svgRoot.toSVG());
	        this.onPaintEnd();
	    }
	});
	
})();