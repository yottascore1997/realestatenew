import { execSync } from "node:child_process";

if (process.env.DATABASE_URL?.trim()) {
  console.log("DATABASE_URL set — pushing Prisma schema to database...");
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    stdio: "inherit",
    env: process.env,
  });
} else {
  console.log("DATABASE_URL not set — skipping prisma db push");
}
