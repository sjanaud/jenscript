(function(){
	/**
	 * Object PieAbstractLabel()
	 * Defines Pie Abstract Label
	 * @param {Object} config
	 * @param {String} [config.name] the label type name
	 * @param {String} [config.text] the label text
	 * @param {String} [config.textColor] the label text color
	 * @param {Number} [config.fontSize] the label text font size
	 * @param {String} [config.textAnchor] the label text anchor
	 * @param {Object} [config.shader] the label fill shader
	 * @param {Object} [config.shader.percents] the label fill shader percents
	 * @param {Object} [config.shader.colors] the label fill shader colors
	 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the label outline color
	 * @param {String} [config.cornerRadius] the label outline corner radius
	 * @param {String} [config.fillColor] the label fill color
	 */
	JenScript.PieAbstractLabel = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.PieAbstractLabel,{
		
		/**
		 * Initialize Abstract Pie Label
		 * @param {Object} config
		 * @param {String} [config.name] the label type name
		 * @param {String} [config.text] the label text
		 * @param {String} [config.textColor] the label text color
		 * @param {Number} [config.fontSize] the label text font size
		 * @param {String} [config.textAnchor] the label text anchor
		 * @param {Object} [config.shader] the label fill shader
		 * @param {Object} [config.shader.percents] the label fill shader percents
		 * @param {Object} [config.shader.colors] the label fill shader colors
		 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the label outline color
		 * @param {String} [config.cornerRadius] the label outline corner radius
		 * @param {String} [config.fillColor] the label fill color
		 */
		init : function(config){
			config = config || {};
			this.name = config.name;
			this.location = config.location;
			this.text = (config.text !== undefined)? config.text:'Label';
			this.textColor = config.textColor;
			this.fontSize = (config.fontSize !== undefined)? config.fontSize : 12;
			this.textAnchor = (config.textAnchor !== undefined)? config.textAnchor : 'start';
			this.shader = (config.shader !== undefined)? config.shader : {percents :['0%','50%','100%'] , colors :['rgba(0,0,0,0.5)','rgba(0,0,0,0.8)','rgba(0,0,0,0.9)']};
			this.paintType = (config.paintType !== undefined)? config.paintType : 'Both';//Stroke //Fill //None
			this.cornerRadius = (config.cornerRadius !== undefined)? config.cornerRadius : 10;
			this.outlineColor = config.outlineColor;
			this.fillColor = config.fillColor;
		},
		
		setText : function(text) {
			this.text = text;
		},

		getText : function() {
			return this.text;
		},
		
		setLocation : function(location) {
			this.location = location;
		},

		getLocation : function() {
			return this.location;
		},

		setTextColor : function(textColor) {
			this.textColor = textColor;
		},

		getTextColor : function() {
			return this.textColor;
		},
		
		setFontSize : function(fontSize) {
			this.fontSize = fontSize;
		},

		getFontSize : function() {
			return this.fontSize;
		},
		
		setTextAnchor : function(textAnchor) {
			this.textAnchor = textAnchor;
		},

		getTextAnchor : function() {
			return this.textAnchor;
		},
		
		setShader : function(shader){
			this.shader = shader;
		},
		
		getShader : function(){
			return this.shader;
		},
		
		setOutlineColor : function(outlineColor){
			this.outlineColor = outlineColor;
		},
		
		getOutlineColor : function(){
			return this.outlineColor;
		},
		
		
		/**
		 * paint text and envelope if all parameter are setted.
		 * @param {Object} graphics context
		 * @param {Object} slice
		 */
		paintLabel : function(g2d){
			var sl = new JenScript.SVGElement().name('text')
												.attr('x',this.getLocation().getX())
												.attr('y',this.getLocation().getY())
												.attr('font-size',this.getFontSize())
												.attr('fill',this.getTextColor())
												.attr('text-anchor',this.getTextAnchor())
												.textContent(this.getText())
												.buildHTML();

			g2d.insertSVG(sl);
			if(this.paintType !== 'None'){
				var svgRect = sl.getBBox();
						
				var tr = new JenScript.SVGRect().origin((svgRect.x-10),(svgRect.y-2))
								.size((svgRect.width+20),(svgRect.height+4))
								.radius(this.cornerRadius,this.cornerRadius)
								.strokeNone()
								.fillNone();
						
					if(this.paintType === 'Stroke' || this.paintType === 'Both' ){
							tr.stroke(this.getOutlineColor());
					}
					if(this.paintType === 'Fill' || this.paintType === 'Both'){
							if(this.fillColor !== undefined){
								tr.fill(this.fillColor);
							}else{
								var gradientId = "gradient"+JenScript.sequenceId++;
								var gradient= new JenScript.SVGLinearGradient().Id(gradientId).from(svgRect.x,(svgRect.y-2)).to(svgRect.x, (svgRect.y+4+svgRect.height)).shade(this.getShader().percents,this.getShader().colors).toSVG();
								g2d.definesSVG(gradient);
								tr.fillURL(gradientId);
							}
						
					}
					sl.parentNode.insertBefore(tr.toSVG(),sl);
				}			
		},

		/**
		 * paint pie slice label
		 * @param {Object} g2d the graphics context
		 * @param {Object} slice
		 */
		paintPieSliceLabel : function(g2d, slice) {
			throw new Error("Abstract Pie Slice Label, this method should be provide by override.");
		}
	});

	
	/**
	 * Object PieBorderLabel()
	 * Defines Pie Border Label, a label which is paint on the pie border left or right side 
	 * @param {Object} config
	 * @param {String} [config.name] the label type name
	 * @param {String} [config.text] the label text
	 * @param {String} [config.textColor] the label text color
	 * @param {Number} [config.fontSize] the label text font size
	 * @param {String} [config.textAnchor] the label text anchor
	 * @param {Object} [config.shader] the label fill shader
	 * @param {Object} [config.shader.percents] the label fill shader percents
	 * @param {Object} [config.shader.colors] the label fill shader colors
	 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the label outline color
	 * @param {String} [config.cornerRadius] the label outline corner radius
	 * @param {String} [config.fillColor] the label fill color
	 * @param {Number} [config.margin] the margin distance from pie to draw the label
	 * @param {Number} [config.linkExtends] the quad edge control point for label link
	 */
	JenScript.PieBorderLabel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieBorderLabel, JenScript.PieAbstractLabel);
	JenScript.Model.addMethods(JenScript.PieBorderLabel, {
		
		/**
		 * Initalize Pie Border Label, a label which is paint on the pie border left or right side 
		 * @param {Object} config
		 * @param {String} [config.name] the label type name
		 * @param {String} [config.text] the label text
		 * @param {String} [config.textColor] the label text color
		 * @param {Number} [config.fontSize] the label text font size
		 * @param {String} [config.textAnchor] the label text anchor
		 * @param {Object} [config.shader] the label fill shader
		 * @param {Object} [config.shader.percents] the label fill shader percents
		 * @param {Object} [config.shader.colors] the label fill shader colors
		 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the label outline color
		 * @param {String} [config.cornerRadius] the label outline corner radius
		 * @param {String} [config.fillColor] the label fill color
		 * @param {Number} [config.margin] the margin distance from pie to draw the label
		 * @param {Number} [config.linkExtends] the quad edge control point for label link
		 */
		_init : function(config){
			config = config || {};
			this.margin = (config.margin !== undefined)? config.margin : 50;
			this.linkExtends = (config.linkExtends !== undefined)? config.linkExtends : 30;
			JenScript.PieAbstractLabel.call(this, config);
		},
		
		/**
		 * set margin for this pie border label
		 * @param {Object} margin
		 */
		setMargin : function(margin){
			this.margin = margin;
			this.slice.pie.plugin.repaintPlugin();
		},
		
		/**
		 * set links extends for this pie border label
		 * @param {Object} margin
		 */
		setLinkExtends : function(linkExtends){
			this.linkExtends = linkExtends;
			this.slice.pie.plugin.repaintPlugin();
		},
		
		/**
		 * paint pie slice border label
		 * @param {Object} g2d the graphics context
		 * @param {Object} slice
		 */
		paintPieSliceLabel : function(g2d, slice) {
		        var radius = slice.pie.getRadius();
		        var medianDegree = slice.medianDegree;

		        var px1 = slice.pie.buildCenterX + (radius + slice.getDivergence())* Math.cos(JenScript.Math.toRadians(medianDegree));
		        var py1 = slice.pie.buildCenterY - (radius + slice.getDivergence()) * Math.sin(JenScript.Math.toRadians(medianDegree));
		        var px2 = slice.pie.buildCenterX + (radius + this.linkExtends + slice.getDivergence())* Math.cos(JenScript.Math.toRadians(medianDegree));
		        var py2 = slice.pie.buildCenterY- (radius + this.linkExtends + slice.getDivergence()) * Math.sin(JenScript.Math.toRadians(medianDegree));

		        var px3 = 0;
		        var py3 = py2;
		        var px4 = 0;
		        var py4 = py2;
		        var pos = 'middle';
		        if (medianDegree >= 270 && medianDegree <= 360
		                || medianDegree >= 0 && medianDegree <= 90) {
		            px3 = slice.pie.buildCenterX + radius + this.margin  - 5;
		            px4 = slice.pie.buildCenterX + radius + this.margin  + 5;
		            
		            pos='start';
		            if(medianDegree === 270)
		            	pos = 'middle';
		            if(medianDegree === 90)
		            	pos = 'middle';
		        }
		        else {// 90-->270
		            px3 = slice.pie.buildCenterX- radius - this.margin + 5;
		            px4 = slice.pie.buildCenterX- radius - this.margin -5;
		            pos='end';
		        }
		        
		        
		        var quaddata = 'M '+px1+','+py1+' Q '+px2+','+py2+' '+px3+','+py3;
		        var quadlink = new JenScript.SVGElement().name('path')
													.attr('d',quaddata)
													.attr('fill','none')
													.attr('stroke','darkgray')
													.buildHTML();

		        slice.pie.svg.pieRoot.appendChild(quadlink);
		        
		        this.setTextAnchor(pos);
		        this.setLocation(new JenScript.Point2D(px4,py4));
		        var ct = (this.textColor !== undefined)? this.textColor : slice.themeColor;
				this.setTextColor(ct);
				var co = (this.outlineColor !== undefined)? this.outlineColor : slice.themeColor;
				this.setOutlineColor(co);
				this.paintLabel(g2d);
		 }
	});
	
	
	/**
	 * Object PieRadialLabel()
	 * Defines Pie Radial Label, a label which is paint on the median radian segment of slice
	 * @param {Object} config
	 * @param {String} [config.name] the label type name
	 * @param {String} [config.text] the label text
	 * @param {String} [config.textColor] the label text color
	 * @param {Number} [config.fontSize] the label text font size
	 * @param {String} [config.textAnchor] the label text anchor
	 * @param {Object} [config.shader] the label fill shader
	 * @param {Object} [config.shader.percents] the label fill shader percents
	 * @param {Object} [config.shader.colors] the label fill shader colors
	 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the label outline color
	 * @param {String} [config.cornerRadius] the label outline corner radius
	 * @param {String} [config.fillColor] the label fill color
	 * @param {Number} [config.offsetRadius] the offset radius define the extends radius from pie radius
	 */
	JenScript.PieRadialLabel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieRadialLabel, JenScript.PieAbstractLabel);
	JenScript.Model.addMethods(JenScript.PieRadialLabel,{
		
		/**
		 * Initialize Pie Radial Label, a label which is paint on the median radian segment of slice
		 * @param {Object} config
		 * @param {String} [config.name] the label type name
		 * @param {String} [config.text] the label text
		 * @param {String} [config.textColor] the label text color
		 * @param {Number} [config.fontSize] the label text font size
		 * @param {String} [config.textAnchor] the label text anchor
		 * @param {Object} [config.shader] the label fill shader
		 * @param {Object} [config.shader.percents] the label fill shader percents
		 * @param {Object} [config.shader.colors] the label fill shader colors
		 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the label outline color
		 * @param {String} [config.cornerRadius] the label outline corner radius
		 * @param {String} [config.fillColor] the label fill color
		 * @param {Number} [config.offsetRadius] the offset radius define the extends radius from pie radius
		 */
		_init : function(config){
			config = config || {};
			this.offsetRadius = (config.offsetRadius !== undefined)?config.offsetRadius : 20;
			config.name = "PieRadialLabel";
			JenScript.PieAbstractLabel.call(this,config);
		},

		/**
		 * set offset radius for this radial label.
		 * offset radius is the extention distance from radius to draw the radial label
		 * @param {Number} offsetRadius
		 */
		setOffsetRadius : function(offsetRadius) {
			this.offsetRadius = offsetRadius;
			this.slice.pie.plugin.repaintPlugin();
		},
		
		/**
		 * paint pie slice radial label
		 * @param {Object} g2d the graphics context
		 * @param {Object} slice
		 */
		paintPieSliceLabel : function(g2d, slice) {
			var anchor = {
				x : slice.sc.x + (slice.pie.radius + this.offsetRadius)
						* Math.cos(JenScript.Math.toRadians(slice.medianDegree)),
				y : slice.sc.y - (slice.pie.radius + this.offsetRadius)
						* Math.sin(JenScript.Math.toRadians(slice.medianDegree))
			};
			
			
			
			var pos = "middle";
			var dx = 0;
			if (slice.medianDegree > 0 && slice.medianDegree < 90) {
				pos = "start";
				dx = 10;
			} else if (slice.medianDegree > 90 && slice.medianDegree < 270) {
				pos = "end";
				dx = -10;
			} else if (slice.medianDegree > 270 && slice.medianDegree <= 360) {
				pos = "start";
				dx = 10;
			} else if (slice.medianDegree === 90 || slice.medianDegree === 270) {
				pos = "middle";
			}
			
			this.setLocation(new JenScript.Point2D(anchor.x,anchor.y));
			this.setTextAnchor(pos);
			var ct = (this.textColor !== undefined)? this.textColor : slice.themeColor;
			this.setTextColor(ct);
			var co = (this.outlineColor !== undefined)? this.outlineColor : slice.themeColor;
			this.setOutlineColor(co);
			this.paintLabel(g2d);
		}
	});
})();