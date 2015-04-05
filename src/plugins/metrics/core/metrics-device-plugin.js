(function(){
	JenScript.DeviceMetricsPlugin = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.DeviceMetricsPlugin, JenScript.MetricsPlugin);

	JenScript.Model.addMethods(JenScript.DeviceMetricsPlugin, {
		__init : function(config){
			config = config ||{};
			
			/** the metrics manager */
			this.metricsManager = config.manager;

			/** the metrics painter */
			this.metricsPainter = new JenScript.MetricsPainter();
			
			/** axis base line at the constant x or y value */
			this.baseLine = config.baseLine;

			/** device axis x or y */
			this.deviceAxis = config.deviceAxis;

			/** marker position */
			this.deviceMarkerPosition;

			/** paint base line flag */
			this.paintLine = true;
			
			/** color axis base line, default is red */
			this.axisBaseLineColor = 'red';
			
			/** stroke axis base line, default is 0.8 */
			this.axisBaseLineStrokeWidth = 0.8;
			
			JenScript.MetricsPlugin.call(this,config);
		},
		
		setBaseLine  : function(baseLine){
			this.baseLine = baseLine;
		},
		
		getBaseLine  : function(){
			return this.baseLine;
		},
		
		setDeviceAxis  : function(deviceAxis){
			this.deviceAxis = deviceAxis;
		},
		
		getDeviceAxis  : function(){
			return this.deviceAxis;
		},
		
		setDeviceMarkerPosition  : function(deviceMarkerPosition){
			this.deviceMarkerPosition = deviceMarkerPosition;
		},
		
		getDeviceMarkerPosition  : function(){
			return this.deviceMarkerPosition;
		},
		
		setPaintLine  : function(paintLine){
			this.paintLine = paintLine;
		},
		
		isPaintLine  : function(){
			return this.paintLine;
		},
		
		/**
		 * assign manager type x or y given by given axis.
		 */
		_assignType : function() {
			if (this.deviceAxis === JenScript.DeviceAxis.AxisX ) {
				this.metricsManager.setMetricsType(JenScript.MetricsType.XMetrics);
			}
			if (this.deviceAxis === JenScript.DeviceAxis.AxisY) {
				this.metricsManager.setMetricsType(JenScript.MetricsType.YMetrics);
			}
		},
		
		/**
		 * true if the device part context, false otherwise
		 */
		isAccessible : function(viewPart) {
			if (viewPart === JenScript.ViewPart.Device) {
				return true;
			}
			return false;
		},
		
		/**
		 * paint X metrics for the given parameters
		 * 
		 * @param v2d
		 * @param g2d
		 */
		_paintMetricsX : function(view,part,g2d,metricsX,baseLine,offsetPixel) {
			//alert("this getProj "+this.getProjection());
			//alert("this getProj "+this.getProjection().userToPixel(new JenScript.Point2D(0, this.baseLine)));
			var deviceBaseLine = this.getProjection().userToPixel(new JenScript.Point2D(0, this.baseLine));
			//alert("deviceBaseLine : "+deviceBaseLine)
			for (var i = 0; i< metricsX.length;i++) {
				var m = metricsX[i];
				
				m.metricsPlugin = this;
//				if (MarkerPosition.isXCompatible(this.deviceMarkerPosition)) {
//					m.setMarkerPosition(this.deviceMarkerPosition);
//				} else {
					m.setMarkerPosition('S');
				//}
//				m.setLockMarker(true);
//				if (offsetPixel > 0) {
//					m.setLockMarker(false);
//				}
				var p = undefined;
				if (m.getMarkerPosition() === 'S') {
					p = new JenScript.Point2D(m.getDeviceValue(), deviceBaseLine.y + offsetPixel);
				}
				if (m.getMarkerPosition() === 'N') {
					p = new JenScript.Point2D(m.getDeviceValue(), deviceBaseLine.y - offsetPixel);
				}
				m.setMarkerLocation(p);
			}
			this.metricsPainter.doPaintMetrics(g2d,part,metricsX);
		},

		/**
		 * paint the base line for x metrics
		 * 
		 * @param v2d
		 * @param g2d
		 */
		_paintMetricsXBaseLine : function(view,part,g2d,baseLine) {
			var deviceBaseLine = this.getProjection().userToPixel(new JenScript.Point2D(0, baseLine));
			this.metricsPainter.doPaintLineMetrics(g2d,part, new JenScript.Point2D(0, deviceBaseLine.y), new JenScript.Point2D(this.getProjection().getView().getDevice().getWidth(), deviceBaseLine.y), this.axisBaseLineColor,this.axisBaseLineStrokeWidth);
		},

		_paintMetricsY : function(view,part,g2d,metricsY,baseLine,offsetPixel) {
			var deviceBaseLine = this.getProjection().userToPixel(new JenScript.Point2D(baseLine, 0));
			for (var i = 0; i< metricsY.length;i++) {
				var m = metricsY[i];
				m.metricsPlugin = this;
				
				var p = undefined;
				p = new JenScript.Point2D(deviceBaseLine.x, m.getDeviceValue());
				m.setMarkerLocation(p);
				//if (MarkerPosition.isYCompatible(deviceMarkerPosition)) {
				//	m.setMarkerPosition(deviceMarkerPosition);
				//} else {
					m.setMarkerPosition('W');
				//}
			}
			this.metricsPainter.doPaintMetrics(g2d,part,metricsY);
		},

		/**
		 * paint the base line for y metrics
		 * 
		 * @param v2d
		 * @param g2d
		 */
		_paintMetricsYBaseLine : function(view,part,g2d,baseLine) {
			var deviceBaseLine = this.getProjection().userToPixel(new JenScript.Point2D(baseLine, 0));
			this.metricsPainter.doPaintLineMetrics(g2d,part,new JenScript.Point2D(deviceBaseLine.x, 0), new JenScript.Point2D(deviceBaseLine.x, this.getProjection().getView().getDevice().getHeight()), this.axisBaseLineColor,this.axisBaseLineStrokeWidth);
		},

		/**
		 * Paints metrics.
		 */
		_paintMetrics : function(view,g2d,viewPart) {
			if (!this.isAccessible(viewPart)) {
				return;
			}
			this.metricsManager.setMetricsPlugin(this);
			this.metricsPainter.setMetricsPlugin(this);
			this._assignType();
			var metrics = this.metricsManager.getDeviceMetrics();
			if (this.deviceAxis === JenScript.DeviceAxis.AxisX) {
				this._paintMetricsX(view,viewPart, g2d, metrics, this.baseLine, 0);
				if (this.isPaintLine()) {
					this._paintMetricsXBaseLine(view,viewPart, g2d, this.baseLine);
				}
			}
			if (this.deviceAxis == JenScript.DeviceAxis.AxisY) {
				this._paintMetricsY(view,viewPart,g2d,metrics,this.baseLine, 0);
				if (this.isPaintLine()) {
					this._paintMetricsYBaseLine(view,viewPart,g2d,this.baseLine);
				}
			}
		},
		
		/**
		 * paint device metrics plugin
		 */
		paintPlugin : function(g2d, part) {
			this._paintMetrics(this.getProjection().getView(),g2d,part);
		},
	});
	
})();