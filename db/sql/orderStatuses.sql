DROP TABLE IF EXISTS "orderStatuses";

CREATE TABLE "orderStatuses"(
    "id" SERIAL,
    "mid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT NULL,
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now(),
    "deletedAt" timestamptz DEFAULT NULL,
    PRIMARY KEY ("id") 
);

INSERT INTO "orderStatuses" ("description", "id", "mid", "name") VALUES
('Order created but not submitted', 1, 'new', 'New'),
('Order placed, pending processing from store', 2, 'pending', 'Pending'),
('Order is on hold', 3, 'hold', 'On Hold'),
('Order has been shipped to customer', 4, 'shipped', 'Shipped'),
('Order has been canceled', 5, 'canceled', 'Canceled'),
('Order is complete', 6, 'complete', 'Complete');