function CreateNewCart(uid) {
    return {
        text: `INSERT INTO "carts" 
            ("statusId","userId") 
            VALUES
            (1,$1)
            RETURNING "carts"."pid" as "cartId"`,
        values: [uid || null]
    }
}

module.exports.CreateNewCart = CreateNewCart;