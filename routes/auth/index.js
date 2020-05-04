const express = require('express');
const router = express.Router();

router.use('/create-account', require('./create-account'));
router.use('/sign-in',require('./sign-in'));

module.exports = router;