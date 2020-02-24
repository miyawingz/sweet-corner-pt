DROP VIEW IF EXISTS "orderView";
CREATE VIEW "orderView" AS
SELECT "itemCount","total","createdAt","pid" as "id"
FROM "orders"