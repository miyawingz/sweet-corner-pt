function GetOrderDetails(id) {
    return {
        text: ` SELECT "itemCount","total","createdAt","id","status","items" 
                FROM "orderView" 
                WHERE "id"=$1 `,
        values: [id]
    }
}

module.exports.GetOrderDetails = GetOrderDetails;