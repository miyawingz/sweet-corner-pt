function UpdateCartStatus(cartId, statusId) {
    return {
        text: `UPDATE "carts" SET "statusId"=$1 where "pid"=$2 `,
        values: [statusId, cartId]
    }
}

module.exports.UpdateCartStatus = UpdateCartStatus