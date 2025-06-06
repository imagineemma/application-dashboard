"use client";

import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/modal";
import { Radio, RadioGroup } from "@heroui/radio";
import { Switch } from "@heroui/switch";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AvailableResumeListType } from "backend/types";
import { useState } from "react";
import { handleApiResponse } from "../../../lib/api";
import { markJobPostingAsApplied } from "../../../services/job-posting";

type Props = {
	id: number;
	recruiter: string | null;
};

export const MarkAsApplied = ({ id, recruiter }: Props) => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const queryClient = useQueryClient();

	const [commentValue, setCommentValue] = useState("");
	const [recruiterValue, setRecruiterValue] = useState(recruiter ?? "");
	const [selectedResume, setSelectedResume] =
		useState<AvailableResumeListType>("1");
	const [isCoverLetterUsed, setIsCoverLetterUsed] = useState(true);

	const { isPending, mutate } = useMutation({
		mutationFn: () =>
			handleApiResponse(
				markJobPostingAsApplied({
					param: { id: id.toString() },
					json: {
						applyComment: commentValue,
						isCoverLetterUsed,
						resumeNumber: selectedResume,
						recruiter: recruiterValue,
					},
				}),
			),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["job-postings"],
			});
			addToast({
				description: "Success",
				color: "success",
			});
			onClose();
		},
		onError: (error) => {
			addToast({
				description: error.message,
				color: "danger",
			});
		},
	});

	const handleMarkAsApply = () => mutate();

	return (
		<>
			<Button variant="flat" onPress={onOpen}>
				Mark as applied
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Mark this job as applied
							</ModalHeader>
							<ModalBody className="space-y-4">
								<RadioGroup
									label="Resume used for this application"
									value={selectedResume}
									onValueChange={(value: string) =>
										setSelectedResume(value as AvailableResumeListType)
									}
								>
									<Radio value="1">Resume 1</Radio>
									<Radio value="2">Resume 2</Radio>
									<Radio value="3">Resume 3</Radio>
								</RadioGroup>
								<Switch
									isSelected={isCoverLetterUsed}
									onValueChange={setIsCoverLetterUsed}
								>
									Cover letter is used
								</Switch>
								<Input
									name="recruiter"
									labelPlacement="outside"
									label="HR Person"
									type="text"
									variant="bordered"
									value={recruiterValue}
									onValueChange={setRecruiterValue}
									description="Must be a url"
								/>
								<Textarea
									name="applyComment"
									labelPlacement="outside"
									label="Apply comments"
									type="text"
									variant="bordered"
									value={commentValue}
									onValueChange={setCommentValue}
								/>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									color="primary"
									isLoading={isPending}
									onPress={handleMarkAsApply}
								>
									Confirm
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
