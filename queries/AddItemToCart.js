function AddItemToCart(cartId, productId, quantity) {
    return {
        text: 
        `WITH inserted AS 
            (INSERT INTO "cartItems" as c 
                ("cartId", "productId", "quantity")
                values( 
                    (select "carts"."id" 
                    from "carts" 
                    where "carts"."pid"=$1),
                    (select "products"."id"
                    from "products" where "products"."pid"=$2),
                    $3)
            on conflict ("cartId","productId") do update
            set "quantity" = c."quantity" + excluded."quantity"
            RETURNING *)
        SELECT row_to_json(subQ) as "data" from 
        (select
            (
                select row_to_json(itemSubQ) as "item" 
                from (
                select i."createdAt" as "added", p."cost" as "each", i."pid" as "itemId", p."name", p."pid" as "productId", $3 as "quantity", 
                    (
                        select "thumbnail" 
                        from "thumbnailView" 
                        where "productId"=i."productId"
                    ),
                    ($3*p."cost") as "total"
                from inserted as i join "products" as p on i."productId"=p."id"
                )itemSubQ
            ),
            (
                select row_to_json(totalSubQ) as "total"
                from (
                    select (p."cost"*i."quantity") as "cost", i."quantity" as "items"
                    from inserted as i join "products" as p on i."productId"=p."id"
                )totalSubQ
            )
        from inserted
        )subQ`,
        values: [cartId, productId, quantity]
    }
}

module.exports.AddItemToCart = AddItemToCart;
