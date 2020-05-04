const queries = require('../queries');
const { queryAsync } = require('../db');
const ApiError = require('./apiError');

async function getItemDetail(itemId) {
    try {
        const { rows } = await queryAsync(`SELECT "item","total" from "itemView" where "itemId"=$1`, [itemId])
        return rows[0];
    } catch (err) {
        return err;
    }
}

async function deleteItem(itemId, cartIdSQL) {
    try {
        const queryInfo = queries.DeleteItemInCart(itemId, cartIdSQL);
        const result = await queryAsync(queryInfo.text, queryInfo.values);
        return result;
    } catch (err) {
        return err;
    }
}

async function deleteCart(cartId, idSQL, idType) {
    try {
        const queryInfo = queries.DeleteCart(cartId, idSQL, idType);
        const { rowCount } = await queryAsync(queryInfo.text, queryInfo.values);

        if (rowCount < 1) {
            return next(new ApiError(500, 'failed to delete cart'));
        }

        return true;
    } catch (err) {
        return err;
    }
}

module.exports.getItemDetail = getItemDetail;
module.exports.deleteItem = deleteItem;
module.exports.deleteCart = deleteCart;