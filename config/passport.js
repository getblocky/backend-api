var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('../config/');
var utils = require('../utils');

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: config.jwt.secret
  };

  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    utils.getUserData(jwt_payload.email, function (err, userData) {
      if (!err) {
        done(null, userData);
      } else {
        done(null, false);
      }
    });
  }));
};