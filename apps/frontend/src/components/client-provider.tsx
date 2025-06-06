"use client";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {
	children: React.ReactNode;
};

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
		},
	},
});

const ClientProvider = ({ children }: Props) => {
	return (
		<QueryClientProvider client={queryClient}>
			<HeroUIProvider>
				<ToastProvider />
				{children}
			</HeroUIProvider>
		</QueryClientProvider>
	);
};

export default ClientProvider;
