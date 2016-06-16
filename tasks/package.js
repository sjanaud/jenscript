

module.exports = function(grunt) {
	grunt.registerTask('package', 'jenscript module set package in one file , usage : $ grunt package:pie,donut2d,zoom', function(featuresArgs) {
		var  _features =  grunt.config('jenscript.features');
		grunt.log.writeln('jenscript features tree :');
		  grunt.log.writeln('jenscript@'+grunt.config('pkg').version);
		  var  core =  grunt.config('jenscript.core');
		  grunt.log.writeln('jenscript@'+_features[0].name);
		  for (var j = 0; j < core.length; j++) {
			  grunt.log.writeln('├──core'+"@"+core[j].substring(core[j].lastIndexOf('/')+1));
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
						  var  _featureParts =  grunt.config('jenscript.'+_feature.name);
						  for (var j = 0; j < _featureParts.length; j++) {
							  grunt.log.writeln('├──'+_feature.name+"@"+_featureParts[j].substring(_featureParts[j].lastIndexOf('/')+1));
						  }
						  features = features.concat(_featureParts);
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
				  var  _featureParts =  grunt.config('jenscript.'+_feature.name);
				  for (var j = 0; j < _featureParts.length; j++) {
					  grunt.log.writeln('├──'+_feature.name+"@"+_featureParts[j].substring(_featureParts[j].lastIndexOf('/')+1));
				  }
				  features = features.concat(_featureParts);
			  }
		  }
		  grunt.config('concatFilename','jenscript.js');
		  grunt.config('uglifyDist','jenscript.min.js');
		  grunt.config('features',features);
		  grunt.task.run(["concat","replace", "uglify"]);
	});
};