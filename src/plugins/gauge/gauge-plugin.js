(function(){
	
	/**
	 * Object JenScript.RadialGaugePlugin()
	 * Takes the responsability to paint gauge in view.
	 * @param {Object} config
	 */
	JenScript.RadialGaugePlugin = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.RadialGaugePlugin,JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.RadialGaugePlugin,{
		
		/**
		 * Initialize Gauge Plugin
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.name = 'JenScript.RadialGaugePlugin';
			this.gauge = config.gauge;
			JenScript.Plugin.call(this,config);
		},
		
		/**
		 * paint gauge plugin
		 * @param {Object} graphics context
		 * @param {String} view part
		 */
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			this.gauge.setProjection(this.getProjection());
			if (this.gauge.getEnvelop() !== undefined) {
				this.gauge.getEnvelop().paintPart(g2d, this.gauge);
			}
			if (this.gauge.getBackgrounds() !== undefined) {
				for (var i = 0; i < this.gauge.getBackgrounds().length; i++) {
					this.gauge.getBackgrounds()[i].paintPart(g2d,this.gauge);
				}
			}
			if (this.gauge.getGlasses() !== undefined) {
				for (var i = 0; i < this.gauge.getGlasses().length; i++) {
					this.gauge.getGlasses()[i].paintPart(g2d,this.gauge);
				}
			}
			if (this.gauge.getBodies() !== undefined) {
				for (var i = 0; i < this.gauge.getBodies().length; i++) {
					this.gauge.getBodies()[i].paintPart(g2d,this.gauge);
				}
			}
		}
	});
	
})();