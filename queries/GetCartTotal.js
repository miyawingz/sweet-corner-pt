function GetCartTotal(uid, cartId) {
    if (uid) {
        return {
            text: `
            SELECT (
                SELECT "pid" AS "cartId" 
                FROM "carts" 
                WHERE "userId" IN (
                    SELECT "id"
                    FROM "users"
                    WHERE "pid"=$1
                ) AND "statusId"=2
            ), 
            "total" 
            FROM "cartTotalView" 
            WHERE "userId" IN (
                SELECT "id"
                FROM "users"
                WHERE "pid"=$1
            )`,
            values: [uid]
        }
    }

    if (cartId) {
        return {
            text: `
            SELECT (
                SELECT "pid" AS "cartId" 
                FROM "carts" 
                WHERE "pid"=$1)
            , "total" 
            FROM "cartTotalView" 
            WHERE "cartId" IN (
                SELECT "id"
                FROM "carts"
                WHERE "pid"=$1
            )`,
            values: [cartId]
        }
    }
}

module.exports.GetCartTotal = GetCartTotal;