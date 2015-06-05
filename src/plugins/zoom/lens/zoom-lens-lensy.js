(function(){
	JenScript.LensY = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LensY, JenScript.AbstractPlusMinusBarWidget);
	JenScript.Model.addMethods(JenScript.LensY,{
		___init: function(config){
			config = config || {};
			config.Id = 'LensY'+JenScript.sequenceId++;
			config.width=(config.width !== undefined)?config.width : 16;
			config.height=(config.height !== undefined)?config.height : 100;
			config.xIndex=(config.xIndex !== undefined)?config.xIndex:100;
			config.yIndex=(config.yIndex !== undefined)?config.yIndex:2;
			config.barOrientation = 'Vertical';
			JenScript.AbstractPlusMinusBarWidget.call(this,config);

		    this.setOrphanLock(true);
		},
		
	    onButton1Press : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().startZoomIn('ZoomY');
	    },
	   
	    onButton2Press : function() {
	    	if (!this.getHost().isLockSelected()) {
	            return;
	        }
	    	this.getHost().startZoomOut('ZoomY');
	    },
	    
	    onRegister : function(){
			this.attachPluginLockUnlockFactory('LensY widget widget factory');
	    }
	});
})();