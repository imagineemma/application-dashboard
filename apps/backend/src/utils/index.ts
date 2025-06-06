import { zValidator as zv } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodSchema } from "zod";

export const zValidator = <
	T extends ZodSchema,
	Target extends keyof ValidationTargets,
>(
	target: Target,
	schema: T,
) =>
	zv(target, schema, (result, c) => {
		if (!result.success) {
			return c.json(
				{
					error: result.error.issues
						.map((issue) => {
							return `Validation error happened at ${issue.path.join(
								" - ",
							)}. cause: ${issue.message}`;
						})
						.join(" | "),
				},
				400,
			);
		}
	});
