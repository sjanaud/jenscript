(function(){


	
	JenScript.GaugeCompass = function(config){
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GaugeCompass,JenScript.RadialGauge);
	JenScript.Model.addMethods(JenScript.GaugeCompass,{
		_init : function(config){
			config = config || {};
			this.gaugeRadius = 110;
			config.radius = 110;
			JenScript.RadialGauge.call(this,config);
			
			var env = new JenScript.Cisero();
			this.setEnvelop(env);
			//var bg = new JenScript.LinearGradientCircularBackground();
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
			//this.secondaryPathManager.setAutoReverseGlyph(false);
			//this.secondaryPathManager.setReverseAll(true);
			this.secondaryPathManager.setRange(0, 360);
			
			this.secondaryPathManager.setPathBinder(new JenScript.PathArcManualBinder({radius : this.gaugeRadius - 50, startAngleDegree :  0, extendsAngleDegree : 359}));
			this.body.registerGaugeMetricsPath(this.secondaryPathManager);

			//GlyphMetric metric;
			//Font f = InputFonts.getElements(12);
			var metric = new JenScript.GlyphMetric();
			metric.setValue(30);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature('Median');
			metric.setMetricsLabel("30");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.YELLOW.brighter()));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new  JenScript.GlyphMetric();
			metric.setValue(60);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			metric.setMetricsLabel("60");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.BLUE));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(120);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			metric.setMetricsLabel("120");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.BLUE));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(150);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			metric.setMetricsLabel("150");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.ORANGE.brighter()));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(210);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			metric.setMetricsLabel("210");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.ORANGE.brighter()));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(240);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			metric.setMetricsLabel("240");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.RED));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(300);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			//metric.setMetricsLabel("300");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.RED));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);

			metric = new JenScript.GlyphMetric();
			metric.setValue(330);
			//metric.setStylePosition('Tangent');
			//metric.setMetricsNature(GlyphMetricsNature.Median);
			metric.setMetricsLabel("330");
			//metric.setDivergence(0);
			//metric.setGlyphMetricFill(new GlyphFill(Color.WHITE, NanoChromatique.YELLOW.brighter()));
			//metric.setFont(f);
			this.secondaryPathManager.addMetric(metric);
		}
	});
})();