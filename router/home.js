const { Router } = require('express');
const router = Router();
const path = require('path');

router.get('/', function(req, res) {
    res.sendFile('index.html', { root: 'public/' });
});
router.get('/visual', function(req, res) {
    res.sendFile('visual.html', { root: 'public/' });
});

router.get('/client', function(req, res) {
    res.sendFile('client.html', { root: 'public/' });
});

module.exports = router;