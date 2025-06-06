import { Alert } from "@heroui/alert";
import { useLocation } from "@tanstack/react-router";
import { incompleteProfileMessage } from "../../data/constants";
import { useUserStore } from "../../stores/user-store";

const ProfileGuard = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation();
	const { user } = useUserStore();

	if (location.pathname !== "/profile" && !user.email)
		return <Alert color="warning" title={incompleteProfileMessage} />;

	return <>{children}</>;
};

export default ProfileGuard;
