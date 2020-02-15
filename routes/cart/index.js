const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { queryAsync } = require('../../db');
const { cartAuth } = require('../../middleware/cart_auth');
const { tokenHandler } = require('../../middleware/token_handler');

router.post('/items/:product_id', tokenHandler, cartAuth, async (req, res, next) => {
    const { cartId, cartToken } = res.locals.cartInfo;
    const productId = req.params['product_id'];
    const quantity = req.body.quantity || 1;

    try {
        const queryInfo = queries.AddItemToCart(cartId, productId, quantity)
        const { rows } = await queryAsync(queryInfo.text, queryInfo.values);

        const queryInfoStatus = queries.UpdateCartStatus(cartId, 2);
        const results = await queryAsync(queryInfoStatus.text, queryInfoStatus.values);

        res.send({ ...rows[0], cartId, cartToken })
    } catch (err) {
        next(err);
    }
})

module.exports = router;