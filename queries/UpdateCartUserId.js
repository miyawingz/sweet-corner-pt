function UpdateCartUserId(uid, cartId) {
    //updatedAt at now()
    return {
        text: `UPDATE "carts"
        SET "userId" = "users"."id"
        FROM "users"
        WHERE "users"."pid"=$1 and "carts"."pid"=$2`,
        values: [uid, cartId]
    }
}

module.exports.UpdateCartUserId = UpdateCartUserId