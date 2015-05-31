(function(){
	/**
	 * Defines Pie Slice
	 * @param {Object} config
	 * @param {Object} [config.name] pie slice name
	 * @param {Object} [config.value] pie slice value, this value will be ratio normalized
	 * @param {Object} [config.themeColor] pie slice color, randomized if undefined
	 * @param {Object} [config.divergence] pie divergence from center
	 * 
	 */
	JenScript.PieSlice = function(config) {
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.PieSlice,{
		/**
		 * Defines Pie Slice
		 * @param {Object} config
		 * @param {Object} [config.name] pie slice name
		 * @param {Object} [config.value] pie slice value, this value will be ratio normalized
		 * @param {Object} [config.themeColor] pie slice color, randomized if undefined
		 * @param {Object} [config.divergence] pie divergence from center
		 * 
		 */
		init: function(config){
			this.Id = 'slice'+JenScript.sequenceId++;
			this.name = (config.name !== undefined)?config.name:'PieSlice name undefined';
			this.value =  (config.value !== undefined)?config.value:1;
			this.themeColor =(config.themeColor !== undefined)?config.themeColor:JenScript.createColor();
			this.divergence =  (config.divergence !== undefined)?config.divergence:0;
			
			if(this.value < 0 )
			    	throw new Error('Slice value should be greater than 0');
		},
		
		repaint : function(){
			if(this.pie !== undefined)
			this.pie.repaint();
		},
		
		setName : function(name) {
			this.name = name;
		},

		getName : function() {
			return this.name;
		},

		setValue : function(value) {
			if(this.value < 0 )
		    	throw new Error('Slice value should be greater than 0');
			this.value = value;
			this.repaint();
		},

		getValue : function() {
			return this.value;
		},

		getRatio : function() {
			return this.ratio;
		},

		setSliceLabel : function(sliceLabel) {
			if(sliceLabel !== undefined)
				sliceLabel.slice = this;
			this.sliceLabel = sliceLabel;
			this.repaint();
		},

		getSliceLabel : function() {
			return this.sliceLabel;
		},

		setThemeColor : function(themeColor) {
			this.themeColor = themeColor;
			this.repaint();
		},

		getThemeColor : function() {
			return this.themeColor;
		},

		setDivergence : function(divergence) {
			this.divergence = divergence;
			this.repaint();
		},

		getDivergence : function() {
			return this.divergence;
		},
	});
})();