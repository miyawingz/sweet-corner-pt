DROP VIEW IF EXISTS "itemView";
CREATE VIEW "itemView" AS
SELECT  a."pid" as "itemId",
        (
        SELECT row_to_json(itemSubQ) as "item" 
        From (
            SELECT
            c."updatedAt" AS "added", 
            p."cost" as "each", 
            c."pid" AS "itemId", 
            p."name", 
            p."pid" AS "productId", 
            c."quantity", 
            t."thumbnail", 
            (p."cost" * c."quantity") as "total"
            FROM "cartItems" as c JOIN "products" AS p 
            ON c."productId"=p."id" 
            JOIN "thumbnailView" AS t 
            ON t."productId"=c."productId"
            WHERE c."pid" = a."pid"
            )
            itemSubQ
        ),
        (
        SELECT row_to_json(totalSubQ) as "total" 
        FROM (
            SELECT c."quantity" as "items", 
            (c."quantity"*p."cost") as "cost"
            FROM "cartItems" as C JOIN "products" AS p
            ON c."productId"=p."id"
            WHERE c."pid"=a."pid"
            )
        totalSubQ
        )
FROM "cartItems" as a
GROUP BY a."pid"