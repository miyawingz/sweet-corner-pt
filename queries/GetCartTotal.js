function GetCartTotal(idType, id) {
    //switch idType and id order
        return {
            text:  `SELECT "total" 
                    FROM "cartTotalView" 
                    WHERE "${idType}"=$1`,
            values: [id]
        }
}

module.exports.GetCartTotal = GetCartTotal;