module.exports = function(grunt) {
	var pkg = grunt.file.readJSON("package.json");

grunt.initConfig({
		pkg : pkg,
		banner : grunt.file.read("./src/header.js").replace(/@VERSION/,
				pkg.version).replace(/@DATE/,
				grunt.template.today("yyyy-mm-dd"))+ "\n",
		
		uglify : {
			options : {
				banner : "<%= banner %>",
				report : "min"
			},
			dist : {
				src : "<%= concat.target.dest %>",
				dest : "jenscript.min.js"
			}
		},
		replace: {
			  version: {
			    src: ['jenscript.js'],
			    overwrite: true,
			    replacements: [{
			      from: '@VERSION',
			      to: pkg.version
			    }]
			  }
		},
		concat: {
			options : {
				banner : "<%= banner %>"
			},
			target: {
				dest : "jenscript.js",
				src : "<%= features %>",
			}
		},
		
	});
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadTasks('tasks');
	
	grunt.registerTask("default", "jenscript");
	
};