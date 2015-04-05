(function(){
	
	JenScript.GridModeledPlugin = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GridModeledPlugin, JenScript.AbstractGridPlugin);
	JenScript.Model.addMethods(JenScript.GridModeledPlugin, {
		__init : function(config){
			config = config ||{};
			config.name ='GridModeledPlugin';
			this.gridManager = new JenScript.GridManagerModeled(config);
			var models = this.gridManager.createSymmetricListModel(20);
			this.gridManager.registerGridModels(models);
			JenScript.AbstractGridPlugin.call(this,config);
		},
		
		getGridManager : function(){
			return this.gridManager;
		},
		
	});
	
})();