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
import { Trash } from "lucide-react";
import { handleApiResponse } from "../../../lib/api";
import { deleteJobPosting } from "../../../services/job-posting";

interface Props {
	id: number;
}

export const DeleteDialog = ({ id }: Props) => {
	const queryClient = useQueryClient();
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

	const { isPending, mutate } = useMutation({
		mutationFn: () =>
			handleApiResponse(deleteJobPosting({ param: { id: id.toString() } })),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["job-postings"] });
			addToast({
				description: "Deleted successfully",
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

	const handleDelete = () => mutate();

	return (
		<>
			<Button color="danger" onPress={onOpen} endContent={<Trash size={20} />}>
				Delete
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Delete this posting
							</ModalHeader>
							<ModalBody>
								Are you sure that you want to delete this posting from your
								list?
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose} isLoading={isPending}>
									Close
								</Button>
								<Button
									color="danger"
									isLoading={isPending}
									onPress={handleDelete}
								>
									Delete
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
