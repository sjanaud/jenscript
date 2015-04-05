(function(){
	
	
	JenScript.ImagePlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ImagePlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.ImagePlugin,{
		
		_init : function(config){
			config=config||{};
			this.images = [];
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
			},'ImagePlugin projection bound changed');
		},
		
		/**
		 * add given image in this plugin
		 * @param {Object} image 
		 */
		addImage : function(image){
			this.images[this.images.length] = image;
			this.repaintPlugin();
		},
		
		/**
		 * remove all image
		 */
		removeAll : function(){
			this.images= [];
			this.repaintPlugin();
		},
		
		
		/**
		 * paint image
		 * @param {Object} graphics context 
		 * @param {String} view part name
		 */
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			
			for (var i = 0; i < this.images.length; i++) {
				
				var image = new JenScript.SVGImage().opacity(1).xlinkHref(this.images[i].url).origin(this.images[i].x,this.images[i].y);
				if(this.images[i].width !== undefined && this.images[i].height !== undefined){
					image.size(this.images[i].width,this.images[i].height);
				}
				
				g2d.insertSVG(image.toSVG());
				
				//this.labels[i].setProjection(this.getProjection());
				//this.labels[i].paint(g2d);
			}
		}
		
	});
	
	
})();