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
	 * Object SymbolDefaultLabel()
	 * Defines Donut Border Label, a label which is paint on the donut border left or right side 
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
	JenScript.SymbolDefaultLabel = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolDefaultLabel, JenScript.SymbolAbstractLabel);
	JenScript.Model.addMethods(JenScript.SymbolDefaultLabel, {
		
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
		 */
		__init : function(config){
			config = config || {};
			config.name = 'JenScript.SymbolDefaultLabel';
			JenScript.SymbolAbstractLabel.call(this, config);
		},
		
		/**
		 *Paint default label Symbol
		 */
		paintSymbol : function(g2d,symbol,part){
			console.log("paint default label symbol");
		}
	});
	
})();