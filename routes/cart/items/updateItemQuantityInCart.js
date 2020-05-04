const queries = require('../../../queries');
const { queryAsync } = require('../../../db');
const { getItemDetail, deleteItem } = require('../../../lib/cartUtils');
const ApiError = require('../../../lib/apiError');

module.exports = async function UpdateItemQuantityInCart(req, res, next) {
    const quantity = req.body.quantity || 1;
    const { itemId, cartId } = res.locals;
    const { cartIdSQL } = res.locals.sqlInfo;

    try {
        const queryInfo = queries.UpdateItemInCart(quantity, itemId, cartIdSQL);
        const { rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
        if (rowCount < 1) {
            return next(new ApiError(500, 'item not in cart'));
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

        if (quantity > 0) {
            res.send({
                cartId,
                item,
                message: `Added ${quantity} ${item.name} cupcakes to cart`,
                total
            })
            return;
        } else {
            res.send({
                cartId,
                item,
                message: `Removed ${quantity * -1} ${item.name} cupcakes from cart`,
                total
            })
            return;
        }

    } catch (err) {
        next(err);
    }
}