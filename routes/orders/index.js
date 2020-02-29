const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { queryAsync } = require('../../db');
const { tokenHandler } = require('../../middleware/token_handler');
const { sqlIdHandler } = require('../../middleware/sqlId_handler');
const { emailValidate } = require('../../lib/userUtils');
const ApiError = require('../../lib/apiError');

router.post('/', tokenHandler, sqlIdHandler, async (req, res, next) => {
    const { uidSQL, cartIdSQL } = res.locals.sqlInfo;
    try {
        if (!uidSQL || !cartIdSQL) {
            return next(new ApiError(500, 'invalid auth, no cart to check out'));
        }

        const { rows, rowCount } = await queryAsync(`SELECT * FROM "spCreateUserOrder"($1,$2)`, [uidSQL, cartIdSQL]);
        if (rowCount < 1) {
            return next(new ApiError(500, 'invalid auth, no cart to check out'));
        }

        res.send({
            message: "Your order has been placed",
            id: rows[0].pid
        })
        
    } catch (err) {
        next(err)
    }


})

router.get('/:order_id', tokenHandler, sqlIdHandler, async (req, res, next) => {
    const orderId = req.params['order_id'];
    const { uidSQL } = res.locals.sqlInfo;

    try {
        if (!orderId || !uidSQL) {
            return next(new ApiError('invalid order id or auth'))
        }

        const result = await GetOrderDetails('users', uidSQL, orderId);

        res.send({ ...result })

    } catch (err) {

    }

})

router.post('/guest', tokenHandler, sqlIdHandler, async (req, res, next) => {
    const { email, firstName, lastName } = req.body;
    const { cartIdSQL } = res.locals.sqlInfo;

    try {
        if (!email || !emailValidate(email) || !firstName || !lastName) {
            return next(new ApiError(500, 'invalid email or name'));
        }

        const { rows, rowCount } = await queryAsync(`SELECT * FROM "spCreateGuestOrder($1,$2,$3,$4)"`, [email, firstName, lastName, cartIdSQL])

        if (rowCount < 1) {
            return next(new ApiError(500, 'invalid guest, no cart to check out'))
        }
        // const queryInfoCreateGuest = queries.CreateNewGuest(email, firstName, lastName);
        // const ResultGuest = await queryAsync(queryInfoCreateGuest.text, queryInfoCreateGuest.values);
        // if (ResultGuest.rowCount < 1) {
        //     return next(new ApiError(500, 'fail to create guest id'))
        // }
        // const guestId = ResultGuest.rows[0].id;

        // const orderId = await CreateNewOrder(guestId, null, cartIdSQL);

        res.send({
            message: "Your order has been placed",
            id: rows[0].pid
        })

    } catch (err) {
        next(err);
    }
})

router.get('/guest/:order_id', async (req, res, next) => {
    const orderId = req.params['order_id'];
    const { email } = req.query;

    try {
        if (!email || !emailValidate(email)) {
            return next(new ApiError(500, 'invalid email'));
        }

        const result = await GetOrderDetails('guests', email, orderId);

        res.send({ ...result })
    } catch (err) {
        next(err);
    }
})

// async function CreateNewOrder(guestId, userId, cartId) {
//     const queryInfoTotal = queries.GetCartTotal('cartId', cartId);
//     const ResultTotal = await queryAsync(queryInfoTotal.text, queryInfoTotal.values);
//     if (ResultTotal.rowCount < 1) {
//         return next(new ApiError(500, 'invalid cart token'))
//     }
//     const { total } = ResultTotal.rows[0];

//     const queryInfoCreateOrder = queries.CreateNewOrder(guestId, userId, cartId, total);
//     const { rows, rowCount } = await queryAsync(queryInfoCreateOrder.text, queryInfoCreateOrder.values);
//     if (rowCount < 1) {
//         return next(new ApiError(500, 'fail to create order'));
//     }

//     const queryInfoOrderItem = queries.AddItemToOrder(rows[0].id, cartId);
//     await queryAsync(queryInfoOrderItem.text, queryInfoOrderItem.values);

//     return rows[0].pid;
// }

async function GetOrderDetails(idType, id, orderId) {
    const queryInfoOrderId = queries.GetOrderId(idType, id);
    const ResultOrderId = await queryAsync(queryInfoOrderId.text, queryInfoOrderId.values);
    if (ResultOrderId.rowCount < 1 || ResultOrderId.rows[0].pid !== orderId) {
        return next(new ApiError(500, 'invalid order Id'));
    }

    const queryInfoOrder = queries.GetOrderDetails(orderId);
    const { rows } = await queryAsync(queryInfoOrder.text, queryInfoOrder.values);

    return rows;
}

module.exports = router;