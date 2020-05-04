const queries = require('../../queries');
const { queryAsync } = require('../../db');

module.exports = async function getCart(req, res, next) {
    const { cartIdSQL, uidSQL } = res.locals.sqlInfo;
    try {
        if (cartIdSQL || uidSQL) {
            const sqlInfo = uidSQL ? { value: uidSQL, type: "userId" } : { value: cartIdSQL, type: "cartId" }
            const queryInfo = queries.GetCartDetail(sqlInfo.value, sqlInfo.type);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount > 0) {
                //destruct into variables so it is easier to read
                res.send({ ...rows[0] })
                return;
            }
        }

        res.send({
            "cartId": null,
            "message": "No active cart",
            "total": 0
        });

    } catch (err) {
        next(err);
    }
}