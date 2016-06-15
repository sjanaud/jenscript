module.exports = function(grunt) {
	grunt.registerTask('modules', 'package modules in separate file, usage $ grunt modules', function(featuresArgs) {
		  grunt.log.writeln('jenscript@'+grunt.config('pkg').version);
		  for (var k = 0; k < _features.length; k++) {
			  grunt.task.run(["module:"+_features[k].name]);
		  }
	});
};