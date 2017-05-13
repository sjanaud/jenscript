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
	            	boxes[i].addPluginListener('unlock',function (plugin){that.pluginSelected(plugin);},'ZoomBox Synchronizer plugin unlock listener');
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
	    
    
	    pluginUnlockSelected : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.boxesList.length; i++) {
					var plugin = this.boxesList[i];
					if (plugin.Id !== source.Id) {
						//console.log('sync unlock box'+plugin.name);
	                    plugin.unselect();
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