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
			var percents = ['0%','20%','50%','80%','100%'];
		    var colors = [ 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0,0.6)', 'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.6)','rgba(0, 0, 0, 0.1)' ];
		    var buttonDrawColor = 'rgb(91,151,168)';
		    var buttonRolloverDrawColor = 'rgb(247,239,100)';
			this.setShader({percents:percents, colors:colors});
		    this.setOutlineStrokeColor(buttonDrawColor);
		    this.setButtonDrawColor(buttonDrawColor);
		    this.setButtonRolloverDrawColor(buttonRolloverDrawColor);
		    this.setOrphanLock(true);
		},
	    onButton1Press : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('West');
	    },
	    onButton2Press : function() {
	    	if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('East');
	    },
	    
	    onRegister : function(){
	    	this.attachPluginLockUnlockFactory('TranlateX widget factory');
	    }
	});
})();