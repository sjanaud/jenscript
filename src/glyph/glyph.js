(function(){
	JenScript.GlyphMetric = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.GlyphMetric,{
		init : function(config){
			config = config || {};
			/** the user metric value along the path */
			this.value = config.value;
			
			this.fontSize = (config.fontSize !== undefined) ? config.fontSize :  12;
			this.fontFamily = config.fontFamily;
			
			this.metricsLabel = config.metricsLabel;
			/** metric radial delta y */
			this.dy = (config.dy !== undefined) ? config.dy :  -5;
			/** metric rotation */
			this.rotate = (config.rotate !== undefined) ? config.rotate :  0;
			
			/** the device length value */
			this.lengthOnPath;
			
			/** the device percent length value */
			this.percentOnPath;

			/** metric marker point reference */
			this.metricPointRef;

			/** angle path */
			this.metricAngle;

			/** glyph start location */
			this.pointStart;

			/** glyph end location */
			this.pointEnd;
			
			this.fillColor = (config.fillColor !== undefined) ? config.fillColor :  'red';
			this.strokeColor = config.strokeColor ;
			
			
		},
		
		getFontSize : function(){
			return this.fontSize;
		},
		setFontSize : function(fontSize){
			this.fontSize = fontSize;
		},
		getFontFamily : function(){
			return this.fontFamily;
		},
		setFontFamily : function(fontFamily){
			this.fontFamily = fontFamily;
		},
		getValue : function(){
			return this.value;
		},
		
		setValue : function(value){
			this.value = value;
		},
		
		getFillColor : function(){
			return this.fillColor;
		},
		
		setFillColor : function(fillColor){
			this.fillColor = fillColor;
		},


		/**
		 * get the glyph angle
		 * 
		 * @return the metric glyph angle
		 */
		getMetricAngle : function() {
			return this.metricAngle;
		},

		/**
		 * set the metric glyph angle
		 * 
		 * @param metricAngle
		 */
		setMetricAngle : function(metricAngle) {
			this.metricAngle = metricAngle;
		},

//		/**
//		 * get the radial point
//		 * 
//		 * @param div
//		 *            the divergence from the path
//		 * @param side
//		 *            the side relative to the path
//		 * @return the radial point
//		 */
//		getRadialPoint : function(div,side) {
//			alert("here");
//			if (this.metricPointRef == undefined) {
//				return undefined;
//			}
//
//			var px;
//			var py;
//			if (side === 'Right') {
//				
//				px = this.metricPointRef.getX() - div * Math.sin(this.metricAngle);
//				py = this.metricPointRef.getY() + div * Math.cos(this.metricAngle);
//			} else {
//				px = this.metricPointRef.getX() + div * Math.sin(this.metricAngle);
//				py = this.metricPointRef.getY() - div * Math.cos(this.metricAngle);
//			}
//			return new JenScript.Point2D(px, py);
//		},

		

//		/**
//		 * get the orthogonal left point
//		 * 
//		 * @param div
//		 *            the divergence from the path
//		 * @return the ortho point
//		 */
//		getOrthoLeftPoint : function(div) {
//			return getOrthoLeftPoint(div, 0);
//		},

		/**
		 * get the orthogonal left point shift
		 * 
		 * @param divOrtho
		 *            the divergence from the path
		 * @param divRadial
		 * @return the ortho point
		 */
		getOrthoLeftPoint : function(divOrtho,divRadial) {
			if (this.metricPointRef === undefined) {
				return undefined;
			}
			var px;
			var py;
			px = this.metricPointRef.getX() + divRadial * Math.sin(JenScript.Math.toRadians(this.metricAngle)) + divOrtho * Math.sin(JenScript.Math.toRadians(this.metricAngle + Math.PI / 2));
			py = this.metricPointRef.getY() - divRadial * Math.cos( JenScript.Math.toRadians(this.metricAngle)) - divOrtho * Math.cos(JenScript.Math.toRadians(this.metricAngle + Math.PI / 2));
			return new JenScript.Point2D(px, py);
		},


		/**
		 * get the orthogonal right point shift
		 * 
		 * @param divOrtho
		 *            the divergence from the path
		 * @param divRadial
		 * @return the ortho point
		 */
		getOrthoRightPoint : function(divOrtho,divRadial) {
			if (this.metricPointRef === undefined) {
				return undefined;
			}
			var px = this.metricPointRef.getX() + divRadial * Math.sin(JenScript.Math.toRadians(this.metricAngle)) + divOrtho * Math.sin(JenScript.Math.toRadians(this.metricAngle - Math.PI / 2));
			var py = this.metricPointRef.getY() - divRadial * Math.cos(JenScript.Math.toRadians(this.metricAngle)) - divOrtho * Math.cos(JenScript.Math.toRadians(this.metricAngle - Math.PI / 2));
			return new JenScript.Point2D(px, py);
		},

		/**
		 * get the radial point
		 * 
		 * @param divergence
		 *            the divergence from the path relative to the internal side of
		 *            this metrics
		 * @return the radial point
		 */
		getRadialPoint : function(divergence) {
			if (this.metricPointRef === undefined) {
				return undefined;
			}
			var px = this.metricPointRef.getX() + divergence * Math.sin(JenScript.Math.toRadians(this.metricAngle));
			var py = this.metricPointRef.getY() - divergence * Math.cos(JenScript.Math.toRadians(this.metricAngle));

			return new JenScript.Point2D(px, py);
		},

		/**
		 * get the marker metric point reference
		 * 
		 * @return the reference
		 */
		getMetricPointRef : function() {
			return this.metricPointRef;
		},

		/**
		 * set the marker metric reference
		 * 
		 * @param metricPointRef
		 */
		setMetricPointRef : function(metricPointRef) {
			this.metricPointRef = metricPointRef;
		},

		/**
		 * get the divergence of the metric from the path
		 * 
		 * @return the divergence
		 */
		getDy : function() {
			return this.dy;
		},

		/**
		 * set the divergence
		 * 
		 * @param divergence
		 */
		setDy : function(dy) {
			this.dy = dy;
		},
		
		/**
		 * get the metric rotation
		 * 
		 * @return rotation
		 */
		getRotate : function() {
			return this.rotate;
		},

		/**
		 * set the metric rotation
		 * 
		 * @param rotate
		 *            the metric rotation
		 */
		setRotate : function(rotate) {
			this.rotate = rotate;
		},
		
		/**
		 * get the the length on path for this metrics
		 * 
		 * @return length on path
		 */
		getLengthOnPath : function() {
			return this.lengthOnPath;
		},

		/**
		 * set the length on path for this metrics
		 * 
		 * @param lengthOnPath
		 */
		setLengthOnPath : function(lengthOnPath) {
			this.lengthOnPath = lengthOnPath;
		},
		
		/**
		 * get the percent length on path for this metrics
		 * 
		 * @return length on path
		 */
		getPercentOnPath : function() {
			return this.percentOnPath;
		},

		/**
		 * set the percent length on path for this metrics
		 * 
		 * @param percentOnPath
		 */
		setPercentOnPath : function(percentOnPath) {
			this.percentOnPath = percentOnPath;
		},
		
		/**
		 * get the metrics label
		 * 
		 * @return metrics label
		 */
		getMetricsLabel : function() {
			return this.metricsLabel;
		},

		/**
		 * set the metrics label
		 * 
		 * @param metricsLabel
		 */
		setMetricsLabel : function( metricsLabel) {
			this.metricsLabel = metricsLabel;
		},

		/**
		 * get the start point of this glyph metrics *
		 * 
		 * @return the start point
		 */
		getPointStart : function() {
			return this.pointStart;
		},

		/**
		 * set the start point of this glyph metrics *
		 * 
		 * @param pointStart
		 *            the start point
		 */
		setPointStart : function( pointStart) {
			this.pointStart = pointStart;
		},

		/**
		 * get the end point of this glyph metrics *
		 * 
		 * @return the end point
		 */
		getPointEnd : function() {
			return this.pointEnd;
		},

		/**
		 * set the end point of this glyph metrics
		 * 
		 * @param pointEnd
		 *            the end point
		 */
		setPointEnd : function( pointEnd) {
			this.pointEnd = pointEnd;
		}


	});
})();