(function(){
	//Modeled metrics based on flow model
	JenScript.AxisMetricsFlow = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AxisMetricsFlow, JenScript.AxisMetricsPlugin);

	JenScript.Model.addMethods(JenScript.AxisMetricsFlow, {
		___init : function(config){
			config = config ||{};
			var manager = new JenScript.MetricsManagerFlow(config);
			config.manager = manager;
			config.name='AxisMetricsFlow';
			JenScript.AxisMetricsPlugin.call(this,config);
		},
		
	});
})();