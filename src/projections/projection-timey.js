

(function(){
	
	JenScript.TimeYProjection = function(config) {
		this.___init(config);
	};
	
	JenScript.Model.inheritPrototype(JenScript.TimeYProjection, JenScript.TimeProjection);
	JenScript.Model.addMethods(JenScript.TimeYProjection,{
	
		___init : function(config){
			config.minY = config.minYDate.getTime();
			config.maxY = config.maxYDate.getTime();
			JenScript.TimeProjection.call(this, config);
		},
	
		/**
		 * get min y as a date value
		 * 
		 * @return min date
		 */
		getMinYAsDate : function() {
			return new Date(this.getMinY());
		},

		/**
		 * get max y as date value
		 * 
		 * @return max date
		 */
		getMaxYAsDate :  function() {
			return new Date(this.getMaxY());
		},


		getMinDate : function() {
			return this.getMinYAsDate();
		},

		getMaxDate : function() {
			return this.getMaxYAsDate();
		},


		pixelToTime :  function(pixel) {
			var dateMillis = this.pixelToUserY(pixel);
			return new Date(dateMillis);
		},

		
		timeToPixel : function(time) {
			var userValue = time.getTime();
			return this.userToPixelY(userValue);
		},


		getTimeDurationPixel : function() {
			return this.getPixelHeight();
		},

		/**
		 * bound this {@link TimeY} projection with given times min and max date for
		 * y dimension
		 * 
		 * @param minx
		 * @param maxx
		 * @param minYDate
		 * @param maxYDate
		 */
		boundTimeY : function(minX,maxX,minYDate,maxYDate) {
			this.boundLinear(minX, maxX, minYDate.getTime(),maxYDate.getTime());
		},

		/**
		 * get the y time frame as number of a minutes
		 * 
		 * @return number of minutes
		 */
		getHeightAsMinutes : function () {
			var startMillis = this.getMinY();
			var endMillis = this.getMaxY();
			var width = endMillis - startMillis;
			var minutesMillis = 1000 * 60;
			var heightAsMinutes = width / minutesMillis;
			return heightAsMinutes;
		}
	
	});
})();
