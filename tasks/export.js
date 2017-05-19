

module.exports = function(grunt) {
	grunt.registerTask('export', 'export jenscript to directory, usage $ grunt export:/path/to/dir', function(exportDir) {
		  grunt.log.writeln('jenscript@export'+grunt.config('pkg').version);
		  var fs = require('fs');
		  if(exportDir !== undefined && fs.existsSync(exportDir)){
			  grunt.log.writeln('jenscript@'+grunt.config('pkg').version+' export --> '+exportDir);
			  grunt.config('exportDir',exportDir);
			  grunt.task.run(["copy:export"]);
		  }else{
			  grunt.fail.fatal("jenscript valid export directory should be supplied.")
		  }
	});
};