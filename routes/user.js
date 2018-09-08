var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');

var config = require('../config');
var utils = require('../utils');
var Script = require('../models/Script');

/*
POST /user/login
GET /user/scripts: Get all scripts belonging to user
GET /user/devices: Get all devices belonging to user
*/

// Authenticate the user and get a JSON Web Token to include in the header of future requests.
router.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      status: 400,
      error: 'Please enter email and password'
    });
  } else {
    utils.getUserData(req.body.email, function (err, userData) {
      if (!err) {
        hashPassword = utils.createHash(req.body.password, req.body.email);

        if (hashPassword === userData.pass) {
          var user = {
            email: userData.email,
            name: userData.name
          }
          var token = jwt.sign(user, config.jwt.secret, {
            expiresIn: "2 days"
          });
          res.json({
            token: token,
            user: user
          });
        } else {
          res.status(401).json({
            status: 401,
            error: 'Authentication failed'
          });
        }
      } else {
        res.status(401).json({
          status: 401,
          error: 'Authentication failed'
        });
      }
    });
  }

});

router.get('/scripts', function (req, res) {
  passport.authenticate('jwt', {
    session: false
  }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        status: 400,
        error: 'Something went wrong'
      });
    }

    Script.find({
      ownerEmail: user.email
    }, function (err, foundScripts) {
      if (err) {
        throw err;
      } else {
        res.json(foundScripts);
      }
    })
  })(req, res);
});

router.get('/devices', function (req, res) {
  passport.authenticate('jwt', {
    session: false
  }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        status: 400,
        error: 'Something went wrong'
      });
    }

    utils.getUserData(user.email, function (err, userData) {
      if (err) {
        throw err;
      } else {
        var devices = [];
        userData.profile.dashBoards.forEach(function (dashboard) {
          dashboard.devices.forEach(function (device) {
            devices.push({
              id: dashboard.id + '-' + device.id,
              name: dashboard.name + ' - ' + device.name,
              token: device.token
            });
          });
        });

        res.json(devices);
      }
    });
  })(req, res);
});

module.exports = router;