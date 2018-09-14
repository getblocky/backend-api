var express = require('express');
var router = express.Router();
var passport = require('passport');
var axios = require('axios');

var Script = require('../models/Script');

/*

POST /script/ : Create new script
GET /script/:script_id : Get a script
PUT /script/:script_id : Update a script
DELETE /script/:script_id : Delete a script
*/

router.post('/', function (req, res) {
  passport.authenticate('jwt', {
    session: false
  }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        status: 400,
        error: 'Something went wrong'
      });
    }

    if (!req.body.name) {
      return res.status(400).json({
        status: 400,
        error: 'Missing parameter'
      });
    } else {
      var newScript = new Script(req.body);
      newScript.ownerEmail = user.email;
      newScript.save(function (err) {
        if (err) {
          throw err;
        }
        res.json(newScript);
      });
    }
  })(req, res);
});

router.get('/:script_id', function (req, res) {
  passport.authenticate('jwt', {
    session: false
  }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        status: 400,
        error: 'Something went wrong'
      });
    }

    Script.findOne({
      _id: req.params.script_id,
      ownerEmail: user.email
    }, function (err, foundScript) {

      if (err) throw err;
      if (foundScript)
        res.json(foundScript);
      else {
        res.status(400).json({
          status: 400,
          error: 'Script not found'
        });
      }
    });
  })(req, res);
});

router.put('/:script_id', function (req, res) {
  passport.authenticate('jwt', {
    session: false
  }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        status: 400,
        error: 'Something went wrong'
      });
    }

    Script.findById(req.params.script_id, function (err, foundScript) {
      if (err)
        throw err;

      if (foundScript) {
        if (user.email !== foundScript.ownerEmail) {
          res.status(403).json({
            status: 403,
            error: 'Forbidden'
          });
          return;
        }

        delete req.body.ownerEmail; // Prevent owner changed
        Script.findByIdAndUpdate(req.params.script_id, req.body, {
          new: true
        }, function (err, updatedScript) {
          if (err) {
            throw err;
          }
          res.json(updatedScript);
        });

      } else {
        res.status(400).json({
          status: 400,
          error: 'Script not found'
        });
      }
    });
  })(req, res);
});

router.delete('/:script_id', function (req, res) {
  passport.authenticate('jwt', {
    session: false
  }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        status: 400,
        error: 'Something went wrong'
      });
    }

    Script.findById(req.params.script_id, function (err, foundScript) {
      if (err)
        throw err;

      if (foundScript) {
        if (user.email !== foundScript.ownerEmail) {
          res.status(403).json({
            status: 403,
            error: 'Forbidden'
          });
          return;
        }

        foundScript.remove(function (err) {
          if (err) {
            throw err;
          }
          res.json();
        });

      } else {
        res.status(400).json({
          status: 400,
          error: 'Script not found'
        });
      }
    });
  })(req, res);
});

router.post('/ota', function (req, res) {
  passport.authenticate('jwt', {
    session: false
  }, (err) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        error: 'Something went wrong'
      });
    }

    if (!req.body.url || !req.body.data) {
      res.status(400).json({
        status: 400,
        error: 'Missing parameter'
      });
    } else {
      axios.put(req.body.url, req.body.data, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(function () {
          res.json();
        })
        .catch(function () {
          res.status(400).json({
            status: 400,
            error: 'Something went wrong'
          });
        });
    }
  })(req, res);
});

module.exports = router;