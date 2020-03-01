function GetAllProducts() {
                            // update to use thumbnaiLvIEW

    return {
        text: `select json_agg(productsSubQuery) as "products"
                from (
                select p."pid" as "id", p."caption", p."cost", p."name", 0 as "calories",
                    (select row_to_json(imagesSubQuery) as "thumbnail" 
                        from (
                                select i."pid" as "id", i."altText", i."type", i."file", 'http://api.sc.lfzprototypes.com/images/thumbnails/' || i."file" as "url"
                                from "images" as i 
                                where i."productId"=p."id" and i."type"='thumbnail'
                                ) imagesSubQuery 
                    ) 
                from "products" as p
                ) productsSubQuery`,
        values: ''
    }
}

module.exports.GetAllProducts = GetAllProducts;