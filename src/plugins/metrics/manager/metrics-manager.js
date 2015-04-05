(function(){
	JenScript.MetricsManager = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.MetricsManager, {
		init : function(config){
			config = config ||{};
			this.metricsType;
			this.metricsPlugin;
		},
		
		setMetricsPlugin : function(metricsPlugin){
			this.metricsPlugin=metricsPlugin;
		},
		getMetricsPlugin : function(){
			return this.metricsPlugin;
		},
		
		setMetricsType : function(metricsType){
			this.metricsType=metricsType;
		},
		getMetricsType : function(){
			return this.metricsType;
		},
		
		getProjection : function(){
			return this.metricsPlugin.getProjection();
		},
		
		getDeviceMetrics : function(){
			return [];
		}
	});
})();