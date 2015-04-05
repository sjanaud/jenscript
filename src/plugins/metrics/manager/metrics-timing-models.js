(function(){
	/**
	 * abstract minute model based on time model
	 */
	JenScript.MinuteModel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MinuteModel, JenScript.TimeModel);
	JenScript.Model.addMethods(JenScript.MinuteModel, {
		/**
		 * init minute model
		 */
		_init : function(config){
			config = config ||{};
			config.familyName = 'Minute Model';
			config.unit = 'minute';
			this.minuteMultiplier=config.minuteMultiplier;
			config.millis = 1000*60*this.minuteMultiplier;
			JenScript.TimeModel.call(this,config);
		},
		
//		getMinify : function() {
//			var conf = {};
//    		conf.millis =  this.millis;
//    		conf.name = this.name+ ' minified';
//    		conf.familyName = this.familyName;
//    		conf.unit = this.unit;
//    		conf.pixelLabelHolder = 4;
//    		conf.minimal = true;
//    		conf.minuteMultiplier = this.minuteMultiplier;
//			return new JenScript.MinuteModel(conf);
//		},
		
        generateMetrics : function() {
            var proj = this.getMetricsManager().getTimingProjection();
            var cal = new Date(proj.getMinDate());
            var ref = new Date(cal.getFullYear(),cal.getMonth(),cal.getDate(),cal.getHours(),0,0,0);
            //console.log("generic call generate metrics for model : "+this.name);
            //console.log("minute multiplier def : : "+this.minuteMultiplier);
            var points = this.getMetricsManager().generateMinutesPoint(ref,(proj.durationMinutes()+cal.getMinutes()),this.minuteMultiplier,this);
            for (var p = 0; p < points.length; p++) {
            	if(this.format){
            		var that = this;
                	if(!this.minimal){
                		points[p].format = function (){
                    		return that.format(this.getTime());
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}else{
            		if(!this.minimal){
            			points[p].format = function (){
                    		return this.getTime().getMinutes();
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}
			}
            return points;
        }
	});
	

	/**
	 * one 1 minute model based on time model
	 */
	JenScript.Minute1Model = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Minute1Model, JenScript.MinuteModel);
	JenScript.Model.addMethods(JenScript.Minute1Model, {
		/**
		 * init 1 minute model
		 */
		__init : function(config){
			config = config ||{};
			config.minuteMultiplier = 1;
			config.name = '1 minute model';
			JenScript.MinuteModel.call(this,config);
		},
	});
	
	
	/**
	 * 10 minutes model based on time model
	 */
	JenScript.Minute10Model = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Minute10Model, JenScript.MinuteModel);
	JenScript.Model.addMethods(JenScript.Minute10Model, {
		/**
		 * init 10 minutes model
		 */
		__init : function(config){
			config = config ||{};
			config.minuteMultiplier = 10;
			config.name = '10 minute model';
			JenScript.MinuteModel.call(this,config);
		},
		
	});
	
	
	/**
	 * 15 minutes model based on time model
	 */
	JenScript.Minute15Model = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Minute15Model, JenScript.MinuteModel);
	JenScript.Model.addMethods(JenScript.Minute15Model, {
		/**
		 * init 15 minutes model
		 */
		__init : function(config){
			config = config ||{};
			config.minuteMultiplier = 15;
			config.name = '15 minute model';
			JenScript.MinuteModel.call(this,config);
		},
		
	});
	
	
	/**
	 * 20 minutes model based on time model
	 */
	JenScript.Minute20Model = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.Minute20Model, JenScript.MinuteModel);
	JenScript.Model.addMethods(JenScript.Minute20Model, {
		/**
		 * init 20 minutes model
		 */
		__init : function(config){
			config = config ||{};
			config.minuteMultiplier = 20;
			config.name = '20 minute model';
			JenScript.MinuteModel.call(this,config);
		},
		
	});
	
	
	/**
	 * one hour model based on time model
	 */
	JenScript.HourModel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.HourModel, JenScript.TimeModel);
	JenScript.Model.addMethods(JenScript.HourModel, {
		/**
		 * init minute model
		 */
		_init : function(config){
			config = config ||{};
			config.millis = 1000*60*60;
			config.name = 'one hour';
			config.familyName = 'hour model';
			config.unit = 'hour';
			JenScript.TimeModel.call(this,config);
		},
		
        generateMetrics : function() {
            var time = this.getMetricsManager().getTimingProjection();
            var cal = new Date(time.getMinDate());
            var ref = new Date(cal.getFullYear(),cal.getMonth(),cal.getDate(),cal.getHours(),0,0,0);
            var points = this.getMetricsManager().generateHoursPoint(ref,time.durationHours(),1,this);
            for (var p = 0; p < points.length; p++) {
            	if(this.format){
            		var that = this;
                	if(!this.minimal){
    	            	points[p].format = function (){
    	            		return that.format(this.getTime());
    	            	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}else{
            		if(!this.minimal){
    	            	points[p].format = function (){
    	            		return this.getTime().getHours();
    	            	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}
            	
			}
            return points;
        }
	});
	
	
	/**
	 * one day model based on time model
	 */
	JenScript.DayModel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.DayModel, JenScript.TimeModel);
	JenScript.Model.addMethods(JenScript.DayModel, {
		/**
		 * init day model
		 */
		_init : function(config){
			config = config ||{};
			config.millis = 1000*60*60*24;
			config.name = 'one day';
			config.familyName = 'day model';
			config.unit = 'day';
			config.pixelLabelHolder = (config.pixelLabelHolder !== undefined)?config.pixelLabelHolder : 30;
			JenScript.TimeModel.call(this,config);
		},
		
        generateMetrics : function() {
            var time = this.getMetricsManager().getTimingProjection();
            var cal = new Date(time.getMinDate());
            var ref = new Date(cal.getFullYear(),cal.getMonth(),cal.getDate(),12,0,0);
            var points = this.getMetricsManager().generateDaysPoint(ref,time.durationDays(),1,this);
            for (var p = 0; p < points.length; p++) {
            	if(this.format){
            		var that = this;
                	if(!this.minimal){
    	            	points[p].format = function (){
    	            		return that.format(this.getTime());
    	            	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}else{
            		if(!this.minimal){
            			points[p].format = function (){
                    		var shortMonthNames = [ "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
                    		                   "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec." ];
                    		
                    		return shortMonthNames[this.getTime().getMonth()]+','+this.getTime().getDate();
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            		
            	}
            	
			}
            return points;
        }
	});
	
	

	/**
	 * one month model based on time model
	 */
	JenScript.MonthModel = function(config) {
		//MonthModel
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MonthModel, JenScript.TimeModel);
	JenScript.Model.addMethods(JenScript.MonthModel, {
		/**
		 * init month model
		 */
		_init : function(config){
			config = config ||{};
			config.millis =  1000 * 60*60*24*7*4;
			config.name = 'one month';
			config.familyName = 'month model';
			config.unit = 'month';
			config.pixelLabelHolder = (config.pixelLabelHolder !== undefined)?config.pixelLabelHolder : 40;
			JenScript.TimeModel.call(this,config);
		},
		
        generateMetrics : function() {
            var time = this.getMetricsManager().getTimingProjection();
            var cal = new Date(time.getMinDate());
            var ref = new Date(cal.getFullYear(),cal.getMonth(),1,0,0,0);//first day of month
            var points = this.getMetricsManager().generateMonthsPoint(ref,time.durationMonth(),1,this);
            for (var p = 0; p < points.length; p++) {
            	if(this.format){
            		var that = this;
                	if(!this.minimal){
                		points[p].format = function (){
                    		return that.format(this.getTime());
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}else{
            		if(!this.minimal){
            			points[p].format = function (){
            				var shortMonthNames = [ "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
                         		                   "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec." ];
                         		
                         		return shortMonthNames[this.getTime().getMonth()]+' '+this.getTime().getFullYear();
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}
			}
            return points;
        }
	});
	
	
	/**
	 * one year model based on time model
	 */
	JenScript.YearModelOLD = function(config) {
		//YearModel
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.YearModelOLD, JenScript.TimeModel);
	JenScript.Model.addMethods(JenScript.YearModelOLD, {
		/**
		 * init year model
		 */
		_init : function(config){
			config = config ||{};
			config.millis =  1000*60*60*24*31*12;
			config.name = 'one year';
			config.familyName = 'year model';
			config.unit = 'year';
			config.pixelLabelHolder = (config.pixelLabelHolder !== undefined)?config.pixelLabelHolder : 30;
			JenScript.TimeModel.call(this,config);
		},
		
        generateMetrics : function() {
            var time = this.getMetricsManager().getTimingProjection();
            var cal = new Date(time.getMinDate());
            var ref = new Date(cal.getFullYear(),0,1,0,0,0);//first day of year
            var points = this.getMetricsManager().generateMonthsPoint(ref,time.durationMonth(),12,this);
            for (var p = 0; p < points.length; p++) {
            	if(this.format){
            		var that = this;
                	if(!this.minimal){
                		points[p].format = function (){
                    		return that.format(this.getTime());
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}else{
            		if(!this.minimal){
            			points[p].format = function (){
                    		return this.getTime().getFullYear();
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}
			}
            return points;
        }
	});
	
	
	/**
	 * one year model based on time model
	 */
	JenScript.YearModel = function(config) {
		//YearModel
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.YearModel, JenScript.TimeModel);
	JenScript.Model.addMethods(JenScript.YearModel, {
		/**
		 * init year model
		 */
		_init : function(config){
			config = config ||{};
			this.yearMultiplier = (config.yearMultiplier !== undefined)?config.yearMultiplier:1;
			config.millis =  1000*60*60*24*365*this.yearMultiplier;
			config.name = 'one year';
			config.familyName = 'year model';
			config.unit = 'year';
			config.pixelLabelHolder = (config.pixelLabelHolder !== undefined)?config.pixelLabelHolder : 30;
			JenScript.TimeModel.call(this,config);
		},
		
        generateMetrics : function() {
            var time = this.getMetricsManager().getTimingProjection();
            var cal = new Date(time.getMinDate());
            var ref = new Date(cal.getFullYear(),0,1,0,0,0);//first day of year
            var points = this.getMetricsManager().generateYearsPoint(ref,time.durationYear(),this.yearMultiplier,this);
            for (var p = 0; p < points.length; p++) {
            	if(this.format){
            		var that = this;
                	if(!this.minimal){
                		points[p].format = function (){
                    		return that.format(this.getTime());
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}else{
            		if(!this.minimal){
            			points[p].format = function (){
                    		return this.getTime().getFullYear();
                    	};
                	}else{
                		points[p].format = function (){
    	            		return '';
    	            	};
                	}
            	}
			}
            return points;
        }
	});
	
})();