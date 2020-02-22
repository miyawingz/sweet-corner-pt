DROP VIEW IF EXISTS "cartTotalView";
CREATE VIEW "cartTotalView" AS 
SELECT "cartItems"."cartId", "carts"."userId",
    (SELECT row_to_json(subQ) AS "total" 
        FROM (
            SELECT SUM(c."quantity"*p."cost") AS "cost", SUM(c."quantity") AS "items"
            FROM "cartItems" AS c JOIN "products" AS p ON c."productId"=p."id" 
            WHERE c."cartId"="cartItems"."cartId"
        )subQ
    )
FROM "cartItems" JOIN "carts" on "cartItems"."cartId"="carts"."id"
GROUP BY "cartItems"."cartId","carts"."userId";