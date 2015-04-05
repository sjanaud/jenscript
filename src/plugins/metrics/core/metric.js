(function(){
	JenScript.MetricsType = {
			XMetrics : 'XMetrics',
			YMetrics : 'YMetrics',
	};
	JenScript.Axis = {
			AxisSouth : 'AxisSouth',
			AxisEast  : 'AxisEast',
			AxisWest  : 'AxisWest',
			AxisNorth : 'AxisNorth',
	};
	JenScript.DeviceAxis = {
			AxisX : 'AxisX',
			AxisY : 'AxisY',
	};
	
	JenScript.Metrics = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.Metrics, {
		
	 init : function(config){
			config=config||{};
			/**Id*/
			this.Id='metrics'+JenScript.sequenceId++;
			/**metric type*/
			this.metricsType = config.metricsType;
			/** device value */
			this.deviceValue;
		    /** user value */
			this.userValue;
		    /** metrics marker color */
			this.metricsMarkerColor;
		    /** metrics label color */
			this.metricsLabelColor;
		    /** metrics format */
			this.format;
		    /** metrics label */
			this.metricsLabel;
			/** lock marker flag */
		    this.lockMarker;
		    /** lock label */
		    this.lockLabel;
		    /** visible flag */
		    this.visible = true;
			
		    this.rotate = false;
			//this.gravity ='Neutral';
			this.markerLocation;
			this.markerPosition;
			
	 },
	 
	 getTickMarkerSize : function(){
		 if(this.minor)
	    	return this.metricsPlugin.minor.tickMarkerSize;
		 if(this.median)
		    return this.metricsPlugin.median.tickMarkerSize;
		 return this.metricsPlugin.major.tickMarkerSize;
	 },
	 getTickMarkerColor : function(){
		 if(this.minor)
	    	return this.metricsPlugin.minor.tickMarkerColor;
		 if(this.median)
		    return this.metricsPlugin.median.tickMarkerColor;
		 return this.metricsPlugin.major.tickMarkerColor;
	 },
	 getTickMarkerStroke : function(){
		 if(this.minor)
	    	return this.metricsPlugin.minor.tickMarkerStroke;
		 if(this.median)
		    return this.metricsPlugin.median.tickMarkerStroke;
		 return this.metricsPlugin.major.tickMarkerColor;
	 },
	 getTickTextColor : function(){
		 if(this.minor)
	    	return this.metricsPlugin.minor.tickTextColor;
		 if(this.median)
		    return this.metricsPlugin.median.tickTextColor;
		 return this.metricsPlugin.major.tickTextColor;
	 },
	 getTickTextFontSize : function(){
		 if(this.minor)
	    	return 0;
		 if(this.median)
		    return this.metricsPlugin.median.tickTextFontSize;
		 return this.metricsPlugin.major.tickTextFontSize;
	 },
	 getTickTextOffset : function(){
		 if(this.minor)
	    	return 0;
		 if(this.median)
		    return this.metricsPlugin.median.tickTextOffset;
		 return this.metricsPlugin.major.tickTextOffset;
	 },
	 
	 setDeviceValue : function(value){
	    	this.deviceValue=value;
	 },
	 
	 setUserValue : function(value){
	    	this.userValue=value;
	 },
	
	 getDeviceValue : function(){
	    	return this.deviceValue;
	 },
	 getUserValue : function(){
	    	return this.userValue;
	 },
		
//	  setGravity : function(gravity){
//	    	this.gravity=gravity;
//	  },
//	  getGravity : function(){
//	    	return this.gravity;
//	  },
	  
	  setRotate : function(rotate){
	    	this.rotate=rotate;
	  },
	  isRotate : function(){
	    	return this.rotate;
	  },
	  
	  setMarkerLocation : function(markerLocation){
	    	this.markerLocation=markerLocation;
	  },
	  getMarkerLocation : function(){
	    	return this.markerLocation;
	  },
	  
	  setMarkerPosition : function(markerPosition){
	    	this.markerPosition=markerPosition;
	  },
	  getMarkerPosition : function(){
	    	return this.markerPosition;
	  },
	  
	  setMetricsType : function(metricsType){
	    	this.metricsType=metricsType;
	  },
	  getMetricsType : function(){
	    	return this.metricsType;
	  },
	  
	  getMetricsMarkerColor : function() {
        return this.metricsMarkerColor;
	  },
	    
	  setMetricsMarkerColor :  function(metricsMarkerColor) {
	        this.metricsMarkerColor = metricsMarkerColor;
	  },
	  
	});
	
	
	//
	// TIMING METRICS
	//
	
	/**
	 * time metrics point extends metrics with date time
	 */
	JenScript.TimePointMetrics = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TimePointMetrics, JenScript.Metrics);
	JenScript.Model.addMethods(JenScript.TimePointMetrics, {
		/**
		 * init time metrics point
		 */
		_init : function(config){
			config = config ||{};
			JenScript.Metrics.call(this,config);
			this.time = config.time;
		},
		
		/**
		 * get time metrics
		 * @returns {Object} time
		 */
		getTime : function(){
			return this.time;
		},
		
		/**
		 * set time metrics
		 * @param {Object} time
		 */
		setTime : function(time){
			this.time = time;
		},
	});
	
	
	/**
	 * time duration metrics point extends metrics with 2 date time and 2 metrics reference
	 */
	JenScript.TimeDurationMetrics = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TimeDurationMetrics, JenScript.Metrics);
	JenScript.Model.addMethods(JenScript.TimeDurationMetrics, {
		/**
		 * init duration time metrics point
		 */
		_init : function(config){
			config = config ||{};
			JenScript.Metrics.call(this,config);
			this.timeStart;
			this.timeEnd;
			this.metricsStart;
			this.metricsEnd;
		},
		
		 /**
         * @return the metricsStart
         */
        getMetricsStart : function() {
            return this.metricsStart;
        },

        /**
         * @param metricsStart
         *            the metricsStart to set
         */
        setMetricsStart : function(metricsStart) {
            this.metricsStart = metricsStart;
        },

        /**
         * @return the metricsEnd
         */
        getMetricsEnd : function() {
            return this.metricsEnd;
        },

        /**
         * @param metricsEnd
         *            the metricsEnd to set
         */
        setMetricsEnd : function(metricsEnd) {
            this.metricsEnd = metricsEnd;
        },

        /**
         * @return the timeStart
         */
        getTimeCenter : function() {
            var diff = this.timeEnd.getTime() - this.timeStart.getTime();
            var centerTime = this.timeStart.getTime() + diff / 2;
            return new Date(centerTime);
        },

        /**
         * @return the timeStart
         */
        getTimeStart : function() {
            return this.timeStart;
        },

        /**
         * @param timeStart
         *            the timeStart to set
         */
        setTimeStart : function(timeStart) {
            this.timeStart = timeStart;
        },

        /**
         * @return the timeEnd
         */
        getTimeEnd : function() {
            return this.timeEnd;
        },

        /**
         * @param timeEnd
         *            the timeEnd to set
         */
        setTimeEnd : function(timeEnd) {
            this.timeEnd = timeEnd;
        },

	});
	
	
})();