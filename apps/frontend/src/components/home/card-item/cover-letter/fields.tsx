"use client";

import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Radio, RadioGroup } from "@heroui/radio";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import type { AvailableResumeListType } from "backend/types";
import type { InferRequestType } from "hono";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { handleApiResponse } from "../../../../lib/api";
import { getCoverLetterContent } from "../../../../services/cover-letter";

type Props = {
	id: number;
	companyName: string;
};

const Fields = ({ id, companyName }: Props) => {
	const [selected, setSelected] = useState<AvailableResumeListType>("1");
	const [contentValue, setContentValue] = useState({
		additionalInfo: localStorage.getItem("coverLetterAdditionalInfo") ?? "",
	});

	const { mutate, isPending, data } = useMutation({
		mutationFn: async (
			values: InferRequestType<typeof getCoverLetterContent>["json"],
		) => {
			return handleApiResponse(
				getCoverLetterContent({ json: values, param: { id: id.toString() } }),
			);
		},
		onError: (error) => {
			addToast({
				description: error.message,
				color: "danger",
			});
		},
	});

	const handleGenerateCoverLetter = () => {
		mutate({ ...contentValue, resumeNumber: selected });
	};

	return (
		<div className="w-full space-y-10">
			<div className="grid grid-cols-2 gap-4 w-full">
				<Input
					name="companyName"
					label="Company name"
					labelPlacement="outside"
					placeholder="Google"
					defaultValue={companyName}
				/>
				<Textarea
					name="additionalInfo"
					label="Additional information"
					description="You can provide any other information about yourself that is unique"
					labelPlacement="outside"
					placeholder="I have german knowledge of B2..."
					className="col-span-2"
					value={contentValue.additionalInfo}
					onValueChange={(value) => {
						setContentValue((prev) => ({ ...prev, additionalInfo: value }));
					}}
				/>
				<Button
					className="justify-self-start"
					type="button"
					color="primary"
					onPress={() => {
						localStorage.setItem(
							"coverLetterAdditionalInfo",
							contentValue.additionalInfo,
						);
					}}
				>
					Save this info to browser
				</Button>
			</div>
			<RadioGroup
				label="Select target resume"
				value={selected}
				onValueChange={(value: string) =>
					setSelected(value as AvailableResumeListType)
				}
			>
				<Radio value="1">Resume 1</Radio>
				<Radio value="2">Resume 2</Radio>
				<Radio value="3">Resume 3</Radio>
			</RadioGroup>
			<div className="space-y-4">
				{data ? (
					<Textarea
						name="letterContent"
						label="Content"
						labelPlacement="outside"
						placeholder="Cover letter content"
						className="col-span-2"
						defaultValue={data.letterContent}
						isRequired
					/>
				) : null}
				<Button
					type="button"
					color="success"
					isLoading={isPending}
					onPress={handleGenerateCoverLetter}
					endContent={<Sparkles size={20} />}
				>
					{data ? "Generate again" : "Generate content"}
				</Button>
			</div>
		</div>
	);
};

export default Fields;
