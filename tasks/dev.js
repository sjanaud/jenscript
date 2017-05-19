
module.exports = function(grunt) {
	grunt.registerTask('dev', 'package all jenscript plugins in one file without minified version, usage $ grunt dev', function(featuresArgs) {
		  grunt.log.writeln('jenscript@'+grunt.config('pkg').version);
		  grunt.task.run(["package"]);
	});
};