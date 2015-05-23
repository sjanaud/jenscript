(function(){
	JenScript.TranslateX = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TranslateX, JenScript.AbstractBackwardForwardBarWidget);
	JenScript.Model.addMethods(JenScript.TranslateX,{
		___init: function(config){
			config = config || {};
			config.Id = 'translate_tx'+JenScript.sequenceId++;
			config.width=(config.width !== undefined)?config.width:100;
			config.height=(config.height !== undefined)?config.height:16;
			config.xIndex=(config.xIndex !== undefined)?config.xIndex:2;
			config.yIndex=(config.yIndex !== undefined)?config.yIndex:100;
			config.barOrientation = 'Horizontal';
			JenScript.AbstractBackwardForwardBarWidget.call(this,config);
			
		    this.setOutlineStrokeColor((config.outlineStrokeColor !== undefined)?config.outlineStrokeColor : 'black');
		    this.setButtonDrawColor((config.buttonDrawColor !== undefined)?config.buttonDrawColor : 'black');
		    this.setButtonRolloverDrawColor((config.buttonRolloverDrawColor !== undefined)?config.buttonRolloverDrawColor : 'green');
		   
		    this.sample = (config.sample !== undefined)?config.sample : {step : 20,sleep: 5,fraction:10};
		    this.setOrphanLock(true);
		},
	    onButton1Press : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('West', this.sample);
	    },
	    onButton2Press : function() {
	    	if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('East', this.sample);
	    },
	    
	    onRegister : function(){
	    	this.attachPluginLockUnlockFactory('TranlateX widget factory');
	    }
	});
})();