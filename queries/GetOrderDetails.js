function GetOrderDetails(id) {
    return {
        text: `SELECT * FROM "orderView" WHERE "id"=$1`,
        values: [id]
    }
}

module.exports.GetOrderDetails = GetOrderDetails;