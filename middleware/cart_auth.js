const { tokenEncode } = require('../lib/jwtHandler');
const { queryAsync } = require('../db');
const queries = require('../queries');

async function cartAuth(req, res, next) {
    const { token, uid } = res.locals;
    let cartId = res.locals.cartId;
    const uidSQL = res.locals.sqlInfo.uid;

    try {
        if (!token) {
            // create new cart w/o uid
            const queryInfo = queries.CreateNewCart();
            const { rows } = await queryAsync(queryInfo.text, queryInfo.values);
            cartId = rows[0].cartId;
            res.locals.sqlInfo.cartId = rows[0].cartIdSQL;
        }

        if (!cartId && uid) {
            // get cart by uid, if no cart, then create cart w/ uid
            const queryInfo = queries.GetCartByUser(uid);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);

            if (rowCount > 0) {
                cartId = rows[0].data.cartId;
            } else {
                const queryInfo = queries.CreateNewCart(uidSQL);
                const { rows } = await queryAsync(queryInfo.text, queryInfo.values);
                cartId = rows[0].cartId;
            }
        }

        res.locals.cartInfo = { cartId, cartToken: tokenEncode({ cartId }) }

        next();

    } catch (error) {
        next(error)
    }
}

module.exports.cartAuth = cartAuth;