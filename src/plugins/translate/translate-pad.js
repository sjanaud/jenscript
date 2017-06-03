(function(){
	JenScript.TranslatePad = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TranslatePad, JenScript.AbstractBackwardForwardPadWidget);
	JenScript.Model.addMethods(JenScript.TranslatePad,{
		___init: function(config){
			config = config || {};
			config.Id = 'translate_pad'+JenScript.sequenceId++;
			config.width=64;
			config.height=64;
			config.xIndex=60;
			config.yIndex=100;
			
			JenScript.AbstractBackwardForwardPadWidget.call(this,config);
			
		    /** theme color to fill pad base */
		    this.baseFillColor = 'black';
		    /** theme color to draw pad base */
		    this.baseStrokeColor = '#f39c12';
		    /** stroke width to draw pad base */
		    this.baseStrokeWidth = 1;
		    /** theme color to fill pad control */
		   // this.controlFillColor = 'rgba(250,0,0,0.4)';
		    /** theme color to draw pad control */
		    this.controlStrokeColor = '#2980b9';
		    /** stroke width to draw pad control */
		    this.controlStrokeWidth =1;
		    /** button fill color */
		    this.buttonFillColor = '#2ecc71';
		    /** button rollover fill color */
		    this.buttonRolloverFillColor = '#f39c12';
		    /** button stroke color */
		    this.buttonStrokeColor =  '#8e44ad';
		    /** button rollover stroke color */
		    this.buttonRolloverStrokeColor ='#f39c12';
		    /** button stroke */
		    this.buttonStrokeWidth =1;
		},
		
		
	    onNorthButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('North');
	    },
	  
	    onSouthButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('South');
	    },

	    onWestButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('West');
	    },

	    onEastButtonPress : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('East');
	    },
	    
	    onRegister : function(){
	    	this.attachPluginLockUnlockFactory('Tranlate Pad widget factory');
	    }
	});
})();