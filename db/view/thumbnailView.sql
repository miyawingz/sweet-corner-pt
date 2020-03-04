DROP VIEW IF EXISTS "thumbnailView";

CREATE VIEW "thumbnailView" AS
SELECT "productId",
       (SELECT row_to_json(subQ)
        FROM  (
           SELECT "altText", 'http://api.sc.lfzprototypes.com/images/thumbnails/'|| "file" as "url"
           FROM   "images"
           WHERE  "productId" = i."productId" and "type"='thumbnail'
           ) subQ
       ) AS "thumbnail"
FROM "images" as i
WHERE i."type"='thumbnail';
