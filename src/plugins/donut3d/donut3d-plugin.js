(function(){
	/**
	 * Donut 3D Plugin
	 * @param {Object} config
	 */
	JenScript.Donut3DPlugin = function(config) {
		config = config || {};
		config.name = 'Donut3DPlugin';
		this.donuts = [];
		//this.listeners=[];
		JenScript.Plugin.call(this,config);
	};
	JenScript.Model.inheritPrototype(JenScript.Donut3DPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.Donut3DPlugin, {
		
		/**
		 * add Donut 3D and repaint plugin
		 * @param {Object} donut
		 */
		addDonut : function(donut) {
			donut.host = this;
			this.donuts[this.donuts.length] = donut;
			this.repaintPlugin();
		},
		
		/**
		 * repaint plugin on projection bound changed 
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'donut3D projection bound changed');
		},
		
		repaintDonuts : function(){
			 this.repaintPlugin();
		},
		
		/**
		 * paint donut 3D plugin
		 * @param {Object} g2d the graphics context
		 * @param {Object} the part being paint
		 */
		paintPlugin : function(g2d,part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			for (var i = 0; i < this.donuts.length; i++) {
				var donut = this.donuts[i];
				if(donut.isSolvable()){
					donut.solveDonut3D();
					donut.donut3DPaint.paintDonut3D(g2d, donut);
					for (var j = 0; j < donut.slices.length; j++) {
						var slice = donut.slices[j];
						var labels = slice.getSliceLabels();
						for (var l = 0; l < labels.length; l++) {
							labels[l].paintDonut3DSliceLabel(g2d,slice);
							
						}
					}
				}
			}
		}
	});
})();