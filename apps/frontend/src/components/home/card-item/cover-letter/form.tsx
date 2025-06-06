"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import type { InferRequestType } from "hono";
import { useState } from "react";
import { z } from "zod";

import { handleBlobResponse } from "../../../../lib/api";
import { downloadCoverLetter } from "../../../../services/cover-letter";
import Fields from "./fields";

const formSchema = z.object({
	letterContent: z.string().trim().min(100),
	additionalInfo: z.string().trim().max(1000),
	companyName: z.string().min(1),
});

type Props = {
	id: number;
	companyName: string;
};

export const CoverLetterForm = ({ id, companyName }: Props) => {
	const [errors, setErrors] = useState({});

	const { mutate: download, isPending: isDownloadPending } = useMutation({
		mutationFn: async (
			values: InferRequestType<typeof downloadCoverLetter>["json"],
		) => {
			return handleBlobResponse(
				downloadCoverLetter({ json: values, param: { id: id.toString() } }),
			);
		},
		onError: (error) => {
			addToast({
				description: error.message,
				color: "danger",
			});
		},
		onSuccess: () => {
			addToast({
				description: "Cover letter downloaded successfully",
				color: "success",
			});
		},
	});

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = Object.fromEntries(new FormData(e.currentTarget));

		if (!data.letterContent) {
			return addToast({
				description: "You forgot to generate content",
				color: "warning",
			});
		}

		const parseResult = formSchema.safeParse(data);

		if (!parseResult.success) {
			setErrors(parseResult.error.flatten().fieldErrors);
			return;
		}

		download(parseResult.data);
	};

	return (
		<Form validationErrors={errors} onSubmit={onSubmit}>
			<Fields id={id} companyName={companyName} />
			<div className="space-x-2 py-2 ml-auto">
				<Button type="submit" color="primary" isLoading={isDownloadPending}>
					Download pdf
				</Button>
			</div>
		</Form>
	);
};
