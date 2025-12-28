import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DIRECT_URL"],
    // In Prisma 7, this is the correct place for it
  },
});
