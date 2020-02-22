function GetCartDetail(idType, id) {
    return {
        text: `
                SELECT "pid" as "cartId", "items", "total" 
                FROM "cartDetailView" JOIN "cartTotalView"
                USING ("cartId")
                WHERE "cartDetailView"."${idType}"=$1    
            `,
        values: [id]
    }
}

module.exports.GetCartDetail = GetCartDetail;