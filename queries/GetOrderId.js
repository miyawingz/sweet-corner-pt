function GetOrderId(value, type) {
    if (type == 'users') {
        return {
            text: ` SELECT "orders"."pid", "orders"."id" 
                    FROM "orders" JOIN "users"
                    ON "orders"."userId" = "users"."id"
                    WHERE "orders"."statusId"=2 AND "users"."id"=$1`,
            values: [value]
        }
    }

    if (type == 'guests') {
        return {
            text: ` SELECT "orders"."pid", "orders"."id" 
                    FROM "orders" JOIN "guests"
                    ON "orders"."guestId" = "guests"."id"
                    WHERE "orders"."statusId"=2 AND "guests"."email"=$1`,
            values: [value]
        }
    }
}

module.exports.GetOrderId = GetOrderId;