var express = require('express');
var router = express.Router();

var user = require('./user.js');
var script = require('./script.js');
var ping = require('./ping.js');

router.use('/api/v1/user', user);
router.use('/api/v1/script', script);
router.use('/api/v1/ping', ping);

module.exports = router;