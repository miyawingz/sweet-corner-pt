const { getItemDetail, deleteItem } = require('../../../lib/cartUtils');
const ApiError = require('../../../lib/apiError');

module.exports = async function DeleteItemInCart(req, res, next) {
    const { itemId, cartId } = res.locals;
    const { cartIdSQL } = res.locals.sqlInfo;

    try {
        const result = await getItemDetail(itemId);
        if (!result) {
            return next(new ApiError(500, 'item not in cart'));
        }

        const { rowCount } = await deleteItem(itemId, cartIdSQL);
        if (rowCount < 1) {
            return next(new ApiError(500, 'fail to remove item from cart'));
        }

        res.send({
            cartId,
            message: `removed all ${result.item.name} from cart`,
        })

    } catch (err) {
        next(err);
    }
}