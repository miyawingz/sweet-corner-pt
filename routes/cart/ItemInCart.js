const express = require('express');
const router = express.Router();
const { tokenHandler } = require('../../middleware/token_handler');
const { sqlIdHandler } = require('../../middleware/sqlId_handler');

router.patch('/', tokenHandler, sqlIdHandler, (req, res, next) => {
    const quantity = req.body.quantity || 1;
    const itemId = req.params['item_id'];
    
})

module.exports = router;