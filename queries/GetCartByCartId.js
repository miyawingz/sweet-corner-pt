function GetCartByCartId(cartId) {
    return {
        text:`
        SELECT row_to_json(subQ) AS "data" FROM 
        (
            SELECT 
            (SELECT json_agg(detailSubQ) AS "items" 
                FROM (
                    SELECT c."updatedAt" AS "added", p."cost" AS "each", c."pid" AS "itemId", p."name", 
                        (
                            SELECT "pid" AS "productId" 
                            FROM "products" 
                            WHERE "id"=c."productId"
                        ),
                        c."quantity",
                        (
                            SELECT "thumbnail" 
                            FROM "thumbnailView" 
                            WHERE "productId"=c."productId"
                        ),
                        (p."cost"*c."quantity") AS "total"
                    FROM "cartItems" AS c JOIN "products" AS p ON c."productId"=p."id" 
                    WHERE c."cartId" IN (
                        SELECT "carts"."id" 
                        FROM "carts" WHERE "carts"."pid"=$1
                        )
                )detailSubQ
            ),(
                SELECT "total" 
                FROM "cartTotalView" 
                WHERE "cartId" IN (
                    SELECT "carts"."id" 
                    FROM "carts" 
                    WHERE "carts"."pid"=$1
                    )
                )
            FROM "cartItems" 
            WHERE "cartId" IN (
                SELECT "carts"."id" 
                FROM "carts" 
                WHERE "carts"."pid"=$1
            ) 
            GROUP BY "cartId"
        )subQ`,
        values: [cartId]
    }
}

module.exports.GetCartByCartId = GetCartByCartId;