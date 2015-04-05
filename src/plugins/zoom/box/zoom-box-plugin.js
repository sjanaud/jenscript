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
			
			config.name =  'ZoomBox';
			config.selectable = true;
			config.priority = 1000;
			
			this.zoomBoxDrawColor = config.zoomBoxDrawColor ;
			this.zoomBoxFillColor = config.zoomBoxFillColor;
			this.mode = (config.mode !== undefined) ? new JenScript.ZoomBoxMode(config.mode) : new JenScript.ZoomBoxMode('xy');
			this.speed = (config.speed !== undefined) ? config.speed : 'default'; //slow, default, fast

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
			this.zoomBack = [];
			this.boxListeners = [];
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

		onPress : function(evt,part,x,y) {
			//mozilla, prevent Default to enable dragging correctly
			if(evt.preventDefault){
				evt.preventDefault();
			}
			if(part !== JenScript.ViewPart.Device) return;
			if (!this.isLockSelected()) {
				return;
			}

			if (this.isLockPassive()) {
				return;
			}
			
			this.drag = true;
			
			this.processZoomStart(new JenScript.Point2D(x,y));
		},
		
		/**
	     * start parameters for a start bound zoom box
	     * 
	     * @param startBox
	     *            box start point coordinate in the current transaction type
	     */
	    processZoomStart : function(startBox) {
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
			if(part !== JenScript.ViewPart.Device) return;
			this.drag = false;
			if (!this.isLockSelected()) {
				return;
			}
			if (this.isLockPassive()) {
				return;
			}
			if (this.isForwardCondition()) {
				this.processZoomOut();
				//this.fireEvent('boxOut');
			} else if (this.isValidateBound()) {
				this.processZoomIn();
				//this.fireEvent('boxIn');
			}

			this.repaintPlugin();
		},
		
		onMove : function(evt,part,deviceX, deviceY) {
			if(part !== JenScript.ViewPart.Device) return;
			if (this.drag) {
				this.processZoomBound(new JenScript.Point2D(deviceX,deviceY));
				//this.getProjection().getView().repaint();
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
			var proj = this.getProjection();
			var that = this;
			that.zoomBack.reverse();
			for (var i = 0; i < this.zoomBack.length; i++) {
				__p(i, function callback(rank) {
					if (rank === that.zoomBack.length-1) {
						setTimeout(function() {
							that.fireEvent('boxFinish');
							that.repaintPlugin();
						}, 10);
					}
				});
			}
			this.fireEvent('boxOut');
			function __p(i, callback) {
				setTimeout(function() {
					var bound = that.zoomBack[i];
					//console.log("rank ",i," bounds : ",bound);
					proj.bound(bound.minX,bound.maxX,bound.minY,bound.maxY);	
					callback(i);
				}, 20 * i);
			}
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

			var userWindowStartPoint = this.getProjection().pixelToUser(deviceStart);
			var userWindowCurrentPoint = this.getProjection().pixelToUser(deviceCurrent);
			var proj = this.getProjection();

			var iMinx = proj.minX;
			var iMaxx = proj.maxX;
			var iMiny = proj.minY;
			var iMaxy = proj.maxY;

			this.boxHistory[this.boxHistory.length] = {
				minx : iMinx,
				maxx : iMaxx,
				miny : iMiny,
				maxy : iMaxy
			};
			var deltaMinx = Math.abs(proj.minX - userWindowStartPoint.x) / 10;
			var deltaMaxx = Math.abs(proj.maxX - userWindowCurrentPoint.x) / 10;
			var deltaMiny = Math.abs(proj.minY - userWindowCurrentPoint.y) / 10;
			var deltaMaxy = Math.abs(proj.maxY - userWindowStartPoint.y) / 10;

			// boxHistory[boxHistory.length] = {minx:userWindowStartPoint.x,
			// maxx:userWindowCurrentPoint.x,
			// miny:userWindowCurrentPoint.y,
			// maxy:userWindowStartPoint.y};

			var fxDeltaPixelMinx = Math.abs(proj.userToPixelX(deltaMinx)
					- proj.userToPixelX(0));
			var fxDeltaPixelMaxx = Math.abs(proj.userToPixelX(deltaMaxx)
					- proj.userToPixelX(0));
			var fxDeltaPixelMiny = Math.abs(proj.userToPixelY(deltaMiny)
					- proj.userToPixelY(0));
			var fxDeltaPixelMaxy = Math.abs(proj.userToPixelY(deltaMaxy)
					- proj.userToPixelY(0));

			var speedMillis = 200;
			
			if(this.speed === 'slow')
				speedMillis = 60;
			if(this.speed === 'default')
				speedMillis = 30;
			if(this.speed === 'fast')
				speedMillis = 10;
			//console.log("speed millis :"+speedMillis);
			
			var that = this;
			that.zoomBack = [];
			var count=0;
			for (var i = 1; i <= 10; i++) {
				_p(i, function callback(rank) {
					that.zoomBack[count++] = proj.getBounds(); 
					if (rank === 10) {
						that.lockEffect=false;
						that.lockZoomingTransaction = false;
						setTimeout(function() {
							that.fireEvent('boxFinish');
							that.repaintPlugin();
						}, 10);
					}
				});
			}
			this.fireEvent('boxIn');
			
			
			
			
			function _p(i, callback) {
				var millis = speedMillis * i;
				console.log(" millis :"+millis);
				setTimeout(function() {
					that.lockZoomingTransaction = true;
					
					var m1=0,m2=0,m3=0,m4=0;
					if(that.mode.isBxy()){
						m1 = iMinx + deltaMinx * i;
						m2 = iMaxx - deltaMaxx * i;
						m3 = iMiny+ deltaMiny * i;
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
						m3 = iMiny+ deltaMiny * i;
						m4 = iMaxy - deltaMaxy * i;
						that.zoomFxBoxStartX = 0;
						that.zoomFxBoxStartY = that.zoomBoxStartY - fxDeltaPixelMaxy * i;
						that.zoomFxBoxCurrentX = that.getProjection().getPixelWidth();
						that.zoomFxBoxCurrentY = that.zoomBoxCurrentY + fxDeltaPixelMiny* i;
					}
					proj.bound(m1, m2, m3, m4);
					
					that.zoomBack[count++] = proj.getBounds();
					callback(i);
				}, millis);
			}
		},
		
		paintBox : function(g2d, part) {
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
		 
		 paintBoxEffect : function(g2d, part) {
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
				if (part !== JenScript.ViewPart.Device) {
					return;
				}
				if(this.lockZoomingTransaction) {
					 if (!this.lockEffect && this.isValidateBound()) {
						this.paintBox(g2d, part); 
					 }
					 else{
						 this.paintBoxEffect(g2d);
					 }
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