const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { queryAsync } = require('../../db');
const ApiError = require('../../lib/apiError');

router.use('/', async (req, res, next) => {
    const quantity = req.body.quantity || 1;
    const { itemId } = res.locals;
    const cartId  = res.locals.cartInfo.cartId;
    const cartIdSQL = res.locals.sqlInfo.cartId;

    if (!cartId) {
        return next(new ApiError(500, 'invalid auth'))
    }

    try {
        const queryInfo = queries.UpdateItemInCart(quantity, itemId, cartIdSQL);
        const { rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
        const { rows } = await queryAsync(`SELECT "item","total" from "itemView" where "itemId"=$1`, [itemId]);
        const { item, total } = rows[0];

        if (rowCount > 0) {
            if (item.quantity < 1) {
                await DeteleItem(itemId, cartIdSQL);
                res.send({
                    cartId,
                    message: `removed all ${item.name} from cart`
                })
                return;
            }

            if (quantity > 0) {
                res.send({
                    cartId,
                    item,
                    message: `Added ${quantity} ${item.name} cupcakes to cart`,
                    total
                })
                return;
            } else {
                res.send({
                    cartId,
                    item,
                    message: `Removed ${quantity * -1} ${item.name} cupcakes from cart`,
                    total
                })
                return;
            }

        }

        return next(new ApiError(500, 'invalid item id'));

    } catch (err) {
        next(err);
    }
})

async function DeteleItem(itemId, cartIdSQL) {
    try {
        const queryInfo = queries.DeleteItemInCart(itemId, cartIdSQL);
        const result = await queryAsync(queryInfo.text, queryInfo.values);
        return result;
    } catch (err) {
        return err;
    }
}

module.exports = router;