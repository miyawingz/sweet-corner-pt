function GetCartTotal(idType, id) {
        return {
            text:  `SELECT "total" 
                    FROM "cartTotalView" 
                    WHERE "${idType}"=$1`,
            values: [id]
        }

    // if (cartId) {
    //     return {
    //         text: `
    //         SELECT (
    //             SELECT "pid" AS "cartId" 
    //             FROM "carts" 
    //             WHERE "pid"=$1)
    //         , "total" 
    //         FROM "cartTotalView" 
    //         WHERE "cartId" IN (
    //             SELECT "id"
    //             FROM "carts"
    //             WHERE "pid"=$1
    //         )`,
    //         values: [cartId]
    //     }
    // }
}

module.exports.GetCartTotal = GetCartTotal;