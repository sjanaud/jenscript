var fs = require('fs');

var core 		 = ["src/envns.js",
					"src/model.js",
					"src/math.js",
					"src/palette/color.js",
					"src/palette/texture.js",
					"src/geom.js",
					
					"src/glyph/glyph.js",
					"src/glyph/general-metrics-path.js",
					
					"src/view/proj-selector.js",
					"src/view/view-background.js",
					"src/view/view-foreground.js",
					"src/view/view-part.js",
					"src/view/svg-graphics.js",
					"src/view/view.js",
					"src/view/view-builder.js",
					
					"src/projections/projection.js",
					"src/projections/projection-linear.js",
					"src/projections/projection-identity.js",
					"src/projections/projection-logx.js",
					"src/projections/projection-logy.js",
					"src/projections/projection-loglog.js",
					"src/projections/projection-time.js",
					"src/projections/projection-timex.js",
					"src/projections/projection-timey.js",
					"src/projections/projection-map.js",
					
					"src/plugins/plugin.js",
					
					"src/widget/widget-plugin.js",
					"src/widget/widget.js",
					"src/widget/widget-folder.js",
					"src/widget/widget-geometry.js",
					"src/widget/widget-bar.js",
					"src/widget/widget-pad.js",
					"src/widget/widget-button.js",
					"src/widget/widget-button-plugin.js",

					"src/plugins/outline/device-outline-plugin.js",

					"src/plugins/label/abstract-label.js",
	            	"src/plugins/label/text-label.js",
	            	"src/plugins/label/text-label-plugin.js",
	            	
	            	"src/plugins/legend/title-legend-plugin.js",
	            	
	            	"src/plugins/image/image-plugin.js",
	            	
	            	"src/plugins/misc/dump-coordinate-plugin.js",
					"src/glyph/general-metrics-path-plugin.js",
					
					];

var pie  		 = ["src/plugins/pie/pie-plugin.js",
					"src/plugins/pie/pie.js",
					"src/plugins/pie/pie-slice.js",
					"src/plugins/pie/pie-stroke.js",
					"src/plugins/pie/pie-fill.js",
					"src/plugins/pie/pie-effect.js",
					"src/plugins/pie/pie-label.js",
					"src/plugins/pie/pie-builder.js"];

var donut2d  	 = ["src/plugins/donut2d/donut2d-plugin.js",
	              	"src/plugins/donut2d/donut2d.js",
					"src/plugins/donut2d/donut2d-slice.js",
					"src/plugins/donut2d/donut2d-fill.js",
					"src/plugins/donut2d/donut2d-stroke.js",
					"src/plugins/donut2d/donut2d-effect.js",
					"src/plugins/donut2d/donut2d-label.js",
					"src/plugins/donut2d/donut2d-builder.js"];

var donut3d  	 = ["src/plugins/donut3d/donut3d-plugin.js",
             	   	"src/plugins/donut3d/donut3d.js",
             	   	"src/plugins/donut3d/donut3d-slice.js",
					"src/plugins/donut3d/donut3d-paint.js",
					"src/plugins/donut3d/donut3d-label.js",
					"src/plugins/donut3d/donut3d-builder.js",
					"src/plugins/donut3d/donut3d-effect.js"];



var translate 	 = ["src/plugins/translate/translate-plugin.js",
					"src/plugins/translate/translate-pad.js",
					"src/plugins/translate/translate-tx.js",
					"src/plugins/translate/translate-ty.js",
					"src/plugins/translate/translate-compass.js",
					"src/plugins/translate/translate-sync.js"];

var zoom	  	 = ["src/plugins/zoom/box/zoom-box-plugin.js",
             	    "src/plugins/zoom/box/zoom-box-sync.js",
					"src/plugins/zoom/lens/zoom-lens-plugin.js",
					"src/plugins/zoom/lens/zoom-lens-sync.js",
					"src/plugins/zoom/lens/zoom-lens-pad.js",
					"src/plugins/zoom/lens/zoom-lens-lensx.js",
					"src/plugins/zoom/lens/zoom-lens-lensy.js",
					"src/plugins/zoom/wheel/zoom-wheel-plugin.js",
             	    "src/plugins/zoom/wheel/zoom-wheel-sync.js"];

