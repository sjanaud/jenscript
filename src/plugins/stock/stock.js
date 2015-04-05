(function(){

	
	JenScript.Stock = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.Stock, {
		init : function(config){
			

			//date and millis
			this.fixing = config.fixing;
			this.fixingDurationMillis = config.fixingDurationMillis;

			//scalar values
			this.open = config.open;
			this.close = config.close;
			this.low = config.low;
			this.high = config.high;
			this.volume = config.volume;
		},
		
		getFixing :function() {
			return this.fixing;
		},

		setFixing :function(fixing) {
			this.fixing = fixing;
		},

		getOpen :function() {
			return this.open;
		},

		setOpen :function(open) {
			this.open = open;
		},

		getClose :function() {
			return this.close;
		},

		setClose :function( close) {
			this.close = close;
		},

		getLow :function() {
			return this.low;
		},

		setLow :function(low) {
			this.low = low;
		},

		getHigh :function() {
			return this.high;
		},

		setHigh :function( high) {
			this.high = high;
		},

		getVolume :function() {
			return this.volume;
		},

		setVolume :function( volume) {
			this.volume = volume;
		},

		getFixingDurationMillis :function() {
			return this.fixingDurationMillis;
		},

		setFixingDurationMillis :function( fixingDurationMillis) {
			this.fixingDurationMillis = fixingDurationMillis;
		},

		isBearish :function() {
			return (this.close < this.open);
		},

		isBullish :function() {
			return (this.close > this.open);
		},

	});

})();