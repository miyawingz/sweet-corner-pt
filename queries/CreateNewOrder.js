function CreateNewOrder(guestId, userId, cartId, total) {
    return {
        text: `INSERT INTO "orders" (
                 "cartId","guestId","userId","statusId","itemCount","total"
                ) VALUES (
                $1,$2,$3,1,$4,$5)
                RETURNING *`,
        values: [cartId, guestId, userId, total.items, total.cost]
    }
}

module.exports.CreateNewOrder = CreateNewOrder;