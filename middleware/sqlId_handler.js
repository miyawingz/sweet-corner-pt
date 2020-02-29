const queries = require('../queries');
const { queryAsync } = require('../db');
const ApiError = require('../lib/apiError');

async function sqlIdHandler(req, res, next) {
    const { uid, cartId } = res.locals;
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
                const queryInfoCart = queries.GetCartIdByUser(rows[0].id, 2);
                const ResultCart = await queryAsync(queryInfoCart.text, queryInfoCart.values);
                if (ResultCart.rowCount > 0) {
                    res.locals.sqlInfo.cartIdSQL = ResultCart.rows[0].id;
                    res.locals.cartId = ResultCart.rows[0].cartId;
                }
            }
        }

        if (cartId) {
            const queryInfo = queries.GetIdInSQL('carts', cartId);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount < 1) {
                return next(new ApiError(500, 'invalid cart token, active cart does not exist'));
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
            const queryInfo = queries.GetIdInSQL('cartItems', itemId);
            const { rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount < 1) {
                return next(new ApiError(500, 'cart item does not exist'));
            }
            res.locals.itemId = itemId;
        }

        next();

    } catch (err) {
        next(err)
    }
}

module.exports.sqlIdHandler = sqlIdHandler;