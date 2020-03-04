function GetAllProducts() {
                            // update to use thumbnaiLvIEW

    return {
        text: ` SELECT json_agg(productsSubQuery) AS "products"
                FROM (
                SELECT p."pid" AS "id", p."caption", p."cost", p."name", 0 AS "calories",
                    (SELECT row_to_json(imagesSubQuery) AS "thumbnail" 
                        FROM (
                                SELECT i."pid" as "id", i."altText", i."type", i."file", 'http://api.sc.lfzprototypes.com/images/thumbnails/' || i."file" as "url"
                                FROM "images" as i 
                                WHERE i."productId"=p."id" AND i."type"='thumbnail'
                                ) imagesSubQuery 
                    ) 
                FROM "products" AS p
                ) productsSubQuery `,
        values: ''
    }
}

module.exports.GetAllProducts = GetAllProducts;