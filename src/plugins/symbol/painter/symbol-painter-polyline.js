(function(){
	JenScript.SymbolPolylinePainter = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolPolylinePainter, JenScript.SymbolPainter);
	JenScript.Model.addMethods(JenScript.SymbolPolylinePainter,{
		
		_init : function(config){
			config=config||{};
			this.Id = 'symbolpolyline'+JenScript.sequenceId++;
			JenScript.SymbolPainter.call(this, config);
		},
		
		paintSymbolPolyline : function(g2d,polyline){
			var points = polyline.getSymbolComponents();
			var svgPolyline = new JenScript.SVGPath().Id(this.Id);
			for (var i = 0; i < points.length; i++) {
				var point =points[i];
				if(i == 0)
					svgPolyline.moveTo(point.devicePoint.x,point.devicePoint.y);
				else
					svgPolyline.lineTo(point.devicePoint.x,point.devicePoint.y);
			}
			g2d.insertSVG(svgPolyline.stroke(polyline.getThemeColor()).fillNone().toSVG());
		},
		
		paintSymbol : function(g2d,symbol,viewPart) {
			 if (symbol.isVisible()) {
		            this.paintSymbolPolyline(g2d,symbol);
		     }
		}
	});
})();