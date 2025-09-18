"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Link } from "@heroui/link";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono";
import { useState } from "react";
import { z } from "zod";

import type { UserType } from "backend/types";
import { handleApiResponse } from "../../lib/api";
import { updateUser } from "../../services/user";

type Props = {
	user: UserType;
};

const formSchema = z.object({
	email: z.string().email(),
	name: z.string().min(1),
	resumeContent1: z.string().min(1500).max(10000),
	resumeContent2: z.string().max(10000).or(z.literal("")),
	resumeContent3: z.string().max(10000).or(z.literal("")),
	geminiKey: z.string().min(10),
	coverLetterPrompt: z.string().min(100),
	coverLetterGoogleDocId: z.string(),
	resumeGoogleDocId: z.string(),
	googleApiCredential: z.string(),
});

export const UpdateUserForm = ({ user }: Props) => {
	const queryClient = useQueryClient();

	const [errors, setErrors] = useState({});

	const { isPending, mutate } = useMutation({
		mutationFn: (values: InferRequestType<typeof updateUser>["json"]) =>
			handleApiResponse(updateUser({ json: values })),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-profile"] });
			addToast({
				description: "Your data is successfully updated",
				color: "success",
			});
		},
		onError: (error) => {
			addToast({
				description: error.message,
				color: "danger",
			});
		},
	});

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = Object.fromEntries(new FormData(e.currentTarget));
		const parseResult = formSchema.safeParse(data);

		if (!parseResult.success) {
			setErrors(parseResult.error.flatten().fieldErrors);
			return;
		}

		mutate(parseResult.data);
	};

	return (
		<Form className="mt-16" validationErrors={errors} onSubmit={onSubmit}>
			<div className="grid grid-cols-2 gap-4 w-full">
				<Input
					name="email"
					defaultValue={user.email}
					labelPlacement="outside"
					label="Email"
					placeholder="farhad@gmail.com"
					type="text"
					isRequired
					variant="bordered"
				/>
				<Input
					name="name"
					defaultValue={user?.name}
					labelPlacement="outside"
					label="Full name"
					placeholder="Farhad Faraji"
					type="text"
					isRequired
					variant="bordered"
				/>
				<Input
					name="geminiKey"
					defaultValue={user?.geminiKey || ""}
					labelPlacement="outside"
					description={
						<>
							In order to use AI for analyzing the job description, you have to
							get a Gemini api key from{" "}
							<Link href="https://aistudio.google.com/" size="sm">
								Google
							</Link>
						</>
					}
					label="Gemini api key"
					type="text"
					isRequired
					variant="bordered"
				/>
				<Textarea
					className="col-span-2"
					name="resumeContent1"
					defaultValue={user?.resumeContent1 || ""}
					labelPlacement="outside"
					label="Resume content"
					placeholder="Your resume content between 1500 to 10000 characters"
					type="text"
					isRequired
					variant="bordered"
				/>
				<Textarea
					className="col-span-2"
					name="resumeContent2"
					defaultValue={user?.resumeContent2 || ""}
					labelPlacement="outside"
					label="Resume content"
					placeholder="Your resume content between 1500 to 10000 characters"
					type="text"
					variant="bordered"
				/>
				<Textarea
					className="col-span-2"
					name="resumeContent3"
					defaultValue={user?.resumeContent3 || ""}
					labelPlacement="outside"
					label="Resume content"
					placeholder="Your resume content between 1500 to 10000 characters"
					type="text"
					variant="bordered"
				/>
				<Textarea
					className="col-span-2"
					name="coverLetterPrompt"
					defaultValue={user?.coverLetterPrompt || ""}
					labelPlacement="outside"
					label="Cover letter prompt"
					placeholder="You are a cover letter expert..."
					type="text"
					variant="bordered"
				/>
				<Input
					name="coverLetterGoogleDocId"
					defaultValue={user?.coverLetterGoogleDocId || ""}
					labelPlacement="outside"
					label="Cover Letter Google Doc Id"
					type="text"
					variant="bordered"
				/>
				<Input
					name="resumeGoogleDocId"
					defaultValue={user?.resumeGoogleDocId || ""}
					labelPlacement="outside"
					label="Resume Google Doc Id"
					type="text"
					variant="bordered"
				/>
				<Textarea
					className="col-span-2"
					name="googleApiCredential"
					defaultValue={user?.googleApiCredential || ""}
					labelPlacement="outside"
					label="Google API Json Credential"
					type="text"
					variant="bordered"
				/>
			</div>
			<Button
				color="primary"
				type="submit"
				isLoading={isPending}
				className="mt-4"
			>
				Save
			</Button>
		</Form>
	);
};
