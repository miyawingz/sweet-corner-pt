DROP VIEW IF EXISTS "cartDetailView";

CREATE VIEW "cartDetailView" AS
SELECT "cartId", 
        (SELECT "userId" FROM "carts" WHERE "cartItems"."cartId"="carts"."id"), 
        (SELECT "pid" FROM "carts" WHERE "cartItems"."cartId"="carts"."id"),
        (
            SELECT json_agg(detailSubQ) AS "items" 
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
                    WHERE c."cartId" ="cartItems"."cartId"
                )detailSubQ
        )
FROM "cartItems" 
GROUP BY "cartId";