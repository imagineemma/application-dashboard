"use client";

import { Button } from "@heroui/button";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from "@heroui/modal";

import { CoverLetterForm } from "./form";

type Props = {
	id: number;
	companyName: string;
};

export const CoverLetter = ({ id, companyName }: Props) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<>
			<Button onPress={onOpen}>Cover letter</Button>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				size="5xl"
				isDismissable={false}
			>
				<ModalContent>
					{() => (
						<>
							<ModalHeader>Generate cover letter</ModalHeader>
							<ModalBody>
								<CoverLetterForm id={id} companyName={companyName} />
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
