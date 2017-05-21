(function(){
	JenScript.SymbolBarEffect = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarEffect, JenScript.SymbolPainter);
	JenScript.Model.addMethods(JenScript.SymbolBarEffect,{
		
		_init : function(config){
			config=config||{};
			this.Id = 'symboleffect'+JenScript.sequenceId++;
			JenScript.SymbolPainter.call(this, config);
		},
		
		paintBarEffect : function(g2d,bar){},
		
		paintSymbol : function(g2d,symbol,xviewPart) {
			 if (symbol.isVisible()) {
		            this.paintBarEffect(g2d,symbol);
		     }
		}
		
	});
	
	JenScript.SymbolBarEffect0 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarEffect0, JenScript.SymbolBarEffect);
	JenScript.Model.addMethods(JenScript.SymbolBarEffect0,{
		
		__init : function(config){
			config=config||{};
			this.Id = 'symboleffect0_'+JenScript.sequenceId++;
			JenScript.SymbolBarEffect.call(this,config);
		},
		
		paintBarEffect : function(g2d,bar){
			if (bar.getNature() === 'Vertical') {
		        this.v(g2d,bar);
	        }
	        if (bar.getNature() === 'Horizontal') {
	            this.h(g2d,bar);
	        }
		},
		
		 v : function(g2d,bar) {

	        var proj = bar.getHost().getProjection();
	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() + bar.getValue());
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() - bar.getValue());
	        }
	        var p2ddevice = proj.userToPixel(p2dUser);

	        var p2dUserBase = new JenScript.Point2D(0, bar.getBase());
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var x = bar.getLocationX();
	        var y = p2ddevice.getY();
	        if (bar.isDescent()) {
	            y = p2ddeviceBase.getY();
	        }
	        var width = bar.getThickness();
	        var height = Math.abs(p2ddeviceBase.getY() - p2ddevice.getY());

	        var shapeEffect = undefined;

	        var inset = 2;
	        x = x + inset;
	        y = y + inset;
	        width = width - 2 * inset;
	        height = height - 2 * inset;
	        if (bar.getMorpheStyle() === 'Round') {

	        	var round = bar.getRound();
	        	var barPath = new JenScript.SVGPath().Id(this.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y + round);
	                barPath.lineTo(x, y + height);
	                barPath.lineTo(x + width / 2, y + height);
	                barPath.lineTo(x + width / 2, y);
	                barPath.lineTo(x + round, y);
	                barPath.quadTo(x, y, x, y + round);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x, y + height - round);
	                barPath.quadTo(x, y + height, x + round, y + height);
	                barPath.lineTo(x + width / 2, y + height);
	                barPath.lineTo(x + width / 2, y);
	                barPath.close();

	            }
	            shapeEffect = barPath;
	        }
	        else if (bar.getMorpheStyle() === 'Rectangle') {
	            var barRec = new JenScript.SVGRect().Id(this.Id).origin(x, y).size(width / 2, height);
	            shapeEffect = barRec;
	        }

	        var boun2D2 =  new JenScript.Bound2D(x, y,width, height);

	        var start = null;
	        var end = null;
	        if (bar.isAscent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	            end = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(), boun2D2.getY() + boun2D2.getHeight());
	        }
	        else if (bar.isDescent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY()+ boun2D2.getHeight());
	                    
	        }
	        var dist = [ '0%', '100%' ];
	        var colors = [ 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.5)' ];

	        var gradient1= new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x, start.y).to(end.x, end.y).shade(dist,colors);
	        g2d.deleteGraphicsElement(this.gradientId);
	        g2d.definesSVG(gradient1.toSVG());
	        
	        
	        var el = shapeEffect.fillURL(this.Id+'gradient').toSVG();
	        g2d.insertSVG(el);

	    },

	    h : function(g2d, bar) {

	        var proj = bar.getHost().getProjection();

	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(bar.getBase() + bar.getValue(), 0);
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(bar.getBase() - bar.getValue(), 0);
	        }

	        var p2ddevice = proj.userToPixel(p2dUser);

	        var p2dUserBase = new JenScript.Point2D(bar.getBase(), 0);
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var y = bar.getLocationY();
	        var x = p2ddeviceBase.getX();
	        if (bar.isDescent()) {
	            x = p2ddevice.getX();
	        }

	        var height = bar.getThickness();
	        var width = Math.abs(p2ddevice.getX() - p2ddeviceBase.getX());

	        var shapeEffect = null;

	        var inset = 2;
	        x = x + inset;
	        y = y + inset;
	        width = width - 2 * inset;
	        height = height - 2 * inset;
	        if (bar.getMorpheStyle() == 'Round') {
	            var round = bar.getRound();
	            var barPath = new JenScript.SVGPath().Id(this.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x + width - round, y);
	                barPath.quadTo(x + width, y, x + width, y + round);
	                barPath.lineTo(x + width, y + height / 2);
	                barPath.lineTo(x, y + height / 2);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x + round, y);
	                barPath.lineTo(x + width, y);
	                barPath.lineTo(x + width, y + height / 2);
	                barPath.lineTo(x, y + height / 2);
	                barPath.quadTo(x, y, x + round, y);
	                barPath.close();
	            }
	            shapeEffect = barPath;
	        }
	        else {
	            var barRec = new JenScript.SVGRect().Id(this.Id).origin(x, y).size(width, height/2);
	            shapeEffect = barRec;
	        }

	        var boun2D2 = new JenScript.Bound2D(x, y,width, height);
	        var start = null;
	        var end = null;
	        if (bar.isAscent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getCenterY());
	            end = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
	                                     boun2D2.getCenterY());
	        }
	        else if (bar.isDescent()) {
	            start = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
	                                       boun2D2.getCenterY());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getCenterY());
	        }
	        var dist =  [ '0%', '100%' ];
	        var colors = ['rgba(255, 255, 255, 0.3)','rgba(255, 255, 255, 0.5)'];
	               
	        var gradient1= new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x, start.y).to(end.x, end.y).shade(dist,colors);
	        g2d.deleteGraphicsElement(this.gradientId);
	        g2d.definesSVG(gradient1.toSVG());
	        
	        var el = shapeEffect.fillURL(this.Id+'gradient').toSVG();
	        g2d.insertSVG(el);
	    }
		
	});
	
	
	JenScript.SymbolBarEffect1 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarEffect1, JenScript.SymbolBarEffect);
	JenScript.Model.addMethods(JenScript.SymbolBarEffect1,{
		
		__init : function(config){
			config=config||{};
			this.Id = 'symboleffect1_'+JenScript.sequenceId++;
			JenScript.SymbolBarEffect.call(this,config);
		},
		
		paintBarEffect : function(g2d,bar){
			 if (bar.getNature() === 'Vertical') {
		            this.v(g2d,bar);
		        }
		        if (bar.getNature() === 'Horizontal') {
		            this.h(g2d,bar);
		        }
		},
		
		v : function(g2d, bar) {

	        var proj = bar.getHost().getProjection();

	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() + bar.getValue());
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() - bar.getValue());
	        }
	        var p2ddevice = proj.userToPixel(p2dUser);

	        var p2dUserBase = new JenScript.Point2D(0, bar.getBase());
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var x = bar.getLocationX();
	        var y =  p2ddevice.getY();
	        if (bar.isDescent()) {
	            y =  p2ddeviceBase.getY();
	        }
	        var width = bar.getThickness();
	        var height = Math.abs(p2ddeviceBase.getY() - p2ddevice.getY());

	        var shapeEffect = null;

	        var inset = 2;
	        x = x + inset;
	        y = y + inset;
	        width = width - 2 * inset;
	        height = height - 2 * inset;
	        if (bar.getMorpheStyle() === 'Round') {
	        	var round = bar.getRound();
	        	var  barPath = new JenScript.SVGPath().Id(this.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y + round);
	                barPath.lineTo(x, y + height);
	                barPath.lineTo(x + width, y + height);
	                barPath.lineTo(x + width, y + round);
	                barPath.quadTo(x + width, y, x + width - round, y);
	                barPath.lineTo(x + round, y);
	                barPath.quadTo(x, y, x, y + round);
	                barPath.close();
	                shapeEffect = barPath;
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x, y + height - round);
	                barPath.quadTo(x, y + height, x + round, y + height);
	                barPath.lineTo(x + width - round, y + height);
	                barPath.quadTo(x + width, y + height, x + width, y + height - round);
	                barPath.lineTo(x + width, y);
	                barPath.close();
	                shapeEffect = barPath;
	            }
	        }
	        else if (bar.getMorpheStyle() === 'Rectangle') {
	        	var barRec = new JenScript.SVGRect().Id(this.Id).origin(x, y).size(width, height);
	            shapeEffect = barRec;
	        }
	        var boun2D2 =  new JenScript.Bound2D(x, y,width,height);
	        var start = undefined;
	        var end = undefined;
	        if (bar.isAscent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY() + boun2D2.getHeight());
	        }
	        else if (bar.isDescent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY()  + boun2D2.getHeight());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	        }
	        var dist = [ '0%', '33%', '66%', '100%' ];
	        var colors = [ 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0)', 'rgba(40, 40, 40, 0)', 'rgba(40, 40, 40, 0.4)' ];
	        var gd = new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x,start.y).to(end.x,end.y).shade(dist,colors).toSVG();
	        g2d.definesSVG(gd);                                              
	        g2d.insertSVG(shapeEffect.fillURL(this.Id+'gradient').toSVG());
	    },

	    h : function(g2d, bar) {

//	        Projection proj = bar.getHost().getProjection();
//
//	        Point2D p2dUser = null;
//	        if (bar.isAscent()) {
//	            p2dUser = new JenScript.Point2D(bar.getBase() + bar.getValue(), 0);
//	        }
//	        if (bar.isDescent()) {
//	            p2dUser = new JenScript.Point2D(bar.getBase() - bar.getValue(), 0);
//	        }
//
//	        Point2D p2ddevice = proj.userToPixel(p2dUser);
//
//	        Point2D p2dUserBase = new JenScript.Point2D(bar.getBase(), 0);
//	        Point2D p2ddeviceBase = proj.userToPixel(p2dUserBase);
//
//	        double y = bar.getLocationY();
//	        double x = (int) p2ddeviceBase.getX();
//	        if (bar.isAscent()) {
//	            x = (int) p2ddeviceBase.getX();
//	        }
//	        if (bar.isDescent()) {
//	            x = (int) p2ddevice.getX();
//	        }
//
//	        double height = bar.getThickness();
//	        double width = Math.abs(p2ddevice.getX() - p2ddeviceBase.getX());
//
//	        Shape shapeEffect = null;
//
//	        int inset = 2;
//	        x = x + inset;
//	        y = y + inset;
//	        width = width - 2 * inset;
//	        height = height - 2 * inset;
//	        if (bar.getMorpheStyle() == MorpheStyle.Round) {
//	            double round = bar.getRound();
//	            GeneralPath barPath = new GeneralPath();
//	            if (bar.isAscent()) {
//	                barPath.moveTo(x, y);
//	                barPath.lineTo(x + width - round, y);
//	                barPath.quadTo(x + width, y, x + width, y + round);
//	                barPath.lineTo(x + width, y + height - round);
//	                barPath.quadTo(x + width, y + height, x + width - round, y
//	                        + height);
//	                barPath.lineTo(x, y + height);
//	                barPath.closePath();
//	            }
//	            else if (bar.isDescent()) {
//
//	                barPath.moveTo(x + round, y);
//	                barPath.lineTo(x + width, y);
//	                barPath.lineTo(x + width, y + height);
//	                barPath.lineTo(x + round, y + height);
//	                barPath.quadTo(x, y + height, x, y + height - round);
//	                barPath.lineTo(x, y + round);
//	                barPath.quadTo(x, y, x + round, y);
//	                barPath.closePath();
//	            }
//	            shapeEffect = barPath;
//	        }
//	        else {
//
//	            Rectangle2D barRec = new Rectangle2D.Double(x, y, width, height);
//	            shapeEffect = barRec;
//
//	        }
//
//	        Rectangle2D boun2D2 = shapeEffect.getBounds2D();
//
//	        Point2D start = null;
//	        Point2D end = null;
//	        if (bar.isAscent()) {
//	            start = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
//	                                       boun2D2.getY());
//	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
//	        }
//	        else if (bar.isDescent()) {
//	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
//	            end = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
//	                                     boun2D2.getY());
//	        }
//
//	        float[] dist = { 0.0f, 0.33f, 0.66f, 1.0f };
//	        Color[] colors = { 'rgba(255, 255, 255, 180),
//	                'rgba(255, 255, 255, 0), 'rgba(40, 40, 40, 0),
//	                'rgba(40, 40, 40, 100) };
//	        LinearGradientPaint p2 = new LinearGradientPaint(start, end, dist,
//	                                                         colors);
//
//	        g2d.setPaint(p2);
//	        g2d.fill(shapeEffect);

	    }
		
		
	});
	
	
	
	
	JenScript.SymbolBarEffect2 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarEffect2, JenScript.SymbolBarEffect);
	JenScript.Model.addMethods(JenScript.SymbolBarEffect2,{
		
		__init : function(config){
			config=config||{};
			this.Id = 'symboleffect2_'+JenScript.sequenceId++;
			JenScript.SymbolBarEffect.call(this,config);
		},
		
		paintBarEffect : function(g2d,bar){
			 if (bar.getNature() === 'Vertical') {
		            this.v(g2d,bar);
		        }
		        if (bar.getNature() === 'Horizontal') {
		            this.h(g2d,bar);
		        }
		},
		
		v : function(g2d, bar) {

	        var proj = bar.getHost().getProjection();

	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() + bar.getValue());
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() - bar.getValue());
	        }
	        var p2ddevice = proj.userToPixel(p2dUser);

	        var p2dUserBase = new JenScript.Point2D(0, bar.getBase());
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var x = bar.getLocationX();
	        var y =  p2ddevice.getY();
	        if (bar.isDescent()) {
	            y = p2ddeviceBase.getY();
	        }
	        var width = bar.getThickness();
	        var height = Math.abs(p2ddeviceBase.getY() - p2ddevice.getY());
	        var shapeEffect = null;
	        var inset = 2;
	        x = x + inset;
	        y = y + inset;
	        width = width - 2 * inset;
	        height = height - 2 * inset;
	        var biais = 10;
	        if (bar.getMorpheStyle() === 'Round') {
	        	var round = bar.getRound();
	        	var barPath = new JenScript.SVGPath().Id(this.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y + round);
	                barPath.lineTo(x, y + height / 2 + biais);
	                barPath.lineTo(x + width, y + height / 2 - biais);
	                barPath.lineTo(x + width, y + round);
	                barPath.quadTo(x + width, y, x + width - round, y);
	                barPath.lineTo(x + round, y);
	                barPath.quadTo(x, y, x, y + round);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x, y + height / 2 - biais);
	                barPath.lineTo(x, y + height - round);
	                barPath.quadTo(x, y + height, x + round, y + height);
	                barPath.lineTo(x + width - round, y + height);
	                barPath.quadTo(x + width, y + height, x + width, y + height - round);
	                barPath.lineTo(x + width, y + height / 2 + biais);
	                barPath.close();
	            }
	            shapeEffect = barPath;
	        }
	        else if (bar.getMorpheStyle() === 'Rectangle') {
	        	var barPath = new JenScript.SVGPath().Id(this.Id);
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y);
	                barPath.lineTo(x, y + height / 2 + biais);
	                barPath.lineTo(x + width, y + height / 2 - biais);
	                barPath.lineTo(x + width, y);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x, y + height / 2 - biais);
	                barPath.lineTo(x, y + height);
	                barPath.lineTo(x + width, y + height);
	                barPath.lineTo(x + width, y + height / 2 + biais);
	                barPath.close();
	            }
	            shapeEffect = barPath;
	        }

	        var elem = shapeEffect.toSVG();
	        g2d.insertSVG(elem);
	        
	        var bbox = elem.getBBox();
	        var boun2D2 = new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height);

	        var start = null;
	        var end = null;
	        if (bar.isAscent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY()  + boun2D2.getHeight());
	        }
	        else if (bar.isDescent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY()  + boun2D2.getHeight());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	        }

	        var dist = ['0%','100%'];
	        var colors = [ 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.2)' ];
	               
	        var p2 = new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x,start.y).to(end.x,end.y).shade(dist, colors).toSVG();
	        g2d.deleteGraphicsElement(this.Id+'gradient');
	        g2d.definesSVG(p2);
	        
	        elem.setAttribute('fill','url(#'+this.Id+'gradient'+')');
	    },

	    h:function(g2d, bar) {

//	        Projection proj = bar.getHost().getProjection();
//
//	        Point2D p2dUser = null;
//	        if (bar.isAscent()) {
//	            p2dUser = new JenScript.Point2D(bar.getBase() + bar.getValue(), 0);
//	        }
//	        if (bar.isDescent()) {
//	            p2dUser = new JenScript.Point2D(bar.getBase() - bar.getValue(), 0);
//	        }
//
//	        Point2D p2ddevice = proj.userToPixel(p2dUser);
//
//	        Point2D p2dUserBase = new JenScript.Point2D(bar.getBase(), 0);
//	        Point2D p2ddeviceBase = proj.userToPixel(p2dUserBase);
//
//	        double y = bar.getLocationY();
//	        double x = (int) p2ddeviceBase.getX();
//	        if (bar.isAscent()) {
//	            x = (int) p2ddeviceBase.getX();
//	        }
//	        if (bar.isDescent()) {
//	            x = (int) p2ddevice.getX();
//	        }
//
//	        double height = bar.getThickness();
//	        double width = Math.abs(p2ddevice.getX() - p2ddeviceBase.getX());
//
//	        Shape shapeEffect = null;
//
//	        int inset = 2;
//	        x = x + inset;
//	        y = y + inset;
//	        width = width - 2 * inset;
//	        height = height - 2 * inset;
//
//	        int biais = 10;
//
//	        if (bar.getMorpheStyle() == MorpheStyle.Round) {
//	            double round = bar.getRound();
//	            GeneralPath barPath = new GeneralPath();
//	            if (bar.isAscent()) {
//	                barPath.moveTo(x + width / 2 + biais, y);
//	                barPath.lineTo(x + width - round, y);
//	                barPath.quadTo(x + width, y, x + width, y + round);
//	                barPath.lineTo(x + width, y + height - round);
//	                barPath.quadTo(x + width, y + height, x + width - round, y
//	                        + height);
//	                barPath.lineTo(x + width / 2 - biais, y + height);
//	                barPath.closePath();
//	            }
//	            else if (bar.isDescent()) {
//
//	                barPath.moveTo(x + round, y);
//	                barPath.lineTo(x + width / 2 - biais, y);
//	                barPath.lineTo(x + width / 2 + biais, y + height);
//	                barPath.lineTo(x + round, y + height);
//	                barPath.quadTo(x, y + height, x, y + height - round);
//	                barPath.lineTo(x, y + round);
//	                barPath.quadTo(x, y, x + round, y);
//	                barPath.closePath();
//	            }
//	            shapeEffect = barPath;
//	        }
//	        else {
//
//	            GeneralPath barPath = new GeneralPath();
//
//	            if (bar.isAscent()) {
//	                barPath.moveTo(x + width / 2 + biais, y);
//	                barPath.lineTo(x + width, y);
//	                barPath.lineTo(x + width, y + height);
//	                barPath.lineTo(x + width / 2 - biais, y + height);
//	                barPath.closePath();
//	            }
//	            else if (bar.isDescent()) {
//	                barPath.moveTo(x + width / 2 - biais, y);
//	                barPath.lineTo(x, y);
//	                barPath.lineTo(x, y + height);
//	                barPath.lineTo(x + width / 2 + biais, y + height);
//	                barPath.closePath();
//	            }
//	            shapeEffect = barPath;
//
//	        }
//
//	        Rectangle2D boun2D2 = shapeEffect.getBounds2D();
//
//	        Point2D start = null;
//	        Point2D end = null;
//	        if (bar.isAscent()) {
//	            start = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
//	                                       boun2D2.getY());
//	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
//	        }
//	        else if (bar.isDescent()) {
//	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
//	            end = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
//	                                     boun2D2.getY());
//	        }
//
//	        float[] dist = { 0.0f, 1.0f };
//	        Color[] colors = {'rgba(255, 255, 255, 180),
//	               'rgba(255, 255, 255, 60) };
//	        LinearGradientPaint p2 = new LinearGradientPaint(start, end, dist,
//	                                                         colors);
//
//	        g2d.setPaint(p2);
//	        g2d.fill(shapeEffect);

	    }
	});
	
	
	JenScript.SymbolBarEffect3 = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.SymbolBarEffect3, JenScript.SymbolBarEffect);
	JenScript.Model.addMethods(JenScript.SymbolBarEffect3,{
		
		__init : function(config){
			config=config||{};
			this.Id = 'symboleffect3_'+JenScript.sequenceId++;
			JenScript.SymbolBarEffect.call(this,config);
		},
		
		paintBarEffect : function(g2d,bar){
			 if (bar.getNature() === 'Vertical') {
		            this.v(g2d,bar);
		        }
		        if (bar.getNature() === 'Horizontal') {
		            this.h(g2d,bar);
		        }
		},
		
	   v : function(g2d,bar) {
	        if (bar.getHost() === undefined || bar.getHost().getProjection() === undefined) {
	            return;
	        }
	        var proj = bar.getHost().getProjection();
	        var p2dUser = null;
	        if (bar.isAscent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() + bar.getValue());
	        }
	        if (bar.isDescent()) {
	            p2dUser = new JenScript.Point2D(0, bar.getBase() - bar.getValue());
	        }
	        var p2ddevice = proj.userToPixel(p2dUser);
	        var p2dUserBase = new JenScript.Point2D(0, bar.getBase());
	        var p2ddeviceBase = proj.userToPixel(p2dUserBase);

	        var x = bar.getLocationX();
	        var y = p2ddevice.getY();
	        if (bar.isDescent()) {
	            y = p2ddeviceBase.getY();
	        }
	        var width = bar.getThickness();
	        var height = Math.abs(p2ddeviceBase.getY() - p2ddevice.getY());

	        var shapeEffect = null;
	        var inset = 2;
	        x = x + inset;
	        y = y + inset;
	        width = width - 2 * inset;
	        height = height - 2 * inset;
	        var barPath = new JenScript.SVGPath().Id(this.Id);
	        if (bar.getMorpheStyle() == 'Round') {
	        	var round = bar.getRound();
	            if (bar.isAscent()) {
	                barPath.moveTo(x, y + round);
	                barPath.quadTo(x + width / 2, y + height / 2, x, y + height);
	                barPath.lineTo(x + width, y + height);
	                barPath.quadTo(x + width / 2, y + height / 2, x + width, y + round);
	                barPath.quadTo(x + width, y, x + width - round, y);
	                barPath.lineTo(x + round, y);
	                barPath.quadTo(x, y, x, y + round);
	                barPath.close();
	            }
	            else if (bar.isDescent()) {
	                barPath.moveTo(x, y);
	                barPath.quadTo(x + width / 2, y + height / 2, x, y + height- round);
	                barPath.quadTo(x, y + height, x + round, y + height);
	                barPath.lineTo(x + width - round, y + height);
	                barPath.quadTo(x + width, y + height, x + width, y + height- round);
	                barPath.quadTo(x + width / 2, y + height / 2, x + width, y);
	                barPath.close();
	            }
	        }
	        else if (bar.getMorpheStyle() === 'Rectangle') {
	            barPath.moveTo(x, y);
	            barPath.quadTo(x + width / 2, y + height / 2, x, y + height);
	            barPath.lineTo(x + width, y + height);
	            barPath.quadTo(x + width / 2, y + height / 2, x + width, y);
	            barPath.close();
	        }
	        shapeEffect = barPath;
	        
	        var elem = shapeEffect.toSVG();
	        g2d.insertSVG(elem);
	        
	        var bbox = elem.getBBox();
	        var boun2D2 = new JenScript.Bound2D(bbox.x,bbox.y,bbox.width,bbox.height);

	        var start = null;
	        var end = null;
	        if (bar.isAscent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY() + boun2D2.getHeight());
	        }
	        else if (bar.isDescent()) {
	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY()  + boun2D2.getHeight());
	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
	        }

	        var dist = ['0%','33%','66%','100%' ];
	        var colors = ['rgba(255, 255, 255, 0.55)',  'rgba(255, 255, 255, 0)','rgba(40, 40, 40, 0)','rgba(40, 40, 40, 0.45)' ];
	        var p2 = new JenScript.SVGLinearGradient().Id(this.Id+'gradient').from(start.x,start.y).to(end.x,end.y).shade(dist,colors).toSVG();
	        g2d.deleteGraphicsElement(this.Id+'gradient');
	        g2d.definesSVG(p2);
	        
	        elem.setAttribute('fill','url(#'+this.Id+'gradient'+')');

	       
	    },

	    h : function(g2d,bar) {

//	        Projection proj = bar.getHost().getProjection();
//
//	        Point2D p2dUser = null;
//	        if (bar.isAscent()) {
//	            p2dUser = new JenScript.Point2D(bar.getBase() + bar.getValue(), 0);
//	        }
//	        if (bar.isDescent()) {
//	            p2dUser = new JenScript.Point2D(bar.getBase() - bar.getValue(), 0);
//	        }
//
//	        Point2D p2ddevice = proj.userToPixel(p2dUser);
//
//	        Point2D p2dUserBase = new JenScript.Point2D(bar.getBase(), 0);
//	        Point2D p2ddeviceBase = proj.userToPixel(p2dUserBase);
//
//	        double y = bar.getLocationY();
//	        double x = (int) p2ddeviceBase.getX();
//	        if (bar.isAscent()) {
//	            x = (int) p2ddeviceBase.getX();
//	        }
//	        if (bar.isDescent()) {
//	            x = (int) p2ddevice.getX();
//	        }
//
//	        double height = bar.getThickness();
//	        double width = Math.abs(p2ddevice.getX() - p2ddeviceBase.getX());
//
//	        Shape shapeEffect = null;
//
//	        int inset = 2;
//	        x = x + inset;
//	        y = y + inset;
//	        width = width - 2 * inset;
//	        height = height - 2 * inset;
//	        if (bar.getMorpheStyle() == MorpheStyle.Round) {
//	            double round = bar.getRound();
//	            GeneralPath barPath = new GeneralPath();
//	            if (bar.isAscent()) {
//	                barPath.moveTo(x, y);
//	                barPath.quadTo(x + width / 2, y + height / 2,
//	                               x + width - round, y);
//	                barPath.quadTo(x + width, y, x + width, y + round);
//	                barPath.lineTo(x + width, y + height - round);
//	                barPath.quadTo(x + width, y + height, x + width - round, y
//	                        + height);
//	                barPath.quadTo(x + width / 2, y + height / 2, x, y + height);
//	                barPath.closePath();
//
//	            }
//	            else if (bar.isDescent()) {
//
//	                barPath.moveTo(x + round, y);
//	                barPath.quadTo(x + width / 2, y + height / 2, x + width, y);
//	                barPath.lineTo(x + width, y + height);
//	                barPath.quadTo(x + width / 2, y + height / 2, x + round, y
//	                        + height);
//	                barPath.quadTo(x, y + height, x, y + height - round);
//	                barPath.lineTo(x, y + round);
//	                barPath.quadTo(x, y, x + round, y);
//	                barPath.closePath();
//
//	            }
//	            shapeEffect = barPath;
//	        }
//	        else {
//
//	            GeneralPath barPath = new GeneralPath();
//	            barPath.moveTo(x, y);
//	            barPath.quadTo(x + width / 2, y + height / 2, x + width, y);
//	            barPath.lineTo(x + width, y + height);
//	            barPath.quadTo(x + width / 2, y + height / 2, x, y + height);
//	            barPath.closePath();
//	            shapeEffect = barPath;
//
//	        }
//
//	        Rectangle2D boun2D2 = shapeEffect.getBounds2D();
//
//	        Point2D start = null;
//	        Point2D end = null;
//	        if (bar.isAscent()) {
//	            start = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
//	                                       boun2D2.getY());
//	            end = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
//	        }
//	        else if (bar.isDescent()) {
//	            start = new JenScript.Point2D(boun2D2.getX(), boun2D2.getY());
//	            end = new JenScript.Point2D(boun2D2.getX() + boun2D2.getWidth(),
//	                                     boun2D2.getY());
//	        }
//
//	        float[] dist = { 0.0f, 0.33f, 0.66f, 1.0f };
//	        Color[] colors2 = {'rgba(255, 255, 255, 180),
//	               'rgba(255, 255, 255, 0),'rgba(40, 40, 40, 0),
//	               'rgba(40, 40, 40, 100) };
//	        LinearGradientPaint p2 = new LinearGradientPaint(start, end, dist,
//	                                                         colors2);
//
//	        g2d.setPaint(p2);
//	        g2d.fill(shapeEffect);

	    }
	});
	
	
	
})();