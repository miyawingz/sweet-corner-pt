drop function if exists "spCreateGuestOrder";

create or replace function "spCreateGuestOrder" (userEmail TEXT, firstName TEXT, lastName TEXT, cartId INT)
returns (pid uuid)
language plpgsql
AS $$
DECLARE
    guestId INT;
    items INT;
    cost INT;
    orderId INT;
BEGIN
    INSERT INTO "guests" 
        ("firstName", "lastName", "email")
        VALUES (firstName, lastName, userEmail);
    guestId:=(SELECT g."id" FROM "guests" as g WHERE g."email"=userEmail);
    SELECT ct."items", ct."cost" INTO items, cost 
        FROM "cartTotalView" AS ct 
        WHERE ct."cartId"=cartId
    INSERT INTO "orders" 
        ("cartId", "guestId", "statusId","itemCount","total")
        VALUES (cartId, guestId, 2, items, cost);
    orderId:=(SELECT o."id" FROM "orders" as o WHERE o."cartId"=cartId AND o."guestId"=guestId);
    INSERT INTO "orderItems" 
        ("orderId","productId","quantity","each")
            SELECT orderId, p."id",c."quantity",p."cost"
            FROM "cartItems" as c JOIN "products" as p
            ON c."productId" = p."id"
            WHERE c."cartId"=cartId;
RETURN QUERY SELECT o."pid" FROM "orders" as o WHERE o."cartId"=cartId AND o."guestId"=guestId;
END;
$$;