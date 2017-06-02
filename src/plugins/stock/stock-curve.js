(function(){
	
	//encapsulate path
	JenScript.CurveStockGeometry = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.CurveStockGeometry, JenScript.StockGroupGeometry);

	JenScript.Model.addMethods(JenScript.CurveStockGeometry, {
		__init : function(config){
			config = config || {};
			this.moveCount = (config.moveCount !== undefined)? config.moveCount : 20;
			JenScript.StockGroupGeometry.call(this,config);
			this.points=[];
		},
		
		setMoveCount : function(mc){
			this.moveCount = mc;
		},
		getMoveCount : function(){
			return this.moveCount;
		},
		
		getCurvePoints : function() {
			return this.points;
		},
		
		//reset solve an re throw error to force solve geometry curve (stock group) 
		solveGeometry : function() {
			throw new Error('CurveStockGeometry solve should be supplied');
		}
	});
	
	
	JenScript.StockCurveLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.StockCurveLayer, JenScript.StockLayer);
	JenScript.Model.addMethods(JenScript.StockCurveLayer, {
		_init : function(config){
			config = config || {};
			this.curveColor = (config.curveColor !== undefined)? config.curveColor : 'black';
			this.curveOpacity = (config.curveOpacity !== undefined)? config.curveOpacity : 1;
			this.curveWidth = (config.curveWidth !== undefined)? config.curveWidth : 1;
			this.moveCount = (config.moveCount !== undefined)? config.moveCount : 20;
			this.Id = 'fixing'+JenScript.sequenceId++;
			this.name = (config.name !== undefined)? config.name : 'stockCurveLayer'+this.Id;
			config.name = (config.name !== undefined)?config.name: "StockCurveLayer";
			JenScript.StockLayer.call(this,config);
		},
		
		setMoveCount : function(mc){
			this.moveCount = mc;
		},
		getMoveCount : function(){
			return this.moveCount;
		},
		
		getGeomInstance : function() {
			throw new Error("Geometry should be supplied");
		},
		
		solveLayer : function() {
			this.clearGeometries();
			var geom = this.getGeomInstance();
			geom.setLayer(this);
			geom.solveGeometry();
			this.addGeometry(geom);
		},

		paintLayer : function(g2d,part) {
			if (part === 'Device') {
				for (var i = 0; i < this.getGeometries().length; i++) {
					var svgLayer = new JenScript.SVGGroup().Id(this.Id).name(this.name);
					var stockCurve = new JenScript.SVGPath().Id(this.Id+'_path');
					
					var geom = this.getGeometries()[i];
					var proj = this.plugin.getProjection();
					var points = geom.getCurvePoints();
					
					var dps = [];
					for (var j = 0; j < points.length; j++) {
						var dp =  proj.userToPixel(points[j]);
						dps[dps.length] = dp;
					}
					var simplifiedPoint = JenScript.Math.simplify(dps,1);
					
					for (var p = 0; p < simplifiedPoint.length; p++) {
						var point = simplifiedPoint[p];
						if(p == 0)
							stockCurve.moveTo(point.x,point.y);
						else
							stockCurve.lineTo(point.x,point.y);
					}
					g2d.deleteGraphicsElement(this.Id);
					svgLayer.child(stockCurve.stroke(this.curveColor).strokeWidth(this.curveWidth).strokeOpacity(this.curveOpacity).fillNone().toSVG());
					g2d.insertSVG(svgLayer.toSVG());
				}
			}
		},
	});
	
})();