(function(){
	JenScript.SymbolPainter = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.SymbolPainter,{
		init : function(config){
			config=config||{};
		},
		paintSymbol : function(g2d,symbol,xviewPart) {}
	});
})();