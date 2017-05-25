(function(){
	JenScript.CandleStickGeometry = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.CandleStickGeometry, JenScript.StockItemGeometry);

	JenScript.Model.addMethods(JenScript.CandleStickGeometry, {
		__init : function(config){
			config = config || {};
			this.lowHighColor = 'darkgray';

			/**line low/high shape*/
			this.deviceLowHighGap;
			
			/**rectangle open/close shape*/
			this.deviceOpenCloseGap;
			this.bound;
		},
		
		solveItemGeometry : function(){
			//console.log('CandleStickGeometry.solveItemGeometry');
			var deviceLow = this.deviceLow;
			var deviceHigh = this.deviceHigh;
			var deviceOpen = this.deviceOpen;
			var deviceClose = this.deviceClose;
			var deviceFixingStart = this.deviceFixingStart;
			var deviceFixingDuration = this.deviceFixingDuration;
			
			this.deviceLowHighGap = new JenScript.SVGLine().from(deviceLow.x,deviceLow.y).to(deviceHigh.x,deviceHigh.y);
			if (this.getStock().getOpen() > this.getStock().getClose()) {
				this.deviceOpenCloseGap = new JenScript.SVGRect().origin(deviceFixingStart, deviceOpen.y).size(deviceFixingDuration, Math.abs(deviceOpen.y - deviceClose.y));
			} else {
				this.deviceOpenCloseGap = new JenScript.SVGRect().origin(deviceFixingStart, deviceClose.y).size(deviceFixingDuration, Math.abs(deviceOpen.y - deviceClose.y));
			}
		},
		
		getBound2D : function(){
			return this.deviceOpenCloseGap.getBound2D();
		}
		
	});
	
	JenScript.CandleStickLayer = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.CandleStickLayer, JenScript.StockLayer);
	JenScript.Model.addMethods(JenScript.CandleStickLayer, {
		_init : function(config){
			config = config || {};
			this.lowHighColor = (config.lowHighColor !== undefined)?config.lowHighColor:'black';
			JenScript.StockLayer.call(this,{ name : "CandleStickLayer"});
		},
		
		setLowHighColor : function(color){
			this.color=color;
		},
		
		getLowHighColor : function(){
			return this.color;
		},
		
		
		solveLayer : function() {
			this.geometries = [];
			for (var i = 0; i < this.plugin.getBoundedStocks().length; i++) {
				var stock = this.plugin.getBoundedStocks()[i];
				var geom = new JenScript.CandleStickGeometry();
				geom.setLayer(this);
				geom.setStock(stock);
				geom.solveGeometry();
				this.addGeometry(geom);
			}
		},
		
	    onRelease : function(evt,part,x, y) {
	    	this.stockCheck('release',evt,x,y);
	    },
	   
	    onPress : function(evt,part,x, y) {
	    	this.stockCheck('press',evt,x,y);
	    },
	   
	    onMove : function(evt,part,x, y) {
	    	this.stockCheck('move',evt,x,y);
	    },
	    
	    /**
	     * check symbol event
	     * 
	     * @param {String}  action the action press, release, move, etc.
	     * @param {Object}  original event
	     * @param {Number}  x location
	     * @param {Number}  y location
	     */
	    stockCheck: function(action, evt,x,y){
	    	var that=this;
	    	var _d = function(geom){
	    	   if(action === 'press')
	    		   that.fireStockEvent('press',{stock : geom.getStock(), x:x,y:y, device :{x:x,y:y}});
               else if(action === 'release')
            	   that.fireStockEvent('release',{stock : geom.getStock(), x:x,y:y, device :{x:x,y:y}});
               else 
            	   that.stockEnterExitTracker(geom,x,y);
	    	};
	    	var _c = function(geom){
	    		var contains = (geom.getBound2D() !== undefined  && geom.getBound2D().contains(x,y));
        		if(action !== 'move' && contains && geom.getStock().isLockEnter()){
        			_d(geom);
        		}
        		else if (action === 'move') {
                	_d(geom);
                }
	    	};
	        for (var i = 0; i < this.geometries.length; i++) {
	        	_c(this.geometries[i]);
	        }
	    },

	    /**
	     * track stock enter or exit for the given stock and device location x,y
	     * 
	     * @param {Object}  stock symbol
	     * @param {Number}  x location in device coordinate
	     * @param {Number}  y location in device coordinate
	     */
	    stockEnterExitTracker : function(geom,x,y) {
	        if (geom.getBound2D() === undefined) {
	            return;
	        }
	        if (geom.getBound2D().contains(x, y) && !geom.getStock().isLockEnter()) {
	        	geom.getStock().setLockEnter(true);
	            this.fireStockEvent('enter',{stock : geom.getStock(), x:x,y:y, device :{x:x,y:y}});
	        }
	        if (geom.getBound2D().contains(x, y) && geom.getStock().isLockEnter()) {
	            this.fireStockEvent('move',{stock : geom.getStock(), x:x,y:y, device :{x:x,y:y}});
	        }
	        else if (!geom.getBound2D().contains(x, y) && geom.getStock().isLockEnter()) {
	        	geom.getStock().setLockEnter(false);
	            this.fireStockEvent('exit',{stock : geom.getStock(), x:x,y:y, device :{x:x,y:y}});
	        }
	    },

		paintLayer : function(g2d,part) {
			if (part === 'Device') {
				var svgLayer = new JenScript.SVGGroup().Id(this.Id).name('CandleStickLayer');
				for (var i = 0; i < this.getGeometries().length; i++) {
					var geom = this.getGeometries()[i];
					var svgCandleStick = geom.deviceLowHighGap.stroke(this.lowHighColor).fillNone();
					svgLayer.child(svgCandleStick.toSVG());

					var fillColor = (geom.getStock().isBearish())? this.plugin.getBearishColor():this.plugin.getBullishColor();
					var svgCandleStickFill = geom.deviceOpenCloseGap.strokeNone().fill(fillColor);
					svgLayer.child(svgCandleStickFill.toSVG());
				}
				g2d.deleteGraphicsElement(this.Id);
				g2d.insertSVG(svgLayer.toSVG());
			}
		},
	});
})();