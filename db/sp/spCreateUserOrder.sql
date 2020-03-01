drop function if exists "spCreateUserOrder";

create or replace function "spCreateUserOrder" (uid INT, cartId INT)
returns table (pid uuid)
language plpgsql
AS $$
DECLARE
    items INT;
    cost INT;
    orderId INT;
BEGIN
    SELECT ct."items", ct."cost" INTO items, cost 
        FROM "cartTotalView" AS ct 
        WHERE ct."cartId"=cartId
    -- items:=(SELECT ct."items" FROM "cartTotalView" AS ct WHERE ct."cartId"=cartId);
    -- cost:=(SELECT ct."cost" FROM "cartTotalView" AS ct WHERE ct."cartId"=cartId);
    INSERT INTO "orders" 
        ("cartId", "userId", "statusId","itemCount","total")
        VALUES (cartId, uid, 2, items, cost);
    orderId:=(SELECT o."id" FROM "orders" as o WHERE o."cartId"=cartId AND o."userId"=uid);
    INSERT INTO "orderItems" 
        ("orderId","productId","quantity","each")
            SELECT orderId, p."id",c."quantity",p."cost"
            FROM "cartItems" as c JOIN "products" as p
            ON c."productId" = p."id"
            WHERE c."cartId"=cartId;
RETURN QUERY SELECT o."pid" FROM "orders" as o WHERE o."cartId"=cartId AND o."userId"=uid;
END;
$$;
