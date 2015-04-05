(function(){
	JenScript.SymbolBarStroke = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarStroke, JenScript.SymbolPainter);
	JenScript.Model.addMethods(JenScript.SymbolBarStroke,{
		
		_init : function(config){
			config=config||{};
			this.Id = 'symbolstroke'+JenScript.sequenceId++;
			this.strokeColor = config.strokeColor;
			this.strokeWidth = (config.strokeWidth !== undefined)?config.strokeWidth :1;
			JenScript.SymbolPainter.call(this, config);
		},
		
		paintBarStroke : function(g2d,bar){
			g2d.deleteGraphicsElement(this.Id);
			var c = (this.strokeColor !== undefined)?this.strokeColor : bar.getThemeColor();
		   	var elem =  bar.getBarShape().Id(this.Id).fillNone().stroke(c).strokeWidth(this.strokeWidth).toSVG();
		   	g2d.insertSVG(elem);
		},
		
		paintSymbol : function(g2d,symbol,viewPart) {
			 if (symbol.isVisible()) {
		            this.paintBarStroke(g2d,symbol);
		     }
		}
		
	});
	
	
})();