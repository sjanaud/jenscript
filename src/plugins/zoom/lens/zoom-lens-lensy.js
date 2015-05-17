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
			config.xIndex=100;
			config.yIndex=0;
			config.barOrientation = 'Vertical';
			JenScript.AbstractPlusMinusBarWidget.call(this,config);

			this.setOutlineStrokeColor((config.outlineStrokeColor !== undefined)?config.outlineStrokeColor : 'black');
		    this.setOutlineFillColor(config.outlineFillColor);
		    this.setButtonDrawColor((config.buttonStrokeColor !== undefined)?config.buttonStrokeColor : 'black');
		    this.setButtonRolloverDrawColor((config.buttonRolloverStrokeColor !== undefined)?config.buttonRolloverStrokeColor : 'green');
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