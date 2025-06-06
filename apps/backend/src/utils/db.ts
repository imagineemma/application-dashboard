import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle("file:../../database.db");
