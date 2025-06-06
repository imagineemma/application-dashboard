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
import { getJobDescription } from "../../../services/job-posting";

type Props = {
	id: number;
};

const JobDescription = ({ id }: Props) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<>
			<Button variant="flat" onPress={onOpen}>
				View job description
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

export default JobDescription;

const Content = ({ id }: Props) => {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["job-postings", "applied", id, "used-resume"],
		queryFn: () =>
			handleApiResponse(getJobDescription({ param: { id: id.toString() } })),
	});

	if (isPending) return <Spinner />;

	if (isError) return <Alert color="danger" title={error.message} />;

	return (
		<p className="max-h-96 overflow-y-auto whitespace-pre-wrap">
			{data.jobDescription}
		</p>
	);
};
