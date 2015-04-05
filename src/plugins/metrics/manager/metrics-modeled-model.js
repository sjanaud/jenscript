(function(){
	//
	// MODELED METRICS
	//
	/**
	 * metrics model takes the responsibility to create metrics based on multiplier exponent model
	 */
	JenScript.MetricsModel = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.MetricsModel, {
		/**
		 * init metrics model
		 */
		init : function(config){
			config = config||{};
	        /**model exponent*/
	        this.exponent = config.exponent;
	        /** metrics factor */
	        this.factor = config.factor;
	        /** metrics manager */
	        this.metricsManager;
	        /** the start reference to generate metrics */
	        this.ref;
	        /** the max value to attempt */
	        this.maxValue;
	        /** pixel label holder */
	        this.pixelLabelHolder;
	        /** metrics label color */
	        this.metricsLabelColor;
	        /** metrics marker color */
	        this.metricsMarkerColor;
	        /** minimal tag for this domain */
	        this.solveType = 'major';
		},
		
		/**
		 * get metrics manager of this model
		 * @returns {Object} metrics manager
		 */
		getMetricsManager : function(){
			return this.metricsManager;
		},
		
		/**
		 * set metrics manager of this model
		 * @param {Object} metrics manager
		 */
		setMetricsManager : function(metricsManager){
			this.metricsManager = metricsManager;
		},
		
		/**
         * generates median metrics for this model
         * @return metrics
         */
        generateMedianMetrics : function() {
        	this.solveType = 'median';
        	this.solve();
        	var originFactor = this.factor;
        	this.factor = this.factor.multiply(0.5);
        	var that = this;
        	var formater = function(){
            	if(that.exponent < 0){
            		if(new JenScript.BigNumber("0").equals(this.userValue))return '0';
    	        	return this.userValue.toFixed(Math.abs(that.exponent)+1);
    	        }
    	        else{
    	        	return this.userValue;
    	        }
            };
        	var metrics = this.generateMetrics();
        	for(var i = 0;i<metrics.length;i++){
        		metrics[i].median = formater;
        		metrics[i].format = formater;
        	}
        	this.factor = originFactor;
        	return metrics;
        },
		
		/**
         * generates all metrics for this model
         * @return {Object} metrics array
         */
        generateMetrics : function() {
        	this.solveType = 'major';
        	this.solve();
        	var metrics = [];
            var flag = true;
            var metricsValue = this.ref;
            var that = this;
            var formater = function(){
            	if(that.exponent < 0){
    	        	if(new JenScript.BigNumber("0").equals(this.userValue))return '0';
            		return this.userValue.toFixed(Math.abs(that.exponent));
    	        }
    	        else{
    	        	return this.userValue;
    	        }
            };
            var m0 = this.getMetricsManager().generateMetrics(metricsValue.toNumber(), this);
            if (m0 !== undefined) {
                metrics[metrics.length]=m0;
                m0.major = true;
                m0.format = formater;
            }
            while(flag){
            	metricsValue = metricsValue.add(this.factor);
            	 var m = this.getMetricsManager().generateMetrics(metricsValue.toNumber(), this);
                 if (m !== undefined) {
                	 m.major = true;
                	 m.format = formater;
                     metrics[metrics.length]=m;
                 }
                 if(metricsValue.greaterThanOrEqualTo(this.maxValue))
                	 flag = false;
            }
            return metrics;
        },
		
        /**
         * solve this model according with given model parameters
         */
        solve : function (){
        	var proj = this.metricsManager.getProjection();
            if (this.getMetricsManager().getMetricsType() === JenScript.MetricsType.XMetrics) {
            	this.userSize = new JenScript.BigNumber(proj.getUserWidth()+'');
            	JenScript.BigNumber.config({ ROUNDING_MODE : JenScript.BigNumber.ROUND_CEIL });
                var bd1 = new JenScript.BigNumber(proj.getMinX()+'').divide(this.factor);
                var bi1 = new JenScript.BigNumber(bd1.toFixed(0));
                this.ref = new JenScript.BigNumber(bi1).multiply(this.factor);
                this.ref = this.ref.subtract(this.factor);
                if(this.ref.equals(0)){
                	this.ref = this.ref.subtract(this.factor);
                }
                this.pixelSize = new JenScript.BigNumber(proj.getPixelWidth()+'');
                this.maxValue = new JenScript.BigNumber(proj.getMaxX()+'');
            }
            else if (this.getMetricsManager().getMetricsType() === JenScript.MetricsType.YMetrics) {
            	this.userSize = new JenScript.BigNumber(proj.getUserHeight()+'');
            	JenScript.BigNumber.config({ ROUNDING_MODE : JenScript.BigNumber.ROUND_CEIL });
                var bd1 = new JenScript.BigNumber(proj.getMinY()+'').divide(this.factor);
                var bi1 = new JenScript.BigNumber(bd1.toFixed(0));
                this.ref = new JenScript.BigNumber(bi1).multiply(this.factor);
                this.ref = this.ref.subtract(this.factor);
                
                if(this.ref.equals(0)){
                	this.ref = this.ref.subtract(this.factor);
                }
                this.pixelSize = new JenScript.BigNumber(proj.getPixelHeight()+'');
                this.maxValue = new JenScript.BigNumber(proj.getMaxY()+'');
            }
            JenScript.BigNumber.config({ ROUNDING_MODE : JenScript.BigNumber.ROUND_HALF_EVEN });
            var s = (this.ref.toNumber()+'').length;
            if(this.solveType === 'major')
            	this.pixelLabelHolder = 3/4*s*this.metricsManager.metricsPlugin.median.tickTextFontSize;
            else if(this.solveType === 'median')
            	this.pixelLabelHolder = 3/4*s*this.metricsManager.metricsPlugin.median.tickTextFontSize;
            else if(this.solveType === 'minor')
            	this.pixelLabelHolder = 8;
        },
        
    
        
		 /**
         * return true if this model is applicable, false otherwise
         * @return {Boolean} true if this model is applicable, false otherwise
         */
        isValid : function() {
            this.solve();
            var compare = (this.userSize.divide(this.factor)).multiply(new JenScript.BigNumber(this.pixelLabelHolder)).compareTo(this.pixelSize);
            return (compare === -1) ? true: false;
        }
	});
})();