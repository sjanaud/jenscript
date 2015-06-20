(function(){
	JenScript.RayFill = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.RayFill, JenScript.RayPainter);
	JenScript.Model.addMethods(JenScript.RayFill,{
		
		_init : function(config){
			config=config||{};
			this.Id = 'rayfill'+JenScript.sequenceId++;
			JenScript.RayPainter.call(this, config);
		},
		
		paintRayFill : function(g2d,ray){},
		
		paintRay : function(g2d,ray,viewPart) {
		     this.paintRayFill(g2d,ray);
		}
		
	});
	
	JenScript.RayFill0 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.RayFill0, JenScript.RayFill);
	JenScript.Model.addMethods(JenScript.RayFill0,{
		
		__init : function(config){
			config=config||{};
			JenScript.RayFill.call(this, config);
		},
		
		paintRayFill : function(g2d,ray) {
	     	g2d.deleteGraphicsElement(this.Id+ray.Id);
		   	var elem =  ray.getRayShape().Id(this.Id+ray.Id).fill(ray.themeColor).fillOpacity(ray.opacity).toSVG();
		   	g2d.insertSVG(elem);
		   	console.log('ray theme color : '+ray.themeColor);
		   	//set bar bound2D
		   	var bbox = elem.getBBox();
		   	ray.setBound2D(new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height));
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
	        var start = new JenScript.Point2D(bbox.x+bbox.width/2,bbox.y);
	        var end = new JenScript.Point2D(bbox.x+bbox.width/2, bbox.y + bbox.height);
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