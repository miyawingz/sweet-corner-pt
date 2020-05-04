const queries = require('../../queries');
const { queryAsync } = require('../../db');
const { GetOrderDetails } = require('../../lib/orderUtils');
const ApiError = require('../../lib/apiError');

module.exports = async function getOrder(req, res, next) {
    const orderId = req.params['order_id'];
    const { uidSQL } = res.locals.sqlInfo;

    try {
        if (!orderId || !uidSQL) {
            return next(new ApiError(500, 'invalid order id or user auth'));
        }

        if (orderId && uidSQL) {
            const result = await GetOrderDetails(orderId, uidSQL, 'users');

            res.send({ ...result });
            return;
        }

        if (!orderId && uidSQL) {
            const queryInfo = queries.GetOrderListByUser(uidSQL);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount < 1) {
                return next(new ApiError(500, 'fail to obtian order list'))
            }
            res.send(rows[0]);
            return;
        }

    } catch (err) {
        next(err);
    }
}