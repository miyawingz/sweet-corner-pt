function DeleteCart(pid, idType, id) {
    return {
        text: `DELETE FROM "carts"
                WHERE "pid"=$1 AND "${idType}"=$2`,
        values: [pid, id]
    }
}

module.exports.DeleteCart = DeleteCart;