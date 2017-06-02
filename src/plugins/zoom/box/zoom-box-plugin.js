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
			this.zoomBoxStroke = (config.zoomBoxStroke !== undefined) ? config.zoomBoxStroke : 1;
			this.zoomBoxFillOpacity = (config.zoomBoxFillOpacity !== undefined) ? config.zoomBoxFillOpacity : 0.3;
			this.zoomBoxStrokeOpacity = (config.zoomBoxStrokeOpacity !== undefined) ? config.zoomBoxStrokeOpacity : 1;
			
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
											.strokeWidth(this.zoomBoxStroke)
											.stroke(drawColor)
											.fillOpacity(this.zoomBoxFillOpacity)
											.strokeOpacity(this.zoomBoxStrokeOpacity)
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
												.strokeWidth(this.zoomBoxStroke)
												.stroke(drawColor)
												.fillOpacity(this.zoomBoxFillOpacity)
												.strokeOpacity(this.zoomBoxStrokeOpacity)
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