(function(){
	JenScript.ZoomBoxWidget = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ZoomBoxWidget, JenScript.AbstractBackwardForwardBarWidget);
	JenScript.Model.addMethods(JenScript.ZoomBoxWidget,{
		___init: function(config){
			config = config || {};
			config.name = 'ZoomBoxHistory';
			config.Id = 'boxhistory'+JenScript.sequenceId++;
			config.width=(config.width !== undefined)?config.width:100;
			config.height=(config.height !== undefined)?config.height:16;
			config.xIndex=(config.xIndex !== undefined)?config.xIndex:2;
			config.yIndex=(config.yIndex !== undefined)?config.yIndex:100;
			config.barOrientation = 'Horizontal';
			JenScript.AbstractBackwardForwardBarWidget.call(this,config);
		    this.sample = (config.sample !== undefined)?config.sample : {step : 2, sleep: 100,fraction:5};
		    this.setOrphanLock(true);
		},
	    onButton1Press : function() {
	        this.getHost().backHistory();
	    },
	    onButton2Press : function() {
	    	 this.getHost().nextHistory();
	    },
	    
//	    onRegister : function(){
//	    	var that = this;
//	    	var proj = this.getHost().getProjection();
//	    	if(proj !== undefined){
//	    		var view = proj.getView();
//	    		if(view !== undefined){
//	    			this.create();
//				}
//	    	}else{
//	    		this.getHost().addPluginListener('projectionRegister',function (plugin){
//	    			//console.log("attach projection listener");
//					if(plugin.getProjection().getView() !== undefined){
//						that.create();
//					}else{
//						//wait view registering
//						plugin.getProjection().addProjectionListener('viewRegister',function(proj){
//							that.create();
//						},'Wait for projection view registering for box widget ');
//					}
//				},'Plugin listener for projection register for box widget');
//	    	}
//	    }
	});
})();