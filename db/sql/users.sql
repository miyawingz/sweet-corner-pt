DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
"id" SERIAL,
"pid" uuid NOT NULL DEFAULT uuid_generate_v4(),
"roleId" INT NOT NULL DEFAULT 1,
"firstName" TEXT NOT NULL,
"lastName" TEXT NOT NULL,
"email" TEXT NOT NULL,
"password" TEXT NOT NULL,
"lastAccessedAt" timestamptz NOT NULL DEFAULT now(),
"createdAt" timestamptz NOT NULL DEFAULT now(),
"updatedAt" timestamptz NOT NULL DEFAULT now(),
"deletedAt" timestamptz DEFAULT NULL,
PRIMARY KEY ("email")
);
