(function(){
	JenScript.TimeProjection = function(config) { 
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TimeProjection, JenScript.LinearProjection);
	JenScript.Model.addMethods(JenScript.TimeProjection,{
		
		__init : function(config){
			JenScript.LinearProjection.call(this, config);
		},
	
		/**
		 * get the time duration in millisecond of this time projection between min
		 * date and max date
		 * 
		 * @return duration millisecond
		 */
		durationMillis : function() {
			return this.getMaxDate().getTime() - this.getMinDate().getTime();
		},

		/**
		 * get the time duration in minutes of this time projection between min date
		 * and max date
		 * 
		 * @return duration minutes
		 */
		durationMinutes : function() {
			var minutesMillis = 1000 * 60;
			var minutes = this.durationMillis() / minutesMillis;
			return minutes;
		},

		/**
		 * get the time duration in hours of this time projection between min date
		 * and max date
		 * 
		 * @return duration hours
		 */
		durationHours : function() {
			var hourMillis = 1000 * 60 * 60;
			var hours = this.durationMillis() / hourMillis;
			return hours;
		},

		/**
		 * get the time duration in days of this time projection between min date
		 * and max date
		 * 
		 * @return duration days
		 */
		durationDays : function() {
			var dayMillis = 1000 * 60 * 60 * 24;
			var days = this.durationMillis() / dayMillis;
			return days;
		},

		/**
		 * get the time duration in weeks of this time projection between min date
		 * and max date
		 * 
		 * @return duration weeks
		 */
		durationWeeks :  function() {
			var weekMillis = 1000 * 60 * 60 * 24 * 7;
			var weeks = this.durationMillis() / weekMillis;
			return weeks;
		},

		/**
		 * get the time duration in month of this time projection between min date
		 * and max date
		 * 
		 * @return duration month
		 */
		durationMonth : function() {
			var monthMillis = 1000 * 60 * 60 * 24 * 7 * 4;
			var months = this.durationMillis() / monthMillis;
			return months;
		},
		
		/**
		 * get the time duration in years of this time projection between min date
		 * and max date
		 * 
		 * @return duration years
		 */
		durationYear : function() {
			var yearMillis = 1000 * 60 * 60 * 24 * 365;
			var years = this.durationMillis() / yearMillis;
			return years;
		}
		
	});
})();