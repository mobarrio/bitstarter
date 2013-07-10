#!/usr/bin/env node

var fs      = require('fs'),
    sys     = require('util'),
    rest    = require('restler'),
    program = require('commander'),
    cheerio = require('cheerio');
var HTMLFILE_DEFAULT   = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT        = "http://fathomless-ravine-8237.herokuapp.com";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(url, htmlfile, checksfile, callback) {
    if(url.length > 0 ) { 
       rest.get(url).on('complete', function(result) { 
             $ = cheerio.load(result);
             var checks = loadChecks(checksfile).sort();
             var out = {};
             for(var ii in checks) {
                 var present = $(checks[ii]).length > 0;
                 out[checks[ii]] = present;
             }
             callback(null, out);
       });

    } else {
       $ = cheerioHtmlFile(htmlfile);
       var checks = loadChecks(checksfile).sort();
       var out = {};
       for(var ii in checks) {
           var present = $(checks[ii]).length > 0;
           out[checks[ii]] = present;
       }
       callback(null, out);
    }
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'URL to html file', '', URL_DEFAULT)
        .parse(process.argv);

    checkHtmlFile(program.url, program.file, program.checks, function(err, checkJson){
    	var outJson = JSON.stringify(checkJson, null, 4);
    	console.log(outJson);
    });
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
