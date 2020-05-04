const { deleteCart } = require('../../lib/cartUtils');
const ApiError = require('../../lib/apiError');

module.exports = async function (req, res, next) {
    const { cartIdSQL, uidSQL } = res.locals.sqlInfo;
    let cartId;

    try {
        if (req.params['cart_id']) {
            cartId = req.params['cart_id'];
            if (!uidSQL) {
                return next(new ApiError(500, 'not authorizied to delete cart'));
            }

            const result = await deleteCart(cartId, uidSQL, "userId");
            if (result) {
                res.send({
                    message: "cart deleted",
                    deletedId: cartId
                })
            }
            return;
        }

        if (res.locals.cartId) {
            cartId = res.locals.cartId;
            if (!cartIdSQL) {
                return next(new ApiError(500, 'invalid cart'));
            }

            const result = await deleteCart(cartId, cartIdSQL, "id");
            if (result) {
                res.send({
                    message: "cart deleted",
                    deletedId: cartId
                })
            }
            return;
        }

        return next(new ApiError(500, 'invalid cart to delete'));

    } catch (err) {
        next(err);
    }
}