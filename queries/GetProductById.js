function GetProductById(id) {
    //use the thumbnailView
    return {
        text: ` SELECT row_to_json(productsSubQ) AS "product"
                FROM ( 
                    SELECT p."pid" AS "id", p."caption", p."cost", p."description", p."name", 0 AS "calories",
                        (SELECT row_to_json(imageSubQ) AS "image"
                            FROM 
                            (SELECT i."pid" AS "id", i."altText", i."file", i."type", 'http://api.sc.lfzprototypes.com/images/full_images/'||i."file" as "url"
                            FROM "images" AS i 
                            WHERE i."productId"=p."id" AND i."type"='full_image') 
                            imageSubQ),
                        (SELECT row_to_json(thumbnailSubQ) AS "thumbnail"
                            FROM 
                            (SELECT i."pid" AS "id", i."altText", i."file", i."type", 'http://api.sc.lfzprototypes.com/images/thumbnails/' || i."file" as "url"
                            FROM "images" AS i 
                            WHERE i."productId"=p."id" AND i."type"='thumbnail') 
                            thumbnailSubQ)
                            FROM "products" AS p
                    WHERE p."pid"=$1
                )productsSubQ`,
        values: [id]
    }

}

module.exports.GetProductById = GetProductById;