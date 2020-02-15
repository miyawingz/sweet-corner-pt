function GetCartByUser(uid) {
    return {
        text: `select "pid" as "cartId" from "carts" where "userId"=$1 and "statusId"<3 order by "statusId" DESC`,
        values: [uid]
    }
}

module.exports.GetCartByUser = GetCartByUser;