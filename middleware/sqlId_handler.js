const queries = require('../queries');
const { queryAsync } = require('../db');
const ApiError = require('../lib/apiError');

async function sqlIdHandler(req, res, next) {
    const { uid, cartId } = res.locals;
    const productId = req.params['product_id'];
    const itemId = req.params['item_id'];
    res.locals.sqlInfo = {};

    try {
        //     //set the cart token before this handler, including getting cartId from user
        //     //so you wont really need the uid section of this
        //     //adding another middleware to get user's cart and check is active cart,
        //     //overall to just take care of cart
        //     if (!cartId) {
        //         const queryInfoCart = queries.GetCartIdByUser(rows[0].id, 2);
        //         const ResultCart = await queryAsync(queryInfoCart.text, queryInfoCart.values);
        //         if (ResultCart.rowCount > 0) {
        //             res.locals.sqlInfo.cartIdSQL = ResultCart.rows[0].id;
        //             res.locals.cartId = ResultCart.rows[0].cartId;
        //         }
        //     }
        // 

        const ids = [
            { id: uid, table: 'users', idType: 'uid' },
            { id: cartId, table: 'carts', idType: 'cartId' },
            { id: productId, table: 'products', idType: 'productId' },
            { id: itemId, table: 'cartItems', idType: 'itemId' }
        ]

        for (let i = 0; i < ids.length; i++) {
            let id = ids[i];
            if (id.id) {
                const queryInfo = queries.GetIdInSQL(id.id, id.table);
                const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);

                if (rowCount < 1) {
                    return next(new ApiError(500, `invalid id for ${id.table}`))
                };

                res.locals[`${id.idType}`] = id.id;
                res.locals.sqlInfo[`${id.idType}SQL`] = rows[0].id;
            }
        }

        next();

    } catch (err) {
        next(err)
    }
}

module.exports.sqlIdHandler = sqlIdHandler;