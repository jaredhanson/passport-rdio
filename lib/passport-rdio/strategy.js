/**
 * Module dependencies.
 */
var util = require('util')
  , OAuthStrategy = require('passport-oauth').OAuthStrategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Rdio authentication strategy authenticates requests by delegating to Rdio
 * using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to Rdio
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *   - `callbackURL`     URL to which Rdio will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new RdioStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/rdio/callback'
 *       },
 *       function(token, tokenSecret, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.requestTokenURL = options.requestTokenURL || 'http://api.rdio.com/oauth/request_token';
  options.accessTokenURL = options.accessTokenURL || 'http://api.rdio.com/oauth/access_token';
  // NOTE: Rdio returns a `login_url` parameter in the request token response,
  //       which contains the URL to which the user should be redirected to
  //       authorize the request.  This is non-standard, and generally not well
  //       supported by existing OAuth libraries.  As such, the URL being issued
  //       by Rdio is assumed to be well-known and hard-coded here.
  options.userAuthorizationURL = options.userAuthorizationURL || 'https://www.rdio.com/oauth/authorize';
  options.sessionKey = options.sessionKey || 'oauth:rdio';

  OAuthStrategy.call(this, options, verify);
  this.name = 'rdio';
}

/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(Strategy, OAuthStrategy);

/**
 * Retrieve user profile from Rdio.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id`
 *   - `displayName`
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  this._oauth.post('http://api.rdio.com/1/', token, tokenSecret, { method: 'currentUser' }, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'rdio' };
      profile.id = json.result.key;
      profile.displayName = json.result.firstName + ' ' + json.result.lastName;
      profile.name = { familyName: json.result.lastName,
                       givenName: json.result.firstName };
                       
      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
