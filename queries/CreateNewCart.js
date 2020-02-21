function CreateNewCart(uid) {
    return {
        text: `INSERT INTO "carts" 
            ("statusId","userId","createdAt") 
            VALUES
            (1,$1,now())
            RETURNING "carts"."pid" as "cartId", "carts"."id" as "cartIdSQL"`,
        values: [uid || null]
    }
}

module.exports.CreateNewCart = CreateNewCart;