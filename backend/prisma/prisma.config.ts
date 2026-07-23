import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("postgresql://postgres:postgrespassword@localhost:5432/sscatfacts_db?schema=public"),
  },
});
