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