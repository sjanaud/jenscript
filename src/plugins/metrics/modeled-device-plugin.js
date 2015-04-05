(function(){
	//Modeled metrics based on exponent model
	JenScript.DeviceMetricsModeled = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.DeviceMetricsModeled, JenScript.DeviceMetricsPlugin);

	JenScript.Model.addMethods(JenScript.DeviceMetricsModeled, {
		___init : function(config){
			config = config ||{};
			var manager = new JenScript.MetricsManagerModeled(config);
			var models = manager.createSymmetricListModel(20);
			manager.registerMetricsModels(models);
			config.manager = manager;
			config.name='DeviceMetrics';
			JenScript.DeviceMetricsPlugin.call(this,config);
		},
	});
})();