module.exports = function(grunt) {

    grunt.initConfig({
        
        qunit: {      // task name
            basic: {  // target name
                options: {
                    urls: [ "tests/core.html" ]
                }
            },
            search: [ "tests/search.html" ] // second target & single option
        },

        watch: {
            js: {
                files: [ "src/**/*.js" ],
                tasks: [ "qunit" ]
            }
        }

    });

    // Load npm modules
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Register any multi-tasks
    grunt.registerTask("default", [ "qunit" ]);

};