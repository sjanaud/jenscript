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
                
                console.log("step "+step);
                console.log("sleep "+sleep);
                console.log("fraction "+fraction);
                
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