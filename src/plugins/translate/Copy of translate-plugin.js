(function(){
	//copy with smooth effect, not safe
	JenScript.TranslatePlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TranslatePlugin, JenScript.Plugin);

	JenScript.Model.addMethods(JenScript.TranslatePlugin, {
		_init : function(config){
			config = config ||{};
			
			config.name =  'TranslatePlugin';
			config.selectable = true;
			config.priority = 1000;
			
			this.press = false;
			this.cinematiques=[];
			this.boundHistory = [];
			this.dynamicEffect=true;
			this.lockTranslate = false;
			this.passiveTranslate = false;
			this.translateStartX;
			this.translateStartY;
			this.translateCurentX;
			this.translateCurentY;
			this.translateDx=0;
			this.translateDy=0;
			this.lockL2R = (config.lockL2R !== undefined)? config.lockL2R : true;
			this.lockB2T = (config.lockB2T !== undefined)? config.lockB2T : true;
			this.shifting = false;
			this.smoothing = false;
			this.translateListeners = [];
			
			this.animRef = [];
			
			JenScript.Plugin.call(this, config);
			
			//this.registerWidget(new JenScript.TranslateCompassWidget());
			//this.registerWidget(new JenScript.TranslateX());
			//this.registerWidget(new JenScript.TranslateY());
			//this.registerWidget(new JenScript.TranslatePad());
		},
		
		/**
	     * get the translate start x in device coordinate
	     * @return device start x
	     */
	    getTranslateStartDeviceX : function() {
	        return this.translateStartX;
	    },

	    /**
	     * get the translate start y in device coordinate
	     * @return device start y
	     */
	    getTranslateStartDeviceY : function() {
	        return this.translateStartY;
	    },

	    
	    /**
	     * get the translate start point in device coordinate
	     * @return device start point
	     */
	    getTranslateStartDevicePoint : function() {
	        return new JenScript.Point2D(this.translateStartX, this.translateStartY);
	    },

	    /**
	     * get Translate start user point
	     * @return translate start user point
	     */
	    getTranslateStartUserPoint : function() {
	        return this.getProjection().pixelToUser(this.getTranslateStartDevicePoint());
	    },

	    /**
	     * get Translate start user x
	     * @return translate start user x
	     */
	    getTranslateStartUserX : function() {
	        return this.getTranslateStartUserPoint().getX();
	    },

	    /**
	     * get Translate start user y
	     * @return translate start user y
	     */
	    getTranslateStartUserY : function() {
	        return this.getTranslateStartUserPoint().getY();
	    },

	    /**
	     * get the translate current x in device coordinate
	     * @return device current x
	     */
	    getTranslateCurentDeviceX : function() {
	        return this.translateCurentX;
	    },


	    /**
	     * get the translate current device y
	     * @return device current y
	     */
	    getTranslateCurentDeviceY : function() {
	        return this.translateCurentY;
	    },

	    /**
	     * get Translate current device point
	     * @return translate current device point
	     */
	    getTranslateCurrentDevicePoint : function() {
	        return new JenScript.Point2D(this.translateCurentX, this.translateCurentY);
	    },

	    /**
	     * get Translate current user point
	     * @return translate current user point
	     */
	    getTranslateCurrentUserPoint : function() {
	        return this.getProjection().pixelToUser(this.getTranslateCurrentDevicePoint());
	    },

	    /**
	     * get Translate current user x
	     * @return translate current user x
	     */
	    getTranslateCurrentUserX : function() {
	        return this.getTranslateCurrentUserPoint().getX();
	    },

	    /**
	     * get Translate current user y
	     * @return translate current user y
	     */
	    getTranslateCurrentUserY : function() {
	        return this.getTranslateCurrentUserPoint().getY();
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
		
		isTranslateAuthorized : function(evt,part){
			return ((part === JenScript.ViewPart.Device) && this.isLockSelected() && !this.isLockPassive() && (this.getButton(evt) === 'LEFT') && !this.passiveTranslate);
		},
		
		onPress : function(evt,part,x, y) {
			//mozilla, prevent Default to enable dragging correctly
			if(evt.preventDefault){
				evt.preventDefault();
			}
			this.press = true;
			if(this.isTranslateAuthorized(evt,part)){
				this.startTranslate(new JenScript.Point2D(x,y));
			}else{
				//console.log('not authorize to start : '+this.Id);
			}
				
		},
		
		/**
	     * start translate operation at the specified device point
	     * @param {Object} translateStart
	     *            the start point of the current translate
	     */
	    startTranslate  :function(translateStart) {
	    	if(this.lockTranslate){
	    		//console.log("already start");
	    		return; //already started
	    	}
	    	
	    	if(this.smoothing){
	    		//console.log("can not start, smooting");
	    		return;
//	    		console.log("is smooting...");
//			    for (var i = 0; i < this.animRef.length; i++) {
//			    	var anim = this.animRef[i];
//			    	clearTimeout(anim);
//			    }
//			    this.smoothing=false;
//			    this.cinematiques = [];
	    	}
	    		
	    	//console.log('start translate : '+this.Id);
	    	this.lockTranslate = true;
			this.translateStartX = translateStart.x;
			this.translateStartY = translateStart.y;
		    //this.boundHistory = [];

		    //this.cinematiques = [];
		    this.fireTranslateEvent('start');
	    },
		
	    /**
	     * add translate listener :
	     * start : when translate get press, create start translate transaction
	     * translate : when translate get drag and bound projection with epsilon translate
	     * stop : when translate release, transaction is immediatly stop and finish if dynamic effect is false
	     * else the translate continue with a smooth stop and finish after this effect.
	     * 
	     * finish, L2R, B2T
	     * 
	     * @param {String} translate action event type like start, stop, translate, finish, L2R, B2T
	     * @param {Function} listener
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
		shift : function(direction) {
	        if (!this.shifting) {
	        	 /** shift direction */
		        var that = this;
		        /** factor */
		        var factor = 5;
		        /** shift velocity */
		        //var velocity = 'Slow';
		        //VerySlow(200), Slow(90), Default(40), Fast(20), VeryFast(5);
	        	this.shifting = true;
                //this.startTranslate(new JenScript.Point2D(0,0));
                var sleep = 5; //velocity.getVelocity();
                var fragment = 20;
                var deltaY = this.getProjection().getPixelHeight() / fragment;
                var deltaX = this.getProjection().getPixelWidth() / fragment;
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
                
                var execute  = function(i,success){
                	setTimeout(function(){
                		that.boundTranslate(new JenScript.Point2D(dx*i,dy*i),false);
                		success(i);
                	},i*sleep);
                	
                };
                this.startTranslate(new JenScript.Point2D(0,0));
                for (var i =0 ; i <= factor ; i++) {
                	execute(i,function success(rank){
                				if(rank === factor){
                					 that.lockTranslate = false;
                					 that.shifting = false;
                					 that.stopTranslate(new JenScript.Point2D(0,0));
                				}
                			});
                }
	        }
	    },
	    
	    /**
	     * get clicked button, LEFT, RIGHT or MIDDLE
	     */
		getButton : function (event){
			var button;
			if (event.which == null)
			    /* IE case */
			    button= (event.button < 2) ? "LEFT" :
			              ((event.button == 4) ? "MIDDLE" : "RIGHT");
			 else
			    /* All others */
			    button= (event.which < 2) ? "LEFT" :
			              ((event.which == 2) ? "MIDDLE" : "RIGHT");
			return button;
		},

		/**
		 * on release handler
		 */
		onRelease : function(evt,part,deviceX, deviceY) {
			this.press = false;
			if (!this.shifting && this.lockTranslate) {
		        this.stopTranslate(new JenScript.Point2D(deviceX,deviceY));
		    }
		},
		
		/**
		 * on move handler
		 */
		onMove : function(evt,part,deviceX, deviceY) {
			//mozilla, prevent Default to enable dragging correctly
			evt.preventDefault();
			if (this.press && !this.smoothing) {

				if(this.isTranslateAuthorized(evt,part))
					this.boundTranslate(new JenScript.Point2D(deviceX,deviceY));
				
			}else{
			}
		},
		
		boundTranslate : function(deviceCurent,flag) {
			this.translateCurentX = deviceCurent.x;
			this.translateCurentY = deviceCurent.y;

			if(flag === undefined){
				var	tc = {x:this.translateCurentX, y :this.translateCurentY,parent:"DRAGUED",timemillis: Date.now()};
				this.cinematiques[this.cinematiques.length] = tc;
			}else{
				this.cinematiques=[];
			}
		    //BUG?, sometimes translateStartX and translateStartY undefined!
		    //console.log("tx start x,y",this.translateStartX,this.translateStartY);
		    
			var	deltaDeviceX = this.translateCurentX - this.translateStartX;
			var	deltaDeviceY = this.translateCurentY - this.translateStartY;
			if (!this.lockB2T) {
				deltaDeviceY = 0;
			}
			if (!this.lockL2R) {
				deltaDeviceX = 0;
			}
			
			this.processTranslate(deltaDeviceX, deltaDeviceY);
			this.translateStartX = this.translateCurentX;
			this.translateStartY = this.translateCurentY;
			this.fireTranslateEvent('bound');
		},
		
		stopTranslate : function(endDevice) {
			if(this.smoothing){
				//console.log("can not stop, smooting");
	    		return;
			}
			
			//console.log('stop translate : '+this.Id);
		    this.translateCurentX = endDevice.x;
		    this.translateCurentY = endDevice.y;
		    var tc = {x : endDevice.x,y:endDevice.y, parent:"RELEASED",timemillis: Date.now()};
		    this.cinematiques[this.cinematiques.length] = tc;
		    if (this.dynamicEffect) {
		       this.makeDynEffect();
		       this.fireTranslateEvent('stop');
		    }
		    else {
		    	this.lockTranslate = false;
		    	this.passiveTranslate = false;
		    	this.fireTranslateEvent('stop');
		    	this.fireTranslateEvent('finish');
		    }
		},
		
		makeDynEffect : function() {
			this.smoothing = true;
			//console.log("make dyn effect for plugin "+this.Id);
			if (this.cinematiques.length < 4) {
				this.lockTranslate = false;
				this.smoothing = false;
				this.fireTranslateEvent('finish');
			    return;
			}
			var itemReleased = this.cinematiques[this.cinematiques.length - 1];
			var itemLastDragued = this.cinematiques[this.cinematiques.length - 2];
			//console.log('diff item drag : '+(itemReleased.timemillis - itemLastDragued.timemillis));
			if ( (itemReleased.timemillis - itemLastDragued.timemillis) > 200) {
				this.lockTranslate = false;
				this.passiveTranslate = false;
				this.smoothing = false;
				this.cinematiques=[];
				this.fireTranslateEvent('finish');
				return;
			}
			var echantillon = 3;
			var itemEnd = this.cinematiques[this.cinematiques.length - 1];
			var itemStart =this.cinematiques[this.cinematiques.length - 1 - echantillon];
			this.cinematiques=[];
			var deltaX = itemEnd.x - itemStart.x;
			var deltaY = itemEnd.y - itemStart.y;
			var delatTimeMillis =itemEnd.timemillis - itemStart.timemillis;
			var partNumber = 10;
			var deltaXPart = deltaX / partNumber;
			var deltaYPart = deltaY / partNumber;
			var that=this;
			for (var i = 0; i < partNumber; i++) {
				tx(i, function callback(rank) {
					if (rank === (partNumber-1)) {				
						setTimeout(function() {
							//console.log(that.Id+' finish smoothing');
							that.lockTranslate = false;
							that.passiveTranslate = false;
							that.smoothing = false;
				            that.fireTranslateEvent('finish');
						}, 10);
					}
				});
			}
			function tx(i, callback) {
				var timeoutRef = setTimeout(function() {
					//if(that.press) return;
					var deltaDeviceX = deltaX - deltaXPart * i;
				    var deltaDeviceY = deltaY - deltaYPart * i;
				    if (!that.lockB2T) {
				        deltaDeviceY = 0;
				    }
				    if (!that.lockL2R) {
				        deltaDeviceX = 0;
				    }
				   // console.log(that.Id+" with rank "+i+" execute process : "+deltaDeviceX);
				    that.processTranslate(deltaDeviceX, deltaDeviceY);
				    that.translateStartX = that.translateCurentX;
				    that.translateStartY = that.translateCurentY;
					callback(i);
				//}, delatTimeMillis*3/4*i);
				}, delatTimeMillis*1/2*i);
				that.animRef[that.animRef.length]=timeoutRef;
				
			};
		},
		

		processTranslate : function(deltaDeviceX, deltaDeviceY) {
			
			this.translateDx = deltaDeviceX;
		    this.translateDy = deltaDeviceY;
		    var proj = this.getProjection();
		    if (proj === undefined) {
		        return;
		    }
		    var w = proj.getPixelWidth();
		    var h = proj.getPixelHeight();

		    var pMinXMinYDevice = {x:-deltaDeviceX, y: (h - deltaDeviceY)};
		    var pMaxXMaxYDevice = {x: (w - deltaDeviceX),y: -deltaDeviceY};

		    var pMinXMinYUser = proj.pixelToUser(pMinXMinYDevice);
		    var pMaxXMaxYUser = proj.pixelToUser(pMaxXMaxYDevice);

		    proj.bound(pMinXMinYUser.x, pMaxXMaxYUser.x, pMinXMinYUser.y, pMaxXMaxYUser.y);
		    this.fireTranslateEvent('translate'); 
		    //console.log(this.Id+" processed : "+deltaDeviceX);
		},
		
		onProjectionRegister : function(){
		},
	});
	
})();