import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import path from "node:path";

export default defineConfig({
	dialect: "sqlite",
	schema: path.join(__dirname, "../../apps/backend/src/database/schema.ts"),
	dbCredentials: {
		url: `file:${path.join(__dirname, "../../database.db")}`,
	},
});
