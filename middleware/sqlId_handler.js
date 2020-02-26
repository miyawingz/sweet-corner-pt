const queries = require('../queries');
const { queryAsync } = require('../db');
const ApiError = require('../lib/apiError');

async function sqlIdHandler(req, res, next) {
    const { uid, cartId } = res.locals;
    // const cartId = res.locals.cartInfo ? res.locals.cartInfo.cartId : res.locals.cartId;
    const productId = req.params['product_id'];
    const itemId = req.params['item_id'];
    res.locals.sqlInfo = {};

    try {
        if (uid) {
            const queryInfo = queries.GetIdInSQL('users', uid);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount < 1) {
                return next(new ApiError(500, 'invalid auth token, user does not exist'));
            }
            res.locals.sqlInfo.uidSQL = rows[0].id;

            if (!cartId) {
                const queryInfo = queries.GetCartIdByUser(rows[0].id, 2);
                const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
                if (rowCount > 0) {
                    res.locals.sqlInfo.cartIdSQL = rows[0].id;
                    res.locals.cartId = rows[0].cartId;
                }
            }
        }

        if (!uid && cartId) {
            const queryInfo = queries.GetIdInSQL('carts', cartId);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount < 1) {
                return next(new ApiError(500, 'invalid cart token, cart does not exist'));
            }
            res.locals.sqlInfo.cartIdSQL = rows[0].id;
        }

        if (productId) {
            res.locals.productId = productId;
            const queryInfo = queries.GetIdInSQL('products', productId);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount < 1) {
                return next(new ApiError(500, 'product does not exist'));
            }
            res.locals.sqlInfo.productIdSQL = rows[0].id;
        }

        if (itemId) {
            res.locals.itemId = itemId;
        }

        next();

    } catch (err) {
        next(err)
    }
}

module.exports.sqlIdHandler = sqlIdHandler;