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
	        this.getHost().shift('North');

	    },
	    onButton2Press : function() {
	        if (!this.getHost().isLockSelected()) {
	            return;
	        }
	        this.getHost().shift('South');
	    },
	    
	    onRegister : function(){
	    	this.attachPluginLockUnlockFactory('TranlateY widget factory');
	    }
		
	});
})();