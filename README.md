#broccoli-jslint

Plugin for broccoli to run jslint static analysis tool on javascript files

Inspired by makepanic/broccoli-eslint

## Install


     npm install --save broccoli-eslint

## Example

    var jslint = require('broccoli-jslint');
    tree = jslint(tree, { latest: 'true' });


## API

### jslint(tree, options)

Returns a tree identical to the input tree.  Outputs jslint messages on console as side-effect.

#### options

An object containing options to pass to JSLint.  Options supported by jslint
are documented at http://www.jslint.com/lint.html

Additional options supported by broccoli-jslint are documented below:

##### options.edition

The edition of JSLint to use.  If omitted, defaults to 2013-08-26.
You should probably choose 'latest'.