var metrics  	 = ["src/plugins/metrics/core/bignumber.js",
					"src/plugins/metrics/core/metric.js",
					"src/plugins/metrics/core/metrics-painter.js",
					"src/plugins/metrics/core/metrics-plugin.js",
					"src/plugins/metrics/core/metrics-axis-plugin.js",
					"src/plugins/metrics/core/metrics-device-plugin.js",
					"src/plugins/metrics/manager/metrics-manager.js",
					"src/plugins/metrics/manager/metrics-modeled-model.js",
					"src/plugins/metrics/manager/metrics-modeled-manager.js",
					"src/plugins/metrics/manager/metrics-time-model.js",
					"src/plugins/metrics/manager/metrics-timing-models.js",
					"src/plugins/metrics/manager/metrics-time-manager.js",
					"src/plugins/metrics/manager/metrics-static-manager.js",
					"src/plugins/metrics/manager/metrics-free-manager.js",
					"src/plugins/metrics/manager/metrics-flow-manager.js",
					"src/plugins/metrics/modeled-axis-plugin.js",
					"src/plugins/metrics/static-axis-plugin.js",
					"src/plugins/metrics/timing-axis-plugin.js",
					"src/plugins/metrics/free-axis-plugin.js",
					"src/plugins/metrics/flow-axis-plugin.js",
					"src/plugins/metrics/modeled-device-plugin.js"];


var grid	  	 = ["src/plugins/grid/core/grid.js",
        	  	    "src/plugins/grid/core/grid-plugin.js",
        	  	    "src/plugins/grid/manager/grid-manager.js",
        	  	    "src/plugins/grid/manager/grid-modeled-manager.js",
        	  	    "src/plugins/grid/grid-modeled-plugin.js"];

var stripe  	 = ["src/plugins/stripe/stripe-plugin.js",
         	 	    "src/plugins/stripe/stripe.js"];



var symbol  	 = ["src/plugins/symbol/symbol/symbol.js",
					"src/plugins/symbol/symbol/symbol-bar.js",
					"src/plugins/symbol/symbol/symbol-bar-stacked.js",
					"src/plugins/symbol/symbol/symbol-bar-group.js",
					"src/plugins/symbol/symbol/symbol-point.js",
					"src/plugins/symbol/symbol/symbol-polyline.js",
					"src/plugins/symbol/painter/symbol-painter.js",
					"src/plugins/symbol/painter/symbol-painter-fill.js",
					"src/plugins/symbol/painter/symbol-painter-effect.js",
					"src/plugins/symbol/painter/symbol-painter-stroke.js",
					"src/plugins/symbol/painter/symbol-painter-axis.js",
					"src/plugins/symbol/painter/symbol-painter-label.js",
					"src/plugins/symbol/painter/symbol-painter-point.js",
					"src/plugins/symbol/painter/symbol-painter-polyline.js",
					"src/plugins/symbol/layer/symbol-layer.js",
					"src/plugins/symbol/layer/symbol-layer-bar.js",
					"src/plugins/symbol/layer/symbol-layer-point.js",
					"src/plugins/symbol/symbol-plugin.js"];

var ray  		 = ["src/plugins/ray/ray-painter.js",
					"src/plugins/ray/ray-painter-fill.js",
					"src/plugins/ray/ray.js",
					"src/plugins/ray/ray-plugin.js"];


var radar  	 	 = ["src/plugins/radar/radar-plugin.js",
           	 	    "src/plugins/radar/radar.js"];


var progress  	 = ["src/plugins/progress/progress-plugin.js",
         	 	    "src/plugins/progress/progress-monitor.js"];

var stock	  	 = ["src/plugins/stock/stock-plugin.js",
					"src/plugins/stock/stock.js",
					"src/plugins/stock/stock-geometry.js",
					"src/plugins/stock/stock-layer.js",
					"src/plugins/stock/candlestick.js",
					"src/plugins/stock/ohlc.js",
					"src/plugins/stock/volume.js",
					"src/plugins/stock/stock-curve.js",
					"src/plugins/stock/fixing.js",
					"src/plugins/stock/moving-average.js",
					"src/plugins/stock/weighted-moving-average.js",
					"src/plugins/stock/exponential-moving-average.js",
					"src/plugins/stock/bollinger-bands.js",
					"src/plugins/stock/macd.js"];


var bubble  	 = ["src/plugins/bubble/bubble-plugin.js",
            	    "src/plugins/bubble/bubble.js"];




var gauge  	 	 = ["src/plugins/gauge/gauge-plugin.js",
					"src/plugins/gauge/gauge-part.js",
					"src/plugins/gauge/gauge-envelop.js",
					"src/plugins/gauge/gauge-background.js",
					"src/plugins/gauge/gauge-body.js",
					"src/plugins/gauge/gauge-anchor-binder.js",
					"src/plugins/gauge/gauge-path-binder.js",
					"src/plugins/gauge/gauge-needle.js",
					"src/plugins/gauge/gauge-metrics-path.js",
					"src/plugins/gauge/gauge.js",
					"src/plugins/gauge/gauge-compass.js"];

