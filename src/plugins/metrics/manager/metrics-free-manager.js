(function(){

	JenScript.MetricsManagerFree = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MetricsManagerFree, JenScript.MetricsManager);
	JenScript.Model.addMethods(JenScript.MetricsManagerFree, {
		_init : function(config){
			config = config ||{};
			this.inputMetrics = [];
			JenScript.MetricsManager.call(this,config);
		},
		
		/**
		 * add metrics with specified parameter
		 * 
		 * @param {Number} value
		 *          metric value
		 * @param {String} label
		 * 			metric label
		 */
		addMetrics : function(value,label) {
		    this.inputMetrics.push({value : value, label : label});
		},
		
		getDeviceMetrics : function(){
			var metrics = [];
	        var proj = this.getProjection();
	        var userWidth = proj.getUserWidth();
	        var userHeight = proj.getUserHeight();
	        
	        if (this.getMetricsType() === JenScript.MetricsType.XMetrics) {
	        	for (var i = 0; i < this.inputMetrics.length; i++) {
	                var t = this.inputMetrics[i];
	                var userMetricsX = t.value;
	                if (userMetricsX >= proj.getMinX() && userMetricsX <= proj.getMaxX()) {
	                    var pd = proj.userToPixelX(userMetricsX);
	                    var m = new JenScript.Metrics({metricsType:JenScript.MetricsType.XMetrics});
	                   
	                    m.setDeviceValue(pd);
	                    m.setUserValue(userMetricsX);
	                    m.label = t.label;
	                    if(t.label === undefined)
		                    m.format = function(){
			                	return this.userValue;
			                };
		                else
		                	m.format = function(){
		                		return this.label;
		                	};
		                metrics[metrics.length]=m; 
	                }
	            }
	        }
	        else if (this.getMetricsType()  === JenScript.MetricsType.YMetrics) {
	        	  for (var i = 0; i < this.inputMetrics.length; i++) {
	                  var t = this.inputMetrics[i];
	                  var userMetricsY = t.value;
	                  if (userMetricsY > proj.getMinY() && userMetricsY < proj.getMaxY()) {
	                      var pd = proj.userToPixelY(userMetricsY);
	                      var m = new JenScript.Metrics({metricsType:JenScript.MetricsType.YMetrics});
	                      m.setDeviceValue(pd);
	                      m.setUserValue(userMetricsY);
	                      m.label = t.label;
	                      if(t.label === undefined)
			                    m.format = function(){
				                	return this.userValue;
				                };
			                else
			                	m.format = function(){
			                		return this.label;
			                	};
			              metrics[metrics.length]=m; 
	                  }
	        	  }
	        }
	        return metrics;
	}
});

})();