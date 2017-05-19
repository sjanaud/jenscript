// JenScript -  JavaScript HTML5/SVG Library
// version : 1.2.0
// Author : Sebastien Janaud 
// Web Site : http://jenscript.io
// Twitter  : http://twitter.com/JenSoftAPI
// Copyright (C) 2008 - 2017 JenScript, product by JenSoftAPI company, France.
// build: 2017-05-19
// All Rights reserved

(function(){
	
	/**
	 * Object TitleLegendPlugin()
	 * Defines a plugin that takes the responsibility to manage title legend
	 * @param {Object} config
	 */
	JenScript.TitleLegendPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TitleLegendPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.TitleLegendPlugin, {
		
		/**
		 * Initialize Function Plugin
		 * Defines a plugin that takes the responsibility to manage function
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			config.priority = 100;
			config.name="TitleLegendPlugin";
			this.text = config.text;
			this.fontSize = (config.fontSize !== undefined)?config.fontSize:12;
			this.textColor = (config.textColor !== undefined)?config.textColor:'red';
			this.fontWeight = (config.fontWeight !== undefined)?config.fontWeight:'normal';
			this.part = (config.part !== undefined)?config.part:JenScript.ViewPart.Device;
			
			this.layout = (config.layout !== undefined)?config.layout:'absolute'; //relative
			
			//absolute
			this.x  = (config.x !== undefined)?config.x:30;
			this.y  = (config.y !== undefined)?config.y:30;
			this.textAnchor = (config.textAnchor !== undefined)?config.textAnchor:'middle';
			this.rotate = (config.rotate !== undefined)?config.rotate:false;
			this.rotateAngle = (config.rotateAngle !== undefined)?config.rotateAngle:90;
			
			//relative
			this.xAlign  = (config.xAlign !== undefined)?config.xAlign:'right';
			this.yAlign  = (config.yAlign !== undefined)?config.yAlign:'bottom';
			this.xMargin  = (config.xMargin !== undefined)?config.xMargin:5;
			this.yMargin  = (config.yMargin !== undefined)?config.yMargin:5;
			
		    JenScript.Plugin.call(this,config);
		},
		
		
		paintAbsoluteLegend : function(g2d,viewPart){
			if(this.part === viewPart){
				 var text = new JenScript.SVGElement().name('text')
					.attr('id',JenScript.sequenceId++)
					.attr('x',this.x)
					.attr('y',this.y)
					.attr('font-size',this.fontSize)
					.attr('font-weight',this.fontWeight)
					.attr('fill',this.textColor)
					.attr('text-anchor',this.textAnchor)
					.textContent(this.text);
				 
				 if(this.rotate)
					 text.attr('transform','rotate('+this.rotateAngle+','+this.x+','+this.y+')');
				 
				 //var scatter = new JenScript.SVGRect().origin(this.x,this.y).size(5,5).fill('orange');
				 //g2d.insertSVG(scatter.toSVG());
				 
				 g2d.insertSVG(text.buildHTML());
			}
		},
		
		paintRelativeLegend : function(g2d,viewPart){
			
			if(this.part === viewPart){
				 
				var cw = this.getProjection().getView().getComponent(viewPart).getWidth();
				var ch = this.getProjection().getView().getComponent(viewPart).getHeight();
				if(this.xAlign === 'right'){
					this.x = cw - this.xMargin;
				}
				if(this.xAlign === 'left'){
					this.x = this.xMargin;
				}
				if(this.xAlign === 'center'){
					this.x = cw/2;
				}
				if(this.yAlign === 'top'){
					this.y = this.fontSize + this.yMargin;
				}
				if(this.yAlign === 'bottom'){
					this.y = ch- this.yMargin;
				}
				if(this.yAlign === 'center'){
					this.y = ch/2;
				}
				
				this.textAnchor = 'middle';
				if(this.xAlign === 'right' && this.yAlign === 'top'){
					this.textAnchor = 'end';
				}
				if(this.xAlign === 'right' && this.yAlign === 'bottom'){
					if(this.rotate)
						this.textAnchor = 'start';
					else
						this.textAnchor = 'end';
				}
				
				
				if(this.xAlign === 'left' && this.yAlign === 'top'){
					this.textAnchor = 'start';
				}
				if(this.xAlign === 'left' && this.yAlign === 'bottom'){
					if(this.rotate)
						this.textAnchor = 'end';
					else
						this.textAnchor = 'start';
				}
				
				var text = new JenScript.SVGElement().name('text')
					.attr('id',JenScript.sequenceId++)
					.attr('x',this.x)
					.attr('y',this.y)
					.attr('font-size',this.fontSize)
					.attr('font-weight',this.fontWeight)
					.attr('fill',this.textColor)
					.attr('text-anchor',this.textAnchor)
					.textContent(this.text);
				 
				 if(this.rotate)
					 text.attr('transform','rotate('+this.rotateAngle+','+this.x+','+this.y+')');
				 
				 //var scatter = new JenScript.SVGRect().origin(this.x,this.y).size(5,5).fill('orange');
				 //g2d.insertSVG(scatter.toSVG());
				 
				 g2d.insertSVG(text.buildHTML());
			}
		},
		
		/**
		 * paint legend plugin
		 */
		 paintPlugin : function(g2d,viewPart) {
			if(this.layout === 'absolute'){
				this.paintAbsoluteLegend(g2d,viewPart);
			}else if(this.layout === 'relative'){
				this.paintRelativeLegend(g2d,viewPart);
			}else{
				throw new Error('Invalid legend layout');
			}
				
		 } 
		
	});
	
})();