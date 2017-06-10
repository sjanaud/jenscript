// JenScript - 1.3.2 2017-06-10
// http://jenscript.io - Copyright 2017 Sébastien Janaud. All Rights reserved

(function(){
	
	JenScript.TranslateMode = function(mode) {
		this.mode = mode.toLowerCase();
		
		this.isTx= function(){
			return (this.mode === 'x' || this.mode === 'tx' || this.mode === 'translatex');
		};
		this.isTy= function(){
			return (this.mode === 'y' || this.mode === 'ty' || this.mode === 'translatey');
		};
		this.isTxy= function(){
			return (this.mode === 'xy' || this.mode === 'txy' || this.mode === 'translatexy');
		};
	};
	
	JenScript.TranslatePlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TranslatePlugin, JenScript.Plugin);

	JenScript.Model.addMethods(JenScript.TranslatePlugin, {
		_init : function(config){
			config = config ||{};
			config.name = (config.name !== undefined)?config.name:'TranslatePlugin';
			config.selectable = true;
			config.priority = 1000;
			this.slaves = (config.slaves !== undefined)? config.slaves : [];
			this.translateListeners = [];
			
			this.lockTranslate = false;
			
			//translate points
			this.translateStartX;
			this.translateStartY;
			this.translateCurrentX;
			this.translateCurrentY;
			this.translateDx=0;
			this.translateDy=0;
			
			this.mode = (config.mode !== undefined)? new JenScript.TranslateMode(config.mode) : new JenScript.TranslateMode('xy');
			
			
			JenScript.Plugin.call(this, config);
			
			this.semanticX = 0;
			this.semanticY = 0;
			this.shifting = false;
			
		},
		
		getTranslateDx : function(){
			return this.translateDx;
		},
		
		getTranslateDy : function(){
			return this.translateDy;
		},
		
		isLockTranslate : function(){
			return this.lockTranslate;
		},
		
		/**
		 * check translate authorization by checking input event
		 * should be use only from press,release handler
		 * 
		 * part should be 'Device'
		 * plugin is selected
		 * plugin is not passive
		 * evt button code is 'LEFT'
		 * location x,y is not sensible shape
		 */
		isTranslateAuthorized : function(evt,part,x,y){
			//console.log("Translate authorized "+this.name+" flags : "+ " select "+this.isLockSelected()+", sensible : "+this.isWidgetSensible(x,y) +", passive :"+this.isLockPassive())
			return ((part === JenScript.ViewPart.Device) && this.isLockSelected() && !this.isLockPassive() && !this.isWidgetSensible(x,y));
		},
		
		onPress : function(evt,part,x, y) {
			//mozilla, prevent Default to enable dragging correctly
			if(evt.preventDefault){
				evt.preventDefault();
			}
					
			if(this.isTranslateAuthorized(evt,part,x,y)){
				//console.log('Translate authorize to start : '+this.Id+" proj "+this.getProjection().name);
				this.startTranslate(new JenScript.Point2D(x,y));
			}else{
				//console.log('Translate NOT authorize to start : '+this.Id);
			}
		},
		
		/**
		 * translate release handler
		 * @param {Object} evt
		 * @param {String} part
		 * @param {Number} x
		 * @param {Number} y
		 */
		onRelease : function(evt,part,x, y) {
			if(this.isTranslateAuthorized(evt,part,x,y)){
				this.stopTranslate(new JenScript.Point2D(x,y));
			}else{
				//console.log('release translate not authorize to stop : '+this.Id);
			}
		},
		
		/**
		 * translate exit handler
		 * @param {Object} evt
		 * @param {String} part
		 * @param {Number} x
		 * @param {Number} y
		 */
		onExit : function(evt,part,x, y) {
			this.stopTranslate(new JenScript.Point2D(x,y));
		},
		
		/**
		 * authorize bound translate only if translate is lock
		 */
		onMove : function(evt,part,x, y) {
			//mozilla, prevent Default to enable dragging correctly
			if(evt.preventDefault){
				evt.preventDefault();
			}
			if (this.isTranslateAuthorized(evt,part,x,y) && this.lockTranslate) {
				this.boundTranslate(new JenScript.Point2D(x,y));
			}else{
				////console.log('move translate not authorize to bound : '+this.Id);
			}
		},
		
		/**
	     * start translate operation at the specified device point and lock translate
	     * @param {Object} startDevice
	     *            the start point of device translate
	     */
	    startTranslate  :function(startDevice) {
	    	//console.log('translate start '+this.name+", device start point : "+startDevice);
	    	this.lockTranslate = true;
			this.translateStartX = startDevice.x;
			this.translateStartY = startDevice.y;
		    this.fireTranslateEvent('start');
	    },
	    
	    /**
	     * stop geometric translate operation at the specified device point and release lock translate
	     * @param {Object} endDevice
	     *            the end point of device translate
	     */
	    stopTranslate : function(endDevice) {
	    	if(this.isLockTranslate()){
	    		//console.log("stop translate"+this.sequenceBounds.length);

			    var proj = this.getProjection();
			    var w = proj.getPixelWidth();
			    var h = proj.getPixelHeight();
	
			    var pMinXMinYDevice = {x:- this.semanticX, y: (h - this.semanticY)};
			    var pMaxXMaxYDevice = {x: (w - this.semanticX),y: - this.semanticY};
	
			    var pMinXMinYUser = proj.pixelToUser(pMinXMinYDevice);
			    var pMaxXMaxYUser = proj.pixelToUser(pMaxXMaxYDevice);
			   
			    proj.bound(pMinXMinYUser.x, pMaxXMaxYUser.x, pMinXMinYUser.y, pMaxXMaxYUser.y);
	    		
	    		for (var s = 0; s < this.slaves.length; s++) {
	 				var plugin = this.slaves[s].plugin;
	 				plugin.resetTransform();
	 		    }
	    		this.semanticX = 0;
	 			this.semanticY = 0;
	    		//console.log('translate stop '+this.name+", device stop point : "+endDevice);
	    		
	 			this.translateCurrentX = endDevice.x;
			    this.translateCurrentY = endDevice.y;
			    this.lockTranslate = false;
		    	this.fireTranslateEvent('stop');
	    	}
		},
		
	    /**
	     * add translate listener with given action
	     * 
	     * start : when translate get press, create start translate transaction
	     * bound : when translate get drag and bound projection with (dx,dy) tuple translate
	     * stop : when translate release, transaction is immediately stop
	     * 
	     * @param {String}   translate action event type like start, stop, translate, finish, L2R, B2T
	     * @param {Function} listener
	     * @param {String}   listener owner name
	     */
		addTranslateListener  : function(actionEvent,listener,name){
			if(name === undefined)
				throw new Error('Translate listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener,name:name};
			this.translateListeners[this.translateListeners.length] =l;
		},
		
		/**
		 * fire listener when translate is being to start, stop, translate,finish L2R, and B2T
		 */
		fireTranslateEvent : function(actionEvent){
			for (var i = 0; i < this.translateListeners.length; i++) {
				var l = this.translateListeners[i];
				if(actionEvent === l.action){
					l.onEvent(this);
				}
			}
		},
			
		/**
		 * shift to the given direction
		 * @param {String} direction, West, East, North, South
		 */
		shift : function(direction, sample) {
			    if(this.shifting) return;
				this.lockPassive = true;
				this.shifting = true;
		        var that = this;
		        if(sample === undefined){
		        	sample  = {step : 5, sleep : 5 , fraction : 20};
		        }
		        var step = (sample.step !== undefined)?sample.step : 5;
                var sleep = (sample.sleep !== undefined)?sample.sleep : 5;
                var fraction = (sample.fraction !== undefined)?sample.fraction : 20;
                
                var deltaY = this.getProjection().getPixelHeight() / fraction;
                var deltaX = this.getProjection().getPixelWidth() / fraction;
                var dx = 0;
                var dy = 0;
                if (direction == 'North')
                	dy = deltaY;
                if (direction == 'South')
                	dy = -deltaY;
                if (direction == 'West')
                	dx = deltaX;
                if (direction == 'East')
                	dx = -deltaX;
                var ox = 0;
                var oy = 0;
                var execute  = function(i,success){
                	setTimeout(function(){
                		ox = ox + dx/step;
                        oy = oy + dy/step;
                		that.boundTranslate(new JenScript.Point2D(ox,oy));
                		success(i);
                	},i*sleep);
                	
                };
                this.startTranslate(new JenScript.Point2D(ox,oy));
                
                for (var i =0 ; i <= step ; i++) {
                	execute(i,function success(rank){
                				if(rank === step){
                					that.lockPassive = false;
                					that.shifting = false;
                					that.stopTranslate(new JenScript.Point2D(ox,oy));
                				}
                			});
                }
	    },
		
		/**
		 * bound translate points with given device point
		 * @param {Object} device point
		 */
		boundTranslate : function(currentDevice) {
			//console.log('translate bound '+this.name+", device point : "+currentDevice);
			this.translateCurrentX = currentDevice.x;
			this.translateCurrentY = currentDevice.y;
		    
			var	deltaDeviceX = this.translateCurrentX - this.translateStartX;
			var	deltaDeviceY = this.translateCurrentY - this.translateStartY;
			
			if(this.mode.isTx()){
				deltaDeviceY = 0;
			}
			else if(this.mode.isTy()){
				deltaDeviceX = 0;
			}
			
			this.processSemanticTranslate(deltaDeviceX, deltaDeviceY);
			this.translateStartX = this.translateCurrentX;
			this.translateStartY = this.translateCurrentY;
			this.fireTranslateEvent('bound');
		},

		/**
		 * process semantic translate with given delta pixel dx and dy
		 * @param {Number} dx
		 * @param {Number} dy
		 */
		processSemanticTranslate : function(dx,dy) {
			this.translateDx = dx;
		    this.translateDy = dy;
			
			this.semanticX = this.semanticX+dx;
			this.semanticY = this.semanticY+dy;
		    for (var s = 0; s < this.slaves.length; s++) {
				var plugin = this.slaves[s].plugin;
				var direction = this.slaves[s].direction;

				if(direction === 'x')
					plugin.translate(plugin.tx+dx,plugin.ty);
				if(direction === 'y')
					plugin.translate(plugin.tx,plugin.ty+dy);
				if(direction === 'xy')
					plugin.translate(plugin.tx+dx,plugin.ty+dy);
		    }
		},
		
		/**
		 * process geometric translate with given delta pixel dx and dy
		 * @param {Number} dx
		 * @param {Number} dy
		 */
		processGeometricTranslate : function(dx,dy) {
			
			this.translateDx = dx;
		    this.translateDy = dy;
		    var proj = this.getProjection();
		    if (proj === undefined) {
		        return;
		    }
		    var w = proj.getPixelWidth();
		    var h = proj.getPixelHeight();

		    var pMinXMinYDevice = {x:-dx, y: (h - dy)};
		    var pMaxXMaxYDevice = {x: (w - dx),y: -dy};

		    var pMinXMinYUser = proj.pixelToUser(pMinXMinYDevice);
		    var pMaxXMaxYUser = proj.pixelToUser(pMaxXMaxYDevice);

		    proj.bound(pMinXMinYUser.x, pMaxXMaxYUser.x, pMinXMinYUser.y, pMaxXMaxYUser.y);
		},
		
		onProjectionRegister : function(){
		},
		
	});
	
})();
(function(){
	JenScript.TranslatePad = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TranslatePad, JenScript.AbstractBackwardForwardPadWidget);
	JenScript.Model.addMethods(JenScript.TranslatePad,{
		___init: function(config){
			config = config || {};
			config.Id = 'translate_pad'+JenScript.sequenceId++;
			config.width=64;
			config.height=64;
			config.xIndex=60;
			config.yIndex=100;
			
			JenScript.AbstractBackwardForwardPadWidget.call(this,config);
			
		    /** theme color to fill pad base */
		    this.baseFillColor = 'black';
		    /** theme color to draw pad base */
		    this.baseStrokeColor = '#f39c12';
		    /** stroke width to draw pad base */
		    this.baseStrokeWidth = 1;
		    /** theme color to fill pad control */
		   // this.controlFillColor = 'rgba(250,0,0,0.4)';
		    /** theme color to draw pad control */
		    this.controlStrokeColor = '#2980b9';
		    /** stroke width to draw pad control */
		    this.controlStrokeWidth =1;
		    /** button fill color */
		    this.buttonFillColor = '#2ecc71';
		    /** button rollover fill color */
		    this.buttonRolloverFillColor = '#f39c12';
		    /** button stroke color */
		    this.buttonStrokeColor =  '#8e44ad';
		    /** button rollover stroke color */
		    this.buttonRolloverStrokeColor ='#f39c12';
		    /** button stroke */
		    this.buttonStrokeWidth =1;
		},
		
		
	    onNorthButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('North');
	    },
	  
	    onSouthButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('South');
	    },

	    onWestButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('West');
	    },

	    onEastButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('East');
	    },
	    
	    onRegister : function(){
	    	this.attachPluginLockUnlockFactory('Tranlate Pad widget factory');
	    }
	});
})();
(function(){
	JenScript.TranslateX = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TranslateX, JenScript.AbstractBackwardForwardBarWidget);
	JenScript.Model.addMethods(JenScript.TranslateX,{
		___init: function(config){
			config = config || {};
			config.name = 'TranslateWidgetX';
			config.Id = 'translate_tx'+JenScript.sequenceId++;
			config.width=(config.width !== undefined)?config.width:100;
			config.height=(config.height !== undefined)?config.height:16;
			config.xIndex=(config.xIndex !== undefined)?config.xIndex:2;
			config.yIndex=(config.yIndex !== undefined)?config.yIndex:100;
			config.barOrientation = 'Horizontal';
			JenScript.AbstractBackwardForwardBarWidget.call(this,config);
		    this.sample = (config.sample !== undefined)?config.sample : {step : 40, sleep : 10,fraction : 3};
		    this.setOrphanLock(true);
		},
	    onButton1Press : function() {
	        this.getHost().shift('West', this.sample);
	    },
	    onButton2Press : function() {
	        this.getHost().shift('East', this.sample);
	    },
	    
	    onRegister : function(){
	    	//this.attachPluginLockUnlockFactory('TranlateX widget factory');
	    	//this.attachViewActivePassiveFactory('TranlateX widget factory');
	    	//this.attachLayoutFolderFactory('TranlateX widget factory');
	    }
	});
})();
(function(){
	JenScript.TranslateY = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TranslateY, JenScript.AbstractBackwardForwardBarWidget);
	JenScript.Model.addMethods(JenScript.TranslateY,{
		___init: function(config){
			config = config || {};
			config.name = 'TranslateWidgetY';
			config.Id = 'translate_ty'+JenScript.sequenceId++;
			config.width=(config.width !== undefined)?config.width:16;
			config.height=(config.height !== undefined)?config.height:100;
			config.xIndex=(config.xIndex !== undefined)?config.xIndex:100;
			config.yIndex=(config.yIndex !== undefined)?config.yIndex:1;
			config.barOrientation = 'Vertical';
			JenScript.AbstractBackwardForwardBarWidget.call(this,config);
		    this.sample = (config.sample !== undefined)?config.sample : {step : 40, sleep : 10,fraction : 3};
		    this.setOrphanLock(true);
		},
		
		
	    onButton1Press : function() {
	        this.getHost().shift('North', this.sample);
	    },
	    
	    onButton2Press : function() {
	        this.getHost().shift('South', this.sample);
	    },
	    
	    onRegister : function(){
	    	//this.attachPluginLockUnlockFactory('TranlateY widget factory');
	    	//this.attachViewActivePassiveFactory('TranlateY widget factory');
	    	//this.attachLayoutFolderFactory('TranlateY widget factory');
	    }
		
	});
})();
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
(function(){
	JenScript.TranslateSynchronizer = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.TranslateSynchronizer,{
		init: function(config){
			/** the translate plug ins to synchronize */
		    this.translateList =[];
		    /** dispatchingEvent flag */
		    this.dispathingEvent = false;
		    
		    var translates = config.translates;
		    
		    if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < translates.length; i++) {
	            	var that = this;
	            	translates[i].addTranslateListener('start',function (plugin){that.translateStarted(plugin);},' Translate synchronizer, start listener');
	            	translates[i].addTranslateListener('bound',function (plugin){that.bound(plugin);},' Translate synchronizer, bound listener');
	            	translates[i].addTranslateListener('stop',function (plugin){that.translateStoped(plugin);},' Translate synchronizer, stop listener');
	            	translates[i].addPluginListener('lock',function (plugin){that.pluginSelected(plugin);},'Translate Synchronizer plugin lock listener');
	            	translates[i].addPluginListener('unlock',function (plugin){that.pluginUnlockSelected(plugin);},'Translate Synchronizer plugin unlock listener');
	            	translates[i].addPluginListener('passive',function (plugin){that.pluginPassive(plugin);},'Translate Synchronizer plugin passive listener');
	            	translates[i].addPluginListener('unpassive',function (plugin){that.pluginUnpassive(plugin);},'Translate Synchronizer plugin unpassive listener');
	                this.translateList[this.translateList.length] = translates[i];
	            }
	            this.dispathingEvent = false;
	        }
		},
		
		pluginPassive : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.translateList.length; i++) {
					var plugin = this.translateList[i];
					if (plugin.Id !== source.Id) {
	                    plugin.passive();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
		    
	    pluginUnpassive : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.translateList.length; i++) {
					var plugin = this.translateList[i];
					if (plugin.Id !== source.Id) {
	                    plugin.unpassive();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
	
	    pluginSelected : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.translateList.length; i++) {
					var plugin = this.translateList[i];
					if (plugin.Id !== source.Id) {
	                    plugin.select();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
    
	    pluginUnlockSelected : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.translateList.length; i++) {
					var plugin = this.translateList[i];
					if (plugin.Id !== source.Id) {
	                    plugin.unselect();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
   
	    translateL2RChanged : function(source) {
	    },
	   
	    translateB2TChanged : function(source) {
	    },

	    translateStarted : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.translateList.length; i++) {
					var plugin = this.translateList[i];
	                if (plugin.Id !== source.Id) {
	                	//console.log('sync translate started : '+plugin.name+" for proj "+plugin.projection.name);
	                    plugin.startTranslate(new JenScript.Point2D(source.translateStartX,source.translateStartY));
	                }
	            }
	            this.dispathingEvent = false;
	        }
	    },

	    bound : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.translateList.length; i++) {
					var plugin = this.translateList[i];
					 if (plugin.Id !== source.Id) {
						 //console.log('sync translate bound : '+plugin.name+" for proj "+plugin.projection.name);
						 plugin.boundTranslate(new JenScript.Point2D(source.translateCurrentX,source.translateCurrentY));
						
	                 }
	            }
	            this.dispathingEvent = false;
	        }
	    },
	    
    
	    translateStoped : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.translateList.length; i++) {
					var plugin = this.translateList[i];
					 if (plugin.Id !== source.Id) {
							//console.log('sync translate stop : '+plugin.name+" for proj "+plugin.projection.name);
	                    plugin.stopTranslate(new JenScript.Point2D(source.translateCurrentX,source.translateCurrentY));
	                 }
	            }
	            this.dispathingEvent = false;
	        }
	    }
	});
})();