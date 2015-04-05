(function(){
	JenScript.MetricsPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MetricsPlugin, JenScript.Plugin);

	JenScript.Model.addMethods(JenScript.MetricsPlugin, {
		_init : function(config){
			config = config ||{};
			
			/**metrics formater*/
			this.metricsFormat = config.metricsFormat;
			
			/**TODO, get only non undefined values and not all block*/
			this.minor =  {tickMarkerSize : 2,tickMarkerColor:'rgb(230, 193, 153)',tickMarkerStroke:0.8,tickTextOffset : 0};
			this.median = {tickMarkerSize : 4,tickMarkerColor:'rgb(230, 193, 153)',tickMarkerStroke:1.2,tickTextColor:'rgb(230, 193, 153)',tickTextFontSize:10,tickTextOffset : 0};
			this.major =  {tickMarkerSize : 6,tickMarkerColor:'rgb(235, 214, 92)',tickMarkerStroke:1.6,tickTextColor:'rgb(235, 214, 92)',tickTextFontSize:12,tickTextOffset : 0};
			
			if(config.minor !== undefined){
				this.minor.tickMarkerSize = (config.minor.tickMarkerSize !== undefined) ? config.minor.tickMarkerSize : 2;
				this.minor.tickMarkerColor = (config.minor.tickMarkerColor !== undefined) ? config.minor.tickMarkerColor : 'rgb(230, 193, 153)';
				this.minor.tickMarkerStroke = (config.minor.tickMarkerStroke !== undefined) ? config.minor.tickMarkerStroke : 0.8;
			}
			if(config.median !== undefined){
				this.median.tickMarkerSize 	= (config.median.tickMarkerSize !== undefined) ? config.median.tickMarkerSize : 4;
				this.median.tickMarkerColor 	= (config.median.tickMarkerColor !== undefined) ? config.median.tickMarkerColor : 'rgb(230, 193, 153)';
				this.median.tickMarkerStroke = (config.median.tickMarkerStroke !== undefined) ? config.median.tickMarkerStroke : 1;
				this.median.tickTextColor 	= (config.median.tickTextColor !== undefined) ? config.median.tickTextColor : 'rgb(230, 193, 153)';
				this.median.tickTextFontSize = (config.median.tickTextFontSize !== undefined) ? config.median.tickTextFontSize : 10;
				this.median.tickTextOffset 	= (config.median.tickTextOffset !== undefined) ? config.median.tickTextOffset : 0;
			}
			if(config.major !== undefined){
				this.major.tickMarkerSize 	= (config.major.tickMarkerSize !== undefined) ? config.major.tickMarkerSize : 6;
				this.major.tickMarkerColor 	= (config.major.tickMarkerColor !== undefined) ? config.major.tickMarkerColor : 'rgb(235, 214, 92)';
				this.major.tickMarkerStroke 	= (config.major.tickMarkerStroke !== undefined) ? config.major.tickMarkerStroke : 1.8;
				this.major.tickTextColor 	= (config.major.tickTextColor !== undefined) ? config.major.tickTextColor : 'rgb(235, 214, 92)';
				this.major.tickTextFontSize 	= (config.major.tickTextFontSize !== undefined) ? config.major.tickTextFontSize : 12;
				this.major.tickTextOffset 	= (config.major.tickTextOffset !== undefined) ? config.major.tickTextOffset : 0;
			}
			
			this.gravity =  (config.gravity !== undefined)? config.gravity : 'natural';
			JenScript.Plugin.call(this,config);
		},
		
		setGravity  : function(gravity){
			this.gravity = gravity;
		},
		
		getGravity  : function(){
			return this.gravity;
		},
		
		setTickMarkerSize  : function(type,size){
			this[type].tickMarkerSize = size;
		},
		
		setTickMarkerColor  : function(type,color){
			this[type].tickMarkerColor = color;
		},
		
		setTickMarkerStrokeWidth  : function(type,width){
			this[type].tickMarkerStroke = width;
		},
		
		setTickTextColor  : function(type,color){
			this[type].tickTextColor = color;
		},
		
		setTickTextFontSize  : function(type,width){
			this[type].tickTextFontSize = width;
		},
		setTickTextOffset  : function(type,offset){
			this[type].tickTextOffset = offset;
		},
		
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},that.toString());
		},
	});	
})();