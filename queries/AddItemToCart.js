function AddItemToCart(cartId, productId, quantity) {
    return {
        text: ` INSERT INTO "cartItems" as c 
                ("cartId", "productId", "quantity")
                values($1, $2, $3)
                on conflict ("cartId","productId") do update
                set "quantity" = c."quantity" + excluded."quantity"
                RETURNING * `,
        values: [cartId, productId, quantity]
    }
}

module.exports.AddItemToCart = AddItemToCart;