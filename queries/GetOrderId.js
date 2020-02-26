function GetOrderId(idType, id) {
    if (idType == "users") {
        return {
            text: `SELECT "orders"."pid", "orders"."id" 
                    FROM "orders" JOIN "users"
                    ON "orders"."userId" = "users"."id"
                    WHERE "orders"."statusId"=1 AND "users"."id"=$1`,
            values: [id]
        }
    }

    if (idType == "guests") {
        return {
            text: `SELECT "orders"."pid", "orders"."id" 
                    FROM "orders" JOIN "guests"
                    ON "orders"."guestId" = "guests"."id"
                    WHERE "orders"."statusId"=1 AND "guests"."email"=$1`,
            values: [value]
        }
    }
}

module.exports.GetOrderId = GetOrderId;