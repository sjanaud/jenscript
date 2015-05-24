(function(){
	JenScript.AxisMetricsPlugin = function(config) {
		this.__init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.AxisMetricsPlugin, JenScript.MetricsPlugin);

	JenScript.Model.addMethods(JenScript.AxisMetricsPlugin, {
		__init : function(config){
			config = config ||{};
			
			/** the metrics manager */
			this.metricsManager = config.manager;

			/** the metrics painter */
			this.metricsPainter = new JenScript.MetricsPainter();
			
			/** the accessible zone */
			this.axis = config.axis;

			/** the axis spacing */
			this.axisSpacing = (config.axisSpacing !== undefined)?config.axisSpacing:0;

			/** paint flag axis base line, default is false */
			this.axisBaseLine =  (config.axisBaseLine !== undefined)?config.axisBaseLine:false;
			
			/** color axis base line, default is black */
			this.axisBaseLineColor =  (config.axisBaseLineColor !== undefined)?config.axisBaseLineColor:'black';
			
			/** stroke axis base line, default is 0.8 */
			this.axisBaseLineStrokeWidth =  (config.axisBaseLineStrokeWidth !== undefined)?config.axisBaseLineStrokeWidth: 0.8;
			
			JenScript.MetricsPlugin.call(this,config);
		},
		
		toString : function(){
			return  this.name+' '+this.Id+' '+this.axis;
		},
		
		isAccessible : function(viewPart) {
			//console.log('isAccessible: '+viewPart+' '+this.axis);
			if (this.axis === JenScript.Axis.AxisSouth && viewPart !== JenScript.ViewPart.South) {
				return false;
			}
			if (this.axis == JenScript.Axis.AxisNorth && viewPart !== JenScript.ViewPart.North) {
				return false;
			}
			if (this.axis === JenScript.Axis.AxisWest && viewPart !== JenScript.ViewPart.West) {
				return false;
			}
			if (this.axis === JenScript.Axis.AxisEast && viewPart !== JenScript.ViewPart.East) {
				return false;
			}
			if (viewPart == JenScript.ViewPart.Device) {
				return false;
			}
			return true;
		},
		
		_paintAxisBaseLine : function(view,g2d,viewPart) {
			if (this.axisBaseLine) {
				var axisStartLocation={};
				var axisEndLocation={};
				if (viewPart === JenScript.ViewPart.South) {
					var component = view.getComponent(JenScript.ViewPart.South);
					axisStartLocation = {x: view.getPlaceHolderAxisWest(), y:this.axisSpacing};
					axisEndLocation ={x:component.getWidth() - view.getPlaceHolderAxisEast(),y: this.axisSpacing};
				}
				if (viewPart === JenScript.ViewPart.West) {
					var component = view.getComponent(JenScript.ViewPart.West);
					axisStartLocation = {x:component.getWidth() - 1 - this.axisSpacing,y: 0};
					axisEndLocation = {x:component.getWidth() - 1 - this.axisSpacing, y:component.getHeight()};
				}
				if (viewPart === JenScript.ViewPart.East) {
					var component = view.getComponent(JenScript.ViewPart.East);
					axisStartLocation = {x:this.axisSpacing, y:0};
					axisEndLocation = {x:this.axisSpacing, y:component.getHeight()};
				}
				if (viewPart === JenScript.ViewPart.North) {
					var component = view.getComponent(JenScript.ViewPart.North);
					axisStartLocation = {x:view.getPlaceHolderAxisWest(),y: component.getHeight() - 1 - this.axisSpacing};
					axisEndLocation = {x:component.getWidth() - view.getPlaceHolderAxisEast(),y: component.getHeight() - 1 - this.axisSpacing};
				}
				this.metricsPainter.doPaintLineMetrics(g2d,viewPart, axisStartLocation, axisEndLocation, this.axisBaseLineColor,this.axisBaseLineStrokeWidth);
			}
		},
		
		_paintAxisMetrics : function(view,g2d,viewPart) {
			
			var metrics = [];
			metrics = this.metricsManager.getDeviceMetrics();

			if(metrics === undefined) return;
			
			metrics.sort(function(m1, m2) {
				var val1 = m1.userValue;
				var val2 = m2.userValue;
				return ((val1 < val2) ? -1 : ((val1 > val2) ? 1 : 0));
			});
			for (var i = 0; i < metrics.length; i++) {
				var m = metrics[i];
				m.metricsPlugin = this;
				if (this.getGravity() === 'rotate') {
					m.setRotate(true);
				}else{
					m.setRotate(false);
				}
				
				var markerLocation = {};
				if (viewPart === JenScript.ViewPart.South) {
					markerLocation = {x:view.getPlaceHolderAxisWest() + m.getDeviceValue(),y: this.axisSpacing};
					m.setMarkerLocation(markerLocation);
					m.setMarkerPosition('S');
				}
				if (viewPart === JenScript.ViewPart.West) {
					var component = view.getComponent(JenScript.ViewPart.West);
					markerLocation = {x:component.getWidth() - 1 - this.axisSpacing,y: m.getDeviceValue()};
					m.setMarkerLocation(markerLocation);
					m.setMarkerPosition('W');
				}
				if (viewPart === JenScript.ViewPart.East) {
					markerLocation = {x:this.axisSpacing,y: m.getDeviceValue()};
					m.setMarkerLocation(markerLocation);
					m.setMarkerPosition('E');
				}
				if (viewPart === JenScript.ViewPart.North) {
					var component = view.getComponent(JenScript.ViewPart.North);
					markerLocation = {x:view.getPlaceHolderAxisWest() + m.getDeviceValue(),y: component.getHeight() - 1 - this.axisSpacing};
					m.setMarkerLocation(markerLocation);
					m.setMarkerPosition('N');
				}
			}
			this.metricsPainter.doPaintMetrics(g2d,viewPart, metrics);
		},
		
		/**
		 * assign manager type x or y given by given axis.
		 */
		_assignType : function() {
			if (this.axis == JenScript.Axis.AxisSouth || this.axis == JenScript.Axis.AxisNorth) {
				this.metricsManager.setMetricsType(JenScript.MetricsType.XMetrics);
			}
			if (this.axis == JenScript.Axis.AxisEast || this.axis == JenScript.Axis.AxisWest) {
				this.metricsManager.setMetricsType(JenScript.MetricsType.YMetrics);
			}
		},

		/**
		 * Paints metrics.
		 */
		_paintMetrics : function(view, g2d,viewPart) {
			if (!this.isAccessible(viewPart)) {
				return;
			}
			this.metricsManager.setMetricsPlugin(this);
			this.metricsPainter.setMetricsPlugin(this);
			this._assignType();
			this._paintAxisMetrics(view, g2d, viewPart);
			this._paintAxisBaseLine(view, g2d, viewPart);
		},
		
		paintPlugin : function(g2d, part) {
			this._paintMetrics(this.getProjection().getView(),g2d,part);
		},

	});
	

	
})();