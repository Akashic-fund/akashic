UPDATE "User" SET "roles" = Array['user'] WHERE "roles" IS NULL OR "roles" = '{}';
