# Passport-Rdio

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Rdio](http://www.rdio.com/) using the OAuth 1.0a API.

This module lets you authenticate using Rdio in your Node.js applications.
By plugging into Passport, Rdio authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-rdio

## Usage

#### Configure Strategy

The Rdio authentication strategy authenticates users using a Rdio account and
OAuth tokens.  The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user, as well as `options` specifying a
consumer key, consumer secret, and callback URL.

    passport.use(new RdioStrategy({
        consumerKey: RDIO_API_KEY,
        consumerSecret: RDIO_SHARED_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/rdio/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ rdioId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'rdio'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/rdio',
      passport.authenticate('rdio'));
    
    app.get('/auth/rdio/callback', 
      passport.authenticate('rdio', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/jaredhanson/passport-rdio/tree/master/examples/login).

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/passport-rdio.png)](http://travis-ci.org/jaredhanson/passport-rdio)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
