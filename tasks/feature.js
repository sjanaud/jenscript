var fs = require('fs');

var core 	= [	"src/envns.js",
				"src/model.js",
				"src/math.js",
				"src/palette/color.js",
				"src/palette/texture.js",
				"src/geom.js",
				
				//GLYPH
				"src/glyph/glyph.js",
				"src/glyph/general-metrics-path.js",
				
				//VIEW
				"src/view/proj-selector.js",
				"src/view/view-background.js",
				"src/view/view-foreground.js",
				"src/view/view-part.js",
				"src/view/svg-graphics.js",
				"src/view/view.js",
				"src/view/view-builder.js",
				
				//PROJECTION
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
				
				//PLUGINGS
				"src/plugins/plugin.js",
				
				//WIDGET
				"src/widget/widget-plugin.js",
				"src/widget/widget.js",
				"src/widget/widget-folder.js",
				"src/widget/widget-geometry.js",
				"src/widget/widget-bar.js",
				"src/widget/widget-pad.js",
				"src/widget/widget-button.js",
				"src/widget/widget-button-plugin.js"];
var outline = [ "src/plugins/outline/device-outline-plugin.js"];
var label   = [ "src/plugins/label/abstract-label.js",
                "src/plugins/label/text-label.js",
                "src/plugins/label/text-label-plugin.js",
                "src/plugins/legend/title-legend-plugin.js"];





module.exports = function(grunt) {
	grunt.registerTask('feature', 'package jenscript feature', function(fs) {
		  //grunt.log.writeln(this.name, fs);
		  if(fs !== undefined){
			  var featureItems = fs.split(",");
			  for (var i = 0; i < featureItems.length; i++) {
				var f = featureItems[i];
				grunt.log.writeln(this.name+" add feature : ", f);
			  }
		  }else{
			  
		  }
		  grunt.config('feature',core.concat(outline));
//		grunt.config.feature = core.concat(outline);
// 		grunt.log.writeln("features:", grunt.config.feature);
//		  for (var i = 0; i < features.length; i++) {
//				var f = features[i];
//				grunt.log.writeln(this.name+" register feature : ", f);
//		  }
		  
	});
};