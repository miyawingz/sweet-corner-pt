const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { queryAsync } = require('../../db');
const ApiError = require('../../lib/apiError');

router.use(async (req, res, next) => {
    const { itemId, cartId } = res.locals;
    const cartIdSQL = res.locals.sqlInfo.cartId;

    if (!cartId) {
        return next(new ApiError(500, 'invalid auth'))
    }

    try {
        const { rows } = await queryAsync(`select "item","total" from "itemView" where "itemId"=$1`, [itemId])
        const { rowCount } = await DeteleItemFromCart(itemId, cartIdSQL);
        if (rowCount > 0) {
            res.send({
                cartId,
                message: `removed all ${rows[0].item.name} from cart`,
                total: rows[0].total
            })
        }
        return next(new ApiError(500, 'invalid item id'));

    } catch (err) {
        next(err);
    }



})

async function DeteleItemFromCart(itemId, cartIdSQL) {
    try {
        const queryInfo = queries.DeleteItemInCart(itemId, cartIdSQL);
        const result = await queryAsync(queryInfo.text, queryInfo.values);
        return result;
    } catch (err) {
        return err;
    }
}

module.exports = router;