DROP TABLE IF EXISTS "orderItems";

CREATE TABLE "orderItems"(
    "id" SERIAL,
    "pid" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "productId" INT NOT NULL,
    "orderId" INT NOT NULL,
    "each" INT NOT NULL,
    "quantity" INT NOT NULL,
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now(),
    "deletedAt" timestamptz DEFAULT NULL,
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT,
    FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE
);