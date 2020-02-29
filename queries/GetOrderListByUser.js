function GetOrderListByUser(uid) {
    return {
        text: `SELECT row_to_json(orderSubQ) as "orders" FROM 
                (SELECT "itemCount","total","createdAt","id","status"
                FROM "orderView"
                WHERE "userId"=$1)orderSubQ`,
        values: [uid]
    }
}

module.exports.GetOrderListByUser = GetOrderListByUser;