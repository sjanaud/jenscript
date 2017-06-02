(function(){
	
	JenScript.TimeXProjection = function(config) {
		this.___init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TimeXProjection, JenScript.TimeProjection);
	JenScript.Model.addMethods(JenScript.TimeXProjection,{
		
		___init : function(config){
			config.minX = config.minXDate.getTime();
			config.maxX = config.maxXDate.getTime();
			JenScript.TimeProjection.call(this, config);
		},
				
		getMinDate : function(){
			return this.getMinXAsDate();
		},

		getMaxDate :  function() {
			return this.getMaxXAsDate();
		},

		/**
		 * get min x as a date value
		 * 
		 * @return min date
		 */
		getMinXAsDate : function() {
			return new Date(this.getMinX());
		},

		/**
		 * get max x as date value
		 * 
		 * @return max date
		 */
		getMaxXAsDate : function() {
			return new Date(this.getMaxX());
		},
		
		pixelToTime : function(pixel) {
			var dateMillis = this.pixelToUserX(pixel);
			return new Date(dateMillis);
		},

		timeToPixel : function(date){
			var userValue = date.getTime();
			return this.userToPixelX(userValue);
		},

		
		getTimeDurationPixel : function() {
			return this.getPixelWidth();
		},

		/**
		 * bound this {@link TimeX} projection with given times min and max date for
		 * x dimension
		 * 
		 * @param minXDate
		 * @param maxXDate
		 * @param miny
		 * @param maxy
		 */
		boundTimeX : function(minXDate, maxXDate, miny, maxy) {
			this.bound(minXDate.getTime(), maxXDate.getTime(), miny, maxy);
		}
	});
})();