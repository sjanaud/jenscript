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