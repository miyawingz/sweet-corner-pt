const queries = require('../../../queries');
const { queryAsync } = require('../../../db');
const { emailValidate } = require('../../../lib/userUtils');
const ApiError = require('../../../lib/apiError');

module.exports = async function createGuestOrder(req, res, next) {
    const { email, firstName, lastName } = req.body;
    const { cartIdSQL } = res.locals.sqlInfo;

    try {
        if (!email || !emailValidate(email) || !firstName || !lastName) {
            return next(new ApiError(500, 'invalid email or name'));
        }

        const { rows, rowCount } = await queryAsync(`SELECT * FROM "spCreateGuestOrder"($1,$2,$3,$4)`, [email, firstName, lastName, cartIdSQL])

        if (rowCount < 1) {
            return next(new ApiError(500, 'invalid guest, no cart to check out'))
        }

        const queryInfoStatus = queries.UpdateCartStatus(cartIdSQL, 3);
        await queryAsync(queryInfoStatus.text, queryInfoStatus.values);

        res.send({
            message: "Your order has been placed",
            id: rows[0].pid
        })

    } catch (err) {
        next(err);
    }
}