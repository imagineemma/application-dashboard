"use client";

import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { useQuery } from "@tanstack/react-query";

import { handleApiResponse } from "../../../lib/api";
import { getUsedCoverLetter } from "../../../services/job-posting";

type Props = {
	id: number;
};

const UsedCoverLetter = ({ id }: Props) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<>
			<Button variant="flat" onPress={onOpen}>
				View used cover letter
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader />
							<ModalBody>
								<Content id={id} />
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose}>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default UsedCoverLetter;

const Content = ({ id }: Props) => {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["job-postings", "applied", id, "used-resume"],
		queryFn: () =>
			handleApiResponse(getUsedCoverLetter({ param: { id: id.toString() } })),
	});

	if (isPending) return <Spinner />;

	if (isError) return <Alert color="danger" title={error.message} />;

	return (
		<p className="max-h-96 overflow-y-auto whitespace-pre-wrap">
			{data.usedCoverLetterContent
				? data.usedCoverLetterContent
				: "No cover letter content found for this job"}
		</p>
	);
};
