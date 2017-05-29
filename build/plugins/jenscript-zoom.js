// JenScript -  JavaScript HTML5/SVG Library
// version : 1.3.1
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-05-29
// All Rights reserved

(function(){
	
	JenScript.ZoomBoxMode = function(mode) {
		this.mode = mode.toLowerCase();
		
		this.isBx= function(){
			return (this.mode === 'x' || this.mode === 'bx' || this.mode === 'box');
		};
		this.isBy= function(){
			return (this.mode === 'y' || this.mode === 'by' || this.mode === 'boy');
		};
		this.isBxy= function(){
			return (this.mode === 'xy' || this.mode === 'bxy' || this.mode === 'boxxy');
		};
	};
	
	JenScript.ZoomBoxPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ZoomBoxPlugin, JenScript.Plugin);
	
	JenScript.Model.addMethods(JenScript.ZoomBoxPlugin, {
		
		_init : function(config){
			config = config || {};
			
			config.name = (config.name !== undefined)?config.name:'ZoomBoxPlugin';
			config.selectable = true;
			config.priority = 1000;
			this.slaves = (config.slaves !== undefined)? config.slaves : [];
			this.zoomBoxDrawColor = config.zoomBoxDrawColor ;
			this.zoomBoxFillColor = config.zoomBoxFillColor;
			this.mode = (config.mode !== undefined) ? new JenScript.ZoomBoxMode(config.mode) : new JenScript.ZoomBoxMode('xy');

		    this.minimalDelatX = 16;
		    this.minimalDeltaY = 16;
			this.drag = false;
			this.lockEffect = false;
			this.lockZoomingTransaction = false;
			this.zoomBoxStartX;
			this.zoomBoxStartY;
			this.zoomBoxCurrentX;
			this.zoomBoxCurrentY;
			this.zoomFxBoxStartX;
			this.zoomFxBoxStartY;
			this.zoomFxBoxCurrentX;
			this.zoomFxBoxCurrentY;
			this.boxHistory = [];
			this.maxHistory = 8;
			this.forwardBound;
			this.boxListeners = [];
			
			this.factor = (config.factor !== undefined)? config.factor : 1.1;
			this.historyIndex = 0;
			JenScript.Plugin.call(this,config);
		},

		/**
		 * when zoom box is being register in projection,
		 * attach 'bound change' listener that takes the responsibility to repaint cycle
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},that.toString());
		},
		
		/**
	     * fire translate start to listener
	     */
		fireEvent : function(actionEvent){
			for(var i = 0 ;i<this.boxListeners.length;i++){
				var l = this.boxListeners[i];
				if(l.action === actionEvent)
					l.onEvent(this);
			}
		},
		
		 /**
	     * add zoom box listener
	     * @param {String} action event type like start, stop, translate, L2R,B2T
	     * @param {Function} listener
	     */
		addBoxListener : function(actionEvent,listener) {
			var l={action:actionEvent,onEvent:listener};
			this.boxListeners[this.boxListeners.length] = l;
		},
		
		isBoxAuthorized : function(evt,part,x,y){
			return ((part === JenScript.ViewPart.Device) && this.isLockSelected() && !this.isLockPassive() && !this.isWidgetSensible(x,y));
		},

		onPress : function(evt,part,x,y) {
			//mozilla, prevent Default to enable dragging correctly
			if(evt.preventDefault){
				evt.preventDefault();
			}
			this.lockZoomingTransaction = false;
			this.lockEffect = false;
			this.drag = true;
			if(this.isBoxAuthorized(evt,part,x,y)){
				this.processZoomStart(new JenScript.Point2D(x,y));
			}
			
		},
		
		
		 processZoomFinish : function() {
			 this.lockEffect=false;
			 this.lockZoomingTransaction = false;
			 this.repaintPlugin();
			 this.fireEvent('boxFinish');
		 },
		
		/**
	     * start parameters for a start bound zoom box
	     * 
	     * @param startBox
	     *            box start device point coordinate
	     */
	    processZoomStart : function(startBox) {
	    	if(this.boxHistory.length === 0){
	    		this.createHistory();
	    	}
            this.zoomBoxStartX = startBox.getX();
            this.zoomBoxStartY = startBox.getY();
            this.zoomBoxCurrentX = this.zoomBoxStartX;
            this.zoomBoxCurrentY = this.zoomBoxStartY;
            
            this.zoomFxBoxStartX = 0;
			this.zoomFxBoxStartY = 0;
			this.zoomFxBoxCurrentX = 0;
			this.zoomFxBoxCurrentY = 0;

	        this.fireEvent('boxStart');

	        this.lockZoomingTransaction = true;
	    },
		
		onRelease : function(evt,part,x, y) {
			//if(part !== JenScript.ViewPart.Device) return;
			this.drag = false;
			if (this.lockZoomingTransaction){
				if (this.isForwardCondition()) {
					this.processZoomOut();
				} else if (this.isValidateBound()) {
					this.processZoomIn();
				}else{
					this.processZoomFinish();
				}
			}else{
				this.processZoomFinish();
			}
			this.repaintPlugin();
		},
		
		onMove : function(evt,part,deviceX, deviceY) {
			if(part !== JenScript.ViewPart.Device) return;
			if (this.drag) {
				this.isBoxAuthorized(evt,part,deviceX,deviceY);
				this.processZoomBound(new JenScript.Point2D(deviceX,deviceY));
				this.repaintPlugin();
			}
		},
		
		/**
	     * bound zoom box for the current specified coordinate in the current transaction
	     * 
	     * @param currentBox
	     *
	     */
	    processZoomBound : function(currentBox) {
	        this.zoomBoxCurrentX = currentBox.getX();
	        this.zoomBoxCurrentY = currentBox.getY();
	        this.fireEvent('boxBound');
	    },
		
		isValidateBound : function() {
			 if (this.mode.isBxy()) {
		            if (this.zoomBoxCurrentX > this.zoomBoxStartX + this.minimalDelatX
		                    && this.zoomBoxCurrentY > this.zoomBoxStartY + this.minimalDeltaY) {
		                return true;
		            }
		        }
		        else if (this.mode.isBx()) {
		            if (this.zoomBoxCurrentX > this.zoomBoxStartX + this.minimalDelatX) {
		                return true;
		            }
		        }
		        else if (this.mode.isBy()) {
		            if (this.zoomBoxCurrentY > this.zoomBoxStartY + this.minimalDeltaY) {
		                return true;
		            }
		        }
		        return false;
		},

		isForwardCondition : function() {
			if (this.mode.isBxy()) {
				if (this.zoomBoxCurrentX < this.zoomBoxStartX
						|| this.zoomBoxCurrentY < this.zoomBoxStartY) {
					return true;
				}else{
				}
			} else if (this.mode.isBx()) {
				if (this.zoomBoxCurrentX < this.zoomBoxStartX) {
					return true;
				}
			} else if (this.mode.isBy()) {
				if (this.zoomBoxCurrentY < this.zoomBoxStartY) {
					return true;
				}
			}
			return false;
		},
		
		processZoomOut : function() {
			if(this.forwardBound === undefined) return;
			var bound = this.forwardBound;
			this.getProjection().bound(bound.minx,bound.maxx,bound.miny,bound.maxy);
			this.fireEvent('boxOut');
		},
		
		processZoomIn : function() {
			this.lockEffect=true;
			
			var deviceStart = {
				x : this.zoomBoxStartX,
				y : this.zoomBoxStartY
			};
			var deviceCurrent = {
				x : this.zoomBoxCurrentX,
				y : this.zoomBoxCurrentY
			};
			var proj = this.getProjection();
			
			this.forwardBound = {
					minx : proj.minX,
					maxx : proj.maxX,
					miny : proj.minY,
					maxy : proj.maxY
			};
			
			this.zoomFxBoxStartX = this.zoomBoxStartX;
			this.zoomFxBoxStartY = this.zoomBoxStartY;
			this.zoomFxBoxCurrentX = this.zoomBoxCurrentX;
			this.zoomFxBoxCurrentY = this.zoomBoxCurrentY;
			
			var userStartPoint = proj.pixelToUser(deviceStart);
			var userCurrentPoint = proj.pixelToUser(deviceCurrent);
			
			var iMinx = proj.minX;
			var iMaxx = proj.maxX;
			var iMiny = proj.minY;
			var iMaxy = proj.maxY;
			
			var stepCount =  10;
			var deltaMinx = Math.abs(proj.minX - userStartPoint.x) / stepCount;
			var deltaMaxx = Math.abs(proj.maxX - userCurrentPoint.x) / stepCount;
			var deltaMiny = Math.abs(proj.minY - userCurrentPoint.y) / stepCount;
			var deltaMaxy = Math.abs(proj.maxY - userStartPoint.y) / stepCount;

			var fxDeltaPixelMinx = Math.abs(proj.userToPixelX(deltaMinx)
					- proj.userToPixelX(0));
			var fxDeltaPixelMaxx = Math.abs(proj.userToPixelX(deltaMaxx)
					- proj.userToPixelX(0));
			var fxDeltaPixelMiny = Math.abs(proj.userToPixelY(deltaMiny)
					- proj.userToPixelY(0));
			var fxDeltaPixelMaxy = Math.abs(proj.userToPixelY(deltaMaxy)
					- proj.userToPixelY(0));

			var speedMillis = 5;
			
			var scaleFactorX =   Math.abs((proj.maxX-proj.minX)/(userCurrentPoint.x-userStartPoint.x));
			var scaleFactorY =   Math.abs((proj.maxY-proj.minY)/(userCurrentPoint.y-userStartPoint.y));
			
			var that = this;
			that.zoomBack = [];
			var count=0;
			for (var i = 1; i <= stepCount; i++) {
				_p(i, function callback(rank,bound) {
					that.repaintPlugin();
					if (rank === stepCount) {
						setTimeout(function(){
							that.getProjection().bound(bound[0],bound[1],bound[2],bound[3]);
							that.createHistory();
							for (var s = 0; s < that.slaves.length; s++) {
								var plugin = that.slaves[s];
								plugin.resetTransform();
								plugin.repaintPlugin();
						    }
							that.processZoomFinish();
						},30);
					}
				});
			}
			this.fireEvent('boxIn');
			
			function _p(i, callback) {
				var millis = speedMillis * (i-1);
				setTimeout(function() {
					
					that.lockZoomingTransaction = true;
					var m1=0,m2=0,m3=0,m4=0;
					if(that.mode.isBxy()){
						m1 = iMinx + deltaMinx * i;
						m2 = iMaxx - deltaMaxx * i;
						m3 = iMiny + deltaMiny * i;
						m4 = iMaxy - deltaMaxy * i;
						that.zoomFxBoxStartX = that.zoomBoxStartX - fxDeltaPixelMinx * i;
						that.zoomFxBoxStartY = that.zoomBoxStartY - fxDeltaPixelMaxy * i;
						that.zoomFxBoxCurrentX = that.zoomBoxCurrentX + fxDeltaPixelMaxx* i;
						that.zoomFxBoxCurrentY = that.zoomBoxCurrentY + fxDeltaPixelMiny* i;
					}
					else if(that.mode.isBx()){
						m1 = iMinx + deltaMinx * i;
						m2 = iMaxx - deltaMaxx * i;
						m3 = proj.getMinY();
						m4 = proj.getMaxY();
						that.zoomFxBoxStartX = that.zoomBoxStartX - fxDeltaPixelMinx * i;
						that.zoomFxBoxStartY = 0;
						that.zoomFxBoxCurrentX = that.zoomBoxCurrentX + fxDeltaPixelMaxx* i;
						that.zoomFxBoxCurrentY = that.getProjection().getPixelHeight();
					}
					else if(that.mode.isBy()){
						m1 = proj.getMinX();
						m2 = proj.getMaxX();
						m3 = iMiny + deltaMiny * i;
						m4 = iMaxy - deltaMaxy * i;
						that.zoomFxBoxStartX = 0;
						that.zoomFxBoxStartY = that.zoomBoxStartY - fxDeltaPixelMaxy * i;
						that.zoomFxBoxCurrentX = that.getProjection().getPixelWidth();
						that.zoomFxBoxCurrentY = that.zoomBoxCurrentY + fxDeltaPixelMiny* i;
					}
					
					var initcenterX = deviceStart.x + (deviceCurrent.x-deviceStart.x)/2;
					var initcenterY = deviceStart.y + (deviceCurrent.y-deviceStart.y)/2;
					
					var deltaX = (initcenterX - proj.getPixelWidth()/2)/stepCount;
					var deltaY = (initcenterY - proj.getPixelHeight()/2)/stepCount;
					
					
					var deltaSx = (scaleFactorX-1)/stepCount;
					var deltaSy = (scaleFactorY-1)/stepCount;
					
					for (var s = 0; s < that.slaves.length; s++) {
							var plugin = that.slaves[s];
							
							if(that.mode.isBx()){
								deltaSy = 0;
								console.log("is bx");
							}
							else if(that.mode.isBy()){
								deltaSx = 0;
							}
							plugin.translate(-(initcenterX)*(plugin.sx+deltaSx-1), -(initcenterY)*(plugin.sy+deltaSy-1));
							plugin.scale(plugin.sx+deltaSx,plugin.sy+deltaSy);
							plugin.translate(plugin.tx-deltaX*i,plugin.ty-deltaY*i);
					 }
					callback(i,[m1,m2,m3,m4]);
				}, millis);
			}
		},
		
		createHistory : function(){
			var proj = this.getProjection();
			this.boxHistory[this.boxHistory.length] = {
					minx : proj.minX,
					maxx : proj.maxX,
					miny : proj.minY,
					maxy : proj.maxY
				};
			this.historyIndex = this.boxHistory.length - 1;
		},
		
		
		backHistory : function() {
			if(this.boxHistory.length > 0){
				if(this.historyIndex-1 < 0)
					this.historyIndex = this.boxHistory.length;
				this.processHistory('backHistory',(this.historyIndex-1));
			}
		},
		
		nextHistory : function() {
			if(this.boxHistory.length > 0){
				if(this.historyIndex+1 >= this.boxHistory.length)
					this.historyIndex = -1;
				this.processHistory('nextHistory',(this.historyIndex+1));
			}
		},
		
		processHistory : function(nature,index) {
			var b = this.boxHistory[index];
			this.getProjection().bound(b.minx,b.maxx,b.miny,b.maxy);
			this.historyIndex = index;
			this.fireEvent(nature);
		},
		
		paintMarker : function(g2d, part) {
			//todo paint markers near axis
		},
		
		paintTarget : function(g2d, part) {
			var zoomBoxWidth = this.zoomBoxCurrentX - this.zoomBoxStartX;
			var zoomBoxHeight = this.zoomBoxCurrentY - this.zoomBoxStartY;
			var bx=0,by=0,bw=0,bh=0;
			if (this.mode.isBxy()) {
	            bx = this.zoomBoxStartX;
	            by = this.zoomBoxStartY;
	            bw = zoomBoxWidth;
	            bh = zoomBoxHeight;
	        }
	        else if (this.mode.isBx()) {
	        	bx = this.zoomBoxStartX;
	            by = 0;
	            bw = zoomBoxWidth;
	            bh = this.getProjection().getPixelHeight();
	        }
	        else if (this.mode.isBy()) {
	        	bx = 0;
	            by = this.zoomBoxStartY;
	            bw = this.getProjection().getPixelWidth();
	            bh = zoomBoxHeight;
	        }
			var fillColor = (this.zoomBoxFillColor !== undefined) ?this.zoomBoxFillColor: this.getProjection().getThemeColor();
			var drawColor = (this.zoomBoxDrawColor !== undefined) ?this.zoomBoxDrawColor: this.getProjection().getThemeColor();
			var box = new JenScript.SVGRect().origin(bx,by)
											.size(bw,bh)
											.strokeWidth(0.5)
											.stroke(drawColor)
											.fillOpacity(0.2)
											.strokeOpacity(0.8)
											.fill(fillColor)
											.toSVG();
			g2d.insertSVG(box);
		 },
		 
		 paintZoomIn : function(g2d, part) {
			var zoomFxBoxWidth = this.zoomFxBoxCurrentX - this.zoomFxBoxStartX;
			var zoomFxBoxHeight = this.zoomFxBoxCurrentY - this.zoomFxBoxStartY;
			var fillColor = (this.zoomBoxFillColor !== undefined) ?this.zoomBoxFillColor: this.getProjection().getThemeColor();
			var drawColor = (this.zoomBoxDrawColor !== undefined) ?this.zoomBoxDrawColor: this.getProjection().getThemeColor();
			var box = new JenScript.SVGRect().origin(this.zoomFxBoxStartX,this.zoomFxBoxStartY)
												.size(zoomFxBoxWidth,zoomFxBoxHeight)
												.strokeWidth(0.5)
												.stroke(drawColor)
												.fillOpacity(0.2)
												.strokeOpacity(0.8)
												.fill(fillColor)
												.toSVG();
											
			g2d.insertSVG(box);
		 },
		 
		 paintPlugin : function(g2d, part) {
				if(part === JenScript.ViewPart.Device && this.lockZoomingTransaction) {
					 if (!this.lockEffect && this.isValidateBound()) {
						this.paintTarget(g2d, part); 
					 }
					 else{
						 this.paintZoomIn(g2d);
					 }
				}else if(part !== JenScript.ViewPart.Device && this.lockZoomingTransaction) {
					this.paintMarker(g2d, part); 
				}
		},
		
	    /**
	     * get the zoom box start point in device coordinate
	     * 
	     * @return device start point
	     */
	    getBoxStartDevicePoint : function() {
	        return new JenScript.Point2D(this.zoomBoxStartX, this.zoomBoxStartY);
	    },

	    /**
	     * get Bound Box current device point
	     * 
	     * @return bound box current device point
	     */
	    getBoxCurrentDevicePoint : function() {
	        return new JenScript.Point2D(this.zoomBoxCurrentX,this.zoomBoxCurrentY);
	    },
	    
	    /**
	     * get the zoom box start point in user coordinate
	     * 
	     * @return device start point
	     */
	    getBoxStartUserPoint : function() {
	        return this.getProjection().pixelToUser(this.getBoxStartDevicePoint());
	    },

	    /**
	     * get Bound Box current user point
	     * 
	     * @return bound box current user point
	     */
	    getBoxCurrentUserPoint : function() {
	        return this.getProjection().pixelToUser(this.getBoxCurrentDevicePoint());
	    }
	});
	
	
})();
(function(){
	JenScript.ZoomBoxSynchronizer = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.ZoomBoxSynchronizer,{
		init: function(config){
			/** the box plugins to synchronize */
		    this.boxesList =[];
		    /** dispatchingEvent flag */
		    this.dispathingEvent = false;
		    
		    var boxes = config.boxes;
		    
		    if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < boxes.length; i++) {
	            	var that = this;
	            	boxes[i].addBoxListener('boxStart',function (plugin){that.boxStart(plugin);});
	            	boxes[i].addBoxListener('boxBound',function (plugin){that.boxBound(plugin);});
	            	boxes[i].addBoxListener('boxIn',function (plugin){that.boxIn(plugin);});
	            	boxes[i].addBoxListener('boxOut',function (plugin){that.boxOut(plugin);});
	            	boxes[i].addBoxListener('boxFinish',function (plugin){that.boxFinish(plugin);});
	            	boxes[i].addBoxListener('nextHistory',function (plugin){that.nextHistory(plugin);});
	            	boxes[i].addBoxListener('backHistory',function (plugin){that.backHistory(plugin);});
//	            	boxes[i].addBoxListener('boxClearHistory',function (plugin){that.translateB2TChanged(plugin);});
	            	boxes[i].addPluginListener('lock',function (plugin){that.pluginSelected(plugin);},'ZoomBox Synchronizer plugin lock listener');
	            	boxes[i].addPluginListener('unlock',function (plugin){that.pluginUnlockSelected(plugin);},'ZoomBox Synchronizer plugin unlock listener');
	            	boxes[i].addPluginListener('passive',function (plugin){that.pluginPassive(plugin);},'ZoomBox Synchronizer plugin passive listener');
	            	boxes[i].addPluginListener('unpassive',function (plugin){that.pluginUnPassive(plugin);},'ZoomBox Synchronizer plugin unpassive listener');
	                this.boxesList[this.boxesList.length] = boxes[i];
	            }
	            this.dispathingEvent = false;
	        }
		},
		
		
	
	    pluginSelected : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.boxesList.length; i++) {
					var plugin = this.boxesList[i];
					if (plugin.Id !== source.Id) {
						//console.log('sync lock box'+plugin.name);
	                    plugin.select();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
	    
	    pluginPassive : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.boxesList.length; i++) {
					var plugin = this.boxesList[i];
					if (plugin.Id !== source.Id) {
						console.log('sync passive box'+plugin.name);
	                    plugin.passive();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
	    
    
	    pluginUnlockSelected : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.boxesList.length; i++) {
					var plugin = this.boxesList[i];
					if (plugin.Id !== source.Id) {
						console.log('sync unpassive box'+plugin.name);
	                    plugin.unselect();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
	    
	    pluginUnPassive : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.boxesList.length; i++) {
					var plugin = this.boxesList[i];
					if (plugin.Id !== source.Id) {
						//console.log('sync lock box'+plugin.name);
	                    plugin.unpassive();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
	    
	    boxStart : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.boxesList.length; i++) {
					var plugin = this.boxesList[i];
					if (plugin.Id !== source.Id) {
						//console.log('sync start box'+plugin.name);
						var deviceBoxStartSource = source.getBoxStartDevicePoint();
	                    plugin.processZoomStart(deviceBoxStartSource);
	                    plugin.repaintPlugin();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
	    
	    boxBound : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.boxesList.length; i++) {
					var plugin = this.boxesList[i];
					if (plugin.Id !== source.Id) {
						//console.log('sync bound box'+plugin.name);
	                    var deviceBoxCurrentSource = source.getBoxCurrentDevicePoint();
	                    plugin.processZoomBound(deviceBoxCurrentSource);
	                    plugin.repaintPlugin();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
	    
	    boxIn : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.boxesList.length; i++) {
					var plugin = this.boxesList[i];
					if (plugin.Id !== source.Id) {
						//console.log('sync in box'+plugin.name);
	                    plugin.processZoomIn();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
	    
	    boxOut : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.boxesList.length; i++) {
					var plugin = this.boxesList[i];
					if (plugin.Id !== source.Id) {
	                    plugin.processZoomOut();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
	    
	    boxFinish : function(source) {
	    	 if (!this.dispathingEvent) {
		            this.dispathingEvent = true;
		            for (var i = 0; i < this.boxesList.length; i++) {
						var plugin = this.boxesList[i];
						if (plugin.Id !== source.Id) {
		                    plugin.processZoomFinish();
		                }
					}
		            this.dispathingEvent = false;
		        }
	    },
	    
	    nextHistory : function(source) {
	    	if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.boxesList.length; i++) {
					var plugin = this.boxesList[i];
					if (plugin.Id !== source.Id) {
	                    plugin.nextHistory();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
	    
	    backHistory : function(source) {
	    	if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.boxesList.length; i++) {
					var plugin = this.boxesList[i];
					if (plugin.Id !== source.Id) {
	                    plugin.backHistory();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
	    
	});
})();
(function(){
	JenScript.ZoomBoxWidget = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ZoomBoxWidget, JenScript.AbstractBackwardForwardBarWidget);
	JenScript.Model.addMethods(JenScript.ZoomBoxWidget,{
		___init: function(config){
			config = config || {};
			config.name = 'ZoomBoxHistory';
			config.Id = 'boxhistory'+JenScript.sequenceId++;
			config.width=(config.width !== undefined)?config.width:100;
			config.height=(config.height !== undefined)?config.height:16;
			config.xIndex=(config.xIndex !== undefined)?config.xIndex:2;
			config.yIndex=(config.yIndex !== undefined)?config.yIndex:100;
			config.barOrientation = 'Horizontal';
			JenScript.AbstractBackwardForwardBarWidget.call(this,config);
		    this.sample = (config.sample !== undefined)?config.sample : {step : 2, sleep: 100,fraction:5};
		    this.setOrphanLock(true);
		},
	    onButton1Press : function() {
	        this.getHost().backHistory();
	    },
	    onButton2Press : function() {
	    	 this.getHost().nextHistory();
	    },
	    
//	    onRegister : function(){
//	    	var that = this;
//	    	var proj = this.getHost().getProjection();
//	    	if(proj !== undefined){
//	    		var view = proj.getView();
//	    		if(view !== undefined){
//	    			this.create();
//				}
//	    	}else{
//	    		this.getHost().addPluginListener('projectionRegister',function (plugin){
//	    			//console.log("attach projection listener");
//					if(plugin.getProjection().getView() !== undefined){
//						that.create();
//					}else{
//						//wait view registering
//						plugin.getProjection().addProjectionListener('viewRegister',function(proj){
//							that.create();
//						},'Wait for projection view registering for box widget ');
//					}
//				},'Plugin listener for projection register for box widget');
//	    	}
//	    }
	});
})();
(function(){
	JenScript.ZoomLensPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ZoomLensPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.ZoomLensPlugin, {
		_init : function(config){
			config = config || {};
			config.name =  "ZoomLensPlugin";
			config.selectable = true;
			config.priority = 1000;
			/** zoom int lock flag */
			this.zoomInLock = false;
			/** zoom out lock flag */
			this.zoomOutLock = false;
			/** zoom milli tempo */
			this.zoomMiliTempo = 100;
			/** zoom factor */
			this.factor = 8;
			/** current zoom process nature */
			this.processNature;
			this.lensListeners = [];
			this.lensType = (config.lensType !== undefined) ? config.lensType : 'LensXY';
			JenScript.Plugin.call(this,config);
		},
		
		
		getProcessNature : function(){
			return this.processNature;
		},
		
		onRelease : function(evt,part,x,y){
			this.zoomInLock = false;
			this.zoomOutLock = false;
		},
		
		
		addLensListener : function(actionEvent,listener,name) {
			var l={action:actionEvent,onEvent:listener,name:name};
			this.lensListeners[this.lensListeners.length] = l;
		},
		
		fireLensEvent : function(action){
			for(var i = 0 ;i<this.lensListeners.length;i++){
				var l = this.lensListeners[i];
				if(l.action === action)
					l.onEvent(this);
			}
		},
		
		/**
		 * stop zoom in
		 */
		stopZoomIn : function() {
			this.zoomInLock = false;
		},
		
		/**
		 * stop zoom out
		 */
		stopZoomOut : function() {
			this.zoomOutLock = false;
		},

		/**
		 * start zoom in with in the specified nature
		 * 
		 * @param zoomNature
		 */
		startZoomIn : function(zoomNature) {
			this.zoomInLock = true;
			this.zoomIn(zoomNature);
		},
		
		/**
		 * start zoom out with in the specified nature
		 * 
		 * @param zoomNature
		 */
		startZoomOut : function(zoomNature) {
			this.zoomOutLock = true;
			this.zoomOut(zoomNature);
		},
		
		/**
		 * zoom in with in the specified nature
		 * 
		 * @param zoomNature
		 */
		zoomIn : function(processNature) {
			this.processNature = processNature;
			var proj = this.getProjection();

			var w = proj.getPixelWidth();
			var h = proj.getPixelHeight();
			var factor = this.factor;
			
			var pMinXMinYDevice = undefined;
			var pMaxXMaxYDevice = undefined;
			
			if (processNature === 'ZoomXY') {
				pMinXMinYDevice = {x:w / factor, y:h - h / factor};
				pMaxXMaxYDevice = {x:w - w / factor,y: h / factor};
			} else if (processNature === 'ZoomX') {
				pMinXMinYDevice = {x:w / factor, y:h};
				pMaxXMaxYDevice = {x:w - w / factor,y: 0};
			} else if (processNature === 'ZoomY') {
				pMinXMinYDevice = {x:0,y: h - h / factor};
				pMaxXMaxYDevice = {x:w,y: h / factor};
			}
			var pMinXMinYUser = proj.pixelToUser(pMinXMinYDevice);
			var pMaxXMaxYUser = proj.pixelToUser(pMaxXMaxYDevice);
				if(this.lensType == 'LensXY'){
					console.log("zoom in xy")
					proj.bound(pMinXMinYUser.x, pMaxXMaxYUser.x, pMinXMinYUser.y, pMaxXMaxYUser.y);
				}
				else if(this.lensType === 'LensX'){
					console.log("zoom in x")
					proj.bound(pMinXMinYUser.x, pMaxXMaxYUser.x, proj.getMinY(), proj.getMaxY());
				}
				else if(this.lensType === 'LensY'){
					console.log("zoom in y")
					proj.bound(proj.getMinX(), proj.getMaxX(), pMinXMinYUser.y, pMaxXMaxYUser.y);
				}
			this.fireLensEvent('zoomIn');
		},

		/**
		 * zoom out with in the specified nature
		 * 
		 * @param zoomNature
		 */
		zoomOut : function(processNature) {
			this.processNature = processNature;
			var proj = this.getProjection();
			
			var w = proj.getPixelWidth();
			var h = proj.getPixelHeight();
			var factor = this.factor;
			
			var pMinXMinYDevice = undefined;
			var pMaxXMaxYDevice = undefined;

			if (processNature === 'ZoomXY') {
				pMinXMinYDevice = {x:-w / factor, y:h + h / factor};
				pMaxXMaxYDevice = {x:w + w / factor,y: -h / factor};
			} else if (processNature === 'ZoomX') {
				pMinXMinYDevice = {x:-w / factor, y:h};
				pMaxXMaxYDevice = {x:w + w / factor,y: 0};
			} else if (processNature === 'ZoomY') {
				pMinXMinYDevice = {x:0, y:h + h / factor};
				pMaxXMaxYDevice = {x:w,y: -h / factor};
			}

			var pMinXMinYUser = proj.pixelToUser(pMinXMinYDevice);
			var pMaxXMaxYUser = proj.pixelToUser(pMaxXMaxYDevice);

				if(this.lensType === 'LensXY'){
					proj.bound(pMinXMinYUser.x, pMaxXMaxYUser.x, pMinXMinYUser.y, pMaxXMaxYUser.y);
				}
				else if(this.lensType === 'LensX'){
					proj.bound(pMinXMinYUser.x, pMaxXMaxYUser.x, proj.getMinY(), proj.getMaxY());
				}
				else if(this.lensType === 'LensY'){
					proj.bound(proj.getMinX(), proj.getMaxX(), pMinXMinYUser.y, pMaxXMaxYUser.y);
				}
			this.fireLensEvent('zoomOut');
		}
	});

})();
(function(){
	JenScript.ZoomLensSynchronizer = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.ZoomLensSynchronizer,{
		init: function(config){
			/** the lens plug ins to synchronize */
		    this.lensList =[];
		    /** dispatchingEvent flag */
		    this.dispathingEvent = false;
		    
		    var lenses = config.lenses;
		    
		    if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < lenses.length; i++) {
	            	var that = this;
	            	lenses[i].addLensListener('zoomIn',function (plugin){that.zoomIn(plugin);},' Lens synchronizer, zoomIn listener');
	            	lenses[i].addLensListener('zoomOut',function (plugin){that.zoomOut(plugin);},' Lens synchronizer, zoomOut listener');
	            	lenses[i].addPluginListener('lock',function (plugin){that.pluginSelected(plugin);},'Lens Synchronizer plugin lock listener');
	            	lenses[i].addPluginListener('unlock',function (plugin){that.pluginUnlockSelected(plugin);},'Lens Synchronizer plugin unlock listener');
	                this.lensList[this.lensList.length] = lenses[i];
	            }
	            this.dispathingEvent = false;
	        }
		},
	
	    pluginSelected : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.lensList.length; i++) {
					var plugin = this.lensList[i];
					if (plugin.Id !== source.Id) {
						//console.log("select synchronized lens");
	                    plugin.select();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
    
	    pluginUnlockSelected : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.lensList.length; i++) {
					var plugin = this.lensList[i];
					if (plugin.Id !== source.Id) {
	                    plugin.unselect();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
   
	   
	    zoomIn : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.lensList.length; i++) {
					var plugin = this.lensList[i];
	                if (plugin.Id !== source.Id) {
	                	plugin.zoomIn(source.getProcessNature());
	                }
	            }
	            this.dispathingEvent = false;
	        }
	    },

	    zoomOut : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.lensList.length; i++) {
					var plugin = this.lensList[i];
					 if (plugin.Id !== source.Id) {
						 plugin.zoomOut(source.getProcessNature());
	                }
	            }
	            this.dispathingEvent = false;
	        }
	    },
    
	   
	});
})();
(function(){
	JenScript.LensPad = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LensPad, JenScript.AbstractPlusMinusPadWidget);
	JenScript.Model.addMethods(JenScript.LensPad,{
		___init: function(config){
			config = config || {};
			config.Id = 'lens_pad'+JenScript.sequenceId++;
			config.width=64;
			config.height=64;
			config.xIndex=60;
			config.yIndex=100;
			
			JenScript.AbstractPlusMinusPadWidget.call(this,config);
			
			 /** theme color to fill pad base */
		    this.baseFillColor = JenScript.RosePalette.COALBLACK;
		    /** theme color to draw pad base */
		    this.baseStrokeColor = JenScript.RosePalette.MELON;
		    /** stroke width to draw pad base */
		    this.baseStrokeWidth = 1;
		    /** theme color to fill pad control */
		   // this.controlFillColor = 'rgba(250,0,0,0.4)';
		    /** theme color to draw pad control */
		    this.controlStrokeColor = JenScript.RosePalette.AEGEANBLUE;
		    /** stroke width to draw pad control */
		    this.controlStrokeWidth =1;
		    /** button fill color */
		    this.buttonFillColor = JenScript.RosePalette.EMERALD;
		    /** button rollover fill color */
		    this.buttonRolloverFillColor = JenScript.RosePalette.MELON;
		    /** button stroke color */
		    this.buttonStrokeColor =  JenScript.RosePalette.FOXGLOWE;
		    /** button rollover stroke color */
		    this.buttonRolloverStrokeColor =JenScript.RosePalette.MELON;
		    /** button stroke */
		    this.buttonStrokeWidth =1;
		},
		
		
	    onNorthButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().startZoomIn('ZoomY');
	    },
	  
	    onSouthButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().startZoomOut('ZoomY');
	    },

	    onWestButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().startZoomOut('ZoomX');
	    },

	    onEastButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().startZoomIn('ZoomX');
	    },
	    
	    onRegister : function(){
	    	this.attachPluginLockUnlockFactory('Lens Pad widget factory');
	    }
	});
})();
(function(){
	JenScript.LensX = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LensX, JenScript.AbstractPlusMinusBarWidget);
	JenScript.Model.addMethods(JenScript.LensX,{
		___init: function(config){
			config = config || {};
			config.Id = 'lensX'+JenScript.sequenceId++;
			config.width=(config.width !== undefined)?config.width : 100;
			config.height=(config.height !== undefined)?config.height : 16;
			config.xIndex=(config.xIndex !== undefined)?config.xIndex:3;
			config.yIndex=(config.yIndex !== undefined)?config.yIndex:100;
			config.barOrientation = 'Horizontal';
			JenScript.AbstractPlusMinusBarWidget.call(this,config);
			
		    this.setOrphanLock(true);
		},
		
	    onButton1Press : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().startZoomOut('ZoomX');
	    },
	   
	    onButton2Press : function() {
	    	if (!this.getHost().isLockSelected()) {
	            return;
	        }
	    	 this.getHost().startZoomIn('ZoomX');
	    },
	    
	    onRegister : function(){
	    	this.attachPluginLockUnlockFactory('LensX widget widget factory');
	    }
	});
})();
(function(){
	JenScript.LensY = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LensY, JenScript.AbstractPlusMinusBarWidget);
	JenScript.Model.addMethods(JenScript.LensY,{
		___init: function(config){
			config = config || {};
			config.Id = 'LensY'+JenScript.sequenceId++;
			config.width=(config.width !== undefined)?config.width : 16;
			config.height=(config.height !== undefined)?config.height : 100;
			config.xIndex=(config.xIndex !== undefined)?config.xIndex:100;
			config.yIndex=(config.yIndex !== undefined)?config.yIndex:2;
			config.barOrientation = 'Vertical';
			JenScript.AbstractPlusMinusBarWidget.call(this,config);

		    this.setOrphanLock(true);
		},
		
	    onButton1Press : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().startZoomIn('ZoomY');
	    },
	   
	    onButton2Press : function() {
	    	if (!this.getHost().isLockSelected()) {
	            return;
	        }
	    	this.getHost().startZoomOut('ZoomY');
	    },
	    
	    onRegister : function(){
			this.attachPluginLockUnlockFactory('LensY widget widget factory');
	    }
	});
})();
(function(){
	
	JenScript.ZoomWheelMode = function(mode) {
		this.mode = mode.toLowerCase();
		
		this.isWx= function(){
			return (this.mode === 'x' || this.mode === 'wx' || this.mode === 'wheelx');
		};
		this.isWy= function(){
			return (this.mode === 'y' || this.mode === 'wy' || this.mode === 'wheely');
		};
		this.isWxy= function(){
			return (this.mode === 'xy' || this.mode === 'wxy' || this.mode === 'wheelxy');
		};
	};
	
	JenScript.ZoomWheelPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ZoomWheelPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.ZoomWheelPlugin, {
		_init : function(config){
			config = config || {};
			
			config.name =  "ZoomWheelPlugin";
			config.selectable = false;
			config.priority = 1000;
			this.mode = (config.mode !== undefined) ? new JenScript.ZoomWheelMode(config.mode) : new JenScript.ZoomWheelMode('xy');
			
			/** zoom wheel multiplier, deltaY is always +1,-1, then deltaY is multiply */
			this.multiplier = (config.multiplier !== undefined) ? config.multiplier : 2;
			
			/** zoom wheel factor that get the projection fraction factor to increase/decrease*/
			this.factor = 60;
			
			this.wheelListeners = [];
			JenScript.Plugin.call(this,config);
		},
		
		addWheelListener : function(actionEvent,listener,name) {
			var l={action:actionEvent,onEvent:listener,name:name};
			this.wheelListeners[this.wheelListeners.length] = l;
		},
		
		fireWheelEvent : function(action){
			for(var i = 0 ;i<this.wheelListeners.length;i++){
				var l = this.wheelListeners[i];
				if(l.action === action)
					l.onEvent(this);
			}
		},
		
		onPress : function(evt,part,x,y){
			this.stopWheel = true;
		},
		
		onRelease : function(evt,part,x,y){
			this.stopWheel = false;
		},
		
		onWheel : function(evt,part,x,y){
			evt.preventDefault();
			//console.log('zoomWheel onWheel');
			
			var that=this;
			var temporizeIn = function(i){
				setTimeout(function(){
					that.zoomIn();
				},100*i);
			};
			var temporizeOut = function(i){
				setTimeout(function(){
					that.zoomOut();
				},100*i);
			};
			
			var exe = function(rotation){
				if (rotation < 0) {
					var count = -rotation;
					for (var i = 0; i < count; i++) {
						temporizeIn(i);
					}
				} else {
					var count = rotation;
					for (var i = 0; i < count; i++) {
						temporizeOut(i);
					}
				}
			};
			
			if(evt.deltaY){
				exe(evt.deltaY*this.multiplier);
			}
		},
	
		/**
		 * bound zoom in
		 */
		zoomIn : function() {
			if(this.stopWheel) return;
			//console.log("zoom in");
			var w = this.getProjection().getPixelWidth();
			var h = this.getProjection().getPixelHeight();
			var pMinXMinYDevice = undefined;
			var pMaxXMaxYDevice = undefined;
			if (this.mode.isWxy()) {
				pMinXMinYDevice = {x:w / this.factor, y:h - h / this.factor};
				pMaxXMaxYDevice = {x:w - w / this.factor,y: h / this.factor};
			} else if (this.mode.isWx()) {
				pMinXMinYDevice = {x:w / this.factor,y: h};
				pMaxXMaxYDevice = {x:w - w / this.factor,y: 0};
			} else if (this.mode.isWy()) {
				pMinXMinYDevice = {x:0, y:h - h / this.factor};
				pMaxXMaxYDevice = {x:w, y:h / this.factor};
			}
			var pMinXMinYUser = this.getProjection().pixelToUser(pMinXMinYDevice);
			var pMaxXMaxYUser = this.getProjection().pixelToUser(pMaxXMaxYDevice);
			//if (getWindow2D() instanceof Window2D.Linear) {
				//Window2D.Linear wl = (Window2D.Linear) getWindow2D();
				this.getProjection().bound(pMinXMinYUser.x, pMaxXMaxYUser.x, pMinXMinYUser.y, pMaxXMaxYUser.y);
			//}
				this.fireWheelEvent('zoomIn');
		},

		/**
		 * bound zoom out
		 */
		 zoomOut : function() {
			 if(this.stopWheel) return;
			 //console.log("zoom out");
			var w = this.getProjection().getPixelWidth();
			var h = this.getProjection().getPixelHeight();
			var pMinXMinYDevice = undefined;
			var pMaxXMaxYDevice = undefined;
			if (this.mode.isWxy()) {
				pMinXMinYDevice = {x:-w / this.factor,y: h + h / this.factor};
				pMaxXMaxYDevice = {x:w + w / this.factor,y: -h / this.factor};
			} else if (this.mode.isWx()) {
				pMinXMinYDevice = {x:-w / this.factor, y:h};
				pMaxXMaxYDevice = {x:w + w / this.factor,y: 0};
			} else if (this.mode.isWy()) {
				pMinXMinYDevice = {x:0,y: h + h / this.factor};
				pMaxXMaxYDevice = {x:w,y: -h / this.factor};
			}
			var pMinXMinYUser = this.getProjection().pixelToUser(pMinXMinYDevice);
			var pMaxXMaxYUser = this.getProjection().pixelToUser(pMaxXMaxYDevice);
			//if (getWindow2D() instanceof Window2D.Linear) {
			//	Window2D.Linear wl = (Window2D.Linear) getWindow2D();
				this.getProjection().bound(pMinXMinYUser.x, pMaxXMaxYUser.x, pMinXMinYUser.y, pMaxXMaxYUser.y);
				this.fireWheelEvent('zoomOut');
			//}
		}
	});	
})();
(function(){
	JenScript.ZoomWheelSynchronizer = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.ZoomWheelSynchronizer,{
		init: function(config){
			/** the wheel plug ins to synchronize */
		    this.wheelList =[];
		    /** dispatchingEvent flag */
		    this.dispathingEvent = false;
		    
		    var wheels = config.wheels;
		    
		    if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < wheels.length; i++) {
	            	var that = this;
	            	wheels[i].addWheelListener('zoomIn',function (plugin){that.zoomIn(plugin);},' Wheel synchronizer, zoomIn listener');
	            	wheels[i].addWheelListener('zoomOut',function (plugin){that.zoomOut(plugin);},' Wheel synchronizer, zoomOut listener');
	            	//wheels[i].addPluginListener('lock',function (plugin){that.pluginSelected(plugin);},'Lens Synchronizer plugin lock listener');
	            	//wheels[i].addPluginListener('unlock',function (plugin){that.pluginSelected(plugin);},'Lens Synchronizer plugin unlock listener');
	                this.wheelList[this.wheelList.length] = wheels[i];
	            }
	            this.dispathingEvent = false;
	        }
		},
	
	    pluginSelected : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.wheelList.length; i++) {
					var plugin = this.wheelList[i];
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
	            for (var i = 0; i < this.wheelList.length; i++) {
					var plugin = this.wheelList[i];
					if (plugin.Id !== source.Id) {
	                    plugin.unselect();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
   
	   
	    zoomIn : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.wheelList.length; i++) {
					var plugin = this.wheelList[i];
	                if (plugin.Id !== source.Id) {
	                	plugin.zoomIn();
	                }
	            }
	            this.dispathingEvent = false;
	        }
	    },

	    zoomOut : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.wheelList.length; i++) {
					var plugin = this.wheelList[i];
					 if (plugin.Id !== source.Id) {
						 plugin.zoomOut();
	                }
	            }
	            this.dispathingEvent = false;
	        }
	    },
    
	   
	});
})();