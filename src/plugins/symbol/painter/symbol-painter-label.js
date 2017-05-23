(function(){
	
	/**
	 * Object SymbolAbstractLabel()
	 * Defines Symbol Abstract Label
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
	JenScript.SymbolAbstractLabel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolAbstractLabel,JenScript.AbstractLabel);
	JenScript.Model.addMethods(JenScript.SymbolAbstractLabel,{
		
		/**
		 * Initialize Abstract Symbol Label
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
		 * Abstract label paint for Symbol
		 */
		paintSymbol : function(g2d,symbol,part){
			throw new Error('paintSymbolLabel method should be provide by override');
		}
		
	});
	
	
	/**
	 * Object SymbolAxisLabel()
	 * Defines symbol axis label 
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
	 * @param {String} [config.rotate] active rotate
	 * @param {String} [config.rotateAngle] the label rotation angle
	 * @param {String} [config.part] the label view part, east, west, south, east, device
	 * @param {String} [config.position] the label position, top, bottom, middle
	 */
	JenScript.SymbolAxisLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolAxisLabel, JenScript.SymbolAbstractLabel);
	JenScript.Model.addMethods(JenScript.SymbolAxisLabel, {
		
		/**
		 * Initialize Symbol Axis Label
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
		 * @param {String} [config.rotate] active rotate
		 * @param {String} [config.rotateAngle] the label rotation angle
		 * @param {String} [config.part] the label view part, east, west, south, east, device
		 * 
		 */
		__init : function(config){
			config = config || {};
			config.name = 'JenScript.SymbolAxisLabel';
			this.part = (config.part !== undefined)? config.part:'West';
			JenScript.SymbolAbstractLabel.call(this, config);
		},
		
		/**
		 *Paint default label Symbol
		 */
		paintSymbol : function(g2d,symbol,part){
			if (symbol.getNature() === 'Vertical') {
				this.paintVLabel(g2d,symbol,part);
		    }
		    if (symbol.getNature() === 'Horizontal') {
		    	this.paintHLabel(g2d,symbol,part);
		    }
		},
		
		paintHLabel : function(g2d,symbol,part){
			var cy = symbol.getCenterY();
			var w = symbol.getHost().getWest();
			if(this.part === 'West' && part === 'West'){
		        this.setLocation(new JenScript.Point2D(w-5,cy));
		        this.paintLabel(g2d);
			}
			if(this.part === 'East'  && part === 'East'){
		        this.setLocation(new JenScript.Point2D(5,cy));
		        this.paintLabel(g2d);
			}
			
		},
		
		paintVLabel : function(g2d,symbol,part){
			var cx = symbol.getCenterX();
			var w = symbol.getHost().getWest();
			var n = symbol.getHost().getNorth();
			if(this.part === 'South' && part === 'South'){
		        this.setLocation(new JenScript.Point2D(w+cx,5));
		        this.paintLabel(g2d);
			}
			else if(this.part === 'North' && part === 'North'){
		        this.setLocation(new JenScript.Point2D(w+cx,n-5));
		        this.paintLabel(g2d);
			}
			
		},
	});
	
	
	/**
	 * Object SymbolBarLabel()
	 * Defines symbol bar label 
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
	 * @param {String} [config.rotate] active rotate
	 * @param {String} [config.rotateAngle] the label rotation angle
	 * @param {String} [config.part] the label view part, east, west, south, east, device
	 * @param {String} [config.position] the label position, top, bottom, middle
	 */
	JenScript.SymbolBarLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarLabel, JenScript.SymbolAbstractLabel);
	JenScript.Model.addMethods(JenScript.SymbolBarLabel, {
		
		/**
		 * Initialize Symbol Default Label
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
		 * @param {String} [config.rotate] active rotate
		 * @param {String} [config.rotateAngle] the label rotation angle
		 * @param {String} [config.part] the label view part, east, west, south, east, device
		 * 
		 */
		__init : function(config){
			config = config || {};
			config.name = 'JenScript.SymbolBarLabel';
			this.part = (config.part !== undefined)? config.part:'West';
			this.barAnchor = (config.barAnchor !== undefined)? config.barAnchor:'middle';
			JenScript.SymbolAbstractLabel.call(this, config);
		},
		
		/**
		 *Paint default label Symbol
		 */
		paintSymbol : function(g2d,symbol,part){
			if (symbol.getNature() === 'Vertical') {
				this.paintVLabel(g2d,symbol,part);
		    }
		    if (symbol.getNature() === 'Horizontal') {
		    	this.paintHLabel(g2d,symbol,part);
		    }
		},
		
		paintHLabel : function(g2d,symbol,part){
		  if(part === 'Device'){
				var b = symbol.getBound2D();
				if(this.barAnchor === 'bottom'){
					 this.setLocation(new JenScript.Point2D(b.getX(),b.getCenterY()));
				}
				else if(this.barAnchor === 'top'){
					 this.setLocation(new JenScript.Point2D(b.getX()+b.getWidth(),b.getCenterY()));
				}
				else if(this.barAnchor === 'middle'){
					 this.setLocation(new JenScript.Point2D(b.getCenterX(),b.getCenterY()));
				}
				this.paintLabel(g2d);
			}
		},
		
		paintVLabel : function(g2d,symbol,part){
			if(part === 'Device'){
				var b = symbol.getBound2D();
		        if(this.barAnchor === 'bottom'){
					 this.setLocation(new JenScript.Point2D(b.getCenterX(),b.getY()+b.getHeight()));
				}
				else if(this.barAnchor === 'top'){
					 this.setLocation(new JenScript.Point2D(b.getCenterX(),b.getY()));
				}
				else if(this.barAnchor === 'middle'){
					 this.setLocation(new JenScript.Point2D(b.getCenterX(),b.getCenterY()));
				}
				this.paintLabel(g2d);
			}
		},
		
	});
	
})();