// JenScript - 1.3.2 2017-06-10
// http://jenscript.io - Copyright 2017 Sébastien Janaud. All Rights reserved

(function(){
	
	/**
	 * Object JenScript.DeviceOutlinePlugin()
	 * Defines outline device stroke
	 * @param {Object} config
	 * @param {String} [config.color] outline color, default darkgray color
	 * @param {Number} [config.strokeWidth] outline stroke width, default 1 pixel
	 */
	JenScript.DeviceOutlinePlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.DeviceOutlinePlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.DeviceOutlinePlugin,{
		/**
		 * Initialize outline device
		 * @param {Object} config
		 * @param {String} [config.color] outline color, darkgray if not defined
		 * @param {Number} [config.strokeWidth] outline stroke width, default 1 pixel
		 */
		_init : function(config){
			config = config || {};
			this.color = (config.color !== undefined)?config.color : 'darkgray';
			this.strokeWidth = (config.strokeWidth !== undefined)?config.strokeWidth : 1;
			this.strokeOpacity = (config.strokeOpacity !== undefined)?config.strokeOpacity : 1;
			config.priority = 1000;
			config.name ='DeviceOutlinePlugin';
			JenScript.Plugin.call(this, config);
		},
		
		/**
		 * paint device outline plugin
		 * @param {Object} graphics context
		 * @param {String} view part
		 */
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			var v = this.getProjection().getView();
			var dp = v.devicePart;
			var outline = new JenScript.SVGRect()
										.origin(this.strokeWidth/2,this.strokeWidth/2)
										.size(dp.width-this.strokeWidth,dp.height-this.strokeWidth)
										.stroke(this.color)
										.strokeOpacity(this.strokeOpacity)
										.strokeWidth(this.strokeWidth)
									    .fillNone();
			
			//this.svgPluginPartsGraphics[part].appendChild(outline.toSVG());
			g2d.insertSVG(outline.toSVG());
		}
	});
})();