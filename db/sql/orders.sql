DROP TABLE IF EXISTS "orders";

CREATE TABLE "orders"(
    "id" SERIAL,
    "pid" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "cartId" INT NOT NULL,
    "guestId" INT DEFAULT NULL,
    "userId" INT DEFAULT NULL,
    "statusId" INT NOT NULL,
    "itemCount" INT NOT NULL,
    "total" INT NOT NULL,
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now(),
    "deletedAt" timestamptz DEFAULT NULL,
    FOREIGN KEY ("cartId") REFERENCES "carts"("id"),
    FOREIGN KEY ("statusId") REFERENCES "orderStatuses"("id"),
    PRIMARY KEY ("id")
);