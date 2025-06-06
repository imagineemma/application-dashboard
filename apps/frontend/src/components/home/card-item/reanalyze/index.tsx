"use client";

import { Button } from "@heroui/button";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/modal";
import { Radio, RadioGroup } from "@heroui/radio";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AvailableResumeListType } from "backend/types";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { handleApiResponse } from "../../../../lib/api";
import { reanalyzeJobPosting } from "../../../../services/job-posting";

type Props = {
	id: number;
};

const Reanalyze = ({ id }: Props) => {
	const [selected, setSelected] = useState<AvailableResumeListType>("1");
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const queryClient = useQueryClient();

	const { isPending, mutate } = useMutation({
		mutationFn: () =>
			handleApiResponse(
				reanalyzeJobPosting({
					param: { id: id.toString() },
					json: { resumeNumber: selected },
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
			<Button
				variant="flat"
				onPress={onOpen}
				endContent={<Sparkles size={20} />}
			>
				Reanalyze
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Reanalyze this job
							</ModalHeader>
							<ModalBody>
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

export default Reanalyze;
