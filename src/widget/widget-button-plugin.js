(function(){
	//boilerplate plugin to handle anonymous widget
	JenScript.ButtonPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ButtonPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.ButtonPlugin, {
		_init : function(config) {
			config = config || {};
			config.name = 'SimpleButtonPlugin';
			config.selectable = false;
			JenScript.Plugin.call(this, config);
		},
		paintPlugin : function(g2d, part) {
		},
		
		
		/**
		 * Select this plugin on register (internal) to always paint this widgets 
		 * 
		 * make this plugin selectable = false and force to select it , make :
		 * 
		 * -not sensible to unlock  with another selectable plugin like translate or zoom
		 * (these plugin are selectable and on lock, all other selectable widget are unlock)
		 * 
		 * -allow to force to always paint widgets
		 */
		onProjectionRegister : function(){
			//console.log('Button Plugin, on projection register-->select');
			this.select();
//				if(this.getProjection().getView() !== undefined){
//					this.getProjection().getView().getWidgetPlugin().repaintPlugin('view listener button plugin');
//				}else{
//					//wait view registering
//					this.getProjection().addProjectionListener('viewRegister',function(proj){
//						this.getProjection().getView().getWidgetPlugin().repaintPlugin('view listener button plugin');
//					},'active ');
//				}
		},
	});
})();