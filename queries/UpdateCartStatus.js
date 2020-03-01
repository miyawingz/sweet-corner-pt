function UpdateCartStatus(cartId, statusId) {
    return {
        text: `UPDATE "carts" SET "statusId"=$1 where "id"=$2 `,
        values: [statusId, cartId]
    }
}

// ResultCurrentCart.rows.map(x => x.id)
// where "id" in (${cartId}.join(","))

module.exports.UpdateCartStatus = UpdateCartStatus