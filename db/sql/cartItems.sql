DROP TABLE IF EXISTS "cartItems";

CREATE TABLE "cartItems" (
  "id" SERIAL,
  "pid" uuid NOT NULL DEFAULT uuid_generate_v4 (),
  "cartId" int REFERENCES carts(id),
  "productId" int REFERENCES products(id),
  "quantity" int DEFAULT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT NOW(),
  "updatedAt" timestamptz NOT NULL DEFAULT NOW(),
  "deletedAt" timestamptz DEFAULT NULL,
  PRIMARY KEY ("cartId","productId")
);