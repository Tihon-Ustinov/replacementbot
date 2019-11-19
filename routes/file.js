const express = require('express');
const router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send('File upload');
});

router.post('newDocMain', function(req, res, next) {
  res.send('File upload new Doc');
});


module.exports = router;
