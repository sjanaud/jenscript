(function(){
	//Modeled metrics based on exponent model
	JenScript.AxisMetricsModeled = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AxisMetricsModeled, JenScript.AxisMetricsPlugin);

	JenScript.Model.addMethods(JenScript.AxisMetricsModeled, {
		___init : function(config){
			config = config ||{};
			var manager = new JenScript.MetricsManagerModeled(config);
			var models = manager.createSymmetricListModel(20);
			manager.registerMetricsModels(models);
			config.manager = manager;
			config.name='AxisMetricsModeled';
			JenScript.AxisMetricsPlugin.call(this,config);
		},
	});
})();