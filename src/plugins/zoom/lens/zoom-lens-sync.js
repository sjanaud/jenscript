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