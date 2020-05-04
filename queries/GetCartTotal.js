function GetCartTotal(id, idType) {
    return {
        text: ` SELECT "total" 
                FROM "cartTotalView" 
                WHERE "${idType}"=$1`,
        values: [id]
    }
}

module.exports.GetCartTotal = GetCartTotal;