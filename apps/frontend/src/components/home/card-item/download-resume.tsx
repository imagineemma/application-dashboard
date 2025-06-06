"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { handleBlobResponse } from "../../../lib/api";
import { downloadResume } from "../../../services/job-posting";

type Props = {
	title: string;
};

const DownloadResume = ({ title }: Props) => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const queryClient = useQueryClient();

	const [titleValue, setTitleValue] = useState(title);

	const { isPending, mutate } = useMutation({
		mutationFn: () =>
			handleBlobResponse(
				downloadResume({
					json: {
						title: titleValue,
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
				Download resume
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Download resume with proper title
							</ModalHeader>
							<ModalBody className="space-y-4">
								<Input
									name="title"
									labelPlacement="outside"
									label="Title"
									type="text"
									variant="bordered"
									value={titleValue}
									onValueChange={setTitleValue}
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
									Download
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default DownloadResume;
