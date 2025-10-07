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
	return db.transaction(async (tx) => {
		await tx.delete(userTable);
		await tx.insert(userTable).values(payload);
	});
};
