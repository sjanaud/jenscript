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
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieAbstractLabel,JenScript.AbstractLabel);
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
		_init : function(config){
			JenScript.AbstractLabel.call(this,config);
		},
		
		/**
		 * Abstract label paint for Pie
		 */
		paintPieSliceLabel : function(g2d,slice){
			throw new Error('paintPieSliceLabel method should be provide by override');
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
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.PieBorderLabel, JenScript.PieAbstractLabel);
	JenScript.Model.addMethods(JenScript.PieBorderLabel, {
		
		/**
		 * Initialize Pie Border Label, a label which is paint on the pie border left or right side 
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
		__init : function(config){
			config = config || {};
			this.margin = (config.margin !== undefined)? config.margin : 50;
			this.linkExtends = (config.linkExtends !== undefined)? config.linkExtends : 30;
			config.name = 'JenScript.PieBorderLabel';
			JenScript.PieAbstractLabel.call(this, config);
		},
		
		/**
		 * set margin for this border label
		 * @param {Object} margin
		 */
		setMargin : function(margin){
			this.margin = margin;
			this.slice.pie.plugin.repaintPlugin();
		},
		
		/**
		 * set links extends for this border label
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
		        var radius = slice.pie.radius;
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

		        
		        this.setTextAnchor(pos);
		        this.setLocation(new JenScript.Point2D(px4,py4));
		        var ct = (this.textColor !== undefined)? this.textColor : slice.themeColor;
				this.setTextColor(ct);
				this.setOpacity(slice.opacity);
				this.paintLabel(g2d);
				this.svg.label.appendChild(quadlink);
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
		this.__init(config);
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
		__init : function(config){
			config = config || {};
			this.offsetRadius = (config.offsetRadius !== undefined)?config.offsetRadius : 20;
			config.name = 'JenScript.PieRadialLabel';
			JenScript.PieAbstractLabel.call(this,config);
		},

		/**
		 * set offset radius for this radial label.
		 * offset radius is the extends distance from radius to draw the radial label
		 * @param {Number} offsetRadius
		 */
		setOffsetRadius : function(offsetRadius) {
			this.offsetRadius = offsetRadius;
			this.slice.pie.plugin.repaintPlugin();
		},
		
		/**
		 * paint slice radial label
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
			this.setOpacity(slice.opacity);
			this.paintLabel(g2d);
		}
	});
})();