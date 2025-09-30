import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { InferRequestType } from "hono";
import { useState } from "react";
import { z } from "zod";
import { handleApiResponse } from "../lib/api";
import { createJobPosting } from "../services/job-posting";

export const Route = createFileRoute("/custom-post")({
	component: CustomPostPage,
});

function CustomPostPage() {
	const [errors, setErrors] = useState({});

	const queryClient = useQueryClient();

	const { isPending, mutate } = useMutation({
		mutationFn: (values: InferRequestType<typeof createJobPosting>["json"]) =>
			handleApiResponse(createJobPosting({ json: values })),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["job-postings"] });
			addToast({
				description: "Job posting is created successfully",
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
					name="title"
					labelPlacement="outside"
					label="Position title"
					placeholder="Frontend Developer"
					type="text"
					isRequired
				/>
				<Input
					name="companyName"
					labelPlacement="outside"
					label="Company"
					placeholder="Amazon"
					type="text"
					isRequired
				/>
				<Input
					name="url"
					labelPlacement="outside"
					label="Posting URL"
					placeholder="https://www.linkedin.com/jobs/view/4194050724"
					type="url"
					isRequired
				/>
				<Input
					name="companyUrl"
					labelPlacement="outside"
					label="Company URL"
					type="text"
					placeholder="www.amazon.com"
					description="This field can be either company's linkedin page or website"
				/>
				<Input
					name="location"
					labelPlacement="outside"
					label="Location"
					placeholder="Country, City"
					type="text"
				/>
				<Input
					name="platform"
					labelPlacement="outside"
					label="Job platform"
					placeholder="Linkedin"
					type="text"
			
				/>
				<Input
					name="recruiter"
					labelPlacement="outside"
					label="Recruiter"
					placeholder="recruiter@gmail.com"
					type="text"
					description="This field can be either recruiter's email or linkedin address"
				/>
				<Textarea
					className="col-span-2"
					name="jobDescription"
					labelPlacement="outside"
					label="Job description"
					type="text"
					isRequired
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
}

const formSchema = z.object({
	companyName: z.string(),
	companyUrl: z.string().trim().optional(),
	location: z.string(),
	title: z.string(),
	jobDescription: z.string().min(100).max(9999),
	platform: z.string(),
	url: z.string().url(),
	recruiter: z.string().optional(),
});
