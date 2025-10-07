import { eq } from "drizzle-orm";
import { userTable } from "../../database/schema";
import { db } from "../../utils/db";
import type { UpdateUserRequestType } from "./validators";

export const selectUser = async () => {
	return db
		.select()
		.from(userTable)
		.then((rows) => rows.at(0));
};

export const updateUser = async (payload: UpdateUserRequestType) => {
	const existing = await db
		.select()
		.from(userTable)
		.then((rows) => rows.at(0));

	if (!existing) {
		// No user yet → just insert
		return db.insert(userTable).values(payload);
	}
	// Update the existing single user safely
	return db
		.update(userTable)
		.set(payload)
		.where(eq(userTable.email, existing.email));
};
