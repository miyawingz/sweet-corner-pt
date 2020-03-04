function DeleteItemInCart(itemId, cartId) {
    return {
        text: ` DELETE FROM "cartItems"
                WHERE "pid"=$1 AND "cartId"=$2 `,
        values: [itemId, cartId]
    }
}

module.exports.DeleteItemInCart = DeleteItemInCart;