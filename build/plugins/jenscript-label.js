// JenScript -  JavaScript HTML5/SVG Library
// version : 1.3.1
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-05-29
// All Rights reserved

(function(){
	/**
	 * Object TextLabel()
	 * Defines TextLabel Abstract Label
	 * @param {Object} config
	 * @param {String} [config.name] the label type name
	 * @param {String} [config.text] the label text
	 * @param {String} [config.textColor] the label text color
	 * @param {Number} [config.fontSize] the label text font size
	 * @param {String} [config.textAnchor] the label text anchor
	 * @param {Object} [config.shader] the label fill shader
	 * @param {Object} [config.shader.percents] the label fill shader percents
	 * @param {Object} [config.shader.colors] the label fill shader colors
	 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
	 * @param {String} [config.outlineColor] the label outline color
	 * @param {String} [config.cornerRadius] the label outline corner radius
	 * @param {String} [config.fillColor] the label fill color
	 */
	JenScript.TextLabel = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TextLabel,JenScript.AbstractLabel);
	JenScript.Model.addMethods(JenScript.TextLabel,{
		
		/**
		 * Initialize  Label
		 * @param {Object} config
		 * @param {String} [config.name] the label type name
		 * @param {String} [config.text] the label text
		 * @param {String} [config.textColor] the label text color
		 * @param {String} [config.location] the label location
		 * @param {Number} [config.fontSize] the label text font size
		 * @param {String} [config.textAnchor] the label text anchor
		 * @param {Object} [config.shader] the label fill shader
		 * @param {Object} [config.shader.percents] the label fill shader percents
		 * @param {Object} [config.shader.colors] the label fill shader colors
		 * @param {String} [config.paintType] the label paint type should be , Both, Stroke, Fill, None
		 * @param {String} [config.outlineColor] the label outline color
		 * @param {String} [config.cornerRadius] the label outline corner radius
		 * @param {String} [config.fillColor] the label fill color
		 */
		_init : function(config){
			JenScript.AbstractLabel.call(this,config);
		},
		
		/**
		 * paint label
		 */
		paint : function(g2d){
			this.paintLabel(g2d);
		}
		
	});
})();
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