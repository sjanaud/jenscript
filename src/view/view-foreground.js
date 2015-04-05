(function(){
	
	
	/**
	 * Object ViewForeground()
	 * @constructor
	 * @param {Object} config
	 */
	JenScript.ViewForeground = function(){
		this.init();
	};
	JenScript.Model.addMethods(JenScript.ViewForeground, {
		/**
		 * Initialize abstract view foreground
		 * @param {Object} config
		 */
		init : function(config){
			config = config||{};
			this.Id='foreground'+JenScript.sequenceId++;
			this.clipId = 'foregroundclip'+JenScript.sequenceId++;
			this.clipable = false;
		},
		
		/**
		 * get this foreground Id
		 * @returns {String} this foreground Id
		 */
		getId : function(){
			return this.Id;
		},
		
		/**
		 * get graphics context of this foreground
		 * @returns {Object} this foreground graphics context
		 */
		getGraphics : function(){
			return this.g2d;
		},
		
		/**
		 * get the clip Id of this foreground
		 * @returns {String} this foreground clip Id
		 */
		getClipId : function(){
			return this.clipId;
		},
		
		/**
		 * return true if the clip should be apply on this foreground, false otherwise
		 * @returns {}
		 */
		isClipable : function(){
			return this.clipable;
		},
		
		/***
		 * clip the given shape with this foreground clip path
		 * @param {Object} shape
		 */
		clip : function(shape){
			if(this.isClipable()){
				shape.clip(this.getClipId());
			}
		},
		
		/**
		 * get clip for this foreground
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
		 * takes teh responsibility to paint the foreground.
		 * prepares and defines the clip path
		 * call paintViewForeground
		 */
		paint : function(){
			this.getGraphics().clearGraphics();
			var clip = this.getClip();
			if(clip !== undefined){
				this.getGraphics().definesSVG(clip.toSVG());
				this.clipable = true;
			}
			this.paintViewForeground(this.view,this.getGraphics());
		},
		
		/**
		 * paint view foreground, provide method by override.
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewForeground : function(view,g2d){throw new Error('Abstract View Foreground, method should be overriden.');}
	});
	
	
	
	
	
	/**
	 * Object JenScript.TextViewForeground()
	 * Defines Text Foreground
	 * @param {Object} config
	 * @param {String} [config.text] text to draw in foreground
	 * @param {String} [config.textColor] text color
	 * @param {String} [config.textAnchor] text anchor : start, end or middle
	 * @param {Number} [config.x] text x location
	 * @param {Number} [config.y] text y location
	 * @param {Number} [config.fontSize] text font size
	 * @param {Number} [config.opacity] text opacity
	 */
	JenScript.TextViewForeground = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TextViewForeground,JenScript.ViewForeground);
	JenScript.Model.addMethods(JenScript.TextViewForeground, {
		/**
		 * Initalize Text Foreground
		 * @param {Object} config
		 * @param {String} [config.text] text to draw in foreground
		 * @param {String} [config.textColor] text color
		 * @param {String} [config.textAnchor] text anchor : start, end or middle
		 * @param {Number} [config.x] text x location
		 * @param {Number} [config.y] text y location
		 * @param {Number} [config.fontSize] text font size
		 * @param {Number} [config.opacity] text opacity
		 */
		_init : function(config){
			this.text = config.text;
			this.x = config.x;
			this.y = config.y;
			this.textColor = (config.textColor !== undefined)?config.textColor : JenScript.createColor();
			this.textAnchor = (config.textAnchor !== undefined)?config.textAnchor : 'start';
			this.opacity = (config.opacity !== undefined)?config.opacity : 1;
			this.fontSize = (config.fontSize !== undefined)?config.fontSize : 9;
			
			if(this.x === undefined ) throw new Error('TextViewForeground, x undefined, it should be supplied');
			if(this.y === undefined ) throw new Error('TextViewForeground, y undefined, it should be supplied');
			JenScript.ViewForeground.call(this,config);
		},
		
		setText :function(text){
			this.text=text;
			this.getGraphics().deleteGraphicsElement('text_'+this.Id);
			this.paintViewForeground(this.view,this.getGraphics());
		},
		
		/**
		 * paint text view foreground
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewForeground : function(view,g2d){
			//console.log("paint text :"+'text_'+this.text);
			var text = new JenScript.SVGElement().name('text')
				.attr('id','text_'+this.Id)
				.attr('x',this.x)
				.attr('y',this.y)
				.attr('font-size',this.fontSize)
				.attr('fill',this.textColor)
				.attr('fill-opacity',this.opacity)
				.attr('text-anchor',this.textAnchor)
				//.attr('transform','?')
				.textContent(this.text);
			this.svg = text.buildHTML();
			g2d.insertSVG(this.svg);
		}
	});
	
	/**
	 * Object GlossViewForeground()
	 * Defines Gloss Foreground
	 * @param {Object} config
	 * @param {Number} [config.heightRatio] view height ratio, 0.25 default value
	 * @param {Number} [config.heightQuadDeviation] height quad deviation in pixel, 50 pixel default value
	 */
	JenScript.GlossViewForeground = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GlossViewForeground,JenScript.ViewForeground);
	JenScript.Model.addMethods(JenScript.GlossViewForeground, {
		
		/**
		 * Initialize Gloss Foreground
		 * @param {Object} config
		 * @param {Number} [config.heightRatio] view height ratio, 0.25 default value
		 * @param {Number} [config.heightQuadDeviation] height quad deviation in pixel, 50 pixel default value
		 */
		_init : function(config){
			config = config || {};
			this.gradientId = 'gradient'+JenScript.sequenceId++;
			this.clipId = 'clip'+JenScript.sequenceId++;
			this.foregroundId = 'foreground'+JenScript.sequenceId++;
			this.heightRatio = (config.heightRatio)?config.heightRatio: 1/4;
			this.heightQuadDeviation =  (config.heightQuadDeviation)?config.heightQuadDeviation: 50;
			JenScript.ViewForeground.call(this,config);
		},
		
		/**
		 * paint view gloss foreground
		 * @param {Object} view
		 * @param {Object} graphics context
		 */
		paintViewForeground : function(view,g2d){
			var glossFace = new JenScript.SVGPath().moveTo(0,0).lineTo(0,this.heightRatio*view.height).quadTo(view.width/2,this.heightRatio*view.height+this.heightQuadDeviation,view.width,this.heightRatio*view.height).lineTo(view.width,0).close();
			this.clip(glossFace);
			var percents = ['20%','100%'];
			var colors = ['rgb(255,255,255)','rgb(255,255,255)'];
			var gradient= new JenScript.SVGLinearGradient().Id(this.gradientId).from(0,0).to(0, this.heightRatio*view.getHeight()).shade(percents,colors,[0,0.2]);
			g2d.definesSVG(gradient.toSVG());
			
			g2d.insertSVG(glossFace.strokeNone().fill('url(#'+this.gradientId+')').toSVG());	
		}
	});
	
})();