function AddItemToCart(cartId, productId, quantity) {
    return {
        text: `INSERT INTO "cartItems" as c
            ("pid", "productId", "quantity")
            VALUES
            ($1, $2, $3)
            on conflict ("pid","productId") do update
            set "quantity" = c."quantity" + excluded."quantity"
            RETURNING "pid" as "cartId", "createdAt" as "added", "productId", "quantity"`, 
        values: [cartId, productId, quantity]
    }
}

module.exports.AddItemToCart = AddItemToCart;
