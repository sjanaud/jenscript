module.exports = function(grunt) {
	grunt.registerTask('modules', 'package modules in separate file, usage $ grunt modules', function(featuresArgs) {
		  grunt.log.writeln('jenscript@'+grunt.config('pkg').version);
		  var  features =  grunt.config('jenscript.features');
		  for (var k = 0; k < features.length; k++) {
			  grunt.task.run(["module:"+features[k].name]);
		  }
	});
};