

module.exports = function(grunt) {
	grunt.registerTask('release', 'package all jenscript plugins in one file, usage $ grunt release', function(featuresArgs) {
		  grunt.log.writeln('jenscript@'+grunt.config('pkg').version);
		  grunt.task.run(["package"]);
	});
};