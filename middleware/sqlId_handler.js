const queries = require('../queries');
const { queryAsync } = require('../db');
const ApiError = require('../lib/apiError');

async function sqlIdHandler(req, res, next) {
    const { uid, cartId } = res.locals;
    const productId = req.params['product_Id'];

    try {
        if (uid) {
            const queryInfo = queries.GetIdInSQL("uid", "users", uid);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount > 0) {
                res.locals.sqlInfo.uid = rows[0].uid
            } else {
                return next(new ApiError(500, 'invalid auth token, user does not exist'))
            }
        }

        if (cartId) {
            const queryInfo = queries.GetIdInSQL("cartId", "carts", cartId);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount > 0) {
                res.locals.sqlInfo.uid = rows[0].cartId
            } else {
                return next(new ApiError(500, 'invalid cart token, cart does not exist'))
            }
        }

        if (productId) {
            const queryInfo = queries.GetIdInSQL("productId", "products", productId);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount > 0) {
                res.locals.sqlInfo.productId = rows[0].productId
            } else {
                return next(new ApiError(500, 'product does not exist'))
            }
        }

        next();

    } catch (err) {
        next(err)
    }
}

module.exports.sqlIdHandler = sqlIdHandler;