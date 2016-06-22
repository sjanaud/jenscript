(function(){
	JenScript.TranslateY = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TranslateY, JenScript.AbstractBackwardForwardBarWidget);
	JenScript.Model.addMethods(JenScript.TranslateY,{
		___init: function(config){
			config = config || {};
			config.Id = 'translate_ty'+JenScript.sequenceId++;
			config.width=(config.width !== undefined)?config.width:16;
			config.height=(config.height !== undefined)?config.height:100;
			config.xIndex=(config.xIndex !== undefined)?config.xIndex:100;
			config.yIndex=(config.yIndex !== undefined)?config.yIndex:1;
			config.barOrientation = 'Vertical';
			JenScript.AbstractBackwardForwardBarWidget.call(this,config);
		    this.sample = (config.sample !== undefined)?config.sample : {step : 2, sleep: 100,fraction:5};
		    this.setOrphanLock(true);
		},
		
		
	    onButton1Press : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('North', this.sample);

	    },
	    onButton2Press : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('South', this.sample);
	    },
	    
	    onRegister : function(){
	    	this.attachPluginLockUnlockFactory('TranlateY widget factory');
	    	this.attachViewActivePassiveFactory('TranlateY widget factory');
	    }
		
	});
})();