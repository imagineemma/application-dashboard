import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Navbar } from "../components/layout/navbar";
import ProfileGuard from "../components/layout/profile-guard";
import UserProvider from "../components/layout/user-provider";

export const Route = createRootRoute({
	component: () => {
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
							<ProfileGuard>
								<Outlet />
							</ProfileGuard>
						</UserProvider>
					</main>
				</div>
			</div>
		);
	},
});
