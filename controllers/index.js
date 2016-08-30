const express = require('express');
const router  = express.Router();

router.use('/api/recent', require('./recent'));

router.use('/api/search/', require('./search'));
console.log(__dirname);
router.get('/', express.static(__dirname + '/public'));

module.exports = router;
