function GetCartIdByUser(uid, statusId) {
    // can default statusId to 2
    return {
        text: `SELECT "id", "pid" as "cartId" 
                FROM "carts" 
                WHERE "userId"=$1 AND "statusId"<=$2
                ORDER BY "statusId" desc`,
        values: [uid, statusId]
    }
}

module.exports.GetCartIdByUser = GetCartIdByUser;