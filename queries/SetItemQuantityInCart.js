function SetItemQuantityInCart(quantity, itemId, cartId) {
    return {
        text:   `UPDATE "cartItems"
                SET "quantity"=$1
                WHERE "pid"=$2 AND "cartId"=$3`,
        values: [quantity, itemId, cartId]
    }
}

module.exports.SetItemQuantityInCart = SetItemQuantityInCart;