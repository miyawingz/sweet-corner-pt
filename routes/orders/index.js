const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { queryAsync } = require('../../db');
const { tokenHandler } = require('../../middleware/token_handler');
const { sqlIdHandler } = require('../../middleware/sqlId_handler');
const { emailValidate } = require('../../lib/userUtils');
const ApiError = require('../../lib/apiError');

router.use('/guest', require('./guest'));

router.route('/')
    .all(tokenHandler, sqlIdHandler)
    .get(require('./getOrder'))
    .post(require('./createUserOrder'));

module.exports = router;