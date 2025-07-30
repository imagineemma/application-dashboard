import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// Get the project root directory (four levels up from dist)
const projectRoot = path.join(__dirname, "../../../../");
const dbPath = path.join(projectRoot, "database.db");
export const db = drizzle(createClient({ url: `file:${dbPath}` }));
