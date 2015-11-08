(function(){
	//Modeled metrics based on manual free model
	JenScript.AxisMetricsFree = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AxisMetricsFree, JenScript.AxisMetricsPlugin);

	JenScript.Model.addMethods(JenScript.AxisMetricsFree, {
		___init : function(config){
			config = config ||{};
			var manager = new JenScript.MetricsManagerFree(config);
			config.manager = manager;
			config.name='AxisMetricsFree';
			JenScript.AxisMetricsPlugin.call(this,config);
		},
		
		addMetrics : function(value,label){
			this.getMetricsManager().addMetrics(value,label);
		},
		
	});
})();