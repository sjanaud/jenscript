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
		 * @param processNature
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
					proj.bound(pMinXMinYUser.x, pMaxXMaxYUser.x, pMinXMinYUser.y, pMaxXMaxYUser.y);
				}
				else if(this.lensType === 'LensX'){
					proj.bound(pMinXMinYUser.x, pMaxXMaxYUser.x, proj.getMinY(), proj.getMaxY());
				}
				else if(this.lensType === 'LensY'){
					proj.bound(proj.getMinX(), proj.getMaxX(), pMinXMinYUser.y, pMaxXMaxYUser.y);
				}
			this.fireLensEvent('zoomIn');
		},

		/**
		 * zoom out with in the specified nature
		 * 
		 * @param processNature
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