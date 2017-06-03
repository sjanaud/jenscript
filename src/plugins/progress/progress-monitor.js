(function(){
	JenScript.ProgressMonitor = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.ProgressMonitor, {
		init : function(config){
			//this.width= config.width;
			//this.height = config.height;
			//this.x=config.x;
			//this.y=config.y;
			this.Id = 'monitor'+JenScript.sequenceId++;
			this.cornerRadius=(config.cornerRadius !== undefined)?config.cornerRadius : 2;
			this.outlineColor=config.outlineColor;
			this.name=(config.name !== undefined)?config.name : 'unamed monitor';
			this.outlineStrokeWidth=config.outlineStrokeWidth;
			
			this.backgroundColor=(config.backgroundColor !== undefined)?config.backgroundColor : 'black';
			this.backgroundOpacity=(config.backgroundOpacity !== undefined)?config.backgroundOpacity : 1;
			
			this.foregroundColor=(config.foregroundColor !== undefined)?config.foregroundColor : '#2980b9';
			this.foregroundOpacity=(config.foregroundOpacity !== undefined)?config.foregroundOpacity : 1;
			
			this.textColor =(config.textColor !== undefined)?config.textColor : 'black';
			this.fontSize = (config.fontSize !== undefined)?config.fontSize : 10 ;
			
			this.total=config.total;
			this.value;
			this.text;
			this.completed = false;
			this.onComplete =config.onComplete;
			
		},
		
		setTotal : function(total){
			this.total=total;
			this.plugin.repaintPlugin();
		},
		
		setValue : function(value,text){
			this.value=value;
			this.text=text;
			var that = this;
			setTimeout(function(){
				that.plugin.repaintPlugin();
			},100);
			
			if((this.value === this.total) && this.onComplete !== undefined)
				this.complete();
		},
		
		/**
		 * mark monitor complete, set value to total and repaint plugin, then call onComplete callback
		 */
		complete : function(){
			this.value = this.total;
			if(this.onComplete !== undefined)
				this.onComplete();
			this.completed = true;
			this.plugin.repaintPlugin();
		},
		
		setText: function(text){
			this.text=text;
			var that = this;
			setTimeout(function(){
				that.plugin.repaintPlugin();
			},200);
		},
		
	});
})();