(function(){

	JenScript.MetricsManagerFlow = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MetricsManagerFlow, JenScript.MetricsManager);
	JenScript.Model.addMethods(JenScript.MetricsManagerFlow, {
		_init : function(config){
			config = config ||{};
			this.flowStart = config.flowStart;
		    this.flowEnd = config.flowEnd;
		    this.flowInterval = config.flowInterval;
			this.inputMetrics = [];
			JenScript.MetricsManager.call(this,config);
		},
		
		getDeviceMetrics : function(){
			var metrics = [];
	        var proj = this.getProjection();
	        var userWidth = proj.getUserWidth();
	        var userHeight = proj.getUserHeight();
	        

	        if(this.flowEnd <= this.flowStart)
	        	throw new Error("metrics flow end should be greater than metrics flow start");
	        
	        var start    = new JenScript.BigNumber(this.flowStart+"");
	        var end      = new JenScript.BigNumber(this.flowEnd+"");
	        var interval = new JenScript.BigNumber(this.flowInterval+"");
	        var flag = true;
	        var count = 0;
	        while(flag){
	        	var increment = new JenScript.BigNumber(count);
	        	var u = start.add(increment.multiply(interval));
	        	var uv = u.toNumber();
		        if (this.getMetricsType() === JenScript.MetricsType.XMetrics) {
	        		 var dx = proj.userToPixelX(uv);
	                 var m = new JenScript.Metrics({metricsType:JenScript.MetricsType.XMetrics});
	                 m.setDeviceValue(dx);
	                 m.setUserValue(uv);
	                 //m.setUserValueAsBigDecimal(mv);
	                 //m.setMetricsLabel(format(mv));
	                 m.format = function(){
		                	return this.userValue;
		             };
	                 if (uv >= proj.getMinX()  && uv <= proj.getMaxX()) {
	                	 metrics.push(m);
	                 }
	        	}
	        	else if (this.getMetricsType() === JenScript.MetricsType.YMetrics) {
	        		 var dy = proj.userToPixelY(uv);
	                 var m = new JenScript.Metrics({metricsType:JenScript.MetricsType.YMetrics});
	                 m.setDeviceValue(dy);
	                 m.setUserValue(uv);
	                 //metrics.setUserValueAsBigDecimal(m);
	                 //metrics.setMetricsLabel(format(m));
	                 m.format = function(){
		                	return this.userValue;
		             };
	                 if (uv >= proj.getMinY()  && uv <= proj.getMaxY()) {
	                	 metrics.push(m);
	                 }
	        	}
	        	
	        	if(uv > end.toNumber())
	        		flag = false;
	        	
	        	count++;
	        }
	        
	        return metrics;
	}
});

})();