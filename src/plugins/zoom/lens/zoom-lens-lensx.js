(function(){
	JenScript.LensX = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.LensX, JenScript.AbstractPlusMinusBarWidget);
	JenScript.Model.addMethods(JenScript.LensX,{
		___init: function(config){
			config = config || {};
			config.Id = 'lensX'+JenScript.sequenceId++;
			config.width=(config.width !== undefined)?config.width : 100;
			config.height=(config.height !== undefined)?config.height : 16;
			config.xIndex=2;
			config.yIndex=100;
			config.barOrientation = 'Horizontal';
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
	        this.getHost().startZoomOut('ZoomX');
	    },
	   
	    onButton2Press : function() {
	    	if (!this.getHost().isLockSelected()) {
	            return;
	        }
	    	 this.getHost().startZoomIn('ZoomX');
	    },
	    
	    onRegister : function(){
	    	this.attachPluginLockUnlockFactory('LensX widget widget factory');
	    }
	});
})();