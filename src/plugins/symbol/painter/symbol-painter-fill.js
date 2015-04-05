(function(){
	JenScript.SymbolBarFill = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarFill, JenScript.SymbolPainter);
	JenScript.Model.addMethods(JenScript.SymbolBarFill,{
		
		_init : function(config){
			config=config||{};
			this.Id = 'symbolfill'+JenScript.sequenceId++;
			JenScript.SymbolPainter.call(this, config);
		},
		
		paintBarFill : function(g2d,bar){},
		
		paintSymbol : function(g2d,symbol,xviewPart) {
			 if (symbol.isVisible()) {
		            this.paintBarFill(g2d,symbol);
		     }
		}
		
	});
	
	JenScript.SymbolBarFill0 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarFill0, JenScript.SymbolBarFill);
	JenScript.Model.addMethods(JenScript.SymbolBarFill0,{
		
		__init : function(config){
			config=config||{};
			JenScript.SymbolBarFill.call(this, config);
		},
		
	    paintBarFill : function(g2d,bar) {
	     	g2d.deleteGraphicsElement(this.Id+bar.Id);
		   	var elem =  bar.getBarShape().Id(this.Id+bar.Id).fill(bar.themeColor).fillOpacity(bar.opacity).toSVG();
		   	g2d.insertSVG(elem);
		   	//set bar bound2D
		   	var bbox = elem.getBBox();
		   	bar.setBound2D(new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height));
	    }
	});
	
	JenScript.SymbolBarFill1 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarFill1, JenScript.SymbolBarFill);
	JenScript.Model.addMethods(JenScript.SymbolBarFill1,{
		
		__init : function(config){
			config=config||{};
			JenScript.SymbolBarFill.call(this, config);
		},
		
	    paintBarFill : function(g2d,bar) {
	        if (bar.getNature() === 'Vertical') {
	            this.v(g2d, bar);
	        }
	        if (bar.getNature() === 'Horizontal') {
	            this.h(g2d, bar);
	        }
	    },

	   v : function(g2d,bar) {
		   
		   	//g2d.insertSVG(bar.getBarShape().Id(this.Id+bar.Id).stroke(bar.getThemeColor()).fillNone().toSVG());
		   	g2d.deleteGraphicsElement(this.Id+bar.Id);
		   	var elem =  bar.getBarShape().Id(this.Id+bar.Id).toSVG();
		   	g2d.insertSVG(elem);
	        var bbox = elem.getBBox();
	        var start = new JenScript.Point2D(bbox.x, bbox.y + bbox.height/2);
	        var end = new JenScript.Point2D(bbox.x + bbox.width,bbox.y + bbox.height/2);
	        var cBase = bar.getThemeColor();
	        var brighther1 = JenScript.Color.brighten(cBase, 20);
	        var dist = [ '0%', '50%', '100%' ];
	        var colors = [ brighther1, cBase, brighther1 ];
	        var opacity = [ 0.6, 0.8, 0.4 ];
	        var gradient1= new JenScript.SVGLinearGradient().Id(this.Id+bar.Id+'gradient').from(start.x, start.y).to(end.x, end.y).shade(dist,colors);
	        g2d.deleteGraphicsElement(this.Id+bar.Id+'gradient');
	        g2d.definesSVG(gradient1.toSVG());
	        elem.setAttribute('fill','url(#'+this.Id+bar.Id+'gradient'+')');
	    	//set bar bound2D
		   	var bbox = elem.getBBox();
		   	bar.setBound2D(new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height));
	    },

	    h : function(g2d,bar) {
	    	g2d.deleteGraphicsElement(bar.Id);
		   	var elem =  bar.getBarShape().Id(bar.Id).toSVG();
		   	g2d.insertSVG(elem);
	        var bbox = elem.getBBox();
	        var start = new Point2D.Double(bbox.x+bbox.width/2,bbox.y);
	        var end = new Point2D.Double(bbox.x+bbox.width/2, bbox.y + bbox.height);
	        var cBase = bar.getThemeColor();
	        var brighther1 = JenScript.Color.brighten(cBase, 20);

	        var dist = [ '0%', '50%', '100%' ];
	        var colors = [ brighther1, cBase, brighther1 ];
	        var opacity = [ 0.6, 0.8, 0.4 ];
	        var gradient1= new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x, start.y).to(end.x, end.y).shade(dist,colors);
	        g2d.deleteGraphicsElement(this.Id+'gradient');
	        g2d.definesSVG(gradient1.toSVG());
	        elem.setAttribute('fill','url(#'+this.Id+'gradient'+')');
	    	//set bar bound2D
		   	var bbox = elem.getBBox();
		   	bar.setBound2D(new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height));
	    }
		
	});
})();