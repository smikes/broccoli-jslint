require('should');
var JSLintFilter = require('../lib/run.js');

describe('setup', function () {
    it('should pass at least one test', function (done) {
        Number(1).should.equal(1);
        done();
    });
});

describe('constructor', function () {
    it('should be usable as a constructor', function () {
        var filter = new JSLintFilter();
        (filter != null).should.equal(true);
    });
    it('should also work as a function-style constructor', function () {
        var tree = {}, options = {foo: 3};
        var filter = JSLintFilter(tree, options);

        // should store ref to tree
        filter.inputTree.should.equal(tree);

        // should shallow-copy options
        filter.options.foo.should.equal(3);
        filter.options.should.not.equal(options);
    });
});

describe('lintFile', function () {
    it('should run lint and detect errors', function () {
        var filter = new JSLintFilter(),
            errors;

        filter.reportErrors = function (path, e) { errors = e; };
        filter.lintFile('eval(3)', 'foo');

        errors.length.should.equal(2);
        errors[0].reason.should.equal("eval is evil.");
        errors[1].reason.should.equal("Expected ';' and instead saw '(end)'.");
    });
});

describe('reportErrors', function () {
    it('should report errors', function () {
        var errors = [],
            logger = function (s) { errors.push(s); },
            filter = new JSLintFilter({}, { logger: logger });

        filter.reportErrors('foo', [ {line: 3, character: 4, reason: 'too fluffy' } ]);

        errors[0].should.equal('foo:3:4: too fluffy');
    });
});

describe('processFile', function () {
    it('should process a file and lint it', function(done) {
        var errors = [],
            logger = function (s) { errors.push(s); },
            filter = new JSLintFilter({}, { logger: logger });

        var p = filter.processFile('test/fixtures', 'out', 'valid.js');

        errors.length.should.equal(0);
        // TODO(SOM): output file should exist

        done();
    });
});
