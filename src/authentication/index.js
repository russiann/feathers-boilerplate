const authentication   = require('@feathersjs/authentication');
const jwt              = require('@feathersjs/authentication-jwt');
const local            = require('@feathersjs/authentication-local');
const oauth2           = require('@feathersjs/authentication-oauth2');
const GoogleStrategy   = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const localVerifier    = require('./verifier-local');
const jwtVerifier      = require('./verifier-jwt');

module.exports = function () {
  const app = this;
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt({ Verifier: jwtVerifier }));
  app.configure(local(Object.assign(config.local, { Verifier: localVerifier })));

  app.configure(oauth2(Object.assign({
    name: 'google',
    Strategy: GoogleStrategy
  }, config.google)));

  app.configure(oauth2(Object.assign({
    name: 'facebook',
    Strategy: FacebookStrategy
  }, config.facebook)));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};

