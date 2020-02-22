const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { queryAsync } = require('../../db');
const { tokenHandler } = require('../../middleware/token_handler');
const { sqlIdHandler } = require('../../middleware/sqlId_handler');
const ApiError = require('../../lib/apiError');

router.use('/items', require('./ItemInCart'));

router.get('/totals', tokenHandler, sqlIdHandler, async (req, res, next) => {
    const { cartIdSQL, uidSQL } = res.locals.sqlInfo;

    try {
        if (uidSQL || cartIdSQL) {
            const sqlInfo = uidSQL ? { type: "userId", value: uidSQL } : { type: "cartId", value: cartIdSQL }
            const queryInfo = queries.GetCartTotal(sqlInfo.type, sqlInfo.value);
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

router.get('/', tokenHandler, sqlIdHandler, async (req, res, next) => {
    const { cartIdSQL, uidSQL } = res.locals.sqlInfo;
    try {
        if (cartIdSQL || uidSQL) {
            const sqlInfo = uidSQL ? { type: "userId", value: uidSQL } : { type: "cartId", value: cartIdSQL }
            const queryInfo = queries.GetCartDetail(sqlInfo.type, sqlInfo.value);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount > 0) {
                res.send({ ...rows[0] })
                return;
            }
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

router.delete('/:cart_id', tokenHandler, sqlIdHandler, async (req, res, next) => {
    const { uidSQL } = res.locals.sqlInfo;
    const cartId = req.params['cart_id'];

    try {
        if (!uidSQL) {
            return next(new ApiError(500, 'not authorizied to delete cart'));
        }

        const queryInfo = queries.DeleteCart(cartId, "userId", uidSQL);
        const { rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
        if (rowCount < 1) {
            return next(new ApiError(500, 'not authorizied to delete cart'));
        }
        res.send({
            message: "cart deleted",
            deletedId: cartId
        })
    } catch (err) {
        next(err)
    }
})

router.delete('/', tokenHandler, sqlIdHandler, async (req, res, next) => {
    const { cartIdSQL } = res.locals.sqlInfo;
    const { cartId } = res.locals;
    try {
        if (!cartIdSQL) {
            return next(new ApiError(500, 'invalid cart'))
        }
        
        const queryInfo = queries.DeleteCart(cartId, "id", cartIdSQL);
        const { rowCount } = await queryAsync(queryInfo.text, queryInfo.values)
        if (rowCount > 0) {
            res.send({
                message: "cart deleted",
                deletedId: cartId
            })
        }
    } catch (err) {
        next(err)
    }

})

module.exports = router;