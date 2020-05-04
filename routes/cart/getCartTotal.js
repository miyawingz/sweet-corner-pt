const queries = require('../../queries');
const { queryAsync } = require('../../db');

module.exports = async function getCartTotal(req, res, next) {
    const { cartIdSQL, uidSQL } = res.locals.sqlInfo;

    try {
        if (uidSQL || cartIdSQL) {
            const sqlInfo = uidSQL ? { value: uidSQL, type: "userId" } : { value: cartIdSQL, type: "cartId" }
            const queryInfo = queries.GetCartTotal(sqlInfo.value, sqlInfo.type);
            const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
            if (rowCount > 0) {
                //destruct into variables so it is easier to read
                res.send({ ...rows[0] });
                return;
            }
        }

        res.send({
            "cartId": null,
            "message": "No active cart",
            "total": 0
        })

    } catch (err) {
        next(err)
    }
}