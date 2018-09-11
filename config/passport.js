var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('../config/');
var utils = require('../utils');
var FacebookTokenStrategy = require('passport-facebook-token');

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: config.jwt.secret
  };

  passport.use(new JwtStrategy(opts, (jwt_payload, cb) => {
    utils.getUserData(jwt_payload.email, function (err, userData) {
      if (!err) {
        cb(null, userData);
      } else {
        cb(null, false);
      }
    });
  }));

  passport.use(new FacebookTokenStrategy({
      clientID: config.facebook.clientId,
      clientSecret: config.facebook.clientSecret,
    },
    function (accessToken, refreshToken, profile, cb) {
      utils.getUserData(profile._json.email, function (err, userData) {
        if (!err) {
          cb(null, userData);
        } else {
          cb(null, profile._json);
        }
      });
    }));
};