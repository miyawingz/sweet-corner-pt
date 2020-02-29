DROP VIEW IF EXISTS "orderView";

CREATE VIEW "orderView" AS 
SELECT "userId", "itemCount", "total", "createdAt", "pid" as "id", 
    (
        SELECT "mid" 
        FROM "orderStatuses" as os 
        WHERE os."id"=o."statusId"
    ) as "status",
    (
        SELECT json_agg(itemSubQ) as "items" 
        FROM (
                SELECT "each", "quantity", ("each"*"quantity") as "total","pid" as "id",
                (
                    SELECT row_to_json(productSubQ) as "product" 
                    FROM (
                            SELECT p."name",p."pid" as "id", t."thumbnail"
                            FROM "products" as p JOIN "thumbnailView" as t ON p."id"=t."productId"
                            WHERE p."id"=oi."productId"
                        )productSubQ
                )
                FROM "orderItems" as oi 
                WHERE oi."orderId"=o."id"
            )itemSubQ
    )
FROM "orders" as o;