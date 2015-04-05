(function(){
	JenScript.SymbolPointPainter = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPointPainter, JenScript.SymbolPainter);
	JenScript.Model.addMethods(JenScript.SymbolPointPainter,{
		
		_init : function(config){
			config=config||{};
			this.Id = 'symbolpoint'+JenScript.sequenceId++;
			JenScript.SymbolPainter.call(this, config);
		},
		
		paintSymbolPoint : function(g2d,point){},
		
		paintSymbol : function(g2d,symbol,viewPart) {
			 if (symbol.isVisible()) {
		            this.paintSymbolPoint(g2d,symbol);
		     }
		}
		
	});
	
	JenScript.SymbolPointSquare = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPointSquare, JenScript.SymbolPointPainter);
	JenScript.Model.addMethods(JenScript.SymbolPointSquare,{
		
		__init : function(config){
			config=config||{};
			JenScript.SymbolPointPainter.call(this, config);
		},
		
		paintSymbolPoint : function(g2d,point){
			console.log('point painter : '+point);
			var square = new JenScript.SVGRect().Id(this.Id).origin(point.devicePoint.x-2,point.devicePoint.y-2).size(4,4);
			square.fill('yellow');
			g2d.insertSVG(square.toSVG());
		},
		
		
	});
	
})();