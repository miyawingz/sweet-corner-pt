const { tokenEncode } = require('../lib/jwtHandler');
const { queryAsync } = require('../db');
const queries = require('../queries');

async function cartAuth(req, res, next) {
    // const { token, uid } = res.locals;
    const { uidSQL } = res.locals.sqlInfo;
    let cartId = res.locals.cartId;

    try {
        // if (!token) {
        //     // create new cart w/o uid
        //     const queryInfo = queries.CreateNewCart();
        //     const { rows } = await queryAsync(queryInfo.text, queryInfo.values);
        //     cartId = rows[0].cartId;
        //     res.locals.sqlInfo.cartIdSQL = rows[0].id;
        // }

        if (!cartId) {
            // get cart by uid, if no cart, then create cart w/ uid
            // const queryInfo = queries.GetCartIdByUser(uidSQL, 2);
            // const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);

            // if (rowCount > 0) {
            //     cartId = rows[0].cartId;
            //     res.locals.sqlInfo.cartIdSQL = rows[0].id;
            // } else {
                //bc if not uidSQL it will just be null, same as above
            const queryInfo = queries.CreateNewCart(uidSQL);
            const { rows } = await queryAsync(queryInfo.text, queryInfo.values);
            cartId = rows[0].cartId;
            res.locals.sqlInfo.cartIdSQL = rows[0].id;
            // }
        }

        res.locals.cartInfo = { cartId, cartToken: tokenEncode({ cartId }) };
        next();

    } catch (error) {
        next(error)
    }
}

module.exports.cartAuth = cartAuth;