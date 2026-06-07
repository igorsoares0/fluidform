import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 moved the connection URL out of schema.prisma. Migration and
// introspection commands read it from here; the runtime client uses the
// driver adapter in lib/prisma.ts. The Prisma CLI loads .env automatically.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
