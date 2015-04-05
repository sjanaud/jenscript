(function(){
	
	
	/**
	 * Object Donut2DAbstractLabel()
	 * Defines Donut2D Abstract Label
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
	JenScript.Donut2DAbstractLabel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DAbstractLabel,JenScript.AbstractLabel);
	JenScript.Model.addMethods(JenScript.Donut2DAbstractLabel,{
		
		/**
		 * Initialize Abstract Donut2D Label
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
		 * Abtract paint for donut 2D 
		 */
		paintDonut2DSliceLabel : function(g2d,slice){
			throw new Error('paintDonut2DSliceLabel method should be provide by override');
		}
		
	});
	
	/**
	 * Object Donut2DBorderLabel()
	 * Defines Donut Border Label, a label which is paint on the pie border left or right side 
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
	JenScript.Donut2DBorderLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DBorderLabel, JenScript.Donut2DAbstractLabel);
	JenScript.Model.addMethods(JenScript.Donut2DBorderLabel, {
		
		/**
		 * Initalize Donut2D Border Label, a label which is paint on the pie border left or right side 
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
		 * @param {Number} [config.margin] the margin distance from donut to draw the label
		 * @param {Number} [config.linkExtends] the quad edge control point for label link
		 */
		__init : function(config){
			config = config || {};
			this.margin = (config.margin !== undefined)? config.margin : 50;
			this.linkExtends = (config.linkExtends !== undefined)? config.linkExtends : 30;
			config.name = 'JenScript.Donut2DBorderLabel';
			JenScript.Donut2DAbstractLabel.call(this, config);
		},
		
		/**
		 * set margin for this border label
		 * @param {Object} margin
		 */
		setMargin : function(margin){
			this.margin = margin;
			this.slice.donut.plugin.repaintPlugin();
		},
		
		/**
		 * set links extends for this border label
		 * @param {Object} margin
		 */
		setLinkExtends : function(linkExtends){
			this.linkExtends = linkExtends;
			this.slice.donut.plugin.repaintPlugin();
		},
		
		/**
		 * paint donut2D slice border label
		 * @param {Object} g2d the graphics context
		 * @param {Object} slice
		 */
		paintDonut2DSliceLabel : function(g2d, slice) {
		        var radius = slice.donut.getOuterRadius();
		        var medianDegree = slice.medianDegree;

		     
		        var px1 = slice.donut.buildCenterX + (radius + slice.getDivergence())* Math.cos(JenScript.Math.toRadians(medianDegree));
		        var py1 = slice.donut.buildCenterY - (radius + slice.getDivergence()) * Math.sin(JenScript.Math.toRadians(medianDegree));
		        var px2 = slice.donut.buildCenterX + (radius + this.linkExtends + slice.getDivergence())* Math.cos(JenScript.Math.toRadians(medianDegree));
		        var py2 = slice.donut.buildCenterY- (radius + this.linkExtends + slice.getDivergence()) * Math.sin(JenScript.Math.toRadians(medianDegree));

		        var px3 = 0;
		        var py3 = py2;
		        var px4 = 0;
		        var py4 = py2;
		        var pos = 'middle';
		        if (medianDegree >= 270 && medianDegree <= 360
		                || medianDegree >= 0 && medianDegree <= 90) {
		            px3 = slice.donut.buildCenterX + radius + this.margin  - 5;
		            px4 = slice.donut.buildCenterX + radius + this.margin  + 5;
		            
		            pos='start';
		            if(medianDegree === 270)
		            	pos = 'middle';
		            if(medianDegree === 90)
		            	pos = 'middle';
		        }
		        else {// 90-->270
		            px3 = slice.donut.buildCenterX- radius - this.margin + 5;
		            px4 = slice.donut.buildCenterX- radius - this.margin -5;
		            pos='end';
		        }
		        
		        
		        var quaddata = 'M '+px1+','+py1+' Q '+px2+','+py2+' '+px3+','+py3;
		        var quadlink = new JenScript.SVGElement().name('path')
													.attr('d',quaddata)
													.attr('fill','none')
													.attr('stroke','darkgray')
													.buildHTML();

		        slice.donut.svg.donutRoot.appendChild(quadlink);
		        
		        this.setTextAnchor(pos);
		        this.setLocation(new JenScript.Point2D(px4,py4));
		        var ct = (this.textColor !== undefined)? this.textColor : slice.themeColor;
				this.setTextColor(ct);
				
				//this.setOutlineColor(this.outlineColor);
				//this.setOutlineColor(this.fillColor);
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
	JenScript.Donut2DRadialLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut2DRadialLabel, JenScript.Donut2DAbstractLabel);
	JenScript.Model.addMethods(JenScript.Donut2DRadialLabel,{
		
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
			config.name = 'JenScript.Donut2DAbstractLabel';
			JenScript.Donut2DAbstractLabel.call(this,config);
		},

		/**
		 * set offset radius for this radial label.
		 * offset radius is the extention distance from radius to draw the radial label
		 * @param {Number} offsetRadius
		 */
		setOffsetRadius : function(offsetRadius) {
			this.offsetRadius = offsetRadius;
			this.slice.donut.plugin.repaintPlugin();
		},
		
		/**
		 * paint slice radial label
		 * @param {Object} g2d the graphics context
		 * @param {Object} slice
		 */
		paintDonut2DSliceLabel : function(g2d, slice) {
			var anchor = {
				x : slice.sc.x + (slice.donut.outerRadius + this.offsetRadius)
						* Math.cos(JenScript.Math.toRadians(slice.medianDegree)),
				y : slice.sc.y - (slice.donut.outerRadius + this.offsetRadius)
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
			
			//var co = (this.outlineColor !== undefined)? this.outlineColor : slice.themeColor;
			//this.setOutlineColor(co);
			this.paintLabel(g2d);
		}
	});
})();