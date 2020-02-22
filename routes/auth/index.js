const express = require('express');
const router = express.Router();

router.use('/create-account', require('./createAccount'));
router.use('/sign-in',require('./userSignIn'));

module.exports = router;