var functions  	 = ["src/plugins/function/analysis.js",
					"src/plugins/function/function-nature.js",
					"src/plugins/function/path-segment.js",
					"src/plugins/function/source-function.js",
					"src/plugins/function/path-function.js",
					"src/plugins/function/line-path-function.js",
					"src/plugins/function/area-path-function.js",
					"src/plugins/function/scatter-path-function.js",
					"src/plugins/function/function-plugin.js"];


var plot  	 	 = ["src/plugins/plot/plot-plugin.js",
					"src/plugins/plot/plot.js",
					"src/plugins/plot/line-plot.js",
					"src/plugins/plot/bezier-plot.js",
					"src/plugins/plot/bezier-g1-plot.js",
					"src/plugins/plot/bspline-plot.js",
					"src/plugins/plot/naturalcubic-plot.js",
					"src/plugins/plot/naturalcubic-closed-plot.js",
					"src/plugins/plot/catmullrom-plot.js"];

var map  		 = ["src/plugins/map/map-geojson.js",
					"src/plugins/map/map-background-plugin.js",
					"src/plugins/map/map-tile-plugin.js",
					//"src/plugins/map/map-semantic-translate-plugin.js",
					//"src/plugins/map/map-semantic-zoom-plugin.js",
					//"src/plugins/map/map-semantic-transform-plugin.js",
					"src/plugins/map/map-geometric-translate-plugin.js",
					"src/plugins/map/map-geometric-zoom-plugin.js",
					"src/plugins/map/map-geojson-plugin.js"];

//TRANSFORM
var transform  	 = ["src/plugins/transforms/semantic-transform-plugin.js"];

var _features = [
                 	{name : "core",  parts :core},
	                {name : "pie",  parts :pie},
	                {name : "donut2d", parts :donut2d},
	                {name : "donut3d", parts :donut3d},
	                {name : "translate", parts :translate},
	                {name : "zoom", parts :zoom},
	                {name : "metrics", parts :metrics},
	                {name : "grid", parts :grid},
	                {name : "strip", parts :stripe},
	                {name : "symbol", parts :symbol},
	                {name : "ray", parts :ray},
	                {name : "radar", parts :radar},
	                {name : "progress", parts :progress},
	                {name : "stock", parts :stock},
	                {name : "gauge", parts :gauge},
	                {name : "bubble", parts :bubble},
	                {name : "functions", parts :functions},
	                {name : "plot", parts :plot},
	                {name : "map", parts :map},
	                {name : "transform", parts :transform},
                ];

module.exports = function(grunt) {
	grunt.registerTask('jenscript', 'package jenscript features', function(featuresArgs) {
		
		  grunt.log.writeln('jenscript@'+grunt.config('pkg').version);
		  grunt.log.writeln('jenscript@'+_features[0].name);
		  for (var j = 0; j < _features[0].parts.length; j++) {
			  grunt.log.writeln('├──'+_features[0].name+"@"+_features[0].parts[j].substring(_features[0].parts[j].lastIndexOf('/')+1));
		  }
		  var features = [].concat(core);
		  if(featuresArgs !== undefined){
			  var ignored = [];
			  var featureItems = featuresArgs.split(",");
			  for (var i = 0; i < featureItems.length; i++) {
				var f = featureItems[i];
				var found = false;
				for (var k = 1; k < _features.length; k++) {
					  var _feature = _features[k];
					  if(_feature.name === f || f === 'all'){
						  found = true;
						  grunt.log.writeln("jenscript@"+_feature.name);
						  for (var j = 0; j < _feature.parts.length; j++) {
							  grunt.log.writeln('├──'+_feature.name+"@"+_feature.parts[j].substring(_feature.parts[j].lastIndexOf('/')+1));
						  }
						  features = features.concat(_feature.parts);
					  }
				 }
				if(!found && f !== 'core'){
					ignored.push(f);
				}
			  }
			  if(ignored.length > 0){
				  grunt.log.writeln("ignored : ", ignored);
			  }
		  }else{
			  
			  for (var i = 1; i < _features.length; i++) {
				  var _feature = _features[i];
				  grunt.log.writeln("jenscript@"+_feature.name);
				  for (var j = 0; j < _feature.parts.length; j++) {
					  grunt.log.writeln('├──'+_feature.name+"@"+_feature.parts[j].substring(_feature.parts[j].lastIndexOf('/')+1));
				  }
				  features = features.concat(_feature.parts);
			  }
		  }
		  grunt.config('features',features);
		  grunt.task.run(["concat","replace", "uglify"]);
	});
};