const { emailValidate } = require('../../../lib/userUtils');
const { GetOrderDetails } = require('../../../lib/orderUtils');
const ApiError = require('../../../lib/apiError');

module.exports = async function getGuestOrder(req, res, next) {
    const orderId = req.params['order_id'];
    const { email } = req.query;

    try {
        if (!email || !emailValidate(email)) {
            return next(new ApiError(500, 'invalid email'));
        }

        const result = await GetOrderDetails(orderId, email, 'guests');

        res.send({ ...result })
    } catch (err) {
        next(err);
    }
}