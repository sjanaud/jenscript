(function(){
	//Timing metrics based on time model
	JenScript.AxisMetricsTiming = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AxisMetricsTiming, JenScript.AxisMetricsPlugin);

	JenScript.Model.addMethods(JenScript.AxisMetricsTiming, {
		___init : function(config){
			config = config ||{};
			var manager = new JenScript.TimeMetricsManager(config);
			config.manager = manager;
			config.name='AxisMetricsTiming';
			JenScript.AxisMetricsPlugin.call(this,config);
		},
	});
})();