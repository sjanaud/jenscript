(function(){

	
	 
	/**
	 * modeled metrics manager generate metrics based on exponent models
	 */
	JenScript.MetricsManagerModeled = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MetricsManagerModeled, JenScript.MetricsManager);
	JenScript.Model.addMethods(JenScript.MetricsManagerModeled, {
		/**
		 * init modeled metrics manager
		 */
		_init : function(config){
			config = config ||{};
			JenScript.MetricsManager.call(this,config);
			this.metricsModels = [];
		},
		
		/**
	     * create symmetric list model for given exponent (from -exponent to +exponent list model)
	     * @param {Object} exp  the reference exponent model
	     * @return {Object} a new collection of exponent model from -exp to +exp
	     */
	    createSymmetricListModel : function(exp) {
	        var models =[];
	        for (var i = -exp; i <= exp; i++) {
	            var m = this.createExponentModel(i);
	            models[models.length]=m;
	        }
	        return models;
	    },
		
	    /**
	     * create standard exponent model {@link MetricsModel} with the given exponent
	     * @param {Object} exp  the reference exponent model
	     * @return {Object} a new exponent model
	     */
	    createExponentModel : function(exp) {
	        var model = undefined;
	        var mutPattern = '';
	        if (exp < 0) {
	            mutPattern = mutPattern+"0.";
	            for (var j = 1; j < Math.abs(exp); j++) {
	                mutPattern = mutPattern+"0";
	            }
	            mutPattern = mutPattern+"1";
	            var multiplier = mutPattern;
	            model = new JenScript.MetricsModel({exponent : exp,factor :new JenScript.BigNumber(multiplier)});

	        }
	        else if (exp > 0) {
	            mutPattern = mutPattern +"1";
	            for (var j = 1; j <= Math.abs(exp); j++) {
	            	mutPattern = mutPattern+"0";
	            }
	            var multiplier = mutPattern;
	            model = new JenScript.MetricsModel({exponent : exp,factor:new JenScript.BigNumber(multiplier)});

	        }
	        else if (exp == 0) {
	            model = new JenScript.MetricsModel({exponent : 0,factor : new JenScript.BigNumber("1")});
	        }
	        return model;
	    },
		
		
		
	    /**
	     * register the given model
	     * @param {Object} model
	     */
	    registerMetricsModel :  function(model) {
	    	model.setMetricsManager(this);
	    	this.metricsModels[this.metricsModels.length] = model;
	        this.metricsModels.sort(function(m1,m2){
	        	return m1.factor.compareTo(m2.factor);
	        });
	    },

	    /**
	     * register the given model array
	     * @param {Object} models array
	     */
	    registerMetricsModels : function(models) {
	        for (var i = 0; i < models.length; i++) {
	            this.registerMetricsModel(models[i]);
	        }
	    },
	    
	    /**
	     * get all generated metrics based on the registered exponent model
	     */
	    getDeviceMetrics : function(){
	    	var m1=[];
	    	var m2=[];
	    	var m3=[];
			for (var m = 0; m < this.metricsModels.length; m++) {
				var valid = this.metricsModels[m].isValid();
				if(valid){
					//console.log("Apply exponent model: "+this.metricsModels[m].exponent);
					m1 = this.metricsModels[m].generateMetrics();
					var filterm1 = function(mf){
						 for (var f = 0; f < m1.length; f++) {
							 if(mf.userValue === m1[f].userValue)
								 return true;
						 }
						 return false;
					 };
					
					 if(m1.length < 4){
						var mf2 = this.metricsModels[m].generateMedianMetrics();
						for (var a = 0; a < mf2.length; a++) {
							if(!filterm1(mf2[a])){
								//mf2[a].median = true;
								m2[m2.length] = mf2[a];
							}
						}
					 }
					 var filterm2 = function(mf){
						 for (var f = 0; f < m2.length; f++) {
							 if(mf.userValue === m2[f].userValue)
								 return true;
						 }
						 return false;
					 };
					 
					 var subModel = this.createExponentModel((this.metricsModels[m].exponent-1));
					 subModel.setMetricsManager(this);
					 subModel.solveType = 'minor';
					 if(subModel.isValid()){
						var subMetrics = subModel.generateMetrics();
						for (var i = 0; i < subMetrics.length; i++) {
							if(!filterm1(subMetrics[i]) && !filterm2(subMetrics[i])){
								subMetrics[i].minor = true;
								m3[m3.length] = subMetrics[i];
							}
						}
					 }
					 return [].concat(m1,m2,m3);
				}
			}
	    },

	    /**
	     * generat metrics for the given value
	     * @param  {Number} userValue the user value for this metrics
	     * @param  {Number} model the given exponent model
	     * @return {Object} return new metrics
	     */
	    generateMetrics : function (userValue, model) {
	        var metrics = new JenScript.Metrics({metricsType:this.getMetricsType()});
	        var proj = this.getProjection();
	        var deviceValue = 0;
	        var maxPixelValue = 0;
	        if (this.getMetricsType() === JenScript.MetricsType.XMetrics) {
	            deviceValue = proj.userToPixelX(userValue);
	            maxPixelValue = proj.getPixelWidth();
	        }
	        else if (this.getMetricsType() === JenScript.MetricsType.YMetrics) {
	            deviceValue = proj.userToPixelY(userValue);
	            maxPixelValue = proj.getPixelHeight();
	        }

	        if (deviceValue < 0 || deviceValue > maxPixelValue) {
	            return undefined;
	        }

	        metrics.setDeviceValue(deviceValue);
	        metrics.setUserValue(userValue);
	        
//	        console.log("generate 1 metric for value label: "+metrics.label+" with type : "+this.getMetricsType() +" with model exponent :"+model.exponent);
//	        metrics.setLockLabel(isLockLabel());
//	        metrics.setLockMarker(isLockMarker());

	        return metrics;
	    }
	});
})();