(function(){

	
	/**
	 * modeled metrics manager generate metrics based on exponent models
	 */
	JenScript.TimeMetricsManager = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TimeMetricsManager, JenScript.MetricsManager);
	JenScript.Model.addMethods(JenScript.TimeMetricsManager, {
		/**
		 * init modeled metrics manager
		 */
		_init : function(config){
			config = config ||{};
			JenScript.MetricsManager.call(this,config);
			this.timingModels = [];
			
			if(config.models !== undefined){
				for (var m = 0; m < config.models.length; m++) {
					var model = config.models[m];
					this.registerModel(model);
				}
			}
		},
		
		/**
		 * register time model
		 */
		registerModel : function(model){
			model.setMetricsManager(this);
			this.timingModels[this.timingModels.length] = model;
		},
		
		/**
	     * get the applicable sequence metrics timing according to managers timing models
	     * 
	     * @return timing sequence
	     */
	    getTimingSequence : function() {
	    	var sequence = [];
	        var timeProjection = this.getTimingProjection();
	        this.timingModels.sort(function (tm1, tm2) {
	        	 if (tm1.getMillis() > tm2.getMillis()) {
	                 return 1;
	             }
	             else if (tm1.getMillis() > tm2.getMillis()) {
	                 return -1;
	             }
	             else {
	                   return 0;
	             }
	        });
	        //console.log("count timing models : "+this.timingModels.length);
	        for (var m = 0; m < this.timingModels.length; m++) {
	        	var  timingModel = this.timingModels[m];
	        	//console.log("check timing model : "+timingModel.name+" with pixel holder: "+timingModel.pixelLabelHolder);
	        	var projTimeMillis = timeProjection.durationMillis();
	        	var modelTimeMillis = timingModel.getMillis();
	        	
	        	//in normal mode ?
	        	if ((projTimeMillis / modelTimeMillis) * timingModel.pixelLabelHolder < timeProjection.getTimeDurationPixel()) {
	        		//console.log("accept model : "+timingModel.name);
	            	sequence[sequence.length] = timingModel;
	            }//in minimal with 4 pixel holder ?
	        	else if ((projTimeMillis / modelTimeMillis) * 4 < timeProjection.getTimeDurationPixel()) {
	        		//console.log("accept minified model : "+timingModel.name);
	        		var minifyModel = timingModel.getMinify();
	            	sequence[sequence.length] = minifyModel;
	            }else{
	            	//console.log("non accept model : "+timingModel.name);
	            }
	        	if(sequence.length >= 3) return sequence;
	        }
	        return sequence;
	    },
		
		
		 /**
	     * get all generated metrics based on the registered exponent model
	     */
	    getDeviceMetrics : function(){
	    	
	    	var models = this.getTimingSequence();
	    	//console.log("getDeviceMetrics with timing sequence model count "+models.length);
	    	var metrics = [];
	    	var sequenceCount = models.length;
	    	
	    	var perfomFilter = function(met){
	    		var filteredMetrics = [];
	    		//console.log("compare for total metrics : "+metrics.length);
	    		for (var m = 0; m < metrics.length; m++) {
	    			//console.log("compare = "+metrics[m].userValue+" with "+met.userValue);
					if(metrics[m].userValue === met.userValue){
						//console.log('remove metrics : '+metrics[m].userValue+" ,"+metrics[m].format());
					}
					else{
						filteredMetrics[filteredMetrics.length] = metrics[m];
					}
				}
	    		metrics = filteredMetrics;
	    	};
	    	
	    	var makeMinor = function (metrics){
	    		for (var gm = 0; gm < metrics.length; gm++) {
	    			var met = metrics[gm];
	    			met.minor=true;met.median=false;met.major=false;
	    		}
	    	};
	    	var makeMedian = function (metrics){
	    		for (var gm = 0; gm < metrics.length; gm++) {
	    			var met = metrics[gm];
	    			met.minor=false;met.median=true;met.major=false;
	    		}
	    	};
	    	var makeMajor = function (metrics){
	    		for (var gm = 0; gm < metrics.length; gm++) {
	    			var met = metrics[gm];
	    			met.minor=false;met.median=false;met.major=true;
	    		}
	    	};
	    	if(sequenceCount === 1){
	    		//console.log('sequence strategy : 1 '+models[0].name);
	    		models[0].setMetricsManager(this);
	    		var metrics1 = models[0].generateMetrics();
	    		if(models[0].minimal)
	    			makeMinor(metrics1);
	    		else
	    			makeMajor(metrics1);
	    		metrics = metrics.concat(metrics1);
	    	}
	    	else if(sequenceCount === 2){
	    		//console.log('sequence strategy : 2 '+models[0].name);
	    		models[0].setMetricsManager(this);
	    		models[1].setMetricsManager(this);
	    		var metrics1 = models[0].generateMetrics();
	    		var metrics2 = models[1].generateMetrics();
	    		if(models[0].minimal){
	    			makeMinor(metrics1);
	    			makeMajor(metrics2);
	    		}else{
	    			makeMedian(metrics1);
	    			makeMajor(metrics2);
	    		}
	    		
	    		metrics = metrics.concat(metrics1);
	    		for (var i = 0; i < metrics2.length; i++) {
					var m = metrics2[i];
					perfomFilter(m);
				}
	    		metrics = metrics.concat(metrics2);
	    	}
	    	else if(sequenceCount === 3){
	    		//console.log('sequence strategy : 3 '+models[0].name);
	    		
	    		models[0].setMetricsManager(this);
	    		models[1].setMetricsManager(this);
	    		models[2].setMetricsManager(this);
	    		
	    		var metrics1 = models[0].generateMetrics();
	    		var metrics2 = models[1].generateMetrics();
	    		var metrics3 = models[2].generateMetrics();
	    		
	    		//console.log("models generation ok");
	    		
	    		makeMinor(metrics1);
	    		metrics = metrics.concat(metrics1);
	    		//console.log("minor generation ok : "+metrics.length);
	    		
	    		makeMedian(metrics2);
//	    		for (var i = 0; i < metrics2.length; i++) {
//					var m = metrics2[i];
//					//perfomFilter(m);
//				}
	    		metrics = metrics.concat(metrics2);
	    		//console.log("median generation ok : "+metrics.length);
	    		
	    		makeMajor(metrics3);
	    		//console.log("major m3 size : "+metrics3.length);
	    		for (var j = 0; j < metrics3.length; j++) {
					var m = metrics3[j];
					//console.log('compare m3 : '+m.format());
					perfomFilter(m);
				}
	    		//console.log("median after filter ok : "+metrics.length);
	    		
	    		metrics = metrics.concat(metrics3);
	    		//console.log("major generation ok : "+metrics.length);
	    		
	    	}
	    	return metrics;
	    },

		
		/**
	     * get the window worker
	     * 
	     * @return time window
	     */
	    getTimingProjection : function() {
	        var proj = this.getProjection();
	        if (proj instanceof JenScript.LinearProjection) {
	            if (this.getMetricsType() === JenScript.MetricsType.XMetrics) {
	            	
	                var timeX = new JenScript.TimeXProjection(
	                					{
	                						minXDate : new Date(proj.getMinX()),
	                                        maxXDate : new Date(proj.getMaxX()),
	                                        minY : proj.getMinY(),
	                                        maxY : proj.getMaxY()
	                                    }
	                );
	                timeX.setView(proj.getView());
	                return timeX;
	            }
	            else if (this.getMetricsType() == JenScript.MetricsType.YMetrics) {
	            	var timeY =  new JenScript.TimeYProjection(
	            				{
	            					minX : proj.getMinX(),
	            					maxX : proj.getMaxX(),
	            					minYDate : new Date(proj.getMinY()),
	                                maxYDate : new Date(proj.getMaxY())                   
	            				}		
	            	);
	                timeY.setView(proj.getView());
	                return timeY;
	            }
	        }
	        else if (proj instanceof JenScript.TimeXProjection || proj instanceof JenScript.TimeYProjection) {
	        	//alert('proj instance time');
	            return  proj;
	        }
	        return undefined;
	    },
	    
	    /**
	     * generate a metrics for the given calendar
	     * 
	     * @param time
	     *            the time for this metrics
	     * @return metrics
	     */
	    generateMetricsPoint : function(time,model) {
	        var metrics = new JenScript.TimePointMetrics({metricsType:this.getMetricsType()});
	        metrics.setTime(time);
	        var userValue = time.getTime();
	        var timingWindow = this.getTimingProjection();
	        var deviceValue = timingWindow.timeToPixel(time);
	        var max = timingWindow.getTimeDurationPixel();
	        if (deviceValue < 0 || deviceValue > max){
	            return undefined;
	        }
	        metrics.setDeviceValue(deviceValue);
	        metrics.setUserValue(userValue);
	        return metrics;
	    },

	    /**
	     * generate metrics duration for the given start and end time
	     * 
	     * @param startTime
	     *            the start time of the duration
	     * @param endTime
	     *            the end time of the duration
	     * @return time duration
	     */
	    generateMetricsDuration : function(startTime,endTime,model) {
	        var pointStart = this.generateMetricsPoint(startTime, model);
	        var pointEnd = this.generateMetricsPoint(endTime, model);

	        var centerMillis = startTime.getTime() + (endTime.getTime() - startTime.getTime()) / 2;
	       
	        var middleTime = new Date(centerMillis);

	        var durationMetrics = new JenScript.TimeDurationMetrics(this.getMetricsType());
	        var userValue = middleTime.getTime();
	        var timingWindow = getTimingProjection();
	        var deviceValue = timingWindow.timeToPixel(middleTime);
	        var max = timingWindow.getTimeDurationPixel();

	        if (deviceValue < 0 || deviceValue > max)
	            return null;

	        durationMetrics.setDeviceValue(deviceValue);
	        durationMetrics.setUserValue(userValue);
	       
	        durationMetrics.setMetricsStart(pointStart);
	        durationMetrics.setMetricsEnd(pointEnd);
	        durationMetrics.setTimeStart(startTime.getTime());
	        durationMetrics.setTimeEnd(endTime.getTime());

	        return durationMetrics;
	    },


	    /**
	     * generate seconds from reference for the given duration and seconds increment
	     * 
	     * @param ref
	     * @param duration
	     * @param secondIncrement
	     * @return seconds metrics
	     */
	    generateSecondsPoint : function(ref,duration,secondIncrement,model) {
	    	var seconds = [];
	        for (var i = 0; i <= parseInt(duration) + 1; i = i + secondIncrement) {
	            var c = new Date(ref.getFullYear(),ref.getMonth(),ref.getDate(),ref.getHours(),ref.getMinutes(),ref.getSeconds()+i,0);
	            var m = this.generateMetricsPoint(c,model);
	            if (m != undefined) {
	            	seconds[seconds.length] = m;
	            }
	        }
	        return seconds;
	    },

	    /**
	     * generate minutes from reference for the given duration and minute increment
	     * 
	     * @param ref
	     * @param durationMinutes
	     * @param minuteIncrement
	     * @return minutes metrics
	     */
	    generateMinutesPoint : function(ref,durationMinutes,minuteIncrement,model) {
	    	//console.log('>>> generate minute points for model : '+model.name+' with ref :  '+ref +' and duration minutes : '+durationMinutes);
	    	var minutes = [];
	        for (var i = 0; i <= (parseInt(durationMinutes)); i = i + minuteIncrement) {
	            var c = new Date(ref.getFullYear(),ref.getMonth(),ref.getDate(),ref.getHours(),(ref.getMinutes()+i),0,0);
	            var m = this.generateMetricsPoint(c,model);
	            if (m !== undefined) {
	                minutes[minutes.length] = m;
	            }
	        }
	        return minutes;
	    },

	  
	    /**
	     *  generate hours from reference for the given duration and hours increment
	     * @param ref
	     * @param durationHours
	     * @param hoursIncrement
	     * @param model
	     * @return time point metrics collection
	     */
	    generateHoursPoint : function(ref,durationHours,hoursIncrement,model) {
	    	var hours = [];
	        for (var i = 0; i <= parseInt(durationHours) + 1; i = i + hoursIncrement) {
	            var c = new Date(ref.getFullYear(),ref.getMonth(),ref.getDate(),ref.getHours()+i,ref.getMinutes(),0,0);
	            var m = this.generateMetricsPoint(c,model);
	            if (m != undefined) {
	            	hours[hours.length] = m;
	            }
	        }
	        return hours;
	    },

	    /**
	     * generate days from reference for the given duration and days increment
	     * 
	     * @param ref
	     * @param durationDays
	     * @param daysIncrement
	     * @return days metrics
	     */
	    generateDaysPoint : function(ref,durationDays,daysIncrement,model) {
	        var days = [];
	        for (var i = 0; i <= parseInt(durationDays) + 1; i = i + daysIncrement) {
	            var c = new Date(ref.getFullYear(),ref.getMonth(),ref.getDate()+i,ref.getHours(),0,0,0);
	            var m = this.generateMetricsPoint(c,model);
	            if (m != undefined) {
	            	days[days.length] = m;
	            }
	        }
	        return days;
	    },

	    /**
	     * generate months from reference for the given duration and months increment
	     * 
	     * @param ref
	     * @param durationMonth
	     * @param monthsIncrement
	     * @return months metrics
	     */
	    generateMonthsPoint : function(ref,durationMonth,monthsIncrement,model) {
	        var days = [];
	        for (var i = 0; i <= parseInt(durationMonth) + 12 + 1; i = i + monthsIncrement) {
	        	var c = new Date(ref.getFullYear(),ref.getMonth()+i,1,0,0,0);
	            var m = this.generateMetricsPoint(c, model);
	            if (m != undefined) {
	            	days[days.length] = m;
	            }
	        }
	        return days;
	    },
	    
	    /**
	     * generate years from reference for the given duration and months increment
	     * 
	     * @param ref
	     * @param durationYears
	     * @param yearsIncrement
	     * @return years metrics
	     */
	    generateYearsPoint : function(ref,durationYears,yearsIncrement,model) {
	        var years = [];
	        for (var i = 0; i <= parseInt(durationYears); i = i + yearsIncrement) {
	        	var c = new Date(ref.getFullYear()+i,0,1,0,0,0);
	            var m = this.generateMetricsPoint(c, model);
	            if (m != undefined) {
	            	years[years.length] = m;
	            }
	        }
	        return years;
	    },
	});
})();