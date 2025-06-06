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
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono";

import { handleApiResponse } from "../../../../lib/api";
import { updateApplicationStatus } from "../../../../services/job-posting";

type ActionProps = {
	label: string;
	payloadKey: keyof InferRequestType<typeof updateApplicationStatus>["json"];
	color: "success" | "danger";
};

type Props = {
	id: number;
	primaryAction: ActionProps;
	secondaryAction: ActionProps;
};

const UpdateStatusModal = ({ id, primaryAction, secondaryAction }: Props) => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: (
			data: InferRequestType<typeof updateApplicationStatus>["json"],
		) =>
			handleApiResponse(
				updateApplicationStatus({
					param: { id: id.toString() },
					json: data,
				}),
			),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["job-postings"],
			});
			onClose();
			addToast({
				description: "Success",
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

	const handleClick = (key: ActionProps["payloadKey"]) => {
		mutate({ [key]: new Date().toISOString() });
	};

	return (
		<>
			<Button onPress={onOpen} size="sm" color="primary" className="block">
				Update status
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Any update on the application?
							</ModalHeader>
							<ModalBody>
								You can choose any options below and update your application
								status. These actions are not reversible
							</ModalBody>
							<ModalFooter>
								<Button
									variant="light"
									onPress={onClose}
									isDisabled={isPending}
								>
									Close
								</Button>
								<Button
									color={primaryAction.color}
									onPress={() => handleClick(primaryAction.payloadKey)}
									isLoading={isPending}
								>
									{primaryAction.label}
								</Button>
								<Button
									color={secondaryAction.color}
									onPress={() => handleClick(secondaryAction.payloadKey)}
									isLoading={isPending}
								>
									{secondaryAction.label}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateStatusModal;
