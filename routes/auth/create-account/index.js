const express = require('express');
const router = express.Router();
const { tokenHandler } = require('../../../middleware/token_handler');

router.post('/', tokenHandler, require('./createAccount'));

module.exports = router;