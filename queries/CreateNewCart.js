function CreateNewCart(uid) {
    return {
        text: `INSERT INTO "carts" 
            ("statusId","userId","createdAt") 
            VALUES
            (1,$1,now())
            RETURNING "carts"."pid" as "cartId"`,
        values: [uid || null]
    }
}

module.exports.CreateNewCart = CreateNewCart;