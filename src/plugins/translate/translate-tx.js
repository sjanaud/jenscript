(function(){
	JenScript.TranslateX = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TranslateX, JenScript.AbstractBackwardForwardBarWidget);
	JenScript.Model.addMethods(JenScript.TranslateX,{
		___init: function(config){
			config = config || {};
			config.name = 'TranslateWidgetX';
			config.Id = 'translate_tx'+JenScript.sequenceId++;
			config.width=(config.width !== undefined)?config.width:100;
			config.height=(config.height !== undefined)?config.height:16;
			config.xIndex=(config.xIndex !== undefined)?config.xIndex:2;
			config.yIndex=(config.yIndex !== undefined)?config.yIndex:100;
			config.barOrientation = 'Horizontal';
			JenScript.AbstractBackwardForwardBarWidget.call(this,config);
		    this.sample = (config.sample !== undefined)?config.sample : {step : 40, sleep : 10,fraction : 3};
		    this.setOrphanLock(true);
		},
	    onButton1Press : function() {
	        this.getHost().shift('West', this.sample);
	    },
	    onButton2Press : function() {
	        this.getHost().shift('East', this.sample);
	    },
	    
	    onRegister : function(){
	    	//this.attachPluginLockUnlockFactory('TranlateX widget factory');
	    	//this.attachViewActivePassiveFactory('TranlateX widget factory');
	    	//this.attachLayoutFolderFactory('TranlateX widget factory');
	    }
	});
})();