(function(){

	JenScript.GridManager = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.GridManager, {
		init : function(config){
			config = config ||{};
		},
		getOrientation : function(){
			return this.getGridsPlugin().gridOrientation;
		},
		setGridsPlugin : function(metricsPlugin){
			this.gridsPlugin=metricsPlugin;
		},
		getGridsPlugin : function(){
			return this.gridsPlugin;
		},
		getProjection : function(){
			return this.getGridsPlugin().getProjection();
		},
		getGrids : function(){}
	});
})();