const express = require('express');
const router = express.Router();
const { tokenHandler } = require('../../middleware/token_handler');
const { sqlIdHandler } = require('../../middleware/sqlId_handler');

router.use('/items', require('./items'));

router.get('/totals', tokenHandler, sqlIdHandler, require('./getCartTotal'));

router.route('/')
    .all(tokenHandler, sqlIdHandler)
    .get(require('./getCart'))
    .delete(require('./deleteCart'));

module.exports = router;