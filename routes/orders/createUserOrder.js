const queries = require('../../queries');
const { queryAsync } = require('../../db');
const ApiError = require('../../lib/apiError');

module.exports = async function createUserOrder(req, res, next) {
    const { uidSQL, cartIdSQL } = res.locals.sqlInfo;
    try {
        if (!uidSQL || !cartIdSQL) {
            return next(new ApiError(500, 'invalid auth, no cart to check out'));
        }

        const { rows, rowCount } = await queryAsync(`SELECT * FROM "spCreateUserOrder"($1,$2)`, [uidSQL, cartIdSQL]);
        if (rowCount < 1) {
            return next(new ApiError(500, 'invalid auth, no cart to check out'));
        }

        const queryInfoStatus = queries.UpdateCartStatus(cartIdSQL, 3);
        await queryAsync(queryInfoStatus.text, queryInfoStatus.values);

        res.send({
            message: "Your order has been placed",
            id: rows[0].pid
        })

    } catch (err) {
        next(err)
    }
}