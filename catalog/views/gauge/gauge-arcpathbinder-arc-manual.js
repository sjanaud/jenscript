/**
 * Gauge Manual Arc Path Binder
 * 
 * @param container
 * @param width
 * @param height
 */
function createGaugeArcPathBinderManual(container, width, height) {

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
			this.secondaryPathManager.setRange(0, 360);

			this.secondaryPathManager
					.setPathBinder(new JenScript.PathArcManualBinder({
						radius : 80,
						startAngleDegree : 0,
						extendsAngleDegree : 90,
						shiftRadius : 60,
						shiftAngleDegree : 90
					}));
			this.body.registerGaugeMetricsPath(this.secondaryPathManager);

			var metric = new JenScript.GlyphMetric();
			metric.setValue(30);
			metric.setMetricsLabel("30");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(60);
			metric.setMetricsLabel("60");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(120);
			metric.setMetricsLabel("120");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(150);
			metric.setMetricsLabel("150");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(210);
			metric.setMetricsLabel("210");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(240);
			metric.setMetricsLabel("240");
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(300);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(330);
			metric.setMetricsLabel("330");
			this.secondaryPathManager.addMetric(metric);
		}
	});

	var gaugePlugin = new JenScript.RadialGaugePlugin({
		gauge : new Test.TestPathBinderArcManual()
	});
	proj.registerPlugin(gaugePlugin);

}