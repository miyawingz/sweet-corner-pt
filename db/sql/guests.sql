DROP TABLE IF EXISTS "guests";

CREATE TABLE "guests" (
    "id" SERIAL,
    "pid" uuid NOT NULL DEFAULT uuid_generate_v4 (),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lastAccessedAt" timestamptz NOT NULL DEFAULT now(),
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now(),
    "deletedAt" timestamptz DEFAULT NULL
);