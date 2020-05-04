const express = require('express');
const router = express.Router();
const { cartAuth } = require('../../../middleware/cart_auth');
const { tokenHandler } = require('../../../middleware/token_handler');
const { sqlIdHandler } = require('../../../middleware/sqlId_handler');

router.post('/:product_id',
    tokenHandler, sqlIdHandler, cartAuth,
    require('./addItemToCart'));

router.route('/:item_id')
    .all(
        tokenHandler,
        sqlIdHandler
    )
    .patch(require('./updateItemQuantityInCart'))
    .put(require('./setItemQuantityInCart'))
    .delete(require('./deleteItemInCart'));

module.exports = router;