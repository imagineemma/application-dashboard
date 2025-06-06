"use client";

import { Navbar } from "./navbar";
import ProfileGuard from "./profile-guard";
import UserProvider from "./user-provider";

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
	return (
		<div>
			<div className="sticky top-0 z-50 bg-background">
				<div className="container">
					<Navbar />
				</div>
			</div>
			<div className="container">
				<main className="flex-grow h-full py-8">
					<UserProvider>
						<ProfileGuard>{children}</ProfileGuard>
					</UserProvider>
				</main>
			</div>
		</div>
	);
};
