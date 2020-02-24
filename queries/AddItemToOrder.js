function AddItemToOrder(orderId, cartId) {
    return {
        text: `
        INSERT INTO "orderItems"
        ("orderId","productId","quantity","each")
        SELECT $1, p."id",c."quantity",p."cost"
        FROM "cartItems" as c JOIN "products" as p
        ON c."productId" = p."id"
        WHERE c."cartId"=$2
        `,
        values: [orderId, cartId]
    }

}

module.exports.AddItemToOrder = AddItemToOrder;
