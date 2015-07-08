var vows = require('vows');
var assert = require('assert');
var util = require('util');
var RdioStrategy = require('passport-rdio/strategy');


vows.describe('RdioStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new RdioStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named rdio': function (strategy) {
      assert.equal(strategy.name, 'rdio');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new RdioStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        callbackURL: "http://127.0.0.1:3000/auth/rdio/callback"
      },
      function() {});
      
      // mock

      strategy._oauth2._request = function(method, url, headers, post_data, accessToken, callback) {
        var body = '{"status": "ok", "result": {"firstName": "Jared", "baseIcon": "user/no-user-image-square.jpg", "gender": "m", "url": "/people/jaredhanson/", "key": "x1111", "lastName": "Hanson", "libraryVersion": 2, "type": "s", "icon": "http://media.rd.io/user/no-user-image-square.jpg", "email": "test@test.com", "username": "jaredhanson"}}';
        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'rdio');
        assert.equal(profile.id, 'x1111');
        assert.equal(profile.displayName, 'Jared Hanson');
        assert.equal(profile.name.familyName, 'Hanson');
        assert.equal(profile.name.givenName, 'Jared');
        assert.equal(profile.username, 'jaredhanson');
        assert.equal(profile.emails.length, 1);
        assert.equal(profile.emails[0], 'test@test.com');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new RdioStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        callbackURL: "http://127.0.0.1:3000/auth/rdio/callback"
      },
      function() {});
      
      // mock
      strategy._oauth2._request = function(method, url, headers, post_data, accessToken, callback) {
        callback(new Error('something went wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },

}).export(module);
