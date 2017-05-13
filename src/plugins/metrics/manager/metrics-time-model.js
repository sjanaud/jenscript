(function(){

	/**
	 * time metrics model takes the responsibility to create time metrics based on time model
	 */
	JenScript.TimeModel = function(config) {
		//TimeModel
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.TimeModel, {
		/**
		 * init metrics model
		 */
		init : function(config){
			config = config||{};
	        /**time model*/
	        this.millis = config.millis;
	        /** metrics manager */
	        this.metricsManager;
	        /** the model name  */
	        this.name = config.name;
	        /** the model family name */
	        this.familyName = config.familyName;
	        /** pixel label holder */
	        this.pixelLabelHolder = (config.pixelLabelHolder !== undefined )?config.pixelLabelHolder : 18;
	        /**minimal*/
	        this.minimal = (config.minimal !== undefined)?config.minimal : false;
	        /**unit*/
	        this.unit;
	        /**user formater*/
	        this.format = config.format;
		},
		
		/**
         * @param 
         */
        setFormat : function(format) {
             this.format = format;
        },
        
        /**
         * @return the format
         */
        getFormat : function() {
            return this.format;
        },
		
		/**
         * @return the millis
         */
        getMillis : function() {
            return this.millis;
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
		 * override this method to provide metrics for this model 
		 */
		generateMetrics : function() {return[];},
		
		
		/**
		 * override this method to provide minify of this model 
		 */
		getMinify : function() {
			var conf = {};
    		conf.millis =  this.millis;
    		conf.name = this.name+ ' minified';
    		conf.familyName = this.familyName;
    		conf.unit = this.unit;
    		conf.pixelLabelHolder = 4;
    		conf.minimal = true;
    		var minifyModel = new JenScript.TimeModel(conf);
    		minifyModel.generateMetrics = this.generateMetrics;
			return minifyModel;
		},
		
	});
})();