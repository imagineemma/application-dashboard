"use client";

import { Alert } from "@heroui/alert";
import { Spinner } from "@heroui/spinner";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { handleApiResponse } from "../../lib/api";
import { getUserProfile } from "../../services/user";
import { useUserStore } from "../../stores/user-store";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const { setUser, setIsLoaded } = useUserStore();

	const { data, isPending, isError, error, isSuccess } = useQuery({
		queryKey: ["user-profile"],
		queryFn: () => handleApiResponse(getUserProfile()),
	});

	useEffect(() => {
		if (isSuccess) {
			setUser(data);
			setIsLoaded(true);
		}
	}, [isSuccess, data, setUser, setIsLoaded]);

	if (isPending) return <Spinner />;

	if (isError) return <Alert color="danger" title={error.message} />;

	return <>{children}</>;
};

export default UserProvider;
