const express = require('express');
const router = express.Router();
const { tokenHandler } = require('../../../middleware/token_handler');

router.route('/')
    .all(tokenHandler)
    .get(require('./signInJWT'))
    .post(require('./signInPW'));

module.exports = router;