function UpdateItemInCart(quantity, itemId, cartId) {
    return {
        text: `
        UPDATE "cartItems"
        SET "quantity"="quantity" + $1, "updatedAt"=now()
        WHERE "pid"=$2 AND "cartId"=$3
        `,
        values: [quantity, itemId, cartId]
    }
}

module.exports.UpdateItemInCart = UpdateItemInCart;