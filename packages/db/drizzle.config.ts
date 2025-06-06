import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
	dialect: "sqlite",
	schema: "../../apps/backend/src/database/schema.ts",
	dbCredentials: {
		url: "file:../../database.db",
	},
});
