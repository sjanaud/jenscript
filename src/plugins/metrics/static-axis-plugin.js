(function(){
	JenScript.AxisMetricsStatic = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AxisMetricsStatic, JenScript.AxisMetricsPlugin);

	JenScript.Model.addMethods(JenScript.AxisMetricsStatic, {
		___init : function(config){
			config = config ||{};
			var manager = new JenScript.MetricsManagerStatic(config);
			config.manager = manager;
			JenScript.AxisMetricsPlugin.call(this,config);
		},
	});
})();