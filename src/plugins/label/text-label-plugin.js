(function(){
	
	
	JenScript.TextLabelPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TextLabelPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.TextLabelPlugin,{
		
		_init : function(config){
			config=config||{};
			config.name ='TextLabelPlugin';
			this.labels = [];
			JenScript.Plugin.call(this, config);
		},
		
		/**
		 * on projection register add 'bound changed' projection listener that invoke repaint plugin
		 * when projection bound changed event occurs.
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'TextLabelPlugin projection bound changed');
		},
		
		/**
		 * add given label in this text plugin
		 * @param {Object} label 
		 */
		addLabel : function(label){
			if(label instanceof JenScript.TextLabel){
				this.labels[this.labels.length] = label;
				this.repaintPlugin();
			}else{
				throw new Error('TextLabel should be provided');
			}
		},
		
		/**
		 * remove given label in this text plugin
		 * @param {Object} label 
		 */
		removeLabel : function(label){
			var ls = [];
			for (var i = 0; i < this.labels.length; i++) {
				if(!this.labels[i].equals(label))
					ls[ls.length]=this.labels[i];
			}
			this.labels=ls;
			this.repaintPlugin();
		},
		
		
		/**
		 * paint text labels
		 * @param {Object} graphics context 
		 * @param {String} view part name
		 */
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			
			for (var i = 0; i < this.labels.length; i++) {
				this.labels[i].setProjection(this.getProjection());
				this.labels[i].paint(g2d);
			}
		}
		
	});
	
	
})();