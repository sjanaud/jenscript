(function(){
	/**
	 * Object Pie()
	 * Defines Pie
	 * @constructor
	 * @param {Object} config the pie configuration
	 * @param {Object} [config.name] pie name
	 * @param {Object} [config.radius] pie radius in pixel
	 * @param {Object} [config.opacity] pie opacity
	 * @param {Object} [config.nature] pie projection nature, User or Device
	 * @param {Object} [config.x] pie center x, depends on projection nature
	 * @param {Object} [config.y] pie center y, depends on projection nature
	 * @param {Object} [config.startAngleDegree] pie center y, depends on projection nature
	 * 
	 */
	JenScript.Pie = function(config){
		this.init(config);
	};
	
	JenScript.Model.addMethods(JenScript.Pie,{
		
		init : function(config){
			config = config||{};
			this.name = (config.name !== undefined)?config.name:'Pie name undefined';
			this.Id = (config.Id !== undefined)?config.Id:'pie'+JenScript.sequenceId++;
			this.x =  (config.x !== undefined)?config.x:0;
			this.y =  (config.y !== undefined)?config.y:0;
			this.radius =  (config.radius !== undefined)?config.radius:80;
			this.opacity =  (config.opacity !== undefined)?config.opacity:1;
			this.startAngleDegree =  (config.startAngleDegree !== undefined)?config.startAngleDegree:0;
			this.nature =  (config.nature !== undefined)?config.nature:'User';
			this.effects= [];
			this.slices = [];
			this.svg= {};
			
			//TODO paint strategy : stream or final render?
			//check is this paint strategy pattern is good enough ?
			//really need paint strategy? paint is fast enough? wait for user feedback...
			
			this.paint = true;
		},
		
		/**
		 * repaint pie
		 */
		repaint : function(){
			//if(this.plugin !== undefined && this.paint)
			//this.plugin.repaintPlugin();
		},
		
		/**
		 * set pie center x
		 * @param {Number} pie center x
		 */
		setX : function(x) {
			this.x = x;
			this.repaint();
		},

		/**
		 * get pie center x
		 * @returns {Number} get pie center x
		 */
		getX : function() {
			return this.x;
		},

		/**
		 * set pie center y
		 * @param {Number} pie center y
		 */
		setY : function(y) {
			this.y = y;
			this.repaint();
		},

		/**
		 * get pie center y
		 * @returns {Number} get pie center y
		 */
		getY : function() {
			return this.y;
		},

		/**
		 * set pie radius in pixel
		 * @param {Number} pie radius
		 */
		setRadius : function(radius) {
			this.radius = radius;
			this.repaint();
		},

		/**
		 * get pie radius in pixel
		 * @returns {Number} get pie radius
		 */
		getRadius : function() {
			return this.radius;
		},

		/**
		 * set pie projection nature, user or Device
		 * @param {String} projection nature to set
		 */
		setNature : function(nature) {
			this.nature = nature;
			this.repaint();
		},

		/**
		 * get pie projection nature, user or Device
		 * @returns {String} get projection nature
		 */
		getNature : function() {
			return this.nature;
		},

		/**
		 * set pie start angle degreee
		 * @param {Number} start angle degree to set
		 */
		setStartAngleDegree : function(startAngleDegree) {
			this.startAngleDegree = startAngleDegree;
			this.repaint();
		},

		/**
		 * set pie start angle degreee
		 * @returns {Number} ge start angle degree
		 */
		getStartAngleDegree : function() {
			return this.startAngleDegree;
		},
		
		/**
		 * add pie effect
		 * @param {Object} effect to add
		 */
		addEffect : function(effect) {
			this.effects[this.effects.length] = effect;
			this.repaint();
		},
		
		/**
		 * set pie stroke
		 * @param {Object} stroke to set
		 */
		setStroke : function(stroke) {
			this.stroke = stroke;
			this.repaint();
		},

		/**
		 * set pie fill
		 * @param {Object} fill to set
		 */
		setFill : function(fill) {
			this.fill = fill;
			this.repaint();
		},

		/**
		 * add slice in this pie
		 * @param {Object} slice
		 *  @returns this pie
		 */
		addSlice : function(slice) {
			slice.pie = this;
			this.slices[this.slices.length] = slice;
			this.repaint();
			return this;
		},
		
		
		/**
		 * generate a slice with given config, add in pie and return pie.
		 * @param {Object} config slice configuration
		 * @returns this pie
		 */
		slice : function(config){
			var s = new JenScript.PieSlice(config);
			this.addSlice(s);
			return this;
		},
		
		 /**
		  * add slices array in this pie
		  * @param {Object} slice
		  * @returns this pie
		  */
		 addSlices : function (slices) {
	       for (var s = 0; s < slices.length; s++) {
	    	   this.addSlice(slices[s]);
	       }
	       return this;
		 },

		/**
		 * build the given slice
		 * @param {Object} slice The slice to build
		 */
		buildSlice : function(slice) {
		
			var deltaDegree = slice.getRatio() * 360;
			slice.extendsDegree = deltaDegree;
			
			if (this.startAngleDegree > 360)
				this.startAngleDegree = this.startAngleDegree - 360;

			slice.startAngleDegree = this.startAngleDegree;
			slice.endAngleDegree = this.startAngleDegree+deltaDegree;
			var medianDegree = this.startAngleDegree + deltaDegree/2;
			if (medianDegree > 360)
				medianDegree = medianDegree - 360;

			slice.medianDegree = medianDegree;
			
			var polar = function(origin,radius,angle){
				return {
					x : origin.x + radius* Math.cos(JenScript.Math.toRadians(angle)),
					y : origin.y - radius* Math.sin(JenScript.Math.toRadians(angle))
				};
			};
			var sc = polar(this.buildCenter,slice.divergence,medianDegree);
			//var sc = polar(this.buildCenter,0,medianDegree);
			var ss = polar(sc,this.radius,slice.startAngleDegree);
			var se = polar(sc,this.radius,slice.endAngleDegree);
			slice.sc = sc;
			slice.ss = ss;
			slice.se = se;
			
			var largeArcFlag = "0";
			if (deltaDegree > 180) {
				largeArcFlag = "1";
			}

			slice.svgPath = "M" + ss.x + "," + ss.y + " A" + this.radius + ","
					+ this.radius + " 0 " + largeArcFlag + ",0 " + se.x + ","
					+ se.y + " L" + sc.x + "," + sc.y + " Z";

			this.startAngleDegree = this.startAngleDegree + deltaDegree;
		},
		
		 /**
	     * compute buildCenterX and buildCenterY with given projection nature
	     */
	    projection : function() {
	        if (this.nature == 'User') {
	            var projectedCenter = this.plugin.getProjection().userToPixel(new JenScript.Point2D(this.x,this.y));
	            this.buildCenterX = projectedCenter.x;
	            this.buildCenterY = projectedCenter.y;
	            this.buildCenter = new JenScript.Point2D(this.buildCenterX,this.buildCenterY);
	        }
	        else  if (this.nature == 'Device') {
	            this.buildCenterX = this.centerX;
	            this.buildCenterY = this.centerY;
	            this.buildCenter = new JenScript.Point2D(this.buildCenterX,this.buildCenterY);
	        }
	    },
	    

		/**
		 * build pie by slice normalization, center projection and build slices geometry
		 */
		solvePie : function() {
			var that = this;
			var normalization = (function(){
				var sum = 0;
		        for (var i = 0; i < that.slices.length; i++) {
		            var s = that.slices[i];
		            sum = sum + s.value;
		        }
		        for (var i = 0; i < that.slices.length; i++) {
		        	var s = that.slices[i];
		            var ratio = s.value / sum;
		            s.ratio=ratio;
		        }
			})();
			this.projection();
			for (var i = 0; i < this.slices.length; i++) {
				var s = this.slices[i];
				this.buildSlice(s);
			}
			this.solved = true;
		},
		
		/**
		 * true if pie has more one slice, false otherwise
		 * @returns true if pie has more one slice, false otherwise
		 */
		isSolvable : function(){
		    	return this.slices.length > 0;
		},
		
		/**
		 * shift pie
		 */
		shift : function(){
			var that = this;
			for (var i = 0; i < 10; i++) {
				shiftAngle(i);
			}
			function shiftAngle(i){
				setTimeout(function(){
					that.startAngleDegree=that.startAngleDegree+36;
					that.plugin.repaintPlugin();
				},i*100);
			}
		},
		
	});
})();