(function(){
	JenScript.TranslateSynchronizer = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.TranslateSynchronizer,{
		init: function(config){
			/** the translate plug ins to synchronize */
		    this.translateList =[];
		    /** dispatchingEvent flag */
		    this.dispathingEvent = false;
		    
		    var translates = config.translates;
		    
		    if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < translates.length; i++) {
	            	var that = this;
	            	translates[i].addTranslateListener('start',function (plugin){that.translateStarted(plugin);},' Translate synchronizer, start listener');
	            	translates[i].addTranslateListener('bound',function (plugin){that.bound(plugin);},' Translate synchronizer, bound listener');
	            	translates[i].addTranslateListener('stop',function (plugin){that.translateStoped(plugin);},' Translate synchronizer, stop listener');
	            	translates[i].addPluginListener('lock',function (plugin){that.pluginSelected(plugin);},'Translate Synchronizer plugin lock listener');
	            	translates[i].addPluginListener('unlock',function (plugin){that.pluginSelected(plugin);},'Translate Synchronizer plugin unlock listener');
	                this.translateList[this.translateList.length] = translates[i];
	            }
	            this.dispathingEvent = false;
	        }
		},
	
	    pluginSelected : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.translateList.length; i++) {
					var plugin = this.translateList[i];
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
	            for (var i = 0; i < this.translateList.length; i++) {
					var plugin = this.translateList[i];
					if (plugin.Id !== source.Id) {
	                    plugin.unselect();
	                }
				}
	            this.dispathingEvent = false;
	        }
	    },
   
	    translateL2RChanged : function(source) {
	    },
	   
	    translateB2TChanged : function(source) {
	    },

	    translateStarted : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.translateList.length; i++) {
					var plugin = this.translateList[i];
	                if (plugin.Id !== source.Id) {
	                    plugin.startTranslate(new JenScript.Point2D(source.translateStartX,source.translateStartY));
	                }
	            }
	            this.dispathingEvent = false;
	        }
	    },

	    bound : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.translateList.length; i++) {
					var plugin = this.translateList[i];
					 if (plugin.Id !== source.Id) {
						 plugin.boundTranslate({x:source.translateCurrentX, y:source.translateCurrentY});
	                 }
	            }
	            this.dispathingEvent = false;
	        }
	    },
	    
    
	    translateStoped : function(source) {
	        if (!this.dispathingEvent) {
	            this.dispathingEvent = true;
	            for (var i = 0; i < this.translateList.length; i++) {
					var plugin = this.translateList[i];
					 if (plugin.Id !== source.Id) {
	                    plugin.stopTranslate(new JenScript.Point2D(source.translateCurrentX,source.translateCurrentY));
	                 }
	            }
	            this.dispathingEvent = false;
	        }
	    }
	});
})();