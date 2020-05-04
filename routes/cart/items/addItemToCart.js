const queries = require('../../../queries');
const { queryAsync } = require('../../../db');
const ApiError = require('../../../lib/apiError');

module.exports = async function (req, res, next) {
    const { cartId, cartToken } = res.locals.cartInfo;
    const { productIdSQL, cartIdSQL } = res.locals.sqlInfo;
    const quantity = req.body.quantity || 1;

    try {
        const queryInfoAdd = queries.AddItemToCart(cartIdSQL, productIdSQL, quantity);
        const AddResult = await queryAsync(queryInfoAdd.text, queryInfoAdd.values);
        if (AddResult.rowCount < 1) {
            return next(new ApiError(500, 'fail to add item to cart'))
        }

        const queryInfoStatus = queries.UpdateCartStatus(cartIdSQL, 2);
        await queryAsync(queryInfoStatus.text, queryInfoStatus.values);

        const itemResult = await queryAsync(`select "item","total" from "itemView" where "itemId"=$1`, [AddResult.rows[0].pid])
        const data = itemResult.rows[0]

        res.send({
            cartId,
            cartToken,
            item: data.item,
            message: `${data.item.quantity} ${data.item.name} cupcakes added to cart`,
            total: data.total
        })
        return;

    } catch (err) {
        next(err);
    }
}