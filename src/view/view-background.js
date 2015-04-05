(function(){
	/**
	 * Object JenScript.ViewBackground()
	 * @constructor
	 * @memberof JenScript
	 * @param {Object} config
	 */
	JenScript.ViewBackground = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.ViewBackground, {
		
		/**
		 * Initialize view background
		 * @param {Object} config
		 */
		init : function(config){
			config = config||{};
			this.Id='background'+JenScript.sequenceId++;
			this.clipId = 'backgroundclip'+JenScript.sequenceId++;
			this.clipable = false;
			
		},
		
		/**
		 * get this background Id
		 * @returns {String} this background Id
		 */
		getId : function(){
			return this.Id;
		},
		
		/**
		 * get the clip Id of this background
		 * @returns {String} this background clip Id
		 */
		getClipId : function(){
			return this.clipId;
		},
		
		/**
		 * get graphics context of this background
		 * @returns {Object} this background graphics context
		 */
		getGraphics : function(){
			return this.g2d;
		},
		
		/**
		 * return true if the clip should be apply on this background, false otherwise
		 * @returns {Boolean} true if the clip should be apply on this background, false otherwise
		 */
		isClipable : function(){
			return this.clipable;
		},
		
		/***
		 * clip the given shape with this background clip path
		 * @param {Object} shape
		 */
		clip : function(shape){
			if(this.isClipable()){
				shape.clip(this.getClipId());
			}
		},
		
		/**
		 * get clip for this background
		 * @returns {Object} svg clip path
		 */
		getClip : function(){
			var clips = this.view.getBackgroundClip(this);
			var clip = undefined;
			if(clips.length > 0){
				clip = new JenScript.SVGClipPath().Id(this.clipId);
				for (var i = 0; i < clips.length; i++) {
					clip.appendPath(clips[i]);
				}
			}
			return clip;
		},
		
		/**
		 * takes teh responsibility to paint the background.
		 * prepares and defines the clip path
		 * call paintViewBackground
		 */
		paint : function(){
			this.getGraphics().clearGraphics();
			var clip = this.getClip();
			if(clip !== undefined){
				this.getGraphics().definesSVG(clip.toSVG());
				this.clipable = true;
			}
			this.paintViewBackground(this.view,this.getGraphics());
		},
		
		/**
		 * Override this method
		 * get this background clip path
		 */
		getBackgroundPath  : function(){throw new Error('Abstract View Background, getBackgroundPath method should be provide by override.');},
		
		/**
		 * Override this method to provide paint this background
		 * @param {Object} view host view
		 * @param {Object} g2d  graphics context
		 * 
		 */
		paintViewBackground : function(view,g2d){throw new Error('Abstract View Background, paintViewBackground method should be provide by override.');}
	});
	
	
	
	/**
	 * Object JenScript.RectViewBackground()
	 * Defines rectangular view background
	 * @constructor
	 * @extends ViewBackground
	 * @param {Object} config
	 * @param {Number} [config.opacity] opacity, default 1
	 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
	 */
	JenScript.RectViewBackground = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.RectViewBackground,JenScript.ViewBackground);
	JenScript.Model.addMethods(JenScript.RectViewBackground, {
		/**
		 * Initialize rectangular view background
		 * @param {Object} config
		 * @param {Number} [config.opacity] opacity, default 1
		 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
		 */
		_init : function(config){
			config = config || {};
			this.opacity = (config.opacity !== undefined)? config.opacity :1;
			this.cornerRadius = (config.cornerRadius !== undefined)? config.cornerRadius :10;
			JenScript.ViewBackground.call(this,config);
		},
		
		/**
		 * get this rectangular background path
		 * @returns background path
		 */
		getBackgroundPath  : function(){
			return  new JenScript.SVGRect().origin(0,0)
			 								.size(this.view.width,this.view.height)
			 								.radius(this.cornerRadius,this.cornerRadius);
		},
	});
	
	/**
	 * Object JenScript.GradientViewBackground()
	 * Defines outline view background
	 * @constructor
	 * @extends JenScript.RectViewBackground
	 * @param {Object} config
	 * @param {String} [config.strokeColor] stroke color, default black 
     * @param {Number} [config.strokeWidth] stroke width, default 1
	 * @param {Number} [config.opacity] opacity, default 1
	 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
	 */
	JenScript.ViewOutlineBackground = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ViewOutlineBackground,JenScript.RectViewBackground);
	JenScript.Model.addMethods(JenScript.ViewOutlineBackground, {
		/**
		 * Initialize outline view background
		 * @param {Object} config
		 * @param {String} [config.strokeColor] stroke color, default black 
		 * @param {Number} [config.strokeWidth] stroke width, default 1
		 * @param {Number} [config.opacity] opacity, default 1
		 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
		 */
		__init : function(config){
			config = config || {};
			this.strokeColor = (config.strokeColor !== undefined)? config.strokeColor : 'black';
			this.strokeWidth = (config.strokeWidth !== undefined)? config.strokeWidth :1;
			JenScript.RectViewBackground.call(this,config);
		},
		
		/**
		 * paint outline view background
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewBackground : function(view,g2d){
			var cornerRadius = this.cornerRadius;
			var cr = this.cornerRadius;
			var sw = this.strokeWidth;
			var outer = new JenScript.SVGPath().Id(this.Id);
			outer.moveTo(0,cr).arcTo(cr,cr,0,0,1,cr,0).lineTo((view.width-cornerRadius),0).arcTo(cr,cr,0,0,1,view.width,cr).lineTo(view.width,view.height-cr).arcTo(cr,cr,0,0,1,view.width-cr,view.height).lineTo(cr,view.height).arcTo(cr,cr,0,0,1,0,view.height-cr).lineTo(0,cr);
			//outer.moveTo(sw,cr).arcTo(cr-sw,cr-sw,0,0,1,cr,sw).lineTo((view.width-cornerRadius),sw).arcTo(cr,cr,0,0,1,view.width-sw,cr).lineTo(view.width-sw,view.height-cr).arcTo(cr-sw,cr-sw,0,0,1,view.width-cr,view.height-sw).lineTo(cr,view.height-sw).arcTo(cr-sw,cr-sw,0,0,1,sw,view.height-cr).lineTo(sw,cr);
			outer.moveTo(sw,cr+sw).arcTo(cr,cr,0,0,1,cr+sw,sw).lineTo((view.width-cr-sw),sw).arcTo(cr,cr,0,0,1,view.width-sw,cr+sw).lineTo(view.width-sw,view.height-cr-sw).arcTo(cr,cr,0,0,1,view.width-cr-sw,view.height-sw).lineTo(cr+sw,view.height-sw).arcTo(cr,cr,0,0,1,sw,view.height-cr-sw).lineTo(sw,cr+sw);
			outer.attr('fill-rule','evenodd').opacity(this.opacity);
			this.clip(outer);
			outer.fill(this.strokeColor).strokeNone().opacity(this.opacity);
			g2d.insertSVG(outer.toSVG());
		}
	});
	
	/**
	 * Object JenScript.GradientViewBackground()
	 * Defines gradient view fill background
	 * @constructor
	 * @extends JenScript.RectViewBackground
	 * @param {Object} config
	 * @param {Object} shader
	 * @param {Array}  [config.shader.percents] string percents array
	 * @param {Array}  [config.shader.colors] string color array
	 * @param {Number} [config.opacity] opacity, default 1
	 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
	 */
	JenScript.GradientViewBackground = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GradientViewBackground,JenScript.RectViewBackground);
	JenScript.Model.addMethods(JenScript.GradientViewBackground, {
		/**
		 * Initialize gradient view fill background
		 * @param {Object} config
		 * @param {Object} shader
		 * @param {Array}  [config.shader.percents] string percents array
		 * @param {Array}  [config.shader.colors] string color array
		 * @param {Number} [config.opacity] opacity, default 1
		 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
		 */
		__init : function(config){
			config = config || {};
			this.gradientId = 'gradient'+JenScript.sequenceId++;
			this.shader = (config.shader !== undefined)?config.shader: {percents :['0%','100%'],colors:['rgb(32, 39, 55)','black']};
			JenScript.RectViewBackground.call(this,config);
		},
		
		/**
		 * paint gradient view background
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewBackground : function(view,g2d){
				var gradient= new JenScript.SVGLinearGradient().Id(this.gradientId).from(0,0).to(0, view.getHeight()).shade(this.shader.percents,this.shader.colors);
				g2d.definesSVG(gradient.toSVG());
				var background = new JenScript.SVGRect().Id(this.Id)
														 .origin(0,0)
														 .size(view.width,view.height)
														 .radius(this.cornerRadius,this.cornerRadius);
				background.fillURL(this.gradientId).strokeNone().opacity(this.opacity);
				this.clip(background);
				g2d.insertSVG(background.toSVG());
		}
	});
	
	/**
	 * Object JenScript.TexturedViewBackground()
	 * Defines view textured fill background
	 * @constructor
	 * @extends JenScript.RectViewBackground
	 * @param {Object} config
	 * @param {Object} [config.texture] texture
	 * @param {Number} [config.opacity] opacity, default 1
	 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
	 */
	JenScript.TexturedViewBackground = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TexturedViewBackground,JenScript.RectViewBackground);
	JenScript.Model.addMethods(JenScript.TexturedViewBackground, {
		/**
		 * Initialized texture view fill background
		 * @param {Object} config
		 * @param {Object} [config.texture] texture
		 * @param {Number} [config.opacity] opacity, default 1
		 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
		 */
		__init : function(config){
			this.texture = (config.texture !== undefined)? config.texture : JenScript.Texture.getTriangleCarbonFiber();
			JenScript.RectViewBackground.call(this,config);
		},
		
		/**
		 * paint texture view background
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewBackground : function(view,g2d){
	 		view.definesTexture(this.texture);
	 		var background = new JenScript.SVGRect().Id(this.Id)
													 .origin(0,0)
													 .size(view.width,view.height)
													 .radius(this.cornerRadius,this.cornerRadius);
			background.fillURL(this.texture.getId()).strokeNone().opacity(this.opacity);
			this.clip(background);
			g2d.insertSVG(background.toSVG());
		}
	});
	
	/**
	 * Object JenScript.DualViewBackground()
	 * Define a dual color or texture view background for outer (west, east, south, north) and inner part(device)
	 * @constructor
	 * @extends JenScript.RectViewBackground
	 * @param {Object} config
	 * @param {Object} [config.texture1] texture for outer (west, east, south, north)
	 * @param {Object} [config.texture2] texture for inner device
	 * @param {Object} [config.color1] color for outer (west, east, south, north) if texture1 is not provide, black default value
	 * @param {Object} [config.color2] color for inner device, rgb(32, 39, 55) default value 
	 * @param {Number} [config.opacity] opacity, default 1
	 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
	 */
	JenScript.DualViewBackground = function(config){
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.DualViewBackground,JenScript.RectViewBackground);
	JenScript.Model.addMethods(JenScript.DualViewBackground, {
		/**
		 * Define a dual color or texture view background for outer (west, east, south, north) and inner part(device)
		 * @param {Object} config
		 * @param {Object} [config.texture1] texture for outer (west, east, south, north)
		 * @param {Object} [config.texture2] texture for inner device
		 * @param {Object} [config.color1] color for outer (west, east, south, north) if texture1 is not provide, black default value
		 * @param {Object} [config.color2] color for inner device, rgb(32, 39, 55) default value
		 * @param {Number} [config.opacity] opacity, default 1
		 * @param {Number} [config.cornerRadius] corner radius, default 10 pixels
		 */
		__init : function(config){
			this.texture1 = config.texture1;
			this.texture2 = config.texture2;
			this.color1 = (config.color1 !== undefined)? config.color1 : 'black';
			this.color2 = (config.color2 !== undefined)? config.color2 : 'rgb(32, 39, 55)';
			JenScript.RectViewBackground.call(this,config);
		},
		
		/**
		 * paint dual view background
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewBackground : function(view,g2d){
	 		if(this.texture1 !== undefined) view.definesTexture(this.texture1);
	 		if(this.texture2 !== undefined) view.definesTexture(this.texture2);
			var cornerRadius = this.cornerRadius;
			var outer = new JenScript.SVGPath().Id(this.Id);
			outer.moveTo(0,cornerRadius).quadTo(0,0,cornerRadius,0).lineTo((view.width-cornerRadius),0).quadTo(view.width,0,view.width,cornerRadius)
							.lineTo(view.width,(view.height-cornerRadius)).quadTo(view.width,view.height,(view.width-cornerRadius),view.height).
							lineTo(cornerRadius,view.height).quadTo(0,view.height,0,(view.height-cornerRadius)).lineTo(0,cornerRadius)
							.moveTo(view.west,view.north).lineTo(view.width-view.east,view.north)
							.lineTo(view.width-view.east,view.height-view.south).lineTo(view.west,view.height-view.south).lineTo(view.west,view.north);
			
			outer.attr('fill-rule','evenodd').opacity(this.opacity);
			if(this.texture1 !== undefined)
				outer.fillURL(this.texture1.getId());
			else
				outer.fill(this.color1);
			
			this.clip(outer);
			g2d.insertSVG(outer.toSVG());
			
			var inner = new JenScript.SVGRect().Id(this.Id).origin(view.west,view.north)
						 .size(view.devicePart.width,view.devicePart.height)
						 .opacity(this.opacity)
						 .strokeNone().fillNone();
			if(this.texture2 !== undefined)
				inner.fillURL(this.texture2.getId());
			else
				inner.fill(this.color2);
			
			this.clip(inner);
			g2d.insertSVG(inner.toSVG());
		}
	});	
})();