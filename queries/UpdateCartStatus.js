function UpdateCartStatus(cartId, statusId) {
    return {
        text: `UPDATE "carts" SET "statusId"=$1 where "id"=$2 `,
        values: [statusId, cartId]
    }
}

module.exports.UpdateCartStatus = UpdateCartStatus