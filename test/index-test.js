var vows = require('vows');
var assert = require('assert');
var util = require('util');
var rdio = require('passport-rdio');


vows.describe('passport-rdio').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(rdio.version);
    },
  },
  
}).export(module);
