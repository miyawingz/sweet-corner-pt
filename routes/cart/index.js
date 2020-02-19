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

        const { data } = rows[0];

        res.send({
            cartId,
            cartToken,
            item: data.item,
            message: `${data.item.quantity} ${data.item.name} cupcakes added to cart`,
            total: data.total
        })
        return;

    } catch (err) {
        next(err);
    }
})

router.get('/totals', tokenHandler, async (req, res, next) => {
    const { cartId, uid } = res.locals;
    try {
        if (cartId || uid) {
            const queryInfo = queries.GetCartTotal(uid, cartId);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount > 0) {
                res.send({ ...rows[0] });
                return;
            }
        }

        res.send({
            "cartId": null,
            "message": "No active cart",
            "total": 0
        })

    } catch (err) {
        next(err)
    }
})

router.get('/', tokenHandler, async (req, res, next) => {
    const { cartId, uid } = res.locals;
    try {
        if (cartId) {
            const queryInfo = queries.GetCartByCartId(cartId);
            const { rows } = await queryAsync(queryInfo.text, queryInfo.values);
            const { data } = rows[0];
            res.send({
                cartId,
                items: data.items,
                total: data.total
            })
            return;
        }

        if (uid) {
            const queryInfo = queries.GetCartByUser(uid);
            const { rows } = await queryAsync(queryInfo.text, queryInfo.values);
            res.send({ ...rows[0].data });
            return;
        }

        res.send({
            "cartId": null,
            "message": "No active cart",
            "total": 0
        });

    } catch (err) {
        next(err);
    }
})

router.use('/items/:item_id', require('./ItemInCart'));
module.exports = router;