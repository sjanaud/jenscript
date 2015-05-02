
/**
 * Gauge path binder in clockwise direction
 * 
 * @param container
 * @param width
 * @param height
 */
function createGaugeArcPathBinderClockwise(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 40,
		
	});

	var proj = new JenScript.LinearProjection({
		name : "proj1",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
	proj.registerPlugin(outline);


	var Test = {};
	Test.TestPathBinderArcManual = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(Test.TestPathBinderArcManual,
			JenScript.RadialGauge);
	JenScript.Model.addMethods(Test.TestPathBinderArcManual, {
		_init : function(config) {
			config = config || {};
			this.gaugeRadius = 110;
			config.radius = 110;
			JenScript.RadialGauge.call(this, config);

			var env = new JenScript.Cisero();
			this.setEnvelop(env);
			var bg = new JenScript.TextureCircularBackground();

			this.addBackground(bg);

			this.body = new JenScript.GaugeBody();
			this.addBody(this.body);

			this.createSecondaryMetrics();
		},

		/**
		 * create secondary metrics label
		 */
		createSecondaryMetrics : function() {

			this.secondaryPathManager = new JenScript.GaugeMetricsPath();
			this.secondaryPathManager.setRange(0, 20);

			this.secondaryPathManager
					.setPathBinder(new JenScript.PathArcAutoBinder({
						radius : 120,
						polarRadius : 140,
						polarDegree : 30
					}));
			this.body.registerGaugeMetricsPath(this.secondaryPathManager);

			var metric = new JenScript.GlyphMetric();
			metric.setValue(1);
			metric.setMetricsLabel("1");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(3);
			metric.setMetricsLabel("3");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(5);
			metric.setMetricsLabel("5");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(7);
			metric.setMetricsLabel("7");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(9);
			metric.setMetricsLabel("9");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(12);
			metric.setMetricsLabel("12");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(15);
			metric.setMetricsLabel("15");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(18);
			metric.setMetricsLabel("18");
			this.secondaryPathManager.addMetric(metric);
		}
	});

	var gaugePlugin = new JenScript.RadialGaugePlugin({
		gauge : new Test.TestPathBinderArcManual()
	});
	proj.registerPlugin(gaugePlugin);

}