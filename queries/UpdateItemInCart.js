function UpdateItemInCart(itemId, quantity) {
    return {
        text: `
        UPDATE "cartItems"
        SET "quantity" = "quantity"+$1
        WHERE "itemId" = $2
        RETURNING  
        `,
        values: [quantity, itemId]
    }
}

module.exports.UpdateItemInCart = UpdateItemInCart;