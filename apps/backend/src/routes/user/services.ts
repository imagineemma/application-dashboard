import { userTable } from "../../database/schema";
import { db } from "../../utils/db";
import type { UpdateUserRequestType } from "./validators";

export const selectUser = async () => {
	return db
		.select()
		.from(userTable)
		.then((rows) => rows.at(0));
};

export const updateUser = (payload: UpdateUserRequestType) => {
	return db
		.insert(userTable)
		.values(payload)
		.onConflictDoUpdate({ set: payload, target: userTable.email });
};
