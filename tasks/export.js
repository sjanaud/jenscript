

module.exports = function(grunt) {
	grunt.registerTask('export', 'export jenscript to directory, usage $ grunt export:/path/to/dir', function(exportDir) {
		  grunt.log.writeln('jenscript@export'+grunt.config('pkg').version);
		  if(exportDir !== undefined){
			  grunt.log.writeln('jenscript@'+grunt.config('pkg').version+' export --> '+exportDir);
			  grunt.config('exportDir',exportDir);
			  grunt.task.run(["copy:export"]);
		  }else{
			  //grunt.log.writeln('jenscript@export not export directory supplied');
			  grunt.fail.fatal("jenscript export directory should be supplied.")
		  }
	});
};