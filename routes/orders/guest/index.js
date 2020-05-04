const express = require('express');
const router = express.Router();
const { tokenHandler } = require('../../../middleware/token_handler');
const { sqlIdHandler } = require('../../../middleware/sqlId_handler');

router.post('/', tokenHandler, sqlIdHandler, require('./createGuestOrder'));
router.get('/:order_id', require('./getGuestOrder'));

module.exports = router;