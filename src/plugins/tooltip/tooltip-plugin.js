(function(){
	
	JenScript.TooltipPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TooltipPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.TooltipPlugin,{
		
		_init : function(config){
			config=config||{};
			config.name ='TooltipPlugin';
			this.tooltip = config.tooltip;
			JenScript.Plugin.call(this, config);
		},
		
		/**
		 * paint tooltip in this plugin graphic context
		 * @param {Object} graphics context 
		 * @param {String} view part name
		 */
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			this.tooltip.paintTooltip(g2d);
		}
	});
})();