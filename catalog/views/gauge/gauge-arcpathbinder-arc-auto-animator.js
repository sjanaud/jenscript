
/**
 * Gauge Path Binder Animator
 * 
 * @param container
 * @param width
 * @param height
 */
function createGaugeArcPathBinderAnimator(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 40,
		
	});

	

	var t1 = new JenScript.TextViewForeground({
		x : 100,
		y : 200,
		text : 'Arc Auto PathBinder',
		textColor : 'red'
	});
	var t2 = new JenScript.TextViewForeground({
		x : 100,
		y : 220,
		text : 'Direction',
		textColor : 'red'
	});
	var t3 = new JenScript.TextViewForeground({
		x : 100,
		y : 240,
		text : 'Radius',
		textColor : 'red'
	});
	var t4 = new JenScript.TextViewForeground({
		x : 100,
		y : 260,
		text : 'Polar Radius',
		textColor : 'red'
	});
	var t5 = new JenScript.TextViewForeground({
		x : 100,
		y : 280,
		text : 'Polar Angle',
		textColor : 'red'
	});

	view.addViewForeground(t1);
	view.addViewForeground(t2);
	view.addViewForeground(t3);
	view.addViewForeground(t4);
	view.addViewForeground(t5);

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
			// var bg = new JenScript.LinearGradientCircularBackground();
			var bg = new JenScript.TextureCircularBackground();

			this.addBackground(bg);

			this.body = new JenScript.GaugeBody();
			this.addBody(this.body);

			this.createSecondaryMetrics();
		},

		getTestPath : function() {
			return this.secondaryPathManager;
		},

		/**
		 * create secondary metrics label
		 */
		createSecondaryMetrics : function() {

			this.secondaryPathManager = new JenScript.GaugeMetricsPath();
			this.secondaryPathManager.setRange(0, 20);

			this.secondaryPathManager
					.setPathBinder(new JenScript.PathArcAutoBinder({
						debug : true,
						radius : 120,
						polarRadius : 140,
						polarDegree : 30,
						direction : 'AntiClockwise'
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
	var gauge = new Test.TestPathBinderArcManual();
	var gaugePlugin = new JenScript.RadialGaugePlugin({
		gauge : gauge
	});
	proj.registerPlugin(gaugePlugin);

	var millisTempo = 50;
	var b1 = function(count, radius, polarAngle) {
		setTimeout(function() {
			t2.setText('Direction : Clockwise');
			t3.setText('Radius : ' + radius);
			t4.setText('Polar Radius : 200');
			t5.setText('Polar Angle : ' + polarAngle);
			var binder = new JenScript.PathArcAutoBinder({
				debug : true,
				radius : radius,
				polarRadius : 200,
				polarDegree : polarAngle,
				direction : 'Clockwise'
			});
			gauge.getTestPath().setPathBinder(binder);
			gaugePlugin.repaintPlugin();
		}, count * millisTempo);

	};

	var b2 = function(count, radius, polarAngle) {
		setTimeout(function() {
			t2.setText('Direction : AntiClockwise');
			t3.setText('Radius : ' + radius);
			t4.setText('Polar Radius : 200');
			t5.setText('Polar Angle : ' + polarAngle);
			var binder = new JenScript.PathArcAutoBinder({
				debug : true,
				radius : radius,
				polarRadius : 200,
				polarDegree : polarAngle,
				direction : 'AntiClockwise'
			});
			gauge.getTestPath().setPathBinder(binder);
			gaugePlugin.repaintPlugin();
		}, count * millisTempo);
	};

	var end = function(count) {
		setTimeout(function() {
			gauge.getTestPath().setPathBinder(undefined);
			gaugePlugin.repaintPlugin();
		}, count * millisTempo);
	};

	function launch() {
		var count = 0;
		for (var polarAngle = 0; polarAngle < 360; polarAngle = polarAngle + 30) {
			for (var radius = 0; radius < 300; radius = radius + 5) {
				b1(count++, radius, polarAngle);
			}
		}
		for (var polarAngle2 = 0; polarAngle2 < 360; polarAngle2 = polarAngle2 + 30) {
			for (var radius2 = 0; radius2 < 300; radius2 = radius2 + 5) {
				b2(count++, radius2, polarAngle2);
			}
		}
		end(count++);
	}

	launch();

}