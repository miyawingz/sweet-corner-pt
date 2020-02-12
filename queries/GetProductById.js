function GetProductById(id) {
    return {
        text:`select row_to_json(productsSubQ) as "product"
                from ( 
                    select p."pid" as "id", p."caption", p."cost", p."description", p."name", 0 as "calories",
                        (select row_to_json(imageSubQ) as "image"
                            from 
                            (select i."pid" as "id", i."altText", i."file", i."type", 'http://api.sc.lfzprototypes.com/images/full_images/'||i."file" as "url"
                            from "images" as i 
                            where i."productId"=p."id" and i."type"='full_image') 
                            imageSubQ),
                        (select row_to_json(thumbnailSubQ) as "thumbnail"
                            from 
                            (select i."pid" as "id", i."altText", i."file", i."type", 'http://api.sc.lfzprototypes.com/images/thumbnails/' || i."file" as "url"
                            from "images" as i 
                            where i."productId"=p."id" and i."type"='thumbnail') 
                            thumbnailSubQ)
                    from "products" as p
                    where p."pid"=$1
                )productsSubQ`,
        values:[id]
    }

}

module.exports.GetProductById = GetProductById;