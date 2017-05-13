(function(){
	JenScript.TranslateCompassWidget = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TranslateCompassWidget, JenScript.Widget);
	
	JenScript.Model.addMethods(JenScript.TranslateCompassWidget, {
		_init : function(config){
			config = config || {};
			config.name = 'TranslateCompass';
		    this.translateCompassWidgetID = 'translate_compass'+JenScript.sequenceId++;
		    this.compassSquareSize = (config.compassSquareSize !== undefined)?config.compassSquareSize:64;
		    this.compassWidget;
		    this.compassStyle = 'Merge';
		    this.name;
		    this.ringDrawColor = 'rgba(91,151,168,0.7)';
		    this.ringFillColor = (config.ringFillColor !== undefined)?config.ringFillColor: 'red';
		    this.ringFillOpacity = 0.5;
		    this.ringDrawOpacity=1;
		    this.ringNeedleDrawColor;
		    this.ringNeedleFillColor;
		    this.averageCounter = 0;
		    
		    this.maxAverage = 2;
		    this.averageDx = 0;
		    this.averageDy = 0;
		    
	        this.compassGeometry = new this.CompassGeometry(0, 0, this.compassSquareSize / 2 - 10,this.compassSquareSize / 2 - 4);
	        this.needleGeometry= new this.NeedleGeometry(); 
	        this.needleVector = new this.NeedleVector();
	        
	        config.Id =  this.translateCompassWidgetID;
	        config.width = this.compassSquareSize;
	        config.height = this.compassSquareSize;
	        config.xIndex = (config.xIndex !== undefined)?config.xIndex: 100;
	        config.yIndex =  (config.yIndex !== undefined)?config.yIndex: 0;
			JenScript.Widget.call(this,config);
		},
		
		CompassGeometry : function(centerX,centerY,innerRadius,outerRadius){
	        this.centerX = centerX;
	        this.centerY = centerY;
	        this.innerRadius = innerRadius;
	        this.outerRadius = outerRadius;
	        this.builCompass = function() {
	        };
		},
		
		NeedleGeometry : function(){
	        this.theta = 0;
	        this.paint = 'rgba(0, 0, 0, 0.6)';
	        this.colorTheme = 'white';
	        this.alphaProjection = 18;
		},
		
		NeedleVector : function(){
			 this.startx = 0;
	         this.endx = 0;
	         this.starty = 0;
	         this.endy = 0;
		},
		
	
		onRegister : function() {
			var that = this;
			//common behavior
			//this.attachPluginLockUnlockFactory('Translate Compass widget factory');
			
			this.getHost().addTranslateListener('start',
		            function (pluginEvent) {
						//console.log('compass widget start listener is being to create compass widget');
						that.create();
						//console.log('compass created');
		            },'Translate compass widget translate start listener, create'
			);
			//translate behavior
			this.getHost().addTranslateListener('bound',
	            function (pluginEvent) {
	                if (that.averageCounter < that.maxAverage) {
	                	that.averageCounter++;
	                	that.averageDx = that.averageDx + that.getHost().getTranslateDx();
	                	that.averageDy = that.averageDy + that.getHost().getTranslateDy();
	                }
	                else {
	                	that.needleVector.startx = 0;
	                	that.needleVector.endx = that.averageDx / that.averageCounter;
	                	that.needleVector.starty = 0;
	                	that.needleVector.endy = that.averageDy / that.averageCounter;
	                	
	                	that.destroy();
	                	that.create();
	 	               
	                	that.averageCounter = 0;
	                	that.averageDx = 0;
	                	that.averageDy = 0;
	                }
	               
	            },'translate compass widget translate process listener'
			);
			
//			this.getHost().addTranslateListener('stop',
//		            function onTranslate(pluginEvent) {
//						//var g2d = that.getHost().getProjection().getView().getWidgetPlugin().getGraphicsContext('Device');
//						//g2d.deleteGraphicsElement(that.Id);
//						that.destroy();
//		            },'translate compass widget translate stop listener, destroy'
//			);
			
			this.getHost().addTranslateListener('stop',
		            function (pluginEvent) {
						that.destroy();
		            },'translate compass widget translate stop listener, destroy'
			);
			
			
			this.attachLayoutFolderFactory('Compass Layout Folder');
		},
		
		  /**
	     * get compass geometry
	     * 
	     * @return compass geometry
	     */
	    getCompassGeometry : function() {
	        return this.compassGeometry;
	    },
	    
	    solveCompass : function(){
	    	var currentFolder = this.getWidgetFolder();
	        var tcx = (currentFolder.x + currentFolder.width / 2);
	        var tcy = (currentFolder.y + currentFolder.height / 2);
	        
	        this.getCompassGeometry().centerX = tcx;
	        this.getCompassGeometry().centerY = tcy;

	        var theta = 0;
	        var centerX = this.needleVector.startx;
	        var centerY = this.needleVector.starty;
	        var x = this.needleVector.endx;
	        var y = this.needleVector.endy;

	        if (x > centerX && y <= centerY) {
	            theta = Math.atan((centerY - y)  / (x - centerX));
	                  
	        }
	        else if (x > centerX && y > centerY) {
	            theta = Math.atan((centerY - y)
	                    /(x - centerX))
	                    + 2 * Math.PI;
	        }
	        else if (x < centerX) {
	            theta = Math.atan((centerY - y)
	                    / (x - centerX))
	                    + Math.PI;
	        }
	        else if (x == centerX && y < centerY) {
	            theta = Math.PI / 2;
	        }
	        else if (x == centerX && y > centerY) {
	            theta = 3 * Math.PI / 2;
	        }

	        this.needleGeometry.theta = JenScript.Math.toDegrees(theta);
	    },

	    /**
	     * paint translate compass
	     * 
	     * @param {Object} g2d
	     */
	    paintTranslateCompass : function(g2d) {
	    	var currentFolder = this.getWidgetFolder();
	    	if(currentFolder === undefined){
	    		//console.log("compass widget folder is undefined");
	    		return;
	    	}
	    	
	        this.solveCompass();
	        var g = this.compassGeometry;
	        var n = this.needleGeometry;
	        
	        var innerRing = new JenScript.SVGPath()
	        								.moveTo((g.centerX-g.outerRadius),g.centerY)
	        								.arcTo(g.outerRadius,g.outerRadius,0,1,1,(g.centerX+g.outerRadius),g.centerY)
	        								.arcTo(g.outerRadius,g.outerRadius,0,1,1,(g.centerX-g.outerRadius),g.centerY)
	        								.moveTo((g.centerX-g.innerRadius),g.centerY)
	        								.arcTo(g.innerRadius,g.innerRadius,0,1,1,(g.centerX+g.innerRadius),g.centerY)
	        								.arcTo(g.innerRadius,g.innerRadius,0,1,1,(g.centerX-g.innerRadius),g.centerY)
	        								.attr('fill-rule','evenodd')
	        								//.attr('fill-rule','nonzero')
	        								
	        								.strokeNone()
	        								.fill(this.ringFillColor)
	        								.fillOpacity(this.ringFillOpacity)
	        								.close();

	        var delta1 = 2;// 10;
	        var delta2 = 8;// 4;
	        var alphaProjection = 18;
	        var theta = n.theta;
	        var X = (g.outerRadius + delta2)* Math.cos(JenScript.Math.toRadians(theta));
	        var Y = (g.outerRadius + delta2)* Math.sin(JenScript.Math.toRadians(theta));
	        var x1 = (g.innerRadius + delta1)* Math.cos(JenScript.Math.toRadians(theta-alphaProjection));
	        var y1 = (g.innerRadius + delta1)* Math.sin(JenScript.Math.toRadians(theta-alphaProjection));
	        var x2 = (g.innerRadius + delta1)* Math.cos(JenScript.Math.toRadians(theta+alphaProjection));
	        var y2 = (g.innerRadius + delta1)* Math.sin(JenScript.Math.toRadians(theta+alphaProjection));
           
	        var needle = new JenScript.SVGPath()
	        						.moveTo(g.centerX+X,g.centerY-Y)
	        						.lineTo(g.centerX+x2,g.centerY-y2)
									.lineTo(g.centerX+x1,g.centerY-y1)
									.strokeNone()
	        						.fill(this.ringFillColor)
	        						.strokeOpacity(this.ringDrawOpacity)
									.close();
	       var compassGroup = new JenScript.SVGGroup().Id(this.Id);
	       g2d.deleteGraphicsElement(this.Id);
	       compassGroup.child(innerRing.toSVG()).child(needle.toSVG());
		   g2d.insertSVG(compassGroup.toSVG());


	    },

	   paintWidget : function(g2d) {
	        if (this.getHost()!==undefined && this.getHost().isLockTranslate()) {
	        	//console.log('paint translate compass for proj : '+this.getHost().getProjection().name);
	            this.paintTranslateCompass(g2d);
	        }
	    },
	});
})();