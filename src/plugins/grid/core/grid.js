(function(){
	JenScript.Grid = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.Grid, {
		
	 init : function(config){
			config=config||{};
			
			/** device value */
			this.deviceValue;
		    /** user value */
			this.userValue;
		    /** grid marker color */
			this.metricsMarkerColor;
		    /** grid label color */
			this.metricsLabelColor;
		    /** grid format */
			this.format;
		    /** grid label */
			this.gridLabel;
			/** lock marker flag */
		    this.lockMarker;
		    /** lock label */
		    this.lockLabel;
		    /** visible flag */
		    this.visible = true;
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
	});
})();