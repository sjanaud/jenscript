(function(){

	JenScript.MetricsManagerStatic = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MetricsManagerStatic, JenScript.MetricsManager);
	JenScript.Model.addMethods(JenScript.MetricsManagerStatic, {
		_init : function(config){
			config = config ||{};
			this.metricsCount = config.metricsCount;
			JenScript.MetricsManager.call(this,config);
		},
		
		getDeviceMetrics : function(){
			var metrics = [];
	        var proj = this.getProjection();
	        var userWidth = proj.getUserWidth();
	        var userHeight = proj.getUserHeight();
	        if (this.getMetricsType() === JenScript.MetricsType.XMetrics) {
	            var userMetricsX;
	            for (var i = 0; i < this.metricsCount; i++) {
	                userMetricsX = proj.getMinX() + i * userWidth /(this.metricsCount - 1);
	                var pixelMetricsX = proj.userToPixelX(userMetricsX);
	                var m = new JenScript.Metrics({metricsType:JenScript.MetricsType.XMetrics});
	                m.setDeviceValue(pixelMetricsX);
	                m.setUserValue(userMetricsX);
 	                m.format = function(){
	                	return this.userValue;
	                };
	                metrics[metrics.length]=m;
	            }

	        }
	        else if (this.getMetricsType()  === JenScript.MetricsType.YMetrics) {
	            var userMetricsY;
	            for (var i = 0; i < this.metricsCount; i++) {
	                userMetricsY = proj.getMinY() + i * userHeight / (this.metricsCount - 1);
	                var pixelMetricsY = proj.userToPixelY(userMetricsY);
	                var m = new JenScript.Metrics({metricsType:JenScript.MetricsType.YMetrics});
	                m.setDeviceValue(pixelMetricsY);
	                m.setUserValue(userMetricsY);
	                m.format = function(){
	                	return this.userValue;
	                };
	                metrics[metrics.length]=m;
	            }

	        }
			return metrics;
		}
	});

})();