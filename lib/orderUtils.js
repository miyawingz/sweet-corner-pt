const queries = require('../queries');
const { queryAsync } = require('../db');
const ApiError = require('./apiError');

async function GetOrderDetails(orderId, id, idType) {
    const queryInfoOrderId = queries.GetOrderId(id, idType);
    const ResultOrderId = await queryAsync(queryInfoOrderId.text, queryInfoOrderId.values);
    if (ResultOrderId.rowCount < 1 || ResultOrderId.rows[0].pid !== orderId) {
        return next(new ApiError(500, 'invalid order Id'));
    }

    const queryInfoOrder = queries.GetOrderDetails(orderId);
    const { rows } = await queryAsync(queryInfoOrder.text, queryInfoOrder.values);

    return rows[0];
}

module.exports.GetOrderDetails = GetOrderDetails;