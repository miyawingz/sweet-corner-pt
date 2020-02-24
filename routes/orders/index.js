const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { queryAsync } = require('../../db');
const { tokenHandler } = require('../../middleware/token_handler');
const { sqlIdHandler } = require('../../middleware/sqlId_handler');
const { emailValidate } = require('../../lib/userUtils');
const ApiError = require('../../lib/apiError');

router.post('/guest', tokenHandler, sqlIdHandler, async (req, res, next) => {
    const { email, firstName, lastName } = req.body;
    const { cartIdSQL } = res.locals.sqlInfo;

    try {
        if (!emailValidate(email) || !firstName || !lastName) {
            return next(new ApiError(500, 'invalid email or name'));
        }

        const queryInfoTotal = queries.GetCartTotal('cartId', cartIdSQL);
        const ResultTotal = await queryAsync(queryInfoTotal.text, queryInfoTotal.values);
        if (ResultTotal.rowCount < 1) {
            return next(new ApiError(500, 'invalid cart token'))
        }
        const { total } = ResultTotal.rows[0];

        const queryInfoCreateGuest = queries.CreateNewGuest(email, firstName, lastName);
        const ResultGuest = await queryAsync(queryInfoCreateGuest.text, queryInfoCreateGuest.values);
        if (ResultGuest.rowCount < 1) {
            return next(new ApiError(500, 'fail to create guest id'))
        }
        const guestId = ResultGuest.rows[0].id;


        const queryInfoCreateOrder = queries.CreateNewOrder(guestId, null, cartIdSQL, total);
        const { rows, rowCount } = await queryAsync(queryInfoCreateOrder.text, queryInfoCreateOrder.values);
        if (rowCount < 1) {
            return next(new ApiError(500, 'fail to create order'));
        }

        const queryInfoOrderItem = queries.AddItemToOrder(rows[0].id, cartIdSQL);
        await queryAsync(queryInfoOrderItem.text, queryInfoOrderItem.values)

        res.send({
            message: "Your order has been placed",
            id: rows[0].pid
        })

    } catch (err) {
        next(err);
    }
})


module.exports = router;