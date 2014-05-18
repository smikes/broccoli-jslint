!(function (){
    'use strict';

    var Filter = require('broccoli-filter'),
        util = require('util'),
        loader = require('jslint'),
        fs = require('fs'),
        path = require('path'),
        Promise = require('rsvp').Promise,
        linter = loader.linter;

    function JSLintFilter(inputTree, options) {
        if (!(this instanceof JSLintFilter)) {
            return new JSLintFilter(inputTree, options);
        }

        Filter.call(this);

        this.inputTree = inputTree;
        this.options = linter.merge({}, options);

        this.JSLint = loader.load(this.options.edition);
        this.linter = linter;

        this.logger = this.options.logger || console.log.bind(console);
    }
    util.inherits(JSLintFilter, Filter);

    JSLintFilter.prototype.extensions = ['js'];
    JSLintFilter.prototype.targetExtension = 'js';

    JSLintFilter.prototype.processFile = function JSLintFilter_processFile(srcDir, destDir, relativePath) {
        var self = this,
            string = fs.readFileSync(path.join(srcDir, relativePath), { encoding: 'utf8' });

        return Promise.resolve(self.lintFile(string, relativePath))
            .then(function() {
                var outputPath = self.getDestFilePath(relativePath);
                fs.writeFileSync(path.join(destDir, relativePath), string, { encoding: 'utf8' });
            });
    };

    JSLintFilter.prototype.lintFile = function JSLintFilter_lintFile(string, relativePath) {
        var linted = this.linter.doLint(this.JSLint, string, this.options);

        if (!linted.ok) {
            this.reportErrors(relativePath, linted.errors);
        }

        return string;
    };

    JSLintFilter.prototype.reportErrors = function JSLintFilter_reportErrors(relativePath, errors) {
        var self = this;

        errors
            .filter(function(e) { return e; })
            .forEach(function (e) {
                self.logger(relativePath + ':' + e.line + ':' + e.character + ': ' + e.reason);
            });
    };

    module.exports = JSLintFilter;
}());
