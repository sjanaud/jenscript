(function(){

	
	
	
	
	
	/**
	 * Object JenScript.GaugeNeedlePainter()
	 * 
	 * Defines a gauge needle painter taht takes the responsibility to paint a needle
	 * which is based on anchors binders declared in gauge path metrics
	 * @param {Object} config
	 */
	JenScript.GaugeNeedlePainter = function(config){
		this.init(config);
	};
	JenScript.Model.addMethods(JenScript.GaugeNeedlePainter,{
		/**
		 * Initialize gauge needle painter
		 * 
		 * @param {Object} config
		 */
		init : function(config){
			config = config || {};
		},
		
		/**
		 * paint needle for the given gauge metrics path anchor configuration
		 * 
		 * @param {Object} graphics context
		 * @param {Object} gaugeMetricsPath
		 */
		paintNeedle : function(g2d,metricsPath){throw new Error('JenScript.GaugeNeedlePainter, paintNeedle method should be provide by override');}
	});
	
	
	/**
	 * Object JenScript.GaugeNeedleClassicPainter()
	 * 
	 * Defines classic needle
	 * @param {Object} config
	 */
	JenScript.GaugeNeedleClassicPainter = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GaugeNeedleClassicPainter,JenScript.GaugeNeedlePainter);
	JenScript.Model.addMethods(JenScript.GaugeNeedleClassicPainter,{
		/**
		 * Initialize classic gauge needle
		 * @param {Object} config
		 */
		_init : function(config){
			config = config || {};
			JenScript.GaugeNeedlePainter.call(this,config);
		},

		/**
		 * paint classic needle for the given gauge metrics path anchor configuration
		 * @param {Object} graphics context
		 * @param {Object} gauge metrics path
		 */
		paintNeedle : function(g2d,gaugeMetricsPath) {
			var needleBase = gaugeMetricsPath.getNeedleBaseAnchorBinder().bindAnchor(gaugeMetricsPath.getBody().getGauge());
			var needleValue = gaugeMetricsPath.getNeedleValueAnchorBinder().bindAnchor(gaugeMetricsPath.getBody().getGauge());
			var needleLine = new JenScript.SVGPath().moveTo(needleBase.x,needleBase.y).lineTo(needleValue.x,needleValue.y);
			var s1 = needleLine.strokeWidth(4).strokeLineCap('round').opacity(0.6).stroke('black').toSVG();
			var s2 = needleLine.strokeWidth(10).strokeLineCap('round').opacity(0.4).stroke(JenScript.RosePalette.AEGEANBLUE).toSVG();
			g2d.insertSVG(s2);
			g2d.insertSVG(s1);
			var centerRadius =14;
			var shader = {percents:['0%','100%'],colors:[JenScript.RosePalette.AEGEANBLUE,'black']};
			var gradientId = "gradient"+JenScript.sequenceId++;
			var gradient= new JenScript.SVGRadialGradient().Id(gradientId).center(needleBase.getX(),needleBase.getY()).focus(needleBase.getX(),needleBase.getY()).radius(centerRadius).shade(shader.percents,shader.colors).toSVG();
			g2d.definesSVG(gradient);
			var center = new JenScript.SVGCircle().center(needleBase.getX(),needleBase.getY()).radius(centerRadius);
			g2d.insertSVG(center.fillURL(gradientId).fillOpacity(0.6).strokeOpacity(0.5).strokeWidth(2).stroke(JenScript.RosePalette.AEGEANBLUE).toSVG());
		}
	});
	
})();