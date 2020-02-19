function GetIdInSQL(idName, tableName, id) {
    return {
        text: `SELECT "id" as ${idName} FROM ${tableName} WHERE "pid"=$1`,
        values: [id]
    }
    // if (uid) {
    //     return {
    //         text: `SELECT "id" as "uid" FROM "users" WHERE "pid"=$1`,
    //         values: [id]
    //     }
    // }

    // if (cartId) {
    //     return {
    //         text: `SELECT "id" as "cartId" FROM "carts" WHERE "pid"=$1`,
    //         values: [cartId]
    //     }
    // }

    // if (productId) {
    //     return {
    //         text: `SELECT "id" as "productId" FROM "products" WHERE "pid"=$1`,
    //         values: [productId]
    //     }
    // }
}

module.exports.GetIdInSQL = GetIdInSQL;