DROP TABLE IF EXISTS "cartItems";

CREATE TABLE "cartItems" (
  "id" SERIAL,
  "pid" uuid NOT NULL DEFAULT uuid_generate_v4 (),
  "cartId" int NOT NULL,
  "productId" int NOT NULL,
  "quantity" int NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT NOW(),
  "updatedAt" timestamptz NOT NULL DEFAULT NOW(),
  "deletedAt" timestamptz DEFAULT NULL,
  FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "products"("id"),
  PRIMARY KEY ("cartId","productId")
);