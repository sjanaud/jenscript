(function(){
	JenScript.TranslateY = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TranslateY, JenScript.AbstractBackwardForwardBarWidget);
	JenScript.Model.addMethods(JenScript.TranslateY,{
		___init: function(config){
			config = config || {};
			config.Id = 'translate_ty'+JenScript.sequenceId++;
			config.width=18;
			config.height=80;
			config.xIndex=100;
			config.yIndex=1;
			config.barOrientation = 'Vertical';
			JenScript.AbstractBackwardForwardBarWidget.call(this,config);
			
			this.setOutlineStrokeColor((config.outlineStrokeColor !== undefined)?config.outlineStrokeColor : 'black');
		    this.setOutlineFillColor(config.outlineFillColor);
		    this.setButtonDrawColor((config.buttonStrokeColor !== undefined)?config.buttonStrokeColor : 'black');
		    this.setButtonRolloverDrawColor((config.buttonRolloverStrokeColor !== undefined)?config.buttonRolloverStrokeColor : 'green');
		    this.sample = (config.sample !== undefined)?config.sample : {step : 20,sleep: 5,fraction:10};
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
	    }
		
	});
})();