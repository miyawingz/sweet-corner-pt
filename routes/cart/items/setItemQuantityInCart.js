const queries = require('../../../queries');
const { queryAsync } = require('../../../db');
const { getItemDetail, deleteItem } = require('../../../lib/cartUtils');
const ApiError = require('../../../lib/apiError');

module.exports = async function SetItemQuantityInCart(req, res, next) {
    const { cartIdSQL } = res.locals.sqlInfo;
    const { itemId, cartId } = res.locals;
    const quantity = req.body.quantity || 1;

    try {
        const queryInfo = queries.SetItemQuantityInCart(quantity, itemId, cartIdSQL);
        const { rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
        if (rowCount < 1) {
            return next(new ApiError(500, 'item is not in cart'))
        }

        const { item, total } = await getItemDetail(itemId);
        if (item.quantity < 1) {
            await deleteItem(itemId, cartIdSQL);
            res.send({
                cartId,
                message: `removed all ${item.name} from cart`
            })
            return;
        }

        res.send({
            cartId,
            item,
            message: `Set ${item.name} cupcakes quantity to ${quantity}`,
            total
        })

    } catch (err) {
        next(err);
    }
}