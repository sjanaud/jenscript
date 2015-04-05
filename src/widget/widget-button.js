(function(){
	
	
	/**
	 * Button Geometry
	 */
	JenScript.AbstractButtonGeometry  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractButtonGeometry, JenScript.AbstractWidgetGeometry);
	JenScript.Model.addMethods(JenScript.AbstractButtonGeometry,{
		_init : function(config){
			/** widget bounding frame */
		    this.bound2D;
		    /** bar outline shape */
		    this.outlineShape;
		    /** button bounding rectangle */
		    this.rect;
		    /** button path */
		    this.button;
		    /** button 1 roll over flag */
		    this.rollover = false;
		    /** true make a solving geometry request */
		    this.solveRequest = true;
		    /** round radius */
		    this.radius = (config.radius !== undefined) ? config.radius: 3;
		    /** inset */
		    this.inset = (config.inset !== undefined) ? config.inset: 4;
		    JenScript.AbstractWidgetGeometry.call(this,config);
		},
		
		
	    /**
	     * override this method to create button shape inside specified bounding
	     * rectangle parameter consider two orientation cases, horizontal and
	     * vertical
	     * 
	     * @param {Object} button Bound2D
	     */
	    solveButtonGeometry : function(buttonBound){},


	    /**
	     * solve geometry if solveRequest is true, not solve geometry
	     * otherwise
	     * solve consist of solveButtonGeometry(rect)
	     * subclass of this abstract definition
	     * 
	     * @param {Object} the bar bound
	     */
    	 solveGeometry : function(bound2D) {
	        if (this.solveRequest) {
	           
	        	this.bound2D = bound2D;
		    	var inset = this.inset;
		    	
		        this.outlineShape = new JenScript.SVGRect().origin(bound2D.getX(),bound2D.getY())
						.size(bound2D.getWidth(), bound2D.getHeight());
		        
		        this.rect = new JenScript.Bound2D(bound2D.getX() + inset, bound2D.getY() + inset, bound2D.getWidth() - 2 * inset, bound2D.getHeight() - 2 * inset);
		        this.clearSensibleShape();
		        this.addSensibleShape(this.rect);
	            this.solveButtonGeometry(this.rect);
	            this.solveRequest = false;
	        }
	    },
	});
	
	/**
	 * Defines default button geometry
	 */
	JenScript.ButtonGeometry  = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ButtonGeometry, JenScript.AbstractButtonGeometry);
	JenScript.Model.addMethods(JenScript.ButtonGeometry,{
		
		/**
		 * create a button geometry
		 */
		__init : function(config){
			JenScript.AbstractButtonGeometry.call(this,config);
		 },
		 
		 /**
		  * solve  button
		  * @param {Object} button bound 
		  */
		 solveButtonGeometry : function(rect) {
			 this.button =  new JenScript.SVGRect().origin(rect.getX(),rect.getY())
				.size(rect.getWidth(), rect.getHeight()).radius(this.radius,this.radius);
		 },
		   

	});
	
	/**
	 * Abstract button widget that is suppose to use button geometry
	 */
	JenScript.AbstractButtonWidget  = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AbstractButtonWidget, JenScript.Widget);
	JenScript.Model.addMethods(JenScript.AbstractButtonWidget,{
		
		/**
		 * create abstract bar widget
		 * @param {Object} config
		 * @param {String} [config.Id] widget Id
		 * @param {Number} [config.width] widget width
		 * @param {Number} [config.height] widget height
		 * @param {Number} [config.xIndex] widget x index
		 * @param {Number} [config.yIndex] widget y index
		 */
		_init : function(config){
		    /** widget geometry */
		    this.geometry = config.geometry;
		    /** text*/
		    this.text = config.text;
		    /** text*/
		    this.textId;
		    /** text*/
		    this.textColor=(config.textColor !== undefined) ? config.textColor: 'black';
		    /** text font size*/
		    this.fontSize =(config.fontSize !== undefined) ? config.fontSize: 12;
		    /** shader*/
		    this.shader = config.shader;
		    /** button fill color */
		    this.buttonFillColor = config.buttonFillColor;
		    /** button draw color */
		    this.buttonDrawColor = config.buttonDrawColor;
		    /** button  roll over fill color */
		    this.buttonRolloverFillColor = config.buttonRolloverFillColor;
		    /** button  roll over draw color */
		    this.buttonRolloverDrawColor = config.buttonRolloverDrawColor;
		    /** outline bar widget stroke */
		    this.buttonStrokeWidth = (config.buttonStrokeWidth !== undefined) ? config.buttonStrokeWidth: 1;
		    
		    /**fill and draw opacity*/
		    this.buttonFillColorOpacity = (config.buttonFillColorOpacity !== undefined) ? config.buttonFillColorOpacity: 1;
		    this.buttonDrawColorOpacity = (config.buttonDrawColorOpacity !== undefined) ? config.buttonDrawColorOpacity: 1;
		    
		    /** visible flag for button  */
		    this.buttonVisible = true;
		    this.svg = {};
		    config.Id =  (config.Id !== undefined)?config.Id : 'AbstractButtonWidget';
	        config.width =  (config.width !== undefined)?config.width : 80;
	        config.height = (config.height !== undefined)?config.height : 24;
	        //index, redefine if needed
	        config.xIndex = (config.xIndex !== undefined)?config.xIndex : 100;
	        config.yIndex = (config.yIndex !== undefined)?config.yIndex : 100;
			JenScript.Widget.call(this,config);
		},
		
		/**
	     * set  button roll over fill color
	     * @param {String} buttonRolloverFillColor
	     */
	    setButtonRolloverFillColor : function(buttonRolloverFillColor) {
	        this.buttonRolloverFillColor = buttonRolloverFillColor;
	    },
		
		/**
	     * set  button roll over draw color
	     * @param {String} buttonRolloverDrawColor
	     */
	    setButtonRolloverDrawColor : function(buttonRolloverDrawColor) {
	    	this.buttonRolloverDrawColor = buttonRolloverDrawColor;
	    },
	    
	    /**
	     * set  button fill color
	     * @param {String} buttonFillColor
	     */
	    setButtonFillColor : function(buttonFillColor) {
	    	this.buttonFillColor = buttonFillColor;
	    },
	    
	    /**
	     * set  button fill color opacity
	     * @param {String} buttonFillColor
	     */
	    setButtonFillColorOpacity : function(buttonFillColorOpacity) {
	    	this.buttonFillColorOpacity = buttonFillColorOpacity;
	    },
	    
	    /**
	     * set  button stroke color
	     * @param {String} buttonDrawColor
	     */
	    setButtonDrawColor : function( buttonDrawColor) {
	    	this.buttonDrawColor = buttonDrawColor;
	    },
	    
	    /**
	     * set  button stroke color opacity
	     * @param {String} buttonFillColor
	     */
	    setButtonDrawColorOpacity : function(buttonDrawColorOpacity) {
	    	this.buttonDrawColorOpacity = buttonDrawColorOpacity;
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
	     * track roll over on button 
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    trackRollover : function(x,y) {
	        if (this.geometry.rect != undefined && this.geometry.rect.contains(x, y)) {
	            if (!this.geometry.rollover) {
	                this.geometry.rollover = true;
	                this.onButtonRolloverOn();
	            }
	        }
	        else {
	            if (this.geometry.rollover) {
	                this.geometry.rollover=false;
	                this.onButtonRolloverOff();
	            }
	        }
	       
	    },


	    /**
	     * call when button  is roll over only call repaint button
	     */
	    onButtonRolloverOn : function() {
	    	this.svg.button.setAttribute('stroke',this.buttonRolloverDrawColor);
	    	if(this.buttonRolloverFillColor !== undefined){
	    		this.svg.button.setAttribute('fill',this.buttonRolloverFillColor);
	    	}
	    	else if(this.buttonFillColor !== undefined){
	    		this.svg.button.setAttribute('fill',this.buttonFillColor);
	    	}
	    	else{
	    		this.svg.button.removeAttribute('fill');
	    	}
	    	var currentFolder = this.getWidgetFolder();
	    	var boundFolder = currentFolder.getBounds2D();
       	 	var textLabel = new JenScript.SVGElement().name('text')
				.attr('id',this.textId)
				.attr('x',boundFolder.getX()+boundFolder.getWidth())
				.attr('y',boundFolder.getY())
				.attr('font-size',this.fontSize)
				.attr('fill',this.textColor)
				.attr('fill-opacity',1)
				.attr('text-anchor','middle')
				.textContent(this.text);
       	 
       	 	this.svg.group.appendChild(textLabel.buildHTML());
	    },

	    /**
	     * call when button  is no longer roll over only call repaint button
	     */
	    onButtonRolloverOff : function() {
	    	this.svg.button.setAttribute('stroke',this.buttonDrawColor);
	    	if(this.buttonFillColor !== undefined){
	    		this.svg.button.setAttribute('fill',this.buttonFillColor);
	    	}
	    	else if(this.buttonFillColor !== undefined){
	    		this.svg.button.setAttribute('fill',this.buttonFillColor);
	    	}
	    	else{
	    		this.svg.button.removeAttribute('fill');
	    	}
	    	var tooltip = document.getElementById(this.textId);
	    	if(tooltip)
	    		this.svg.group.removeChild(tooltip);
	    },

	   

	    /**
	     * override this method to handle button  pressed
	     */
	    onButtonPress : function() {
	    },


	    /**
	     * override this method to handle button  released
	     */
	    onButtonReleased : function() {
	    },


	    /**
	     * intercept press
	     * @param {Number} x coordinate
	     * @param {Number} y coordinate
	     */
	    interceptPress : function(x,y) {
	        if (!this.getHost().isLockSelected() && this.isOrphanLock()) {
	            return;
	        }
	        if (this.geometry.rect !== undefined && this.geometry.rect.contains(x, y)) {
	            this.onButtonPress();
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
	        this.onButtonReleased();
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
	        //this.geometry.outlineShape.fillNone().strokeNone();
	        if (this.shader != undefined  && this.shader.percents != undefined && this.shader.colors != undefined) {
	            var start = {x:boundFolder.getCenterX(),y: boundFolder.getY()};
	            var end = {x:boundFolder.getCenterX(), y : boundFolder.getY() + boundFolder.getHeight()};
	            var gradientId = 'gradient'+JenScript.sequenceId++;
	            var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(start.x,start.y).to(end.x,end.y).shade(this.shader.percents,this.shader.colors).toSVG();
				
	            //g2d.definesSVG(gradient);
				//this.geometry.outlineShape.fill('url(#'+gradientId+')');
	        }
	        
//	        if (this.outlineFillColor !== undefined) {
//	        	this.geometry.outlineShape.fill(this.outlineFillColor);
//	        }
//        	if (this.outlineStrokeColor !== undefined) {
//	        	//this.geometry.outlineShape.stroke(this.outlineStrokeColor).strokeWidth(this.outlineStrokeWidth);
//        		
//	        }
        	//this.geometry.outlineShape.stroke('red').strokeWidth(1).fillNone();
        	
	        outline= this.geometry.outlineShape.toSVG();
        	//svgRoot.child(outline);
	        
			this.svg.outline=outline;
			
	        if (this.buttonVisible) {
	        	var  b =this.geometry.button;
	        	var fillColor = (this.geometry.rollover)?this.buttonRolloverFillColor : this.buttonFillColor;
	        	var strokeColor = (this.geometry.rollover)?this.buttonRolloverDrawColor : this.buttonDrawColor;
	        	
	        	if(fillColor !== undefined)
	        		b.fill(fillColor).fillOpacity(this.buttonFillColorOpacity);
	        	else
	        		b.fillNone();
	        	
	        	b.stroke(strokeColor).strokeWidth(this.buttonStrokeWidth).strokeOpacity(this.buttonDrawColorOpacity);
	        	
	        	var but = b.toSVG();
	        	this.svg.button=but;
	        	svgRoot.child(but);
	        }
	        this.textId = 'buttontext_'+this.Id;
	       
	        var rsvg = svgRoot.toSVG();
	        this.svg.group=rsvg;
	        g2d.insertSVG(rsvg);
	        
	        this.onPaintEnd();
	        
	    }
	});
	
	
	JenScript.ButtonWidget = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ButtonWidget, JenScript.AbstractButtonWidget);
	JenScript.Model.addMethods(JenScript.ButtonWidget,{
		___init: function(config){
			config = config || {};
			config.Id = 'buttonwidget'+JenScript.sequenceId++;
			
			//widget folder size
			config.width=(config.width !== undefined)?config.width:60;
			config.height=(config.height !== undefined)?config.height:24;
			
			
			config.text=(config.text !== undefined)?config.text:'Text Label';
			
			config.name=(config.name !== undefined)?config.name:'Unamed Button Widget';
			
			
			//folder index (corner right bottom)
			config.xIndex=(config.xIndex !== undefined)?config.xIndex:100;
			config.yIndex=(config.yIndex !== undefined)?config.yIndex:100;
			config.geometry = new JenScript.ButtonGeometry(config);
			
			
			config.buttonDrawColor=(config.buttonDrawColor !== undefined)?config.buttonDrawColor:'black';
			config.buttonRolloverDrawColor=(config.buttonRolloverDrawColor !== undefined)?config.buttonRolloverDrawColor:'green';
			config.buttonDrawColorOpacity=(config.buttonDrawColorOpacity !== undefined)?config.buttonDrawColorOpacity:1;
			
			config.buttonFillColor=(config.buttonFillColor !== undefined)?config.buttonFillColor:'gray';
			config.buttonRolloverFillColor=(config.buttonRolloverFillColor !== undefined)?config.buttonRolloverFillColor:'orange';
			config.buttonFillColorOpacity=(config.buttonFillColorOpacity !== undefined)?config.buttonFillColorOpacity:1;
			
			JenScript.AbstractButtonWidget.call(this,config);
			
			var percents = ['0%','20%','50%','80%','100%'];
		    var colors = [ 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0,0.6)', 'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.6)','rgba(0, 0, 0, 0.1)' ];
		    
//		    var buttonDrawColor = JenScript.RosePalette.COALBLACK;
//		    var buttonRolloverDrawColor = 'pink';
//			
//		    //this.setShader({percents:percents, colors:colors});
//		    this.setButtonFillColor('gray');
//		    this.setButtonRolloverFillColor('green');
//		    this.setButtonDrawColor(buttonDrawColor);
//		    this.setButtonRolloverDrawColor(buttonRolloverDrawColor);
		    this.setOrphanLock(false);
		    
		    this.onPress = config.onPress;
		},
	    onButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	       if(this.onPress)
	    	   this.onPress();
	    },
	    
	    
	    onRegister : function(){
	    	//console.log('button register on host '+this.getHost().name);
	    	if(this.getHost().getProjection() !== undefined){
	    		this.create();
	    		//console.log('repaint heere');
	    	}else{
	    		this.getHost().addPluginListener('projectionRegister',function (plugin){
		    		//console.log('on projectionRegister event');
					if(plugin.getProjection().getView() !== undefined){
						//console.log('111--');
						this.create();
						//console.log('on register repaint1 ok');
					}else{
					
						//wait view registering
						plugin.getProjection().addProjectionListener('viewRegister',function(proj){
							//console.log('222--');
							this.create();
							//console.log('on register repaint2 ok');
						},'Wait for projection view registering for reason : simple button plugin');
					}
				},'Plugin listener for projection register for reason : simple button plugin');
	    	}
	    	
	    }
	});

	
})();