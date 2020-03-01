function DeleteCart(pid, idType, id) {
    // make idType the third, group arguments first, and set idType last, bc idType can be default, but never the pid and id
    return {
        text: `DELETE FROM "carts"
                WHERE "pid"=$1 AND "${idType}"=$2`,
        values: [pid, id]
    }
}

module.exports.DeleteCart = DeleteCart;