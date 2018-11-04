var express = require('express');
var router = express.Router();

/*
GET /ping : Ping server for health check
*/

router.get('/', function (req, res) {
    res.json({
        message: 'OK'
    });
});

module.exports = router;