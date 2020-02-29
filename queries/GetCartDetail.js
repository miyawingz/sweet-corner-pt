function GetCartDetail(idType, id) {
    return {
        text: `
                SELECT cd."pid" as "cartId", cd."items", ct."total" 
                FROM "cartDetailView" as cd JOIN "cartTotalView" as ct
                USING ("cartId")
                WHERE cd."${idType}"=$1    
            `,
        values: [id]
    }
}

module.exports.GetCartDetail = GetCartDetail;